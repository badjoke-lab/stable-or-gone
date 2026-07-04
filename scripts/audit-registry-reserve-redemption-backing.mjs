import fs from 'node:fs';
import path from 'node:path';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const root = process.cwd();
const absolute = (relativePath) => path.join(root, relativePath);
const readJson = (relativePath) => JSON.parse(fs.readFileSync(absolute(relativePath), 'utf8'));
const readRows = (relativePath) => {
  const parsed = readJson(relativePath);
  const rows = Array.isArray(parsed) ? parsed : parsed.records;
  if (!Array.isArray(rows)) throw new Error(`${relativePath}: expected array or records array`);
  return rows.map((row, index) => ({ ...row, __file: relativePath, __index: index }));
};
const loadFiles = (files = []) => files.flatMap(readRows);
const sortedUnique = (values) => [...new Set(values.filter(Boolean))].sort();
const countBy = (values) => Object.fromEntries([...values.reduce((map, raw) => {
  const key = raw === null || raw === undefined || raw === '' ? 'unknown' : String(raw);
  map.set(key, (map.get(key) ?? 0) + 1);
  return map;
}, new Map()).entries()].sort(([a], [b]) => a.localeCompare(b)));
const sameSet = (a, b) => JSON.stringify(sortedUnique(a ?? [])) === JSON.stringify(sortedUnique(b ?? []));
const validUrl = (value) => {
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol);
  } catch { return false; }
};

const baseline = loadRegistryV2Baseline(root);
const stablecoins = loadFiles(baseline.data_groups?.stablecoins ?? []);
const classifications = loadFiles(baseline.data_groups?.classifications ?? []);
const profiles = loadFiles(baseline.data_groups?.profiles ?? []);
const reserveReports = loadFiles(baseline.data_groups?.reserve_reports ?? []);
const evidence = loadFiles(baseline.data_groups?.evidence ?? []);
const organizations = loadFiles(baseline.data_groups?.organizations ?? []);
const applicabilityQueue = readJson('data/quality/reserve-report-applicability.json');

const stablecoinById = new Map(stablecoins.map((row) => [row.id, row]));
const classificationById = new Map(classifications.map((row) => [row.id, row]));
const profileById = new Map(profiles.map((row) => [row.id, row]));
const evidenceIds = new Set(evidence.map((row) => row.id));
const organizationIds = new Set(organizations.map((row) => row.id));
const reportById = new Map();
const reportsByStablecoin = new Map();
const critical = [];
const warnings = [];
const observations = [];

for (const report of reserveReports) {
  if (!report.id) {
    critical.push(`${report.__file}[${report.__index}]: reserve report id missing`);
    continue;
  }
  if (reportById.has(report.id)) critical.push(`duplicate reserve report id ${report.id}`);
  reportById.set(report.id, report);
  const targetIds = sortedUnique([report.stablecoin_id, ...(report.stablecoin_ids ?? [])]);
  if (!targetIds.length) critical.push(`${report.id}: no stablecoin target`);
  for (const id of targetIds) {
    if (!stablecoinById.has(id)) critical.push(`${report.id}: missing stablecoin ${id}`);
    const rows = reportsByStablecoin.get(id) ?? [];
    rows.push(report);
    reportsByStablecoin.set(id, rows);
  }
  if (report.issuer_id && !organizationIds.has(report.issuer_id)) critical.push(`${report.id}: missing issuer organization ${report.issuer_id}`);
  if (!report.report_date || !/^\d{4}-\d{2}-\d{2}$/.test(report.report_date)) critical.push(`${report.id}: invalid report_date ${report.report_date}`);
  if (!String(report.publisher ?? '').trim()) warnings.push(`${report.id}: publisher not recorded`);
  if (!String(report.report_type ?? '').trim()) critical.push(`${report.id}: report_type missing`);
  if (!Array.isArray(report.asset_categories) || report.asset_categories.length === 0) critical.push(`${report.id}: asset_categories missing`);
  if (!String(report.url ?? '').trim() || !validUrl(report.url)) critical.push(`${report.id}: source URL missing or invalid`);
}

if (classifications.length !== stablecoins.length) critical.push(`classification count ${classifications.length} differs from stablecoin count ${stablecoins.length}`);
if (profiles.length !== stablecoins.length) critical.push(`profile count ${profiles.length} differs from stablecoin count ${stablecoins.length}`);
for (const coin of stablecoins) {
  if (!classificationById.has(coin.id)) critical.push(`${coin.id}: classification missing`);
  if (!profileById.has(coin.id)) critical.push(`${coin.id}: profile missing`);
}

