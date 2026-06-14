import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { buildRegistryStats } from './generate-registry-stats.mjs';

const root = process.cwd();
const contractPath = 'docs/stats/registry-stats-contract.json';
const outputPath = 'data/generated/registry-stats.json';

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
}

function sumObjectValues(value) {
  return Object.values(value).reduce((sum, count) => sum + count, 0);
}

const contract = readJson(contractPath);
const current = readJson(outputPath);
const expected = buildRegistryStats();
const failures = [];

for (const section of contract.required_sections ?? []) {
  if (!(section in current)) failures.push(`missing required section: ${section}`);
}

if (current.schema_version !== contract.schema_version) {
  failures.push(`schema_version must be ${contract.schema_version}`);
}

if (current.registry?.stablecoins !== 40) {
  failures.push(`protected stablecoin count must be 40, found ${current.registry?.stablecoins}`);
}

if (sumObjectValues(current.lifecycle?.by_status ?? {}) !== current.registry?.stablecoins) {
  failures.push('lifecycle.by_status must sum to registry.stablecoins');
}

const lifecyclePartition =
  (current.lifecycle?.active_side?.count ?? 0) +
  (current.lifecycle?.historical_side?.count ?? 0);
if (lifecyclePartition !== current.registry?.stablecoins) {
  failures.push('active_side + historical_side must equal registry.stablecoins');
}

for (const [name, row] of Object.entries(current.coverage ?? {})) {
  if (!Number.isInteger(row.covered) || !Number.isInteger(row.total)) {
    failures.push(`coverage.${name} counts must be integers`);
    continue;
  }
  if (row.covered < 0 || row.covered > row.total) {
    failures.push(`coverage.${name}.covered must be between 0 and total`);
  }
  const expectedShare = row.total === 0 ? 0 : Number((row.covered / row.total).toFixed(4));
  if (row.share !== expectedShare) failures.push(`coverage.${name}.share is inconsistent`);
}

try {
  assert.deepStrictEqual(current, expected);
} catch {
  failures.push(`${outputPath} does not match a fresh deterministic generation`);
}

if (failures.length) {
  console.error('Registry stats validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  console.error('Expected generated content:');
  console.error(JSON.stringify(expected, null, 2));
  process.exit(1);
}

console.log(`Registry stats validation passed: ${current.registry.stablecoins} assets, ${current.registry.events} events, ${current.registry.evidence} evidence records.`);
