import fs from 'node:fs';

const historical = JSON.parse(fs.readFileSync('scripts/monitoring/baselines/monitoring-baseline-sync-100-assets.json', 'utf8'));
const current = JSON.parse(fs.readFileSync('scripts/monitoring/baselines/monitoring-reserve-redemption-expansion-100-assets.json', 'utf8'));
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

expect(historical.checkpoint_id === 'sog_audited_100_asset_checkpoint_pr318_2026_07_06', 'historical monitoring checkpoint ID mismatch');
expect(historical.canonical_counts?.stablecoins === 100, 'historical monitoring boundary must protect 100 assets');
expect(historical.canonical_counts?.organizations === 94, 'historical monitoring boundary must protect 94 organizations');
expect(historical.source_baseline_sync?.source_count === 24, 'historical PR #309/#321 source count must remain 24');
expect(historical.source_baseline_sync?.baseline_count === 24, 'historical PR #309/#321 baseline count must remain 24');
expect(historical.source_baseline_sync?.pending_initial_acceptance === 24, 'historical PR #309/#321 pending count must remain 24');
expect(historical.source_baseline_sync?.accepted === 0, 'historical accepted count must remain zero');
expect(historical.coverage?.registered_asset_reach_count === 16, 'historical registered reach must remain 16');
expect(historical.coverage?.uncovered_asset_count === 84, 'historical uncovered queue must remain 84');
expect(historical.coverage?.covered_organization_count === 12, 'historical covered organization count must remain 12');
expect(historical.coverage?.accepted_asset_reach_count === 0, 'historical accepted asset reach must remain zero');
expect(historical.source_family_counts?.reserve_assurance === 9, 'historical reserve/assurance source count must remain 9');
expect(historical.stablecoin_family_counts?.reserve_assurance === 11, 'historical reserve/assurance asset reach must remain 11');
expect(historical.source_family_counts?.redemption_terms === 6, 'historical redemption source count must remain 6');
expect(historical.stablecoin_family_counts?.redemption_terms === 7, 'historical redemption asset reach must remain 7');
expect(historical.source_family_counts?.issuer_lifecycle === 5, 'historical lifecycle source count must remain 5');
expect(historical.stablecoin_family_counts?.issuer_lifecycle === 5, 'historical lifecycle asset reach must remain 5');
expect(historical.source_family_counts?.regulatory === 5, 'historical regulatory source count must remain 5');
expect(historical.stablecoin_family_counts?.regulatory === 5, 'historical regulatory asset reach must remain 5');
expect(historical.policy?.canonical_action === 'none', 'historical audit must not authorize canonical action');
expect(historical.policy?.network_access_used === false, 'historical audit must remain offline');
expect(historical.policy?.public_output === false, 'historical audit output must remain private');
expect(historical.policy?.production_publication === false, 'historical audit must not publish');

expect(current.source_family_counts?.issuer_lifecycle === historical.source_family_counts?.issuer_lifecycle, 'PR #322 must not expand lifecycle family');
expect(current.source_family_counts?.regulatory === historical.source_family_counts?.regulatory, 'PR #322 must not expand regulatory family');
expect(current.source_baseline_sync?.accepted === 0, 'current accepted baseline count must remain zero');
expect(current.coverage?.accepted_asset_reach_count === 0, 'current accepted asset reach must remain zero');

if (failures.length) {
  console.error('Historical monitoring coverage recalculation validation failed:');
  failures.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}

console.log('Historical PR #309/#321 monitoring coverage checkpoint remains intact: 24 sources reached 16/100 assets with zero accepted baselines; PR #322 expands only reserve/redemption reach in a separate current snapshot.');
