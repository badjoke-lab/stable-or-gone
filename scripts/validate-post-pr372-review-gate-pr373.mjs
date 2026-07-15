import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { buildPostPr372ReviewGate } from './build-post-pr372-review-gate-pr373.mjs';

const root = process.cwd();
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const config = readJson('config/post-pr372-review-gate-pr373.json');
const report = readJson('docs/migration/post-pr372-review-gate-pr373.json');
const generated = buildPostPr372ReviewGate();

expect(same(report, generated), 'committed PR #373 review report is not deterministic');
expect(config.review_pr === 373 && report.review_pr === 373, 'review PR identity changed');
expect(report.status === 'reviewed_internal_authority_decision', 'review status changed');
expect(report.public_output === false, 'review output must remain internal');

expect(report.source_checkpoint.assets === config.expected.assets, 'asset checkpoint changed');
expect(report.source_checkpoint.evidence === config.expected.evidence, 'Evidence checkpoint changed');
expect(report.source_checkpoint.deployments === config.expected.deployments, 'deployment checkpoint changed');
expect(report.source_checkpoint.market_access_records === config.expected.market_access_records, 'Market Access checkpoint changed');
expect(report.source_checkpoint.archive_recorded === config.expected.archive_recorded, 'archive recorded count changed');
expect(report.source_checkpoint.archive_not_recorded === config.expected.archive_not_recorded, 'archive not-recorded count changed');

expect(report.evaluation.planning_input_correction.complete_profile_file_count === config.expected.v2_1_profile_files, 'complete profile file count changed');
expect(report.evaluation.planning_input_correction.effective_default_profile_file_count === 27, 'effective default profile file count changed');
expect(report.evaluation.planning_input_correction.omitted_or_order_corrected_profile_file_count === 2, 'effective-to-complete profile difference changed');
expect(report.evaluation.planning_input_correction.result === 'successful', 'planning input correction result changed');

expect(report.evaluation.baseline_v2_1.assets === config.expected.assets, 'v2.1 asset count changed');
expect(report.evaluation.baseline_v2_1.dimensions === 16, 'v2.1 dimension count changed');
expect(report.evaluation.baseline_v2_1.cells === 1792, 'v2.1 cell count changed');
expect(report.evaluation.baseline_v2_1.changed_cell_count === config.expected.v2_1_changed_cells, 'v2.1 changed-cell count changed');
expect(report.evaluation.baseline_v2_1.changed_asset_count === config.expected.v2_1_changed_assets, 'v2.1 changed-asset count changed');
expect(report.evaluation.baseline_v2_1.changed_cells.length === config.expected.v2_1_changed_cells, 'v2.1 changed-cell detail count changed');
expect(report.evaluation.baseline_v2_1.changed_cells.every((row) => row.dimension_id === 'redemption' && row.before_state === 'partial' && row.after_state === 'strong'), 'v2.1 cell transition contract changed');
expect(same(report.evaluation.baseline_v2_1.changed_cells.map((row) => row.asset_slug).sort(), ['busd', 'pyusd', 'rlusd', 'usdp']), 'v2.1 changed asset slugs changed');

const correctedQueue = report.evaluation.corrected_queue;
expect(correctedQueue.candidate_count === config.expected.corrected_queue_candidates, 'corrected queue count changed');
expect(same(correctedQueue.candidate_slugs, ['audd', 'nzds', 'poundtoken']), 'corrected queue slugs changed');
expect(correctedQueue.prior_reviewed_no_safe_change_count === config.expected.corrected_queue_prior_no_safe_change, 'prior no-safe-change count changed');
expect(same(correctedQueue.prior_reviewed_no_safe_change_slugs, ['audd', 'nzds', 'poundtoken']), 'prior no-safe-change slugs changed');
expect(correctedQueue.all_candidates_prior_reviewed_no_safe_change === true, 'all-candidates prior-review finding changed');
expect(correctedQueue.new_source_signal_present_in_queue === false, 'queue cannot claim a new source signal');

const queueHistory = report.evaluation.queue_builder_review_history;
expect(queueHistory.reads_pr369_outcomes === false, 'queue builder unexpectedly reads PR #369 outcomes');
expect(queueHistory.reads_reviewed_no_safe_change === false, 'queue builder unexpectedly reads no-safe-change outcomes');
expect(queueHistory.reads_prior_review_handoff === false, 'queue builder unexpectedly reads prior review handoffs');
expect(queueHistory.consumes_review_history === false, 'queue builder review-history finding changed');

expect(report.evaluation.archive_maintenance.archive_recorded === config.expected.archive_recorded, 'archive evaluation recorded count changed');
expect(report.evaluation.archive_maintenance.archive_not_recorded === config.expected.archive_not_recorded, 'archive evaluation not-recorded count changed');
expect(report.evaluation.archive_maintenance.last_batch_selected === 10, 'archive batch selected count changed');
expect(report.evaluation.archive_maintenance.last_batch_canonical_changes === 3, 'archive batch change count changed');
expect(report.evaluation.archive_maintenance.last_batch_reviewed_no_safe_change === 7, 'archive batch no-safe-change count changed');
expect(report.evaluation.archive_maintenance.decision === 'defer_until_after_queue_history_sequence', 'archive decision changed');

