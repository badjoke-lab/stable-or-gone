import fs from 'node:fs';
import path from 'node:path';

const firstFile = process.env.SOG_REPRO_FIRST || 'artifacts/reproducible-build-first.json';
const secondFile = process.env.SOG_REPRO_SECOND || 'artifacts/reproducible-build-second.json';
const outputFile = process.env.SOG_REPRO_COMPARE || 'artifacts/reproducible-build-compare.json';

const first = JSON.parse(fs.readFileSync(firstFile, 'utf8'));
const second = JSON.parse(fs.readFileSync(secondFile, 'utf8'));
const failures = [];

if (first.tree_sha256 !== second.tree_sha256) failures.push('tree sha256 mismatch');
if (first.file_count !== second.file_count) failures.push('file count mismatch');
if (first.total_bytes !== second.total_bytes) failures.push('total byte count mismatch');

const allFiles = [...new Set([...Object.keys(first.files ?? {}), ...Object.keys(second.files ?? {})])].sort();
for (const file of allFiles) {
  const a = first.files?.[file];
  const b = second.files?.[file];
  if (!a) failures.push(`missing from first build: ${file}`);
  else if (!b) failures.push(`missing from second build: ${file}`);
  else if (a.sha256 !== b.sha256 || a.bytes !== b.bytes) failures.push(`output mismatch: ${file}`);
}

const report = {
  schema_version: '1.0',
  audit_id: 'sog_reproducible_build_pr317_compare',
  first_tree_sha256: first.tree_sha256,
  second_tree_sha256: second.tree_sha256,
  file_count: second.file_count,
  total_bytes: second.total_bytes,
  failures,
  reproducible: failures.length === 0
};

fs.mkdirSync(path.dirname(outputFile), { recursive: true });
fs.writeFileSync(outputFile, `${JSON.stringify(report, null, 2)}\n`);

if (failures.length) {
  console.error('Reproducible build audit failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(JSON.stringify(report, null, 2));
