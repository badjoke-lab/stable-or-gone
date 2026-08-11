import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const json = (file) => JSON.parse(read(file));
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const closeout = json('config/post-pr549-russia-usdt-guide-closeout.json');
const checkpoint = json('docs/migration/current-canonical-checkpoint.json');
const review = json('data/editorial-research/evidence-archive-payload-verification-batch-2-review-2026-08-09.json');
const amendment = read('docs/roadmap-amendments/2026-08-12-post-pr549-russia-usdt-guide-closeout.md');
const spec = read('docs/quality/post-pr549-russia-usdt-guide-closeout-spec.md');
const agents = read('AGENTS.md');
const governance = read('docs/spec-governance.md');
const roadmap = read('docs/roadmap.md');
const deployment = read('docs/deployment-policy.md');
const active = read('scripts/validate-active-workstream.mjs').trim();

expect(closeout.status === 'russia_guide_complete_review_gate_restored', 'closeout status changed');
expect(closeout.entry_main_commit === 'f99d9583105587625a409b959ac928de44248e7b', 'Russia Guide implementation main commit changed');
expect(closeout.guide_lane.authority_pr === 548, 'Russia Guide authority PR changed');
expect(closeout.guide_lane.implementation_pr === 549, 'Russia Guide implementation PR changed');
expect(closeout.guide_lane.authority_merge_commit === '04349e7960512c865866d4f3e036b3a9f1ae9c6a', 'Russia Guide authority merge changed');
expect(closeout.guide_lane.implementation_merge_commit === 'f99d9583105587625a409b959ac928de44248e7b', 'Russia Guide implementation merge changed');
expect(closeout.guide_lane.production_run === 31504346502, 'Russia Guide production run changed');
expect(closeout.guide_lane.production_job === 93822011080, 'Russia Guide production job changed');
expect(closeout.guide_lane.production_result === 'success', 'Russia Guide production result is not success');
expect(closeout.guide_lane.production_issue === 479, 'deployment history issue changed');
expect(closeout.guide_lane.production_report_step === 'success', 'deployment report step is not success');
expect(closeout.guide_lane.material_ui_change === false, 'closeout incorrectly records a material UI change');
expect(closeout.guide_lane.visual_acceptance_required === false, 'closeout unexpectedly requires a visual acceptance lane');

const expectedPublicFiles = [
  'src/pages/guides/russia-stablecoin-rules-2026/index.astro',
  'src/pages/guides/global-stablecoin-regulation-2026/index.astro',
  'src/data/guideCatalog.ts'
];
expect(JSON.stringify(closeout.guide_lane.authorized_public_files) === JSON.stringify(expectedPublicFiles), 'authorized public file set changed');

for (const outcome of [
  'russia_guide_current_through_2026_08_11',
  'global_regulation_guide_synchronized',
  'guide_revision_history_recorded',
  'btc_eth_usdt_statement_source_qualified',
  'no_permanent_three_asset_whitelist_claim',
  'no_universal_provider_level_usdt_availability_claim',
  'domestic_payment_prohibition_kept_distinct_from_trading_access',
  'watcherguru_excluded_from_public_source_list',
  'canonical_delta_zero'
]) expect(closeout.guide_lane.accepted_outcomes.includes(outcome), `missing accepted Guide outcome ${outcome}`);

