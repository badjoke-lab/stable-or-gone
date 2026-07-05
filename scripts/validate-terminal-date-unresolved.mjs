import fs from 'node:fs';
import path from 'node:path';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const root = process.cwd();
const readJson = (relativePath) => JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
const fail = (message) => {
  console.error(`terminal-date unresolved queue: ${message}`);
  process.exitCode = 1;
};

const queue = readJson('data/quality/terminal-date-unresolved.json');
const baseline = loadRegistryV2Baseline(root);
const stablecoinFiles = baseline?.data_groups?.stablecoins;
if (!Array.isArray(stablecoinFiles) || stablecoinFiles.length === 0) throw new Error('current registry baseline has no stablecoin data group');

const baseStablecoins = stablecoinFiles.flatMap((file) => {
  const rows = readJson(file);
  if (!Array.isArray(rows)) throw new Error(`${file} must contain an array`);
  return rows;
});
const overrideRows = [...readJson('data/stablecoin-overrides-pr033.json'), ...readJson('data/stablecoin-overrides-pr034.json')];
const overrideById = new Map(overrideRows.map((row) => [row.id, row]));
const stablecoins = baseStablecoins.map((row) => ({ ...row, ...(overrideById.get(row.id) ?? {}) }));

if (queue.schema_version !== '1.0') fail(`unexpected schema_version ${queue.schema_version}`);
if (!/^\d{4}-\d{2}-\d{2}$/.test(queue.frozen_at ?? '')) fail('frozen_at must be YYYY-MM-DD');
if (!Array.isArray(queue.records)) fail('records must be an array');

const records = Array.isArray(queue.records) ? queue.records : [];
const ids = records.map((row) => row.stablecoin_id);
const uniqueIds = new Set(ids);
if (uniqueIds.size !== ids.length) fail('duplicate stablecoin_id in queue');
if (queue.expected_total !== records.length) fail(`expected_total ${queue.expected_total} does not match ${records.length} records`);

const terminalStatuses = new Set(['failed', 'discontinued', 'migrated', 'rebranded']);
const stablecoinById = new Map(stablecoins.map((row) => [row.id, row]));
for (const row of records) {
  if (!row || typeof row !== 'object') {
    fail('every record must be an object');
    continue;
  }
  if (typeof row.stablecoin_id !== 'string' || !row.stablecoin_id.startsWith('sog_st_')) fail('invalid stablecoin_id');
  if (!terminalStatuses.has(row.canonical_status)) fail(`${row.stablecoin_id}: invalid canonical_status ${row.canonical_status}`);
  if (typeof row.boundary_type !== 'string' || row.boundary_type.length === 0) fail(`${row.stablecoin_id}: boundary_type is required`);
  if (typeof row.reason_code !== 'string' || row.reason_code.length === 0) fail(`${row.stablecoin_id}: reason_code is required`);
  if (typeof row.review_note !== 'string' || row.review_note.length < 40) fail(`${row.stablecoin_id}: review_note is too short`);
  if (!Array.isArray(row.rejected_shortcuts) || row.rejected_shortcuts.length === 0) fail(`${row.stablecoin_id}: rejected_shortcuts are required`);
  if (typeof row.future_review_target !== 'string' || row.future_review_target.length === 0) fail(`${row.stablecoin_id}: future_review_target is required`);
  const coin = stablecoinById.get(row.stablecoin_id);
  if (!coin) {
    fail(`${row.stablecoin_id}: queue references missing canonical stablecoin`);
    continue;
  }
  if (coin.status !== row.canonical_status) fail(`${row.stablecoin_id}: canonical status ${coin.status} does not match ${row.canonical_status}`);
  if (coin.discontinued_date !== null) fail(`${row.stablecoin_id}: queue record has non-null discontinued_date ${coin.discontinued_date}`);
}

const canonicalUnresolvedIds = stablecoins.filter((row) => terminalStatuses.has(row.status) && row.discontinued_date === null).map((row) => row.id).sort();
const queueIds = [...uniqueIds].sort();
const missingFromQueue = canonicalUnresolvedIds.filter((id) => !uniqueIds.has(id));
const extraInQueue = queueIds.filter((id) => !canonicalUnresolvedIds.includes(id));
if (missingFromQueue.length > 0) fail(`canonical terminal-date nulls missing from queue: ${missingFromQueue.join(', ')}`);
if (extraInQueue.length > 0) fail(`queue contains records outside canonical terminal null set: ${extraInQueue.join(', ')}`);
if (canonicalUnresolvedIds.length !== queue.expected_total) fail(`canonical unresolved terminal count ${canonicalUnresolvedIds.length} does not match expected_total ${queue.expected_total}`);

for (const flag of ['canonical_day_required','keep_null_without_matching_terminal_boundary_evidence','forbid_depeg_as_default_terminal_date','forbid_last_commit_as_shutdown_date','forbid_migration_start_as_default_final_end','forbid_retrospective_source_date_as_effective_date']) {
  if (queue.policy?.[flag] !== true) fail(`policy flag ${flag} must remain true`);
}

if (!process.exitCode) console.log(`terminal-date unresolved queue valid: ${records.length} records (${queueIds.join(', ')})`);
