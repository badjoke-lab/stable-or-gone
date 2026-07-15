import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { buildTierABatch5Outputs } from './build-tier-a-dossier-batch-5-pr369.mjs';

const root = process.cwd();
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const config = readJson('config/tier-a-dossier-batch-5-pr369.json');
const queue = readJson('docs/migration/tier-a-candidate-queue-v2-pr368.json');
const baseline = readJson('docs/migration/record-depth-baseline-v2-pr368-summary.json');
const checkpoint = readJson('docs/migration/current-canonical-checkpoint.json');
const batch1 = readJson('docs/migration/tier-a-batch-1-pr354-reviewed-handoff.json');
const batch2 = readJson('docs/migration/tier-a-batch-2-pr355-reviewed-handoff.json');
const batch3 = readJson('docs/migration/tier-a-batch-3-pr357-reviewed-handoff.json');
const batch4 = readJson('docs/migration/tier-a-batch-4-pr364-reviewed-handoff.json');
const committed = {
  outcomes: readJson('docs/migration/tier-a-batch-5-pr369-review-outcomes.json'),
  handoff: readJson('docs/migration/tier-a-batch-5-pr369-reviewed-handoff.json')
};
const generated = buildTierABatch5Outputs();

expect(same(committed, generated), 'committed PR #369 outputs are not deterministic');
expect(config.review_pr === 369, 'config review_pr must remain 369');
expect(config.maximum_selected_assets === 5, 'PR #369 selection maximum changed');
expect(config.selected_asset_slugs.length === 5, 'PR #369 must review exactly the configured five assets');
expect(new Set(config.selected_asset_slugs).size === 5, 'selected asset slugs must be unique');
expect(queue.queue_id === 'sog_tier_a_candidate_queue_v2_pr368', 'source queue identity changed');
expect(queue.public_output === false && queue.asset_rank === false && queue.single_composite_score === false, 'source queue must remain internal and non-ranking');
expect(queue.selection_boundary.maximum_assets_in_pr369 === 5, 'source queue PR #369 maximum changed');
expect(baseline.baseline_id === 'sog_record_depth_baseline_v2_pr368', 'source baseline identity changed');
expect(baseline.asset_count === 112 && baseline.dimension_count === 16 && baseline.cell_count === 1792, 'source baseline boundary changed');

const queueSlugs = new Set(queue.candidates.map((row) => row.asset_slug));
for (const slug of config.selected_asset_slugs) expect(queueSlugs.has(slug), `${slug}: selected outside PR #368 queue`);
for (const row of config.not_selected) expect(queueSlugs.has(row.asset_slug), `${row.asset_slug}: not-selected row is outside PR #368 queue`);
expect(config.not_selected.length === 1 && config.not_selected[0].asset_slug === 'rlusd', 'RLUSD must remain the single documented non-selection');
expect(config.review_outcomes.length === 5, 'each selected asset must have one review outcome');
expect(new Set(config.review_outcomes.map((row) => row.asset_slug)).size === 5, 'review outcomes must be unique by asset');
expect(same([...config.review_outcomes.map((row) => row.asset_slug)].sort(), [...config.selected_asset_slugs].sort()), 'review outcomes must exactly cover selected assets');

const outcomeBySlug = new Map(config.review_outcomes.map((row) => [row.asset_slug, row]));
const expectedOutcomes = {
  audd: ['reviewed_no_safe_change', 357],
  busd: ['prior_completed_no_duplicate_change', 354],
  nzds: ['reviewed_no_safe_change', 357],
  poundtoken: ['reviewed_no_safe_change', 364],
  usdp: ['prior_completed_no_duplicate_change', 355]
};
for (const [slug, [outcome, priorPr]] of Object.entries(expectedOutcomes)) {
  const row = outcomeBySlug.get(slug);
  expect(row?.outcome === outcome, `${slug}: outcome changed`);
  expect(row?.prior_review_pr === priorPr, `${slug}: prior review PR changed`);
  expect(Array.isArray(row?.material_gaps_reviewed) && row.material_gaps_reviewed.length > 0, `${slug}: reviewed material gaps missing`);
  expect(typeof row?.reason === 'string' && row.reason.length > 60, `${slug}: bounded review reason missing`);
}

