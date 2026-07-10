import { isDeepStrictEqual } from 'node:util';
import fs from 'node:fs';
import { buildRecordDepthBaseline, serializeRecordDepthBaseline } from './growth/build-record-depth-baseline-pr353.mjs';

const config = JSON.parse(fs.readFileSync('config/record-depth-baseline-v1.json', 'utf8'));
const marketAccess = JSON.parse(fs.readFileSync('data/market-access-records-v1.json', 'utf8'));
const builderSource = fs.readFileSync('scripts/growth/build-record-depth-baseline-pr353.mjs', 'utf8');
const baseline = buildRecordDepthBaseline();
const repeat = buildRecordDepthBaseline();
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const expectedDimensions = [...config.dimensions];
const expectedStates = new Set(config.planning_states);
const forbiddenRankKeys = new Set(['rank', 'ranking', 'rank_position', 'priority_score', 'risk_score', 'safety_score', 'quality_score', 'transparency_score', 'composite_score']);

function walk(value, path = '$') {
  if (Array.isArray(value)) {
    value.forEach((item, index) => walk(item, `${path}[${index}]`));
    return;
  }
  if (!value || typeof value !== 'object') return;
  for (const [key, child] of Object.entries(value)) {
    if (forbiddenRankKeys.has(key)) failures.push(`${path}: forbidden score/rank key ${key}`);
    if ((key.endsWith('_score') || key.endsWith('_rank')) && typeof child === 'number') failures.push(`${path}: numeric score/rank field ${key}`);
    walk(child, `${path}.${key}`);
  }
}

expect(config.schema_version === '1.0', 'baseline config schema version mismatch');
expect(config.config_id === 'sog_record_depth_baseline_pr353_v1', 'baseline config ID mismatch');
expect(config.asset_count === 110, 'baseline config asset_count must be 110');
expect(expectedDimensions.length === 16, `expected 16 dimensions, found ${expectedDimensions.length}`);
expect(new Set(expectedDimensions).size === expectedDimensions.length, 'dimension IDs must be unique');
expect(config.planning_states.length === 6, 'planning state count must be six');
expect(config.public_output === false, 'baseline must remain internal');
expect(config.single_composite_score === false, 'baseline must reject composite score');
expect(config.asset_rank === false, 'baseline must reject asset ranking');
expect(config.queue_policy?.order === 'asset_slug_ascending_non_ranking', 'queue order must remain non-ranking slug order');

expect(baseline.schema_version === '1.0', 'baseline schema version mismatch');
expect(baseline.baseline_id === config.config_id, 'baseline ID mismatch');
expect(baseline.status === 'internal_reviewed_planning_baseline', 'baseline status mismatch');
expect(baseline.public_output === false, 'baseline artifact must remain internal');
expect(baseline.single_composite_score === false, 'baseline artifact must not expose composite score');
expect(baseline.asset_rank === false, 'baseline artifact must not rank assets');
expect(baseline.asset_count === 110, `baseline must evaluate 110 assets, found ${baseline.asset_count}`);
expect(baseline.assets.length === 110, `baseline asset rows must be 110, found ${baseline.assets.length}`);
expect(baseline.dimension_count === 16, `baseline dimension_count must be 16, found ${baseline.dimension_count}`);
expect(baseline.cell_count === 1760, `baseline cell_count must be 1760, found ${baseline.cell_count}`);
expect(JSON.stringify(baseline.dimension_order) === JSON.stringify(expectedDimensions), 'baseline dimension order mismatch');
expect(JSON.stringify(baseline.planning_states) === JSON.stringify(config.planning_states), 'baseline planning states mismatch');
expect(typeof baseline.input_digest_sha256 === 'string' && /^[a-f0-9]{64}$/.test(baseline.input_digest_sha256), 'global input digest must be SHA-256 hex');
expect(serializeRecordDepthBaseline(baseline) === serializeRecordDepthBaseline(repeat), 'repeated baseline builds must be byte-identical');
expect(isDeepStrictEqual(baseline, repeat), 'repeated baseline object builds must be deeply equal');

const assetIds = new Set();
const slugs = [];
for (const asset of baseline.assets) {
  expect(typeof asset.asset_id === 'string' && asset.asset_id.length > 0, 'asset_id missing');
  expect(!assetIds.has(asset.asset_id), `duplicate asset_id ${asset.asset_id}`);
  assetIds.add(asset.asset_id);
  expect(typeof asset.asset_slug === 'string' && asset.asset_slug.length > 0, `${asset.asset_id}: slug missing`);
  slugs.push(asset.asset_slug);
  expect(typeof asset.asset_name === 'string' && asset.asset_name.length > 0, `${asset.asset_id}: name missing`);
  expect(Array.isArray(asset.dimension_states) && asset.dimension_states.length === 16, `${asset.asset_slug}: must have 16 dimension states`);
  const dimensionIds = asset.dimension_states.map((row) => row.dimension_id);
  expect(JSON.stringify(dimensionIds) === JSON.stringify(expectedDimensions), `${asset.asset_slug}: dimension set/order mismatch`);
  expect(new Set(dimensionIds).size === 16, `${asset.asset_slug}: duplicate dimension state`);
  for (const row of asset.dimension_states) {
    expect(expectedStates.has(row.state), `${asset.asset_slug}/${row.dimension_id}: invalid planning state ${row.state}`);
    expect(Array.isArray(row.reason_codes) && row.reason_codes.length > 0, `${asset.asset_slug}/${row.dimension_id}: reason codes missing`);
    expect(typeof row.metrics === 'object' && row.metrics !== null && !Array.isArray(row.metrics), `${asset.asset_slug}/${row.dimension_id}: metrics must be object`);
  }
  const recomputedGaps = asset.dimension_states.filter((row) => ['partial', 'sparse', 'absent'].includes(row.state)).map((row) => row.dimension_id).sort();
  expect(JSON.stringify(asset.priority_gaps) === JSON.stringify(recomputedGaps), `${asset.asset_slug}: priority gap list mismatch`);
  expect(typeof asset.input_digest === 'string' && /^[a-f0-9]{64}$/.test(asset.input_digest), `${asset.asset_slug}: input digest invalid`);
  const flags = asset.product_leverage_flags ?? {};
  for (const key of ['compare_leverage','timeline_leverage','access_regulation_leverage','evidence_maintenance_leverage','historical_importance','regional_relevance']) {
    expect(typeof flags[key] === 'boolean', `${asset.asset_slug}: leverage flag ${key} must be boolean`);
  }
}
expect(new Set(slugs).size === 110, 'asset slugs must be unique');
expect(JSON.stringify(slugs) === JSON.stringify([...slugs].sort()), 'asset rows must be slug-sorted');

