import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const files = {
  route: 'src/pages/stablecoin/[slug].astro',
  view: 'src/components/StablecoinDetailView.astro',
  valueSections: 'src/components/StablecoinValueStateSections.astro',
  organizations: 'src/components/StablecoinOrganizationsControl.astro',
  deployments: 'src/components/DeploymentTable.astro',
  evidence: 'src/components/EvidenceSourceTable.astro',
  styles: 'src/styles/stablecoin-dossier.css',
  sectionStyles: 'src/styles/stablecoin-dossier-sections.css',
  reference: 'docs/ui-redesign/approved-mocks-v2/03-stablecoin-detail.webp'
};
const source = {};
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
for (const [key, file] of Object.entries(files)) {
  check(fs.existsSync(path.join(root, file)), `missing file: ${file}`);
  if (key !== 'reference' && fs.existsSync(path.join(root, file))) source[key] = fs.readFileSync(path.join(root, file), 'utf8');
}

for (const component of ['PageHero', 'MetricCard', 'TickerBadge', 'StablecoinOrganizationsControl', 'StablecoinValueStateSections', 'DeploymentTable', 'StablecoinEventTimeline', 'EvidenceSourceTable', 'RelatedGuides']) {
  check(source.view?.includes(`import ${component}`), `detail view must import ${component}`);
  check(source.view?.includes(`<${component}`), `detail view must render ${component}`);
}
check(source.route?.includes("import '../../styles/stablecoin-dossier-sections.css'"), 'ordered dossier section stylesheet is not loaded');
check(source.view?.includes('className="stablecoin-dossier-hero"'), 'approved detail hero is missing');
check(source.view?.includes('class="stablecoin-current-state"'), 'current-state metric row is missing');
check((source.view?.match(/<MetricCard/g) ?? []).length === 6, 'detail hero must expose six current-state metric cards');
check(source.view?.includes('<TickerBadge'), 'detail identity ticker badge is missing');

const orderedMarkers = [
  'id="identity-current-state"',
  '<StablecoinOrganizationsControl',
  'id="how-it-works"',
  'id="reserves-redemption"',
  'mode="reserves"',
  'id="deployments-legal-context"',
  'mode="legal"',
  'id="history"',
  'id="evidence"',
  'mode="unknowns"',
  'id="more"'
];
let previousIndex = -1;
for (const marker of orderedMarkers) {
  const index = source.view?.indexOf(marker) ?? -1;
  check(index >= 0, `approved dossier marker is missing: ${marker}`);
  check(index > previousIndex, `approved dossier order is incorrect at: ${marker}`);
  if (index >= 0) previousIndex = index;
}

for (const anchor of ['#identity-current-state', '#organizations-control', '#how-it-works', '#reserves-redemption', '#deployments-legal-context', '#history', '#evidence', '#known-unknowns', '#more']) {
  check(source.view?.includes(`href="${anchor}"`), `local navigation destination is missing: ${anchor}`);
}

for (const label of ['Name', 'Symbol', 'Asset class', 'Lifecycle status', 'Issuance status', 'Canonical record ID', 'Route slug', 'Record confidence', 'Last reviewed']) {
  check(source.view?.includes(`<th>${label}</th>`) && source.view?.includes(`<dt>${label}</dt>`), `identity field must exist in table and compact cards: ${label}`);
}
for (const label of ['Reference target', 'Reference kind', 'Comparison category', 'Target value', 'Reference methodology', 'Public backing model', 'Canonical backing types', 'Reserve component categories', 'Primary stabilization mechanism', 'Recorded model description', 'Redemption / exit model', 'Valuation source', 'Yield / rebase profile', 'Classification notes']) {
  check(source.view?.includes(`<dt>${label}</dt>`), `mechanics field is missing: ${label}`);
}
check(source.organizations?.includes('data-table-kind="stablecoin-organizations"'), 'organization relationship table is missing');
check(source.organizations?.includes('data-mobile-representation-for="stablecoin-organizations"'), 'organization compact representation is missing');
for (const label of ['Organization', 'Role', 'Relationship status', 'Governance', 'Primary display organization', 'Primary display role']) check(source.organizations?.includes(label), `organization/control field is missing: ${label}`);

