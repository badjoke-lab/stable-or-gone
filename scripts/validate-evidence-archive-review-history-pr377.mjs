import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { buildEvidenceArchiveReviewHistoryOutputs } from './build-evidence-archive-review-history-pr377.mjs';

const root = process.cwd();
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const contract = readJson('config/evidence-archive-review-history-v1-pr377.json');
const manifest = readJson('docs/migration/evidence-archive-review-history-manifest-pr377.json');
const audit = readJson('docs/migration/evidence-archive-review-history-audit-pr377.json');
const generated = buildEvidenceArchiveReviewHistoryOutputs();

expect(same(manifest, generated.manifest), 'committed archive review-history manifest is not deterministic');
expect(same(audit, generated.audit), 'committed archive review-history audit is not deterministic');
expect(contract.review_pr === 377 && manifest.review_pr === 377 && audit.review_pr === 377, 'review PR identity changed');
expect(manifest.status === 'reviewed_internal_complete_archive_review_history_manifest', 'manifest status changed');
expect(audit.status === 'reviewed_complete', 'audit status changed');
expect(manifest.public_output === false && audit.public_output === false, 'archive review-history outputs must remain internal');
expect(manifest.contract_id === contract.contract_id && audit.contract_id === contract.contract_id, 'contract identity mismatch');
expect(manifest.manifest_digest_sha256 === audit.manifest_digest_sha256, 'manifest/audit digest mismatch');
expect(manifest.source_digest_sha256 === audit.source_digest_sha256, 'source digest mismatch');

const counts = manifest.counts;
expect(counts.history_source_count === contract.expected.history_source_count, 'history source count mismatch');
expect(counts.history_event_count === contract.expected.history_event_count, 'history event count mismatch');
expect(counts.reviewed_evidence_identity_count === contract.expected.reviewed_evidence_identity_count, 'reviewed Evidence identity count mismatch');
expect(counts.effective_archive_present_count === contract.expected.effective_archive_present_count, 'archive-present count mismatch');
expect(counts.effective_archive_removed_invalid_count === contract.expected.effective_archive_removed_invalid_count, 'invalid-removal count mismatch');
expect(counts.effective_no_safe_change_count === contract.expected.effective_no_safe_change_count, 'no-safe-change count mismatch');
expect(counts.current_reviewed_unresolved_archive_gap_count === contract.expected.current_reviewed_unresolved_archive_gap_count, 'reviewed unresolved count mismatch');
expect(manifest.sources.length === counts.history_source_count, 'source array count mismatch');
expect(manifest.history_events.length === counts.history_event_count, 'history event array count mismatch');
expect(manifest.effective_evidence_identities.length === counts.reviewed_evidence_identity_count, 'effective identity array count mismatch');
expect(new Set(manifest.history_events.map((row) => row.event_id)).size === manifest.history_events.length, 'history event IDs are not unique');
expect(new Set(manifest.effective_evidence_identities.map((row) => row.evidence_id)).size === manifest.effective_evidence_identities.length, 'effective Evidence IDs are not unique');

const allowedOutcomes = new Set(contract.review_outcomes);
const allowedStates = new Set(contract.eligibility_states);
for (const event of manifest.history_events) {
  expect(allowedOutcomes.has(event.review_outcome), `${event.event_id}: invalid review outcome`);
  expect(event.automatic_time_expiry === false, `${event.event_id}: automatic expiry changed`);
}
for (const row of manifest.effective_evidence_identities) {
  expect(allowedOutcomes.has(row.effective_review_outcome), `${row.evidence_id}: invalid effective outcome`);
  expect(allowedStates.has(row.eligibility_state_without_signal), `${row.evidence_id}: invalid eligibility state`);
  expect(row.automatic_time_expiry === false, `${row.evidence_id}: automatic expiry changed`);
  if (row.current_archived_url) {
    expect(row.eligibility_state_without_signal === 'not_eligible_archive_present', `${row.evidence_id}: archive-present identity must be ineligible`);
    expect(row.reactivation_required === false, `${row.evidence_id}: archive-present identity cannot require reactivation`);
  } else {
    expect(row.eligibility_state_without_signal.startsWith('suppressed_'), `${row.evidence_id}: reviewed unresolved identity must be suppressed`);
    expect(row.reactivation_required === true, `${row.evidence_id}: reviewed unresolved identity must require reactivation`);
    expect(row.reactivation_signal_present === false, `${row.evidence_id}: unexpected reactivation signal`);
  }
}

expect(contract.history_resolution.effective_rule === 'latest_review_event_wins', 'history resolution rule changed');
expect(contract.suppression_policy.automatic_time_expiry === false, 'automatic time expiry changed');
expect(contract.suppression_policy.queue_presence_is_reactivation_signal === false, 'queue presence cannot reactivate');
expect(contract.suppression_policy.http_status_change_alone_is_reactivation_signal === false, 'HTTP movement cannot reactivate');
expect(contract.suppression_policy.unreviewed_wayback_result_is_reactivation_signal === false, 'unreviewed Wayback result cannot reactivate');
expect(contract.suppression_policy.unreviewed_source_url_change_is_reactivation_signal === false, 'unreviewed URL change cannot reactivate');
expect(same(contract.reactivation_policy.accepted_triggers, ['reviewed_exact_capture', 'reviewed_source_replacement']), 'accepted reactivation triggers changed');
expect(contract.reactivation_policy.missing_signal_default === 'suppressed', 'missing-signal default changed');
expect(contract.candidate_policy.maximum_selected_count === 10, 'bounded selected count changed');
expect(contract.candidate_policy.asset_rank === false && contract.candidate_policy.evidence_rank === false && contract.candidate_policy.single_composite_score === false, 'contract must remain non-ranking');

