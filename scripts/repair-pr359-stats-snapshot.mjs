import fs from 'node:fs';
import { generateCurrentHistorySnapshot } from './stats/build-history-snapshot.mjs';

const historyPath = 'data/stats-history.json';
const checkpointPath = 'docs/migration/current-stats-history-checkpoint.json';
const history = JSON.parse(fs.readFileSync(historyPath, 'utf8'));
const checkpoint = JSON.parse(fs.readFileSync(checkpointPath, 'utf8'));
const snapshot = generateCurrentHistorySnapshot();

if (checkpoint.checkpoint_id !== 'sog_market_access_pilot_2_112_checkpoint_pr359_2026_07_13') throw new Error('Unexpected PR #359 checkpoint ID.');
if (checkpoint.checkpoint_kind !== 'non_growth_normalization_checkpoint') throw new Error('PR #359 must use non_growth_normalization_checkpoint.');
if (snapshot.checkpoint_id !== checkpoint.checkpoint_id) throw new Error('Generated snapshot checkpoint mismatch.');
if (snapshot.checkpoint_kind !== checkpoint.checkpoint_kind) throw new Error('Generated snapshot kind mismatch.');
if (snapshot.totals?.assets !== 112 || snapshot.totals?.evidence !== 557 || snapshot.totals?.market_access_records !== 8) throw new Error(`Unexpected PR #359 totals: ${JSON.stringify(snapshot.totals)}`);

const existingIndex = history.snapshots.findIndex((row) => row.checkpoint_id === checkpoint.checkpoint_id);
if (existingIndex < 0) throw new Error('Existing PR #359 snapshot missing.');
if (existingIndex !== history.snapshots.length - 1) throw new Error('PR #359 snapshot must be the latest history row.');
if (history.snapshots[existingIndex - 1]?.checkpoint_id !== checkpoint.source_checkpoint_id) throw new Error('PR #359 predecessor mismatch.');

history.snapshots[existingIndex] = snapshot;
fs.writeFileSync(historyPath, `${JSON.stringify(history, null, 2)}\n`);
console.log(JSON.stringify({
  ok: true,
  checkpoint_id: snapshot.checkpoint_id,
  checkpoint_kind: snapshot.checkpoint_kind,
  stats_model_sha256: snapshot.stats_model_sha256,
  snapshot_sha256: snapshot.snapshot_sha256,
  totals: snapshot.totals
}, null, 2));
