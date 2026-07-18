import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const json = (file) => JSON.parse(read(file));
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const failures = [];
const check = (value, message) => { if (!value) failures.push(message); };

const design = json('config/ui-v3-rebuild-design-contract-pr409.json');
const reviewGate = json('docs/migration/post-pr419-review-gate-pr420.json');
const closure = json('config/ui-v3-full-visual-closure-pr421.json');
const handoff = json('docs/migration/ui-v3-full-visual-closure-pr421.json');
const approvals = json('docs/migration/ui-v3-visual-approval-register.json');

check(closure.implementation_pr === 421 && closure.source_review_pr === 420 && closure.phase === 'PR G', 'closure contract identity changed');
check(closure.status === 'active_owner_review_preparation' && closure.production_ui_change === false, 'PR #421 became a production UI phase');
check(closure.exit_state === 'AWAITING OWNER REVIEW', 'closure exit state changed');
check(closure.required_capture_count === 14 && closure.required_capture_count === design.visual_review_matrix?.length, 'closure capture count differs from design contract');
check(closure.state_source === 'config/ui-v3-rebuild-design-contract-pr409.json#visual_review_matrix', 'closure state source changed');
check(closure.hard_gates?.horizontal_page_overflow_allowed === false, 'closure allows horizontal overflow');
check(closure.hard_gates?.automated_capture_counts_as_owner_approval === false, 'automated capture became approval');
check(closure.owner_review?.generated_status === 'pending', 'generated owner status is not pending');
check(closure.owner_review?.accepted_desktop === 0 && closure.owner_review?.accepted_mobile === 0, 'closure records owner acceptance');
check(closure.owner_review?.reviewer === null && closure.owner_review?.reviewed_at === null, 'closure invented a reviewer or timestamp');
check(closure.owner_review?.automatic_decision_allowed === false && closure.owner_review?.completion_allowed_without_explicit_owner_decision === false, 'closure permits automatic completion');
check(closure.boundaries?.routes_changed === false && closure.boundaries?.canonical_data_changed === false && closure.boundaries?.public_machine_readable_data_changed === false, 'closure boundary changed');
check(closure.boundaries?.owner_approval_register_changed === false && closure.boundaries?.automatic_owner_approval === false && closure.boundaries?.ui_completion_declared === false, 'closure approval boundary changed');
check(closure.boundaries?.later_phase_exists === false, 'a phase after PR G was introduced');

check(reviewGate.decision?.next_pr === 421 && reviewGate.decision?.next_phase === 'PR G' && reviewGate.decision?.next_work_item === 'full_visual_closure', 'PR #420 authority changed');
check(reviewGate.decision?.authorization === 'approved_owner_review_preparation' && reviewGate.decision?.production_ui_change === false, 'PR #420 authorized production redesign');
check(reviewGate.decision?.exit_state_after_pr421 === 'AWAITING OWNER REVIEW', 'PR #420 exit state changed');
check(reviewGate.required_owner_review_states?.length === 14, 'PR #420 owner-review matrix changed');
check(reviewGate.closure_requirements?.automated_capture_counts_as_owner_approval === false, 'PR #420 treats capture as approval');

for (const expected of design.visual_review_matrix ?? []) {
  const actual = reviewGate.required_owner_review_states.find((state) => state.id === expected.id);
  check(Boolean(actual), `${expected.id}: closure state missing from review gate`);
  if (!actual) continue;
  check(actual.template === expected.template && actual.state === expected.state, `${expected.id}: template or state changed`);
  check(actual.viewport?.width === expected.viewport?.width && actual.viewport?.height === expected.viewport?.height, `${expected.id}: viewport changed`);
  check(actual.owner_approval_required === expected.owner_approval_required, `${expected.id}: approval requirement changed`);
}

