import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const failures = [];
const allowed = new Set(['native','issuer_native','canonical_bridge','third_party_bridge','wrapped','synthetic','legacy','unknown']);
const read = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));

const baseline = read('docs/migration/registry-v2-baseline.json');
const view = read('docs/migration/registry-v3-view-67.json');
const rows = baseline.data_groups.deployments.flatMap((file) => read(file));
const ids = new Set();

for (const row of rows) {
  if (!row.id) failures.push('row without id');
  else if (ids.has(row.id)) failures.push(`duplicate id: ${row.id}`);
  else ids.add(row.id);

  const value = row.canonicality ?? view.default;
  if (!allowed.has(value)) failures.push(`${row.id}: invalid canonicality ${value}`);
  if (row.origin_deployment_id && row.origin_deployment_id === row.id) failures.push(`${row.id}: self origin`);
}

for (const row of rows) {
  if (row.origin_deployment_id && !ids.has(row.origin_deployment_id)) failures.push(`${row.id}: missing origin ${row.origin_deployment_id}`);
}

const expected = baseline.minimum_counts.deployments;
if (view.source !== 'registry-v2') failures.push('invalid source');
if (view.default !== 'unknown') failures.push('default must be unknown');
if (view.minimum_count !== expected) failures.push(`minimum_count must be ${expected}`);
if (rows.length < expected) failures.push(`expected at least ${expected}, found ${rows.length}`);

if (failures.length) {
  console.error('Registry v3 chain view validation failed');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

const explicit = rows.filter((row) => row.canonicality).length;
console.log(`Registry v3 chain view passed: ${rows.length} rows; ${explicit} explicit; ${rows.length - explicit} default unknown.`);
