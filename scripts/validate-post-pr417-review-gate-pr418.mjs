import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const json = (file) => JSON.parse(read(file));
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

const handoff = json('docs/migration/ui-v3-events-organizations-pr417-handoff.json');
const implementation = json('config/ui-v3-events-organizations-pr417.json');
const design = json('config/ui-v3-rebuild-design-contract-pr409.json');
const approvals = json('docs/migration/ui-v3-visual-approval-register.json');
const gate = json('docs/migration/post-pr417-review-gate-pr418.json');

check(handoff.status === 'implementation_complete' && handoff.implementation_pr === 417, 'PR #417 handoff identity changed');
check(handoff.source_review_pr === 416 && handoff.phase === 'PR E', 'PR #417 authority changed');
check(JSON.stringify(handoff.authorized_route_families) === JSON.stringify(['/events/','/event/[id]/','/issuers/','/issuer/[slug]/']), 'PR #417 route families changed');
check(handoff.register_bounds?.events_page_size === 20 && handoff.register_bounds?.events_initial_ssr_max === 20, 'PR #417 event bounds changed');
check(handoff.register_bounds?.organizations_page_size === 20 && handoff.register_bounds?.organizations_initial_ssr_max === 20, 'PR #417 organization bounds changed');
check(handoff.register_bounds?.events_mobile_max_body_height_px === 9000 && handoff.register_bounds?.organizations_mobile_max_body_height_px === 9000, 'PR #417 mobile density bounds changed');
check(handoff.visual_artifacts?.required_capture_count === 8, 'PR #417 capture count changed');
check(handoff.visual_artifacts?.skipped_visual_audit_allowed === false, 'PR #417 visual audit became skippable');
check(handoff.visual_artifacts?.horizontal_page_overflow_allowed === false, 'PR #417 permits horizontal overflow');
check(handoff.visual_artifacts?.mobile_vertical_density_failure_allowed === false, 'PR #417 permits vertical density failure');
check(handoff.visual_artifacts?.automated_capture_is_owner_approval === false, 'PR #417 capture became owner approval');
check(handoff.owner_approval_state?.accepted_desktop === 0 && handoff.owner_approval_state?.accepted_mobile === 0, 'PR #417 recorded owner approval');
check(handoff.owner_approval_state?.ui_completion === false, 'PR #417 declared UI completion');
check(handoff.changes?.routes === 0 && handoff.changes?.canonical_data === 0 && handoff.changes?.public_machine_readable_data === 0 && handoff.changes?.metadata_contract === 0, 'PR #417 boundary changed');
check(handoff.next_work_item?.decision === 'review_gate_required', 'PR #417 did not stop at review gate');
check(handoff.boundaries?.pr_f_pre_authorized === false, 'PR #417 pre-authorized PR F');

check(implementation.implementation_pr === 417 && implementation.phase === 'PR E', 'PR #417 contract identity changed');
check(implementation.visual_review?.required_capture_count === 8, 'PR #417 contract capture count changed');
check(implementation.visual_review?.mobile_vertical_density_gate_required === true && implementation.visual_review?.mobile_register_max_body_height_px === 9000, 'PR #417 density gate changed');
check(implementation.visual_review?.skipped_audit_result === 'hard_failure', 'PR #417 contract permits skipped audit');
check(implementation.visual_review?.automated_capture_counts_as_owner_approval === false, 'PR #417 contract treats capture as approval');
check(JSON.stringify(implementation.event_priority) === JSON.stringify(design.template_priority.events), 'PR #417 event hierarchy diverges from design contract');
check(JSON.stringify(implementation.organization_priority) === JSON.stringify(design.template_priority.organizations), 'PR #417 organization hierarchy diverges from design contract');

check(gate.review_pr === 418 && gate.source_pr === 417 && gate.status === 'reviewed_complete', 'PR #418 identity changed');
check(gate.source_merge_commit === 'aa4e5b98ae25652c2aeb6327000ce6a7b8f14e51', 'PR #417 merge binding changed');
check(gate.source_implementation_head === '8d9d9472e9458ac689b7edb624baf737e5119364', 'PR #417 implementation-head binding changed');
check(gate.binding_findings?.visual_review_run_id === 29596605158, 'visual run binding changed');
check(gate.binding_findings?.visual_artifact_id === 8413318222, 'visual artifact binding changed');
check(gate.binding_findings?.visual_artifact_digest === 'sha256:fe5529682a0bf1cfe8ef9a62ff4e642b60ae5a8157835f87232f11a7a620c735', 'visual artifact digest changed');
check(gate.binding_findings?.contract_and_build_validation === 'success' && gate.binding_findings?.mandatory_desktop_mobile_visual_audit === 'success', 'successful validation finding changed');
check(gate.binding_findings?.required_capture_count === 8 && gate.binding_findings?.completed_capture_count === 8, 'eight-state capture binding changed');
check(gate.binding_findings?.visual_failure_count === 0 && gate.binding_findings?.horizontal_overflow_failures === 0 && gate.binding_findings?.mobile_vertical_density_failures === 0, 'visual failure binding changed');
check(gate.binding_findings?.events_mobile_body_height_px === 8886 && gate.binding_findings?.organizations_mobile_body_height_px === 8514, 'mobile body-height binding changed');
check(gate.binding_findings?.mobile_register_height_ceiling_px === 9000, 'mobile height ceiling binding changed');
check(gate.binding_findings?.automated_rendering_is_owner_approval === false, 'review treats rendering as approval');
check(gate.binding_findings?.owner_approved_desktop_templates === 0 && gate.binding_findings?.owner_approved_mobile_templates === 0, 'review records owner approval');
check(gate.binding_findings?.routes_changed === 0 && gate.binding_findings?.canonical_changes === 0 && gate.binding_findings?.public_machine_readable_changes === 0 && gate.binding_findings?.metadata_contract_changes === 0, 'review records boundary changes');
check(gate.reviewed_visual_states?.length === 8, 'reviewed visual state count changed');
for (const state of gate.reviewed_visual_states ?? []) check(state.viewport_width === state.scroll_width, `${state.route} ${state.device}: overflow binding is not exact`);
check(gate.reviewed_visual_states.find((state) => state.route === '/events/' && state.device === 'mobile')?.body_height === 8886, 'events mobile state binding changed');
check(gate.reviewed_visual_states.find((state) => state.route === '/issuers/' && state.device === 'mobile')?.body_height === 8514, 'organizations mobile state binding changed');

