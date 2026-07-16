import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { generateStats } from './build-stats.mjs';
import { generateCurrentHistorySnapshot } from './stats/build-history-snapshot.mjs';

const root = process.cwd();
const baseRef = process.env.SOG_PR395_BASE_REF ?? 'origin/main';
const paths = {
  config: 'config/evidence-archive-maintenance-batch-6-pr395.json',
  decisions: 'config/evidence-archive-maintenance-batch-6-pr395-decisions.json',
  sourceQueue: 'docs/migration/evidence-archive-maintenance-queue-v5-pr393.json',
  probeQueue: 'docs/migration/evidence-archive-maintenance-batch-6-pr395-review-queue.json',
  authority: 'docs/migration/post-pr393-review-gate-pr394.json',
  checkpoint: 'docs/migration/current-canonical-checkpoint.json',
  statsCheckpoint: 'docs/migration/current-stats-history-checkpoint.json',
  statsHistory: 'data/stats-history.json',
  releaseBaseline: 'docs/migration/registry-release-integrity-baseline.json'
};
const outputPaths = {
  reviewQueue: paths.probeQueue,
  outcomes: 'docs/migration/evidence-archive-maintenance-outcomes-pr395.json',
  handoff: 'docs/migration/evidence-archive-maintenance-batch-6-pr395-reviewed-handoff.json',
  checkpoint: paths.checkpoint,
  statsCheckpoint: paths.statsCheckpoint,
  statsHistory: paths.statsHistory,
  releaseBaseline: paths.releaseBaseline
};
const canonicalCheckpointId = 'sog_evidence_archive_maintenance_batch_6_canonical_112_checkpoint_pr395_2026_07_16';
const statsCheckpointId = 'sog_evidence_archive_maintenance_batch_6_112_checkpoint_pr395_2026_07_16';
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const serialize = (value) => `${JSON.stringify(value, null, 2)}\n`;
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');

function readBaseText(file) {
  try {
    return execFileSync('git', ['show', `${baseRef}:${file}`], {
      cwd: root,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe']
    });
  } catch (error) {
    if (process.env.SOG_PR395_ALLOW_DISK_BASE === '1') return readText(file);
    throw new Error(`${file}: unable to read immutable base ${baseRef}: ${error.message}`);
  }
}
const readBaseJson = (file) => JSON.parse(readBaseText(file));

function captureRows(probe) {
  return [
    probe?.exact_cdx_probe?.earliest_capture,
    probe?.exact_cdx_probe?.latest_capture,
    ...(probe?.exact_cdx_probe?.sampled_captures ?? [])
  ].filter(Boolean);
}
function equivalentExactUrl(left, right) {
  try { return decodeURIComponent(String(left)) === decodeURIComponent(String(right)); }
  catch { return String(left) === String(right); }
}

function assertAuthority(config, authority, queue) {
  const decision = authority.decisions?.evidence_archive_maintenance_batch_6;
  if (decision?.pr !== 395 || decision?.decision !== 'approved_bounded_manual_review') {
    throw new Error('PR #394 does not authorize PR #395');
  }
  if (queue.queue_id !== 'sog_evidence_archive_maintenance_queue_v5_pr393') {
    throw new Error(`Unexpected source queue ${queue.queue_id}`);
  }
  const selected = queue.selected_candidates.map((row) => row.evidence_id);
  if (JSON.stringify(selected) !== JSON.stringify(config.selected_evidence_ids)) {
    throw new Error('PR #395 selected IDs differ from Queue v5');
  }
  if (JSON.stringify(decision.selected_evidence_ids) !== JSON.stringify(config.selected_evidence_ids)) {
    throw new Error('PR #394 selected authority differs from PR #395 config');
  }
}

