import fs from 'node:fs';
import path from 'node:path';
import { buildMonitoringCoverageReport } from './monitoring/audits/current-coverage.mjs';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const root = process.cwd();
const failures = [];
const readRows = (file) => { const value = JSON.parse(fs.readFileSync(path.join(root, file), 'utf8')); return Array.isArray(value) ? value : value.records ?? []; };
const baseline = loadRegistryV2Baseline(root);
const stablecoins = (baseline.data_groups?.stablecoins ?? []).flatMap(readRows);
const organizations = (baseline.data_groups?.organizations ?? []).flatMap(readRows);
const relationships = (baseline.data_groups?.relationships ?? []).flatMap(readRows);
const report = buildMonitoringCoverageReport(root);
const again = buildMonitoringCoverageReport(root);
const expectedId = `sog_monitoring_coverage_${stablecoins.length}_assets_41_sources_v1`;
const pairs = new Set(relationships.map((row) => `${row.stablecoin_id}|${row.organization_id}`));
const fail = (condition, message) => { if (!condition) failures.push(message); };

const expectedCoveredStablecoins = 23;
const expectedUncoveredStablecoins = stablecoins.length - expectedCoveredStablecoins;

fail(JSON.stringify(report) === JSON.stringify(again), 'report must be deterministic');
fail(report.report_id === expectedId, `report id must be ${expectedId}`);
fail(report.stablecoins.length === stablecoins.length, 'asset rows must match canonical count');
fail(report.organizations.length === organizations.length, 'organization rows must match canonical count');
fail(report.sources.length === 41, 'registered source count must be 41');
fail(report.summary.covered_stablecoin_count === expectedCoveredStablecoins, `covered stablecoin count must be ${expectedCoveredStablecoins}`);
fail(report.summary.uncovered_stablecoin_count === expectedUncoveredStablecoins, `uncovered stablecoin count must be ${expectedUncoveredStablecoins}`);
fail(report.summary.covered_stablecoin_count + report.summary.uncovered_stablecoin_count === stablecoins.length, 'covered and uncovered stablecoin counts must equal current canonical denominator');
fail(report.summary.multi_family_stablecoin_count === 17, 'multi-family count must be 17');
fail(report.summary.covered_organization_count === 18, 'covered organization count must be 18');
fail(report.summary.accepted_coverage_stablecoin_count === 0, 'accepted coverage must remain zero');
fail(report.summary.baseline_status_counts.pending_initial_acceptance === 41, 'pending baseline count must be 41');
fail(report.summary.baseline_status_counts.accepted === 0 && report.summary.baseline_status_counts.missing === 0, 'accepted and missing baseline counts must remain zero');

const expectedSourceFamilies = {
  reserve_assurance: 15,
  redemption_terms: 12,
  issuer_lifecycle: 9,
  regulatory: 9,
  platform_policy: 3,
  platform_service_state: 2,
  regulatory_register: 1,
};
const expectedAssetFamilies = {
  reserve_assurance: 16,
  redemption_terms: 12,
  issuer_lifecycle: 7,
  regulatory: 8,
  platform_policy: 12,
  platform_service_state: 0,
  regulatory_register: 0,
};
for (const [family, count] of Object.entries(expectedSourceFamilies)) fail(report.summary.source_family_counts[family] === count, `${family}: source count must be ${count}`);
for (const [family, count] of Object.entries(expectedAssetFamilies)) fail(report.summary.stablecoin_family_counts[family] === count, `${family}: asset reach must be ${count}`);

fail(report.summary.platform_policy_source_count === 3, 'platform-policy source count must be 3');
fail(report.summary.platform_service_state_source_count === 2, 'platform service-state source count must be 2');
fail(report.summary.regulatory_register_source_count === 1, 'regulatory-register source count must be 1');
fail(report.summary.market_access_schema_capable_source_count === 7, 'schema-capable source count must be 7');
fail(report.summary.scoped_platform_count === 6, 'scoped platform count must be 6');
fail(report.summary.scoped_region_count === 6, 'scoped region count must be 6');
fail(report.policy.platform_register_scope_not_divided_by_asset_denominator === true, 'platform/register scope denominator boundary missing');
fail(report.canonical_reference_check.stablecoin_ids_resolved === true, 'stablecoin references must resolve');
fail(report.canonical_reference_check.organization_ids_resolved === true, 'organization references must resolve');

for (const source of report.sources) {
  fail(source.baseline_status === 'pending_initial_acceptance', `${source.source_id}: baseline must remain pending`);
  fail(source.canonical_action === 'none', `${source.source_id}: canonical action must remain none`);
  if (source.stablecoin_ids.length > 0 && source.organization_ids.length > 0) {
    for (const stablecoinId of source.stablecoin_ids) {
      for (const organizationId of source.organization_ids) fail(pairs.has(`${stablecoinId}|${organizationId}`), `${source.source_id}: canonical relationship missing`);
    }
  }
}
for (const row of report.stablecoins) {
  const expected = row.source_family_count === 0 ? 'no_registered_source' : row.source_family_count === 1 ? 'single_family_coverage' : 'multi_family_coverage';
  fail(row.coverage_class === expected, `${row.stablecoin_id}: coverage class mismatch`);
  fail(row.accepted_monitoring_coverage === false, `${row.stablecoin_id}: accepted coverage must remain false`);
}

if (failures.length) {
  console.error('Current monitoring coverage validation failed:');
  failures.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}
console.log(`Current monitoring coverage valid: ${expectedCoveredStablecoins} of ${stablecoins.length} assets reached by 41 pending sources; ${expectedUncoveredStablecoins} assets remain uncovered; 7 scoped sources cover 6 platform subjects and official register context.`);
