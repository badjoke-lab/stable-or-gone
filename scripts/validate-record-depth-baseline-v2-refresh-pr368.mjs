import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { buildRecordDepthBaselineV2Outputs } from './build-record-depth-baseline-v2-refresh-pr368.mjs';

const root = process.cwd();
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };
const outputPaths = {
  baseline: 'docs/migration/record-depth-baseline-v2-pr368.json',
  summary: 'docs/migration/record-depth-baseline-v2-pr368-summary.json',
  delta: 'docs/migration/record-depth-baseline-v2-pr368-delta.json',
  queue: 'docs/migration/tier-a-candidate-queue-v2-pr368.json'
};

const config = readJson('config/record-depth-baseline-v2-refresh-pr368.json');
const contract = readJson('config/planning-dimension-semantics-v2.json');
const audit = readJson('docs/migration/planning-dimension-semantics-audit-pr367.json');
const v1 = readJson('docs/migration/record-depth-baseline-pr363-summary.json');
const committed = Object.fromEntries(Object.entries(outputPaths).map(([key, file]) => [key, readJson(file)]));
const generated = buildRecordDepthBaselineV2Outputs();

for (const key of Object.keys(outputPaths)) expect(same(committed[key], generated[key]), `${outputPaths[key]} is not deterministic`);
expect(config.review_pr === 368, 'config review_pr must remain 368');
expect(contract.contract_id === config.expected.semantics_contract_id, 'semantics contract binding changed');
expect(audit.approved_contract.contract_id === contract.contract_id, 'PR #367 audit/contract binding mismatch');
expect(committed.baseline.baseline_id === 'sog_record_depth_baseline_v2_pr368', 'v2 baseline identity changed');
expect(committed.baseline.status === 'reviewed_internal_planning_baseline', 'v2 baseline status changed');
expect(committed.baseline.public_output === false, 'v2 baseline must remain internal');
expect(committed.baseline.asset_rank === false && committed.baseline.single_composite_score === false, 'v2 baseline must remain non-ranking');
expect(committed.baseline.asset_count === config.expected.asset_count, 'asset count mismatch');
expect(committed.baseline.dimension_count === config.expected.dimension_count, 'dimension count mismatch');
expect(committed.baseline.cell_count === config.expected.cell_count, 'cell count mismatch');
expect(committed.baseline.cell_count === committed.baseline.asset_count * committed.baseline.dimension_count, 'matrix cell count mismatch');
expect(committed.baseline.assets.length === 112, 'full v2 baseline must contain 112 asset rows');
expect(new Set(committed.baseline.assets.map((row) => row.asset_id)).size === 112, 'v2 asset IDs must be unique');
expect(new Set(committed.baseline.assets.map((row) => row.asset_slug)).size === 112, 'v2 asset slugs must be unique');
expect(same(committed.baseline.planning_states, contract.planning_states), 'planning-state contract mismatch');
expect(same(committed.baseline.applicability_states, contract.applicability_states), 'applicability-state contract mismatch');
expect(same(committed.baseline.observation_states, contract.observation_states), 'observation-state contract mismatch');
expect(same(committed.baseline.dimension_order, contract.dimensions.map((row) => row.dimension_id)), 'dimension order mismatch');
expect(committed.baseline.source_contracts.semantics_contract_id === contract.contract_id, 'baseline semantics contract ID mismatch');
expect(committed.baseline.source_contracts.semantics_contract_sha256 === audit.approved_contract.contract_sha256, 'baseline semantics contract digest mismatch');
expect(committed.baseline.source_contracts.v1_baseline_id === v1.baseline_id, 'historical v1 baseline binding mismatch');

