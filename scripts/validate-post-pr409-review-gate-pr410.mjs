import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const contract = readJson('config/ui-v3-rebuild-design-contract-pr409.json');
const handoff = readJson('docs/migration/ui-v3-rebuild-design-contract-pr409-handoff.json');
const approvals = readJson('docs/migration/ui-v3-visual-approval-register.json');
const gate = readJson('docs/migration/post-pr409-review-gate-pr410.json');

expect(handoff.status === 'specification_complete' && handoff.implementation_pr === 409, 'PR #409 handoff changed');
expect(handoff.direction === 'modern_evidence_registry', 'design direction changed');
expect(handoff.contract_counts?.representative_capture_states === 14, 'capture-state count changed');
expect(handoff.contract_counts?.required_owner_approved_templates === 6, 'owner template count changed');
expect(handoff.failure_gates?.skipped_visual_audit_is_failure === true, 'skipped visual audit no longer fails');
expect(handoff.failure_gates?.automated_rendering_is_approval === false, 'automated rendering became approval');
expect(handoff.changes?.production_ui_files === 0 && handoff.changes?.canonical_data === 0, 'PR #409 changed implementation or canonical data');
expect(handoff.next_work_item?.decision === 'review_gate_required', 'PR #409 did not stop at review gate');
expect(contract.tokens?.typography?.body_min_px >= 16, 'body minimum below contract');
expect(contract.tokens?.typography?.table_body_min_px >= 14, 'table minimum below contract');
expect(contract.tokens?.spacing?.touch_target_min_px >= 44, 'touch target below contract');
expect(contract.visual_failure_gates?.skipped_visual_audit_result === 'hard_failure', 'visual skip result changed');
expect(contract.visual_failure_gates?.automated_rendering_counts_as_approval === false, 'automated rendering counts as approval');
expect(approvals.current_counts?.accepted_desktop === 0 && approvals.current_counts?.accepted_mobile === 0, 'owner approvals were recorded before implementation');

expect(gate.review_pr === 410 && gate.source_pr === 409, 'PR #410 identity changed');
expect(gate.status === 'reviewed_complete' && gate.public_output === false, 'PR #410 status changed');
expect(gate.decision?.next_pr === 411 && gate.decision?.next_phase === 'PR B', 'PR #411 authorization changed');
expect(gate.decision?.next_work_item === 'global_shell_and_navigation', 'wrong next work item');
expect(gate.decision?.authorization === 'approved_bounded_implementation', 'PR #411 not bounded');
expect(gate.decision?.routes_change === false, 'route changes authorized');
expect(gate.decision?.canonical_action === 'none', 'canonical action authorized');
expect(gate.decision?.public_machine_readable_change === false, 'public machine-readable change authorized');
expect(gate.decision?.owner_approval_change === false, 'owner approval changes authorized');
expect(gate.decision?.later_phases_pre_authorized === false, 'later UI phases pre-authorized');
expect(gate.decision?.exit_state_after_pr411 === 'REVIEW GATE', 'PR #411 exit state changed');
expect(gate.canonical_counts?.assets === 112, 'asset count changed');
expect(gate.canonical_counts?.evidence === 559 && gate.canonical_counts?.evidence_relations === 559, 'Evidence counts changed');

for (const marker of ['PR #411 UI v3 Rebuild B — global shell and navigation: approved next','PR C home and stablecoin register: blocked','PR #411 must stop at `REVIEW GATE`']) expect(readText('AGENTS.md').includes(marker), `AGENTS missing ${marker}`);
for (const marker of ['PR #411 — UI v3 Rebuild B: global shell and navigation','Home, register, dossier, events, organizations, guides, and later UI phases remain blocked']) expect(readText('docs/roadmap.md').includes(marker), `roadmap missing ${marker}`);

try {
  git('rev-parse', '--verify', 'origin/main');
  expect(git('diff', '--name-only', 'origin/main...HEAD', '--', 'src/', 'public/', 'data/', 'config/', 'scripts/monitoring/').trim() === '', 'PR #410 contains implementation or data changes');
  for (const file of ['docs/migration/current-canonical-checkpoint.json','docs/migration/current-stats-history-checkpoint.json','docs/migration/registry-release-integrity-baseline.json']) expect(git('hash-object', file) === git('rev-parse', `origin/main:${file}`), `${file}: immutable checkpoint changed`);
} catch (error) {
  failures.push(`origin/main comparison failed: ${error.message}`);
}

if (failures.length) {
  console.error('PR #410 review gate validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log(JSON.stringify({ ok: true, review_pr: 410, source_pr: 409, next_pr: 411, authorized_work: gate.decision.next_work_item, canonical_changes: 0, exit_state: gate.decision.exit_state_after_pr411 }, null, 2));
