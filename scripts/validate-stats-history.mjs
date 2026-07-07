import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { isDeepStrictEqual } from 'node:util';
import { generateCurrentHistorySnapshot } from './stats/build-history-snapshot.mjs';

const root = process.cwd();
const historyPath = 'data/stats-history.json';
const reportPath = 'artifacts/stats-history-validation.json';
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');
const isSha256 = (value) => typeof value === 'string' && /^[a-f0-9]{64}$/.test(value);

const history = JSON.parse(fs.readFileSync(path.join(root, historyPath), 'utf8'));
const snapshots = Array.isArray(history.snapshots) ? history.snapshots : [];

check(history.schema_version === '1.0', 'history schema_version must be 1.0');
check(history.history_id === 'sog_stats_checkpoint_history_v1', 'history_id mismatch');
check(history.checkpoint_policy === 'append_only_reviewed_pr', 'checkpoint_policy must be append_only_reviewed_pr');
check(Array.isArray(history.snapshots) && snapshots.length > 0, 'history must contain at least one checkpoint snapshot');

const checkpointIds = new Set();
const assetCounts = new Set();
let previousAssetCount = -1;
let previousRecordedAt = '';

const transitionStatusMap = {
  migrations: 'migrated',
  rebrands: 'rebranded',
  orderly_wind_downs: 'winding_down',
  terminations: 'terminated',
  inactive_unresolved: 'inactive',
  collapses: 'collapsed'
};

for (const [index, snapshot] of snapshots.entries()) {
  const label = `snapshot[${index}] ${snapshot.checkpoint_id ?? '<missing>'}`;
  check(typeof snapshot.checkpoint_id === 'string' && snapshot.checkpoint_id.length > 0, `${label}: checkpoint_id missing`);
  check(!checkpointIds.has(snapshot.checkpoint_id), `${label}: duplicate checkpoint_id`);
  checkpointIds.add(snapshot.checkpoint_id);

  check(Number.isInteger(snapshot.asset_count) && snapshot.asset_count > 0, `${label}: asset_count must be a positive integer`);
  check(!assetCounts.has(snapshot.asset_count), `${label}: duplicate asset_count checkpoint`);
  assetCounts.add(snapshot.asset_count);
  check(snapshot.asset_count > previousAssetCount, `${label}: asset_count order must be strictly increasing`);
  previousAssetCount = snapshot.asset_count;

  check(/^\d{4}-\d{2}-\d{2}$/.test(snapshot.recorded_at ?? ''), `${label}: recorded_at must be YYYY-MM-DD`);
  check(snapshot.recorded_at >= previousRecordedAt, `${label}: recorded_at order must be non-decreasing`);
  previousRecordedAt = snapshot.recorded_at;

  check(isSha256(snapshot.input_digest_sha256), `${label}: input_digest_sha256 invalid`);
  check(isSha256(snapshot.stats_model_sha256), `${label}: stats_model_sha256 invalid`);
  check(isSha256(snapshot.snapshot_sha256), `${label}: snapshot_sha256 invalid`);

  const unsigned = structuredClone(snapshot);
  delete unsigned.snapshot_sha256;
  check(snapshot.snapshot_sha256 === sha256(JSON.stringify(unsigned)), `${label}: snapshot_sha256 mismatch`);

  check(snapshot.totals?.assets === snapshot.asset_count, `${label}: totals.assets must equal asset_count`);
  const lifecycleGroupTotal = Object.values(snapshot.lifecycle?.groups ?? {}).reduce((sum, value) => sum + value, 0);
  const lifecycleStatusTotal = Object.values(snapshot.lifecycle?.statuses ?? {}).reduce((sum, value) => sum + value, 0);
  check(lifecycleGroupTotal === snapshot.asset_count, `${label}: lifecycle groups must sum to asset_count`);
  check(lifecycleStatusTotal === snapshot.asset_count, `${label}: lifecycle statuses must sum to asset_count`);

  for (const [transition, status] of Object.entries(transitionStatusMap)) {
    const expected = snapshot.lifecycle?.statuses?.[status] ?? 0;
    check(snapshot.lifecycle?.transitions?.[transition] === expected, `${label}: transition ${transition} must equal status ${status} count`);
  }

  for (const [name, row] of Object.entries(snapshot.data_quality?.coverage ?? {})) {
    check(Number.isFinite(row.count) && Number.isFinite(row.denominator) && row.denominator > 0, `${label}: coverage ${name} requires positive denominator and numeric count`);
    check(row.count >= 0 && row.count <= row.denominator, `${label}: coverage ${name} count must be within denominator`);
    const expectedPercentage = Number(((row.count / row.denominator) * 100).toFixed(2));
    check(row.percentage === expectedPercentage, `${label}: coverage ${name} percentage mismatch`);
  }
}

const currentSnapshot = generateCurrentHistorySnapshot({ root });
const currentIndex = snapshots.findIndex((snapshot) => snapshot.checkpoint_id === currentSnapshot.checkpoint_id);
check(currentIndex >= 0, `current checkpoint missing from history: ${currentSnapshot.checkpoint_id}`);
if (currentIndex >= 0) check(isDeepStrictEqual(snapshots[currentIndex], currentSnapshot), 'current checkpoint snapshot differs from deterministic current stats snapshot');

const baseRef = process.env.SOG_STATS_HISTORY_BASE_REF;
let basePrefixCount = null;
if (baseRef) {
  try {
    const previousText = execFileSync('git', ['show', `${baseRef}:${historyPath}`], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    const previous = JSON.parse(previousText);
    const previousSnapshots = Array.isArray(previous.snapshots) ? previous.snapshots : [];
    basePrefixCount = previousSnapshots.length;
    check(history.schema_version === previous.schema_version, 'history schema_version changed without explicit migration');
    check(history.history_id === previous.history_id, 'history_id changed without explicit migration');
    check(history.checkpoint_policy === previous.checkpoint_policy, 'checkpoint_policy changed without explicit migration');
    check(snapshots.length >= previousSnapshots.length, 'history snapshot list was truncated');
    for (let index = 0; index < previousSnapshots.length; index += 1) {
      check(isDeepStrictEqual(snapshots[index], previousSnapshots[index]), `historical snapshot rewritten or reordered at index ${index}`);
    }
  } catch (error) {
    const stderr = String(error?.stderr ?? '');
    if (!stderr.includes('exists on disk, but not in') && !stderr.includes('does not exist in')) {
      failures.push(`failed to validate history prefix against ${baseRef}: ${error.message}`);
    }
  }
}

const report = {
  schema_version: '1.0',
  history_id: history.history_id,
  snapshot_count: snapshots.length,
  asset_counts: snapshots.map((snapshot) => snapshot.asset_count),
  current_checkpoint_id: currentSnapshot.checkpoint_id,
  current_snapshot_sha256: currentSnapshot.snapshot_sha256,
  base_ref: baseRef ?? null,
  base_prefix_count: basePrefixCount,
  failures,
  ok: failures.length === 0
};

fs.mkdirSync(path.join(root, 'artifacts'), { recursive: true });
fs.writeFileSync(path.join(root, reportPath), `${JSON.stringify(report, null, 2)}\n`);

if (failures.length) {
  console.error('Statistics history validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(JSON.stringify(report, null, 2));
