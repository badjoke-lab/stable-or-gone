import fs from 'node:fs';
import path from 'node:path';

import { generateCurrentHistorySnapshot } from './stats/build-history-snapshot.mjs';

const root = process.cwd();
const failures = [];
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const expect = (condition, message) => { if (!condition) failures.push(message); };
const canonicalString = (value) => JSON.stringify(value);

const currentCanonicalPath = 'docs/migration/current-canonical-checkpoint.json';
const currentStatsPath = 'docs/migration/current-stats-history-checkpoint.json';
const currentReviewPath = 'docs/migration/current-review-checkpoint.json';
const archivedCanonicalPath = 'docs/migration/checkpoints/sog-pr498-record-growth-batch-4-mnee.json';
const archivedStatsPath = 'docs/migration/checkpoints/sog-stats-pr498-record-growth-batch-4-mnee.json';
const historyPath = 'data/stats-history.json';
const sourceReviewPath = 'data/editorial-research/mnee-evidence-archive-maintenance-batch-1-source-review.json';

const currentCanonical = readJson(currentCanonicalPath);
const currentStats = readJson(currentStatsPath);
const currentReview = readJson(currentReviewPath);
const archivedCanonical = readJson(archivedCanonicalPath);
const archivedStats = readJson(archivedStatsPath);
const history = readJson(historyPath);
const sourceReview = readJson(sourceReviewPath);
const config = readJson('config/mnee-evidence-archive-maintenance.json');
const gaps = readJson('data/batch-ac-review-gaps.json');
const evidence = readJson('data/evidence-batch-ac.json');
const deployments = readJson('data/batch-ac-deployments.json');
const deploymentOverlay = readJson('data/deployment-verification-growth-pr498.json');
const reserveRows = readJson('data/batch-ac-reserve-redemption.json');
const reserveContext = readJson('data/batch-ac-context.json');
const reserveComponents = readJson('data/batch-ac-components.json');
const agents = readText('AGENTS.md');
const roadmap = readText('docs/roadmap.md');
const activeWorkstream = readText('scripts/validate-active-workstream.mjs').trim();

const pr498CanonicalId = 'sog_pr498_record_growth_batch_4_mnee_117_2026_07_31';
const pr498StatsId = 'sog_stats_pr498_record_growth_batch_4_mnee_2026_07_31';
const pr500CanonicalId = 'sog_pr500_mnee_evidence_archive_maintenance_117_2026_08_01';
const pr500StatsId = 'sog_stats_pr500_mnee_evidence_archive_maintenance_2026_08_01';
const expectedPr498SnapshotHash = '379d2dee89c6b6a334a5edef5d7c6693b3b35dcbd265dd705f045aa99ecf54b3';
const expectedPr500SnapshotHash = 'f3d8b10c38ee34dbe95a285a2cd2734e8c19c259392a960733d0aff15bbdb71a';
const expectedPr500StatsModelHash = '6dec30438e63e5a837b627fd64844b42df62873a263ff67dbbf7911f1d159c08';
const expectedInputDigest = 'f0b965871b6c3fec67a9f8fa04986bebd47092524a571a3cf02df103d1d9d07b';

const expectedCounts = {
  assets: 117,
  organizations: 108,
  relationships: 129,
  events: 192,
  evidence: 579,
  reserve_reports: 125,
  known_unknowns: 342,
  regulatory_notes: 9,
  deployments: 184,
  market_access_records: 8,
  legal_profiles: 117,
  stable_asset_relationships: 5,
  reserve_components: 151,
  income_profiles: 117
};

