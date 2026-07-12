import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const checkpointPath = 'docs/migration/audited-100-asset-canonical-checkpoint.json';
const reportPath = 'artifacts/audited-100-checkpoint-validation.json';
const checkpoint = JSON.parse(fs.readFileSync(path.join(root, checkpointPath), 'utf8'));
const currentCheckpoint = JSON.parse(fs.readFileSync(path.join(root, 'docs/migration/current-canonical-checkpoint.json'), 'utf8'));
const currentHistoryCheckpointPath = path.join(root, 'docs/migration/current-stats-history-checkpoint.json');
const currentHistoryCheckpoint = fs.existsSync(currentHistoryCheckpointPath)
  ? JSON.parse(fs.readFileSync(currentHistoryCheckpointPath, 'utf8'))
  : null;
const history = JSON.parse(fs.readFileSync(path.join(root, 'data/stats-history.json'), 'utf8'));
const reproducibleBaseline = JSON.parse(fs.readFileSync(path.join(root, 'docs/migration/reproducible-build-output-baseline.json'), 'utf8'));
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const sha256 = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');
const isSha256 = (value) => /^[a-f0-9]{64}$/.test(value ?? '');

fs.mkdirSync(path.join(root, 'artifacts'), { recursive: true });

check(checkpoint.schema_version === '1.0', 'checkpoint schema version must be 1.0');
check(checkpoint.status === 'audited', 'checkpoint status must be audited');
check(checkpoint.checkpoint_id === 'sog_audited_100_asset_checkpoint_pr318_2026_07_06', 'audited checkpoint ID mismatch');
check(checkpoint.source_commit === '9a106f0938e6323de833c941d6ae863050f1f03b', 'checkpoint source commit mismatch');
check(checkpoint.release_integrity_baseline_id === 'sog_release_integrity_pr316_2026_07_06', 'historical release-integrity baseline ID mismatch');
check(checkpoint.reproducible_build_baseline_id === reproducibleBaseline.baseline_id, 'reproducible-build baseline ID mismatch');
check(checkpoint.package_lock_sha256 === reproducibleBaseline.runtime?.lockfile_sha256, 'checkpoint package-lock digest differs from reproducible-build baseline');
check(checkpoint.package_lock_sha256 === sha256(fs.readFileSync(path.join(root, 'package-lock.json'))), 'package-lock changed from audited checkpoint');
check(checkpoint.package_json_sha256 === sha256(fs.readFileSync(path.join(root, 'package.json'))), 'package.json changed from audited checkpoint');

check(Number.isInteger(checkpoint.canonical_file_count) && checkpoint.canonical_file_count > 0, 'checkpoint canonical file count invalid');
check(isSha256(checkpoint.canonical_content_sha256), 'checkpoint canonical content digest invalid');
check(isSha256(checkpoint.canonical_identity_sha256), 'checkpoint canonical identity digest invalid');

const expectedV2 = {
  stablecoins: 100,
  organizations: 94,
  relationships: 110,
  classifications: 100,
  profiles: 100,
  events: 172,
  event_details: 172,
  evidence: 502,
  evidence_relations: 502,
  reserve_reports: 108,
  known_unknowns: 289,
  regulatory_notes: 9,
  deployments: 140
};
const expectedV3 = {
  legal_profiles: 100,
  stable_asset_relationships: 4,
  reserve_components: 133,
  income_profiles: 100
};

