import fs from 'node:fs';
import path from 'node:path';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const root = process.cwd();
const absolute = (file) => path.join(root, file);
const readJson = (file) => JSON.parse(fs.readFileSync(absolute(file), 'utf8'));
const readRows = (file) => {
  const parsed = readJson(file);
  const rows = Array.isArray(parsed) ? parsed : parsed.records;
  if (!Array.isArray(rows)) throw new Error(`${file}: expected array or records array`);
  return rows.map((row, index) => ({ ...row, __file: file, __index: index }));
};
const loadFiles = (files = []) => files.flatMap(readRows);
const unique = (values) => [...new Set((values ?? []).filter(Boolean))].sort();
const sameSet = (a, b) => JSON.stringify(unique(a)) === JSON.stringify(unique(b));
const countBy = (values) => Object.fromEntries([...values.reduce((map, raw) => {
  const key = raw === null || raw === undefined || raw === '' ? 'unknown' : String(raw);
  map.set(key, (map.get(key) ?? 0) + 1);
  return map;
}, new Map()).entries()].sort(([a], [b]) => a.localeCompare(b)));
const validUrl = (value) => {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

const baseline = loadRegistryV2Baseline(root);
const stablecoins = loadFiles(baseline.data_groups?.stablecoins);
const classifications = loadFiles(baseline.data_groups?.classifications);
const profiles = loadFiles(baseline.data_groups?.profiles);
const reserveRows = loadFiles(baseline.data_groups?.reserve_reports);
const evidence = loadFiles(baseline.data_groups?.evidence);
const organizations = loadFiles(baseline.data_groups?.organizations);
const applicability = readJson('data/quality/reserve-report-applicability.json');

const stablecoinById = new Map(stablecoins.map((row) => [row.id, row]));
const classificationById = new Map(classifications.map((row) => [row.id, row]));
const profileById = new Map(profiles.map((row) => [row.id, row]));
const evidenceIds = new Set(evidence.map((row) => row.id));
const organizationIds = new Set(organizations.map((row) => row.id));
const reserveRowById = new Map();
const rowsByStablecoin = new Map();
const critical = [];
const warnings = [];
const observations = [];
const rowsWithoutReportDate = [];

for (const row of reserveRows) {
  if (!row.id) {
    critical.push(`${row.__file}[${row.__index}]: reserve context id missing`);
    continue;
  }
  if (reserveRowById.has(row.id)) critical.push(`duplicate reserve context id ${row.id}`);
  reserveRowById.set(row.id, row);

  const targets = unique([row.stablecoin_id, ...(row.stablecoin_ids ?? [])]);
  if (!targets.length) critical.push(`${row.id}: no stablecoin target`);
  for (const id of targets) {
    if (!stablecoinById.has(id)) critical.push(`${row.id}: missing stablecoin ${id}`);
    const existing = rowsByStablecoin.get(id) ?? [];
    existing.push(row);
    rowsByStablecoin.set(id, existing);
  }

  if (row.issuer_id && !organizationIds.has(row.issuer_id)) critical.push(`${row.id}: missing issuer organization ${row.issuer_id}`);
  if (row.report_date) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(row.report_date)) critical.push(`${row.id}: invalid report_date ${row.report_date}`);
  } else {
    rowsWithoutReportDate.push(row.id);
  }
  if (!String(row.publisher ?? '').trim()) warnings.push(`${row.id}: publisher not recorded`);
  if (!String(row.report_type ?? '').trim()) critical.push(`${row.id}: report_type missing`);
  if (!Array.isArray(row.asset_categories) || !row.asset_categories.length) critical.push(`${row.id}: asset_categories missing`);
  if (!String(row.url ?? '').trim() || !validUrl(row.url)) critical.push(`${row.id}: source URL missing or invalid`);
}

if (classifications.length !== stablecoins.length) critical.push(`classification count ${classifications.length} differs from stablecoin count ${stablecoins.length}`);
if (profiles.length !== stablecoins.length) critical.push(`profile count ${profiles.length} differs from stablecoin count ${stablecoins.length}`);
for (const coin of stablecoins) {
  if (!classificationById.has(coin.id)) critical.push(`${coin.id}: classification missing`);
  if (!profileById.has(coin.id)) critical.push(`${coin.id}: profile missing`);
}

