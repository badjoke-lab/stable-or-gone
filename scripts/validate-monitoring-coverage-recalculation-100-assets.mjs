import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const output = 'data/generated/monitoring-coverage-recalculation-100-assets.json';
execFileSync(process.execPath, ['scripts/audit-monitoring-coverage-100-assets.mjs'], { stdio: 'inherit', env: process.env });
const report = JSON.parse(fs.readFileSync(output, 'utf8'));
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

expect(report.audit_id === 'sog_monitoring_coverage_recalculation_100_assets_pr309', `unexpected audit id ${report.audit_id}`);
expect(report.summary?.canonical_stablecoin_count === 100, `expected 100 canonical assets, got ${report.summary?.canonical_stablecoin_count}`);
expect(report.summary?.canonical_organization_count === 94, `expected 94 organizations, got ${report.summary?.canonical_organization_count}`);
expect(report.summary?.registered_source_count === 24, `expected 24 registered sources, got ${report.summary?.registered_source_count}`);
expect(report.summary?.registered_asset_reach_count === 16, `expected registered reach of 16 assets, got ${report.summary?.registered_asset_reach_count}`);
expect(report.summary?.uncovered_asset_count === 84, `expected 84 uncovered assets, got ${report.summary?.uncovered_asset_count}`);
expect(report.summary?.covered_organization_count === 12, `expected 12 covered organizations, got ${report.summary?.covered_organization_count}`);
expect(report.summary?.accepted_source_count === 0, 'accepted source count must remain zero');
expect(report.summary?.accepted_asset_reach_count === 0, 'accepted asset reach must remain zero');
expect(report.summary?.pending_initial_acceptance_count === 24, 'all 24 baselines must remain pending initial acceptance');
expect(report.summary?.market_access_schema_capable_source_count === 0, 'current source configuration must not claim market-access schema coverage');

expect(report.coverage_domains?.issuer_protocol?.source_count === 19, 'issuer/protocol source count changed unexpectedly');
expect(report.coverage_domains?.issuer_protocol?.stablecoin_count === 15, 'issuer/protocol asset reach changed unexpectedly');
expect(report.coverage_domains?.reserve_assurance?.source_count === 9, 'reserve/assurance source count changed unexpectedly');
expect(report.coverage_domains?.reserve_assurance?.stablecoin_count === 11, 'reserve/assurance asset reach changed unexpectedly');
expect(report.coverage_domains?.redemption_mint_terms?.source_count === 5, 'redemption/mint source count changed unexpectedly');
expect(report.coverage_domains?.redemption_mint_terms?.stablecoin_count === 7, 'redemption/mint asset reach changed unexpectedly');
expect(report.coverage_domains?.issuer_lifecycle?.source_count === 5, 'lifecycle source count changed unexpectedly');
expect(report.coverage_domains?.issuer_lifecycle?.stablecoin_count === 5, 'lifecycle asset reach changed unexpectedly');
expect(report.coverage_domains?.regulatory_action_guidance?.source_count === 5, 'regulatory action/guidance source count changed unexpectedly');
expect(report.coverage_domains?.regulatory_action_guidance?.stablecoin_count === 5, 'regulatory action/guidance asset reach changed unexpectedly');
expect(report.coverage_domains?.platform_policy?.source_count === 0, 'platform-policy coverage must remain zero before PR #317');
expect(report.coverage_domains?.platform_service_state?.source_count === 0, 'platform service-state coverage must remain zero before PR #317');
expect(report.coverage_domains?.regulatory_register?.source_count === 0, 'regulatory-register coverage must remain zero before PR #317');
expect(report.eu_eea_market_access?.any_function_covered === false, 'current configuration must not claim EU/EEA function-level access coverage');
expect(Object.values(report.eu_eea_market_access?.function_coverage ?? {}).every((row) => row.source_count === 0 && row.stablecoin_count === 0), 'every market-access function must remain zero-covered in PR #309');
expect((report.gaps?.extra_source_asset_ids ?? []).length === 0, 'monitoring sources reference non-canonical assets');
expect(report.gaps?.uncovered_asset_ids?.length === 84, 'uncovered asset queue must contain 84 assets');
expect(report.interpretation?.canonical_action === 'none', 'audit must not authorize canonical action');
expect(report.interpretation?.network_access_used === false, 'audit must remain offline');
expect(report.interpretation?.public_output === false, 'audit output must remain private/non-public');
expect(report.interpretation?.production_publication === false, 'audit must not publish');

if (failures.length) {
  console.error('Monitoring coverage recalculation validation failed:');
  failures.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}

console.log('Monitoring coverage recalculation passed: 24 registered sources reach 16/100 assets, 0 accepted baselines, and 0 platform-policy, register, or function-level market-access coverage in the current configuration.');
