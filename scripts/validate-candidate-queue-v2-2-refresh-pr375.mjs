import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { buildCandidateQueueV22Outputs } from './build-candidate-queue-v2-2-refresh-pr375.mjs';

const root = process.cwd();
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const config = readJson('config/candidate-queue-v2-2-refresh-pr375.json');
const queue = readJson('docs/migration/tier-a-candidate-queue-v2-2-pr375.json');
const delta = readJson('docs/migration/tier-a-candidate-queue-v2-2-pr375-delta.json');
const sourceQueue = readJson('docs/migration/tier-a-candidate-queue-v2-1-pr372.json');
const baseline = readJson('docs/migration/record-depth-baseline-v2-1-pr372.json');
const contract = readJson('config/planning-queue-review-history-v1-pr374.json');
const manifest = readJson('docs/migration/planning-queue-review-history-manifest-pr374.json');
const audit = readJson('docs/migration/planning-queue-review-history-audit-pr374.json');
const generated = buildCandidateQueueV22Outputs();

expect(same(queue, generated.queue), 'committed v2.2 queue is not deterministic');
expect(same(delta, generated.delta), 'committed v2.2 delta is not deterministic');
expect(config.review_pr === 375 && queue.review_pr === 375 && delta.review_pr === 375, 'review PR identity changed');
expect(queue.schema_version === '2.2', 'queue schema version changed');
expect(queue.queue_id === 'sog_tier_a_candidate_queue_v2_2_pr375', 'queue ID changed');
expect(delta.delta_id === 'sog_tier_a_candidate_queue_v2_2_delta_pr375', 'delta ID changed');
expect(queue.status === 'reviewed_internal_non_ranking_history_aware_queue', 'queue status changed');
expect(queue.public_output === false && delta.public_output === false, 'outputs must remain internal');
expect(queue.asset_rank === false && queue.single_composite_score === false, 'queue must remain non-ranking');

expect(baseline.baseline_id === config.expected.source_baseline_id, 'source baseline identity changed');
expect(sourceQueue.queue_id === config.expected.source_queue_id, 'source queue identity changed');
expect(contract.contract_id === config.expected.review_history_contract_id, 'review-history contract identity changed');
expect(manifest.manifest_id === config.expected.review_history_manifest_id, 'review-history manifest identity changed');
expect(queue.source_baseline_id === baseline.baseline_id, 'queue source baseline mismatch');
expect(queue.source_queue_id === sourceQueue.queue_id, 'queue source queue mismatch');
expect(queue.review_history_contract_id === contract.contract_id, 'queue contract provenance mismatch');
expect(queue.review_history_manifest_id === manifest.manifest_id, 'queue manifest provenance mismatch');
expect(queue.review_history_audit_id === audit.audit_id, 'queue audit provenance mismatch');
expect(queue.queue_order === 'asset_slug_ascending_non_ranking', 'queue order changed');

expect(sourceQueue.candidate_count === config.expected.source_candidate_count, 'source candidate count changed');
expect(delta.source_candidate_count === config.expected.source_candidate_count, 'delta source candidate count mismatch');
expect(queue.suppressed_candidate_count === config.expected.suppressed_candidate_count, 'suppressed candidate count mismatch');
expect(delta.removed_candidate_count === config.expected.suppressed_candidate_count, 'removed candidate count mismatch');
expect(queue.reactivated_candidate_count === config.expected.reactivated_candidate_count, 'reactivated candidate count mismatch');
expect(delta.reactivated_candidate_count === config.expected.reactivated_candidate_count, 'delta reactivated count mismatch');
expect(queue.candidate_count === config.expected.output_candidate_count, 'output candidate count mismatch');
expect(delta.current_candidate_count === config.expected.output_candidate_count, 'delta current candidate count mismatch');
expect(queue.candidates.length === 0, 'v2.2 queue must contain no candidates');
expect(delta.retained_candidate_count === 0 && delta.added_candidate_count === 0, 'v2.2 queue cannot retain or add candidates');
expect(delta.retained_asset_slugs.length === 0 && delta.added_asset_slugs.length === 0 && delta.reactivated_asset_slugs.length === 0, 'v2.2 delta contains unexpected active slugs');
expect(same(delta.removed_asset_slugs, config.expected.suppressed_asset_slugs), 'removed asset slug list changed');
expect(delta.suppressed_candidates.length === config.expected.suppressed_candidate_count, 'suppressed candidate detail count mismatch');

for (const row of delta.suppressed_candidates) {
  expect(config.expected.suppressed_asset_slugs.includes(row.asset_slug), `${row.asset_slug}: unexpected suppressed asset`);
  expect(row.suppression_reason === 'suppressed_all_material_gaps_reviewed', `${row.asset_slug}: suppression reason changed`);
  expect(row.reactivation_signal_present === false, `${row.asset_slug}: unexpected reactivation signal`);
  expect(same(row.latest_review_outcomes, ['reviewed_no_safe_change']), `${row.asset_slug}: latest review outcome changed`);
  expect(row.dimension_eligibility.length === row.source_material_dossier_gaps.length, `${row.asset_slug}: dimension explanation count mismatch`);
  expect(row.dimension_eligibility.every((cell) => cell.review_history_found === true), `${row.asset_slug}: missing review history`);
  expect(row.dimension_eligibility.every((cell) => cell.effective_review_outcome === 'reviewed_no_safe_change'), `${row.asset_slug}: effective outcome changed`);
  expect(row.dimension_eligibility.every((cell) => cell.eligibility_state === 'suppressed_reviewed_no_safe_change'), `${row.asset_slug}: eligibility state changed`);
  expect(row.dimension_eligibility.every((cell) => cell.reactivation_signal_present === false), `${row.asset_slug}: dimension reactivation signal changed`);
}

