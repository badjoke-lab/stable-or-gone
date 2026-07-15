import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildRecordDepthBaselineV2Outputs } from './build-record-depth-baseline-v2-refresh-pr368.mjs';

const root = process.cwd();
const paths = {
  config: 'config/record-depth-baseline-v2-1-refresh-pr372.json',
  manifest: 'docs/migration/planning-input-manifest-pr371.json',
  audit: 'docs/migration/planning-input-coverage-audit-pr371.json',
  priorBaseline: 'docs/migration/record-depth-baseline-v2-pr368.json',
  priorSummary: 'docs/migration/record-depth-baseline-v2-pr368-summary.json',
  priorQueue: 'docs/migration/tier-a-candidate-queue-v2-pr368.json',
  baseline: 'docs/migration/record-depth-baseline-v2-1-pr372.json',
  summary: 'docs/migration/record-depth-baseline-v2-1-pr372-summary.json',
  delta: 'docs/migration/record-depth-baseline-v2-1-pr372-delta.json',
  queue: 'docs/migration/tier-a-candidate-queue-v2-1-pr372.json'
};

const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const serialize = (value) => `${JSON.stringify(value, null, 2)}\n`;
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');
const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);

function withPlanningManifest(manifestPath, callback) {
  const key = 'SOG_PLANNING_PROFILE_MANIFEST';
  const previous = process.env[key];
  process.env[key] = manifestPath;
  try {
    return callback();
  } finally {
    if (previous === undefined) delete process.env[key];
    else process.env[key] = previous;
  }
}

function cellMap(baseline) {
  const map = new Map();
  for (const asset of baseline.assets ?? []) {
    for (const row of asset.dimension_states ?? []) {
      map.set(`${asset.asset_id}:${row.dimension_id}`, {
        asset_id: asset.asset_id,
        asset_slug: asset.asset_slug,
        asset_name: asset.asset_name,
        dimension_id: row.dimension_id,
        row
      });
    }
  }
  return map;
}

function compareCells(beforeBaseline, afterBaseline) {
  const before = cellMap(beforeBaseline);
  const after = cellMap(afterBaseline);
  const keys = [...new Set([...before.keys(), ...after.keys()])].sort();
  const changed = [];
  for (const key of keys) {
    const left = before.get(key);
    const right = after.get(key);
    if (!left || !right || !same(left.row, right.row)) {
      changed.push({
        asset_id: right?.asset_id ?? left?.asset_id ?? null,
        asset_slug: right?.asset_slug ?? left?.asset_slug ?? null,
        asset_name: right?.asset_name ?? left?.asset_name ?? null,
        dimension_id: right?.dimension_id ?? left?.dimension_id ?? null,
        before: left?.row ?? null,
        after: right?.row ?? null
      });
    }
  }
  return changed;
}

function queueDiff(beforeQueue, afterQueue) {
  const beforeBySlug = new Map((beforeQueue.candidates ?? []).map((row) => [row.asset_slug, row]));
  const afterBySlug = new Map((afterQueue.candidates ?? []).map((row) => [row.asset_slug, row]));
  const beforeSlugs = [...beforeBySlug.keys()].sort();
  const afterSlugs = [...afterBySlug.keys()].sort();
  const added = afterSlugs.filter((slug) => !beforeBySlug.has(slug));
  const removed = beforeSlugs.filter((slug) => !afterBySlug.has(slug));
  const retained = afterSlugs.filter((slug) => beforeBySlug.has(slug));
  const changed = retained.filter((slug) => !same(beforeBySlug.get(slug), afterBySlug.get(slug)));
  return {
    before_count: beforeSlugs.length,
    after_count: afterSlugs.length,
    added_asset_slugs: added,
    removed_asset_slugs: removed,
    retained_asset_slugs: retained,
    changed_retained_asset_slugs: changed
  };
}

