import fs from 'node:fs';
import path from 'node:path';
import { getDeploymentVerificationState } from '../config/deployment-taxonomy.mjs';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const root = process.cwd();
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const review = readJson('data/deployment-verification-pr228.json');
const baseline = loadRegistryV2Baseline(root);
const failures = [];
const fail = (message) => failures.push(message);
const unique = (values) => [...new Set(values)].sort();

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
if (review.expected_total !== deployments.length) fail(`overlay total ${review.expected_total} does not match deployment count ${deployments.length}`);

const allowedStatuses = new Set([
  'verified',
  'identifier_recorded_unverified',
  'source_linked_no_identifier',
  'review_needed',
  'not_recorded',
  'unknown'
]);
const pairs = Object.entries(review.status_ids ?? {}).flatMap(([status, ids]) =>
  (ids ?? []).map((id) => ({ id, status }))
);
const overlayIds = pairs.map((row) => row.id);
if (new Set(overlayIds).size !== overlayIds.length) fail('deployment verification overlay contains duplicate IDs');
if (overlayIds.length !== deployments.length) fail(`overlay contains ${overlayIds.length} IDs, expected ${deployments.length}`);
if (JSON.stringify(unique(overlayIds)) !== JSON.stringify(unique(deployments.map((row) => row.id)))) {
  fail('overlay deployment ID set does not match canonical deployment IDs');
}

const counts = {};
for (const { id, status } of pairs) {
  counts[status] = (counts[status] ?? 0) + 1;
  if (!allowedStatuses.has(status)) fail(`${id}: invalid verification status ${status}`);
  const row = byId.get(id);
  if (!row) {
    fail(`${id}: overlay references missing deployment`);
    continue;
  }
  const inferred = getDeploymentVerificationState(row);
  if (inferred !== status) fail(`${id}: overlay ${status} does not match conservative inference ${inferred}`);
  if (!Array.isArray(row.evidence_ids) || row.evidence_ids.length === 0) fail(`${id}: deployment evidence relation is missing`);
}

for (const [status, expected] of Object.entries(review.status_counts ?? {})) {
  if (counts[status] !== expected) fail(`${status} count ${counts[status]} does not match ${expected}`);
}
if ((counts.verified ?? 0) !== 0) fail('PR #228 must not mark any deployment verified');
if ((counts.not_recorded ?? 0) !== 0) fail('verification overlay must not retain not_recorded');
if (counts.identifier_recorded_unverified !== 45) fail('identifier_recorded_unverified count must remain 45');
if (counts.source_linked_no_identifier !== 69) fail('source_linked_no_identifier count must remain 69');
if (counts.review_needed !== 15) fail('review_needed count must remain 15');
if (counts.unknown !== 1) fail('unknown count must remain 1');

const unknownIds = review.status_ids?.unknown ?? [];
if (JSON.stringify(unknownIds) !== JSON.stringify(['sog_dep_ust_terra_seed'])) fail('the sole unknown verification record must remain historical UST Terra');
for (const id of review.status_ids?.review_needed ?? []) {
  if (byId.get(id)?.contract_address !== 'source_review_needed') fail(`${id}: review_needed requires source_review_needed contract state`);
}
for (const id of review.status_ids?.identifier_recorded_unverified ?? []) {
  const value = byId.get(id)?.contract_address;
  if (value === null || value === undefined || value === '' || value === 'source_review_needed' || value === 'not_applicable_or_source_review_needed') {
    fail(`${id}: identifier_recorded_unverified requires a recorded identifier`);
  }
}
for (const id of review.status_ids?.source_linked_no_identifier ?? []) {
  const row = byId.get(id);
  if (row?.contract_address !== null && row?.contract_address !== undefined && row?.contract_address !== '') fail(`${id}: source_linked_no_identifier must not have a recorded identifier`);
  if (!Array.isArray(row?.evidence_ids) || row.evidence_ids.length === 0) fail(`${id}: source-linked state requires evidence`);
}

for (const key of [
  'verified_requires_direct_confirmation',
  'identifier_presence_is_not_verification',
  'source_linked_without_identifier_is_explicit',
  'review_needed_is_not_unknown',
  'unknown_is_reserved_for_ambiguous_applicability',
  'overlay_must_cover_every_canonical_deployment',
  'verification_is_separate_from_canonicality_and_operational_state'
]) {
  if (!review.policy?.[key]) fail(`missing policy flag: ${key}`);
}

if (typeof review.source_review !== 'string' || !fs.existsSync(path.join(root, review.source_review))) {
  fail(`supporting audit is missing: ${review.source_review}`);
} else {
  const audit = fs.readFileSync(path.join(root, review.source_review), 'utf8');
  for (const phrase of [
    'Deployments reviewed: 130',
    'Verified: 0',
    'Identifier recorded, verification not recorded: 45',
    'Source linked, identifier not recorded: 69',
    'Source review needed: 15',
    'Unknown or unresolved: 1',
    'Verification status recorded: 130',
    'Verification status not recorded: 0'
  ]) {
    if (!audit.includes(phrase)) fail(`supporting audit is missing: ${phrase}`);
  }
}

if (failures.length) {
  console.error('PR #228 deployment verification validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log('PR #228 deployment verification valid: 130 explicit states; 45 identifier-unverified, 69 source-linked, 15 review-needed, 1 unknown, 0 verified.');
