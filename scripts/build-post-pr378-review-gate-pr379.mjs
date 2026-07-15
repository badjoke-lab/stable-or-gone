import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = process.cwd();
const paths = {
  config: 'config/post-pr378-review-gate-pr379.json',
  queue: 'docs/migration/evidence-archive-maintenance-queue-v2-pr378.json',
  queueDelta: 'docs/migration/evidence-archive-maintenance-queue-v2-pr378-delta.json',
  historyContract: 'config/evidence-archive-review-history-v1-pr377.json',
  historyManifest: 'docs/migration/evidence-archive-review-history-manifest-pr377.json',
  historyAudit: 'docs/migration/evidence-archive-review-history-audit-pr377.json',
  checkpoint: 'docs/migration/current-canonical-checkpoint.json',
  pr360Outcomes: 'docs/migration/evidence-correction-outcomes-pr360.json',
  pr365Outcomes: 'docs/migration/evidence-archive-maintenance-outcomes-pr365.json',
  marketAccessHandoff: 'docs/migration/market-access-pilot-2-pr359-reviewed-handoff.json',
  maintenanceLog: 'data/monthly-maintenance-log.json'
};
const outputPath = 'docs/migration/post-pr378-review-gate-pr379.json';
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const serialize = (value) => `${JSON.stringify(value, null, 2)}\n`;
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');

