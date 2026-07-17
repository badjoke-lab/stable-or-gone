import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { globalNavigationGroups, utilityNavigation } from '../config/site-architecture.mjs';

const root = process.cwd();
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const review = readJson('docs/migration/post-pr409-review-gate-pr410.json');
const design = readJson('config/ui-v3-rebuild-design-contract-pr409.json');
const shellContract = readJson('config/ui-v3-global-shell-pr411.json');
const handoff = readJson('docs/migration/ui-v3-global-shell-navigation-pr411-handoff.json');
const approvals = readJson('docs/migration/ui-v3-visual-approval-register.json');
const layout = readText('src/layouts/BaseLayout.astro');
const shell = readText('src/styles/shell.css');
const typography = readText('src/styles/terminal-typography-contract.css');
const finalCascade = readText('src/styles/text-readability-v3.css');
const contactSheet = readText('scripts/build-shell-contact-sheet-pr411.mjs');

expect(review.review_pr === 410 && review.source_pr === 409, 'source review identity changed');
expect(review.decision?.next_pr === 411, 'PR #410 did not authorize PR #411');
expect(review.decision?.next_work_item === 'global_shell_and_navigation', 'wrong authorized work item');
expect(review.decision?.routes_change === false, 'route change was authorized');
expect(review.decision?.canonical_action === 'none', 'canonical action was authorized');
expect(review.decision?.owner_approval_change === false, 'owner approval change was authorized');
expect(review.decision?.later_phases_pre_authorized === false, 'later phases were pre-authorized');
expect(review.decision?.exit_state_after_pr411 === 'REVIEW GATE', 'PR #411 exit state changed');

expect(design.direction?.name === 'modern_evidence_registry', 'design direction changed');
expect(design.visual_failure_gates?.skipped_visual_audit_result === 'hard_failure', 'skipped visual audit no longer fails');
expect(design.visual_failure_gates?.automated_rendering_counts_as_approval === false, 'automated rendering became approval');

expect(shellContract.implementation_pr === 411 && shellContract.phase === 'PR B', 'shell contract identity changed');
expect(shellContract.shell_marker === 'evidence-registry-pr411', 'shell marker changed');
expect(shellContract.typography?.body_min_px === 16, 'body minimum changed');
expect(shellContract.typography?.table_min_px === 14, 'table minimum changed');
expect(shellContract.typography?.touch_target_min_px === 44, 'touch target minimum changed');
expect(shellContract.search?.action === '/stablecoins/' && shellContract.search?.query_parameter === 'q', 'registry search contract changed');
expect(shellContract.visual_artifacts?.skipped_audit_result === 'hard_failure', 'shell visual audit may be skipped');
expect(shellContract.visual_artifacts?.automated_rendering_is_owner_approval === false, 'shell capture became owner approval');
expect(shellContract.boundaries?.routes_changed === false && shellContract.boundaries?.canonical_data_changed === false, 'shell contract allows route/canonical changes');
expect(shellContract.boundaries?.page_templates_redesigned === false && shellContract.boundaries?.pr_c_pre_authorized === false, 'later template work was authorized');

expect(globalNavigationGroups.length === 3, 'global navigation group count changed');
expect(JSON.stringify(globalNavigationGroups.map((group) => group.id)) === JSON.stringify(['registry','learn','project']), 'global navigation group order changed');
expect(globalNavigationGroups[0].items.length === 7 && globalNavigationGroups[1].items.length === 3 && globalNavigationGroups[2].items.length === 4, 'global navigation membership changed');
expect(utilityNavigation.length === 2, 'utility navigation count changed');

for (const marker of [
  'data-shell="evidence-registry-pr411"',
  'globalNavigationGroups.map',
  'utilityNavigation.map',
  'class="site-search" action="/stablecoins/" method="get"',
  'name="q"',
  'class="grouped-navigation"',
  'class="mobile-navigation"',
  'class="site-footer-navigation"',
  'aria-current={isCurrent(item.href) ? \'page\' : undefined}',
  "event.key !== 'Escape'",
  'navigation.contains(event.target)'
]) expect(layout.includes(marker), `BaseLayout missing ${marker}`);
expect(!layout.includes('site-primary-navigation'), 'legacy flat primary navigation remains');
expect(!layout.includes('site-about-menu'), 'legacy About disclosure remains');

for (const marker of [
  '--sog-surface-selected:',
  '--sog-font-interface:',
  '--sog-font-data:',
  '.site-header {',
  '.site-search-control',
  '.grouped-navigation',
  '.mobile-navigation-panel',
  '.site-footer-navigation',
  'min-height: 44px',
  '@media (max-width: 1120px)',
  '@media (max-width: 719px)',
  '@media (prefers-reduced-motion: reduce)',
  '@media (forced-colors: active)'
]) expect(shell.includes(marker), `shell.css missing ${marker}`);
expect(shell.includes('font-size: 1rem;'), 'shell body 16px minimum missing');
expect(shell.includes('font-size: max(0.875rem, 14px);'), 'shell 14px control/table minimum missing');
expect(!shell.includes('font-size: 10px'), 'prohibited 10px shell type found');