const semanticById = new Map(contract.dimensions.map((row) => [row.dimension_id, row]));
const planningCounts = Object.fromEntries(contract.planning_states.map((state) => [state, 0]));
const applicabilityCounts = Object.fromEntries(contract.applicability_states.map((state) => [state, 0]));
const observationCounts = Object.fromEntries(contract.observation_states.map((state) => [state, 0]));
const allCells = [];
for (const asset of committed.baseline.assets) {
  expect(asset.dimension_states.length === 16, `${asset.asset_id}: expected 16 dimension cells`);
  expect(new Set(asset.dimension_states.map((row) => row.dimension_id)).size === 16, `${asset.asset_id}: duplicate dimension cell`);
  expect(same(asset.dimension_states.map((row) => row.dimension_id), committed.baseline.dimension_order), `${asset.asset_id}: dimension order mismatch`);
  for (const cell of asset.dimension_states) {
    allCells.push({ asset_id: asset.asset_id, asset_slug: asset.asset_slug, ...cell });
    const semantic = semanticById.get(cell.dimension_id);
    expect(Boolean(semantic), `${asset.asset_id}/${cell.dimension_id}: semantics missing`);
    expect(cell.planning_state === cell.state, `${asset.asset_id}/${cell.dimension_id}: state alias mismatch`);
    expect(cell.dimension_class === semantic?.dimension_class, `${asset.asset_id}/${cell.dimension_id}: dimension class mismatch`);
    expect(cell.queue_role === semantic?.default_queue_role, `${asset.asset_id}/${cell.dimension_id}: queue role mismatch`);
    expect(contract.planning_states.includes(cell.state), `${asset.asset_id}/${cell.dimension_id}: invalid planning state`);
    expect(contract.applicability_states.includes(cell.applicability_state), `${asset.asset_id}/${cell.dimension_id}: invalid applicability state`);
    expect(contract.observation_states.includes(cell.observation_state), `${asset.asset_id}/${cell.dimension_id}: invalid observation state`);
    const stateContract = contract.state_semantics[cell.state];
    expect(stateContract.allowed_applicability_states.includes(cell.applicability_state), `${asset.asset_id}/${cell.dimension_id}: forbidden applicability combination`);
    expect(stateContract.allowed_observation_states.includes(cell.observation_state), `${asset.asset_id}/${cell.dimension_id}: forbidden observation combination`);
    expect(cell.counts_as_gap === stateContract.counts_as_gap, `${asset.asset_id}/${cell.dimension_id}: gap semantics mismatch`);
    if (cell.state === 'not_applicable') {
      expect(cell.applicability_state === 'not_applicable_to_current_scope', `${asset.asset_id}/${cell.dimension_id}: not_applicable applicability mismatch`);
      expect(cell.observation_state === 'not_applicable', `${asset.asset_id}/${cell.dimension_id}: not_applicable observation mismatch`);
      expect(cell.counts_as_gap === false, `${asset.asset_id}/${cell.dimension_id}: not_applicable must not be a gap`);
    }
    if (cell.state === 'absent') {
      expect(cell.applicability_state === 'applicable', `${asset.asset_id}/${cell.dimension_id}: absent must be applicable`);
      expect(['unobserved', 'source_unavailable'].includes(cell.observation_state), `${asset.asset_id}/${cell.dimension_id}: absent knowledge state mismatch`);
    }
    planningCounts[cell.state] += 1;
    applicabilityCounts[cell.applicability_state] += 1;
    observationCounts[cell.observation_state] += 1;
  }
  const materialGapIds = asset.dimension_states
    .filter((row) => row.queue_role === 'material_dossier' && ['partial', 'sparse', 'absent'].includes(row.state))
    .map((row) => row.dimension_id)
    .sort();
  const maintenanceGapIds = asset.dimension_states
    .filter((row) => row.queue_role === 'maintenance_only' && ['partial', 'sparse', 'absent'].includes(row.state))
    .map((row) => row.dimension_id)
    .sort();
  expect(same(asset.priority_gaps, materialGapIds), `${asset.asset_id}: priority gaps do not match material semantics`);
  expect(same(asset.maintenance_gaps, maintenanceGapIds), `${asset.asset_id}: maintenance gaps do not match maintenance semantics`);
}
expect(allCells.length === 1792, 'full v2 cell count must be 1,792');
expect(same(planningCounts, committed.summary.summary.planning_state_counts), 'planning-state summary mismatch');
expect(same(applicabilityCounts, committed.summary.summary.applicability_state_counts), 'applicability-state summary mismatch');
expect(same(observationCounts, committed.summary.summary.observation_state_counts), 'observation-state summary mismatch');
expect(Object.values(planningCounts).reduce((sum, value) => sum + value, 0) === 1792, 'planning-state counts do not sum to 1,792');
expect(Object.values(applicabilityCounts).reduce((sum, value) => sum + value, 0) === 1792, 'applicability-state counts do not sum to 1,792');
expect(Object.values(observationCounts).reduce((sum, value) => sum + value, 0) === 1792, 'observation-state counts do not sum to 1,792');

