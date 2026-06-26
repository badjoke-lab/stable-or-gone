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

function countBy(rows, getter) {
  const counts = new Map();
  for (const row of rows) {
    const value = getter(row) ?? 'missing';
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return Object.fromEntries([...counts.entries()].sort(([a], [b]) => String(a).localeCompare(String(b))));
}

const baseline = loadRegistryV2Baseline(root);
const stablecoins = baseline.data_groups.stablecoins.flatMap(readRows);
const classifications = baseline.data_groups.classifications.flatMap(readRows);
const extensions = (baseline.data_groups.classification_extensions ?? []).flatMap(readRows);
const classificationById = new Map(classifications.map((row) => [row.id, row]));
const extensionById = new Map(extensions.map((row) => [row.id, row]));

const records = stablecoins.map((coin) => {
  const classification = classificationById.get(coin.id) ?? {};
  const extension = extensionById.get(coin.id) ?? {};
  const pegReference = {
    ...(classification.peg_reference ?? {}),
    ...(extension.peg_reference ?? {})
  };
  const referenceTarget = {
    ...(classification.reference_target ?? {}),
    ...(extension.reference_target ?? {})
  };
  const kind = pegReference.kind ?? referenceTarget.kind ?? classification.reference_kind ?? null;
  const asset = pegReference.asset ?? referenceTarget.asset ?? coin.peg_asset ?? null;
  const targetValue = pegReference.target_value ?? referenceTarget.target_value ?? null;
  const notes = pegReference.notes ?? referenceTarget.notes ?? null;
  return {
    id: coin.id,
    slug: coin.slug,
    name: coin.name,
    legacy_peg_asset: coin.peg_asset ?? null,
    reference_kind: kind,
    reference_asset: asset,
    target_value: targetValue,
    methodology_notes: notes,
    has_internal_identifier: typeof asset === 'string' && /^[A-Z0-9_]+$/.test(asset) && asset.includes('_'),
    display_key: `${kind ?? 'missing'}:${asset ?? 'missing'}`
  };
}).sort((a, b) => a.id.localeCompare(b.id));

const output = {
  schema_version: '1.0',
  generated_at: new Date().toISOString(),
  baseline_id: baseline.baseline_id,
  record_count: records.length,
  missing_classification_ids: records.filter((row) => !classificationById.has(row.id)).map((row) => row.id),
  missing_reference_kind_ids: records.filter((row) => !row.reference_kind).map((row) => row.id),
  missing_reference_asset_ids: records.filter((row) => !row.reference_asset).map((row) => row.id),
  reference_kind_counts: countBy(records, (row) => row.reference_kind),
  reference_asset_counts: countBy(records, (row) => row.reference_asset),
  display_key_counts: countBy(records, (row) => row.display_key),
  internal_identifier_records: records.filter((row) => row.has_internal_identifier),
  complex_reference_records: records.filter((row) => ['floating', 'index', 'basket'].includes(row.reference_kind)),
  records
};

const outputPath = path.join(root, 'data/generated/reference-target-migration.json');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`);
console.log(JSON.stringify({
  ok: output.missing_classification_ids.length === 0 && output.missing_reference_kind_ids.length === 0 && output.missing_reference_asset_ids.length === 0,
  record_count: output.record_count,
  reference_kind_counts: output.reference_kind_counts,
  reference_asset_counts: output.reference_asset_counts,
  internal_identifier_records: output.internal_identifier_records,
  complex_reference_records: output.complex_reference_records,
  missing_classification_ids: output.missing_classification_ids,
  missing_reference_kind_ids: output.missing_reference_kind_ids,
  missing_reference_asset_ids: output.missing_reference_asset_ids
}, null, 2));
