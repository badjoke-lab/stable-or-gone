import fs from 'node:fs';
import path from 'node:path';

const read = (file) => fs.readFileSync(file, 'utf8');
const failures = [];
const check = (value, message) => { if (!value) failures.push(message); };

const layoutPath = 'src/layouts/BaseLayout.astro';
const brandPath = 'src/components/BrandLockup.astro';
const authorityPath = 'src/styles/site-ui.css';
const packagePath = 'package.json';
const ciPath = '.github/workflows/ci.yml';
const screenshotWorkflowPath = '.github/workflows/capture-screenshots.yml';
const runtimeAuditPath = 'scripts/audit-public-typography-enums-direct.mjs';

for (const file of [layoutPath, brandPath, authorityPath, packagePath, ciPath, screenshotWorkflowPath, runtimeAuditPath]) {
  check(fs.existsSync(file), `required UI contract file missing: ${file}`);
}

const sourceFiles = [];
const walk = (directory) => {
  if (!fs.existsSync(directory)) return;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(target);
    else if (/\.(astro|css|js|mjs|ts|tsx)$/.test(entry.name)) sourceFiles.push(target);
  }
};
walk('src');

let cssImports = [];
if (failures.length === 0) {
  const layout = read(layoutPath);
  const brand = read(brandPath);
  const authority = read(authorityPath);
  const packageJson = read(packagePath);
  const ci = read(ciPath);
  const screenshotWorkflow = read(screenshotWorkflowPath);
  const runtimeAudit = read(runtimeAuditPath);

  const importPattern = /import\s+['"]([^'"]+\.css)['"]/g;
  for (const file of sourceFiles.filter((file) => !file.endsWith('.css'))) {
    for (const match of read(file).matchAll(importPattern)) cssImports.push({ file, import: match[1] });
  }
  check(cssImports.length === 1, `expected exactly one public CSS import, found ${cssImports.length}`);
  check(cssImports[0]?.file === brandPath && cssImports[0]?.import === '../styles/site-ui.css', 'only BrandLockup may import site-ui.css');
  check(!importPattern.test(layout), 'BaseLayout must not import another stylesheet');

  for (const marker of [
    '--ui-bg:', '--ui-text:', '--ui-copy:', '--ui-muted:', '--ui-link:', '--ui-link-hover:', '--ui-link-visited:',
    '--ui-serif:', '--ui-sans:', '--ui-mono:',
    'a:visited', 'a:hover', 'a:active', ':focus-visible',
    '.chip, [class*="badge"]', 'border-radius: var(--ui-radius-pill)',
    '.event-structured-detail', '.event-detail-evidence-r5',
    '.home-ledger', '.event-index-page', '.organization-index-page',
    '@media (max-width: 820px)'
  ]) check(authority.includes(marker), `single UI authority marker missing: ${marker}`);

  for (const marker of [
    'class="skip-link"', 'id="main-content"', 'tabindex="-1"',
    "event.key !== 'Escape'", "feedback.setAttribute('aria-live', 'polite')",
    "window.matchMedia('(max-width: 820px)').matches"
  ]) check(layout.includes(marker), `BaseLayout accessibility marker missing: ${marker}`);

  check(brand.includes("import '../styles/site-ui.css'"), 'BrandLockup does not load the single UI authority');
  check(packageJson.includes('"validate:ui-v3-cleanup"'), 'package cleanup validator command missing');
  check(packageJson.includes('"audit:ui-v3-cleanup"'), 'package cleanup audit command missing');
  check(ci.includes('npm run validate:ui-v3-cleanup'), 'CI cleanup validator step missing');
  check(ci.includes('npm run audit:ui-v3-cleanup'), 'CI post-build cleanup audit step missing');

  for (const marker of [
    'Audit computed desktop colors', 'Audit computed mobile colors',
    'Audit desktop readability and hierarchy', 'Audit mobile readability and hierarchy',
    'Validate exhaustive screenshot audit', 'Validate exhaustive color system',
    'Validate exhaustive readability and hierarchy'
  ]) check(screenshotWorkflow.includes(marker), `screenshot workflow gate missing: ${marker}`);

  for (const marker of [
    'unexpected_public_font', 'raw_public_enum', 'low_contrast_public_text',
    'invalid_link_hover', 'invalid_badge_contract', 'schema_oriented_label'
  ]) check(runtimeAudit.includes(marker), `runtime UI audit marker missing: ${marker}`);
}

const result = {
  schema_version: '4.0',
  generated_at: new Date().toISOString(),
  ok: failures.length === 0,
  visual_family: 'cya_aligned_single_authority',
  active_stylesheet: authorityPath,
  stylesheet_entrypoints: cssImports,
  scanned_source_files: sourceFiles.length,
  contracts: {
    cascade: 'exactly one public stylesheet import',
    typography: 'serif editorial headings, sans ordinary copy, mono explicit technical values',
    interactions: 'one default, visited, hover, active, and focus palette',
    badges: 'shape, padding, border, background, and readable state text are mandatory',
    runtime: 'all rendered desktop and mobile routes are audited'
  },
  failures
};

fs.mkdirSync('artifacts', { recursive: true });
fs.writeFileSync('artifacts/ui-v3-cleanup-validation.json', `${JSON.stringify(result, null, 2)}\n`);
console.log(JSON.stringify(result, null, 2));
if (failures.length) process.exit(1);
