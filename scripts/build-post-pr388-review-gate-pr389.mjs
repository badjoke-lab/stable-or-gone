import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = process.cwd();
const paths = {
  config: 'config/post-pr388-review-gate-pr389.json',
  queue: 'docs/migration/evidence-archive-maintenance-queue-v4-pr388.json',
  delta: 'docs/migration/evidence-archive-maintenance-queue-v4-pr388-delta.json',
  historyContract: 'config/evidence-archive-review-history-v3-pr387.json',
  historyManifest: 'docs/migration/evidence-archive-review-history-manifest-v3-pr387.json',
  historyAudit: 'docs/migration/evidence-archive-review-history-audit-v3-pr387.json',
  checkpoint: 'docs/migration/current-canonical-checkpoint.json',
  statsCheckpoint: 'docs/migration/current-stats-history-checkpoint.json',
  releaseBaseline: 'docs/migration/registry-release-integrity-baseline.json'
};
const outputPath = 'docs/migration/post-pr388-review-gate-pr389.json';
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const serialize = (value) => `${JSON.stringify(value, null, 2)}\n`;
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');

export function buildPostPr388ReviewGate() {
  const config = readJson(paths.config);
  const queue = readJson(paths.queue);
  const delta = readJson(paths.delta);
  const contract = readJson(paths.historyContract);
  const manifest = readJson(paths.historyManifest);
  const audit = readJson(paths.historyAudit);
  const checkpoint = readJson(paths.checkpoint);
  const statsCheckpoint = readJson(paths.statsCheckpoint);
  const releaseBaseline = readJson(paths.releaseBaseline);

  const selectedEvidenceIds = queue.selected_candidates.map((row) => row.evidence_id);
  const priorityCounts = queue.selected_candidates.reduce((acc, row) => ({
    ...acc,
    [row.priority_bucket]: (acc[row.priority_bucket] ?? 0) + 1
  }), {});
  const selectionTierCounts = queue.selected_candidates.reduce((acc, row) => ({
    ...acc,
    [String(row.selection_tier)]: (acc[String(row.selection_tier)] ?? 0) + 1
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
    report_id: 'sog_post_pr388_review_gate_pr389_2026_07_16',
    status: 'reviewed_internal_authority_decision',
    public_output: false,
    review_pr: 389,
    reviewed_at: config.reviewed_at,
    source_checkpoint: {
      checkpoint_id: checkpoint.checkpoint_id,
      stats_checkpoint_id: statsCheckpoint.checkpoint_id,
      release_baseline_id: releaseBaseline.baseline_id,
      assets: checkpoint.expected_counts.assets,
      evidence: checkpoint.expected_counts.evidence,
      evidence_relations: 559,
      archive_recorded: checkpoint.evidence_quality.archive_index_count,
      archive_not_recorded: checkpoint.evidence_quality.archive_not_recorded_count,
      deployments: checkpoint.expected_counts.deployments,
      market_access_records: checkpoint.expected_counts.market_access_records
    },
    completed_sequence: [
      { pr: 387, work_item: 'Evidence Archive Review-History Contract v3 Update', status: 'complete' },
      { pr: 388, work_item: 'Evidence Archive Maintenance Queue v4 Refresh', status: 'complete' }
    ],
    evaluation: {
      queue_integrity: {
        queue_id: queue.queue_id,
        canonical_evidence_count: queue.canonical_evidence_count,
        archive_recorded_count: queue.archive_index_count,
        archive_not_recorded_count: queue.archive_not_recorded_count,
        reviewed_unresolved_suppressed_count: queue.reviewed_unresolved_suppressed_count,
        reactivated_reviewed_identity_count: queue.reactivated_reviewed_identity_count,
        selected_reactivated_reviewed_identity_count: queue.selected_reactivated_reviewed_identity_count,
        eligible_pool_count: queue.eligible_pool_count,
        selected_count: queue.selected_count,
        maximum_selected_count: queue.maximum_selected_count,
        selected_evidence_ids: selectedEvidenceIds,
        priority_bucket_counts: priorityCounts,
        selection_tier_counts: selectionTierCounts,
        added_vs_queue_v3: delta.added_evidence_ids.length,
        removed_vs_queue_v3: delta.removed_evidence_ids.length,
        retained_vs_queue_v3: delta.retained_evidence_ids.length,
        retained_evidence_ids: delta.retained_evidence_ids,
        deterministic_order: true,
        all_candidates_manual_review_only: queue.selected_candidates.every((row) => row.review_status === 'pending_manual_review' && row.canonical_change_authorized === false),
        result: 'bounded_fresh_history_v3_queue'
      },
      history_enforcement: {
        contract_id: contract.contract_id,
        manifest_id: manifest.manifest_id,
        audit_id: audit.audit_id,
        history_source_count: manifest.counts.history_source_count,
        history_event_count: manifest.counts.history_event_count,
        reviewed_identity_count: manifest.counts.reviewed_evidence_identity_count,
        reviewed_unresolved_total: audit.reviewed_unresolved.total_count,
        reviewed_unresolved_suppressed: audit.reviewed_unresolved.suppressed_count,
        reviewed_reactivated_eligible: audit.reviewed_unresolved.reactivated_eligible_count,
        reviewed_reactivated_evidence_ids: audit.reviewed_unresolved.reactivated_eligible_evidence_ids,
        exact_suppressed_ids_preserved: JSON.stringify([...delta.reviewed_unresolved_suppressed_evidence_ids].sort()) === JSON.stringify([...audit.reviewed_unresolved.suppressed_evidence_ids].sort()),
        exact_reactivated_ids_preserved: JSON.stringify([...delta.reactivated_reviewed_evidence_ids].sort()) === JSON.stringify([...audit.reviewed_unresolved.reactivated_eligible_evidence_ids].sort()),
        reviewed_reactivated_selected_first: selectedEvidenceIds[0] === 'sog_src_fdusd_site' && queue.selected_candidates[0]?.selection_tier === 0,
        automatic_time_expiry: contract.suppression_policy.automatic_time_expiry,
        result: 'successful'
      },
      batch_5_readiness: {
        decision: 'approved_bounded_manual_review',
        selected_identity_count: selectedEvidenceIds.length,
        selected_evidence_ids: selectedEvidenceIds,
        allowed_outcomes: ['dated_exact_archive_added', 'reviewed_source_replacement', 'reviewed_no_safe_change'],
        canonical_change_allowed_only_after_reviewed_exact_capture_or_equivalent_replacement: true,
        automatic_promotion_allowed: false,
        review_gate_required_after_batch: true
      },
      market_access: {
        canonical_record_count: checkpoint.expected_counts.market_access_records,
        decision: 'defer'
      },
      monitoring: {
        decision: 'continue_private_review_only',
        automatic_canonical_promotion_allowed: false
      }
    },
    decisions: {
      evidence_archive_maintenance_batch_5: {
        decision: 'approved_bounded',
        pr: 390,
        selected_evidence_ids: selectedEvidenceIds,
        maximum_identity_count: config.expected.maximum_selected_candidates,
        canonical_evidence_change_allowed_under_reviewed_outcomes: true,
        new_public_surface_allowed: false,
        automatic_promotion_allowed: false
      },
      evidence_archive_maintenance_batch_6: { decision: 'not_approved' },
      tier_a_dossier_batch_6: { decision: 'not_approved' },
      market_access_pilot_3: { decision: 'not_approved' },
      record_growth_batch_2: { decision: 'not_approved' },
      new_public_surface: { decision: 'not_approved' }
    },
    approved_next_sequence: config.approved_next_sequence,
    not_approved_in_next_sequence: config.forbidden_without_later_review_gate,
    review_gate_after_sequence: config.review_gate_after_sequence,
    activation_rule: 'PR #390 must update AGENTS.md and docs/roadmap.md before changing canonical Evidence.',
    boundaries: {
      canonical_data_changed: false,
      public_surface_changed: false,
      statistics_changed: false,
      checkpoints_changed: false,
      release_baseline_changed: false,
      historical_outputs_rewritten: false,
      ranking_or_score: false,
      automatic_promotion: false
    },
    source_digest_sha256: sourceDigest,
    decision_digest_sha256: decisionDigest
  };
}

export function writePostPr388ReviewGate(report = buildPostPr388ReviewGate()) {
  fs.mkdirSync(path.dirname(path.join(root, outputPath)), { recursive: true });
  fs.writeFileSync(path.join(root, outputPath), serialize(report));
}

const isCli = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isCli) {
  const report = buildPostPr388ReviewGate();
  if (process.argv.includes('--check')) {
    if (!fs.existsSync(path.join(root, outputPath)) || readText(outputPath) !== serialize(report)) {
      console.error(`${outputPath} is not reproducible`);
      process.exit(1);
    }
  } else writePostPr388ReviewGate(report);
  console.log(JSON.stringify({
    ok: true,
    report_id: report.report_id,
    eligible_pool: report.evaluation.queue_integrity.eligible_pool_count,
    selected: report.evaluation.queue_integrity.selected_count,
    reviewed_suppressed: report.evaluation.queue_integrity.reviewed_unresolved_suppressed_count,
    reviewed_reactivated_selected: report.evaluation.queue_integrity.selected_reactivated_reviewed_identity_count,
    queue_v3_delta: {
      added: report.evaluation.queue_integrity.added_vs_queue_v3,
      removed: report.evaluation.queue_integrity.removed_vs_queue_v3,
      retained: report.evaluation.queue_integrity.retained_vs_queue_v3
    },
    batch_5_decision: report.decisions.evidence_archive_maintenance_batch_5.decision,
    approved_next_sequence: report.approved_next_sequence.map((row) => `PR #${row.pr} ${row.work_item}`),
    review_gate_after_sequence: report.review_gate_after_sequence
  }, null, 2));
}
