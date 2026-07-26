#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const read = (file) => fs.readFileSync(file, 'utf8');

const layoutPath = 'src/layouts/BaseLayout.astro';
const brandPath = 'src/components/BrandLockup.astro';
const authorityPath = 'src/styles/site-ui.css';
const valueStatePath = 'src/components/ValueStateText.astro';
const homePath = 'src/pages/index.astro';
const eventIndexViewPath = 'src/lib/views/eventIndexView.ts';
const maintenancePath = 'src/pages/maintenance/index.astro';
const auditPath = 'scripts/audit-ui-readability.mjs';
const directAuditPath = 'scripts/audit-public-typography-enums-direct.mjs';
const auditValidatorPath = 'scripts/validate-ui-readability.mjs';

for (const file of [layoutPath, brandPath, authorityPath, valueStatePath, homePath, eventIndexViewPath, maintenancePath, auditPath, directAuditPath, auditValidatorPath]) {
  check(fs.existsSync(file), `required public UI contract file missing: ${file}`);
}

let adHocFormatterFiles = [];
let cssImportFiles = [];
if (failures.length === 0) {
  const layout = read(layoutPath);
  const brand = read(brandPath);
  const authority = read(authorityPath);
  const valueState = read(valueStatePath);
  const home = read(homePath);
  const eventIndexView = read(eventIndexViewPath);
  const maintenance = read(maintenancePath);
  const audit = read(auditPath);
  const directAudit = read(directAuditPath);
  const auditValidator = read(auditValidatorPath);
  const authorityImport = "import '../styles/site-ui.css'";

  check(brand.includes(authorityImport), 'BrandLockup does not import the single public UI authority');
  check((brand.match(/import\s+['"][^'"]+\.css['"]/g) ?? []).length === 1, 'BrandLockup imports more than one stylesheet');
  check(!/import\s+['"][^'"]+\.css['"]/.test(layout), 'BaseLayout must not import a second global stylesheet path');

  for (const marker of [
    '--ui-bg:', '--ui-text:', '--ui-copy:', '--ui-muted:', '--ui-link:', '--ui-link-hover:', '--ui-link-visited:',
    '--ui-serif:', '--ui-sans:', '--ui-mono:',
    'a:visited', 'a:hover', ':focus-visible',
    '.chip, [class*="badge"]', 'border-radius: var(--ui-radius-pill)',
    '.event-structured-detail', '.event-detail-evidence-r5',
    '@media (max-width: 820px)'
  ]) check(authority.includes(marker), `single UI authority marker missing: ${marker}`);

  const forbiddenLegacyNames = [
    'v3-cya-dark-', 'v3-exhaustive-remediation', 'v3-color-system-remediation',
    'v3-readability-', 'v3-public-typography-contract', 'ui-v2-hardening',
    'identity-badge-policy', 'global.css', 'shell.css', 'accessibility-utilities.css'
  ];
  for (const name of forbiddenLegacyNames) {
    check(!brand.includes(name) && !layout.includes(name), `legacy stylesheet entrypoint remains active: ${name}`);
  }

  for (const marker of [
    "import { formatPublicLabel } from '../utils/displayLabels'",
    'looksLikePublicEnum',
    'normalizedStringValue.startsWith(\'sog_\')',
    'display_value: resolvedDisplayValue'
  ]) check(valueState.includes(marker), `ValueStateText enum-label safeguard missing: ${marker}`);

  check(home.includes("formatTaxonomyLabel('organization_type'"), 'home organization type does not use the public taxonomy');
  check(!home.includes("replaceAll('_', ' ')"), 'home still exposes ad-hoc underscore replacement instead of a public taxonomy label');
  check(eventIndexView.includes("import { formatPublicLabel } from '../../utils/displayLabels'"), 'event index does not import the public label formatter');
  check(!eventIndexView.includes("replaceAll('_', ' ')"), 'event index still formats enums through underscore replacement');
  check(maintenance.includes("import { formatPublicLabel } from '../../utils/displayLabels'"), 'maintenance log does not import the public label formatter');
  check(!maintenance.includes("replaceAll('_', ' ')"), 'maintenance log still formats enums through underscore replacement');

  for (const marker of ['unexpected_public_font', 'raw_public_enum', 'monospaceFamilies', 'serifFamilies', 'editorialSerifSelector', 'enumPattern']) {
    check(audit.includes(marker), `readability audit contract marker missing: ${marker}`);
    check(directAudit.includes(marker), `direct public typography audit contract marker missing: ${marker}`);
  }
  for (const marker of ['unexpected_public_font', 'raw_public_enum', 'public_typography', 'public_enums']) {
    check(auditValidator.includes(marker), `readability validator contract marker missing: ${marker}`);
  }

  const publicRenderRoots = ['src/pages', 'src/components', 'src/layouts', 'src/lib/views', 'src/scripts'];
  const publicRenderFiles = [];
  const walk = (directory) => {
    if (!fs.existsSync(directory)) return;
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const target = path.join(directory, entry.name);
      if (entry.isDirectory()) walk(target);
      else if (/\.(astro|js|mjs|ts|tsx)$/.test(entry.name)) publicRenderFiles.push(target);
    }
  };
  for (const root of publicRenderRoots) walk(root);

  const cssImportPattern = /import\s+['"]([^'"]+\.css)['"]/g;
  for (const file of publicRenderFiles) {
    const source = read(file);
    for (const match of source.matchAll(cssImportPattern)) cssImportFiles.push({ file, import: match[1] });
  }
  check(cssImportFiles.length === 1, `expected exactly one public CSS import, found ${cssImportFiles.length}`);
  check(cssImportFiles[0]?.file === brandPath && cssImportFiles[0]?.import === '../styles/site-ui.css', 'the only public CSS import must be BrandLockup -> site-ui.css');

  const adHocUnderscoreFormatter = /replaceAll\(\s*['"]_['"]\s*,\s*['"] ['"]\s*\)/;
  adHocFormatterFiles = publicRenderFiles.filter((file) => adHocUnderscoreFormatter.test(read(file)));
}

const result = {
  schema_version: '2.0',
  generated_at: new Date().toISOString(),
  ok: failures.length === 0,
  contract: {
    stylesheet_entrypoints: 'exactly one public CSS import: BrandLockup -> src/styles/site-ui.css',
    cascade_policy: 'phase, correction, hardening, readability, final-override, and legacy global entrypoints are forbidden',
    public_font: 'sans-serif for ordinary copy and controls, serif for primary editorial headings, mono for explicit technical values',
    interaction_palette: 'one documented default, visited, hover, active, and focus palette',
    status_badges: 'semantic badges retain shape, padding, border, background, and readable state text',
    public_enum: 'known public enum surfaces use canonical taxonomy/display-label helpers; rendered raw snake_case is forbidden',
    exhaustive_runtime_gate: 'desktop and mobile audits inspect every rendered public route'
  },
  css_import_files: cssImportFiles,
  ad_hoc_formatter_files: adHocFormatterFiles,
  failures
};
fs.mkdirSync('artifacts', { recursive: true });
fs.writeFileSync('artifacts/public-typography-enum-contract-validation.json', `${JSON.stringify(result, null, 2)}\n`);
console.log(JSON.stringify(result, null, 2));
if (failures.length) process.exit(1);
