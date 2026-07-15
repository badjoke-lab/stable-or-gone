import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const root = process.cwd();
const paths = {
  config: 'config/post-pr372-review-gate-pr373.json',
  manifest: 'docs/migration/planning-input-manifest-pr371.json',
  inputAudit: 'docs/migration/planning-input-coverage-audit-pr371.json',
  v21Summary: 'docs/migration/record-depth-baseline-v2-1-pr372-summary.json',
  v21Delta: 'docs/migration/record-depth-baseline-v2-1-pr372-delta.json',
  v21Queue: 'docs/migration/tier-a-candidate-queue-v2-1-pr372.json',
  pr369Outcomes: 'docs/migration/tier-a-batch-5-pr369-review-outcomes.json',
  checkpoint: 'docs/migration/current-canonical-checkpoint.json',
  marketAccessHandoff: 'docs/migration/market-access-pilot-2-pr359-reviewed-handoff.json',
  maintenanceLog: 'data/monthly-maintenance-log.json',
  priorReviewGate: 'docs/migration/post-pr369-review-gate-pr370.json',
  queueBuilder: 'scripts/build-record-depth-baseline-v2-refresh-pr368.mjs',
  registryLoader: 'scripts/load-registry-v2-baseline.mjs'
};
const outputPath = 'docs/migration/post-pr372-review-gate-pr373.json';
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const serialize = (value) => `${JSON.stringify(value, null, 2)}\n`;
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');
const sameSet = (left, right) => left.length === right.length && left.every((value) => right.includes(value));

function loadEffectiveDefaultRegistry() {
  const key = 'SOG_PLANNING_PROFILE_MANIFEST';
  const previous = process.env[key];
  delete process.env[key];
  try {
    return loadRegistryV2Baseline(root);
  } finally {
    if (previous === undefined) delete process.env[key];
    else process.env[key] = previous;
  }
}

