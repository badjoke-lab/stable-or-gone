import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { isDeepStrictEqual } from 'node:util';

const root = process.cwd();
const snapshotPath = 'scripts/monitoring/baselines/monitoring-lifecycle-regulatory-market-access-expansion-100-assets.json';
const currentPath = 'artifacts/monitoring-lifecycle-regulatory-market-access-current.json';
const snapshot = JSON.parse(fs.readFileSync(path.join(root, snapshotPath), 'utf8'));
const checkpoint = JSON.parse(fs.readFileSync(path.join(root, 'docs/migration/current-canonical-checkpoint.json'), 'utf8'));
const sources = JSON.parse(fs.readFileSync(path.join(root, 'scripts/monitoring/sources/official-sources.json'), 'utf8'));
const baselineSet = JSON.parse(fs.readFileSync(path.join(root, 'scripts/monitoring/baselines/official-source-baselines.json'), 'utf8'));
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

fs.mkdirSync(path.join(root, 'artifacts'), { recursive: true });
execFileSync(process.execPath, ['scripts/generate-monitoring-baseline-sync-100-assets.mjs'], {
  cwd: root,
  stdio: ['ignore', 'pipe', 'inherit'],
  env: { ...process.env, SOG_MONITORING_SYNC_OUTPUT: currentPath },
});
const current = JSON.parse(fs.readFileSync(path.join(root, currentPath), 'utf8'));

check(snapshot.schema_version === '1.1', 'PR #323 historical snapshot schema version changed');
check(snapshot.checkpoint_id === 'sog_audited_100_asset_checkpoint_pr318_2026_07_06', 'PR #323 historical checkpoint ID changed');
check(isDeepStrictEqual(snapshot.canonical_counts, {
  stablecoins: 100,
  organizations: 94,
  relationships: 110,
}), 'PR #323 historical canonical counts changed');
check(snapshot.coverage?.registered_asset_reach_count === 23, 'historical registered asset reach must be 23');
check(snapshot.coverage?.uncovered_asset_count === 77, 'historical uncovered asset count must be 77');
check(snapshot.coverage?.covered_organization_count === 18, 'historical covered organization count must be 18');
check(snapshot.coverage?.accepted_asset_reach_count === 0, 'historical accepted asset reach must remain zero');
check(snapshot.coverage?.multi_family_asset_count === 17, 'historical multi-family asset count must be 17');

const expectedCurrent = checkpoint.expected_counts ?? {};
check(current.checkpoint_id === checkpoint.checkpoint_id, `current observation checkpoint must be ${checkpoint.checkpoint_id}`);
check(current.canonical_counts?.stablecoins === checkpoint.asset_count, `current observation stablecoin count must be ${checkpoint.asset_count}`);
check(current.canonical_counts?.organizations === expectedCurrent.organizations, `current observation organization count must be ${expectedCurrent.organizations}`);
check(current.canonical_counts?.relationships === expectedCurrent.relationships, `current observation relationship count must be ${expectedCurrent.relationships}`);
check(current.coverage?.registered_asset_reach_count === 23, 'current registered asset reach must remain 23 because new subjects are noncanonical');
check(current.coverage?.uncovered_asset_count === checkpoint.asset_count - 23, `current uncovered asset count must be ${checkpoint.asset_count - 23}`);
check(current.coverage?.covered_organization_count === 18, 'current covered organization count must remain 18');
check(current.coverage?.accepted_asset_reach_count === 0, 'current accepted asset reach must remain zero');
check(current.coverage?.multi_family_asset_count === 17, 'current multi-family asset count must remain 17');

check(snapshot.source_baseline_sync?.source_count === 39, 'PR #323 historical source count must be 39');
check(snapshot.source_baseline_sync?.baseline_count === 39, 'PR #323 historical baseline count must be 39');
check(snapshot.source_baseline_sync?.source_baseline_id_parity === true, 'PR #323 historical source/baseline ID parity must be true');
check(snapshot.source_baseline_sync?.pending_initial_acceptance === 39, 'all 39 historical baselines must remain pending');
check(snapshot.source_baseline_sync?.accepted === 0, 'historical accepted baseline count must remain zero');
check(snapshot.source_baseline_sync?.missing === 0, 'historical missing baseline count must remain zero');
check(current.source_baseline_sync?.source_count === 41, 'current source count must be 41');
check(current.source_baseline_sync?.baseline_count === 41, 'current baseline count must be 41');
check(current.source_baseline_sync?.source_baseline_id_parity === true, 'current source/baseline ID parity must be true');
check(current.source_baseline_sync?.pending_initial_acceptance === 41, 'all 41 current baselines must remain pending');
check(current.source_baseline_sync?.accepted === 0, 'current accepted baseline count must remain zero');
check(current.source_baseline_sync?.missing === 0, 'current missing baseline count must remain zero');

const historicalScopedCoverage = {
  platform_policy_source_count: 3,
  platform_service_state_source_count: 1,
  regulatory_register_source_count: 1,
  market_access_schema_capable_source_count: 5,
  scoped_platform_count: 4,
  scoped_region_count: 4,
};
const currentScopedCoverage = {
  platform_policy_source_count: 3,
  platform_service_state_source_count: 2,
  regulatory_register_source_count: 1,
  market_access_schema_capable_source_count: 7,
  scoped_platform_count: 6,
  scoped_region_count: 6,
};
check(isDeepStrictEqual(snapshot.scoped_coverage, historicalScopedCoverage), 'PR #323 historical scoped coverage summary mismatch');
check(isDeepStrictEqual(current.scoped_coverage, currentScopedCoverage), 'current scoped coverage summary mismatch');

