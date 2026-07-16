import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = process.cwd();
const paths = {
  config: 'config/post-pr380-review-gate-pr381.json',
  handoff: 'docs/migration/evidence-archive-maintenance-batch-3-pr380-reviewed-handoff.json',
  outcomes: 'docs/migration/evidence-archive-maintenance-outcomes-pr380.json',
  historyAudit: 'docs/migration/evidence-archive-review-history-audit-pr377.json',
  historyManifest: 'docs/migration/evidence-archive-review-history-manifest-pr377.json',
  checkpoint: 'docs/migration/current-canonical-checkpoint.json',
  maintenance: 'data/monthly-maintenance-log.json'
};
const outputPath = 'docs/migration/post-pr380-review-gate-pr381.json';
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const serialize = (value) => `${JSON.stringify(value, null, 2)}\n`;
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');

export function buildPostPr380ReviewGate() {
  const config = readJson(paths.config);
  const handoff = readJson(paths.handoff);
  const outcomes = readJson(paths.outcomes);
  const historyAudit = readJson(paths.historyAudit);
  const historyManifest = readJson(paths.historyManifest);
  const checkpoint = readJson(paths.checkpoint);
  const maintenance = readJson(paths.maintenance);

  if (handoff.next_work_item?.decision !== 'review_gate_required') throw new Error('PR #380 handoff does not require a review gate');
  if (handoff.review_pr !== 380 || outcomes.review_pr !== 380) throw new Error('Unexpected PR #380 source identity');
  if (historyManifest.counts?.history_source_count !== 2 || historyManifest.counts?.history_event_count !== 20) throw new Error('Unexpected current history v1 inventory');

  const historyIds = new Set(historyManifest.effective_evidence_identities.map((row) => row.evidence_id));
  const pr380Ids = outcomes.outcomes.map((row) => row.evidence_id);
  const overlap = pr380Ids.filter((id) => historyIds.has(id));
  if (overlap.length) throw new Error(`PR #380 queue was not fresh relative to history v1: ${overlap.join(', ')}`);

  const exactArchiveIds = outcomes.outcomes.filter((row) => row.decision === 'dated_exact_archive_added').map((row) => row.evidence_id);
  const replacementIds = outcomes.outcomes.filter((row) => row.decision === 'reviewed_source_replacement').map((row) => row.evidence_id);
  const noSafeIds = outcomes.outcomes.filter((row) => row.decision === 'reviewed_no_safe_change').map((row) => row.evidence_id);
  const expectedV2 = config.expected_history_v2_after_pr382;
  const computedV2 = {
    sources: historyManifest.counts.history_source_count + 1,
    events: historyManifest.counts.history_event_count + outcomes.selected_count,
    reviewed_identities: historyManifest.counts.reviewed_evidence_identity_count + outcomes.selected_count,
    archive_present: historyManifest.counts.effective_archive_present_count + exactArchiveIds.length,
    archive_removed_invalid: historyManifest.counts.effective_archive_removed_invalid_count,
    no_safe_change: historyManifest.counts.effective_no_safe_change_count + noSafeIds.length,
    reviewed_source_replacement: replacementIds.length,
    reviewed_unresolved_total: historyAudit.reviewed_unresolved_archive_gaps.count + replacementIds.length + noSafeIds.length,
    reviewed_unresolved_suppressed: historyAudit.reviewed_unresolved_archive_gaps.count + noSafeIds.length,
    reviewed_reactivated_eligible: replacementIds.length
  };
  if (JSON.stringify(computedV2) !== JSON.stringify(expectedV2)) throw new Error(`Expected history v2 inventory mismatch: ${JSON.stringify(computedV2)}`);

  const sourceDigest = sha256(Object.values(paths).map((file) => `${file}\0${readText(file)}`).join('\0'));
  const reportBase = {
    schema_version: '1.0',
    report_id: 'sog_post_pr380_review_gate_pr381_2026_07_16',
    status: 'deterministic_internal_review_gate',
    public_output: false,
    review_pr: 381,
    reviewed_at: config.reviewed_at,
    source_checkpoint: {
      checkpoint_id: checkpoint.checkpoint_id,
      assets: checkpoint.asset_count,
      evidence: checkpoint.expected_counts.evidence,
      evidence_relations: handoff.canonical_counts.evidence_relations,
      deployments: checkpoint.expected_counts.deployments,
      market_access_records: checkpoint.expected_counts.market_access_records,
      archive_recorded: checkpoint.evidence_quality.archive_index_count,
      archive_not_recorded: checkpoint.evidence_quality.archive_not_recorded_count
    },
    completed_pr380: {
      selected: handoff.evidence_quality.selected,
      changed: handoff.evidence_quality.changed,
      dated_archive_added: handoff.evidence_quality.dated_archive_added,
      reviewed_source_replacement: handoff.evidence_quality.reviewed_source_replacement,
      reviewed_no_safe_change: handoff.evidence_quality.reviewed_no_safe_change,
      exact_archive_evidence_ids: exactArchiveIds,
      source_replacement_evidence_ids: replacementIds,
      no_safe_change_evidence_ids: noSafeIds,
      identity_or_relation_change: false,
      result: 'high_yield_reviewed_bounded_maintenance'
    },
    current_history_v1: {
      contract_id: historyAudit.contract_id,
      manifest_id: historyManifest.manifest_id,
      sources: historyManifest.counts.history_source_count,
      events: historyManifest.counts.history_event_count,
      reviewed_identities: historyManifest.counts.reviewed_evidence_identity_count,
      archive_present: historyManifest.counts.effective_archive_present_count,
      archive_removed_invalid: historyManifest.counts.effective_archive_removed_invalid_count,
      no_safe_change: historyManifest.counts.effective_no_safe_change_count,
      reviewed_unresolved_suppressed: historyAudit.reviewed_unresolved_archive_gaps.count,
      includes_pr380: false,
      stale_after_pr380: true
    },
    expected_history_v2_after_pr382: computedV2,
    evaluation: {
      history_update_required_before_new_queue: true,
      consumed_pr378_queue_reusable: false,
      archive_batch_4_ready: false,
      circle_mint_reactivation: {
        evidence_id: replacementIds[0],
        state: 'reviewed_source_replacement_without_archive',
        next_eligibility: 'eligible_for_fresh_archive_review_under_history_v2',
        automatic_canonical_change_allowed: false
      },
      dossier_queue_state: 'empty_history_aware_queue',
      market_access_state: 'eight_records_no_reviewed_pilot_3_manifest',
      monitoring_state: 'private_review_only_no_automatic_promotion',
      external_usage_state: 'no_repository_backed_verified_usage_signal',
      monthly_maintenance_log_status: maintenance.status ?? 'recorded'
    },
    decisions: {
      evidence_archive_review_history_contract_v2: {
        decision: 'approved_internal_contract_update',
        pr: 382,
        expected_inventory: computedV2,
        canonical_change_allowed: false,
        public_surface_change_allowed: false
      },
      evidence_archive_maintenance_queue_v3: {
        decision: 'approved_internal_queue_refresh_after_pr382',
        pr: 383,
        source_archive_not_recorded: checkpoint.evidence_quality.archive_not_recorded_count,
        maximum_selected_candidates: 10,
        canonical_change_allowed: false,
        public_surface_change_allowed: false
      },
      evidence_archive_maintenance_batch_4: { decision: config.decisions.evidence_archive_maintenance_batch_4 },
      tier_a_dossier_batch_6: { decision: config.decisions.tier_a_dossier_batch_6 },
      market_access_pilot_3: { decision: config.decisions.market_access_pilot_3 },
      record_growth_batch_2: { decision: config.decisions.record_growth_batch_2 },
      new_public_surface: { decision: config.decisions.new_public_surface },
      automatic_promotion: { decision: config.decisions.automatic_promotion }
    },
    approved_next_sequence: config.approved_sequence,
    review_gate_after_sequence: config.review_gate_after_sequence,
    activation_rule: 'PR #382 must update AGENTS.md and docs/roadmap.md before changing history contracts. PR #383 may start only after PR #382 merges. No canonical archive work is authorized before the post-PR #383 review gate.',
    boundaries: {
      canonical_data_changed: false,
      public_surface_changed: false,
      historical_outputs_rewritten: false,
      ranking_or_score: false,
      automatic_promotion: false
    },
    source_digest_sha256: sourceDigest
  };
  return { ...reportBase, report_digest_sha256: sha256(JSON.stringify(reportBase)) };
}

