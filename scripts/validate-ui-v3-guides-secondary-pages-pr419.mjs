import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const json = (file) => JSON.parse(read(file));
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

const files = {
  guideIndex: 'src/components/GuideEditorialIndex.astro',
  guideHeader: 'src/components/GuideArticleHeader.astro',
  editorialHeader: 'src/components/EditorialPageHeader.astro',
  baseLayout: 'src/layouts/BaseLayout.astro',
  methodology: 'src/pages/methodology/index.astro',
  about: 'src/pages/about/index.astro',
  compare: 'src/pages/compare/index.astro',
  access: 'src/pages/access-regulation/index.astro',
  timeline: 'src/pages/timeline/index.astro',
  stats: 'src/pages/stats/index.astro',
  styles: 'src/styles/secondary-pages-pr419.css',
  toolAliases: 'src/styles/secondary-tools-pr419-alias.css',
  mobileStyles: 'src/styles/mobile-accessibility-v3.css',
  spec: 'docs/quality/ui-v3-guides-secondary-pages-pr419.md',
  contract: 'config/ui-v3-guides-secondary-pages-pr419.json',
  handoff: 'docs/migration/ui-v3-guides-secondary-pages-pr419-handoff.json'
};
for (const file of Object.values(files)) check(fs.existsSync(path.join(root, file)), `missing file: ${file}`);
if (failures.length) { console.error(JSON.stringify({ ok:false, failures }, null, 2)); process.exit(1); }
const source = Object.fromEntries(Object.entries(files).map(([key, file]) => [key, read(file)]));
const contract = json(files.contract);
const handoff = json(files.handoff);
const gate = json('docs/migration/post-pr417-review-gate-pr418.json');
const design = json('config/ui-v3-rebuild-design-contract-pr409.json');
const approvals = json('docs/migration/ui-v3-visual-approval-register.json');

const expectedRoutes = ['/guides/','/guides/[article]/','/methodology/','/about/','/glossary/','/models/','/updates/','/maintenance/','/contact/','/support/','/compare/','/access-regulation/','/timeline/','/stats/'];
check(contract.implementation_pr === 419 && contract.source_review_pr === 418 && contract.phase === 'PR F', 'contract identity changed');
check(JSON.stringify(contract.authorized_route_families) === JSON.stringify(expectedRoutes), 'authorized route families changed');
check(JSON.stringify(contract.guide_priority) === JSON.stringify(design.template_priority.guides), 'guide priority changed');
check(contract.representative_visual_states?.length === 16, 'visual state matrix must contain sixteen states');
check(contract.visual_review?.required_capture_count === 16, 'sixteen captures are required');
check(contract.visual_review?.bounded_reading_and_results === true, 'bounded reading/results gate missing');
check(contract.visual_review?.responsive_table_strategy_required === true, 'responsive table gate missing');
check(contract.visual_review?.horizontal_page_overflow_allowed === false, 'horizontal overflow allowed');
check(contract.visual_review?.skipped_audit_result === 'hard_failure', 'skipped audit is not a hard failure');
check(contract.visual_review?.automated_capture_counts_as_owner_approval === false, 'automated capture became owner approval');
for (const route of ['/guides/','/guides/eu-stablecoin-access-after-mica/','/methodology/','/about/','/compare/','/access-regulation/','/timeline/','/stats/']) check(contract.representative_visual_states.filter((state) => state.route === route).length === 2, `${route}: desktop/mobile visual pair missing`);

check(handoff.status === 'implementation_complete' && handoff.implementation_pr === 419 && handoff.source_review_pr === 418, 'handoff identity changed');
check(JSON.stringify(handoff.authorized_route_families) === JSON.stringify(expectedRoutes), 'handoff route families changed');
check(handoff.visual_artifacts?.required_capture_count === 16, 'handoff capture count changed');
check(handoff.visual_artifacts?.skipped_visual_audit_allowed === false && handoff.visual_artifacts?.horizontal_page_overflow_allowed === false, 'handoff visual gates changed');
check(handoff.visual_artifacts?.automated_capture_is_owner_approval === false, 'handoff capture became owner approval');
check(handoff.owner_approval_state?.accepted_desktop === 0 && handoff.owner_approval_state?.accepted_mobile === 0 && handoff.owner_approval_state?.ui_completion === false, 'handoff records visual acceptance or completion');
check(handoff.changes?.routes === 0 && handoff.changes?.canonical_data === 0 && handoff.changes?.public_machine_readable_data === 0 && handoff.changes?.metadata_contract === 0, 'handoff records protected changes');
check(handoff.next_work_item?.decision === 'review_gate_required' && handoff.boundaries?.pr_g_pre_authorized === false, 'handoff does not stop at review gate');
check(handoff.canonical_counts?.assets === 112 && handoff.canonical_counts?.organizations === 107 && handoff.canonical_counts?.events === 187 && handoff.canonical_counts?.evidence === 559, 'canonical counts changed');

