import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { buildPlanningQueueReviewHistoryOutputs } from './build-planning-queue-review-history-pr374.mjs';

const root = process.cwd();
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const contract = readJson('config/planning-queue-review-history-v1-pr374.json');
const manifest = readJson('docs/migration/planning-queue-review-history-manifest-pr374.json');
const audit = readJson('docs/migration/planning-queue-review-history-audit-pr374.json');
const generated = buildPlanningQueueReviewHistoryOutputs();

expect(same(manifest, generated.manifest), 'committed review-history manifest is not deterministic');
expect(same(audit, generated.audit), 'committed review-history audit is not deterministic');
expect(contract.review_pr === 374 && manifest.review_pr === 374 && audit.review_pr === 374, 'review PR identity changed');
expect(manifest.status === 'reviewed_internal_complete_review_history_manifest', 'manifest status changed');
expect(audit.status === 'reviewed_complete', 'audit status changed');
expect(manifest.public_output === false && audit.public_output === false, 'review-history outputs must remain internal');
expect(manifest.contract_id === contract.contract_id && audit.contract_id === contract.contract_id, 'contract identity mismatch');
expect(manifest.manifest_digest_sha256 === audit.manifest_digest_sha256, 'manifest/audit digest mismatch');
expect(manifest.source_digest_sha256 === audit.source_digest_sha256, 'source digest mismatch');

const counts = manifest.counts;
expect(counts.history_source_count === contract.expected.history_source_count, 'history source count mismatch');
expect(counts.history_event_count === contract.expected.history_event_count, 'history event count mismatch');
expect(counts.reviewed_asset_count === contract.expected.reviewed_asset_count, 'reviewed asset count mismatch');
expect(counts.effective_asset_dimension_count === contract.expected.effective_asset_dimension_count, 'effective asset-dimension count mismatch');
expect(counts.effective_reviewed_complete_count === contract.expected.effective_reviewed_complete_count, 'effective complete count mismatch');
expect(counts.effective_reviewed_partial_count === contract.expected.effective_reviewed_partial_count, 'effective partial count mismatch');
expect(counts.effective_reviewed_no_safe_change_count === contract.expected.effective_reviewed_no_safe_change_count, 'effective no-safe-change count mismatch');
expect(manifest.sources.length === counts.history_source_count, 'source array count mismatch');
expect(manifest.history_events.length === counts.history_event_count, 'history event array count mismatch');
expect(manifest.reviewed_asset_slugs.length === counts.reviewed_asset_count, 'reviewed asset slug count mismatch');
expect(manifest.effective_asset_dimensions.length === counts.effective_asset_dimension_count, 'effective row count mismatch');
expect(new Set(manifest.history_events.map((row) => row.event_id)).size === manifest.history_events.length, 'history event IDs are not unique');
expect(new Set(manifest.effective_asset_dimensions.map((row) => `${row.asset_id}:${row.dimension_id}`)).size === manifest.effective_asset_dimensions.length, 'effective asset-dimension keys are not unique');
expect(same(manifest.reviewed_asset_slugs, [...manifest.reviewed_asset_slugs].sort()), 'reviewed asset slugs are not sorted');

const allowedOutcomes = new Set(contract.review_outcomes);
const allowedStates = new Set(contract.eligibility_states);
for (const event of manifest.history_events) {
  expect(allowedOutcomes.has(event.review_outcome), `${event.event_id}: invalid review outcome`);
  expect(event.automatic_time_expiry === false, `${event.event_id}: time expiry must be false`);
}
for (const row of manifest.effective_asset_dimensions) {
  expect(allowedOutcomes.has(row.effective_review_outcome), `${row.asset_slug}:${row.dimension_id}: invalid effective outcome`);
  expect(allowedStates.has(row.eligibility_state_without_new_signal), `${row.asset_slug}:${row.dimension_id}: invalid eligibility state`);
  expect(row.eligibility_state_without_new_signal.startsWith('suppressed_'), `${row.asset_slug}:${row.dimension_id}: reviewed outcome must be suppressed without a signal`);
  expect(row.automatic_time_expiry === false, `${row.asset_slug}:${row.dimension_id}: automatic expiry changed`);
  expect(row.reactivation_required === true, `${row.asset_slug}:${row.dimension_id}: reactivation requirement changed`);
}

