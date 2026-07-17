import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const json = (file) => JSON.parse(read(file));
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const failures = [];
const check = (value, message) => { if (!value) failures.push(message); };

const handoff = json('docs/migration/ui-v3-guides-secondary-pages-pr419-handoff.json');
const implementation = json('config/ui-v3-guides-secondary-pages-pr419.json');
const design = json('config/ui-v3-rebuild-design-contract-pr409.json');
const approvals = json('docs/migration/ui-v3-visual-approval-register.json');
const gate = json('docs/migration/post-pr419-review-gate-pr420.json');

check(handoff.status === 'implementation_complete' && handoff.implementation_pr === 419 && handoff.source_review_pr === 418, 'PR #419 handoff identity changed');
check(handoff.visual_artifacts?.required_capture_count === 16, 'PR #419 capture count changed');
check(handoff.visual_artifacts?.skipped_visual_audit_allowed === false && handoff.visual_artifacts?.horizontal_page_overflow_allowed === false, 'PR #419 visual gates changed');
check(handoff.visual_artifacts?.automated_capture_is_owner_approval === false, 'PR #419 capture became owner approval');
check(handoff.owner_approval_state?.accepted_desktop === 0 && handoff.owner_approval_state?.accepted_mobile === 0 && handoff.owner_approval_state?.ui_completion === false, 'PR #419 recorded owner approval or completion');
check(handoff.changes?.routes === 0 && handoff.changes?.canonical_data === 0 && handoff.changes?.public_machine_readable_data === 0 && handoff.changes?.metadata_contract === 0, 'PR #419 boundary changed');
check(handoff.next_work_item?.decision === 'review_gate_required' && handoff.boundaries?.pr_g_pre_authorized === false, 'PR #419 did not stop at review gate');

check(implementation.implementation_pr === 419 && implementation.phase === 'PR F', 'PR #419 contract identity changed');
check(implementation.visual_review?.required_capture_count === 16 && implementation.visual_review?.horizontal_page_overflow_allowed === false, 'PR #419 contract visual gate changed');
check(implementation.visual_review?.automated_capture_counts_as_owner_approval === false, 'PR #419 contract treats capture as approval');
check(JSON.stringify(implementation.guide_priority) === JSON.stringify(design.template_priority.guides), 'guide priority changed');

check(gate.review_pr === 420 && gate.source_pr === 419 && gate.status === 'reviewed_complete', 'PR #420 identity changed');
check(gate.source_merge_commit === '5e5857f2e0bd39b24dfc9afaef62cc9e9fa27eb7', 'PR #419 merge binding changed');
check(gate.source_implementation_head === '87fd5d9539b87c8cee46870b60eb745644129467', 'PR #419 implementation-head binding changed');
check(gate.binding_findings?.visual_review_run_id === 29599351044, 'visual run binding changed');
check(gate.binding_findings?.visual_artifact_id === 8414428588, 'visual artifact binding changed');
check(gate.binding_findings?.visual_artifact_digest === 'sha256:9b844bdd46b37b577d1c33f725a166f0682972ffc458f903066a567bef27216f', 'visual artifact digest changed');
check(gate.binding_findings?.contract_and_build_validation === 'success' && gate.binding_findings?.mandatory_desktop_mobile_visual_audit === 'success', 'successful review finding changed');
check(gate.binding_findings?.required_capture_count === 16 && gate.binding_findings?.completed_capture_count === 16, 'sixteen-state capture binding changed');
check(gate.binding_findings?.visual_failure_count === 0 && gate.binding_findings?.horizontal_overflow_failures === 0, 'visual failure binding changed');
check(gate.binding_findings?.automated_rendering_is_owner_approval === false, 'review treats rendering as approval');
check(gate.binding_findings?.owner_approved_desktop_templates === 0 && gate.binding_findings?.owner_approved_mobile_templates === 0, 'review records owner approval');
check(gate.binding_findings?.routes_changed === 0 && gate.binding_findings?.canonical_changes === 0 && gate.binding_findings?.public_machine_readable_changes === 0 && gate.binding_findings?.metadata_contract_changes === 0, 'review records protected changes');
check(gate.reviewed_visual_states?.length === 16, 'reviewed visual state count changed');
for (const state of gate.reviewed_visual_states ?? []) check(state.viewport_width === state.scroll_width, `${state.route} ${state.device}: exact-width binding changed`);

