import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { buildPostPr388ReviewGate } from './build-post-pr388-review-gate-pr389.mjs';

const root = process.cwd();
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const config = readJson('config/post-pr388-review-gate-pr389.json');
const report = readJson('docs/migration/post-pr388-review-gate-pr389.json');
const queue = readJson('docs/migration/evidence-archive-maintenance-queue-v4-pr388.json');
const delta = readJson('docs/migration/evidence-archive-maintenance-queue-v4-pr388-delta.json');
const contract = readJson('config/evidence-archive-review-history-v3-pr387.json');
const manifest = readJson('docs/migration/evidence-archive-review-history-manifest-v3-pr387.json');
const audit = readJson('docs/migration/evidence-archive-review-history-audit-v3-pr387.json');
const checkpoint = readJson('docs/migration/current-canonical-checkpoint.json');
const statsCheckpoint = readJson('docs/migration/current-stats-history-checkpoint.json');
const releaseBaseline = readJson('docs/migration/registry-release-integrity-baseline.json');
const generated = buildPostPr388ReviewGate();

expect(same(report, generated), 'committed PR #389 review report is not deterministic');
expect(config.review_pr === 389 && report.review_pr === 389, 'review PR identity changed');
expect(report.report_id === 'sog_post_pr388_review_gate_pr389_2026_07_16', 'review report ID changed');
expect(report.status === 'reviewed_internal_authority_decision', 'review report status changed');
expect(report.public_output === false, 'review report must remain internal');

const expected = config.expected;
expect(report.source_checkpoint.assets === expected.assets, 'asset count mismatch');
expect(report.source_checkpoint.evidence === expected.evidence, 'Evidence count mismatch');
expect(report.source_checkpoint.evidence_relations === expected.evidence_relations, 'Evidence Relation count mismatch');
expect(report.source_checkpoint.archive_recorded === expected.archive_recorded, 'archive-recorded count mismatch');
expect(report.source_checkpoint.archive_not_recorded === expected.archive_not_recorded, 'archive-not-recorded count mismatch');
expect(checkpoint.expected_counts.assets === expected.assets, 'checkpoint asset count changed');
expect(checkpoint.expected_counts.evidence === expected.evidence, 'checkpoint Evidence count changed');
expect(checkpoint.evidence_quality.archive_index_count === expected.archive_recorded, 'checkpoint archive count changed');
expect(checkpoint.evidence_quality.archive_not_recorded_count === expected.archive_not_recorded, 'checkpoint no-archive count changed');
expect(statsCheckpoint.canonical_checkpoint_id === checkpoint.checkpoint_id, 'stats checkpoint/current checkpoint binding changed');
expect(releaseBaseline.evidence_quality.archive_index_count === expected.archive_recorded, 'release archive count changed');
expect(releaseBaseline.evidence_quality.archive_not_recorded_count === expected.archive_not_recorded, 'release no-archive count changed');

const q = report.evaluation.queue_integrity;
const selectedIds = queue.selected_candidates.map((row) => row.evidence_id);
expect(q.queue_id === queue.queue_id, 'queue identity mismatch');
expect(q.eligible_pool_count === expected.eligible_pool, 'eligible pool count mismatch');
expect(q.selected_count === expected.selected_queue_candidates, 'selected queue count mismatch');
expect(q.maximum_selected_count === expected.maximum_selected_candidates, 'maximum selected count mismatch');
expect(q.reviewed_unresolved_suppressed_count === expected.reviewed_unresolved_suppressed, 'suppressed count mismatch');
expect(q.reactivated_reviewed_identity_count === expected.reviewed_reactivated_eligible, 'reactivated count mismatch');
expect(q.selected_reactivated_reviewed_identity_count === expected.selected_reactivated_candidates, 'selected reactivated count mismatch');
expect(same(q.selected_evidence_ids, expected.selected_evidence_ids), 'review report selected IDs differ from contract');
expect(same(q.selected_evidence_ids, selectedIds), 'review report selected IDs differ from Queue v4');
expect(q.added_vs_queue_v3 === expected.queue_v3_added, 'Queue v3 added delta mismatch');
expect(q.removed_vs_queue_v3 === expected.queue_v3_removed, 'Queue v3 removed delta mismatch');
expect(q.retained_vs_queue_v3 === expected.queue_v3_retained, 'Queue v3 retained delta mismatch');
expect(same(q.retained_evidence_ids, ['sog_src_fdusd_site']), 'FDUSD is not the sole retained identity');
expect(q.deterministic_order === true && q.all_candidates_manual_review_only === true, 'queue integrity finding changed');
expect(new Set(selectedIds).size === selectedIds.length, 'Queue v4 selected IDs are not unique');
expect(selectedIds[0] === 'sog_src_fdusd_site', 'FDUSD reviewed-reactivated identity is not selected first');