check(handoff.status === 'awaiting_owner_review' && handoff.implementation_pr === 421 && handoff.source_review_pr === 420, 'closure handoff identity changed');
check(handoff.production_ui_change === false && handoff.required_capture_count === 14, 'closure handoff scope changed');
check(handoff.visual_artifacts?.automated_capture_is_owner_approval === false, 'handoff treats capture as approval');
check(handoff.owner_approval_state?.accepted_desktop === 0 && handoff.owner_approval_state?.accepted_mobile === 0, 'handoff records owner acceptance');
check(handoff.owner_approval_state?.pending_desktop === 6 && handoff.owner_approval_state?.pending_mobile === 6, 'handoff pending counts changed');
check(handoff.owner_approval_state?.reviewer === null && handoff.owner_approval_state?.reviewed_at === null && handoff.owner_approval_state?.ui_completion === false, 'handoff invented review completion');
check(handoff.changes?.production_ui === 0 && handoff.changes?.routes === 0 && handoff.changes?.canonical_data === 0 && handoff.changes?.public_machine_readable_data === 0 && handoff.changes?.owner_approval_register === 0, 'handoff records protected changes');
check(handoff.next_action?.decision === 'explicit_owner_review_required' && handoff.next_action?.automatic_result_allowed === false, 'handoff bypasses explicit owner review');
check(handoff.boundaries?.automated_owner_approval === false && handoff.boundaries?.ui_completion_declared === false && handoff.boundaries?.later_phase_exists === false, 'handoff completion boundary changed');

check(approvals.status === 'pending_implementation_and_review', 'visual approval register status changed');
check(approvals.current_counts?.accepted_desktop === 0 && approvals.current_counts?.accepted_mobile === 0, 'visual approval register records acceptance');
check(approvals.current_counts?.pending_desktop === 6 && approvals.current_counts?.pending_mobile === 6, 'visual approval pending counts changed');
check(approvals.completion_rule?.automated_capture_counts_as_approval === false, 'approval register treats automated capture as approval');

const capture = read('scripts/capture-full-visual-closure-pr421.mjs');
const builder = read('scripts/build-full-visual-closure-review-pr421.mjs');
for (const marker of ['visual_review_matrix', 'register-desktop-filtered', 'register-mobile-filtered', 'register-empty', 'horizontal overflow', 'owner_status: \'pending\'', 'implementation_pr: 421']) check(capture.includes(marker), `capture script missing ${marker}`);
for (const marker of ['owner-review.json', 'owner-review.html', 'automated_capture_counts_as_approval:false', 'owner_decision:\'\'', 'status:\'awaiting_owner_review\'']) check(builder.includes(marker), `review builder missing ${marker}`);

for (const marker of [
  'Current mandatory authority: PR #421 UI v3 Rebuild G — full visual closure.',
  'PR #420 Post-PR #419 Review Gate: complete',
  'PR #421 UI v3 Rebuild G — full visual closure: active',
  'Exit state: AWAITING OWNER REVIEW',
  'UI completion: false'
]) check(read('AGENTS.md').includes(marker), `AGENTS missing ${marker}`);
for (const marker of [
  'Status: canonical execution schedule — PR #421 active full visual closure',
  'PR #420 Post-PR #419 Review Gate: complete',
  'PR #421 UI v3 Rebuild G — full visual closure: active',
  'Exit state: `AWAITING OWNER REVIEW`',
  'UI completion: false'
]) check(read('docs/roadmap.md').includes(marker), `roadmap missing ${marker}`);

try {
  git('rev-parse', '--verify', 'origin/main');
  for (const item of closure.merge_lineage ?? []) git('merge-base', '--is-ancestor', item.commit, 'HEAD');
  check(git('diff', '--name-only', 'origin/main...HEAD', '--', 'src/', 'public/', 'data/').trim() === '', 'PR #421 contains production UI, public, or canonical changes');
  const changedConfig = git('diff', '--name-only', 'origin/main...HEAD', '--', 'config/').split('\n').filter(Boolean);
  check(changedConfig.every((file) => file === 'config/ui-v3-full-visual-closure-pr421.json'), `unauthorized config changed: ${changedConfig.join(', ')}`);
  for (const file of [
    'config/site-architecture.mjs',
    'docs/migration/ui-v3-visual-approval-register.json',
    'docs/migration/current-canonical-checkpoint.json',
    'docs/migration/current-stats-history-checkpoint.json',
    'docs/migration/registry-release-integrity-baseline.json'
  ]) check(git('hash-object', file) === git('rev-parse', `origin/main:${file}`), `${file}: protected content changed`);
} catch (error) {
  failures.push(`merge-lineage or protected-boundary validation failed: ${error.message}`);
}

if (failures.length) {
  console.error(JSON.stringify({ ok:false, implementation_pr:421, status:'failed', failures }, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({ ok:true, implementation_pr:421, phase:'PR G', required_captures:14, production_ui_changes:0, canonical_changes:0, owner_approvals:0, ui_completion:false, exit_state:'AWAITING OWNER REVIEW' }, null, 2));
