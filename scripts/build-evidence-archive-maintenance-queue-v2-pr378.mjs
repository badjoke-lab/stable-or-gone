import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';
import { evidenceAliasIds } from '../config/evidence-source-identities.mjs';

const root = process.cwd();
const paths = {
  config: 'config/evidence-archive-maintenance-queue-v2-pr378.json',
  checkpoint: 'docs/migration/current-canonical-checkpoint.json',
  contract: 'config/evidence-archive-review-history-v1-pr377.json',
  historyManifest: 'docs/migration/evidence-archive-review-history-manifest-pr377.json',
  historyAudit: 'docs/migration/evidence-archive-review-history-audit-pr377.json',
  authority: 'docs/migration/post-pr375-review-gate-pr376.json',
  priorQueue: 'docs/migration/evidence-archive-maintenance-queue-pr365.json'
};
const outputPaths = {
  queue: 'docs/migration/evidence-archive-maintenance-queue-v2-pr378.json',
  delta: 'docs/migration/evidence-archive-maintenance-queue-v2-pr378-delta.json'
};
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const serialize = (value) => `${JSON.stringify(value, null, 2)}\n`;
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');
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
  return [...map.values()].sort((left, right) => left.id.localeCompare(right.id));
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

export function buildEvidenceArchiveMaintenanceQueueV2Outputs() {
  const configText = readText(paths.config);
  const config = JSON.parse(configText);
  const checkpoint = readJson(paths.checkpoint);
  const contract = readJson(paths.contract);
  const historyManifest = readJson(paths.historyManifest);
  const historyAudit = readJson(paths.historyAudit);
  const authority = readJson(paths.authority);
  const priorQueue = readJson(paths.priorQueue);

  if (authority.decisions?.evidence_archive_maintenance_queue_v2_refresh?.pr !== 378) {
    throw new Error('PR #376 does not authorize PR #378');
  }
  if (historyAudit.decision?.next_work_item !== 'PR #378 Evidence Archive Maintenance Queue v2 Refresh') {
    throw new Error('PR #377 audit does not hand off to PR #378');
  }
  if (contract.contract_id !== config.expected.review_history_contract_id) {
    throw new Error(`Unexpected archive review-history contract ${contract.contract_id}`);
  }
  if (historyManifest.manifest_id !== config.expected.review_history_manifest_id) {
    throw new Error(`Unexpected archive review-history manifest ${historyManifest.manifest_id}`);
  }

  const evidence = loadCurrentEvidence();
  const historyById = new Map(historyManifest.effective_evidence_identities.map((row) => [row.evidence_id, row]));
  const suppressedHistoryIds = new Set(historyAudit.reviewed_unresolved_archive_gaps.evidence_ids);
  const reactivatedIds = new Set();

  const archiveNotRecorded = evidence.filter((row) => !String(row.archived_url ?? '').trim());
  const exclusions = {
    alias_identity: [],
    web_archive_source_url: [],
    reviewed_suppressed_without_signal: [],
    missing_source_url: []
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
    const history = historyById.get(row.id) ?? null;
    if (suppressedHistoryIds.has(row.id) && !reactivatedIds.has(row.id)) {
      exclusions.reviewed_suppressed_without_signal.push(row.id);
      continue;
    }
    const priority = classify(row);
    eligible.push({ row, priority, history });
  }

  for (const values of Object.values(exclusions)) values.sort();
  eligible.sort((left, right) => left.priority.rank - right.priority.rank || left.row.id.localeCompare(right.row.id));
  const selected = eligible.slice(0, config.selection.maximum_selected_count);
  if (selected.length !== config.expected.selected_count) {
    throw new Error(`expected ${config.expected.selected_count} selected candidates, found ${selected.length}`);
  }

  const sourceDigest = sha256(Object.values(paths).map((file) => `${file}\0${readText(file)}`).join('\0'));
  const generationDigest = sha256(JSON.stringify({
    config: sha256(configText),
    checkpoint: checkpoint.checkpoint_id,
    contract: contract.contract_id,
    historyManifest: historyManifest.manifest_digest_sha256,
    exclusions,
    selected: selected.map(({ row, priority }) => [row.id, priority.rank, priority.bucket]),
    sourceDigest
  }));

  const selectedCandidates = selected.map(({ row, priority, history }) => ({
    evidence_id: row.id,
    source_file: row.__source_file,
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
    effective_review_outcome: history?.effective_review_outcome ?? null,
    eligibility_state: history?.eligibility_state_without_signal ?? 'eligible_unreviewed_archive_gap',
    reactivation_signal_present: reactivatedIds.has(row.id),
    review_reasons: ['archive_not_recorded', priority.bucket, history ? 'history_reviewed_eligible' : 'history_unreviewed'],
    review_status: 'pending_manual_review',
    canonical_change_authorized: false
  }));

  const queue = {
    schema_version: '2.0',
    queue_id: 'sog_evidence_archive_maintenance_queue_v2_pr378',
    status: 'reviewed_internal_non_ranking_history_aware_queue',
    public_output: false,
    evidence_rank: false,
    single_composite_score: false,
    review_pr: 378,
    reviewed_at: config.reviewed_at,
    source_checkpoint_id: checkpoint.checkpoint_id,
    review_history_contract_id: contract.contract_id,
    review_history_manifest_id: historyManifest.manifest_id,
    review_history_audit_id: historyAudit.audit_id,
    selection_rule: config.selection.mode,
    source_identity_scope: 'canonical_identities_only',
    canonical_evidence_count: evidence.length,
    archive_index_count: checkpoint.evidence_quality.archive_index_count,
    archive_not_recorded_count: archiveNotRecorded.length,
    reviewed_unresolved_suppressed_count: exclusions.reviewed_suppressed_without_signal.length,
    reactivated_reviewed_identity_count: reactivatedIds.size,
    eligible_pool_count: eligible.length,
    selected_count: selectedCandidates.length,
    maximum_selected_count: config.selection.maximum_selected_count,
    priority_order: config.selection.priority_order,
    selected_candidates: selectedCandidates,
    selection_boundary: {
      canonical_change_authorized: false,
      manual_review_required: true,
      exact_source_capture_required: true,
      replacement_requires_reviewed_claim_scope_equivalence: true,
      public_surface_allowed: false,
      batch_3_authorized: false,
      review_gate_required: true
    },
    source_digest_sha256: sourceDigest,
    generation_digest_sha256: generationDigest,
    next_work_item: config.next_work_item
  };

  const priorSelectedIds = (priorQueue.selected_candidates ?? []).map((row) => row.evidence_id).sort();
  const currentSelectedIds = selectedCandidates.map((row) => row.evidence_id);
  const delta = {
    schema_version: '1.0',
    delta_id: 'sog_evidence_archive_maintenance_queue_v2_delta_pr378',
    status: 'reviewed_internal_archive_queue_history_delta',
    public_output: false,
    review_pr: 378,
    reviewed_at: config.reviewed_at,
    prior_queue_id: priorQueue.queue_id,
    current_queue_id: queue.queue_id,
    historical_queue_rewritten: false,
    canonical_evidence_count: evidence.length,
    archive_recorded_count: checkpoint.evidence_quality.archive_index_count,
    archive_not_recorded_count: archiveNotRecorded.length,
    exclusion_counts: Object.fromEntries(Object.entries(exclusions).map(([key, values]) => [key, values.length])),
    exclusion_evidence_ids: exclusions,
    eligible_pool_count: eligible.length,
    selected_count: currentSelectedIds.length,
    prior_selected_evidence_ids: priorSelectedIds,
    current_selected_evidence_ids: currentSelectedIds,
    added_evidence_ids: currentSelectedIds.filter((id) => !priorSelectedIds.includes(id)),
    removed_evidence_ids: priorSelectedIds.filter((id) => !currentSelectedIds.includes(id)),
    retained_evidence_ids: currentSelectedIds.filter((id) => priorSelectedIds.includes(id)),
    reviewed_unresolved_suppressed_evidence_ids: exclusions.reviewed_suppressed_without_signal,
    reactivated_reviewed_evidence_ids: [...reactivatedIds].sort(),
    review_history_summary: {
      contract_id: contract.contract_id,
      manifest_id: historyManifest.manifest_id,
      history_source_count: historyManifest.counts.history_source_count,
      history_event_count: historyManifest.counts.history_event_count,
      reviewed_evidence_identity_count: historyManifest.counts.reviewed_evidence_identity_count,
      current_reviewed_unresolved_archive_gap_count: historyAudit.reviewed_unresolved_archive_gaps.count,
      automatic_time_expiry: contract.suppression_policy.automatic_time_expiry,
      accepted_reactivation_triggers: contract.reactivation_policy.accepted_triggers
    },
    boundaries: {
      canonical_data_changed: false,
      public_surface_changed: false,
      historical_queue_rewritten: false,
      ranking_or_score: false,
      automatic_promotion: false
    },
    source_digest_sha256: sourceDigest,
    generation_digest_sha256: generationDigest,
    next_work_item: config.next_work_item
  };

  return { queue, delta };
}

