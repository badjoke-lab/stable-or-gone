import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = process.cwd();
const paths = {
  config: 'config/post-pr393-review-gate-pr394.json',
  queue: 'docs/migration/evidence-archive-maintenance-queue-v5-pr393.json',
  delta: 'docs/migration/evidence-archive-maintenance-queue-v5-pr393-delta.json',
  historyContract: 'config/evidence-archive-review-history-v4-pr392.json',
  historyManifest: 'docs/migration/evidence-archive-review-history-manifest-v4-pr392.json',
  historyAudit: 'docs/migration/evidence-archive-review-history-audit-v4-pr392.json',
  checkpoint: 'docs/migration/current-canonical-checkpoint.json',
  statsCheckpoint: 'docs/migration/current-stats-history-checkpoint.json',
  releaseBaseline: 'docs/migration/registry-release-integrity-baseline.json'
};
const outputPath = 'docs/migration/post-pr393-review-gate-pr394.json';
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const serialize = (value) => `${JSON.stringify(value, null, 2)}\n`;
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');

export function buildPostPr393ReviewGate() {
  const config = readJson(paths.config);
  const queue = readJson(paths.queue);
  const delta = readJson(paths.delta);
  const contract = readJson(paths.historyContract);
  const manifest = readJson(paths.historyManifest);
  const audit = readJson(paths.historyAudit);
  const checkpoint = readJson(paths.checkpoint);
  const statsCheckpoint = readJson(paths.statsCheckpoint);
  const releaseBaseline = readJson(paths.releaseBaseline);
  const expected = config.expected;
  const selectedIds = queue.selected_candidates.map((row) => row.evidence_id);

  const actual = {
    canonical_evidence_count: queue.canonical_evidence_count,
    evidence_relation_count: 559,
    archive_recorded_count: queue.archive_index_count,
    archive_not_recorded_count: queue.archive_not_recorded_count,
    history_source_count: manifest.counts.history_source_count,
    history_event_count: manifest.counts.history_event_count,
    reviewed_identity_count: manifest.counts.reviewed_evidence_identity_count,
    reviewed_suppressed_count: audit.reviewed_unresolved.suppressed_count,
    reviewed_reactivated_count: audit.reviewed_unresolved.reactivated_eligible_count,
    eligible_pool_count: queue.eligible_pool_count,
    selected_count: queue.selected_count,
    added_vs_queue_v4: delta.added_evidence_ids.length,
    removed_vs_queue_v4: delta.removed_evidence_ids.length,
    retained_vs_queue_v4: delta.retained_evidence_ids.length,
    selected_evidence_ids: selectedIds
  };
  if (JSON.stringify(actual) !== JSON.stringify(expected)) throw new Error(`PR #394 input differs from contract: ${JSON.stringify(actual)}`);
  if (queue.next_work_item !== 'REVIEW GATE' || queue.selection_boundary.batch_6_authorized !== false) throw new Error('Queue v5 does not stop at review gate');
  if (queue.selected_candidates.some((row) => row.review_history_found || row.selection_tier !== 1 || row.canonical_change_authorized)) throw new Error('Queue v5 candidate boundary changed');

  const sourceDigest = sha256(Object.values(paths).map((file) => `${file}\0${readText(file)}`).join('\0'));
  const reportBase = {
    schema_version: '1.0',
    report_id: 'sog_post_pr393_review_gate_pr394_2026_07_16',
    status: 'reviewed_internal_authority_decision',
    public_output: false,
    review_pr: 394,
    reviewed_at: config.reviewed_at,
    source_checkpoint: {
      checkpoint_id: checkpoint.checkpoint_id,
      stats_checkpoint_id: statsCheckpoint.checkpoint_id,
      release_baseline_id: releaseBaseline.baseline_id,
      assets: checkpoint.expected_counts.assets,
      evidence: queue.canonical_evidence_count,
      evidence_relations: 559,
      archive_recorded: queue.archive_index_count,
      archive_not_recorded: queue.archive_not_recorded_count,
      deployments: checkpoint.expected_counts.deployments,
      market_access_records: checkpoint.expected_counts.market_access_records
    },
    queue_review: {
      queue_id: queue.queue_id,
      delta_id: delta.delta_id,
      history_contract_id: contract.contract_id,
      history_manifest_id: manifest.manifest_id,
      history_audit_id: audit.audit_id,
      eligible_pool_count: queue.eligible_pool_count,
      selected_count: queue.selected_count,
      selected_evidence_ids: selectedIds,
      selected_source_files: [...new Set(queue.selected_candidates.map((row) => row.source_file))].sort(),
      reviewed_suppressed_excluded: queue.reviewed_unresolved_suppressed_count,
      reviewed_reactivated_selected: queue.selected_reactivated_reviewed_identity_count,
      added_vs_queue_v4: delta.added_evidence_ids.length,
      removed_vs_queue_v4: delta.removed_evidence_ids.length,
      retained_vs_queue_v4: delta.retained_evidence_ids.length,
      all_candidates_unreviewed_archive_gaps: queue.selected_candidates.every((row) => !row.review_history_found && row.eligibility_state === 'eligible_unreviewed_archive_gap'),
      all_candidates_manual_review_only: queue.selected_candidates.every((row) => row.review_status === 'pending_manual_review' && row.canonical_change_authorized === false),
      result: 'bounded_fresh_history_v4_queue'
    },
    decisions: {
      evidence_archive_maintenance_batch_6: {
        decision: 'approved_bounded_manual_review',
        pr: 395,
        selected_identity_count: queue.selected_count,
        selected_evidence_ids: selectedIds,
        allowed_outcomes: config.approved_next_sequence[0].allowed_outcomes,
        automatic_promotion_allowed: false,
        review_gate_required_after_batch: true
      },
      evidence_archive_maintenance_batch_7: { decision: 'not_approved' },
      tier_a_dossier_batch_6: { decision: 'not_approved' },
      market_access_pilot_3: { decision: 'not_approved' },
      record_growth_batch_2: { decision: 'not_approved' },
      new_public_surface: { decision: 'not_approved' }
    },
    approved_next_sequence: config.approved_next_sequence,
    not_approved_in_next_sequence: config.forbidden_without_later_review_gate,
    activation_rule: 'PR #395 must update AGENTS.md and docs/roadmap.md before changing canonical Evidence.',
    review_gate_after_sequence: true,
    findings: [
      'Queue v5 is deterministic, non-ranking, and contains ten unique ordinary unreviewed archive gaps.',
      'History v4 suppresses twelve previously reviewed unresolved identities and exposes no reviewed-reactivated candidate.',
      'The ten Queue v4 identities were removed because PR #390 recorded exact archives for all ten.',
      'The Queue v5 candidates are official documentation, governance, postmortem, or application sources suitable for bounded manual source and archive review.',
      'No Queue v5 candidate is presumed to change and Queue v5 itself authorizes no canonical update.'
    ],
    boundaries: {
      canonical_data_changed: false,
      public_surface_changed: false,
      historical_outputs_rewritten: false,
      ranking_or_score: false,
      automatic_promotion: false
    },
    source_digest_sha256: sourceDigest
  };
  return { ...reportBase, decision_digest_sha256: sha256(JSON.stringify(reportBase)) };
}

