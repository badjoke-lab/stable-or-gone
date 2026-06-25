import fs from 'node:fs';

const path = new URL('./validate-registry-v3-migration-audit.mjs', import.meta.url);
let source = fs.readFileSync(path, 'utf8');
const anchor = "const baseline = readJson(audit.base_registry ?? '') ?? {};";
if (!source.includes(anchor)) throw new Error('migration audit baseline anchor missing');
const replacement = `
const baselineBase = readJson(audit.base_registry ?? '') ?? {};
const baselineGroups = { ...(baselineBase.data_groups ?? {}) };
const minimumCounts = { ...(baselineBase.minimum_counts ?? {}) };
const protectedStablecoins = [...(baselineBase.protected_stablecoins ?? [])];
for (const suffix of ['o', 'p']) {
  const overlay = readJson(\`docs/migration/registry-v2-baseline-batch-\${suffix}.json\`) ?? {};
  Object.assign(minimumCounts, overlay.minimum_counts ?? {});
  for (const [name, additions] of Object.entries(overlay.data_group_additions ?? {})) {
    baselineGroups[name] = [...new Set([...(baselineGroups[name] ?? []), ...additions])];
  }
  for (const file of overlay.data_group_additions?.stablecoins ?? []) {
    for (const row of readJson(file) ?? []) protectedStablecoins.push({ id: row.id, slug: row.slug });
  }
}
const baseline = { ...baselineBase, minimum_counts: minimumCounts, data_groups: baselineGroups, protected_stablecoins: [...new Map(protectedStablecoins.map((row) => [row.id, row])).values()] };
`;
source = source
  .replace(anchor, replacement)
  .replace("'validate:v3': 'scripts/validate-registry-v3-foundation.mjs'", "'validate:v3': 'scripts/validate-registry-v3-foundation-batch-o.mjs'")
  .replace("'validate:migration-v3': 'scripts/validate-registry-v3-migration-audit.mjs'", "'validate:migration-v3': 'scripts/validate-registry-v3-migration-audit-batch-o.mjs'");
await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
