import fs from 'node:fs';
import path from 'node:path';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const root = process.cwd();
const read = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const review = read('data/deployment-verification-pr229.json');
const baseline = loadRegistryV2Baseline(root);
const deployments = (baseline.data_groups?.deployments ?? []).flatMap((file) => read(file));
const byId = new Map(deployments.map((row) => [row.id, row]));
const failures = [];
const fail = (message) => failures.push(message);
const pairs = Object.entries(review.status_ids ?? {}).flatMap(([status, ids]) => (ids ?? []).map((id) => ({ id, status })));
const overlayIds = pairs.map((row) => row.id).sort();
const canonicalIds = deployments.map((row) => row.id).sort();

if (review.schema_version !== '1.0') fail('schema_version must be 1.0');
if (review.reviewed_at !== '2026-06-29') fail('reviewed_at must be 2026-06-29');
if (deployments.length !== 130 || byId.size !== 130) fail('canonical deployment set must remain 130 unique records');
if (review.expected_total !== 130 || pairs.length !== 130) fail('verification overlay must cover 130 records');
if (JSON.stringify(overlayIds) !== JSON.stringify(canonicalIds)) fail('verification overlay ID set differs from canonical deployments');

const expectedCounts = { verified: 16, identifier_recorded_unverified: 45, source_linked_no_identifier: 69, review_needed: 0, unknown: 0, not_recorded: 0 };
for (const [status, expected] of Object.entries(expectedCounts)) {
  const actual = (review.status_ids?.[status] ?? []).length;
  if (actual !== expected || review.status_counts?.[status] !== expected) fail(`${status}: ${actual} does not match ${expected}`);
}

const reviewed = Array.isArray(review.reviewed_records) ? review.reviewed_records : [];
if (reviewed.length !== 16) fail(`reviewed_records must contain 16 rows, found ${reviewed.length}`);
const reviewedIds = reviewed.map((row) => row.id).sort();
const verifiedIds = [...(review.status_ids?.verified ?? [])].sort();
if (JSON.stringify(reviewedIds) !== JSON.stringify(verifiedIds)) fail('reviewed record IDs must equal verified IDs');

for (const item of reviewed) {
  const row = byId.get(item.id);
  if (!row) {
    fail(`${item.id}: canonical deployment missing`);
    continue;
  }
  const identifier = row.deployment_identifier ?? row.contract_address;
  if (identifier !== item.identifier) fail(`${item.id}: canonical identifier ${identifier} differs from reviewed identifier ${item.identifier}`);
  if (row.identifier_type !== item.identifier_type) fail(`${item.id}: identifier_type differs from reviewed value`);
  if (typeof item.source_url !== 'string' || !item.source_url.startsWith('https://')) fail(`${item.id}: reviewed source must use HTTPS`);
  if (!Array.isArray(row.evidence_ids) || row.evidence_ids.length === 0) fail(`${item.id}: canonical evidence relation missing`);
}

const unresolved = deployments.filter((row) => row.contract_address === 'source_review_needed' || row.contract_address === 'not_applicable_or_source_review_needed');
if (unresolved.length !== 0) fail(`deployment identifier sentinels remain: ${unresolved.map((row) => row.id).join(', ')}`);
const ust = byId.get('sog_dep_ust_terra_seed');
if (ust?.identifier_type !== 'native_denom' || ust?.deployment_identifier !== 'uusd' || ust?.contract_address !== null || ust?.chain !== 'Terra Classic') fail('UST must be modeled as Terra Classic native denom uusd with no contract address');

if (typeof review.source_review !== 'string' || !fs.existsSync(path.join(root, review.source_review))) fail(`supporting audit missing: ${review.source_review}`);
else {
  const audit = fs.readFileSync(path.join(root, review.source_review), 'utf8');
  for (const phrase of ['Deployments reviewed: 16','Verified deployments after review: 16','Source review needed after review: 0','Unknown verification states after review: 0','Total deployment verification coverage: 130 / 130']) {
    if (!audit.includes(phrase)) fail(`supporting audit missing: ${phrase}`);
  }
}

if (failures.length) {
  console.error('PR #229 deployment source-status validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log('PR #229 deployment source-status valid: 16 verified identifiers; 0 review-needed; 0 unknown; 130 total states.');
