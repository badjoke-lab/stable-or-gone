import fs from 'node:fs';
import path from 'node:path';

const read = (file) => fs.readFileSync(file, 'utf8');
const failures = [];
const check = (value, message) => { if (!value) failures.push(message); };

const layoutPath = 'src/layouts/BaseLayout.astro';
const brandPath = 'src/components/BrandLockup.astro';
const authorityPath = 'src/styles/public-ui.css';
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
const physicalCssFiles = [];
const walkCss = (directory) => {
  if (!fs.existsSync(directory)) return;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) walkCss(target);
    else if (entry.name.endsWith('.css')) physicalCssFiles.push(target);
  }
};
for (const root of ['src', 'public']) walkCss(root);

let cssImports = [];
let cssFiles = [];
let inlineStyleFiles = [];
let inlineStyleAttributeFiles = [];
let authorityLineCount = 0;
if (failures.length === 0) {
  const layout = read(layoutPath);
  const brand = read(brandPath);
  const authority = read(authorityPath);
  const packageJson = read(packagePath);
  const ci = read(ciPath);
  const screenshotWorkflow = read(screenshotWorkflowPath);
  const runtimeAudit = read(runtimeAuditPath);

  cssFiles = physicalCssFiles.sort();
  check(cssFiles.length === 1 && cssFiles[0] === authorityPath, `exactly one CSS file is allowed; found ${cssFiles.length}: ${cssFiles.join(', ')}`);

  authorityLineCount = authority.split(/\r?\n/).length;
  check(authorityLineCount < 553, `public-ui.css must stay below the rejected 553-line baseline; found ${authorityLineCount}`);
  check(!authority.includes('!important'), 'public-ui.css must not contain !important');
  check(!/@import\s/i.test(authority), 'public-ui.css must not contain @import');

  const importPattern = /import\s+['"]([^'"]+\.css)['"]/g;
  for (const file of sourceFiles.filter((file) => !file.endsWith('.css'))) {
    for (const match of read(file).matchAll(importPattern)) cssImports.push({ file, import: match[1] });
  }
  check(cssImports.length === 1, `expected exactly one public CSS import, found ${cssImports.length}`);
  check(cssImports[0]?.file === brandPath && cssImports[0]?.import === '../styles/public-ui.css', 'only BrandLockup may import public-ui.css');
  check(!importPattern.test(layout), 'BaseLayout must not import another stylesheet');

  const astroFiles = sourceFiles.filter((file) => file.endsWith('.astro'));
  inlineStyleFiles = astroFiles.filter((file) => /<style(?:\s|>)/i.test(read(file)));
  check(inlineStyleFiles.length === 0, `inline Astro style blocks are forbidden; found ${inlineStyleFiles.length}: ${inlineStyleFiles.join(', ')}`);
  inlineStyleAttributeFiles = astroFiles.filter((file) => /\sstyle\s*=\s*(?:["'{])/i.test(read(file)));
  check(inlineStyleAttributeFiles.length === 0, `inline style attributes are forbidden; found ${inlineStyleAttributeFiles.length}: ${inlineStyleAttributeFiles.join(', ')}`);

  for (const marker of [
    '--ui-bg:', '--ui-text:', '--ui-copy:', '--ui-muted:', '--ui-link:', '--ui-hover:', '--ui-visited:',
    '--ui-serif:', '--ui-sans:', '--ui-mono:',
    'a:visited', 'a:hover', 'a:active', ':focus-visible',
    '.chip, [class*="badge"]', '--ui-radius: 0;', '--ui-pill: 0;', 'border-radius: 0', 'background: transparent',
    '.event-structured-detail', '.event-detail-evidence-r5',
    '.home-ledger', '.home-intro', '.home-facts', '.editorial-directory', '.registry-panel', '.home-registry-table', '.stablecoin-index-page', '.event-index-page', '.organization-index-page',
    '.stats-page', '.timeline-page', '.compare-page', '.ar-explorer', '.maintenance-page', '.update-feed-page',
    '@media (max-width: 640px)'
  ]) check(authority.includes(marker), `single UI authority marker missing: ${marker}`);

  for (const marker of [
    'class="skip-link"', 'id="main-content"', 'tabindex="-1"',
    "event.key !== 'Escape'", "feedback.setAttribute('aria-live', 'polite')",
    "window.matchMedia('(max-width: 820px)').matches"
  ]) check(layout.includes(marker), `BaseLayout accessibility marker missing: ${marker}`);

  check(brand.includes("import '../styles/public-ui.css'"), 'BrandLockup does not load the single UI authority');
  check(packageJson.includes('"validate:ui-v3-cleanup"'), 'package cleanup validator command missing');
  check(packageJson.includes('"audit:ui-v3-cleanup"'), 'package cleanup audit command missing');
  check(ci.includes('npm run validate:ui-v3-cleanup'), 'CI cleanup validator step missing');
  check(ci.includes('npm run audit:ui-v3-cleanup'), 'CI post-build cleanup audit step missing');

  for (const marker of [
    'Capture representative desktop routes', 'Capture representative mobile routes',
    '--samples-per-family 3',
    'Audit computed desktop colors', 'Audit computed mobile colors',
    'Audit desktop readability and hierarchy', 'Audit mobile readability and hierarchy',
    'Validate color system', 'Validate readability and hierarchy'
  ]) check(screenshotWorkflow.includes(marker), `screenshot workflow gate missing: ${marker}`);

  for (const marker of [
    'unexpected_public_font', 'raw_public_enum', 'low_contrast_public_text',
    'invalid_link_hover', 'invalid_badge_contract', 'schema_oriented_label'
  ]) check(runtimeAudit.includes(marker), `runtime UI audit marker missing: ${marker}`);
}

const result = {
  schema_version: '5.2',
  generated_at: new Date().toISOString(),
  ok: failures.length === 0,
  visual_family: 'cya_aligned_single_authority',
  active_stylesheet: authorityPath,
  active_stylesheet_line_count: authorityLineCount,
  rejected_stylesheet_line_baseline: 553,
  css_files: cssFiles,
  stylesheet_entrypoints: cssImports,
  inline_style_files: inlineStyleFiles,
  inline_style_attribute_files: inlineStyleAttributeFiles,
  scanned_source_files: sourceFiles.length,
  contracts: {
    cascade: 'exactly one CSS file, exactly one CSS import, zero Astro style blocks, zero inline style attributes, zero !important, and fewer than 553 lines',
    typography: 'serif editorial headings, sans ordinary copy, mono explicit technical values and labels',
    interactions: 'one default, visited, hover, active, and focus palette',
    badges: 'square color-coded semantic state labels with readable text are mandatory',
    runtime: 'representative desktop and mobile routes are screenshot-audited with three samples per detail family; all routes retain structural and data validation'
  },
  failures
};

fs.mkdirSync('artifacts', { recursive: true });
fs.writeFileSync('artifacts/ui-v3-cleanup-validation.json', `${JSON.stringify(result, null, 2)}\n`);
console.log(JSON.stringify(result, null, 2));
if (failures.length) process.exit(1);
