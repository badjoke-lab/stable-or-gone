import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';
import { evidenceAliasIds } from '../config/evidence-source-identities.mjs';

const root = process.cwd();
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const rows = (value, file) => {
  const result = Array.isArray(value) ? value : value?.records ?? value?.evidence ?? value?.items;
  if (!Array.isArray(result)) throw new Error(`${file}: invalid rows`);
  return result;
};
const text = (...values) => values.filter(Boolean).join(' ').toLowerCase();

function loadCurrentEvidence() {
  const baseline = loadRegistryV2Baseline(root);
  const map = new Map();
  for (const file of baseline.data_groups?.evidence ?? []) {
    for (const row of rows(readJson(file), file)) map.set(row.id, { ...row, __source_file: file });
  }
  return [...map.values()].sort((a, b) => a.id.localeCompare(b.id));
}

function classify(row) {
  const value = text(row.source_type, row.title, row.publisher, row.url, ...(row.claim_scopes ?? []));
  if (/regulat|court|legal|terms|enforcement|attorney general|cftc|sec\b|government|legislation/.test(value)) {
    return { rank: 1, bucket: 'regulator_court_legal' };
  }
  if (/issuer|protocol|official|product|documentation|docs\.|governance|foundation|stablecoin page|app interface/.test(value)) {
    return { rank: 2, bucket: 'official_issuer_protocol_product' };
  }
  if (/reserve|attestation|assurance|audit|transparency|composition/.test(value)) {
    return { rank: 3, bucket: 'reserve_attestation_audit' };
  }
  if (/reuters|bloomberg|coindesk|the block|research|analysis|reporting|news/.test(value)) {
    return { rank: 4, bucket: 'high_quality_reporting_research' };
  }
  return { rank: 5, bucket: 'other_reviewed_source' };
}