const expected = closeout.canonical_checkpoint;
for (const [checkpointKey, expectedKey] of [
  ['assets', 'assets'], ['organizations', 'organizations'], ['relationships', 'relationships'], ['events', 'events'],
  ['evidence', 'evidence'], ['evidence_relations', 'evidence_relations'], ['reserve_reports', 'reserve_reports'],
  ['known_unknowns', 'known_unknowns'], ['regulatory_notes', 'regulatory_notes'], ['deployments', 'deployments'],
  ['legal_profiles', 'legal_profiles'], ['reserve_components', 'reserve_components'], ['income_profiles', 'income_profiles'],
  ['market_access_records', 'market_access_records'], ['archive_index_count', 'archive_recorded'],
  ['archive_not_recorded_count', 'archive_not_recorded'], ['detail_routes', 'detail_routes'],
  ['metadata_checked_routes', 'metadata_checked_routes']
]) expect(checkpoint.counts[checkpointKey] === expected[expectedKey], `${checkpointKey} changed during Russia Guide closeout`);
expect(expected.canonical_hash === 'sha256:f386c1043ca5e83cafbd88e99746d0609aab0154ed48de1970677758a66ed5fa', 'canonical hash baseline changed');
expect(expected.canonical_file_count === 466, 'canonical file count baseline changed');
expect(expected.last_canonical_changing_commit === '77e80dd3e2a62fea53ea0eabe91ef78a2d8ab1da', 'last canonical-changing commit changed');

const proposals = review.decisions.filter((row) => row.outcome === 'dated_exact_archive_proposal');
const noSafe = review.decisions.filter((row) => row.outcome === 'reviewed_no_safe_change');
expect(review.status === 'reviewed_complete', 'Evidence review is not complete');
expect(review.target_count === 10 && review.decisions.length === 10, 'Evidence review count changed');
expect(proposals.length === 8 && review.dated_exact_archive_proposal_count === 8, 'Evidence proposal count changed');
expect(noSafe.length === 2 && review.reviewed_no_safe_change_count === 2, 'Evidence no-safe-change count changed');
expect(review.canonical_change_authorized === false, 'Evidence review authorizes canonical change');
expect(review.next_boundary === 'REVIEW_GATE', 'Evidence review boundary changed');

expect(closeout.restored_lane.name === 'Evidence Archive Payload Verification Batch 2', 'restored lane changed');
expect(closeout.restored_lane.stage === 'REVIEW_GATE', 'Evidence REVIEW_GATE not restored');
expect(closeout.restored_lane.reviewed === 10, 'closeout review count changed');
expect(closeout.restored_lane.dated_exact_archive_proposals === 8, 'closeout proposal count changed');
expect(closeout.restored_lane.reviewed_no_safe_change === 2, 'closeout no-safe-change count changed');
expect(closeout.restored_lane.canonical_archive_additions_authorized === 0, 'closeout authorizes archive mutation');
expect(closeout.restored_lane.separate_implementation_authority_required === true, 'separate archive implementation authority boundary removed');
expect(closeout.restored_lane.automatic_promotion === false, 'automatic archive promotion enabled');

for (const text of [agents, governance, roadmap, deployment]) {
  expect(text.includes('Evidence Archive Payload Verification Batch 2'), 'forward governance missing Evidence Archive lane');
  expect(text.includes('REVIEW_GATE'), 'forward governance missing REVIEW_GATE');
  expect(text.includes('PR #548'), 'forward governance missing Russia Guide authority PR #548');
  expect(text.includes('PR #549'), 'forward governance missing Russia Guide implementation PR #549');
  expect(text.includes('31504346502'), 'forward governance missing Russia Guide production run');
  expect(text.includes('f99d9583105587625a409b959ac928de44248e7b'), 'forward governance missing Russia Guide implementation main commit');
}

expect(amendment.includes('Production deploy run: 31504346502 — success'), 'closeout amendment missing production run');
expect(amendment.includes('Canonical delta: 0'), 'closeout amendment missing canonical preservation');
expect(amendment.includes('maximum archive delta `+8/-8`'), 'closeout amendment missing bounded next-step archive delta');
expect(spec.includes('Any canonical archive promotion requires a separate reviewed and merged implementation authority'), 'closeout spec weakens archive boundary');
expect(spec.includes('Exit: `REVIEW_GATE`.'), 'closeout spec exit changed');
expect(active === "import './validate-post-pr549-russia-usdt-guide-closeout.mjs';", 'active validator is not wired to post-PR549 closeout');

if (failures.length) {
  console.error('Post-PR #549 Russia USDT Regulation Guide closeout validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log('Post-PR #549 Russia USDT Regulation Guide closeout validation passed.');
