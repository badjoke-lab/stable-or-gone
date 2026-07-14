import fs from 'node:fs';
import path from 'node:path';
import { isDeepStrictEqual } from 'node:util';
import { generateCurrentHistorySnapshot } from './stats/build-history-snapshot.mjs';

const root = process.cwd();
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const writeJson = (file, value) => fs.writeFileSync(path.join(root, file), `${JSON.stringify(value, null, 2)}\n`);

const checkpoint = readJson('docs/migration/current-stats-history-checkpoint.json');
if (checkpoint.checkpoint_id !== 'sog_tier_a_dossier_batch_4_112_checkpoint_pr364_2026_07_14') {
  throw new Error(`Unexpected current statistics checkpoint: ${checkpoint.checkpoint_id}`);
}

const snapshot = generateCurrentHistorySnapshot({ root });
if (snapshot.checkpoint_id !== checkpoint.checkpoint_id) {
  throw new Error(`Generated checkpoint mismatch: ${snapshot.checkpoint_id}`);
}

const history = readJson('data/stats-history.json');
const matches = history.snapshots
  .map((row, index) => ({ row, index }))
  .filter(({ row }) => row.checkpoint_id === checkpoint.checkpoint_id);
if (matches.length !== 1) {
  throw new Error(`Expected exactly one PR #364 statistics snapshot, found ${matches.length}`);
}
const index = matches[0].index;
const changed = !isDeepStrictEqual(history.snapshots[index], snapshot);
history.snapshots[index] = snapshot;
writeJson('data/stats-history.json', history);

const handoffFile = 'docs/migration/tier-a-batch-4-pr364-reviewed-handoff.json';
const handoff = readJson(handoffFile);
if (handoff.stats_history_checkpoint_id !== checkpoint.checkpoint_id) {
  throw new Error('PR #364 handoff does not bind the current statistics checkpoint');
}
handoff.stats_model_sha256 = snapshot.stats_model_sha256;
handoff.stats_snapshot_sha256 = snapshot.snapshot_sha256;
writeJson(handoffFile, handoff);

console.log(JSON.stringify({
  ok: true,
  checkpoint_id: checkpoint.checkpoint_id,
  snapshot_changed: changed,
  stats_model_sha256: snapshot.stats_model_sha256,
  stats_snapshot_sha256: snapshot.snapshot_sha256,
  totals: snapshot.totals
}, null, 2));
