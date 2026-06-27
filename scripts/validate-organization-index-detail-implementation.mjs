import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const outputPath = path.join(root, 'data/generated/organization-index-detail-implementation-validation.json');
const requiredImplementation = [
  'src/scripts/organization-index.ts',
  'src/styles/organization-index.css'
];
const missing = requiredImplementation.filter((file) => !fs.existsSync(path.join(root, file)));

if (missing.length > 0) {
  const result = {
    schema_version: '1.0',
    generated_at: new Date().toISOString(),
    ok: true,
    status: 'deferred',
    implementation_pr: 25,
    missing_files: missing,
    failures: []
  };
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`);
  console.log(JSON.stringify(result, null, 2));
} else {
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
  for (const marker of ['OrganizationIndexRow', 'OrganizationIndexCard', "import '../../scripts/organization-index'", 'data-organization-index', 'data-organization-body', 'data-organization-card-body']) check(source.index.includes(marker), `index marker missing: ${marker}`);
  for (const id of ['category', 'regulatory', 'jurisdiction', 'role', 'relationship_status']) check(source.index.includes(`id: '${id}'`), `filter group missing: ${id}`);
  for (const sort of ['name_asc', 'name_desc', 'assets_most', 'relationships_most', 'evidence_most']) check(source.index.includes(`value="${sort}"`), `sort option missing: ${sort}`);
  check((source.index.match(/<th>/g) ?? []).length === 8, 'organization table must retain eight protected headers');
  check(source.card.includes('data-mobile-representation-for="organization-index"'), 'organization mobile card marker is missing');
  for (const marker of ['URLSearchParams', 'replaceState', 'pushState', 'popstate', 'data-organization-clear-key']) check(source.client.includes(marker), `organization client behavior missing: ${marker}`);
  for (const section of ['id="overview"', 'id="relationships"', 'id="events"', 'id="evidence"', 'id="unknowns"', 'id="corrections"']) check(source.detail.includes(section), `organization detail section missing: ${section}`);
  for (const kind of ['organization-overview', 'organization-relationships', 'organization-events', 'organization-sources']) {
    check(source.detail.includes(`data-table-kind="${kind}"`), `organization detail table missing: ${kind}`);
    check(source.detail.includes(`data-mobile-representation-for="${kind}"`), `organization mobile representation missing: ${kind}`);
  }
  check(source.detail.includes('Primary display is a navigation and summary choice only'), 'primary-display relationship semantics are missing');
  check(source.detail.includes('getCanonicalEvidenceRelations'), 'organization evidence relation handling is missing');
  check(source.indexStyles.includes('@media (max-width: 719px)') && source.detailStyles.includes('@media (max-width: 719px)'), 'organization responsive styles are incomplete');
  const result = {
    schema_version: '1.0',
    generated_at: new Date().toISOString(),
    ok: failures.length === 0,
    status: failures.length === 0 ? 'implemented' : 'failed',
    totals: { filter_groups: 5, sort_modes: 5, index_headers: 8, detail_sections: 6, detail_table_kinds: 4, failures: failures.length },
    failures
  };
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`);
  if (failures.length) {
    console.error(JSON.stringify(result, null, 2));
    process.exitCode = 1;
  } else {
    console.log(JSON.stringify(result, null, 2));
  }
}
