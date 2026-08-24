import fs from 'node:fs';
import path from 'node:path';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const root = process.cwd();
const absolute = (relativePath) => path.join(root, relativePath);
const readJson = (relativePath) => JSON.parse(fs.readFileSync(absolute(relativePath), 'utf8'));
const fail = (message) => {
  console.error(`launch-date unresolved queue: ${message}`);
  process.exitCode = 1;
};

const queue = readJson('data/quality/launch-date-unresolved.json');
const supplementalQueuePath = 'data/quality/launch-date-unresolved-jpyr.json';
const supplementalQueue = fs.existsSync(absolute(supplementalQueuePath)) ? readJson(supplementalQueuePath) : { records: [] };
const baseline = loadRegistryV2Baseline(root);
const stablecoinFiles = baseline?.data_groups?.stablecoins;
const evidenceFiles = baseline?.data_groups?.evidence;
const reviewedInPr218 = new Set([
  'sog_st_brz', 'sog_st_honey', 'sog_st_usdz', 'sog_st_husd', 'sog_st_tryb', 'sog_st_usyc', 'sog_st_aecoin'
]);
const unresolvedReviewedInPr219 = new Set([
  'sog_st_agoraausd', 'sog_st_dsd', 'sog_st_esd', 'sog_st_eurt', 'sog_st_mim', 'sog_st_musd'
]);
const gyenLaunchEvidenceIds = new Set(['sog_src_gyen_launch_2021_pr219', 'sog_src_gyen_launch_recap_2021_pr219']);

if (!Array.isArray(stablecoinFiles) || stablecoinFiles.length === 0) throw new Error('registry-v2 baseline has no stablecoin data group');
if (!Array.isArray(evidenceFiles) || evidenceFiles.length === 0) throw new Error('registry-v2 baseline has no evidence data group');

const loadRows = (files, groupName) => files.flatMap((file) => {
  const rows = readJson(file);
  if (!Array.isArray(rows)) throw new Error(`${file} in ${groupName} must contain an array`);
  return rows;
});
const stablecoins = loadRows(stablecoinFiles, 'stablecoins');
const evidence = loadRows(evidenceFiles, 'evidence');

if (queue.schema_version !== '1.0') fail(`unexpected schema_version ${queue.schema_version}`);
if (!/^\d{4}-\d{2}-\d{2}$/.test(queue.frozen_at ?? '')) fail('frozen_at must be YYYY-MM-DD');
if (!Array.isArray(queue.records)) fail('records must be an array');
if (typeof queue.source_review !== 'string' || queue.source_review.length === 0) fail('source_review is required');
if (!Array.isArray(supplementalQueue.records)) fail(`${supplementalQueuePath}: records must be an array`);

const frozenRecords = Array.isArray(queue.records) ? queue.records : [];
const supplementalRecords = Array.isArray(supplementalQueue.records) ? supplementalQueue.records : [];
const records = [...frozenRecords, ...supplementalRecords];
const ids = records.map((row) => row.stablecoin_id);
const uniqueIds = new Set(ids);
if (uniqueIds.size !== ids.length) fail('duplicate stablecoin_id in combined queue');
if (queue.expected_total !== frozenRecords.length) fail(`frozen expected_total ${queue.expected_total} does not match ${frozenRecords.length} frozen records`);

const allowedCategories = new Set(['B', 'C', 'D']);
const categoryCounts = { B: 0, C: 0, D: 0 };
const frozenCategoryCounts = { B: 0, C: 0, D: 0 };
for (const [index, row] of records.entries()) {
  if (!row || typeof row !== 'object') { fail('every record must be an object'); continue; }
  if (typeof row.stablecoin_id !== 'string' || !row.stablecoin_id.startsWith('sog_st_')) fail('invalid stablecoin_id');
  if (!allowedCategories.has(row.category)) fail(`${row.stablecoin_id}: invalid category ${row.category}`);
  else {
    categoryCounts[row.category] += 1;
    if (index < frozenRecords.length) frozenCategoryCounts[row.category] += 1;
  }
  if (typeof row.reason_code !== 'string' || row.reason_code.length === 0) fail(`${row.stablecoin_id}: reason_code is required`);
  if (typeof row.review_note !== 'string' || row.review_note.length < 20) fail(`${row.stablecoin_id}: review_note is too short`);
  if (row.category === 'B' && (typeof row.best_known_range !== 'string' || row.best_known_range.length === 0)) fail(`${row.stablecoin_id}: category B requires best_known_range`);
  if (row.last_reviewed !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(row.last_reviewed)) fail(`${row.stablecoin_id}: last_reviewed must be YYYY-MM-DD`);
  if (row.reviewed_sources !== undefined) {
    if (!Array.isArray(row.reviewed_sources) || row.reviewed_sources.length === 0) fail(`${row.stablecoin_id}: reviewed_sources must be a non-empty array`);
    else {
      if (new Set(row.reviewed_sources).size !== row.reviewed_sources.length) fail(`${row.stablecoin_id}: reviewed_sources contains duplicates`);
      for (const url of row.reviewed_sources) if (typeof url !== 'string' || !url.startsWith('https://')) fail(`${row.stablecoin_id}: reviewed source must be HTTPS`);
    }
  }
  if (reviewedInPr218.has(row.stablecoin_id)) {
    if (row.last_reviewed !== '2026-06-28') fail(`${row.stablecoin_id}: PR #218 review date is missing`);
    if (!Array.isArray(row.reviewed_sources) || row.reviewed_sources.length < 2) fail(`${row.stablecoin_id}: PR #218 requires at least two reviewed sources`);
    if (row.category === 'D') fail(`${row.stablecoin_id}: PR #218 source trail must not remain Category D`);
  }
  if (unresolvedReviewedInPr219.has(row.stablecoin_id)) {
    if (row.last_reviewed !== '2026-06-28') fail(`${row.stablecoin_id}: PR #219 review date is missing`);
    if (!Array.isArray(row.reviewed_sources) || row.reviewed_sources.length < 2) fail(`${row.stablecoin_id}: PR #219 requires at least two reviewed sources`);
    if (typeof row.best_known_range !== 'string' || row.best_known_range.length === 0) fail(`${row.stablecoin_id}: PR #219 requires a bounded range`);
    if (row.category !== 'C') fail(`${row.stablecoin_id}: unresolved PR #219 boundary must remain Category C`);
  }
}

