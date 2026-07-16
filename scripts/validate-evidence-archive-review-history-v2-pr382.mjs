import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { isDeepStrictEqual } from 'node:util';
import { buildEvidenceArchiveReviewHistoryV2Outputs } from './build-evidence-archive-review-history-v2-pr382.mjs';

const root = process.cwd();
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const failures = [];
const expect = (value, message) => { if (!value) failures.push(message); };
const same = (left, right) => isDeepStrictEqual(left, right);

const contract = readJson('config/evidence-archive-review-history-v2-pr382.json');
const manifest = readJson('docs/migration/evidence-archive-review-history-manifest-v2-pr382.json');
const audit = readJson('docs/migration/evidence-archive-review-history-audit-v2-pr382.json');
const authority = readJson('docs/migration/post-pr380-review-gate-pr381.json');
const generated = buildEvidenceArchiveReviewHistoryV2Outputs();

expect(same(manifest, generated.manifest), 'committed history v2 manifest is not deterministic');
expect(same(audit, generated.audit), 'committed history v2 audit is not deterministic');
expect(contract.review_pr === 382 && manifest.review_pr === 382 && audit.review_pr === 382, 'review PR identity changed');
expect(manifest.status === 'reviewed_internal_complete_archive_review_history_manifest', 'manifest status changed');
expect(audit.status === 'reviewed_complete', 'audit status changed');
expect(manifest.public_output === false && audit.public_output === false, 'history v2 outputs must remain internal');
expect(manifest.contract_id === contract.contract_id && audit.contract_id === contract.contract_id, 'contract binding changed');
expect(manifest.prior_manifest_id === 'sog_evidence_archive_review_history_manifest_pr377_v1', 'prior manifest binding changed');
expect(audit.prior_audit_id === 'sog_evidence_archive_review_history_audit_pr377_2026_07_15', 'prior audit binding changed');

const counts = manifest.counts;
expect(counts.history_source_count === 3, 'history source count changed');
expect(counts.history_event_count === 30, 'history event count changed');
expect(counts.reviewed_evidence_identity_count === 30, 'reviewed identity count changed');
expect(counts.effective_archive_present_count === 19, 'archive-present count changed');
expect(counts.effective_archive_removed_invalid_count === 1, 'invalid-removal count changed');
expect(counts.effective_no_safe_change_count === 9, 'no-safe count changed');
expect(counts.effective_source_replacement_count === 1, 'source-replacement count changed');
expect(counts.current_archive_not_recorded_count === 160, 'current archive-not-recorded count changed');
expect(counts.current_reviewed_unresolved_total_count === 11, 'reviewed unresolved total changed');
expect(counts.current_reviewed_suppressed_count === 10, 'reviewed suppression count changed');
expect(counts.current_reviewed_reactivated_eligible_count === 1, 'reviewed reactivated count changed');

expect(manifest.sources.length === 3, 'source list count changed');
expect(manifest.sources.map((row) => row.review_pr).join(',') === '360,365,380', 'history source order changed');
expect(manifest.sources.every((row) => /^[a-f0-9]{64}$/.test(row.content_sha256)), 'source content digest missing');
expect(manifest.history_events.length === 30, 'history event list count changed');
expect(new Set(manifest.history_events.map((row) => row.event_id)).size === 30, 'history event IDs are not unique');
expect(new Set(manifest.effective_evidence_identities.map((row) => row.evidence_id)).size === 30, 'effective Evidence IDs are not unique');

const eventsByPr = manifest.history_events.reduce((acc, row) => ({ ...acc, [row.review_pr]: (acc[row.review_pr] ?? 0) + 1 }), {});
expect(eventsByPr[360] === 10 && eventsByPr[365] === 10 && eventsByPr[380] === 10, 'per-source event counts changed');
const pr380Events = manifest.history_events.filter((row) => row.review_pr === 380);
expect(pr380Events.filter((row) => row.review_outcome === 'reviewed_archive_present').length === 9, 'PR #380 archive-present events changed');
expect(pr380Events.filter((row) => row.review_outcome === 'reviewed_source_replacement').length === 1, 'PR #380 source-replacement events changed');
expect(pr380Events.find((row) => row.review_outcome === 'reviewed_source_replacement')?.evidence_id === 'sog_src_eurc_mint_page', 'Circle Mint history event changed');

