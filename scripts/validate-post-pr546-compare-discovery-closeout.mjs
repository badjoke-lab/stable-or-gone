import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const json = (file) => JSON.parse(read(file));
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const closeout = json('config/post-pr546-compare-discovery-closeout.json');
const checkpoint = json('docs/migration/current-canonical-checkpoint.json');
const review = json('data/editorial-research/evidence-archive-payload-verification-batch-2-review-2026-08-09.json');
const amendment = read('docs/roadmap-amendments/2026-08-11-post-pr546-compare-discovery-closeout.md');
const spec = read('docs/quality/post-pr546-compare-discovery-closeout-spec.md');
const agents = read('AGENTS.md');
const governance = read('docs/spec-governance.md');
const roadmap = read('docs/roadmap.md');
const deployment = read('docs/deployment-policy.md');
const active = read('scripts/validate-active-workstream.mjs').trim();

expect(closeout.status === 'compare_discovery_complete_review_gate_restored', 'closeout status changed');
expect(closeout.entry_main_commit === 'f8ceedd55b0cc764a2bbc2747bd50f061f288b24', 'final Compare main commit changed');
expect(closeout.compare_discovery_remediation.authority_pr === 544, 'Compare authority PR changed');
expect(closeout.compare_discovery_remediation.primary_implementation_pr === 545, 'Compare primary implementation PR changed');
expect(closeout.compare_discovery_remediation.blocking_visual_fix_pr === 546, 'Compare blocking visual fix PR changed');
expect(closeout.compare_discovery_remediation.final_merge_commit === 'f8ceedd55b0cc764a2bbc2747bd50f061f288b24', 'final Compare merge changed');
expect(closeout.compare_discovery_remediation.production_run === 31498949423, 'Compare production run changed');
expect(closeout.compare_discovery_remediation.production_result === 'success', 'Compare production result is not success');
expect(closeout.compare_discovery_remediation.production_issue === 479, 'deployment history issue changed');
expect(closeout.compare_discovery_remediation.production_report_step === 'success', 'Issue #479 reporting step not recorded as success');
expect(closeout.compare_discovery_remediation.visual_exact_head === '02774d7e9f35abf7c11bbbcb2e39cb6b62172cd7', 'Compare visual exact head changed');
expect(closeout.compare_discovery_remediation.visual_run === 31498394285, 'Compare visual run changed');
expect(closeout.compare_discovery_remediation.visual_result === 'success', 'Compare visual result is not success');
expect(closeout.compare_discovery_remediation.visual_artifact_id === 9103989619, 'Compare visual artifact changed');
expect(closeout.compare_discovery_remediation.visual_artifact_digest === 'sha256:12d8bf30712114fcfa406bdfa64de5e126cae9723b6da09686e989b559ebcc86', 'Compare visual artifact digest changed');
expect(closeout.compare_discovery_remediation.visual_audit_ok === true, 'Compare visual audit not accepted');
expect(closeout.compare_discovery_remediation.direct_artifact_review === true, 'direct artifact review not accepted');

for (const outcome of [
  'comparison_panel_before_public_register_results',
  'fixed_compare_dock_while_browsing_register_after_selection',
  'dock_hidden_while_comparison_is_in_view',
  'dock_hidden_outside_register_browsing_scope',
  'dock_hidden_while_footer_is_in_view',
  'desktop_footer_dock_non_overlap_verified',
  'mobile_footer_dock_non_overlap_verified',
  'instant_view_comparison_navigation_and_focus',
  'in_panel_add_or_replace_record',
  'remove_then_replace_without_register_round_trip',
  'two_three_four_record_matrix_preserved',
  'differences_only_preserved',
  'shared_compare_url_restore_preserved',
  'unknown_and_not_recorded_preserved',
  'fifth_selection_rejected',
  'mobile_matrix_overflow_bounded'
]) expect(closeout.compare_discovery_remediation.product_outcomes.includes(outcome), `missing product outcome ${outcome}`);

