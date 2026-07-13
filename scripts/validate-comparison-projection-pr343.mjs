import { isDeepStrictEqual } from 'node:util';
import fs from 'node:fs';
import path from 'node:path';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';
import { buildComparisonProjection, serializeComparisonProjection } from './comparison/build-comparison-projection-pr343.mjs';
import { buildComparisonReadinessAudit } from './comparison/build-readiness-audit-pr337.mjs';
import { buildFacetFreshnessAudit } from './comparison/build-facet-freshness-pr342.mjs';

const root = process.cwd();
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const contract = readJson('data/quality/comparison-projection-contract-v1.json');
const readiness = buildComparisonReadinessAudit();
const freshness = buildFacetFreshnessAudit();
const projection = buildComparisonProjection();
const projectionRepeat = buildComparisonProjection();
const baseline = loadRegistryV2Baseline(root);
const marketAccess = readJson('data/market-access-records-v1.json');
const editorialResearch = readJson('data/editorial-research/japan-stablecoin-market-access-2026.json');
const routeSource = readText('src/pages/data/comparison.json.ts');
const manifestSource = readText('src/lib/data/manifestBase.ts');

const stablecoins = (baseline.data_groups?.stablecoins ?? []).flatMap(readJson).sort((a, b) => a.id.localeCompare(b.id));
const expectedAssetIds = stablecoins.map((row) => row.id);
const expectedAssetCount = expectedAssetIds.length;
const expectedDimensionCount = 19;
const expectedCellCount = expectedAssetCount * expectedDimensionCount;
const marketAccessAssetIds = new Set((marketAccess ?? []).map((row) => row.asset_id).filter(Boolean));
const forbiddenKeys = new Set(contract.excluded_internal_fields ?? []);
const discoveredForbidden = [];
const walk = (value, currentPath = '$') => {
  if (Array.isArray(value)) {
    value.forEach((item, index) => walk(item, `${currentPath}[${index}]`));
    return;
  }
  if (!value || typeof value !== 'object') return;
  for (const [key, child] of Object.entries(value)) {
    if (forbiddenKeys.has(key)) discoveredForbidden.push(`${currentPath}.${key}`);
    walk(child, `${currentPath}.${key}`);
  }
};
walk(projection);

expect(contract.schema_version === '1.0', 'projection contract schema version mismatch');
expect(contract.status === 'canonical_public_projection_contract', 'projection contract status mismatch');
expect(contract.readiness_contract_id === readiness.contract_id, 'projection contract readiness binding mismatch');
expect(contract.freshness_contract_id === freshness.contract_id, 'projection contract freshness binding mismatch');
expect(contract.endpoint === '/data/comparison.json', 'projection endpoint mismatch');
expect(contract.asset_count === expectedAssetCount, `projection contract asset count must be ${expectedAssetCount}`);
expect(contract.dimension_count === expectedDimensionCount, 'projection contract dimension count mismatch');
expect(contract.cell_count === expectedCellCount, `projection contract cell count must be ${expectedCellCount}`);
expect(contract.data_safety?.canonical_only === true, 'projection must be canonical-only');
expect(contract.data_safety?.includes_unreviewed_candidates === false, 'projection must exclude unreviewed candidates');
expect(contract.data_safety?.includes_internal_monitoring === false, 'projection must exclude monitoring');
expect(contract.data_safety?.includes_private_notes === false, 'projection must exclude private notes');
expect(contract.data_safety?.includes_normalization_queue === false, 'projection must exclude normalization queue');
expect(contract.data_safety?.includes_editorial_research === false, 'projection must exclude editorial research');
expect(contract.projection_rules?.readiness_and_freshness_are_separate_axes === true, 'readiness and freshness must remain separate axes');
expect(contract.projection_rules?.single_composite_score === false, 'composite score must be disabled');
expect(contract.projection_rules?.missing_record_is_not_negative_claim === true, 'missing-record boundary must remain explicit');
expect(contract.projection_rules?.unknown_states_preserved === true, 'unknown states must be preserved');
expect(contract.next_pr === 344, 'PR #343 next PR must be #344');

