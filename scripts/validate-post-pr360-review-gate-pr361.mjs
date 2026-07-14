import fs from 'node:fs';
import { buildReviewGate, serializeReviewGate } from './build-post-pr360-review-gate-pr361.mjs';

const read = (file) => fs.readFileSync(file, 'utf8');
const readJson = (file) => JSON.parse(read(file));
const config = readJson('config/post-pr360-review-gate-pr361.json');
const handoff = readJson('docs/migration/evidence-correction-batch-pr360-reviewed-handoff.json');
const committed = readJson('docs/migration/post-pr360-review-gate-pr361.json');
const rebuilt = buildReviewGate();
const repeat = buildReviewGate();
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };
const requireText = (body, text, file) => expect(body.includes(text), `${file}: missing ${text}`);

expect(config.schema_version === '1.0', 'review-gate config schema mismatch');
expect(config.config_id === 'sog_post_pr360_review_gate_pr361_v1', 'review-gate config ID mismatch');
expect(config.status === 'deterministic_review_gate', 'review-gate config status mismatch');
expect(config.review_pr === 361, 'review-gate PR mismatch');
expect(config.evaluation_axes?.length === 9, 'review gate must contain nine evaluation axes');
expect(config.approved_next_sequence?.length === 3, 'review gate must approve exactly three next PRs');
expect(JSON.stringify(config.approved_next_sequence.map((row) => row.pr)) === JSON.stringify([363,364,365]), 'approved sequence must be PR #363–#365');
expect(config.review_gate_after_sequence === true, 'review gate must recur after PR #365');

expect(handoff.status === 'reviewed_merged_handoff', 'PR #360 handoff status mismatch');
expect(handoff.source_merge_commit === '0bdda598b596b406ae8a01827072f5b8c253b23e', 'PR #360 handoff merge commit mismatch');
expect(handoff.canonical_counts?.assets === 112, 'PR #360 handoff asset count mismatch');
expect(handoff.canonical_counts?.evidence === 557, 'PR #360 handoff Evidence count mismatch');
expect(handoff.canonical_counts?.market_access_records === 8, 'PR #360 handoff Market Access count mismatch');
expect(handoff.evidence_quality?.archive_recorded_after === 387, 'PR #360 archive-recorded count mismatch');
expect(handoff.evidence_quality?.archive_not_recorded_after === 170, 'PR #360 no-archive count mismatch');
expect(handoff.next_work_item === 'PR #361 Post-PR #360 Review Gate', 'PR #360 handoff next work item mismatch');

expect(serializeReviewGate(committed) === serializeReviewGate(rebuilt), 'committed review-gate report differs from deterministic rebuild');
expect(serializeReviewGate(rebuilt) === serializeReviewGate(repeat), 'review-gate report is not byte deterministic');
expect(committed.report_id === 'sog_post_pr360_review_gate_pr361_2026_07_14', 'review report ID mismatch');
expect(committed.status === 'deterministic_internal_review_gate', 'review report status mismatch');
expect(committed.public_output === false, 'review report must remain internal');
expect(committed.current_counts?.assets === 112, 'review report must contain 112 assets');
expect(committed.current_counts?.events === 187, 'review report must contain 187 events');
expect(committed.current_counts?.evidence === 557, 'review report must contain 557 Evidence records');
expect(committed.current_counts?.evidence_relations === 557, 'review report must contain 557 Evidence Relations');
expect(committed.current_counts?.deployments === 174, 'review report must contain 174 deployments');
expect(committed.current_counts?.known_unknowns === 325, 'review report must contain 325 known unknowns');
expect(committed.current_counts?.market_access_records === 8, 'review report must contain eight Market Access records');

const sparsity = committed.evaluation_axes?.record_family_sparsity;
expect(sparsity?.historical_asset_count === 110, 'historical Record Depth baseline must remain 110 assets');
expect(sparsity?.current_asset_count === 112, 'current Record Depth recomputation must contain 112 assets');
expect(Array.isArray(sparsity?.dimension_deltas) && sparsity.dimension_deltas.length === 16, 'review report must evaluate all 16 dimensions');
expect(Number.isInteger(sparsity?.current_tier_a_candidate_count), 'current Tier A candidate count missing');

