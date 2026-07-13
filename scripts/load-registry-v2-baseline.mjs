import fs from 'node:fs';
import path from 'node:path';

const unique = (items) => [...new Set(items)];
const uniqueRows = (rows) => [...new Map(rows.map((row) => [row.id, row])).values()];
const readJson = (root, relativePath) => JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));

function mergeMinimumCounts(target, source = {}) {
  for (const [name, value] of Object.entries(source)) {
    if (Number.isFinite(value) && Number.isFinite(target[name])) target[name] = Math.max(target[name], value);
    else target[name] = value;
  }
}

export function loadRegistryV2Baseline(root = process.cwd()) {
  const baseRelativePath = 'docs/migration/registry-v2-baseline.json';
  const base = readJson(root, baseRelativePath);
  const migrationDir = path.join(root, 'docs/migration');
  const overlayFiles = fs.readdirSync(migrationDir)
    .filter((name) => /^registry-v2-baseline-batch-[a-z]+\.json$/i.test(name))
    .sort()
    .map((name) => `docs/migration/${name}`);

  if (overlayFiles.length === 0) return base;

  const dataGroups = { ...(base.data_groups ?? {}) };
  const minimumCounts = { ...(base.minimum_counts ?? {}) };
  let capturedAt = base.captured_at;
  const protectedStablecoins = [...(base.protected_stablecoins ?? [])];
  const protectedOrganizations = [...(base.protected_organizations ?? [])];
  const suffixes = [];
  const deferredLegacyV3Overlays = [];

  for (const relativePath of overlayFiles) {
    const overlay = readJson(root, relativePath);
    const suffix = path.basename(relativePath).match(/batch-([a-z]+)\.json$/i)?.[1];
    if (suffix) suffixes.push(`batch_${suffix.toLowerCase()}`);
    mergeMinimumCounts(minimumCounts, overlay.minimum_counts ?? {});
    capturedAt = overlay.captured_at ?? capturedAt;

    for (const [name, additions] of Object.entries(overlay.data_group_additions ?? {})) {
      dataGroups[name] = unique([...(dataGroups[name] ?? []), ...additions]);
    }

    if (overlay.defer_legacy_v3_full_coverage === true) {
      deferredLegacyV3Overlays.push({
        path: relativePath,
        batch_id: overlay.batch_id ?? null,
        reason: overlay.deferred_v3_reason ?? null
      });
      continue;
    }

    for (const stablecoinFile of overlay.data_group_additions?.stablecoins ?? []) {
      for (const row of readJson(root, stablecoinFile)) protectedStablecoins.push({ id: row.id, slug: row.slug });
    }
    for (const organizationFile of overlay.data_group_additions?.organizations ?? []) {
      for (const row of readJson(root, organizationFile)) protectedOrganizations.push({ id: row.id, slug: row.slug });
    }
  }

  return {
    ...base,
    baseline_id: `${base.baseline_id}_${suffixes.join('_')}`,
    captured_at: capturedAt,
    minimum_counts: minimumCounts,
    data_groups: dataGroups,
    protected_stablecoins: uniqueRows(protectedStablecoins),
    protected_organizations: uniqueRows(protectedOrganizations),
    deferred_legacy_v3_overlays: deferredLegacyV3Overlays
  };
}