function validateDecisions(config, decisionFile, probeQueue, queue) {
  const allowed = new Set(config.allowed_outcomes);
  const selected = config.selected_evidence_ids;
  const decisions = decisionFile.decisions ?? [];
  if (decisions.length !== selected.length) throw new Error(`Expected ${selected.length} decisions, found ${decisions.length}`);
  if (JSON.stringify(decisions.map((row) => row.evidence_id)) !== JSON.stringify(selected)) {
    throw new Error('Decision order or identity differs from selected queue');
  }
  const probes = new Map(probeQueue.rows.map((row) => [row.evidence_id, row]));
  const queued = new Map(queue.selected_candidates.map((row) => [row.evidence_id, row]));
  for (const decision of decisions) {
    if (!allowed.has(decision.outcome)) throw new Error(`${decision.evidence_id}: invalid outcome ${decision.outcome}`);
    const probe = probes.get(decision.evidence_id);
    const candidate = queued.get(decision.evidence_id);
    if (!probe || !candidate) throw new Error(`${decision.evidence_id}: missing probe or queue row`);
    if (decision.canonical_url !== candidate.url || decision.canonical_url !== probe.canonical_url) {
      throw new Error(`${decision.evidence_id}: canonical URL mismatch`);
    }
    if (decision.outcome === 'dated_exact_archive_added') {
      const match = captureRows(probe).find((row) => row.timestamp === decision.capture_timestamp && row.digest === decision.capture_digest);
      if (!match) throw new Error(`${decision.evidence_id}: accepted capture absent from exact CDX probe`);
      if (match.statuscode !== '200') throw new Error(`${decision.evidence_id}: accepted capture is not HTTP 200`);
      if (!equivalentExactUrl(match.original, decision.canonical_url)) throw new Error(`${decision.evidence_id}: capture is not exact canonical source`);
      const expectedArchive = `https://web.archive.org/web/${decision.capture_timestamp}/${decision.canonical_url}`;
      if (decision.archived_url !== expectedArchive) throw new Error(`${decision.evidence_id}: archived URL differs from accepted capture`);
    }
    if (decision.outcome === 'reviewed_no_safe_change' && probe.exact_cdx_probe?.capture_count > 0) {
      throw new Error(`${decision.evidence_id}: no-safe-change conflicts with available exact capture`);
    }
    if (decision.outcome === 'reviewed_source_replacement') {
      if (!decision.replacement_url || probe.live_probe?.final_url !== decision.replacement_url || !probe.live_probe?.redirected || !probe.live_probe?.ok) {
        throw new Error(`${decision.evidence_id}: replacement is not the reviewed successful redirect target`);
      }
      if (decision.claim_scope_equivalence !== 'reviewed_equivalent' || !decision.source_version_equivalence?.startsWith('reviewed_')) {
        throw new Error(`${decision.evidence_id}: replacement equivalence review incomplete`);
      }
    }
  }
}

function buildCanonicalFiles(queue, decisions) {
  const sourceFiles = [...new Set(queue.selected_candidates.map((row) => row.source_file))].sort();
  const candidateById = new Map(queue.selected_candidates.map((row) => [row.evidence_id, row]));
  const decisionById = new Map(decisions.map((row) => [row.evidence_id, row]));
  const outputs = {};
  for (const file of sourceFiles) {
    const rows = readBaseJson(file);
    if (!Array.isArray(rows)) throw new Error(`${file}: canonical Evidence file is not an array`);
    outputs[file] = rows.map((row) => {
      const decision = decisionById.get(row.id);
      if (!decision) return row;
      const candidate = candidateById.get(row.id);
      if (!candidate || candidate.source_file !== file) throw new Error(`${row.id}: source file mismatch`);
      if (row.url !== decision.canonical_url) throw new Error(`${row.id}: base canonical URL changed before PR #395`);
      if (String(row.archived_url ?? '').trim()) throw new Error(`${row.id}: base row already has archive`);
      if (decision.outcome === 'dated_exact_archive_added') return { ...row, archived_url: decision.archived_url };
      if (decision.outcome === 'reviewed_source_replacement') return { ...row, url: decision.replacement_url };
      return row;
    });
  }
  return outputs;
}

function buildReviewedQueue(probeQueue, decisions) {
  const byId = new Map(decisions.map((row) => [row.evidence_id, row]));
  return {
    ...probeQueue,
    status: 'reviewed_complete',
    rows: probeQueue.rows.map((row) => {
      const decision = byId.get(row.evidence_id);
      if (!decision) throw new Error(`${row.evidence_id}: missing reviewed decision`);
      return {
        ...row,
        review_status: 'reviewed_complete',
        proposed_outcome: decision.outcome,
        accepted_archived_url: decision.archived_url ?? null,
        accepted_capture_timestamp: decision.capture_timestamp ?? null,
        accepted_capture_digest: decision.capture_digest ?? null,
        accepted_replacement_url: decision.replacement_url ?? null,
        reviewer_reason: decision.review_reason,
        remaining_uncertainty: decision.remaining_uncertainty
      };
    }),
    outcome_counts: {
      dated_exact_archive_added: decisions.filter((row) => row.outcome === 'dated_exact_archive_added').length,
      reviewed_source_replacement: decisions.filter((row) => row.outcome === 'reviewed_source_replacement').length,
      reviewed_no_safe_change: decisions.filter((row) => row.outcome === 'reviewed_no_safe_change').length
    },
    boundaries: {
      canonical_data_changed: decisions.some((row) => row.outcome !== 'reviewed_no_safe_change'),
      automatic_capture_promotion: false,
      automatic_source_replacement: false,
      public_surface_changed: false
    }
  };
}

