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
const expectedId = `sog_monitoring_coverage_${stablecoins.length}_assets_24_sources_v1`;
const pairs = new Set(relationships.map((row) => `${row.stablecoin_id}|${row.organization_id}`));
const fail = (condition, message) => { if (!condition) failures.push(message); };

fail(JSON.stringify(report) === JSON.stringify(again), 'report must be deterministic');
fail(report.report_id === expectedId, `report id must be ${expectedId}`);
fail(report.stablecoins.length === stablecoins.length, 'asset rows must match canonical count');
fail(report.organizations.length === organizations.length, 'organization rows must match canonical count');
fail(report.sources.length === 24, 'registered source count must remain 24');
fail(report.summary.covered_stablecoin_count === 16, 'covered stablecoin count must remain 16');
fail(report.summary.uncovered_stablecoin_count === stablecoins.length - 16, 'uncovered count must follow registry growth');
fail(report.summary.multi_family_stablecoin_count === 7, 'multi-family count must remain 7');
fail(report.summary.covered_organization_count === 12, 'covered organization count must remain 12');
fail(report.summary.accepted_coverage_stablecoin_count === 0, 'accepted coverage must remain zero');
fail(report.summary.baseline_status_counts.pending_initial_acceptance === 24, 'pending baseline count must remain 24');
fail(report.summary.baseline_status_counts.accepted === 0 && report.summary.baseline_status_counts.missing === 0, 'accepted and missing baseline counts must remain zero');
fail(report.canonical_reference_check.stablecoin_ids_resolved === true, 'stablecoin references must resolve');
fail(report.canonical_reference_check.organization_ids_resolved === true, 'organization references must resolve');

for (const source of report.sources) {
  fail(source.baseline_status === 'pending_initial_acceptance', `${source.source_id}: baseline must remain pending`);
  fail(source.canonical_action === 'none', `${source.source_id}: canonical action must remain none`);
  for (const stablecoinId of source.stablecoin_ids) for (const organizationId of source.organization_ids) fail(pairs.has(`${stablecoinId}|${organizationId}`), `${source.source_id}: canonical relationship missing`);
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
console.log(`Current monitoring coverage valid: 16 of ${stablecoins.length} assets covered by 24 pending sources.`);
