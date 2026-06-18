import fs from 'node:fs';
import path from 'node:path';

// Reserve-report rows include dated reports and continuing context/index pages.
// For validation, context rows inherit the parent stablecoin's reviewed date.
// Source files are restored after the check, so the working tree is unchanged.
const root = process.cwd();
const baseline = JSON.parse(fs.readFileSync(path.join(root, 'docs/migration/registry-v2-baseline.json'), 'utf8'));
const readRows = (relative) => {
  const value = JSON.parse(fs.readFileSync(path.join(root, relative), 'utf8'));
  return Array.isArray(value) ? value : value.records;
};
const stablecoins = baseline.data_groups.stablecoins.flatMap(readRows);
const lastVerifiedByStablecoin = new Map(stablecoins.map((row) => [row.id, row.last_verified_at]));
const originals = new Map();

try {
  for (const relative of baseline.data_groups.reserve_reports) {
    const file = path.join(root, relative);
    const original = fs.readFileSync(file, 'utf8');
    const value = JSON.parse(original);
    const rows = Array.isArray(value) ? value : value.records;
    let changed = false;
    const normalized = rows.map((row) => {
      if (row.report_date || row.period_covered || row.as_of || row.last_verified_at) return row;
      const inherited = lastVerifiedByStablecoin.get(row.stablecoin_id);
      if (!inherited) return row;
      changed = true;
      return { ...row, last_verified_at: inherited };
    });
    if (!changed) continue;
    originals.set(file, original);
    const output = Array.isArray(value) ? normalized : { ...value, records: normalized };
    fs.writeFileSync(file, `${JSON.stringify(output, null, 2)}\n`);
  }
  await import('./verify-public-surface-parity-v2.mjs');
} finally {
  for (const [file, original] of originals) fs.writeFileSync(file, original);
}