const historicalSourceFamilyCounts = {
  reserve_assurance: 14,
  redemption_terms: 11,
  issuer_lifecycle: 7,
  regulatory: 9,
  platform_policy: 3,
  platform_service_state: 1,
  regulatory_register: 1,
};
const currentSourceFamilyCounts = {
  reserve_assurance: 15,
  redemption_terms: 12,
  issuer_lifecycle: 9,
  regulatory: 9,
  platform_policy: 3,
  platform_service_state: 2,
  regulatory_register: 1,
};
const expectedStablecoinFamilyCounts = {
  reserve_assurance: 16,
  redemption_terms: 12,
  issuer_lifecycle: 7,
  regulatory: 8,
  platform_policy: 12,
  platform_service_state: 0,
  regulatory_register: 0,
};
check(isDeepStrictEqual(snapshot.source_family_counts, historicalSourceFamilyCounts), 'PR #323 historical source-family counts mismatch');
check(isDeepStrictEqual(snapshot.stablecoin_family_counts, expectedStablecoinFamilyCounts), 'PR #323 historical asset-family reach mismatch');
check(isDeepStrictEqual(current.source_family_counts, currentSourceFamilyCounts), 'current source-family counts mismatch');
check(isDeepStrictEqual(current.stablecoin_family_counts, expectedStablecoinFamilyCounts), 'current asset-family reach mismatch');

const approvedHistoricalSourceIds = [
  'ripple-eu-emi-license',
  'ripple-preliminary-mica-casp',
  'banking-circle-euri-launch',
  'sgforge-eurcv-stablecoin-elevation',
  'binance-eea-stablecoin-policy',
  'kraken-eea-stablecoin-offerings',
  'bitstamp-europe-mica-assets',
  'gemini-eea-account-closure',
  'esma-mica-interim-register-hub',
];
const sourceById = new Map(sources.map((row) => [row.source_id, row]));
const baselineById = new Map((baselineSet.baselines ?? []).map((row) => [row.source_id, row]));
for (const sourceId of [...approvedHistoricalSourceIds, 'open-standard-open-usd', 'visa-stablecoin-platform']) {
  const source = sourceById.get(sourceId);
  const baseline = baselineById.get(sourceId);
  check(Boolean(source), `${sourceId}: approved source missing`);
  check(Boolean(baseline), `${sourceId}: matching baseline missing`);
  if (baseline) {
    check(baseline.status === 'pending_initial_acceptance', `${sourceId}: baseline must remain pending`);
    for (const field of ['accepted_final_url','body_sha256','normalized_content_sha256','content_type','etag','last_modified','accepted_observed_at','accepted_repository_commit','accepted_review_reference']) {
      check(baseline[field] === null, `${sourceId}: ${field} must remain null`);
    }
  }
}

check(sourceById.get('binance-eea-stablecoin-policy')?.monitoring_scope?.region_scope === 'European Economic Area', 'Binance EEA scope changed');
check(sourceById.get('bitstamp-europe-mica-assets')?.monitoring_scope?.platform_legal_entity === 'Bitstamp Europe S.A.', 'Bitstamp legal entity scope changed');
check(sourceById.get('gemini-eea-account-closure')?.affected_stablecoin_ids?.length === 0, 'Gemini service-state source must not gain fake asset targets');
check(sourceById.get('esma-mica-interim-register-hub')?.affected_stablecoin_ids?.length === 0, 'ESMA register source must not gain fake asset targets');
check(sourceById.get('esma-mica-interim-register-hub')?.affected_organization_ids?.length === 0, 'ESMA register source must not gain fake organization targets');
check(sourceById.get('open-standard-open-usd')?.monitoring_scope?.canonical_record === false, 'Open USD monitoring subject became canonical');
check(sourceById.get('visa-stablecoin-platform')?.monitoring_scope?.canonical_record === false, 'VSP monitoring subject became canonical');

for (const field of [
  'asset_sync_sha256',
  'organization_sync_sha256',
  'source_baseline_sync_sha256',
  'monitoring_scope_sha256',
  'uncovered_asset_ids_sha256',
  'source_allowlist_sha256',
  'baseline_file_sha256',
]) {
  check(/^[a-f0-9]{64}$/.test(snapshot[field] ?? ''), `historical ${field} must be a lowercase SHA-256 digest`);
  check(/^[a-f0-9]{64}$/.test(current[field] ?? ''), `current ${field} must be a lowercase SHA-256 digest`);
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
check(isDeepStrictEqual(snapshot.policy, expectedPolicy), 'PR #323 historical safety policy changed');
check(isDeepStrictEqual(current.policy, expectedPolicy), 'current safety policy changed');

if (failures.length) {
  console.error('Current lifecycle/regulatory/market-access monitoring validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  historical_checkpoint_id: snapshot.checkpoint_id,
  current_checkpoint_id: current.checkpoint_id,
  historical_coverage: snapshot.coverage,
  current_coverage: current.coverage,
  scoped_coverage: current.scoped_coverage,
  source_family_counts: current.source_family_counts,
  monitoring_scope_sha256: current.monitoring_scope_sha256,
}, null, 2));
