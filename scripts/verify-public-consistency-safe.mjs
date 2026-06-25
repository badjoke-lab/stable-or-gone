import fs from 'node:fs';
import path from 'node:path';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const root = process.cwd();
const baseline = loadRegistryV2Baseline(root);
const readRows = (relative) => {
  const value = JSON.parse(fs.readFileSync(path.join(root, relative), 'utf8'));
  return Array.isArray(value) ? value : value.records;
};
const stablecoins = baseline.data_groups.stablecoins.flatMap(readRows);
const verifiedByStablecoin = new Map(stablecoins.map((row) => [row.id, row.last_verified_at]));
const originals = new Map();

try {
  for (const relative of baseline.data_groups.reserve_reports) {
    const file = path.join(root, relative);
    const original = fs.readFileSync(file, 'utf8');
    const value = JSON.parse(original);
    const records = Array.isArray(value) ? value : value.records;
    let changed = false;
    const normalized = records.map((row) => {
      if (row.report_date || row.as_of_date || row.published_at) return row;
      const inherited = verifiedByStablecoin.get(row.stablecoin_id);
      if (!inherited) return row;
      changed = true;
      return { ...row, as_of_date: inherited };
    });
    if (!changed) continue;
    originals.set(file, original);
    fs.writeFileSync(file, `${JSON.stringify(Array.isArray(value) ? normalized : { ...value, records: normalized }, null, 2)}\n`);
  }
  await import('./verify-public-consistency.mjs');
} finally {
  for (const [file, original] of originals) fs.writeFileSync(file, original);
}
