import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const json = (file) => JSON.parse(read(file));
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const closeout = json('config/post-pr552-evidence-archive-batch2-closeout.json');
const checkpoint = json('docs/migration/current-canonical-checkpoint.json');
const statsCheckpoint = json('docs/migration/current-stats-history-checkpoint.json');
const release = json('docs/migration/registry-release-integrity-baseline.json');
const result = json('docs/migration/evidence-archive-payload-verification-batch-2-implementation-pr552.json');
const authority = json('config/evidence-archive-payload-verification-batch-2-implementation-authority.json');
const amendment = read('docs/roadmap-amendments/2026-08-12-post-pr552-evidence-archive-batch2-closeout.md');
const spec = read('docs/quality/post-pr552-evidence-archive-batch2-closeout-spec.md');
const agents = read('AGENTS.md');
const governance = read('docs/spec-governance.md');
const roadmap = read('docs/roadmap.md');
const deployment = read('docs/deployment-policy.md');
const active = read('scripts/validate-active-workstream.mjs').trim();

expect(closeout.status === 'evidence_archive_batch2_implementation_complete_review_gate_restored', 'closeout status changed');
expect(closeout.entry_main_commit === 'ada106dd3bf9899adc441c968fa36978ae515a5c', 'PR552 implementation main commit changed');
expect(closeout.archive_lane.authority_pr === 551, 'archive authority PR changed');
expect(closeout.archive_lane.implementation_pr === 552, 'archive implementation PR changed');
expect(closeout.archive_lane.authority_merge_commit === 'df6fa1dec1f4ad5172848d412781d1e95a0dfebf', 'archive authority merge changed');
expect(closeout.archive_lane.implementation_merge_commit === 'ada106dd3bf9899adc441c968fa36978ae515a5c', 'archive implementation merge changed');
expect(closeout.archive_lane.production_run === 31514472928, 'production run changed');
expect(closeout.archive_lane.production_job === 93856057816, 'production job changed');
expect(closeout.archive_lane.production_result === 'success', 'production result is not success');
expect(closeout.archive_lane.production_issue === 479, 'deployment history issue changed');
expect(closeout.archive_lane.production_report_step === 'success', 'deployment report step is not success');
expect(closeout.archive_lane.material_ui_change === false, 'closeout incorrectly records a material UI change');
expect(closeout.archive_lane.visual_acceptance_required === false, 'closeout unexpectedly requires visual acceptance');
expect(closeout.archive_lane.reviewed === 10, 'reviewed count changed');
expect(closeout.archive_lane.exact_archive_additions === 8, 'exact archive addition count changed');
expect(closeout.archive_lane.reviewed_no_safe_change === 2, 'no-safe-change count changed');
expect(closeout.archive_lane.archive_recorded_before === 463 && closeout.archive_lane.archive_recorded_after === 471, 'archive recorded boundary changed');
expect(closeout.archive_lane.archive_not_recorded_before === 122 && closeout.archive_lane.archive_not_recorded_after === 114, 'archive not-recorded boundary changed');

const expected = closeout.canonical_checkpoint;
expect(checkpoint.checkpoint_id === expected.checkpoint_id, 'current canonical checkpoint ID differs from closeout contract');
for (const [checkpointKey, expectedKey] of [
  ['assets', 'assets'], ['organizations', 'organizations'], ['relationships', 'relationships'], ['events', 'events'],
  ['evidence', 'evidence'], ['evidence_relations', 'evidence_relations'], ['reserve_reports', 'reserve_reports'],
  ['known_unknowns', 'known_unknowns'], ['regulatory_notes', 'regulatory_notes'], ['deployments', 'deployments'],
  ['legal_profiles', 'legal_profiles'], ['stable_asset_relationships', 'stable_asset_relationships'],
  ['reserve_components', 'reserve_components'], ['income_profiles', 'income_profiles'],
  ['market_access_records', 'market_access_records'], ['archive_index_count', 'archive_recorded'],
  ['archive_not_recorded_count', 'archive_not_recorded'], ['detail_routes', 'detail_routes'],
  ['metadata_checked_routes', 'metadata_checked_routes']
]) expect(checkpoint.counts?.[checkpointKey] === expected[expectedKey], `${checkpointKey} differs from closeout contract`);
expect(expected.canonical_hash === 'sha256:4e7570b6fab88a8178a01ae280a36d98787573b376440b891491f25469458798', 'canonical production hash changed');
expect(expected.canonical_file_count === 466, 'canonical file count changed');

