import fs from 'node:fs';

const basePath = new URL('./validate-batch-finalization-base.mjs', import.meta.url);
const original = fs.readFileSync(basePath, 'utf8');
const promotionAnchor = "'data/candidate-promotions-batch-j.json'";
const baselineAnchor = 'const baseline = readJson(baselinePath);';
if (!original.includes(promotionAnchor)) throw new Error('Batch finalization promotion patch anchor is missing');
if (!original.includes(baselineAnchor)) throw new Error('Batch finalization baseline patch anchor is missing');
const promotionPatched = original.replace(
  promotionAnchor,
  `${promotionAnchor}, 'data/candidate-promotions-batch-k.json', 'data/candidate-promotions-batch-l.json', 'data/candidate-promotions-batch-m.json', 'data/candidate-promotions-batch-n.json', 'data/candidate-promotions-batch-16.json', 'data/candidate-promotions-batch-17.json'`
);
const baselineReplacement = `
const baselineBase = readJson(baselinePath);
const baselineGroups = { ...(baselineBase?.data_groups ?? {}) };
const minimumCounts = { ...(baselineBase?.minimum_counts ?? {}) };
const protectedStablecoins = [...(baselineBase?.protected_stablecoins ?? [])];
const protectedOrganizations = [...(baselineBase?.protected_organizations ?? [])];
const suffixes = [];
for (const suffix of ['o', 'p']) {
  const overlay = readJson(\`docs/migration/registry-v2-baseline-batch-\${suffix}.json\`) ?? {};
  suffixes.push(\`batch_\${suffix}\`);
  Object.assign(minimumCounts, overlay.minimum_counts ?? {});
  for (const [name, additions] of Object.entries(overlay.data_group_additions ?? {})) {
    baselineGroups[name] = [...new Set([...(baselineGroups[name] ?? []), ...additions])];
  }
  for (const file of overlay.data_group_additions?.stablecoins ?? []) {
    for (const row of readJson(file) ?? []) protectedStablecoins.push({ id: row.id, slug: row.slug });
  }
  for (const file of overlay.data_group_additions?.organizations ?? []) {
    for (const row of readJson(file) ?? []) protectedOrganizations.push({ id: row.id, slug: row.slug });
  }
}
const baseline = baselineBase ? {
  ...baselineBase,
  baseline_id: \`${'${baselineBase.baseline_id}'}_\${suffixes.join('_')}\`,
  minimum_counts: minimumCounts,
  data_groups: baselineGroups,
  protected_stablecoins: [...new Map(protectedStablecoins.map((row) => [row.id, row])).values()],
  protected_organizations: [...new Map(protectedOrganizations.map((row) => [row.id, row])).values()]
} : null;`;
const patched = promotionPatched.replace(baselineAnchor, baselineReplacement);
await import(`data:text/javascript;base64,${Buffer.from(patched).toString('base64')}`);
