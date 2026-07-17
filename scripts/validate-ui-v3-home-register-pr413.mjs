import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const gate = readJson('docs/migration/post-pr411-review-gate-pr412.json');
const contract = readJson('config/ui-v3-home-register-pr413.json');
const handoff = readJson('docs/migration/ui-v3-home-register-pr413-handoff.json');
const approvals = readJson('docs/migration/ui-v3-visual-approval-register.json');
const home = readText('src/pages/index.astro');
const register = readText('src/pages/stablecoins/index.astro');
const homeStyles = readText('src/styles/home-v3.css');
const registerStyles = readText('src/styles/stablecoin-index.css');
const registerClient = readText('src/scripts/stablecoin-index.ts');
const capture = readText('scripts/capture-home-register-pr413.mjs');
const contact = readText('scripts/build-home-register-contact-sheet-pr413.mjs');

expect(gate.review_pr === 412 && gate.source_pr === 411, 'source review identity changed');
expect(gate.decision?.next_pr === 413 && gate.decision?.next_phase === 'PR C', 'PR #413 authorization changed');
expect(gate.decision?.next_work_item === 'home_and_stablecoin_register', 'wrong authorized work item');
expect(JSON.stringify(gate.decision?.authorized_routes) === JSON.stringify(['/', '/stablecoins/']), 'authorized route set changed');
expect(gate.decision?.routes_change === false && gate.decision?.canonical_action === 'none', 'route or canonical action authorized');
expect(gate.decision?.public_machine_readable_change === false && gate.decision?.owner_approval_change === false, 'public data or owner approval changes authorized');
expect(gate.decision?.later_phases_pre_authorized === false, 'later phases pre-authorized');
expect(gate.decision?.exit_state_after_pr413 === 'REVIEW GATE', 'exit state changed');

expect(contract.implementation_pr === 413 && contract.phase === 'PR C', 'PR #413 contract identity changed');
expect(JSON.stringify(contract.authorized_routes) === JSON.stringify(['/', '/stablecoins/']), 'implementation route scope changed');
expect(contract.home?.product_entrypoint === true && contract.home?.prominent_registry_search === true, 'home entrypoint contract changed');
expect(contract.home?.material_event_dates_separate_from_publication_dates === true, 'date semantic boundary changed');
expect(contract.home?.issue_watch_from_known_unknowns === true, 'issue-watch contract changed');
expect(contract.home?.oversized_decorative_masthead === false && contract.home?.invented_metrics === false, 'prohibited home direction authorized');
expect(contract.register?.page_size === 20, 'register page size changed');
expect(contract.register?.authorized_initial_render_max === 50, 'initial render maximum changed');
expect(contract.register?.bounded_rendering_required_above === 100, 'bounded rendering threshold changed');
expect(contract.register?.visible_filter_groups === true && contract.register?.active_filter_chips === true, 'filter-state contract changed');
expect(contract.register?.compare_selection_min === 2 && contract.register?.compare_selection_max === 4, 'comparison range changed');
expect(contract.visual_review?.required_states?.length === 10, 'required visual-state count changed');
expect(contract.visual_review?.skipped_audit_result === 'hard_failure', 'visual audit became skippable');
expect(contract.visual_review?.automated_capture_counts_as_owner_approval === false, 'capture became owner approval');
for (const [key, value] of Object.entries(contract.boundaries ?? {})) expect(value === false, `contract boundary ${key} must remain false`);

for (const marker of [
  'data-home-registry="pr413"',
  'Find a stablecoin, organization, or event',
  'class="home-registry-totals"',
  'class="home-explore"',
  'Latest material events',
  'Publication history',
  'id="issue-watch"',
  'getKnownUnknowns()',
  'registryUpdates',
  'Lifecycle is a recorded operating state. It is not a safety score'
]) expect(home.includes(marker), `home missing ${marker}`);
expect(!home.includes('class="home-masthead"'), 'oversized legacy home masthead remains');
expect(!home.includes('market capitalization') && !home.includes('circulating supply'), 'unsupported home metric appears');

for (const marker of [
  'data-register-version="pr413"',
  'const PAGE_SIZE = 20',
  'data-page-size={PAGE_SIZE}',
  'class="stablecoin-register-state"',
  'class="stablecoin-index-controls"',
  '<details class="stablecoin-index-filter" open>',
  'data-active-filters',
  'data-visible-range',
  'data-result-count',
  'data-comparison-panel',
  'data-no-results hidden',
  'data-pagination',
  'Desktop uses a structured table',
  'Compact screens use full-field cards'
]) expect(register.includes(marker), `register missing ${marker}`);
expect((register.match(/id: '(?:lifecycle|issuance|asset_class|reference|backing|stabilization)'/g) ?? []).length === 6, 'register filter-group count changed');
expect(!register.includes('terminal-stablecoin-filter-repair.css'), 'legacy filter repair remains imported');

