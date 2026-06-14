import fs from 'node:fs';

const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const base = read('docs/migration/registry-v2-baseline.json');
const view = read('docs/migration/registry-v3-view-67.json');
const key = Object.keys(base.data_groups).at(-1);
const rows = base.data_groups[key].flatMap((file) => read(file));
const ids = rows.map((row) => row.id);
const unique = new Set(ids);

if (rows.length !== view.minimum_count) throw new Error(`expected ${view.minimum_count}, found ${rows.length}`);
if (unique.size !== rows.length) throw new Error('duplicate ids');
if (view.default !== 'unknown') throw new Error('invalid default');

console.log(`Registry v3 view passed: ${rows.length} records.`);
