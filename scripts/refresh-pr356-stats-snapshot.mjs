import fs from 'node:fs';
import { generateCurrentHistorySnapshot } from './stats/build-history-snapshot.mjs';

const historyPath = 'data/stats-history.json';
const history = JSON.parse(fs.readFileSync(historyPath, 'utf8'));
const snapshot = generateCurrentHistorySnapshot();

if (history.checkpoint_policy !== 'append_only_reviewed_pr') {
  throw new Error('Statistics history policy must remain append_only_reviewed_pr.');
}
if (!Array.isArray(history.snapshots) || history.snapshots.length < 2) {
  throw new Error('Statistics history must contain a reviewed predecessor and current snapshot.');
}

const currentIndex = history.snapshots.findIndex((row) => row.checkpoint_id === snapshot.checkpoint_id);
if (currentIndex < 0) {
  throw new Error(`Current PR #356 snapshot ${snapshot.checkpoint_id} is missing.`);
}
if (currentIndex !== history.snapshots.length - 1) {
  throw new Error('PR #356 snapshot must remain the final history entry.');
}

const predecessor = history.snapshots[currentIndex - 1];
if (snapshot.source_checkpoint_id !== predecessor.checkpoint_id) {
  throw new Error(`PR #356 snapshot predecessor mismatch: ${snapshot.source_checkpoint_id} != ${predecessor.checkpoint_id}`);
}
if (snapshot.totals?.assets !== 110 || snapshot.totals?.evidence !== 551 || snapshot.totals?.market_access_records !== 4) {
  throw new Error(`Unexpected PR #356 totals: ${JSON.stringify(snapshot.totals)}`);
}

const previousSnapshot = history.snapshots[currentIndex];
history.snapshots[currentIndex] = snapshot;
fs.writeFileSync(historyPath, `${JSON.stringify(history, null, 2)}\n`);

console.log(JSON.stringify({
  ok: true,
  checkpoint_id: snapshot.checkpoint_id,
  previous_snapshot_sha256: previousSnapshot.snapshot_sha256,
  stats_model_sha256: snapshot.stats_model_sha256,
  snapshot_sha256: snapshot.snapshot_sha256,
  totals: snapshot.totals
}, null, 2));
