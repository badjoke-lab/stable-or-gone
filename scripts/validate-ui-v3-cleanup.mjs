import fs from 'node:fs';
import path from 'node:path';

const read = (file) => fs.readFileSync(file, 'utf8');
const failures = [];
const check = (value, message) => { if (!value) failures.push(message); };
const removedPaths = [
  'src/components/PageHero.astro',
  'src/components/MetricCard.astro',
  'src/styles/editorial-v2.css'
];
const inactiveCompatibilityStyles = [
  'exact-pre-v2-override.css',
  'pre-v2-audit-fixes.css',
  'pre-v2-pass3.css',
  'pre-v2-final-structural-fixes.css',
  'pre-v2-guide-type-fix.css',
  'pre-v2-mobile-tail-fixes.css'
];

for (const file of removedPaths) check(!fs.existsSync(file), `superseded file still exists: ${file}`);

const sourceFiles = [];
const walk = (directory) => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(target);
    else if (/\.(astro|css|js|mjs|ts|tsx)$/.test(entry.name)) sourceFiles.push(target);
  }
};
walk('src');

for (const file of sourceFiles) {
  const content = read(file);
  const prohibitedMarkers = file.endsWith('.css')
    ? ['editorial-v2.css']
    : ['PageHero', 'MetricCard', 'editorial-v2.css'];
  for (const marker of prohibitedMarkers) check(!content.includes(marker), `${file}: superseded marker remains: ${marker}`);
  if (!file.endsWith('.css')) {
    for (const stylesheet of inactiveCompatibilityStyles) {
      check(!content.includes(stylesheet), `${file}: pre-v2 compatibility stylesheet remains active: ${stylesheet}`);
    }
  }
}

const layout = read('src/layouts/BaseLayout.astro');
const brand = read('src/components/BrandLockup.astro');
const issuerControlEvents = read('src/components/IssuerControlEvents.astro');
const shellCss = read('src/styles/v3-cya-dark-shell.css');
const shellCorrectionsCss = read('src/styles/v3-cya-dark-shell-corrections.css');
const registryCss = read('src/styles/v3-cya-dark-registry.css');
const remediationCss = read('src/styles/v3-exhaustive-remediation.css');
const colorRemediationCss = read('src/styles/v3-color-system-remediation.css');
const readabilityCss = read('src/styles/v3-readability-hierarchy.css');
const readabilityComponentCss = read('src/styles/v3-readability-component-corrections.css');
const readabilityFinalCss = read('src/styles/v3-readability-final-overrides.css');
const packageJson = read('package.json');
const ci = read('.github/workflows/ci.yml');
const screenshotWorkflow = read('.github/workflows/capture-screenshots.yml');

for (const stylesheet of [
  "import '../styles/v3-cya-dark-shell.css'",
  "import '../styles/v3-cya-dark-shell-corrections.css'",
  "import '../styles/v3-cya-dark-registry.css'",
  "import '../styles/v3-cya-dark-home.css'",
  "import '../styles/v3-cya-dark-detail.css'",
  "import '../styles/v3-cya-dark-indexes.css'",
  "import '../styles/v3-cya-dark-analysis.css'",
  "import '../styles/v3-cya-dark-research-longform.css'",
  "import '../styles/v3-exhaustive-remediation.css'",
  "import '../styles/v3-color-system-remediation.css'",
  "import '../styles/v3-readability-hierarchy.css'",
  "import '../styles/v3-readability-component-corrections.css'",
  "import '../styles/v3-readability-final-overrides.css'"
]) check(brand.includes(stylesheet), `BrandLockup active stylesheet import missing: ${stylesheet}`);

check(brand.indexOf("import '../styles/v3-color-system-remediation.css'") > brand.indexOf("import '../styles/v3-exhaustive-remediation.css'"), 'color-system remediation must load after exhaustive remediation');
check(brand.indexOf("import '../styles/v3-readability-hierarchy.css'") > brand.indexOf("import '../styles/v3-color-system-remediation.css'"), 'readability hierarchy must load after color-system remediation');
check(brand.indexOf("import '../styles/v3-readability-component-corrections.css'") > brand.indexOf("import '../styles/v3-readability-hierarchy.css'"), 'readability component corrections must load after readability hierarchy');
check(brand.indexOf("import '../styles/v3-readability-final-overrides.css'") > brand.indexOf("import '../styles/v3-readability-component-corrections.css'"), 'final readability overrides must load last');

for (const stylesheet of [
  "import '../styles/editorial-ledger-v3.css'",
  "import '../styles/mobile-accessibility-v3.css'",
  "import '../styles/editorial-v2.css'",
  ...inactiveCompatibilityStyles.map((name) => `import '../styles/${name}'`)
]) check(!brand.includes(stylesheet) && !layout.includes(stylesheet), `superseded active stylesheet import remains: ${stylesheet}`);

check(!issuerControlEvents.includes('class="panel registry"'), 'IssuerControlEvents legacy panel implementation remains active');
check(issuerControlEvents.includes('class="issuer-control-events"'), 'IssuerControlEvents V3 wrapper is missing');
check(issuerControlEvents.includes('issuer-control-events__cards'), 'IssuerControlEvents mobile cards are missing');

for (const marker of [
  'class="skip-link"',
  'id="main-content"',
  'tabindex="-1"',
  "event.key !== 'Escape'",
  "feedback.setAttribute('aria-live', 'polite')",
  "window.matchMedia('(max-width: 820px)').matches"
]) check(layout.includes(marker), `BaseLayout accessibility marker missing: ${marker}`);