const allCells = baseline.assets.flatMap((asset) => asset.dimension_states);
const recomputedStateCounts = Object.fromEntries(config.planning_states.map((state) => [state, allCells.filter((row) => row.state === state).length]));
expect(isDeepStrictEqual(baseline.summary.state_counts, recomputedStateCounts), 'global state summary does not reconcile');
expect(Array.isArray(baseline.summary.dimension_states) && baseline.summary.dimension_states.length === 16, 'dimension summary length mismatch');
for (const dimensionId of expectedDimensions) {
  const summary = baseline.summary.dimension_states.find((row) => row.dimension_id === dimensionId);
  expect(Boolean(summary), `summary missing dimension ${dimensionId}`);
  if (!summary) continue;
  const recomputed = Object.fromEntries(config.planning_states.map((state) => [state, baseline.assets.filter((asset) => asset.dimension_states.find((row) => row.dimension_id === dimensionId)?.state === state).length]));
  expect(isDeepStrictEqual(summary.state_counts, recomputed), `dimension summary mismatch for ${dimensionId}`);
  expect(Object.values(summary.state_counts).reduce((sum, value) => sum + value, 0) === 110, `dimension summary count must total 110 for ${dimensionId}`);
}

expect(Array.isArray(baseline.tier_a_candidate_queue), 'Tier A candidate queue must be array');
expect(baseline.summary.tier_a_candidate_count === baseline.tier_a_candidate_queue.length, 'Tier A queue summary count mismatch');
const queueSlugs = baseline.tier_a_candidate_queue.map((row) => row.asset_slug);
expect(JSON.stringify(queueSlugs) === JSON.stringify([...queueSlugs].sort()), 'Tier A queue must be slug-sorted, not ranked');
expect(new Set(queueSlugs).size === queueSlugs.length, 'Tier A queue slugs must be unique');
for (const row of baseline.tier_a_candidate_queue) {
  expect(assetIds.has(row.asset_id), `Tier A queue references unknown asset ${row.asset_id}`);
  expect(Array.isArray(row.reasons) && row.reasons.length > 0, `${row.asset_slug}: queue reasons missing`);
  expect(Array.isArray(row.priority_gaps) && row.priority_gaps.length >= config.queue_policy.minimum_priority_gap_count, `${row.asset_slug}: queue must meet minimum gap count`);
  expect(!Object.prototype.hasOwnProperty.call(row, 'rank'), `${row.asset_slug}: rank forbidden`);
  expect(!Object.prototype.hasOwnProperty.call(row, 'score'), `${row.asset_slug}: score forbidden`);
}

walk(baseline);

expect(!builderSource.includes("scripts/monitoring/"), 'builder must not read monitoring directory');
expect(!builderSource.includes('editorial-research'), 'builder must not read editorial research');
expect(!builderSource.includes('news-discovery'), 'builder must not read discovery leads');
expect(!builderSource.includes('private-notes'), 'builder must not read private notes');
expect(!builderSource.includes('candidate-urls'), 'builder must not read candidate URLs');

if (marketAccess.length === 0) {
  const accessCells = baseline.assets.map((asset) => asset.dimension_states.find((row) => row.dimension_id === 'canonical_market_access'));
  expect(accessCells.every((row) => row?.state === 'absent'), 'empty canonical Market Access source must map all 110 planning cells to absent');
  expect(accessCells.every((row) => row?.reason_codes.includes('no_canonical_market_access_records_no_unavailability_claim')), 'Market Access absence must explicitly avoid unavailability claim');
}

expect(baseline.tier_a_candidate_queue.length > 0, 'Tier A candidate queue must not be empty');
expect(baseline.tier_a_candidate_queue.length < 110, 'Tier A candidate queue must remain selective and not include all assets');

if (failures.length) {
  console.error('PR #353 Record Depth baseline validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  asset_count: baseline.asset_count,
  dimension_count: baseline.dimension_count,
  cell_count: baseline.cell_count,
  state_counts: baseline.summary.state_counts,
  tier_a_candidate_count: baseline.tier_a_candidate_queue.length,
  market_access_source_count: marketAccess.length,
  queue_order: baseline.queue_order,
  input_digest_sha256: baseline.input_digest_sha256
}, null, 2));
