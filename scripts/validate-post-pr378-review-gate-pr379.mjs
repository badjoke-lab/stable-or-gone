import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { buildPostPr378ReviewGate } from './build-post-pr378-review-gate-pr379.mjs';

const root = process.cwd();
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const config = readJson('config/post-pr378-review-gate-pr379.json');
const report = readJson('docs/migration/post-pr378-review-gate-pr379.json');
const queue = readJson('docs/migration/evidence-archive-maintenance-queue-v2-pr378.json');
const delta = readJson('docs/migration/evidence-archive-maintenance-queue-v2-pr378-delta.json');
const generated = buildPostPr378ReviewGate();

expect(same(report, generated), 'committed PR #379 review report is not deterministic');
expect(config.review_pr === 379 && report.review_pr === 379, 'review PR identity changed');
expect(report.status === 'reviewed_internal_authority_decision', 'review status changed');
expect(report.public_output === false, 'review output must remain internal');
expect(report.source_checkpoint.assets === config.expected.assets, 'asset checkpoint changed');
expect(report.source_checkpoint.evidence === config.expected.evidence, 'Evidence checkpoint changed');
expect(report.source_checkpoint.archive_recorded === config.expected.archive_recorded, 'archive-recorded checkpoint changed');
expect(report.source_checkpoint.archive_not_recorded === config.expected.archive_not_recorded, 'archive-not-recorded checkpoint changed');

const integrity = report.evaluation.queue_integrity;
expect(integrity.queue_id === queue.queue_id, 'queue identity mismatch');
expect(integrity.canonical_evidence_count === config.expected.evidence, 'queue Evidence count changed');
expect(integrity.archive_recorded_count === config.expected.archive_recorded, 'queue archive-recorded count changed');
expect(integrity.archive_not_recorded_count === config.expected.archive_not_recorded, 'queue archive-not-recorded count changed');
expect(integrity.reviewed_unresolved_suppressed_count === config.expected.reviewed_unresolved_suppressed, 'reviewed suppression count changed');
expect(integrity.reactivated_reviewed_identity_count === config.expected.reactivated_reviewed_identities, 'reviewed reactivation count changed');
expect(integrity.selected_count === config.expected.selected_queue_candidates, 'selected count changed');
expect(integrity.maximum_selected_count === config.expected.maximum_selected_candidates, 'maximum selected count changed');
expect(integrity.selected_evidence_ids.length === integrity.selected_count, 'selected identity list count mismatch');
expect(new Set(integrity.selected_evidence_ids).size === integrity.selected_count, 'selected Evidence IDs are not unique');
expect(same(integrity.selected_evidence_ids, queue.selected_candidates.map((row) => row.evidence_id)), 'report/queue selected identities mismatch');
expect(integrity.deterministic_order === true, 'deterministic order finding changed');
expect(integrity.all_candidates_manual_review_only === true, 'manual-review-only finding changed');
expect(integrity.result === 'bounded_fresh_history_aware_queue', 'queue readiness result changed');

const history = report.evaluation.history_enforcement;
expect(history.reviewed_unresolved_count === config.expected.reviewed_unresolved_suppressed, 'history unresolved count changed');
expect(history.exact_suppressed_ids_preserved === true, 'history suppressed ID preservation failed');
expect(history.reviewed_reactivation_signal_count === 0, 'unexpected reviewed reactivation');
expect(history.automatic_time_expiry === false, 'automatic time expiry changed');
expect(history.result === 'successful', 'history enforcement result changed');
expect(same([...delta.reviewed_unresolved_suppressed_evidence_ids].sort(), [...readJson('docs/migration/evidence-archive-review-history-audit-pr377.json').reviewed_unresolved_archive_gaps.evidence_ids].sort()), 'queue delta/history audit suppression mismatch');

const prior = report.evaluation.prior_batch_yield;
expect(prior.pr360.selected === config.expected.prior_batch_1_selected, 'PR #360 selected count changed');
expect(prior.pr360.changed === config.expected.prior_batch_1_changed, 'PR #360 changed count changed');
expect(prior.pr365.selected === config.expected.prior_batch_2_selected, 'PR #365 selected count changed');
expect(prior.pr365.changed === config.expected.prior_batch_2_changed, 'PR #365 changed count changed');
expect(prior.pr360.change_yield_percent === 80, 'PR #360 yield changed');
expect(prior.pr365.change_yield_percent === 30, 'PR #365 yield changed');

const readiness = report.evaluation.batch_3_readiness;
expect(readiness.decision === 'approved_bounded_manual_review', 'Batch 3 readiness changed');
expect(readiness.selected_identity_count === config.expected.selected_queue_candidates, 'Batch 3 selected identity count changed');
expect(same(readiness.allowed_outcomes, ['dated_exact_archive_added', 'reviewed_source_replacement', 'reviewed_no_safe_change']), 'allowed outcomes changed');
expect(readiness.canonical_change_allowed_only_after_reviewed_exact_capture_or_equivalent_replacement === true, 'canonical change condition changed');
expect(readiness.automatic_promotion_allowed === false, 'automatic promotion changed');
expect(readiness.review_gate_required_after_batch === true, 'post-batch review gate changed');

