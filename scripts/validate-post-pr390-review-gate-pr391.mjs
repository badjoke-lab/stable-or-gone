import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { buildPostPr390ReviewGate } from './build-post-pr390-review-gate-pr391.mjs';

const root = process.cwd();
const baseRef = process.env.SOG_PR391_BASE_REF ?? 'origin/main';
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const serialize = (value) => `${JSON.stringify(value, null, 2)}\n`;
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };
const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);

const config = readJson('config/post-pr390-review-gate-pr391.json');
const report = readJson('docs/migration/post-pr390-review-gate-pr391.json');
const outcomes = readJson('docs/migration/evidence-archive-maintenance-outcomes-pr390.json');
const handoff = readJson('docs/migration/evidence-archive-maintenance-batch-5-pr390-reviewed-handoff.json');
const checkpoint = readJson('docs/migration/current-canonical-checkpoint.json');
const statsCheckpoint = readJson('docs/migration/current-stats-history-checkpoint.json');
const releaseBaseline = readJson('docs/migration/registry-release-integrity-baseline.json');
const expected = buildPostPr390ReviewGate();

expect(readText('docs/migration/post-pr390-review-gate-pr391.json') === serialize(expected), 'review report is not reproducible');
expect(report.report_id === 'sog_post_pr390_review_gate_pr391_2026_07_16', 'report identity changed');
expect(report.review_pr === 391 && report.status === 'reviewed_internal_authority_decision', 'review report status changed');
expect(report.public_output === false, 'review report became public');

expect(outcomes.selected_count === 10 && outcomes.changed_count === 10, 'PR #390 reviewed boundary changed');
expect(outcomes.dated_archive_added_count === 10, 'PR #390 archive outcome count changed');
expect(outcomes.reviewed_source_replacement_count === 0 && outcomes.reviewed_no_safe_change_count === 0, 'PR #390 non-archive outcome count changed');
expect(handoff.next_work_item?.decision === 'review_gate_required', 'PR #390 handoff no longer requires review gate');
expect(report.completed_pr390.canonical_identity_counts_preserved === true, 'PR #390 identity boundary not preserved');

expect(checkpoint.checkpoint_id === report.source_checkpoint.checkpoint_id, 'canonical checkpoint binding changed');
expect(statsCheckpoint.checkpoint_id === report.source_checkpoint.stats_checkpoint_id, 'stats checkpoint binding changed');
expect(releaseBaseline.baseline_id === report.source_checkpoint.release_baseline_id, 'release baseline binding changed');
expect(report.source_checkpoint.assets === 112, 'asset count changed');
expect(report.source_checkpoint.evidence === 559 && report.source_checkpoint.evidence_relations === 559, 'Evidence identity/relation count changed');
expect(report.source_checkpoint.archive_recorded === 416 && report.source_checkpoint.archive_not_recorded === 143, 'archive boundary changed');
expect(report.source_checkpoint.deployments === 174 && report.source_checkpoint.market_access_records === 8, 'non-Evidence boundary changed');

const projection = report.expected_history_v4;
expect(projection.sources === 5 && projection.events === 50 && projection.identities === 48, 'History v4 inventory projection changed');
expect(projection.effective_archive_present === 36, 'History v4 archive-present projection changed');
expect(projection.effective_invalid_removed === 1, 'History v4 invalid-removed projection changed');
expect(projection.effective_no_safe_change === 11, 'History v4 no-safe-change projection changed');
expect(projection.effective_source_replacement === 0, 'History v4 source-replacement projection changed');
expect(projection.reviewed_unresolved_total === 12 && projection.reviewed_suppressed === 12, 'History v4 unresolved/suppressed projection changed');
expect(projection.reviewed_reactivated_eligible === 0 && projection.reactivated_evidence_ids.length === 0, 'History v4 reactivation projection changed');
expect(projection.suppressed_evidence_ids.length === 12, 'History v4 suppressed identity count changed');
expect(report.current_history_v3.stale_after_pr390 === true, 'History v3 staleness finding changed');

