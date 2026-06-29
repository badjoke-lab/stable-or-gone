import { buildMonitoringCoverageReport as base, SOURCE_FAMILIES } from './build-coverage-report.mjs';
export { SOURCE_FAMILIES };
export function buildMonitoringCoverageReport(root = process.cwd()) {
  const report = base(root);
  report.report_id = `sog_monitoring_coverage_${report.summary.canonical_stablecoin_count}_assets_${report.summary.registered_source_count}_sources_v1`;
  return report;
}
