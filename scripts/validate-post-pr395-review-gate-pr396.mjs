import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { buildPostPr395ReviewGate } from './build-post-pr395-review-gate-pr396.mjs';

const root = process.cwd();
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const serialize = (value) => `${JSON.stringify(value, null, 2)}\n`;
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const config = readJson('config/post-pr395-review-gate-pr396.json');
const report = readJson('docs/migration/post-pr395-review-gate-pr396.json');
const outcomes = readJson('docs/migration/evidence-archive-maintenance-outcomes-pr395.json');
const handoff = readJson('docs/migration/evidence-archive-maintenance-batch-6-pr395-reviewed-handoff.json');
const checkpoint = readJson('docs/migration/current-canonical-checkpoint.json');
const expected = buildPostPr395ReviewGate();

expect(readText('docs/migration/post-pr395-review-gate-pr396.json') === serialize(expected), 'review report is not reproducible');
expect(report.report_id === 'sog_post_pr395_review_gate_pr396_2026_07_16', 'report ID changed');
expect(report.review_pr === 396 && report.status === 'reviewed_internal_authority_decision', 'report status changed');
expect(report.public_output === false, 'report became public');
expect(outcomes.selected_count === 10 && outcomes.changed_count === 9, 'PR #395 review boundary changed');
expect(outcomes.dated_archive_added_count === 9 && outcomes.reviewed_no_safe_change_count === 1, 'PR #395 outcome mix changed');
expect(outcomes.reviewed_source_replacement_count === 0, 'PR #395 replacement count changed');
expect(handoff.next_work_item?.decision === 'review_gate_required', 'PR #395 no longer requires review gate');
expect(report.completed_pr395.canonical_identity_counts_preserved === true, 'canonical identity boundary changed');
expect(report.source_checkpoint.assets === 112, 'asset count changed');
expect(report.source_checkpoint.evidence === 559 && report.source_checkpoint.evidence_relations === 559, 'Evidence boundary changed');
expect(report.source_checkpoint.archive_recorded === 425 && report.source_checkpoint.archive_not_recorded === 134, 'archive boundary changed');
expect(report.source_checkpoint.deployments === 174 && report.source_checkpoint.market_access_records === 8, 'non-Evidence boundary changed');
expect(checkpoint.checkpoint_id === report.source_checkpoint.checkpoint_id, 'checkpoint binding changed');

const projection = report.expected_history_v5;
expect(projection.sources === 6 && projection.events === 60 && projection.identities === 58, 'History v5 inventory projection changed');
expect(projection.effective_archive_present === 45, 'History v5 archive-present projection changed');
expect(projection.effective_invalid_removed === 1, 'History v5 invalid-removal projection changed');
expect(projection.effective_no_safe_change === 12, 'History v5 no-safe projection changed');
expect(projection.effective_source_replacement === 0, 'History v5 replacement projection changed');
expect(projection.reviewed_unresolved_total === 13 && projection.reviewed_suppressed === 13, 'History v5 unresolved/suppressed projection changed');
expect(projection.reviewed_reactivated_eligible === 0 && projection.reactivated_evidence_ids.length === 0, 'History v5 reactivation projection changed');
expect(projection.suppressed_evidence_ids.includes('sog_src_makerdao_docs_dai'), 'Sky docs no-safe suppression missing');
expect(report.current_history_v4.stale_after_pr395 === true, 'History v4 staleness changed');

