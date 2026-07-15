import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { buildPlanningDimensionSemanticsAudit } from './build-planning-dimension-semantics-audit-pr367.mjs';

const root = process.cwd();
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const sha256 = (text) => crypto.createHash('sha256').update(text).digest('hex');
const gitBlobSha = (text) => {
  const bytes = Buffer.from(text, 'utf8');
  return crypto.createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
};
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const config = readJson('config/planning-dimension-semantics-pr367.json');
const contractText = readText('config/planning-dimension-semantics-v2.json');
const contract = JSON.parse(contractText);
const report = readJson('docs/migration/planning-dimension-semantics-audit-pr367.json');
const generated = buildPlanningDimensionSemanticsAudit();
const v1 = readJson('docs/migration/record-depth-baseline-pr363-summary.json');

expect(same(report, generated), 'committed audit report is not deterministic');
expect(config.review_pr === 367, 'config review_pr must remain 367');
expect(report.review_pr === 367, 'report review_pr must remain 367');
expect(report.status === 'reviewed_complete', 'audit report status changed');
expect(report.public_output === false, 'audit report must remain internal');
expect(contract.contract_id === 'sog_planning_dimension_semantics_v2_pr367', 'semantics contract ID changed');
expect(contract.public_output === false, 'semantics contract must remain internal');
expect(contract.asset_rank === false && contract.single_composite_score === false, 'semantics contract must remain non-ranking');
expect(report.approved_contract.contract_sha256 === sha256(contractText), 'semantics contract digest mismatch');
expect(report.next_work_item?.pr === 368, 'next work item must remain PR #368');
expect(report.next_work_item?.requires_merged_contract_id === contract.contract_id, 'PR #368 contract binding mismatch');
expect(report.next_work_item?.canonical_data_change_allowed === false, 'PR #368 canonical write boundary changed');
expect(report.next_work_item?.public_surface_allowed === false, 'PR #368 public-surface boundary changed');

const expectedPlanningStates = ['strong', 'usable', 'partial', 'sparse', 'absent', 'not_applicable'];
const expectedApplicabilityStates = ['applicable', 'not_applicable_to_current_scope'];
const expectedObservationStates = ['observed_supported', 'observed_limited', 'unobserved', 'source_unavailable', 'not_applicable'];
expect(same(contract.planning_states, expectedPlanningStates), 'planning-state order or membership changed');
expect(same(contract.applicability_states, expectedApplicabilityStates), 'applicability-state contract changed');
expect(same(contract.observation_states, expectedObservationStates), 'observation-state contract changed');
expect(Object.keys(contract.state_semantics ?? {}).sort().join('|') === [...expectedPlanningStates].sort().join('|'), 'state semantics must cover all planning states exactly once');
expect(contract.state_semantics?.not_applicable?.counts_as_gap === false, 'not_applicable must not count as a gap');
expect(contract.state_semantics?.absent?.counts_as_gap === true, 'absent must remain a gap for applicable dimensions');
expect(same(contract.state_semantics?.not_applicable?.allowed_applicability_states, ['not_applicable_to_current_scope']), 'not_applicable applicability axis mismatch');
expect(same(contract.state_semantics?.not_applicable?.allowed_observation_states, ['not_applicable']), 'not_applicable observation axis mismatch');
expect(same(contract.state_semantics?.absent?.allowed_applicability_states, ['applicable']), 'absent applicability axis mismatch');
expect(same(contract.state_semantics?.absent?.allowed_observation_states, ['unobserved', 'source_unavailable']), 'absent observation axis mismatch');

const dimensions = contract.dimensions ?? [];
const ids = dimensions.map((row) => row.dimension_id);
expect(dimensions.length === 16, 'exactly 16 planning dimensions are required');
expect(new Set(ids).size === 16, 'planning dimension IDs must be unique');
expect(same([...ids].sort(), [...v1.dimension_order].sort()), 'v2 semantics must cover the same 16 dimensions as the immutable v1 baseline');
for (const row of dimensions) {
  expect(typeof row.applicability_rule === 'string' && row.applicability_rule.length > 20, `${row.dimension_id}: applicability rule missing`);
  expect(typeof row.absent_rule === 'string' && row.absent_rule.length > 20, `${row.dimension_id}: absent rule missing`);
  expect(typeof row.not_applicable_rule === 'string' && row.not_applicable_rule.length > 10, `${row.dimension_id}: not-applicable rule missing`);
  expect(typeof row.observation_rule === 'string' && row.observation_rule.length > 20, `${row.dimension_id}: observation rule missing`);
}
const countBy = (key) => dimensions.reduce((out, row) => ({ ...out, [row[key]]: (out[row[key]] ?? 0) + 1 }), {});
expect(same(countBy('dimension_class'), contract.dimension_classes), 'dimension-class counts do not match the contract summary');
expect(same(countBy('default_queue_role'), contract.default_queue_roles), 'queue-role counts do not match the contract summary');
expect(same(contract.dimension_classes, { universal_dossier: 11, conditional_structural: 3, scoped_observational: 2 }), 'dimension-class boundary changed');
expect(same(contract.default_queue_roles, { material_dossier: 11, maintenance_only: 2, scoped_non_dossier: 2, diagnostic_only: 1 }), 'queue-role boundary changed');

