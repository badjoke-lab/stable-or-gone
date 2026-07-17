import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const gate = readJson('docs/migration/post-pr407-review-gate-pr408.json');
const contract = readJson('config/ui-v3-rebuild-design-contract-pr409.json');
const approvals = readJson('docs/migration/ui-v3-visual-approval-register.json');
const handoff = readJson('docs/migration/ui-v3-rebuild-design-contract-pr409-handoff.json');
const decision = gate.decisions?.ui_v3_rebuild_design_contract;

expect(gate.review_pr === 408 && gate.status === 'reviewed_complete', 'PR #408 review gate changed');
expect(decision?.issue === 281 && decision?.pr === 409, 'PR #409 issue/PR authorization changed');
expect(decision?.decision === 'approved_specification_and_failure_gates_only', 'PR #409 authorization changed');
expect(decision?.production_ui_change === false && decision?.canonical_action === 'none', 'PR #409 production/canonical boundary changed');
expect(decision?.next_work_item === 'REVIEW GATE', 'PR #409 must stop at review gate');

expect(contract.schema_version === '1.0', 'contract schema changed');
expect(contract.issue === 281 && contract.implementation_pr === 409 && contract.phase === 'PR A', 'contract identity changed');
expect(contract.direction?.name === 'modern_evidence_registry', 'design direction changed');
expect(contract.direction?.replaces === 'editorial_newspaper_first', 'replaced direction changed');
expect(contract.direction?.principles?.length === 7, 'design principle count changed');

const typography = contract.tokens?.typography ?? {};
expect(typography.body_min_px === 16, 'body minimum must be 16px');
expect(typography.table_body_min_px === 14, 'table body minimum must be 14px');
expect(typography.metadata_min_px === 13, 'metadata minimum must be 13px');
expect(typography.maximum_reading_width_ch === 74, 'reading width boundary changed');
expect(same(typography.prohibited_default_sizes_px, [9, 10, 11]), 'prohibited text sizes changed');

const spacing = contract.tokens?.spacing ?? {};
expect(spacing.touch_target_min_px === 44, 'touch target minimum must be 44px');
expect(spacing.card_padding_min_px === 16, 'card padding minimum must be 16px');
const density = contract.tokens?.density ?? {};
expect(density.unbounded_primary_index_dump === false, 'unbounded primary index dump was allowed');
expect(density.primary_index_max_initial_rows === 50, 'initial row bound changed');
expect(density.pagination_or_bounded_rendering_required_above_rows === 100, 'bounded-rendering threshold changed');

expect(contract.tokens?.surfaces?.border_only_flat_system_prohibited === true, 'flat border-only system was allowed');
expect(contract.tokens?.navigation?.giant_decorative_masthead_prohibited === true, 'giant decorative masthead was allowed');
for (const required of ['filter_option_visibility_required','selected_filter_state_required','active_filter_chips_required','result_count_required','clear_action_required','empty_state_required','keyboard_operation_required','focus_visible_required']) {
  expect(contract.tokens?.interaction?.[required] === true, `interaction requirement missing ${required}`);
}
expect(same(contract.tokens?.responsive?.required_widths_px, [320, 390, 768, 1280, 1440]), 'responsive width matrix changed');
expect(contract.tokens?.responsive?.horizontal_page_overflow_prohibited === true, 'page overflow was allowed');
expect(contract.tokens?.accessibility?.wcag_target === '2.2_AA', 'accessibility target changed');

expect(contract.sog_visual_components?.length === 10, 'SOG visual component count changed');
for (const required of ['lifecycle_status_summary','redemption_state','backing_and_reserve_structure','issuer_and_control_relationships','material_event_timeline','evidence_quality_summary','unresolved_questions']) {
  expect(contract.sog_visual_components?.includes(required), `SOG component missing ${required}`);
}

expect(contract.visual_review_matrix?.length === 14, 'visual review matrix must contain 14 states');
expect(new Set(contract.visual_review_matrix.map((row) => row.id)).size === 14, 'visual review IDs are not unique');
const templateSet = new Set(contract.visual_review_matrix.map((row) => row.template));
expect(same([...templateSet].sort(), ['events','guides','home','organizations','stablecoin_dossier','stablecoin_register']), 'required template set changed');
for (const row of contract.visual_review_matrix) {
  expect(Number.isInteger(row.viewport?.width) && Number.isInteger(row.viewport?.height), `${row.id}: invalid viewport`);
  expect(row.route?.startsWith('/'), `${row.id}: route must be absolute`);
}

const gates = contract.visual_failure_gates ?? {};
for (const required of ['screenshot_artifact_required','desktop_and_mobile_required','contact_sheet_required','manual_owner_approval_required','approval_record_required','ui_completion_requires_all_required_approvals']) {
  expect(gates[required] === true, `visual failure gate missing ${required}`);
}
expect(gates.visual_audit_may_be_skipped === false, 'visual audit may not be skipped');
expect(gates.skipped_visual_audit_result === 'hard_failure', 'skipped audit must be a hard failure');
expect(gates.automated_rendering_counts_as_approval === false, 'automated rendering became approval');
expect(gates.default_approval_status === 'pending', 'default approval status changed');

