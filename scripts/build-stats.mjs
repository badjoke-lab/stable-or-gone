import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { loadStatsInput } from './stats/load-stats-input.mjs';
import { buildStatsModel } from './stats/build-stats-model.mjs';
import { normalizeDeploymentChainStats } from './stats/normalize-deployment-chains.mjs';

export function generateStats(options = {}) {
  const root = options.root ?? process.cwd();
  const input = loadStatsInput(root);
  const generatedAt = options.generatedAt ?? process.env.SOG_STATS_GENERATED_AT ?? `${input.checkpoint.recorded_at}T00:00:00.000Z`;
  const registryVersion = options.registryVersion ?? process.env.SOG_STATS_REGISTRY_VERSION ?? input.checkpoint.source_commit;
  const stats = buildStatsModel(input, { generatedAt, registryVersion });
  return normalizeDeploymentChainStats(stats, input.deployments);
}

export function writeStats(stats, options = {}) {
  const root = options.root ?? process.cwd();
  const outputPath = options.outputPath ?? process.env.SOG_STATS_OUTPUT ?? 'artifacts/stats-current.json';
  const absolute = path.join(root, outputPath);
  fs.mkdirSync(path.dirname(absolute), { recursive: true });
  fs.writeFileSync(absolute, `${JSON.stringify(stats, null, 2)}\n`);
  return outputPath;
}

function main() {
  const stats = generateStats();
  const output = writeStats(stats);
  console.log(JSON.stringify({
    output,
    schema_version: stats.schema_version,
    generated_at: stats.generated_at,
    registry_version: stats.registry_version,
    checkpoint_id: stats.checkpoint_id,
    totals: stats.totals,
    input_digest_sha256: stats.input_digest_sha256
  }, null, 2));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
