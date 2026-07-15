import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { buildPostPr375ReviewGate } from './build-post-pr375-review-gate-pr376.mjs';

const root = process.cwd();
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const config = readJson('config/post-pr375-review-gate-pr376.json');
const report = readJson('docs/migration/post-pr375-review-gate-pr376.json');
const generated = buildPostPr375ReviewGate();

expect(same(report, generated), 'committed PR #376 review report is not deterministic');
expect(config.review_pr === 376 && report.review_pr === 376, 'review PR identity changed');
expect(report.status === 'reviewed_internal_authority_decision', 'review status changed');
expect(report.public_output === false, 'review output must remain internal');
expect(report.source_checkpoint.assets === config.expected.assets, 'asset checkpoint changed');
expect(report.source_checkpoint.evidence === config.expected.evidence, 'Evidence checkpoint changed');
expect(report.source_checkpoint.deployments === config.expected.deployments, 'deployment checkpoint changed');
expect(report.source_checkpoint.market_access_records === config.expected.market_access_records, 'Market Access checkpoint changed');
expect(report.source_checkpoint.archive_recorded === config.expected.archive_recorded, 'archive recorded count changed');
expect(report.source_checkpoint.archive_not_recorded === config.expected.archive_not_recorded, 'archive not-recorded count changed');

const dossier = report.evaluation.dossier_queue;
expect(dossier.source_candidate_count === config.expected.source_queue_candidates, 'source dossier queue count changed');
expect(dossier.suppressed_candidate_count === config.expected.history_suppressed_candidates, 'suppressed dossier count changed');
expect(dossier.reactivated_candidate_count === 0, 'unexpected dossier reactivation');
expect(dossier.current_candidate_count === config.expected.history_aware_queue_candidates, 'history-aware dossier queue count changed');
expect(same(dossier.removed_asset_slugs, ['audd', 'nzds', 'poundtoken']), 'removed dossier slugs changed');
expect(dossier.result === 'successful_zero_candidate_history_aware_queue', 'dossier queue result changed');

const archive = report.evaluation.archive_backlog;
expect(archive.canonical_evidence_count === config.expected.evidence, 'archive backlog Evidence count changed');
expect(archive.archive_recorded === config.expected.archive_recorded, 'archive backlog recorded count changed');
expect(archive.archive_not_recorded === config.expected.archive_not_recorded, 'archive backlog not-recorded count changed');
expect(archive.archive_coverage_percent === 69.77, 'archive coverage percentage changed');
expect(archive.result === 'largest_named_internal_quality_backlog', 'archive backlog priority changed');

const history = report.evaluation.archive_batch_history;
expect(history.pr360.selected === config.expected.archive_batch_1_selected, 'PR #360 selected count changed');
expect(history.pr360.changed === config.expected.archive_batch_1_changed, 'PR #360 changed count changed');
expect(history.pr360.no_safe_change === config.expected.archive_batch_1_no_safe_change, 'PR #360 no-safe count changed');
expect(history.pr365.selected === config.expected.archive_batch_2_selected, 'PR #365 selected count changed');
expect(history.pr365.changed === config.expected.archive_batch_2_changed, 'PR #365 changed count changed');
expect(history.pr365.no_safe_change === config.expected.archive_batch_2_no_safe_change, 'PR #365 no-safe count changed');
expect(history.total_reviewed_identity_occurrences === 20, 'combined reviewed identity occurrences changed');
expect(history.total_no_safe_change_occurrences === 9, 'combined no-safe occurrences changed');
expect(history.pr360.no_safe_change_evidence_ids.length === 2, 'PR #360 no-safe identity list changed');
expect(history.pr365.no_safe_change_evidence_ids.length === 7, 'PR #365 no-safe identity list changed');

const archiveHistory = report.evaluation.archive_queue_review_history;
expect(archiveHistory.excludes_pr360_selected_queue === true, 'PR #365 queue no longer excludes PR #360 selection');
expect(archiveHistory.reads_pr360_outcomes === false, 'PR #365 builder unexpectedly reads PR #360 outcomes');
expect(archiveHistory.reads_pr365_outcomes === false, 'PR #365 builder unexpectedly reads PR #365 outcomes');
expect(archiveHistory.reads_reviewed_no_safe_change === false, 'PR #365 builder unexpectedly reads no-safe outcomes');
expect(archiveHistory.reads_archive_review_history_manifest === false, 'PR #365 builder unexpectedly reads archive history manifest');
expect(archiveHistory.consumes_complete_archive_review_history === false, 'archive queue history finding changed');
expect(archiveHistory.excluded_pr360_selected_count === 10, 'PR #360 excluded selection count changed');
expect(archiveHistory.pr365_reviewed_outcome_count === 10, 'PR #365 reviewed outcome count changed');
expect(report.evaluation.archive_batch_3_readiness.canonical_change_decision === 'not_approved', 'archive batch 3 readiness changed');

expect(report.evaluation.market_access.canonical_record_count === config.expected.market_access_records, 'Market Access record count changed');
expect(report.evaluation.market_access.latest_promoted_record_count === 4, 'latest Market Access promoted count changed');
expect(report.evaluation.market_access.decision === 'defer', 'Market Access decision changed');
expect(report.evaluation.monitoring.decision === 'continue_private_review_only', 'monitoring decision changed');
expect(report.evaluation.monitoring.automatic_canonical_promotion_allowed === false, 'monitoring promotion changed');
expect(report.evaluation.external_usage.status === 'not_available_in_reviewed_repository_evidence', 'external usage status changed');