expect(contract.history_resolution.effective_rule === 'latest_review_event_wins', 'history resolution rule changed');
expect(contract.suppression_policy.automatic_time_expiry === false, 'automatic time expiry changed');
expect(contract.suppression_policy.queue_presence_is_new_source_signal === false, 'queue presence cannot be a source signal');
expect(contract.suppression_policy.planning_state_change_alone_is_new_source_signal === false, 'planning-state movement cannot be a source signal');
expect(contract.suppression_policy.maintenance_gap_can_reactivate_material_dossier_gap === false, 'maintenance gaps cannot reactivate dossier gaps');
expect(same(contract.reactivation_policy.accepted_triggers, ['reviewed_new_source', 'reviewed_semantics_change']), 'accepted reactivation triggers changed');
expect(contract.reactivation_policy.missing_signal_default === 'suppressed', 'missing-signal default changed');
expect(contract.candidate_policy.asset_rank === false && contract.candidate_policy.single_composite_score === false, 'queue contract must remain non-ranking');
expect(contract.candidate_policy.exclude_if_all_material_gaps_are_suppressed === true, 'full-suppression exclusion changed');

const queueAudit = audit.current_queue_audit;
expect(queueAudit.source_candidate_count === contract.expected.current_queue_candidate_count, 'source queue candidate count mismatch');
expect(queueAudit.reactivation_signal_count === 0, 'unexpected reactivation signal');
expect(queueAudit.candidates.length === queueAudit.source_candidate_count, 'queue audit candidate array mismatch');
expect(queueAudit.fully_suppressed_candidate_count === contract.expected.current_queue_fully_suppressed_count, 'fully suppressed candidate count mismatch');
expect(queueAudit.projected_v2_2_candidate_count === contract.expected.projected_v2_2_candidate_count_without_new_signals, 'projected v2.2 count mismatch');
expect(queueAudit.projected_v2_2_candidate_slugs.length === 0, 'projected v2.2 queue must be empty without new signals');
expect(same(queueAudit.candidates.map((row) => row.asset_slug), ['audd', 'nzds', 'poundtoken']), 'queue audit slugs changed');
for (const candidate of queueAudit.candidates) {
  expect(candidate.projected_candidate_state === 'suppressed_all_material_gaps_reviewed', `${candidate.asset_slug}: projected state changed`);
  expect(candidate.projected_v2_2_eligible === false, `${candidate.asset_slug}: candidate must be excluded`);
  expect(candidate.eligible_dimension_count === 0, `${candidate.asset_slug}: unexpected eligible dimension`);
  expect(candidate.suppressed_dimension_count === candidate.material_dossier_gaps.length, `${candidate.asset_slug}: not all material gaps are suppressed`);
  expect(candidate.dimension_eligibility.every((row) => row.effective_review_outcome === 'reviewed_no_safe_change'), `${candidate.asset_slug}: queue dimensions must resolve to no-safe-change`);
  expect(candidate.dimension_eligibility.every((row) => row.reactivation_signal_present === false), `${candidate.asset_slug}: unexpected reactivation signal`);
}

expect(audit.decision.contract_complete === true, 'contract completion decision changed');
expect(audit.decision.approved_manifest === 'docs/migration/planning-queue-review-history-manifest-pr374.json', 'approved manifest path changed');
expect(audit.decision.next_work_item === 'PR #375 Candidate Queue v2.2 Refresh', 'next work item changed');
expect(audit.decision.baseline_recompute_allowed_in_pr374 === false, 'PR #374 must not recompute baseline');
expect(audit.decision.canonical_data_change_allowed === false, 'canonical boundary changed');
expect(audit.decision.public_surface_change_allowed === false, 'public boundary changed');
expect(audit.decision.review_gate_after_pr375 === true, 'PR #375 must end at review gate');