const unresolved = audit.reviewed_unresolved_archive_gaps;
expect(unresolved.count === contract.expected.current_reviewed_unresolved_archive_gap_count, 'audit unresolved count mismatch');
expect(same(unresolved.evidence_ids, [...contract.expected.current_reviewed_unresolved_evidence_ids].sort()), 'reviewed unresolved Evidence IDs changed');
expect(unresolved.rows.length === unresolved.count, 'reviewed unresolved row count mismatch');
expect(unresolved.rows.every((row) => row.current_archived_url == null), 'reviewed unresolved row has an archive');
expect(unresolved.rows.filter((row) => row.effective_review_outcome === 'reviewed_archive_removed_invalid').length === 1, 'invalid-removal unresolved count changed');
expect(unresolved.rows.filter((row) => row.effective_review_outcome === 'reviewed_no_safe_change').length === 9, 'no-safe unresolved count changed');
expect(audit.source_checkpoint.canonical_evidence_count === 559, 'canonical Evidence checkpoint changed');
expect(audit.source_checkpoint.archive_recorded === 390, 'archive recorded checkpoint changed');
expect(audit.source_checkpoint.archive_not_recorded === 169, 'archive not-recorded checkpoint changed');

expect(audit.decision.contract_complete === true, 'contract completion decision changed');
expect(audit.decision.approved_manifest === 'docs/migration/evidence-archive-review-history-manifest-pr377.json', 'approved manifest path changed');
expect(audit.decision.next_work_item === 'PR #378 Evidence Archive Maintenance Queue v2 Refresh', 'next work item changed');
expect(audit.decision.archive_queue_generation_allowed_in_pr377 === false, 'PR #377 must not generate a queue');
expect(audit.decision.canonical_data_change_allowed === false, 'canonical boundary changed');
expect(audit.decision.public_surface_change_allowed === false, 'public boundary changed');
expect(audit.decision.review_gate_after_pr378 === true, 'PR #378 must end at review gate');

for (const key of ['canonical_data_change_allowed', 'public_surface_change_allowed', 'archive_queue_generation_allowed', 'historical_outcome_rewrite_allowed', 'automatic_capture_promotion_allowed', 'automatic_source_replacement_allowed']) {
  expect(contract.boundaries?.[key] === false, `contract boundary changed: ${key}`);
}
for (const key of ['canonical_data_changed', 'public_surface_changed', 'archive_queue_generated', 'historical_outcomes_rewritten', 'ranking_or_score', 'automatic_promotion']) {
  expect(audit.boundaries?.[key] === false, `audit boundary changed: ${key}`);
}

for (const file of [
  'docs/migration/evidence-correction-outcomes-pr360.json',
  'docs/migration/evidence-archive-maintenance-outcomes-pr365.json',
  'docs/migration/evidence-archive-maintenance-batch-2-pr365-reviewed-handoff.json',
  'docs/migration/current-canonical-checkpoint.json',
  'docs/migration/post-pr375-review-gate-pr376.json'
]) {
  try {
    expect(git('hash-object', file) === git('rev-parse', `origin/main:${file}`), `${file}: immutable Git blob identity changed`);
  } catch (error) {
    failures.push(`${file}: unable to verify origin/main blob identity: ${error.message}`);
  }
}

for (const [file, markers] of [
  ['AGENTS.md', ['PR #377 Evidence Archive Review-History Contract Audit: active; complete on merge', 'history events: 20', 'currently reviewed unresolved archive gaps: 10']],
  ['docs/roadmap.md', ['Status: canonical execution schedule — PR #377 active', 'invalid archive removed: 1', 'currently reviewed unresolved archive gaps: 10']],
  ['docs/quality/evidence-archive-review-history-contract-pr377-spec.md', ['There is no automatic time expiry', 'reviewed_exact_capture', 'currently reviewed unresolved archive gaps: 10']],
  ['docs/roadmap-amendments/2026-07-15-pr377-evidence-archive-review-history-contract-activation.md', ['history events: 20', 'prohibit automatic time expiry', 'currently reviewed unresolved archive gaps: 10']]
]) {
  const text = readText(file);
  for (const marker of markers) expect(text.includes(marker), `${file}: missing authority marker ${marker}`);
}

for (const file of [
  'public/data/evidence-archive-review-history-manifest-pr377.json',
  'public/data/evidence-archive-review-history-audit-pr377.json',
  'src/pages/evidence-archive-review-history.astro'
]) expect(!fs.existsSync(path.join(root, file)), `${file}: internal output leaked into public surface`);

if (failures.length) {
  console.error('PR #377 Evidence Archive Review-History validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  manifest_id: manifest.manifest_id,
  history_sources: counts.history_source_count,
  history_events: counts.history_event_count,
  reviewed_evidence_identities: counts.reviewed_evidence_identity_count,
  effective_outcomes: {
    archive_present: counts.effective_archive_present_count,
    archive_removed_invalid: counts.effective_archive_removed_invalid_count,
    no_safe_change: counts.effective_no_safe_change_count
  },
  reviewed_unresolved_archive_gaps: unresolved.count,
  next_work_item: audit.decision.next_work_item
}, null, 2));
