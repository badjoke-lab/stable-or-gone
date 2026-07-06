import fs from 'node:fs';

const baseUrl = (process.env.SOG_BASE_URL || 'https://sog.badjoke-lab.com').replace(/\/$/, '');
const checkpoint = JSON.parse(fs.readFileSync('docs/migration/audited-100-asset-canonical-checkpoint.json', 'utf8'));
const response = await fetch(`${baseUrl}/version.json`, {
  headers: { accept: 'application/json', 'cache-control': 'no-cache' },
});
if (!response.ok) throw new Error(`version.json returned HTTP ${response.status}`);
const version = await response.json();
const build = version.build;

const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
check(build?.canonical_data_hash === `sha256:${checkpoint.canonical_content_sha256}`, 'production canonical data hash mismatch');
check(build?.canonical_file_count === checkpoint.canonical_file_count, 'production canonical file count mismatch');

for (const [name, expected] of Object.entries(checkpoint.release_expected_counts.v2)) {
  check(build?.canonical_record_counts?.[name] === expected, `production canonical count mismatch: ${name}`);
}
for (const [name, expected] of Object.entries(checkpoint.release_expected_counts.routes)) {
  check(build?.route_counts?.[name] === expected, `production route count mismatch: ${name}`);
}

if (failures.length) {
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  checkpoint_source_commit: checkpoint.source_commit,
  production_commit: build.commit,
  canonical_data_hash: build.canonical_data_hash,
  canonical_file_count: build.canonical_file_count,
  canonical_record_counts: build.canonical_record_counts,
  route_counts: build.route_counts,
}, null, 2));
