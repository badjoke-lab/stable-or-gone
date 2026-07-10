import { isDeepStrictEqual } from 'node:util';
import fs from 'node:fs';
import path from 'node:path';
import { buildComparisonProjection } from './comparison/build-comparison-projection-pr343.mjs';
import { buildAccessRegulationIndex, serializeAccessRegulationIndex } from './access-regulation/build-access-regulation-index-pr346.mjs';

const root = process.cwd();
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const contract = readJson('data/quality/access-regulation-index-contract-v1.json');
const governance = readJson('config/market-access-governance-v1.json');
const canonicalMarketAccess = readJson('data/market-access-records-v1.json');
const editorialResearch = readJson('data/editorial-research/japan-stablecoin-market-access-2026.json');
const projection = buildComparisonProjection();
const index = buildAccessRegulationIndex();
const indexRepeat = buildAccessRegulationIndex();
const builderSource = readText('scripts/access-regulation/build-access-regulation-index-pr346.mjs');
const routeSource = readText('src/pages/data/access-regulation-index.json.ts');
const manifestSource = readText('src/lib/data/manifestBase.ts');

const projectionByAsset = new Map(projection.assets.map((asset) => [asset.asset_id, asset]));
const expectedAssetIds = projection.assets.map((asset) => asset.asset_id).sort();
const actualAssetIds = index.rows.map((row) => row.asset_id);
const axes = contract.index_axes ?? [];

