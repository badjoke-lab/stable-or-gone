import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { buildPostPr400ReviewGate } from './build-post-pr400-review-gate-pr401.mjs';

const root = process.cwd();
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const serialize = (value) => `${JSON.stringify(value, null, 2)}\n`;
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const failures = [];
const expect = (ok, message) => { if (!ok) failures.push(message); };

const config = readJson('config/post-pr400-review-gate-pr401.json');
const report = readJson('docs/migration/post-pr400-review-gate-pr401.json');
const outcomes = readJson('docs/migration/evidence-archive-maintenance-outcomes-pr400.json');
const handoff = readJson('docs/migration/evidence-archive-maintenance-batch-7-pr400-reviewed-handoff.json');
const expected = buildPostPr400ReviewGate();
const projection = report.expected_history_v6;

expect(readText('docs/migration/post-pr400-review-gate-pr401.json') === serialize(expected), 'review report is not reproducible');
expect(report.report_id === 'sog_post_pr400_review_gate_pr401_2026_07_16', 'report ID changed');
expect(report.review_pr === 401 && report.public_output === false, 'report boundary changed');
expect(report.source_checkpoint.evidence === 559 && report.source_checkpoint.evidence_relations === 559, 'Evidence boundary changed');
expect(report.source_checkpoint.archive_recorded === 430 && report.source_checkpoint.archive_not_recorded === 129, 'archive boundary changed');
expect(report.completed_pr400.selected === 10 && report.completed_pr400.changed === 5, 'PR #400 review counts changed');
expect(report.completed_pr400.dated_archives_added === 5 && report.completed_pr400.reviewed_source_replacements === 0 && report.completed_pr400.reviewed_no_safe_change === 5, 'PR #400 outcome mix changed');
expect(outcomes.outcome_id === report.completed_pr400.outcome_id && handoff.handoff_id === report.completed_pr400.handoff_id, 'PR #400 provenance changed');
expect(projection.sources === 7 && projection.events === 70 && projection.identities === 68, 'History v6 source/event/identity projection changed');
expect(projection.effective_archive_present === 50 && projection.effective_invalid_removed === 1 && projection.effective_no_safe_change === 17 && projection.effective_source_replacement === 0, 'History v6 effective outcome projection changed');
expect(projection.reviewed_unresolved_total === 18 && projection.reviewed_suppressed === 18 && projection.reviewed_reactivated_eligible === 0, 'History v6 suppression projection changed');
expect(report.decisions.evidence_archive_review_history_contract_v6.pr === 402 && report.decisions.evidence_archive_review_history_contract_v6.decision === 'approved_internal', 'PR #402 authority changed');
expect(report.decisions.evidence_archive_maintenance_queue_v7.pr === 403 && report.decisions.evidence_archive_maintenance_queue_v7.decision === 'approved_internal_after_pr402', 'PR #403 authority changed');
expect(report.decisions.evidence_archive_maintenance_queue_v7.maximum_selected_count === 10, 'Queue v7 maximum changed');
expect(report.decisions.evidence_archive_maintenance_batch_8.decision === 'not_approved', 'Batch 8 became authorized');
expect(same(report.approved_next_sequence, config.approved_next_sequence), 'approved sequence changed');
expect(report.review_gate_after_sequence === true, 'review gate changed');
expect(Object.values(report.boundaries).every((value) => value === false), 'review boundary changed');

try {
  git('rev-parse', '--verify', 'origin/main');
  for (const file of [
    'docs/migration/evidence-archive-maintenance-outcomes-pr400.json',
    'docs/migration/evidence-archive-maintenance-batch-7-pr400-reviewed-handoff.json',
    'config/evidence-archive-review-history-v5-pr397.json',
    'docs/migration/evidence-archive-review-history-manifest-v5-pr397.json',
    'docs/migration/evidence-archive-review-history-audit-v5-pr397.json',
    'docs/migration/current-canonical-checkpoint.json',
    'docs/migration/current-stats-history-checkpoint.json',
    'docs/migration/registry-release-integrity-baseline.json'
  ]) expect(git('hash-object', file) === git('rev-parse', `origin/main:${file}`), `${file}: immutable source changed`);
} catch {}

for (const [file, markers] of [
  ['AGENTS.md', ['PR #401 Post-PR #400 Review Gate: active; complete on merge', 'PR #402 Evidence Archive Review-History Contract v6 Update: approved next', 'REVIEW GATE: mandatory after PR #403']],
  ['docs/roadmap.md', ['Status: canonical execution schedule — PR #401 review gate active', 'History sources / events / identities: 7 / 70 / 68', 'After PR #403, stop at `REVIEW GATE`']],
  ['docs/quality/post-pr400-review-gate-pr401-spec.md', ['History v6 sources / events / identities: 7 / 70 / 68', 'PR #402 Evidence Archive Review-History Contract v6 Update', 'PR #403 Evidence Archive Maintenance Queue v7 Refresh']],
  ['docs/roadmap-amendments/2026-07-16-pr401-post-pr400-review-gate.md', ['50 / 1 / 17 / 0', 'PR #402 Evidence Archive Review-History Contract v6 Update', 'After PR #403, stop at `REVIEW GATE`']]
]) for (const marker of markers) expect(readText(file).includes(marker), `${file}: missing ${marker}`);

expect(!fs.existsSync(path.join(root, 'public/data/post-pr400-review-gate-pr401.json')), 'report leaked public');
expect(!fs.existsSync(path.join(root, 'src/pages/post-pr400-review-gate-pr401.astro')), 'review page leaked public');

if (failures.length) {
  console.error('PR #401 Post-PR #400 Review Gate validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log(JSON.stringify({
  ok: true,
  report_id: report.report_id,
  archive_recorded: report.source_checkpoint.archive_recorded,
  archive_not_recorded: report.source_checkpoint.archive_not_recorded,
  history_v6: projection,
  approved_next_sequence: report.approved_next_sequence.map((row) => `PR #${row.pr} ${row.work_item}`),
  review_gate_after_sequence: report.review_gate_after_sequence
}, null, 2));
