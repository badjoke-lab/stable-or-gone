import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { isDeepStrictEqual } from 'node:util';

const root = process.cwd();
const snapshotPath = 'scripts/monitoring/baselines/monitoring-baseline-sync-100-assets.json';
const currentPath = 'artifacts/monitoring-baseline-sync-current.json';
const snapshot = JSON.parse(fs.readFileSync(path.join(root, snapshotPath), 'utf8'));
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

fs.mkdirSync(path.join(root, 'artifacts'), { recursive: true });
execFileSync(process.execPath, ['scripts/generate-monitoring-baseline-sync-100-assets.mjs'], {
  cwd: root,
  stdio: ['ignore', 'pipe', 'inherit'],
  env: {
    ...process.env,
    SOG_MONITORING_SYNC_OUTPUT: currentPath,
  },
});

const current = JSON.parse(fs.readFileSync(path.join(root, currentPath), 'utf8'));

check(snapshot.schema_version === '1.0', 'sync snapshot schema version must be 1.0');
check(snapshot.sync_kind === 'monitoring_baseline_sync_observation', 'sync snapshot kind mismatch');
check(snapshot.checkpoint_id === 'sog_audited_100_asset_checkpoint_pr318_2026_07_06', 'sync checkpoint ID mismatch');
check(snapshot.normalization_version === 'sog_official_source_normalization_v2', 'sync normalization version mismatch');
check(isDeepStrictEqual(snapshot, current), 'current monitoring synchronization observation differs from binding snapshot');

check(snapshot.canonical_counts?.stablecoins === 100, 'sync snapshot must protect 100 stable assets');
check(snapshot.canonical_counts?.organizations === 94, 'sync snapshot must protect 94 organizations');
check(snapshot.canonical_counts?.relationships === 110, 'sync snapshot must protect 110 relationships');
check(snapshot.source_baseline_sync?.source_count === 24, 'sync snapshot must protect 24 sources');
check(snapshot.source_baseline_sync?.baseline_count === 24, 'sync snapshot must protect 24 baseline rows');
check(snapshot.source_baseline_sync?.source_baseline_id_parity === true, 'source/baseline ID parity must be true');
check(snapshot.source_baseline_sync?.pending_initial_acceptance === 24, 'all 24 baselines must remain pending');
check(snapshot.source_baseline_sync?.accepted === 0, 'accepted baseline count must remain zero');
check(snapshot.source_baseline_sync?.missing === 0, 'missing baseline count must remain zero');

check(snapshot.coverage?.registered_asset_reach_count === 16, 'registered asset reach must remain 16');
check(snapshot.coverage?.uncovered_asset_count === 84, 'uncovered asset count must remain 84');
check(snapshot.coverage?.covered_organization_count === 12, 'covered organization count must remain 12');
check(snapshot.coverage?.accepted_asset_reach_count === 0, 'accepted asset reach must remain zero');
check(snapshot.coverage?.multi_family_asset_count === 7, 'multi-family asset count must remain 7');

check(isDeepStrictEqual(snapshot.source_family_counts, {
  reserve_assurance: 9,
  redemption_terms: 6,
  issuer_lifecycle: 5,
  regulatory: 5,
}), 'source-family counts differ from reviewed synchronization boundary');
check(isDeepStrictEqual(snapshot.stablecoin_family_counts, {
  reserve_assurance: 11,
  redemption_terms: 7,
  issuer_lifecycle: 5,
  regulatory: 5,
}), 'asset-family reach differs from reviewed synchronization boundary');

for (const field of [
  'asset_sync_sha256',
  'organization_sync_sha256',
  'source_baseline_sync_sha256',
  'uncovered_asset_ids_sha256',
  'source_allowlist_sha256',
  'baseline_file_sha256',
]) {
  check(/^[a-f0-9]{64}$/.test(snapshot[field] ?? ''), `${field} must be a lowercase SHA-256 digest`);
}

const expectedPolicy = {
  human_review_required: true,
  monitoring_write_allowed: false,
  canonical_evidence: false,
  public_output: false,
  automatic_pull_request: false,
  production_publication: false,
  network_access_used: false,
  canonical_action: 'none',
};
check(isDeepStrictEqual(snapshot.policy, expectedPolicy), 'monitoring synchronization policy is unsafe or changed');

if (failures.length) {
  console.error('100-asset monitoring baseline synchronization validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  checkpoint_id: snapshot.checkpoint_id,
  canonical_counts: snapshot.canonical_counts,
  source_baseline_sync: snapshot.source_baseline_sync,
  coverage: snapshot.coverage,
  asset_sync_sha256: snapshot.asset_sync_sha256,
  source_baseline_sync_sha256: snapshot.source_baseline_sync_sha256,
}, null, 2));
