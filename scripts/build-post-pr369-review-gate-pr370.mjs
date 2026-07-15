import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = process.cwd();
const paths = {
  config: 'config/post-pr369-review-gate-pr370.json',
  baseline: 'docs/migration/record-depth-baseline-v2-pr368-summary.json',
  queue: 'docs/migration/tier-a-candidate-queue-v2-pr368.json',
  handoff: 'docs/migration/tier-a-batch-5-pr369-reviewed-handoff.json',
  outcomes: 'docs/migration/tier-a-batch-5-pr369-review-outcomes.json',
  checkpoint: 'docs/migration/current-canonical-checkpoint.json',
  pr354: 'docs/migration/tier-a-batch-1-pr354-reviewed-handoff.json',
  pr355: 'docs/migration/tier-a-batch-2-pr355-reviewed-handoff.json',
  pr357: 'docs/migration/tier-a-batch-3-pr357-reviewed-handoff.json',
  pr364: 'docs/migration/tier-a-batch-4-pr364-reviewed-handoff.json',
  canonicalBuilder: 'scripts/growth/build-reviewed-record-depth-baseline-pr353.mjs',
  v2Builder: 'scripts/build-record-depth-baseline-v2-refresh-pr368.mjs'
};
const outputPath = 'docs/migration/post-pr369-review-gate-pr370.json';
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const serialize = (value) => `${JSON.stringify(value, null, 2)}\n`;
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');

