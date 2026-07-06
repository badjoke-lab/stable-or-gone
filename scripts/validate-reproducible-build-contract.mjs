import crypto from 'node:crypto';
import fs from 'node:fs';

const failures = [];
const check = (condition, message) => {
  if (!condition) failures.push(message);
};

const baseline = JSON.parse(fs.readFileSync('docs/migration/reproducible-build-output-baseline.json', 'utf8'));
const lockBytes = fs.readFileSync('package-lock.json');
const lock = JSON.parse(lockBytes.toString('utf8'));
const lockDigest = crypto.createHash('sha256').update(lockBytes).digest('hex');

check(baseline.status === 'current', 'reproducible-build baseline must be current');
check(lock.lockfileVersion === baseline.runtime.lockfile_version, 'package-lock version mismatch');
check(lockDigest === baseline.runtime.lockfile_sha256, `package-lock sha256 mismatch: ${lockDigest}`);

for (const [name, expected] of Object.entries(baseline.resolved_direct_versions || {})) {
  const actual = lock.packages?.[`node_modules/${name}`]?.version;
  check(actual === expected, `resolved dependency mismatch for ${name}: ${actual} !== ${expected}`);
}

const helper = fs.readFileSync('scripts/lib/build-timestamp.mjs', 'utf8');
const provenance = fs.readFileSync('scripts/generate-current-provenance.mjs', 'utf8');
const deployment = fs.readFileSync('scripts/collect-deployment-taxonomy-migration.mjs', 'utf8');
const capture = fs.readFileSync('scripts/capture-build-output-hashes.mjs', 'utf8');
const compare = fs.readFileSync('scripts/compare-build-output-hashes.mjs', 'utf8');

check(helper.includes('SOG_BUILD_TIMESTAMP'), 'timestamp helper must support SOG_BUILD_TIMESTAMP');
check(helper.includes('SOURCE_DATE_EPOCH'), 'timestamp helper must support SOURCE_DATE_EPOCH');
check(provenance.includes('resolveBuildTimestamp'), 'provenance generator must use shared timestamp helper');
check(deployment.includes('resolveBuildTimestamp'), 'deployment taxonomy generator must use shared timestamp helper');
check(!provenance.includes('fs.writeFileSync(statsPath'), 'provenance build must not overwrite historical registry stats');

for (const outputRoot of baseline.hashed_output_roots || []) {
  check(capture.includes(outputRoot), `capture script missing output root: ${outputRoot}`);
}
check(capture.includes("createHash('sha256')"), 'capture script must use SHA-256');
check(capture.includes('tree_sha256'), 'capture script must emit a tree digest');
check(compare.includes('tree sha256 mismatch'), 'compare script must compare tree digest');
check(compare.includes('output mismatch:'), 'compare script must compare individual files');

const report = {
  schema_version: '1.0',
  audit_id: 'sog_reproducible_build_contract_pr317',
  baseline_id: baseline.baseline_id,
  lockfile_sha256: lockDigest,
  node_version: baseline.runtime.node_version,
  resolved_direct_versions: Object.fromEntries(
    Object.keys(baseline.resolved_direct_versions || {}).map((name) => [name, lock.packages?.[`node_modules/${name}`]?.version || null])
  ),
  failures,
  ok: failures.length === 0
};

fs.mkdirSync('artifacts', { recursive: true });
fs.writeFileSync('artifacts/reproducible-build-contract-audit.json', `${JSON.stringify(report, null, 2)}\n`);

if (failures.length) {
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(JSON.stringify(report, null, 2));
