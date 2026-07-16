import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };
const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);

const config = readJson('config/evidence-archive-maintenance-batch-6-pr395.json');
const authority = readJson('docs/migration/post-pr393-review-gate-pr394.json');
const queue = readJson('docs/migration/evidence-archive-maintenance-queue-v5-pr393.json');
const probePath = 'docs/migration/evidence-archive-maintenance-batch-6-pr395-review-queue.json';

expect(config.review_pr === 395, 'config review PR changed');
expect(authority.decisions?.evidence_archive_maintenance_batch_6?.pr === 395, 'PR #394 does not authorize PR #395');
expect(authority.decisions?.evidence_archive_maintenance_batch_6?.decision === 'approved_bounded_manual_review', 'PR #394 Batch 6 decision changed');
expect(same(queue.selected_candidates.map((row) => row.evidence_id), config.selected_evidence_ids), 'Queue v5 selected IDs differ from config');
expect(same(authority.decisions.evidence_archive_maintenance_batch_6.selected_evidence_ids, config.selected_evidence_ids), 'authority selected IDs differ from config');
expect(queue.selected_count === 10 && queue.next_work_item === 'REVIEW GATE', 'Queue v5 boundary changed');
expect(queue.selection_boundary.batch_6_authorized === false, 'Queue v5 itself authorized Batch 6');

if (fs.existsSync(path.join(root, probePath))) {
  const probe = readJson(probePath);
  expect(probe.queue_id === 'sog_evidence_archive_maintenance_batch_6_pr395_review_queue', 'probe queue ID changed');
  expect(probe.review_pr === 395 && probe.selected_count === 10, 'probe count changed');
  expect(probe.status === 'internal_manual_review_probe_complete', 'probe status changed');
  expect(probe.public_output === false && probe.automatic_canonical_write === false, 'probe became public or canonical');
  expect(probe.exact_source_match_required === true, 'exact source requirement changed');
  expect(same(probe.rows.map((row) => row.evidence_id), config.selected_evidence_ids), 'probe row identities changed');
  expect(probe.rows.every((row) => row.review_status === 'pending_manual_review' && row.proposed_outcome === null), 'probe contains premature decisions');
  expect(Object.values(probe.boundaries).every((value) => value === false), 'probe boundary changed');
}

let originMainAvailable = false;
try { git('rev-parse', '--verify', 'origin/main'); originMainAvailable = true; } catch {}
if (originMainAvailable) {
  for (const file of [
    'docs/migration/post-pr393-review-gate-pr394.json',
    'docs/migration/evidence-archive-maintenance-queue-v5-pr393.json',
    'docs/migration/evidence-archive-maintenance-queue-v5-pr393-delta.json',
    'docs/migration/current-canonical-checkpoint.json',
    'docs/migration/current-stats-history-checkpoint.json',
    'docs/migration/registry-release-integrity-baseline.json'
  ]) {
    try { expect(git('hash-object', file) === git('rev-parse', `origin/main:${file}`), `${file}: immutable source changed`); }
    catch (error) { failures.push(`${file}: unable to verify immutable source: ${error.message}`); }
  }
}

for (const [file, markers] of [
  ['AGENTS.md', ['PR #395 Evidence and Archive Maintenance Batch 6: active; complete on merge', 'Canonical writes remain disabled during the probe phase', 'PR #395 must stop at `REVIEW GATE`']],
  ['docs/roadmap.md', ['Status: canonical execution schedule — PR #395 active', 'The initial workflow is probe-only', 'After PR #395, stop at `REVIEW GATE`']],
  ['docs/quality/evidence-archive-maintenance-batch-6-pr395-spec.md', ['The initial workflow records live response', 'Canonical writes are disabled', 'PR #395 stops at `REVIEW GATE`']],
  ['docs/roadmap-amendments/2026-07-16-pr395-evidence-archive-maintenance-batch-6-activation.md', ['Canonical writes remain disabled', 'ten Queue v5 identities', 'Batch 7 remains unapproved']]
]) {
  const value = readText(file);
  for (const marker of markers) expect(value.includes(marker), `${file}: missing authority marker ${marker}`);
}

for (const file of [
  'public/data/evidence-archive-maintenance-batch-6-pr395-review-queue.json',
  'src/pages/evidence-archive-maintenance-batch-6-pr395.astro'
]) expect(!fs.existsSync(path.join(root, file)), `${file}: internal probe leaked into public surface`);

if (failures.length) {
  console.error('PR #395 Batch 6 probe validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  phase: 'probe_only',
  selected: config.selected_evidence_ids.length,
  probe_present: fs.existsSync(path.join(root, probePath)),
  canonical_write_allowed: false,
  next_work_item: 'manual_review_decisions_then_REVIEW_GATE'
}, null, 2));