const effectiveById = new Map(manifest.effective_evidence_identities.map((row) => [row.evidence_id, row]));
const circleMint = effectiveById.get('sog_src_eurc_mint_page');
expect(circleMint?.current_url === 'https://www.circle.com/circle-mint', 'Circle Mint current URL changed');
expect(circleMint?.current_archived_url === null, 'Circle Mint must remain archive-not-recorded');
expect(circleMint?.effective_review_outcome === 'reviewed_source_replacement', 'Circle Mint effective outcome changed');
expect(circleMint?.eligibility_state_without_new_signal === 'reactivated_reviewed_source_replacement', 'Circle Mint eligibility state changed');
expect(circleMint?.candidate_eligible_under_contract === true, 'Circle Mint candidate eligibility changed');
expect(circleMint?.reactivation_signal_present === true, 'Circle Mint reviewed signal missing');
expect(circleMint?.reactivation_signal_type === 'reviewed_source_replacement', 'Circle Mint reviewed signal type changed');
expect(circleMint?.automatic_time_expiry === false, 'Circle Mint automatic expiry changed');

const unresolved = audit.reviewed_unresolved;
expect(unresolved.total_count === 11, 'audit unresolved total changed');
expect(unresolved.suppressed_count === 10, 'audit suppressed count changed');
expect(unresolved.reactivated_eligible_count === 1, 'audit reactivated count changed');
expect(JSON.stringify(unresolved.suppressed_evidence_ids) === JSON.stringify(contract.expected.current_reviewed_suppressed_evidence_ids), 'suppressed Evidence identity set changed');
expect(JSON.stringify(unresolved.reactivated_eligible_evidence_ids) === JSON.stringify(['sog_src_eurc_mint_page']), 'reactivated Evidence identity set changed');
expect(unresolved.rows.length === 11, 'audit unresolved row count changed');
expect(unresolved.rows.filter((row) => row.eligibility_state_without_new_signal.startsWith('suppressed_')).length === 10, 'audit suppressed row distribution changed');
expect(unresolved.rows.filter((row) => row.eligibility_state_without_new_signal.startsWith('reactivated_')).length === 1, 'audit reactivated row distribution changed');

expect(audit.source_checkpoint.canonical_evidence_count === 559, 'audit Evidence checkpoint changed');
expect(audit.source_checkpoint.evidence_relation_count === 559, 'audit Evidence Relation checkpoint changed');
expect(audit.source_checkpoint.archive_recorded === 399, 'audit archive-recorded checkpoint changed');
expect(audit.source_checkpoint.archive_not_recorded === 160, 'audit archive-not-recorded checkpoint changed');
expect(audit.decision.contract_complete === true, 'contract-complete decision changed');
expect(audit.decision.next_work_item === 'PR #383 Evidence Archive Maintenance Queue v3 Refresh', 'next work item changed');
expect(audit.decision.archive_queue_generation_allowed_in_pr382 === false, 'PR #382 queue boundary changed');
expect(audit.decision.canonical_data_change_allowed === false, 'PR #382 canonical boundary changed');
expect(audit.decision.public_surface_change_allowed === false, 'PR #382 public boundary changed');
expect(audit.decision.review_gate_after_pr383 === true, 'post-PR #383 review gate changed');
expect(authority.decisions.evidence_archive_review_history_contract_v2.pr === 382, 'source authority PR changed');
expect(authority.decisions.evidence_archive_maintenance_queue_v3.pr === 383, 'source authority queue PR changed');

