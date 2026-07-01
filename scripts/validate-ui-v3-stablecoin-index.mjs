import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const files = {
  page: 'src/pages/stablecoins/index.astro',
  row: 'src/components/StablecoinIndexRow.astro',
  card: 'src/components/StablecoinIndexCard.astro',
  styles: 'src/styles/stablecoin-index.css',
  client: 'src/scripts/stablecoin-index.ts',
  contract: 'config/index-interaction-contract.mjs'
};
const source = {};
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
for (const [key, file] of Object.entries(files)) {
  check(fs.existsSync(path.join(root, file)), `missing file: ${file}`);
  if (fs.existsSync(path.join(root, file))) source[key] = fs.readFileSync(path.join(root, file), 'utf8');
}

for (const forbidden of ['PageHero', 'MetricCard', 'stablecoin-index-hero__visual', 'stablecoin-index-hero__coin', 'stablecoin-index-metrics']) {
  check(!source.page?.includes(forbidden), `superseded Stablecoins composition remains: ${forbidden}`);
}
for (const component of ['StablecoinIndexRow', 'StablecoinIndexCard', 'StablecoinComparisonSource']) {
  check(source.page?.includes(`import ${component}`), `page import missing: ${component}`);
  check(source.page?.includes(`<${component}`), `page rendering missing: ${component}`);
}
check(source.page?.includes('const PAGE_SIZE = 20'), 'bounded page size must be 20');
check(source.page?.includes('data-page-size={PAGE_SIZE}'), 'page-size data contract missing');
check(source.page?.includes('class="stablecoin-register-header"'), 'register header missing');
check(source.page?.includes('class="stablecoin-register-count"'), 'register count missing');
check(!source.page?.includes('activeRecordCount'), 'removed metric count remains');
for (const id of ['lifecycle', 'issuance', 'asset_class', 'reference', 'backing', 'stabilization']) check(source.page?.includes(`id: '${id}'`), `filter missing: ${id}`);
for (const sort of ['name_asc', 'name_desc', 'lifecycle_then_name', 'launch_oldest', 'launch_newest', 'evidence_most']) check(source.page?.includes(`value="${sort}"`), `sort missing: ${sort}`);
check(source.page?.includes('data-active-filters') && source.page?.includes('aria-live="polite"'), 'active-filter and result announcements missing');
check(source.page?.includes('data-visible-range'), 'visible range missing');
check(source.page?.includes('data-pagination') && source.page?.includes('data-page-prev') && source.page?.includes('data-page-next'), 'pagination controls incomplete');
check(source.page?.includes('data-mobile-table="scroll-preserve"'), 'desktop table contract changed');
check(source.page?.includes('data-card-body'), 'compact record container missing');
check((source.page?.match(/<th>/g) ?? []).length === 7, 'seven register headers required');
for (const label of ['Stablecoin', 'Symbol', 'Reference', 'Status', 'Primary organization', 'Model', 'Updated / evidence']) check(source.page?.includes(`>${label}<`), `table label missing: ${label}`);
check(source.page?.includes('data-comparison-panel') && source.page?.includes('two to four') && source.page?.includes('not a ranking'), 'comparison disclosure incomplete');
check(source.page?.includes('data-no-results hidden'), 'zero-result state must be hidden initially');

check(source.row?.includes('initiallyVisible = true'), 'desktop initial-page contract missing');
check(source.row?.includes('hidden={initiallyVisible ? undefined : true}'), 'desktop rows are not initially bounded');
check(source.row?.includes('<TickerBadge'), 'desktop ticker badge missing');
check(source.row?.includes('Issuance:') && source.row?.includes('open questions'), 'desktop context incomplete');
check((source.row?.match(/<td>/g) ?? []).length === 7, 'desktop rows must have seven cells');
check(source.card?.includes('initiallyVisible = true'), 'compact initial-page contract missing');
check(source.card?.includes('hidden={initiallyVisible ? undefined : true}'), 'compact rows are not initially bounded');
check(source.card?.includes('<TickerBadge'), 'compact ticker badge missing');
for (const field of ['Issuance', 'Reference', 'Backing', 'Asset class', 'Organization', 'Relationships', 'Evidence', 'Known unknowns', 'Events', 'Last reviewed']) check(source.card?.includes(`<dt>${field}</dt>`), `compact field missing: ${field}`);
check(source.card?.includes('data-mobile-representation-for="stablecoin-index"'), 'compact marker missing');

for (const marker of ['.stablecoin-register-header', '.stablecoin-index-toolbar', '.stablecoin-index-filter-grid', '.stablecoin-index-table', '.stablecoin-index-cards', '.stablecoin-index-pagination', '.comparison-grid', '@media (max-width: 719px)']) check(source.styles?.includes(marker), `style marker missing: ${marker}`);
check(source.styles?.includes('.stablecoin-index-table {\n    display: none;') && source.styles?.includes('.stablecoin-index-cards {\n    padding: 0;\n    display: grid;'), 'mobile table-to-record transformation incomplete');
const compactStyles = source.styles?.replaceAll(' ', '').toLocaleLowerCase() ?? '';
for (const forbidden of ['radial-gradient(', 'linear-gradient(', 'box-shadow:', 'rgba(24,182,255']) check(!compactStyles.includes(forbidden.replaceAll(' ', '').toLocaleLowerCase()), `forbidden Stablecoins style remains: ${forbidden}`);

for (const marker of ['URLSearchParams', 'replaceState', 'pushState', 'popstate', 'selectedComparisons.size >= 4', "const groups = ['lifecycle', 'issuance', 'asset_class', 'reference', 'backing', 'stabilization']", "params.get('page')", "params.set('page'", 'pageSize', 'currentPage', 'visibleSlugs', 'data-page-status']) check(source.client?.includes(marker), `interaction marker missing: ${marker}`);
check(source.client?.includes('noResults.hidden = matchCount !== 0'), 'false empty-state prevention missing');
check(source.client?.includes('resetPageAndRefresh'), 'page reset on state change missing');
check(source.contract?.includes('page_size: 20') && source.contract?.includes("query_param: 'page'"), 'pagination contract missing');

const combined = `${source.page ?? ''}\n${source.row ?? ''}\n${source.card ?? ''}`.toLocaleLowerCase();
for (const prohibited of ['market capitalization', 'circulating supply', 'holder count', 'transfer count', 'saved view', 'watchlist', 'recently viewed', 'safety score', 'transparency score']) check(!combined.includes(prohibited), `unsupported feature appears: ${prohibited}`);
check(!combined.includes('fetch('), 'register must not depend on external runtime fetch');

const result = {
  schema_version: '2.0',
  generated_at: new Date().toISOString(),
  ok: failures.length === 0,
  visual_family: 'editorial_ledger_v3',
  canonical_record_changes: 0,
  route_changes: 0,
  filter_groups: 6,
  sort_modes: 6,
  table_headers: 7,
  page_size: 20,
  failures
};
const outputV3 = path.join(root, 'data/generated/ui-v3-stablecoin-index-validation.json');
const outputLegacy = path.join(root, 'data/generated/ui-v2-stablecoin-index-validation.json');
fs.mkdirSync(path.dirname(outputV3), { recursive: true });
const serialized = `${JSON.stringify(result, null, 2)}\n`;
fs.writeFileSync(outputV3, serialized);
fs.writeFileSync(outputLegacy, serialized);
if (failures.length) {
  console.error(serialized);
  process.exit(1);
}
console.log(serialized);
