import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { buildEvidenceArchiveMaintenanceQueueV5Outputs } from './build-evidence-archive-maintenance-queue-v5-pr393.mjs';

const root = process.cwd();
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const config = readJson('config/evidence-archive-maintenance-queue-v5-pr393.json');
const authority = readJson('docs/migration/post-pr390-review-gate-pr391.json');
const contract = readJson('config/evidence-archive-review-history-v4-pr392.json');
const manifest = readJson('docs/migration/evidence-archive-review-history-manifest-v4-pr392.json');
const audit = readJson('docs/migration/evidence-archive-review-history-audit-v4-pr392.json');
const priorQueue = readJson('docs/migration/evidence-archive-maintenance-queue-v4-pr388.json');
const queue = readJson('docs/migration/evidence-archive-maintenance-queue-v5-pr393.json');
const delta = readJson('docs/migration/evidence-archive-maintenance-queue-v5-pr393-delta.json');
const checkpoint = readJson('docs/migration/current-canonical-checkpoint.json');
const outputs = buildEvidenceArchiveMaintenanceQueueV5Outputs();

expect(same(queue, outputs.queue), 'committed Queue v5 is not deterministic');
expect(same(delta, outputs.delta), 'committed Queue v5 delta is not deterministic');
expect(queue.queue_id === 'sog_evidence_archive_maintenance_queue_v5_pr393', 'queue ID changed');
expect(delta.delta_id === 'sog_evidence_archive_maintenance_queue_v5_delta_pr393', 'delta ID changed');
expect(queue.review_pr === 393 && delta.review_pr === 393, 'review PR identity changed');
expect(queue.public_output === false && delta.public_output === false, 'Queue v5 outputs became public');
expect(queue.evidence_rank === false && queue.single_composite_score === false, 'Queue v5 became ranking/scoring output');

expect(authority.decisions?.evidence_archive_maintenance_queue_v5?.pr === 393, 'PR #391 Queue v5 authority changed');
expect(authority.decisions?.evidence_archive_maintenance_queue_v5?.decision === 'approved_internal_after_pr392', 'PR #391 Queue v5 decision changed');
expect(audit.decision?.next_work_item === 'PR #393 Evidence Archive Maintenance Queue v5 Refresh', 'History v4 handoff changed');
expect(queue.review_history_contract_id === contract.contract_id, 'queue contract provenance changed');
expect(queue.review_history_manifest_id === manifest.manifest_id, 'queue manifest provenance changed');
expect(queue.review_history_audit_id === audit.audit_id, 'queue audit provenance changed');
expect(queue.prior_queue_id === priorQueue.queue_id && delta.prior_queue_id === priorQueue.queue_id, 'prior queue provenance changed');

expect(queue.canonical_evidence_count === 559, 'canonical Evidence count changed');
expect(queue.archive_index_count === 416, 'archive-recorded count changed');
expect(queue.archive_not_recorded_count === 143, 'archive-not-recorded count changed');
expect(checkpoint.expected_counts.evidence === 559, 'checkpoint Evidence count changed');
expect(checkpoint.evidence_quality.archive_index_count === 416 && checkpoint.evidence_quality.archive_not_recorded_count === 143, 'checkpoint archive boundary changed');
expect(queue.reviewed_unresolved_suppressed_count === 12, 'reviewed suppression count changed');
expect(queue.reactivated_reviewed_identity_count === 0, 'reviewed reactivation count changed');
expect(queue.selected_reactivated_reviewed_identity_count === 0, 'reactivated identity was selected');
expect(queue.selected_reactivated_reviewed_evidence_ids.length === 0, 'selected reactivated IDs must be empty');

expect(queue.selected_count === config.expected_output.selected_count, 'selected count changed');
expect(queue.selected_count <= config.selection.maximum_selected_count, 'selected count exceeds maximum');
expect(queue.selected_candidates.length === queue.selected_count, 'selected candidate array count changed');
expect(new Set(queue.selected_candidates.map((row) => row.evidence_id)).size === queue.selected_count, 'selected Evidence IDs are not unique');
expect(queue.selected_candidates.every((row) => row.selection_tier === 1), 'Queue v5 contains a non-ordinary selection tier');
expect(queue.selected_candidates.every((row) => row.review_history_found === false), 'Queue v5 selected a previously reviewed identity');
expect(queue.selected_candidates.every((row) => row.review_status === 'pending_manual_review' && row.canonical_change_authorized === false), 'Queue v5 selected row boundary changed');
expect(queue.selected_candidates.every((row) => row.review_reasons.includes('unreviewed_archive_gap')), 'Queue v5 selected row is not an unreviewed archive gap');

