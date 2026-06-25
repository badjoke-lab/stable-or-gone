import fs from 'node:fs';

const basePath = new URL('./validate-batch-finalization-base.mjs', import.meta.url);
const original = fs.readFileSync(basePath, 'utf8');
const promotionAnchor = "'data/candidate-promotions-batch-j.json'";
const baselineAnchor = 'const baseline = readJson(baselinePath);';
if (!original.includes(promotionAnchor)) throw new Error('Batch finalization promotion patch anchor is missing');
if (!original.includes(baselineAnchor)) throw new Error('Batch finalization baseline patch anchor is missing');
const promotionPatched = original.replace(
  promotionAnchor,
  `${promotionAnchor}, 'data/candidate-promotions-batch-k.json', 'data/candidate-promotions-batch-l.json', 'data/candidate-promotions-batch-m.json', 'data/candidate-promotions-batch-n.json', 'data/candidate-promotions-batch-16.json'`
);
const baselineReplacement = `
const baselineBase = readJson(baselinePath);
const baselineOverlay = readJson('docs/migration/registry-v2-baseline-batch-o.json');
const baselineGroups = { ...(baselineBase?.data_groups ?? {}) };
for (const [name, additions] of Object.entries(baselineOverlay?.data_group_additions ?? {})) {
  baselineGroups[name] = [...new Set([...(baselineGroups[name] ?? []), ...additions])];
}
const batchOStablecoins = readJson('data/stablecoins-batch-o.json') ?? [];
const batchOOrganizations = readJson('data/organizations-batch-o.json') ?? [];
const baseline = baselineBase ? {
  ...baselineBase,
  baseline_id: \`${'${baselineBase.baseline_id}'}_batch_o\`,
  minimum_counts: { ...(baselineBase.minimum_counts ?? {}), ...(baselineOverlay?.minimum_counts ?? {}) },
  data_groups: baselineGroups,
  protected_stablecoins: [...(baselineBase.protected_stablecoins ?? []), ...batchOStablecoins.map((row) => ({ id: row.id, slug: row.slug }))],
  protected_organizations: [...(baselineBase.protected_organizations ?? []), ...batchOOrganizations.map((row) => ({ id: row.id, slug: row.slug }))]
} : null;`;
const patched = promotionPatched.replace(baselineAnchor, baselineReplacement);
await import(`data:text/javascript;base64,${Buffer.from(patched).toString('base64')}`);