const h = report.evaluation.history_enforcement;
expect(h.contract_id === contract.contract_id, 'history contract provenance mismatch');
expect(h.manifest_id === manifest.manifest_id, 'history manifest provenance mismatch');
expect(h.audit_id === audit.audit_id, 'history audit provenance mismatch');
expect(h.history_source_count === expected.history_sources, 'history source count mismatch');
expect(h.history_event_count === expected.history_events, 'history event count mismatch');
expect(h.reviewed_identity_count === expected.reviewed_identities, 'reviewed identity count mismatch');
expect(h.reviewed_unresolved_suppressed === expected.reviewed_unresolved_suppressed, 'history suppression count mismatch');
expect(h.reviewed_reactivated_eligible === expected.reviewed_reactivated_eligible, 'history reactivation count mismatch');
expect(same(h.reviewed_reactivated_evidence_ids, ['sog_src_fdusd_site']), 'history reactivated ID changed');
expect(h.exact_suppressed_ids_preserved === true, 'suppressed history IDs were not preserved');
expect(h.exact_reactivated_ids_preserved === true, 'reactivated history IDs were not preserved');
expect(h.reviewed_reactivated_selected_first === true, 'reviewed-reactivated identity was not selected first');
expect(h.automatic_time_expiry === false, 'automatic history expiry changed');

const decision = report.decisions.evidence_archive_maintenance_batch_5;
expect(decision.decision === 'approved_bounded', 'Batch 5 decision changed');
expect(decision.pr === 390, 'Batch 5 PR number changed');
expect(same(decision.selected_evidence_ids, selectedIds), 'Batch 5 authority IDs differ from Queue v4');
expect(decision.maximum_identity_count === 10, 'Batch 5 maximum identity count changed');
expect(decision.canonical_evidence_change_allowed_under_reviewed_outcomes === true, 'reviewed canonical outcome boundary changed');
expect(decision.new_public_surface_allowed === false, 'public surface boundary changed');
expect(decision.automatic_promotion_allowed === false, 'automatic promotion boundary changed');
expect(report.decisions.evidence_archive_maintenance_batch_6?.decision === 'not_approved', 'Batch 6 was unexpectedly approved');
expect(report.approved_next_sequence.length === 1, 'approved sequence length changed');
expect(report.approved_next_sequence[0].pr === 390 && report.approved_next_sequence[0].work_item === 'Evidence and Archive Maintenance Batch 5', 'approved sequence changed');
expect(report.review_gate_after_sequence === true, 'review gate after Batch 5 changed');
expect(report.activation_rule.includes('PR #390'), 'PR #390 activation rule missing');

expect(delta.added_evidence_ids.length === expected.queue_v3_added, 'delta added count changed');
expect(delta.removed_evidence_ids.length === expected.queue_v3_removed, 'delta removed count changed');
expect(delta.retained_evidence_ids.length === expected.queue_v3_retained, 'delta retained count changed');
expect(delta.retained_evidence_ids[0] === 'sog_src_fdusd_site', 'delta retained identity changed');
expect(queue.next_work_item === 'REVIEW GATE' && delta.next_work_item === 'REVIEW GATE', 'Queue v4 does not stop at review gate');

