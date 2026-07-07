import crypto from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { generateStats } from '../build-stats.mjs';

const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');

function countsOnly(distribution = {}) {
  return Object.fromEntries(Object.entries(distribution).map(([key, row]) => [key, row.count]));
}

export function buildHistorySnapshot(stats) {
  const snapshot = {
    checkpoint_id: stats.checkpoint_id,
    recorded_at: stats.generated_at.slice(0, 10),
    asset_count: stats.totals.assets,
    registry_version: stats.registry_version,
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
  return buildHistorySnapshot(generateStats(options));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  console.log(`${JSON.stringify(generateCurrentHistorySnapshot(), null, 2)}\n`);
}
