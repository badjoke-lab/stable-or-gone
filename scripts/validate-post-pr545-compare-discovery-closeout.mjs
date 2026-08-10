import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const json = (file) => JSON.parse(read(file));
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const closeout = json('config/post-pr545-compare-discovery-closeout.json');
const checkpoint = json('docs/migration/current-canonical-checkpoint.json');
const review = json('data/editorial-research/evidence-archive-payload-verification-batch-2-review-2026-08-09.json');
const amendment = read('docs/roadmap-amendments/2026-08-10-post-pr545-compare-discovery-closeout.md');
const spec = read('docs/quality/post-pr545-compare-discovery-closeout-spec.md');
const agents = read('AGENTS.md');
const governance = read('docs/spec-governance.md');
const roadmap = read('docs/roadmap.md');
const deployment = read('docs/deployment-policy.md');
const active = read('scripts/validate-active-workstream.mjs').trim();

expect(closeout.status === 'compare_discovery_complete_review_gate_restored', 'closeout status changed');
expect(closeout.entry_main_commit === 'cd18c899cebb49a0cc6c99670709cdee0b7b7256', 'Compare implementation merge changed');
expect(closeout.compare_discovery_remediation.authority_pr === 544, 'Compare authority PR changed');
expect(closeout.compare_discovery_remediation.implementation_pr === 545, 'Compare implementation PR changed');
expect(closeout.compare_discovery_remediation.production_run === 31406474357, 'Compare production run changed');
expect(closeout.compare_discovery_remediation.production_result === 'success', 'Compare production result is not success');
expect(closeout.compare_discovery_remediation.visual_exact_head === 'cfe54670a5b89cadb2ad6388887daac40a1015ef', 'Compare visual exact head changed');
expect(closeout.compare_discovery_remediation.visual_run === 31405900687, 'Compare visual run changed');
expect(closeout.compare_discovery_remediation.visual_result === 'success', 'Compare visual result is not success');
expect(closeout.compare_discovery_remediation.visual_audit_ok === true, 'Compare visual audit not accepted');

for (const outcome of [
  'comparison_panel_before_public_register_results',
  'fixed_compare_dock_while_browsing_register_after_selection',
  'dock_hidden_while_comparison_is_in_view',
  'instant_view_comparison_navigation_and_focus',
  'in_panel_add_or_replace_record',
  'remove_then_replace_without_register_round_trip'
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
]) expect(checkpoint.counts[checkpointKey] === expected[expectedKey], `${checkpointKey} changed during Compare discovery lane`);
expect(expected.canonical_hash === 'sha256:f386c1043ca5e83cafbd88e99746d0609aab0154ed48de1970677758a66ed5fa', 'canonical hash baseline changed');
expect(expected.canonical_file_count === 466, 'canonical file count baseline changed');

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

for (const text of [agents, governance, roadmap, deployment]) {
  expect(text.includes('Evidence Archive Payload Verification Batch 2'), 'forward governance missing Evidence Archive lane');
  expect(text.includes('REVIEW_GATE'), 'forward governance missing REVIEW_GATE');
  expect(text.includes('PR #545'), 'forward governance missing completed PR #545');
  expect(text.includes('31406474357'), 'forward governance missing production run');
}
expect(amendment.includes('Visual acceptance run: 31405900687 — success'), 'closeout amendment missing visual run');
expect(amendment.includes('Production deploy run: 31406474357 — success'), 'closeout amendment missing production run');
expect(spec.includes('Any canonical archive promotion requires a separate reviewed and merged implementation authority'), 'closeout spec weakens archive boundary');
expect(active === "import './validate-post-pr545-compare-discovery-closeout.mjs';", 'active validator is not wired to Compare closeout');

if (failures.length) {
  console.error('Post-PR #545 Compare discovery/navigation closeout validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log('Post-PR #545 Compare discovery/navigation closeout validation passed.');
