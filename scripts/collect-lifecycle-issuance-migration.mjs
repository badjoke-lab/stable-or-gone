import fs from 'node:fs';
import path from 'node:path';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const root = process.cwd();

function readRows(relativePath) {
  const value = JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
  if (Array.isArray(value)) return value;
  if (Array.isArray(value.records)) return value.records;
  throw new Error(`${relativePath}: expected an array or { records: [] }`);
}

function countBy(rows, key) {
  const counts = new Map();
  for (const row of rows) {
    const value = row[key] ?? 'missing';
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return Object.fromEntries([...counts.entries()].sort(([a], [b]) => String(a).localeCompare(String(b))));
}

const baseline = loadRegistryV2Baseline(root);
const stablecoins = baseline.data_groups.stablecoins.flatMap(readRows);
const classifications = baseline.data_groups.classifications.flatMap(readRows);
const classificationById = new Map(classifications.map((row) => [row.id, row]));

const records = stablecoins.map((coin) => {
  const classification = classificationById.get(coin.id);
  const legacyStatus = coin.status ?? null;
  const lifecycleStatus = classification?.lifecycle_status ?? null;
  const issuanceStatus = classification?.issuance_status ?? null;
  const pair = `${legacyStatus ?? 'missing'} -> ${lifecycleStatus ?? 'missing'}`;
  return {
    id: coin.id,
    slug: coin.slug,
    name: coin.name,
    legacy_status: legacyStatus,
    lifecycle_status: lifecycleStatus,
    issuance_status: issuanceStatus,
    launch_date: coin.launch_date ?? null,
    discontinued_date: coin.discontinued_date ?? null,
    pair
  };
}).sort((a, b) => a.id.localeCompare(b.id));

const pairCounts = new Map();
for (const row of records) pairCounts.set(row.pair, (pairCounts.get(row.pair) ?? 0) + 1);

const output = {
  schema_version: '1.0',
  generated_at: new Date().toISOString(),
  baseline_id: baseline.baseline_id,
  record_count: records.length,
  classification_count: classifications.length,
  missing_classification_ids: records.filter((row) => !row.lifecycle_status || !row.issuance_status).map((row) => row.id),
  legacy_status_counts: countBy(records, 'legacy_status'),
  lifecycle_status_counts: countBy(records, 'lifecycle_status'),
  issuance_status_counts: countBy(records, 'issuance_status'),
  pair_counts: Object.fromEntries([...pairCounts.entries()].sort(([a], [b]) => a.localeCompare(b))),
  records
};

const outputPath = path.join(root, 'data/generated/lifecycle-issuance-migration.json');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`);
console.log(JSON.stringify({
  ok: output.missing_classification_ids.length === 0,
  record_count: output.record_count,
  pair_counts: output.pair_counts,
  lifecycle_status_counts: output.lifecycle_status_counts,
  issuance_status_counts: output.issuance_status_counts,
  missing_classification_ids: output.missing_classification_ids
}, null, 2));
