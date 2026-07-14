import fs from 'node:fs';
import path from 'node:path';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const root = process.cwd();
const outputPath = 'docs/migration/evidence-archive-maintenance-queue-pr365.json';
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const rowsOf = (value, file) => {
  const rows = Array.isArray(value) ? value : value?.records;
  if (!Array.isArray(rows)) throw new Error(`${file}: expected array or {records: []}`);
  return rows;
};
const text = (...values) => values.filter(Boolean).join(' ').toLowerCase();

const config = readJson('config/evidence-archive-maintenance-batch-2-pr365.json');
const previousQueue = readJson('docs/migration/evidence-correction-queue-pr360.json');
const excludedIds = new Set((previousQueue.selected_candidates ?? []).map((row) => row.evidence_id));
const baseline = loadRegistryV2Baseline(root);
const evidenceFiles = baseline.data_groups?.evidence ?? [];
const evidence = evidenceFiles.flatMap((file) => rowsOf(readJson(file), file).map((row) => ({ ...row, __source_file: file })));

const classify = (row) => {
  const haystack = text(row.source_type, row.title, row.publisher, row.url, ...(row.claim_scopes ?? []));
  if (/regulat|court|legal|terms|enforcement|attorney general|cftc|sec\b|government|legislation/.test(haystack)) {
    return { rank: 1, bucket: 'regulator_court_legal' };
  }
  if (/reserve|attestation|assurance|audit|transparency|composition/.test(haystack)) {
    return { rank: 3, bucket: 'reserve_attestation_audit' };
  }
  if (/issuer|protocol|official|product|documentation|docs\.|governance|foundation|stablecoin page|app interface/.test(haystack)) {
    return { rank: 2, bucket: 'official_issuer_protocol_product' };
  }
  if (/reuters|bloomberg|coindesk|the block|research|analysis|reporting|news/.test(haystack)) {
    return { rank: 4, bucket: 'high_quality_reporting_research' };
  }
  return { rank: 5, bucket: 'other_reviewed_source' };
};

const candidates = evidence
  .filter((row) => row.id && String(row.url ?? '').trim())
  .filter((row) => !String(row.archived_url ?? '').trim())
  .filter((row) => !String(row.url).startsWith('https://web.archive.org/'))
  .filter((row) => !excludedIds.has(row.id))
  .map((row) => ({ row, priority: classify(row) }))
  .sort((a, b) => a.priority.rank - b.priority.rank || a.row.id.localeCompare(b.row.id));

const selected = candidates.slice(0, config.maximum_canonical_evidence_records_touched);
if (selected.length !== config.maximum_canonical_evidence_records_touched) {
  throw new Error(`expected ${config.maximum_canonical_evidence_records_touched} candidates, found ${selected.length}`);
}

const archiveRecorded = evidence.filter((row) => String(row.archived_url ?? '').trim()).length;
const queue = {
  schema_version: '1.0',
  queue_id: 'sog_evidence_archive_maintenance_queue_pr365_2026_07_14',
  status: 'internal_review_queue_not_canonical_change',
  public_output: false,
  review_pr: 365,
  source_review_gate: config.source_review_gate,
  source_handoff: config.source_handoff,
  selection_rule: config.queue_selection.mode,
  canonical_evidence_count: evidence.length,
  archive_index_count: archiveRecorded,
  archive_not_recorded_count: evidence.length - archiveRecorded,
  excluded_pr360_selected_count: excludedIds.size,
  selected_count: selected.length,
  maximum_selected_count: config.maximum_canonical_evidence_records_touched,
  priority_order: config.queue_selection.priority_order,
  selected_candidates: selected.map(({ row, priority }) => ({
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
    claim_scopes: [...(row.claim_scopes ?? [])],
    review_reasons: ['archive_not_recorded', priority.bucket],
    review_status: 'pending_manual_review',
    canonical_change_authorized: false
  }))
};

const serialized = `${JSON.stringify(queue, null, 2)}\n`;
if (process.argv.includes('--check')) {
  const existing = fs.readFileSync(path.join(root, outputPath), 'utf8');
  if (existing !== serialized) {
    console.error(`${outputPath} is not deterministic or is stale`);
    process.exit(1);
  }
  console.log(`PR #365 queue is deterministic: ${selected.length} candidates from ${evidence.length} Evidence rows.`);
} else {
  fs.mkdirSync(path.dirname(path.join(root, outputPath)), { recursive: true });
  fs.writeFileSync(path.join(root, outputPath), serialized);
  console.log(`Wrote ${outputPath}: ${selected.length} candidates, ${archiveRecorded} archived, ${evidence.length - archiveRecorded} without archive.`);
}
