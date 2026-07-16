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

const config = json('config/evidence-archive-maintenance-batch-7-pr400.json');
const authority = json('docs/migration/post-pr398-review-gate-pr399.json');
const queue = json('docs/migration/evidence-archive-maintenance-queue-v6-pr398.json');
const probeFile = 'docs/migration/evidence-archive-maintenance-batch-7-pr400-review-queue.json';
const decision = authority.decisions?.evidence_archive_maintenance_batch_7;

check(config.review_pr === 400, 'config review PR changed');
check(decision?.pr === 400 && decision?.decision === 'approved_bounded_manual_review', 'PR #399 authority changed');
check(same(queue.selected_candidates.map((row) => row.evidence_id), config.selected_evidence_ids), 'Queue v6 IDs differ from config');
check(same(decision?.selected_evidence_ids, config.selected_evidence_ids), 'authority IDs differ from config');
check(queue.selected_count === 10 && queue.next_work_item === 'REVIEW GATE', 'Queue v6 boundary changed');
check(queue.selection_boundary.batch_7_authorized === false, 'Queue v6 self-authorized Batch 7');

if (fs.existsSync(path.join(root, probeFile))) {
  const probe = json(probeFile);
  check(probe.queue_id === 'sog_evidence_archive_maintenance_batch_7_pr400_review_queue', 'probe ID changed');
  check(probe.review_pr === 400 && probe.selected_count === 10, 'probe count changed');
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
    'docs/migration/post-pr398-review-gate-pr399.json',
    'docs/migration/evidence-archive-maintenance-queue-v6-pr398.json',
    'docs/migration/evidence-archive-maintenance-queue-v6-pr398-delta.json',
    'docs/migration/current-canonical-checkpoint.json',
    'docs/migration/current-stats-history-checkpoint.json',
    'docs/migration/registry-release-integrity-baseline.json'
  ]) check(git('hash-object', file) === git('rev-parse', `origin/main:${file}`), `${file}: immutable source changed`);
} catch {}

for (const [file, markers] of [
  ['AGENTS.md', ['PR #400 Evidence and Archive Maintenance Batch 7: active; complete on merge', 'Canonical writes remain disabled during the probe phase', 'PR #400 must stop at `REVIEW GATE`']],
  ['docs/roadmap.md', ['Status: canonical execution schedule — PR #400 active', 'The initial workflow is probe-only', 'After PR #400, stop at `REVIEW GATE`']],
  ['docs/quality/evidence-archive-maintenance-batch-7-pr400-spec.md', ['The initial workflow records live response', 'Canonical writes are disabled', 'PR #400 stops at `REVIEW GATE`']],
  ['docs/roadmap-amendments/2026-07-16-pr400-evidence-archive-maintenance-batch-7-activation.md', ['Canonical writes remain disabled', 'ten Queue v6 identities', 'Batch 8 remains unapproved']]
]) for (const marker of markers) check(text(file).includes(marker), `${file}: missing ${marker}`);

check(!fs.existsSync(path.join(root, 'public/data/evidence-archive-maintenance-batch-7-pr400-review-queue.json')), 'probe leaked public');
check(!fs.existsSync(path.join(root, 'src/pages/evidence-archive-maintenance-batch-7-pr400.astro')), 'probe page leaked public');

if (failures.length) {
  console.error('PR #400 Batch 7 probe validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log(JSON.stringify({ ok: true, phase: 'probe_only', selected: 10, probe_present: fs.existsSync(path.join(root, probeFile)), canonical_write_allowed: false }, null, 2));