export function buildRecordDepthBaselineV21Outputs() {
  const configText = readText(paths.config);
  const config = JSON.parse(configText);
  const manifest = readJson(paths.manifest);
  const audit = readJson(paths.audit);
  const priorBaseline = readJson(paths.priorBaseline);
  const priorSummary = readJson(paths.priorSummary);
  const priorQueue = readJson(paths.priorQueue);

  if (manifest.status !== 'reviewed_internal_complete_profile_input_manifest') {
    throw new Error('PR #371 planning input manifest is not reviewed complete');
  }
  if (manifest.manifest_id !== config.expected.planning_input_manifest_id) {
    throw new Error(`Unexpected planning input manifest ${manifest.manifest_id}`);
  }
  if (manifest.counts?.ordered_file_count !== config.expected.profile_file_count) {
    throw new Error(`Planning input manifest must contain ${config.expected.profile_file_count} files`);
  }
  if (audit.decision?.next_work_item !== 'PR #372 Record Depth Baseline v2.1 Refresh') {
    throw new Error('PR #371 audit does not authorize PR #372');
  }

  const refreshed = withPlanningManifest(paths.manifest, () => buildRecordDepthBaselineV2Outputs());
  const changedCells = compareCells(priorBaseline, refreshed.baseline);
  const changedAssetIds = [...new Set(changedCells.map((row) => row.asset_id).filter(Boolean))].sort();
  const queueDelta = queueDiff(priorQueue, refreshed.queue);
  const profileFiles = manifest.ordered_profile_files.map((row) => row.path);
  const sourceContracts = {
    ...refreshed.baseline.source_contracts,
    planning_input_manifest_path: paths.manifest,
    planning_input_manifest_id: manifest.manifest_id,
    planning_input_manifest_digest_sha256: manifest.manifest_digest_sha256,
    planning_input_source_digest_sha256: manifest.source_digest_sha256,
    planning_input_profile_file_count: profileFiles.length,
    planning_input_profile_files: profileFiles,
    planning_input_composition_semantics: manifest.composition_semantics,
    planning_input_audit_path: paths.audit,
    planning_input_audit_id: audit.audit_id,
    superseded_baseline_id: priorBaseline.baseline_id
  };
  const inputDigest = sha256([
    refreshed.baseline.input_digest_sha256,
    manifest.manifest_digest_sha256,
    manifest.source_digest_sha256,
    audit.source_digest_sha256,
    sha256(configText)
  ].join('\0'));
  const summaryCore = refreshed.summary.summary;
  const generationDigest = sha256(JSON.stringify({
    inputDigest,
    summaryCore,
    queue: refreshed.queue.candidates,
    changedCells,
    manifestDigest: manifest.manifest_digest_sha256
  }));

  const baseline = {
    ...refreshed.baseline,
    schema_version: '2.1',
    baseline_id: 'sog_record_depth_baseline_v2_1_pr372',
    review_pr: 372,
    reviewed_at: config.reviewed_at,
    input_digest_sha256: inputDigest,
    generation_digest_sha256: generationDigest,
    source_contracts: sourceContracts,
    supersedes_baseline_id: priorBaseline.baseline_id,
    planning_input_manifest_id: manifest.manifest_id
  };

  const summary = {
    ...refreshed.summary,
    schema_version: '2.1',
    baseline_id: baseline.baseline_id,
    review_pr: 372,
    reviewed_at: config.reviewed_at,
    input_digest_sha256: inputDigest,
    generation_digest_sha256: generationDigest,
    source_contracts: sourceContracts,
    supersedes_baseline_id: priorBaseline.baseline_id,
    planning_input_manifest_id: manifest.manifest_id,
    changed_from_pr368_cell_count: changedCells.length,
    changed_from_pr368_asset_count: changedAssetIds.length,
    next_work_item: config.next_work_item
  };

  const delta = {
    schema_version: '1.0',
    delta_id: 'sog_record_depth_baseline_v2_1_delta_pr372',
    status: 'reviewed_internal_planning_delta',
    public_output: false,
    review_pr: 372,
    reviewed_at: config.reviewed_at,
    historical_v2_baseline_id: priorBaseline.baseline_id,
    current_v2_1_baseline_id: baseline.baseline_id,
    historical_checkpoint_rewritten: false,
    asset_count: { before: priorBaseline.asset_count, after: baseline.asset_count },
    dimension_count: { before: priorBaseline.dimension_count, after: baseline.dimension_count },
    cell_count: { before: priorBaseline.cell_count, after: baseline.cell_count },
    planning_state_counts: {
      before: priorSummary.summary.planning_state_counts,
      after: summaryCore.planning_state_counts
    },
    applicability_state_counts: {
      before: priorSummary.summary.applicability_state_counts,
      after: summaryCore.applicability_state_counts
    },
    observation_state_counts: {
      before: priorSummary.summary.observation_state_counts,
      after: summaryCore.observation_state_counts
    },
    changed_cell_count: changedCells.length,
    changed_asset_count: changedAssetIds.length,
    changed_asset_ids: changedAssetIds,
    pr371_affected_asset_count: audit.coverage_gap.affected_asset_id_count,
    pr371_affected_asset_ids: audit.coverage_gap.affected_asset_ids,
    changed_cells: changedCells,
    candidate_queue: queueDelta,
    planning_input_manifest_id: manifest.manifest_id,
    planning_input_manifest_digest_sha256: manifest.manifest_digest_sha256,
    generation_digest_sha256: generationDigest
  };

  const queue = {
    ...refreshed.queue,
    schema_version: '2.1',
    queue_id: 'sog_tier_a_candidate_queue_v2_1_pr372',
    review_pr: 372,
    reviewed_at: config.reviewed_at,
    source_baseline_id: baseline.baseline_id,
    candidate_count: refreshed.queue.candidates.length,
    selection_boundary: {
      canonical_promotion_authorized: false,
      manual_review_required: true,
      existing_assets_only: true,
      market_access_change_allowed: false,
      public_surface_allowed: false,
      next_dossier_batch_authorized: false,
      review_gate_required: true
    },
    planning_input_manifest_id: manifest.manifest_id,
    generation_digest_sha256: generationDigest,
    next_work_item: config.next_work_item
  };

  return { baseline, summary, delta, queue };
}

