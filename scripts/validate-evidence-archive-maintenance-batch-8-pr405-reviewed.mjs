import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const git = (...args) => execFileSync('git', args, {
  cwd: root,
  encoding: 'utf8',
  stdio: ['ignore', 'pipe', 'pipe']
}).trim();
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const config = readJson('config/evidence-archive-maintenance-batch-8-pr405.json');
const authority = readJson('docs/migration/post-pr403-review-gate-pr404.json');
const queue = readJson('docs/migration/evidence-archive-maintenance-queue-v7-pr403.json');
const probe = readJson('docs/migration/evidence-archive-maintenance-batch-8-pr405-review-queue.json');
const decisionFile = readJson('config/evidence-archive-maintenance-batch-8-pr405-decisions.json');
const outcomes = readJson('docs/migration/evidence-archive-maintenance-outcomes-pr405.json');
const handoff = readJson('docs/migration/evidence-archive-maintenance-batch-8-pr405-reviewed-handoff.json');
const selected = config.selected_evidence_ids;
const decisions = decisionFile.decisions ?? [];
const authorityDecision = authority.decisions?.evidence_archive_maintenance_batch_8;

expect(config.review_pr === 405, 'config review PR changed');
expect(authorityDecision?.pr === 405 && authorityDecision?.decision === 'approved_bounded_manual_review', 'PR #404 authority changed');
expect(same(queue.selected_candidates.map((row) => row.evidence_id), selected), 'Queue v7 identities differ from config');
expect(same(authorityDecision?.selected_evidence_ids, selected), 'authority identities differ from config');
expect(queue.selected_count === 10 && selected.length === 10, 'selected identity count changed');

expect(probe.review_pr === 405 && probe.selected_count === 10, 'probe boundary changed');
expect(probe.status === 'internal_manual_review_probe_complete', 'probe status changed');
expect(probe.public_output === false && probe.automatic_canonical_write === false, 'probe public/canonical boundary changed');
expect(same(probe.rows.map((row) => row.evidence_id), selected), 'probe identities changed');
expect(probe.rows.every((row) => row.live_probe?.ok === true), 'not every selected source was live during the recorded probe');
expect(probe.rows.every((row) => row.exact_cdx_probe?.ok === true), 'not every exact CDX probe completed');

expect(decisionFile.review_pr === 405 && decisionFile.status === 'reviewed_manual_decisions', 'decision file status changed');
expect(decisions.length === 10, 'decision count changed');
expect(new Set(decisions.map((row) => row.evidence_id)).size === 10, 'decision identities are not unique');
expect(same(decisions.map((row) => row.evidence_id), selected), 'decision identity order changed');
expect(decisions.every((row) => row.outcome === 'reviewed_no_safe_change'), 'a decision escaped the no-safe-change boundary');
const queueById = new Map(queue.selected_candidates.map((row) => [row.evidence_id, row]));
for (const decision of decisions) {
  expect(decision.canonical_url === queueById.get(decision.evidence_id)?.url, `${decision.evidence_id}: canonical URL mismatch`);
  expect(Boolean(decision.review_reason), `${decision.evidence_id}: review reason missing`);
  expect(Boolean(decision.remaining_uncertainty), `${decision.evidence_id}: remaining uncertainty missing`);
  expect(!decision.archived_url && !decision.replacement_url, `${decision.evidence_id}: no-safe-change decision contains a canonical replacement`);
}
expect(decisionFile.counts?.selected === 10, 'decision selected count changed');
expect(decisionFile.counts?.dated_exact_archive_added === 0, 'decision archive count changed');
expect(decisionFile.counts?.reviewed_source_replacement === 0, 'decision replacement count changed');
expect(decisionFile.counts?.reviewed_no_safe_change === 10, 'decision no-safe count changed');
expect(Object.values(decisionFile.boundaries ?? {}).every((value) => value === false), 'decision boundary changed');

