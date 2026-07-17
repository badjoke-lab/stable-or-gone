import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const shellHandoff = readJson('docs/migration/ui-v3-global-shell-navigation-pr411-handoff.json');
const shellContract = readJson('config/ui-v3-global-shell-pr411.json');
const design = readJson('config/ui-v3-rebuild-design-contract-pr409.json');
const approvals = readJson('docs/migration/ui-v3-visual-approval-register.json');
const gate = readJson('docs/migration/post-pr411-review-gate-pr412.json');

expect(shellHandoff.status === 'implementation_complete' && shellHandoff.implementation_pr === 411, 'PR #411 handoff status changed');
expect(shellHandoff.shell_marker === 'evidence-registry-pr411', 'shell marker changed');
expect(shellHandoff.visual_artifacts?.skipped_visual_audit_allowed === false, 'shell audit became skippable');
expect(shellHandoff.visual_artifacts?.automated_rendering_is_owner_approval === false, 'automated rendering became approval');
expect(shellHandoff.owner_approval_state?.changed === false, 'PR #411 changed owner approval');
expect(shellHandoff.owner_approval_state?.accepted_desktop === 0 && shellHandoff.owner_approval_state?.accepted_mobile === 0, 'PR #411 recorded owner acceptance');
expect(shellHandoff.owner_approval_state?.ui_completion === false, 'PR #411 declared UI completion');
expect(shellHandoff.changes?.routes === 0 && shellHandoff.changes?.canonical_data === 0 && shellHandoff.changes?.public_machine_readable_data === 0, 'PR #411 changed route or data boundaries');
expect(shellHandoff.changes?.page_templates_redesigned === 0, 'PR #411 redesigned page templates');
expect(shellHandoff.next_work_item?.decision === 'review_gate_required', 'PR #411 did not stop at review gate');

expect(shellContract.shell_marker === 'evidence-registry-pr411', 'shell contract changed');
expect(shellContract.typography?.body_min_px === 16 && shellContract.typography?.table_min_px === 14, 'shell typography minimum changed');
expect(shellContract.typography?.touch_target_min_px === 44, 'touch target minimum changed');
expect(shellContract.visual_artifacts?.skipped_audit_result === 'hard_failure', 'shell visual skip no longer hard-fails');
expect(shellContract.visual_artifacts?.automated_rendering_is_owner_approval === false, 'shell artifacts became approval');
expect(design.visual_failure_gates?.skipped_visual_audit_result === 'hard_failure', 'design visual skip no longer hard-fails');
expect(design.visual_failure_gates?.automated_rendering_counts_as_approval === false, 'design contract treats rendering as approval');
expect(approvals.current_counts?.accepted_desktop === 0 && approvals.current_counts?.accepted_mobile === 0, 'owner approval register changed');
expect(approvals.completion_rule?.automated_capture_counts_as_approval === false, 'approval register treats capture as approval');

expect(gate.review_pr === 412 && gate.source_pr === 411, 'PR #412 identity changed');
expect(gate.source_merge_commit === 'a9a37b79ca6b7313d310d206ad82dc19a273598f', 'PR #411 merge binding changed');
expect(gate.status === 'reviewed_complete' && gate.public_output === false, 'PR #412 status changed');
expect(gate.binding_findings?.visual_review_run_id === 29559515009, 'visual review run binding changed');
expect(gate.binding_findings?.contract_and_build_validation === 'success', 'contract/build finding changed');
expect(gate.binding_findings?.mandatory_desktop_mobile_visual_audit === 'success', 'visual-audit finding changed');
expect(gate.binding_findings?.automated_rendering_is_owner_approval === false, 'gate treats rendering as approval');
expect(gate.binding_findings?.owner_approved_desktop_templates === 0 && gate.binding_findings?.owner_approved_mobile_templates === 0, 'gate records owner acceptance');
expect(gate.decision?.next_pr === 413 && gate.decision?.next_phase === 'PR C', 'PR #413 authorization changed');
expect(gate.decision?.next_work_item === 'home_and_stablecoin_register', 'wrong next work item');
expect(JSON.stringify(gate.decision?.authorized_routes) === JSON.stringify(['/', '/stablecoins/']), 'authorized route set changed');
expect(gate.decision?.routes_change === false && gate.decision?.canonical_action === 'none', 'route/canonical change authorized');
expect(gate.decision?.public_machine_readable_change === false && gate.decision?.owner_approval_change === false, 'public data or approval change authorized');
expect(gate.decision?.later_phases_pre_authorized === false, 'later phases pre-authorized');
expect(gate.decision?.exit_state_after_pr413 === 'REVIEW GATE', 'PR #413 exit state changed');
expect(gate.register_requirements?.initial_primary_render_max === 50, 'initial register bound changed');
expect(gate.register_requirements?.bounded_rendering_required_above === 100, 'bounded rendering threshold changed');
expect(gate.visual_requirements?.skipped_audit_result === 'hard_failure', 'PR #413 visual audit can be skipped');
expect(gate.visual_requirements?.automated_capture_counts_as_owner_approval === false, 'PR #413 capture became approval');
expect(gate.canonical_counts?.assets === 112 && gate.canonical_counts?.evidence === 559 && gate.canonical_counts?.evidence_relations === 559, 'canonical counts changed');

for (const marker of ['PR #413 UI v3 Rebuild C — home and stablecoin register: approved next','PR D stablecoin dossier: blocked','PR #413 may redesign only `/` and `/stablecoins/`']) expect(readText('AGENTS.md').includes(marker), `AGENTS missing ${marker}`);
for (const marker of ['Status: canonical execution schedule — PR #412 active review gate','PR #413 — UI v3 Rebuild C: home and stablecoin register','After PR #413, stop at `REVIEW GATE`']) expect(readText('docs/roadmap.md').includes(marker), `roadmap missing ${marker}`);

try {
  git('rev-parse', '--verify', 'origin/main');
  expect(git('diff', '--name-only', 'origin/main...HEAD', '--', 'src/', 'public/', 'data/', 'config/', 'scripts/monitoring/').trim() === '', 'PR #412 contains implementation or data changes');
  for (const file of ['docs/migration/ui-v3-visual-approval-register.json','docs/migration/current-canonical-checkpoint.json','docs/migration/current-stats-history-checkpoint.json','docs/migration/registry-release-integrity-baseline.json']) expect(git('hash-object', file) === git('rev-parse', `origin/main:${file}`), `${file}: protected content changed`);
} catch (error) {
  failures.push(`origin/main comparison failed: ${error.message}`);
}

if (failures.length) {
  console.error('PR #412 post-PR #411 review gate validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log(JSON.stringify({ ok:true, review_pr:412, source_pr:411, visual_review_run_id:gate.binding_findings.visual_review_run_id, owner_approvals:0, next_pr:413, authorized_routes:gate.decision.authorized_routes, canonical_changes:0, exit_state:gate.decision.exit_state_after_pr413 }, null, 2));
