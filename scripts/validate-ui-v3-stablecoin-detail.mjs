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
  contract: 'docs/architecture/approved-editorial-ledger-ui-v3.md',
  plan: 'docs/ui-redesign/implementation-plan.md'
};
const source = {};
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
for (const [key, file] of Object.entries(files)) {
  check(fs.existsSync(path.join(root, file)), `missing file: ${file}`);
  if (fs.existsSync(path.join(root, file))) source[key] = fs.readFileSync(path.join(root, file), 'utf8');
}
check(source.route?.includes("import '../../styles/stablecoin-dossier-sections.css'"), 'ordered dossier section stylesheet is not loaded');
check(source.contract?.includes('A stablecoin detail page is a research dossier.'), 'Editorial Ledger dossier contract is missing');
check(source.plan?.includes('### PR #265 — Stablecoin dossier'), 'PR #265 plan section is missing');
for (const prohibitedImport of ['PageHero', 'MetricCard', 'TickerBadge']) {
  check(!source.view?.includes(`import ${prohibitedImport}`), `legacy dashboard component remains imported: ${prohibitedImport}`);
  check(!source.view?.includes(`<${prohibitedImport}`), `legacy dashboard component remains rendered: ${prohibitedImport}`);
}
for (const component of ['StablecoinOrganizationsControl', 'StablecoinValueStateSections', 'DeploymentTable', 'IssuerControlEvents', 'StablecoinEventTimeline', 'EvidenceSourceTable', 'ValueStateText']) {
  check(source.view?.includes(`import ${component}`), `detail view must import ${component}`);
  check(source.view?.includes(`<${component}`), `detail view must render ${component}`);
}
for (const marker of ['stablecoin-dossier-masthead', 'stablecoin-dossier-title-row', 'stablecoin-dossier-facts', 'stablecoin-material-change', 'stablecoin-dossier-nav', 'stablecoin-assessment', 'stablecoin-identity-ledger', 'stablecoin-mechanism-ledger']) check(source.view?.includes(marker), `Editorial Ledger dossier marker is missing: ${marker}`);
for (const label of ['Stablecoin dossier', 'Record ', 'Also recorded as', 'Lifecycle', 'Issuance', 'Reference target', 'Primary organization', 'Launch', 'Redemption', 'Backing', 'Stabilization', 'Last review', 'Latest material change', 'Evidence']) check(source.view?.includes(label), `required upper information is missing: ${label}`);
const orderedMarkers = ['id="assessment"', '<StablecoinOrganizationsControl', 'id="mechanism"', 'id="reserves-redemption"', 'id="deployments-legal-context"', 'id="history"', 'id="evidence"', 'mode="unknowns"', 'id="more"'];
let previousIndex = -1;
for (const marker of orderedMarkers) {
  const index = source.view?.indexOf(marker) ?? -1;
  check(index >= 0, `approved dossier marker is missing: ${marker}`);
  check(index > previousIndex, `approved dossier order is incorrect at: ${marker}`);
  if (index >= 0) previousIndex = index;
}
for (const anchor of ['#assessment', '#organizations-control', '#mechanism', '#reserves-redemption', '#deployments-legal-context', '#history', '#evidence', '#known-unknowns', '#more']) check(source.view?.includes(`href="${anchor}"`), `local navigation destination is missing: ${anchor}`);
for (const label of ['Name', 'Symbol', 'Aliases', 'Asset class', 'Lifecycle status', 'Issuance status', 'Canonical record ID', 'Route slug', 'Record confidence', 'Last reviewed']) check(source.view?.includes(`<dt>${label}</dt>`), `identity field is missing: ${label}`);
for (const label of ['Reference target', 'Reference kind', 'Comparison category', 'Target value', 'Reference methodology', 'Public backing model', 'Canonical backing types', 'Reserve component categories', 'Primary stabilization mechanism', 'Recorded model description', 'Redemption / exit model', 'Valuation source', 'Yield / rebase profile', 'Classification notes']) check(source.view?.includes(`<dt>${label}</dt>`), `mechanics field is missing: ${label}`);
check(source.organizations?.includes('data-table-kind="stablecoin-organizations"'), 'organization relationship table is missing');
check(source.organizations?.includes('data-mobile-representation-for="stablecoin-organizations"'), 'organization compact representation is missing');
for (const label of ['Organization', 'Role', 'Relationship status', 'Governance', 'Primary display organization', 'Primary display role']) check(source.organizations?.includes(label), `organization/control field is missing: ${label}`);
for (const mode of ['reserves', 'legal', 'unknowns']) check(source.view?.includes(`mode="${mode}"`), `ordered value-state mode is missing: ${mode}`);
for (const label of ['Disclosure status', 'Backing types', 'Profile confidence', 'Current status', 'Settlement asset', 'Eligible parties', 'Retail access', 'Institutional access', 'Minimum amount', 'Settlement time', 'Regional limits', 'Assets covered', 'Authority / publisher', 'What remains unclear', 'Value state', 'Priority', 'Last checked']) check(source.valueSections?.includes(label), `reserve/redemption/legal/unknown field is missing: ${label}`);
for (const label of ['Network record state', 'Operational state', 'Canonicality', 'Verification state', 'Contract identity state', 'Contract or identifier']) check(source.deployments?.includes(`<th>${label}</th>`), `deployment field is missing: ${label}`);
check(source.view?.includes('tableKind="stablecoin-sources"'), 'stablecoin evidence table binding is missing');
check(source.evidence?.includes('Supported claims') && source.evidence?.includes('Reliability'), 'evidence axes are incomplete');
for (const destination of ['/stablecoins/', '/events/', '/methodology/', '/contact/', '/data/manifest.json']) check(source.view?.includes(`href="${destination}"`), `further-reading destination is missing: ${destination}`);
check(source.view?.includes('relatedGuides.map'), 'related guide records are missing');
check(source.view?.includes('No dated material event is currently recorded.'), 'low-information material-event state is not intentional');
check(source.view?.includes('No reserve components have been recorded.'), 'low-information reserve state is not intentional');
check(source.view?.includes('No separate model-change event is currently recorded.'), 'low-information history state is not intentional');
check(!source.view?.includes('fetch('), 'detail page must not depend on an external runtime fetch');
check(!source.view?.toLowerCase().includes('safety score'), 'prohibited synthetic safety score appears');
check(!source.view?.toLowerCase().includes('transparency score'), 'prohibited transparency score appears');
for (const marker of ['.stablecoin-dossier-masthead', '.stablecoin-dossier-facts', '.stablecoin-material-change', '.stablecoin-dossier-nav', '.stablecoin-dossier-section', '.stablecoin-section-heading', '.stablecoin-identity-ledger', '.stablecoin-mechanism-ledger', '.stablecoin-value-state-group', '.stablecoin-further-reading', '@media (max-width: 719px)', '@media (forced-colors: active)']) check(source.styles?.includes(marker), `detail style marker is missing: ${marker}`);
for (const marker of ['.stablecoin-legal-group', '.stablecoin-unknown-group', '.stablecoin-open-questions']) check(source.sectionStyles?.includes(marker), `ordered section style marker is missing: ${marker}`);
check(!source.styles?.includes('radial-gradient'), 'legacy radial-gradient identity visual remains');
check(!source.styles?.includes('.metric-card'), 'legacy metric-card styling remains');
check(!source.styles?.includes('.stablecoin-dossier-hero'), 'legacy dossier hero styling remains');
check(source.styles?.includes('border-radius: 0'), 'square Editorial Ledger surfaces are not enforced');
check(source.styles?.includes('box-shadow: none'), 'decorative dossier shadows are not explicitly removed');
check(source.styles?.includes('.stablecoin-organizations-table {\n    display: none;'), 'organization table must transform on compact layouts');
check(source.styles?.includes('.stablecoin-organization-cards {\n    display: grid;'), 'compact organization records must be enabled');
const result = { schema_version: '1.0', generated_at: new Date().toISOString(), ok: failures.length === 0, page_family: 'editorial_ledger_research_dossier', canonical_record_changes: 0, route_changes: 0, synthetic_scores: 0, failures };
const outputPath = path.join(root, 'data/generated/ui-v3-stablecoin-detail-validation.json');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`);
if (failures.length) { console.error(JSON.stringify(result, null, 2)); process.exit(1); }
console.log(JSON.stringify(result, null, 2));