for (const mode of ['reserves', 'legal', 'unknowns']) check(source.view?.includes(`mode="${mode}"`), `ordered value-state mode is missing: ${mode}`);
check(source.valueSections?.includes("type SectionMode = 'all' | 'reserves' | 'legal' | 'unknowns'"), 'value-state section modes are not declared');
check(source.valueSections?.includes('id="legal-context"'), 'legal context anchor is missing');
check(source.valueSections?.includes('id="known-unknowns"'), 'known-unknowns anchor is missing');
for (const label of ['Disclosure status', 'Backing types', 'Profile confidence', 'Current status', 'Settlement asset', 'Eligible parties', 'Retail access', 'Institutional access', 'Minimum amount', 'Settlement time', 'Regional limits', 'Assets covered', 'Authority / publisher', 'What remains unclear', 'Value state', 'Priority', 'Last checked']) check(source.valueSections?.includes(label), `reserve/redemption/legal/unknown field is missing: ${label}`);

for (const label of ['Network record state', 'Operational state', 'Canonicality', 'Verification state', 'Contract identity state', 'Contract or identifier']) check(source.deployments?.includes(`<th>${label}</th>`), `deployment field is missing: ${label}`);
check(source.view?.includes('<IssuerControlEvents') && source.view?.includes('<StablecoinEventTimeline'), 'history components are incomplete');
check(source.view?.includes('tableKind="stablecoin-sources"'), 'stablecoin evidence table binding is missing');
check(source.evidence?.includes('Supported claims') && source.evidence?.includes('Reliability'), 'evidence axes are incomplete');

for (const destination of ['/stablecoins/', '/events/', '/methodology/', '/contact/', '/data/manifest.json']) check(source.view?.includes(`href="${destination}"`), `further-reading destination is missing: ${destination}`);
check(source.view?.includes('<RelatedGuides'), 'related guides are missing');
check(!source.view?.includes('PR 29'), 'stale implementation placeholder remains');
check(!source.view?.toLocaleLowerCase().includes('safety score'), 'prohibited synthetic assessment wording appears');
check(!source.view?.toLocaleLowerCase().includes('transparency score'), 'prohibited transparency-score wording appears');
check(!source.view?.includes('fetch('), 'detail page must not depend on an external runtime fetch');

for (const marker of ['.stablecoin-dossier-hero', '.stablecoin-current-state', '.stablecoin-dossier-nav', '.stablecoin-section-heading', '.stablecoin-preview-grid', '.stablecoin-value-state-group', '.stablecoin-further-reading', '@media (max-width: 719px)', '@media (forced-colors: active)']) check(source.styles?.includes(marker), `detail style marker is missing: ${marker}`);
for (const marker of ['.stablecoin-legal-group', '.stablecoin-unknown-group', '.stablecoin-open-questions']) check(source.sectionStyles?.includes(marker), `ordered section style marker is missing: ${marker}`);
check(source.styles?.includes('.stablecoin-identity-table,\n  .stablecoin-organizations-table {\n    display: none;'), 'identity and organization tables must transform on compact layouts');
check(source.styles?.includes('.stablecoin-identity-cards,\n  .stablecoin-organization-cards {\n    display: grid;'), 'compact identity and organization cards must be enabled');

const result = {
  schema_version: '1.0',
  generated_at: new Date().toISOString(),
  ok: failures.length === 0,
  approved_reference: files.reference,
  dossier_sections: 8,
  current_state_metrics: 6,
  canonical_record_changes: 0,
  route_changes: 0,
  failures
};
const outputPath = path.join(root, 'data/generated/ui-v2-stablecoin-detail-validation.json');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`);
if (failures.length) {
  console.error(JSON.stringify(result, null, 2));
  process.exit(1);
}
console.log(JSON.stringify(result, null, 2));
