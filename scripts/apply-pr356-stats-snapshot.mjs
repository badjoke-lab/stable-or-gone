import fs from 'node:fs';
import { generateCurrentHistorySnapshot } from './stats/build-history-snapshot.mjs';

const historyPath = 'data/stats-history.json';
const checkpointPath = 'docs/migration/current-stats-history-checkpoint.json';
const history = JSON.parse(fs.readFileSync(historyPath, 'utf8'));
const checkpoint = JSON.parse(fs.readFileSync(checkpointPath, 'utf8'));
const snapshot = generateCurrentHistorySnapshot();

if (history.checkpoint_policy !== 'append_only_reviewed_pr') {
  throw new Error('Stats history policy is not append_only_reviewed_pr.');
}
if (!Array.isArray(history.snapshots) || history.snapshots.length === 0) {
  throw new Error('Stats history has no reviewed root snapshot.');
}
if (snapshot.checkpoint_id !== checkpoint.checkpoint_id) {
  throw new Error(`Generated snapshot ${snapshot.checkpoint_id} does not match current history checkpoint ${checkpoint.checkpoint_id}.`);
}
if (snapshot.canonical_checkpoint_id !== checkpoint.canonical_checkpoint_id) {
  throw new Error('Generated snapshot canonical checkpoint binding mismatch.');
}
if (snapshot.source_checkpoint_id !== checkpoint.source_checkpoint_id) {
  throw new Error('Generated snapshot source checkpoint binding mismatch.');
}
if (snapshot.totals?.assets !== 110 || snapshot.totals?.evidence !== 551) {
  throw new Error(`Unexpected PR #356 totals: assets=${snapshot.totals?.assets}, evidence=${snapshot.totals?.evidence}.`);
}

const existingIndex = history.snapshots.findIndex((row) => row.checkpoint_id === snapshot.checkpoint_id);
if (existingIndex >= 0) {
  const existing = history.snapshots[existingIndex];
  if (JSON.stringify(existing) !== JSON.stringify(snapshot)) {
    throw new Error('Existing PR #356 snapshot differs from deterministic generator output.');
  }
  console.log(JSON.stringify({ ok: true, changed: false, snapshot }, null, 2));
  process.exit(0);
}

const previous = history.snapshots.at(-1);
if (previous?.checkpoint_id !== checkpoint.previous_history_checkpoint_id) {
  throw new Error(`Latest history checkpoint ${previous?.checkpoint_id} does not match required predecessor ${checkpoint.previous_history_checkpoint_id}.`);
}
if (snapshot.source_checkpoint_id !== previous.checkpoint_id) {
  throw new Error('Generated snapshot does not source the immediately preceding reviewed snapshot.');
}

history.snapshots.push(snapshot);
fs.writeFileSync(historyPath, `${JSON.stringify(history, null, 2)}\n`);
console.log(JSON.stringify({
  ok: true,
  changed: true,
  snapshot_count: history.snapshots.length,
  checkpoint_id: snapshot.checkpoint_id,
  evidence: snapshot.totals.evidence,
  stats_model_sha256: snapshot.stats_model_sha256,
  snapshot_sha256: snapshot.snapshot_sha256,
}, null, 2));