expect(contract.phase_sequence?.length === 7, 'UI phase count changed');
expect(contract.phase_sequence?.[0]?.phase === 'PR A' && contract.phase_sequence?.[0]?.status === 'active', 'PR A state changed');
expect(contract.phase_sequence?.slice(1).every((row) => row.status === 'blocked_review_gate'), 'later UI phase was pre-authorized');
expect(Object.values(contract.boundaries ?? {}).every((value) => value === false || value === true), 'contract boundary contains invalid state');
expect(contract.boundaries?.production_ui_changed === false, 'contract claims production UI change');
expect(contract.boundaries?.next_phase_pre_authorized === false, 'next phase was pre-authorized');
expect(contract.boundaries?.review_gate_after_pr409 === true, 'review gate after PR #409 removed');

expect(approvals.status === 'pending_implementation_and_review', 'approval register status changed');
expect(approvals.required_templates?.length === 6, 'approval register template count changed');
expect(new Set(approvals.required_templates.map((row) => row.template)).size === 6, 'approval templates are not unique');
for (const row of approvals.required_templates ?? []) {
  expect(row.desktop_status === 'pending' && row.mobile_status === 'pending', `${row.template}: approval must remain pending`);
  expect(row.desktop_artifact === null && row.mobile_artifact === null, `${row.template}: artifact recorded before implementation`);
  expect(row.reviewed_by === null && row.reviewed_at === null, `${row.template}: approval reviewer recorded before review`);
}
expect(approvals.completion_rule?.automated_capture_counts_as_approval === false, 'approval register accepts automated capture as approval');
expect(approvals.current_counts?.accepted_desktop === 0 && approvals.current_counts?.accepted_mobile === 0, 'PR #409 must not record visual acceptance');
expect(approvals.current_counts?.pending_desktop === 6 && approvals.current_counts?.pending_mobile === 6, 'pending approval counts changed');

expect(handoff.status === 'specification_complete' && handoff.implementation_pr === 409, 'handoff status changed');
expect(handoff.source_review_pr === 408 && handoff.source_review_merge_commit === '257d04851a02c2ca2208fb3e46282f6d67b0d994', 'handoff ancestry changed');
expect(handoff.contract_counts?.representative_capture_states === 14, 'handoff capture count changed');
expect(handoff.contract_counts?.required_owner_approved_templates === 6, 'handoff template count changed');
expect(handoff.failure_gates?.skipped_visual_audit_is_failure === true, 'handoff skipped-audit rule changed');
expect(handoff.approval_state?.ui_completion === false, 'handoff declares UI completion');
expect(handoff.changes?.production_ui_files === 0 && handoff.changes?.routes === 0, 'handoff claims production UI/route changes');
expect(handoff.changes?.canonical_data === 0 && handoff.changes?.public_machine_readable_data === 0, 'handoff claims data changes');
expect(handoff.phase_state?.pr_b === 'blocked_review_gate', 'PR B was pre-authorized');
expect(handoff.next_work_item?.decision === 'review_gate_required', 'PR #409 must stop at review gate');

try {
  git('rev-parse', '--verify', 'origin/main');
  const changedProduction = git('diff', '--name-only', 'origin/main...HEAD', '--', 'src/', 'public/', 'data/', 'scripts/monitoring/').split('\n').filter(Boolean);
  expect(changedProduction.length === 0, `PR #409 contains production/data changes: ${changedProduction.join(', ')}`);
  for (const file of [
    'docs/migration/current-canonical-checkpoint.json',
    'docs/migration/current-stats-history-checkpoint.json',
    'docs/migration/registry-release-integrity-baseline.json'
  ]) expect(git('hash-object', file) === git('rev-parse', `origin/main:${file}`), `${file}: checkpoint changed`);
} catch (error) {
  failures.push(`origin/main comparison failed: ${error.message}`);
}

for (const [file, markers] of [
  ['AGENTS.md', ['Issue #281 UI v3 rebuild: reopened', 'PR #409 UI v3 Rebuild A — design contract and failure gates: active; complete on merge', 'A skipped visual audit is a hard failure']],
  ['docs/roadmap.md', ['Status: canonical execution schedule — PR #409 active', 'Representative capture states: 14', 'After PR #409, stop at `REVIEW GATE`']],
  ['docs/quality/ui-v3-rebuild-design-contract-pr409.md', ['Stable or Gone is a modern evidence registry', 'A skipped visual audit is a failure, never a pass or neutral state', 'PR B — global shell and navigation: blocked']]
]) {
  const value = readText(file);
  for (const marker of markers) expect(value.includes(marker), `${file}: missing marker ${marker}`);
}

if (failures.length) {
  console.error('PR #409 UI v3 rebuild design contract validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  issue: 281,
  implementation_pr: 409,
  direction: contract.direction.name,
  capture_states: contract.visual_review_matrix.length,
  required_templates: approvals.required_templates.length,
  accepted_templates: 0,
  skipped_visual_audit: 'hard_failure',
  production_ui_changes: 0,
  canonical_changes: 0,
  next_authority: handoff.next_work_item.decision
}, null, 2));