expect(delta.review_history_summary.history_source_count === 5, 'history source count changed');
expect(delta.review_history_summary.history_event_count === 48, 'history event count changed');
expect(delta.review_history_summary.reviewed_asset_count === 18, 'reviewed asset count changed');
expect(delta.review_history_summary.effective_asset_dimension_count === 33, 'effective dimension count changed');
expect(delta.review_history_summary.automatic_time_expiry === false, 'automatic time expiry changed');
expect(same(delta.review_history_summary.accepted_reactivation_triggers, ['reviewed_new_source', 'reviewed_semantics_change']), 'reactivation triggers changed');

expect(queue.selection_boundary.canonical_promotion_authorized === false, 'canonical promotion boundary changed');
expect(queue.selection_boundary.manual_review_required === true, 'manual review requirement changed');
expect(queue.selection_boundary.next_dossier_batch_authorized === false, 'dossier authorization changed');
expect(queue.selection_boundary.review_gate_required === true, 'review gate requirement changed');
expect(queue.next_work_item === 'REVIEW GATE' && delta.next_work_item === 'REVIEW GATE', 'next work item must be review gate');
expect(queue.generation_digest_sha256 === delta.generation_digest_sha256, 'queue/delta generation digest mismatch');
expect(queue.source_digest_sha256 === delta.source_digest_sha256, 'queue/delta source digest mismatch');

for (const key of ['baseline_recompute_allowed', 'canonical_data_change_allowed', 'public_surface_change_allowed', 'historical_queue_rewrite_allowed', 'automatic_source_promotion_allowed', 'automatic_canonical_promotion_allowed', 'asset_rank', 'single_composite_score', 'investment_recommendation']) {
  expect(config.boundaries?.[key] === false, `config boundary changed: ${key}`);
}
for (const key of ['baseline_recomputed', 'canonical_data_changed', 'public_surface_changed', 'historical_queue_rewritten', 'ranking_or_score', 'automatic_promotion']) {
  expect(delta.boundaries?.[key] === false, `delta boundary changed: ${key}`);
}

for (const file of [
  'docs/migration/record-depth-baseline-v2-1-pr372.json',
  'docs/migration/record-depth-baseline-v2-1-pr372-summary.json',
  'docs/migration/record-depth-baseline-v2-1-pr372-delta.json',
  'docs/migration/tier-a-candidate-queue-v2-1-pr372.json',
  'docs/migration/post-pr372-review-gate-pr373.json',
  'config/planning-queue-review-history-v1-pr374.json',
  'docs/migration/planning-queue-review-history-manifest-pr374.json',
  'docs/migration/planning-queue-review-history-audit-pr374.json',
  'docs/migration/current-canonical-checkpoint.json'
]) {
  try {
    expect(git('hash-object', file) === git('rev-parse', `origin/main:${file}`), `${file}: immutable Git blob identity changed`);
  } catch (error) {
    failures.push(`${file}: unable to verify origin/main blob identity: ${error.message}`);
  }
}

for (const [file, markers] of [
  ['AGENTS.md', ['PR #375 Candidate Queue v2.2 Refresh: active; complete on merge', 'output candidates: 0', 'REVIEW GATE: next and mandatory']],
  ['docs/roadmap.md', ['Status: canonical execution schedule — PR #375 active', 'suppressed candidates: 3', 'next work item is `REVIEW GATE`']],
  ['docs/quality/candidate-queue-v2-2-refresh-pr375-spec.md', ['source candidates: 3', 'output candidates: 0', 'next work item is `REVIEW GATE`']],
  ['docs/roadmap-amendments/2026-07-15-pr375-candidate-queue-v2-2-refresh-activation.md', ['suppressed candidates: 3', 'output candidates: 0', 'stop at `REVIEW GATE`']]
]) {
  const text = readText(file);
  for (const marker of markers) expect(text.includes(marker), `${file}: missing authority marker ${marker}`);
}

for (const file of [
  'public/data/tier-a-candidate-queue-v2-2-pr375.json',
  'public/data/tier-a-candidate-queue-v2-2-pr375-delta.json',
  'src/pages/candidate-queue-v2-2.astro'
]) expect(!fs.existsSync(path.join(root, file)), `${file}: internal output leaked into public surface`);

if (failures.length) {
  console.error('PR #375 Candidate Queue v2.2 Refresh validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  queue_id: queue.queue_id,
  source_candidates: delta.source_candidate_count,
  suppressed_candidates: queue.suppressed_candidate_count,
  reactivated_candidates: queue.reactivated_candidate_count,
  current_candidates: queue.candidate_count,
  removed_asset_slugs: delta.removed_asset_slugs,
  next_work_item: queue.next_work_item
}, null, 2));
