import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const manifest = read('docs/migration/registry-v3-income-profiles.json');
const baseline = read('docs/migration/registry-v2-baseline.json');
const rows = manifest.data_files.flatMap((file) => read(file));
const failures = [];
const ids = new Set();
const protectedIds = new Set(baseline.protected_stablecoins.map((row) => row.id));
const availability = new Set(['native', 'via_wrapper', 'none', 'unknown']);
const sources = new Set(['reserve_income', 'lending', 'staking', 'derivatives_funding', 'protocol_incentives', 'token_emissions', 'mixed', 'none', 'unknown']);
const accruals = new Set(['balance_rebase', 'exchange_rate_increase', 'claimable_reward', 'wrapper_value_increase', 'external_distribution', 'protocol_position', 'none', 'unknown']);
const rates = new Set(['fixed', 'variable', 'discretionary', 'protocol_determined', 'none', 'unknown']);

for (const row of rows) {
  if (!protectedIds.has(row.id)) failures.push(`unknown asset id: ${row.id}`);
  if (ids.has(row.id)) failures.push(`duplicate id: ${row.id}`);
  ids.add(row.id);
  if (!availability.has(row.availability)) failures.push(`${row.id}: invalid availability`);
  if (!sources.has(row.source)) failures.push(`${row.id}: invalid source`);
  if (!accruals.has(row.accrual)) failures.push(`${row.id}: invalid accrual`);
  if (!rates.has(row.rate)) failures.push(`${row.id}: invalid rate`);
  if (!Array.isArray(row.related_asset_ids)) failures.push(`${row.id}: related_asset_ids must be an array`);
  if (!Array.isArray(row.evidence_ids)) failures.push(`${row.id}: evidence_ids must be an array`);
}

if (rows.length !== manifest.minimum_count) failures.push(`expected ${manifest.minimum_count}, found ${rows.length}`);
for (const id of protectedIds) if (!ids.has(id)) failures.push(`missing profile: ${id}`);

const loaderText = fs.readFileSync(path.join(root, manifest.loader), 'utf8');
for (const file of manifest.data_files) {
  const name = path.basename(file);
  if (!loaderText.includes(name)) failures.push(`loader missing ${name}`);
}
if (!loaderText.includes('getIncomeProfilesV3')) failures.push('loader missing getIncomeProfilesV3');

if (failures.length) {
  console.error('Registry v3 profile validation failed');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Registry v3 profile validation passed: ${rows.length} profiles.`);
