import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const readJson = (relativePath) => JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
const fail = (message) => {
  console.error(`launch-date unresolved queue: ${message}`);
  process.exitCode = 1;
};

const queue = readJson('data/quality/launch-date-unresolved.json');
const baseline = readJson('docs/migration/registry-v2-baseline.json');
const stablecoinFiles = baseline?.data_groups?.stablecoins;

if (!Array.isArray(stablecoinFiles) || stablecoinFiles.length === 0) {
  throw new Error('registry-v2 baseline has no stablecoin data group');
}

const stablecoins = stablecoinFiles.flatMap((file) => {
  const rows = readJson(file);
  if (!Array.isArray(rows)) throw new Error(`${file} must contain an array`);
  return rows;
});

if (queue.schema_version !== '1.0') fail(`unexpected schema_version ${queue.schema_version}`);
if (!/^\d{4}-\d{2}-\d{2}$/.test(queue.frozen_at ?? '')) fail('frozen_at must be YYYY-MM-DD');
if (!Array.isArray(queue.records)) fail('records must be an array');

const records = Array.isArray(queue.records) ? queue.records : [];
const ids = records.map((row) => row.stablecoin_id);
const uniqueIds = new Set(ids);
if (uniqueIds.size !== ids.length) fail('duplicate stablecoin_id in queue');
if (queue.expected_total !== records.length) fail(`expected_total ${queue.expected_total} does not match ${records.length} records`);

const allowedCategories = new Set(['B', 'C', 'D']);
const categoryCounts = { B: 0, C: 0, D: 0 };
for (const row of records) {
  if (!row || typeof row !== 'object') {
    fail('every record must be an object');
    continue;
  }
  if (typeof row.stablecoin_id !== 'string' || !row.stablecoin_id.startsWith('sog_st_')) fail('invalid stablecoin_id');
  if (!allowedCategories.has(row.category)) fail(`${row.stablecoin_id}: invalid category ${row.category}`);
  else categoryCounts[row.category] += 1;
  if (typeof row.reason_code !== 'string' || row.reason_code.length === 0) fail(`${row.stablecoin_id}: reason_code is required`);
  if (typeof row.review_note !== 'string' || row.review_note.length < 20) fail(`${row.stablecoin_id}: review_note is too short`);
  if (row.category === 'B' && (typeof row.best_known_range !== 'string' || row.best_known_range.length === 0)) {
    fail(`${row.stablecoin_id}: category B requires best_known_range`);
  }
}

for (const category of ['B', 'C', 'D']) {
  if (queue.category_counts?.[category] !== categoryCounts[category]) {
    fail(`category ${category} count ${queue.category_counts?.[category]} does not match ${categoryCounts[category]}`);
  }
}

const stablecoinById = new Map(stablecoins.map((row) => [row.id, row]));
for (const id of uniqueIds) {
  const coin = stablecoinById.get(id);
  if (!coin) fail(`${id}: queue references missing canonical stablecoin`);
  else if (coin.launch_date !== null) fail(`${id}: queue record has non-null launch_date ${coin.launch_date}`);
}

const nullLaunchIds = stablecoins
  .filter((row) => row.launch_date === null)
  .map((row) => row.id)
  .sort();
const queueIds = [...uniqueIds].sort();

const missingFromQueue = nullLaunchIds.filter((id) => !uniqueIds.has(id));
const extraInQueue = queueIds.filter((id) => !nullLaunchIds.includes(id));
if (missingFromQueue.length > 0) fail(`canonical null launch dates missing from queue: ${missingFromQueue.join(', ')}`);
if (extraInQueue.length > 0) fail(`queue contains records not in canonical null set: ${extraInQueue.join(', ')}`);
if (nullLaunchIds.length !== queue.expected_total) fail(`canonical null count ${nullLaunchIds.length} does not match expected_total ${queue.expected_total}`);

if (!queue.policy?.canonical_day_required) fail('canonical_day_required policy must remain true');
if (!queue.policy?.keep_null_without_day_level_primary_evidence) fail('keep-null policy must remain true');
if (!queue.policy?.forbid_month_or_year_coercion) fail('month/year coercion guard must remain true');
if (!queue.policy?.forbid_exchange_listing_as_default_launch) fail('exchange-listing guard must remain true');
if (!queue.policy?.forbid_rebrand_or_migration_as_default_launch) fail('lineage guard must remain true');

if (!process.exitCode) {
  console.log(`launch-date unresolved queue valid: ${records.length} records (B ${categoryCounts.B}, C ${categoryCounts.C}, D ${categoryCounts.D})`);
}