export function buildPostPr372ReviewGate() {
  const config = readJson(paths.config);
  const manifest = readJson(paths.manifest);
  const inputAudit = readJson(paths.inputAudit);
  const summary = readJson(paths.v21Summary);
  const delta = readJson(paths.v21Delta);
  const queue = readJson(paths.v21Queue);
  const pr369 = readJson(paths.pr369Outcomes);
  const checkpoint = readJson(paths.checkpoint);
  const marketAccess = readJson(paths.marketAccessHandoff);
  const maintenanceLog = readJson(paths.maintenanceLog);
  const priorReviewGate = readJson(paths.priorReviewGate);
  const queueBuilderText = readText(paths.queueBuilder);
  const effectiveDefaultRegistry = loadEffectiveDefaultRegistry();
  const effectiveDefaultProfileFiles = effectiveDefaultRegistry.data_groups?.profiles ?? [];

  const queueSlugs = queue.candidates.map((row) => row.asset_slug);
  const priorNoSafeRows = pr369.selected_assets.filter((row) => row.outcome === 'reviewed_no_safe_change');
  const priorNoSafeSlugs = priorNoSafeRows.map((row) => row.asset_slug).sort();
  const retainedPriorNoSafe = queueSlugs.filter((slug) => priorNoSafeSlugs.includes(slug)).sort();
  const changedCells = delta.changed_cells.map((row) => ({
    asset_id: row.asset_id,
    asset_slug: row.asset_slug,
    dimension_id: row.dimension_id,
    before_state: row.before?.state ?? null,
    after_state: row.after?.state ?? null
  }));
  const currentMaintenance = maintenanceLog.find((row) => row.month === '2026-07') ?? maintenanceLog.at(-1) ?? null;
  const queueBuilderReviewHistorySignals = {
    reads_pr369_outcomes: queueBuilderText.includes('tier-a-batch-5-pr369-review-outcomes'),
    reads_reviewed_no_safe_change: queueBuilderText.includes('reviewed_no_safe_change'),
    reads_prior_review_handoff: queueBuilderText.includes('prior_review') || queueBuilderText.includes('review_handoff')
  };
  const queueBuilderConsumesReviewHistory = Object.values(queueBuilderReviewHistorySignals).some(Boolean);

  const sourceDigest = sha256(Object.values(paths).map((file) => `${file}\0${readText(file)}`).join('\0'));
  const decisionDigest = sha256(JSON.stringify({
    correctedBaseline: summary.baseline_id,
    correctedQueue: queue.queue_id,
    queueSlugs,
    retainedPriorNoSafe,
    effectiveDefaultProfileFiles,
    approvedNextSequence: config.approved_next_sequence,
    forbidden: config.forbidden_without_later_review_gate
  }));

  return {
    schema_version: '1.0',
    report_id: 'sog_post_pr372_review_gate_pr373_2026_07_15',
    status: 'reviewed_internal_authority_decision',
    public_output: false,
    review_pr: 373,
    reviewed_at: config.reviewed_at,
    source_checkpoint: {
      assets: checkpoint.expected_counts.assets,
      evidence: checkpoint.expected_counts.evidence,
      deployments: checkpoint.expected_counts.deployments,
      market_access_records: checkpoint.expected_counts.market_access_records,
      archive_recorded: checkpoint.evidence_quality.archive_index_count,
      archive_not_recorded: checkpoint.evidence_quality.archive_not_recorded_count
    },
    completed_sequence: [
      { pr: 371, work_item: 'Planning Input Coverage Audit', status: 'complete' },
      { pr: 372, work_item: 'Record Depth Baseline v2.1 Refresh', status: 'complete' }
    ],
    evaluation: {
      planning_input_correction: {
        manifest_id: manifest.manifest_id,
        complete_profile_file_count: manifest.counts.ordered_file_count,
        effective_default_profile_file_count: effectiveDefaultProfileFiles.length,
        omitted_or_order_corrected_profile_file_count: manifest.counts.ordered_file_count - effectiveDefaultProfileFiles.length,
        pr371_affected_asset_count: inputAudit.coverage_gap.affected_asset_id_count,
        result: 'successful'
      },
      baseline_v2_1: {
        baseline_id: summary.baseline_id,
        assets: summary.asset_count,
        dimensions: summary.dimension_count,
        cells: summary.cell_count,
        changed_cell_count: delta.changed_cell_count,
        changed_asset_count: delta.changed_asset_count,
        changed_cells: changedCells,
        planning_state_counts: summary.summary.planning_state_counts,
        finding: 'The complete profile manifest corrected four redemption cells from partial to strong without changing applicability scope.'
      },
      corrected_queue: {
        queue_id: queue.queue_id,
        candidate_count: queue.candidate_count,
        candidate_slugs: queueSlugs,
        prior_reviewed_no_safe_change_count: retainedPriorNoSafe.length,
        prior_reviewed_no_safe_change_slugs: retainedPriorNoSafe,
        all_candidates_prior_reviewed_no_safe_change: sameSet(queueSlugs, retainedPriorNoSafe),
        new_source_signal_present_in_queue: false,
        finding: 'Every corrected queue candidate already has a reviewed no-safe-change outcome and the queue carries no new-source reactivation signal.'
      },
      queue_builder_review_history: {
        ...queueBuilderReviewHistorySignals,
        consumes_review_history: queueBuilderConsumesReviewHistory,
        finding: 'The current queue builder derives eligibility from present gap and leverage states but does not consume reviewed dossier outcomes or no-safe-change history.'
      },
      archive_maintenance: {
        archive_recorded: checkpoint.evidence_quality.archive_index_count,
        archive_not_recorded: checkpoint.evidence_quality.archive_not_recorded_count,
        last_batch_selected: checkpoint.evidence_quality.selected_for_review,
        last_batch_canonical_changes: checkpoint.evidence_quality.canonical_changes,
        last_batch_reviewed_no_safe_change: checkpoint.evidence_quality.reviewed_no_safe_change,
        decision: 'defer_until_after_queue_history_sequence'
      },
      market_access: {
        canonical_record_count: marketAccess.canonical_counts.market_access_records,
        latest_promoted_record_count: marketAccess.promoted_market_access_record_ids.length,
        third_pilot_candidate_manifest: 'not_available_in_named_review_inputs',
        decision: 'defer'
      },
      monthly_maintenance: {
        month: currentMaintenance?.month ?? null,
        status: currentMaintenance?.status ?? null,
        checks_passed: (currentMaintenance?.checks ?? []).filter((row) => row.result === 'passed').length,
        next_focus: currentMaintenance?.next_focus ?? [],
        decision: 'continue_existing_month_end_process'
      },
      monitoring: {
        decision: 'continue_private_review_only',
        automatic_canonical_promotion_allowed: false
      },
      external_usage: {
        status: priorReviewGate.evaluation.external_usage.status,
        decision_effect: 'No public-surface or growth sequence is authorized from unverified usage claims.'
      }
    },
    decisions: {
      tier_a_dossier_batch_6: {
        decision: 'not_approved',
        reason: 'All three corrected queue candidates retain reviewed no-safe-change outcomes and no new source signal is present.'
      },
      planning_queue_review_history_contract_audit: {
        decision: 'approved_required',
        pr: 374,
        canonical_data_change_allowed: false,
        public_surface_allowed: false
      },
      candidate_queue_v2_2_refresh: {
        decision: 'approved_after_pr374',
        pr: 375,
        canonical_data_change_allowed: false,
        public_surface_allowed: false
      },
      evidence_archive_maintenance_batch_3: { decision: 'not_approved_in_next_sequence' },
      market_access_pilot_3: { decision: 'not_approved' },
      record_growth_batch_2: { decision: 'not_approved' },
      new_public_surface: { decision: 'not_approved' }
    },
    approved_next_sequence: config.approved_next_sequence,
    not_approved_in_next_sequence: config.forbidden_without_later_review_gate,
    review_gate_after_sequence: config.review_gate_after_sequence,
    activation_rule: 'PR #374 must update AGENTS.md and docs/roadmap.md before changing queue eligibility contracts.',
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

export function writePostPr372ReviewGate(report = buildPostPr372ReviewGate()) {
  fs.mkdirSync(path.dirname(path.join(root, outputPath)), { recursive: true });
  fs.writeFileSync(path.join(root, outputPath), serialize(report));
}

const isCli = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isCli) {
  const report = buildPostPr372ReviewGate();
  if (process.argv.includes('--check')) {
    if (!fs.existsSync(path.join(root, outputPath)) || readText(outputPath) !== serialize(report)) {
      console.error(`${outputPath} is not reproducible`);
      process.exit(1);
    }
  } else writePostPr372ReviewGate(report);
  console.log(JSON.stringify({
    ok: true,
    report_id: report.report_id,
    corrected_queue_candidates: report.evaluation.corrected_queue.candidate_count,
    prior_no_safe_change_candidates: report.evaluation.corrected_queue.prior_reviewed_no_safe_change_count,
    queue_builder_consumes_review_history: report.evaluation.queue_builder_review_history.consumes_review_history,
    approved_next_sequence: report.approved_next_sequence.map((row) => `PR #${row.pr} ${row.work_item}`),
    review_gate_after_sequence: report.review_gate_after_sequence
  }, null, 2));
}
