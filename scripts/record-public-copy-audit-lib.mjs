import fs from 'node:fs';
import path from 'node:path';

export const scanRoots = [
  'src/components',
  'src/pages',
  'src/layouts',
  'src/utils',
  'src/lib',
  'src/data'
];

const allowedExtensions = new Set(['.astro', '.ts', '.tsx', '.js', '.jsx', '.mjs', '.json', '.md']);
const excludedPaths = new Set([
  'src/lib/data/registryBase.ts',
  'src/lib/data/registry.ts',
  'src/lib/data/registryV3.ts'
]);

export function readRows(root, relativePath) {
  const value = JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
  const rows = Array.isArray(value) ? value : value.records;
  if (!Array.isArray(rows)) throw new Error(`${relativePath}: expected an array or records array`);
  return rows;
}

export function groupRows(root, baseline, name) {
  return (baseline.data_groups?.[name] ?? []).flatMap((file) => readRows(root, file));
}

export function applyById(rows, layers) {
  const maps = layers.map((layer) => new Map(layer.map((row) => [row.id, row])));
  return rows.map((row) => maps.reduce((merged, map) => ({ ...merged, ...(map.get(row.id) ?? {}) }), row));
}

export function uniqueStrings(values) {
  return [...new Set(values
    .filter((value) => typeof value === 'string' && value.trim().length > 0)
    .map((value) => value.trim()))];
}

export function relationValues(row, pluralKey, singularKey) {
  return uniqueStrings([
    ...(Array.isArray(row[pluralKey]) ? row[pluralKey] : []),
    ...(typeof row[singularKey] === 'string' ? [row[singularKey]] : [])
  ]);
}

export function normalizeEvidence(row) {
  return {
    ...row,
    stablecoin_ids: relationValues(row, 'stablecoin_ids', 'stablecoin_id'),
    organization_ids: relationValues(row, 'organization_ids', 'issuer_id'),
    event_ids: relationValues(row, 'event_ids', 'event_id'),
    claim_scopes: relationValues(row, 'claim_scopes', 'claim_scope')
  };
}

export function listSourceFiles(root) {
  const files = [];
  for (const relativeRoot of scanRoots) {
    const absoluteRoot = path.join(root, relativeRoot);
    if (!fs.existsSync(absoluteRoot)) continue;
    const stack = [absoluteRoot];
    while (stack.length > 0) {
      const current = stack.pop();
      for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
        const absolute = path.join(current, entry.name);
        if (entry.isDirectory()) {
          stack.push(absolute);
          continue;
        }
        if (!allowedExtensions.has(path.extname(entry.name))) continue;
        const relative = path.relative(root, absolute).replaceAll(path.sep, '/');
        if (!excludedPaths.has(relative)) files.push(relative);
      }
    }
  }
  return uniqueStrings(files).sort();
}

export function surfaceKind(file) {
  if (file.startsWith('src/components/') || file.startsWith('src/pages/') || file.startsWith('src/layouts/')) return 'public_component_or_page';
  if (file.startsWith('src/data/')) return 'data_overlay_candidate';
  return 'shared_utility_or_library';
}

export function likelyPublicCopy(file, line) {
  if (surfaceKind(file) === 'public_component_or_page') return true;
  return /title|summary|description|label|copy|note|heading|message|caption|text|tooltip|display/i.test(line);
}

export function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
