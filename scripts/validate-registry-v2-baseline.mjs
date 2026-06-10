import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const manifestPath = path.join(root, 'docs', 'migration', 'registry-v2-baseline.json');
const failures = [];

function readJson(filePath) {
  if (!fs.existsSync(filePath)) {
    failures.push(`missing file: ${path.relative(root, filePath)}`);
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    failures.push(`invalid JSON: ${path.relative(root, filePath)} (${error.message})`);
    return null;
  }
}

function readGroup(files) {
  return files.flatMap((relativePath) => {
    const value = readJson(path.join(root, relativePath));
    if (value === null) return [];
    if (!Array.isArray(value)) {
      failures.push(`expected JSON array: ${relativePath}`);
      return [];
    }
    return value;
  });
}

const manifest = readJson(manifestPath);
if (!manifest) {
  console.error('Registry v2 baseline validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

const groups = {};
for (const [name, files] of Object.entries(manifest.data_groups ?? {})) {
  groups[name] = readGroup(files);
}

for (const [name, minimum] of Object.entries(manifest.minimum_counts ?? {})) {
  const actual = groups[name]?.length ?? 0;
  if (actual < minimum) failures.push(`${name}: expected at least ${minimum}, found ${actual}`);
}

const stablecoinsById = new Map((groups.stablecoins ?? []).map((row) => [row.id, row]));
for (const protectedRow of manifest.protected_stablecoins ?? []) {
  const current = stablecoinsById.get(protectedRow.id);
  if (!current) failures.push(`protected stablecoin missing: ${protectedRow.id}`);
  else if (current.slug !== protectedRow.slug) failures.push(`protected stablecoin slug changed: ${protectedRow.id} expected ${protectedRow.slug}, found ${current.slug}`);
}

const organizationsById = new Map((groups.organizations ?? []).map((row) => [row.id, row]));
for (const protectedRow of manifest.protected_organizations ?? []) {
  const current = organizationsById.get(protectedRow.id);
  if (!current) failures.push(`protected organization missing: ${protectedRow.id}`);
  else if (current.slug !== protectedRow.slug) failures.push(`protected organization slug changed: ${protectedRow.id} expected ${protectedRow.slug}, found ${current.slug}`);
}

for (const relativePath of manifest.required_route_sources ?? []) {
  if (!fs.existsSync(path.join(root, relativePath))) failures.push(`required route source missing: ${relativePath}`);
}

if (failures.length > 0) {
  console.error('Registry v2 baseline validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

const counts = Object.fromEntries(Object.entries(groups).map(([name, rows]) => [name, rows.length]));
console.log('Registry v2 baseline validation passed:');
for (const [name, count] of Object.entries(counts)) console.log(`- ${name}: ${count}`);
console.log(`- protected stablecoins: ${(manifest.protected_stablecoins ?? []).length}`);
console.log(`- protected organizations: ${(manifest.protected_organizations ?? []).length}`);
console.log(`- required route sources: ${(manifest.required_route_sources ?? []).length}`);
