import fs from 'node:fs';
import path from 'node:path';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';
import { getEvidenceReliability, pollutedReliabilityValues } from '../config/evidence-taxonomy.mjs';

const root = process.cwd();
const absolute = (relativePath) => path.join(root, relativePath);
const readJson = (relativePath) => JSON.parse(fs.readFileSync(absolute(relativePath), 'utf8'));
const failures = [];
const fail = (message) => failures.push(message);

const reviewPath = 'data/quality/evidence-reliability-pr223.json';
const review = readJson(reviewPath);
const baseline = loadRegistryV2Baseline(root);
const evidence = (baseline.data_groups?.evidence ?? []).flatMap((file) => {
  const rows = readJson(file);
  if (!Array.isArray(rows)) throw new Error(`${file}: expected array`);
  return rows.map((row) => ({ ...row, __file: file }));
});
const byId = new Map(evidence.map((row) => [row.id, row]));

if (review.schema_version !== '1.0') fail('schema_version must be 1.0');
if (review.reviewed_at !== '2026-06-28') fail('reviewed_at must be 2026-06-28');
if (review.previous_normalized_unknown_total !== 36) fail('previous unknown total must be 36');
if (evidence.length !== 457) fail(`expected 457 evidence records, found ${evidence.length}`);
if (byId.size !== evidence.length) fail('evidence IDs must remain unique');

const highIds = Array.isArray(review.high_ids) ? review.high_ids : [];
const mediumIds = Array.isArray(review.medium_ids) ? review.medium_ids : [];
const reviewedIds = [...highIds, ...mediumIds];
if (highIds.length !== 18) fail(`expected 18 high decisions, found ${highIds.length}`);
if (mediumIds.length !== 18) fail(`expected 18 medium decisions, found ${mediumIds.length}`);
if (new Set(reviewedIds).size !== 36) fail('reviewed ID sets must be disjoint and total 36');

for (const id of highIds) {
  const row = byId.get(id);
  if (!row) fail(`${id}: missing canonical evidence`);
  else if (row.reliability !== 'high') fail(`${id}: expected high, found ${row.reliability}`);
}
for (const id of mediumIds) {
  const row = byId.get(id);
  if (!row) fail(`${id}: missing canonical evidence`);
  else if (row.reliability !== 'medium') fail(`${id}: expected medium, found ${row.reliability}`);
}

const reviewedFiles = [...new Set(reviewedIds.map((id) => byId.get(id)?.__file).filter(Boolean))].sort();
const expectedFiles = [...(review.source_files ?? [])].sort();
if (JSON.stringify(reviewedFiles) !== JSON.stringify(expectedFiles)) {
  fail(`reviewed file set mismatch: ${reviewedFiles.join(', ')}`);
}

const counts = { high: 0, medium: 0, low: 0, unknown: 0 };
const normalizedUnknownIds = [];
const pollutedIds = [];
for (const row of evidence) {
  const normalized = getEvidenceReliability(row.reliability);
  counts[normalized] = (counts[normalized] ?? 0) + 1;
  if (normalized === 'unknown') normalizedUnknownIds.push(row.id);
  if (pollutedReliabilityValues.has(row.reliability)) pollutedIds.push(row.id);
  if (!['high', 'medium', 'low', 'unknown'].includes(row.reliability)) {
    fail(`${row.id}: noncanonical raw reliability ${row.reliability}`);
  }
}

const expectedCounts = review.expected_registry_reliability_counts ?? {};
for (const key of ['high', 'medium', 'low', 'unknown']) {
  if (counts[key] !== expectedCounts[key]) fail(`${key} count ${counts[key]} does not match ${expectedCounts[key]}`);
}
if (normalizedUnknownIds.length > 0) fail(`normalized unknown records remain: ${normalizedUnknownIds.join(', ')}`);
if (pollutedIds.length > 0) fail(`polluted reliability values remain: ${pollutedIds.join(', ')}`);

const oldCounts = review.previous_raw_value_counts ?? {};
const oldTotal = Object.values(oldCounts).reduce((sum, value) => sum + Number(value), 0);
if (oldTotal !== 36) fail(`previous raw value counts total ${oldTotal}, expected 36`);
if (review.decision_counts?.high !== 18 || review.decision_counts?.medium !== 18 || review.decision_counts?.low !== 0 || review.decision_counts?.unknown !== 0) {
  fail('decision counts must remain high 18 / medium 18 / low 0 / unknown 0');
}
for (const key of [
  'reliability_is_not_primary_state',
  'official_overview_pages_default_to_medium',
  'direct_legal_technical_report_and_launch_records_may_be_high',
  'live_interfaces_and_dashboards_default_to_medium',
  'explorer_contract_identity_may_be_high_with_narrow_claim_scope',
  'no_value_inferred_from_source_type_alone'
]) {
  if (!review.policy?.[key]) fail(`policy flag is missing: ${key}`);
}

if (typeof review.source_review !== 'string' || !fs.existsSync(absolute(review.source_review))) {
  fail(`supporting audit is missing: ${review.source_review}`);
} else {
  const audit = fs.readFileSync(absolute(review.source_review), 'utf8');
  for (const phrase of ['Reviewed records: 36', 'High:             18', 'Medium:           18', 'Unknown:           0']) {
    if (!audit.includes(phrase)) fail(`supporting audit is missing summary: ${phrase}`);
  }
  for (const id of reviewedIds) if (!audit.includes(id)) fail(`supporting audit is missing ${id}`);
}

if (failures.length > 0) {
  console.error('PR #223 evidence reliability validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('PR #223 evidence reliability valid: 457 records; high 376, medium 81, low 0, unknown 0; polluted values 0.');
