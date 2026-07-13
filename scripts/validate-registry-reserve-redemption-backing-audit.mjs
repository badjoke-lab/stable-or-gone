import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const jsonPath = 'data/generated/registry-reserve-redemption-backing-audit.json';

execFileSync(process.execPath, ['scripts/audit-registry-reserve-redemption-backing.mjs'], {
  stdio: 'inherit',
  env: process.env
});

const report = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const checkpoint = JSON.parse(fs.readFileSync('docs/migration/current-canonical-checkpoint.json', 'utf8'));
const expectedCounts = checkpoint.expected_counts ?? {};
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };
const expectedApplicabilityQueueAssets = 12;
const expectedCoveredAssets = checkpoint.asset_count - expectedApplicabilityQueueAssets;
const expectedNoDateRows = 76;

expect(report.audit_id === 'sog_registry_100_reserve_redemption_backing_pr300', `unexpected audit_id ${report.audit_id}`);
expect(report.audited_counts?.stable_assets === checkpoint.asset_count, `expected ${checkpoint.asset_count} assets, got ${report.audited_counts?.stable_assets}`);
expect(report.audited_counts?.classifications === checkpoint.asset_count, `expected ${checkpoint.asset_count} classifications, got ${report.audited_counts?.classifications}`);
expect(report.audited_counts?.profiles === checkpoint.asset_count, `expected ${checkpoint.asset_count} profiles, got ${report.audited_counts?.profiles}`);
expect(report.audited_counts?.reserve_context_rows === expectedCounts.reserve_reports, `expected ${expectedCounts.reserve_reports} reserve-context rows, got ${report.audited_counts?.reserve_context_rows}`);
expect(report.audited_counts?.reserve_report_covered_assets === expectedCoveredAssets, `expected ${expectedCoveredAssets} context-covered assets, got ${report.audited_counts?.reserve_report_covered_assets}`);
expect(report.audited_counts?.applicability_queue_assets === expectedApplicabilityQueueAssets, `expected ${expectedApplicabilityQueueAssets} applicability decisions, got ${report.audited_counts?.applicability_queue_assets}`);
expect((report.findings?.critical ?? []).length === 0, `critical findings remain: ${(report.findings?.critical ?? []).length}`);
expect((report.partition?.overlap_ids ?? []).length === 0, 'reserve applicability overlap remains');
expect((report.partition?.uncovered_ids ?? []).length === 0, 'uncovered reserve applicability assets remain');
expect((report.partition?.extra_queue_ids ?? []).length === 0, 'extra applicability queue targets remain');
expect((report.partition?.extra_report_target_ids ?? []).length === 0, 'extra reserve context targets remain');
expect((report.consistency?.backing_mismatches ?? []).length === 0, 'backing mismatches remain');
expect((report.consistency?.invalid_latest_report_refs ?? []).length === 0, 'invalid latest-report references remain');
expect((report.consistency?.missing_reserve_evidence_refs ?? []).length === 0, 'missing reserve evidence references remain');
expect((report.consistency?.missing_redemption_evidence_refs ?? []).length === 0, 'missing redemption evidence references remain');
expect((report.consistency?.invalid_redemption_urls ?? []).length === 0, 'invalid redemption URLs remain');
expect((report.consistency?.queue_evidence_gaps ?? []).length === 0, 'applicability queue evidence gaps remain');
expect((report.review_queues?.reserve_context_rows_without_report_date ?? []).length === expectedNoDateRows, `reserve context no-date queue changed: expected ${expectedNoDateRows}`);
expect((report.review_queues?.reserve_context_rows_without_report_date ?? []).includes('sog_rr_xusd_attestation_index_pr358'), 'XUSD reserve context must remain in the no-date review queue');
expect((report.review_queues?.reserve_context_rows_without_report_date ?? []).includes('sog_rr_usdb_protocol_backing_pr358'), 'USDB reserve context must remain in the no-date review queue');
expect(JSON.stringify(report.review_queues?.lifecycle_redemption_warnings ?? []) === JSON.stringify([
  { stablecoin_id: 'sog_st_fei', lifecycle_status: 'terminated', redemption_status: 'restricted' }
]), 'FEI lifecycle/redemption review queue changed');
expect((report.review_queues?.issuer_redemption_mechanism_warnings ?? []).length === 0, 'issuer-redemption mechanism conflicts remain');
expect((report.review_queues?.unbacked_disclosure_warnings ?? []).length === 0, 'unbacked disclosure conflicts remain');
expect((report.review_queues?.redemption_source_review_needed_fields ?? []).length === 10, 'redemption source-review-needed queue changed');
expect(JSON.stringify(report.review_queues?.reserve_source_status_unresolved ?? []) === JSON.stringify(['sog_st_eurt', 'sog_st_husd']), 'reserve source-status unresolved queue changed');
expect(report.result === 'pass_with_review_queues', `unexpected result ${report.result}`);

if (failures.length) {
  console.error('Reserve, redemption, and backing audit validation failed:');
  failures.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}

console.log(`Reserve, redemption, and backing audit validation passed against current checkpoint ${checkpoint.checkpoint_id}: complete ${expectedCoveredAssets}+${expectedApplicabilityQueueAssets} applicability partition, ${expectedNoDateRows} bounded no-date review rows, 0 critical inconsistencies, and bounded review queues.`);