for (const key of ['canonical_data_change_allowed', 'public_surface_change_allowed', 'baseline_recompute_allowed', 'historical_queue_rewrite_allowed', 'automatic_source_promotion_allowed', 'automatic_canonical_promotion_allowed']) {
  expect(contract.boundaries?.[key] === false, `contract boundary changed: ${key}`);
}
for (const key of ['canonical_data_changed', 'public_surface_changed', 'baseline_recomputed', 'historical_queue_rewritten', 'ranking_or_score', 'automatic_promotion']) {
  expect(audit.boundaries?.[key] === false, `audit boundary changed: ${key}`);
}

for (const file of [
  'config/tier-a-dossier-batch-1-pr354.json',
  'docs/migration/tier-a-batch-1-pr354-reviewed-handoff.json',
  'config/tier-a-dossier-batch-2-pr355.json',
  'docs/migration/tier-a-batch-2-pr355-reviewed-handoff.json',
  'docs/migration/tier-a-batch-3-pr357-review-outcomes.json',
  'docs/migration/tier-a-dossier-batch-4-pr364-findings.json',
  'docs/migration/tier-a-batch-4-pr364-reviewed-handoff.json',
  'docs/migration/tier-a-batch-5-pr369-review-outcomes.json',
  'docs/migration/tier-a-candidate-queue-v2-1-pr372.json',
  'docs/migration/post-pr372-review-gate-pr373.json',
  'docs/migration/record-depth-baseline-v2-1-pr372.json'
]) {
  try {
    expect(git('hash-object', file) === git('rev-parse', `origin/main:${file}`), `${file}: immutable Git blob identity changed`);
  } catch (error) {
    failures.push(`${file}: unable to verify origin/main blob identity: ${error.message}`);
  }
}

for (const [file, markers] of [
  ['AGENTS.md', ['PR #374 Planning Queue Review-History Contract Audit: active; complete on merge', 'history events: 48', 'projected v2.2 queue without new signals: 0']],
  ['docs/roadmap.md', ['Status: canonical execution schedule — PR #374 active', 'effective asset-dimension outcomes: 33', 'projected v2.2 candidates: 0']],
  ['docs/quality/planning-queue-review-history-contract-pr374-spec.md', ['There is no automatic time expiry', 'reviewed_new_source', 'projected v2.2 candidates without new signals: 0']],
  ['docs/roadmap-amendments/2026-07-15-pr374-planning-queue-review-history-contract-activation.md', ['history events: 48', 'prohibit automatic time expiry', 'projecting a zero-candidate v2.2 queue']]
]) {
  const text = readText(file);
  for (const marker of markers) expect(text.includes(marker), `${file}: missing authority marker ${marker}`);
}

for (const file of [
  'public/data/planning-queue-review-history-manifest-pr374.json',
  'public/data/planning-queue-review-history-audit-pr374.json',
  'src/pages/planning-queue-review-history.astro'
]) expect(!fs.existsSync(path.join(root, file)), `${file}: internal output leaked into public surface`);

if (failures.length) {
  console.error('PR #374 Planning Queue Review-History Contract validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  manifest_id: manifest.manifest_id,
  history_sources: counts.history_source_count,
  history_events: counts.history_event_count,
  reviewed_assets: counts.reviewed_asset_count,
  effective_asset_dimensions: counts.effective_asset_dimension_count,
  effective_outcomes: {
    complete: counts.effective_reviewed_complete_count,
    partial: counts.effective_reviewed_partial_count,
    no_safe_change: counts.effective_reviewed_no_safe_change_count
  },
  current_queue_candidates: queueAudit.source_candidate_count,
  fully_suppressed_candidates: queueAudit.fully_suppressed_candidate_count,
  projected_v2_2_candidates: queueAudit.projected_v2_2_candidate_count,
  next_work_item: audit.decision.next_work_item
}, null, 2));
