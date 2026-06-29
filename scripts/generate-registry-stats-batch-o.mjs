import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildRegistryStats } from './generate-current-stats-r.mjs';

export { buildRegistryStats };

const direct = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (direct) {
  const stats = buildRegistryStats();
  const outputPath = path.join(process.cwd(), 'data/generated/registry-stats.json');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(stats, null, 2)}\n`);
  console.log(`Generated registry stats for ${stats.registry.stablecoins} assets.`);
}
