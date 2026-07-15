import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { buildRecordDepthBaselineV21Outputs } from './build-record-depth-baseline-v2-1-refresh-pr372.mjs';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const root = process.cwd();
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const paths = {
  config: 'config/record-depth-baseline-v2-1-refresh-pr372.json',
  manifest: 'docs/migration/planning-input-manifest-pr371.json',
  audit: 'docs/migration/planning-input-coverage-audit-pr371.json',
  baseline: 'docs/migration/record-depth-baseline-v2-1-pr372.json',
  summary: 'docs/migration/record-depth-baseline-v2-1-pr372-summary.json',
  delta: 'docs/migration/record-depth-baseline-v2-1-pr372-delta.json',
  queue: 'docs/migration/tier-a-candidate-queue-v2-1-pr372.json'
};

const config = readJson(paths.config);
const manifest = readJson(paths.manifest);
const audit = readJson(paths.audit);
const baseline = readJson(paths.baseline);
const summary = readJson(paths.summary);
const delta = readJson(paths.delta);
const queue = readJson(paths.queue);
const generated = buildRecordDepthBaselineV21Outputs();

expect(same(baseline, generated.baseline), 'committed v2.1 baseline is not deterministic');
expect(same(summary, generated.summary), 'committed v2.1 summary is not deterministic');
expect(same(delta, generated.delta), 'committed v2.1 delta is not deterministic');
expect(same(queue, generated.queue), 'committed v2.1 queue is not deterministic');

expect(config.review_pr === 372, 'config review PR changed');
expect(baseline.review_pr === 372 && summary.review_pr === 372 && delta.review_pr === 372 && queue.review_pr === 372, 'output review PR identity changed');
expect(baseline.schema_version === '2.1' && summary.schema_version === '2.1' && queue.schema_version === '2.1', 'v2.1 schema identity changed');
expect(baseline.baseline_id === 'sog_record_depth_baseline_v2_1_pr372', 'v2.1 baseline ID changed');
expect(summary.baseline_id === baseline.baseline_id, 'summary baseline ID mismatch');
expect(delta.current_v2_1_baseline_id === baseline.baseline_id, 'delta current baseline ID mismatch');
expect(queue.source_baseline_id === baseline.baseline_id, 'queue source baseline ID mismatch');
expect(delta.historical_v2_baseline_id === config.expected.historical_v2_baseline_id, 'historical PR #368 baseline ID mismatch');
expect(baseline.supersedes_baseline_id === config.expected.historical_v2_baseline_id, 'baseline supersession boundary changed');

expect(baseline.public_output === false && summary.public_output === false && delta.public_output === false && queue.public_output === false, 'PR #372 outputs must remain internal');
expect(baseline.asset_rank === false && baseline.single_composite_score === false, 'baseline must remain non-ranking');
expect(queue.asset_rank === false && queue.single_composite_score === false, 'queue must remain non-ranking');
expect(queue.selection_boundary?.canonical_promotion_authorized === false, 'queue cannot authorize canonical promotion');
expect(queue.selection_boundary?.next_dossier_batch_authorized === false, 'queue cannot authorize a dossier batch');
expect(queue.selection_boundary?.review_gate_required === true, 'queue must require review gate');
expect(queue.next_work_item === 'REVIEW GATE' && summary.next_work_item === 'REVIEW GATE', 'PR #372 must end at review gate');

expect(baseline.asset_count === config.expected.asset_count, 'asset count mismatch');
expect(baseline.dimension_count === config.expected.dimension_count, 'dimension count mismatch');
expect(baseline.cell_count === config.expected.cell_count, 'cell count mismatch');
expect(baseline.assets.length === config.expected.asset_count, 'asset array length mismatch');
expect(baseline.assets.every((asset) => asset.dimension_states.length === config.expected.dimension_count), 'an asset does not contain 16 dimensions');
expect(new Set(baseline.assets.map((asset) => asset.asset_id)).size === config.expected.asset_count, 'asset IDs are not unique');
expect(new Set(baseline.dimension_order).size === config.expected.dimension_count, 'dimension order is not unique');

const allCells = baseline.assets.flatMap((asset) => asset.dimension_states);
expect(allCells.length === config.expected.cell_count, 'cell array total mismatch');
const planningTotal = Object.values(summary.summary.planning_state_counts).reduce((sum, value) => sum + value, 0);
const applicabilityTotal = Object.values(summary.summary.applicability_state_counts).reduce((sum, value) => sum + value, 0);
const observationTotal = Object.values(summary.summary.observation_state_counts).reduce((sum, value) => sum + value, 0);
expect(planningTotal === config.expected.cell_count, 'planning state counts do not sum to cell count');
expect(applicabilityTotal === config.expected.cell_count, 'applicability state counts do not sum to cell count');
expect(observationTotal === config.expected.cell_count, 'observation state counts do not sum to cell count');