for (const key of ['canonical_data_changed', 'public_surface_changed', 'archive_queue_generated', 'historical_outcomes_rewritten', 'ranking_or_score', 'automatic_promotion']) {
  expect(audit.boundaries[key] === false, `audit boundary changed: ${key}`);
}
for (const key of ['canonical_data_change_allowed', 'public_surface_change_allowed', 'archive_queue_generation_allowed', 'historical_outcome_rewrite_allowed', 'automatic_capture_promotion_allowed', 'automatic_source_replacement_allowed']) {
  expect(contract.boundaries[key] === false, `contract boundary changed: ${key}`);
}
expect(contract.suppression_policy.automatic_time_expiry === false, 'automatic time expiry changed');
expect(contract.suppression_policy.queue_presence_is_reactivation_signal === false, 'queue-presence reactivation changed');
expect(contract.suppression_policy.unreviewed_wayback_result_is_reactivation_signal === false, 'unreviewed Wayback reactivation changed');
expect(contract.suppression_policy.unreviewed_source_url_change_is_reactivation_signal === false, 'unreviewed URL reactivation changed');
expect(contract.candidate_policy.maximum_selected_count === 10, 'future queue maximum changed');
expect(contract.candidate_policy.asset_rank === false && contract.candidate_policy.evidence_rank === false && contract.candidate_policy.single_composite_score === false, 'ranking boundary changed');

for (const file of [
  'docs/migration/evidence-correction-outcomes-pr360.json',
  'docs/migration/evidence-archive-maintenance-outcomes-pr365.json',
  'docs/migration/evidence-archive-maintenance-outcomes-pr380.json',
  'docs/migration/evidence-archive-review-history-manifest-pr377.json',
  'docs/migration/evidence-archive-review-history-audit-pr377.json',
  'docs/migration/post-pr380-review-gate-pr381.json',
  'docs/migration/current-canonical-checkpoint.json'
]) {
  expect(git('hash-object', file) === git('rev-parse', `origin/main:${file}`), `${file}: immutable reviewed source changed`);
}

for (const [file, markers] of [
  ['AGENTS.md', ['PR #382 Evidence Archive Review-History Contract v2 Update: active; complete on merge', 'PR #383 Evidence Archive Maintenance Queue v3 Refresh: next after PR #382', 'sog_src_eurc_mint_page']],
  ['docs/roadmap.md', ['Status: canonical execution schedule — PR #382 active', 'history sources: 3', 'PR #383 is the only authorized consumer']],
  ['docs/quality/evidence-archive-review-history-contract-v2-pr382-spec.md', ['reviewed_source_replacement', 'reactivated_reviewed_source_replacement', 'PR #383 Evidence Archive Maintenance Queue v3 Refresh']],
  ['docs/roadmap-amendments/2026-07-16-pr382-evidence-archive-review-history-v2-activation.md', ['reviewed reactivated eligible: 1', 'sog_src_eurc_mint_page', 'generate no queue']]
]) {
  const value = readText(file);
  for (const marker of markers) expect(value.includes(marker), `${file}: missing authority marker ${marker}`);
}

for (const file of [
  'public/data/evidence-archive-review-history-manifest-v2-pr382.json',
  'public/data/evidence-archive-review-history-audit-v2-pr382.json',
  'src/pages/evidence-archive-review-history-v2.astro'
]) expect(!fs.existsSync(path.join(root, file)), `${file}: internal history v2 output leaked into public surface`);

if (failures.length) {
  console.error('PR #382 Evidence Archive Review-History Contract v2 validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  manifest_id: manifest.manifest_id,
  history_sources: counts.history_source_count,
  history_events: counts.history_event_count,
  reviewed_evidence_identities: counts.reviewed_evidence_identity_count,
  archive_present: counts.effective_archive_present_count,
  archive_removed_invalid: counts.effective_archive_removed_invalid_count,
  no_safe_change: counts.effective_no_safe_change_count,
  source_replacement: counts.effective_source_replacement_count,
  reviewed_unresolved_total: unresolved.total_count,
  reviewed_suppressed: unresolved.suppressed_count,
  reviewed_reactivated_eligible: unresolved.reactivated_eligible_count,
  next_work_item: audit.decision.next_work_item
}, null, 2));
