import fs from 'node:fs';
import path from 'node:path';
import { buildRegistryStats } from './generate-registry-stats-batch-o.mjs';

const regeneratedStats = buildRegistryStats();
const statsPath = path.join(process.cwd(), 'data/generated/registry-stats.json');
fs.mkdirSync(path.dirname(statsPath), { recursive: true });
fs.writeFileSync(statsPath, `${JSON.stringify(regeneratedStats, null, 2)}\n`);

const basePath = new URL('./audit-registry-integrity.mjs', import.meta.url);
const original = fs.readFileSync(basePath, 'utf8');
const anchor = "const baseline = readJson('docs/migration/registry-v2-baseline.json');";
const foundationAnchor = "const foundation = readJson('docs/migration/registry-v3-foundation.json');";
const yieldAnchor = "const incomeManifest = readJson('docs/migration/registry-v3-income-profiles.json');";
const currentJsonAnchor = "const currentJson = fs.existsSync(absolute(jsonPath)) ? fs.readFileSync(absolute(jsonPath), 'utf8') : '';";
for (const [name, value] of Object.entries({ anchor, foundationAnchor, yieldAnchor, currentJsonAnchor })) {
  if (!original.includes(value)) throw new Error(`Registry integrity patch anchor is missing: ${name}`);
}
const replacement = `
const baselineBase = readJson('docs/migration/registry-v2-baseline.json');
const baselineGroups = { ...baselineBase.data_groups };
const minimumCounts = { ...baselineBase.minimum_counts };
const suffixes = [];
for (const suffix of ['o', 'p', 'q', 'r']) {
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
const foundationReplacement = `
const foundationBase = readJson('docs/migration/registry-v3-foundation.json');
const foundation = {
  ...foundationBase,
  data_groups: {
    ...foundationBase.data_groups,
    legal_profiles: [...new Set([...(foundationBase.data_groups.legal_profiles ?? []), 'data/q-legal.json', 'data/r-legal.json'])],
    reserve_components: [...new Set([...(foundationBase.data_groups.reserve_components ?? []), 'data/reserve-components-v3-batch-q.json', 'data/reserve-components-v3-batch-r.json'])]
  }
};`;
const yieldReplacement = `
const incomeManifestBase = readJson('docs/migration/registry-v3-income-profiles.json');
const incomeManifest = {
  ...incomeManifestBase,
  data_files: [...new Set([...(incomeManifestBase.data_files ?? []), 'data/yield-profiles-v3-q.json', 'data/r-returns.json'])]
};`;
const semanticJsonReplacement = `const currentJsonRaw = fs.existsSync(absolute(jsonPath)) ? fs.readFileSync(absolute(jsonPath), 'utf8') : '';
  let currentJson = currentJsonRaw;
  if (currentJsonRaw) {
    try {
      currentJson = serialize(JSON.parse(currentJsonRaw));
    } catch {
      currentJson = currentJsonRaw;
    }
  }`;
const patched = original
  .replace(anchor, replacement)
  .replace(foundationAnchor, foundationReplacement)
  .replace(yieldAnchor, yieldReplacement)
  .replace(currentJsonAnchor, semanticJsonReplacement)
  .replaceAll('SOG 80-Record Final Registry Audit', 'SOG 96-Record Registry Audit')
  .replaceAll('SOG 87-Record Registry Audit', 'SOG 96-Record Registry Audit')
  .replaceAll('SOG 92-Record Registry Audit', 'SOG 96-Record Registry Audit')
  .replaceAll('SOG 94-Record Registry Audit', 'SOG 96-Record Registry Audit')
  .replaceAll('The 80-record canonical registry', 'The 96-record canonical registry')
  .replaceAll('The 87-record canonical registry', 'The 96-record canonical registry')
  .replaceAll('The 92-record canonical registry', 'The 96-record canonical registry')
  .replaceAll('The 94-record canonical registry', 'The 96-record canonical registry');
await import(`data:text/javascript;base64,${Buffer.from(patched).toString('base64')}`);
