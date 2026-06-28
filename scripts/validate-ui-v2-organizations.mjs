import './validate-ui-v2-events.mjs';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

const indexSource = read('src/pages/issuers/index.astro');
const detailSource = read('src/pages/issuer/[slug].astro');
const indexCss = read('src/styles/organization-index.css');
const detailCss = read('src/styles/organization-detail.css');
const roadmap = read('docs/roadmap.md');
const plan = read('docs/ui-redesign/implementation-plan.md');

check(indexSource.includes("import PageHero from '../../components/PageHero.astro'"), 'Organizations index must use PageHero');
check(indexSource.includes("import MetricCard from '../../components/MetricCard.astro'"), 'Organizations index must use MetricCard');
check(indexSource.includes('data-ui-v2-organizations'), 'Organizations index v2 marker is missing');
check(indexSource.includes('organization-index-metrics'), 'Organizations index metric grid is missing');
for (const label of ['Organizations', 'Relationships', 'Connected assets', 'Source identities']) check(indexSource.includes(`label="${label}"`), `Organizations index metric is missing: ${label}`);
for (const group of ['category', 'regulatory', 'jurisdiction', 'role', 'relationship_status']) check(indexSource.includes(`id: '${group}'`), `Organizations index filter is missing: ${group}`);
for (const sort of ['name_asc', 'name_desc', 'assets_most', 'relationships_most', 'evidence_most']) check(indexSource.includes(`value="${sort}"`), `Organizations index sort is missing: ${sort}`);
for (const header of ['Organization', 'Organization category', 'Regulatory character', 'Jurisdiction', 'Functional roles', 'Relationship state', 'Connected assets', 'Record confidence']) check(indexSource.includes(`<th>${header}</th>`), `Organizations index header is missing: ${header}`);
check(indexSource.includes('OrganizationIndexCard'), 'Organizations index compact cards are missing');
check(indexSource.includes("import '../../scripts/organization-index'"), 'Organizations index client controller is missing');

check(detailSource.includes("import PageHero from '../../components/PageHero.astro'"), 'Organization detail must use PageHero');
check(detailSource.includes("import MetricCard from '../../components/MetricCard.astro'"), 'Organization detail must use MetricCard');
check(detailSource.includes('data-ui-v2-organization-detail'), 'Organization detail v2 marker is missing');
check(detailSource.includes('organization-detail-initial-badge'), 'Organization initial badge is missing');
for (const label of ['Category', 'Jurisdiction', 'Connected assets', 'Relationships', 'Events', 'Source identities']) check(detailSource.includes(`label="${label}"`), `Organization detail metric is missing: ${label}`);
for (const anchor of ['#overview', '#relationships', '#events', '#evidence', '#unknowns', '#corrections']) check(detailSource.includes(`href="${anchor}"`), `Organization detail navigation is missing: ${anchor}`);
for (const header of ['Organization category', 'Canonical organization type', 'Legal form', 'Legal-form state', 'Regulatory character', 'Jurisdiction', 'Jurisdiction scope', 'Functional roles', 'Relationship states', 'Official website', 'Record confidence', 'Last reviewed']) check(detailSource.includes(`<th>${header}</th>`), `Organization overview field is missing: ${header}`);
for (const header of ['Stablecoin', 'Symbol', 'Functional role', 'Display priority', 'From', 'Until', 'Relationship state', 'Stablecoin lifecycle']) check(detailSource.includes(`<th>${header}</th>`), `Organization relationship field is missing: ${header}`);
check(detailSource.includes('currentRelationships') && detailSource.includes('historicalRelationships'), 'Current and historical organization relationships must remain separate');
check(detailSource.includes('EvidenceSourceTable'), 'Organization evidence table is missing');
check(detailSource.includes('knownUnknowns'), 'Organization known unknowns are missing');
check(detailSource.includes('/contact/') && detailSource.includes('/methodology/') && detailSource.includes('/data/manifest.json'), 'Organization correction and further-reading destinations are incomplete');
check(indexCss.includes('.organization-index-metrics') && indexCss.includes('@media (max-width: 719px)'), 'Organizations index responsive v2 styles are incomplete');
check(detailCss.includes('.organization-detail-metrics') && detailCss.includes('@media (forced-colors: active)') && detailCss.includes('@media (prefers-reduced-motion: reduce)'), 'Organization detail accessibility styles are incomplete');
check(indexCss.includes(':focus-visible') && detailCss.includes(':focus-visible'), 'Organization focus-visible styles are missing');
check(!indexSource.includes('fetch(') && !detailSource.includes('fetch('), 'Organization pages must not fetch external runtime data');
for (const rejected of ['watchlist', 'follow button', 'recently viewed', 'safety score', 'transparency score']) check(!`${indexSource}\n${detailSource}`.toLowerCase().includes(rejected), `Rejected organization feature remains: ${rejected}`);
check(roadmap.includes('PR #212') && plan.includes('PR #212'), 'PR #212 must remain in the canonical schedule');

const report = { schema_version: '1.0', checked_at: new Date().toISOString(), ok: failures.length === 0, pages: ['src/pages/issuers/index.astro', 'src/pages/issuer/[slug].astro'], failures };
if (failures.length > 0) { console.error(JSON.stringify(report, null, 2)); process.exit(1); }
console.log(JSON.stringify(report, null, 2));
