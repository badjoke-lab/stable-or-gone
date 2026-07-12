import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { generateStats } from '../build-stats.mjs';

const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');
const historyCheckpointPath = 'docs/migration/current-stats-history-checkpoint.json';

function countsOnly(distribution = {}) {
  return Object.fromEntries(Object.entries(distribution).map(([key, row]) => [key, row.count]));
}

function loadHistoryCheckpoint(root) {
  const absolute = path.join(root, historyCheckpointPath);
  if (!fs.existsSync(absolute)) return null;
  return JSON.parse(fs.readFileSync(absolute, 'utf8'));
}

export function buildHistorySnapshot(stats, options = {}) {
  const historyCheckpoint = options.historyCheckpoint ?? null;
  if (historyCheckpoint) {
    if (historyCheckpoint.asset_count !== stats.totals.assets) {
      throw new Error(`History checkpoint asset_count ${historyCheckpoint.asset_count} does not match deterministic stats asset count ${stats.totals.assets}`);
    }
    const canonicalCheckpointId = historyCheckpoint.canonical_checkpoint_id ?? historyCheckpoint.source_checkpoint_id;
    if (canonicalCheckpointId !== stats.checkpoint_id) {
      throw new Error(`History checkpoint canonical source ${canonicalCheckpointId} does not match deterministic stats checkpoint ${stats.checkpoint_id}`);
    }
  }

  const snapshot = {
    checkpoint_id: historyCheckpoint?.checkpoint_id ?? stats.checkpoint_id,
    ...(historyCheckpoint ? {
      checkpoint_kind: historyCheckpoint.checkpoint_kind,
      source_checkpoint_id: historyCheckpoint.source_checkpoint_id,
      ...(historyCheckpoint.canonical_checkpoint_id ? { canonical_checkpoint_id: historyCheckpoint.canonical_checkpoint_id } : {})
    } : {}),
    recorded_at: historyCheckpoint?.recorded_at ?? stats.generated_at.slice(0, 10),
    asset_count: stats.totals.assets,
    registry_version: historyCheckpoint?.registry_version ?? stats.registry_version,
    input_digest_sha256: stats.input_digest_sha256,
    stats_model_sha256: sha256(JSON.stringify(stats)),
    totals: stats.totals,
    lifecycle: {
      groups: countsOnly(stats.lifecycle.groups),
      statuses: countsOnly(stats.lifecycle.statuses),
      transitions: stats.lifecycle.transitions
    },
    data_quality: {
      coverage: stats.data_quality.coverage,
      evidence_per_asset: {
        average: stats.data_quality.evidence_per_asset.average,
        median: stats.data_quality.evidence_per_asset.median,
        distribution: countsOnly(stats.data_quality.evidence_per_asset.distribution)
      },
      known_unknowns: stats.data_quality.known_unknowns,
      verification_recency: countsOnly(stats.data_quality.verification_recency),
      typed_event_details: stats.data_quality.typed_event_details
    }
  };
  snapshot.snapshot_sha256 = sha256(JSON.stringify(snapshot));
  return snapshot;
}

export function generateCurrentHistorySnapshot(options = {}) {
  const root = options.root ?? process.cwd();
  const historyCheckpoint = loadHistoryCheckpoint(root);
  return buildHistorySnapshot(generateStats(options), { historyCheckpoint });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  console.log(`${JSON.stringify(generateCurrentHistorySnapshot(), null, 2)}\n`);
}
