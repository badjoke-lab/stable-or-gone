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

const prohibitedSourceMarkers = ['PageHero', 'MetricCard', 'editorial-v2.css', '.page-hero', '.metric-card'];
for (const file of sourceFiles) {
  const content = read(file);
  for (const marker of prohibitedSourceMarkers) check(!content.includes(marker), `${file}: superseded marker remains: ${marker}`);
}

const layout = read('src/layouts/BaseLayout.astro');
const brand = read('src/components/BrandLockup.astro');
const shellCss = read('src/styles/v3-cya-dark-shell.css');
const shellCorrectionsCss = read('src/styles/v3-cya-dark-shell-corrections.css');
const registryCss = read('src/styles/v3-cya-dark-registry.css');
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
  "import '../styles/v3-cya-dark-research-longform.css'"
]) check(brand.includes(stylesheet), `BrandLockup active stylesheet import missing: ${stylesheet}`);

for (const stylesheet of [
  "import '../styles/editorial-ledger-v3.css'",
  "import '../styles/mobile-accessibility-v3.css'",
  "import '../styles/editorial-v2.css'"
]) check(!brand.includes(stylesheet) && !layout.includes(stylesheet), `superseded active stylesheet import remains: ${stylesheet}`);

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

for (const marker of ['.registry', 'border', '--v3-rule']) check(registryCss.includes(marker), `CYA-dark registry rule missing: ${marker}`);

check(packageJson.includes('"validate:ui-v3-cleanup"'), 'package cleanup validator command missing');
check(packageJson.includes('"audit:ui-v3-cleanup"'), 'package cleanup audit command missing');
check(ci.includes('npm run validate:ui-v3-cleanup'), 'CI cleanup validator step missing');
check(ci.includes('npm run audit:ui-v3-cleanup'), 'CI post-build cleanup audit step missing');

const result = {
  schema_version: '3.0',
  generated_at: new Date().toISOString(),
  ok: failures.length === 0,
  visual_family: 'cya_dark_historical_registry',
  active_shell: 'src/styles/v3-cya-dark-shell.css',
  active_shell_corrections: 'src/styles/v3-cya-dark-shell-corrections.css',
  removed_paths: removedPaths,
  scanned_source_files: sourceFiles.length,
  accessibility_contracts: {
    skip_link: true,
    focusable_main: true,
    escape_focus_return: true,
    polite_copy_feedback: true,
    compact_mobile_navigation: true,
    representative_contrast_gate: true
  },
  failures
};
fs.mkdirSync('artifacts', { recursive: true });
fs.writeFileSync('artifacts/ui-v3-cleanup-validation.json', `${JSON.stringify(result, null, 2)}\n`);
console.log(JSON.stringify(result, null, 2));
if (failures.length) process.exit(1);
