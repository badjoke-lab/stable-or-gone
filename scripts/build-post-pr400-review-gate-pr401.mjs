import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = process.cwd();
const paths = {
  config: 'config/post-pr400-review-gate-pr401.json',
  outcomes: 'docs/migration/evidence-archive-maintenance-outcomes-pr400.json',
  handoff: 'docs/migration/evidence-archive-maintenance-batch-7-pr400-reviewed-handoff.json',
  historyContract: 'config/evidence-archive-review-history-v5-pr397.json',
  historyManifest: 'docs/migration/evidence-archive-review-history-manifest-v5-pr397.json',
  historyAudit: 'docs/migration/evidence-archive-review-history-audit-v5-pr397.json',
  checkpoint: 'docs/migration/current-canonical-checkpoint.json',
  statsCheckpoint: 'docs/migration/current-stats-history-checkpoint.json',
  releaseBaseline: 'docs/migration/registry-release-integrity-baseline.json'
};
const outputPath = 'docs/migration/post-pr400-review-gate-pr401.json';
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const serialize = (value) => `${JSON.stringify(value, null, 2)}\n`;
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');
const countBy = (rows, key) => rows.reduce((acc, row) => ({ ...acc, [row[key]]: (acc[row[key]] ?? 0) + 1 }), {});

function mapOutcome(row) {
  if (row.decision === 'dated_exact_archive_added') return 'reviewed_archive_present';
  if (row.decision === 'reviewed_source_replacement') return 'reviewed_source_replacement';
  if (row.decision === 'reviewed_no_safe_change') return 'reviewed_no_safe_change';
  throw new Error(`${row.evidence_id}: unsupported PR #400 outcome ${row.decision}`);
}

function projectHistoryV6(manifest, outcomes) {
  const effective = new Map(manifest.effective_evidence_identities.map((row) => [row.evidence_id, {
    evidence_id: row.evidence_id,
    effective_review_outcome: row.effective_review_outcome,
    effective_review_pr: row.effective_review_pr,
    current_archived_url: row.current_archived_url ?? null
  }]));
  for (const row of outcomes.outcomes) {
    effective.set(row.evidence_id, {
      evidence_id: row.evidence_id,
      effective_review_outcome: mapOutcome(row),
      effective_review_pr: 400,
      current_archived_url: row.new_archived_url ?? null
    });
  }
  const rows = [...effective.values()].sort((a, b) => a.evidence_id.localeCompare(b.evidence_id));
  const counts = countBy(rows, 'effective_review_outcome');
  const unresolved = rows.filter((row) => row.effective_review_outcome !== 'reviewed_archive_present');
  const suppressed = unresolved.filter((row) => ['reviewed_archive_removed_invalid', 'reviewed_no_safe_change'].includes(row.effective_review_outcome));
  const reactivated = unresolved.filter((row) => row.effective_review_outcome === 'reviewed_source_replacement');
  return {
    sources: manifest.counts.history_source_count + 1,
    events: manifest.counts.history_event_count + outcomes.selected_count,
    identities: rows.length,
    effective_archive_present: counts.reviewed_archive_present ?? 0,
    effective_invalid_removed: counts.reviewed_archive_removed_invalid ?? 0,
    effective_no_safe_change: counts.reviewed_no_safe_change ?? 0,
    effective_source_replacement: counts.reviewed_source_replacement ?? 0,
    reviewed_unresolved_total: unresolved.length,
    reviewed_suppressed: suppressed.length,
    reviewed_reactivated_eligible: reactivated.length,
    suppressed_evidence_ids: suppressed.map((row) => row.evidence_id),
    reactivated_evidence_ids: reactivated.map((row) => row.evidence_id),
    effective_rows: rows
  };
}

