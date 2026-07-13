import fs from 'node:fs';

const path = new URL('./validate-registry-v3-deployments.mjs', import.meta.url);
let source = fs.readFileSync(path, 'utf8');
const anchor = 'const baseline = readJson(baselinePath) ?? {};';
if (!source.includes(anchor)) throw new Error('deployment baseline anchor missing');
const replacement = `
const baselineBase = readJson(baselinePath) ?? {};
const baselineGroups = { ...(baselineBase.data_groups ?? {}) };
const minimumCounts = { ...(baselineBase.minimum_counts ?? {}) };
for (const suffix of ['o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'za']) {
  const overlayPath = \`docs/migration/registry-v2-baseline-batch-\${suffix}.json\`;
  const overlay = readJson(overlayPath) ?? {};
  Object.assign(minimumCounts, overlay.minimum_counts ?? {});
  for (const [name, additions] of Object.entries(overlay.data_group_additions ?? {})) {
    baselineGroups[name] = [...new Set([...(baselineGroups[name] ?? []), ...additions])];
  }
}
const baseline = { ...baselineBase, minimum_counts: minimumCounts, data_groups: baselineGroups };
`;
source = source.replace(anchor, replacement);
await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
