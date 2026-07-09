import fs from 'node:fs';
import path from 'node:path';
import { buildComparisonReadinessAudit, serializeAudit } from './comparison/build-readiness-audit-pr337.mjs';

const root = process.cwd();
const contract = JSON.parse(fs.readFileSync(path.join(root, 'data/quality/comparison-readiness-contract-v1.json'), 'utf8'));
const audit = buildComparisonReadinessAudit();
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

expect(audit.schema_version === '1.0', 'audit schema_version must be 1.0');
expect(audit.audit_id === 'sog_comparison_readiness_audit_pr337_110_assets', 'audit_id mismatch');
expect(audit.status === 'internal_reviewed_audit', 'audit status mismatch');
expect(audit.checkpoint_id === contract.checkpoint_id, 'audit checkpoint must match contract checkpoint');
expect(audit.asset_count === 110, `audit asset_count must be 110, found ${audit.asset_count}`);
expect(audit.dimension_count === 19, `audit dimension_count must be 19, found ${audit.dimension_count}`);
expect(audit.contract_id === contract.contract_id, 'audit contract_id mismatch');
expect(/^[0-9a-f]{64}$/.test(audit.input_digest_sha256), 'input digest must be lowercase SHA-256');
expect(audit.generated_from_canonical_only === true, 'audit must be generated from canonical-only inputs');
expect(audit.single_composite_score === false, 'single composite score must remain false');
expect((audit.assets ?? []).length === 110, `audit must contain 110 asset rows, found ${(audit.assets ?? []).length}`);

const assetIds = audit.assets.map((row) => row.asset_id);
expect(new Set(assetIds).size === 110, 'asset IDs must be unique');
expect(JSON.stringify(assetIds) === JSON.stringify([...assetIds].sort()), 'asset rows must be sorted by asset_id');

const contractDimensionIds = contract.dimensions.map((row) => row.id);
const stateSet = new Set(contract.readiness_states);
const expectedMarketAccessRows = [];
const recomputedQueue = [];

for (const asset of audit.assets) {
  expect(typeof asset.asset_id === 'string' && asset.asset_id.length > 0, 'asset row missing asset_id');
  expect(stateSet.has(asset.overall_state), `${asset.asset_id}: invalid overall_state ${asset.overall_state}`);
  expect((asset.dimensions ?? []).length === 19, `${asset.asset_id}: expected 19 dimensions, found ${(asset.dimensions ?? []).length}`);
  const dimensionIds = asset.dimensions.map((row) => row.dimension_id);
  expect(new Set(dimensionIds).size === 19, `${asset.asset_id}: duplicate dimension rows`);
  expect(JSON.stringify(dimensionIds) === JSON.stringify(contractDimensionIds), `${asset.asset_id}: dimension order or IDs mismatch contract`);

  for (const dimension of asset.dimensions) {
    expect(stateSet.has(dimension.state), `${asset.asset_id}/${dimension.dimension_id}: invalid state ${dimension.state}`);
    expect(typeof dimension.readiness_scored === 'boolean', `${asset.asset_id}/${dimension.dimension_id}: readiness_scored must be boolean`);
    expect(Array.isArray(dimension.reason_codes) && dimension.reason_codes.length > 0, `${asset.asset_id}/${dimension.dimension_id}: reason_codes required`);
    const contractDimension = contract.dimensions.find((row) => row.id === dimension.dimension_id);
    expect(dimension.readiness_scored === contractDimension?.readiness_scored, `${asset.asset_id}/${dimension.dimension_id}: readiness_scored mismatch contract`);
    if (dimension.dimension_id === 'market_access_applicability') expectedMarketAccessRows.push({ asset_id: asset.asset_id, ...dimension });
    if (['needs_normalization', 'integrity_blocked'].includes(dimension.state)) {
      recomputedQueue.push({
        asset_id: asset.asset_id,
        dimension_id: dimension.dimension_id,
        state: dimension.state,
        severity: dimension.state === 'integrity_blocked' ? 'critical' : 'medium',
        reason_code: dimension.reason_codes[0] ?? 'unspecified',
      });
    }
  }

  const scoredStates = asset.dimensions.filter((row) => row.readiness_scored).map((row) => row.state);
  const precedence = ['ready', 'ready_with_unknowns', 'needs_normalization', 'integrity_blocked'];
  const expectedOverall = precedence[Math.max(...scoredStates.map((state) => precedence.indexOf(state)))];
  expect(asset.overall_state === expectedOverall, `${asset.asset_id}: overall_state mismatch recomputed categorical precedence`);
}