for (const marker of [
  '--v3-bg: #050607',
  '--v3-text: #f1efe8',
  '--v3-accent: #67cef4',
  'color-scheme: dark',
  '.site-primary-navigation',
  '.site-footer-inner'
]) check(shellCss.includes(marker), `CYA-dark shell rule missing: ${marker}`);

for (const marker of [
  '--v3-text-muted: #c0beb6',
  '--v3-text-quiet: #afaea7',
  '@media (max-width: 820px)',
  '.mobile-navigation-panel'
]) check(shellCorrectionsCss.includes(marker), `CYA-dark shell correction missing: ${marker}`);

for (const marker of [
  '.stablecoin-index-page',
  '.stablecoin-index-registry',
  '.stablecoin-index-toolbar',
  'border-radius: 0',
  'box-shadow: none',
  '--v3-rule'
]) check(registryCss.includes(marker), `CYA-dark registry rule missing: ${marker}`);

for (const marker of [
  '.issuer-control-events__cards',
  '.home-recent table',
  'min-width: 0 !important',
  '.organization-detail-page'
]) check(remediationCss.includes(marker), `exhaustive UI remediation rule missing: ${marker}`);

for (const marker of [
  '--gold: var(--v3-accent)',
  '--sog-link: var(--v3-accent)',
  '--shell-link: var(--v3-accent)',
  '-webkit-font-smoothing: antialiased',
  '.support-callout',
  '.stats-methodology-notice',
  '.organization-latest-change',
  '.organization-unknowns-r5'
]) check(colorRemediationCss.includes(marker), `color-system remediation rule missing: ${marker}`);

for (const marker of [
  '--v3-copy-size: 1rem',
  '--v3-ui-size: .875rem',
  '.site-primary-navigation a',
  '.home-status-label',
  'Link roles',
  '.event-detail-title',
  '.stablecoin-dossier-title-row',
  '@media (max-width: 820px)'
]) check(readabilityCss.includes(marker), `readability hierarchy rule missing: ${marker}`);

for (const marker of [
  'Registry titles are functional identifiers',
  'font-family: var(--v3-sans)',
  '.home-status-ledger dt > .chip',
  'font-size: max(.875rem, 1em)',
  'font-size: max(.9375rem, 1em)'
]) check(readabilityComponentCss.includes(marker), `readability component correction missing: ${marker}`);

for (const marker of [
  'Final exhaustive readability overrides',
  '.site-footer .v3-footer-links a',
  '.mobile-navigation-panel .mobile-navigation-links a',
  '.mobile-record-list dt',
  '.mobile-record-list dd',
  '.stablecoin-dossier-nav a',
  '.organization-detail-page details#unknowns article p',
  'font-size: .9375rem !important',
  'min-height: 44px !important'
]) check(readabilityFinalCss.includes(marker), `final readability override missing: ${marker}`);

check(packageJson.includes('"validate:ui-v3-cleanup"'), 'package cleanup validator command missing');
check(packageJson.includes('"audit:ui-v3-cleanup"'), 'package cleanup audit command missing');
check(ci.includes('npm run validate:ui-v3-cleanup'), 'CI cleanup validator step missing');
check(ci.includes('npm run audit:ui-v3-cleanup'), 'CI post-build cleanup audit step missing');
check(screenshotWorkflow.includes('node scripts/audit-ui-color-system.mjs'), 'desktop color audit workflow step missing');
check(screenshotWorkflow.includes('node scripts/audit-ui-color-system.mjs --mobile'), 'mobile color audit workflow step missing');
check(screenshotWorkflow.includes('node scripts/validate-ui-color-system.mjs'), 'blocking color-system validator workflow step missing');
check(screenshotWorkflow.includes('node scripts/audit-ui-readability.mjs'), 'desktop readability audit workflow step missing');
check(screenshotWorkflow.includes('node scripts/audit-ui-readability.mjs --mobile'), 'mobile readability audit workflow step missing');
check(screenshotWorkflow.includes('node scripts/validate-ui-readability.mjs'), 'blocking readability validator workflow step missing');

const result = {
  schema_version: '3.6',
  generated_at: new Date().toISOString(),
  ok: failures.length === 0,
  visual_family: 'cya_dark_historical_registry',
  active_shell: 'src/styles/v3-cya-dark-shell.css',
  active_shell_corrections: 'src/styles/v3-cya-dark-shell-corrections.css',
  active_exhaustive_remediation: 'src/styles/v3-exhaustive-remediation.css',
  active_color_system_remediation: 'src/styles/v3-color-system-remediation.css',
  active_readability_hierarchy: 'src/styles/v3-readability-hierarchy.css',
  active_readability_component_corrections: 'src/styles/v3-readability-component-corrections.css',
  active_readability_final_overrides: 'src/styles/v3-readability-final-overrides.css',
  inactive_compatibility_styles: inactiveCompatibilityStyles,
  removed_paths: removedPaths,
  scanned_source_files: sourceFiles.length,
  accessibility_contracts: {
    skip_link: true,
    focusable_main: true,
    escape_focus_return: true,
    polite_copy_feedback: true,
    compact_mobile_navigation: true,
    representative_contrast_gate: true,
    exhaustive_screenshot_gate: true,
    exhaustive_color_system_gate: true,
    exhaustive_readability_gate: true
  },
  failures
};
fs.mkdirSync('artifacts', { recursive: true });
fs.writeFileSync('artifacts/ui-v3-cleanup-validation.json', `${JSON.stringify(result, null, 2)}\n`);
console.log(JSON.stringify(result, null, 2));
if (failures.length) process.exit(1);
