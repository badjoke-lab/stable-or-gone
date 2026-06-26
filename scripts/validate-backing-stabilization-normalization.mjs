import fs from 'node:fs';
import path from 'node:path';
import {
  getPublicBackingModelCategory,
  getPublicBackingModelDefinition,
  publicBackingModelAssignments,
  publicBackingModelCategories
} from '../config/backing-models.mjs';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const root = process.cwd();
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const readText = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

function readRows(relativePath) {
  const value = JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
  if (Array.isArray(value)) return value;
  if (Array.isArray(value.records)) return value.records;
  throw new Error(`${relativePath}: expected an array or { records: [] }`);
}

function countBy(rows, getter) {
  const counts = new Map();
  for (const row of rows) {
    const raw = getter(row);
    const values = Array.isArray(raw) ? raw : [raw];
    for (const value of values) {
      const key = value === null || value === undefined || value === '' ? 'missing' : String(value);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  return Object.fromEntries([...counts.entries()].sort(([a], [b]) => a.localeCompare(b)));
}

const baseline = loadRegistryV2Baseline(root);
const stablecoins = baseline.data_groups.stablecoins.flatMap(readRows);
const classifications = baseline.data_groups.classifications.flatMap(readRows);
const extensions = (baseline.data_groups.classification_extensions ?? []).flatMap(readRows);
const classificationById = new Map(classifications.map((row) => [row.id, row]));
const extensionById = new Map(extensions.map((row) => [row.id, row]));
const canonicalSlugs = new Set(stablecoins.map((row) => row.slug));
const assignedSlugs = new Set(Object.keys(publicBackingModelAssignments));
const categoryValues = new Set(publicBackingModelCategories.map((entry) => entry.value));
const records = [];

check(stablecoins.length === 92, `expected 92 stablecoins, found ${stablecoins.length}`);
check(classifications.length === 92, `expected 92 classifications, found ${classifications.length}`);
check(assignedSlugs.size === stablecoins.length, `expected ${stablecoins.length} reviewed slug assignments, found ${assignedSlugs.size}`);
check(categoryValues.size === publicBackingModelCategories.length, 'public backing category values must be unique');
check(new Set(publicBackingModelCategories.map((entry) => entry.public_label)).size === publicBackingModelCategories.length, 'public backing category labels must be unique');
check(new Set(publicBackingModelCategories.map((entry) => entry.sort_order)).size === publicBackingModelCategories.length, 'public backing category sort orders must be unique');

for (const category of publicBackingModelCategories) {
  check(typeof category.value === 'string' && category.value.length > 0, 'public backing category value is required');
  check(typeof category.public_label === 'string' && category.public_label.length > 0, `${category.value}: public label is required`);
  check(Number.isInteger(category.sort_order) && category.sort_order > 0, `${category.value}: sort order must be a positive integer`);
  check(category.is_filterable === true, `${category.value}: category must be explicitly filterable`);
}

for (const slug of canonicalSlugs) {
  check(assignedSlugs.has(slug), `${slug}: missing reviewed public backing model assignment`);
}
for (const slug of assignedSlugs) {
  check(canonicalSlugs.has(slug), `${slug}: assignment does not match a canonical record`);
  const category = publicBackingModelAssignments[slug];
  check(categoryValues.has(category), `${slug}: unknown public backing model category ${category}`);
  check(Boolean(getPublicBackingModelDefinition(category)), `${slug}: category definition is missing for ${category}`);
}

for (const coin of stablecoins) {
  const classification = { ...(classificationById.get(coin.id) ?? {}), ...(extensionById.get(coin.id) ?? {}) };
  const backingTypes = Array.isArray(classification.backing_types) ? classification.backing_types : [];
  const stabilization = classification.stabilization_mechanism ?? null;
  const publicCategory = getPublicBackingModelCategory(coin.slug);

  check(classificationById.has(coin.id), `${coin.id}: classification is missing`);
  check(backingTypes.length > 0, `${coin.id}: canonical backing types are missing`);
  check(typeof stabilization === 'string' && stabilization.length > 0, `${coin.id}: stabilization mechanism is missing`);
  check(typeof coin.collateral_model === 'string' && coin.collateral_model.length > 0, `${coin.id}: recorded model description is missing`);
  check(Boolean(publicCategory), `${coin.id}: public backing model category is missing`);

  records.push({
    id: coin.id,
    slug: coin.slug,
    name: coin.name,
    public_model_category: publicCategory,
    legacy_collateral_model: coin.collateral_model ?? null,
    backing_types: backingTypes,
    stabilization_mechanism: stabilization
  });
}

const categoryCounts = countBy(records, (row) => row.public_model_category);
check(Object.values(categoryCounts).reduce((sum, value) => sum + value, 0) === stablecoins.length, 'public model category counts must be exclusive and total 92');
check(categoryCounts.unknown === 2, `expected 2 unknown public model assignments, found ${categoryCounts.unknown ?? 0}`);
check(records.filter((row) => row.public_model_category === 'unknown').map((row) => row.slug).sort().join(',') === 'ae-coin,vchf', 'unknown assignments must remain limited to ae-coin and vchf');

const homeSource = readText('src/pages/index.astro');
check(homeSource.includes('formatPublicBackingModelLabel'), 'home page must use the public backing model formatter');
check(!homeSource.includes('formatPublicLabel(coin.collateral_model)'), 'home page must not display collateral_model as the public model category');

const indexSource = readText('src/pages/stablecoins/index.astro');
check(indexSource.includes('getPublicBackingModelFilterOptions'), 'stablecoin index must use the approved backing model options');
check(indexSource.includes('resolveBackingModel'), 'stablecoin index must resolve reviewed backing model assignments');
check(indexSource.includes('data-filter-model-category'), 'stablecoin index model-category filter is missing');
check(!indexSource.includes('data-filter-model>'), 'legacy free-text model filter remains on the stablecoin index');
check(!indexSource.includes('uniqueSorted(stablecoins.map((coin) => coin.collateral_model))'), 'stablecoin index must not derive filters from collateral_model free text');
check(indexSource.includes('<th>Backing model</th>'), 'stablecoin index backing model heading is missing');

const detailSource = readText('src/components/StablecoinDetailView.astro');
for (const heading of [
  'Public backing model',
  'Canonical backing types',
  'Reserve component categories',
  'Primary stabilization mechanism',
  'Recorded model description'
]) {
  check(detailSource.includes(`<th>${heading}</th>`), `stablecoin detail heading is missing: ${heading}`);
}
check(detailSource.includes('getReserveComponentsFor'), 'stablecoin detail must load reserve components');
check(detailSource.includes('Historical model changes'), 'stablecoin detail must preserve historical model changes');

const machineSource = readText('src/lib/machine-readable.ts');
check(machineSource.includes('public_model_category: countValues'), 'machine-readable public model breakdown is missing');
check(machineSource.includes('backing_type_non_exclusive: countMultiValues'), 'machine-readable backing-type breakdown is missing or not marked non-exclusive');
check(machineSource.includes('stabilization_mechanism: countValues'), 'machine-readable stabilization breakdown is missing');

const statsSource = readText('scripts/generate-registry-stats.mjs');
check(statsSource.includes('public_model_categories:'), 'registry stats public model category axis is missing');
check(statsSource.includes('backing_types_non_exclusive:'), 'registry stats backing types must remain non-exclusive');
check(statsSource.includes('stabilization_mechanisms:'), 'registry stats stabilization axis is missing');

const report = {
  schema_version: '1.0',
  checked_at: new Date().toISOString(),
  stablecoins: stablecoins.length,
  classifications: classifications.length,
  assignments: assignedSlugs.size,
  public_categories: publicBackingModelCategories.length,
  public_model_category_counts: categoryCounts,
  backing_type_counts_non_exclusive: countBy(records, (row) => row.backing_types),
  stabilization_mechanism_counts: countBy(records, (row) => row.stabilization_mechanism),
  records,
  failures
};

const reportPath = path.join(root, 'data/generated/backing-stabilization-validation.json');
fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);

if (failures.length > 0) {
  console.error('Backing and stabilization normalization failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(JSON.stringify({ ...report, ok: true, records: undefined }, null, 2));