expect(report.evaluation.market_access.canonical_record_count === config.expected.market_access_records, 'Market Access record count changed');
expect(report.evaluation.market_access.latest_promoted_record_count === 4, 'latest Market Access promoted count changed');
expect(report.evaluation.market_access.decision === 'defer', 'Market Access decision changed');
expect(report.evaluation.monitoring.decision === 'continue_private_review_only', 'monitoring decision changed');
expect(report.evaluation.monitoring.automatic_canonical_promotion_allowed === false, 'monitoring automatic promotion changed');
expect(report.evaluation.external_usage.status === 'not_available_in_reviewed_repository_evidence', 'external usage evidence status changed');

expect(report.decisions.tier_a_dossier_batch_6.decision === 'not_approved', 'Tier A Batch 6 decision changed');
expect(report.decisions.planning_queue_review_history_contract_audit.pr === 374, 'PR #374 authority changed');
expect(report.decisions.planning_queue_review_history_contract_audit.decision === 'approved_required', 'PR #374 decision changed');
expect(report.decisions.candidate_queue_v2_2_refresh.pr === 375, 'PR #375 authority changed');
expect(report.decisions.candidate_queue_v2_2_refresh.decision === 'approved_after_pr374', 'PR #375 decision changed');
expect(report.decisions.evidence_archive_maintenance_batch_3.decision === 'not_approved_in_next_sequence', 'archive batch decision changed');
expect(report.decisions.market_access_pilot_3.decision === 'not_approved', 'Market Access Pilot 3 decision changed');
expect(report.decisions.record_growth_batch_2.decision === 'not_approved', 'Record Growth Batch 2 decision changed');
expect(report.decisions.new_public_surface.decision === 'not_approved', 'public surface decision changed');

expect(report.approved_next_sequence.length === 2, 'approved sequence length changed');
expect(same(report.approved_next_sequence.map((row) => row.pr), [374, 375]), 'approved PR sequence changed');
expect(report.review_gate_after_sequence === true, 'next sequence must end at review gate');
expect(report.activation_rule.includes('PR #374'), 'activation rule changed');

for (const key of ['canonical_data_change_allowed', 'public_surface_change_allowed', 'historical_output_rewrite_allowed', 'ranking_allowed', 'automatic_promotion_allowed']) {
  expect(config.boundaries?.[key] === false, `PR #373 config boundary changed: ${key}`);
}
for (const key of ['canonical_data_changed', 'public_surface_changed', 'historical_outputs_rewritten', 'ranking_or_score', 'automatic_promotion']) {
  expect(report.boundaries?.[key] === false, `PR #373 report boundary changed: ${key}`);
}

for (const file of [
  'docs/migration/planning-input-manifest-pr371.json',
  'docs/migration/planning-input-coverage-audit-pr371.json',
  'docs/migration/record-depth-baseline-v2-1-pr372.json',
  'docs/migration/record-depth-baseline-v2-1-pr372-summary.json',
  'docs/migration/record-depth-baseline-v2-1-pr372-delta.json',
  'docs/migration/tier-a-candidate-queue-v2-1-pr372.json',
  'docs/migration/tier-a-batch-5-pr369-review-outcomes.json',
  'docs/migration/current-canonical-checkpoint.json',
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
  ['AGENTS.md', ['PR #373 Post-PR #372 Review Gate: active; complete on merge', 'PR #374  Planning Queue Review-History Contract Audit', 'All three received `reviewed_no_safe_change` outcomes']],
  ['docs/roadmap.md', ['Status: canonical execution schedule — PR #373 review gate active', 'PR #375  Candidate Queue v2.2 Refresh', 'Market Access Pilot 3 remains deferred']],
  ['docs/quality/post-pr372-review-gate-pr373-spec.md', ['All three retained candidates', 'PR #374 Planning Queue Review-History Contract Audit', 'PR #375 Candidate Queue v2.2 Refresh']],
  ['docs/roadmap-amendments/2026-07-15-pr373-post-pr372-review-gate.md', ['Do not authorize Tier A Dossier Deepening Batch 6', 'PR #374 Planning Queue Review-History Contract Audit', 'PR #375 Candidate Queue v2.2 Refresh']]
]) {
  const text = readText(file);
  for (const marker of markers) expect(text.includes(marker), `${file}: missing authority marker ${marker}`);
}

for (const file of [
  'public/data/post-pr372-review-gate-pr373.json',
  'src/pages/post-pr372-review-gate.astro'
]) expect(!fs.existsSync(path.join(root, file)), `${file}: internal review output leaked into public surface`);

if (failures.length) {
  console.error('PR #373 Post-PR #372 Review Gate validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  report_id: report.report_id,
  corrected_queue_candidates: correctedQueue.candidate_count,
  prior_no_safe_change_candidates: correctedQueue.prior_reviewed_no_safe_change_count,
  queue_builder_consumes_review_history: queueHistory.consumes_review_history,
  archive_not_recorded: report.evaluation.archive_maintenance.archive_not_recorded,
  market_access_records: report.evaluation.market_access.canonical_record_count,
  approved_next_sequence: report.approved_next_sequence.map((row) => `PR #${row.pr} ${row.work_item}`),
  review_gate_after_sequence: report.review_gate_after_sequence
}, null, 2));