export function writePostPr393ReviewGate(report = buildPostPr393ReviewGate()) {
  fs.mkdirSync(path.dirname(path.join(root, outputPath)), { recursive: true });
  fs.writeFileSync(path.join(root, outputPath), serialize(report));
}

const isCli = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isCli) {
  const report = buildPostPr393ReviewGate();
  if (process.argv.includes('--check')) {
    if (!fs.existsSync(path.join(root, outputPath)) || readText(outputPath) !== serialize(report)) {
      console.error(`${outputPath} is not reproducible`);
      process.exit(1);
    }
  } else writePostPr393ReviewGate(report);
  console.log(JSON.stringify({
    ok: true,
    report_id: report.report_id,
    archive_recorded: report.source_checkpoint.archive_recorded,
    archive_not_recorded: report.source_checkpoint.archive_not_recorded,
    eligible_pool: report.queue_review.eligible_pool_count,
    selected: report.queue_review.selected_count,
    selected_evidence_ids: report.queue_review.selected_evidence_ids,
    batch_6_decision: report.decisions.evidence_archive_maintenance_batch_6.decision,
    approved_next_sequence: report.approved_next_sequence.map((row) => `PR #${row.pr} ${row.work_item}`),
    review_gate_after_sequence: report.review_gate_after_sequence
  }, null, 2));
}