expect(report.decisions.evidence_archive_review_history_contract_v5.pr === 397, 'History v5 PR authority changed');
expect(report.decisions.evidence_archive_review_history_contract_v5.decision === 'approved_internal', 'History v5 decision changed');
expect(report.decisions.evidence_archive_maintenance_queue_v6.pr === 398, 'Queue v6 PR authority changed');
expect(report.decisions.evidence_archive_maintenance_queue_v6.decision === 'approved_internal_after_pr397', 'Queue v6 decision changed');
expect(report.decisions.evidence_archive_maintenance_queue_v6.maximum_selected_count === 10, 'Queue v6 maximum changed');
expect(report.decisions.evidence_archive_maintenance_batch_7.decision === 'not_approved', 'Batch 7 became authorized');
expect(report.review_gate_after_sequence === true, 'review gate after Queue v6 changed');
expect(same(report.approved_next_sequence, config.approved_next_sequence), 'approved sequence changed');
expect(same(report.not_approved_in_next_sequence, config.forbidden_without_later_review_gate), 'forbidden sequence changed');
expect(Object.values(report.boundaries).every((value) => value === false), 'review gate boundary changed');

let originMainAvailable = false;
try { git('rev-parse', '--verify', 'origin/main'); originMainAvailable = true; } catch {}
if (originMainAvailable) {
  for (const file of [
    'docs/migration/evidence-archive-maintenance-outcomes-pr395.json',
    'docs/migration/evidence-archive-maintenance-batch-6-pr395-reviewed-handoff.json',
    'config/evidence-archive-review-history-v4-pr392.json',
    'docs/migration/evidence-archive-review-history-manifest-v4-pr392.json',
    'docs/migration/evidence-archive-review-history-audit-v4-pr392.json',
    'docs/migration/current-canonical-checkpoint.json',
    'docs/migration/current-stats-history-checkpoint.json',
    'docs/migration/registry-release-integrity-baseline.json'
  ]) {
    expect(git('hash-object', file) === git('rev-parse', `origin/main:${file}`), `${file}: immutable source changed`);
  }
}

for (const [file, markers] of [
  ['AGENTS.md', ['PR #396 Post-PR #395 Review Gate: active; complete on merge', 'PR #397 Evidence Archive Review-History Contract v5 Update: approved next', 'REVIEW GATE: mandatory after PR #398']],
  ['docs/roadmap.md', ['Status: canonical execution schedule — PR #396 review gate active', 'History sources / events / identities: 6 / 60 / 58', 'After PR #398, stop at `REVIEW GATE`']],
  ['docs/quality/post-pr395-review-gate-pr396-spec.md', ['History v5 sources / events / identities: 6 / 60 / 58', 'PR #397 Evidence Archive Review-History Contract v5 Update', 'authority stops after PR #398 at `REVIEW GATE`']],
  ['docs/roadmap-amendments/2026-07-16-pr396-post-pr395-review-gate.md', ['history sources: 6', 'reviewed no-safe-change: 12', 'After PR #398, stop at `REVIEW GATE`']]
]) {
  const value = readText(file);
  for (const marker of markers) expect(value.includes(marker), `${file}: missing authority marker ${marker}`);
}

for (const file of ['public/data/post-pr395-review-gate-pr396.json', 'src/pages/post-pr395-review-gate-pr396.astro']) {
  expect(!fs.existsSync(path.join(root, file)), `${file}: internal report leaked into public surface`);
}

if (failures.length) {
  console.error('PR #396 Post-PR #395 Review Gate validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  report_id: report.report_id,
  archive_recorded: report.source_checkpoint.archive_recorded,
  archive_not_recorded: report.source_checkpoint.archive_not_recorded,
  pr395_yield: `${report.completed_pr395.changed}/${report.completed_pr395.selected}`,
  history_v5: {
    sources: projection.sources,
    events: projection.events,
    identities: projection.identities,
    archive_present: projection.effective_archive_present,
    invalid_removed: projection.effective_invalid_removed,
    no_safe_change: projection.effective_no_safe_change,
    source_replacement: projection.effective_source_replacement,
    unresolved: projection.reviewed_unresolved_total,
    suppressed: projection.reviewed_suppressed,
    reactivated: projection.reviewed_reactivated_eligible
  },
  approved_next_sequence: report.approved_next_sequence.map((row) => `PR #${row.pr} ${row.work_item}`),
  review_gate_after_sequence: report.review_gate_after_sequence
}, null, 2));
