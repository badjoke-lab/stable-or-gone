import fs from 'node:fs';
import path from 'node:path';
import {
  uiV3BrandAssets,
  uiV3ForbiddenBrandPatterns,
  uiV3ForbiddenVisualPatterns,
  uiV3RequiredClasses,
  uiV3Tokens
} from '../config/ui-v3-foundation.mjs';

const root = process.cwd();
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const absolute = (relativePath) => path.join(root, relativePath);
const read = (relativePath) => fs.readFileSync(absolute(relativePath), 'utf8');

const authorityFiles = [
  'docs/architecture/approved-editorial-ledger-ui-v3.md',
  'docs/ui-redesign/approved-mocks-v3/README.md',
  'docs/ui-redesign/implementation-plan.md',
  'docs/roadmap.md'
];
for (const file of authorityFiles) check(fs.existsSync(absolute(file)), `UI v3 authority file is missing: ${file}`);

const brandAssetFiles = Object.values(uiV3BrandAssets).map((assetPath) => `public${assetPath}`);
for (const file of brandAssetFiles) {
  check(fs.existsSync(absolute(file)), `approved brand asset is missing: ${file}`);
  if (!fs.existsSync(absolute(file))) continue;
  const source = read(file);
  check(source.includes('<title id="title">Stable or Gone</title>'), `${file}: accessible title is missing`);
  check(source.includes('<desc id="desc">'), `${file}: accessible description is missing`);
  check(source.includes('#EF6A55'), `${file}: approved coral interruption is missing`);
  check(source.includes('role="img"'), `${file}: image role is missing`);
}
check(read('public/brand/sog-lockup-on-light.svg').includes('#153F4A'), 'light lockup must retain the approved dark mark');
check(read('public/brand/sog-mark-on-light.svg').includes('#153F4A'), 'light monogram must retain the approved dark mark');

const brand = read('src/components/BrandLockup.astro');
check(brand.includes("import { uiV3BrandAssets } from '../../config/ui-v3-foundation.mjs'"), 'BrandLockup must use UI v3 assets');
check(brand.includes("surface = 'light'"), 'BrandLockup must default to the light Editorial Ledger surface');

const layout = read('src/layouts/BaseLayout.astro');
for (const phrase of [
  "import { aboutNavigation, footerNavigationGroups, primaryNavigation } from '../../config/site-architecture.mjs'",
  '<BrandLockup class="site-brand" surface="light" />',
  '/brand/sog-mark-on-light.svg',
  'class="site-primary-navigation"',
  'class="site-search"',
  'class="site-about-menu"',
  'class="mobile-navigation"',
  'class="site-footer"'
]) check(layout.includes(phrase), `BaseLayout missing UI v3 shell phrase: ${phrase}`);
check(!layout.includes('class="grouped-navigation"'), 'BaseLayout still renders the v2 grouped navigation');
check(!layout.includes('class="utility-navigation"'), 'BaseLayout still renders the v2 utility navigation');

const shell = read('src/styles/shell.css');
const globalStyles = read('src/styles/global.css');
const compatibility = read('src/styles/editorial-ledger-v3.css');
const foundationStyles = `${shell}\n${globalStyles}\n${compatibility}`.toLowerCase();

for (const [name, value] of Object.entries(uiV3Tokens.colors)) {
  check(shell.toLowerCase().includes(value.toLowerCase()), `shell token is missing: ${name} ${value}`);
}
for (const className of uiV3RequiredClasses) check(shell.includes(`.${className}`), `shared UI v3 class is missing: ${className}`);
for (const pattern of uiV3ForbiddenVisualPatterns) check(!foundationStyles.includes(pattern.toLowerCase()), `forbidden v2 visual pattern remains in v3 foundation: ${pattern}`);
for (const pattern of uiV3ForbiddenBrandPatterns) check(!`${layout}\n${brand}`.toLowerCase().includes(pattern.toLowerCase()), `forbidden substitute-brand pattern remains: ${pattern}`);

check(shell.includes('color-scheme: light'), 'shared shell must use the light color scheme');
check(shell.includes('font-family: Georgia, Cambria'), 'shared shell must define the editorial display stack');
check(shell.includes('font-family: Inter, ui-sans-serif'), 'shared shell must retain the readable sans-serif body stack');
check(shell.includes('min-height: 44px'), 'shared shell must retain the 44px control foundation');
check(shell.includes('@media (forced-colors: active)'), 'shared shell must retain forced-colors support');
check(shell.includes('@media (prefers-reduced-motion: reduce)'), 'shared shell must retain reduced-motion support');
check(shell.includes('.page-hero__visual') && shell.includes('display: none'), 'shared shell must suppress decorative hero visuals');
check(shell.includes('.metric-card__icon') && shell.includes('display: none'), 'shared shell must suppress KPI-card icon treatment');
check(shell.includes('--sog-shadow-panel: none'), 'shared shell must disable panel shadows');
check(compatibility.includes('background: transparent !important'), 'v3 compatibility layer must neutralize legacy panel backgrounds');

const result = {
  schema_version: '1.0',
  generated_at: new Date().toISOString(),
  ok: failures.length === 0,
  visual_family: 'editorial_ledger_v3',
  brand_asset_count: brandAssetFiles.length,
  authority_file_count: authorityFiles.length,
  required_class_count: uiV3RequiredClasses.length,
  canonical_record_changes: 0,
  route_changes: 0,
  failures
};

const outputPath = absolute('data/generated/ui-v3-foundation-validation.json');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`);
if (failures.length) {
  console.error(JSON.stringify(result, null, 2));
  process.exit(1);
}
console.log(JSON.stringify(result, null, 2));
