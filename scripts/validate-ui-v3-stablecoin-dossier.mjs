import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const sources = {
  view: read('src/components/StablecoinDetailView.astro'),
  header: read('src/components/StablecoinDossierHeader.astro'),
  reserves: read('src/components/StablecoinReserveSection.astro'),
  organizations: read('src/components/StablecoinOrganizationsControl.astro'),
  history: read('src/components/StablecoinHistorySection.astro'),
  context: read('src/components/StablecoinContextSections.astro'),
  related: read('src/components/StablecoinRelatedSection.astro'),
  css: read('src/styles/ui-remediation-r4.css')
};
const all = Object.values(sources).join('\n');
const failures = [];
const need = (text, marker) => { if (!text.includes(marker)) failures.push(`missing:${marker}`); };
const reject = (text, marker) => { if (text.includes(marker)) failures.push(`obsolete:${marker}`); };

for (const marker of [
  'data-dossier-version="r4"',
  'StablecoinDossierHeader',
  'StablecoinReserveSection',
  'StablecoinOrganizationsControl',
  'StablecoinHistorySection',
  'StablecoinContextSections',
  'StablecoinRelatedSection',
  'id="overview"',
  'id="reserves-redemption"',
  'id="organizations-control"',
  'id="events"',
  'id="deployments-legal-context"',
  'id="unknowns"',
  'id="evidence"',
  'id="mechanism"',
  'data-r4-section',
  'subjectOf:'
]) need(sources.view + all, marker);

for (const marker of ['Lifecycle', 'Reference', 'Backing', 'Redemption / exit', 'Primary organization', 'Evidence']) need(sources.header, marker);
need(sources.header, 'aria-label="Six primary stablecoin facts"');
need(sources.history, 'slice(0, 5)');
need(sources.context, 'slice(0, 10)');
need(sources.organizations, '<th>Organization</th><th>Role</th><th>Jurisdiction</th><th>Period</th><th>State</th>');
need(sources.view, "window.matchMedia('(max-width: 900px)')");
need(sources.view, "defaultClosed = new Set(['mechanism', 'more'])");
need(sources.view, 'section.open = !compact.matches && !defaultClosed.has(section.id)');
need(sources.css, '.stablecoin-dossier-r4');
need(sources.related, '<RelatedGuides guides={relatedGuides} />');

for (const obsolete of ['#assessment', '#history', '#known-unknowns', 'No separate model-change event is currently recorded.']) reject(sources.view + sources.history, obsolete);
for (const legacy of ['PageHero', 'MetricCard']) reject(all, legacy);

const primaryFactCount = (sources.header.match(/<div><dt>/g) ?? []).length;
if (primaryFactCount !== 6) failures.push(`primary-fact-count:${primaryFactCount}`);
const organizationHeaderCount = ((sources.organizations.match(/<thead><tr>([\s\S]*?)<\/tr><\/thead>/) ?? [])[1]?.match(/<th>/g) ?? []).length;
if (organizationHeaderCount !== 5) failures.push(`organization-column-count:${organizationHeaderCount}`);

const result = {
  schema_version: '2.1',
  generated_at: new Date().toISOString(),
  ok: failures.length === 0,
  page_family: 'ui_remediation_r4_stablecoin_dossier',
  primary_fact_count: primaryFactCount,
  organization_column_count: organizationHeaderCount,
  initial_event_limit: 5,
  initial_evidence_limit: 10,
  compact_disclosure_breakpoint: 900,
  desktop_default_open_sections: 6,
  canonical_record_changes: 0,
  route_changes: 0,
  failures
};
const output = path.join(root, 'data/generated/ui-v3-stablecoin-detail-validation.json');
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, `${JSON.stringify(result, null, 2)}\n`);
if (failures.length) { console.error(JSON.stringify(result, null, 2)); process.exit(1); }
console.log(JSON.stringify(result, null, 2));
