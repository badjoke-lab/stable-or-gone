import fs from 'node:fs';
import { pageFamilyContracts, responsiveAccessibilityPolicies } from '../config/responsive-accessibility-contract.mjs';
import { implementedMobileTableRepresentations, requiredMobileTableKinds } from './mobile-table-manifest.mjs';

const read = (path) => fs.readFileSync(path, 'utf8');
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const layout = read('src/layouts/BaseLayout.astro');
const runtime = read('src/components/MobileTableRuntime.astro');
const disclosureRuntime = read('src/components/DisclosureRuntime.astro');
const brand = read('src/components/BrandLockup.astro');
const css = read('src/styles/mobile-accessibility-v3.css');
const shell = read('src/styles/shell.css');
const valueSections = read('src/components/StablecoinValueStateSections.astro');

check(pageFamilyContracts.length === 11, 'all eleven protected page families must be covered');
check(requiredMobileTableKinds.length === 23, 'all twenty-three protected table kinds must remain registered');
check(Object.keys(implementedMobileTableRepresentations).length === 23, 'all protected table kinds need compact representations');
check(responsiveAccessibilityPolicies.implementation_deferred === false, 'mobile hardening may not remain deferred');
check(responsiveAccessibilityPolicies.implementation_starts_at_pr === 270, 'mobile hardening PR changed');

for (const marker of [
  'mobile-accessibility-v3.css',
  'data-shell="evidence-registry-pr411"',
  'data-disclosure',
  'aria-controls="mobile-navigation-panel"',
  'class="mobile-site-search"',
  'class="mobile-navigation-group"',
  'class="mobile-navigation-utilities"',
  "setAttribute('aria-expanded', String(details.open))",
  "event.key !== 'Escape'",
  'trigger.focus()',
  'navigation.contains(event.target)',
  'focusAnchorTarget',
  'data-copy-value',
  'data-copy-feedback',
  "aria-live', 'polite'"
]) check(layout.includes(marker), `BaseLayout accessibility marker missing: ${marker}`);
check(!layout.includes('aria-controls="site-about-panel"'), 'retired About-only disclosure remains');
check(brand.includes('MobileTableRuntime') && brand.includes('DisclosureRuntime') && brand.includes('loadsGlobalRuntime'), 'global mobile and disclosure runtimes are not loaded once from the shared header');
for (const marker of [
  'buildMobileTableRepresentations', 'table[data-table-kind][data-mobile-table="scroll-preserve"]',
  'data.mobileRepresentationFor = kind', 'createDefinitionRepresentation', 'createRecordRepresentation',
  'createEvidenceRepresentation', 'Contract or identifier', 'Copy full identifier', "aria-live', 'polite'"
]) check(runtime.includes(marker), `mobile table runtime missing: ${marker}`);
check(runtime.includes('data.generatedCopyValue') || runtime.includes('button.dataset.generatedCopyValue'), 'mobile table runtime missing generated copy value');
for (const marker of ["details:not([data-disclosure])", "setAttribute('aria-expanded', String(details.open))", "event.key !== 'Escape'", 'trigger.focus()', "setAttribute('aria-controls'"]) check(disclosureRuntime.includes(marker), `disclosure runtime missing: ${marker}`);
for (const kind of ['stablecoin-reserve-profile', 'stablecoin-redemption-profile', 'stablecoin-reserve-history', 'stablecoin-regulatory-notices', 'stablecoin-open-questions']) check(valueSections.includes(`data-mobile-representation-for="${kind}"`), `explicit dossier mobile representation missing: ${kind}`);
for (const marker of [
  'body{min-width:320px}', 'max-width:719px', 'max-width:360px', 'min-height:44px',
  'overflow-wrap:anywhere', 'prefers-reduced-motion', 'forced-colors', '[data-anchor-focus]:focus',
  '.mobile-definition-list', '.mobile-record-list', '.mobile-copy-feedback'
]) check(css.includes(marker), `mobile accessibility CSS missing: ${marker}`);
for (const marker of [
  '@media (max-width: 1120px)',
  '@media (max-width: 719px)',
  '.mobile-navigation-panel',
  '.mobile-navigation-links',
  '.mobile-navigation-utilities',
  'min-height: 44px',
  '@media (prefers-reduced-motion: reduce)',
  '@media (forced-colors: active)'
]) check(shell.includes(marker), `evidence-registry mobile shell CSS missing: ${marker}`);
check(!css.includes('th:nth-child(') && !css.includes('td:nth-child('), 'generic mobile column hiding is prohibited');

const generatedKinds = Object.entries(implementedMobileTableRepresentations).filter(([, file]) => file === 'src/components/MobileTableRuntime.astro').map(([kind]) => kind);
check(generatedKinds.length === 8, 'generated compact representation count changed');
for (const kind of ['stablecoin-record-coverage', 'issuer-control-events', 'stablecoin-event-timeline', 'stablecoin-deployments', 'stablecoin-sources', 'methodology-value-states', 'methodology-primary-display-relationships', 'methodology-evidence-source-identities']) check(generatedKinds.includes(kind), `runtime-generated compact representation missing: ${kind}`);

const result = {
  schema_version: '1.3',
  ok: failures.length === 0,
  gate: 'V3-E-R5',
  shell: 'evidence-registry-pr411',
  page_families: pageFamilyContracts.length,
  protected_tables: requiredMobileTableKinds.length,
  explicit_representations: 15,
  generated_representations: generatedKinds.length,
  retired_duplicate_tables: ['organization-overview', 'event-details'],
  route_changes: 0,
  canonical_record_changes: 0,
  owner_approval_changes: 0,
  failures
};
console.log(JSON.stringify(result, null, 2));
if (failures.length) process.exit(1);
