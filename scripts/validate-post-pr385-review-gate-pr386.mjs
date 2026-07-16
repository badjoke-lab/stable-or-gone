import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { buildPostPr385ReviewGate } from './build-post-pr385-review-gate-pr386.mjs';

const root = process.cwd();
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const config = readJson('config/post-pr385-review-gate-pr386.json');
const report = readJson('docs/migration/post-pr385-review-gate-pr386.json');
const outcomes = readJson('docs/migration/evidence-archive-maintenance-outcomes-pr385.json');
const handoff = readJson('docs/migration/evidence-archive-maintenance-batch-4-pr385-reviewed-handoff.json');
const historyManifest = readJson('docs/migration/evidence-archive-review-history-manifest-v2-pr382.json');
const historyAudit = readJson('docs/migration/evidence-archive-review-history-audit-v2-pr382.json');
const checkpoint = readJson('docs/migration/current-canonical-checkpoint.json');
const statsCheckpoint = readJson('docs/migration/current-stats-history-checkpoint.json');
const releaseBaseline = readJson('docs/migration/registry-release-integrity-baseline.json');
const generated = buildPostPr385ReviewGate();

expect(same(report, generated), 'committed PR #386 review report is not deterministic');
expect(config.review_pr === 386 && report.review_pr === 386, 'review PR identity changed');
expect(report.report_id === 'sog_post_pr385_review_gate_pr386_2026_07_16', 'review report ID changed');
expect(report.status === 'reviewed_internal_authority_decision', 'review report status changed');
expect(report.public_output === false, 'review report must remain internal');

const expected = config.expected;
expect(report.source_checkpoint.assets === expected.assets, 'asset count mismatch');
expect(report.source_checkpoint.evidence === expected.evidence, 'Evidence count mismatch');
expect(report.source_checkpoint.evidence_relations === expected.evidence_relations, 'Evidence Relation count mismatch');
expect(report.source_checkpoint.archive_recorded === expected.archive_recorded, 'archive-recorded count mismatch');
expect(report.source_checkpoint.archive_not_recorded === expected.archive_not_recorded, 'archive-not-recorded count mismatch');
expect(checkpoint.expected_counts.assets === expected.assets, 'checkpoint asset count changed');
expect(checkpoint.expected_counts.evidence === expected.evidence, 'checkpoint Evidence count changed');
expect(checkpoint.evidence_quality.archive_index_count === expected.archive_recorded, 'checkpoint archive count changed');
expect(checkpoint.evidence_quality.archive_not_recorded_count === expected.archive_not_recorded, 'checkpoint no-archive count changed');
expect(statsCheckpoint.canonical_checkpoint_id === checkpoint.checkpoint_id, 'stats checkpoint is not bound to current canonical checkpoint');
expect(releaseBaseline.evidence_quality.archive_index_count === expected.archive_recorded, 'release archive count changed');
expect(releaseBaseline.evidence_quality.archive_not_recorded_count === expected.archive_not_recorded, 'release no-archive count changed');

const completed = report.completed_pr385;
expect(completed.selected === expected.pr385_selected, 'PR #385 selected count mismatch');
expect(completed.changed === expected.pr385_changed, 'PR #385 changed count mismatch');
expect(completed.dated_archives_added === expected.pr385_dated_archives, 'PR #385 archive count mismatch');
expect(completed.reviewed_source_replacements === expected.pr385_source_replacements, 'PR #385 replacement count mismatch');
expect(completed.reviewed_no_safe_change === expected.pr385_no_safe_change, 'PR #385 no-safe count mismatch');
expect(completed.canonical_identity_counts_preserved === true, 'PR #385 canonical identities were not preserved');
expect(completed.public_surface_changed === false, 'PR #385 public surface boundary changed');
expect(outcomes.selected_count === completed.selected && outcomes.changed_count === completed.changed, 'PR #385 outcome/report count mismatch');
expect(handoff.evidence_quality.archive_recorded === expected.archive_recorded, 'PR #385 handoff archive count mismatch');
expect(handoff.evidence_quality.archive_not_recorded === expected.archive_not_recorded, 'PR #385 handoff no-archive count mismatch');
expect(handoff.next_work_item?.decision === 'review_gate_required', 'PR #385 handoff does not require a review gate');