const byDimension = new Map(committed.summary.summary.dimension_states.map((row) => [row.dimension_id, row]));
expect(byDimension.get('regulatory_notes')?.planning_state_counts?.absent === 0, 'regulatory notes must not retain universal absent cells');
expect(byDimension.get('regulatory_notes')?.planning_state_counts?.not_applicable === 107, 'regulatory notes scoped not-applicable count must be 107');
expect(byDimension.get('canonical_market_access')?.planning_state_counts?.absent === 0, 'Market Access must not retain universal absent cells');
expect(byDimension.get('canonical_market_access')?.planning_state_counts?.not_applicable === 110, 'Market Access scoped not-applicable count must be 110');
expect(committed.delta.changed_cell_count >= 217, 'v2 semantics must convert at least the 217 scoped v1 absent cells');
expect(committed.delta.changed_cells.every((row) => row.after === 'not_applicable'), 'all current v1-to-v2 planning-state conversions must resolve to not_applicable');
expect(committed.delta.changed_cells.every((row) => row.applicability_state === 'not_applicable_to_current_scope'), 'converted cells must record not-applicable scope');
expect(committed.delta.historical_checkpoint_rewritten === false, 'historical checkpoint rewrite flag changed');
expect(same(committed.delta.planning_state_counts.before, v1.summary.state_counts), 'v1 state-count delta boundary changed');
expect(same(committed.delta.planning_state_counts.after, planningCounts), 'v2 state-count delta boundary changed');

const queue = committed.queue;
expect(queue.queue_id === 'sog_tier_a_candidate_queue_v2_pr368', 'queue identity changed');
expect(queue.status === 'reviewed_internal_non_ranking_queue', 'queue status changed');
expect(queue.public_output === false, 'queue must remain internal');
expect(queue.asset_rank === false && queue.single_composite_score === false, 'queue must remain non-ranking');
expect(queue.source_baseline_id === committed.baseline.baseline_id, 'queue baseline binding mismatch');
expect(queue.source_semantics_contract_id === contract.contract_id, 'queue semantics binding mismatch');
expect(queue.candidate_count === queue.candidates.length, 'queue candidate count mismatch');
const queueSlugs = queue.candidates.map((row) => row.asset_slug);
expect(new Set(queueSlugs).size === queueSlugs.length, 'queue asset slugs must be unique');
expect(same(queueSlugs, [...queueSlugs].sort((left, right) => left.localeCompare(right))), 'queue must be ordered by asset_slug ascending');
expect(queue.selection_boundary.canonical_promotion_authorized === false, 'queue must not authorize canonical promotion');
expect(queue.selection_boundary.manual_review_required === true, 'queue must require manual review');
expect(queue.selection_boundary.maximum_assets_in_pr369 === 5, 'PR #369 maximum selection changed');
expect(queue.selection_boundary.existing_assets_only === true, 'PR #369 must use existing assets only');
expect(queue.selection_boundary.market_access_change_allowed === false, 'PR #369 Market Access boundary changed');
expect(queue.selection_boundary.public_surface_allowed === false, 'PR #369 public-surface boundary changed');
const baselineById = new Map(committed.baseline.assets.map((row) => [row.asset_id, row]));
for (const candidate of queue.candidates) {
  const asset = baselineById.get(candidate.asset_id);
  expect(Boolean(asset), `${candidate.asset_id}: queue candidate is not a canonical baseline asset`);
  expect(candidate.material_dossier_gaps.length > 0, `${candidate.asset_id}: queue candidate has no material dossier gap`);
  expect(same(candidate.material_dossier_gaps, asset?.priority_gaps ?? []), `${candidate.asset_id}: candidate material gaps mismatch baseline`);
  expect(candidate.reasons.length > 0, `${candidate.asset_id}: candidate reasons missing`);
}

