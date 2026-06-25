import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildRegistryStats as buildBaseRegistryStats } from './generate-registry-stats.mjs';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const root = process.cwd();
const baselinePath = path.join(root, 'docs/migration/registry-v2-baseline.json');
const outputPath = path.join(root, 'data/generated/registry-stats.json');

export function buildRegistryStats() {
  const original = fs.readFileSync(baselinePath, 'utf8');
  const merged = loadRegistryV2Baseline(root);
  try {
    fs.writeFileSync(baselinePath, `${JSON.stringify(merged, null, 2)}\n`);
    return buildBaseRegistryStats();
  } finally {
    fs.writeFileSync(baselinePath, original);
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
