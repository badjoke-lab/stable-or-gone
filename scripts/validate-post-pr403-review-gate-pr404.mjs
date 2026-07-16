import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { buildPostPr403ReviewGate } from './build-post-pr403-review-gate-pr404.mjs';

const root = process.cwd();
const text = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const json = (file) => JSON.parse(text(file));
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const serialize = (value) => `${JSON.stringify(value, null, 2)}\n`;
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const failures = [];
const expect = (ok, message) => { if (!ok) failures.push(message); };

const config = json('config/post-pr403-review-gate-pr404.json');
const queue = json('docs/migration/evidence-archive-maintenance-queue-v7-pr403.json');
const delta = json('docs/migration/evidence-archive-maintenance-queue-v7-pr403-delta.json');
const report = json('docs/migration/post-pr403-review-gate-pr404.json');
const expected = buildPostPr403ReviewGate();

expect(text('docs/migration/post-pr403-review-gate-pr404.json') === serialize(expected), 'review report is not reproducible');
expect(report.report_id === 'sog_post_pr403_review_gate_pr404_2026_07_16', 'report ID changed');
expect(report.review_pr === 404 && report.public_output === false, 'report boundary changed');
expect(report.source_checkpoint.evidence === 559 && report.source_checkpoint.evidence_relations === 559, 'Evidence boundary changed');
expect(report.source_checkpoint.archive_recorded === 430 && report.source_checkpoint.archive_not_recorded === 129, 'archive boundary changed');
expect(report.queue_review.queue_id === queue.queue_id && report.queue_review.delta_id === delta.delta_id, 'queue provenance changed');
expect(report.queue_review.eligible_pool_count === 78 && report.queue_review.selected_count === 10, 'Queue v7 counts changed');
expect(report.queue_review.reviewed_suppressed_excluded === 18 && report.queue_review.reviewed_reactivated_selected === 0, 'history boundary changed');
expect(report.queue_review.added_vs_queue_v6 === 10 && report.queue_review.removed_vs_queue_v6 === 10 && report.queue_review.retained_vs_queue_v6 === 0, 'Queue v7 delta changed');
expect(same(report.queue_review.selected_evidence_ids, config.expected.selected_evidence_ids), 'selected Evidence IDs changed');
expect(same(report.queue_review.selected_priority_buckets, ['official_issuer_protocol_product']), 'selected priority bucket changed');
expect(report.queue_review.all_candidates_unreviewed_archive_gaps === true, 'reviewed candidate entered queue');
expect(report.queue_review.all_candidates_manual_review_only === true, 'candidate authorized canonical change');

const decision = report.decisions.evidence_archive_maintenance_batch_8;
expect(decision.pr === 405 && decision.decision === 'approved_bounded_manual_review', 'Batch 8 authority changed');
expect(decision.selected_identity_count === 10, 'Batch 8 selected count changed');
expect(same(decision.selected_evidence_ids, config.expected.selected_evidence_ids), 'Batch 8 selected IDs changed');
expect(same(decision.allowed_outcomes, config.approved_next_sequence[0].allowed_outcomes), 'Batch 8 allowed outcomes changed');
expect(decision.automatic_promotion_allowed === false && decision.review_gate_required_after_batch === true, 'Batch 8 safety boundary changed');
expect(report.decisions.evidence_archive_maintenance_batch_9.decision === 'not_approved', 'Batch 9 became authorized');
expect(report.review_gate_after_sequence === true, 'review gate after Batch 8 changed');
expect(same(report.approved_next_sequence, config.approved_next_sequence), 'approved sequence changed');
expect(Object.values(report.boundaries).every((value) => value === false), 'review gate boundary changed');

try {
  git('rev-parse', '--verify', 'origin/main');
  for (const file of [
    'docs/migration/evidence-archive-maintenance-queue-v7-pr403.json',
    'docs/migration/evidence-archive-maintenance-queue-v7-pr403-delta.json',
    'config/evidence-archive-review-history-v6-pr402.json',
    'docs/migration/evidence-archive-review-history-manifest-v6-pr402.json',
    'docs/migration/evidence-archive-review-history-audit-v6-pr402.json',
    'docs/migration/current-canonical-checkpoint.json',
    'docs/migration/current-stats-history-checkpoint.json',
    'docs/migration/registry-release-integrity-baseline.json'
  ]) expect(git('hash-object', file) === git('rev-parse', `origin/main:${file}`), `${file}: immutable source changed`);
} catch {}

for (const [file, markers] of [
  ['AGENTS.md', ['PR #404 Post-PR #403 Review Gate: active; complete on merge', 'PR #405 Evidence and Archive Maintenance Batch 8: approved next', 'REVIEW GATE: mandatory after PR #405']],
  ['docs/roadmap.md', ['Status: canonical execution schedule — PR #404 review gate active', 'PR #405 Evidence and Archive Maintenance Batch 8', 'After PR #405, stop at `REVIEW GATE`']],
  ['docs/quality/post-pr403-review-gate-pr404-spec.md', ['Queue v7 eligible pool / selected: 78 / 10', 'PR #405 Evidence and Archive Maintenance Batch 8', 'Another `REVIEW GATE` is mandatory after PR #405']],
  ['docs/roadmap-amendments/2026-07-16-pr404-post-pr403-review-gate.md', ['PR #405 Evidence and Archive Maintenance Batch 8', 'exactly the ten Queue v7 identities', 'After PR #405, stop at `REVIEW GATE`']]
]) for (const marker of markers) expect(text(file).includes(marker), `${file}: missing ${marker}`);

expect(!fs.existsSync(path.join(root, 'public/data/post-pr403-review-gate-pr404.json')), 'report leaked public');
expect(!fs.existsSync(path.join(root, 'src/pages/post-pr403-review-gate-pr404.astro')), 'review page leaked public');

if (failures.length) {
  console.error('PR #404 Post-PR #403 Review Gate validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log(JSON.stringify({
  ok: true,
  report_id: report.report_id,
  eligible_pool: report.queue_review.eligible_pool_count,
  selected: report.queue_review.selected_count,
  batch_8_decision: decision.decision,
  approved_next_sequence: report.approved_next_sequence.map((row) => `PR #${row.pr} ${row.work_item}`),
  review_gate_after_sequence: report.review_gate_after_sequence
}, null, 2));