const digests = [committed.baseline.generation_digest_sha256, committed.summary.generation_digest_sha256, committed.delta.generation_digest_sha256, committed.queue.generation_digest_sha256];
expect(new Set(digests).size === 1, 'generated outputs must share one generation digest');
expect(committed.summary.next_work_item === 'PR #369 Tier A Dossier Deepening Batch 5', 'summary next work item changed');
expect(committed.queue.next_work_item === 'PR #369 Tier A Dossier Deepening Batch 5', 'queue next work item changed');
for (const key of ['canonical_write_allowed', 'market_access_write_allowed', 'monitoring_auto_promotion_allowed', 'editorial_research_auto_promotion_allowed', 'public_output_allowed', 'new_public_surface_allowed', 'historical_checkpoint_rewrite_allowed', 'asset_rank', 'single_composite_score', 'investment_recommendation']) {
  expect(config.boundaries?.[key] === false, `PR #368 boundary changed: ${key}`);
}

for (const file of [
  'config/record-depth-baseline-v1.json',
  'docs/migration/record-depth-baseline-pr353-summary.json',
  'docs/migration/tier-a-candidate-queue-pr353.json',
  'docs/migration/record-depth-baseline-pr363-summary.json',
  'docs/migration/record-depth-baseline-pr363-delta.json',
  'docs/migration/tier-a-candidate-queue-pr363.json',
  'scripts/growth/build-record-depth-baseline-pr353.mjs',
  'scripts/growth/build-reviewed-record-depth-baseline-pr353.mjs',
  'config/planning-dimension-semantics-v2.json',
  'docs/migration/planning-dimension-semantics-audit-pr367.json'
]) {
  try {
    const prior = execFileSync('git', ['show', `origin/main:${file}`], { encoding: 'utf8' });
    expect(readText(file) === prior, `${file}: immutable historical or PR #367 input changed`);
  } catch (error) {
    failures.push(`${file}: unable to verify origin/main preservation: ${error.message}`);
  }
}

for (const [file, markers] of [
  ['AGENTS.md', ['PR #367 Planning Dimension Semantics Audit: complete', 'PR #368 Record Depth Baseline v2 Refresh: active; complete on merge', 'PR #369 Tier A Dossier Deepening Batch 5: next after PR #368']],
  ['docs/roadmap.md', ['Status: canonical execution schedule — PR #368 active', 'PR #368  Record Depth Baseline v2 Refresh — active', 'PR #369  Tier A Dossier Deepening Batch 5']],
  ['docs/quality/record-depth-baseline-v2-refresh-pr368-spec.md', ['Every one of the 1,792 planning cells', 'Only `partial`, `sparse`, or `absent` cells', 'no canonical record']],
  ['docs/roadmap-amendments/2026-07-15-pr368-record-depth-baseline-v2-refresh-activation.md', ['112 canonical assets', '1,792 planning cells', 'PR #369 Tier A Dossier Deepening Batch 5']]
]) {
  const text = readText(file);
  for (const marker of markers) expect(text.includes(marker), `${file}: missing authority marker ${marker}`);
}

for (const file of [
  'public/data/record-depth-baseline-v2-pr368.json',
  'public/data/tier-a-candidate-queue-v2-pr368.json',
  'src/pages/record-depth-baseline.astro'
]) expect(!fs.existsSync(path.join(root, file)), `${file}: internal planning output leaked into public surface`);

if (failures.length) {
  console.error('PR #368 Record Depth Baseline v2 Refresh validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  baseline_id: committed.baseline.baseline_id,
  assets: committed.baseline.asset_count,
  dimensions: committed.baseline.dimension_count,
  cells: committed.baseline.cell_count,
  planning_state_counts: planningCounts,
  applicability_state_counts: applicabilityCounts,
  observation_state_counts: observationCounts,
  changed_cells: committed.delta.changed_cell_count,
  candidates: queue.candidate_count,
  candidate_slugs: queueSlugs,
  generation_digest_sha256: digests[0],
  next_work_item: queue.next_work_item
}, null, 2));
