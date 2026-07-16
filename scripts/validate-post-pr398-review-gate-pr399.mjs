import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { buildPostPr398ReviewGate } from './build-post-pr398-review-gate-pr399.mjs';

const root = process.cwd();
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const serialize = (value) => `${JSON.stringify(value, null, 2)}\n`;
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const config = readJson('config/post-pr398-review-gate-pr399.json');
const queue = readJson('docs/migration/evidence-archive-maintenance-queue-v6-pr398.json');
const delta = readJson('docs/migration/evidence-archive-maintenance-queue-v6-pr398-delta.json');
const report = readJson('docs/migration/post-pr398-review-gate-pr399.json');
const checkpoint = readJson('docs/migration/current-canonical-checkpoint.json');
const expected = buildPostPr398ReviewGate();

expect(readText('docs/migration/post-pr398-review-gate-pr399.json') === serialize(expected), 'review report is not reproducible');
expect(report.report_id === 'sog_post_pr398_review_gate_pr399_2026_07_16', 'report ID changed');
expect(report.review_pr === 399 && report.status === 'reviewed_internal_authority_decision', 'report status changed');
expect(report.public_output === false, 'report became public');
expect(report.source_checkpoint.assets === 112, 'asset count changed');
expect(report.source_checkpoint.evidence === 559 && report.source_checkpoint.evidence_relations === 559, 'Evidence boundary changed');
expect(report.source_checkpoint.archive_recorded === 425 && report.source_checkpoint.archive_not_recorded === 134, 'archive boundary changed');
expect(report.source_checkpoint.deployments === 174 && report.source_checkpoint.market_access_records === 8, 'non-Evidence boundary changed');
expect(checkpoint.checkpoint_id === report.source_checkpoint.checkpoint_id, 'checkpoint binding changed');

expect(report.queue_review.queue_id === queue.queue_id && report.queue_review.delta_id === delta.delta_id, 'queue/delta provenance changed');
expect(report.queue_review.eligible_pool_count === 88 && report.queue_review.selected_count === 10, 'Queue v6 review counts changed');
expect(report.queue_review.reviewed_suppressed_excluded === 13 && report.queue_review.reviewed_reactivated_selected === 0, 'Queue v6 history boundary changed');
expect(report.queue_review.added_vs_queue_v5 === 10 && report.queue_review.removed_vs_queue_v5 === 10 && report.queue_review.retained_vs_queue_v5 === 0, 'Queue v6 delta changed');
expect(same(report.queue_review.selected_evidence_ids, config.expected.selected_evidence_ids), 'selected Evidence IDs changed');
expect(report.queue_review.all_candidates_unreviewed_archive_gaps === true, 'Queue v6 contains reviewed candidate');
expect(report.queue_review.all_candidates_manual_review_only === true, 'Queue v6 candidate authorizes canonical change');
expect(same(report.queue_review.selected_priority_buckets, ['official_issuer_protocol_product']), 'Queue v6 selected priority bucket changed');

const decision = report.decisions.evidence_archive_maintenance_batch_7;
expect(decision.pr === 400 && decision.decision === 'approved_bounded_manual_review', 'Batch 7 authority changed');
expect(decision.selected_identity_count === 10, 'Batch 7 selected count changed');
expect(same(decision.selected_evidence_ids, config.expected.selected_evidence_ids), 'Batch 7 selected IDs changed');
expect(same(decision.allowed_outcomes, config.approved_next_sequence[0].allowed_outcomes), 'Batch 7 allowed outcomes changed');
expect(decision.automatic_promotion_allowed === false && decision.review_gate_required_after_batch === true, 'Batch 7 safety boundary changed');
expect(report.decisions.evidence_archive_maintenance_batch_8.decision === 'not_approved', 'Batch 8 became authorized');
expect(report.review_gate_after_sequence === true, 'review gate after Batch 7 changed');
expect(same(report.approved_next_sequence, config.approved_next_sequence), 'approved sequence changed');
expect(same(report.not_approved_in_next_sequence, config.forbidden_without_later_review_gate), 'forbidden sequence changed');
expect(Object.values(report.boundaries).every((value) => value === false), 'review gate boundary changed');

let originMainAvailable = false;
try { git('rev-parse', '--verify', 'origin/main'); originMainAvailable = true; } catch {}
if (originMainAvailable) {
  for (const file of [
    'docs/migration/evidence-archive-maintenance-queue-v6-pr398.json',
    'docs/migration/evidence-archive-maintenance-queue-v6-pr398-delta.json',
    'config/evidence-archive-review-history-v5-pr397.json',
    'docs/migration/evidence-archive-review-history-manifest-v5-pr397.json',
    'docs/migration/evidence-archive-review-history-audit-v5-pr397.json',
    'docs/migration/current-canonical-checkpoint.json',
    'docs/migration/current-stats-history-checkpoint.json',
    'docs/migration/registry-release-integrity-baseline.json'
  ]) {
    try { expect(git('hash-object', file) === git('rev-parse', `origin/main:${file}`), `${file}: immutable source changed`); }
    catch (error) { failures.push(`${file}: unable to verify immutable source: ${error.message}`); }
  }
}

for (const [file, markers] of [
  ['AGENTS.md', ['PR #399 Post-PR #398 Review Gate: active; complete on merge', 'PR #400 Evidence and Archive Maintenance Batch 7: approved next', 'REVIEW GATE: mandatory after PR #400']],
  ['docs/roadmap.md', ['Status: canonical execution schedule — PR #399 review gate active', 'PR #400 Evidence and Archive Maintenance Batch 7', 'After PR #400, stop at `REVIEW GATE`']],
  ['docs/quality/post-pr398-review-gate-pr399-spec.md', ['Queue v6 eligible pool / selected: 88 / 10', 'PR #400 Evidence and Archive Maintenance Batch 7', 'Another `REVIEW GATE` is mandatory after PR #400']],
  ['docs/roadmap-amendments/2026-07-16-pr399-post-pr398-review-gate.md', ['PR #400 Evidence and Archive Maintenance Batch 7', 'exactly the ten Queue v6 identities', 'After PR #400, stop at `REVIEW GATE`']]
]) {
  const value = readText(file);
  for (const marker of markers) expect(value.includes(marker), `${file}: missing authority marker ${marker}`);
}

for (const file of ['public/data/post-pr398-review-gate-pr399.json', 'src/pages/post-pr398-review-gate-pr399.astro']) {
  expect(!fs.existsSync(path.join(root, file)), `${file}: internal report leaked into public surface`);
}

if (failures.length) {
  console.error('PR #399 Post-PR #398 Review Gate validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  report_id: report.report_id,
  archive_recorded: report.source_checkpoint.archive_recorded,
  archive_not_recorded: report.source_checkpoint.archive_not_recorded,
  eligible_pool: report.queue_review.eligible_pool_count,
  selected: report.queue_review.selected_count,
  selected_evidence_ids: report.queue_review.selected_evidence_ids,
  batch_7_decision: decision.decision,
  approved_next_sequence: report.approved_next_sequence.map((row) => `PR #${row.pr} ${row.work_item}`),
  review_gate_after_sequence: report.review_gate_after_sequence
}, null, 2));
