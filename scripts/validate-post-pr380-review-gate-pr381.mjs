import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { isDeepStrictEqual } from 'node:util';
import { buildPostPr380ReviewGate } from './build-post-pr380-review-gate-pr381.mjs';

const root = process.cwd();
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const failures = [];
const expect = (value, message) => { if (!value) failures.push(message); };
const same = (left, right) => isDeepStrictEqual(left, right);

const config = readJson('config/post-pr380-review-gate-pr381.json');
const report = readJson('docs/migration/post-pr380-review-gate-pr381.json');
const generated = buildPostPr380ReviewGate();

expect(same(report, generated), 'committed PR #381 report is not deterministic');
expect(report.status === 'deterministic_internal_review_gate' && report.public_output === false, 'review gate identity changed');
expect(report.review_pr === 381, 'review PR changed');
expect(report.source_checkpoint.assets === 112, 'asset checkpoint changed');
expect(report.source_checkpoint.evidence === 559, 'Evidence checkpoint changed');
expect(report.source_checkpoint.evidence_relations === 559, 'Evidence Relation checkpoint changed');
expect(report.source_checkpoint.deployments === 174, 'deployment checkpoint changed');
expect(report.source_checkpoint.market_access_records === 8, 'Market Access checkpoint changed');
expect(report.source_checkpoint.archive_recorded === 399, 'archive-recorded checkpoint changed');
expect(report.source_checkpoint.archive_not_recorded === 160, 'archive-not-recorded checkpoint changed');

expect(report.completed_pr380.selected === 10 && report.completed_pr380.changed === 10, 'PR #380 selected/changed result changed');
expect(report.completed_pr380.dated_archive_added === 9, 'PR #380 archive-add result changed');
expect(report.completed_pr380.reviewed_source_replacement === 1, 'PR #380 replacement result changed');
expect(report.completed_pr380.reviewed_no_safe_change === 0, 'PR #380 no-safe result changed');
expect(report.completed_pr380.exact_archive_evidence_ids.length === 9, 'PR #380 archive identity count changed');
expect(JSON.stringify(report.completed_pr380.source_replacement_evidence_ids) === JSON.stringify(['sog_src_eurc_mint_page']), 'PR #380 source replacement identity changed');
expect(report.completed_pr380.identity_or_relation_change === false, 'PR #380 identity/relation boundary changed');

expect(report.current_history_v1.sources === 2, 'history v1 source count changed');
expect(report.current_history_v1.events === 20, 'history v1 event count changed');
expect(report.current_history_v1.reviewed_identities === 20, 'history v1 identity count changed');
expect(report.current_history_v1.archive_present === 10, 'history v1 archive-present count changed');
expect(report.current_history_v1.archive_removed_invalid === 1, 'history v1 invalid-removal count changed');
expect(report.current_history_v1.no_safe_change === 9, 'history v1 no-safe count changed');
expect(report.current_history_v1.reviewed_unresolved_suppressed === 10, 'history v1 suppression count changed');
expect(report.current_history_v1.includes_pr380 === false && report.current_history_v1.stale_after_pr380 === true, 'history v1 stale finding changed');

const expectedV2 = config.expected_history_v2_after_pr382;
expect(same(report.expected_history_v2_after_pr382, expectedV2), 'history v2 expected inventory changed');
expect(expectedV2.sources === 3 && expectedV2.events === 30 && expectedV2.reviewed_identities === 30, 'history v2 source/event/identity counts changed');
expect(expectedV2.archive_present === 19, 'history v2 archive-present count changed');
expect(expectedV2.archive_removed_invalid === 1 && expectedV2.no_safe_change === 9, 'history v2 prior outcome counts changed');
expect(expectedV2.reviewed_source_replacement === 1, 'history v2 source replacement count changed');
expect(expectedV2.reviewed_unresolved_total === 11, 'history v2 unresolved total changed');
expect(expectedV2.reviewed_unresolved_suppressed === 10, 'history v2 suppression count changed');
expect(expectedV2.reviewed_reactivated_eligible === 1, 'history v2 reactivated eligibility changed');

expect(report.evaluation.history_update_required_before_new_queue === true, 'history update requirement changed');
expect(report.evaluation.consumed_pr378_queue_reusable === false, 'consumed queue reuse boundary changed');
expect(report.evaluation.archive_batch_4_ready === false, 'Archive Batch 4 readiness changed');
expect(report.evaluation.circle_mint_reactivation.evidence_id === 'sog_src_eurc_mint_page', 'Circle Mint reactivation identity changed');
expect(report.evaluation.circle_mint_reactivation.state === 'reviewed_source_replacement_without_archive', 'Circle Mint reactivation state changed');
expect(report.evaluation.circle_mint_reactivation.next_eligibility === 'eligible_for_fresh_archive_review_under_history_v2', 'Circle Mint next eligibility changed');
expect(report.evaluation.circle_mint_reactivation.automatic_canonical_change_allowed === false, 'Circle Mint automatic canonical boundary changed');

