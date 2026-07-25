#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const read = (file) => fs.readFileSync(file, 'utf8');

const brandPath = 'src/components/BrandLockup.astro';
const typographyPath = 'src/styles/v3-public-typography-contract.css';
const valueStatePath = 'src/components/ValueStateText.astro';
const homePath = 'src/pages/index.astro';
const eventIndexViewPath = 'src/lib/views/eventIndexView.ts';
const maintenancePath = 'src/pages/maintenance/index.astro';
const auditPath = 'scripts/audit-ui-readability.mjs';
const directAuditPath = 'scripts/audit-public-typography-enums-direct.mjs';
const auditValidatorPath = 'scripts/validate-ui-readability.mjs';

for (const file of [brandPath, typographyPath, valueStatePath, homePath, eventIndexViewPath, maintenancePath, auditPath, directAuditPath, auditValidatorPath]) {
  check(fs.existsSync(file), `required public UI contract file missing: ${file}`);
}

let adHocFormatterFiles = [];
if (failures.length === 0) {
  const brand = read(brandPath);
  const typography = read(typographyPath);
  const valueState = read(valueStatePath);
  const home = read(homePath);
  const eventIndexView = read(eventIndexViewPath);
  const maintenance = read(maintenancePath);
  const audit = read(auditPath);
  const directAudit = read(directAuditPath);
  const auditValidator = read(auditValidatorPath);
  const typographyImport = "import '../styles/v3-public-typography-contract.css'";
  const roleFloorsImport = "import '../styles/v3-readability-role-floors.css'";

  check(brand.includes(typographyImport), 'BrandLockup does not import the public typography contract');
  check(brand.indexOf(typographyImport) > brand.indexOf(roleFloorsImport), 'public typography contract must load after all readability styles');

  for (const marker of [
    'header.site-header .site-header-inner :where(*)',
    'footer.site-footer .site-footer-inner :where(*)',
    '#main-content :where(*)',
    'font-family: var(--v3-sans) !important',
    'font-family: var(--v3-serif) !important',
    'font-family: var(--v3-mono) !important',
    '[data-editorial-serif]',
    '[data-editorial-number]',
    '[data-technical-value]'
  ]) check(typography.includes(marker), `public typography contract marker missing: ${marker}`);

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

  const publicRenderRoots = ['src/pages', 'src/components', 'src/lib/views', 'src/scripts'];
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
  const adHocUnderscoreFormatter = /replaceAll\(\s*['"]_['"]\s*,\s*['"] ['"]\s*\)/;
  adHocFormatterFiles = publicRenderFiles.filter((file) => adHocUnderscoreFormatter.test(read(file)));
}

const result = {
  schema_version: '1.4',
  generated_at: new Date().toISOString(),
  ok: failures.length === 0,
  contract: {
    public_font: 'CYA-aligned role system: sans-serif for ordinary copy and controls, serif for primary editorial headings, mono for explicit technical values',
    public_enum: 'known public enum surfaces use canonical taxonomy/display-label helpers; rendered raw snake_case is forbidden',
    static_render_inventory: 'remaining local humanizers are reported for migration but are not treated as proof of a rendered raw token',
    exhaustive_runtime_gate: 'desktop and mobile audits inspect every rendered public route for role-inappropriate font-family and raw-enum findings'
  },
  ad_hoc_formatter_files: adHocFormatterFiles,
  failures
};
fs.mkdirSync('artifacts', { recursive: true });
fs.writeFileSync('artifacts/public-typography-enum-contract-validation.json', `${JSON.stringify(result, null, 2)}\n`);
console.log(JSON.stringify(result, null, 2));
if (failures.length) process.exit(1);
