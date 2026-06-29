import fs from 'node:fs';
import path from 'node:path';
import { getPublicBackingModelCategory, getPublicBackingModelDefinition, publicBackingModelAssignments, publicBackingModelCategories } from '../config/backing-models.mjs';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const root = process.cwd();
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const readText = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');
const readRows = (relativePath) => {
  const value = JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
  if (Array.isArray(value)) return value;
  if (Array.isArray(value.records)) return value.records;
  throw new Error(`${relativePath}: expected an array or records array`);
};
const countBy = (rows, getter) => Object.fromEntries([...rows.reduce((map, row) => {
  const values = Array.isArray(getter(row)) ? getter(row) : [getter(row)];
  for (const value of values) {
    const key = value === null || value === undefined || value === '' ? 'missing' : String(value);
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return map;
}, new Map()).entries()].sort(([left], [right]) => left.localeCompare(right)));

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

check(stablecoins.length === baseline.minimum_counts.stablecoins, 'stablecoin count must match current baseline minimum');
check(classifications.length === stablecoins.length, 'classification count must match stablecoin count');
check(assignedSlugs.size === stablecoins.length, `expected ${stablecoins.length} reviewed assignments, found ${assignedSlugs.size}`);
check(categoryValues.size === publicBackingModelCategories.length, 'public backing category values must be unique');
check(new Set(publicBackingModelCategories.map((entry) => entry.public_label)).size === publicBackingModelCategories.length, 'public backing labels must be unique');
check(new Set(publicBackingModelCategories.map((entry) => entry.sort_order)).size === publicBackingModelCategories.length, 'public backing sort orders must be unique');
for (const category of publicBackingModelCategories) {
  check(typeof category.value === 'string' && category.value.length > 0, 'public backing category value is required');
  check(typeof category.public_label === 'string' && category.public_label.length > 0, `${category.value}: public label is required`);
  check(Number.isInteger(category.sort_order) && category.sort_order > 0, `${category.value}: sort order must be positive`);
  check(category.is_filterable === true, `${category.value}: category must be filterable`);
}
for (const slug of canonicalSlugs) check(assignedSlugs.has(slug), `${slug}: missing reviewed backing assignment`);
for (const slug of assignedSlugs) {
  check(canonicalSlugs.has(slug), `${slug}: assignment does not match a canonical record`);
  const category = publicBackingModelAssignments[slug];
  check(categoryValues.has(category), `${slug}: unknown public backing category ${category}`);
  check(Boolean(getPublicBackingModelDefinition(category)), `${slug}: category definition is missing`);
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
  records.push({ id:coin.id, slug:coin.slug, public_model_category:publicCategory, backing_types:backingTypes, stabilization_mechanism:stabilization });
}
const categoryCounts = countBy(records, (row) => row.public_model_category);
const report = { schema_version:'1.0', checked_at:new Date().toISOString(), stablecoins:stablecoins.length, classifications:classifications.length, reviewed_assignments:assignedSlugs.size, category_counts:categoryCounts, failures };
fs.mkdirSync(path.join(root, 'data/generated'), { recursive:true });
fs.writeFileSync(path.join(root, 'data/generated/backing-stabilization-validation.json'), `${JSON.stringify(report, null, 2)}\n`);
if (failures.length) { console.error('Backing and stabilization normalization failed:'); failures.forEach((failure) => console.error(`- ${failure}`)); process.exit(1); }
console.log(JSON.stringify({ ...report, ok:true }, null, 2));
