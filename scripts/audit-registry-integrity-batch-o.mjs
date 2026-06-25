import fs from 'node:fs';

const basePath = new URL('./audit-registry-integrity.mjs', import.meta.url);
const original = fs.readFileSync(basePath, 'utf8');
const anchor = "const baseline = readJson('docs/migration/registry-v2-baseline.json');";
if (!original.includes(anchor)) throw new Error('Registry integrity baseline patch anchor is missing');
const replacement = `
const baselineBase = readJson('docs/migration/registry-v2-baseline.json');
const baselineOverlay = readJson('docs/migration/registry-v2-baseline-batch-o.json');
const baselineGroups = { ...baselineBase.data_groups };
for (const [name, additions] of Object.entries(baselineOverlay.data_group_additions ?? {})) {
  baselineGroups[name] = [...new Set([...(baselineGroups[name] ?? []), ...additions])];
}
const baseline = {
  ...baselineBase,
  baseline_id: \`${'${baselineBase.baseline_id}'}_batch_o\`,
  minimum_counts: { ...baselineBase.minimum_counts, ...baselineOverlay.minimum_counts },
  data_groups: baselineGroups
};`;
const patched = original.replace(anchor, replacement);
await import(`data:text/javascript;base64,${Buffer.from(patched).toString('base64')}`);
