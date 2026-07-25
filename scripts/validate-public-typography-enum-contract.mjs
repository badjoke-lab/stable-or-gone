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
const auditPath = 'scripts/audit-ui-readability.mjs';
const auditValidatorPath = 'scripts/validate-ui-readability.mjs';

for (const file of [brandPath, typographyPath, valueStatePath, homePath, auditPath, auditValidatorPath]) {
  check(fs.existsSync(file), `required public UI contract file missing: ${file}`);
}

if (failures.length === 0) {
  const brand = read(brandPath);
  const typography = read(typographyPath);
  const valueState = read(valueStatePath);
  const home = read(homePath);
  const audit = read(auditPath);
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
    'font-family: var(--v3-mono) !important',
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

  for (const marker of ['unexpected_public_font', 'raw_public_enum', 'forbiddenFamilies', 'enumPattern']) {
    check(audit.includes(marker), `readability audit contract marker missing: ${marker}`);
  }
  for (const marker of ['unexpected_public_font', 'raw_public_enum', 'public_typography', 'public_enums']) {
    check(auditValidator.includes(marker), `readability validator contract marker missing: ${marker}`);
  }

  const astroFiles = [];
  const walk = (directory) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const target = path.join(directory, entry.name);
      if (entry.isDirectory()) walk(target);
      else if (entry.name.endsWith('.astro')) astroFiles.push(target);
    }
  };
  walk('src');
  const adHocUnderscoreFormatter = /replaceAll\(\s*['"]_['"]\s*,\s*['"] ['"]\s*\)/;
  for (const file of astroFiles) {
    check(!adHocUnderscoreFormatter.test(read(file)), `${file}: ad-hoc snake_case display formatter is forbidden; use a public label helper`);
  }
}

const result = {
  schema_version: '1.0',
  generated_at: new Date().toISOString(),
  ok: failures.length === 0,
  contract: {
    public_font: 'shared sans-serif stack for all ordinary UI; mono only for explicit technical values',
    public_enum: 'canonical taxonomy/display-label helper required; raw snake_case forbidden',
    exhaustive_runtime_gate: 'desktop and mobile readability audits include font-family and raw-enum findings'
  },
  failures
};
fs.mkdirSync('artifacts', { recursive: true });
fs.writeFileSync('artifacts/public-typography-enum-contract-validation.json', `${JSON.stringify(result, null, 2)}\n`);
console.log(JSON.stringify(result, null, 2));
if (failures.length) process.exit(1);
