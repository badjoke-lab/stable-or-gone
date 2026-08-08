import './validate-guide-readability-remediation-2026-08-08.mjs';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const authority = readJson('config/post-pr531-authority-reconciliation.json');
const transition = readJson('docs/migration/post-pr531-authority-reconciliation.json');
const checkpoint = readJson('docs/migration/current-canonical-checkpoint.json');
const marketAccess = readJson('data/market-access-records-v1.json');
const agents = readText('AGENTS.md');
const governance = readText('docs/spec-governance.md');
const roadmap = readText('docs/roadmap.md');
const deployment = readText('docs/deployment-policy.md');
const readme = readText('README.md');
const amendment = readText('docs/roadmap-amendments/2026-08-08-post-pr531-authority-reconciliation.md');
const reconciliationSpec = readText('docs/quality/post-pr531-authority-reconciliation-spec.md');
const guideSpec = readText('docs/quality/guide-readability-remediation-2026-08-08-spec.md');
const active = readText('scripts/validate-active-workstream.mjs').trim();

const productionCommit = '210d68001fbd2560ffadf538fdb7cc9302b400a7';
const canonicalHash = 'sha256:57749955faa96d2bd836bac83ef41a0c5dc13f2342763dc4d975c588cd50c650';
const mergedIntervening = [524,525,526,527,528,529,530,531];
const acceptanceRoutes = [
  '/',
  '/guides/global-stablecoin-regulation-2026/',
  '/guides/uk-stablecoin-capital-rules-2026/'
];

expect(authority.status === 'active', 'reconciliation authority is not active');
expect(authority.production_checkpoint.commit === productionCommit, 'production checkpoint commit changed');
expect(authority.production_checkpoint.canonical_hash === canonicalHash, 'canonical hash changed');
expect(authority.production_checkpoint.convergence_attempt === 1, 'convergence attempt changed');
expect(JSON.stringify(authority.intervening_merged_prs) === JSON.stringify(mergedIntervening), 'intervening merged PR set changed');
expect(authority.completed_infrastructure_state.legacy_host_301 === 'complete', 'legacy-host migration is not recorded complete');
expect(authority.completed_infrastructure_state.legacy_redirect_implementation === 'pages_advanced_mode_worker', 'legacy redirect implementation changed');
expect(authority.completed_infrastructure_state.strict_migration_gate === 'enabled', 'strict migration gate is not enabled');

const current = authority.production_checkpoint.counts;
for (const [key, value] of Object.entries({assets:119,organizations:109,relationships:131,events:194,evidence:584,evidence_relations:584,reserve_reports:127,known_unknowns:352,regulatory_notes:9,deployments:186,legal_profiles:119,reserve_components:153,income_profiles:119,market_access_records:8,archive_recorded:462,archive_not_recorded:122,detail_routes:422,metadata_checked_routes:422})) {
  expect(current[key] === value, `${key} current count changed`);
}

expect(authority.visual_finding.status === 'blocking', 'production visual finding is no longer blocking');
expect(authority.visual_finding.scope === 'shared_guide_and_home_research_presentation', 'visual finding scope changed');
expect(authority.visual_finding.automated_green_does_not_override === true, 'automated-green override protection removed');
expect(JSON.stringify(authority.visual_finding.acceptance_routes) === JSON.stringify(acceptanceRoutes), 'visual acceptance routes changed');
expect(authority.visual_finding.defects.includes('persistent_desktop_left_toc_compresses_content'), 'left-TOC defect not recorded');
expect(authority.visual_finding.defects.includes('guide_support_and_footer_support_duplicate'), 'duplicate support defect not recorded');
expect(authority.visual_finding.defects.includes('home_research_secondary_grid_has_orphan_half_width_item'), 'home research composition defect not recorded');

expect(authority.immediate_authority.work_item === 'guide_and_research_surface_readability_remediation', 'immediate work item changed');
expect(authority.immediate_authority.spec === 'docs/quality/guide-readability-remediation-2026-08-08-spec.md', 'immediate work-item spec changed');
expect(authority.immediate_authority.mode === 'presentation_only_shared_system_repair', 'Guide repair authority mode changed');
expect(authority.immediate_authority.canonical_changes_allowed === false, 'Guide repair canonical changes enabled');
expect(authority.immediate_authority.guide_claim_changes_allowed === false, 'Guide claim changes enabled');
expect(authority.immediate_authority.production_verification_required_before_next_item === true, 'Guide production verification gate removed');

expect(authority.paused_later_authority.authorized_pr === 523, 'paused later PR changed');
expect(authority.paused_later_authority.mode === 'current_main_reconciliation_and_completion_only_after_guide_remediation', 'PR #523 later authority mode changed');
expect(authority.paused_later_authority.minimum_existing_main_checkpoint === productionCommit, 'PR #523 baseline checkpoint changed');
expect(authority.paused_later_authority.required_exit === 'REVIEW_GATE', 'PR #523 exit changed');
expect(authority.paused_later_authority.stale_head_merge_prohibited === true, 'stale PR #523 merge prohibition removed');
expect(authority.paused_later_authority.preserve_guide_remediation === true, 'Guide remediation preservation removed from PR #523');

for (const [key, value] of Object.entries({evidence:[584,585],evidence_relations:[584,585],market_access_records:[8,12],archive_recorded:[462,463],archive_not_recorded:[122,122],detail_routes:[422,422],metadata_checked_routes:[422,422]})) {
  expect(JSON.stringify(authority.pr523_transition[key]) === JSON.stringify(value), `${key} PR #523 transition changed`);
}