check(JSON.stringify(gate.decision?.authorized_route_families) === JSON.stringify(expectedRoutes), 'implementation scope differs from PR #418 review gate');
check(gate.decision?.next_pr === 419 && gate.decision?.next_phase === 'PR F', 'PR #418 authority changed');
check(gate.decision?.later_phases_pre_authorized === false, 'later phase pre-authorized');

check(source.guideIndex.includes("import '../styles/secondary-pages-pr419.css'"), 'guide index PR419 stylesheet import missing');
check(source.guideIndex.includes('data-secondary-version="pr419-guides"'), 'guide index marker missing');
check(source.guideIndex.includes('class="guide-index-nav"'), 'guide index category navigation missing');
check(source.guideIndex.includes('class="guide-index-table"') && source.guideIndex.includes('class="guide-index-mobile"'), 'guide index responsive representations missing');
check(source.guideHeader.includes("import '../styles/secondary-pages-pr419.css'"), 'guide article PR419 stylesheet import missing');
check(source.guideHeader.includes('data-secondary-version="pr419-guide-article"'), 'guide article marker missing');
check(source.guideHeader.includes('guide-article-meta') && source.guideHeader.includes('guide-article-update'), 'guide metadata/update surfaces missing');
check(source.editorialHeader.includes("import '../styles/secondary-pages-pr419.css'"), 'editorial PR419 stylesheet import missing');
check(source.editorialHeader.includes('data-secondary-version="pr419-editorial"'), 'editorial marker missing');
check(source.baseLayout.includes('data-guide-toc') && source.baseLayout.includes('data-longform-toc'), 'guide or longform ToC missing');
check(source.baseLayout.includes("buildContents('[data-guide-article]'"), 'guide ToC builder missing');
check(source.baseLayout.includes("buildContents('[data-longform-article]'"), 'longform ToC builder missing');
check(source.baseLayout.includes('Submit a correction') && source.baseLayout.includes('Methodology'), 'guide footer reference paths missing');

check(source.methodology.includes('<EditorialPageHeader') && source.methodology.includes('ValueStateMethodology'), 'methodology hierarchy changed');
check(source.about.includes('<EditorialPageHeader') && source.about.includes('support-callout'), 'about hierarchy changed');
check(source.compare.includes('data-compare-page') && source.compare.includes('data-compare-clear') && source.compare.includes('data-compare-empty'), 'comparison state controls missing');
check(source.compare.includes('/data/comparison.json') && source.compare.includes('Readiness') && source.compare.includes('Freshness'), 'comparison projection semantics missing');
check(source.access.includes('data-ar-explorer') && source.access.includes('data-ar-clear') && source.access.includes('data-ar-filter-groups'), 'access/regulation controls missing');
check(source.access.includes('/data/access-regulation-index.json') && source.access.includes('Record presence is context, not a verdict'), 'access/regulation absence semantics missing');
check(source.timeline.includes('data-timeline-page') && source.timeline.includes('data-timeline-clear') && source.timeline.includes('data-timeline-filter-groups'), 'timeline controls missing');
check(source.timeline.includes('/data/change-timeline.json') && source.timeline.includes('Date boundary'), 'timeline date semantics missing');
check(source.stats.includes('data-stats-foundation') && source.stats.includes('stats-methodology-notice') && source.stats.includes('stats-kpi-grid'), 'statistics hierarchy missing');
check(source.stats.includes('Read methodology') && source.stats.includes('not market rankings'), 'statistics boundaries missing');