const backingMismatches = [];
const missingReserveEvidenceRefs = [];
const missingRedemptionEvidenceRefs = [];
const invalidLatestReportRefs = [];
const redemptionUrlIssues = [];
const reserveDisclosureStatuses = [];
const redemptionStatuses = [];
const lifecycleRedemptionWarnings = [];
const issuerRedemptionMechanismWarnings = [];
const unbackedDisclosureWarnings = [];
const reviewNeededFields = [];

for (const coin of stablecoins) {
  const classification = classificationById.get(coin.id);
  const profile = profileById.get(coin.id);
  if (!classification || !profile) continue;
  const reserve = profile.reserve_profile ?? {};
  const redemption = profile.redemption_profile ?? {};
  reserveDisclosureStatuses.push(reserve.disclosure_status);
  redemptionStatuses.push(redemption.status);

  if (!sameSet(classification.backing_types, reserve.backing_types)) {
    backingMismatches.push({
      stablecoin_id: coin.id,
      classification_backing_types: sortedUnique(classification.backing_types ?? []),
      reserve_profile_backing_types: sortedUnique(reserve.backing_types ?? [])
    });
    critical.push(`${coin.id}: classification and reserve-profile backing types differ`);
  }

  if (reserve.latest_report_id && !reportById.has(reserve.latest_report_id)) {
    invalidLatestReportRefs.push({ stablecoin_id: coin.id, latest_report_id: reserve.latest_report_id });
    critical.push(`${coin.id}: latest_report_id ${reserve.latest_report_id} missing`);
  }
  for (const id of reserve.evidence_ids ?? []) {
    if (!evidenceIds.has(id)) {
      missingReserveEvidenceRefs.push({ stablecoin_id: coin.id, evidence_id: id });
      critical.push(`${coin.id}: reserve evidence ${id} missing`);
    }
  }
  for (const id of redemption.evidence_ids ?? []) {
    if (!evidenceIds.has(id)) {
      missingRedemptionEvidenceRefs.push({ stablecoin_id: coin.id, evidence_id: id });
      critical.push(`${coin.id}: redemption evidence ${id} missing`);
    }
  }
  if (redemption.redemption_url && !validUrl(redemption.redemption_url)) {
    redemptionUrlIssues.push({ stablecoin_id: coin.id, redemption_url: redemption.redemption_url });
    critical.push(`${coin.id}: invalid redemption_url ${redemption.redemption_url}`);
  }

  const terminalLifecycle = ['collapsed', 'terminated'].includes(classification.lifecycle_status);
  if (terminalLifecycle && !['terminated', 'not_applicable', 'unknown'].includes(redemption.status)) {
    lifecycleRedemptionWarnings.push({ stablecoin_id: coin.id, lifecycle_status: classification.lifecycle_status, redemption_status: redemption.status });
    warnings.push(`${coin.id}: terminal lifecycle ${classification.lifecycle_status} with redemption status ${redemption.status} requires review`);
  }
  if (classification.stabilization_mechanism === 'issuer_redemption' && redemption.status === 'not_applicable') {
    issuerRedemptionMechanismWarnings.push(coin.id);
    warnings.push(`${coin.id}: issuer_redemption stabilization with not_applicable redemption profile`);
  }
  if ((classification.backing_types ?? []).includes('unbacked') && ['available', 'wind_down_available'].includes(reserve.disclosure_status)) {
    unbackedDisclosureWarnings.push({ stablecoin_id: coin.id, disclosure_status: reserve.disclosure_status });
    warnings.push(`${coin.id}: unbacked classification with reserve disclosure status ${reserve.disclosure_status}`);
  }

  const scanFields = [
    ['retail_access', redemption.retail_access],
    ['institutional_access', redemption.institutional_access],
    ['minimum_amount_text', redemption.minimum_amount_text],
    ['fee_text', redemption.fee_text],
    ['settlement_time_text', redemption.settlement_time_text]
  ];
  for (const [field, value] of scanFields) {
    if (String(value ?? '').toLowerCase().includes('source_review_needed')) reviewNeededFields.push({ stablecoin_id: coin.id, field });
  }
}

for (const row of backingMismatches) critical.push(`${row.stablecoin_id}: backing mismatch ${row.classification_backing_types.join('+')} vs ${row.reserve_profile_backing_types.join('+')}`);

