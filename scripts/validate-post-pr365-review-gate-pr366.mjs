import fs from 'node:fs';

const readJson = (path) => JSON.parse(fs.readFileSync(path, 'utf8'));
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const config = readJson('config/post-pr365-review-gate-pr366.json');
const report = readJson('docs/migration/post-pr365-review-gate-pr366.json');
const baseline = readJson('docs/migration/record-depth-baseline-pr363-summary.json');
const pr364 = readJson('docs/migration/tier-a-batch-4-pr364-reviewed-handoff.json');
const pr365 = readJson('docs/migration/evidence-archive-maintenance-batch-2-pr365-reviewed-handoff.json');
const outcomes = readJson('docs/migration/evidence-archive-maintenance-outcomes-pr365.json');

assert(config.review_pr === 366, 'PR #366 config review_pr changed');
assert(report.review_pr === 366, 'PR #366 report review_pr changed');
assert(report.status === 'reviewed_internal_authority_decision', 'PR #366 status changed');
assert(report.public_output === false, 'PR #366 report must remain internal');
assert(report.source_checkpoint.assets === 112, 'Canonical asset boundary changed');
assert(report.source_checkpoint.evidence === 559, 'Canonical Evidence boundary changed');
assert(report.source_checkpoint.evidence_relations === 559, 'Evidence Relation boundary changed');
assert(report.source_checkpoint.archive_recorded === 390, 'Archive recorded boundary changed');
assert(report.source_checkpoint.archive_not_recorded === 169, 'Archive not-recorded boundary changed');

assert(baseline.cell_count === 1792, 'PR #363 planning cell count changed');
assert(baseline.summary.state_counts.absent === 219, 'PR #363 absent-cell boundary changed');
assert(baseline.summary.state_counts.not_applicable === 0, 'PR #363 not_applicable boundary changed');
assert(report.evaluation.planning_semantics.two_dimension_absent_cells === 217, 'Structural absent-cell concentration changed');
assert(report.evaluation.planning_semantics.two_dimension_share_of_absent_percent === 99.09, 'Structural absent-cell share changed');
assert(report.evaluation.planning_semantics.deployment_partial_cells === 92, 'Deployment partial boundary changed');
assert(report.evaluation.planning_semantics.facet_freshness_partial_cells === 91, 'Facet freshness partial boundary changed');

assert(pr364.selected_asset_slugs.length === 5, 'PR #364 reviewed asset count changed');
assert(pr364.canonical_improvement_asset_slugs.length === 2, 'PR #364 improvement count changed');
assert(outcomes.selected_count === 10 && outcomes.changed_count === 3, 'PR #365 archive-review yield changed');
assert(pr365.next_work_item?.decision === 'review_gate_required', 'PR #365 must end at a review gate');

assert(JSON.stringify(report.approved_next_sequence.map((row) => row.pr)) === JSON.stringify([367, 368, 369]), 'Approved sequence changed');
assert(report.approved_next_sequence[0].canonical_data_change_allowed === false, 'PR #367 canonical boundary changed');
assert(report.approved_next_sequence[1].canonical_data_change_allowed === false, 'PR #368 canonical boundary changed');
assert(report.approved_next_sequence[2].maximum_assets === 5, 'PR #369 maximum asset count changed');
assert(report.approved_next_sequence[2].new_asset_allowed === false, 'PR #369 new asset boundary changed');
assert(report.approved_next_sequence[2].market_access_change_allowed === false, 'PR #369 Market Access boundary changed');
assert(report.review_gate_after_sequence === true, 'Approved sequence must end at a review gate');

for (const forbidden of [
  'Evidence and Archive Maintenance Batch 3',
  'Market Access Pilot 3',
  'Record Growth Batch 2',
  'new public page or explorer',
  'asset ranking or composite score',
  'automatic monitoring promotion',
  'automatic canonical promotion'
]) {
  assert(report.not_approved_in_next_sequence.includes(forbidden), `Missing forbidden item: ${forbidden}`);
}

for (const path of [
  'docs/quality/post-pr365-review-gate-pr366-spec.md',
  'docs/roadmap-amendments/2026-07-15-pr366-post-pr365-review-gate.md'
]) {
  const text = fs.readFileSync(path, 'utf8');
  assert(text.includes('PR #367'), `${path} does not name PR #367`);
  assert(text.includes('PR #368'), `${path} does not name PR #368`);
  assert(text.includes('PR #369'), `${path} does not name PR #369`);
  assert(text.includes('Record Growth Batch 2'), `${path} does not preserve the Record Growth hold`);
}

console.log('PR #366 post-PR #365 review gate validation passed.');
