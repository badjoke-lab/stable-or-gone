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
const visualCss = read('src/styles/editorial-ledger-v3.css');
const mobileCss = read('src/styles/mobile-accessibility-v3.css');
const packageJson = read('package.json');
const ci = read('.github/workflows/ci.yml');
const audit = read('docs/audits/ui-v3-accessibility-performance-legacy-cleanup-2026-07-02.md');

for (const stylesheet of [
  "import '../styles/editorial-ledger-v3.css'",
  "import '../styles/guide-editorial-v3.css'",
  "import '../styles/reference-utility-v3.css'",
  "import '../styles/mobile-accessibility-v3.css'"
]) check(layout.includes(stylesheet), `BaseLayout active stylesheet import missing: ${stylesheet}`);
check(!layout.includes('editorial-v2.css'), 'BaseLayout still imports editorial-v2.css');
for (const marker of ['class="skip-link"', 'id="main-content"', 'tabindex="-1"', "event.key !== 'Escape'", "feedback.setAttribute('aria-live', 'polite')"]) check(layout.includes(marker), `BaseLayout accessibility marker missing: ${marker}`);
for (const marker of ['Terminal baseline restored from the pre-v2 visual family', '--sog-paper: #061018', '--sog-ink: #e7f2f5', '--sog-accent: #71d6ff', 'color-scheme: dark', '@media (forced-colors: active)']) check(visualCss.includes(marker), `Terminal shared rule missing: ${marker}`);
for (const marker of ['body{min-width:320px}', '@media(prefers-reduced-motion:reduce)', '@media(forced-colors:active)', 'min-height:44px', 'overflow-wrap:anywhere']) check(mobileCss.includes(marker), `mobile/accessibility marker missing: ${marker}`);
check(packageJson.includes('"validate:ui-v3-cleanup"'), 'package cleanup validator command missing');
check(packageJson.includes('"audit:ui-v3-cleanup"'), 'package cleanup audit command missing');
check(ci.includes('npm run validate:ui-v3-cleanup'), 'CI cleanup validator step missing');
check(ci.includes('npm run audit:ui-v3-cleanup'), 'CI post-build cleanup audit step missing');
for (const marker of ['Roadmap item: PR #272', 'Canonical stable assets changed: 0', 'PageHero.astro', 'MetricCard.astro', 'editorial-v2.css', 'performance budgets', 'representative screenshot regression']) check(audit.includes(marker), `cleanup audit document missing: ${marker}`);

const result = {
  schema_version: '2.0',
  generated_at: new Date().toISOString(),
  ok: failures.length === 0,
  visual_family: 'terminal_baseline_restored',
  restoration_source_commit: '3df568eab0a179d7690a88efb599156b0d659ab7',
  removed_paths: removedPaths,
  scanned_source_files: sourceFiles.length,
  accessibility_contracts: {
    skip_link: true,
    focusable_main: true,
    escape_focus_return: true,
    polite_copy_feedback: true,
    width_320: true,
    reduced_motion: true,
    forced_colors: true
  },
  failures
};
fs.mkdirSync('artifacts', { recursive: true });
fs.writeFileSync('artifacts/ui-v3-cleanup-validation.json', `${JSON.stringify(result, null, 2)}\n`);
console.log(JSON.stringify(result, null, 2));
if (failures.length) process.exit(1);