function buildCheckpoint(base, decisions) {
  const archiveAdded = decisions.filter((row) => row.outcome === 'dated_exact_archive_added');
  const replacements = decisions.filter((row) => row.outcome === 'reviewed_source_replacement');
  const noSafe = decisions.filter((row) => row.outcome === 'reviewed_no_safe_change');
  const archiveAfter = base.evidence_quality.archive_index_count + archiveAdded.length;
  const missingAfter = base.evidence_quality.archive_not_recorded_count - archiveAdded.length;
  return {
    schema_version: '1.0',
    status: 'reviewed_non_growth_checkpoint',
    checkpoint_id: canonicalCheckpointId,
    checkpoint_kind: 'non_growth_normalization_checkpoint',
    recorded_at: '2026-07-16',
    source_commit: 'pr395-evidence-archive-maintenance-batch-6',
    asset_count: 112,
    source_checkpoint_id: base.checkpoint_id,
    previous_checkpoint_id: base.checkpoint_id,
    maintenance_pr: 395,
    expected_counts: { ...base.expected_counts },
    evidence_quality: {
      archive_index_count: archiveAfter,
      archive_not_recorded_count: missingAfter,
      selected_for_review: decisions.length,
      canonical_changes: archiveAdded.length + replacements.length,
      reviewed_no_safe_change: noSafe.length,
      new_evidence_records: 0
    },
    maintenance_outcome: {
      changed_evidence_ids: decisions.filter((row) => row.outcome !== 'reviewed_no_safe_change').map((row) => row.evidence_id),
      dated_archive_added_evidence_ids: archiveAdded.map((row) => row.evidence_id),
      source_replacement_evidence_ids: replacements.map((row) => row.evidence_id),
      reviewed_no_safe_change_evidence_ids: noSafe.map((row) => row.evidence_id)
    },
    notes: `Current deterministic canonical checkpoint after PR #395 Evidence and Archive Maintenance Batch 6. ${archiveAdded.length} exact dated archive captures and ${replacements.length} reviewed source replacements were accepted; ${noSafe.length} identity recorded reviewed no-safe-change. Archive coverage is ${archiveAfter} of 559. All canonical identity counts, Evidence Relations, assets, Market Access records, non-Evidence record families, and public surfaces remain unchanged.`
  };
}

function buildStatsCheckpoint(base, checkpoint) {
  return {
    schema_version: '1.0',
    status: 'reviewed_non_growth_checkpoint',
    checkpoint_id: statsCheckpointId,
    checkpoint_kind: 'non_growth_normalization_checkpoint',
    recorded_at: '2026-07-16',
    registry_version: 'pr395-evidence-archive-maintenance-batch-6',
    asset_count: 112,
    source_checkpoint_id: base.checkpoint_id,
    canonical_checkpoint_id: canonicalCheckpointId,
    previous_history_checkpoint_id: base.checkpoint_id,
    maintenance_pr: 395,
    notes: `Reviewed forward same-count statistics checkpoint for PR #395 Evidence and Archive Maintenance Batch 6. It records archive coverage ${checkpoint.evidence_quality.archive_index_count} of 559 while preserving every canonical record count and public-surface boundary.`
  };
}

function buildReleaseBaseline(base, checkpoint, decisions) {
  return {
    ...base,
    status: 'current',
    baseline_id: 'sog_release_integrity_pr395_112_assets_2026_07_16',
    recorded_at: '2026-07-16',
    source_checkpoint_commit: 'pr395-evidence-archive-maintenance-batch-6',
    evidence_quality: {
      archive_index_count: checkpoint.evidence_quality.archive_index_count,
      archive_not_recorded_count: checkpoint.evidence_quality.archive_not_recorded_count,
      selected_for_review: decisions.length,
      canonical_change_assets: 0,
      reviewed_no_safe_change_assets: decisions.filter((row) => row.outcome === 'reviewed_no_safe_change').length,
      new_evidence_records: 0
    }
  };
}