for (const key of ['current_pr_canonical_data_change_allowed', 'current_pr_public_surface_change_allowed', 'historical_output_rewrite_allowed', 'ranking_allowed', 'automatic_promotion_allowed']) {
  expect(config.boundaries?.[key] === false, `config boundary changed: ${key}`);
}
for (const key of ['canonical_data_changed', 'public_surface_changed', 'statistics_changed', 'checkpoints_changed', 'release_baseline_changed', 'historical_outputs_rewritten', 'ranking_or_score', 'automatic_promotion']) {
  expect(report.boundaries?.[key] === false, `report boundary changed: ${key}`);
}

let originMainAvailable = false;
try { git('rev-parse', '--verify', 'origin/main'); originMainAvailable = true; } catch {}
if (originMainAvailable) {
  for (const file of [
    'docs/migration/evidence-archive-maintenance-queue-v4-pr388.json',
    'docs/migration/evidence-archive-maintenance-queue-v4-pr388-delta.json',
    'config/evidence-archive-review-history-v3-pr387.json',
    'docs/migration/evidence-archive-review-history-manifest-v3-pr387.json',
    'docs/migration/evidence-archive-review-history-audit-v3-pr387.json',
    'docs/migration/current-canonical-checkpoint.json',
    'docs/migration/current-stats-history-checkpoint.json',
    'docs/migration/registry-release-integrity-baseline.json'
  ]) {
    try {
      expect(git('hash-object', file) === git('rev-parse', `origin/main:${file}`), `${file}: immutable Git blob identity changed`);
    } catch (error) {
      failures.push(`${file}: unable to verify origin/main blob identity: ${error.message}`);
    }
  }
}

for (const [file, markers] of [
  ['AGENTS.md', ['PR #389 Post-PR #388 Review Gate: active; complete on merge', 'PR #390 Evidence and Archive Maintenance Batch 5: approved next', 'REVIEW GATE: mandatory after PR #390']],
  ['docs/roadmap.md', ['Status: canonical execution schedule — PR #389 review gate active', 'Eligible pool: 108', 'PR #390 Evidence and Archive Maintenance Batch 5']],
  ['docs/quality/post-pr388-review-gate-pr389-spec.md', ['authorize exactly one bounded PR #390', 'dated_exact_archive_added', 'another `REVIEW GATE`']],
  ['docs/roadmap-amendments/2026-07-16-pr389-post-pr388-review-gate.md', ['PR #390 Evidence and Archive Maintenance Batch 5', '9 / 9 / 1', 'another `REVIEW GATE`']]
]) {
  const value = readText(file);
  for (const marker of markers) expect(value.includes(marker), `${file}: missing authority marker ${marker}`);
}

for (const file of [
  'public/data/post-pr388-review-gate-pr389.json',
  'src/pages/post-pr388-review-gate-pr389.astro'
]) expect(!fs.existsSync(path.join(root, file)), `${file}: internal output leaked into public surface`);

if (failures.length) {
  console.error('PR #389 Post-PR #388 Review Gate validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  report_id: report.report_id,
  queue_id: q.queue_id,
  eligible_pool: q.eligible_pool_count,
  selected: q.selected_count,
  reviewed_suppressed: q.reviewed_unresolved_suppressed_count,
  reviewed_reactivated_selected: q.selected_reactivated_reviewed_identity_count,
  batch_5_decision: decision.decision,
  selected_evidence_ids: selectedIds,
  approved_next_sequence: report.approved_next_sequence.map((row) => `PR #${row.pr} ${row.work_item}`),
  review_gate_after_sequence: report.review_gate_after_sequence
}, null, 2));