check(gate.decision?.next_pr === 421 && gate.decision?.next_phase === 'PR G' && gate.decision?.next_work_item === 'full_visual_closure', 'PR #421 decision changed');
check(gate.decision?.authorization === 'approved_owner_review_preparation' && gate.decision?.production_ui_change === false, 'PR #421 became a production redesign');
check(gate.decision?.route_change === false && gate.decision?.canonical_action === 'none' && gate.decision?.public_machine_readable_change === false && gate.decision?.owner_approval_change === false, 'PR #421 boundary changed');
check(gate.decision?.later_phases_pre_authorized === false && gate.decision?.exit_state_after_pr421 === 'AWAITING OWNER REVIEW', 'closure exit state changed');
check(gate.required_owner_review_states?.length === design.visual_review_matrix?.length, 'owner-review matrix does not match design contract count');
for (const expected of design.visual_review_matrix ?? []) {
  const actual = gate.required_owner_review_states?.find((state) => state.id === expected.id);
  check(Boolean(actual), `${expected.id}: owner-review state missing`);
  if (!actual) continue;
  check(actual.template === expected.template, `${expected.id}: template changed`);
  check(actual.route === expected.route, `${expected.id}: route changed`);
  check(actual.state === expected.state, `${expected.id}: state changed`);
  check(actual.viewport?.width === expected.viewport?.width && actual.viewport?.height === expected.viewport?.height, `${expected.id}: viewport changed`);
  check(actual.owner_approval_required === expected.owner_approval_required, `${expected.id}: approval requirement changed`);
  check(actual.device === (expected.viewport.width <= 390 ? 'mobile' : 'desktop'), `${expected.id}: device classification changed`);
}
check(gate.closure_requirements?.required_capture_count === 14 && gate.closure_requirements?.owner_review_worksheet === true, 'closure output requirements changed');
check(gate.closure_requirements?.horizontal_page_overflow_allowed === false && gate.closure_requirements?.skipped_audit_result === 'hard_failure', 'closure failure gates changed');
check(gate.closure_requirements?.automated_capture_counts_as_owner_approval === false && gate.closure_requirements?.approval_register_change_allowed_without_owner_decision === false, 'closure permits automatic approval');
check(gate.canonical_counts?.assets === 112 && gate.canonical_counts?.organizations === 107 && gate.canonical_counts?.events === 187 && gate.canonical_counts?.evidence === 559, 'canonical counts changed');

check(approvals.status === 'pending_implementation_and_review', 'approval register status changed');
check(approvals.current_counts?.accepted_desktop === 0 && approvals.current_counts?.accepted_mobile === 0, 'owner approval register changed');
check(approvals.current_counts?.pending_desktop === 6 && approvals.current_counts?.pending_mobile === 6, 'pending approval counts changed');
check(approvals.completion_rule?.automated_capture_counts_as_approval === false, 'approval register treats capture as approval');

for (const marker of [
  'Current mandatory authority: PR #420 Post-PR #419 Review Gate.',
  'PR #419 UI v3 Rebuild F — guides and secondary pages: complete',
  'PR #420 Post-PR #419 Review Gate: active; complete on merge',
  'PR #421 UI v3 Rebuild G — full visual closure: approved next',
  'Owner review: mandatory after PR #421'
]) check(read('AGENTS.md').includes(marker), `AGENTS missing ${marker}`);
for (const marker of [
  'Status: canonical execution schedule — PR #420 active review gate',
  'PR #419 UI v3 Rebuild F — guides and secondary pages: complete',
  'PR #420 Post-PR #419 Review Gate: active; complete on merge',
  'PR #421 UI v3 Rebuild G — full visual closure: approved next',
  'After PR #421, stop at `AWAITING OWNER REVIEW`'
]) check(read('docs/roadmap.md').includes(marker), `roadmap missing ${marker}`);

try {
  git('rev-parse', '--verify', 'origin/main');
  git('merge-base', '--is-ancestor', gate.source_merge_commit, 'HEAD');
  check(git('diff', '--name-only', 'origin/main...HEAD', '--', 'src/', 'public/', 'data/', 'config/', 'scripts/monitoring/').trim() === '', 'PR #420 contains implementation or canonical changes');
  for (const file of ['docs/migration/ui-v3-visual-approval-register.json','docs/migration/current-canonical-checkpoint.json','docs/migration/current-stats-history-checkpoint.json','docs/migration/registry-release-integrity-baseline.json']) check(git('hash-object', file) === git('rev-parse', `origin/main:${file}`), `${file}: protected content changed`);
} catch (error) { failures.push(`origin/main comparison failed: ${error.message}`); }

if (failures.length) {
  console.error('PR #420 post-PR #419 review gate validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log(JSON.stringify({ ok:true, review_pr:420, source_pr:419, source_merge_commit:gate.source_merge_commit, visual_review_run_id:gate.binding_findings.visual_review_run_id, reviewed_captures:16, next_pr:421, closure_captures:14, owner_approvals:0, canonical_changes:0, exit_state:'AWAITING OWNER REVIEW' }, null, 2));
