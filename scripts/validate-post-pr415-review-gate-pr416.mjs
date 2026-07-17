import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const json = (file) => JSON.parse(read(file));
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

const handoff = json('docs/migration/ui-v3-stablecoin-dossier-pr415-handoff.json');
const implementation = json('config/ui-v3-stablecoin-dossier-pr415.json');
const design = json('config/ui-v3-rebuild-design-contract-pr409.json');
const approvals = json('docs/migration/ui-v3-visual-approval-register.json');
const gate = json('docs/migration/post-pr415-review-gate-pr416.json');

check(handoff.status === 'implementation_complete' && handoff.implementation_pr === 415, 'PR #415 handoff identity changed');
check(handoff.source_review_pr === 414 && handoff.phase === 'PR D', 'PR #415 authority changed');
check(handoff.authorized_route_family === '/stablecoin/[slug]/', 'PR #415 route family changed');
check(handoff.visual_artifacts?.required_capture_count === 6, 'PR #415 capture count changed');
check(handoff.visual_artifacts?.skipped_visual_audit_allowed === false, 'PR #415 visual audit became skippable');
check(handoff.visual_artifacts?.horizontal_page_overflow_allowed === false, 'PR #415 permits horizontal overflow');
check(handoff.visual_artifacts?.automated_capture_is_owner_approval === false, 'PR #415 capture became owner approval');
check(handoff.owner_approval_state?.accepted_desktop === 0 && handoff.owner_approval_state?.accepted_mobile === 0, 'PR #415 recorded owner approval');
check(handoff.owner_approval_state?.ui_completion === false, 'PR #415 declared UI completion');
check(handoff.changes?.routes === 0 && handoff.changes?.canonical_data === 0 && handoff.changes?.public_machine_readable_data === 0 && handoff.changes?.metadata_contract === 0, 'PR #415 boundary changed');
check(handoff.next_work_item?.decision === 'review_gate_required', 'PR #415 did not stop at review gate');
check(handoff.boundaries?.pr_e_pre_authorized === false, 'PR #415 pre-authorized PR E');

check(implementation.implementation_pr === 415 && implementation.phase === 'PR D', 'PR #415 contract identity changed');
check(implementation.visual_review?.required_capture_count === 6, 'PR #415 contract capture count changed');
check(implementation.visual_review?.skipped_audit_result === 'hard_failure', 'PR #415 contract permits skipped audit');
check(implementation.visual_review?.automated_capture_counts_as_owner_approval === false, 'PR #415 contract treats capture as approval');
check(JSON.stringify(implementation.priority) === JSON.stringify(design.template_priority.stablecoin_dossier), 'PR #415 hierarchy diverges from design contract');

check(gate.review_pr === 416 && gate.source_pr === 415 && gate.status === 'reviewed_complete', 'PR #416 identity changed');
check(gate.source_merge_commit === 'e4af173ff3560e0474b8282de0ad8da4532d0f4a', 'PR #415 merge binding changed');
check(gate.source_implementation_head === 'c632a4419da7a6e45645e75f5a3d87985cd0dbe8', 'PR #415 implementation-head binding changed');
check(gate.binding_findings?.visual_review_run_id === 29576352130, 'visual run binding changed');
check(gate.binding_findings?.visual_artifact_id === 8405201944, 'visual artifact binding changed');
check(gate.binding_findings?.contract_and_build_validation === 'success' && gate.binding_findings?.mandatory_desktop_mobile_visual_audit === 'success', 'successful validation finding changed');
check(gate.binding_findings?.required_capture_count === 6 && gate.binding_findings?.completed_capture_count === 6, 'six-state capture binding changed');
check(gate.binding_findings?.visual_failure_count === 0 && gate.binding_findings?.horizontal_overflow_failures === 0, 'visual failure binding changed');
check(gate.binding_findings?.automated_rendering_is_owner_approval === false, 'review treats rendering as approval');
check(gate.binding_findings?.owner_approved_desktop_templates === 0 && gate.binding_findings?.owner_approved_mobile_templates === 0, 'review records owner approval');
check(gate.binding_findings?.routes_changed === 0 && gate.binding_findings?.canonical_changes === 0 && gate.binding_findings?.public_machine_readable_changes === 0 && gate.binding_findings?.metadata_contract_changes === 0, 'review records boundary changes');
check(gate.reviewed_visual_states?.length === 6, 'reviewed visual state count changed');
for (const state of gate.reviewed_visual_states ?? []) check(state.viewport_width === state.scroll_width, `${state.route} ${state.device}: overflow binding is not exact`);

