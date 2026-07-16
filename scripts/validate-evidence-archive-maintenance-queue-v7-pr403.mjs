import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { buildEvidenceArchiveMaintenanceQueueV7Outputs } from './build-evidence-archive-maintenance-queue-v7-pr403.mjs';

const root = process.cwd();
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const config = readJson('config/evidence-archive-maintenance-queue-v7-pr403.json');
const authority = readJson('docs/migration/post-pr400-review-gate-pr401.json');
const contract = readJson('config/evidence-archive-review-history-v6-pr402.json');
const manifest = readJson('docs/migration/evidence-archive-review-history-manifest-v6-pr402.json');
const audit = readJson('docs/migration/evidence-archive-review-history-audit-v6-pr402.json');
const priorQueue = readJson('docs/migration/evidence-archive-maintenance-queue-v6-pr398.json');
const queue = readJson('docs/migration/evidence-archive-maintenance-queue-v7-pr403.json');
const delta = readJson('docs/migration/evidence-archive-maintenance-queue-v7-pr403-delta.json');
const checkpoint = readJson('docs/migration/current-canonical-checkpoint.json');
const outputs = buildEvidenceArchiveMaintenanceQueueV7Outputs();

expect(same(queue, outputs.queue), 'committed Queue v7 is not deterministic');
expect(same(delta, outputs.delta), 'committed Queue v7 delta is not deterministic');
expect(config.review_pr === 403 && queue.review_pr === 403 && delta.review_pr === 403, 'review PR identity changed');
expect(config.config_id === 'sog_evidence_archive_maintenance_queue_v7_pr403', 'config ID changed');
expect(queue.queue_id === 'sog_evidence_archive_maintenance_queue_v7_pr403', 'queue ID changed');
expect(delta.delta_id === 'sog_evidence_archive_maintenance_queue_v7_delta_pr403', 'delta ID changed');
expect(queue.public_output === false && delta.public_output === false, 'Queue v7 outputs must remain internal');

expect(authority.decisions?.evidence_archive_maintenance_queue_v7?.pr === 403, 'PR #401 authority for PR #403 changed');
expect(authority.decisions?.evidence_archive_maintenance_queue_v7?.decision === 'approved_internal_after_pr402', 'PR #401 Queue v7 decision changed');
expect(authority.decisions?.evidence_archive_maintenance_queue_v7?.maximum_selected_count === 10, 'authority maximum selected count changed');
expect(audit.decision?.next_work_item === 'PR #403 Evidence Archive Maintenance Queue v7 Refresh', 'History v6 handoff changed');
expect(contract.contract_id === queue.review_history_contract_id, 'History v6 contract provenance mismatch');
expect(manifest.manifest_id === queue.review_history_manifest_id, 'History v6 manifest provenance mismatch');
expect(audit.audit_id === queue.review_history_audit_id, 'History v6 audit provenance mismatch');
expect(priorQueue.queue_id === queue.prior_queue_id, 'prior queue provenance mismatch');

expect(checkpoint.expected_counts.evidence === 559, 'checkpoint Evidence count changed');
expect(checkpoint.evidence_quality.archive_index_count === 430, 'checkpoint archive count changed');
expect(checkpoint.evidence_quality.archive_not_recorded_count === 129, 'checkpoint no-archive count changed');
expect(queue.canonical_evidence_count === 559, 'queue Evidence count changed');
expect(queue.archive_index_count === 430, 'queue archive count changed');
expect(queue.archive_not_recorded_count === 129, 'queue no-archive count changed');
expect(queue.reviewed_unresolved_suppressed_count === 18, 'queue suppression count changed');
expect(queue.reactivated_reviewed_identity_count === 0, 'queue reactivated identity count changed');
expect(queue.selected_reactivated_reviewed_identity_count === 0, 'queue selected reactivated count changed');
expect(queue.eligible_pool_count === 78, 'eligible pool count changed');
expect(queue.selected_count === 10 && queue.maximum_selected_count === 10, 'selected count boundary changed');
expect(queue.selected_candidates.length === 10, 'selected candidate array count changed');
expect(new Set(queue.selected_candidates.map((row) => row.evidence_id)).size === 10, 'selected Evidence IDs are not unique');
expect(queue.selected_candidates.every((row) => row.selection_tier === 1), 'unexpected reactivated selection tier');
expect(queue.selected_candidates.every((row) => row.review_history_found === false), 'reviewed identity entered ordinary queue');
expect(queue.selected_candidates.every((row) => row.eligibility_state === 'eligible_unreviewed_archive_gap'), 'selected eligibility state changed');
expect(queue.selected_candidates.every((row) => row.candidate_eligible_under_contract === true), 'ineligible candidate selected');
expect(queue.selected_candidates.every((row) => row.reactivation_signal_present === false), 'reactivation signal unexpectedly selected');
expect(queue.selected_candidates.every((row) => row.canonical_change_authorized === false), 'canonical change unexpectedly authorized');
expect(queue.selected_reactivated_reviewed_evidence_ids.length === 0, 'selected reactivated IDs must be empty');