const backingMismatches = [];
const invalidLatestReportRefs = [];
const missingReserveEvidenceRefs = [];
const missingRedemptionEvidenceRefs = [];
const invalidRedemptionUrls = [];
const lifecycleRedemptionWarnings = [];
const issuerRedemptionMechanismWarnings = [];
const unbackedDisclosureWarnings = [];
const sourceReviewNeededFields = [];
const reserveDisclosureStatuses = [];
const redemptionStatuses = [];

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
      classification_backing_types: unique(classification.backing_types),
      reserve_profile_backing_types: unique(reserve.backing_types)
    });
    critical.push(`${coin.id}: classification and reserve-profile backing types differ`);
  }

  if (reserve.latest_report_id && !reserveRowById.has(reserve.latest_report_id)) {
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
    invalidRedemptionUrls.push({ stablecoin_id: coin.id, redemption_url: redemption.redemption_url });
    critical.push(`${coin.id}: invalid redemption_url ${redemption.redemption_url}`);
  }

  const terminal = ['collapsed', 'terminated'].includes(classification.lifecycle_status);
  if (terminal && !['terminated', 'not_applicable', 'unknown'].includes(redemption.status)) {
    const item = { stablecoin_id: coin.id, lifecycle_status: classification.lifecycle_status, redemption_status: redemption.status };
    lifecycleRedemptionWarnings.push(item);
    warnings.push(`${coin.id}: terminal lifecycle ${classification.lifecycle_status} with redemption status ${redemption.status} requires review`);
  }
  if (classification.stabilization_mechanism === 'issuer_redemption' && redemption.status === 'not_applicable') {
    issuerRedemptionMechanismWarnings.push(coin.id);
    warnings.push(`${coin.id}: issuer_redemption stabilization with not_applicable redemption profile`);
  }
  if ((classification.backing_types ?? []).includes('unbacked') && ['available', 'wind_down_available'].includes(reserve.disclosure_status)) {
    const item = { stablecoin_id: coin.id, disclosure_status: reserve.disclosure_status };
    unbackedDisclosureWarnings.push(item);
    warnings.push(`${coin.id}: unbacked classification with reserve disclosure status ${reserve.disclosure_status}`);
  }

  for (const [field, value] of [
    ['retail_access', redemption.retail_access],
    ['institutional_access', redemption.institutional_access],
    ['minimum_amount_text', redemption.minimum_amount_text],
    ['fee_text', redemption.fee_text],
    ['settlement_time_text', redemption.settlement_time_text]
  ]) {
    if (String(value ?? '').toLowerCase().includes('source_review_needed')) sourceReviewNeededFields.push({ stablecoin_id: coin.id, field });
  }
}

const queueRecords = Array.isArray(applicability.records) ? applicability.records : [];
const queueIds = new Set(queueRecords.map((row) => row.stablecoin_id));
const coveredIds = new Set(rowsByStablecoin.keys());
const overlapIds = [...queueIds].filter((id) => coveredIds.has(id)).sort();
const uncoveredIds = stablecoins.map((row) => row.id).filter((id) => !coveredIds.has(id) && !queueIds.has(id)).sort();
const extraQueueIds = [...queueIds].filter((id) => !stablecoinById.has(id)).sort();
const extraReportTargetIds = [...coveredIds].filter((id) => !stablecoinById.has(id)).sort();
for (const id of overlapIds) critical.push(`${id}: appears in both reserve context coverage and applicability queue`);
for (const id of uncoveredIds) critical.push(`${id}: absent from both reserve context coverage and applicability queue`);
for (const id of extraQueueIds) critical.push(`${id}: applicability queue target is not canonical`);
for (const id of extraReportTargetIds) critical.push(`${id}: reserve context target is not canonical`);

const queueEvidenceGaps = [];
for (const row of queueRecords) {
  if (!Array.isArray(row.evidence_ids) || !row.evidence_ids.length) {
    queueEvidenceGaps.push({ stablecoin_id: row.stablecoin_id, evidence_id: null });
    critical.push(`${row.stablecoin_id}: applicability decision lacks evidence`);
    continue;
  }
  for (const id of row.evidence_ids) {
    if (!evidenceIds.has(id)) {
      queueEvidenceGaps.push({ stablecoin_id: row.stablecoin_id, evidence_id: id });
      critical.push(`${row.stablecoin_id}: applicability evidence ${id} missing`);
    }
  }
}

const partitionCount = coveredIds.size + queueIds.size - overlapIds.length;
if (partitionCount !== stablecoins.length) critical.push(`reserve applicability partition covers ${partitionCount} assets, expected ${stablecoins.length}`);