expect(typography.includes('--sog-font-interface: ui-sans-serif'), 'shared interface font is not system sans');
expect(typography.includes('--sog-font-data: ui-monospace'), 'data font is not system monospace');
expect(typography.includes('html body {\n  font-size: 1rem;'), 'shared body minimum is below 16px');
expect(typography.includes('font-size: 0.875rem !important;'), 'shared table minimum is below 14px');
expect(!typography.includes('font-size: 0.84rem;'), 'legacy undersized mobile body type remains');

for (const marker of [
  'PR #411 final shell cascade',
  'html body .site-header[data-shell="evidence-registry-pr411"] .site-search',
  'html body .site-footer .site-footer-inner',
  'grid-template-columns: minmax(280px, 0.85fr) minmax(680px, 2.15fr) !important',
  'html body .site-footer .site-footer-navigation',
  'grid-template-columns: repeat(4, minmax(140px, 1fr)) !important',
  'word-break: normal !important',
  '@media (max-width: 860px)'
]) expect(finalCascade.includes(marker), `final shell cascade missing ${marker}`);

expect(contactSheet.includes('Automated capture only'), 'contact sheet owner-approval warning missing');
expect(contactSheet.includes('shell-contact-sheet-pr411.html'), 'contact sheet output missing');
expect(contactSheet.includes('horizontal_overflow'), 'contact sheet overflow gate missing');

expect(handoff.status === 'implementation_complete' && handoff.implementation_pr === 411, 'PR #411 handoff status changed');
expect(handoff.shell_marker === 'evidence-registry-pr411', 'handoff shell marker changed');
expect(handoff.changes?.routes === 0 && handoff.changes?.canonical_data === 0 && handoff.changes?.public_machine_readable_data === 0, 'handoff records forbidden data/route changes');
expect(handoff.changes?.page_templates_redesigned === 0, 'handoff records template redesign');
expect(handoff.owner_approval_state?.changed === false && handoff.owner_approval_state?.ui_completion === false, 'handoff changed owner approval or completion');
expect(handoff.next_work_item?.decision === 'review_gate_required', 'PR #411 did not stop at review gate');
expect(handoff.canonical_counts?.assets === 112 && handoff.canonical_counts?.evidence === 559 && handoff.canonical_counts?.evidence_relations === 559, 'canonical counts changed');

expect(approvals.current_counts?.accepted_desktop === 0 && approvals.current_counts?.accepted_mobile === 0, 'owner approvals were changed');
expect(approvals.status === 'pending_implementation_and_review', 'approval register status changed');
expect(approvals.completion_rule?.automated_capture_counts_as_approval === false, 'automated capture became owner approval');

for (const marker of ['PR #411 UI v3 Rebuild B — global shell and navigation: active; complete on merge','PR C home and stablecoin register: blocked','PR #411 must stop at `REVIEW GATE`']) expect(readText('AGENTS.md').includes(marker), `AGENTS missing ${marker}`);
for (const marker of ['Status: canonical execution schedule — PR #411 active','Shell marker: evidence-registry-pr411','Home, register, dossier, events, organizations, guides, and later UI phases remain blocked']) expect(readText('docs/roadmap.md').includes(marker), `roadmap missing ${marker}`);

try {
  git('rev-parse', '--verify', 'origin/main');
  const changedPages = git('diff', '--name-only', 'origin/main...HEAD', '--', 'src/pages/').split('\n').filter(Boolean);
  expect(changedPages.length === 0, `page templates changed: ${changedPages.join(', ')}`);
  const changedData = git('diff', '--name-only', 'origin/main...HEAD', '--', 'data/', 'public/').split('\n').filter(Boolean);
  expect(changedData.length === 0, `canonical/public data changed: ${changedData.join(', ')}`);
  expect(git('hash-object', 'config/site-architecture.mjs') === git('rev-parse', 'origin/main:config/site-architecture.mjs'), 'route/navigation architecture source changed');
  expect(git('hash-object', 'docs/migration/ui-v3-visual-approval-register.json') === git('rev-parse', 'origin/main:docs/migration/ui-v3-visual-approval-register.json'), 'owner approval register changed');
  for (const file of ['docs/migration/current-canonical-checkpoint.json','docs/migration/current-stats-history-checkpoint.json','docs/migration/registry-release-integrity-baseline.json']) expect(git('hash-object', file) === git('rev-parse', `origin/main:${file}`), `${file}: immutable checkpoint changed`);
  const changedSrc = git('diff', '--name-only', 'origin/main...HEAD', '--', 'src/').split('\n').filter(Boolean).sort();
  const allowedSrc = ['src/layouts/BaseLayout.astro','src/styles/shell.css','src/styles/terminal-typography-contract.css','src/styles/text-readability-v3.css'].sort();
  expect(JSON.stringify(changedSrc) === JSON.stringify(allowedSrc), `unexpected src changes: ${changedSrc.join(', ')}`);
} catch (error) {
  failures.push(`origin/main comparison failed: ${error.message}`);
}

if (failures.length) {
  console.error('PR #411 global shell validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log(JSON.stringify({ ok:true, implementation_pr:411, shell_marker:handoff.shell_marker, navigation_groups:globalNavigationGroups.length, utility_links:utilityNavigation.length, routes_changed:0, canonical_changes:0, owner_approval_changed:false, next_authority:handoff.next_work_item.decision }, null, 2));
