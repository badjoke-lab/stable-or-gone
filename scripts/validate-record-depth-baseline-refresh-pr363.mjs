import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { buildRecordDepthRefreshOutputs } from './build-record-depth-baseline-refresh-pr363.mjs';

const root = process.cwd();
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const config = readJson('config/record-depth-baseline-refresh-pr363.json');
const committed = {
  summary: readJson('docs/migration/record-depth-baseline-pr363-summary.json'),
  delta: readJson('docs/migration/record-depth-baseline-pr363-delta.json'),
  queue: readJson('docs/migration/tier-a-candidate-queue-pr363.json')
};
const generated = buildRecordDepthRefreshOutputs();
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };
const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const sorted = (values) => [...values].sort((a, b) => a.localeCompare(b));

expect(same(committed.summary, generated.summary), 'committed summary is not deterministic');
expect(same(committed.delta, generated.delta), 'committed delta is not deterministic');
expect(same(committed.queue, generated.queue), 'committed candidate queue is not deterministic');
expect(committed.summary.baseline_id === 'sog_record_depth_baseline_pr363_v1', 'baseline id mismatch');
expect(committed.summary.asset_count === config.expected.asset_count, 'asset count mismatch');
expect(committed.summary.dimension_count === config.expected.dimension_count, 'dimension count mismatch');
expect(committed.summary.cell_count === config.expected.cell_count, 'cell count mismatch');
expect(committed.summary.cell_count === committed.summary.asset_count * committed.summary.dimension_count, 'matrix cell count mismatch');
expect(committed.summary.summary?.tier_a_candidate_count === config.expected.candidate_count, 'summary candidate count mismatch');
expect(committed.queue.candidate_count === config.expected.candidate_count, 'queue candidate count mismatch');
expect(committed.delta.asset_count?.before === config.expected.historical_asset_count, 'historical asset count mismatch');
expect(committed.delta.asset_count?.after === config.expected.asset_count, 'current asset count mismatch');
expect(committed.delta.candidate_queue?.before_count === config.expected.historical_candidate_count, 'historical candidate count mismatch');
expect(committed.delta.candidate_queue?.after_count === config.expected.candidate_count, 'current candidate count mismatch');
expect(committed.summary.input_digest_sha256 !== committed.delta.historical_input_digest_sha256, 'current digest must differ from PR #353');
expect(committed.summary.generation_digest_sha256 === committed.delta.generation_digest_sha256, 'summary/delta generation digest mismatch');
expect(committed.summary.generation_digest_sha256 === committed.queue.generation_digest_sha256, 'summary/queue generation digest mismatch');
expect(committed.queue.queue_order === 'asset_slug_ascending_non_ranking', 'candidate queue order mismatch');
expect(committed.queue.asset_rank === false && committed.queue.single_composite_score === false, 'candidate queue must remain non-ranking');
expect(committed.queue.selection_boundary?.canonical_promotion_authorized === false, 'candidate queue must not authorize promotion');
expect(committed.queue.selection_boundary?.manual_review_required === true, 'candidate queue must require manual review');
expect(committed.queue.selection_boundary?.maximum_assets_in_pr364 === 5, 'PR #364 maximum asset count mismatch');

const candidateIds = committed.queue.candidates.map((row) => row.asset_id);
const candidateSlugs = committed.queue.candidates.map((row) => row.asset_slug);
expect(new Set(candidateIds).size === candidateIds.length, 'candidate asset IDs must be unique');
expect(new Set(candidateSlugs).size === candidateSlugs.length, 'candidate slugs must be unique');
expect(same(candidateSlugs, sorted(candidateSlugs)), 'candidate queue is not ordered by asset_slug ascending');
for (const candidate of committed.queue.candidates) {
  expect(typeof candidate.asset_id === 'string' && candidate.asset_id.startsWith('sog_st_'), `invalid candidate asset ID ${candidate.asset_id}`);
  expect(Array.isArray(candidate.reasons) && candidate.reasons.length > 0, `${candidate.asset_id}: candidate reasons missing`);
  expect(Array.isArray(candidate.material_dossier_gaps), `${candidate.asset_id}: material dossier gaps missing`);
}

const promotedIds = committed.delta.canonical_assets_added_since_pr353?.asset_ids ?? [];
expect(same(promotedIds, config.expected.promoted_asset_ids_since_historical_baseline), 'PR #358 promoted asset IDs mismatch');
expect(committed.delta.canonical_assets_added_since_pr353?.assets?.length === 2, 'two promoted asset contribution rows required');
expect(committed.delta.historical_checkpoint_rewritten === false, 'historical checkpoint rewrite flag changed');
expect(config.next_work_item === 'PR #364 Tier A Dossier Deepening Batch 4', 'next work item mismatch');
for (const key of ['canonical_write_allowed','market_access_write_allowed','monitoring_auto_promotion_allowed','editorial_research_auto_promotion_allowed','public_output_allowed','new_public_surface_allowed','historical_checkpoint_rewrite_allowed','comparison_readiness_semantics_change_allowed','facet_freshness_semantics_change_allowed','asset_rank','single_composite_score','investment_recommendation']) {
  expect(config.boundaries?.[key] === false, `PR #363 boundary changed: ${key}`);
}

for (const file of ['docs/migration/record-depth-baseline-pr353-summary.json','docs/migration/tier-a-candidate-queue-pr353.json']) {
  try {
    const base = execFileSync('git', ['show', `origin/main:${file}`], { encoding: 'utf8' });
    const current = fs.readFileSync(path.join(root, file), 'utf8');
    expect(current === base, `${file}: immutable PR #353 file changed`);
  } catch (error) {
    failures.push(`${file}: unable to verify immutable baseline: ${error.message}`);
  }
}

if (failures.length) {
  console.error('PR #363 Record Depth baseline refresh validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  baseline_id: committed.summary.baseline_id,
  assets: committed.summary.asset_count,
  dimensions: committed.summary.dimension_count,
  cells: committed.summary.cell_count,
  candidates: committed.queue.candidate_count,
  state_counts: committed.summary.summary.state_counts,
  candidate_slugs: candidateSlugs,
  generation_digest_sha256: committed.summary.generation_digest_sha256,
  next_work_item: config.next_work_item
}, null, 2));