for (const reviewedId of reviewedInPr218) if (!uniqueIds.has(reviewedId)) fail(`${reviewedId}: PR #218 reviewed record is missing from queue`);
for (const reviewedId of unresolvedReviewedInPr219) if (!uniqueIds.has(reviewedId)) fail(`${reviewedId}: PR #219 unresolved record is missing from queue`);
for (const category of ['B', 'C', 'D']) {
  if (queue.category_counts?.[category] !== frozenCategoryCounts[category]) fail(`frozen category ${category} count ${queue.category_counts?.[category]} does not match ${frozenCategoryCounts[category]}`);
}

const stablecoinById = new Map(stablecoins.map((row) => [row.id, row]));
for (const id of uniqueIds) {
  const coin = stablecoinById.get(id);
  if (!coin) fail(`${id}: queue references missing canonical stablecoin`);
  else if (coin.launch_date !== null) fail(`${id}: queue record has non-null launch_date ${coin.launch_date}`);
}

const gyen = stablecoinById.get('sog_st_gyen');
if (!gyen) fail('sog_st_gyen: canonical stablecoin is missing');
else if (gyen.launch_date !== '2021-03-01') fail(`sog_st_gyen: expected launch_date 2021-03-01, found ${gyen.launch_date}`);
if (uniqueIds.has('sog_st_gyen')) fail('sog_st_gyen: resolved launch date must not remain in the unresolved queue');

const evidenceById = new Map(evidence.map((row) => [row.id, row]));
for (const evidenceId of gyenLaunchEvidenceIds) {
  const row = evidenceById.get(evidenceId);
  if (!row) { fail(`${evidenceId}: required GYEN launch evidence is missing`); continue; }
  const subjects = new Set([...(row.stablecoin_ids ?? []), row.stablecoin_id].filter(Boolean));
  if (!subjects.has('sog_st_gyen')) fail(`${evidenceId}: evidence is not linked to GYEN`);
  const scopes = new Set([...(row.claim_scopes ?? []), row.claim_scope].filter(Boolean));
  if (!scopes.has('launch_date')) fail(`${evidenceId}: launch_date claim scope is missing`);
  if (row.reliability !== 'high') fail(`${evidenceId}: launch evidence must remain high reliability`);
}

const nullLaunchIds = stablecoins.filter((row) => row.launch_date === null).map((row) => row.id).sort();
const queueIds = [...uniqueIds].sort();
const missingFromQueue = nullLaunchIds.filter((id) => !uniqueIds.has(id));
const extraInQueue = queueIds.filter((id) => !nullLaunchIds.includes(id));
if (missingFromQueue.length > 0) fail(`canonical null launch dates missing from queue: ${missingFromQueue.join(', ')}`);
if (extraInQueue.length > 0) fail(`queue contains records not in canonical null set: ${extraInQueue.join(', ')}`);
if (nullLaunchIds.length !== records.length) fail(`canonical null count ${nullLaunchIds.length} does not match combined queue total ${records.length}`);

if (!queue.policy?.canonical_day_required) fail('canonical_day_required policy must remain true');
if (!queue.policy?.keep_null_without_day_level_primary_evidence) fail('keep-null policy must remain true');
if (!queue.policy?.forbid_month_or_year_coercion) fail('month/year coercion guard must remain true');
if (!queue.policy?.forbid_exchange_listing_as_default_launch) fail('exchange-listing guard must remain true');
if (!queue.policy?.forbid_rebrand_or_migration_as_default_launch) fail('lineage guard must remain true');

if (typeof queue.source_review === 'string') {
  if (!fs.existsSync(absolute(queue.source_review))) fail(`source_review file is missing: ${queue.source_review}`);
  else {
    const review = fs.readFileSync(absolute(queue.source_review), 'utf8');
    for (const phrase of [`Total unresolved: ${frozenRecords.length}`, `Category B: ${frozenCategoryCounts.B}`, `Category C: ${frozenCategoryCounts.C}`, `Category D: ${frozenCategoryCounts.D}`]) {
      if (!review.includes(phrase)) fail(`source_review is missing aligned frozen summary: ${phrase}`);
    }
    for (const id of frozenRecords.map((row) => row.stablecoin_id).sort()) if (!review.includes(id)) fail(`source_review is missing frozen queue record ${id}`);
    if (!review.includes('GYEN is resolved to `2021-03-01`')) fail('source_review is missing the GYEN resolution statement');
  }
}

if (!process.exitCode) console.log(`launch-date unresolved queue valid: ${records.length} combined records (frozen ${frozenRecords.length} + supplemental ${supplementalRecords.length}; B ${categoryCounts.B}, C ${categoryCounts.C}, D ${categoryCounts.D}); GYEN resolved to 2021-03-01`);
