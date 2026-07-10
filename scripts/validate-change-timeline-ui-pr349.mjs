import fs from 'node:fs';
import path from 'node:path';
import { buildChangeTimelineProjection } from './timeline/build-change-timeline-pr348.mjs';
import { globalNavigationGroups, footerNavigationGroups, siteArchitectureRoutes } from '../config/site-architecture.mjs';

const root = process.cwd();
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const config = readJson('config/change-timeline-ui-v1.json');
const projection = buildChangeTimelineProjection();
const pageSource = readText('src/pages/timeline/index.astro');
const scriptSource = readText('src/scripts/change-timeline-ui.ts');
const cssSource = readText('src/styles/change-timeline-ui.css');
const sitemapSource = readText('src/pages/sitemap-index.xml.ts');
const manifestSource = readText('src/lib/data/manifestBase.ts');
const route = siteArchitectureRoutes.find((row) => row.pattern === '/timeline/');
const machineRoute = siteArchitectureRoutes.find((row) => row.pattern === '/data/change-timeline.json');

const machineAxes = Object.keys(projection.filters ?? {});
const uiFilterIds = config.filters.map((filter) => filter.id);
const preservedAxes = config.preserved_machine_axes ?? [];
const queryParams = config.filters.map((filter) => filter.query_param);

expect(config.schema_version === '1.0', 'Timeline UI config schema version mismatch');
expect(config.config_id === 'sog_change_timeline_ui_pr349_v1', 'Timeline UI config ID mismatch');
expect(config.source_endpoint === '/data/change-timeline.json', 'Timeline UI source endpoint mismatch');
expect(config.route === '/timeline/', 'Timeline UI route mismatch');
expect(config.initial_result_limit === 40, 'Timeline initial result limit must be 40');
expect(config.result_limit_increment === 20, 'Timeline result increment must be 20');
expect(config.filters?.length === 6, `Timeline UI must expose 6 filters, found ${config.filters?.length ?? 0}`);
expect(new Set(uiFilterIds).size === uiFilterIds.length, 'Timeline UI filter IDs must be unique');
expect(new Set(queryParams).size === queryParams.length, 'Timeline UI query params must be unique');
for (const filter of config.filters) {
  expect(machineAxes.includes(filter.id), `${filter.id}: UI filter axis missing from PR #348 projection`);
  expect(typeof filter.label === 'string' && filter.label.length > 0, `${filter.id}: label missing`);
  expect(typeof filter.query_param === 'string' && filter.query_param.length > 0, `${filter.id}: query param missing`);
  expect(['provenance','date_semantics','subject','time','scope'].includes(filter.group), `${filter.id}: unsupported filter group ${filter.group}`);
}
expect(preservedAxes.length === 1 && preservedAxes[0] === 'change_type', 'Timeline UI must preserve change_type as machine-only axis');
expect(new Set([...uiFilterIds, ...preservedAxes]).size === machineAxes.length, 'Timeline UI and preserved axes must be disjoint');
expect(JSON.stringify([...new Set([...uiFilterIds, ...preservedAxes])].sort()) === JSON.stringify([...machineAxes].sort()), 'Timeline UI + preserved axes must cover all PR #348 filter catalogs');
expect(config.url_contract?.search_param === 'q', 'Timeline search query param must be q');
expect(config.url_contract?.filter_params_are_single_value === true, 'Timeline filters must be single-value in v1');
expect(config.url_contract?.unknown_values_ignored === true, 'Timeline must ignore unknown filter values');
expect(config.url_contract?.back_forward_restores_state === true, 'Timeline must restore state on back/forward');
expect(config.presentation_contract?.preserve_projection_order === true, 'Timeline UI must preserve projection order');
expect(config.presentation_contract?.show_date_kind === true, 'Timeline UI must show date kind');
expect(config.presentation_contract?.show_date_semantics === true, 'Timeline UI must show date semantics');
expect(config.presentation_contract?.show_boundary_kind === true, 'Timeline UI must show boundary kind');
expect(config.presentation_contract?.show_source_family === true, 'Timeline UI must show source family');
expect(config.presentation_contract?.single_generic_timestamp === false, 'Timeline UI must reject generic timestamp collapse');
expect(config.presentation_contract?.review_dates_are_change_items === false, 'Timeline UI must not show review dates as change items');
expect(config.presentation_contract?.freshness_dates_are_change_items === false, 'Timeline UI must not show freshness dates as change items');
expect(config.presentation_contract?.single_composite_score === false, 'Timeline UI must not create score');
expect(config.presentation_contract?.risk_ranking === false, 'Timeline UI must not create ranking');
expect(config.next_pr === 350, 'PR #349 next PR must be #350');

