import fs from 'node:fs';
import { generateCurrentHistorySnapshot } from './stats/build-history-snapshot.mjs';

const historyPath = 'data/stats-history.json';
const checkpointPath = 'docs/migration/current-stats-history-checkpoint.json';
const history = JSON.parse(fs.readFileSync(historyPath, 'utf8'));
const checkpoint = JSON.parse(fs.readFileSync(checkpointPath, 'utf8'));
const snapshot = generateCurrentHistorySnapshot();

if (history.checkpoint_policy !== 'append_only_reviewed_pr') throw new Error('Stats history policy must remain append_only_reviewed_pr.');
if (!Array.isArray(history.snapshots) || history.snapshots.length === 0) throw new Error('Stats history has no snapshots.');
if (checkpoint.checkpoint_id !== 'sog_evidence_correction_batch_112_checkpoint_pr360_2026_07_14') throw new Error('Unexpected PR #360 checkpoint ID.');
if (checkpoint.checkpoint_kind !== 'non_growth_normalization_checkpoint') throw new Error('PR #360 checkpoint kind mismatch.');
if (snapshot.checkpoint_id !== checkpoint.checkpoint_id) throw new Error('Generated checkpoint ID mismatch.');
if (snapshot.canonical_checkpoint_id !== checkpoint.canonical_checkpoint_id) throw new Error('Generated canonical checkpoint binding mismatch.');
if (snapshot.source_checkpoint_id !== checkpoint.source_checkpoint_id) throw new Error('Generated source checkpoint binding mismatch.');
if (snapshot.totals?.assets !== 112 || snapshot.totals?.evidence !== 557 || snapshot.totals?.market_access_records !== 8) throw new Error(`Unexpected PR #360 totals: ${JSON.stringify(snapshot.totals)}`);
if (snapshot.evidence?.archive_index_count !== 387 || snapshot.evidence?.archive_not_recorded_count !== 170) throw new Error(`Unexpected PR #360 archive totals: ${JSON.stringify(snapshot.evidence)}`);

const existingIndex = history.snapshots.findIndex((row) => row.checkpoint_id === snapshot.checkpoint_id);
if (existingIndex >= 0) {
  if (existingIndex !== history.snapshots.length - 1) throw new Error('PR #360 snapshot exists but is not latest.');
  if (JSON.stringify(history.snapshots[existingIndex]) !== JSON.stringify(snapshot)) {
    history.snapshots[existingIndex] = snapshot;
    fs.writeFileSync(historyPath, `${JSON.stringify(history, null, 2)}\n`);
    console.log(JSON.stringify({ok:true,changed:true,replaced:true,snapshot},null,2));
  } else {
    console.log(JSON.stringify({ok:true,changed:false,snapshot},null,2));
  }
  process.exit(0);
}

const previous = history.snapshots.at(-1);
if (previous?.checkpoint_id !== checkpoint.previous_history_checkpoint_id) throw new Error(`Latest checkpoint ${previous?.checkpoint_id} does not match predecessor ${checkpoint.previous_history_checkpoint_id}.`);
if (snapshot.source_checkpoint_id !== previous.checkpoint_id) throw new Error('Generated snapshot does not source the latest reviewed checkpoint.');
history.snapshots.push(snapshot);
fs.writeFileSync(historyPath, `${JSON.stringify(history, null, 2)}\n`);
console.log(JSON.stringify({
  ok:true,
  changed:true,
  replaced:false,
  snapshot_count:history.snapshots.length,
  checkpoint_id:snapshot.checkpoint_id,
  canonical_checkpoint_id:snapshot.canonical_checkpoint_id,
  totals:snapshot.totals,
  evidence:snapshot.evidence,
  stats_model_sha256:snapshot.stats_model_sha256,
  snapshot_sha256:snapshot.snapshot_sha256
},null,2));
