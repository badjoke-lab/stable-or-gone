import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { buildPostPr369ReviewGate } from './build-post-pr369-review-gate-pr370.mjs';

const root = process.cwd();
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const config = readJson('config/post-pr369-review-gate-pr370.json');
const report = readJson('docs/migration/post-pr369-review-gate-pr370.json');
const generated = buildPostPr369ReviewGate();
const queue = readJson('docs/migration/tier-a-candidate-queue-v2-pr368.json');
const handoff = readJson('docs/migration/tier-a-batch-5-pr369-reviewed-handoff.json');

expect(same(report, generated), 'committed PR #370 review report is not deterministic');
expect(config.review_pr === 370 && report.review_pr === 370, 'review PR identity changed');
expect(report.status === 'reviewed_internal_authority_decision', 'review report status changed');
expect(report.public_output === false, 'review report must remain internal');
expect(report.source_checkpoint.assets === 112, 'asset checkpoint changed');
expect(report.source_checkpoint.evidence === 559, 'Evidence checkpoint changed');
expect(report.source_checkpoint.deployments === 174, 'deployment checkpoint changed');
expect(report.source_checkpoint.market_access_records === 8, 'Market Access checkpoint changed');
expect(report.completed_sequence.length === 3, 'completed sequence length changed');
expect(same(report.completed_sequence.map((row) => row.pr), [367, 368, 369]), 'completed sequence PR order changed');

expect(queue.candidate_count === 6, 'PR #368 queue candidate count changed');
expect(report.evaluation.queue_quality.candidate_count === 6, 'review queue count mismatch');
expect(report.evaluation.queue_quality.prior_reviewed_candidate_count === 6, 'all six queue candidates must remain prior-reviewed');
expect(report.evaluation.queue_quality.all_candidates_previously_reviewed === true, 'queue recurrence finding changed');
expect(same(report.evaluation.queue_quality.candidate_slugs, ['audd', 'busd', 'nzds', 'poundtoken', 'rlusd', 'usdp']), 'queue slug set/order changed');
expect(same(report.evaluation.queue_quality.prior_reviewed_candidate_slugs, report.evaluation.queue_quality.candidate_slugs), 'prior-reviewed queue set mismatch');

expect(handoff.result_counts.selected_assets === 5, 'PR #369 selected count changed');
expect(handoff.result_counts.canonical_improvement_assets === 0, 'PR #369 zero-yield boundary changed');
expect(handoff.result_counts.reviewed_no_safe_change_assets === 3, 'PR #369 no-safe-change count changed');
expect(handoff.result_counts.prior_completed_no_duplicate_change_assets === 2, 'PR #369 duplicate-rejection count changed');
expect(report.evaluation.batch_5_yield.change_yield_percent === 0, 'PR #369 change-yield calculation changed');

expect(report.evaluation.planning_input_coverage.canonical_builder_default_profile_override_files_empty === true, 'canonical builder default override finding not reproduced');
expect(report.evaluation.planning_input_coverage.v2_builder_calls_canonical_builder_without_options === true, 'PR #368 no-options call finding not reproduced');
expect(report.decisions.planning_input_coverage_audit.decision === 'approved_required', 'PR #371 decision changed');
expect(report.decisions.planning_input_coverage_audit.pr === 371, 'PR #371 identity changed');
expect(report.decisions.record_depth_baseline_v2_1_refresh.decision === 'approved_after_input_audit', 'PR #372 decision changed');
expect(report.decisions.record_depth_baseline_v2_1_refresh.pr === 372, 'PR #372 identity changed');
expect(report.decisions.tier_a_dossier_batch_6.decision === 'not_approved', 'Dossier Batch 6 must remain unapproved');
expect(report.decisions.record_growth_batch_2.decision === 'not_approved', 'Record Growth Batch 2 must remain unapproved');
expect(report.decisions.market_access_pilot_3.decision === 'not_approved', 'Market Access Pilot 3 must remain unapproved');
expect(report.decisions.new_public_surface.decision === 'not_approved', 'new public surface must remain unapproved');

