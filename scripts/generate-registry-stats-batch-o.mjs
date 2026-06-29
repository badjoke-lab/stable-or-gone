import fs from 'node:fs';
import path from 'node:path';
import { buildRegistryStats } from './generate-current-stats-r.mjs';

export { buildRegistryStats };

const stats = buildRegistryStats();
const outputPath = path.join(process.cwd(), 'data/generated/registry-stats.json');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(stats, null, 2)}\n`);
console.log(`Generated registry stats for ${stats.registry.stablecoins} assets.`);
