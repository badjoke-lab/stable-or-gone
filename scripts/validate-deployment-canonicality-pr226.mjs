import fs from 'node:fs';
import path from 'node:path';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const root = process.cwd();
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const review = readJson('data/quality/deployment-canonicality-pr226.json');
const baseline = loadRegistryV2Baseline(root);
const failures = [];
const fail = (message) => failures.push(message);
const unique = (values) => [...new Set(values)].sort();
const same = (left, right) => JSON.stringify(unique(left)) === JSON.stringify(unique(right));

const deployments = (baseline.data_groups?.deployments ?? []).flatMap((file) => {
  const rows = readJson(file);
  if (!Array.isArray(rows)) throw new Error(`${file}: expected array`);
  return rows.map((row) => ({ ...row, __file: file }));
});
const byId = new Map(deployments.map((row) => [row.id, row]));

if (review.schema_version !== '1.0') fail('schema_version must be 1.0');
if (review.reviewed_at !== '2026-06-28') fail('reviewed_at must be 2026-06-28');
if (deployments.length !== 130) fail(`expected 130 deployments, found ${deployments.length}`);
if (byId.size !== deployments.length) fail('deployment IDs must remain unique');

const decisions = {
  issuer_native: review.issuer_native_ids ?? [],
  native: review.native_ids ?? [],
  legacy: review.legacy_ids ?? [],
  unknown: review.unknown_ids ?? []
};
const reviewedIds = Object.values(decisions).flat();
if (reviewedIds.length !== review.reviewed_total) fail(`reviewed total ${reviewedIds.length} does not match ${review.reviewed_total}`);
if (new Set(reviewedIds).size !== reviewedIds.length) fail('reviewed decision sets overlap');

for (const [canonicality, ids] of Object.entries(decisions)) {
  if (ids.length !== review.decision_counts?.[canonicality]) fail(`${canonicality} decision count mismatch`);
  for (const id of ids) {
    const row = byId.get(id);
    if (!row) fail(`${id}: deployment is missing`);
    else if (row.canonicality !== canonicality) fail(`${id}: expected ${canonicality}, found ${row.canonicality}`);
  }
}

const reviewedFiles = unique(reviewedIds.map((id) => byId.get(id)?.__file).filter(Boolean));
if (!same(reviewedFiles, review.reviewed_source_files ?? [])) fail(`reviewed source files changed: ${reviewedFiles.join(', ')}`);

const notRecordedIds = deployments
  .filter((row) => row.canonicality === undefined || row.canonicality === null || row.canonicality === '')
  .map((row) => row.id)
  .sort();
if (!same(notRecordedIds, review.remaining_not_recorded_ids ?? [])) fail(`remaining not-recorded set changed: ${notRecordedIds.join(', ')}`);

const canonicalityCounts = {};
const recordStateCounts = { recorded: 0, not_recorded: 0 };
for (const row of deployments) {
  const value = row.canonicality === undefined || row.canonicality === null || row.canonicality === '' ? 'unknown' : row.canonicality;
  canonicalityCounts[value] = (canonicalityCounts[value] ?? 0) + 1;
  recordStateCounts[row.canonicality === undefined || row.canonicality === null || row.canonicality === '' ? 'not_recorded' : 'recorded'] += 1;
  if (!Array.isArray(row.evidence_ids) || row.evidence_ids.length === 0) fail(`${row.id}: evidence relation is missing`);
}
for (const [key, expected] of Object.entries(review.expected_registry_counts ?? {})) if (canonicalityCounts[key] !== expected) fail(`${key} count ${canonicalityCounts[key]} does not match ${expected}`);
for (const [key, expected] of Object.entries(review.expected_record_state_counts ?? {})) if (recordStateCounts[key] !== expected) fail(`${key} record-state count ${recordStateCounts[key]} does not match ${expected}`);

for (const id of review.unknown_ids ?? []) {
  const row = byId.get(id);
  if (!row?.notes?.toLowerCase().includes('separate') && !row?.notes?.toLowerCase().includes('require')) fail(`${id}: explicit unknown requires a review-boundary note`);
}
for (const key of ['canonicality_is_separate_from_operational_status','issuer_native_does_not_mean_current_or_redeemable','legacy_does_not_replace_terminal_status','aggregate_or_related_asset_context_may_remain_unknown','contract_and_verification_review_remain_separate','no_value_inferred_from_chain_name_alone','remaining_batch_records_are_deferred_to_pr227']) if (!review.policy?.[key]) fail(`missing policy flag: ${key}`);

if (typeof review.source_review !== 'string' || !fs.existsSync(path.join(root, review.source_review))) fail(`supporting audit is missing: ${review.source_review}`);
else {
  const audit = fs.readFileSync(path.join(root, review.source_review), 'utf8');
  for (const phrase of ['Reviewed deployments: 39','Issuer native: 25','Native: 9','Legacy: 3','Unknown: 2','Not recorded: 28']) if (!audit.includes(phrase)) fail(`supporting audit is missing: ${phrase}`);
}

if (failures.length) {
  console.error('PR #226 deployment canonicality validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log('PR #226 deployment canonicality valid: 39 reviewed, 102 recorded, 28 deferred to PR #227.');