for (const marker of ['pr419-guides','pr419-guide-article','pr419-editorial','.guide-article-toc','.longform-toc','.guide-index-nav','overflow-x: auto','@media (max-width: 719px)','@media (forced-colors: active)']) check(source.styles.includes(marker), `secondary page style marker missing: ${marker}`);
for (const marker of ['.compare-page[data-compare-page]','.ar-explorer[data-ar-explorer]','.timeline-page[data-timeline-page]','.stats-page[data-stats-foundation]','overflow-x: auto','@media (max-width: 719px)','@media (forced-colors: active)']) check(source.toolAliases.includes(marker), `secondary tool alias marker missing: ${marker}`);
check(source.mobileStyles.includes('@import "./secondary-pages-pr419.css";'), 'secondary page stylesheet is not globally loaded');
check(source.mobileStyles.includes('@import "./secondary-tools-pr419-alias.css";'), 'secondary tool aliases are not globally loaded');
check(!`${source.styles}\n${source.toolAliases}`.includes('linear-gradient(') && !`${source.styles}\n${source.toolAliases}`.includes('radial-gradient('), 'decorative gradient introduced');
const publicCopy = `${source.guideIndex}\n${source.guideHeader}\n${source.methodology}\n${source.about}\n${source.compare}\n${source.access}\n${source.timeline}\n${source.stats}`.toLowerCase();
for (const prohibited of ['safety score','transparency score','risk score','incident score','organization score','quality score']) check(!publicCopy.includes(prohibited), `prohibited score introduced: ${prohibited}`);

check(approvals.current_counts?.accepted_desktop === 0 && approvals.current_counts?.accepted_mobile === 0, 'owner approval register changed');
check(approvals.completion_rule?.automated_capture_counts_as_approval === false, 'automated capture counts as owner approval');
for (const marker of ['Current mandatory authority: PR #419 UI v3 Rebuild F — guides and secondary pages.','PR #418 Post-PR #417 Review Gate: complete','PR #419 UI v3 Rebuild F — guides and secondary pages: active; complete on merge','PR G full visual closure: blocked']) check(read('AGENTS.md').includes(marker), `AGENTS missing ${marker}`);
for (const marker of ['Status: canonical execution schedule — PR #419 active','PR #418 Post-PR #417 Review Gate: complete','PR #419 UI v3 Rebuild F — guides and secondary pages: active; complete on merge','After PR #419, stop at `REVIEW GATE`']) check(read('docs/roadmap.md').includes(marker), `roadmap missing ${marker}`);

try {
  git('rev-parse', '--verify', 'origin/main');
  const changedPages = git('diff', '--name-only', 'origin/main...HEAD', '--', 'src/pages/').split('\n').filter(Boolean);
  const allowedPagePrefixes = ['src/pages/guides/','src/pages/methodology/','src/pages/about/','src/pages/glossary/','src/pages/models/','src/pages/updates/','src/pages/maintenance/','src/pages/contact/','src/pages/support/','src/pages/compare/','src/pages/access-regulation/','src/pages/timeline/','src/pages/stats/'];
  check(changedPages.every((file) => allowedPagePrefixes.some((prefix) => file.startsWith(prefix))), `unauthorized page changed: ${changedPages.join(', ')}`);
  const changedComponents = git('diff', '--name-only', 'origin/main...HEAD', '--', 'src/components/').split('\n').filter(Boolean);
  const allowedComponents = new Set(['src/components/GuideEditorialIndex.astro','src/components/GuideArticleHeader.astro','src/components/EditorialPageHeader.astro']);
  check(changedComponents.every((file) => allowedComponents.has(file)), `unauthorized component changed: ${changedComponents.join(', ')}`);
  check(git('diff', '--name-only', 'origin/main...HEAD', '--', 'public/', 'data/').trim() === '', 'canonical or public data changed');
  for (const file of ['config/site-architecture.mjs','docs/migration/ui-v3-visual-approval-register.json','docs/migration/current-canonical-checkpoint.json','docs/migration/current-stats-history-checkpoint.json','docs/migration/registry-release-integrity-baseline.json']) check(git('hash-object', file) === git('rev-parse', `origin/main:${file}`), `${file}: protected content changed`);
} catch (error) { failures.push(`origin/main comparison failed: ${error.message}`); }

const result = {
  schema_version:'1.0',
  generated_at:new Date().toISOString(),
  ok:failures.length === 0,
  implementation_pr:419,
  representative_visual_states:16,
  canonical_record_changes:0,
  route_changes:0,
  public_machine_readable_changes:0,
  owner_approval_changes:0,
  failures
};
fs.mkdirSync(path.join(root, 'data/generated'), { recursive:true });
fs.writeFileSync(path.join(root, 'data/generated/ui-v3-guides-secondary-pages-pr419-validation.json'), `${JSON.stringify(result, null, 2)}\n`);
if (failures.length) { console.error(JSON.stringify(result, null, 2)); process.exit(1); }
console.log(JSON.stringify(result, null, 2));