const expectedRoutes = ['/guides/','/guides/[article]/','/methodology/','/about/','/glossary/','/models/','/updates/','/maintenance/','/contact/','/support/','/compare/','/access-regulation/','/timeline/','/stats/'];
check(gate.decision?.next_pr === 419 && gate.decision?.next_phase === 'PR F' && gate.decision?.next_work_item === 'guides_and_secondary_pages', 'PR #419 decision changed');
check(JSON.stringify(gate.guide_priority) === JSON.stringify(design.template_priority.guides), 'guide priority diverges from design contract');
check(JSON.stringify(gate.decision?.authorized_route_families) === JSON.stringify(expectedRoutes), 'authorized route families changed');
check(gate.decision?.route_change === false && gate.decision?.canonical_action === 'none' && gate.decision?.public_machine_readable_change === false && gate.decision?.owner_approval_change === false, 'PR #419 boundary changed');
check(gate.decision?.later_phases_pre_authorized === false && gate.decision?.exit_state_after_pr419 === 'REVIEW GATE', 'later phase or exit state changed');
check(gate.representative_visual_states?.length === 16 && gate.visual_requirements?.required_capture_count === 16, 'PR #419 visual matrix must contain sixteen states');
for (const route of ['/guides/','/guides/eu-stablecoin-access-after-mica/','/methodology/','/about/','/compare/','/access-regulation/','/timeline/','/stats/']) check(gate.representative_visual_states.filter((state) => state.route === route).length === 2, `${route}: desktop/mobile pair missing`);
check(gate.visual_requirements?.bounded_reading_and_results === true, 'bounded reading/results are not required');
check(gate.visual_requirements?.horizontal_page_overflow_allowed === false && gate.visual_requirements?.skipped_audit_result === 'hard_failure' && gate.visual_requirements?.automated_capture_counts_as_owner_approval === false, 'PR #419 visual gates changed');
check(gate.canonical_counts?.assets === 112 && gate.canonical_counts?.organizations === 107 && gate.canonical_counts?.events === 187 && gate.canonical_counts?.evidence === 559, 'canonical counts changed');

check(approvals.current_counts?.accepted_desktop === 0 && approvals.current_counts?.accepted_mobile === 0, 'owner approval register changed');
check(approvals.completion_rule?.automated_capture_counts_as_approval === false, 'approval register treats capture as approval');

for (const marker of [
  'Current mandatory authority: PR #418 Post-PR #417 Review Gate.',
  'PR #417 UI v3 Rebuild E — events and organizations: complete',
  'PR #418 Post-PR #417 Review Gate: active; complete on merge',
  'PR #419 UI v3 Rebuild F — guides and secondary pages: approved next',
  'PR G full visual closure: blocked'
]) check(read('AGENTS.md').includes(marker), `AGENTS missing ${marker}`);
for (const marker of [
  'Status: canonical execution schedule — PR #418 active review gate',
  'PR #417 UI v3 Rebuild E — events and organizations: complete',
  'PR #418 Post-PR #417 Review Gate: active; complete on merge',
  'PR #419 UI v3 Rebuild F — guides and secondary pages: approved next',
  'After PR #419, stop at `REVIEW GATE`'
]) check(read('docs/roadmap.md').includes(marker), `roadmap missing ${marker}`);

try {
  git('rev-parse', '--verify', 'origin/main');
  git('merge-base', '--is-ancestor', gate.source_merge_commit, 'HEAD');
  check(git('diff', '--name-only', 'origin/main...HEAD', '--', 'src/', 'public/', 'data/', 'config/', 'scripts/monitoring/').trim() === '', 'PR #418 contains implementation or canonical changes');
  for (const file of ['docs/migration/ui-v3-visual-approval-register.json','docs/migration/current-canonical-checkpoint.json','docs/migration/current-stats-history-checkpoint.json','docs/migration/registry-release-integrity-baseline.json']) check(git('hash-object', file) === git('rev-parse', `origin/main:${file}`), `${file}: protected content changed`);
} catch (error) { failures.push(`origin/main comparison failed: ${error.message}`); }

if (failures.length) {
  console.error('PR #418 post-PR #417 review gate validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log(JSON.stringify({ ok:true, review_pr:418, source_pr:417, source_merge_commit:gate.source_merge_commit, visual_review_run_id:gate.binding_findings.visual_review_run_id, captures:8, visual_failures:0, horizontal_overflow_failures:0, mobile_vertical_density_failures:0, events_mobile_body_height_px:8886, organizations_mobile_body_height_px:8514, owner_approvals:0, next_pr:419, authorized_route_families:gate.decision.authorized_route_families, canonical_changes:0, exit_state:'REVIEW GATE' }, null, 2));
