import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const handoff = readJson('docs/migration/ui-v3-home-register-pr413-handoff.json');
const implementationContract = readJson('config/ui-v3-home-register-pr413.json');
const design = readJson('config/ui-v3-rebuild-design-contract-pr409.json');
const approvals = readJson('docs/migration/ui-v3-visual-approval-register.json');
const gate = readJson('docs/migration/post-pr413-review-gate-pr414.json');

expect(handoff.status === 'implementation_complete' && handoff.implementation_pr === 413, 'PR #413 handoff status changed');
expect(handoff.phase === 'PR C', 'PR #413 phase changed');
expect(JSON.stringify(handoff.authorized_routes) === JSON.stringify(['/', '/stablecoins/']), 'PR #413 authorized route set changed');
expect(handoff.register_bounds?.canonical_records === 112, 'PR #413 canonical register count changed');
expect(handoff.register_bounds?.page_size === 20, 'PR #413 page size changed');
expect(handoff.register_bounds?.authorized_initial_render_max === 50, 'PR #413 authorized render maximum changed');
expect(handoff.register_bounds?.bounded_rendering_required_above === 100, 'PR #413 bounded-render threshold changed');
expect(handoff.register_bounds?.comparison_min === 2 && handoff.register_bounds?.comparison_max === 4, 'PR #413 comparison bounds changed');
expect(handoff.visual_artifacts?.required_capture_count === 10, 'PR #413 required capture count changed');
expect(handoff.visual_artifacts?.skipped_visual_audit_allowed === false, 'PR #413 visual audit became skippable');
expect(handoff.visual_artifacts?.automated_capture_is_owner_approval === false, 'PR #413 capture became owner approval');
expect(handoff.owner_approval_state?.changed === false, 'PR #413 changed owner approval');
expect(handoff.owner_approval_state?.accepted_desktop === 0 && handoff.owner_approval_state?.accepted_mobile === 0, 'PR #413 recorded owner acceptance');
expect(handoff.owner_approval_state?.ui_completion === false, 'PR #413 declared UI completion');
expect(handoff.changes?.routes === 0 && handoff.changes?.canonical_data === 0 && handoff.changes?.public_machine_readable_data === 0, 'PR #413 changed route or canonical boundaries');
expect(handoff.changes?.metadata_contract === 0, 'PR #413 changed metadata contract');
expect(handoff.next_work_item?.decision === 'review_gate_required', 'PR #413 did not stop at review gate');
expect(handoff.boundaries?.pr_d_pre_authorized === false, 'PR #413 pre-authorized PR D');

expect(implementationContract.implementation_pr === 413 && implementationContract.phase === 'PR C', 'PR #413 implementation contract identity changed');
expect(implementationContract.register?.page_size === 20, 'PR #413 contract page size changed');
expect(implementationContract.visual_review?.required_capture_count === 10, 'PR #413 contract visual matrix changed');
expect(implementationContract.visual_review?.skipped_audit_result === 'hard_failure', 'PR #413 contract visual skip no longer hard-fails');
expect(implementationContract.visual_review?.automated_capture_is_owner_approval === false, 'PR #413 contract treats capture as approval');

expect(design.template_priority?.stablecoin_dossier?.[0] === 'current_status', 'dossier priority no longer starts with current status');
expect(JSON.stringify(design.template_priority?.stablecoin_dossier) === JSON.stringify(['current_status','redemption','backing_reserves','issuer_control','material_events','deployments','unresolved_questions','evidence','technical_fields']), 'design dossier priority changed');
expect(design.visual_failure_gates?.skipped_visual_audit_result === 'hard_failure', 'design visual skip no longer hard-fails');
expect(design.visual_failure_gates?.automated_rendering_counts_as_approval === false, 'design contract treats rendering as approval');
expect(approvals.current_counts?.accepted_desktop === 0 && approvals.current_counts?.accepted_mobile === 0, 'owner approval register changed');
expect(approvals.completion_rule?.automated_capture_counts_as_approval === false, 'approval register treats capture as approval');

