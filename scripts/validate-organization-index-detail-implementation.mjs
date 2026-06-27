import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const files = {
  index: 'src/pages/issuers/index.astro',
  row: 'src/components/OrganizationIndexRow.astro',
  card: 'src/components/OrganizationIndexCard.astro',
  client: 'src/scripts/organization-index.ts',
  indexStyles: 'src/styles/organization-index.css',
  detail: 'src/pages/issuer/[slug].astro',
  detailStyles: 'src/styles/organization-detail.css'
};
const source = Object.fromEntries(Object.entries(files).map(([key, file]) => [key, fs.readFileSync(path.join(root, file), 'utf8')]));
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

for (const file of Object.values(files)) check(fs.existsSync(path.join(root, file)), `missing file: ${file}`);
for (const marker of ['OrganizationIndexRow', 'OrganizationIndexCard', "import '../../scripts/organization-index'", 'data-organization-index', 'data-organization-body', 'data-organization-card-body']) check(source.index.includes(marker), `index marker missing: ${marker}`);
for (const id of ['category', 'regulatory', 'jurisdiction', 'role', 'relationship_status']) check(source.index.includes(`id: '${id}'`), `filter group missing: ${id}`);
for (const sort of ['name_asc', 'name_desc', 'assets_most', 'relationships_most', 'evidence_most']) check(source.index.includes(`value="${sort}"`), `sort option missing: ${sort}`);
check((source.index.match(/<th>/g) ?? []).length === 8, 'organization table must retain eight protected headers');
check(source.index.includes('data-mobile-table="scroll-preserve"'), 'organization full-table fallback is missing');
check(source.card.includes('data-mobile-representation-for="organization-index"'), 'organization mobile card marker is missing');
for (const field of ['Jurisdiction', 'Regulatory character', 'Functional roles', 'Relationship states', 'Connected assets', 'Relationships', 'Evidence', 'Record confidence']) check(source.card.includes(`<dt>${field}</dt>`), `mobile organization field missing: ${field}`);

for (const marker of ['URLSearchParams', 'replaceState', 'pushState', 'popstate', 'data-organization-clear-key', "const groups = ['category', 'regulatory', 'jurisdiction', 'role', 'relationship_status']"]) check(source.client.includes(marker), `organization client behavior missing: ${marker}`);
check(!source.client.includes('comparison'), 'organization index must not implement generic comparison');

for (const section of ['id="overview"', 'id="relationships"', 'id="events"', 'id="evidence"', 'id="unknowns"', 'id="corrections"']) check(source.detail.includes(section), `organization detail section missing: ${section}`);
for (const tableKind of ['organization-overview', 'organization-relationships', 'organization-events', 'organization-sources']) check(source.detail.includes(`data-table-kind="${tableKind}"`), `organization detail table missing: ${tableKind}`);
for (const mobileKind of ['organization-overview', 'organization-relationships', 'organization-events', 'organization-sources']) check(source.detail.includes(`data-mobile-representation-for="${mobileKind}"`), `organization detail mobile representation missing: ${mobileKind}`);
for (const term of ['Organization category', 'Canonical organization type', 'Legal form', 'Legal-form state', 'Regulatory character', 'Jurisdiction scope', 'Functional roles', 'Relationship states', 'Primary display relationships', 'Record confidence']) check(source.detail.includes(term), `organization detail field missing: ${term}`);
for (const term of ['Primary display is a navigation and summary choice only', 'Additional relationship', 'current', 'historical']) check(source.detail.includes(term), `relationship semantics missing: ${term}`);
check(source.detail.includes('getCanonicalEvidenceRelations') && source.detail.includes('evidenceRelations.filter'), 'organization detail evidence relation handling is missing');
check(source.detail.includes('Submit a correction') && source.detail.includes('/methodology/'), 'organization detail correction and methodology links are missing');

for (const marker of ['@media (max-width: 719px)', '.organization-index-table {', '.organization-index-cards {', 'display: none;']) check(source.indexStyles.includes(marker), `organization index responsive style missing: ${marker}`);
for (const marker of ['@media (max-width: 719px)', '.organization-detail-table {', '.organization-overview-cards', '.organization-relationship-cards', '.organization-event-cards', '.organization-source-cards']) check(source.detailStyles.includes(marker), `organization detail responsive style missing: ${marker}`);

const result = {
  schema_version: '1.0',
  generated_at: new Date().toISOString(),
  ok: failures.length === 0,
  totals: {
    filter_groups: 5,
    sort_modes: 5,
    index_headers: 8,
    index_mobile_fields: 8,
    detail_sections: 6,
    detail_table_kinds: 4,
    detail_mobile_representations: 4,
    route_changes: 0,
    failures: failures.length
  },
  failures
};
const outputPath = path.join(root, 'data/generated/organization-index-detail-implementation-validation.json');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`);
if (failures.length) { console.error(JSON.stringify(result, null, 2)); process.exit(1); }
console.log(JSON.stringify(result, null, 2));
