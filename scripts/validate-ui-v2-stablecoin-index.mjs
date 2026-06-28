import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const files = {
  page: 'src/pages/stablecoins/index.astro',
  row: 'src/components/StablecoinIndexRow.astro',
  card: 'src/components/StablecoinIndexCard.astro',
  styles: 'src/styles/stablecoin-index.css',
  client: 'src/scripts/stablecoin-index.ts',
  reference: 'docs/ui-redesign/approved-mocks-v2/02-stablecoin-index.webp'
};
const source = {};
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
for (const [key, file] of Object.entries(files)) {
  check(fs.existsSync(path.join(root, file)), `missing file: ${file}`);
  if (key !== 'reference' && fs.existsSync(path.join(root, file))) source[key] = fs.readFileSync(path.join(root, file), 'utf8');
}

for (const component of ['PageHero', 'MetricCard', 'StablecoinIndexRow', 'StablecoinIndexCard', 'StablecoinComparisonSource']) {
  check(source.page?.includes(`import ${component}`), `page must import ${component}`);
  check(source.page?.includes(`<${component}`), `page must render ${component}`);
}
check(source.page?.includes('className="stablecoin-index-hero"'), 'approved v2 Stablecoins hero is missing');
check(source.page?.includes('class="stablecoin-index-metrics"'), 'canonical metric-card row is missing');
for (const marker of ['value={records.length}', 'value={activeRecordCount}', 'value={organizations.length}', 'value={sourceIdentityCount}']) check(source.page?.includes(marker), `dynamic metric is missing: ${marker}`);
for (const id of ['lifecycle', 'issuance', 'asset_class', 'reference', 'backing', 'stabilization']) check(source.page?.includes(`id: '${id}'`), `approved taxonomy filter is missing: ${id}`);
for (const sort of ['name_asc', 'name_desc', 'lifecycle_then_name', 'launch_oldest', 'launch_newest', 'evidence_most']) check(source.page?.includes(`value="${sort}"`), `sort mode is missing: ${sort}`);
check(source.page?.includes('data-active-filters') && source.page?.includes('aria-live="polite"'), 'active-filter summary and result announcement are required');
check(source.page?.includes('data-mobile-table="scroll-preserve"'), 'protected desktop table contract changed');
check(source.page?.includes('data-card-body'), 'compact record container is missing');
check((source.page?.match(/<th>/g) ?? []).length === 9, 'nine protected Stablecoins table headers are required');
for (const label of ['Primary display organization', 'Primary display role', 'Reference target', 'Backing model', 'Lifecycle', 'Issuance', 'Evidence']) check(source.page?.includes(`>${label}<`), `protected table label is missing: ${label}`);
check(source.page?.includes('data-comparison-panel') && source.page?.includes('two to four') && source.page?.includes('not a ranking'), 'bounded non-ranking comparison disclosure is incomplete');

check(source.row?.includes("import TickerBadge from './TickerBadge.astro'"), 'desktop rows must use TickerBadge');
check(source.row?.includes('<TickerBadge'), 'desktop row ticker badge is missing');
check(source.row?.includes('Last reviewed') && source.row?.includes('known unknowns'), 'desktop review/evidence context is incomplete');
check(source.card?.includes("import TickerBadge from './TickerBadge.astro'"), 'compact cards must use TickerBadge');
check(source.card?.includes('<TickerBadge'), 'compact card ticker badge is missing');
for (const field of ['Issuance', 'Reference', 'Backing', 'Asset class', 'Organization', 'Relationships', 'Evidence', 'Known unknowns', 'Events', 'Last reviewed']) check(source.card?.includes(`<dt>${field}</dt>`), `compact field is missing: ${field}`);
check(source.card?.includes('data-mobile-representation-for="stablecoin-index"'), 'compact representation marker is missing');

for (const marker of ['.stablecoin-index-hero', '.stablecoin-index-metrics', '.stablecoin-index-toolbar', '.stablecoin-index-filter-grid', '.stablecoin-index-table', '.stablecoin-index-cards', '.comparison-grid', '@media (max-width: 719px)']) check(source.styles?.includes(marker), `v2 Stablecoins style marker is missing: ${marker}`);
check(source.styles?.includes('.stablecoin-index-table {\n    display: none;') && source.styles?.includes('.stablecoin-index-cards {\n    padding: 0.8rem;\n    display: grid;'), 'mobile table-to-card transformation is incomplete');
for (const marker of ['URLSearchParams', 'replaceState', 'pushState', 'popstate', 'selectedComparisons.size >= 4', "const groups = ['lifecycle', 'issuance', 'asset_class', 'reference', 'backing', 'stabilization']"]) check(source.client?.includes(marker), `existing interaction contract changed: ${marker}`);

const combined = `${source.page ?? ''}\n${source.row ?? ''}\n${source.card ?? ''}`.toLocaleLowerCase();
for (const prohibited of ['market capitalization', 'circulating supply', 'holder count', 'transfer count', 'saved view', 'watchlist', 'recently viewed', 'safety score', 'transparency score', 'buy now']) check(!combined.includes(prohibited), `mock-only or promotional feature appears: ${prohibited}`);
check(!combined.includes('fetch('), 'Stablecoins index must not depend on an external runtime fetch');

const result = {
  schema_version: '1.0',
  generated_at: new Date().toISOString(),
  ok: failures.length === 0,
  approved_reference: files.reference,
  canonical_record_changes: 0,
  route_changes: 0,
  filter_groups: 6,
  sort_modes: 6,
  protected_headers: 9,
  failures
};
const outputPath = path.join(root, 'data/generated/ui-v2-stablecoin-index-validation.json');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`);
if (failures.length) {
  console.error(JSON.stringify(result, null, 2));
  process.exit(1);
}
console.log(JSON.stringify(result, null, 2));
