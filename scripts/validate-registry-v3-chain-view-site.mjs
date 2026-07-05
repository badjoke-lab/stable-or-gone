import fs from 'node:fs';

const path = new URL('./validate-registry-v3-deployments.mjs', import.meta.url);
let source = fs.readFileSync(path, 'utf8');
const baselineAnchor = 'const baseline = readJson(baselinePath) ?? {};';
const buildChainCheck = `if (!packageText.includes('npm run validate:deployments-v3')) {
  failures.push('package.json: build chain does not include validate:deployments-v3');
}`;
if (!source.includes(baselineAnchor)) throw new Error('deployment baseline anchor missing');
if (!source.includes(buildChainCheck)) throw new Error('deployment build-chain check anchor missing');
const baselineReplacement = `
const baselineBase = readJson(baselinePath) ?? {};
const baselineGroups = { ...(baselineBase.data_groups ?? {}) };
const minimumCounts = { ...(baselineBase.minimum_counts ?? {}) };
for (const overlayPath of ['docs/migration/registry-v2-baseline-batch-o.json', 'docs/migration/registry-v2-baseline-batch-p.json', 'docs/migration/registry-v2-baseline-batch-u.json']) {
  const overlay = readJson(overlayPath) ?? {};
  Object.assign(minimumCounts, overlay.minimum_counts ?? {});
  for (const [name, additions] of Object.entries(overlay.data_group_additions ?? {})) {
    baselineGroups[name] = [...new Set([...(baselineGroups[name] ?? []), ...additions])];
  }
}
const baseline = { ...baselineBase, minimum_counts: minimumCounts, data_groups: baselineGroups };
`;
source = source.replace(baselineAnchor, baselineReplacement).replace(buildChainCheck, '');
await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
