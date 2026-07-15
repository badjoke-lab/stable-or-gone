import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = process.cwd();
const paths = {
  config: 'config/post-pr375-review-gate-pr376.json',
  queue: 'docs/migration/tier-a-candidate-queue-v2-2-pr375.json',
  queueDelta: 'docs/migration/tier-a-candidate-queue-v2-2-pr375-delta.json',
  queueHistoryAudit: 'docs/migration/planning-queue-review-history-audit-pr374.json',
  checkpoint: 'docs/migration/current-canonical-checkpoint.json',
  pr360Outcomes: 'docs/migration/evidence-correction-outcomes-pr360.json',
  pr365Queue: 'docs/migration/evidence-archive-maintenance-queue-pr365.json',
  pr365Outcomes: 'docs/migration/evidence-archive-maintenance-outcomes-pr365.json',
  pr365Handoff: 'docs/migration/evidence-archive-maintenance-batch-2-pr365-reviewed-handoff.json',
  archiveQueueBuilder: 'scripts/build-evidence-archive-maintenance-queue-pr365.mjs',
  marketAccessHandoff: 'docs/migration/market-access-pilot-2-pr359-reviewed-handoff.json',
  maintenanceLog: 'data/monthly-maintenance-log.json',
  priorReviewGate: 'docs/migration/post-pr372-review-gate-pr373.json'
};
const outputPath = 'docs/migration/post-pr375-review-gate-pr376.json';
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const serialize = (value) => `${JSON.stringify(value, null, 2)}\n`;
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');

