import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { buildPostPr383ReviewGate } from './build-post-pr383-review-gate-pr384.mjs';

const root = process.cwd();
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const git = (...args) => execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const config = readJson('config/post-pr383-review-gate-pr384.json');
const report = readJson('docs/migration/post-pr383-review-gate-pr384.json');
const queue = readJson('docs/migration/evidence-archive-maintenance-queue-v3-pr383.json');
const delta = readJson('docs/migration/evidence-archive-maintenance-queue-v3-pr383-delta.json');
const contract = readJson('config/evidence-archive-review-history-v2-pr382.json');
const manifest = readJson('docs/migration/evidence-archive-review-history-manifest-v2-pr382.json');
const audit = readJson('docs/migration/evidence-archive-review-history-audit-v2-pr382.json');
const checkpoint = readJson('docs/migration/current-canonical-checkpoint.json');
const generated = buildPostPr383ReviewGate();

expect(same(report, generated), 'committed PR #384 review report is not deterministic');
expect(config.review_pr === 384 && report.review_pr === 384, 'review PR identity changed');
expect(report.report_id === 'sog_post_pr383_review_gate_pr384_2026_07_16', 'review report ID changed');
expect(report.status === 'reviewed_internal_authority_decision', 'review report status changed');
expect(report.public_output === false, 'review report must remain internal');

const expected = config.expected;
expect(report.source_checkpoint.assets === expected.assets, 'asset count mismatch');
expect(report.source_checkpoint.evidence === expected.evidence, 'Evidence count mismatch');
expect(report.source_checkpoint.evidence_relations === expected.evidence, 'Evidence Relation count mismatch');
expect(report.source_checkpoint.archive_recorded === expected.archive_recorded, 'archive-recorded count mismatch');
expect(report.source_checkpoint.archive_not_recorded === expected.archive_not_recorded, 'archive-not-recorded count mismatch');
expect(checkpoint.expected_counts.assets === expected.assets, 'checkpoint asset count changed');
expect(checkpoint.expected_counts.evidence === expected.evidence, 'checkpoint Evidence count changed');
expect(checkpoint.evidence_quality.archive_index_count === expected.archive_recorded, 'checkpoint archive count changed');
expect(checkpoint.evidence_quality.archive_not_recorded_count === expected.archive_not_recorded, 'checkpoint no-archive count changed');

const q = report.evaluation.queue_integrity;
const selectedIds = queue.selected_candidates.map((row) => row.evidence_id);
expect(q.queue_id === queue.queue_id, 'queue identity mismatch');
expect(q.eligible_pool_count === expected.eligible_pool, 'eligible pool count mismatch');
expect(q.selected_count === expected.selected_queue_candidates, 'selected queue count mismatch');
expect(q.maximum_selected_count === expected.maximum_selected_candidates, 'maximum selected count mismatch');
expect(q.reviewed_unresolved_suppressed_count === expected.reviewed_unresolved_suppressed, 'suppressed count mismatch');
expect(q.reactivated_reviewed_identity_count === expected.reactivated_reviewed_identities, 'reactivated count mismatch');
expect(q.selected_reactivated_reviewed_identity_count === expected.selected_reactivated_candidates, 'selected reactivated count mismatch');
expect(same(q.selected_evidence_ids, selectedIds), 'review report selected IDs differ from Queue v3');
expect(q.added_vs_queue_v2 === expected.queue_v2_added, 'Queue v2 added delta mismatch');
expect(q.removed_vs_queue_v2 === expected.queue_v2_removed, 'Queue v2 removed delta mismatch');
expect(q.retained_vs_queue_v2 === expected.queue_v2_retained, 'Queue v2 retained delta mismatch');
expect(q.deterministic_order === true && q.all_candidates_manual_review_only === true, 'queue integrity finding changed');
expect(new Set(selectedIds).size === selectedIds.length, 'Queue v3 selected IDs are not unique');
expect(selectedIds.includes('sog_src_eurc_mint_page'), 'Circle Mint reviewed-reactivated identity is not selected');

const h = report.evaluation.history_enforcement;
expect(h.contract_id === contract.contract_id, 'history contract provenance mismatch');
expect(h.manifest_id === manifest.manifest_id, 'history manifest provenance mismatch');
expect(h.audit_id === audit.audit_id, 'history audit provenance mismatch');
expect(h.history_source_count === expected.history_sources, 'history source count mismatch');
expect(h.history_event_count === expected.history_events, 'history event count mismatch');
expect(h.reviewed_identity_count === expected.reviewed_identities, 'reviewed identity count mismatch');
expect(h.reviewed_unresolved_suppressed === expected.reviewed_unresolved_suppressed, 'history suppression count mismatch');
expect(h.reviewed_reactivated_eligible === expected.reactivated_reviewed_identities, 'history reactivation count mismatch');
expect(h.exact_suppressed_ids_preserved === true, 'suppressed history IDs were not preserved');
expect(h.exact_reactivated_ids_preserved === true, 'reactivated history IDs were not preserved');
expect(h.reviewed_reactivated_selected === true, 'reviewed-reactivated identity was not selected');
expect(h.automatic_time_expiry === false, 'automatic history expiry changed');

