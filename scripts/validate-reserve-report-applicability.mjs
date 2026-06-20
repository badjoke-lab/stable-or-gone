import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const load = (files) => files.flatMap((file) => read(file));
const fail = (message) => {
  console.error(`reserve-report applicability queue: ${message}`);
  process.exitCode = 1;
};

const queue = read('data/quality/reserve-report-applicability.json');
const baseline = read('docs/migration/registry-v2-baseline.json');
const stablecoins = load(baseline.data_groups.stablecoins);
const reserveReports = load(baseline.data_groups.reserve_reports);
const evidence = load(baseline.data_groups.evidence);
const stablecoinIds = new Set(stablecoins.map((row) => row.id));
const evidenceIds = new Set(evidence.map((row) => row.id));
const coveredIds = new Set(reserveReports.flatMap((row) => [row.stablecoin_id, ...(row.stablecoin_ids ?? [])]).filter(Boolean));
const uncoveredIds = [...stablecoinIds].filter((id) => !coveredIds.has(id)).sort();
const records = Array.isArray(queue.records) ? queue.records : [];
const queueIds = records.map((row) => row.stablecoin_id);
const uniqueQueueIds = new Set(queueIds);

if (queue.schema_version !== '1.0') fail('schema_version must be 1.0');
if (!/^\d{4}-\d{2}-\d{2}$/.test(queue.classified_at ?? '')) fail('classified_at must be YYYY-MM-DD');
if (!Array.isArray(queue.records)) fail('records must be an array');
if (queue.expected_total !== records.length) fail('expected_total does not match records');
if (uniqueQueueIds.size !== queueIds.length) fail('duplicate stablecoin_id');

const categories = ['report_expected_but_missing', 'not_applicable_by_design', 'source_status_unresolved'];
const actions = {
  report_expected_but_missing: 'add_primary_context',
  not_applicable_by_design: 'retain_not_applicable',
  source_status_unresolved: 'investigate_source_status'
};
const counts = Object.fromEntries(categories.map((category) => [category, 0]));

for (const row of records) {
  if (!stablecoinIds.has(row.stablecoin_id)) fail(`${row.stablecoin_id}: missing canonical stablecoin`);
  if (coveredIds.has(row.stablecoin_id)) fail(`${row.stablecoin_id}: already has reserve context`);
  if (!categories.includes(row.applicability)) fail(`${row.stablecoin_id}: invalid applicability`);
  else counts[row.applicability] += 1;
  if (!row.reason_code) fail(`${row.stablecoin_id}: reason_code required`);
  if (typeof row.review_note !== 'string' || row.review_note.length < 40) fail(`${row.stablecoin_id}: review_note too short`);
  if (row.next_action !== actions[row.applicability]) fail(`${row.stablecoin_id}: invalid next_action`);
  if (!Array.isArray(row.evidence_ids) || row.evidence_ids.length === 0) fail(`${row.stablecoin_id}: evidence required`);
  for (const evidenceId of row.evidence_ids ?? []) if (!evidenceIds.has(evidenceId)) fail(`${row.stablecoin_id}: missing evidence ${evidenceId}`);
}

for (const category of categories) if (queue.category_counts?.[category] !== counts[category]) fail(`${category}: count mismatch`);
for (const id of uncoveredIds) if (!uniqueQueueIds.has(id)) fail(`${id}: uncovered record missing from queue`);
for (const id of uniqueQueueIds) if (!uncoveredIds.includes(id)) fail(`${id}: queue record is not uncovered`);
if (uncoveredIds.length !== queue.expected_total) fail('uncovered total does not match expected_total');

for (const key of ['publication_specific_layer', 'reserve_components_remain_required', 'no_placeholder_rows', 'no_universal_coverage_target', 'canonical_reserve_reports_unchanged']) {
  if (!queue.policy?.[key]) fail(`policy ${key} must remain true`);
}

if (!process.exitCode) console.log(`reserve-report applicability queue valid: ${records.length} records`);