expect(currentCanonical.status === 'reviewed_non_growth_maintenance_checkpoint', `${currentCanonicalPath}: unexpected status`);
expect(currentCanonical.checkpoint_id === pr500CanonicalId, `${currentCanonicalPath}: unexpected checkpoint_id`);
expect(currentCanonical.checkpoint_kind === 'non_growth_maintenance_checkpoint', `${currentCanonicalPath}: unexpected checkpoint_kind`);
expect(currentCanonical.recorded_at === '2026-08-01', `${currentCanonicalPath}: unexpected recorded_at`);
expect(currentCanonical.source_checkpoint_id === pr498CanonicalId, `${currentCanonicalPath}: PR #498 lineage missing`);
expect(currentCanonical.previous_checkpoint_id === pr498CanonicalId, `${currentCanonicalPath}: previous checkpoint mismatch`);
expect(currentCanonical.maintenance_pr === 500 && currentCanonical.authority_pr === 499, `${currentCanonicalPath}: PR authority mismatch`);
expect(currentCanonical.audit?.added_assets === 0, `${currentCanonicalPath}: asset addition prohibited`);
expect(currentCanonical.audit?.added_evidence === 0, `${currentCanonicalPath}: Evidence addition prohibited`);
expect(currentCanonical.audit?.added_deployments === 0, `${currentCanonicalPath}: deployment addition prohibited`);
expect(currentCanonical.audit?.deleted_known_unknowns === 0, `${currentCanonicalPath}: known-unknown deletion prohibited`);
expect(currentCanonical.audit?.forced_resolutions === 0, `${currentCanonicalPath}: forced resolution prohibited`);
expect(currentCanonical.audit?.review_gate_after_pr500 === true, `${currentCanonicalPath}: REVIEW GATE exit missing`);
for (const [field, expected] of Object.entries(expectedCounts)) {
  expect(currentCanonical.expected_counts?.[field] === expected, `${currentCanonicalPath}: expected_counts.${field} must be ${expected}`);
  expect(currentCanonical.counts?.[field] === expected, `${currentCanonicalPath}: counts.${field} must be ${expected}`);
}
expect(currentCanonical.counts?.evidence_relations === 579, `${currentCanonicalPath}: Evidence Relation count must remain 579`);
expect(currentCanonical.counts?.archive_index_count === 450, `${currentCanonicalPath}: archive recorded count must remain 450`);
expect(currentCanonical.counts?.archive_not_recorded_count === 129, `${currentCanonicalPath}: archive not-recorded count must remain 129`);

expect(archivedCanonical.checkpoint_id === pr498CanonicalId, `${archivedCanonicalPath}: PR #498 checkpoint ID changed`);
expect(archivedCanonical.status === 'reviewed_growth_checkpoint', `${archivedCanonicalPath}: PR #498 status changed`);
expect(archivedCanonical.growth_pr === 498 && archivedCanonical.source_pr === 498, `${archivedCanonicalPath}: PR #498 authority changed`);
expect(archivedCanonical.expected_counts?.assets === 117, `${archivedCanonicalPath}: PR #498 asset count changed`);
expect(archivedCanonical.audit?.added_assets === 1, `${archivedCanonicalPath}: PR #498 growth record changed`);
expect(archivedCanonical.audit?.added_evidence === 8, `${archivedCanonicalPath}: PR #498 Evidence addition changed`);
expect(archivedCanonical.audit?.added_deployments === 2, `${archivedCanonicalPath}: PR #498 deployment addition changed`);

expect(currentStats.status === 'reviewed_non_growth_maintenance_checkpoint', `${currentStatsPath}: unexpected status`);
expect(currentStats.checkpoint_id === pr500StatsId, `${currentStatsPath}: unexpected checkpoint_id`);
expect(currentStats.canonical_checkpoint_id === pr500CanonicalId, `${currentStatsPath}: canonical checkpoint mismatch`);
expect(currentStats.source_checkpoint_id === pr498StatsId, `${currentStatsPath}: PR #498 stats lineage missing`);
expect(currentStats.previous_history_checkpoint_id === pr498StatsId, `${currentStatsPath}: previous history checkpoint mismatch`);
expect(currentStats.asset_count === 117, `${currentStatsPath}: asset_count must remain 117`);
expect(currentStats.source_pr === 500 && currentStats.authority_pr === 499, `${currentStatsPath}: PR authority mismatch`);