const selectedIds = queue.selected_candidates.map((row) => row.evidence_id);
const priorIds = priorQueue.selected_candidates.map((row) => row.evidence_id).sort();
expect(same(delta.current_selected_evidence_ids, selectedIds), 'delta current selection changed');
expect(same(delta.prior_selected_evidence_ids, priorIds), 'delta prior selection changed');
expect(delta.selected_count === queue.selected_count && delta.eligible_pool_count === queue.eligible_pool_count, 'queue/delta counts differ');
expect(delta.added_evidence_ids.length + delta.retained_evidence_ids.length === queue.selected_count, 'delta added/retained count invalid');
expect(delta.removed_evidence_ids.length + delta.retained_evidence_ids.length === priorIds.length, 'delta removed/retained count invalid');
expect(delta.reviewed_unresolved_suppressed_evidence_ids.length === 12, 'delta suppression IDs changed');
expect(delta.reactivated_reviewed_evidence_ids.length === 0 && delta.selected_reactivated_reviewed_evidence_ids.length === 0, 'delta reactivation IDs changed');
expect(Object.values(queue.selection_boundary).filter((value) => value === true).length === 3, 'queue selection boundary changed');
expect(queue.selection_boundary.canonical_change_authorized === false && queue.selection_boundary.public_surface_allowed === false && queue.selection_boundary.batch_6_authorized === false, 'queue canonical/public/Batch 6 boundary changed');
expect(Object.values(delta.boundaries).every((value) => value === false), 'delta boundary changed');
expect(queue.next_work_item === 'REVIEW GATE' && delta.next_work_item === 'REVIEW GATE', 'Queue v5 must stop at review gate');

let originMainAvailable = false;
try { git('rev-parse', '--verify', 'origin/main'); originMainAvailable = true; } catch {}
if (originMainAvailable) {
  for (const file of [
    'config/evidence-archive-review-history-v4-pr392.json',
    'docs/migration/evidence-archive-review-history-manifest-v4-pr392.json',
    'docs/migration/evidence-archive-review-history-audit-v4-pr392.json',
    'docs/migration/post-pr390-review-gate-pr391.json',
    'docs/migration/evidence-archive-maintenance-queue-v4-pr388.json',
    'docs/migration/evidence-archive-maintenance-queue-v4-pr388-delta.json',
    'docs/migration/current-canonical-checkpoint.json',
    'docs/migration/current-stats-history-checkpoint.json',
    'docs/migration/registry-release-integrity-baseline.json'
  ]) {
    try { expect(git('hash-object', file) === git('rev-parse', `origin/main:${file}`), `${file}: immutable Git blob identity changed`); }
    catch (error) { failures.push(`${file}: unable to verify origin/main blob identity: ${error.message}`); }
  }
}

for (const [file, markers] of [
  ['AGENTS.md', ['PR #393 Evidence Archive Maintenance Queue v5 Refresh: active; complete on merge', 'reviewed reactivated eligible: 0', 'PR #393 must stop at `REVIEW GATE`']],
  ['docs/roadmap.md', ['Status: canonical execution schedule — PR #393 active', 'There is no reviewed-reactivated candidate tier', 'After PR #393, stop at `REVIEW GATE`']],
  ['docs/quality/evidence-archive-maintenance-queue-v5-pr393-spec.md', ['143 archive-not-recorded canonical Evidence identities', 'No tier-0 reviewed-reactivated identity exists', 'next work item is `REVIEW GATE`']],
  ['docs/roadmap-amendments/2026-07-16-pr393-evidence-archive-maintenance-queue-v5-activation.md', ['twelve reviewed suppressions', 'ordinary unreviewed archive gaps', 'stop at `REVIEW GATE`']]
]) {
  const value = readText(file);
  for (const marker of markers) expect(value.includes(marker), `${file}: missing authority marker ${marker}`);
}

for (const file of [
  'public/data/evidence-archive-maintenance-queue-v5-pr393.json',
  'public/data/evidence-archive-maintenance-queue-v5-pr393-delta.json',
  'src/pages/evidence-archive-maintenance-queue-v5.astro'
]) expect(!fs.existsSync(path.join(root, file)), `${file}: internal output leaked into public surface`);

if (failures.length) {
  console.error('PR #393 Evidence Archive Maintenance Queue v5 validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  queue_id: queue.queue_id,
  canonical_evidence: queue.canonical_evidence_count,
  archive_recorded: queue.archive_index_count,
  archive_not_recorded: queue.archive_not_recorded_count,
  reviewed_suppressed: queue.reviewed_unresolved_suppressed_count,
  reviewed_reactivated: queue.reactivated_reviewed_identity_count,
  eligible_pool: queue.eligible_pool_count,
  selected: queue.selected_count,
  selected_evidence_ids: selectedIds,
  delta: {
    added: delta.added_evidence_ids.length,
    removed: delta.removed_evidence_ids.length,
    retained: delta.retained_evidence_ids.length
  },
  next_work_item: queue.next_work_item
}, null, 2));