const byId = new Map(dimensions.map((row) => [row.dimension_id, row]));
for (const id of ['regulatory_notes', 'canonical_market_access']) {
  expect(byId.get(id)?.dimension_class === 'scoped_observational', `${id} must remain scoped observational`);
  expect(byId.get(id)?.default_queue_role === 'scoped_non_dossier', `${id} must remain outside the default dossier queue`);
}
for (const id of ['reserve_structure', 'redemption', 'facet_freshness_support']) {
  expect(byId.get(id)?.dimension_class === 'conditional_structural', `${id} must remain conditional structural`);
}
expect(byId.get('deployment')?.default_queue_role === 'maintenance_only', 'deployment must remain maintenance-only');
expect(byId.get('facet_freshness_support')?.default_queue_role === 'maintenance_only', 'facet freshness must remain maintenance-only');
expect(byId.get('comparison_readiness')?.default_queue_role === 'diagnostic_only', 'comparison readiness must remain diagnostic-only');
expect(byId.get('redemption')?.not_applicable_rule.includes('redemption_profile.status'), 'redemption not-applicable mapping is missing');
expect(byId.get('canonical_market_access')?.absent_rule.includes('never means unavailable'), 'Market Access negative-claim boundary is missing');
expect(byId.get('regulatory_notes')?.observation_rule.includes('out of scope'), 'regulatory-note scoped boundary is missing');

expect(v1.baseline_id === config.expected_v1_boundary.baseline_id, 'immutable v1 baseline identity changed');
expect(v1.asset_count === 112 && v1.dimension_count === 16 && v1.cell_count === 1792, 'immutable v1 matrix boundary changed');
expect(same(v1.summary.state_counts, config.expected_v1_boundary.state_counts), 'immutable v1 state counts changed');
expect(report.historical_v1_boundary.rewritten === false, 'historical v1 rewrite flag changed');
expect(report.boundaries?.canonical_data_changed === false, 'canonical data boundary changed');
expect(report.boundaries?.baseline_recomputed === false, 'PR #367 must not recompute the baseline');
expect(report.boundaries?.historical_v1_rewritten === false, 'historical planning output boundary changed');
expect(report.boundaries?.public_surface_changed === false, 'public-surface boundary changed');
for (const key of ['canonical_data_change_allowed', 'baseline_recompute_allowed', 'historical_v1_rewrite_allowed', 'public_surface_allowed', 'ranking_allowed', 'automatic_promotion_allowed']) {
  expect(config.boundaries?.[key] === false, `PR #367 boundary changed: ${key}`);
}

for (const [archive, source, expectedSha] of [
  ['docs/archive/AGENTS-through-pr366.md', 'AGENTS.md', config.preserved_git_blob_shas.agents_through_pr366],
  ['docs/archive/roadmap-through-pr366.md', 'docs/roadmap.md', config.preserved_git_blob_shas.roadmap_through_pr366]
]) {
  const archived = readText(archive);
  expect(gitBlobSha(archived) === expectedSha, `${archive}: preserved git blob SHA mismatch`);
  try {
    const prior = execFileSync('git', ['show', `origin/main:${source}`], { encoding: 'utf8' });
    expect(archived === prior, `${archive}: does not exactly preserve origin/main ${source}`);
  } catch (error) {
    failures.push(`${archive}: unable to verify origin/main preservation: ${error.message}`);
  }
}

for (const file of [
  'config/record-depth-baseline-v1.json',
  'docs/migration/record-depth-baseline-pr353-summary.json',
  'docs/migration/tier-a-candidate-queue-pr353.json',
  'docs/migration/record-depth-baseline-pr363-summary.json',
  'docs/migration/record-depth-baseline-pr363-delta.json',
  'docs/migration/tier-a-candidate-queue-pr363.json',
  'scripts/growth/build-record-depth-baseline-pr353.mjs',
  'scripts/growth/build-reviewed-record-depth-baseline-pr353.mjs'
]) {
  try {
    const prior = execFileSync('git', ['show', `origin/main:${file}`], { encoding: 'utf8' });
    expect(readText(file) === prior, `${file}: immutable v1 planning material changed`);
  } catch (error) {
    failures.push(`${file}: unable to verify immutable planning material: ${error.message}`);
  }
}

for (const [file, markers] of [
  ['AGENTS.md', ['PR #367 Planning Dimension Semantics Audit: active; complete on merge', 'PR #368 Record Depth Baseline v2 Refresh: next after PR #367', 'config/planning-dimension-semantics-v2.json']],
  ['docs/roadmap.md', ['Status: canonical execution schedule — PR #367 active', 'PR #368 Record Depth Baseline v2 Refresh: next', 'PR #369 Tier A Dossier Deepening Batch 5: after PR #368']],
  ['docs/quality/planning-dimension-semantics-audit-pr367-spec.md', ['Exactly 16 dimensions are reviewed.', 'Only `partial`, `sparse`, and `absent` cells in `material_dossier` dimensions', 'no 112-asset baseline recomputation']],
  ['docs/roadmap-amendments/2026-07-15-pr367-planning-dimension-semantics-audit-activation.md', ['PR #367', 'PR #368', 'PR #369', 'review gate']]
]) {
  const text = readText(file);
  for (const marker of markers) expect(text.includes(marker), `${file}: missing authority marker ${marker}`);
}

for (const file of [
  'public/data/planning-dimension-semantics-v2.json',
  'public/data/planning-dimension-semantics-audit-pr367.json',
  'src/pages/planning-dimension-semantics.astro'
]) expect(!fs.existsSync(path.join(root, file)), `${file}: internal planning output leaked into public surface`);

if (failures.length) {
  console.error('PR #367 Planning Dimension Semantics Audit validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  audit_id: report.audit_id,
  contract_id: contract.contract_id,
  dimensions: dimensions.length,
  dimension_classes: contract.dimension_classes,
  queue_roles: contract.default_queue_roles,
  historical_v1_preserved: true,
  canonical_data_changed: false,
  baseline_recomputed: false,
  public_surface_changed: false,
  next_work_item: report.next_work_item.work_item
}, null, 2));
