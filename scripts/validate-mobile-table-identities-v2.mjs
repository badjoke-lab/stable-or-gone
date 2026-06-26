import fs from 'node:fs';
import { mobileTableSourceFiles, requiredMobileTableKinds } from './mobile-table-manifest.mjs';

const failures = [];
const tableSources = new Map();
let tableCount = 0;

for (const file of mobileTableSourceFiles) {
  const source = fs.readFileSync(file, 'utf8');
  const tags = [...source.matchAll(/<table\b[^>]*>/g)].map((match) => match[0]);
  if (!tags.length) failures.push(`${file}: no table found`);
  for (const tag of tags) {
    tableCount += 1;
    const kind = tag.match(/data-table-kind="([^"]+)"/)?.[1];
    const strategy = tag.match(/data-mobile-table="([^"]+)"/)?.[1];
    if (!kind) failures.push(`${file}: table identity is missing`);
    if (strategy !== 'scroll-preserve') failures.push(`${file}: ${kind ?? 'unknown table'} must preserve scrolling`);
    if (!kind) continue;
    if (tableSources.has(kind)) failures.push(`Duplicate table identity: ${kind}`);
    tableSources.set(kind, file);
  }
}

for (const kind of requiredMobileTableKinds) {
  if (!tableSources.has(kind)) failures.push(`Missing table identity: ${kind}`);
}
if (tableSources.size !== requiredMobileTableKinds.length) failures.push(`Expected ${requiredMobileTableKinds.length} identities, found ${tableSources.size}`);
if (tableCount !== requiredMobileTableKinds.length) failures.push(`Expected ${requiredMobileTableKinds.length} tables, found ${tableCount}`);
if (failures.length) throw new Error(failures.join('\n'));

console.log(JSON.stringify({
  ok: true,
  source_files: mobileTableSourceFiles.length,
  table_count: tableCount,
  table_kinds: [...tableSources.keys()].sort()
}, null, 2));
