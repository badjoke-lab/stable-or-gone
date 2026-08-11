import fs from 'node:fs';
import path from 'node:path';
import { generateCurrentHistorySnapshot } from './stats/build-history-snapshot.mjs';

const root = process.cwd();
const read = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const write = (file, value) => fs.writeFileSync(path.join(root, file), `${JSON.stringify(value, null, 2)}\n`);

const authorityPath = 'config/evidence-archive-payload-verification-batch-2-implementation-authority.json';
const checkpointPath = 'docs/migration/current-canonical-checkpoint.json';
const statsCheckpointPath = 'docs/migration/current-stats-history-checkpoint.json';
const releaseBaselinePath = 'docs/migration/registry-release-integrity-baseline.json';
const statsHistoryPath = 'data/stats-history.json';
const resultPath = 'docs/migration/evidence-archive-payload-verification-batch-2-implementation-pr552.json';

const canonicalCheckpointId = 'sog_evidence_archive_payload_verification_batch_2_canonical_119_checkpoint_pr552_2026_08_12';
const statsCheckpointId = 'sog_stats_evidence_archive_payload_verification_batch_2_pr552_2026_08_12';
const releaseBaselineId = 'sog_release_integrity_pr552_119_assets_2026_08_12';

function assertAuthority(authority) {
  if (authority.status !== 'approved_bounded_implementation') throw new Error('Batch 2 implementation authority is not approved');
  if (authority.authorized_archive_additions?.length !== 8) throw new Error('Authority must bind exactly eight archive additions');
  if (authority.no_safe_change?.length !== 2) throw new Error('Authority must preserve exactly two no-safe-change records');
  if (authority.implementation_exit !== 'REVIEW_GATE') throw new Error('Implementation exit must remain REVIEW_GATE');
}

function applyArchives(authority) {
  const byFile = new Map();
  for (const item of authority.authorized_archive_additions) {
    if (!byFile.has(item.source_file)) byFile.set(item.source_file, []);
    byFile.get(item.source_file).push(item);
  }

  const changed = [];
  for (const [file, items] of byFile) {
    const rows = read(file);
    const targets = new Map(items.map((item) => [item.evidence_id, item]));
    const seen = new Set();
    const next = rows.map((row) => {
      const item = targets.get(row.id);
      if (!item) return row;
      seen.add(row.id);
      if (String(row.archived_url ?? '').trim()) {
        if (row.archived_url !== item.archived_url) throw new Error(`${row.id}: unexpected pre-existing archived_url`);
        return row;
      }
      changed.push({ evidence_id: row.id, source_file: file, archived_url: item.archived_url });
      return { ...row, archived_url: item.archived_url };
    });
    for (const item of items) if (!seen.has(item.evidence_id)) throw new Error(`${item.evidence_id}: canonical Evidence row not found in ${file}`);
    write(file, next);
  }
  if (changed.length !== 8) throw new Error(`Expected exactly eight new archived_url values, got ${changed.length}`);
  return changed;
}

function updateCheckpoint(base) {
  const expectedCounts = { ...(base.expected_counts ?? {}) };
  const counts = { ...(base.counts ?? {}) };
  counts.archive_index_count = 471;
  counts.archive_not_recorded_count = 114;
  return {
    schema_version: '1.0',
    status: 'reviewed_non_growth_maintenance_checkpoint',
    checkpoint_id: canonicalCheckpointId,
    checkpoint_kind: 'non_growth_archive_maintenance_checkpoint',
    recorded_at: '2026-08-12',
    captured_at: '2026-08-12',
    source_commit: 'pr552-evidence-archive-batch2',
    asset_count: 119,
    source_checkpoint_id: base.checkpoint_id,
    previous_checkpoint_id: base.checkpoint_id,
    maintenance_pr: 552,
    authority_pr: 551,
    source_review_pr: 543,
    expected_counts: expectedCounts,
    counts,
    maintenance_outcome: {
      archived_url_additions: 8,
      source_url_changes: 0,
      new_evidence_records: 0,
      evidence_relation_changes: 0,
      asset_changes: 0,
      market_access_changes: 0,
      archive_recorded_before: 463,
      archive_recorded_after: 471,
      archive_not_recorded_before: 122,
      archive_not_recorded_after: 114
    },
    record_boundary: {
      exact_reviewed_archive_additions_only: true,
      reviewed_no_safe_change_preserved: true,
      automatic_continuation: false,
      next_boundary: 'REVIEW_GATE'
    },
    release_integrity_baseline_id: releaseBaselineId,
    reproducible_build_baseline_id: base.reproducible_build_baseline_id,
    notes: 'Current deterministic canonical checkpoint after PR #552 Evidence Archive Payload Verification Batch 2 implementation. Exactly eight payload-reviewed dated archived_url values were added to existing Evidence records. Evidence identities, Evidence Relations, stable assets, Market Access Records, source URLs, schema, taxonomy, routes, and material UI remain unchanged. Archive coverage advances from 463/585 to 471/585 and the lane returns to REVIEW_GATE after production verification.'
  };
}