expect(report.decisions.evidence_archive_review_history_contract_v2.decision === 'approved_internal_contract_update', 'PR #382 decision changed');
expect(report.decisions.evidence_archive_review_history_contract_v2.pr === 382, 'PR #382 number changed');
expect(report.decisions.evidence_archive_review_history_contract_v2.canonical_change_allowed === false, 'PR #382 canonical boundary changed');
expect(report.decisions.evidence_archive_maintenance_queue_v3.decision === 'approved_internal_queue_refresh_after_pr382', 'PR #383 decision changed');
expect(report.decisions.evidence_archive_maintenance_queue_v3.pr === 383, 'PR #383 number changed');
expect(report.decisions.evidence_archive_maintenance_queue_v3.maximum_selected_candidates === 10, 'PR #383 queue maximum changed');
expect(report.decisions.evidence_archive_maintenance_queue_v3.canonical_change_allowed === false, 'PR #383 canonical boundary changed');
expect(report.decisions.evidence_archive_maintenance_batch_4.decision === 'not_approved_before_fresh_queue_review', 'Archive Batch 4 decision changed');
expect(report.decisions.tier_a_dossier_batch_6.decision === 'not_approved_empty_history_aware_queue', 'dossier decision changed');
expect(report.decisions.market_access_pilot_3.decision === 'not_approved_no_reviewed_candidate_manifest', 'Market Access decision changed');
expect(report.approved_next_sequence.map((row) => row.pr).join(',') === '382,383', 'approved sequence changed');
expect(report.review_gate_after_sequence === true, 'sequence must end at review gate');

for (const key of ['canonical_data_changed', 'public_surface_changed', 'historical_outputs_rewritten', 'ranking_or_score', 'automatic_promotion']) expect(report.boundaries[key] === false, `report boundary changed: ${key}`);
for (const key of ['current_pr_canonical_data_change_allowed', 'current_pr_public_surface_change_allowed', 'historical_output_rewrite_allowed', 'ranking_allowed', 'automatic_promotion_allowed']) expect(config.boundaries[key] === false, `config boundary changed: ${key}`);

for (const file of [
  'docs/migration/evidence-archive-maintenance-batch-3-pr380-reviewed-handoff.json',
  'docs/migration/evidence-archive-maintenance-outcomes-pr380.json',
  'docs/migration/evidence-archive-review-history-audit-pr377.json',
  'docs/migration/evidence-archive-review-history-manifest-pr377.json',
  'docs/migration/current-canonical-checkpoint.json'
]) expect(git('hash-object', file) === git('rev-parse', `origin/main:${file}`), `${file}: immutable source changed`);

for (const [file, markers] of [
  ['AGENTS.md', ['PR #381 Post-PR #380 Review Gate: active; complete on merge', 'PR #382 Evidence Archive Review-History Contract v2 Update', 'PR #383 Evidence Archive Maintenance Queue v3 Refresh']],
  ['docs/roadmap.md', ['Status: canonical execution schedule — PR #381 review gate active', 'PR #382 Evidence Archive Review-History Contract v2 Update', 'PR #383 Evidence Archive Maintenance Queue v3 Refresh']],
  ['docs/quality/post-pr380-review-gate-pr381-spec.md', ['The PR #377 history contract contains only 20 events', 'Circle Mint identity has a reviewed replacement URL', 'stop at `REVIEW GATE`']],
  ['docs/roadmap-amendments/2026-07-16-pr381-post-pr380-review-gate.md', ['history sources: 3', 'reviewed reactivated eligible: 1', 'Evidence and Archive Maintenance Batch 4']]
]) {
  const value = readText(file);
  for (const marker of markers) expect(value.includes(marker), `${file}: missing marker ${marker}`);
}

for (const file of ['public/data/post-pr380-review-gate-pr381.json', 'src/pages/post-pr380-review-gate.astro']) expect(!fs.existsSync(path.join(root, file)), `${file}: internal review gate leaked into public surface`);

if (failures.length) {
  console.error('PR #381 Post-PR #380 Review Gate validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  report_id: report.report_id,
  archive_recorded: report.source_checkpoint.archive_recorded,
  archive_not_recorded: report.source_checkpoint.archive_not_recorded,
  pr380_yield: `${report.completed_pr380.changed}/${report.completed_pr380.selected}`,
  history_v2_sources: expectedV2.sources,
  history_v2_events: expectedV2.events,
  history_v2_identities: expectedV2.reviewed_identities,
  reviewed_suppressed: expectedV2.reviewed_unresolved_suppressed,
  reviewed_reactivated_eligible: expectedV2.reviewed_reactivated_eligible,
  next_sequence: report.approved_next_sequence.map((row) => `PR #${row.pr} ${row.work_item}`),
  review_gate_after_sequence: report.review_gate_after_sequence
}, null, 2));