expect(projection.item_count === projection.items.length, 'Timeline projection item count mismatch');
expect(projection.item_count > 0, 'Timeline projection must contain items');
expect(projection.projection_rules?.date_semantics_preserved === true, 'Timeline source must preserve date semantics');
expect(projection.projection_rules?.single_generic_timestamp === false, 'Timeline source must reject generic timestamp');
expect(projection.projection_rules?.review_dates_are_change_items === false, 'Timeline source must exclude review dates');
expect(projection.projection_rules?.freshness_dates_are_change_items === false, 'Timeline source must exclude freshness dates');
expect(projection.projection_rules?.single_composite_score === false, 'Timeline source must not emit score');
expect(projection.projection_rules?.risk_ranking === false, 'Timeline source must not emit ranking');

for (const text of [
  'data-timeline-page',
  'data-timeline-search',
  'data-timeline-filter-slot="provenance"',
  'data-timeline-filter-slot="date_semantics"',
  'data-timeline-filter-slot="subject"',
  'data-timeline-filter-slot="time"',
  'data-timeline-filter-slot="scope"',
  'data-timeline-result-count',
  'data-timeline-show-more',
  'Review dates excluded',
  'Observation is not change',
  '/data/change-timeline.json'
]) expect(pageSource.includes(text), `Timeline page missing contract text: ${text}`);

for (const text of [
  'fetch(config.source_endpoint',
  'buildFilters',
  'restoreStateFromUrl',
  "window.addEventListener('popstate'",
  'matchingItems',
  'itemTokens',
  'visibleLimit = config.initial_result_limit',
  'visibleLimit += config.result_limit_increment',
  'createBadge',
  'createMetadata',
  'item.date_semantics',
  'item.boundary_kind',
  'item.source_family'
]) expect(scriptSource.includes(text), `Timeline script missing required behavior: ${text}`);

expect(!scriptSource.includes('editorial-research'), 'Timeline UI must not read editorial research');
expect(!scriptSource.includes('monitoring'), 'Timeline UI must not read monitoring output');
expect(!scriptSource.includes('risk_score'), 'Timeline UI must not calculate risk score');
expect(!scriptSource.includes('.sort('), 'Timeline UI must preserve projection order and not resort items');

for (const text of [
  '.timeline-filter-groups',
  '.timeline-item',
  '.timeline-badge--source',
  '.timeline-badge--boundary',
  '.timeline-item-metadata',
  '@media (max-width: 719px)',
  'min-height: 44px',
  'var(--sog-ink-body)'
]) expect(cssSource.includes(text), `Timeline CSS missing required contract: ${text}`);

expect(route?.source_file === 'src/pages/timeline/index.astro', 'Timeline architecture source mismatch');
expect(route?.output_kind === 'html', 'Timeline architecture output mismatch');
expect(route?.group === 'registry', 'Timeline architecture group mismatch');
expect(route?.role === 'change_timeline_ui', 'Timeline architecture role mismatch');
expect(route?.decision === 'add', 'Timeline route must be marked add');
expect(route?.navigation === 'registry', 'Timeline route must be Registry navigation');
expect(machineRoute?.source_file === 'src/pages/data/change-timeline.json.ts', 'Timeline machine route architecture source mismatch');
expect(machineRoute?.role === 'change_timeline_projection', 'Timeline machine route role mismatch');
expect(machineRoute?.navigation === 'data_manifest', 'Timeline machine route must use data manifest discovery');
expect(globalNavigationGroups.find((group) => group.id === 'registry')?.items.some((item) => item.href === '/timeline/'), 'Registry navigation group must include Timeline');
expect(footerNavigationGroups.find((group) => group.id === 'registry')?.items.some((item) => item.href === '/timeline/'), 'Registry footer group must include Timeline');
expect(sitemapSource.includes("'/timeline/'"), 'sitemap must include Timeline');
expect(manifestSource.includes("ui: '/timeline/'"), 'manifest must advertise Timeline UI route');
expect(manifestSource.includes("'/timeline/'"), 'manifest main routes must include Timeline UI route');

if (failures.length) {
  console.error('PR #349 Change Timeline UI validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  route: config.route,
  source_endpoint: config.source_endpoint,
  item_count: projection.item_count,
  ui_filter_count: config.filters.length,
  preserved_machine_axis_count: preservedAxes.length,
  initial_result_limit: config.initial_result_limit,
  result_limit_increment: config.result_limit_increment,
  earliest_date: projection.summary.earliest_date,
  latest_date: projection.summary.latest_date,
  next_pr: config.next_pr
}, null, 2));
