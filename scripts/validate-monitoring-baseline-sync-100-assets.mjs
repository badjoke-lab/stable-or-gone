import fs from 'node:fs';
import path from 'node:path';
import { isDeepStrictEqual } from 'node:util';

const root = process.cwd();
const snapshotPath = 'scripts/monitoring/baselines/monitoring-baseline-sync-100-assets.json';
const snapshot = JSON.parse(fs.readFileSync(path.join(root, snapshotPath), 'utf8'));
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

check(snapshot.schema_version === '1.0', 'sync snapshot schema version must be 1.0');
check(snapshot.sync_kind === 'monitoring_baseline_sync_observation', 'sync snapshot kind mismatch');
check(snapshot.checkpoint_id === 'sog_audited_100_asset_checkpoint_pr318_2026_07_06', 'sync checkpoint ID mismatch');
check(snapshot.normalization_version === 'sog_official_source_normalization_v2', 'sync normalization version mismatch');

check(isDeepStrictEqual(snapshot.canonical_counts, {
  stablecoins: 100,
  organizations: 94,
  relationships: 110,
}), 'PR #321 canonical synchronization counts changed');
check(isDeepStrictEqual(snapshot.source_baseline_sync, {
  source_count: 24,
  baseline_count: 24,
  source_baseline_id_parity: true,
  pending_initial_acceptance: 24,
  accepted: 0,
  missing: 0,
}), 'PR #321 source/baseline synchronization boundary changed');
check(isDeepStrictEqual(snapshot.coverage, {
  registered_asset_reach_count: 16,
  uncovered_asset_count: 84,
  covered_organization_count: 12,
  accepted_asset_reach_count: 0,
  multi_family_asset_count: 7,
}), 'PR #321 coverage boundary changed');
check(isDeepStrictEqual(snapshot.source_family_counts, {
  reserve_assurance: 9,
  redemption_terms: 6,
  issuer_lifecycle: 5,
  regulatory: 5,
}), 'PR #321 source-family counts changed');
check(isDeepStrictEqual(snapshot.stablecoin_family_counts, {
  reserve_assurance: 11,
  redemption_terms: 7,
  issuer_lifecycle: 5,
  regulatory: 5,
}), 'PR #321 asset-family reach changed');

const expectedDigests = {
  asset_sync_sha256: 'ed55574e1e0fab657ab401bec4e4e186f7d27866a163f40caed8eeffebf8e033',
  organization_sync_sha256: '6ae5056633e31777a93f10492417e28dca931230690b928afd0196ff84c199db',
  source_baseline_sync_sha256: '47e0891e1a33820d9977fe3a8d4e807c90d3d6fb038cc2f55c09f960cd611909',
  uncovered_asset_ids_sha256: 'a77912ebd0d48f80bd99630679a94e3b2b5e43d266013855b1fac0d99a8531b5',
  source_allowlist_sha256: '76bf64e1ddeb9d90c980bb0ef8a238117e6f82f7b5501e5e5f7a452718e58e9f',
  baseline_file_sha256: 'f9f99a4979b7047684593c7e44bac79e0e3c27794b2b85c8646227b091598f07',
};
for (const [field, expected] of Object.entries(expectedDigests)) {
  check(snapshot[field] === expected, `PR #321 historical digest changed: ${field}`);
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
check(isDeepStrictEqual(snapshot.policy, expectedPolicy), 'PR #321 synchronization policy changed');

if (failures.length) {
  console.error('Historical PR #321 monitoring baseline synchronization validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  historical_checkpoint: 'PR #321',
  checkpoint_id: snapshot.checkpoint_id,
  canonical_counts: snapshot.canonical_counts,
  source_baseline_sync: snapshot.source_baseline_sync,
  coverage: snapshot.coverage,
}, null, 2));