expect(expectedMarketAccessRows.length === 110, 'market access dimension must exist for all 110 assets');
for (const row of expectedMarketAccessRows) {
  expect(row.state === 'ready_with_unknowns', `${row.asset_id}: market access state must be ready_with_unknowns`);
  expect(row.readiness_scored === false, `${row.asset_id}: market access must be unscored`);
  expect(row.reason_codes.includes('deferred_canonical_schema'), `${row.asset_id}: market access must use deferred_canonical_schema reason`);
}

const queueSort = (a, b) => {
  const stateOrder = { integrity_blocked: 0, needs_normalization: 1 };
  return stateOrder[a.state] - stateOrder[b.state] || a.asset_id.localeCompare(b.asset_id) || a.dimension_id.localeCompare(b.dimension_id);
};
recomputedQueue.sort(queueSort);
expect(JSON.stringify(audit.normalization_queue) === JSON.stringify(recomputedQueue), 'normalization queue must exactly match blocked and needs-normalization dimension rows');

const recomputedAssetStates = Object.fromEntries(contract.readiness_states.map((state) => [state, audit.assets.filter((row) => row.overall_state === state).length]));
expect(JSON.stringify(audit.summary?.asset_states) === JSON.stringify(recomputedAssetStates), 'asset-state summary mismatch');
expect(audit.summary?.normalization_queue_count === recomputedQueue.length, 'normalization queue count mismatch');
expect(audit.summary?.integrity_blocked_dimension_count === recomputedQueue.filter((row) => row.state === 'integrity_blocked').length, 'integrity-blocked dimension count mismatch');
expect(audit.summary?.needs_normalization_dimension_count === recomputedQueue.filter((row) => row.state === 'needs_normalization').length, 'needs-normalization dimension count mismatch');

for (const summary of audit.summary?.dimension_states ?? []) {
  const recomputed = Object.fromEntries(contract.readiness_states.map((state) => [state, audit.assets.filter((asset) => asset.dimensions.find((row) => row.dimension_id === summary.dimension_id)?.state === state).length]));
  expect(JSON.stringify(summary.state_counts) === JSON.stringify(recomputed), `${summary.dimension_id}: dimension summary mismatch`);
}
expect((audit.summary?.dimension_states ?? []).length === 19, 'dimension summary must contain 19 rows');

const forbiddenExactKeys = new Set(['score', 'ranking', 'recommendation']);
const visit = (value, pathParts = []) => {
  if (Array.isArray(value)) return value.forEach((item, index) => visit(item, [...pathParts, String(index)]));
  if (!value || typeof value !== 'object') return;
  for (const [key, child] of Object.entries(value)) {
    expect(!forbiddenExactKeys.has(key), `forbidden output key ${[...pathParts, key].join('.')}`);
    visit(child, [...pathParts, key]);
  }
};
visit(audit);

const committedPath = path.join(root, 'data/quality/comparison-readiness-audit-pr337.json');
if (fs.existsSync(committedPath)) {
  const committed = fs.readFileSync(committedPath, 'utf8');
  const regenerated = serializeAudit(audit);
  expect(committed === regenerated, 'committed readiness audit must equal deterministic regeneration byte-for-byte');
} else if (process.env.SOG_REQUIRE_COMMITTED_READINESS_AUDIT === '1') {
  failures.push('committed readiness audit artifact is required');
}

if (failures.length) {
  console.error('PR #337 Comparison Readiness audit validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  checkpoint_id: audit.checkpoint_id,
  asset_count: audit.asset_count,
  dimension_count: audit.dimension_count,
  comparison_cells: audit.asset_count * audit.dimension_count,
  asset_states: audit.summary.asset_states,
  normalization_queue_count: audit.summary.normalization_queue_count,
  integrity_blocked_dimension_count: audit.summary.integrity_blocked_dimension_count,
  needs_normalization_dimension_count: audit.summary.needs_normalization_dimension_count,
  committed_artifact_present: fs.existsSync(committedPath),
}, null, 2));
