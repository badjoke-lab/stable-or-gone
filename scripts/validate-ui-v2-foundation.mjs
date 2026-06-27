import fs from 'node:fs';
import path from 'node:path';
import {
  uiV2BrandAssets,
  uiV2ForbiddenBrandPatterns,
  uiV2RequiredClasses,
  uiV2SharedComponents,
  uiV2Tokens
} from '../config/ui-v2-foundation.mjs';

const root = process.cwd();
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const absolute = (relativePath) => path.join(root, relativePath);
const read = (relativePath) => fs.readFileSync(absolute(relativePath), 'utf8');

const approvedReferences = [
  'docs/ui-redesign/approved-mocks-v2/01-home.webp',
  'docs/ui-redesign/approved-mocks-v2/02-stablecoin-index.webp',
  'docs/ui-redesign/approved-mocks-v2/03-stablecoin-detail.webp',
  'docs/ui-redesign/approved-mocks-v2/04-organization-index.webp',
  'docs/ui-redesign/approved-mocks-v2/05-organization-detail.webp',
  'docs/ui-redesign/approved-mocks-v2/06-event-index.webp',
  'docs/ui-redesign/approved-mocks-v2/07-event-detail.webp',
  'docs/ui-redesign/approved-mocks-v2/08-methodology.webp',
  'docs/ui-redesign/approved-mocks-v2/logo-lockup-light-reference.webp',
  'docs/ui-redesign/approved-mocks-v2/logo-symbol-light-reference.webp',
  'docs/ui-redesign/approved-mocks-v2/logo-lockup-dark-reference.webp',
  'docs/ui-redesign/approved-mocks-v2/logo-symbol-dark-reference.webp'
];

for (const file of approvedReferences) check(fs.existsSync(absolute(file)), `approved UI v2 reference is missing: ${file}`);
for (const file of [
  'docs/architecture/approved-modern-data-product-ui-v2.md',
  'docs/ui-redesign/implementation-plan.md',
  'docs/roadmap.md',
  'docs/ui-redesign/approved-mocks-v2/README.md'
]) check(fs.existsSync(absolute(file)), `approved UI v2 authority file is missing: ${file}`);

const brandAssetFiles = Object.values(uiV2BrandAssets).map((assetPath) => `public${assetPath}`);
for (const file of brandAssetFiles) {
  check(fs.existsSync(absolute(file)), `approved brand asset is missing: ${file}`);
  if (!fs.existsSync(absolute(file))) continue;
  const source = read(file);
  check(source.includes('<title id="title">Stable or Gone</title>'), `${file}: accessible title is missing`);
  check(source.includes('<desc id="desc">'), `${file}: accessible description is missing`);
  check(source.includes('#EF6A55'), `${file}: approved coral interruption is missing`);
  check(source.includes('role="img"'), `${file}: image role is missing`);
}
check(read('public/brand/sog-lockup-on-dark.svg').includes('#73AEB3'), 'dark lockup must use the approved teal mark');
check(read('public/brand/sog-mark-on-dark.svg').includes('#73AEB3'), 'dark monogram must use the approved teal mark');
check(read('public/brand/sog-lockup-on-light.svg').includes('#153F4A'), 'light lockup must use the approved dark mark');
check(read('public/brand/sog-mark-on-light.svg').includes('#153F4A'), 'light monogram must use the approved dark mark');

for (const component of uiV2SharedComponents) check(fs.existsSync(absolute(component)), `shared UI v2 component is missing: ${component}`);

const layout = read('src/layouts/BaseLayout.astro');
check(layout.includes("import BrandLockup from '../components/BrandLockup.astro'"), 'BaseLayout must import BrandLockup');
check((layout.match(/<BrandLockup/g) ?? []).length >= 2, 'BaseLayout must render the approved lockup in the header and footer');
check(layout.includes('/brand/sog-mark-on-dark.svg'), 'BaseLayout must use the approved SOG favicon');
check(!layout.includes('<strong>STABLE OR GONE</strong>'), 'legacy text-only brand remains in BaseLayout');

const shell = read('src/styles/shell.css');
for (const [name, value] of Object.entries(uiV2Tokens.colors)) {
  check(shell.toLowerCase().includes(value.toLowerCase()), `shell token is missing: ${name} ${value}`);
}
for (const className of uiV2RequiredClasses) check(shell.includes(`.${className}`), `shared UI v2 class is missing: ${className}`);
check(shell.includes('font-family: Inter, ui-sans-serif'), 'shared shell must use the approved sans-serif application stack');
check(shell.includes('min-height: 44px'), 'shared shell must retain the 44px control foundation');
check(shell.includes('@media (forced-colors: active)'), 'shared shell must retain forced-colors support');
check(shell.includes('@media (prefers-reduced-motion: reduce)'), 'shared shell must retain reduced-motion support');

const globalStyles = read('src/styles/global.css');
check(globalStyles.includes('font-family: Inter, ui-sans-serif'), 'global styles must use the approved sans-serif application stack');
check(!/body\s*\{[^}]*ui-monospace/s.test(globalStyles), 'body must not use a monospace default font');

const sourceExtensions = new Set(['.astro', '.css', '.js', '.mjs', '.ts', '.tsx', '.svg', '.html']);
const scanRoots = ['src', 'public'];
const productionSources = [];
function collect(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) collect(fullPath);
    else if (sourceExtensions.has(path.extname(entry.name))) productionSources.push(fullPath);
  }
}
for (const relativeRoot of scanRoots) collect(absolute(relativeRoot));
for (const file of productionSources) {
  const source = fs.readFileSync(file, 'utf8').toLowerCase();
  for (const pattern of uiV2ForbiddenBrandPatterns) {
    check(!source.includes(pattern.toLowerCase()), `${path.relative(root, file)}: forbidden substitute-brand pattern appears: ${pattern}`);
  }
}

const result = {
  schema_version: '1.0',
  generated_at: new Date().toISOString(),
  ok: failures.length === 0,
  approved_reference_count: approvedReferences.length,
  brand_asset_count: brandAssetFiles.length,
  shared_component_count: uiV2SharedComponents.length,
  required_class_count: uiV2RequiredClasses.length,
  canonical_record_changes: 0,
  route_changes: 0,
  failures
};

const outputPath = absolute('data/generated/ui-v2-foundation-validation.json');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`);
if (failures.length) {
  console.error(JSON.stringify(result, null, 2));
  process.exit(1);
}
console.log(JSON.stringify(result, null, 2));