const queueRecords = Array.isArray(applicabilityQueue.records) ? applicabilityQueue.records : [];
const queueByStablecoin = new Map(queueRecords.map((row) => [row.stablecoin_id, row]));
const queueIds = new Set(queueByStablecoin.keys());
const reportCoveredIds = new Set(reportsByStablecoin.keys());
const overlapIds = [...queueIds].filter((id) => reportCoveredIds.has(id)).sort();
const uncoveredIds = stablecoins.map((row) => row.id).filter((id) => !reportCoveredIds.has(id) && !queueIds.has(id)).sort();
const extraQueueIds = [...queueIds].filter((id) => !stablecoinById.has(id)).sort();
const extraCoveredIds = [...reportCoveredIds].filter((id) => !stablecoinById.has(id)).sort();

for (const id of overlapIds) critical.push(`${id}: appears in both reserve report coverage and applicability queue`);
for (const id of uncoveredIds) critical.push(`${id}: absent from both reserve report coverage and applicability queue`);
for (const id of extraQueueIds) critical.push(`${id}: applicability queue target is not canonical`);
for (const id of extraCoveredIds) critical.push(`${id}: reserve report target is not canonical`);

const queueEvidenceGaps = [];
for (const row of queueRecords) {
  if (!stablecoinById.has(row.stablecoin_id)) continue;
  if (!Array.isArray(row.evidence_ids) || row.evidence_ids.length === 0) {
    queueEvidenceGaps.push({ stablecoin_id: row.stablecoin_id, evidence_id: null });
    critical.push(`${row.stablecoin_id}: applicability decision lacks evidence`);
  } else {
    for (const id of row.evidence_ids) {
      if (!evidenceIds.has(id)) {
        queueEvidenceGaps.push({ stablecoin_id: row.stablecoin_id, evidence_id: id });
        critical.push(`${row.stablecoin_id}: applicability evidence ${id} missing`);
      }
    }
  }
}

const partitionCount = reportCoveredIds.size + queueIds.size - overlapIds.length;
if (partitionCount !== stablecoins.length) critical.push(`reserve applicability partition covers ${partitionCount} assets, expected ${stablecoins.length}`);

const queueCategoryCounts = countBy(queueRecords.map((row) => row.applicability));
const reserveReportTypeCounts = countBy(reserveReports.map((row) => row.report_type));
const classificationBackingCounts = countBy(classifications.flatMap((row) => row.backing_types ?? []));
const stabilizationCounts = countBy(classifications.map((row) => row.stabilization_mechanism));

observations.push(`Audited ${stablecoins.length} assets, ${classifications.length} classifications, ${profiles.length} reserve/redemption profiles, and ${reserveReports.length} reserve-context rows.`);
observations.push(`${reportCoveredIds.size} assets are covered by reserve-context rows and ${queueIds.size} assets are covered by explicit applicability decisions.`);
observations.push(`${reviewNeededFields.length} redemption profile fields explicitly retain source-review-needed text.`);

const report = {
  schema_version: '1.0',
  audit_id: 'sog_registry_100_reserve_redemption_backing_pr300',
  baseline_id: baseline.baseline_id,
  audited_counts: {
    stable_assets: stablecoins.length,
    classifications: classifications.length,
    profiles: profiles.length,
    reserve_context_rows: reserveReports.length,
    reserve_report_covered_assets: reportCoveredIds.size,
    applicability_queue_assets: queueIds.size
  },
  partition: {
    overlap_ids: overlapIds,
    uncovered_ids: uncoveredIds,
    extra_queue_ids: extraQueueIds,
    extra_report_target_ids: extraCoveredIds,
    queue_category_counts: queueCategoryCounts
  },
  consistency: {
    backing_mismatches: backingMismatches,
    invalid_latest_report_refs: invalidLatestReportRefs,
    missing_reserve_evidence_refs: missingReserveEvidenceRefs,
    missing_redemption_evidence_refs: missingRedemptionEvidenceRefs,
    invalid_redemption_urls: redemptionUrlIssues,
    queue_evidence_gaps: queueEvidenceGaps
  },
  review_queues: {
    lifecycle_redemption_warnings: lifecycleRedemptionWarnings,
    issuer_redemption_mechanism_warnings: issuerRedemptionMechanismWarnings,
    unbacked_disclosure_warnings: unbackedDisclosureWarnings,
    redemption_source_review_needed_fields: reviewNeededFields,
    reserve_source_status_unresolved: queueRecords.filter((row) => row.applicability === 'source_status_unresolved').map((row) => row.stablecoin_id).sort()
  },
  distributions: {
    classification_backing_types_non_exclusive: classificationBackingCounts,
    stabilization_mechanisms: stabilizationCounts,
    reserve_disclosure_statuses: countBy(reserveDisclosureStatuses),
    redemption_statuses: countBy(redemptionStatuses),
    reserve_report_types: reserveReportTypeCounts
  },
  findings: { critical, warnings, observations },
  result: critical.length === 0 ? 'pass_with_review_queues' : 'fail'
};