expect(batch1.selected_asset_slugs.includes('busd'), 'PR #354 BUSD selection history missing');
expect(batch1.improved_dimensions?.busd?.includes('redemption'), 'PR #354 BUSD redemption improvement history missing');
expect(batch1.selected_asset_slugs.includes('rlusd'), 'PR #354 RLUSD selection history missing');
expect(batch1.improved_dimensions?.rlusd?.includes('redemption'), 'PR #354 RLUSD redemption improvement history missing');
expect(batch2.completed_asset_slugs.includes('usdp'), 'PR #355 USDP completion history missing');
expect(batch3.reviewed_no_safe_change_asset_slugs.includes('audd'), 'PR #357 AUDD no-safe-change history missing');
expect(batch3.reviewed_no_safe_change_asset_slugs.includes('nzds'), 'PR #357 NZDS no-safe-change history missing');
expect(batch4.reviewed_no_safe_change_asset_slugs.includes('poundtoken'), 'PR #364 poundtoken no-safe-change history missing');
expect(batch4.reviewed_no_safe_change_asset_slugs.includes('rlusd'), 'PR #364 RLUSD no-safe-change history missing');

const counts = committed.outcomes.result_counts;
expect(same(counts, config.expected_result), 'review result counts differ from configured expected result');
expect(counts.selected_assets === 5, 'selected result count must be five');
expect(counts.canonical_improvement_assets === 0, 'configured reviewed outcome must not invent a canonical improvement');
expect(counts.reviewed_no_safe_change_assets === 3, 'no-safe-change count must be three');
expect(counts.prior_completed_no_duplicate_change_assets === 2, 'prior-completed duplicate rejection count must be two');
expect(committed.outcomes.status === 'reviewed_complete_no_forced_change', 'outcomes status changed');
expect(committed.outcomes.public_output === false, 'outcomes must remain internal');
expect(committed.handoff.status === 'reviewed_internal_handoff_complete_on_merge', 'handoff status changed');
expect(committed.handoff.public_output === false, 'handoff must remain internal');
expect(committed.handoff.canonical_improvement_asset_slugs.length === 0, 'handoff must record zero canonical improvements');
expect(same(committed.handoff.reviewed_no_safe_change_asset_slugs, ['audd', 'nzds', 'poundtoken']), 'handoff no-safe-change set changed');
expect(same(committed.handoff.prior_completed_no_duplicate_change_asset_slugs, ['busd', 'usdp']), 'handoff prior-completed set changed');
expect(committed.handoff.canonical_counts_unchanged === true, 'canonical count boundary changed');
expect(committed.handoff.historical_outputs_unchanged === true, 'historical output boundary changed');
expect(committed.handoff.new_public_surface === false, 'public-surface boundary changed');
expect(committed.handoff.asset_rank === false && committed.handoff.single_composite_score === false, 'handoff must remain non-ranking');
expect(committed.handoff.next_state === 'REVIEW GATE', 'sequence must stop at review gate');
expect(committed.outcomes.review_digest_sha256 === committed.handoff.review_digest_sha256, 'outcomes/handoff digest mismatch');

expect(committed.handoff.canonical_checkpoint.assets === 112, 'canonical asset checkpoint changed');
expect(committed.handoff.canonical_checkpoint.organizations === 107, 'organization checkpoint changed');
expect(committed.handoff.canonical_checkpoint.relationships === 124, 'relationship checkpoint changed');
expect(committed.handoff.canonical_checkpoint.events === 187, 'event checkpoint changed');
expect(committed.handoff.canonical_checkpoint.evidence === 559, 'Evidence checkpoint changed');
expect(committed.handoff.canonical_checkpoint.evidence_relations === 559, 'Evidence Relation checkpoint changed');
expect(committed.handoff.canonical_checkpoint.deployments === 174, 'deployment checkpoint changed');
expect(committed.handoff.canonical_checkpoint.market_access_records === 8, 'Market Access checkpoint changed');
expect(committed.handoff.canonical_checkpoint.archive_recorded === 390, 'archive recorded checkpoint changed');
expect(committed.handoff.canonical_checkpoint.archive_not_recorded === 169, 'archive not-recorded checkpoint changed');
expect(checkpoint.expected_counts.assets === 112, 'current canonical checkpoint asset count changed');

