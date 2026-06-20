import fs from 'node:fs';
import path from 'node:path';

const read = (file) => JSON.parse(fs.readFileSync(path.join(process.cwd(), file), 'utf8'));
const load = (files) => files.flatMap(read);
const errors = [];
const queue = read('data/quality/reserve-report-applicability.json');
const baseline = read('docs/migration/registry-v2-baseline.json');
const stablecoinIds = new Set(load(baseline.data_groups.stablecoins).map((row) => row.id));
const evidenceIds = new Set(load(baseline.data_groups.evidence).map((row) => row.id));
const coveredIds = new Set(load(baseline.data_groups.reserve_reports).flatMap((row) => [row.stablecoin_id, ...(row.stablecoin_ids ?? [])]).filter(Boolean));
const uncoveredIds = [...stablecoinIds].filter((id) => !coveredIds.has(id)).sort();
const records = Array.isArray(queue.records) ? queue.records : [];
const queueIds = records.map((row) => row.stablecoin_id);
const queueSet = new Set(queueIds);
const categories = ['report_expected_but_missing', 'not_applicable_by_design', 'source_status_unresolved'];
const actions = {
  report_expected_but_missing: 'add_primary_context',
  not_applicable_by_design: 'retain_not_applicable',
  source_status_unresolved: 'investigate_source_status'
};
const counts = Object.fromEntries(categories.map((value) => [value, 0]));
const fail = (message) => errors.push(message);

if (queue.schema_version !== '1.0') fail('schema_version');
if (!/^\d{4}-\d{2}-\d{2}$/.test(queue.classified_at ?? '')) fail('classified_at');
if (queue.expected_total !== records.length) fail('expected_total');
if (queueSet.size !== queueIds.length) fail('duplicate stablecoin_id');

for (const row of records) {
  if (!stablecoinIds.has(row.stablecoin_id)) fail('missing stablecoin ' + row.stablecoin_id);
  if (coveredIds.has(row.stablecoin_id)) fail('covered record in queue ' + row.stablecoin_id);
  if (!categories.includes(row.applicability)) fail('invalid applicability ' + row.stablecoin_id);
  else counts[row.applicability] += 1;
  if (!row.reason_code || typeof row.review_note !== 'string' || row.review_note.length < 40) fail('incomplete decision ' + row.stablecoin_id);
  if (row.next_action !== actions[row.applicability]) fail('invalid action ' + row.stablecoin_id);
  if (!Array.isArray(row.evidence_ids) || row.evidence_ids.length === 0) fail('missing evidence ' + row.stablecoin_id);
  for (const id of row.evidence_ids ?? []) if (!evidenceIds.has(id)) fail('unknown evidence ' + id);
}

for (const category of categories) if (queue.category_counts?.[category] !== counts[category]) fail('count mismatch ' + category);
for (const id of uncoveredIds) if (!queueSet.has(id)) fail('uncovered missing from queue ' + id);
for (const id of queueSet) if (!uncoveredIds.includes(id)) fail('extra queue record ' + id);
if (uncoveredIds.length !== queue.expected_total) fail('uncovered total');
for (const key of ['publication_specific_layer','reserve_components_remain_required','no_placeholder_rows','no_universal_coverage_target','canonical_updates_require_reviewed_primary_context']) if (!queue.policy?.[key]) fail('policy ' + key);

if (errors.length) {
  for (const error of errors) console.error('reserve-report applicability queue: ' + error);
  process.exit(1);
}
console.log('reserve-report applicability queue valid: ' + records.length + ' records');
