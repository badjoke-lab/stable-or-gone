import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const root = process.cwd();
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const readRows = (file) => {
  const value = readJson(file);
  const rows = Array.isArray(value) ? value : value.records;
  if (!Array.isArray(rows)) throw new Error(`${file}: expected array or { records: [] }`);
  return rows;
};
const unique = (values) => [...new Set(values.filter((value) => typeof value === 'string' && value.length > 0))].sort();
const relationValues = (row, plural, singular) => unique([...(row[plural] ?? []), ...(row[singular] ? [row[singular]] : [])]);

const configPath = 'config/evidence-correction-batch-pr360.json';
const config = readJson(configPath);
const baseline = loadRegistryV2Baseline(root);
const evidenceFiles = baseline.data_groups?.evidence ?? [];
const evidence = evidenceFiles.flatMap(readRows);

function priority(row) {
  const type = String(row.source_type ?? '').toLowerCase();
  const publisher = String(row.publisher ?? '').toLowerCase();
  const title = String(row.title ?? '').toLowerCase();
  const haystack = `${type} ${publisher} ${title}`;
  if (/(regulator|regulatory|court|filing|legal|legislation|government|sec |fsa|mas |occ |fdic)/.test(haystack)) return {rank: 1, bucket: 'regulator_court_legal'};
  if (/(official|issuer|protocol|product|documentation|announcement|terms|whitepaper|governance)/.test(haystack)) return {rank: 2, bucket: 'official_issuer_protocol_product'};
  if (/(reserve|attestation|audit|assurance|transparency report)/.test(haystack)) return {rank: 3, bucket: 'reserve_attestation_audit'};
  if (/(reuters|bloomberg|journal|research|report|news|analysis)/.test(haystack)) return {rank: 4, bucket: 'high_quality_reporting_research'};
  return {rank: 5, bucket: 'other_reviewed_source'};
}

const noArchive = evidence
  .filter((row) => !String(row.archived_url ?? '').trim())
  .map((row) => {
    const bucket = priority(row);
    return {
      evidence_id: row.id,
      priority_rank: bucket.rank,
      priority_bucket: bucket.bucket,
      title: row.title ?? null,
      publisher: row.publisher ?? null,
      source_type: row.source_type ?? null,
      url: row.url ?? null,
      published_at: row.published_at ?? null,
      stablecoin_ids: relationValues(row, 'stablecoin_ids', 'stablecoin_id'),
      organization_ids: relationValues(row, 'organization_ids', 'issuer_id'),
      event_ids: relationValues(row, 'event_ids', 'event_id'),
      claim_scopes: relationValues(row, 'claim_scopes', 'claim_scope'),
      review_reasons: ['archive_not_recorded', bucket.bucket],
      review_status: 'pending_manual_review',
      canonical_change_authorized: false
    };
  })
  .sort((a, b) => a.priority_rank - b.priority_rank || a.evidence_id.localeCompare(b.evidence_id));

if (evidence.length !== config.canonical_evidence_count_before) throw new Error(`Expected ${config.canonical_evidence_count_before} Evidence rows, found ${evidence.length}`);
if (noArchive.length !== config.archive_not_recorded_count_before) throw new Error(`Expected ${config.archive_not_recorded_count_before} no-archive rows, found ${noArchive.length}`);

const selected = noArchive.slice(0, config.maximum_canonical_evidence_records_touched);
const inputs = [configPath, ...evidenceFiles].sort();
const digest = crypto.createHash('sha256');
for (const file of inputs) {
  digest.update(file);
  digest.update('\0');
  digest.update(fs.readFileSync(path.join(root, file)));
  digest.update('\0');
}

const report = {
  schema_version: '1.0',
  queue_id: 'sog_evidence_correction_queue_pr360_2026_07_14',
  status: 'internal_review_queue_not_canonical_change',
  public_output: false,
  review_pr: 360,
  selection_rule: config.queue_selection.mode,
  canonical_evidence_count: evidence.length,
  archive_index_count: evidence.length - noArchive.length,
  archive_not_recorded_count: noArchive.length,
  selected_count: selected.length,
  maximum_selected_count: config.maximum_canonical_evidence_records_touched,
  priority_order: config.queue_selection.priority_order,
  selected_candidates: selected,
  remaining_queue_count: noArchive.length - selected.length,
  input_digest_sha256: digest.digest('hex'),
  constraints: {
    automatic_canonical_write: false,
    manual_review_required: true,
    queue_is_internal: true,
    market_access_record_changes_allowed: false,
    new_canonical_assets_allowed: false
  }
};

const output = process.argv[2] ?? 'docs/migration/evidence-correction-queue-pr360.json';
fs.mkdirSync(path.dirname(path.join(root, output)), {recursive: true});
fs.writeFileSync(path.join(root, output), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({
  ok: true,
  output,
  canonical_evidence_count: report.canonical_evidence_count,
  archive_not_recorded_count: report.archive_not_recorded_count,
  selected_count: report.selected_count,
  selected_evidence_ids: selected.map((row) => row.evidence_id),
  input_digest_sha256: report.input_digest_sha256
}, null, 2));