const expected = closeout.canonical_checkpoint;
for (const [checkpointKey, expectedKey] of [
  ['assets', 'assets'], ['organizations', 'organizations'], ['relationships', 'relationships'], ['events', 'events'],
  ['evidence', 'evidence'], ['evidence_relations', 'evidence_relations'], ['reserve_reports', 'reserve_reports'],
  ['known_unknowns', 'known_unknowns'], ['regulatory_notes', 'regulatory_notes'], ['deployments', 'deployments'],
  ['legal_profiles', 'legal_profiles'], ['reserve_components', 'reserve_components'], ['income_profiles', 'income_profiles'],
  ['market_access_records', 'market_access_records'], ['archive_index_count', 'archive_recorded'],
  ['archive_not_recorded_count', 'archive_not_recorded'], ['detail_routes', 'detail_routes'],
  ['metadata_checked_routes', 'metadata_checked_routes']
]) expect(checkpoint.counts[checkpointKey] === expected[expectedKey], `${checkpointKey} changed during Compare closeout`);
expect(expected.canonical_hash === 'sha256:f386c1043ca5e83cafbd88e99746d0609aab0154ed48de1970677758a66ed5fa', 'canonical hash baseline changed');
expect(expected.canonical_file_count === 466, 'canonical file count baseline changed');
expect(expected.last_canonical_changing_commit === '77e80dd3e2a62fea53ea0eabe91ef78a2d8ab1da', 'last canonical-changing commit changed');

const proposals = review.decisions.filter((row) => row.outcome === 'dated_exact_archive_proposal');
const noSafe = review.decisions.filter((row) => row.outcome === 'reviewed_no_safe_change');
expect(review.status === 'reviewed_complete', 'Evidence review is not complete');
expect(review.target_count === 10 && review.decisions.length === 10, 'Evidence review count changed');
expect(proposals.length === 8 && review.dated_exact_archive_proposal_count === 8, 'Evidence proposal count changed');
expect(noSafe.length === 2 && review.reviewed_no_safe_change_count === 2, 'Evidence no-safe-change count changed');
expect(review.canonical_change_authorized === false, 'Evidence review authorizes canonical change');
expect(review.next_boundary === 'REVIEW_GATE', 'Evidence review boundary changed');
expect(closeout.restored_lane.name === 'Evidence Archive Payload Verification Batch 2', 'restored lane changed');
expect(closeout.restored_lane.stage === 'REVIEW_GATE', 'Evidence REVIEW_GATE not restored');
expect(closeout.restored_lane.reviewed === 10, 'closeout review count changed');
expect(closeout.restored_lane.dated_exact_archive_proposals === 8, 'closeout proposal count changed');
expect(closeout.restored_lane.reviewed_no_safe_change === 2, 'closeout no-safe-change count changed');
expect(closeout.restored_lane.canonical_archive_additions_authorized === 0, 'closeout authorizes archive mutation');
expect(closeout.restored_lane.separate_implementation_authority_required === true, 'separate implementation authority boundary removed');
expect(closeout.restored_lane.automatic_promotion === false, 'automatic archive promotion enabled');

for (const text of [agents, governance, roadmap, deployment]) {
  expect(text.includes('Evidence Archive Payload Verification Batch 2'), 'forward governance missing Evidence Archive lane');
  expect(text.includes('REVIEW_GATE'), 'forward governance missing REVIEW_GATE');
  expect(text.includes('PR #546'), 'forward governance missing blocking visual fix PR #546');
  expect(text.includes('31498394285'), 'forward governance missing final visual run');
  expect(text.includes('31498949423'), 'forward governance missing final production run');
  expect(text.includes('f8ceedd55b0cc764a2bbc2747bd50f061f288b24'), 'forward governance missing final main commit');
}
expect(amendment.includes('desktop-two-selected-footer-guard.png'), 'closeout amendment missing desktop footer artifact review');
expect(amendment.includes('mobile-two-selected-footer-guard.png'), 'closeout amendment missing mobile footer artifact review');
expect(amendment.includes('Visual acceptance run: 31498394285 — success'), 'closeout amendment missing final visual run');
expect(amendment.includes('Production deploy run: 31498949423 — success'), 'closeout amendment missing final production run');
expect(spec.includes('Any canonical archive promotion requires a separate reviewed and merged implementation authority'), 'closeout spec weakens archive boundary');
expect(spec.includes('the dock hides whenever `.site-footer` intersects the viewport'), 'closeout spec missing footer behavior');
expect(active === "import './validate-post-pr546-compare-discovery-closeout.mjs';", 'active validator is not wired to verified Compare closeout');

if (failures.length) {
  console.error('Post-PR #546 Compare discovery/navigation closeout validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log('Post-PR #546 Compare discovery/navigation closeout validation passed.');
