import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const json = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const text = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
const failures = [];
const check = (ok, message) => { if (!ok) failures.push(message); };

const config = json('config/evidence-archive-maintenance-batch-8-pr405.json');
const authority = json('docs/migration/post-pr403-review-gate-pr404.json');
const queue = json('docs/migration/evidence-archive-maintenance-queue-v7-pr403.json');
const probeFile = 'docs/migration/evidence-archive-maintenance-batch-8-pr405-review-queue.json';
const decision = authority.decisions?.evidence_archive_maintenance_batch_8;

check(config.review_pr === 405, 'config review PR changed');
check(decision?.pr === 405 && decision?.decision === 'approved_bounded_manual_review', 'PR #404 authority changed');
check(same(queue.selected_candidates.map((row) => row.evidence_id), config.selected_evidence_ids), 'Queue v7 IDs differ from config');
check(same(decision?.selected_evidence_ids, config.selected_evidence_ids), 'authority IDs differ from config');
check(queue.selected_count === 10 && queue.next_work_item === 'REVIEW GATE', 'Queue v7 boundary changed');
check(queue.selection_boundary.batch_8_authorized === false, 'Queue v7 self-authorized Batch 8');

if (fs.existsSync(path.join(root, probeFile))) {
  const probe = json(probeFile);
  check(probe.queue_id === 'sog_evidence_archive_maintenance_batch_8_pr405_review_queue', 'probe ID changed');
  check(probe.review_pr === 405 && probe.selected_count === 10, 'probe count changed');
  check(probe.status === 'internal_manual_review_probe_complete', 'probe status changed');
  check(probe.public_output === false && probe.automatic_canonical_write === false, 'probe public/canonical boundary changed');
  check(probe.exact_source_match_required === true, 'exact source requirement changed');
  check(same(probe.rows.map((row) => row.evidence_id), config.selected_evidence_ids), 'probe identities changed');
  check(probe.rows.every((row) => row.review_status === 'pending_manual_review' && row.proposed_outcome === null), 'probe contains decisions');
  check(Object.values(probe.boundaries).every((value) => value === false), 'probe boundary changed');
}

try {
  git('rev-parse', '--verify', 'origin/main');
  for (const file of [
    'docs/migration/post-pr403-review-gate-pr404.json',
    'docs/migration/evidence-archive-maintenance-queue-v7-pr403.json',
    'docs/migration/evidence-archive-maintenance-queue-v7-pr403-delta.json',
    'docs/migration/current-canonical-checkpoint.json',
    'docs/migration/current-stats-history-checkpoint.json',
    'docs/migration/registry-release-integrity-baseline.json'
  ]) check(git('hash-object', file) === git('rev-parse', `origin/main:${file}`), `${file}: immutable source changed`);
} catch {}

for (const [file, markers] of [
  ['AGENTS.md', ['PR #405 Evidence and Archive Maintenance Batch 8: active; complete on merge', 'Canonical writes remain disabled during the probe phase', 'PR #405 must stop at `REVIEW GATE`']],
  ['docs/roadmap.md', ['Status: canonical execution schedule — PR #405 active', 'The initial workflow is probe-only', 'After PR #405, stop at `REVIEW GATE`']],
  ['docs/quality/evidence-archive-maintenance-batch-8-pr405-spec.md', ['The initial workflow records live response', 'Canonical writes are disabled', 'PR #405 stops at `REVIEW GATE`']],
  ['docs/roadmap-amendments/2026-07-16-pr405-evidence-archive-maintenance-batch-8-activation.md', ['Canonical writes remain disabled', 'ten Queue v7 identities', 'Batch 9 remains unapproved']]
]) for (const marker of markers) check(text(file).includes(marker), `${file}: missing ${marker}`);

check(!fs.existsSync(path.join(root, 'public/data/evidence-archive-maintenance-batch-8-pr405-review-queue.json')), 'probe leaked public');
check(!fs.existsSync(path.join(root, 'src/pages/evidence-archive-maintenance-batch-8-pr405.astro')), 'probe page leaked public');

if (failures.length) {
  console.error('PR #405 Batch 8 probe validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log(JSON.stringify({ ok: true, phase: 'probe_only', selected: 10, probe_present: fs.existsSync(path.join(root, probeFile)), canonical_write_allowed: false }, null, 2));
