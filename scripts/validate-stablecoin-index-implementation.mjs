import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const files = {
  page: 'src/pages/stablecoins/index.astro',
  row: 'src/components/StablecoinIndexRow.astro',
  card: 'src/components/StablecoinIndexCard.astro',
  comparison: 'src/components/StablecoinComparisonSource.astro',
  client: 'src/scripts/stablecoin-index.ts',
  styles: 'src/styles/stablecoin-index.css'
};
const source = Object.fromEntries(Object.entries(files).map(([key, file]) => [key, fs.readFileSync(path.join(root, file), 'utf8')]));
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

for (const file of Object.values(files)) check(fs.existsSync(path.join(root, file)), `missing file: ${file}`);
for (const marker of ['StablecoinIndexRow', 'StablecoinIndexCard', 'StablecoinComparisonSource', "import '../../scripts/stablecoin-index'", 'data-stablecoin-index', 'data-registry-body', 'data-card-body', 'data-comparison-panel']) check(source.page.includes(marker), `page marker missing: ${marker}`);
for (const id of ['lifecycle', 'issuance', 'asset_class', 'reference', 'backing', 'stabilization']) check(source.page.includes(`id: '${id}'`), `filter group missing: ${id}`);
for (const sort of ['name_asc', 'name_desc', 'lifecycle_then_name', 'launch_oldest', 'launch_newest', 'evidence_most']) check(source.page.includes(`value="${sort}"`), `sort option missing: ${sort}`);
check((source.page.match(/<th>/g) ?? []).length === 9, 'stablecoin table must retain nine protected headers');
check(source.page.includes('data-mobile-table="scroll-preserve"'), 'complete table fallback is missing');
check(source.card.includes('data-mobile-representation-for="stablecoin-index"'), 'mobile record-card marker is missing');
for (const field of ['Issuance', 'Reference', 'Backing', 'Asset class', 'Organization', 'Relationships', 'Evidence', 'Known unknowns']) check(source.card.includes(`<dt>${field}</dt>`), `mobile field missing: ${field}`);
for (const section of ['Identity and current state', 'Reference, backing, stabilization', 'Reserve and redemption', 'Organizations and control', 'Deployments', 'Event summary', 'Evidence and known unknowns']) check(source.comparison.includes(`<h4>${section}</h4>`), `comparison section missing: ${section}`);

for (const marker of ['URLSearchParams', 'replaceState', 'pushState', 'popstate', 'data-clear-key', 'data-compare-select', 'maximum of four', 'normalize(\'NFKC\')']) check(source.client.includes(marker), `client behavior missing: ${marker}`);
check(source.client.includes("const groups = ['lifecycle', 'issuance', 'asset_class', 'reference', 'backing', 'stabilization']"), 'client filter group order changed');
check(source.client.includes("const parameterOrder = ['q', ...groups, 'sort', 'compare']"), 'URL parameter order changed');
check(source.client.includes("refresh('replace')") && source.client.includes("refresh('push')"), 'history update modes are missing');
check(source.client.includes('selectedComparisons.size >= 4'), 'comparison maximum guard is missing');

for (const marker of ['.stablecoin-index-cards', '@media (max-width: 719px)', '.stablecoin-index-table {', 'display: none;', '.comparison-grid']) check(source.styles.includes(marker), `responsive style missing: ${marker}`);
for (const forbidden of ['market-cap ranking', 'yield ranking', 'safety score', 'buy now', 'recommended asset']) check(!source.page.toLocaleLowerCase().includes(forbidden), `prohibited product language found: ${forbidden}`);

const result = {
  schema_version: '1.0',
  generated_at: new Date().toISOString(),
  ok: failures.length === 0,
  totals: { filter_groups: 6, sort_modes: 6, table_headers: 9, mobile_fields: 8, comparison_sections: 7, route_changes: 0, failures: failures.length },
  failures
};
const outputPath = path.join(root, 'data/generated/stablecoin-index-implementation-validation.json');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`);
if (failures.length) { console.error(JSON.stringify(result, null, 2)); process.exit(1); }
console.log(JSON.stringify(result, null, 2));