export function writeRecordDepthBaselineV21Outputs(outputs = buildRecordDepthBaselineV21Outputs()) {
  for (const [key, file] of [['baseline', paths.baseline], ['summary', paths.summary], ['delta', paths.delta], ['queue', paths.queue]]) {
    fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    fs.writeFileSync(path.join(root, file), serialize(outputs[key]));
  }
  return [paths.baseline, paths.summary, paths.delta, paths.queue];
}

const isCli = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isCli) {
  const outputs = buildRecordDepthBaselineV21Outputs();
  if (process.argv.includes('--check')) {
    for (const [key, file] of [['baseline', paths.baseline], ['summary', paths.summary], ['delta', paths.delta], ['queue', paths.queue]]) {
      if (!fs.existsSync(path.join(root, file)) || readText(file) !== serialize(outputs[key])) {
        console.error(`${file} is not reproducible`);
        process.exit(1);
      }
    }
  } else {
    writeRecordDepthBaselineV21Outputs(outputs);
  }
  console.log(JSON.stringify({
    ok: true,
    baseline_id: outputs.baseline.baseline_id,
    assets: outputs.baseline.asset_count,
    dimensions: outputs.baseline.dimension_count,
    cells: outputs.baseline.cell_count,
    planning_state_counts: outputs.summary.summary.planning_state_counts,
    changed_cells_from_pr368: outputs.delta.changed_cell_count,
    changed_assets_from_pr368: outputs.delta.changed_asset_count,
    candidates: outputs.queue.candidate_count,
    candidate_slugs: outputs.queue.candidates.map((row) => row.asset_slug),
    next_work_item: outputs.queue.next_work_item
  }, null, 2));
}
