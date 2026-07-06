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
const unique = (values) => [...new Set(values.filter(Boolean))].sort();
const countBy = (values) => Object.fromEntries([...values.reduce((map, raw) => {
  const key = raw === null || raw === undefined || raw === '' ? 'unknown' : String(raw);
  map.set(key, (map.get(key) ?? 0) + 1);
  return map;
}, new Map()).entries()].sort(([a], [b]) => a.localeCompare(b)));
const normalize = (value) => String(value ?? '').trim().toLowerCase().replace(/\s+/g, ' ');
const isIsoDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(String(value ?? '')) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
const daysBetween = (a, b) => Math.floor((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86400000);
const auditDate = '2026-07-06';

const baseline = loadRegistryV2Baseline(root);
const stablecoins = loadFiles(baseline.data_groups?.stablecoins ?? []);
const organizations = loadFiles(baseline.data_groups?.organizations ?? []);
const knownUnknowns = loadFiles(baseline.data_groups?.known_unknowns ?? []);
const stablecoinIds = new Set(stablecoins.map((row) => row.id));
const organizationIds = new Set(organizations.map((row) => row.id));

const critical = [];
const warnings = [];
const observations = [];
const duplicateIds = [];
const duplicateAssetTopics = [];
const duplicateDescriptions = [];
const invalidStablecoinRefs = [];
const invalidIssuerRefs = [];
const invalidSeverity = [];
const invalidDates = [];
const weakDescriptions = [];
const weakTopics = [];
const weakNotes = [];
const staleReviewRows = [];
const rowsByAsset = new Map();
const idSeen = new Map();
const assetTopicSeen = new Map();
const descriptionSeen = new Map();
const allowedSeverity = new Set(['low', 'medium', 'high']);
const genericUnknownText = new Set(['unknown', 'todo', 'tbd', 'tbc', 'placeholder', 'needs research', 'more research needed']);

for (const row of knownUnknowns) {
  const location = `${row.__file}[${row.__index}]`;
  if (!String(row.id ?? '').trim()) critical.push(`${location}: known-unknown id missing`);
  else if (idSeen.has(row.id)) {
    duplicateIds.push({ id: row.id, first: idSeen.get(row.id), second: location });
    critical.push(`duplicate known-unknown id ${row.id}`);
  } else idSeen.set(row.id, location);

  if (!stablecoinIds.has(row.stablecoin_id)) {
    invalidStablecoinRefs.push({ id: row.id ?? null, stablecoin_id: row.stablecoin_id ?? null });
    critical.push(`${row.id ?? location}: invalid stablecoin_id ${row.stablecoin_id}`);
  } else {
    const rows = rowsByAsset.get(row.stablecoin_id) ?? [];
    rows.push(row.id);
    rowsByAsset.set(row.stablecoin_id, rows);
  }

  if (row.issuer_id && !organizationIds.has(row.issuer_id)) {
    invalidIssuerRefs.push({ id: row.id ?? null, issuer_id: row.issuer_id });
    critical.push(`${row.id ?? location}: invalid issuer_id ${row.issuer_id}`);
  }

  const topic = normalize(row.topic);
  if (!topic || genericUnknownText.has(topic) || topic.length < 6) {
    weakTopics.push({ id: row.id ?? null, topic: row.topic ?? null });
    critical.push(`${row.id ?? location}: topic is missing or generic`);
  }

  const description = normalize(row.description);
  if (!description || genericUnknownText.has(description) || description.length < 50) {
    weakDescriptions.push({ id: row.id ?? null, description: row.description ?? null });
    critical.push(`${row.id ?? location}: description is missing, generic, or too short`);
  }

  const notes = normalize(row.notes);
  if (!notes || genericUnknownText.has(notes) || notes.length < 20) {
    weakNotes.push({ id: row.id ?? null, notes: row.notes ?? null });
    warnings.push(`${row.id ?? location}: notes are missing, generic, or unusually short`);
  }

  if (!allowedSeverity.has(row.severity)) {
    invalidSeverity.push({ id: row.id ?? null, severity: row.severity ?? null });
    critical.push(`${row.id ?? location}: invalid severity ${row.severity}`);
  }

  if (!isIsoDate(row.last_checked_at) || row.last_checked_at > auditDate) {
    invalidDates.push({ id: row.id ?? null, last_checked_at: row.last_checked_at ?? null });
    critical.push(`${row.id ?? location}: invalid or future last_checked_at ${row.last_checked_at}`);
  } else if (daysBetween(row.last_checked_at, auditDate) > 30) {
    staleReviewRows.push({ id: row.id, stablecoin_id: row.stablecoin_id, last_checked_at: row.last_checked_at });
  }

  if (row.stablecoin_id && topic) {
    const key = `${row.stablecoin_id}::${topic}`;
    if (assetTopicSeen.has(key)) duplicateAssetTopics.push({ key, ids: [assetTopicSeen.get(key), row.id] });
    else assetTopicSeen.set(key, row.id);
  }

  if (description) {
    if (descriptionSeen.has(description)) duplicateDescriptions.push({ ids: [descriptionSeen.get(description), row.id] });
    else descriptionSeen.set(description, row.id);
  }
}

for (const item of duplicateAssetTopics) warnings.push(`duplicate asset/topic pair ${item.key}: ${item.ids.join(', ')}`);
for (const item of duplicateDescriptions) warnings.push(`duplicate normalized known-unknown description: ${item.ids.join(', ')}`);

const uncoveredAssetIds = stablecoins.map((row) => row.id).filter((id) => !(rowsByAsset.get(id)?.length)).sort();
for (const id of uncoveredAssetIds) critical.push(`${id}: no known-unknown coverage`);

const placeholderFindings = [];
const explicitValueStates = { source_review_needed: 0, unknown: 0, not_recorded: 0, not_applicable: 0 };
const placeholderExact = new Set(['todo', 'tbd', 'tbc', 'placeholder', 'example', 'example value']);
const badUrlFragments = ['example.com', 'localhost', 'placeholder.invalid'];
const fieldLooksStructural = (key) => /(^id$|_id$|^slug$|name$|title$|url$|_url$|date$|_date$|address$|_address$|contract$|_contract$|identifier$|_identifier$)/i.test(key);
const fieldLooksUrl = (key) => /url$/i.test(key);
const fieldLooksDate = (key) => /(^date$|_date$|_at$|_from$|_to$)/i.test(key);
const scanValue = (value, context, keyPath = []) => {
  if (Array.isArray(value)) {
    value.forEach((item, index) => scanValue(item, context, [...keyPath, String(index)]));
    return;
  }
  if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) {
      if (key.startsWith('__')) continue;
      scanValue(child, context, [...keyPath, key]);
    }
    return;
  }
  if (typeof value !== 'string') return;
  const key = keyPath[keyPath.length - 1] ?? '';
  const normalized = normalize(value);
  if (Object.prototype.hasOwnProperty.call(explicitValueStates, normalized)) explicitValueStates[normalized] += 1;
  if (!fieldLooksStructural(key)) return;
  if (placeholderExact.has(normalized)) placeholderFindings.push({ ...context, field: keyPath.join('.'), value });
  if (fieldLooksUrl(key) && badUrlFragments.some((fragment) => normalized.includes(fragment))) placeholderFindings.push({ ...context, field: keyPath.join('.'), value });
  if (fieldLooksDate(key) && ['0000-00-00', '1970-01-01', '9999-12-31'].includes(normalized)) placeholderFindings.push({ ...context, field: keyPath.join('.'), value });
};