expect(projection.schema_version === '1.0', 'projection schema version mismatch');
expect(projection.status === 'public_canonical_projection', 'projection status mismatch');
expect(projection.generated_at === freshness.as_of_date, 'projection generated_at must bind deterministic freshness as_of_date');
expect(projection.checkpoint_id === readiness.checkpoint_id, 'projection checkpoint mismatch');
expect(projection.readiness_contract_id === readiness.contract_id, 'projection readiness contract mismatch');
expect(projection.freshness_contract_id === freshness.contract_id, 'projection freshness contract mismatch');
expect(projection.projection_contract_id === contract.contract_id, 'projection contract ID mismatch');
expect(isDeepStrictEqual(projection.data_safety, contract.data_safety), 'projection data safety differs from contract');
expect(projection.asset_count === expectedAssetCount, `projection asset count must be ${expectedAssetCount}, found ${projection.asset_count}`);
expect(projection.dimension_count === expectedDimensionCount, `projection dimension count must be ${expectedDimensionCount}, found ${projection.dimension_count}`);
expect(projection.cell_count === expectedCellCount, `projection cell count must be ${expectedCellCount}, found ${projection.cell_count}`);
expect(projection.single_composite_score === false, 'projection must not emit composite score');
expect(projection.dimensions?.length === expectedDimensionCount, `projection dimension metadata must contain ${expectedDimensionCount} rows`);
expect(projection.assets?.length === expectedAssetCount, `projection must contain ${expectedAssetCount} asset rows`);
expect(discoveredForbidden.length === 0, `projection contains forbidden internal fields: ${discoveredForbidden.join(', ')}`);

const projectedAssetIds = projection.assets.map((row) => row.asset_id);
expect(isDeepStrictEqual(projectedAssetIds, expectedAssetIds), 'projection asset ordering or identity set mismatch');
expect(serializeComparisonProjection(projection) === serializeComparisonProjection(projectionRepeat), 'comparison projection must be byte-deterministic across repeated builds');

const readinessByAsset = new Map(readiness.assets.map((row) => [row.asset_id, row]));
const freshnessByAsset = new Map(freshness.assets.map((row) => [row.asset_id, row]));
const dimensionOrder = readiness.summary.dimension_states.map((row) => row.dimension_id);

for (const asset of projection.assets) {
  const readinessAsset = readinessByAsset.get(asset.asset_id);
  const freshnessAsset = freshnessByAsset.get(asset.asset_id);
  expect(Boolean(readinessAsset), `${asset.asset_id}: missing readiness source row`);
  expect(Boolean(freshnessAsset), `${asset.asset_id}: missing freshness source row`);
  expect(asset.overall_readiness === readinessAsset?.overall_state, `${asset.asset_id}: overall readiness mismatch`);
  expect(asset.facets?.length === expectedDimensionCount, `${asset.asset_id}: projection must contain ${expectedDimensionCount} facets`);
  expect(isDeepStrictEqual(asset.facets.map((row) => row.dimension_id), dimensionOrder), `${asset.asset_id}: facet ordering differs from readiness contract order`);
  expect(new Set(asset.facets.map((row) => row.dimension_id)).size === expectedDimensionCount, `${asset.asset_id}: duplicate projected dimension`);

  for (const facet of asset.facets ?? []) {
    const readinessRow = readinessAsset?.dimensions.find((row) => row.dimension_id === facet.dimension_id);
    const freshnessRow = freshnessAsset?.facets.find((row) => row.dimension_id === facet.dimension_id);
    expect(Boolean(readinessRow), `${asset.asset_id}/${facet.dimension_id}: readiness row missing`);
    expect(Boolean(freshnessRow), `${asset.asset_id}/${facet.dimension_id}: freshness row missing`);
    expect(isDeepStrictEqual(facet.readiness, { state: readinessRow?.state, scored: readinessRow?.readiness_scored }), `${asset.asset_id}/${facet.dimension_id}: public readiness axis mismatch`);
    expect(isDeepStrictEqual(facet.freshness, {
      state: freshnessRow?.freshness_state,
      anchor_date: freshnessRow?.anchor_date,
      age_days: freshnessRow?.age_days,
      date_semantics: freshnessRow?.date_semantics,
      inherited_review_anchor: freshnessRow?.inherited_review_anchor
    }), `${asset.asset_id}/${facet.dimension_id}: public freshness axis mismatch`);
    expect(Object.prototype.hasOwnProperty.call(facet, 'value'), `${asset.asset_id}/${facet.dimension_id}: value field missing`);
    expect(Object.prototype.hasOwnProperty.call(facet, 'readiness'), `${asset.asset_id}/${facet.dimension_id}: readiness field missing`);
    expect(Object.prototype.hasOwnProperty.call(facet, 'freshness'), `${asset.asset_id}/${facet.dimension_id}: freshness field missing`);
  }

  const accessFacet = asset.facets.find((row) => row.dimension_id === 'market_access_applicability');
  const hasCanonicalAccess = marketAccessAssetIds.has(asset.asset_id);
  if (hasCanonicalAccess) {
    expect(accessFacet?.value?.record_state === 'canonical_records_present', `${asset.asset_id}: canonical Market Access records not projected`);
    expect(accessFacet?.value?.record_count > 0, `${asset.asset_id}: canonical Market Access record count missing`);
    expect(accessFacet?.freshness?.state !== 'no_canonical_record', `${asset.asset_id}: canonical Market Access freshness incorrectly absent`);
  } else {
    expect(accessFacet?.value?.record_state === 'no_canonical_record', `${asset.asset_id}: missing Market Access must project no_canonical_record`);
    expect(accessFacet?.value?.record_count === 0 && accessFacet?.value?.records?.length === 0, `${asset.asset_id}: missing Market Access must not fabricate records`);
    expect(accessFacet?.freshness?.state === 'no_canonical_record', `${asset.asset_id}: missing Market Access freshness must remain no_canonical_record`);
  }
}