const lines = [
  '# SOG 100-Record Reserve, Redemption, and Backing Applicability Audit',
  '',
  `- Audit ID: \`${report.audit_id}\``,
  `- Baseline: \`${report.baseline_id}\``,
  `- Stable assets: **${stablecoins.length}**`,
  `- Classifications: **${classifications.length}**`,
  `- Profiles: **${profiles.length}**`,
  `- Reserve-context rows: **${reserveReports.length}**`,
  `- Critical findings: **${critical.length}**`,
  `- Review warnings: **${warnings.length}**`,
  '',
  '## Reserve Applicability Partition',
  '',
  `- Assets covered by reserve-context rows: ${reportCoveredIds.size}`,
  `- Assets covered by applicability decisions: ${queueIds.size}`,
  `- Overlap: ${overlapIds.length}`,
  `- Uncovered: ${uncoveredIds.length}`,
  `- Queue categories: \`${JSON.stringify(queueCategoryCounts)}\``,
  '',
  '## Cross-Layer Consistency',
  '',
  `- Backing mismatches: ${backingMismatches.length}`,
  `- Invalid latest-report references: ${invalidLatestReportRefs.length}`,
  `- Missing reserve evidence references: ${missingReserveEvidenceRefs.length}`,
  `- Missing redemption evidence references: ${missingRedemptionEvidenceRefs.length}`,
  `- Invalid redemption URLs: ${redemptionUrlIssues.length}`,
  `- Applicability decision evidence gaps: ${queueEvidenceGaps.length}`,
  '',
  '## Review Queues',
  '',
  `- Terminal lifecycle / redemption review: ${lifecycleRedemptionWarnings.length}`,
  `- Issuer-redemption / not-applicable conflicts: ${issuerRedemptionMechanismWarnings.length}`,
  `- Unbacked / available disclosure conflicts: ${unbackedDisclosureWarnings.length}`,
  `- Redemption source-review-needed fields: ${reviewNeededFields.length}`,
  `- Reserve source status unresolved assets: ${report.review_queues.reserve_source_status_unresolved.length}`,
  '',
  '## Critical Findings',
  '',
  ...(critical.length ? critical.map((message) => `- ${message}`) : ['- None.']),
  '',
  '## Review Warnings',
  '',
  ...(warnings.length ? warnings.map((message) => `- ${message}`) : ['- None.']),
  '',
  '## Observations',
  '',
  ...observations.map((message) => `- ${message}`),
  '',
  '## Result',
  '',
  critical.length === 0
    ? 'PASS. Every canonical asset has classification and profile coverage; backing semantics align across classification and reserve profile; reserve-context coverage and explicit applicability decisions form a complete partition; references are structurally valid. Review queues remain explicit.'
    : 'FAIL. Critical reserve, redemption, backing, or applicability findings must be resolved before PR #300 can close.',
  ''
];

const jsonPath = 'data/generated/registry-reserve-redemption-backing-audit.json';
const markdownPath = 'docs/audits/registry-100-reserve-redemption-backing-audit.md';
fs.mkdirSync(path.dirname(absolute(jsonPath)), { recursive: true });
fs.mkdirSync(path.dirname(absolute(markdownPath)), { recursive: true });
fs.writeFileSync(absolute(jsonPath), `${JSON.stringify(report, null, 2)}\n`);
fs.writeFileSync(absolute(markdownPath), lines.join('\n'));

console.log(JSON.stringify({
  audit_id: report.audit_id,
  result: report.result,
  stable_assets: stablecoins.length,
  classifications: classifications.length,
  profiles: profiles.length,
  reserve_context_rows: reserveReports.length,
  report_covered_assets: reportCoveredIds.size,
  applicability_queue_assets: queueIds.size,
  critical: critical.length,
  warnings: warnings.length,
  review_needed_fields: reviewNeededFields.length
}, null, 2));

if (critical.length) process.exit(1);