export function writePostPr380ReviewGate(report = buildPostPr380ReviewGate()) {
  fs.mkdirSync(path.dirname(path.join(root, outputPath)), { recursive: true });
  fs.writeFileSync(path.join(root, outputPath), serialize(report));
  return report;
}

const isCli = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isCli) {
  const report = buildPostPr380ReviewGate();
  if (process.argv.includes('--check')) {
    if (!fs.existsSync(path.join(root, outputPath)) || readText(outputPath) !== serialize(report)) {
      console.error(`${outputPath} is not reproducible`);
      process.exit(1);
    }
  } else writePostPr380ReviewGate(report);
  console.log(JSON.stringify({
    ok: true,
    report_id: report.report_id,
    archive_recorded: report.source_checkpoint.archive_recorded,
    archive_not_recorded: report.source_checkpoint.archive_not_recorded,
    pr380_yield: `${report.completed_pr380.changed}/${report.completed_pr380.selected}`,
    history_v2_sources: report.expected_history_v2_after_pr382.sources,
    history_v2_events: report.expected_history_v2_after_pr382.events,
    history_v2_identities: report.expected_history_v2_after_pr382.reviewed_identities,
    reviewed_suppressed: report.expected_history_v2_after_pr382.reviewed_unresolved_suppressed,
    reviewed_reactivated_eligible: report.expected_history_v2_after_pr382.reviewed_reactivated_eligible,
    next_sequence: report.approved_next_sequence.map((row) => `PR #${row.pr} ${row.work_item}`),
    review_gate_after_sequence: report.review_gate_after_sequence
  }, null, 2));
}