expect(manifest.manifest_id === config.expected.planning_input_manifest_id, 'planning manifest identity mismatch');
expect(manifest.counts.ordered_file_count === config.expected.profile_file_count, 'manifest profile file count mismatch');
expect(manifest.counts.legacy_baseline_file_count === config.expected.legacy_profile_file_count, 'legacy profile file count mismatch');
expect(manifest.counts.reviewed_overlay_file_count === config.expected.reviewed_overlay_file_count, 'reviewed overlay file count mismatch');
expect(audit.coverage_gap.affected_asset_id_count === config.expected.affected_asset_count_from_pr371, 'PR #371 affected asset count mismatch');
expect(baseline.source_contracts.planning_input_manifest_id === manifest.manifest_id, 'baseline source contract manifest ID mismatch');
expect(baseline.source_contracts.planning_input_manifest_digest_sha256 === manifest.manifest_digest_sha256, 'baseline source contract manifest digest mismatch');
expect(baseline.source_contracts.planning_input_profile_file_count === config.expected.profile_file_count, 'baseline source contract profile count mismatch');
expect(same(baseline.source_contracts.planning_input_profile_files, manifest.ordered_profile_files.map((row) => row.path)), 'baseline source contract profile order mismatch');
expect(baseline.source_contracts.planning_input_composition_semantics?.duplicate_asset_resolution === 'last_write_wins', 'last-write-wins contract changed');

const previousManifestEnv = process.env.SOG_PLANNING_PROFILE_MANIFEST;
delete process.env.SOG_PLANNING_PROFILE_MANIFEST;
const defaultRegistry = loadRegistryV2Baseline(root);
process.env.SOG_PLANNING_PROFILE_MANIFEST = paths.manifest;
const manifestRegistry = loadRegistryV2Baseline(root);
if (previousManifestEnv === undefined) delete process.env.SOG_PLANNING_PROFILE_MANIFEST;
else process.env.SOG_PLANNING_PROFILE_MANIFEST = previousManifestEnv;
const defaultProfileFiles = defaultRegistry.data_groups?.profiles ?? [];
const manifestProfileFiles = manifest.ordered_profile_files.map((row) => row.path);
const injectedProfileFiles = manifestRegistry.data_groups?.profiles ?? [];
expect(defaultProfileFiles.length >= config.expected.legacy_profile_file_count, 'effective default loader lost legacy profile inputs');
expect(defaultProfileFiles.length <= config.expected.profile_file_count, 'effective default loader exceeds approved complete profile input count');
expect(defaultProfileFiles.every((file) => manifestProfileFiles.includes(file)), 'effective default loader contains a profile file outside the approved manifest');
expect(!same(defaultProfileFiles, manifestProfileFiles), 'effective default loader already matches the exact manifest; refresh boundary is not reproduced');
expect(injectedProfileFiles.length === config.expected.profile_file_count, 'manifest loader profile boundary mismatch');
expect(same(injectedProfileFiles, manifestProfileFiles), 'manifest loader did not preserve exact public-loader order');
expect(manifestRegistry.planning_profile_manifest?.manifest_id === manifest.manifest_id, 'manifest loader provenance missing');

expect(delta.asset_count.before === config.expected.asset_count && delta.asset_count.after === config.expected.asset_count, 'asset count changed across refresh');
expect(delta.dimension_count.before === config.expected.dimension_count && delta.dimension_count.after === config.expected.dimension_count, 'dimension count changed across refresh');
expect(delta.cell_count.before === config.expected.cell_count && delta.cell_count.after === config.expected.cell_count, 'cell count changed across refresh');
expect(delta.changed_cell_count === delta.changed_cells.length, 'delta changed-cell count mismatch');
expect(delta.changed_asset_count === delta.changed_asset_ids.length, 'delta changed-asset count mismatch');
expect(delta.changed_cell_count > 0, 'manifest-bound refresh produced no cell changes');
expect(delta.changed_asset_count > 0, 'manifest-bound refresh produced no asset changes');
expect(delta.changed_asset_ids.every((id) => audit.coverage_gap.affected_asset_ids.includes(id)), 'delta changed an asset outside the PR #371 affected boundary');
expect(summary.changed_from_pr368_cell_count === delta.changed_cell_count, 'summary/delta changed-cell count mismatch');
expect(summary.changed_from_pr368_asset_count === delta.changed_asset_count, 'summary/delta changed-asset count mismatch');