const comparisonFacet = (asset, id) => asset.facets.find((row) => row.dimension_id === id);
const uniqueSorted = (values) => [...new Set(values)].sort();
const recomputeFilter = (axis) => {
  const counts = new Map();
  for (const row of index.rows) {
    for (const value of uniqueSorted(row.filter_tokens?.[axis] ?? [])) counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return [...counts.entries()].map(([value, asset_count]) => ({ value, asset_count })).sort((left, right) => right.asset_count - left.asset_count || left.value.localeCompare(right.value));
};

expect(contract.schema_version === '1.0', 'index contract schema version mismatch');
expect(contract.status === 'canonical_public_index_contract', 'index contract status mismatch');
expect(contract.source_projection_id === projection.projection_id, 'index contract projection binding mismatch');
expect(contract.market_access_governance_id === governance.governance_id, 'index contract governance binding mismatch');
expect(contract.endpoint === '/data/access-regulation-index.json', 'index endpoint mismatch');
expect(contract.asset_count === 110, 'index contract asset count mismatch');
expect(contract.source_dimensions?.length === 4, 'index must bind exactly four source dimensions');
for (const dimension of ['lifecycle_semantics','legal_classification_comparability','regulatory_action_scope','market_access_applicability']) expect(contract.source_dimensions?.includes(dimension), `index source dimension missing ${dimension}`);
expect(axes.length === 14, `index must define 14 filter axes, found ${axes.length}`);
expect(new Set(axes).size === axes.length, 'index axes must be unique');
expect(contract.absence_semantics?.no_regulatory_note_means_no_action === false, 'regulatory absence must not imply no action');
expect(contract.absence_semantics?.no_market_access_record_means_unavailable === false, 'Market Access absence must not imply unavailable');
expect(contract.absence_semantics?.unclassified_legal_profile_means_illegal === false, 'unclassified legal profile must not imply illegal');
expect(contract.absence_semantics?.unclassified_legal_profile_means_unregulated === false, 'unclassified legal profile must not imply unregulated');
expect(contract.absence_semantics?.record_presence_is_risk_score === false, 'record presence must not become risk score');
expect(contract.absence_semantics?.record_count_is_risk_score === false, 'record count must not become risk score');
expect(contract.data_safety?.canonical_only === true, 'index contract must be canonical-only');
expect(contract.data_safety?.includes_unreviewed_candidates === false, 'index must exclude unreviewed candidates');
expect(contract.data_safety?.includes_internal_monitoring === false, 'index must exclude internal monitoring');
expect(contract.data_safety?.includes_editorial_research === false, 'index must exclude editorial research');
expect(contract.projection_rules?.readiness_and_freshness_preserved === true, 'index must preserve readiness and freshness');
expect(contract.projection_rules?.single_composite_score === false, 'index must forbid composite score');
expect(contract.projection_rules?.risk_ranking === false, 'index must forbid risk ranking');
expect(contract.next_pr === 347, 'PR #346 next PR must be #347');

expect(index.schema_version === '1.0', 'index schema version mismatch');
expect(index.index_id === contract.contract_id, 'index ID mismatch');
expect(index.status === 'public_canonical_index', 'index status mismatch');
expect(index.generated_at === projection.generated_at, 'index generated_at must bind projection deterministic date');
expect(index.checkpoint_id === projection.checkpoint_id, 'index checkpoint mismatch');
expect(index.source_projection_id === projection.projection_id, 'index source projection mismatch');
expect(index.market_access_governance_id === governance.governance_id, 'index Market Access governance mismatch');
expect(isDeepStrictEqual(index.data_safety, contract.data_safety), 'index data safety differs from contract');
expect(isDeepStrictEqual(index.absence_semantics, contract.absence_semantics), 'index absence semantics differs from contract');
expect(index.single_composite_score === false, 'index must not emit composite score');
expect(index.risk_ranking === false, 'index must not emit risk ranking');
expect(index.asset_count === 110, `index must contain 110 assets, found ${index.asset_count}`);
expect(index.rows?.length === 110, `index rows must contain 110 assets, found ${index.rows?.length ?? 0}`);
expect(JSON.stringify(actualAssetIds) === JSON.stringify(expectedAssetIds), 'index asset order or identity set mismatch');
expect(new Set(actualAssetIds).size === 110, 'index asset IDs must be unique');
expect(serializeAccessRegulationIndex(index) === serializeAccessRegulationIndex(indexRepeat), 'access regulation index must be byte-deterministic across repeated builds');

for (const row of index.rows ?? []) {
  const source = projectionByAsset.get(row.asset_id);
  expect(Boolean(source), `${row.asset_id}: source projection row missing`);
  if (!source) continue;
  expect(row.slug === source.slug, `${row.asset_id}: slug mismatch`);
  expect(row.name === source.name, `${row.asset_id}: name mismatch`);
  expect(row.symbol === source.symbol, `${row.asset_id}: symbol mismatch`);

  const lifecycleFacet = comparisonFacet(source, 'lifecycle_semantics');
  const legalFacet = comparisonFacet(source, 'legal_classification_comparability');
  const regulatoryFacet = comparisonFacet(source, 'regulatory_action_scope');
  const accessFacet = comparisonFacet(source, 'market_access_applicability');
  expect(row.lifecycle_status === lifecycleFacet?.value?.lifecycle_status, `${row.asset_id}: lifecycle status mismatch`);
  expect(isDeepStrictEqual(row.legal.readiness, legalFacet?.readiness), `${row.asset_id}: legal readiness mismatch`);
  expect(isDeepStrictEqual(row.legal.freshness, legalFacet?.freshness), `${row.asset_id}: legal freshness mismatch`);
  expect(isDeepStrictEqual(row.regulatory.readiness, regulatoryFacet?.readiness), `${row.asset_id}: regulatory readiness mismatch`);
  expect(isDeepStrictEqual(row.regulatory.freshness, regulatoryFacet?.freshness), `${row.asset_id}: regulatory freshness mismatch`);
  expect(isDeepStrictEqual(row.market_access.readiness, accessFacet?.readiness), `${row.asset_id}: Market Access readiness mismatch`);
  expect(isDeepStrictEqual(row.market_access.freshness, accessFacet?.freshness), `${row.asset_id}: Market Access freshness mismatch`);

  expect(row.regulatory.record_count === row.regulatory.records.length, `${row.asset_id}: regulatory record count mismatch`);
  expect(row.regulatory.record_state === (row.regulatory.record_count ? 'canonical_records_present' : 'no_canonical_record'), `${row.asset_id}: regulatory record state mismatch`);
  expect(row.market_access.record_count === row.market_access.records.length, `${row.asset_id}: Market Access record count mismatch`);
  expect(row.market_access.record_state === (row.market_access.record_count ? 'canonical_records_present' : 'no_canonical_record'), `${row.asset_id}: Market Access record state mismatch`);

  for (const axis of axes) expect(Array.isArray(row.filter_tokens?.[axis]), `${row.asset_id}: filter token axis missing ${axis}`);
  expect(JSON.stringify(row.filter_tokens.lifecycle_status) === JSON.stringify(row.lifecycle_status ? [row.lifecycle_status] : []), `${row.asset_id}: lifecycle token mismatch`);
  expect(JSON.stringify(row.filter_tokens.legal_profile_state) === JSON.stringify([row.legal.profile_state]), `${row.asset_id}: legal profile-state token mismatch`);
  expect(JSON.stringify(row.filter_tokens.regulatory_record_state) === JSON.stringify([row.regulatory.record_state]), `${row.asset_id}: regulatory record-state token mismatch`);
  expect(JSON.stringify(row.filter_tokens.market_access_record_state) === JSON.stringify([row.market_access.record_state]), `${row.asset_id}: Market Access record-state token mismatch`);
}

expect(index.filters?.length === axes.length, `index filter catalog must contain ${axes.length} axes`);
expect(JSON.stringify(index.filters.map((row) => row.axis)) === JSON.stringify(axes), 'filter axis order must follow contract order');
for (const filter of index.filters ?? []) {
  expect(isDeepStrictEqual(filter.values, recomputeFilter(filter.axis)), `filter catalog count mismatch for ${filter.axis}`);
  for (const value of filter.values ?? []) expect(value.asset_count >= 1 && value.asset_count <= 110, `${filter.axis}/${value.value}: invalid asset_count`);
}

expect(index.summary?.asset_count === 110, 'index summary asset count mismatch');
expect(index.summary?.assets_with_regulatory_records === index.rows.filter((row) => row.regulatory.record_count > 0).length, 'regulatory asset summary mismatch');
expect(index.summary?.regulatory_record_count === index.rows.reduce((sum, row) => sum + row.regulatory.record_count, 0), 'regulatory record summary mismatch');
expect(index.summary?.assets_with_market_access_records === index.rows.filter((row) => row.market_access.record_count > 0).length, 'Market Access asset summary mismatch');
expect(index.summary?.market_access_record_count === index.rows.reduce((sum, row) => sum + row.market_access.record_count, 0), 'Market Access record summary mismatch');

expect(Array.isArray(canonicalMarketAccess) && canonicalMarketAccess.length === 0, 'PR #346 assumes canonical Market Access entrypoint remains empty');
expect(index.summary?.assets_with_market_access_records === 0, 'empty canonical Market Access must yield zero indexed assets with records');
expect(index.summary?.market_access_record_count === 0, 'empty canonical Market Access must yield zero indexed records');
expect(index.rows.every((row) => row.market_access.record_state === 'no_canonical_record'), 'every asset must preserve no_canonical_record while canonical Market Access is empty');
expect(index.rows.every((row) => row.market_access.freshness.state === 'no_canonical_record'), 'Market Access freshness must remain no_canonical_record while canonical entrypoint is empty');

expect(editorialResearch.canonical_boundary?.canonical_action === 'none', 'PR #339 editorial research canonical boundary changed');
expect(editorialResearch.canonical_boundary?.included_in_public_canonical_counts === false, 'PR #339 editorial research entered canonical counts');
expect(!builderSource.includes('editorial-research'), 'index builder must not read editorial research');
expect(!builderSource.includes('monitoring'), 'index builder must not read monitoring output');
expect(!builderSource.includes('risk_score'), 'index builder must not calculate risk score');
expect(!builderSource.includes('rank'), 'index builder must not calculate ranking');

expect(routeSource.includes('getPublicAccessRegulationIndex'), 'public access/regulation route must use deterministic index helper');
expect(routeSource.includes("'content-type': 'application/json; charset=utf-8'"), 'public access/regulation route must emit JSON content type');
expect(manifestSource.includes("access_regulation_index: '/data/access-regulation-index.json'"), 'manifest must advertise access/regulation endpoint');
expect(manifestSource.includes('single_composite_score: false'), 'manifest must preserve no-score boundary');
expect(manifestSource.includes('no_absence_inference: true'), 'manifest must declare no-absence-inference boundary');

if (failures.length) {
  console.error('PR #346 access and regulation index validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  asset_count: index.asset_count,
  legal_profile_states: index.summary.legal_profile_states,
  assets_with_regulatory_records: index.summary.assets_with_regulatory_records,
  regulatory_record_count: index.summary.regulatory_record_count,
  assets_with_market_access_records: index.summary.assets_with_market_access_records,
  market_access_record_count: index.summary.market_access_record_count,
  filter_axis_count: index.filters.length,
  endpoint: contract.endpoint,
  next_pr: contract.next_pr
}, null, 2));
