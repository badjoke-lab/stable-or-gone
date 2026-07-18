import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const json = (file) => JSON.parse(read(file));
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

const register = json('docs/migration/ui-v3-visual-approval-register.json');
const approval = json('docs/migration/ui-v3-owner-approval-pr422.json');
const closure = json('docs/migration/ui-v3-full-visual-closure-pr421.json');

check(register.status === 'accepted_complete', 'approval register is not complete');
check(register.current_counts?.accepted_desktop === 6, 'desktop approvals must equal six');
check(register.current_counts?.accepted_mobile === 6, 'mobile approvals must equal six');
check(register.current_counts?.pending_desktop === 0 && register.current_counts?.pending_mobile === 0, 'pending approvals remain');
check(register.current_counts?.rejected_desktop === 0 && register.current_counts?.rejected_mobile === 0, 'rejected approvals remain');
check(register.owner_decision?.decision === 'accepted', 'owner decision is not accepted');
check(register.owner_decision?.recorded_at === '2026-07-18', 'owner decision date changed');
check(register.owner_decision?.ui_completion === true, 'UI completion is not true');
check(register.owner_decision?.issue_close_authorized === true, 'issue close is not authorized');
check(register.review_source?.pull_request === 421, 'review source PR changed');
check(register.review_source?.completed_capture_count === 14, 'closure capture count changed');
check(register.review_source?.visual_failures === 0 && register.review_source?.horizontal_overflow_failures === 0, 'closure contains visual failures');
check(register.completion_rule?.automated_capture_counts_as_approval === false, 'automated capture became approval');

for (const item of register.required_templates ?? []) {
  check(item.desktop_status === 'accepted' && item.mobile_status === 'accepted', `${item.template}: acceptance incomplete`);
  check(item.reviewed_by === 'badjoke-lab', `${item.template}: reviewer changed`);
  check(item.reviewed_at === '2026-07-18', `${item.template}: review date changed`);
  check(Boolean(item.desktop_artifact) && Boolean(item.mobile_artifact), `${item.template}: artifact missing`);
}

check(approval.status === 'accepted_complete', 'owner approval record is not complete');
check(approval.reviewed_by === 'badjoke-lab' && approval.reviewed_at === '2026-07-18', 'owner approval identity changed');
check(approval.counts?.accepted_desktop === 6 && approval.counts?.accepted_mobile === 6, 'owner approval counts changed');
check(approval.completion?.ui_v3_complete === true && approval.completion?.issue_close_authorized === true, 'completion authorization changed');
check(approval.completion?.production_ui_change === false && approval.completion?.route_change === false && approval.completion?.canonical_change === false && approval.completion?.public_machine_readable_change === false, 'protected boundary changed');
check(closure.status === 'awaiting_owner_review' && closure.required_capture_count === 14, 'source closure record changed');

const agents = read('AGENTS.md');
check(agents.includes('Current mandatory authority: completed UI v3 owner approval and closeout.'), 'AGENTS authority is not closed');
check(agents.includes('PR #422 owner approval and completion record: complete'), 'AGENTS does not mark PR #422 complete');
check(agents.includes('Owner-approved desktop templates: 6 / 6'), 'AGENTS desktop approval count missing');
check(agents.includes('Owner-approved mobile templates: 6 / 6'), 'AGENTS mobile approval count missing');
check(agents.includes('UI completion: true'), 'AGENTS completion missing');
check(agents.includes('Active UI v3 implementation workstream: none'), 'AGENTS still exposes an active UI v3 workstream');
check(!agents.includes('AWAITING OWNER REVIEW'), 'AGENTS still awaits owner review');

const roadmap = read('docs/roadmap.md');
check(roadmap.includes('Status: UI v3 complete'), 'roadmap is not marked complete');
check(roadmap.includes('PR #422 owner approval record: complete'), 'roadmap does not mark PR #422 complete');
check(roadmap.includes('Accepted desktop templates: 6'), 'roadmap desktop count missing');
check(roadmap.includes('Accepted mobile templates: 6'), 'roadmap mobile count missing');
check(roadmap.includes('UI completion: true'), 'roadmap completion missing');
check(roadmap.includes('Active UI v3 implementation workstream: none'), 'roadmap still exposes an active UI v3 workstream');

try {
  git('rev-parse', '--verify', 'origin/main');
  check(git('diff', '--name-only', 'origin/main...HEAD', '--', 'src/', 'public/', 'data/', 'config/').trim() === '', 'closeout contains production, canonical, public, or config changes');
  for (const file of [
    'config/site-architecture.mjs',
    'docs/migration/current-canonical-checkpoint.json',
    'docs/migration/current-stats-history-checkpoint.json',
    'docs/migration/registry-release-integrity-baseline.json',
    'docs/migration/ui-v3-visual-approval-register.json'
  ]) check(git('hash-object', file) === git('rev-parse', `origin/main:${file}`), `${file}: protected content changed`);
} catch (error) {
  failures.push(`protected-boundary validation failed: ${error.message}`);
}

if (failures.length) {
  console.error(JSON.stringify({ ok: false, workstream: 'ui-v3-closeout', failures }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  status: 'accepted_complete',
  accepted_desktop: 6,
  accepted_mobile: 6,
  pending_desktop: 0,
  pending_mobile: 0,
  ui_completion: true,
  issue_close_authorized: true,
  active_ui_workstream: 'none',
  production_ui_changes: 0,
  canonical_changes: 0
}, null, 2));
