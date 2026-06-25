import fs from 'node:fs';
import path from 'node:path';

const unique = (items) => [...new Set(items)];

export function loadRegistryV2Baseline(root = process.cwd()) {
  const basePath = path.join(root, 'docs/migration/registry-v2-baseline.json');
  const overlayPath = path.join(root, 'docs/migration/registry-v2-baseline-batch-o.json');
  const base = JSON.parse(fs.readFileSync(basePath, 'utf8'));
  if (!fs.existsSync(overlayPath)) return base;

  const overlay = JSON.parse(fs.readFileSync(overlayPath, 'utf8'));
  const dataGroups = { ...(base.data_groups ?? {}) };
  for (const [name, additions] of Object.entries(overlay.data_group_additions ?? {})) {
    dataGroups[name] = unique([...(dataGroups[name] ?? []), ...additions]);
  }

  return {
    ...base,
    baseline_id: `${base.baseline_id}_batch_o`,
    captured_at: overlay.captured_at ?? base.captured_at,
    minimum_counts: { ...(base.minimum_counts ?? {}), ...(overlay.minimum_counts ?? {}) },
    data_groups: dataGroups
  };
}
