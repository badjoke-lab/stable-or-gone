import fs from 'node:fs';
import path from 'node:path';

const targets = new Set([
  'sog_st_msusd',
  'sog_st_stablesusdx',
  'sog_st_susde',
  'sog_st_usd1',
  'sog_st_usdm',
  'sog_st_usdh'
]);

const files = [];
const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile() && entry.name.endsWith('.json')) files.push(full);
  }
};
walk('data');

const containsTarget = (value) => {
  if (typeof value === 'string') return targets.has(value);
  if (Array.isArray(value)) return value.some(containsTarget);
  if (value && typeof value === 'object') return Object.values(value).some(containsTarget);
  return false;
};

const matches = [];
for (const file of files.sort()) {
  let parsed;
  try { parsed = JSON.parse(fs.readFileSync(file, 'utf8')); } catch { continue; }
  const rows = Array.isArray(parsed) ? parsed : [parsed];
  rows.forEach((row, index) => {
    if (containsTarget(row)) matches.push({ file, index, row });
  });
}

const output = { generated_at: '2026-08-01', targets: [...targets], match_count: matches.length, matches };
fs.mkdirSync('docs/migration', { recursive: true });
fs.writeFileSync('docs/migration/launch-date-target-inspection-pr503.json', `${JSON.stringify(output, null, 2)}\n`);
console.log(JSON.stringify({ ok: true, match_count: matches.length, output: 'docs/migration/launch-date-target-inspection-pr503.json' }, null, 2));