export function buildPostPr400ReviewGate() {
  const config = readJson(paths.config);
  const outcomes = readJson(paths.outcomes);
  const handoff = readJson(paths.handoff);
  const historyContract = readJson(paths.historyContract);
  const historyManifest = readJson(paths.historyManifest);
  const historyAudit = readJson(paths.historyAudit);
  const checkpoint = readJson(paths.checkpoint);
  const statsCheckpoint = readJson(paths.statsCheckpoint);
  const releaseBaseline = readJson(paths.releaseBaseline);

  if (handoff.next_work_item?.decision !== 'review_gate_required') throw new Error('PR #400 handoff does not require PR #401');
  if (outcomes.outcome_id !== handoff.outcome_id) throw new Error('PR #400 outcome/handoff mismatch');
  const projection = projectHistoryV6(historyManifest, outcomes);
  const expected = config.expected_history_v6_projection;
  const actual = {
    history_source_count: projection.sources,
    history_event_count: projection.events,
    reviewed_evidence_identity_count: projection.identities,
    effective_archive_present_count: projection.effective_archive_present,
    effective_archive_removed_invalid_count: projection.effective_invalid_removed,
    effective_no_safe_change_count: projection.effective_no_safe_change,
    effective_source_replacement_count: projection.effective_source_replacement,
    reviewed_unresolved_total_count: projection.reviewed_unresolved_total,
    reviewed_suppressed_count: projection.reviewed_suppressed,
    reviewed_reactivated_eligible_count: projection.reviewed_reactivated_eligible
  };
  if (JSON.stringify(actual) !== JSON.stringify(expected)) throw new Error(`History v6 projection differs from contract: ${JSON.stringify(actual)}`);

  const sourceDigest = sha256(Object.values(paths).map((file) => `${file}\0${readText(file)}`).join('\0'));
  const reportBase = {
    schema_version: '1.0',
    report_id: 'sog_post_pr400_review_gate_pr401_2026_07_16',
    status: 'reviewed_internal_authority_decision',
    public_output: false,
    review_pr: 401,
    reviewed_at: config.reviewed_at,
    source_checkpoint: {
      checkpoint_id: checkpoint.checkpoint_id,
      stats_checkpoint_id: statsCheckpoint.checkpoint_id,
      release_baseline_id: releaseBaseline.baseline_id,
      assets: checkpoint.expected_counts.assets,
      evidence: checkpoint.expected_counts.evidence,
      evidence_relations: handoff.canonical_counts.evidence_relations,
      archive_recorded: checkpoint.evidence_quality.archive_index_count,
      archive_not_recorded: checkpoint.evidence_quality.archive_not_recorded_count,
      deployments: checkpoint.expected_counts.deployments,
      market_access_records: checkpoint.expected_counts.market_access_records
    },
    completed_pr400: {
      outcome_id: outcomes.outcome_id,
      handoff_id: handoff.handoff_id,
      selected: outcomes.selected_count,
      changed: outcomes.changed_count,
      dated_archives_added: outcomes.dated_archive_added_count,
      reviewed_source_replacements: outcomes.reviewed_source_replacement_count,
      reviewed_no_safe_change: outcomes.reviewed_no_safe_change_count,
      changed_evidence_ids: handoff.changed_evidence_ids,
      reviewed_no_safe_change_evidence_ids: handoff.reviewed_no_safe_change_evidence_ids,
      canonical_identity_counts_preserved: handoff.canonical_counts.evidence === 559 && handoff.canonical_counts.evidence_relations === 559,
      public_surface_changed: false
    },
    current_history_v5: {
      contract_id: historyContract.contract_id,
      manifest_id: historyManifest.manifest_id,
      audit_id: historyAudit.audit_id,
      sources: historyManifest.counts.history_source_count,
      events: historyManifest.counts.history_event_count,
      reviewed_identities: historyManifest.counts.reviewed_evidence_identity_count,
      latest_included_review_pr: 395,
      stale_after_pr400: true
    },
    expected_history_v6: projection,
    findings: [
      'PR #400 completed ten bounded reviews with five exact dated archive additions and five reviewed no-safe-change outcomes.',
      'Archive coverage advanced from 425/134 to 430/129 while Evidence identities and Relations remained 559/559.',
      'History v5 is stale because it excludes all PR #400 review events.',
      'Five Paxos or PAXG identities become new reviewed no-safe-change suppressions.',
      'No reviewed source replacement remains eligible for queue reactivation.'
    ],
    decisions: {
      evidence_archive_review_history_contract_v6: {
        decision: 'approved_internal',
        pr: 402,
        expected_sources: projection.sources,
        expected_events: projection.events,
        expected_reviewed_identities: projection.identities,
        canonical_data_change_allowed: false,
        public_surface_change_allowed: false
      },
      evidence_archive_maintenance_queue_v7: {
        decision: 'approved_internal_after_pr402',
        pr: 403,
        maximum_selected_count: 10,
        canonical_data_change_allowed: false,
        public_surface_change_allowed: false,
        review_gate_required: true
      },
      evidence_archive_maintenance_batch_8: { decision: 'not_approved' },
      tier_a_dossier_batch_6: { decision: 'not_approved' },
      market_access_pilot_3: { decision: 'not_approved' },
      record_growth_batch_2: { decision: 'not_approved' },
      new_public_surface: { decision: 'not_approved' }
    },
    approved_next_sequence: config.approved_next_sequence,
    not_approved_in_next_sequence: config.forbidden_without_later_review_gate,
    review_gate_after_sequence: config.review_gate_after_sequence,
    activation_rule: 'PR #402 must update AGENTS.md and docs/roadmap.md before generating History v6 outputs.',
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

export function writePostPr400ReviewGate(report = buildPostPr400ReviewGate()) {
  fs.mkdirSync(path.dirname(path.join(root, outputPath)), { recursive: true });
  fs.writeFileSync(path.join(root, outputPath), serialize(report));
}

const isCli = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isCli) {
  const report = buildPostPr400ReviewGate();
  if (process.argv.includes('--check')) {
    if (!fs.existsSync(path.join(root, outputPath)) || readText(outputPath) !== serialize(report)) {
      console.error(`${outputPath} is not reproducible`);
      process.exit(1);
    }
  } else writePostPr400ReviewGate(report);
  console.log(JSON.stringify({
    ok: true,
    report_id: report.report_id,
    archive_recorded: report.source_checkpoint.archive_recorded,
    archive_not_recorded: report.source_checkpoint.archive_not_recorded,
    pr400_yield: `${report.completed_pr400.changed}/${report.completed_pr400.selected}`,
    history_v6: report.expected_history_v6,
    approved_next_sequence: report.approved_next_sequence.map((row) => `PR #${row.pr} ${row.work_item}`),
    review_gate_after_sequence: report.review_gate_after_sequence
  }, null, 2));
}