export function buildPostPr375ReviewGate() {
  const config = readJson(paths.config);
  const queue = readJson(paths.queue);
  const queueDelta = readJson(paths.queueDelta);
  const queueHistoryAudit = readJson(paths.queueHistoryAudit);
  const checkpoint = readJson(paths.checkpoint);
  const pr360 = readJson(paths.pr360Outcomes);
  const pr365Queue = readJson(paths.pr365Queue);
  const pr365 = readJson(paths.pr365Outcomes);
  const pr365Handoff = readJson(paths.pr365Handoff);
  const archiveBuilderText = readText(paths.archiveQueueBuilder);
  const marketAccess = readJson(paths.marketAccessHandoff);
  const maintenanceLog = readJson(paths.maintenanceLog);
  const priorReviewGate = readJson(paths.priorReviewGate);
  const currentMaintenance = maintenanceLog.find((row) => row.month === '2026-07') ?? maintenanceLog.at(-1) ?? null;

  const archiveHistorySignals = {
    excludes_pr360_selected_queue: archiveBuilderText.includes("evidence-correction-queue-pr360.json"),
    reads_pr360_outcomes: archiveBuilderText.includes('evidence-correction-outcomes-pr360'),
    reads_pr365_outcomes: archiveBuilderText.includes('evidence-archive-maintenance-outcomes-pr365'),
    reads_reviewed_no_safe_change: archiveBuilderText.includes('reviewed_no_safe_change'),
    reads_archive_review_history_manifest: archiveBuilderText.includes('archive-review-history') || archiveBuilderText.includes('archive_review_history')
  };
  const consumesCompleteArchiveReviewHistory = archiveHistorySignals.reads_pr360_outcomes
    && archiveHistorySignals.reads_pr365_outcomes
    && archiveHistorySignals.reads_reviewed_no_safe_change
    && archiveHistorySignals.reads_archive_review_history_manifest;

  const sourceDigest = sha256(Object.values(paths).map((file) => `${file}\0${readText(file)}`).join('\0'));
  const decisionDigest = sha256(JSON.stringify({
    queueId: queue.queue_id,
    currentCandidates: queue.candidate_count,
    archiveRecorded: checkpoint.evidence_quality.archive_index_count,
    archiveNotRecorded: checkpoint.evidence_quality.archive_not_recorded_count,
    pr360: [pr360.selected_count, pr360.changed_count, pr360.reviewed_no_change_count],
    pr365: [pr365.selected_count, pr365.changed_count, pr365.reviewed_no_safe_change_count],
    approvedNextSequence: config.approved_next_sequence,
    forbidden: config.forbidden_without_later_review_gate
  }));

  return {
    schema_version: '1.0',
    report_id: 'sog_post_pr375_review_gate_pr376_2026_07_15',
    status: 'reviewed_internal_authority_decision',
    public_output: false,
    review_pr: 376,
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
      { pr: 374, work_item: 'Planning Queue Review-History Contract Audit', status: 'complete' },
      { pr: 375, work_item: 'Candidate Queue v2.2 Refresh', status: 'complete' }
    ],
    evaluation: {
      dossier_queue: {
        queue_id: queue.queue_id,
        source_candidate_count: queueDelta.source_candidate_count,
        suppressed_candidate_count: queue.suppressed_candidate_count,
        reactivated_candidate_count: queue.reactivated_candidate_count,
        current_candidate_count: queue.candidate_count,
        removed_asset_slugs: queueDelta.removed_asset_slugs,
        history_contract_complete: queueHistoryAudit.decision.contract_complete,
        result: 'successful_zero_candidate_history_aware_queue'
      },
      archive_backlog: {
        canonical_evidence_count: checkpoint.expected_counts.evidence,
        archive_recorded: checkpoint.evidence_quality.archive_index_count,
        archive_not_recorded: checkpoint.evidence_quality.archive_not_recorded_count,
        archive_coverage_percent: Number(((checkpoint.evidence_quality.archive_index_count / checkpoint.expected_counts.evidence) * 100).toFixed(2)),
        result: 'largest_named_internal_quality_backlog'
      },
      archive_batch_history: {
        pr360: {
          selected: pr360.selected_count,
          changed: pr360.changed_count,
          no_safe_change: pr360.reviewed_no_change_count,
          changed_evidence_ids: pr360.outcomes.filter((row) => row.new_value != null || row.correction_type != null).map((row) => row.evidence_id),
          no_safe_change_evidence_ids: pr360.outcomes.filter((row) => row.review_status === 'reviewed_no_safe_canonical_change').map((row) => row.evidence_id)
        },
        pr365: {
          selected: pr365.selected_count,
          changed: pr365.changed_count,
          no_safe_change: pr365.reviewed_no_safe_change_count,
          changed_evidence_ids: pr365Handoff.changed_evidence_ids,
          no_safe_change_evidence_ids: pr365Handoff.reviewed_no_safe_change_evidence_ids
        },
        total_reviewed_identity_occurrences: pr360.selected_count + pr365.selected_count,
        total_no_safe_change_occurrences: pr360.reviewed_no_change_count + pr365.reviewed_no_safe_change_count
      },
      archive_queue_review_history: {
        ...archiveHistorySignals,
        consumes_complete_archive_review_history: consumesCompleteArchiveReviewHistory,
        excluded_pr360_selected_count: pr365Queue.excluded_pr360_selected_count,
        pr365_reviewed_outcome_count: pr365.outcomes.length,
        finding: 'The PR #365 queue builder excludes PR #360 selected identities but does not consume PR #365 reviewed outcomes or a complete Evidence archive review-history manifest.'
      },
      archive_batch_3_readiness: {
        canonical_change_decision: 'not_approved',
        reason: 'A history-aware fresh queue must be generated and reviewed before another canonical archive-maintenance batch.'
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
      evidence_archive_review_history_contract_audit: {
        decision: 'approved_required',
        pr: 377,
        canonical_data_change_allowed: false,
        public_surface_allowed: false
      },
      evidence_archive_maintenance_queue_v2_refresh: {
        decision: 'approved_after_pr377',
        pr: 378,
        canonical_data_change_allowed: false,
        public_surface_allowed: false
      },
      evidence_archive_maintenance_batch_3: {
        decision: 'not_approved_before_next_review_gate'
      },
      tier_a_dossier_batch_6: { decision: 'not_approved' },
      market_access_pilot_3: { decision: 'not_approved' },
      record_growth_batch_2: { decision: 'not_approved' },
      new_public_surface: { decision: 'not_approved' }
    },
    approved_next_sequence: config.approved_next_sequence,
    not_approved_in_next_sequence: config.forbidden_without_later_review_gate,
    review_gate_after_sequence: config.review_gate_after_sequence,
    activation_rule: 'PR #377 must update AGENTS.md and docs/roadmap.md before changing Evidence archive queue eligibility contracts.',
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

export function writePostPr375ReviewGate(report = buildPostPr375ReviewGate()) {
  fs.mkdirSync(path.dirname(path.join(root, outputPath)), { recursive: true });
  fs.writeFileSync(path.join(root, outputPath), serialize(report));
}

const isCli = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isCli) {
  const report = buildPostPr375ReviewGate();
  if (process.argv.includes('--check')) {
    if (!fs.existsSync(path.join(root, outputPath)) || readText(outputPath) !== serialize(report)) {
      console.error(`${outputPath} is not reproducible`);
      process.exit(1);
    }
  } else writePostPr375ReviewGate(report);
  console.log(JSON.stringify({
    ok: true,
    report_id: report.report_id,
    dossier_queue_candidates: report.evaluation.dossier_queue.current_candidate_count,
    archive_not_recorded: report.evaluation.archive_backlog.archive_not_recorded,
    archive_history_complete: report.evaluation.archive_queue_review_history.consumes_complete_archive_review_history,
    approved_next_sequence: report.approved_next_sequence.map((row) => `PR #${row.pr} ${row.work_item}`),
    review_gate_after_sequence: report.review_gate_after_sequence
  }, null, 2));
}