function updateStatsCheckpoint(base) {
  return {
    schema_version: '1.0',
    status: 'reviewed_non_growth_checkpoint',
    checkpoint_id: statsCheckpointId,
    checkpoint_kind: 'non_growth_archive_maintenance_checkpoint',
    recorded_at: '2026-08-12',
    registry_version: 'pr552-evidence-archive-batch2',
    asset_count: 119,
    source_checkpoint_id: base.checkpoint_id,
    canonical_checkpoint_id: canonicalCheckpointId,
    previous_history_checkpoint_id: base.checkpoint_id,
    maintenance_pr: 552,
    authority_pr: 551,
    source_review_pr: 543,
    source_commit: 'pr552-evidence-archive-batch2',
    captured_at: '2026-08-12',
    expected_totals: {
      assets: 119,
      organizations: 109,
      relationships: 131,
      events: 194,
      evidence: 585,
      deployments: 186,
      market_access_records: 12,
      detail_routes: 422
    },
    notes: 'Reviewed same-count statistics checkpoint for PR #552 Evidence Archive Payload Verification Batch 2 implementation. It advances archive Evidence coverage to 471/585 while preserving all canonical record counts.'
  };
}

function updateReleaseBaseline(base) {
  return {
    ...base,
    baseline_id: releaseBaselineId,
    recorded_at: '2026-08-12',
    source_checkpoint_commit: 'pr552-evidence-archive-batch2',
    evidence_quality: {
      ...(base.evidence_quality ?? {}),
      archive_index_count: 471,
      archive_not_recorded_count: 114,
      archive_partition_complete: true,
      new_evidence_records: 0,
      source_replacements: 0
    },
    source_pr: 552,
    source_commit: 'pr552-evidence-archive-batch2',
    captured_at: '2026-08-12'
  };
}

function updateStatsHistory(history) {
  const snapshot = generateCurrentHistorySnapshot({ root });
  const snapshots = (history.snapshots ?? []).filter((row) => row.checkpoint_id !== statsCheckpointId);
  snapshots.push(snapshot);
  return { ...history, snapshots };
}

function build() {
  const authority = read(authorityPath);
  assertAuthority(authority);
  const baseCheckpoint = read(checkpointPath);
  const baseStatsCheckpoint = read(statsCheckpointPath);
  const baseRelease = read(releaseBaselinePath);
  const history = read(statsHistoryPath);

  if (baseCheckpoint.counts?.archive_index_count !== 463 || baseCheckpoint.counts?.archive_not_recorded_count !== 122) {
    throw new Error('Unexpected pre-implementation archive checkpoint');
  }
  if (baseCheckpoint.counts?.evidence !== 585 || baseCheckpoint.counts?.evidence_relations !== 585 || baseCheckpoint.counts?.market_access_records !== 12 || baseCheckpoint.counts?.assets !== 119) {
    throw new Error('Unexpected pre-implementation canonical counts');
  }

  const changed = applyArchives(authority);
  const checkpoint = updateCheckpoint(baseCheckpoint);
  const statsCheckpoint = updateStatsCheckpoint(baseStatsCheckpoint);
  const release = updateReleaseBaseline(baseRelease);
  write(checkpointPath, checkpoint);
  write(statsCheckpointPath, statsCheckpoint);
  write(releaseBaselinePath, release);
  const nextHistory = updateStatsHistory(history);
  write(statsHistoryPath, nextHistory);

  write(resultPath, {
    schema_version: '1.0',
    result_id: 'sog_evidence_archive_payload_verification_batch_2_implementation_pr552_2026_08_12',
    status: 'implemented_bounded_exact_archive_additions',
    implementation_pr: 552,
    authority_pr: 551,
    source_review_pr: 543,
    changed_count: changed.length,
    changed,
    no_safe_change: authority.no_safe_change,
    canonical_counts: {
      assets: 119,
      evidence: 585,
      evidence_relations: 585,
      market_access_records: 12
    },
    archive_coverage: {
      before_recorded: 463,
      before_not_recorded: 122,
      after_recorded: 471,
      after_not_recorded: 114
    },
    next_boundary: 'REVIEW_GATE',
    automatic_continuation: false
  });
}

build();
console.log('Applied exact Evidence Archive Payload Verification Batch 2 implementation outputs.');