expect(checkpoint.counts.assets === 119 && checkpoint.counts.evidence === 584 && checkpoint.counts.evidence_relations === 584, 'entry canonical checkpoint changed');
expect(checkpoint.counts.market_access_records === 8 && checkpoint.counts.archive_index_count === 462, 'entry Market Access/archive checkpoint changed');
expect(checkpoint.counts.detail_routes === 422 && checkpoint.counts.metadata_checked_routes === 422, 'entry route checkpoint changed');
expect(Array.isArray(marketAccess) && marketAccess.length === 8, 'entry Market Access record count changed');
expect(marketAccess.every((row) => row.asset_id !== 'sog_st_jpysc'), 'JPYSC Market Access records appeared before PR #523 completion');

expect(transition.current_verified.production_commit === productionCommit, 'transition production commit changed');
expect(transition.authorized_immediate.work_item === 'guide_and_research_surface_readability_remediation', 'transition immediate UI work changed');
expect(JSON.stringify(transition.authorized_immediate.acceptance_routes) === JSON.stringify(acceptanceRoutes), 'transition acceptance routes changed');
expect(transition.authorized_after_ui_verification.pr === 523, 'transition later PR changed');
expect(transition.authorized_after_ui_verification.preserve_intervening_main_changes === true, 'intervening-main preservation disabled');
expect(transition.authorized_after_ui_verification.preserve_guide_remediation === true, 'Guide remediation preservation disabled');
expect(transition.authorized_after_ui_verification.required_exit === 'REVIEW_GATE', 'transition exit changed');

const requiredSchedule = [
  '2026-08-08 to 2026-08-09',
  '2026-08-08 to 2026-08-10',
  '2026-08-09 to 2026-08-11',
  '2026-08-10 to 2026-08-16',
  '2026-08-17 to 2026-08-23',
  '2026-08-24 to 2026-08-30',
  '2026-08-31 to 2026-09-06',
  '2026-09-07 to 2026-09-13'
];
for (const window of requiredSchedule) expect(roadmap.includes(window), `roadmap missing schedule window ${window}`);

expect(agents.includes('Immediate next implementation: Guide & Research Surface Readability Remediation'), 'AGENTS immediate Guide authority missing');
expect(agents.includes('PR #523 status: paused'), 'AGENTS PR #523 pause missing');
expect(agents.includes(productionCommit), 'AGENTS production checkpoint missing');
expect(governance.includes('2026-08-08-post-pr531-authority-reconciliation.md'), 'governance active amendment missing');
expect(governance.includes('guide-readability-remediation-2026-08-08-spec.md'), 'governance active Guide spec missing');
expect(governance.includes('automated build, contrast, geometry, screenshot, or workflow success cannot override a known visual defect'), 'governance visual override protection missing');
expect(roadmap.includes('Guides / editorial: maintenance-only after the current repair'), 'roadmap editorial maintenance boundary missing');
expect(roadmap.includes('Market Access expansion > Tier A dossier deepening > Record Growth > new UI'), 'roadmap next-cycle planning priority missing');
expect(deployment.includes('Legacy-host migration: complete'), 'deployment policy legacy migration completion missing');
expect(deployment.includes('public/_worker.js'), 'deployment policy Pages worker contract missing');
expect(deployment.includes(productionCommit), 'deployment policy production checkpoint missing');
expect(deployment.includes('/guides/global-stablecoin-regulation-2026/'), 'deployment Guide acceptance route missing');
expect(readme.includes('Immediate next implementation: Guide & Research Surface Readability Remediation'), 'README immediate workstream missing');
expect(readme.includes('PR #523: paused'), 'README PR #523 pause missing');
expect(amendment.includes('Blocking production visual finding'), 'roadmap amendment visual finding missing');
expect(amendment.includes('PR #523 is paused until the Guide remediation is merged and production-verified.'), 'roadmap amendment PR #523 pause missing');
expect(reconciliationSpec.includes('The Guide & Research Surface Readability Remediation is the immediate next implementation.'), 'reconciliation spec immediate UI authority missing');
expect(reconciliationSpec.includes('This is not implementation authority.'), 'planning-versus-authority boundary missing');
expect(guideSpec.includes('Left-rail TOC consumes reading width.'), 'Guide spec left-rail defect missing');
expect(guideSpec.includes('Automated checks are necessary but not sufficient.'), 'Guide spec direct-inspection rule missing');
expect(active === "import './validate-post-pr531-authority-reconciliation.mjs';", 'active-workstream validator wiring changed');

expect(authority.editorial_policy.mode_after_readability_repair === 'maintenance_only' && authority.editorial_policy.automatic_new_article_cadence === false, 'editorial maintenance-only boundary changed');
expect(authority.future_lanes_pre_authorized === false, 'future lanes became pre-authorized');
expect(authority.canonical_changes_allowed_in_this_reconciliation === false, 'canonical changes enabled in reconciliation');
expect(authority.public_product_changes_allowed_in_this_reconciliation === false, 'public product changes enabled in reconciliation');

if (failures.length) {
  console.error('Post-PR #531 authority reconciliation validation failed:');
  failures.forEach((failure) => console.error('- ' + failure));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  production_commit: productionCommit,
  canonical_hash: canonicalHash,
  recognized_merged_prs: mergedIntervening,
  immediate_work_item: authority.immediate_authority.work_item,
  visual_acceptance_routes: acceptanceRoutes,
  paused_later_pr: 523,
  current_market_access_records: 8,
  target_market_access_records_after_pr523: 12,
  legacy_host_301: 'complete',
  editorial_mode_after_repair: 'maintenance_only',
  required_exit_after_pr523: 'REVIEW_GATE'
}, null, 2));