expect(result.status === 'implemented_bounded_exact_archive_additions', 'PR552 result status changed');
expect(result.changed_count === 8 && result.changed?.length === 8, 'PR552 result must contain exactly eight archive changes');
expect(result.no_safe_change?.length === 2, 'PR552 result no-safe-change count changed');
expect(result.archive_coverage?.before_recorded === 463 && result.archive_coverage?.after_recorded === 471, 'PR552 result archive recorded boundary changed');
expect(result.archive_coverage?.before_not_recorded === 122 && result.archive_coverage?.after_not_recorded === 114, 'PR552 result archive not-recorded boundary changed');
expect(result.next_boundary === 'REVIEW_GATE' && result.automatic_continuation === false, 'PR552 result next boundary changed');
expect(authority.authorized_archive_additions?.length === 8 && authority.no_safe_change?.length === 2, 'consumed implementation authority lineage changed');

expect(statsCheckpoint.canonical_checkpoint_id === checkpoint.checkpoint_id, 'stats checkpoint canonical binding changed');
expect(statsCheckpoint.status === 'reviewed_non_growth_maintenance_checkpoint', 'stats checkpoint status changed');
expect(statsCheckpoint.checkpoint_kind === 'non_growth_maintenance_checkpoint', 'stats checkpoint kind changed');
expect(release.baseline_id === 'sog_release_integrity_pr552_119_assets_2026_08_12', 'release baseline ID changed');
expect(release.evidence_quality?.archive_index_count === 471, 'release archive recorded count changed');
expect(release.evidence_quality?.archive_not_recorded_count === 114, 'release archive not-recorded count changed');

expect(closeout.restored_boundary.stage === 'REVIEW_GATE', 'REVIEW_GATE not restored');
expect(closeout.restored_boundary.canonical_archive_additions_authorized === 0, 'closeout still authorizes archive additions');
expect(closeout.restored_boundary.canonical_market_access_promotion_authorized === false, 'closeout authorizes Market Access promotion');
expect(closeout.restored_boundary.public_guide_ui_change_authorized === false, 'closeout authorizes public Guide/UI change');
expect(closeout.restored_boundary.automatic_continuation === false, 'closeout enables automatic continuation');
expect(closeout.restored_boundary.next_work_requires_separate_reviewed_authority === true, 'separate future authority requirement removed');

for (const text of [agents, governance, roadmap, deployment]) {
  expect(text.includes('Evidence Archive Payload Verification Batch 2'), 'forward governance missing Evidence Archive lane');
  expect(text.includes('REVIEW_GATE'), 'forward governance missing REVIEW_GATE');
  expect(text.includes('PR #551'), 'forward governance missing archive authority PR #551');
  expect(text.includes('PR #552'), 'forward governance missing archive implementation PR #552');
  expect(text.includes('31514472928'), 'forward governance missing production run');
  expect(text.includes('ada106dd3bf9899adc441c968fa36978ae515a5c'), 'forward governance missing implementation main commit');
  expect(text.includes('Archive recorded: 471') || text.includes('Archive recorded / not recorded: 471 / 114'), 'forward governance missing current archive recorded count');
  expect(text.includes('Archive not recorded: 114') || text.includes('Archive recorded / not recorded: 471 / 114'), 'forward governance missing current archive not-recorded count');
}

expect(amendment.includes('Production deploy run: 31514472928 — success'), 'closeout amendment missing production run');
expect(amendment.includes('Current stage: REVIEW_GATE'), 'closeout amendment missing restored stage');
expect(spec.includes('Exit: `REVIEW_GATE`.'), 'closeout spec exit changed');
expect(active === "import './validate-post-pr552-evidence-archive-batch2-closeout.mjs';", 'active validator is not wired to post-PR552 closeout');

if (failures.length) {
  console.error('Post-PR552 Evidence Archive Batch 2 closeout validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log('Post-PR552 Evidence Archive Batch 2 closeout validation passed.');
