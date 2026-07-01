import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const load = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const view = load('src/components/StablecoinDetailView.astro');
const header = load('src/components/StablecoinDossierHeader.astro');
const values = load('src/components/StablecoinValueStateSections.astro');
const organizations = load('src/components/StablecoinOrganizationsControl.astro');
const deployments = load('src/components/DeploymentTable.astro');
const evidence = load('src/components/EvidenceSourceTable.astro');
const styles = load('src/styles/stablecoin-dossier.css');
const overrides = load('src/styles/stablecoin-dossier-v3-overrides.css');
const sectionStyles = load('src/styles/stablecoin-dossier-sections.css');
const route = load('src/pages/stablecoin/[slug].astro');
const plan = load('docs/ui-redesign/implementation-plan.md');
const contract = load('docs/architecture/approved-editorial-ledger-ui-v3.md');
const combined = `${view}\n${header}`;
const failures = [];
const check = (ok, message) => { if (!ok) failures.push(message); };
const hasAll = (source, values, prefix) => values.forEach((value) => check(source.includes(value), `${prefix}: ${value}`));

check(route.includes("import '../../styles/stablecoin-dossier-sections.css'"), 'ordered dossier section stylesheet is not loaded');
check(contract.includes('A stablecoin detail page is a research dossier.'), 'Editorial Ledger dossier contract is missing');
check(plan.includes('### PR #265 — Stablecoin dossier'), 'PR #265 plan section is missing');
check(view.includes('import StablecoinDossierHeader') && view.includes('<StablecoinDossierHeader'), 'extracted dossier masthead is not connected');
for (const item of ['PageHero', 'MetricCard', 'TickerBadge']) check(!combined.includes(item), `legacy dashboard component remains: ${item}`);
hasAll(combined, ['stablecoin-dossier-masthead', 'stablecoin-dossier-title-row', 'stablecoin-dossier-facts', 'stablecoin-material-change', 'Stablecoin dossier', 'Record ', 'Also recorded as', 'Primary organization', 'Latest material change'], 'masthead requirement missing');
hasAll(view, ['stablecoin-dossier-nav', 'stablecoin-assessment', 'stablecoin-identity-table', 'stablecoin-identity-ledger', 'stablecoin-mechanism-ledger', 'data-table-kind="stablecoin-overview"', 'data-mobile-representation-for="stablecoin-overview"'], 'dossier structure missing');

const ordered = ['id="assessment"', '<StablecoinOrganizationsControl', 'id="mechanism"', 'id="reserves-redemption"', 'id="deployments-legal-context"', 'id="history"', 'id="evidence"', 'mode="unknowns"', 'id="more"'];
let previous = -1;
for (const marker of ordered) {
  const index = view.indexOf(marker);
  check(index >= 0, `approved dossier marker is missing: ${marker}`);
  check(index > previous, `approved dossier order is incorrect: ${marker}`);
  previous = Math.max(previous, index);
}
hasAll(view, ['#assessment', '#organizations-control', '#mechanism', '#reserves-redemption', '#deployments-legal-context', '#history', '#evidence', '#known-unknowns', '#more'], 'local navigation destination missing');
hasAll(view, ['<dt>Name</dt>', '<dt>Symbol</dt>', '<dt>Aliases</dt>', '<dt>Asset class</dt>', '<dt>Lifecycle status</dt>', '<dt>Issuance status</dt>', '<dt>Canonical record ID</dt>', '<dt>Route slug</dt>', '<dt>Record confidence</dt>', '<dt>Last reviewed</dt>'], 'identity field missing');
hasAll(view, ['<dt>Reference target</dt>', '<dt>Reference kind</dt>', '<dt>Comparison category</dt>', '<dt>Target value</dt>', '<dt>Reference methodology</dt>', '<dt>Public backing model</dt>', '<dt>Canonical backing types</dt>', '<dt>Reserve component categories</dt>', '<dt>Primary stabilization mechanism</dt>', '<dt>Recorded model description</dt>', '<dt>Redemption / exit model</dt>', '<dt>Valuation source</dt>', '<dt>Yield / rebase profile</dt>', '<dt>Classification notes</dt>'], 'mechanics field missing');
check(organizations.includes('data-table-kind="stablecoin-organizations"') && organizations.includes('data-mobile-representation-for="stablecoin-organizations"'), 'organization representations are incomplete');
hasAll(values, ['Disclosure status', 'Backing types', 'Profile confidence', 'Current status', 'Settlement asset', 'Eligible parties', 'Retail access', 'Institutional access', 'Minimum amount', 'Settlement time', 'Regional limits', 'Assets covered', 'Authority / publisher', 'What remains unclear', 'Value state', 'Priority', 'Last checked'], 'value-state field missing');
hasAll(deployments, ['Network record state', 'Operational state', 'Canonicality', 'Verification state', 'Contract identity state', 'Contract or identifier'], 'deployment field missing');
check(view.includes('tableKind="stablecoin-sources"') && evidence.includes('Supported claims') && evidence.includes('Reliability'), 'evidence contract is incomplete');
hasAll(view, ['/stablecoins/', '/events/', '/methodology/', '/contact/', '/data/manifest.json', 'relatedGuides.map'], 'further-reading destination missing');
hasAll(combined, ['No dated material event is currently recorded.', 'No reserve components have been recorded.', 'No separate model-change event is currently recorded.'], 'intentional empty state missing');
check(!combined.includes('fetch('), 'runtime external fetch is prohibited');
check(!combined.toLowerCase().includes('safety score') && !combined.toLowerCase().includes('transparency score'), 'synthetic score is prohibited');
hasAll(styles, ['.stablecoin-dossier-masthead', '.stablecoin-dossier-facts', '.stablecoin-material-change', '.stablecoin-dossier-nav', '.stablecoin-dossier-section', '.stablecoin-section-heading', '.stablecoin-identity-ledger', '.stablecoin-mechanism-ledger', '.stablecoin-value-state-group', '.stablecoin-further-reading', '@media (max-width: 719px)', '@media (forced-colors: active)', 'border-radius: 0', 'box-shadow: none'], 'dossier style missing');
check(overrides.includes('.stablecoin-identity-table') && overrides.includes('data-mobile-representation-for="stablecoin-overview"'), 'identity responsive override is missing');
hasAll(sectionStyles, ['.stablecoin-legal-group', '.stablecoin-unknown-group', '.stablecoin-open-questions'], 'ordered section style missing');
check(!styles.includes('radial-gradient') && !styles.includes('.metric-card') && !styles.includes('.stablecoin-dossier-hero'), 'legacy dossier styling remains');

const result = { schema_version: '1.0', generated_at: new Date().toISOString(), ok: failures.length === 0, page_family: 'editorial_ledger_research_dossier', canonical_record_changes: 0, route_changes: 0, synthetic_scores: 0, failures };
const output = path.join(root, 'data/generated/ui-v3-stablecoin-detail-validation.json');
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, `${JSON.stringify(result, null, 2)}\n`);
if (failures.length) { console.error(JSON.stringify(result, null, 2)); process.exit(1); }
console.log(JSON.stringify(result, null, 2));
