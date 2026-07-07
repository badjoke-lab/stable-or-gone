import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { isDeepStrictEqual } from 'node:util';

const root = process.cwd();
const snapshotPath = 'scripts/monitoring/baselines/monitoring-reserve-redemption-expansion-100-assets.json';
const currentPath = 'artifacts/monitoring-reserve-redemption-expansion-current.json';
const snapshot = JSON.parse(fs.readFileSync(path.join(root, snapshotPath), 'utf8'));
const sources = JSON.parse(fs.readFileSync(path.join(root, 'scripts/monitoring/sources/official-sources.json'), 'utf8'));
const baselineSet = JSON.parse(fs.readFileSync(path.join(root, 'scripts/monitoring/baselines/official-source-baselines.json'), 'utf8'));
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

const expansionSourceIds = [
  'angle-eura-overview',
  'eurite-euri-overview',
  'quantoz-eurq-usdq',
  'sgforge-eurcv-coinvertible',
  'trueusd-transparency',
  'vnx-vchf-overview',
];
const currentWithExpansion = {
  ...current,
  expansion_source_ids: expansionSourceIds,
};
const expectedSources = {
  'trueusd-transparency': {
    url: 'https://tusd.io/transparency',
    stablecoin_ids: ['sog_st_tusd'],
    organization_ids: ['sog_issuer_trueusd'],
    signal_types: ['reserve_update', 'assurance_update'],
    allowed_hosts: ['tusd.io', 'www.tusd.io'],
  },
  'angle-eura-overview': {
    url: 'https://docs.angle.money/',
    stablecoin_ids: ['sog_st_eura'],
    organization_ids: ['sog_issuer_angle'],
    signal_types: ['reserve_update', 'issuance_redemption_update'],
    allowed_hosts: ['docs.angle.money'],
  },
  'sgforge-eurcv-coinvertible': {
    url: 'https://www.sgforge.com/product/coinvertible/',
    stablecoin_ids: ['sog_st_eurcv'],
    organization_ids: ['sog_issuer_sg_forge'],
    signal_types: ['reserve_update', 'issuance_redemption_update'],
    allowed_hosts: ['sgforge.com', 'www.sgforge.com'],
  },
  'eurite-euri-overview': {
    url: 'https://www.eurite.com/',
    stablecoin_ids: ['sog_st_euri'],
    organization_ids: ['sog_issuer_banking_circle'],
    signal_types: ['reserve_update', 'assurance_update', 'issuance_redemption_update'],
    allowed_hosts: ['eurite.com', 'www.eurite.com'],
  },
  'quantoz-eurq-usdq': {
    url: 'https://www.quantoz.com/products/eurq-usdq',
    stablecoin_ids: ['sog_st_eurq'],
    organization_ids: ['sog_issuer_quantoz_payments'],
    signal_types: ['reserve_update', 'issuance_redemption_update'],
    allowed_hosts: ['quantoz.com', 'www.quantoz.com'],
  },
  'vnx-vchf-overview': {
    url: 'https://vnx.li/vchf/',
    stablecoin_ids: ['sog_st_vchf'],
    organization_ids: ['sog_issuer_vnx_commodities'],
    signal_types: ['issuance_redemption_update'],
    allowed_hosts: ['vnx.li', 'www.vnx.li'],
  },
};

check(isDeepStrictEqual(snapshot, currentWithExpansion), 'current monitoring expansion observation differs from binding PR #322 snapshot');
check(snapshot.source_baseline_sync?.source_count === 30, 'expanded source count must be 30');
check(snapshot.source_baseline_sync?.baseline_count === 30, 'expanded baseline count must be 30');
check(snapshot.source_baseline_sync?.source_baseline_id_parity === true, 'source/baseline ID parity must remain true');
check(snapshot.source_baseline_sync?.pending_initial_acceptance === 30, 'all 30 baseline rows must remain pending');
check(snapshot.source_baseline_sync?.accepted === 0, 'accepted baseline count must remain zero');
check(snapshot.source_baseline_sync?.missing === 0, 'missing baseline count must remain zero');
check(snapshot.coverage?.registered_asset_reach_count === 22, 'registered asset reach must be 22');
check(snapshot.coverage?.uncovered_asset_count === 78, 'uncovered asset count must be 78');
check(snapshot.coverage?.covered_organization_count === 18, 'covered organization count must be 18');
check(snapshot.coverage?.accepted_asset_reach_count === 0, 'accepted asset reach must remain zero');
check(snapshot.coverage?.multi_family_asset_count === 11, 'multi-family asset count must be 11');
check(isDeepStrictEqual(snapshot.expansion_source_ids, expansionSourceIds), 'expansion source ID list mismatch');