export function buildPostPr369ReviewGate() {
  const config = readJson(paths.config);
  const baseline = readJson(paths.baseline);
  const queue = readJson(paths.queue);
  const handoff = readJson(paths.handoff);
  const outcomes = readJson(paths.outcomes);
  const checkpoint = readJson(paths.checkpoint);
  const prior = {
    pr354: readJson(paths.pr354),
    pr355: readJson(paths.pr355),
    pr357: readJson(paths.pr357),
    pr364: readJson(paths.pr364)
  };
  const canonicalBuilderText = readText(paths.canonicalBuilder);
  const v2BuilderText = readText(paths.v2Builder);
  const queueSlugs = queue.candidates.map((row) => row.asset_slug);
  const priorReviewedQueueSlugs = queueSlugs.filter((slug) => {
    if (prior.pr354.selected_asset_slugs?.includes(slug)) return true;
    if (prior.pr355.completed_asset_slugs?.includes(slug)) return true;
    if (prior.pr357.selected_asset_slugs?.includes(slug)) return true;
    if (prior.pr364.selected_asset_slugs?.includes(slug)) return true;
    return false;
  });
  const sourceDigest = sha256(Object.values(paths).map((file) => readText(file)).join('\0'));
  const decisionDigest = sha256(JSON.stringify({
    checkpoint: checkpoint.checkpoint_id,
    baseline: baseline.baseline_id,
    queue: queue.queue_id,
    handoff: handoff.handoff_id,
    priorReviewedQueueSlugs,
    approvedNextSequence: config.approved_next_sequence,
    forbidden: config.forbidden_without_later_review_gate
  }));

  return {
    schema_version: '1.0',
    report_id: 'sog_post_pr369_review_gate_pr370_2026_07_15',
    status: 'reviewed_internal_authority_decision',
    public_output: false,
    review_pr: 370,
    reviewed_at: config.reviewed_at,
    source_checkpoint: {
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
    completed_sequence: [
      { pr: 367, work_item: 'Planning Dimension Semantics Audit', status: 'complete' },
      { pr: 368, work_item: 'Record Depth Baseline v2 Refresh', status: 'complete' },
      { pr: 369, work_item: 'Tier A Dossier Deepening Batch 5', status: 'complete' }
    ],
    evaluation: {
      semantics_audit: {
        result: 'successful',
        planning_state_counts: baseline.summary.planning_state_counts,
        applicability_state_counts: baseline.summary.applicability_state_counts,
        observation_state_counts: baseline.summary.observation_state_counts,
        changed_v1_to_v2_cells: baseline.summary.changed_from_v1_cell_count
      },
      queue_quality: {
        candidate_count: queue.candidate_count,
        candidate_slugs: queueSlugs,
        prior_reviewed_candidate_count: priorReviewedQueueSlugs.length,
        prior_reviewed_candidate_slugs: priorReviewedQueueSlugs,
        all_candidates_previously_reviewed: priorReviewedQueueSlugs.length === queue.candidate_count,
        finding: 'Every PR #368 queue candidate already had a reviewed improvement or no-safe-change history before PR #369; the queue did not represent a fresh bounded dossier opportunity set.'
      },
      batch_5_yield: {
        selected_assets: outcomes.result_counts.selected_assets,
        canonical_improvement_assets: outcomes.result_counts.canonical_improvement_assets,
        reviewed_no_safe_change_assets: outcomes.result_counts.reviewed_no_safe_change_assets,
        prior_completed_no_duplicate_change_assets: outcomes.result_counts.prior_completed_no_duplicate_change_assets,
        change_yield_percent: 0,
        finding: 'PR #369 correctly produced zero canonical changes because all selected candidates were prior-completed or retained a prior no-safe-change boundary.'
      },
      planning_input_coverage: {
        canonical_builder_default_profile_override_files_empty: canonicalBuilderText.includes('profileOverrideFiles = []'),
        v2_builder_calls_canonical_builder_without_options: v2BuilderText.includes('buildReviewedRecordDepthBaseline();'),
        finding: 'The reviewed planning builder defaults to no profile override files, and PR #368 invoked it without options. Current profile overlay coverage is therefore not guaranteed to match the complete reviewed dossier surface before queue generation.'
      },
      archive_maintenance: {
        archive_recorded: checkpoint.evidence_quality.archive_index_count,
        archive_not_recorded: checkpoint.evidence_quality.archive_not_recorded_count,
        immediate_batch_3_decision: 'hold'
      },
      market_access: {
        records: checkpoint.expected_counts.market_access_records,
        decision: 'hold'
      },
      monitoring: {
        decision: 'continue_private_review_only',
        automatic_canonical_promotion_allowed: false
      },
      external_usage: {
        status: 'not_available_in_reviewed_repository_evidence',
        decision_effect: 'No new product surface or growth sequence is approved from unverified usage claims.'
      }
    },
    decisions: {
      planning_input_coverage_audit: {
        decision: 'approved_required',
        pr: 371,
        canonical_data_change_allowed: false,
        public_surface_allowed: false
      },
      record_depth_baseline_v2_1_refresh: {
        decision: 'approved_after_input_audit',
        pr: 372,
        canonical_data_change_allowed: false,
        public_surface_allowed: false
      },
      tier_a_dossier_batch_6: {
        decision: 'not_approved',
        reason: 'A new dossier batch must not use the current recurrent queue before complete planning input coverage is audited and the baseline is refreshed.'
      },
      evidence_archive_maintenance_batch_3: { decision: 'not_approved_in_next_sequence' },
      market_access_pilot_3: { decision: 'not_approved' },
      record_growth_batch_2: { decision: 'not_approved' },
      new_public_surface: { decision: 'not_approved' }
    },
    approved_next_sequence: config.approved_next_sequence,
    not_approved_in_next_sequence: config.forbidden_without_later_review_gate,
    review_gate_after_sequence: config.review_gate_after_sequence,
    activation_rule: 'PR #371 must update AGENTS.md and docs/roadmap.md to activate the approved sequence before changing planning input contracts.',
    boundaries: {
      canonical_data_changed: false,
      public_surface_changed: false,
      historical_outputs_rewritten: false,
      ranking_or_score: false,
      automatic_promotion: false
    },
    source_digest_sha256: sourceDigest,
    decision_digest_sha256: decisionDigest
  };
}

export function writePostPr369ReviewGate(report = buildPostPr369ReviewGate()) {
  fs.mkdirSync(path.dirname(path.join(root, outputPath)), { recursive: true });
  fs.writeFileSync(path.join(root, outputPath), serialize(report));
}

const isCli = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isCli) {
  const report = buildPostPr369ReviewGate();
  if (process.argv.includes('--check')) {
    if (!fs.existsSync(path.join(root, outputPath)) || readText(outputPath) !== serialize(report)) {
      console.error(`${outputPath} is not reproducible`);
      process.exit(1);
    }
  } else writePostPr369ReviewGate(report);
  console.log(JSON.stringify({
    ok: true,
    report_id: report.report_id,
    queue_candidates: report.evaluation.queue_quality.candidate_count,
    prior_reviewed_candidates: report.evaluation.queue_quality.prior_reviewed_candidate_count,
    batch_5_change_yield_percent: report.evaluation.batch_5_yield.change_yield_percent,
    planning_input_coverage_finding: report.evaluation.planning_input_coverage.finding,
    approved_next_sequence: report.approved_next_sequence.map((row) => `PR #${row.pr} ${row.work_item}`),
    review_gate_after_sequence: report.review_gate_after_sequence
  }, null, 2));
}
