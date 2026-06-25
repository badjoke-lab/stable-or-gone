import fs from 'node:fs';

const basePath = new URL('./audit-registry-integrity.mjs', import.meta.url);
const original = fs.readFileSync(basePath, 'utf8');
const anchor = "const baseline = readJson('docs/migration/registry-v2-baseline.json');";
if (!original.includes(anchor)) throw new Error('Registry integrity baseline patch anchor is missing');
const replacement = `
const baselineBase = readJson('docs/migration/registry-v2-baseline.json');
const baselineGroups = { ...baselineBase.data_groups };
const minimumCounts = { ...baselineBase.minimum_counts };
const suffixes = [];
for (const suffix of ['o', 'p']) {
  const overlay = readJson(\`docs/migration/registry-v2-baseline-batch-\${suffix}.json\`);
  suffixes.push(\`batch_\${suffix}\`);
  Object.assign(minimumCounts, overlay.minimum_counts ?? {});
  for (const [name, additions] of Object.entries(overlay.data_group_additions ?? {})) {
    baselineGroups[name] = [...new Set([...(baselineGroups[name] ?? []), ...additions])];
  }
}
const baseline = {
  ...baselineBase,
  baseline_id: \`${'${baselineBase.baseline_id}'}_\${suffixes.join('_')}\`,
  minimum_counts: minimumCounts,
  data_groups: baselineGroups
};`;
const patched = original
  .replace(anchor, replacement)
  .replaceAll('SOG 80-Record Final Registry Audit', 'SOG 92-Record Registry Audit')
  .replaceAll('SOG 87-Record Registry Audit', 'SOG 92-Record Registry Audit')
  .replaceAll('The 80-record canonical registry', 'The 92-record canonical registry')
  .replaceAll('The 87-record canonical registry', 'The 92-record canonical registry');
await import(`data:text/javascript;base64,${Buffer.from(patched).toString('base64')}`);
