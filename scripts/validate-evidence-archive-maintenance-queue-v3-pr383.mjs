import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { buildEvidenceArchiveMaintenanceQueueV3Outputs } from './build-evidence-archive-maintenance-queue-v3-pr383.mjs';

const root = process.cwd();
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const git = (...args) => execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const config = readJson('config/evidence-archive-maintenance-queue-v3-pr383.json');
const queue = readJson('docs/migration/evidence-archive-maintenance-queue-v3-pr383.json');
const delta = readJson('docs/migration/evidence-archive-maintenance-queue-v3-pr383-delta.json');
const checkpoint = readJson('docs/migration/current-canonical-checkpoint.json');
const contract = readJson('config/evidence-archive-review-history-v2-pr382.json');
const manifest = readJson('docs/migration/evidence-archive-review-history-manifest-v2-pr382.json');
const audit = readJson('docs/migration/evidence-archive-review-history-audit-v2-pr382.json');
const authority = readJson('docs/migration/post-pr380-review-gate-pr381.json');
const generated = buildEvidenceArchiveMaintenanceQueueV3Outputs();

expect(same(queue, generated.queue), 'committed archive queue v3 is not deterministic');
expect(same(delta, generated.delta), 'committed archive queue v3 delta is not deterministic');
expect(config.review_pr === 383 && queue.review_pr === 383 && delta.review_pr === 383, 'review PR identity changed');
expect(queue.queue_id === 'sog_evidence_archive_maintenance_queue_v3_pr383', 'queue ID changed');
expect(delta.delta_id === 'sog_evidence_archive_maintenance_queue_v3_delta_pr383', 'delta ID changed');
expect(queue.status === 'reviewed_internal_non_ranking_history_v2_queue', 'queue status changed');
expect(queue.public_output === false && delta.public_output === false, 'outputs must remain internal');
expect(queue.evidence_rank === false && queue.single_composite_score === false, 'queue must remain non-ranking');

expect(authority.decisions?.evidence_archive_maintenance_queue_v3?.pr === 383, 'PR #381 authority for PR #383 changed');
expect(audit.decision?.next_work_item === 'PR #383 Evidence Archive Maintenance Queue v3 Refresh', 'PR #382 audit handoff changed');
expect(contract.contract_id === 'sog_evidence_archive_review_history_v2_pr382', 'history v2 contract identity changed');
expect(manifest.manifest_id === 'sog_evidence_archive_review_history_manifest_v2_pr382', 'history v2 manifest identity changed');
expect(audit.audit_id === 'sog_evidence_archive_review_history_audit_v2_pr382_2026_07_16', 'history v2 audit identity changed');
expect(queue.review_history_contract_id === contract.contract_id, 'queue contract provenance mismatch');
expect(queue.review_history_manifest_id === manifest.manifest_id, 'queue manifest provenance mismatch');
expect(queue.review_history_audit_id === audit.audit_id, 'queue audit provenance mismatch');

expect(queue.canonical_evidence_count === config.expected.canonical_evidence_count, 'canonical Evidence count mismatch');
expect(queue.archive_index_count === config.expected.archive_recorded_count, 'archive-recorded count mismatch');
expect(queue.archive_not_recorded_count === config.expected.archive_not_recorded_count, 'archive-not-recorded count mismatch');
expect(checkpoint.expected_counts.evidence === queue.canonical_evidence_count, 'checkpoint Evidence count mismatch');
expect(checkpoint.evidence_quality.archive_index_count === queue.archive_index_count, 'checkpoint archive count mismatch');
expect(checkpoint.evidence_quality.archive_not_recorded_count === queue.archive_not_recorded_count, 'checkpoint not-recorded count mismatch');
expect(manifest.counts.history_source_count === config.expected.history_source_count, 'history source count changed');
expect(manifest.counts.history_event_count === config.expected.history_event_count, 'history event count changed');
expect(manifest.counts.reviewed_evidence_identity_count === config.expected.reviewed_identity_count, 'reviewed identity count changed');

