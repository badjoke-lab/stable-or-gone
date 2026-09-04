import fs from 'node:fs';
import path from 'node:path';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const root = process.cwd();
const failures = [];
const manifestPath = 'docs/migration/registry-v3-income-profiles.json';
const baselinePath = 'docs/migration/registry-v2-baseline.json';

const absolute = (relativePath) => path.join(root, relativePath);
const fail = (message) => failures.push(message);

function readJson(relativePath) {
  try {
    return JSON.parse(fs.readFileSync(absolute(relativePath), 'utf8'));
  } catch (error) {
    fail(`${relativePath}: ${error.message}`);
    return null;
  }
}

function readText(relativePath) {
  try {
    return fs.readFileSync(absolute(relativePath), 'utf8');
  } catch (error) {
    fail(`${relativePath}: ${error.message}`);
    return '';
  }
}

function readFiles(files, label) {
  const rows = [];
  const seen = new Set();
  for (const file of files ?? []) {
    if (seen.has(file)) {
      fail(`${label}: duplicate file ${file}`);
      continue;
    }
    seen.add(file);
    const value = readJson(file);
    if (!Array.isArray(value)) {
      fail(`${file}: expected a JSON array`);
      continue;
    }
    rows.push(...value.map((row) => ({ ...row, __source_file: file })));
  }
  return rows;
}

function stringArray(row, field) {
  const value = row[field];
  if (!Array.isArray(value) || value.some((item) => typeof item !== 'string')) {
    fail(`${row.__source_file}: ${row.id ?? 'unknown'} ${field} must be a string array`);
    return [];
  }
  return value;
}

const manifest = readJson(manifestPath) ?? {};
const baseline = loadRegistryV2Baseline(root);

if (manifest.schema_version !== '3.0-income-profiles') fail(`${manifestPath}: invalid schema_version`);
if (manifest.status !== 'additive') fail(`${manifestPath}: status must be additive`);
if (manifest.base_registry !== baselinePath) fail(`${manifestPath}: base_registry must reference ${baselinePath}`);
if (!Number.isInteger(manifest.minimum_count) || manifest.minimum_count < 0) fail(`${manifestPath}: minimum_count must be a non-negative integer`);
if (manifest.loader !== 'src/lib/data/incomeProfilesV3.ts') fail(`${manifestPath}: invalid loader`);
if (manifest.loader_export !== 'getIncomeProfilesV3') fail(`${manifestPath}: invalid loader_export`);
if (manifest.validator !== 'scripts/validate-registry-v3-income-profiles.mjs') fail(`${manifestPath}: invalid validator`);

const rows = readFiles(manifest.data_files, 'income profiles');
const evidenceRows = readFiles(baseline.data_groups?.evidence, 'evidence');
const evidenceIds = new Set(evidenceRows.map((row) => row.id));
const protectedIds = new Set((baseline.protected_stablecoins ?? []).map((row) => row.id));
const ids = new Set();
const availability = new Set(['native', 'via_wrapper', 'none', 'unknown']);
const sources = new Set(['reserve_income', 'lending', 'staking', 'derivatives_funding', 'protocol_incentives', 'token_emissions', 'mixed', 'none', 'unknown']);
const accruals = new Set(['balance_rebase', 'exchange_rate_increase', 'claimable_reward', 'wrapper_value_increase', 'external_distribution', 'protocol_position', 'none', 'unknown']);
const rates = new Set(['fixed', 'variable', 'discretionary', 'protocol_determined', 'none', 'unknown']);

for (const row of rows) {
  const label = `${row.__source_file}: ${row.id ?? 'unknown'}`;
  if (typeof row.id !== 'string' || row.id.length === 0) {
    fail(`${label} id must be a non-empty string`);
    continue;
  }
  if (!protectedIds.has(row.id)) fail(`${label} references an unprotected asset`);
  if (ids.has(row.id)) fail(`${label} duplicates an income profile id`);
  ids.add(row.id);

  if (!availability.has(row.availability)) fail(`${label} invalid availability ${row.availability}`);
  if (!sources.has(row.source)) fail(`${label} invalid source ${row.source}`);
  if (!accruals.has(row.accrual)) fail(`${label} invalid accrual ${row.accrual}`);
  if (!rates.has(row.rate)) fail(`${label} invalid rate ${row.rate}`);

  for (const relatedId of stringArray(row, 'related_asset_ids')) {
    if (!protectedIds.has(relatedId)) fail(`${label} references missing related asset ${relatedId}`);
    if (relatedId === row.id) fail(`${label} cannot reference itself as a related asset`);
  }
  for (const evidenceId of stringArray(row, 'evidence_ids')) {
    if (!evidenceIds.has(evidenceId)) fail(`${label} references missing evidence ${evidenceId}`);
  }
}

if (rows.length !== manifest.minimum_count) fail(`income profile coverage: expected ${manifest.minimum_count}, found ${rows.length}`);
if (protectedIds.size !== manifest.minimum_count) fail(`${manifestPath}: minimum_count must match ${protectedIds.size} protected stablecoins`);
for (const id of protectedIds) if (!ids.has(id)) fail(`missing income profile: ${id}`);

const loaderText = readText(manifest.loader);
for (const file of manifest.data_files ?? []) {
  const name = path.basename(file);
  if (!loaderText.includes(name) && !loaderText.includes('batchAjRuntime')) fail(`${manifest.loader}: missing ${name}`);
}
if (!loaderText.includes(`export function ${manifest.loader_export}`)) fail(`${manifest.loader}: missing export function ${manifest.loader_export}`);

const packageText = readText('package.json');
if (!packageText.includes('"validate:income-v3"')) fail('package.json: missing validate:income-v3 script');
if (!packageText.includes('npm run validate:income-v3')) fail('package.json: build chain does not include validate:income-v3');

if (failures.length) {
  console.error('Registry v3 income profile validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

const resolved = rows.filter((row) => [row.availability, row.source, row.accrual, row.rate].some((value) => value !== 'unknown')).length;
console.log(`Registry v3 income profile validation passed: ${rows.length} profiles, ${resolved} with at least one resolved mechanics field.`);