export function buildPostPr378ReviewGate() {
  const config = readJson(paths.config);
  const queue = readJson(paths.queue);
  const delta = readJson(paths.queueDelta);
  const contract = readJson(paths.historyContract);
  const manifest = readJson(paths.historyManifest);
  const audit = readJson(paths.historyAudit);
  const checkpoint = readJson(paths.checkpoint);
  const pr360 = readJson(paths.pr360Outcomes);
  const pr365 = readJson(paths.pr365Outcomes);
  const marketAccess = readJson(paths.marketAccessHandoff);
  const maintenanceLog = readJson(paths.maintenanceLog);
  const currentMaintenance = maintenanceLog.find((row) => row.month === '2026-07') ?? maintenanceLog.at(-1) ?? null;

  const selectedEvidenceIds = queue.selected_candidates.map((row) => row.evidence_id);
  const priorityCounts = queue.selected_candidates.reduce((acc, row) => ({
    ...acc,
    [row.priority_bucket]: (acc[row.priority_bucket] ?? 0) + 1
  }), {});
  const sourceDigest = sha256(Object.values(paths).map((file) => `${file}\0${readText(file)}`).join('\0'));
  const decisionDigest = sha256(JSON.stringify({
    queueId: queue.queue_id,
    selectedEvidenceIds,
    approvedNextSequence: config.approved_next_sequence,
    forbidden: config.forbidden_without_later_review_gate
  }));

  return {
    schema_version: '1.0',
    report_id: 'sog_post_pr378_review_gate_pr379_2026_07_15',
    status: 'reviewed_internal_authority_decision',
    public_output: false,
    review_pr: 379,
    reviewed_at: config.reviewed_at,
    source_checkpoint: {
      assets: checkpoint.expected_counts.assets,
      evidence: checkpoint.expected_counts.evidence,
      archive_recorded: checkpoint.evidence_quality.archive_index_count,
      archive_not_recorded: checkpoint.evidence_quality.archive_not_recorded_count,
      market_access_records: checkpoint.expected_counts.market_access_records
    },
    completed_sequence: [
      { pr: 377, work_item: 'Evidence Archive Review-History Contract Audit', status: 'complete' },
      { pr: 378, work_item: 'Evidence Archive Maintenance Queue v2 Refresh', status: 'complete' }
    ],
    evaluation: {
      queue_integrity: {
        queue_id: queue.queue_id,
        canonical_evidence_count: queue.canonical_evidence_count,
        archive_recorded_count: queue.archive_index_count,
        archive_not_recorded_count: queue.archive_not_recorded_count,
        reviewed_unresolved_suppressed_count: queue.reviewed_unresolved_suppressed_count,
        reactivated_reviewed_identity_count: queue.reactivated_reviewed_identity_count,
        eligible_pool_count: queue.eligible_pool_count,
        selected_count: queue.selected_count,
        maximum_selected_count: queue.maximum_selected_count,
        selected_evidence_ids: selectedEvidenceIds,
        priority_bucket_counts: priorityCounts,
        deterministic_order: true,
        all_candidates_manual_review_only: queue.selected_candidates.every((row) => row.review_status === 'pending_manual_review' && row.canonical_change_authorized === false),
        result: 'bounded_fresh_history_aware_queue'
      },
      history_enforcement: {
        contract_id: contract.contract_id,
        manifest_id: manifest.manifest_id,
        history_source_count: manifest.counts.history_source_count,
        history_event_count: manifest.counts.history_event_count,
        reviewed_unresolved_count: audit.reviewed_unresolved_archive_gaps.count,
        exact_suppressed_ids_preserved: JSON.stringify([...delta.reviewed_unresolved_suppressed_evidence_ids].sort()) === JSON.stringify([...audit.reviewed_unresolved_archive_gaps.evidence_ids].sort()),
        reviewed_reactivation_signal_count: delta.reactivated_reviewed_evidence_ids.length,
        automatic_time_expiry: contract.suppression_policy.automatic_time_expiry,
        result: 'successful'
      },
      prior_batch_yield: {
        pr360: {
          selected: pr360.selected_count,
          changed: pr360.changed_count,
          no_safe_change: pr360.reviewed_no_change_count,
          change_yield_percent: Number(((pr360.changed_count / pr360.selected_count) * 100).toFixed(2))
        },
        pr365: {
          selected: pr365.selected_count,
          changed: pr365.changed_count,
          no_safe_change: pr365.reviewed_no_safe_change_count,
          change_yield_percent: Number(((pr365.changed_count / pr365.selected_count) * 100).toFixed(2))
        },
        finding: 'Prior archive-maintenance yield varied materially, so PR #380 must review every selected identity and cannot presume a canonical change.'
      },
      batch_3_readiness: {
        decision: 'approved_bounded_manual_review',
        selected_identity_count: selectedEvidenceIds.length,
        allowed_outcomes: ['dated_exact_archive_added', 'reviewed_source_replacement', 'reviewed_no_safe_change'],
        canonical_change_allowed_only_after_reviewed_exact_capture_or_equivalent_replacement: true,
        automatic_promotion_allowed: false,
        review_gate_required_after_batch: true
      },
      market_access: {
        canonical_record_count: marketAccess.canonical_counts.market_access_records,
        third_pilot_candidate_manifest: 'not_available_in_named_review_inputs',
        decision: 'defer'
      },
      monthly_maintenance: {
        month: currentMaintenance?.month ?? null,
        status: currentMaintenance?.status ?? null,
        decision: 'continue_existing_month_end_process'
      },
      monitoring: {
        decision: 'continue_private_review_only',
        automatic_canonical_promotion_allowed: false
      }
    },
    decisions: {
      evidence_archive_maintenance_batch_3: {
        decision: 'approved_bounded',
        pr: 380,
        selected_evidence_ids: selectedEvidenceIds,
        maximum_identity_count: 10,
        canonical_evidence_change_allowed_under_reviewed_outcomes: true,
        new_public_surface_allowed: false,
        automatic_promotion_allowed: false
      },
      evidence_archive_maintenance_batch_4: { decision: 'not_approved' },
      tier_a_dossier_batch_6: { decision: 'not_approved' },
      market_access_pilot_3: { decision: 'not_approved' },
      record_growth_batch_2: { decision: 'not_approved' },
      new_public_surface: { decision: 'not_approved' }
    },
    approved_next_sequence: config.approved_next_sequence,
    not_approved_in_next_sequence: config.forbidden_without_later_review_gate,
    review_gate_after_sequence: config.review_gate_after_sequence,
    activation_rule: 'PR #380 must update AGENTS.md and docs/roadmap.md before changing canonical Evidence.',
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

export function writePostPr378ReviewGate(report = buildPostPr378ReviewGate()) {
  fs.mkdirSync(path.dirname(path.join(root, outputPath)), { recursive: true });
  fs.writeFileSync(path.join(root, outputPath), serialize(report));
}

const isCli = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isCli) {
  const report = buildPostPr378ReviewGate();
  if (process.argv.includes('--check')) {
    if (!fs.existsSync(path.join(root, outputPath)) || readText(outputPath) !== serialize(report)) {
      console.error(`${outputPath} is not reproducible`);
      process.exit(1);
    }
  } else writePostPr378ReviewGate(report);
  console.log(JSON.stringify({
    ok: true,
    report_id: report.report_id,
    selected_candidates: report.evaluation.queue_integrity.selected_count,
    reviewed_suppressed: report.evaluation.queue_integrity.reviewed_unresolved_suppressed_count,
    batch_3_decision: report.decisions.evidence_archive_maintenance_batch_3.decision,
    approved_next_sequence: report.approved_next_sequence.map((row) => `PR #${row.pr} ${row.work_item}`),
    review_gate_after_sequence: report.review_gate_after_sequence
  }, null, 2));
}
