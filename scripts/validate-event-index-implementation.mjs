import fs from 'node:fs';
import path from 'node:path';
import { indexInteractionContracts } from '../config/index-interaction-contract.mjs';

const root = process.cwd();
const pagePath = 'src/pages/events/index.astro';
const stylePath = 'src/styles/event-index.css';
const outputPath = path.join(root, 'data/generated/event-index-implementation-validation.json');
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };

const page = fs.readFileSync(path.join(root, pagePath), 'utf8');
const styles = fs.readFileSync(path.join(root, stylePath), 'utf8');
const contract = indexInteractionContracts.find((entry) => entry.id === 'events');

assert(Boolean(contract), 'event index contract is missing');
assert(page.includes('canonicalPath="/events/"'), 'event index canonical route changed');
assert(page.includes('getEvents'), 'event index must render canonical events');
assert(page.includes('getStablecoins') && page.includes('getOrganizations'), 'event subjects are missing');
assert(page.includes('getEvidenceSourceIdentities'), 'public source identity counts are missing');
assert(page.includes('resolveEventTaxonomy'), 'event taxonomy projection is missing');
assert(page.includes('eventPublicCopy'), 'reviewed event public copy is missing');
assert(page.includes('data-table-kind="event-index"'), 'protected event index table is missing');
assert(page.includes('data-mobile-table="scroll-preserve"'), 'full event table fallback is missing');
assert(page.includes('data-mobile-representation-for="event-index"'), 'compact event card representation is missing');
assert(page.includes('<noscript>'), 'server-rendered no-JavaScript fallback notice is missing');

assert(page.includes('id="event-search"') && page.includes('name="q"'), 'approved event search control is missing');
assert(page.includes('id="event-sort"') && page.includes('name="sort"'), 'approved event sort control is missing');
for (const filter of contract.filters) {
  assert(page.includes(`'${filter.id}'`) || page.includes(`"${filter.id}"`), `filter implementation marker is missing: ${filter.id}`);
}
for (const sort of contract.sorts) {
  assert(page.includes(`value="${sort.id}"`) || page.includes(`'${sort.id}'`), `sort option is missing: ${sort.id}`);
}

assert(page.includes('new URLSearchParams'), 'URL search state is missing');
assert(page.includes("params.set('q'") && page.includes("params.set('sort'"), 'q or sort URL state is missing');
for (const filter of contract.filters) assert(page.includes(filter.query_param), `URL filter parameter is missing: ${filter.query_param}`);
assert(page.includes("history[mode === 'push' ? 'pushState' : 'replaceState']"), 'pushState and replaceState behavior is missing');
assert(page.includes("window.addEventListener('popstate'"), 'Back and Forward restoration is missing');
assert(page.includes('id="event-active-filters"'), 'active-filter summary is missing');
assert(page.includes('dataset.removeFilter'), 'per-filter removal behavior is missing');
assert(page.includes('id="event-clear-all"'), 'Clear all control is missing');
assert(page.includes('id="event-result-summary"'), 'visible result summary is missing');
assert(page.includes('aria-live="polite"'), 'result announcement is missing');
assert(page.includes('id="event-zero-results"') && page.includes('data-clear-zero'), 'zero-result recovery is missing');

assert(contract.comparison.enabled === false, 'event comparison contract must remain disabled');
assert(!page.includes('event-comparison-panel'), 'generic event comparison must not be implemented');
assert(page.includes('without treating current status as a substitute for chronology'), 'event chronology caution is missing');
assert(page.includes('Category, subtype, status effect, recovery, subjects, and evidence remain distinct'), 'independent event axes are not explained');

const mobileLabels = ['Subtype', 'Subjects', 'Status effect', 'Recovery', 'Source identities'];
for (const label of mobileLabels) assert(page.includes(`<dt>${label}</dt>`), `compact card field is missing: ${label}`);
assert(page.includes('record.event_date') && page.includes('record.title'), 'compact event date or title is missing');
assert(page.includes('record.category_label'), 'compact event category is missing');
assert(page.includes('record.stablecoin_subjects') && page.includes('record.organization_subjects'), 'compact event subjects are missing');
assert(page.includes('record.status_effect_label'), 'compact status effect is missing');
assert(page.includes('record.recovery_label'), 'compact recovery is missing');
assert(page.includes('record.source_identity_count'), 'compact source identity count is missing');

assert(styles.includes("@import './stablecoin-index.css'"), 'event index must reuse the approved index interaction foundation');
assert(styles.includes('@media (max-width: 719px)'), 'compact breakpoint is missing');
assert(styles.includes('.event-index-cards'), 'compact event card styles are missing');
assert(styles.includes('.event-index-table-wrap'), 'event table fallback styles are missing');
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
