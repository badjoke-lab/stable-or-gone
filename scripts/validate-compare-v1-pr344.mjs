import fs from 'node:fs';
import path from 'node:path';
import { buildComparisonProjection } from './comparison/build-comparison-projection-pr343.mjs';
import { primaryNavigation, globalNavigationGroups, footerNavigationGroups, siteArchitectureRoutes } from '../config/site-architecture.mjs';

const root = process.cwd();
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const config = readJson('config/compare-v1-dimensions.json');
const projection = buildComparisonProjection();
const pageSource = readText('src/pages/compare/index.astro');
const scriptSource = readText('src/scripts/compare-v1.ts');
const cssSource = readText('src/styles/compare-v1.css');
const sitemapSource = readText('src/pages/sitemap-index.xml.ts');
const route = siteArchitectureRoutes.find((row) => row.pattern === '/compare/');

const groups = config.groups ?? [];
const dimensions = groups.flatMap((group) => group.dimensions ?? []);
const dimensionIds = dimensions.map((row) => row.id);
const projectionDimensionIds = projection.dimensions.map((row) => row.dimension_id);

expect(config.schema_version === '1.0', 'compare dimension config schema version mismatch');
expect(config.config_id === 'sog_compare_v1_dimensions_pr344', 'compare dimension config ID mismatch');
expect(groups.length === 4, `compare v1 must define 4 public facet groups, found ${groups.length}`);
expect(dimensions.length === 19, `compare v1 must define 19 facets, found ${dimensions.length}`);
expect(new Set(dimensionIds).size === 19, 'compare v1 dimension IDs must be unique');
expect(JSON.stringify([...dimensionIds].sort()) === JSON.stringify([...projectionDimensionIds].sort()), 'compare v1 dimension set must exactly match public projection dimension set');
for (const group of groups) {
  expect(typeof group.id === 'string' && group.id.length > 0, 'compare group ID missing');
  expect(typeof group.label === 'string' && group.label.length > 0, `${group.id}: group label missing`);
  expect(typeof group.description === 'string' && group.description.length > 0, `${group.id}: group description missing`);
  expect(Array.isArray(group.dimensions) && group.dimensions.length > 0, `${group.id}: group must contain dimensions`);
}
for (const dimension of dimensions) {
  expect(typeof dimension.label === 'string' && dimension.label.length > 0, `${dimension.id}: label missing`);
  expect(typeof dimension.description === 'string' && dimension.description.length > 0, `${dimension.id}: description missing`);
}

expect(projection.asset_count === 110, 'compare v1 projection asset count must be 110');
expect(projection.dimension_count === 19, 'compare v1 projection dimension count must be 19');
expect(projection.cell_count === 2090, 'compare v1 projection cell count must be 2090');
expect(projection.single_composite_score === false, 'compare v1 projection must not emit composite score');

for (const text of [
  'data-compare-page',
  'data-min-assets="2"',
  'data-max-assets="4"',
  'data-compare-slot',
  'data-compare-clear',
  'data-compare-copy',
  'data-compare-output',
  'data-compare-groups',
  'Nineteen canonical facets',
  'no score or ranking is generated',
  '/data/comparison.json'
]) expect(pageSource.includes(text), `compare page source missing required contract text: ${text}`);

for (const text of [
  "fetch('/data/comparison.json'",
  "params.get('assets')",
  "params.set('assets'",
  "selected.length >= maxAssets",
  'validateSlots',
  'duplicate selection was cleared',
  'summaryFor',
  "badge('readiness'",
  "badge('freshness'",
  'window.addEventListener(\'popstate\''
]) expect(scriptSource.includes(text), `compare interaction script missing required behavior: ${text}`);

expect(cssSource.includes('.compare-slot-grid'), 'compare CSS missing slot grid');
expect(cssSource.includes('.compare-facet-row'), 'compare CSS missing facet row');
expect(cssSource.includes('.compare-badge--readiness'), 'compare CSS missing readiness badge styles');
expect(cssSource.includes('.compare-badge--freshness'), 'compare CSS missing freshness badge styles');
expect(cssSource.includes('@media (max-width: 719px)'), 'compare CSS missing mobile breakpoint');
expect(cssSource.includes('.compare-cell-asset'), 'compare CSS missing mobile asset identity');
expect(cssSource.includes('var(--sog-ink-body)'), 'compare CSS must use site readability body token');

expect(route?.source_file === 'src/pages/compare/index.astro', 'site architecture compare source mismatch');
expect(route?.output_kind === 'html', 'site architecture compare output kind mismatch');
expect(route?.group === 'registry', 'site architecture compare group mismatch');
expect(route?.role === 'comparison_explorer', 'site architecture compare role mismatch');
expect(route?.decision === 'add', 'site architecture compare route must be marked add');
expect(route?.navigation === 'registry', 'site architecture compare route must be registry navigation');
expect(primaryNavigation.some((item) => item.id === 'compare' && item.href === '/compare/'), 'primary navigation must include Compare');
expect(globalNavigationGroups.find((group) => group.id === 'registry')?.items.some((item) => item.href === '/compare/'), 'Registry navigation group must include Compare');
expect(footerNavigationGroups.find((group) => group.id === 'registry')?.items.some((item) => item.href === '/compare/'), 'footer Registry group must include Compare');
expect(sitemapSource.includes("'/compare/'"), 'sitemap must include /compare/');

if (failures.length) {
  console.error('PR #344 Compare v1 validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  asset_count: projection.asset_count,
  dimension_count: projection.dimension_count,
  cell_count: projection.cell_count,
  group_count: groups.length,
  min_assets: 2,
  max_assets: 4,
  route: '/compare/',
  next_pr: 345
}, null, 2));
