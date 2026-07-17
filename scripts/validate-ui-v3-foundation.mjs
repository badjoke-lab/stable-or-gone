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
  'docs/quality/ui-v3-rebuild-design-contract-pr409.md',
  'config/ui-v3-rebuild-design-contract-pr409.json',
  'docs/quality/post-pr409-review-gate-pr410-spec.md',
  'docs/migration/post-pr409-review-gate-pr410.json',
  'docs/quality/ui-v3-global-shell-navigation-pr411.md',
  'config/ui-v3-global-shell-pr411.json',
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
check(brand.includes("import { uiV3BrandAssets } from '../../config/ui-v3-foundation.mjs'"), 'BrandLockup must use approved UI v3 assets');
check(brand.includes("surface = 'light'"), 'BrandLockup default surface changed');

const layout = read('src/layouts/BaseLayout.astro');
for (const phrase of [
  "import { footerNavigationGroups, globalNavigationGroups, utilityNavigation } from '../../config/site-architecture.mjs'",
  '<BrandLockup class="site-brand" surface="light" />',
  '/brand/sog-mark-on-light.svg',
  'data-shell="evidence-registry-pr411"',
  'class="site-header-primary"',
  'class="site-search"',
  'class="grouped-navigation"',
  'class="utility-navigation"',
  'class="mobile-navigation"',
  'class="site-footer-navigation"'
]) check(layout.includes(phrase), `BaseLayout missing evidence-registry shell phrase: ${phrase}`);
check(!layout.includes('class="site-primary-navigation"'), 'rejected flat primary navigation remains');
check(!layout.includes('class="site-about-menu"'), 'rejected About-only disclosure remains');

const shell = read('src/styles/shell.css');
const globalStyles = read('src/styles/global.css');
const typography = read('src/styles/terminal-typography-contract.css');
const foundationStyles = `${shell}\n${globalStyles}\n${typography}`;
const foundationLower = foundationStyles.toLowerCase();

for (const [name, value] of Object.entries(uiV3Tokens.colors)) {
  check(foundationLower.includes(value.toLowerCase()), `shell token is missing: ${name} ${value}`);
}
for (const className of uiV3RequiredClasses) {
  const present = shell.includes(`.${className}`) || globalStyles.includes(`.${className}`);
  check(present, `shared UI v3 class is missing: ${className}`);
}
for (const pattern of uiV3ForbiddenVisualPatterns) check(!`${layout}\n${foundationStyles}`.toLowerCase().includes(pattern.toLowerCase()), `forbidden visual pattern remains: ${pattern}`);
for (const pattern of uiV3ForbiddenBrandPatterns) check(!`${layout}\n${brand}`.toLowerCase().includes(pattern.toLowerCase()), `forbidden substitute-brand pattern remains: ${pattern}`);

check(shell.includes('color-scheme: dark'), 'shared shell must use the evidence-registry dark color scheme');
check(shell.includes('--sog-font-interface: ui-sans-serif'), 'shared shell must define the system sans interface stack');
check(shell.includes('--sog-font-data: ui-monospace'), 'shared shell must define the monospace data stack');
check(shell.includes('font-size: 1rem'), 'shared shell must retain the 16px body foundation');
check(shell.includes('font-size: max(0.875rem, 14px)') || typography.includes('font-size: 0.875rem !important'), 'shared shell must retain the 14px table/control foundation');
check(shell.includes('min-height: 44px'), 'shared shell must retain the 44px control foundation');
check(shell.includes('@media (forced-colors: active)'), 'shared shell must retain forced-colors support');
check(shell.includes('@media (prefers-reduced-motion: reduce)'), 'shared shell must retain reduced-motion support');
check(shell.includes('.site-search-control'), 'prominent registry search styling is missing');
check(shell.includes('.site-footer-navigation'), 'structured footer styling is missing');
check(shell.includes('--sog-shadow-panel:'), 'panel-depth token is missing');

const design = JSON.parse(read('config/ui-v3-rebuild-design-contract-pr409.json'));
const shellContract = JSON.parse(read('config/ui-v3-global-shell-pr411.json'));
const approvals = JSON.parse(read('docs/migration/ui-v3-visual-approval-register.json'));
check(design.direction?.name === 'modern_evidence_registry', 'modern evidence-registry direction changed');
check(design.visual_failure_gates?.skipped_visual_audit_result === 'hard_failure', 'skipped visual audit no longer hard-fails');
check(shellContract.implementation_pr === 411 && shellContract.shell_marker === 'evidence-registry-pr411', 'PR #411 shell contract changed');
check(shellContract.typography?.body_min_px === 16 && shellContract.typography?.table_min_px === 14, 'PR #411 typography minimums changed');
check(shellContract.typography?.touch_target_min_px === 44, 'PR #411 touch target minimum changed');
check(shellContract.boundaries?.routes_changed === false && shellContract.boundaries?.canonical_data_changed === false, 'PR #411 allows route or canonical changes');
check(shellContract.visual_artifacts?.automated_rendering_is_owner_approval === false, 'automated rendering became owner approval');
check(approvals.current_counts?.accepted_desktop === 0 && approvals.current_counts?.accepted_mobile === 0, 'owner approvals changed during shell implementation');

const result = {
  schema_version: '2.0',
  generated_at: new Date().toISOString(),
  ok: failures.length === 0,
  visual_family: 'modern_evidence_registry',
  implementation_pr: 411,
  brand_asset_count: brandAssetFiles.length,
  authority_file_count: authorityFiles.length,
  required_class_count: uiV3RequiredClasses.length,
  canonical_record_changes: 0,
  route_changes: 0,
  owner_approval_changes: 0,
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
