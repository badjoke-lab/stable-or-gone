import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const DIST = path.join(ROOT, 'dist');
const ARTIFACT_DIR = path.join(ROOT, 'artifacts');
const failures = [];
const warnings = [];
const check = (value, message) => { if (!value) failures.push(message); };

const walk = (directory) => {
  const files = [];
  if (!fs.existsSync(directory)) return files;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...walk(target));
    else files.push(target);
  }
  return files;
};
const relative = (file) => path.relative(ROOT, file).split(path.sep).join('/');
const bytes = (file) => fs.statSync(file).size;
const sum = (values) => values.reduce((total, value) => total + value, 0);
const largest = (files) => files.map((file) => ({ file: relative(file), bytes: bytes(file) })).sort((a, b) => b.bytes - a.bytes)[0] ?? { file: null, bytes: 0 };

check(fs.existsSync(DIST), 'dist/ is missing; run the production build before this audit');
const sourceCssFiles = walk(path.join(ROOT, 'src/styles')).filter((file) => file.endsWith('.css'));
const distFiles = walk(DIST);
const distCssFiles = distFiles.filter((file) => file.endsWith('.css'));
const distJsFiles = distFiles.filter((file) => file.endsWith('.js'));
const distHtmlFiles = distFiles.filter((file) => file.endsWith('.html'));
const sourceCssBytes = sum(sourceCssFiles.map(bytes));
const distCssBytes = sum(distCssFiles.map(bytes));
const distJsBytes = sum(distJsFiles.map(bytes));
const largestCss = largest(distCssFiles);
const largestJs = largest(distJsFiles);

const budgets = {
  source_css_review_bytes: 650000,
  dist_css_bytes: 500000,
  largest_css_bytes: 220000,
  dist_js_bytes: 500000,
  largest_js_bytes: 250000,
  minimum_html_files: 350
};
check(sourceCssBytes <= budgets.source_css_review_bytes, `source CSS review ceiling exceeded: ${sourceCssBytes} > ${budgets.source_css_review_bytes}`);
check(distCssBytes <= budgets.dist_css_bytes, `built CSS exceeds budget: ${distCssBytes} > ${budgets.dist_css_bytes}`);
check(largestCss.bytes <= budgets.largest_css_bytes, `largest CSS asset exceeds budget: ${largestCss.bytes} > ${budgets.largest_css_bytes} (${largestCss.file})`);
check(distJsBytes <= budgets.dist_js_bytes, `built JS exceeds budget: ${distJsBytes} > ${budgets.dist_js_bytes}`);
check(largestJs.bytes <= budgets.largest_js_bytes, `largest JS asset exceeds budget: ${largestJs.bytes} > ${budgets.largest_js_bytes} (${largestJs.file})`);
check(distHtmlFiles.length >= budgets.minimum_html_files, `built HTML route count is unexpectedly low: ${distHtmlFiles.length} < ${budgets.minimum_html_files}`);

const universalProhibitedMarkers = ['editorial-v2.css', 'PageHero', 'MetricCard', 'page-hero', 'blue-purple-glow'];
for (const file of [...distCssFiles, ...distJsFiles, ...distHtmlFiles]) {
  const content = fs.readFileSync(file, 'utf8');
  for (const marker of universalProhibitedMarkers) check(!content.includes(marker), `${relative(file)} contains superseded output marker: ${marker}`);
}

const renderedUiProhibitedMarkers = ['metric-card', 'data-saas-dashboard'];
for (const file of [...distJsFiles, ...distHtmlFiles]) {
  const content = fs.readFileSync(file, 'utf8');
  for (const marker of renderedUiProhibitedMarkers) check(!content.includes(marker), `${relative(file)} contains superseded rendered-UI marker: ${marker}`);
}

const routeConfig = JSON.parse(fs.readFileSync(path.join(ROOT, 'config/public-routes.json'), 'utf8'));
const requiredRoutes = Array.isArray(routeConfig) ? routeConfig : routeConfig.routes;
const routeFile = (route) => route === '/' ? path.join(DIST, 'index.html') : path.join(DIST, route.replace(/^\/+|\/+$/g, ''), 'index.html');
for (const route of requiredRoutes) {
  const file = routeFile(route);
  check(fs.existsSync(file), `required rendered route missing: ${route}`);
  if (!fs.existsSync(file)) continue;
  const html = fs.readFileSync(file, 'utf8');
  check(html.includes('class="skip-link"'), `${route}: skip link missing from built output`);
  check(html.includes('id="main-content"'), `${route}: main landmark missing from built output`);
  check((html.match(/<h1\b/g) ?? []).length === 1, `${route}: built output must contain exactly one H1`);
}

if (sourceCssBytes > 500000) warnings.push(`source CSS includes ${sourceCssBytes} bytes across active and compatibility layers; built CSS remains the deployment performance gate`);
if (distCssFiles.length > 20) warnings.push(`built CSS is split into ${distCssFiles.length} files; review chunking if this grows further`);
if (distJsFiles.length > 20) warnings.push(`built JS is split into ${distJsFiles.length} files; review chunking if this grows further`);

const result = {
  schema_version: '2.0',
  generated_at: new Date().toISOString(),
  ok: failures.length === 0,
  budgets,
  measurements: {
    source_css_files: sourceCssFiles.length,
    source_css_bytes: sourceCssBytes,
    dist_css_files: distCssFiles.length,
    dist_css_bytes: distCssBytes,
    largest_css: largestCss,
    dist_js_files: distJsFiles.length,
    dist_js_bytes: distJsBytes,
    largest_js: largestJs,
    dist_html_files: distHtmlFiles.length,
    required_routes_checked: requiredRoutes.length
  },
  removed_legacy_outputs: ['editorial-v2.css', 'PageHero', 'MetricCard', 'page-hero'],
  compatibility_selector_policy: 'legacy selector names may remain in CSS compatibility layers but may not appear in rendered HTML or JavaScript',
  failures,
  warnings
};

fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
fs.writeFileSync(path.join(ARTIFACT_DIR, 'ui-v3-cleanup-audit.json'), `${JSON.stringify(result, null, 2)}\n`);
const markdown = [
  '# UI v3 cleanup and performance audit',
  '',
  `- Result: ${result.ok ? 'PASS' : 'FAIL'}`,
  `- Source CSS: ${sourceCssBytes} bytes across ${sourceCssFiles.length} files`,
  `- Built CSS: ${distCssBytes} bytes across ${distCssFiles.length} files`,
  `- Largest CSS: ${largestCss.bytes} bytes (${largestCss.file ?? 'none'})`,
  `- Built JS: ${distJsBytes} bytes across ${distJsFiles.length} files`,
  `- Largest JS: ${largestJs.bytes} bytes (${largestJs.file ?? 'none'})`,
  `- Built HTML files: ${distHtmlFiles.length}`,
  `- Required routes checked: ${requiredRoutes.length}`,
  '',
  '## Failures',
  '',
  ...(failures.length ? failures.map((failure) => `- ${failure}`) : ['- None']),
  '',
  '## Warnings',
  '',
  ...(warnings.length ? warnings.map((warning) => `- ${warning}`) : ['- None'])
].join('\n');
fs.writeFileSync(path.join(ARTIFACT_DIR, 'ui-v3-cleanup-audit.md'), `${markdown}\n`);
console.log(JSON.stringify(result, null, 2));
if (failures.length) process.exit(1);