const reserveSourceStatusUnresolved = queueRecords
  .filter((row) => row.applicability === 'source_status_unresolved')
  .map((row) => row.stablecoin_id)
  .sort();
const queueCategoryCounts = countBy(queueRecords.map((row) => row.applicability));

observations.push(`Audited ${stablecoins.length} assets, ${classifications.length} classifications, ${profiles.length} profiles, and ${reserveRows.length} reserve-context rows.`);
observations.push(`${coveredIds.size} assets are covered by reserve-context rows and ${queueIds.size} assets by explicit applicability decisions.`);
observations.push(`${rowsWithoutReportDate.length} reserve-context rows are indexes or context entries without a period-specific report_date.`);
observations.push(`${sourceReviewNeededFields.length} redemption fields explicitly retain source-review-needed text.`);

const report = {
  schema_version: '1.0',
  audit_id: 'sog_registry_100_reserve_redemption_backing_pr300',
  baseline_id: baseline.baseline_id,
  audited_counts: {
    stable_assets: stablecoins.length,
    classifications: classifications.length,
    profiles: profiles.length,
    reserve_context_rows: reserveRows.length,
    reserve_report_covered_assets: coveredIds.size,
    applicability_queue_assets: queueIds.size
  },
  partition: {
    overlap_ids: overlapIds,
    uncovered_ids: uncoveredIds,
    extra_queue_ids: extraQueueIds,
    extra_report_target_ids: extraReportTargetIds,
    queue_category_counts: queueCategoryCounts
  },
  consistency: {
    backing_mismatches: backingMismatches,
    invalid_latest_report_refs: invalidLatestReportRefs,
    missing_reserve_evidence_refs: missingReserveEvidenceRefs,
    missing_redemption_evidence_refs: missingRedemptionEvidenceRefs,
    invalid_redemption_urls: invalidRedemptionUrls,
    queue_evidence_gaps: queueEvidenceGaps
  },
  review_queues: {
    reserve_context_rows_without_report_date: rowsWithoutReportDate.sort(),
    lifecycle_redemption_warnings: lifecycleRedemptionWarnings,
    issuer_redemption_mechanism_warnings: issuerRedemptionMechanismWarnings,
    unbacked_disclosure_warnings: unbackedDisclosureWarnings,
    redemption_source_review_needed_fields: sourceReviewNeededFields,
    reserve_source_status_unresolved: reserveSourceStatusUnresolved
  },
  distributions: {
    classification_backing_types_non_exclusive: countBy(classifications.flatMap((row) => row.backing_types ?? [])),
    stabilization_mechanisms: countBy(classifications.map((row) => row.stabilization_mechanism)),
    reserve_disclosure_statuses: countBy(reserveDisclosureStatuses),
    redemption_statuses: countBy(redemptionStatuses),
    reserve_context_types: countBy(reserveRows.map((row) => row.report_type))
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
  `- Reserve-context rows: **${reserveRows.length}**`,
  `- Critical findings: **${critical.length}**`,
  `- Review warnings: **${warnings.length}**`,
  '',
  '## Reserve Applicability Partition',
  '',
  `- Assets covered by reserve-context rows: ${coveredIds.size}`,
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
  `- Invalid redemption URLs: ${invalidRedemptionUrls.length}`,
  `- Applicability decision evidence gaps: ${queueEvidenceGaps.length}`,
  '',
  '## Review Queues',
  '',
  `- Reserve-context rows without period-specific report_date: ${rowsWithoutReportDate.length}`,
  `- Terminal lifecycle / redemption review: ${lifecycleRedemptionWarnings.length}`,
  `- Issuer-redemption / not-applicable conflicts: ${issuerRedemptionMechanismWarnings.length}`,
  `- Unbacked / available disclosure conflicts: ${unbackedDisclosureWarnings.length}`,
  `- Redemption source-review-needed fields: ${sourceReviewNeededFields.length}`,
  `- Reserve source status unresolved assets: ${reserveSourceStatusUnresolved.length}`,
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
    ? 'PASS. Every asset has classification and profile coverage; backing semantics align; reserve-context coverage and explicit applicability decisions form a complete partition; references are structurally valid. Review queues remain explicit.'
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
  reserve_context_rows: reserveRows.length,
  report_covered_assets: coveredIds.size,
  applicability_queue_assets: queueIds.size,
  critical: critical.length,
  warnings: warnings.length,
  rows_without_report_date: rowsWithoutReportDate.length,
  review_needed_fields: sourceReviewNeededFields.length
}, null, 2));

if (critical.length) process.exit(1);