check(gate.decision?.next_pr === 417 && gate.decision?.next_phase === 'PR E' && gate.decision?.next_work_item === 'events_and_organizations', 'PR #417 decision changed');
check(JSON.stringify(gate.event_priority) === JSON.stringify(design.template_priority.events), 'event priority diverges from design contract');
check(JSON.stringify(gate.organization_priority) === JSON.stringify(design.template_priority.organizations), 'organization priority diverges from design contract');
check(JSON.stringify(gate.decision?.authorized_route_families) === JSON.stringify(['/events/', '/event/[id]/', '/issuers/', '/issuer/[slug]/']), 'authorized route families changed');
check(gate.decision?.route_change === false && gate.decision?.canonical_action === 'none' && gate.decision?.public_machine_readable_change === false && gate.decision?.owner_approval_change === false, 'PR #417 boundary changed');
check(gate.decision?.later_phases_pre_authorized === false && gate.decision?.exit_state_after_pr417 === 'REVIEW GATE', 'later phase or exit state changed');
check(gate.representative_visual_states?.length === 8 && gate.visual_requirements?.required_capture_count === 8, 'PR #417 visual matrix must contain eight states');
for (const route of ['/events/', '/event/sog_ev_ust_2022_05_collapse/', '/issuers/', '/issuer/circle/']) check(gate.representative_visual_states.filter((state) => state.route === route).length === 2, `${route}: desktop/mobile pair missing`);
check(gate.visual_requirements?.bounded_primary_indexes === true, 'bounded primary indexes are not required');
check(gate.visual_requirements?.horizontal_page_overflow_allowed === false && gate.visual_requirements?.skipped_audit_result === 'hard_failure' && gate.visual_requirements?.automated_capture_counts_as_owner_approval === false, 'PR #417 visual gates changed');
check(gate.canonical_counts?.assets === 112 && gate.canonical_counts?.organizations === 107 && gate.canonical_counts?.events === 187 && gate.canonical_counts?.evidence === 559, 'canonical counts changed');

check(approvals.current_counts?.accepted_desktop === 0 && approvals.current_counts?.accepted_mobile === 0, 'owner approval register changed');
check(approvals.completion_rule?.automated_capture_counts_as_approval === false, 'approval register treats capture as approval');

for (const marker of [
  'Current mandatory authority: PR #416 Post-PR #415 Review Gate.',
  'PR #415 UI v3 Rebuild D — stablecoin dossier: complete',
  'PR #416 Post-PR #415 Review Gate: active; complete on merge',
  'PR #417 UI v3 Rebuild E — events and organizations: approved next',
  'PR F guides and secondary pages: blocked'
]) check(read('AGENTS.md').includes(marker), `AGENTS missing ${marker}`);
for (const marker of [
  'Status: canonical execution schedule — PR #416 active review gate',
  'PR #415 UI v3 Rebuild D — stablecoin dossier: complete',
  'PR #416 Post-PR #415 Review Gate: active; complete on merge',
  'PR #417 UI v3 Rebuild E — events and organizations: approved next',
  'After PR #417, stop at `REVIEW GATE`'
]) check(read('docs/roadmap.md').includes(marker), `roadmap missing ${marker}`);

try {
  git('rev-parse', '--verify', 'origin/main');
  git('merge-base', '--is-ancestor', gate.source_merge_commit, 'HEAD');
  check(git('diff', '--name-only', 'origin/main...HEAD', '--', 'src/', 'public/', 'data/', 'config/', 'scripts/monitoring/').trim() === '', 'PR #416 contains implementation or canonical changes');
  for (const file of ['docs/migration/ui-v3-visual-approval-register.json','docs/migration/current-canonical-checkpoint.json','docs/migration/current-stats-history-checkpoint.json','docs/migration/registry-release-integrity-baseline.json']) check(git('hash-object', file) === git('rev-parse', `origin/main:${file}`), `${file}: protected content changed`);
} catch (error) { failures.push(`origin/main comparison failed: ${error.message}`); }

if (failures.length) {
  console.error('PR #416 post-PR #415 review gate validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log(JSON.stringify({ ok:true, review_pr:416, source_pr:415, source_merge_commit:gate.source_merge_commit, visual_review_run_id:gate.binding_findings.visual_review_run_id, captures:6, visual_failures:0, owner_approvals:0, next_pr:417, authorized_route_families:gate.decision.authorized_route_families, canonical_changes:0, exit_state:'REVIEW GATE' }, null, 2));