const currentV2 = report.current_history_v2;
expect(currentV2.sources === expected.history_v2_sources, 'History v2 source count mismatch');
expect(currentV2.events === expected.history_v2_events, 'History v2 event count mismatch');
expect(currentV2.reviewed_identities === expected.history_v2_identities, 'History v2 identity count mismatch');
expect(currentV2.latest_included_review_pr === 380 && currentV2.stale_after_pr385 === true, 'History v2 stale-state finding changed');
expect(historyManifest.counts.history_source_count === expected.history_v2_sources, 'History v2 manifest source count changed');
expect(historyManifest.counts.history_event_count === expected.history_v2_events, 'History v2 manifest event count changed');
expect(historyManifest.counts.reviewed_evidence_identity_count === expected.history_v2_identities, 'History v2 manifest identity count changed');
expect(historyAudit.decision?.next_work_item === 'PR #383 Evidence Archive Maintenance Queue v3 Refresh', 'History v2 audit historical handoff changed');

const v3 = report.expected_history_v3;
expect(v3.sources === expected.expected_history_v3_sources, 'History v3 source projection mismatch');
expect(v3.events === expected.expected_history_v3_events, 'History v3 event projection mismatch');
expect(v3.identities === expected.expected_history_v3_identities, 'History v3 identity projection mismatch');
expect(v3.effective_archive_present === expected.expected_effective_archive_present, 'History v3 archive-present projection mismatch');
expect(v3.effective_invalid_removed === expected.expected_effective_invalid_removed, 'History v3 invalid-removal projection mismatch');
expect(v3.effective_no_safe_change === expected.expected_effective_no_safe_change, 'History v3 no-safe projection mismatch');
expect(v3.effective_source_replacement === expected.expected_effective_source_replacement, 'History v3 source-replacement projection mismatch');
expect(v3.reviewed_unresolved_total === expected.expected_reviewed_unresolved_total, 'History v3 unresolved-total projection mismatch');
expect(v3.reviewed_suppressed === expected.expected_reviewed_suppressed, 'History v3 suppression projection mismatch');
expect(v3.reviewed_reactivated_eligible === expected.expected_reviewed_reactivated_eligible, 'History v3 reactivation projection mismatch');
expect(v3.reactivated_evidence_ids.length === 1 && v3.reactivated_evidence_ids[0] === 'sog_src_fdusd_site', 'History v3 reviewed-reactivated identity changed');
expect(!v3.reactivated_evidence_ids.includes('sog_src_eurc_mint_page'), 'Circle Mint remained incorrectly reactivated after archive addition');
expect(v3.effective_rows.find((row) => row.evidence_id === 'sog_src_eurc_mint_page')?.effective_review_outcome === 'reviewed_archive_present', 'Circle Mint effective outcome changed');
expect(v3.effective_rows.find((row) => row.evidence_id === 'sog_src_fdusd_site')?.effective_review_outcome === 'reviewed_source_replacement', 'FDUSD effective outcome changed');
expect(v3.suppressed_evidence_ids.includes('sog_src_fei_addresses_batch_a'), 'Fei addresses no-safe identity missing from suppression projection');
expect(v3.suppressed_evidence_ids.includes('sog_src_fei_tip121c_execution_2022'), 'Fei TIP-121c no-safe identity missing from suppression projection');

expect(report.decisions.evidence_archive_review_history_contract_v3?.decision === 'approved_internal', 'History v3 decision changed');
expect(report.decisions.evidence_archive_review_history_contract_v3?.pr === 387, 'History v3 PR number changed');
expect(report.decisions.evidence_archive_maintenance_queue_v4?.decision === 'approved_internal_after_pr387', 'Queue v4 decision changed');
expect(report.decisions.evidence_archive_maintenance_queue_v4?.pr === 388, 'Queue v4 PR number changed');
expect(report.decisions.evidence_archive_maintenance_queue_v4?.maximum_selected_count === 10, 'Queue v4 maximum selection changed');
expect(report.decisions.evidence_archive_maintenance_batch_5?.decision === 'not_approved', 'Archive Batch 5 was unexpectedly approved');
expect(report.approved_next_sequence.length === 2, 'approved sequence length changed');
expect(report.approved_next_sequence[0].pr === 387 && report.approved_next_sequence[1].pr === 388, 'approved sequence order changed');
expect(report.review_gate_after_sequence === true, 'review gate after Queue v4 changed');
expect(report.activation_rule.includes('PR #387'), 'PR #387 activation rule missing');