const suppressedExpected = [...audit.reviewed_unresolved.suppressed_evidence_ids].sort();
const reactivatedExpected = [...config.expected.reviewed_reactivated_evidence_ids].sort();
expect(audit.reviewed_unresolved.suppressed_count === config.expected.reviewed_suppressed_count, 'history suppressed count changed');
expect(audit.reviewed_unresolved.reactivated_eligible_count === config.expected.reviewed_reactivated_eligible_count, 'history reactivated count changed');
expect(same([...audit.reviewed_unresolved.reactivated_eligible_evidence_ids].sort(), reactivatedExpected), 'history reactivated IDs changed');
expect(queue.reviewed_unresolved_suppressed_count === suppressedExpected.length, 'queue suppression count mismatch');
expect(queue.reactivated_reviewed_identity_count === reactivatedExpected.length, 'queue reactivated count mismatch');
expect(delta.exclusion_counts.reviewed_suppressed_without_signal === suppressedExpected.length, 'suppression exclusion count mismatch');
expect(same([...delta.reviewed_unresolved_suppressed_evidence_ids].sort(), suppressedExpected), 'delta suppressed IDs changed');
expect(same([...delta.exclusion_evidence_ids.reviewed_suppressed_without_signal].sort(), suppressedExpected), 'suppression exclusion details changed');
expect(same([...delta.reactivated_reviewed_evidence_ids].sort(), reactivatedExpected), 'delta reactivated IDs changed');

expect(queue.selected_count === config.expected.selected_count, 'selected count mismatch');
expect(queue.maximum_selected_count === config.selection.maximum_selected_count, 'maximum selected count changed');
expect(queue.selected_candidates.length === queue.selected_count, 'selected candidate array count mismatch');
expect(queue.selected_count <= queue.maximum_selected_count, 'queue exceeds maximum selected count');
expect(queue.eligible_pool_count >= queue.selected_count, 'eligible pool smaller than selected queue');
expect(queue.selected_reactivated_reviewed_identity_count === reactivatedExpected.length, 'reviewed reactivated identity was not selected');
expect(same([...queue.selected_reactivated_reviewed_evidence_ids].sort(), reactivatedExpected), 'selected reactivated IDs changed');
expect(same([...delta.selected_reactivated_reviewed_evidence_ids].sort(), reactivatedExpected), 'delta selected reactivated IDs changed');

const selectedIds = queue.selected_candidates.map((row) => row.evidence_id);
expect(new Set(selectedIds).size === selectedIds.length, 'selected Evidence IDs are not unique');
expect(selectedIds.every((id) => !suppressedExpected.includes(id)), 'selected queue contains a suppressed Evidence ID');
expect(reactivatedExpected.every((id) => selectedIds.includes(id)), 'selected queue omitted a reviewed reactivated Evidence ID');
expect(queue.selected_candidates.every((row) => row.review_status === 'pending_manual_review'), 'candidate review status changed');
expect(queue.selected_candidates.every((row) => row.canonical_change_authorized === false), 'candidate canonical change must remain unauthorized');
expect(queue.selected_candidates.every((row) => row.url && !row.url.startsWith('https://web.archive.org/')), 'selected queue contains an invalid source URL');
expect(queue.selected_candidates.filter((row) => row.reactivation_signal_present).length === reactivatedExpected.length, 'selected reactivation signal count mismatch');
for (const row of queue.selected_candidates.filter((candidate) => candidate.reactivation_signal_present)) {
  expect(row.selection_tier === 0, `${row.evidence_id}: reviewed reactivated selection tier changed`);
  expect(row.candidate_eligible_under_contract === true, `${row.evidence_id}: reviewed reactivated candidate is not eligible`);
  expect(row.reactivation_signal_type === 'reviewed_source_replacement', `${row.evidence_id}: reactivation signal type changed`);
}
for (let index = 1; index < queue.selected_candidates.length; index += 1) {
  const previous = queue.selected_candidates[index - 1];
  const current = queue.selected_candidates[index];
  const ordered = previous.selection_tier < current.selection_tier
    || (previous.selection_tier === current.selection_tier && previous.priority_rank < current.priority_rank)
    || (previous.selection_tier === current.selection_tier && previous.priority_rank === current.priority_rank && previous.evidence_id.localeCompare(current.evidence_id) <= 0);
  expect(ordered, `candidate order changed at ${previous.evidence_id} / ${current.evidence_id}`);
}

expect(delta.canonical_evidence_count === queue.canonical_evidence_count, 'queue/delta Evidence count mismatch');
expect(delta.archive_recorded_count === queue.archive_index_count, 'queue/delta archive count mismatch');
expect(delta.archive_not_recorded_count === queue.archive_not_recorded_count, 'queue/delta not-recorded count mismatch');
expect(delta.eligible_pool_count === queue.eligible_pool_count, 'queue/delta eligible pool mismatch');
expect(delta.selected_count === queue.selected_count, 'queue/delta selected count mismatch');
expect(same(delta.current_selected_evidence_ids, selectedIds), 'queue/delta selected IDs mismatch');
expect(queue.generation_digest_sha256 === delta.generation_digest_sha256, 'queue/delta generation digest mismatch');
expect(queue.source_digest_sha256 === delta.source_digest_sha256, 'queue/delta source digest mismatch');

