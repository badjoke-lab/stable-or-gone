import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = process.cwd();
const paths = {
  config: 'config/tier-a-dossier-batch-5-pr369.json',
  queue: 'docs/migration/tier-a-candidate-queue-v2-pr368.json',
  baseline: 'docs/migration/record-depth-baseline-v2-pr368-summary.json',
  checkpoint: 'docs/migration/current-canonical-checkpoint.json',
  batch1: 'docs/migration/tier-a-batch-1-pr354-reviewed-handoff.json',
  batch2: 'docs/migration/tier-a-batch-2-pr355-reviewed-handoff.json',
  batch3: 'docs/migration/tier-a-batch-3-pr357-reviewed-handoff.json',
  batch4: 'docs/migration/tier-a-batch-4-pr364-reviewed-handoff.json'
};
const outputPaths = {
  outcomes: 'docs/migration/tier-a-batch-5-pr369-review-outcomes.json',
  handoff: 'docs/migration/tier-a-batch-5-pr369-reviewed-handoff.json'
};
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const serialize = (value) => `${JSON.stringify(value, null, 2)}\n`;
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');

export function buildTierABatch5Outputs() {
  const configText = readText(paths.config);
  const config = JSON.parse(configText);
  const queue = readJson(paths.queue);
  const baseline = readJson(paths.baseline);
  const checkpoint = readJson(paths.checkpoint);
  const prior = {
    pr354: readJson(paths.batch1),
    pr355: readJson(paths.batch2),
    pr357: readJson(paths.batch3),
    pr364: readJson(paths.batch4)
  };
  const queueBySlug = new Map(queue.candidates.map((row) => [row.asset_slug, row]));
  const selected = config.selected_asset_slugs.map((slug) => {
    const candidate = queueBySlug.get(slug);
    if (!candidate) throw new Error(`Selected asset ${slug} is not in the PR #368 queue`);
    const outcome = config.review_outcomes.find((row) => row.asset_slug === slug);
    if (!outcome) throw new Error(`Selected asset ${slug} lacks a configured review outcome`);
    return {
      asset_id: candidate.asset_id,
      asset_slug: candidate.asset_slug,
      asset_name: candidate.asset_name,
      symbol: candidate.symbol,
      queue_reasons: candidate.reasons,
      queue_material_dossier_gaps: candidate.material_dossier_gaps,
      reviewed_material_gaps: outcome.material_gaps_reviewed,
      outcome: outcome.outcome,
      prior_review_pr: outcome.prior_review_pr,
      reason: outcome.reason
    };
  });
  const counts = {
    selected_assets: selected.length,
    canonical_improvement_assets: selected.filter((row) => row.outcome === 'canonical_improvement').length,
    reviewed_no_safe_change_assets: selected.filter((row) => row.outcome === 'reviewed_no_safe_change').length,
    prior_completed_no_duplicate_change_assets: selected.filter((row) => row.outcome === 'prior_completed_no_duplicate_change').length
  };
  const sourceDigest = sha256([
    configText,
    readText(paths.queue),
    readText(paths.baseline),
    readText(paths.checkpoint),
    readText(paths.batch1),
    readText(paths.batch2),
    readText(paths.batch3),
    readText(paths.batch4)
  ].join('\0'));
  const reviewDigest = sha256(JSON.stringify({ selected, counts, not_selected: config.not_selected, sourceDigest }));
  const sourceBoundaries = {
    source_baseline_id: baseline.baseline_id,
    source_queue_id: queue.queue_id,
    queue_generation_digest_sha256: queue.generation_digest_sha256,
    canonical_checkpoint_id: checkpoint.checkpoint_id,
    prior_review_handoffs: {
      pr354: prior.pr354.handoff_id,
      pr355: prior.pr355.handoff_id,
      pr357: prior.pr357.handoff_id,
      pr364: prior.pr364.handoff_id
    }
  };
  const outcomes = {
    schema_version: '1.0',
    outcomes_id: 'sog_tier_a_batch_5_pr369_review_outcomes_2026_07_15',
    status: 'reviewed_complete_no_forced_change',
    public_output: false,
    review_pr: 369,
    reviewed_at: config.reviewed_at,
    source_boundaries: sourceBoundaries,
    selection_policy: {
      maximum_selected_assets: config.maximum_selected_assets,
      selected_assets: selected.length,
      queue_order: queue.queue_order,
      manual_review_required: queue.selection_boundary.manual_review_required,
      force_change_to_fill_batch: config.boundaries.force_change_to_fill_batch
    },
    selected_assets: selected,
    not_selected: config.not_selected,
    result_counts: counts,
    findings: [
      'The PR #368 queue is a non-ranking planning queue and does not override prior reviewed handoffs.',
      'AUDD, NZDS, and poundtoken retain prior no-safe-change outcomes because no new reviewed source signal establishes the unresolved current-state claims.',
      'BUSD and USDP retain their completed dossier improvements; duplicate canonical edits are not justified.',
      'RLUSD was not selected because it was improved in PR #354, reviewed again in PR #364, and received bounded Market Access records in PR #359.',
      'No canonical change is safer and more accurate than forcing a nominal batch yield.'
    ],
    boundaries: {
      canonical_data_changed: false,
      evidence_changed: false,
      market_access_changed: false,
      public_surface_changed: false,
      new_asset_added: false,
      ranking_or_score: false,
      automatic_promotion: false
    },
    source_digest_sha256: sourceDigest,
    review_digest_sha256: reviewDigest,
    next_state: config.next_state
  };
  const handoff = {
    schema_version: '1.0',
    handoff_id: 'sog_tier_a_batch_5_pr369_reviewed_handoff_2026_07_15',
    status: 'reviewed_internal_handoff_complete_on_merge',
    public_output: false,
    review_pr: 369,
    recorded_at: config.reviewed_at,
    source_boundaries: sourceBoundaries,
    canonical_checkpoint: {
      assets: checkpoint.expected_counts.assets,
      organizations: checkpoint.expected_counts.organizations,
      relationships: checkpoint.expected_counts.relationships,
      events: checkpoint.expected_counts.events,
      evidence: checkpoint.expected_counts.evidence,
      evidence_relations: checkpoint.expected_counts.evidence,
      deployments: checkpoint.expected_counts.deployments,
      market_access_records: checkpoint.expected_counts.market_access_records,
      archive_recorded: checkpoint.evidence_quality.archive_index_count,
      archive_not_recorded: checkpoint.evidence_quality.archive_not_recorded_count
    },
    selected_asset_slugs: config.selected_asset_slugs,
    canonical_improvement_asset_slugs: selected.filter((row) => row.outcome === 'canonical_improvement').map((row) => row.asset_slug),
    reviewed_no_safe_change_asset_slugs: selected.filter((row) => row.outcome === 'reviewed_no_safe_change').map((row) => row.asset_slug),
    prior_completed_no_duplicate_change_asset_slugs: selected.filter((row) => row.outcome === 'prior_completed_no_duplicate_change').map((row) => row.asset_slug),
    not_selected: config.not_selected,
    result_counts: counts,
    canonical_counts_unchanged: true,
    historical_outputs_unchanged: true,
    new_public_surface: false,
    asset_rank: false,
    single_composite_score: false,
    review_digest_sha256: reviewDigest,
    next_state: config.next_state,
    notes: 'PR #369 completed the bounded manual review without forcing unsupported or duplicate canonical edits. The approved PR #367–#369 sequence now stops at a review gate.'
  };
  return { outcomes, handoff };
}

export function writeTierABatch5Outputs(outputs = buildTierABatch5Outputs()) {
  for (const [key, file] of Object.entries(outputPaths)) {
    fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    fs.writeFileSync(path.join(root, file), serialize(outputs[key]));
  }
}

const isCli = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isCli) {
  const outputs = buildTierABatch5Outputs();
  if (process.argv.includes('--check')) {
    for (const [key, file] of Object.entries(outputPaths)) {
      if (!fs.existsSync(path.join(root, file)) || readText(file) !== serialize(outputs[key])) {
        console.error(`${file} is not reproducible`);
        process.exit(1);
      }
    }
  } else writeTierABatch5Outputs(outputs);
  console.log(JSON.stringify({
    ok: true,
    selected_assets: outputs.outcomes.result_counts.selected_assets,
    canonical_improvement_assets: outputs.outcomes.result_counts.canonical_improvement_assets,
    reviewed_no_safe_change_assets: outputs.outcomes.result_counts.reviewed_no_safe_change_assets,
    prior_completed_no_duplicate_change_assets: outputs.outcomes.result_counts.prior_completed_no_duplicate_change_assets,
    next_state: outputs.handoff.next_state
  }, null, 2));
}
