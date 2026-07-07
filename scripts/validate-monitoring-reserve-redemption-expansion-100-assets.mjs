import fs from 'node:fs';
import { isDeepStrictEqual } from 'node:util';

const snapshot = JSON.parse(fs.readFileSync('scripts/monitoring/baselines/monitoring-reserve-redemption-expansion-100-assets.json', 'utf8'));
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

check(snapshot.schema_version === '1.0', 'PR #322 snapshot schema version changed');
check(snapshot.checkpoint_id === 'sog_audited_100_asset_checkpoint_pr318_2026_07_06', 'PR #322 checkpoint ID changed');
check(isDeepStrictEqual(snapshot.canonical_counts, {
  stablecoins: 100,
  organizations: 94,
  relationships: 110,
}), 'PR #322 canonical counts changed');
check(isDeepStrictEqual(snapshot.source_baseline_sync, {
  source_count: 30,
  baseline_count: 30,
  source_baseline_id_parity: true,
  pending_initial_acceptance: 30,
  accepted: 0,
  missing: 0,
}), 'PR #322 source/baseline boundary changed');
check(isDeepStrictEqual(snapshot.coverage, {
  registered_asset_reach_count: 22,
  uncovered_asset_count: 78,
  covered_organization_count: 18,
  accepted_asset_reach_count: 0,
  multi_family_asset_count: 11,
}), 'PR #322 coverage boundary changed');
check(isDeepStrictEqual(snapshot.source_family_counts, {
  reserve_assurance: 14,
  redemption_terms: 11,
  issuer_lifecycle: 5,
  regulatory: 5,
}), 'PR #322 source-family counts changed');
check(isDeepStrictEqual(snapshot.stablecoin_family_counts, {
  reserve_assurance: 16,
  redemption_terms: 12,
  issuer_lifecycle: 5,
  regulatory: 5,
}), 'PR #322 asset-family reach changed');

const expectedDigests = {
  asset_sync_sha256: 'c9005a7ab4ad6a69de03058d19e0c0cf62cd792025788362293aa80caf8f5240',
  organization_sync_sha256: 'd48c0dc2c6fef802b96c35973bdb72a428879ca861d0aec588ccb96f9232b316',
  source_baseline_sync_sha256: '53f13c8d231e69593afd3ebca59c77f2b80702ccab9cc1f5071c19a7bb43c834',
  uncovered_asset_ids_sha256: '3e89c2e87db491290221630512afba56bb75752076e61ebb81d1cdf9188df8c0',
  source_allowlist_sha256: '8b786994a4e6bb4c0cd9ca5aa7585b99f9d454834b1cd4b011583aaa3a718d1e',
  baseline_file_sha256: '8cf544592bfc8e6dd3c9abb124fc994c5b02cd5c811882773a705ca9b2c75917',
};
for (const [field, expected] of Object.entries(expectedDigests)) {
  check(snapshot[field] === expected, `PR #322 historical digest changed: ${field}`);
}

check(isDeepStrictEqual(snapshot.expansion_source_ids, [
  'angle-eura-overview',
  'eurite-euri-overview',
  'quantoz-eurq-usdq',
  'sgforge-eurcv-coinvertible',
  'trueusd-transparency',
  'vnx-vchf-overview',
]), 'PR #322 expansion source ID list changed');

check(isDeepStrictEqual(snapshot.policy, {
  human_review_required: true,
  monitoring_write_allowed: false,
  canonical_evidence: false,
  public_output: false,
  automatic_pull_request: false,
  production_publication: false,
  network_access_used: false,
  canonical_action: 'none',
}), 'PR #322 safety policy changed');

if (failures.length) {
  console.error('Historical PR #322 reserve/redemption expansion validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Historical PR #322 expansion checkpoint valid: 30 pending sources, 22 assets reached, 78 uncovered, zero accepted coverage.');
