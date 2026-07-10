import fs from 'node:fs';
import path from 'node:path';
import { buildAccessRegulationIndex } from './access-regulation/build-access-regulation-index-pr346.mjs';
import { globalNavigationGroups, footerNavigationGroups, siteArchitectureRoutes } from '../config/site-architecture.mjs';

const root = process.cwd();
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const config = readJson('config/access-regulation-explorer-v1.json');
const index = buildAccessRegulationIndex();
const pageSource = readText('src/pages/access-regulation/index.astro');
const scriptSource = readText('src/scripts/access-regulation-explorer.ts');
const cssSource = readText('src/styles/access-regulation-explorer.css');
const sitemapSource = readText('src/pages/sitemap-index.xml.ts');
const manifestSource = readText('src/lib/data/manifestBase.ts');
const route = siteArchitectureRoutes.find((row) => row.pattern === '/access-regulation/');

const indexAxes = index.filters.map((filter) => filter.axis);
const uiFilterIds = config.filters.map((filter) => filter.id);
const preservedAxes = config.preserved_machine_axes ?? [];
const queryParams = config.filters.map((filter) => filter.query_param);
const recomputedRegulatoryAssets = index.rows.filter((row) => row.regulatory.record_count > 0).length;
const recomputedRegulatoryRecords = index.rows.reduce((sum, row) => sum + row.regulatory.record_count, 0);
const recomputedMarketAccessAssets = index.rows.filter((row) => row.market_access.record_count > 0).length;
const recomputedMarketAccessRecords = index.rows.reduce((sum, row) => sum + row.market_access.record_count, 0);

expect(config.schema_version === '1.0', 'Explorer config schema version mismatch');
expect(config.config_id === 'sog_access_regulation_explorer_pr347_v1', 'Explorer config ID mismatch');
expect(config.source_endpoint === '/data/access-regulation-index.json', 'Explorer source endpoint mismatch');
expect(config.route === '/access-regulation/', 'Explorer route mismatch');
expect(config.initial_result_limit === 50, 'Explorer initial result limit must be 50');
expect(config.result_limit_increment === 25, 'Explorer result increment must be 25');
expect(config.filters?.length === 9, `Explorer must expose 9 v1 filters, found ${config.filters?.length ?? 0}`);
expect(new Set(uiFilterIds).size === uiFilterIds.length, 'Explorer filter IDs must be unique');
expect(new Set(queryParams).size === queryParams.length, 'Explorer filter query params must be unique');
for (const filter of config.filters) {
  expect(indexAxes.includes(filter.id), `${filter.id}: UI filter axis missing from PR #346 index`);
  expect(typeof filter.label === 'string' && filter.label.length > 0, `${filter.id}: label missing`);
  expect(typeof filter.query_param === 'string' && filter.query_param.length > 0, `${filter.id}: query param missing`);
  expect(['record_state','legal','regulatory','market_access'].includes(filter.group), `${filter.id}: unsupported filter group ${filter.group}`);
}
expect(preservedAxes.length === 5, 'Explorer must preserve 5 machine-only axes outside v1 UI');
expect(new Set([...uiFilterIds, ...preservedAxes]).size === 14, 'UI and preserved machine axes must be disjoint');
expect(JSON.stringify([...new Set([...uiFilterIds, ...preservedAxes])].sort()) === JSON.stringify([...indexAxes].sort()), 'Explorer UI + preserved axes must cover all 14 PR #346 axes');
expect(config.url_contract?.search_param === 'q', 'Explorer search query param must be q');
expect(config.url_contract?.filter_params_are_single_value === true, 'Explorer v1 filters must be single-value');
expect(config.url_contract?.unknown_values_ignored === true, 'Explorer must ignore unknown filter values');
expect(config.url_contract?.back_forward_restores_state === true, 'Explorer must restore state on back/forward');
expect(config.presentation_contract?.single_composite_score === false, 'Explorer must not create composite score');
expect(config.presentation_contract?.risk_ranking === false, 'Explorer must not create risk ranking');
expect(config.presentation_contract?.sort_order === 'canonical_asset_id', 'Explorer sort order must remain canonical asset ID');
expect(config.presentation_contract?.no_absence_inference === true, 'Explorer must preserve no-absence-inference boundary');
expect(config.presentation_contract?.readiness_and_freshness_visible === true, 'Explorer must display readiness and freshness');
expect(config.next_pr === 348, 'PR #347 next PR must be #348');