expect(outcomes.review_pr === 405 && outcomes.status === 'reviewed_bounded_maintenance', 'outcome status changed');
expect(outcomes.selected_count === 10 && outcomes.changed_count === 0, 'outcome selected/changed count changed');
expect(outcomes.dated_archive_added_count === 0, 'outcome archive count changed');
expect(outcomes.reviewed_source_replacement_count === 0, 'outcome replacement count changed');
expect(outcomes.reviewed_no_safe_change_count === 10, 'outcome no-safe count changed');
expect(outcomes.archive_index_count_before === 430 && outcomes.archive_index_count_after === 430, 'archive recorded count changed');
expect(outcomes.archive_not_recorded_count_before === 129 && outcomes.archive_not_recorded_count_after === 129, 'archive gap count changed');
expect(outcomes.canonical_evidence_count_after === 559 && outcomes.evidence_relation_count_after === 559, 'Evidence identity boundary changed');
expect(Array.isArray(outcomes.changed_files) && outcomes.changed_files.length === 0, 'outcomes claim canonical changed files');
expect(same(outcomes.outcomes.map((row) => row.evidence_id), selected), 'outcome identities changed');
expect(outcomes.outcomes.every((row) => row.decision === 'reviewed_no_safe_change'), 'outcome mix changed');

expect(handoff.review_pr === 405 && handoff.status === 'reviewed_complete', 'handoff status changed');
expect(handoff.canonical_counts?.assets === 112, 'asset count changed');
expect(handoff.canonical_counts?.evidence === 559 && handoff.canonical_counts?.evidence_relations === 559, 'Evidence counts changed');
expect(handoff.canonical_counts?.deployments === 174 && handoff.canonical_counts?.market_access_records === 8, 'non-Evidence counts changed');
expect(handoff.evidence_quality?.archive_recorded === 430 && handoff.evidence_quality?.archive_not_recorded === 129, 'handoff archive boundary changed');
expect(handoff.evidence_quality?.selected === 10 && handoff.evidence_quality?.changed === 0, 'handoff review count changed');
expect(handoff.evidence_quality?.reviewed_no_safe_change === 10, 'handoff no-safe count changed');
expect(same(handoff.reviewed_no_safe_change_evidence_ids, selected), 'handoff reviewed identities changed');
expect(handoff.next_work_item?.decision === 'review_gate_required', 'PR #405 must end at REVIEW GATE');
expect(Object.values(handoff.boundaries ?? {}).every((value) => value === false), 'handoff boundary changed');

try {
  git('rev-parse', '--verify', 'origin/main');
  for (const file of [
    'data/entities.json',
    'data/events.json',
    'data/evidence.json',
    'data/evidence-batch-b.json',
    'data/evidence-extra.json',
    'data/stats-history.json',
    'docs/migration/current-canonical-checkpoint.json',
    'docs/migration/current-stats-history-checkpoint.json',
    'docs/migration/registry-release-integrity-baseline.json'
  ]) {
    expect(git('hash-object', file) === git('rev-parse', `origin/main:${file}`), `${file}: canonical or checkpoint content changed`);
  }
} catch (error) {
  failures.push(`unable to verify origin/main immutability: ${error.message}`);
}

for (const [file, markers] of [
  ['AGENTS.md', ['reviewed_no_safe_change: 10', 'Archive recorded after reviewed decisions: 430', 'PR #405 must stop at `REVIEW GATE`']],
  ['docs/roadmap.md', ['reviewed_no_safe_change: 10', 'Archive recorded: 430 -> 430', 'After PR #405, stop at `REVIEW GATE`']],
  ['docs/quality/evidence-archive-maintenance-batch-8-pr405-spec.md', ['ten reviewed no-safe-change', 'Archive recorded: 430 -> 430', 'PR #405 stops at `REVIEW GATE`']],
  ['docs/roadmap-amendments/2026-07-16-pr405-evidence-archive-maintenance-batch-8-activation.md', ['ten reviewed no-safe-change', 'Archive recorded / not recorded after review: 430 / 129', 'stop at `REVIEW GATE`']]
]) {
  const value = readText(file);
  for (const marker of markers) expect(value.includes(marker), `${file}: missing authority marker ${marker}`);
}

for (const file of [
  'public/data/evidence-archive-maintenance-batch-8-pr405-review-queue.json',
  'public/data/evidence-archive-maintenance-outcomes-pr405.json',
  'public/data/evidence-archive-maintenance-batch-8-pr405-reviewed-handoff.json',
  'src/pages/evidence-archive-maintenance-batch-8-pr405.astro'
]) expect(!fs.existsSync(path.join(root, file)), `${file}: internal reviewed output leaked into public surface`);

if (failures.length) {
  console.error('PR #405 reviewed no-safe-change validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  review_pr: 405,
  selected: 10,
  changed: 0,
  dated_archives_added: 0,
  reviewed_source_replacements: 0,
  reviewed_no_safe_change: 10,
  archive_recorded: 430,
  archive_not_recorded: 129,
  evidence: 559,
  evidence_relations: 559,
  next_authority: 'review_gate_required'
}, null, 2));