function buildOutcomes(queue, decisions, checkpoint, canonicalFiles) {
  const sourceById = new Map(queue.selected_candidates.map((row) => [row.evidence_id, row.source_file]));
  const outcomes = decisions.map((decision) => ({
    evidence_id: decision.evidence_id,
    source_file: sourceById.get(decision.evidence_id),
    decision: decision.outcome,
    previous_url: decision.canonical_url,
    new_url: decision.replacement_url ?? decision.canonical_url,
    previous_archived_url: null,
    new_archived_url: decision.archived_url ?? null,
    review_method: decision.outcome === 'dated_exact_archive_added'
      ? 'current URL response plus exact-source Wayback CDX review'
      : decision.outcome === 'reviewed_source_replacement'
        ? 'current URL redirect review plus claim-scope and source-version equivalence review'
        : 'current URL response, redirect boundary, and exact-source archive review',
    capture_timestamp: decision.capture_timestamp ?? null,
    capture_digest: decision.capture_digest ?? null,
    reason: decision.review_reason,
    remaining_uncertainty: decision.remaining_uncertainty
  }));
  return {
    schema_version: '1.0',
    outcome_id: 'sog_evidence_archive_maintenance_outcomes_pr395_2026_07_16',
    status: 'reviewed_bounded_maintenance',
    public_output: false,
    review_pr: 395,
    queue_id: queue.queue_id,
    selected_count: decisions.length,
    changed_count: decisions.filter((row) => row.outcome !== 'reviewed_no_safe_change').length,
    dated_archive_added_count: decisions.filter((row) => row.outcome === 'dated_exact_archive_added').length,
    reviewed_source_replacement_count: decisions.filter((row) => row.outcome === 'reviewed_source_replacement').length,
    reviewed_no_safe_change_count: decisions.filter((row) => row.outcome === 'reviewed_no_safe_change').length,
    canonical_evidence_count_after: 559,
    evidence_relation_count_after: 559,
    archive_index_count_before: 416,
    archive_index_count_after: checkpoint.evidence_quality.archive_index_count,
    archive_not_recorded_count_before: 143,
    archive_not_recorded_count_after: checkpoint.evidence_quality.archive_not_recorded_count,
    changed_files: Object.keys(canonicalFiles).sort(),
    outcomes,
    constraints: {
      new_evidence_identities: 0,
      removed_evidence_identities: 0,
      evidence_relation_changes: 0,
      asset_changes: 0,
      market_access_record_changes: 0,
      new_public_surface: false
    }
  };
}

function writeFiles(files) {
  for (const [file, value] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    fs.writeFileSync(path.join(root, file), serialize(value));
  }
}