export function writeEvidenceArchiveMaintenanceQueueV2Outputs(outputs = buildEvidenceArchiveMaintenanceQueueV2Outputs()) {
  for (const [key, file] of Object.entries(outputPaths)) {
    fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    fs.writeFileSync(path.join(root, file), serialize(outputs[key]));
  }
}

const isCli = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isCli) {
  const outputs = buildEvidenceArchiveMaintenanceQueueV2Outputs();
  if (process.argv.includes('--check')) {
    for (const [key, file] of Object.entries(outputPaths)) {
      if (!fs.existsSync(path.join(root, file)) || readText(file) !== serialize(outputs[key])) {
        console.error(`${file} is not reproducible`);
        process.exit(1);
      }
    }
  } else writeEvidenceArchiveMaintenanceQueueV2Outputs(outputs);
  console.log(JSON.stringify({
    ok: true,
    queue_id: outputs.queue.queue_id,
    canonical_evidence: outputs.queue.canonical_evidence_count,
    archive_recorded: outputs.queue.archive_index_count,
    archive_not_recorded: outputs.queue.archive_not_recorded_count,
    reviewed_unresolved_suppressed: outputs.queue.reviewed_unresolved_suppressed_count,
    eligible_pool: outputs.queue.eligible_pool_count,
    selected: outputs.queue.selected_count,
    selected_evidence_ids: outputs.queue.selected_candidates.map((row) => row.evidence_id),
    next_work_item: outputs.queue.next_work_item
  }, null, 2));
}