expect(report.approved_next_sequence.length === 2, 'approved next sequence must contain exactly two work items');
expect(same(report.approved_next_sequence.map((row) => row.pr), [371, 372]), 'approved next sequence order changed');
expect(report.approved_next_sequence.every((row) => row.canonical_data_change_allowed === false), 'next sequence canonical boundary changed');
expect(report.approved_next_sequence.every((row) => row.public_surface_allowed === false), 'next sequence public boundary changed');
expect(report.review_gate_after_sequence === true, 'next sequence must end at a review gate');
expect(report.activation_rule.includes('PR #371'), 'PR #371 activation rule missing');
expect(same(report.not_approved_in_next_sequence, config.forbidden_without_later_review_gate), 'forbidden sequence list mismatch');
expect(report.boundaries.canonical_data_changed === false, 'canonical data boundary changed');
expect(report.boundaries.public_surface_changed === false, 'public surface boundary changed');
expect(report.boundaries.historical_outputs_rewritten === false, 'historical output boundary changed');
expect(report.boundaries.ranking_or_score === false, 'ranking boundary changed');
expect(report.boundaries.automatic_promotion === false, 'automatic-promotion boundary changed');

for (const file of [
  'config/planning-dimension-semantics-v2.json',
  'docs/migration/planning-dimension-semantics-audit-pr367.json',
  'docs/migration/record-depth-baseline-v2-pr368.json',
  'docs/migration/record-depth-baseline-v2-pr368-summary.json',
  'docs/migration/record-depth-baseline-v2-pr368-delta.json',
  'docs/migration/tier-a-candidate-queue-v2-pr368.json',
  'docs/migration/tier-a-batch-5-pr369-review-outcomes.json',
  'docs/migration/tier-a-batch-5-pr369-reviewed-handoff.json',
  'scripts/growth/build-reviewed-record-depth-baseline-pr353.mjs',
  'scripts/build-record-depth-baseline-v2-refresh-pr368.mjs',
  'docs/migration/current-canonical-checkpoint.json'
]) {
  try {
    expect(git('hash-object', file) === git('rev-parse', `origin/main:${file}`), `${file}: immutable Git blob identity changed`);
  } catch (error) {
    failures.push(`${file}: unable to verify origin/main blob identity: ${error.message}`);
  }
}

for (const [file, markers] of [
  ['AGENTS.md', ['PR #370 Post-PR #369 Review Gate: active; complete on merge', 'Current authority: REVIEW GATE', 'PR #371  Planning Input Coverage Audit']],
  ['docs/roadmap.md', ['Status: canonical execution schedule — PR #370 review gate active', 'PR #371  Planning Input Coverage Audit', 'PR #372  Record Depth Baseline v2.1 Refresh']],
  ['docs/quality/post-pr369-review-gate-pr370-spec.md', ['All six PR #368 queue candidates', 'profileOverrideFiles', 'PR #371 — Planning Input Coverage Audit']],
  ['docs/roadmap-amendments/2026-07-15-pr370-post-pr369-review-gate.md', ['PR #371  Planning Input Coverage Audit', 'PR #372  Record Depth Baseline v2.1 Refresh', 'The next problem is not another dossier batch']]
]) {
  const text = readText(file);
  for (const marker of markers) expect(text.includes(marker), `${file}: missing authority marker ${marker}`);
}

for (const file of [
  'public/data/post-pr369-review-gate-pr370.json',
  'dist/data/post-pr369-review-gate-pr370.json',
  'src/pages/post-pr369-review-gate.astro'
]) expect(!fs.existsSync(path.join(root, file)), `${file}: internal review output leaked into public surface`);

if (failures.length) {
  console.error('PR #370 Post-PR #369 Review Gate validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  report_id: report.report_id,
  queue_candidates: report.evaluation.queue_quality.candidate_count,
  prior_reviewed_candidates: report.evaluation.queue_quality.prior_reviewed_candidate_count,
  batch_5_change_yield_percent: report.evaluation.batch_5_yield.change_yield_percent,
  approved_next_sequence: report.approved_next_sequence.map((row) => `PR #${row.pr} ${row.work_item}`),
  review_gate_after_sequence: report.review_gate_after_sequence
}, null, 2));