export function buildBatch2ArchiveCandidates() {
  const authority = readJson('config/evidence-archive-payload-verification-batch-2-review-authority.json');
  const batch1 = readJson('config/evidence-archive-payload-verification-batch-1.json');
  const historyManifest = readJson('docs/migration/evidence-archive-review-history-manifest-v6-pr402.json');
  const historyAudit = readJson('docs/migration/evidence-archive-review-history-audit-v6-pr402.json');
  const checkpoint = readJson('docs/migration/current-canonical-checkpoint.json');

  const batch1Ids = new Set(batch1.target_evidence_ids ?? []);
  const authorityExcluded = [...(authority.review_lane?.batch_1_reviewed_evidence_ids ?? [])].sort();
  if (JSON.stringify([...batch1Ids].sort()) !== JSON.stringify(authorityExcluded)) {
    throw new Error('Batch 1 exclusion set differs from merged Batch 2 authority');
  }

  const evidence = loadCurrentEvidence();
  if (evidence.length !== authority.entry_canonical_checkpoint.evidence) {
    throw new Error(`Expected ${authority.entry_canonical_checkpoint.evidence} Evidence rows, found ${evidence.length}`);
  }
  const archiveNotRecorded = evidence.filter((row) => !String(row.archived_url ?? '').trim());
  if (archiveNotRecorded.length !== authority.entry_canonical_checkpoint.archive_not_recorded) {
    throw new Error(`Expected ${authority.entry_canonical_checkpoint.archive_not_recorded} unarchived rows, found ${archiveNotRecorded.length}`);
  }
  if (checkpoint.evidence_quality.archive_not_recorded_count !== archiveNotRecorded.length) {
    throw new Error('Current canonical checkpoint archive-not-recorded count differs from loaded Evidence');
  }

  const historyById = new Map((historyManifest.effective_evidence_identities ?? []).map((row) => [row.evidence_id, row]));
  const suppressed = new Set(historyAudit.reviewed_unresolved?.suppressed_evidence_ids ?? []);
  const reactivated = new Set(historyAudit.reviewed_unresolved?.reactivated_eligible_evidence_ids ?? []);

  const exclusions = {
    alias_identity: [],
    web_archive_source_url: [],
    reviewed_suppressed_without_signal: [],
    missing_source_url: [],
    batch_1_reviewed: []
  };
  const eligible = [];

  for (const row of archiveNotRecorded) {
    if (!row.id) continue;
    if (!String(row.url ?? '').trim()) {
      exclusions.missing_source_url.push(row.id);
      continue;
    }
    if (evidenceAliasIds.has(row.id)) {
      exclusions.alias_identity.push(row.id);
      continue;
    }
    if (String(row.url).startsWith('https://web.archive.org/')) {
      exclusions.web_archive_source_url.push(row.id);
      continue;
    }
    if (batch1Ids.has(row.id)) {
      exclusions.batch_1_reviewed.push(row.id);
      continue;
    }
    const history = historyById.get(row.id) ?? null;
    if (suppressed.has(row.id)) {
      exclusions.reviewed_suppressed_without_signal.push(row.id);
      continue;
    }
    const isReactivated = reactivated.has(row.id);
    if (history && history.candidate_eligible_under_contract === false && !isReactivated) {
      throw new Error(`${row.id}: history-reviewed identity is neither suppressed nor eligible`);
    }
    const priority = classify(row);
    eligible.push({ row, priority, history, reactivated: isReactivated, selectionTier: isReactivated ? 0 : 1 });
  }

  for (const values of Object.values(exclusions)) values.sort();
  eligible.sort((a, b) => a.selectionTier - b.selectionTier
    || a.priority.rank - b.priority.rank
    || a.row.id.localeCompare(b.row.id));

  const selected = eligible.slice(0, authority.review_lane.target_count).map(({ row, priority, history, reactivated: isReactivated, selectionTier }) => ({
    evidence_id: row.id,
    source_file: row.__source_file,
    selection_tier: selectionTier,
    priority_rank: priority.rank,
    priority_bucket: priority.bucket,
    title: row.title ?? null,
    publisher: row.publisher ?? null,
    source_type: row.source_type ?? null,
    url: row.url,
    published_at: row.published_at ?? null,
    stablecoin_ids: [...(row.stablecoin_ids ?? [])].sort(),
    organization_ids: [...(row.organization_ids ?? [])].sort(),
    event_ids: [...(row.event_ids ?? [])].sort(),
    claim_scopes: [...(row.claim_scopes ?? [])].sort(),
    review_history_found: history != null,
    reactivation_signal_present: isReactivated,
    review_status: 'pending_manual_payload_review',
    canonical_change_authorized: false
  }));

  if (selected.length !== authority.review_lane.target_count) {
    throw new Error(`Expected ${authority.review_lane.target_count} selected candidates, found ${selected.length}`);
  }
  if (selected.some((row) => batch1Ids.has(row.evidence_id))) throw new Error('Batch 1 identity leaked into Batch 2 selection');

  return {
    schema_version: '1.0',
    artifact_id: 'sog_evidence_archive_payload_verification_batch_2_candidates_2026_08_09',
    status: 'generated_internal_review_candidates',
    public_output: false,
    canonical_change_authorized: false,
    authority_id: authority.authority_id,
    selection_mode: authority.review_lane.selection_mode,
    queue_v7_priority_mode: authority.review_lane.queue_v7_priority_mode,
    priority_order: authority.review_lane.priority_order,
    canonical_evidence_count: evidence.length,
    archive_not_recorded_count: archiveNotRecorded.length,
    exclusion_counts: Object.fromEntries(Object.entries(exclusions).map(([key, values]) => [key, values.length])),
    exclusions,
    eligible_pool_count: eligible.length,
    selected_count: selected.length,
    selected_evidence_ids: selected.map((row) => row.evidence_id),
    selected_candidates: selected,
    next_boundary: 'MANUAL_PAYLOAD_REVIEW'
  };
}

const isCli = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isCli) console.log(JSON.stringify(buildBatch2ArchiveCandidates(), null, 2));