export function buildEvidenceArchiveMaintenanceBatch6Outputs() {
  const config = readJson(paths.config);
  const decisionFile = readJson(paths.decisions);
  const queue = readJson(paths.sourceQueue);
  const probeQueue = readJson(paths.probeQueue);
  const authority = readJson(paths.authority);
  assertAuthority(config, authority, queue);
  validateDecisions(config, decisionFile, probeQueue, queue);
  const decisions = decisionFile.decisions;
  const canonicalFiles = buildCanonicalFiles(queue, decisions);
  const reviewedQueue = buildReviewedQueue(probeQueue, decisions);
  const baseCheckpoint = readBaseJson(paths.checkpoint);
  const baseStatsCheckpoint = readBaseJson(paths.statsCheckpoint);
  const baseHistory = readBaseJson(paths.statsHistory);
  const baseReleaseBaseline = readBaseJson(paths.releaseBaseline);
  const checkpoint = buildCheckpoint(baseCheckpoint, decisions);
  const statsCheckpoint = buildStatsCheckpoint(baseStatsCheckpoint, checkpoint);
  const releaseBaseline = buildReleaseBaseline(baseReleaseBaseline, checkpoint, decisions);
  const outcomes = buildOutcomes(queue, decisions, checkpoint, canonicalFiles);

  writeFiles({
    ...canonicalFiles,
    [outputPaths.reviewQueue]: reviewedQueue,
    [outputPaths.outcomes]: outcomes,
    [outputPaths.checkpoint]: checkpoint,
    [outputPaths.statsCheckpoint]: statsCheckpoint,
    [outputPaths.releaseBaseline]: releaseBaseline
  });

  const stats = generateStats({ root });
  const snapshot = generateCurrentHistorySnapshot({ root });
  const history = structuredClone(baseHistory);
  history.snapshots = [...(history.snapshots ?? []).filter((row) => row.checkpoint_id !== snapshot.checkpoint_id), snapshot];
  fs.writeFileSync(path.join(root, outputPaths.statsHistory), serialize(history));

  const archiveAdded = decisions.filter((row) => row.outcome === 'dated_exact_archive_added');
  const replacements = decisions.filter((row) => row.outcome === 'reviewed_source_replacement');
  const noSafe = decisions.filter((row) => row.outcome === 'reviewed_no_safe_change');
  const changed = decisions.filter((row) => row.outcome !== 'reviewed_no_safe_change');
  const handoffBase = {
    schema_version: '1.0',
    handoff_id: 'sog_evidence_archive_maintenance_batch_6_pr395_reviewed_handoff_2026_07_16',
    status: 'reviewed_complete',
    review_pr: 395,
    source_pr: 394,
    source_merge_commit: 'e40e437e4bbd39e442399d00ac5f7f790beac821',
    queue_id: queue.queue_id,
    outcome_id: outcomes.outcome_id,
    canonical_checkpoint_id: canonicalCheckpointId,
    stats_checkpoint_id: statsCheckpointId,
    canonical_counts: {
      assets: 112,
      organizations: 107,
      relationships: 124,
      events: 187,
      evidence: 559,
      evidence_relations: 559,
      reserve_reports: 120,
      known_unknowns: 325,
      regulatory_notes: 9,
      deployments: 174,
      market_access_records: 8,
      legal_profiles: 112,
      reserve_components: 145,
      income_profiles: 112
    },
    evidence_quality: {
      archive_recorded: checkpoint.evidence_quality.archive_index_count,
      archive_not_recorded: checkpoint.evidence_quality.archive_not_recorded_count,
      selected: decisions.length,
      changed: changed.length,
      dated_archive_added: archiveAdded.length,
      reviewed_source_replacement: replacements.length,
      reviewed_no_safe_change: noSafe.length
    },
    changed_evidence_ids: changed.map((row) => row.evidence_id),
    dated_archive_added_evidence_ids: archiveAdded.map((row) => row.evidence_id),
    source_replacement_evidence_ids: replacements.map((row) => row.evidence_id),
    reviewed_no_safe_change_evidence_ids: noSafe.map((row) => row.evidence_id),
    stats_input_digest_sha256: stats.input_digest_sha256,
    stats_model_sha256: sha256(JSON.stringify(stats)),
    stats_snapshot_sha256: snapshot.snapshot_sha256,
    next_work_item: {
      decision: 'review_gate_required',
      reason: 'Merged PR #394 authorizes only PR #395 before another review gate; no later archive, dossier, Market Access, growth, or public-surface work is pre-authorized.'
    },
    boundaries: {
      new_asset: false,
      new_or_removed_evidence_identity: false,
      evidence_relation_change: false,
      non_evidence_canonical_change: false,
      market_access_change: false,
      new_public_surface: false,
      ranking: false,
      automatic_monitoring_promotion: false
    }
  };
  const handoff = { ...handoffBase, handoff_sha256: sha256(JSON.stringify(handoffBase)) };
  fs.writeFileSync(path.join(root, outputPaths.handoff), serialize(handoff));

  return {
    files: {
      ...canonicalFiles,
      [outputPaths.reviewQueue]: reviewedQueue,
      [outputPaths.outcomes]: outcomes,
      [outputPaths.handoff]: handoff,
      [outputPaths.checkpoint]: checkpoint,
      [outputPaths.statsCheckpoint]: statsCheckpoint,
      [outputPaths.statsHistory]: history,
      [outputPaths.releaseBaseline]: releaseBaseline
    },
    outcomes,
    handoff,
    stats,
    snapshot
  };
}

const isCli = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isCli) {
  const result = buildEvidenceArchiveMaintenanceBatch6Outputs();
  if (process.argv.includes('--check')) {
    const stale = Object.entries(result.files)
      .filter(([file, value]) => readText(file) !== serialize(value))
      .map(([file]) => file);
    if (stale.length) {
      console.error(`PR #395 outputs are not reproducible: ${stale.join(', ')}`);
      process.exit(1);
    }
  }
  console.log(JSON.stringify({
    ok: true,
    outcome_id: result.outcomes.outcome_id,
    selected: result.outcomes.selected_count,
    changed: result.outcomes.changed_count,
    dated_archives_added: result.outcomes.dated_archive_added_count,
    source_replacements: result.outcomes.reviewed_source_replacement_count,
    reviewed_no_safe_change: result.outcomes.reviewed_no_safe_change_count,
    archive_recorded: result.outcomes.archive_index_count_after,
    archive_not_recorded: result.outcomes.archive_not_recorded_count_after,
    evidence: result.handoff.canonical_counts.evidence,
    evidence_relations: result.handoff.canonical_counts.evidence_relations,
    next_authority: result.handoff.next_work_item.decision
  }, null, 2));
}