expect(archivedStats.checkpoint_id === pr498StatsId, `${archivedStatsPath}: PR #498 stats checkpoint ID changed`);
expect(archivedStats.snapshot_sha256 === expectedPr498SnapshotHash, `${archivedStatsPath}: PR #498 snapshot hash changed`);
expect(archivedStats.canonical_checkpoint_id === pr498CanonicalId, `${archivedStatsPath}: PR #498 canonical link changed`);

expect(currentReview.checkpoint_id === 'sog_pr500_mnee_evidence_archive_maintenance_2026_08_01', `${currentReviewPath}: unexpected checkpoint_id`);
expect(currentReview.source_canonical_checkpoint_id === pr500CanonicalId, `${currentReviewPath}: current canonical link mismatch`);
expect(currentReview.source_growth_checkpoint_id === pr498CanonicalId, `${currentReviewPath}: source growth link mismatch`);
expect(currentReview.new_canonical_records === 0, `${currentReviewPath}: new canonical records prohibited`);
expect(currentReview.deleted_known_unknowns === 0, `${currentReviewPath}: known-unknown deletion prohibited`);
expect(currentReview.forced_resolutions === 0, `${currentReviewPath}: forced resolution prohibited`);
expect(currentReview.exit_boundary === 'REVIEW_GATE', `${currentReviewPath}: exit boundary must be REVIEW_GATE`);

expect(history.history_id === 'sog_stats_checkpoint_history_v1', `${historyPath}: unexpected history_id`);
expect(Array.isArray(history.snapshots) && history.snapshots.length >= 2, `${historyPath}: snapshots missing`);
const checkpointIds = history.snapshots.map((row) => row.checkpoint_id);
expect(new Set(checkpointIds).size === checkpointIds.length, `${historyPath}: duplicate checkpoint IDs`);
const pr498Snapshot = history.snapshots.find((row) => row.checkpoint_id === pr498StatsId);
const pr500Snapshot = history.snapshots.find((row) => row.checkpoint_id === pr500StatsId);
expect(pr498Snapshot?.snapshot_sha256 === expectedPr498SnapshotHash, `${historyPath}: PR #498 snapshot mutated`);
expect(pr500Snapshot?.snapshot_sha256 === expectedPr500SnapshotHash, `${historyPath}: PR #500 snapshot missing or hash mismatch`);
expect(history.snapshots.at(-1)?.checkpoint_id === pr500StatsId, `${historyPath}: PR #500 snapshot must be last`);
expect(pr500Snapshot?.checkpoint_kind === 'non_growth_maintenance_checkpoint', `${historyPath}: PR #500 checkpoint kind mismatch`);
expect(pr500Snapshot?.source_checkpoint_id === pr498StatsId, `${historyPath}: PR #500 stats lineage mismatch`);
expect(pr500Snapshot?.canonical_checkpoint_id === pr500CanonicalId, `${historyPath}: PR #500 canonical link mismatch`);
expect(pr500Snapshot?.input_digest_sha256 === expectedInputDigest, `${historyPath}: PR #500 input digest mismatch`);
expect(pr500Snapshot?.stats_model_sha256 === expectedPr500StatsModelHash, `${historyPath}: PR #500 stats model hash mismatch`);
expect(canonicalString(pr500Snapshot?.totals) === canonicalString(expectedCounts), `${historyPath}: PR #500 totals changed`);

const generatedSnapshot = generateCurrentHistorySnapshot();
expect(generatedSnapshot.snapshot_sha256 === expectedPr500SnapshotHash, 'deterministic current snapshot hash mismatch');
expect(canonicalString(generatedSnapshot) === canonicalString(pr500Snapshot), 'deterministic current snapshot does not equal appended PR #500 snapshot');

