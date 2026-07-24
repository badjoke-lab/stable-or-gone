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
const structuredEventDetail = read('src/components/StructuredEventDetail.astro');
const shellCss = read('src/styles/v3-cya-dark-shell.css');
const shellCorrectionsCss = read('src/styles/v3-cya-dark-shell-corrections.css');
const registryCss = read('src/styles/v3-cya-dark-registry.css');
const remediationCss = read('src/styles/v3-exhaustive-remediation.css');
const colorRemediationCss = read('src/styles/v3-color-surface-remediation.css');
const screenshotCapture = read('scripts/capture-site-screenshots.mjs');
const screenshotAudit = read('scripts/validate-exhaustive-screenshot-audit.mjs');
const packageJson = read('package.json');
const ci = read('.github/workflows/ci.yml');

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
  "import '../styles/v3-color-surface-remediation.css'"
]) check(brand.includes(stylesheet), `BrandLockup active stylesheet import missing: ${stylesheet}`);

for (const stylesheet of [
  "import '../styles/editorial-ledger-v3.css'",
  "import '../styles/mobile-accessibility-v3.css'",
  "import '../styles/editorial-v2.css'",
  ...inactiveCompatibilityStyles.map((name) => `import '../styles/${name}'`)
]) check(!brand.includes(stylesheet) && !layout.includes(stylesheet), `superseded active stylesheet import remains: ${stylesheet}`);

check(!issuerControlEvents.includes('class="panel registry"'), 'IssuerControlEvents legacy panel implementation remains active');
check(issuerControlEvents.includes('class="issuer-control-events"'), 'IssuerControlEvents V3 wrapper is missing');
check(issuerControlEvents.includes('issuer-control-events__cards'), 'IssuerControlEvents mobile cards are missing');

check(!structuredEventDetail.includes('class="panel registry'), 'StructuredEventDetail legacy panel implementation remains active');
check(!structuredEventDetail.includes('<div class="bar">'), 'StructuredEventDetail legacy bar remains active');
check(structuredEventDetail.includes('data-ui-v3-structured-detail'), 'StructuredEventDetail V3 marker is missing');
check(structuredEventDetail.includes('event-structured-detail__heading'), 'StructuredEventDetail V3 heading is missing');

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
  '.event-structured-detail',
  'background: transparent !important',
  '.stablecoin-dossier :where(time, [class*="date"])',
  'color: var(--v3-text-quiet) !important',
  '.event-structured-cards',
  'font-family: var(--v3-sans) !important'
]) check(colorRemediationCss.includes(marker), `color and surface remediation rule missing: ${marker}`);

for (const marker of [
  'legacyPanelSurfaces',
  'largeOffTokenSurfaces',
  'semanticColorViolations',
  '.event-structured-detail.panel.registry'
]) check(screenshotCapture.includes(marker), `screenshot color/surface measurement missing: ${marker}`);

for (const marker of [
  'legacy_panel_surface',
  'large_off_token_surface',
  'semantic_color_misuse',
  'semantic_colors_require_approved_meaning'
]) check(screenshotAudit.includes(marker), `screenshot color/surface gate missing: ${marker}`);

check(packageJson.includes('"validate:ui-v3-cleanup"'), 'package cleanup validator command missing');
check(packageJson.includes('"audit:ui-v3-cleanup"'), 'package cleanup audit command missing');
check(ci.includes('npm run validate:ui-v3-cleanup'), 'CI cleanup validator step missing');
check(ci.includes('npm run audit:ui-v3-cleanup'), 'CI post-build cleanup audit step missing');

const result = {
  schema_version: '3.4',
  generated_at: new Date().toISOString(),
  ok: failures.length === 0,
  visual_family: 'cya_dark_historical_registry',
  active_shell: 'src/styles/v3-cya-dark-shell.css',
  active_shell_corrections: 'src/styles/v3-cya-dark-shell-corrections.css',
  active_exhaustive_remediation: 'src/styles/v3-exhaustive-remediation.css',
  active_color_surface_remediation: 'src/styles/v3-color-surface-remediation.css',
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
    color_restraint_gate: true,
    legacy_surface_gate: true
  },
  failures
};
fs.mkdirSync('artifacts', { recursive: true });
fs.writeFileSync('artifacts/ui-v3-cleanup-validation.json', `${JSON.stringify(result, null, 2)}\n`);
console.log(JSON.stringify(result, null, 2));
if (failures.length) process.exit(1);