for (const [name, expected] of Object.entries(expectedV2)) {
  check(checkpoint.release_expected_counts?.v2?.[name] === expected, `audited release v2 count mismatch: ${name}`);
  check(checkpoint.v2_groups?.[name]?.record_count === expected, `audited v2 group count mismatch: ${name}`);
  check(isSha256(checkpoint.v2_groups?.[name]?.identity_sha256), `audited v2 identity digest invalid: ${name}`);
  check(isSha256(checkpoint.v2_groups?.[name]?.content_sha256), `audited v2 content digest invalid: ${name}`);
}
for (const [name, expected] of Object.entries(expectedV3)) {
  check(checkpoint.release_expected_counts?.v3?.[name] === expected, `audited release v3 count mismatch: ${name}`);
  check(checkpoint.v3_groups?.[name]?.record_count === expected, `audited v3 group count mismatch: ${name}`);
  check(isSha256(checkpoint.v3_groups?.[name]?.identity_sha256), `audited v3 identity digest invalid: ${name}`);
  check(isSha256(checkpoint.v3_groups?.[name]?.content_sha256), `audited v3 content digest invalid: ${name}`);
}
check(checkpoint.release_expected_counts?.v3?.deployment_view === 140, 'audited deployment view count mismatch');
check(checkpoint.release_expected_counts?.routes?.total_detail === 366, 'audited detail route count mismatch');
check(checkpoint.reproducibility_checkpoint?.reproducible === true, 'checkpoint reproducibility result must be true');
check(checkpoint.reproducibility_checkpoint?.failures === 0, 'checkpoint reproducibility failures must be zero');

const production = checkpoint.production_verification ?? {};
check(production.checkpoint_source_commit === checkpoint.source_commit, 'production contract checkpoint source mismatch');
check(production.requires_exact_commit_match === false, 'production exact commit match must remain disabled for later releases');
check(production.allows_later_noncanonical_release === true, 'later release allowance must remain explicit');
check(production.requires_checkpoint_hash_match === true, 'production checkpoint hash match must remain required');
check(production.requires_checkpoint_file_count_match === true, 'production checkpoint file-count match must remain required');
check(production.requires_provenance_check === true, 'production provenance check must remain required');
check(production.requires_exact_output_parity === true, 'production output parity must remain required');

const snapshots = Array.isArray(history.snapshots) ? history.snapshots : [];
const latestSnapshot = snapshots.at(-1) ?? null;
const previousSnapshot = snapshots.length > 1 ? snapshots.at(-2) : null;
const latestHistoryValid = currentHistoryCheckpoint
  ? latestSnapshot?.checkpoint_id === currentHistoryCheckpoint.checkpoint_id
    && latestSnapshot?.canonical_checkpoint_id === currentCheckpoint.checkpoint_id
    && latestSnapshot?.source_checkpoint_id === currentHistoryCheckpoint.source_checkpoint_id
    && currentHistoryCheckpoint.previous_history_checkpoint_id === previousSnapshot?.checkpoint_id
    && currentHistoryCheckpoint.canonical_checkpoint_id === currentCheckpoint.checkpoint_id
    && latestSnapshot?.checkpoint_kind === currentHistoryCheckpoint.checkpoint_kind
    && latestSnapshot?.asset_count === currentCheckpoint.asset_count
  : latestSnapshot?.checkpoint_id === currentCheckpoint.checkpoint_id;
const historicalChainValid = snapshots.length >= 1
  && snapshots[0]?.checkpoint_id === checkpoint.checkpoint_id
  && latestHistoryValid;
check(historicalChainValid, 'statistics history must preserve the audited 100 checkpoint root and bind the latest reviewed history checkpoint to the current canonical checkpoint');
check(currentCheckpoint.asset_count >= 100, 'current checkpoint cannot regress below audited 100 assets');

const report = {
  schema_version: '1.4',
  audit_id: 'sog_audited_100_asset_checkpoint_historical_integrity_validation',
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
  current_checkpoint_id: currentCheckpoint.checkpoint_id,
  current_asset_count: currentCheckpoint.asset_count,
  current_predecessor_checkpoint_id: currentCheckpoint.previous_checkpoint_id,
  current_history_checkpoint_id: currentHistoryCheckpoint?.checkpoint_id ?? currentCheckpoint.checkpoint_id,
  current_history_predecessor_id: currentHistoryCheckpoint?.previous_history_checkpoint_id ?? null,
  history_snapshot_count: snapshots.length,
  historical_chain_valid: historicalChainValid,
  reproducible: checkpoint.reproducibility_checkpoint?.reproducible,
  failures,
  ok: failures.length === 0
};

fs.writeFileSync(path.join(root, reportPath), `${JSON.stringify(report, null, 2)}\n`);
if (failures.length) {
  console.error('Audited 100-asset historical checkpoint validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log(JSON.stringify(report, null, 2));