for (const key of ['existing_assets_only', 'canonical_change_requires_new_source_support']) expect(config.boundaries?.[key] === true, `boundary must remain true: ${key}`);
for (const key of ['force_change_to_fill_batch', 'market_access_change_allowed', 'new_asset_allowed', 'new_deployment_family_allowed', 'public_surface_allowed', 'ranking_allowed', 'single_composite_score_allowed', 'automatic_promotion_allowed']) {
  expect(config.boundaries?.[key] === false, `boundary changed: ${key}`);
}

for (const file of [
  'docs/migration/record-depth-baseline-v2-pr368.json',
  'docs/migration/record-depth-baseline-v2-pr368-summary.json',
  'docs/migration/record-depth-baseline-v2-pr368-delta.json',
  'docs/migration/tier-a-candidate-queue-v2-pr368.json',
  'config/planning-dimension-semantics-v2.json',
  'docs/migration/planning-dimension-semantics-audit-pr367.json',
  'docs/migration/tier-a-batch-1-pr354-reviewed-handoff.json',
  'docs/migration/tier-a-batch-2-pr355-reviewed-handoff.json',
  'docs/migration/tier-a-batch-3-pr357-reviewed-handoff.json',
  'docs/migration/tier-a-batch-4-pr364-reviewed-handoff.json',
  'docs/migration/current-canonical-checkpoint.json'
]) {
  try {
    const prior = execFileSync('git', ['show', `origin/main:${file}`], { encoding: 'utf8' });
    expect(readText(file) === prior, `${file}: immutable input changed`);
  } catch (error) {
    failures.push(`${file}: unable to verify origin/main preservation: ${error.message}`);
  }
}

for (const [file, markers] of [
  ['AGENTS.md', ['PR #369 Tier A Dossier Deepening Batch 5: active; complete on merge', 'REVIEW GATE: next and mandatory', 'No PR after #369 is pre-authorized.']],
  ['docs/roadmap.md', ['Status: canonical execution schedule — PR #369 active', 'canonical improvement assets: 0', 'After PR #369 merges, stop at `REVIEW GATE`.']],
  ['docs/quality/tier-a-dossier-batch-5-pr369-spec.md', ['Exactly five existing assets are reviewed', 'must not force edits', 'stop the sequence at a review gate']],
  ['docs/roadmap-amendments/2026-07-15-pr369-tier-a-dossier-batch-5-activation.md', ['PR #369', 'No new reviewed source signal', 'REVIEW GATE']]
]) {
  const text = readText(file);
  for (const marker of markers) expect(text.includes(marker), `${file}: missing authority marker ${marker}`);
}

for (const file of [
  'public/data/tier-a-batch-5-pr369-review-outcomes.json',
  'public/data/tier-a-batch-5-pr369-reviewed-handoff.json',
  'src/pages/tier-a-batch-5.astro'
]) expect(!fs.existsSync(path.join(root, file)), `${file}: internal review output leaked into public surface`);

if (failures.length) {
  console.error('PR #369 Tier A Dossier Deepening Batch 5 validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  selected_asset_slugs: committed.handoff.selected_asset_slugs,
  canonical_improvement_asset_slugs: committed.handoff.canonical_improvement_asset_slugs,
  reviewed_no_safe_change_asset_slugs: committed.handoff.reviewed_no_safe_change_asset_slugs,
  prior_completed_no_duplicate_change_asset_slugs: committed.handoff.prior_completed_no_duplicate_change_asset_slugs,
  canonical_checkpoint: committed.handoff.canonical_checkpoint,
  next_state: committed.handoff.next_state
}, null, 2));
