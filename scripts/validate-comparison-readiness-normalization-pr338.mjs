import fs from 'node:fs';
import path from 'node:path';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';
import { buildComparisonReadinessAudit } from './comparison/build-readiness-audit-pr337.mjs';

const root = process.cwd();
const read = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const queue = read('data/quality/comparison-readiness-normalization-queue-pr337.json');
const checkpoint = read('docs/migration/current-canonical-checkpoint.json');
const baseline = loadRegistryV2Baseline(root);
const classificationRows = (baseline.data_groups?.classifications ?? []).flatMap(read);
const classificationById = new Map(classificationRows.map((row) => [row.id, row]));
const audit = buildComparisonReadinessAudit();

const expectedTargets = [
  'sog_st_busd',
  'sog_st_crvusd',
  'sog_st_dai',
  'sog_st_eurc',
  'sog_st_fdusd',
  'sog_st_frax',
  'sog_st_gusd',
  'sog_st_lusd',
  'sog_st_pyusd',
  'sog_st_rlusd',
  'sog_st_susd',
  'sog_st_tusd',
  'sog_st_usdc',
  'sog_st_usdd',
  'sog_st_usde',
  'sog_st_usdg',
  'sog_st_usdp',
  'sog_st_usds',
  'sog_st_usdt',
  'sog_st_ust'
];

expect(queue.schema_version === '1.0', 'normalization queue schema_version must be 1.0');
expect(queue.queue_id === 'sog_comparison_readiness_normalization_queue_pr337', 'normalization queue_id mismatch');
expect(queue.source_audit_id === 'sog_comparison_readiness_audit_pr337_110_assets', 'normalization queue source_audit_id mismatch');
expect(queue.source_checkpoint_id === checkpoint.checkpoint_id, 'normalization queue checkpoint mismatch');
expect(queue.source_input_digest_sha256 === '7201149f8b4c5fc346d9668e44cecf52024e00b2c708843a93fb22cc443e58a2', 'normalization queue source digest mismatch');
expect(queue.queue_count === 20, `normalization queue_count must be 20, found ${queue.queue_count}`);
expect((queue.rows ?? []).length === 20, `normalization queue must contain 20 rows, found ${(queue.rows ?? []).length}`);
expect(queue.dimension_counts?.asset_class === 20, 'asset_class dimension count must be 20');

const targetIds = (queue.rows ?? []).map((row) => row.asset_id);
expect(new Set(targetIds).size === 20, 'normalization target asset IDs must be unique');
expect(JSON.stringify([...targetIds].sort()) === JSON.stringify([...expectedTargets].sort()), 'normalization target set mismatch reviewed PR #337 queue');

for (const row of queue.rows ?? []) {
  expect(row.dimension_id === 'asset_class', `${row.asset_id}: dimension must be asset_class`);
  expect(row.state === 'needs_normalization', `${row.asset_id}: source state must be needs_normalization`);
  expect(row.severity === 'medium', `${row.asset_id}: source severity must be medium`);
  expect(row.reason_code === 'missing_asset_class', `${row.asset_id}: reason_code must be missing_asset_class`);
  const classification = classificationById.get(row.asset_id);
  expect(Boolean(classification), `${row.asset_id}: canonical classification missing`);
  expect(classification?.asset_class === 'stablecoin', `${row.asset_id}: asset_class must normalize to stablecoin`);
}

expect(checkpoint.asset_count === 110, `checkpoint asset_count must remain 110, found ${checkpoint.asset_count}`);
expect(audit.checkpoint_id === checkpoint.checkpoint_id, 're-audit checkpoint mismatch');
expect(audit.asset_count === 110, `re-audit asset_count must be 110, found ${audit.asset_count}`);
expect(audit.dimension_count === 19, `re-audit dimension_count must be 19, found ${audit.dimension_count}`);
expect(audit.asset_count * audit.dimension_count === 2090, 're-audit must contain 2,090 comparison cells');
expect(audit.summary?.normalization_queue_count === 0, `re-audit normalization queue must be empty, found ${audit.summary?.normalization_queue_count}`);
expect((audit.normalization_queue ?? []).length === 0, `re-audit normalization queue rows must be 0, found ${(audit.normalization_queue ?? []).length}`);
expect(audit.summary?.integrity_blocked_dimension_count === 0, 're-audit must have zero integrity-blocked dimensions');
expect(audit.summary?.needs_normalization_dimension_count === 0, 're-audit must have zero needs-normalization dimensions');
expect(audit.summary?.asset_states?.ready === 0, 're-audit ready asset count must remain 0 under explicit-unknown semantics');
expect(audit.summary?.asset_states?.ready_with_unknowns === 110, `re-audit ready_with_unknowns count must be 110, found ${audit.summary?.asset_states?.ready_with_unknowns}`);
expect(audit.summary?.asset_states?.needs_normalization === 0, 're-audit needs_normalization asset count must be 0');
expect(audit.summary?.asset_states?.integrity_blocked === 0, 're-audit integrity_blocked asset count must be 0');

const assetClassSummary = audit.summary?.dimension_states?.find((row) => row.dimension_id === 'asset_class');
expect(assetClassSummary?.state_counts?.ready === 110, `asset_class ready count must be 110, found ${assetClassSummary?.state_counts?.ready}`);
expect(assetClassSummary?.state_counts?.needs_normalization === 0, 'asset_class normalization count must be 0');

const marketSummary = audit.summary?.dimension_states?.find((row) => row.dimension_id === 'market_access_applicability');
expect(marketSummary?.readiness_scored === false, 'market access must remain unscored');
expect(marketSummary?.state_counts?.ready_with_unknowns === 110, 'market access must remain deferred for all 110 assets');
for (const asset of audit.assets ?? []) {
  const market = asset.dimensions.find((row) => row.dimension_id === 'market_access_applicability');
  expect(market?.state === 'ready_with_unknowns', `${asset.asset_id}: market access state must remain ready_with_unknowns`);
  expect(market?.readiness_scored === false, `${asset.asset_id}: market access must remain unscored`);
  expect(market?.reason_codes?.includes('deferred_canonical_schema'), `${asset.asset_id}: market access reason must remain deferred_canonical_schema`);
}

if (failures.length) {
  console.error('PR #338 Comparison Readiness normalization validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  source_queue_count: queue.queue_count,
  normalized_asset_count: targetIds.length,
  checkpoint_id: audit.checkpoint_id,
  asset_count: audit.asset_count,
  dimension_count: audit.dimension_count,
  comparison_cells: audit.asset_count * audit.dimension_count,
  asset_states: audit.summary.asset_states,
  normalization_queue_count: audit.summary.normalization_queue_count,
  integrity_blocked_dimension_count: audit.summary.integrity_blocked_dimension_count,
  needs_normalization_dimension_count: audit.summary.needs_normalization_dimension_count,
  market_access_deferred_assets: marketSummary?.state_counts?.ready_with_unknowns
}, null, 2));