const sourceById = new Map(sources.map((row) => [row.source_id, row]));
const baselineById = new Map((baselineSet.baselines ?? []).map((row) => [row.source_id, row]));
for (const sourceId of expansionSourceIds) {
  const source = sourceById.get(sourceId);
  const expected = expectedSources[sourceId];
  check(Boolean(source), `${sourceId}: source row missing`);
  if (source) {
    check(source.enabled === true, `${sourceId}: source must be enabled`);
    check(source.url === expected.url, `${sourceId}: URL mismatch`);
    check(isDeepStrictEqual(source.affected_stablecoin_ids, expected.stablecoin_ids), `${sourceId}: stablecoin IDs mismatch`);
    check(isDeepStrictEqual(source.affected_organization_ids, expected.organization_ids), `${sourceId}: organization IDs mismatch`);
    check(isDeepStrictEqual(source.signal_types, expected.signal_types), `${sourceId}: signal types mismatch`);
    check(isDeepStrictEqual(source.allowed_hosts, expected.allowed_hosts), `${sourceId}: allowed hosts mismatch`);
    check((source.signal_types ?? []).every((signal) => ['reserve_update', 'assurance_update', 'issuance_redemption_update'].includes(signal)), `${sourceId}: out-of-scope signal type`);
  }
  const baseline = baselineById.get(sourceId);
  check(Boolean(baseline), `${sourceId}: baseline row missing`);
  if (baseline) {
    check(baseline.source_url === expected.url, `${sourceId}: baseline URL mismatch`);
    check(baseline.status === 'pending_initial_acceptance', `${sourceId}: baseline must remain pending`);
    for (const field of ['accepted_final_url','body_sha256','normalized_content_sha256','content_type','etag','last_modified','accepted_observed_at','accepted_repository_commit','accepted_review_reference']) {
      check(baseline[field] === null, `${sourceId}: ${field} must remain null`);
    }
  }
}

check(snapshot.source_family_counts?.reserve_assurance === 14, 'reserve/assurance source count must be 14');
check(snapshot.source_family_counts?.redemption_terms === 11, 'redemption-terms source count must be 11');
check(snapshot.source_family_counts?.issuer_lifecycle === 5, 'issuer-lifecycle source count must remain 5');
check(snapshot.source_family_counts?.regulatory === 5, 'regulatory source count must remain 5');
check(snapshot.stablecoin_family_counts?.reserve_assurance === 16, 'reserve/assurance asset reach must be 16');
check(snapshot.stablecoin_family_counts?.redemption_terms === 12, 'redemption-terms asset reach must be 12');
check(snapshot.stablecoin_family_counts?.issuer_lifecycle === 5, 'issuer-lifecycle asset reach must remain 5');
check(snapshot.stablecoin_family_counts?.regulatory === 5, 'regulatory asset reach must remain 5');

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
check(isDeepStrictEqual(snapshot.policy, expectedPolicy), 'PR #322 monitoring policy changed or became unsafe');

if (failures.length) {
  console.error('Reserve and redemption source expansion validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  checkpoint_id: snapshot.checkpoint_id,
  source_baseline_sync: snapshot.source_baseline_sync,
  coverage: snapshot.coverage,
  source_family_counts: snapshot.source_family_counts,
  stablecoin_family_counts: snapshot.stablecoin_family_counts,
  expansion_source_ids: snapshot.expansion_source_ids,
}, null, 2));