const scanGroups = Object.entries(baseline.data_groups ?? {});
const scannedFiles = new Set();
for (const [group, files] of scanGroups) {
  for (const file of files ?? []) {
    const dedupeKey = `${group}::${file}`;
    if (scannedFiles.has(dedupeKey)) continue;
    scannedFiles.add(dedupeKey);
    const rows = readRows(file);
    rows.forEach((row) => scanValue(row, { group, file, record_id: row.id ?? null }));
  }
}
for (const finding of placeholderFindings) critical.push(`${finding.file}:${finding.record_id ?? 'row'}:${finding.field} contains placeholder-like structural value ${finding.value}`);

const coverageCounts = stablecoins.map((row) => ({ stablecoin_id: row.id, count: rowsByAsset.get(row.id)?.length ?? 0 }));
const minCoverage = Math.min(...coverageCounts.map((row) => row.count));
const maxCoverage = Math.max(...coverageCounts.map((row) => row.count));

observations.push(`Audited ${knownUnknowns.length} known-unknown records across ${stablecoins.length} canonical stable assets.`);
observations.push(`Known-unknown coverage ranges from ${minCoverage} to ${maxCoverage} rows per asset.`);
observations.push(`${staleReviewRows.length} known-unknown rows are older than 30 days at the 2026-07-06 audit checkpoint.`);
observations.push(`Structural placeholder scan found ${placeholderFindings.length} findings.`);

