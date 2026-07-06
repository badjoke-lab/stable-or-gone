import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { isDeepStrictEqual } from 'node:util';

const root = process.cwd();
const checkpointPath = 'docs/migration/audited-100-asset-canonical-checkpoint.json';
const currentPath = 'artifacts/audited-100-checkpoint-current.json';
const reportPath = 'artifacts/audited-100-checkpoint-validation.json';
const checkpoint = JSON.parse(fs.readFileSync(path.join(root, checkpointPath), 'utf8'));
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

fs.mkdirSync(path.join(root, 'artifacts'), { recursive: true });
execFileSync(process.execPath, ['scripts/generate-audited-100-checkpoint.mjs'], {
  cwd: root,
  stdio: ['ignore', 'pipe', 'inherit'],
  env: {
    ...process.env,
    SOG_CHECKPOINT_SOURCE_COMMIT: checkpoint.source_commit,
    SOG_CHECKPOINT_OUTPUT: currentPath,
  },
});

const current = JSON.parse(fs.readFileSync(path.join(root, currentPath), 'utf8'));
const releaseBaseline = JSON.parse(fs.readFileSync(path.join(root, 'docs/migration/registry-release-integrity-baseline.json'), 'utf8'));
const reproducibleBaseline = JSON.parse(fs.readFileSync(path.join(root, 'docs/migration/reproducible-build-output-baseline.json'), 'utf8'));

check(checkpoint.schema_version === '1.0', 'checkpoint schema version must be 1.0');
check(checkpoint.status === 'audited', 'checkpoint status must be audited');
check(/^9a106f0938e6323de833c941d6ae863050f1f03b$/.test(checkpoint.source_commit), 'checkpoint source commit mismatch');
check(checkpoint.release_integrity_baseline_id === releaseBaseline.baseline_id, 'release-integrity baseline ID mismatch');
check(checkpoint.reproducible_build_baseline_id === reproducibleBaseline.baseline_id, 'reproducible-build baseline ID mismatch');
check(checkpoint.package_lock_sha256 === reproducibleBaseline.runtime?.lockfile_sha256, 'checkpoint package-lock digest differs from reproducible-build baseline');

for (const key of [
  'source_commit',
  'release_integrity_baseline_id',
  'reproducible_build_baseline_id',
  'canonical_file_count',
  'canonical_content_sha256',
  'canonical_identity_sha256',
  'package_lock_sha256',
  'package_json_sha256',
  'v2_groups',
  'v3_groups',
  'compatibility_files',
  'release_expected_counts',
  'reproducibility_checkpoint',
]) {
  check(isDeepStrictEqual(checkpoint[key], current[key]), `checkpoint field mismatch: ${key}`);
}

check(checkpoint.release_expected_counts?.v2?.stablecoins === 100, 'checkpoint must protect 100 stable assets');
check(checkpoint.release_expected_counts?.v2?.events === 172, 'checkpoint event count mismatch');
check(checkpoint.release_expected_counts?.v2?.evidence === 502, 'checkpoint evidence count mismatch');
check(checkpoint.release_expected_counts?.routes?.total_detail === 366, 'checkpoint detail route count mismatch');
check(checkpoint.reproducibility_checkpoint?.reproducible === true, 'checkpoint reproducibility result must be true');
check(checkpoint.reproducibility_checkpoint?.failures === 0, 'checkpoint reproducibility failures must be zero');
check(checkpoint.production_verification?.expected_commit === checkpoint.source_commit, 'production expected commit must equal checkpoint source commit');
check(checkpoint.production_verification?.command === 'npm run check:production', 'production verification command mismatch');
check(checkpoint.production_verification?.requires_commit_match === true, 'production commit match must be required');
check(checkpoint.production_verification?.requires_provenance_check === true, 'production provenance check must be required');
check(checkpoint.production_verification?.requires_exact_output_parity === true, 'production output parity must be required');

for (const [name, expected] of Object.entries(releaseBaseline.expected_v2_counts ?? {})) {
  check(checkpoint.release_expected_counts?.v2?.[name] === expected, `release/checkpoint v2 count mismatch: ${name}`);
  check(checkpoint.v2_groups?.[name]?.record_count === expected, `checkpoint v2 group count mismatch: ${name}`);
}
for (const [name, expected] of Object.entries(releaseBaseline.expected_v3_counts ?? {})) {
  if (name === 'deployment_view') continue;
  check(checkpoint.release_expected_counts?.v3?.[name] === expected, `release/checkpoint v3 count mismatch: ${name}`);
  check(checkpoint.v3_groups?.[name]?.record_count === expected, `checkpoint v3 group count mismatch: ${name}`);
}

const report = {
  schema_version: '1.0',
  audit_id: 'sog_audited_100_asset_checkpoint_pr318_validation',
  checkpoint_id: checkpoint.checkpoint_id,
  source_commit: checkpoint.source_commit,
  canonical_file_count: checkpoint.canonical_file_count,
  canonical_content_sha256: checkpoint.canonical_content_sha256,
  canonical_identity_sha256: checkpoint.canonical_identity_sha256,
  stablecoins: checkpoint.v2_groups?.stablecoins?.record_count,
  organizations: checkpoint.v2_groups?.organizations?.record_count,
  events: checkpoint.v2_groups?.events?.record_count,
  evidence: checkpoint.v2_groups?.evidence?.record_count,
  detail_routes: checkpoint.release_expected_counts?.routes?.total_detail,
  reproducible: checkpoint.reproducibility_checkpoint?.reproducible,
  failures,
  ok: failures.length === 0,
};

fs.writeFileSync(path.join(root, reportPath), `${JSON.stringify(report, null, 2)}\n`);

if (failures.length) {
  console.error('Audited 100-asset canonical checkpoint validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(JSON.stringify(report, null, 2));