const decision = report.decisions.evidence_archive_maintenance_batch_4;
expect(decision.decision === 'approved_bounded', 'Batch 4 decision changed');
expect(decision.pr === 385, 'Batch 4 PR number changed');
expect(same(decision.selected_evidence_ids, selectedIds), 'Batch 4 authority IDs differ from Queue v3');
expect(decision.maximum_identity_count === 10, 'Batch 4 maximum identity count changed');
expect(decision.canonical_evidence_change_allowed_under_reviewed_outcomes === true, 'reviewed canonical outcome boundary changed');
expect(decision.new_public_surface_allowed === false, 'public surface boundary changed');
expect(decision.automatic_promotion_allowed === false, 'automatic promotion boundary changed');
expect(report.approved_next_sequence.length === 1, 'approved sequence length changed');
expect(report.approved_next_sequence[0].pr === 385 && report.approved_next_sequence[0].work_item === 'Evidence and Archive Maintenance Batch 4', 'approved sequence changed');
expect(report.review_gate_after_sequence === true, 'review gate after Batch 4 changed');
expect(report.activation_rule.includes('PR #385'), 'PR #385 activation rule missing');

for (const key of ['current_pr_canonical_data_change_allowed', 'current_pr_public_surface_change_allowed', 'historical_output_rewrite_allowed', 'ranking_allowed', 'automatic_promotion_allowed']) {
  expect(config.boundaries?.[key] === false, `config boundary changed: ${key}`);
}
for (const key of ['canonical_data_changed', 'public_surface_changed', 'historical_outputs_rewritten', 'ranking_or_score', 'automatic_promotion']) {
  expect(report.boundaries?.[key] === false, `report boundary changed: ${key}`);
}

let originMainAvailable = false;
try {
  git('rev-parse', '--verify', 'origin/main');
  originMainAvailable = true;
} catch {}
if (originMainAvailable) {
  for (const file of [
    'docs/migration/evidence-archive-maintenance-queue-v3-pr383.json',
    'docs/migration/evidence-archive-maintenance-queue-v3-pr383-delta.json',
    'config/evidence-archive-review-history-v2-pr382.json',
    'docs/migration/evidence-archive-review-history-manifest-v2-pr382.json',
    'docs/migration/evidence-archive-review-history-audit-v2-pr382.json',
    'docs/migration/current-canonical-checkpoint.json',
    'docs/migration/evidence-correction-outcomes-pr360.json',
    'docs/migration/evidence-archive-maintenance-outcomes-pr365.json',
    'docs/migration/evidence-archive-maintenance-outcomes-pr380.json'
  ]) {
    try {
      expect(git('hash-object', file) === git('rev-parse', `origin/main:${file}`), `${file}: immutable Git blob identity changed`);
    } catch (error) {
      failures.push(`${file}: unable to verify origin/main blob identity: ${error.message}`);
    }
  }
}

for (const [file, markers] of [
  ['AGENTS.md', ['PR #384 Post-PR #383 Review Gate: active; complete on merge', 'PR #385 Evidence and Archive Maintenance Batch 4: approved next', 'REVIEW GATE: mandatory after PR #385']],
  ['docs/roadmap.md', ['Status: canonical execution schedule — PR #384 review gate active', 'Eligible pool: 117', 'PR #385 Evidence and Archive Maintenance Batch 4']],
  ['docs/quality/post-pr383-review-gate-pr384-spec.md', ['authorize exactly one bounded PR #385', 'dated_exact_archive_added', 'another `REVIEW GATE`']],
  ['docs/roadmap-amendments/2026-07-16-pr384-post-pr383-review-gate.md', ['PR #385 Evidence and Archive Maintenance Batch 4', '9 / 9 / 1', 'another `REVIEW GATE`']]
]) {
  const value = readText(file);
  for (const marker of markers) expect(value.includes(marker), `${file}: missing authority marker ${marker}`);
}

for (const file of [
  'public/data/post-pr383-review-gate-pr384.json',
  'src/pages/post-pr383-review-gate-pr384.astro'
]) expect(!fs.existsSync(path.join(root, file)), `${file}: internal output leaked into public surface`);

if (failures.length) {
  console.error('PR #384 Post-PR #383 Review Gate validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
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
  batch_4_decision: decision.decision,
  selected_evidence_ids: selectedIds,
  approved_next_sequence: report.approved_next_sequence.map((row) => `PR #${row.pr} ${row.work_item}`),
  review_gate_after_sequence: report.review_gate_after_sequence
}, null, 2));