const decision = report.decisions.evidence_archive_maintenance_batch_3;
expect(decision.decision === 'approved_bounded', 'Batch 3 authority changed');
expect(decision.pr === 380, 'Batch 3 PR number changed');
expect(same(decision.selected_evidence_ids, integrity.selected_evidence_ids), 'Batch 3 selected identity scope changed');
expect(decision.maximum_identity_count === 10, 'Batch 3 maximum identity count changed');
expect(decision.canonical_evidence_change_allowed_under_reviewed_outcomes === true, 'Batch 3 reviewed canonical-change boundary changed');
expect(decision.new_public_surface_allowed === false, 'new public surface boundary changed');
expect(decision.automatic_promotion_allowed === false, 'Batch 3 automatic promotion boundary changed');
expect(report.decisions.evidence_archive_maintenance_batch_4.decision === 'not_approved', 'Batch 4 decision changed');
expect(report.decisions.tier_a_dossier_batch_6.decision === 'not_approved', 'dossier batch decision changed');
expect(report.decisions.market_access_pilot_3.decision === 'not_approved', 'Market Access decision changed');
expect(report.approved_next_sequence.length === 1 && report.approved_next_sequence[0].pr === 380, 'approved sequence changed');
expect(report.review_gate_after_sequence === true, 'next sequence must end at review gate');
expect(report.activation_rule.includes('PR #380'), 'activation rule changed');

for (const key of ['current_pr_canonical_data_change_allowed', 'current_pr_public_surface_change_allowed', 'historical_output_rewrite_allowed', 'ranking_allowed', 'automatic_promotion_allowed']) {
  expect(config.boundaries?.[key] === false, `config boundary changed: ${key}`);
}
for (const key of ['canonical_data_changed', 'public_surface_changed', 'historical_outputs_rewritten', 'ranking_or_score', 'automatic_promotion']) {
  expect(report.boundaries?.[key] === false, `report boundary changed: ${key}`);
}

for (const file of [
  'docs/migration/evidence-archive-maintenance-queue-v2-pr378.json',
  'docs/migration/evidence-archive-maintenance-queue-v2-pr378-delta.json',
  'config/evidence-archive-review-history-v1-pr377.json',
  'docs/migration/evidence-archive-review-history-manifest-pr377.json',
  'docs/migration/evidence-archive-review-history-audit-pr377.json',
  'docs/migration/current-canonical-checkpoint.json',
  'docs/migration/evidence-correction-outcomes-pr360.json',
  'docs/migration/evidence-archive-maintenance-outcomes-pr365.json'
]) {
  try {
    expect(git('hash-object', file) === git('rev-parse', `origin/main:${file}`), `${file}: immutable Git blob identity changed`);
  } catch (error) {
    failures.push(`${file}: unable to verify origin/main blob identity: ${error.message}`);
  }
}

for (const [file, markers] of [
  ['AGENTS.md', ['PR #379 Post-PR #378 Review Gate: active; complete on merge', 'PR #380 Evidence and Archive Maintenance Batch 3', 'fresh selected candidates: 10']],
  ['docs/roadmap.md', ['Status: canonical execution schedule — PR #379 review gate active', 'PR #380 Evidence and Archive Maintenance Batch 3', 'fresh selected candidates: 10']],
  ['docs/quality/post-pr378-review-gate-pr379-spec.md', ['PR #380 Evidence and Archive Maintenance Batch 3', 'dated_exact_archive_added', 'reviewed_source_replacement']],
  ['docs/roadmap-amendments/2026-07-15-pr379-post-pr378-review-gate.md', ['Approve exactly', 'PR #380 Evidence and Archive Maintenance Batch 3', 'Every other identity must receive a reviewed no-safe-change outcome']]
]) {
  const value = readText(file);
  for (const marker of markers) expect(value.includes(marker), `${file}: missing authority marker ${marker}`);
}

for (const file of ['public/data/post-pr378-review-gate-pr379.json', 'src/pages/post-pr378-review-gate.astro']) {
  expect(!fs.existsSync(path.join(root, file)), `${file}: internal review output leaked into public surface`);
}

if (failures.length) {
  console.error('PR #379 Post-PR #378 Review Gate validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  report_id: report.report_id,
  selected_candidates: integrity.selected_count,
  reviewed_suppressed: integrity.reviewed_unresolved_suppressed_count,
  batch_3_decision: decision.decision,
  batch_3_pr: decision.pr,
  next_sequence: report.approved_next_sequence.map((row) => `PR #${row.pr} ${row.work_item}`),
  review_gate_after_sequence: report.review_gate_after_sequence
}, null, 2));