const tierA = committed.evaluation_axes?.tier_a_dossier_depth;
expect(tierA?.historical_candidate_count === 18, 'historical Tier A candidate count mismatch');
expect(tierA?.historical_queue_reuse_allowed === false, 'historical Tier A queue must not be reused');
expect(tierA?.current_queue_order === 'asset_slug_ascending_non_ranking', 'current Tier A queue must remain non-ranking');

const compare = committed.evaluation_axes?.compare_utility;
expect(compare?.preset_count >= 1, 'Compare preset count missing');
expect(compare?.preset_assets_present === compare?.unique_preset_asset_count, 'all configured Compare preset assets must exist');

const timeline = committed.evaluation_axes?.timeline_historical_density;
expect(timeline?.event_count === 187, 'Timeline event count mismatch');
expect(timeline?.events_per_asset > 0, 'Timeline density missing');
expect(timeline?.dated_event_count <= timeline?.event_count, 'Timeline dated-event count invalid');

const access = committed.evaluation_axes?.canonical_market_access_utility;
expect(access?.record_count === 8, 'Market Access record count mismatch');
expect(access?.asset_count === 2, 'Market Access must currently cover two assets');
expect(access?.platform_count === 1, 'Market Access must currently cover one platform/service');
expect(access?.jurisdiction_count === 1, 'Market Access must currently cover one jurisdiction');
expect(access?.function_count === 4, 'Market Access function count mismatch');

const correction = committed.evaluation_axes?.correction_and_source_maintenance_burden;
expect(correction?.archive_recorded === 387, 'review report archive-recorded count mismatch');
expect(correction?.archive_not_recorded === 170, 'review report no-archive count mismatch');
expect(correction?.pr360_corrected === 8, 'review report PR #360 corrected count mismatch');
expect(correction?.remaining_known_unknowns === 325, 'review report known-unknown count mismatch');

expect(committed.evaluation_axes?.external_usage_or_referral_evidence?.status === 'not_available_in_reviewed_repository_evidence', 'external usage must not be invented');
expect(committed.decisions?.record_depth_baseline_refresh?.decision === 'approved_required', 'PR #363 baseline refresh decision mismatch');
expect(committed.decisions?.tier_a_dossier_batch_4?.decision === 'approved_after_baseline_refresh', 'PR #364 dossier decision mismatch');
expect(committed.decisions?.evidence_archive_maintenance_batch_2?.decision === 'approved_priority', 'PR #365 Evidence maintenance decision mismatch');
expect(committed.decisions?.market_access_pilot_3?.decision === 'not_approved', 'Market Access Pilot 3 must remain unapproved');
expect(committed.decisions?.record_growth_batch_2?.decision === 'not_approved_in_next_sequence', 'Record Growth Batch 2 must remain unapproved');
expect(committed.decisions?.new_public_surface?.decision === 'not_approved', 'new public surface must remain unapproved');
expect(JSON.stringify(committed.approved_next_sequence.map((row) => row.pr)) === JSON.stringify([363,364,365]), 'committed approved sequence mismatch');
expect(/^[a-f0-9]{64}$/.test(committed.input_digest_sha256), 'review report input digest invalid');

for (const file of ['README.md','AGENTS.md','docs/spec-governance.md','docs/roadmap.md']) {
  const body = read(file);
  for (const marker of [
    'Canonical stable assets: 112',
    'PR #360 Evidence and Correction Batch: complete',
    'PR #361 Post-PR #360 Review Gate: active',
    'PR #363 Record Depth and Coverage Baseline Refresh: next',
    'docs/quality/post-pr360-review-gate-pr361-spec.md',
    'config/post-pr360-review-gate-pr361.json',
    'docs/migration/evidence-correction-batch-pr360-reviewed-handoff.json',
    'docs/migration/post-pr360-review-gate-pr361.json'
  ]) requireText(body, marker, file);
}

if (failures.length) {
  console.error('PR #361 review-gate validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  current_counts: committed.current_counts,
  current_tier_a_candidate_count: sparsity.current_tier_a_candidate_count,
  timeline_density: timeline.events_per_asset,
  market_access: {records: access.record_count, assets: access.asset_count, platforms: access.platform_count, jurisdictions: access.jurisdiction_count},
  archive_not_recorded: correction.archive_not_recorded,
  approved_next_sequence: committed.approved_next_sequence.map((row) => row.pr),
  input_digest_sha256: committed.input_digest_sha256
}, null, 2));
