import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildRegistryStats as buildBaseRegistryStats } from './generate-registry-stats.mjs';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const root = process.cwd();
const baselinePath = path.join(root, 'docs/migration/registry-v2-baseline.json');
const foundationPath = path.join(root, 'docs/migration/registry-v3-foundation.json');
const returnManifestPath = path.join(root, 'docs/migration/registry-v3-income-profiles.json');
const outputPath = path.join(root, 'data/generated/registry-stats.json');

export function buildRegistryStats() {
  const originalBaseline = fs.readFileSync(baselinePath, 'utf8');
  const originalFoundation = fs.readFileSync(foundationPath, 'utf8');
  const originalReturns = fs.readFileSync(returnManifestPath, 'utf8');
  const mergedBaseline = loadRegistryV2Baseline(root);
  const foundation = JSON.parse(originalFoundation);
  const returnManifest = JSON.parse(originalReturns);
  const mergedFoundation = {
    ...foundation,
    data_groups: {
      ...foundation.data_groups,
      legal_profiles: [...new Set([...(foundation.data_groups.legal_profiles ?? []), 'data/q-legal.json', 'data/r-legal.json', 'data/s-legal.json', 'data/t-legal.json'])],
      reserve_components: [...new Set([...(foundation.data_groups.reserve_components ?? []), 'data/reserve-components-v3-batch-q.json', 'data/reserve-components-v3-batch-r.json', 'data/reserve-components-v3-batch-s.json', 'data/batch-t-components.json'])]
    }
  };
  const mergedReturns = {
    ...returnManifest,
    data_files: [...new Set([...(returnManifest.data_files ?? []), 'data/yield-profiles-v3-q.json', 'data/r-returns.json', 'data/s-returns.json', 'data/batch-t-income.json'])]
  };
  try {
    fs.writeFileSync(baselinePath, `${JSON.stringify(mergedBaseline, null, 2)}\n`);
    fs.writeFileSync(foundationPath, `${JSON.stringify(mergedFoundation, null, 2)}\n`);
    fs.writeFileSync(returnManifestPath, `${JSON.stringify(mergedReturns, null, 2)}\n`);
    return buildBaseRegistryStats();
  } finally {
    fs.writeFileSync(baselinePath, originalBaseline);
    fs.writeFileSync(foundationPath, originalFoundation);
    fs.writeFileSync(returnManifestPath, originalReturns);
  }
}

function runCli() {
  const stats = buildRegistryStats();
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(stats, null, 2)}\n`);
  console.log(`Generated registry stats for ${stats.registry.stablecoins} assets.`);
}

const direct = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (direct) runCli();
