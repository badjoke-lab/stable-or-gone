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
const valueSections = read('src/components/StablecoinValueStateSections.astro');

check(pageFamilyContracts.length === 11, 'all eleven Editorial Ledger page families must be covered');
check(requiredMobileTableKinds.length === 25, 'all twenty-five protected table kinds must remain registered');
check(Object.keys(implementedMobileTableRepresentations).length === 25, 'all protected table kinds need compact representations');
check(responsiveAccessibilityPolicies.implementation_deferred === false, 'mobile hardening may not remain deferred');
check(responsiveAccessibilityPolicies.implementation_starts_at_pr === 270, 'mobile hardening PR changed');

for (const marker of [
  'mobile-accessibility-v3.css', 'data-disclosure', 'aria-controls="site-about-panel"', 'aria-controls="mobile-navigation-panel"',
  "setAttribute('aria-expanded', String(details.open))", "event.key !== 'Escape'", 'trigger.focus()', 'focusAnchorTarget',
  'data-copy-value', 'data-copy-feedback', "aria-live', 'polite'"
]) check(layout.includes(marker), `BaseLayout accessibility marker missing: ${marker}`);
check(brand.includes('MobileTableRuntime') && brand.includes('DisclosureRuntime') && brand.includes('loadsGlobalRuntime'), 'global mobile and disclosure runtimes are not loaded once from the shared header');
for (const marker of [
  'buildMobileTableRepresentations', 'table[data-table-kind][data-mobile-table="scroll-preserve"]',
  'data.mobileRepresentationFor = kind', 'createDefinitionRepresentation', 'createRecordRepresentation',
  'Contract or identifier', 'Copy full identifier', 'data.generatedCopyValue', "aria-live', 'polite'"
]) check(runtime.includes(marker), `mobile table runtime missing: ${marker}`);
for (const marker of ["details:not([data-disclosure])", "setAttribute('aria-expanded', String(details.open))", "event.key !== 'Escape'", 'trigger.focus()', "setAttribute('aria-controls'"]) check(disclosureRuntime.includes(marker), `disclosure runtime missing: ${marker}`);
for (const kind of ['stablecoin-reserve-profile', 'stablecoin-redemption-profile', 'stablecoin-reserve-history', 'stablecoin-regulatory-notices', 'stablecoin-open-questions']) check(valueSections.includes(`data-mobile-representation-for="${kind}"`), `explicit dossier mobile representation missing: ${kind}`);
for (const marker of [
  'body{min-width:320px}', 'max-width:719px', 'max-width:360px', 'min-height:44px',
  'overflow-wrap:anywhere', 'prefers-reduced-motion', 'forced-colors', '[data-anchor-focus]:focus',
  '.mobile-definition-list', '.mobile-record-list', '.mobile-copy-feedback'
]) check(css.includes(marker), `mobile accessibility CSS missing: ${marker}`);
check(!css.includes('th:nth-child(') && !css.includes('td:nth-child('), 'generic mobile column hiding is prohibited');

const generatedKinds = Object.entries(implementedMobileTableRepresentations).filter(([, file]) => file === 'src/components/MobileTableRuntime.astro').map(([kind]) => kind);
check(generatedKinds.length === 8, 'generated compact representation count changed');
for (const kind of ['stablecoin-record-coverage', 'issuer-control-events', 'stablecoin-event-timeline', 'stablecoin-deployments', 'stablecoin-sources', 'methodology-value-states', 'methodology-primary-display-relationships', 'methodology-evidence-source-identities']) check(generatedKinds.includes(kind), `runtime-generated compact representation missing: ${kind}`);

const result = {
  schema_version: '1.0',
  ok: failures.length === 0,
  gate: 'V3-E',
  page_families: pageFamilyContracts.length,
  protected_tables: requiredMobileTableKinds.length,
  explicit_representations: 17,
  generated_representations: generatedKinds.length,
  route_changes: 0,
  canonical_record_changes: 0,
  failures
};
console.log(JSON.stringify(result, null, 2));
if (failures.length) process.exit(1);