const allFacets = projection.assets.flatMap((asset) => asset.facets);
expect(allFacets.length === expectedCellCount, 'flattened projection cell count mismatch');
const marketAccessFacets = allFacets.filter((row) => row.dimension_id === 'market_access_applicability');
expect(marketAccessFacets.length === expectedAssetCount, `Market Access projection must contain ${expectedAssetCount} facets`);
expect(Array.isArray(marketAccess), 'canonical Market Access records must be an array');
expect(editorialResearch.canonical_boundary?.included_in_public_canonical_counts === false, 'editorial research entered canonical counts');

const readinessSummaryCount = Object.values(projection.summary?.readiness_asset_states ?? {}).reduce((sum, value) => sum + value, 0);
const freshnessSummaryCount = Object.values(projection.summary?.freshness_states ?? {}).reduce((sum, value) => sum + value, 0);
expect(readinessSummaryCount === expectedAssetCount, `projection readiness asset summary must total ${expectedAssetCount}, found ${readinessSummaryCount}`);
expect(freshnessSummaryCount === expectedCellCount, `projection freshness summary must total ${expectedCellCount}, found ${freshnessSummaryCount}`);

expect(routeSource.includes('getPublicComparisonProjection'), 'public comparison route must use deterministic comparison data helper');
expect(routeSource.includes("'content-type': 'application/json; charset=utf-8'"), 'public comparison route must emit JSON content type');
expect(manifestSource.includes("comparison: '/data/comparison.json'"), 'manifest must advertise comparison endpoint');
expect(manifestSource.includes('deterministic_comparison_projection'), 'manifest must declare comparison projection data model');
expect(manifestSource.includes('readiness_and_freshness_separate: true'), 'manifest must preserve separate readiness/freshness axes');
expect(manifestSource.includes('single_composite_score: false'), 'manifest must state no composite comparison score');

if (failures.length) {
  console.error('PR #343 comparison projection validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  asset_count: projection.asset_count,
  dimension_count: projection.dimension_count,
  cell_count: projection.cell_count,
  readiness_asset_states: projection.summary.readiness_asset_states,
  freshness_states: projection.summary.freshness_states,
  market_access_assets: marketAccessAssetIds.size,
  market_access_no_canonical_record: marketAccessFacets.filter((facet) => facet.value.record_state === 'no_canonical_record').length,
  endpoint: contract.endpoint,
  next_pr: contract.next_pr
}, null, 2));
