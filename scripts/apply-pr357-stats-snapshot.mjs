import fs from 'node:fs';
import { generateCurrentHistorySnapshot } from './stats/build-history-snapshot.mjs';

const historyPath = 'data/stats-history.json';
const checkpointPath = 'docs/migration/current-stats-history-checkpoint.json';
const history = JSON.parse(fs.readFileSync(historyPath, 'utf8'));
const checkpoint = JSON.parse(fs.readFileSync(checkpointPath, 'utf8'));
const snapshot = generateCurrentHistorySnapshot();

if (history.checkpoint_policy !== 'append_only_reviewed_pr') throw new Error('Stats history policy must remain append_only_reviewed_pr.');
if (!Array.isArray(history.snapshots) || history.snapshots.length === 0) throw new Error('Stats history has no reviewed snapshots.');
if (snapshot.checkpoint_id !== checkpoint.checkpoint_id) throw new Error(`Generated checkpoint ${snapshot.checkpoint_id} does not match ${checkpoint.checkpoint_id}.`);
if (snapshot.canonical_checkpoint_id !== checkpoint.canonical_checkpoint_id) throw new Error('Generated canonical checkpoint binding mismatch.');
if (snapshot.source_checkpoint_id !== checkpoint.source_checkpoint_id) throw new Error('Generated source checkpoint binding mismatch.');
if (snapshot.totals?.assets !== 110 || snapshot.totals?.evidence !== 551 || snapshot.totals?.market_access_records !== 4) {
  throw new Error(`Unexpected PR #357 totals: ${JSON.stringify(snapshot.totals)}`);
}

const existingIndex = history.snapshots.findIndex((row) => row.checkpoint_id === snapshot.checkpoint_id);
if (existingIndex >= 0) {
  const existing = history.snapshots[existingIndex];
  if (JSON.stringify(existing) !== JSON.stringify(snapshot)) throw new Error('Existing PR #357 snapshot differs from deterministic output.');
  console.log(JSON.stringify({ok: true, changed: false, snapshot}, null, 2));
  process.exit(0);
}

const previous = history.snapshots.at(-1);
if (previous?.checkpoint_id !== checkpoint.previous_history_checkpoint_id) {
  throw new Error(`Latest history checkpoint ${previous?.checkpoint_id} does not match predecessor ${checkpoint.previous_history_checkpoint_id}.`);
}
if (snapshot.source_checkpoint_id !== previous.checkpoint_id) throw new Error('Generated snapshot does not source the immediately preceding reviewed snapshot.');

history.snapshots.push(snapshot);
fs.writeFileSync(historyPath, `${JSON.stringify(history, null, 2)}\n`);
console.log(JSON.stringify({
  ok: true,
  changed: true,
  snapshot_count: history.snapshots.length,
  checkpoint_id: snapshot.checkpoint_id,
  canonical_checkpoint_id: snapshot.canonical_checkpoint_id,
  totals: snapshot.totals,
  stats_model_sha256: snapshot.stats_model_sha256,
  snapshot_sha256: snapshot.snapshot_sha256
}, null, 2));
