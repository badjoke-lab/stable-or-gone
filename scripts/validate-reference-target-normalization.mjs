import fs from 'node:fs';
import path from 'node:path';
import {
  referenceComparisonCategories,
  referenceTargets
} from '../config/reference-targets.mjs';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const root = process.cwd();
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

function readRows(relativePath) {
  const value = JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
  if (Array.isArray(value)) return value;
  if (Array.isArray(value.records)) return value.records;
  throw new Error(`${relativePath}: expected an array or { records: [] }`);
}

function readText(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
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
const categories = new Map(referenceComparisonCategories.map((item) => [item.value, item]));
const records = [];

check(stablecoins.length === 92, `expected 92 stablecoins, found ${stablecoins.length}`);
check(classifications.length === 92, `expected 92 classifications, found ${classifications.length}`);
check(categories.size === referenceComparisonCategories.length, 'reference comparison category values must be unique');
check(new Set(referenceComparisonCategories.map((item) => item.public_label)).size === referenceComparisonCategories.length, 'reference comparison category labels must be unique');
check(new Set(referenceComparisonCategories.map((item) => item.sort_order)).size === referenceComparisonCategories.length, 'reference comparison category sort orders must be unique');

for (const category of referenceComparisonCategories) {
  check(typeof category.value === 'string' && category.value.length > 0, 'comparison category value is required');
  check(typeof category.public_label === 'string' && category.public_label.length > 0, `${category.value}: comparison category label is required`);
  check(Number.isInteger(category.sort_order) && category.sort_order > 0, `${category.value}: comparison category sort order must be a positive integer`);
}

for (const [canonicalValue, definition] of Object.entries(referenceTargets)) {
  check(typeof canonicalValue === 'string' && canonicalValue.length > 0, 'reference target canonical value is required');
  check(typeof definition.reference_kind === 'string' && definition.reference_kind.length > 0, `${canonicalValue}: reference kind is required`);
  check(categories.has(definition.comparison_category), `${canonicalValue}: unknown comparison category ${definition.comparison_category}`);
  check(typeof definition.public_label === 'string' && definition.public_label.length > 0, `${canonicalValue}: public label is required`);
  check(definition.public_label !== canonicalValue, `${canonicalValue}: public label must not expose the canonical code directly`);
  check(!definition.public_label.includes('_'), `${canonicalValue}: public label must not contain implementation underscores`);
  check(typeof definition.methodology_description === 'string' && definition.methodology_description.length >= 20, `${canonicalValue}: methodology description is too short`);
}

for (const coin of stablecoins) {
  const classification = classificationById.get(coin.id);
  check(Boolean(classification), `${coin.id}: missing classification`);
  if (!classification) continue;
  const extension = extensionById.get(coin.id) ?? {};
  const pegReference = { ...(classification.peg_reference ?? {}), ...(extension.peg_reference ?? {}) };
  const canonicalValue = pegReference.asset ?? coin.peg_asset ?? null;
  const referenceKind = pegReference.kind ?? null;
  const definition = canonicalValue ? referenceTargets[canonicalValue] : null;

  check(typeof canonicalValue === 'string' && canonicalValue.length > 0, `${coin.id}: canonical reference asset is missing`);
  check(typeof referenceKind === 'string' && referenceKind.length > 0, `${coin.id}: reference kind is missing`);
  check(Boolean(definition), `${coin.id}: unmapped reference asset ${canonicalValue}`);
  if (!definition) continue;
  check(definition.reference_kind === referenceKind, `${coin.id}: reference kind ${referenceKind} conflicts with mapping ${definition.reference_kind}`);
  check(categories.has(definition.comparison_category), `${coin.id}: comparison category is not registered`);
  check(Boolean(pegReference.notes || definition.methodology_description), `${coin.id}: reference methodology description is missing`);

  records.push({
    id: coin.id,
    slug: coin.slug,
    canonical_value: canonicalValue,
    reference_kind: referenceKind,
    public_label: definition.public_label,
    comparison_category: definition.comparison_category,
    methodology_description: pegReference.notes ?? definition.methodology_description,
    target_value: pegReference.target_value ?? null,
    internal_identifier: canonicalValue.includes('_')
  });
}

const observedValues = new Set(records.map((row) => row.canonical_value));
for (const canonicalValue of Object.keys(referenceTargets)) {
  check(observedValues.has(canonicalValue), `unused reference target mapping: ${canonicalValue}`);
}

const internalIdentifierSlugs = records.filter((row) => row.internal_identifier).map((row) => row.slug).sort();
check(JSON.stringify(internalIdentifierSlugs) === JSON.stringify(['nuon', 'rai', 'spot']), `unexpected internal identifier records: ${internalIdentifierSlugs.join(', ')}`);

const publicUiFiles = [
  'src/pages/index.astro',
  'src/pages/stablecoins/index.astro',
  'src/components/StablecoinDetailView.astro'
];
for (const relativePath of publicUiFiles) {
  const source = readText(relativePath);
  check(!source.includes('coin.peg_asset'), `${relativePath}: public UI still reads coin.peg_asset directly`);
  check(!source.includes('coin.peg_reference?.asset'), `${relativePath}: public UI still reads the canonical reference code directly`);
}

const homeSource = readText('src/pages/index.astro');
check(homeSource.includes('formatReferenceTargetLabel'), 'home page must use the public reference target formatter');
check(homeSource.includes('<th>Reference target</th>'), 'home page reference target heading is missing');

const indexSource = readText('src/pages/stablecoins/index.astro');
check(indexSource.includes('data-filter-reference-category'), 'stablecoin index comparison-category filter is missing');
check(!indexSource.includes('data-filter-peg'), 'legacy peg filter remains on the stablecoin index');
check(indexSource.includes('resolveReferenceTarget'), 'stablecoin index must use resolved reference targets');
check(indexSource.includes('<th>Reference target</th>'), 'stablecoin index reference target column is missing');

const detailSource = readText('src/components/StablecoinDetailView.astro');
for (const heading of ['Reference target', 'Reference kind', 'Comparison category', 'Reference methodology']) {
  check(detailSource.includes(`<th>${heading}</th>`), `stablecoin detail heading is missing: ${heading}`);
}
check(detailSource.includes('resolveReferenceTarget(coin)'), 'stablecoin detail must resolve the reference mapping');

const machineSource = readText('src/lib/machine-readable.ts');
check(machineSource.includes('reference_kind: countValues'), 'machine-readable reference-kind breakdown is missing');
check(machineSource.includes('reference_comparison_category: countValues'), 'machine-readable comparison-category breakdown is missing');
check(!machineSource.includes('reference_asset: countValues'), 'machine-readable public breakdown must not use raw reference codes as a category');

const statsSource = readText('scripts/generate-registry-stats.mjs');
check(statsSource.includes('reference_target_categories:'), 'registry stats comparison-category axis is missing');
check(statsSource.includes('canonical_reference_assets_compatibility:'), 'registry stats canonical-code compatibility axis is missing');
check(!statsSource.includes('reference_assets:'), 'registry stats still expose raw codes as the normal reference axis');

const report = {
  schema_version: '1.0',
  checked_at: new Date().toISOString(),
  stablecoins: stablecoins.length,
  classifications: classifications.length,
  mapped_reference_values: observedValues.size,
  comparison_categories: referenceComparisonCategories.length,
  reference_kind_counts: countBy(records, (row) => row.reference_kind),
  reference_target_counts: countBy(records, (row) => row.canonical_value),
  comparison_category_counts: countBy(records, (row) => row.comparison_category),
  internal_identifier_records: records.filter((row) => row.internal_identifier),
  records,
  failures
};

const reportPath = path.join(root, 'data/generated/reference-target-validation.json');
fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);

if (failures.length > 0) {
  console.error('Reference target normalization failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(JSON.stringify({ ...report, ok: true, records: undefined }, null, 2));