const queueSlugs = queue.candidates.map((row) => row.asset_slug);
expect(queue.candidate_count === queueSlugs.length, 'queue candidate count mismatch');
expect(new Set(queueSlugs).size === queueSlugs.length, 'queue contains duplicate asset slugs');
expect(same(queueSlugs, [...queueSlugs].sort()), 'queue is not asset-slug ascending');
expect(delta.candidate_queue.after_count === queue.candidate_count, 'queue delta after-count mismatch');
expect(delta.candidate_queue.before_count === 6, 'historical PR #368 queue count changed');

for (const key of ['canonical_write_allowed', 'market_access_write_allowed', 'monitoring_auto_promotion_allowed', 'editorial_research_auto_promotion_allowed', 'public_output_allowed', 'new_public_surface_allowed', 'historical_checkpoint_rewrite_allowed', 'asset_rank', 'single_composite_score', 'investment_recommendation', 'next_dossier_batch_authorized']) {
  expect(config.boundaries?.[key] === false, `PR #372 boundary changed: ${key}`);
}

for (const file of [
  'docs/migration/record-depth-baseline-pr353-summary.json',
  'docs/migration/tier-a-candidate-queue-pr353.json',
  'docs/migration/record-depth-baseline-pr363-summary.json',
  'docs/migration/record-depth-baseline-pr363-delta.json',
  'docs/migration/tier-a-candidate-queue-pr363.json',
  'config/planning-dimension-semantics-v2.json',
  'docs/migration/planning-dimension-semantics-audit-pr367.json',
  'docs/migration/record-depth-baseline-v2-pr368.json',
  'docs/migration/record-depth-baseline-v2-pr368-summary.json',
  'docs/migration/record-depth-baseline-v2-pr368-delta.json',
  'docs/migration/tier-a-candidate-queue-v2-pr368.json',
  'docs/migration/tier-a-batch-5-pr369-review-outcomes.json',
  'docs/migration/tier-a-batch-5-pr369-reviewed-handoff.json',
  'docs/migration/post-pr369-review-gate-pr370.json',
  'docs/migration/planning-input-manifest-pr371.json',
  'docs/migration/planning-input-coverage-audit-pr371.json',
  'docs/migration/current-canonical-checkpoint.json'
]) {
  try {
    expect(git('hash-object', file) === git('rev-parse', `origin/main:${file}`), `${file}: immutable Git blob identity changed`);
  } catch (error) {
    failures.push(`${file}: unable to verify origin/main blob identity: ${error.message}`);
  }
}

for (const [file, markers] of [
  ['AGENTS.md', ['PR #372 Record Depth Baseline v2.1 Refresh: active; complete on merge', '112 assets × 16 dimensions = 1,792 cells', 'REVIEW GATE: next and mandatory']],
  ['docs/roadmap.md', ['Status: canonical execution schedule — PR #372 active', 'affected asset IDs: 35', 'stop at another review gate']],
  ['docs/quality/record-depth-baseline-v2-1-refresh-pr372-spec.md', ['ordered profile files: 29', 'last write wins', 'PR #372 ends at `REVIEW GATE`']],
  ['docs/roadmap-amendments/2026-07-15-pr372-record-depth-baseline-v2-1-refresh-activation.md', ['PR #372', 'public profile input files: 29', 'end at a review gate']]
]) {
  const text = readText(file);
  for (const marker of markers) expect(text.includes(marker), `${file}: missing authority marker ${marker}`);
}

for (const file of [
  'public/data/record-depth-baseline-v2-1-pr372.json',
  'public/data/tier-a-candidate-queue-v2-1-pr372.json',
  'src/pages/record-depth-baseline-v2-1.astro'
]) expect(!fs.existsSync(path.join(root, file)), `${file}: internal output leaked into public surface`);

if (failures.length) {
  console.error('PR #372 Record Depth Baseline v2.1 validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  baseline_id: baseline.baseline_id,
  assets: baseline.asset_count,
  dimensions: baseline.dimension_count,
  cells: baseline.cell_count,
  effective_default_profile_files: defaultProfileFiles.length,
  complete_profile_files: baseline.source_contracts.planning_input_profile_file_count,
  changed_cells_from_pr368: delta.changed_cell_count,
  changed_assets_from_pr368: delta.changed_asset_count,
  candidate_count: queue.candidate_count,
  candidate_slugs: queueSlugs,
  next_work_item: queue.next_work_item
}, null, 2));