for (const marker of ['.home-entry', '.home-registry-totals', '.home-explore-grid', '.home-dashboard', '.home-issue-list', '@media (max-width: 719px)']) expect(homeStyles.includes(marker), `home styles missing ${marker}`);
for (const marker of ['.stablecoin-register-header', '.stablecoin-index-controls', '.stablecoin-index-filter-grid', '.active-filter-chip', '.stablecoin-index-table', '.stablecoin-index-cards', '.stablecoin-index-comparison', '@media (max-width: 860px)', '@media (max-width: 719px)']) expect(registerStyles.includes(marker), `register styles missing ${marker}`);
expect(registerStyles.includes('font-size: 0.875rem') && registerStyles.includes('min-height: 44px'), 'register dense/touch minimums missing');
expect(!registerStyles.includes('font-size: 0.6rem') && !homeStyles.includes('font-size: 0.6rem'), 'prohibited undersized text remains');

for (const marker of ['URLSearchParams', 'params.set(\'page\'', 'visibleSlugs', 'selectedComparisons.size >= 4', 'noResults.hidden = matchCount !== 0']) expect(registerClient.includes(marker), `register client missing ${marker}`);
expect(registerClient.includes("root.dataset.pageSize ?? '20'"), 'register page-size runtime contract changed');

for (const marker of ['const devices = [', 'register-filtered', 'register-no-results', 'register-compare', 'expectedCount', 'horizontalOverflow', 'owner_approval: false']) expect(capture.includes(marker), `capture script missing ${marker}`);
expect(contact.includes('Automated review artifact only') && contact.includes('owner_approval:false'), 'contact sheet approval warning missing');

expect(handoff.status === 'implementation_complete' && handoff.implementation_pr === 413, 'PR #413 handoff status changed');
expect(JSON.stringify(handoff.authorized_routes) === JSON.stringify(['/', '/stablecoins/']), 'handoff route scope changed');
expect(handoff.register_bounds?.canonical_records === 112 && handoff.register_bounds?.page_size === 20, 'handoff register bounds changed');
expect(handoff.visual_artifacts?.required_capture_count === 10, 'handoff capture count changed');
expect(handoff.visual_artifacts?.skipped_visual_audit_allowed === false && handoff.visual_artifacts?.automated_capture_is_owner_approval === false, 'handoff visual safety changed');
expect(handoff.owner_approval_state?.changed === false && handoff.owner_approval_state?.accepted_desktop === 0 && handoff.owner_approval_state?.accepted_mobile === 0, 'handoff owner approval changed');
expect(handoff.owner_approval_state?.ui_completion === false, 'handoff declared completion');
expect(handoff.changes?.routes === 0 && handoff.changes?.canonical_data === 0 && handoff.changes?.public_machine_readable_data === 0, 'handoff records prohibited changes');
expect(handoff.next_work_item?.decision === 'review_gate_required', 'PR #413 did not stop at review gate');
expect(handoff.canonical_counts?.assets === 112 && handoff.canonical_counts?.evidence === 559 && handoff.canonical_counts?.evidence_relations === 559, 'canonical counts changed');

expect(approvals.current_counts?.accepted_desktop === 0 && approvals.current_counts?.accepted_mobile === 0, 'owner approval register changed');
expect(approvals.completion_rule?.automated_capture_counts_as_approval === false, 'approval register treats capture as approval');

try {
  git('rev-parse', '--verify', 'origin/main');
  const changedPages = git('diff', '--name-only', 'origin/main...HEAD', '--', 'src/pages/').split('\n').filter(Boolean).sort();
  expect(JSON.stringify(changedPages) === JSON.stringify(['src/pages/index.astro','src/pages/stablecoins/index.astro']), `unauthorized page changes: ${changedPages.join(', ')}`);
  const changedStyles = git('diff', '--name-only', 'origin/main...HEAD', '--', 'src/styles/').split('\n').filter(Boolean).sort();
  expect(JSON.stringify(changedStyles) === JSON.stringify(['src/styles/home-v3.css','src/styles/stablecoin-index.css']), `unauthorized style changes: ${changedStyles.join(', ')}`);
  const changedOtherSrc = git('diff', '--name-only', 'origin/main...HEAD', '--', 'src/').split('\n').filter(Boolean).filter((file) => !changedPages.includes(file) && !changedStyles.includes(file));
  expect(changedOtherSrc.length === 0, `unauthorized src changes: ${changedOtherSrc.join(', ')}`);
  expect(git('diff', '--name-only', 'origin/main...HEAD', '--', 'data/', 'public/').trim() === '', 'canonical or public data changed');
  for (const file of ['config/site-architecture.mjs','docs/migration/ui-v3-visual-approval-register.json','docs/migration/current-canonical-checkpoint.json','docs/migration/current-stats-history-checkpoint.json','docs/migration/registry-release-integrity-baseline.json']) expect(git('hash-object', file) === git('rev-parse', `origin/main:${file}`), `${file}: protected content changed`);
} catch (error) {
  failures.push(`origin/main comparison failed: ${error.message}`);
}

if (failures.length) {
  console.error('PR #413 home and register validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log(JSON.stringify({ ok:true, implementation_pr:413, routes:['/','/stablecoins/'], page_size:20, visual_states:10, canonical_changes:0, owner_approval_changes:0, next_authority:'review_gate_required' }, null, 2));