expect(report.decisions.evidence_archive_review_history_contract_v4.pr === 392, 'History v4 PR authority changed');
expect(report.decisions.evidence_archive_review_history_contract_v4.decision === 'approved_internal', 'History v4 decision changed');
expect(report.decisions.evidence_archive_maintenance_queue_v5.pr === 393, 'Queue v5 PR authority changed');
expect(report.decisions.evidence_archive_maintenance_queue_v5.decision === 'approved_internal_after_pr392', 'Queue v5 decision changed');
expect(report.decisions.evidence_archive_maintenance_queue_v5.maximum_selected_count === 10, 'Queue v5 maximum changed');
expect(report.decisions.evidence_archive_maintenance_batch_6.decision === 'not_approved', 'Batch 6 became authorized');
expect(report.review_gate_after_sequence === true, 'review gate after Queue v5 changed');
expect(same(report.approved_next_sequence, config.approved_next_sequence), 'approved sequence differs from config');
expect(same(report.not_approved_in_next_sequence, config.forbidden_without_later_review_gate), 'forbidden sequence differs from config');
expect(Object.values(report.boundaries).every((value) => value === false), 'review gate boundary changed');

let originMainAvailable = false;
try { git('rev-parse', '--verify', baseRef); originMainAvailable = true; } catch {}
if (originMainAvailable) {
  for (const file of [
    'docs/migration/evidence-archive-maintenance-outcomes-pr390.json',
    'docs/migration/evidence-archive-maintenance-batch-5-pr390-reviewed-handoff.json',
    'config/evidence-archive-review-history-v3-pr387.json',
    'docs/migration/evidence-archive-review-history-manifest-v3-pr387.json',
    'docs/migration/evidence-archive-review-history-audit-v3-pr387.json',
    'docs/migration/current-canonical-checkpoint.json',
    'docs/migration/current-stats-history-checkpoint.json',
    'docs/migration/registry-release-integrity-baseline.json'
  ]) {
    expect(git('hash-object', file) === git('rev-parse', `${baseRef}:${file}`), `${file}: immutable source changed`);
  }
}

for (const [file, markers] of [
  ['AGENTS.md', ['PR #391 Post-PR #390 Review Gate: active; complete on merge', 'PR #392 Evidence Archive Review-History Contract v4 Update: approved next', 'REVIEW GATE: mandatory after PR #393']],
  ['docs/roadmap.md', ['Status: canonical execution schedule — PR #391 review gate active', 'History sources / events / identities: 5 / 50 / 48', 'After PR #393, stop at `REVIEW GATE`']],
  ['docs/quality/post-pr390-review-gate-pr391-spec.md', ['History v4 sources / events / identities: 5 / 50 / 48', 'PR #392 Evidence Archive Review-History Contract v4 Update', 'authority stops after PR #393 at `REVIEW GATE`']],
  ['docs/roadmap-amendments/2026-07-16-pr391-post-pr390-review-gate.md', ['history sources: 5', 'reviewed reactivated eligible: 0', 'After PR #393, stop at `REVIEW GATE`']]
]) {
  const value = readText(file);
  for (const marker of markers) expect(value.includes(marker), `${file}: missing authority marker ${marker}`);
}

for (const file of [
  'public/data/post-pr390-review-gate-pr391.json',
  'src/pages/post-pr390-review-gate-pr391.astro'
]) expect(!fs.existsSync(path.join(root, file)), `${file}: internal review output leaked into public surface`);

if (failures.length) {
  console.error('PR #391 Post-PR #390 Review Gate validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  report_id: report.report_id,
  archive_recorded: report.source_checkpoint.archive_recorded,
  archive_not_recorded: report.source_checkpoint.archive_not_recorded,
  pr390_yield: `${report.completed_pr390.changed}/${report.completed_pr390.selected}`,
  history_v4: {
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
