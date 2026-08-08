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
const spec = readText('docs/quality/post-pr531-authority-reconciliation-spec.md');
const active = readText('scripts/validate-active-workstream.mjs').trim();

const productionCommit = '210d68001fbd2560ffadf538fdb7cc9302b400a7';
const canonicalHash = 'sha256:57749955faa96d2bd836bac83ef41a0c5dc13f2342763dc4d975c588cd50c650';
const mergedIntervening = [524,525,526,527,528,529,530,531];

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

expect(authority.current_authority.authorized_pr === 523, 'authorized PR changed');
expect(authority.current_authority.mode === 'current_main_reconciliation_and_completion_only', 'PR #523 authority mode changed');
expect(authority.current_authority.required_main_checkpoint_at_or_after === productionCommit, 'PR #523 minimum main checkpoint changed');
expect(authority.current_authority.required_exit === 'REVIEW_GATE', 'PR #523 exit changed');
expect(authority.current_authority.stale_head_merge_prohibited === true, 'stale PR #523 merge prohibition removed');

for (const [key, value] of Object.entries({evidence:[584,585],evidence_relations:[584,585],market_access_records:[8,12],archive_recorded:[462,463],archive_not_recorded:[122,122],detail_routes:[422,422],metadata_checked_routes:[422,422]})) {
  expect(JSON.stringify(authority.pr523_transition[key]) === JSON.stringify(value), `${key} PR #523 transition changed`);
}

expect(checkpoint.counts.assets === 119 && checkpoint.counts.evidence === 584 && checkpoint.counts.evidence_relations === 584, 'entry canonical checkpoint changed');
expect(checkpoint.counts.market_access_records === 8 && checkpoint.counts.archive_index_count === 462, 'entry Market Access/archive checkpoint changed');
expect(checkpoint.counts.detail_routes === 422 && checkpoint.counts.metadata_checked_routes === 422, 'entry route checkpoint changed');
expect(Array.isArray(marketAccess) && marketAccess.length === 8, 'entry Market Access record count changed');
expect(marketAccess.every((row) => row.asset_id !== 'sog_st_jpysc'), 'JPYSC Market Access records appeared before PR #523 completion');

expect(transition.current_verified.production_commit === productionCommit, 'transition production commit changed');
expect(transition.authorized_next.pr === 523, 'transition authorized PR changed');
expect(transition.authorized_next.preserve_intervening_main_changes === true, 'intervening-main preservation disabled');
expect(transition.authorized_next.required_exit === 'REVIEW_GATE', 'transition exit changed');

const requiredSchedule = [
  '2026-08-08 to 2026-08-09',
  '2026-08-08 to 2026-08-10',
  '2026-08-10 to 2026-08-16',
  '2026-08-17 to 2026-08-23',
  '2026-08-24 to 2026-08-30',
  '2026-08-31 to 2026-09-06',
  '2026-09-07 to 2026-09-13'
];
for (const window of requiredSchedule) expect(roadmap.includes(window), `roadmap missing schedule window ${window}`);

expect(agents.includes('Current authorized implementation: PR #523 current-main reconciliation and completion only'), 'AGENTS current authority missing');
expect(agents.includes(productionCommit), 'AGENTS production checkpoint missing');
expect(governance.includes('2026-08-08-post-pr531-authority-reconciliation.md'), 'governance active amendment missing');
expect(governance.includes('post-pr531-authority-reconciliation-spec.md'), 'governance active specification missing');
expect(roadmap.includes('Guides / editorial: maintenance-only'), 'roadmap editorial maintenance boundary missing');
expect(roadmap.includes('Market Access expansion > Tier A dossier deepening > Record Growth > new UI'), 'roadmap next-cycle planning priority missing');
expect(deployment.includes('Legacy-host migration: complete'), 'deployment policy legacy migration completion missing');
expect(deployment.includes(productionCommit), 'deployment policy production checkpoint missing');
expect(readme.includes('PR #523 current-main reconciliation and completion'), 'README current workstream missing');
expect(amendment.includes('The old PR #523 head must not be merged as-is.'), 'roadmap amendment stale-head gate missing');
expect(spec.includes('This is not implementation authority.'), 'planning-versus-authority boundary missing');
expect(active === "import './validate-post-pr531-authority-reconciliation.mjs';", 'active-workstream validator wiring changed');

expect(authority.editorial_policy.mode === 'maintenance_only' && authority.editorial_policy.automatic_new_article_cadence === false, 'editorial maintenance-only boundary changed');
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
  authorized_next_pr: 523,
  authorized_mode: authority.current_authority.mode,
  current_market_access_records: 8,
  target_market_access_records: 12,
  legacy_host_301: 'complete',
  editorial_mode: 'maintenance_only',
  required_exit: 'REVIEW_GATE'
}, null, 2));