const expectedTargets = [
  'latest_attestation_body_and_archive',
  'current_reserve_custodian_and_allocation',
  'first_public_ethereum_issuance_date',
  'current_deployment_control_configuration',
  'complete_direct_access_and_jurisdiction_inventory'
];
expect(config.work_item === 'mnee_evidence_archive_maintenance_batch_1', 'maintenance config work item changed');
expect(canonicalString(config.authorized_targets) === canonicalString(expectedTargets), 'maintenance target list changed');
expect(sourceReview.status === 'reviewed_bounded_maintenance', `${sourceReviewPath}: unexpected status`);
expect(sourceReview.authority_pr === 499, `${sourceReviewPath}: authority_pr must be 499`);
expect(sourceReview.target_dispositions?.length === 5, `${sourceReviewPath}: expected five target dispositions`);
expect(canonicalString(sourceReview.target_dispositions?.map((row) => row.target)) === canonicalString(expectedTargets), `${sourceReviewPath}: target disposition identity changed`);
expect(sourceReview.decision?.all_five_targets_disposed === true, `${sourceReviewPath}: all targets must be disposed`);
expect(sourceReview.decision?.forced_resolution === false, `${sourceReviewPath}: forced resolution must remain false`);
expect(sourceReview.decision?.counts_preserved === true, `${sourceReviewPath}: count-preservation decision missing`);
expect(sourceReview.decision?.exit_boundary === 'REVIEW_GATE', `${sourceReviewPath}: exit boundary must be REVIEW_GATE`);

expect(gaps.length === 5, 'MNEE known-unknown count must remain 5');
expect(gaps.every((row) => row.stablecoin_id === 'sog_st_mnee' && row.issuer_id === 'sog_issuer_mnee_limited'), 'MNEE known-unknown ownership changed');
expect(gaps.every((row) => row.last_checked_at === '2026-08-01'), 'all MNEE known unknowns must be reviewed on 2026-08-01');
expect(evidence.length === 8, 'MNEE Evidence ID count must remain 8');
expect(new Set(evidence.map((row) => row.id)).size === 8, 'duplicate MNEE Evidence IDs');
expect(deployments.length === 2, 'MNEE deployment count must remain 2');
expect(deploymentOverlay.status_counts?.verified === 0, 'MNEE deployment must not be promoted to verified');
expect(deploymentOverlay.status_counts?.identifier_recorded_unverified === 2, 'both MNEE deployments must remain identifier_recorded_unverified');
expect(deploymentOverlay.maintenance_boundary?.verification_status_unchanged === true, 'deployment verification boundary missing');
expect(reserveRows.length === 1 && reserveRows[0]?.id === 'sog_st_mnee', 'MNEE reserve profile missing');
expect(reserveRows[0]?.reserve_profile?.as_of_date === null, 'latest reserve report as-of date must remain unknown');
expect(reserveContext.length === 1, 'MNEE reserve context count changed');
expect(reserveComponents.length === 2, 'MNEE reserve component count changed');
expect(reserveComponents.every((row) => row.amount_text === null && row.share_percent === null && row.custodian_organization_id === null && row.as_of_date === null), 'unsupported reserve component value introduced');

expect(agents.includes('PR #500 MNEE Evidence and Archive Maintenance — Batch 1'), 'AGENTS.md: PR #500 result missing');
expect(agents.includes('Required exit after PR #500 merge and production verification: REVIEW GATE'), 'AGENTS.md: PR #500 exit boundary missing');
expect(roadmap.includes('PR #500 MNEE Evidence and Archive Maintenance'), 'docs/roadmap.md: PR #500 result missing');
expect(roadmap.includes('REVIEW GATE'), 'docs/roadmap.md: REVIEW GATE missing');
expect(activeWorkstream === "import './validate-mnee-evidence-archive-maintenance-pr500.mjs';", 'active-workstream validator is not wired to PR #500');

if (failures.length) {
  console.error('PR #500 MNEE evidence and archive maintenance validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  validation_id: 'sog_pr500_mnee_evidence_archive_maintenance',
  current_canonical_checkpoint: currentCanonical.checkpoint_id,
  current_stats_checkpoint: currentStats.checkpoint_id,
  preserved_pr498_snapshot: expectedPr498SnapshotHash,
  pr500_snapshot: expectedPr500SnapshotHash,
  targets_disposed: sourceReview.target_dispositions.length,
  evidence_records: evidence.length,
  known_unknowns: gaps.length,
  deployment_status: 'identifier_recorded_unverified',
  counts: expectedCounts,
  next_work_item: 'REVIEW_GATE'
}, null, 2));
