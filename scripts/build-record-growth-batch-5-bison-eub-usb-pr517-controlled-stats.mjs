import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { buildPr517GeneratedState } from './build-record-growth-batch-5-bison-eub-usb-pr517.mjs';
import { generateCurrentHistorySnapshot } from './stats/build-history-snapshot.mjs';

const root = process.cwd();
const read = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const write = (file, value) => {
  const absolute = path.join(root, file);
  fs.mkdirSync(path.dirname(absolute), { recursive: true });
  fs.writeFileSync(absolute, `${JSON.stringify(value, null, 2)}\n`);
};
const copyToArtifact = (file) => {
  const source = path.join(root, file);
  const target = path.join(root, 'artifacts/pr517-generated-state', file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
};

export function buildPr517ControlledStatsState() {
  buildPr517GeneratedState();

  const checkpointPath = 'docs/migration/current-stats-history-checkpoint.json';
  const checkpoint = read(checkpointPath);
  checkpoint.checkpoint_kind = 'controlled_growth_checkpoint';
  write(checkpointPath, checkpoint);

  const historyPath = 'data/stats-history.json';
  const history = read(historyPath);
  history.snapshots = history.snapshots.filter((row) => row.checkpoint_id !== checkpoint.checkpoint_id);
  const snapshot = generateCurrentHistorySnapshot({ root });
  history.snapshots.push(snapshot);
  write(historyPath, history);

  copyToArtifact(checkpointPath);
  copyToArtifact(historyPath);

  return { checkpoint, snapshot };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const result = buildPr517ControlledStatsState();
  console.log(JSON.stringify({
    ok: true,
    checkpoint_id: result.checkpoint.checkpoint_id,
    checkpoint_kind: result.checkpoint.checkpoint_kind,
    snapshot_sha256: result.snapshot.snapshot_sha256,
    assets: result.snapshot.totals.assets,
    evidence: result.snapshot.totals.evidence,
    deployments: result.snapshot.totals.deployments
  }, null, 2));
}