for (const key of ['current_pr_canonical_data_change_allowed', 'current_pr_public_surface_change_allowed', 'historical_output_rewrite_allowed', 'ranking_allowed', 'automatic_promotion_allowed']) {
  expect(config.boundaries?.[key] === false, `config boundary changed: ${key}`);
}
for (const key of ['canonical_data_changed', 'public_surface_changed', 'historical_outputs_rewritten', 'ranking_or_score', 'automatic_promotion']) {
  expect(report.boundaries?.[key] === false, `report boundary changed: ${key}`);
}

let originMainAvailable = false;
try { git('rev-parse', '--verify', 'origin/main'); originMainAvailable = true; } catch {}
if (originMainAvailable) {
  for (const file of [
    'docs/migration/evidence-archive-maintenance-outcomes-pr385.json',
    'docs/migration/evidence-archive-maintenance-batch-4-pr385-reviewed-handoff.json',
    'docs/migration/evidence-archive-review-history-manifest-v2-pr382.json',
    'docs/migration/evidence-archive-review-history-audit-v2-pr382.json',
    'docs/migration/current-canonical-checkpoint.json',
    'docs/migration/current-stats-history-checkpoint.json',
    'docs/migration/registry-release-integrity-baseline.json'
  ]) {
    try {
      expect(git('hash-object', file) === git('rev-parse', `origin/main:${file}`), `${file}: immutable Git blob identity changed`);
    } catch (error) {
      failures.push(`${file}: unable to verify origin/main blob identity: ${error.message}`);
    }
  }
}

for (const [file, markers] of [
  ['AGENTS.md', ['PR #386 Post-PR #385 Review Gate: active; complete on merge', 'PR #387 Evidence Archive Review-History Contract v3 Update', 'PR #388 Evidence Archive Maintenance Queue v4 Refresh', 'REVIEW GATE: mandatory after PR #388']],
  ['docs/roadmap.md', ['Status: canonical execution schedule — PR #386 review gate active', 'history sources: 4', 'reviewed Evidence identities: 39', 'PR #388 Evidence Archive Maintenance Queue v4 Refresh']],
  ['docs/quality/post-pr385-review-gate-pr386-spec.md', ['History v3 must resolve Circle Mint to archive-present', 'PR #387 Evidence Archive Review-History Contract v3 Update', 'another `REVIEW GATE`']],
  ['docs/roadmap-amendments/2026-07-16-pr386-post-pr385-review-gate.md', ['Archive recorded: 399 → 406', 'sog_src_fdusd_site', 'PR #388 Evidence Archive Maintenance Queue v4 Refresh']]
]) {
  const value = readText(file);
  for (const marker of markers) expect(value.includes(marker), `${file}: missing authority marker ${marker}`);
}

for (const file of [
  'public/data/post-pr385-review-gate-pr386.json',
  'src/pages/post-pr385-review-gate-pr386.astro'
]) expect(!fs.existsSync(path.join(root, file)), `${file}: internal output leaked into public surface`);

if (failures.length) {
  console.error('PR #386 Post-PR #385 Review Gate validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  report_id: report.report_id,
  archive_recorded: report.source_checkpoint.archive_recorded,
  archive_not_recorded: report.source_checkpoint.archive_not_recorded,
  pr385_yield: `${completed.changed}/${completed.selected}`,
  history_v3_sources: v3.sources,
  history_v3_events: v3.events,
  history_v3_identities: v3.identities,
  history_v3_archive_present: v3.effective_archive_present,
  history_v3_no_safe_change: v3.effective_no_safe_change,
  history_v3_source_replacement: v3.effective_source_replacement,
  history_v3_suppressed: v3.reviewed_suppressed,
  history_v3_reactivated: v3.reviewed_reactivated_eligible,
  approved_next_sequence: report.approved_next_sequence.map((row) => `PR #${row.pr} ${row.work_item}`),
  review_gate_after_sequence: report.review_gate_after_sequence
}, null, 2));