expect(queue.selection_boundary.canonical_change_authorized === false, 'canonical change boundary changed');
expect(queue.selection_boundary.manual_review_required === true, 'manual review requirement changed');
expect(queue.selection_boundary.batch_4_authorized === false, 'Batch 4 authorization changed');
expect(queue.selection_boundary.review_gate_required === true, 'review gate requirement changed');
expect(queue.next_work_item === 'REVIEW GATE' && delta.next_work_item === 'REVIEW GATE', 'next work item must be review gate');
for (const key of ['canonical_data_change_allowed', 'public_surface_change_allowed', 'historical_queue_rewrite_allowed', 'ranking_allowed', 'automatic_promotion_allowed']) {
  expect(config.boundaries?.[key] === false, `config boundary changed: ${key}`);
}
for (const key of ['canonical_data_changed', 'public_surface_changed', 'historical_queue_rewritten', 'ranking_or_score', 'automatic_promotion']) {
  expect(delta.boundaries?.[key] === false, `delta boundary changed: ${key}`);
}

let originMainAvailable = false;
try {
  git('rev-parse', '--verify', 'origin/main');
  originMainAvailable = true;
} catch {}
if (originMainAvailable) {
  for (const file of [
    'docs/migration/current-canonical-checkpoint.json',
    'config/evidence-archive-review-history-v2-pr382.json',
    'docs/migration/evidence-archive-review-history-manifest-v2-pr382.json',
    'docs/migration/evidence-archive-review-history-audit-v2-pr382.json',
    'docs/migration/post-pr380-review-gate-pr381.json',
    'docs/migration/evidence-archive-maintenance-queue-v2-pr378.json',
    'docs/migration/evidence-archive-maintenance-queue-v2-pr378-delta.json',
    'docs/migration/evidence-archive-maintenance-outcomes-pr380.json'
  ]) {
    try {
      expect(git('hash-object', file) === git('rev-parse', `origin/main:${file}`), `${file}: immutable Git blob identity changed`);
    } catch (error) {
      failures.push(`${file}: unable to verify origin/main blob identity: ${error.message}`);
    }
  }
}

for (const [file, markers] of [
  ['AGENTS.md', ['PR #383 Evidence Archive Maintenance Queue v3 Refresh: active; complete on merge', 'reviewed reactivated eligible: 1', 'REVIEW GATE: mandatory after PR #383']],
  ['docs/roadmap.md', ['Status: canonical execution schedule — PR #383 active', 'start from 160 archive-not-recorded Evidence identities', 'stop at `REVIEW GATE`']],
  ['docs/quality/evidence-archive-maintenance-queue-v3-pr383-spec.md', ['include reviewed reactivated identities', 'select at most ten', 'stops at `REVIEW GATE`']],
  ['docs/roadmap-amendments/2026-07-16-pr383-evidence-archive-maintenance-queue-v3-activation.md', ['exclude aliases', 'sog_src_eurc_mint_page', 'stop at `REVIEW GATE`']]
]) {
  const value = readText(file);
  for (const marker of markers) expect(value.includes(marker), `${file}: missing authority marker ${marker}`);
}

for (const file of [
  'public/data/evidence-archive-maintenance-queue-v3-pr383.json',
  'public/data/evidence-archive-maintenance-queue-v3-pr383-delta.json',
  'src/pages/evidence-archive-maintenance-queue-v3.astro'
]) expect(!fs.existsSync(path.join(root, file)), `${file}: internal output leaked into public surface`);

if (failures.length) {
  console.error('PR #383 Evidence Archive Maintenance Queue v3 validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  queue_id: queue.queue_id,
  canonical_evidence: queue.canonical_evidence_count,
  archive_recorded: queue.archive_index_count,
  archive_not_recorded: queue.archive_not_recorded_count,
  reviewed_unresolved_suppressed: queue.reviewed_unresolved_suppressed_count,
  reviewed_reactivated_eligible: queue.reactivated_reviewed_identity_count,
  selected_reactivated: queue.selected_reactivated_reviewed_identity_count,
  eligible_pool: queue.eligible_pool_count,
  selected: queue.selected_count,
  selected_evidence_ids: selectedIds,
  next_work_item: queue.next_work_item
}, null, 2));