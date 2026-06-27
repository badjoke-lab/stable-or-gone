import fs from 'node:fs';
import path from 'node:path';
import { indexInteractionContracts } from '../config/index-interaction-contract.mjs';

const root = process.cwd();
const pagePath = 'src/pages/issuers/index.astro';
const stylePath = 'src/styles/organization-index.css';
const outputPath = path.join(root, 'data/generated/organization-index-implementation-validation.json');
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };

const page = fs.readFileSync(path.join(root, pagePath), 'utf8');
const styles = fs.readFileSync(path.join(root, stylePath), 'utf8');
const contract = indexInteractionContracts.find((entry) => entry.id === 'organizations');

assert(Boolean(contract), 'organization index contract is missing');
assert(page.includes('canonicalPath="/issuers/"'), 'organization index canonical route changed');
assert(page.includes('getOrganizations'), 'organization index must render canonical organizations');
assert(page.includes('getRelationships') && page.includes('getStablecoins'), 'relationship or connected-asset context is missing');
assert(page.includes('getEvidenceSourceIdentities'), 'public source identity counts are missing');
assert(page.includes('resolveOrganizationTaxonomy'), 'organization taxonomy projection is missing');
assert(page.includes('data-table-kind="organization-index"'), 'protected organization index table is missing');
assert(page.includes('data-mobile-table="scroll-preserve"'), 'full organization table fallback is missing');
assert(page.includes('data-mobile-representation-for="organization-index"'), 'compact organization card representation is missing');
assert(page.includes('<noscript>'), 'server-rendered no-JavaScript fallback notice is missing');

assert(page.includes('id="organization-search"') && page.includes('name="q"'), 'approved organization search control is missing');
assert(page.includes('id="organization-sort"') && page.includes('name="sort"'), 'approved organization sort control is missing');
for (const filter of contract.filters) {
  assert(page.includes(`'${filter.id}'`) || page.includes(`"${filter.id}"`), `filter implementation marker is missing: ${filter.id}`);
}
for (const sort of contract.sorts) {
  assert(page.includes(`value="${sort.id}"`) || page.includes(`'${sort.id}'`), `sort option is missing: ${sort.id}`);
}

assert(page.includes('new URLSearchParams'), 'URL search state is missing');
assert(page.includes("params.set('q'") && page.includes("params.set('sort'"), 'q or sort URL state is missing');
for (const filter of contract.filters) {
  assert(page.includes(filter.query_param), `URL filter parameter is missing: ${filter.query_param}`);
}
assert(page.includes("history[mode === 'push' ? 'pushState' : 'replaceState']"), 'pushState and replaceState behavior is missing');
assert(page.includes("window.addEventListener('popstate'"), 'Back and Forward restoration is missing');
assert(page.includes('id="organization-active-filters"'), 'active-filter summary is missing');
assert(page.includes('dataset.removeFilter'), 'per-filter removal behavior is missing');
assert(page.includes('id="organization-clear-all"'), 'Clear all control is missing');
assert(page.includes('id="organization-result-summary"'), 'visible result summary is missing');
assert(page.includes('aria-live="polite"'), 'result announcement is missing');
assert(page.includes('id="organization-zero-results"') && page.includes('data-clear-zero'), 'zero-result recovery is missing');

assert(contract.comparison.enabled === false, 'organization comparison contract must remain disabled');
assert(!page.includes('organization-comparison-panel'), 'generic organization comparison must not be implemented');
assert(page.includes('without treating every organization as a universal issuer'), 'organization-role caution is missing');
assert(page.includes('additional roles') || page.includes('multiple roles'), 'multi-role context is missing');
assert(page.includes('Current and historical roles preserved') || page.includes('current and historical roles preserved'), 'historical relationship context is missing');

const mobileLabels = [
  'Jurisdiction scope',
  'Functional roles',
  'Relationship statuses',
  'Connected assets',
  'Relationships',
  'Source identities'
];
for (const label of mobileLabels) assert(page.includes(`<dt>${label}</dt>`), `compact card field is missing: ${label}`);
assert(page.includes('record.name') && page.includes('record.category_label'), 'compact card identity and category fields are missing');
assert(page.includes('record.related_stablecoin_count'), 'compact card related-stablecoin count is missing');
assert(page.includes('record.relationship_count'), 'compact card relationship count is missing');
assert(page.includes('record.source_identity_count'), 'compact card source identity count is missing');
assert(page.includes('record.functional_role_labels'), 'compact card functional roles are missing');
assert(page.includes('record.relationship_status_labels'), 'compact card relationship statuses are missing');

assert(styles.includes("@import './stablecoin-index.css'"), 'organization index must reuse the approved index interaction foundation');
assert(styles.includes('@media (max-width: 719px)'), 'compact breakpoint is missing');
assert(styles.includes('.organization-index-cards'), 'compact organization card styles are missing');
assert(styles.includes('.organization-index-table-wrap'), 'organization table fallback styles are missing');
assert(!/(?:th|td):nth-child\([^)]*\)[^{]*\{[^}]*display\s*:\s*none/s.test(styles), 'generic column hiding is prohibited');

const result = {
  schema_version: '1.0',
  generated_at: new Date().toISOString(),
  ok: failures.length === 0,
  totals: {
    records_source: 'canonical',
    filters: contract.filters.length,
    sorts: contract.sorts.length,
    search_fields: contract.search.fields.length,
    mobile_material_fields: contract.mobile_row_fields.length,
    comparison_enabled: contract.comparison.enabled,
    route_changes: 0,
    failures: failures.length
  },
  failures
};

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`);
if (failures.length) {
  console.error(JSON.stringify(result, null, 2));
  process.exit(1);
}
console.log(JSON.stringify(result, null, 2));
