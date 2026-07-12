import fs from 'node:fs';

const basePath = new URL('./validate-registry-v3-foundation.mjs', import.meta.url);
const original = fs.readFileSync(basePath, 'utf8');
const anchor = "const baseline = readJson('docs/migration/registry-v2-baseline.json') ?? {};";
if (!original.includes(anchor)) throw new Error('Registry v3 foundation baseline patch anchor is missing');
const replacement = `
const baselineBase = readJson('docs/migration/registry-v2-baseline.json') ?? {};
const baselineGroups = { ...baselineBase.data_groups };
const overlayFiles = fs.readdirSync(absolute('docs/migration'))
  .filter((name) => /^registry-v2-baseline-batch-[a-z]+\\.json$/i.test(name))
  .sort();
for (const name of overlayFiles) {
  const overlayPath = \`docs/migration/\${name}\`;
  const overlay = readJson(overlayPath) ?? {};
  for (const [groupName, additions] of Object.entries(overlay.data_group_additions ?? {})) {
    baselineGroups[groupName] = [...new Set([...(baselineGroups[groupName] ?? []), ...additions])];
  }
}
const baseline = { ...baselineBase, data_groups: baselineGroups };
`;
await import(`data:text/javascript;base64,${Buffer.from(original.replace(anchor, replacement)).toString('base64')}`);