expect(gate.review_pr === 414 && gate.source_pr === 413, 'PR #414 identity changed');
expect(gate.source_merge_commit === '8771de6ad5fc79310a638455f5be24b27af20eb3', 'PR #413 merge binding changed');
expect(gate.source_implementation_head === '6df1719295070d206e800a92e024284e4e6a6011', 'PR #413 implementation head binding changed');
expect(gate.status === 'reviewed_complete' && gate.public_output === false, 'PR #414 status changed');
expect(gate.binding_findings?.visual_review_run_id === 29573553479, 'visual review run binding changed');
expect(gate.binding_findings?.visual_artifact_id === 8404110345, 'visual artifact binding changed');
expect(gate.binding_findings?.contract_and_build_validation === 'success', 'contract/build finding changed');
expect(gate.binding_findings?.mandatory_desktop_mobile_visual_audit === 'success', 'visual-audit finding changed');
expect(gate.binding_findings?.required_capture_count === 10 && gate.binding_findings?.completed_capture_count === 10, 'ten-state capture binding changed');
expect(gate.binding_findings?.visual_failure_count === 0 && gate.binding_findings?.horizontal_overflow_failures === 0, 'visual failure binding changed');
expect(gate.binding_findings?.automated_rendering_is_owner_approval === false, 'gate treats rendering as approval');
expect(gate.binding_findings?.owner_approved_desktop_templates === 0 && gate.binding_findings?.owner_approved_mobile_templates === 0, 'gate records owner acceptance');
expect(gate.binding_findings?.routes_changed === 0 && gate.binding_findings?.canonical_changes === 0 && gate.binding_findings?.public_machine_readable_changes === 0, 'gate records route or canonical changes');
expect(gate.decision?.next_pr === 415 && gate.decision?.next_phase === 'PR D', 'PR #415 authorization changed');
expect(gate.decision?.next_work_item === 'stablecoin_dossier', 'wrong next work item');
expect(gate.decision?.authorized_route_family === '/stablecoin/[slug]/', 'authorized dossier route family changed');
expect(gate.decision?.route_change === false && gate.decision?.canonical_action === 'none', 'route/canonical change authorized');
expect(gate.decision?.public_machine_readable_change === false && gate.decision?.owner_approval_change === false, 'public data or approval change authorized');
expect(gate.decision?.later_phases_pre_authorized === false, 'later phases pre-authorized');
expect(gate.decision?.exit_state_after_pr415 === 'REVIEW GATE', 'PR #415 exit state changed');
expect(JSON.stringify(gate.dossier_priority) === JSON.stringify(design.template_priority.stablecoin_dossier), 'review gate dossier hierarchy diverges from design contract');
expect(gate.representative_visual_states?.length === 6, 'PR #415 representative visual matrix must contain six states');
for (const route of ['/stablecoin/usdc/','/stablecoin/ust/','/stablecoin/busd/']) {
  expect(gate.representative_visual_states.filter((state) => state.route === route).length === 2, `${route}: desktop/mobile visual pair missing`);
}
expect(gate.visual_requirements?.required_capture_count === 6, 'PR #415 required capture count changed');
expect(gate.visual_requirements?.horizontal_page_overflow_allowed === false, 'PR #415 permits horizontal overflow');
expect(gate.visual_requirements?.skipped_audit_result === 'hard_failure', 'PR #415 visual audit can be skipped');
expect(gate.visual_requirements?.automated_capture_counts_as_owner_approval === false, 'PR #415 capture became approval');
expect(gate.canonical_counts?.assets === 112 && gate.canonical_counts?.evidence === 559 && gate.canonical_counts?.evidence_relations === 559, 'canonical counts changed');

for (const marker of [
  'Current mandatory authority: PR #414 Post-PR #413 Review Gate.',
  'PR #413 UI v3 Rebuild C — home and stablecoin register: complete',
  'PR #414 Post-PR #413 Review Gate: active; complete on merge',
  'PR #415 UI v3 Rebuild D — stablecoin dossier: approved next',
  'PR E events and organizations: blocked'
]) expect(readText('AGENTS.md').includes(marker), `AGENTS missing ${marker}`);

for (const marker of [
  'Status: canonical execution schedule — PR #414 active review gate',
  'PR #413 UI v3 Rebuild C — home and stablecoin register: complete',
  'PR #414 Post-PR #413 Review Gate: active; complete on merge',
  'PR #415 UI v3 Rebuild D — stablecoin dossier: approved next',
  'After PR #415, stop at `REVIEW GATE`'
]) expect(readText('docs/roadmap.md').includes(marker), `roadmap missing ${marker}`);

try {
  git('rev-parse', '--verify', 'origin/main');
  expect(git('merge-base', '--is-ancestor', gate.source_merge_commit, 'HEAD') === '', 'PR #413 merge commit is not an ancestor');
  expect(git('diff', '--name-only', 'origin/main...HEAD', '--', 'src/', 'public/', 'data/', 'config/', 'scripts/monitoring/').trim() === '', 'PR #414 contains implementation or canonical changes');
  for (const file of [
    'docs/migration/ui-v3-visual-approval-register.json',
    'docs/migration/current-canonical-checkpoint.json',
    'docs/migration/current-stats-history-checkpoint.json',
    'docs/migration/registry-release-integrity-baseline.json'
  ]) expect(git('hash-object', file) === git('rev-parse', `origin/main:${file}`), `${file}: protected content changed`);
} catch (error) {
  failures.push(`origin/main comparison failed: ${error.message}`);
}

if (failures.length) {
  console.error('PR #414 post-PR #413 review gate validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  review_pr: 414,
  source_pr: 413,
  source_merge_commit: gate.source_merge_commit,
  visual_review_run_id: gate.binding_findings.visual_review_run_id,
  captures: gate.binding_findings.completed_capture_count,
  visual_failures: gate.binding_findings.visual_failure_count,
  owner_approvals: 0,
  next_pr: 415,
  authorized_route_family: gate.decision.authorized_route_family,
  canonical_changes: 0,
  exit_state: gate.decision.exit_state_after_pr415
}, null, 2));