expect(delta.eligible_pool_count === 78 && delta.selected_count === 10, 'delta pool/selection count changed');
expect(delta.added_evidence_ids.length === 10, 'Queue v7 added count changed');
expect(delta.removed_evidence_ids.length === 10, 'Queue v7 removed count changed');
expect(delta.retained_evidence_ids.length === 0, 'Queue v7 retained count changed');
expect(same(delta.current_selected_evidence_ids, queue.selected_candidates.map((row) => row.evidence_id)), 'queue/delta selected IDs mismatch');
expect(delta.reviewed_unresolved_suppressed_evidence_ids.length === 18, 'delta suppression ID count changed');
for (const evidenceId of [
  'sog_src_paxg_allocation_batch_b',
  'sog_src_paxg_pricing_batch_b',
  'sog_src_paxg_redemption_batch_b',
  'sog_src_paxos_busd_announcement',
  'sog_src_pyusd_paxos_official'
]) expect(delta.reviewed_unresolved_suppressed_evidence_ids.includes(evidenceId), `${evidenceId}: PR #400 suppression missing`);
expect(delta.reactivated_reviewed_evidence_ids.length === 0, 'delta reactivated IDs must be empty');
expect(delta.selected_reactivated_reviewed_evidence_ids.length === 0, 'delta selected reactivated IDs must be empty');
expect(delta.review_history_summary.history_source_count === 7, 'delta History source count changed');
expect(delta.review_history_summary.history_event_count === 70, 'delta History event count changed');
expect(delta.review_history_summary.reviewed_evidence_identity_count === 68, 'delta History identity count changed');
expect(delta.review_history_summary.current_reviewed_unresolved_suppressed_count === 18, 'delta History suppression count changed');
expect(delta.review_history_summary.current_reviewed_reactivated_eligible_count === 0, 'delta History reactivation count changed');
expect(delta.exclusion_counts.alias_identity === 33, 'alias exclusion count changed');
expect(delta.exclusion_counts.reviewed_suppressed_without_signal === 18, 'suppression exclusion count changed');

expect(queue.evidence_rank === false && queue.single_composite_score === false, 'ranking boundary changed');
expect(queue.selection_boundary.canonical_change_authorized === false, 'canonical change boundary changed');
expect(queue.selection_boundary.manual_review_required === true, 'manual review boundary changed');
expect(queue.selection_boundary.public_surface_allowed === false, 'public surface boundary changed');
expect(queue.selection_boundary.batch_8_authorized === false, 'Batch 8 unexpectedly authorized');
expect(queue.selection_boundary.review_gate_required === true, 'review gate boundary changed');
expect(queue.next_work_item === 'REVIEW GATE' && delta.next_work_item === 'REVIEW GATE', 'review gate handoff changed');
expect(Object.values(delta.boundaries).every((value) => value === false), 'delta boundary changed');
expect(queue.source_digest_sha256 === delta.source_digest_sha256, 'source digest mismatch');
expect(queue.generation_digest_sha256 === delta.generation_digest_sha256, 'generation digest mismatch');

try {
  git('rev-parse', '--verify', 'origin/main');
  for (const file of [
    'config/evidence-archive-review-history-v6-pr402.json',
    'docs/migration/evidence-archive-review-history-manifest-v6-pr402.json',
    'docs/migration/evidence-archive-review-history-audit-v6-pr402.json',
    'docs/migration/evidence-archive-maintenance-queue-v6-pr398.json',
    'docs/migration/evidence-archive-maintenance-queue-v6-pr398-delta.json',
    'docs/migration/post-pr400-review-gate-pr401.json',
    'docs/migration/current-canonical-checkpoint.json',
    'docs/migration/current-stats-history-checkpoint.json',
    'docs/migration/registry-release-integrity-baseline.json'
  ]) expect(git('hash-object', file) === git('rev-parse', `origin/main:${file}`), `${file}: immutable Git blob identity changed`);
} catch {}

for (const [file, markers] of [
  ['AGENTS.md', ['PR #403 Evidence Archive Maintenance Queue v7 Refresh: active; complete on merge', 'Eligible pool: 78', 'Selected: 10', 'REVIEW GATE: mandatory after PR #403']],
  ['docs/roadmap.md', ['Status: canonical execution schedule — PR #403 active', 'Eligible pool: 78', 'Selected reactivated: 0', 'After PR #403, stop at `REVIEW GATE`']],
  ['docs/quality/evidence-archive-maintenance-queue-v7-pr403-spec.md', ['Expected eligible pool: **78**', 'Expected selected count: **10**', 'stop at `REVIEW GATE`']],
  ['docs/roadmap-amendments/2026-07-16-pr403-evidence-archive-maintenance-queue-v7-activation.md', ['Eligible pool: 78', 'Selected: 10', 'Archive Batch 8 is not authorized']]
]) for (const marker of markers) expect(readText(file).includes(marker), `${file}: missing authority marker ${marker}`);

for (const file of [
  'public/data/evidence-archive-maintenance-queue-v7-pr403.json',
  'public/data/evidence-archive-maintenance-queue-v7-pr403-delta.json',
  'src/pages/evidence-archive-maintenance-queue-v7.astro'
]) expect(!fs.existsSync(path.join(root, file)), `${file}: internal output leaked into public surface`);

if (failures.length) {
  console.error('PR #403 Evidence Archive Maintenance Queue v7 validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  queue_id: queue.queue_id,
  eligible_pool: queue.eligible_pool_count,
  selected: queue.selected_count,
  selected_evidence_ids: queue.selected_candidates.map((row) => row.evidence_id),
  added: delta.added_evidence_ids.length,
  removed: delta.removed_evidence_ids.length,
  retained: delta.retained_evidence_ids.length,
  reviewed_suppressed: queue.reviewed_unresolved_suppressed_count,
  reviewed_reactivated: queue.reactivated_reviewed_identity_count,
  next_work_item: queue.next_work_item
}, null, 2));
