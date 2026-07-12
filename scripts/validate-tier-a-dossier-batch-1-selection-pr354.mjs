import fs from 'node:fs';
import { isDeepStrictEqual } from 'node:util';

const config = JSON.parse(fs.readFileSync('config/tier-a-dossier-batch-1-pr354.json', 'utf8'));
const queue = JSON.parse(fs.readFileSync(config.source_queue, 'utf8'));
const summary = JSON.parse(fs.readFileSync(config.source_summary, 'utf8'));
const spec = fs.readFileSync('docs/quality/tier-a-dossier-batch-1-pr354-spec.md', 'utf8');
const amendment = fs.readFileSync('docs/roadmap-amendments/2026-07-10-pr354-tier-a-batch-1-activation.md', 'utf8');
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

expect(config.schema_version === '1.0', 'PR #354 selection config schema version mismatch');
expect(config.config_id === 'sog_tier_a_dossier_batch_1_pr354_v1', 'PR #354 selection config ID mismatch');
expect(config.max_assets === 5, 'PR #354 batch maximum must remain five assets');
expect(config.selected_assets?.length === 5, `PR #354 must select exactly five assets, found ${config.selected_assets?.length ?? 0}`);
expect(config.new_canonical_assets_allowed === false, 'PR #354 must not add new canonical assets');
expect(config.market_access_records_allowed === false, 'PR #354 must not add canonical Market Access Records');
expect(config.new_public_surface_allowed === false, 'PR #354 must not add a new public surface');
expect(config.asset_rank === false, 'PR #354 must not rank assets');
expect(config.single_composite_score === false, 'PR #354 must not create composite score');
expect(config.next_pr === 355, 'PR #354 next PR must be #355');
expect(summary.asset_count === 110, 'PR #353 reviewed summary must bind 110 assets');
expect(summary.dimension_count === 16, 'PR #353 reviewed summary must bind 16 dimensions');
expect(queue.candidate_count === 18, 'PR #353 reviewed Tier A queue must bind 18 candidates');
expect(queue.asset_rank === false, 'source Tier A queue must remain non-ranking');
expect(queue.queue_order === 'asset_slug_ascending_non_ranking', 'source Tier A queue order contract mismatch');

const expectedSlugs = ['busd', 'dai', 'rlusd', 'usdc', 'usdt'];
const selectedSlugs = config.selected_assets.map((row) => row.asset_slug);
expect(isDeepStrictEqual(selectedSlugs, expectedSlugs), `selected asset set/order mismatch: ${selectedSlugs.join(',')}`);
expect(new Set(selectedSlugs).size === selectedSlugs.length, 'selected asset slugs must be unique');
expect(config.selected_assets.length <= config.max_assets, 'selected asset count exceeds configured maximum');

const queueBySlug = new Map(queue.candidates.map((row) => [row.asset_slug, row]));
for (const selected of config.selected_assets) {
  const source = queueBySlug.get(selected.asset_slug);
  expect(Boolean(source), `${selected.asset_slug}: selected asset missing from reviewed PR #353 queue`);
  if (!source) continue;
  expect(selected.asset_id === source.asset_id, `${selected.asset_slug}: asset ID differs from reviewed queue`);
  expect(isDeepStrictEqual(selected.queue_reasons, source.reasons), `${selected.asset_slug}: queue reasons differ from reviewed queue`);
  expect(isDeepStrictEqual(selected.material_dossier_gaps, source.material_dossier_gaps), `${selected.asset_slug}: material dossier gaps differ from reviewed queue`);
  expect(selected.target_dimensions.every((dimension) => selected.material_dossier_gaps.includes(dimension)), `${selected.asset_slug}: target dimension not authorized by material dossier gaps`);
}

expect(isDeepStrictEqual(config.authorized_redemption_asset_slugs, ['busd', 'rlusd']), 'only BUSD and RLUSD may receive redemption field changes in PR #354');
for (const selected of config.selected_assets) {
  if (selected.target_dimensions.includes('redemption')) {
    expect(config.authorized_redemption_asset_slugs.includes(selected.asset_slug), `${selected.asset_slug}: redemption target not authorized`);
  }
}

for (const family of ['legal_profiles','evidence','evidence_relations','regulatory_notes']) {
  expect(config.authorized_record_families.includes(family), `authorized record family missing: ${family}`);
}
expect(!config.authorized_record_families.includes('market_access_records'), 'Market Access record family must not be authorized');
expect(!config.authorized_record_families.includes('stablecoins'), 'stablecoin asset creation/update family must not be authorized as a batch family');

for (const slug of expectedSlugs) {
  expect(spec.includes(slug.toUpperCase()) || spec.includes(slug === 'rlusd' ? 'RLUSD' : slug), `work-item spec missing selected asset ${slug}`);
  expect(amendment.includes(slug), `active amendment missing selected asset ${slug}`);
}
expect(spec.includes('docs/migration/record-depth-baseline-pr353-summary.json'), 'spec must cite reviewed summary snapshot');
expect(spec.includes('docs/migration/tier-a-candidate-queue-pr353.json'), 'spec must cite reviewed queue snapshot');
expect(spec.includes('PR #353 reviewed snapshots remain byte-unchanged'), 'spec must preserve historical PR #353 snapshots');
expect(amendment.includes('PR #355 Tier A Dossier Deepening — Batch 2: next'), 'PR #354 amendment must identify PR #355 as next');

if (failures.length) {
  console.error('PR #354 Tier A batch selection validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  config_id: config.config_id,
  selected_assets: selectedSlugs,
  selected_count: selectedSlugs.length,
  source_queue_candidate_count: queue.candidate_count,
  authorized_redemption_assets: config.authorized_redemption_asset_slugs,
  next_pr: config.next_pr
}, null, 2));
