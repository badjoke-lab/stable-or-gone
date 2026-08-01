import fs from 'node:fs';
import path from 'node:path';

import { generateCurrentHistorySnapshot } from './stats/build-history-snapshot.mjs';

const root = process.cwd();
const historyPath = path.join(root, 'data/stats-history.json');
const activeWorkstreamPath = path.join(root, 'scripts/validate-active-workstream.mjs');
const scriptPath = path.join(root, 'scripts/finalize-pr500-stats-history.mjs');
const workflowPath = path.join(root, '.github/workflows/pr500-finalize-stats-history.yml');

const pr498Id = 'sog_stats_pr498_record_growth_batch_4_mnee_2026_07_31';
const pr500Id = 'sog_stats_pr500_mnee_evidence_archive_maintenance_2026_08_01';
const expectedPr498Hash = '379d2dee89c6b6a334a5edef5d7c6693b3b35dcbd265dd705f045aa99ecf54b3';
const expectedPr500Hash = 'f3d8b10c38ee34dbe95a285a2cd2734e8c19c259392a960733d0aff15bbdb71a';

const history = JSON.parse(fs.readFileSync(historyPath, 'utf8'));
if (!Array.isArray(history.snapshots)) throw new Error('stats history snapshots missing');
const pr498 = history.snapshots.find((row) => row.checkpoint_id === pr498Id);
if (!pr498 || pr498.snapshot_sha256 !== expectedPr498Hash) {
  throw new Error('immutable PR #498 stats snapshot is missing or changed');
}

const generated = generateCurrentHistorySnapshot();
if (generated.checkpoint_id !== pr500Id) throw new Error(`unexpected generated checkpoint ${generated.checkpoint_id}`);
if (generated.snapshot_sha256 !== expectedPr500Hash) throw new Error(`unexpected generated PR #500 snapshot hash ${generated.snapshot_sha256}`);

const existingIndex = history.snapshots.findIndex((row) => row.checkpoint_id === pr500Id);
if (existingIndex >= 0) {
  if (JSON.stringify(history.snapshots[existingIndex]) !== JSON.stringify(generated)) {
    throw new Error('existing PR #500 snapshot differs from deterministic output');
  }
  if (existingIndex !== history.snapshots.length - 1) throw new Error('PR #500 snapshot is not the last history row');
} else {
  history.snapshots.push(generated);
}

const ids = history.snapshots.map((row) => row.checkpoint_id);
if (new Set(ids).size !== ids.length) throw new Error('duplicate stats checkpoint IDs detected');
fs.writeFileSync(historyPath, `${JSON.stringify(history, null, 2)}\n`);
fs.writeFileSync(activeWorkstreamPath, "import './validate-mnee-evidence-archive-maintenance-pr500.mjs';\n");

fs.rmSync(scriptPath, { force: true });
fs.rmSync(workflowPath, { force: true });

console.log(JSON.stringify({
  ok: true,
  appended_checkpoint: generated.checkpoint_id,
  snapshot_sha256: generated.snapshot_sha256,
  preserved_checkpoint: pr498.checkpoint_id,
  preserved_snapshot_sha256: pr498.snapshot_sha256,
  history_length: history.snapshots.length,
  active_workstream: 'validate-mnee-evidence-archive-maintenance-pr500.mjs',
  temporary_files_removed: true
}, null, 2));