expect(report.decisions.evidence_archive_review_history_contract_audit.pr === 377, 'PR #377 authority changed');
expect(report.decisions.evidence_archive_review_history_contract_audit.decision === 'approved_required', 'PR #377 decision changed');
expect(report.decisions.evidence_archive_maintenance_queue_v2_refresh.pr === 378, 'PR #378 authority changed');
expect(report.decisions.evidence_archive_maintenance_queue_v2_refresh.decision === 'approved_after_pr377', 'PR #378 decision changed');
expect(report.decisions.evidence_archive_maintenance_batch_3.decision === 'not_approved_before_next_review_gate', 'archive batch 3 decision changed');
expect(report.decisions.tier_a_dossier_batch_6.decision === 'not_approved', 'dossier batch decision changed');
expect(report.decisions.market_access_pilot_3.decision === 'not_approved', 'Market Access Pilot 3 decision changed');
expect(report.decisions.record_growth_batch_2.decision === 'not_approved', 'Record Growth Batch 2 decision changed');
expect(report.decisions.new_public_surface.decision === 'not_approved', 'public surface decision changed');
expect(same(report.approved_next_sequence.map((row) => row.pr), [377, 378]), 'approved PR sequence changed');
expect(report.review_gate_after_sequence === true, 'next sequence must end at review gate');
expect(report.activation_rule.includes('PR #377'), 'activation rule changed');

for (const key of ['canonical_data_change_allowed', 'public_surface_change_allowed', 'historical_output_rewrite_allowed', 'ranking_allowed', 'automatic_promotion_allowed']) {
  expect(config.boundaries?.[key] === false, `config boundary changed: ${key}`);
}
for (const key of ['canonical_data_changed', 'public_surface_changed', 'historical_outputs_rewritten', 'ranking_or_score', 'automatic_promotion']) {
  expect(report.boundaries?.[key] === false, `report boundary changed: ${key}`);
}

for (const file of [
  'docs/migration/tier-a-candidate-queue-v2-2-pr375.json',
  'docs/migration/tier-a-candidate-queue-v2-2-pr375-delta.json',
  'docs/migration/planning-queue-review-history-audit-pr374.json',
  'docs/migration/current-canonical-checkpoint.json',
  'docs/migration/evidence-correction-outcomes-pr360.json',
  'docs/migration/evidence-archive-maintenance-queue-pr365.json',
  'docs/migration/evidence-archive-maintenance-outcomes-pr365.json',
  'docs/migration/evidence-archive-maintenance-batch-2-pr365-reviewed-handoff.json',
  'scripts/build-evidence-archive-maintenance-queue-pr365.mjs',
  'docs/migration/market-access-pilot-2-pr359-reviewed-handoff.json',
  'data/monthly-maintenance-log.json'
]) {
  try {
    expect(git('hash-object', file) === git('rev-parse', `origin/main:${file}`), `${file}: immutable Git blob identity changed`);
  } catch (error) {
    failures.push(`${file}: unable to verify origin/main blob identity: ${error.message}`);
  }
}

for (const [file, markers] of [
  ['AGENTS.md', ['PR #376 Post-PR #375 Review Gate: active; complete on merge', 'PR #377  Evidence Archive Review-History Contract Audit', 'archive not recorded: 169']],
  ['docs/roadmap.md', ['Status: canonical execution schedule — PR #376 review gate active', 'PR #378  Evidence Archive Maintenance Queue v2 Refresh', 'archive coverage: 69.77%']],
  ['docs/quality/post-pr375-review-gate-pr376-spec.md', ['PR #377 Evidence Archive Review-History Contract Audit', 'PR #378 Evidence Archive Maintenance Queue v2 Refresh', 'does not consume PR #365 reviewed outcomes']],
  ['docs/roadmap-amendments/2026-07-15-pr376-post-pr375-review-gate.md', ['Do not authorize canonical Evidence changes yet', 'PR #377 Evidence Archive Review-History Contract Audit', 'PR #378 Evidence Archive Maintenance Queue v2 Refresh']]
]) {
  const text = readText(file);
  for (const marker of markers) expect(text.includes(marker), `${file}: missing authority marker ${marker}`);
}

for (const file of ['public/data/post-pr375-review-gate-pr376.json', 'src/pages/post-pr375-review-gate.astro']) {
  expect(!fs.existsSync(path.join(root, file)), `${file}: internal review output leaked into public surface`);
}

if (failures.length) {
  console.error('PR #376 Post-PR #375 Review Gate validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  report_id: report.report_id,
  dossier_queue_candidates: dossier.current_candidate_count,
  archive_not_recorded: archive.archive_not_recorded,
  archive_history_complete: archiveHistory.consumes_complete_archive_review_history,
  approved_next_sequence: report.approved_next_sequence.map((row) => `PR #${row.pr} ${row.work_item}`),
  review_gate_after_sequence: report.review_gate_after_sequence
}, null, 2));