expect(index.asset_count === 110, 'Explorer index asset count must remain 110');
expect(index.single_composite_score === false, 'Explorer index must not emit composite score');
expect(index.risk_ranking === false, 'Explorer index must not emit risk ranking');
expect(index.rows.length === 110, 'Explorer index row count mismatch');
expect(index.rows.every((row, indexPosition) => indexPosition === 0 || index.rows[indexPosition - 1].asset_id.localeCompare(row.asset_id) < 0), 'Explorer source rows must remain canonical asset ID order');
expect(index.summary.assets_with_regulatory_records === recomputedRegulatoryAssets, 'Explorer regulatory asset summary must reconcile from rows');
expect(index.summary.regulatory_record_count === recomputedRegulatoryRecords, 'Explorer regulatory record summary must reconcile from rows');
expect(index.summary.assets_with_market_access_records === recomputedMarketAccessAssets, 'Explorer Market Access asset summary must reconcile from rows');
expect(index.summary.market_access_record_count === recomputedMarketAccessRecords, 'Explorer Market Access record summary must reconcile from rows');

for (const text of [
  'data-ar-explorer',
  'data-ar-search',
  'data-ar-filter-slot="legal"',
  'data-ar-filter-slot="regulatory"',
  'data-ar-filter-slot="market_access"',
  'data-ar-result-count',
  'data-ar-show-more',
  'No Regulatory Note',
  'No Market Access Record',
  'Unclassified legal profile',
  '/data/access-regulation-index.json'
]) expect(pageSource.includes(text), `Explorer page missing contract text: ${text}`);

for (const text of [
  'fetch(config.source_endpoint',
  'buildFilters',
  'restoreStateFromUrl',
  "window.addEventListener('popstate'",
  'matchingRows',
  'row.filter_tokens[filter.id]',
  'visibleLimit = config.initial_result_limit',
  'visibleLimit += config.result_limit_increment',
  'stateBadges',
  'freshnessMeta',
  'row.regulatory.records',
  'row.market_access.records'
]) expect(scriptSource.includes(text), `Explorer script missing required behavior: ${text}`);

expect(!scriptSource.includes('sort((left, right) => right'), 'Explorer must not sort results by descending metric');
expect(!scriptSource.includes('risk_score'), 'Explorer must not calculate risk score');
expect(!scriptSource.includes('editorial-research'), 'Explorer must not read editorial research');
expect(!scriptSource.includes('monitoring'), 'Explorer must not read monitoring output');

for (const text of ['.ar-filter-groups', '.ar-result-card', '.ar-card-layers', '.ar-badge--readiness', '.ar-badge--freshness', '@media (max-width: 719px)', 'min-height: 44px', 'var(--sog-ink-body)']) {
  expect(cssSource.includes(text), `Explorer CSS missing required contract: ${text}`);
}

expect(route?.source_file === 'src/pages/access-regulation/index.astro', 'Explorer architecture source mismatch');
expect(route?.output_kind === 'html', 'Explorer architecture output mismatch');
expect(route?.group === 'registry', 'Explorer architecture group mismatch');
expect(route?.role === 'access_regulation_explorer', 'Explorer architecture role mismatch');
expect(route?.decision === 'add', 'Explorer route must be marked add');
expect(route?.navigation === 'registry', 'Explorer route must be Registry navigation');
expect(globalNavigationGroups.find((group) => group.id === 'registry')?.items.some((item) => item.href === '/access-regulation/'), 'Registry navigation group must include Explorer');
expect(footerNavigationGroups.find((group) => group.id === 'registry')?.items.some((item) => item.href === '/access-regulation/'), 'Registry footer group must include Explorer');
expect(sitemapSource.includes("'/access-regulation/'"), 'sitemap must include Explorer');
expect(manifestSource.includes("explorer: '/access-regulation/'"), 'manifest must advertise Explorer route');
expect(manifestSource.includes("'/access-regulation/'"), 'manifest main routes must include Explorer route');

if (failures.length) {
  console.error('PR #347 Access Regulation Explorer validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  route: config.route,
  asset_count: index.asset_count,
  ui_filter_count: config.filters.length,
  preserved_machine_axis_count: preservedAxes.length,
  initial_result_limit: config.initial_result_limit,
  regulatory_assets: index.summary.assets_with_regulatory_records,
  regulatory_records: index.summary.regulatory_record_count,
  market_access_assets: index.summary.assets_with_market_access_records,
  next_pr: config.next_pr
}, null, 2));
