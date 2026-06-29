import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildRegistryStats as buildBaseRegistryStats } from './generate-registry-stats.mjs';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const root = process.cwd();
const baselinePath = path.join(root, 'docs/migration/registry-v2-baseline.json');
const foundationPath = path.join(root, 'docs/migration/registry-v3-foundation.json');
const incomeManifestPath = path.join(root, 'docs/migration/registry-v3-income-profiles.json');
const outputPath = path.join(root, 'data/generated/registry-stats.json');

export function buildRegistryStats() {
  const originalBaseline = fs.readFileSync(baselinePath, 'utf8');
  const originalFoundation = fs.readFileSync(foundationPath, 'utf8');
  const originalIncomeManifest = fs.readFileSync(incomeManifestPath, 'utf8');
  const mergedBaseline = loadRegistryV2Baseline(root);
  const foundation = JSON.parse(originalFoundation);
  const incomeManifest = JSON.parse(originalIncomeManifest);
  const mergedFoundation = {
    ...foundation,
    data_groups: {
      ...foundation.data_groups,
      legal_profiles: [...new Set([...(foundation.data_groups.legal_profiles ?? []), 'data/q-legal.json'])],
      reserve_components: [...new Set([...(foundation.data_groups.reserve_components ?? []), 'data/reserve-components-v3-batch-q.json'])]
    }
  };
  const mergedIncomeManifest = {
    ...incomeManifest,
    data_files: [...new Set([...(incomeManifest.data_files ?? []), 'data/yield-profiles-v3-q.json'])]
  };
  try {
    fs.writeFileSync(baselinePath, `${JSON.stringify(mergedBaseline, null, 2)}\n`);
    fs.writeFileSync(foundationPath, `${JSON.stringify(mergedFoundation, null, 2)}\n`);
    fs.writeFileSync(incomeManifestPath, `${JSON.stringify(mergedIncomeManifest, null, 2)}\n`);
    return buildBaseRegistryStats();
  } finally {
    fs.writeFileSync(baselinePath, originalBaseline);
    fs.writeFileSync(foundationPath, originalFoundation);
    fs.writeFileSync(incomeManifestPath, originalIncomeManifest);
  }
}

function runCli() {
  const stats = buildRegistryStats();
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(stats, null, 2)}\n`);
  console.log(`Generated data/generated/registry-stats.json for ${stats.registry.stablecoins} assets.`);
}

const direct = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (direct) runCli();