const report = {
  schema_version: '1.0',
  audit_id: 'sog_registry_100_known_unknown_placeholder_integrity_pr308',
  audit_date: auditDate,
  baseline_id: baseline.baseline_id,
  audited_counts: {
    stable_assets: stablecoins.length,
    organizations: organizations.length,
    known_unknowns: knownUnknowns.length,
    assets_with_known_unknowns: rowsByAsset.size,
    scanned_group_file_pairs: scannedFiles.size
  },
  coverage: {
    uncovered_asset_ids: uncoveredAssetIds,
    min_rows_per_asset: minCoverage,
    max_rows_per_asset: maxCoverage,
    rows_per_asset: coverageCounts
  },
  integrity: {
    duplicate_ids: duplicateIds,
    duplicate_asset_topics: duplicateAssetTopics,
    duplicate_descriptions: duplicateDescriptions,
    invalid_stablecoin_refs: invalidStablecoinRefs,
    invalid_issuer_refs: invalidIssuerRefs,
    invalid_severity: invalidSeverity,
    invalid_dates: invalidDates,
    weak_topics: weakTopics,
    weak_descriptions: weakDescriptions,
    weak_notes: weakNotes,
    placeholder_findings: placeholderFindings
  },
  review_queues: {
    stale_over_30_days: staleReviewRows
  },
  distributions: {
    severity: countBy(knownUnknowns.map((row) => row.severity)),
    topic: countBy(knownUnknowns.map((row) => row.topic)),
    source_files: countBy(knownUnknowns.map((row) => row.__file)),
    explicit_value_states: explicitValueStates
  },
  findings: { critical, warnings, observations },
  result: critical.length === 0 ? 'pass_with_review_queues' : 'fail'
};

fs.mkdirSync(absolute('data/generated'), { recursive: true });
fs.writeFileSync(absolute('data/generated/registry-known-unknown-placeholder-integrity-audit.json'), `${JSON.stringify(report, null, 2)}\n`);

console.log(JSON.stringify({
  audit_id: report.audit_id,
  result: report.result,
  stable_assets: stablecoins.length,
  known_unknowns: knownUnknowns.length,
  assets_with_known_unknowns: rowsByAsset.size,
  critical_findings: critical.length,
  warnings: warnings.length,
  stale_over_30_days: staleReviewRows.length,
  placeholder_findings: placeholderFindings.length,
  min_rows_per_asset: minCoverage,
  max_rows_per_asset: maxCoverage
}, null, 2));

if (critical.length) {
  console.error('Critical findings:');
  critical.forEach((item) => console.error(`- ${item}`));
  process.exitCode = 1;
}
