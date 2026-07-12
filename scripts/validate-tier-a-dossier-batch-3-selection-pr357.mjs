import fs from 'node:fs';
import { isDeepStrictEqual } from 'node:util';

const config = JSON.parse(fs.readFileSync('config/tier-a-dossier-batch-3-pr357.json', 'utf8'));
const queue = JSON.parse(fs.readFileSync(config.source_queue, 'utf8'));
const summary = JSON.parse(fs.readFileSync(config.source_summary, 'utf8'));
const handoffs = config.prior_batch_handoffs.map((file) => JSON.parse(fs.readFileSync(file, 'utf8')));
const pr356Handoff = JSON.parse(fs.readFileSync(config.prior_work_item_handoff, 'utf8'));
const spec = fs.readFileSync('docs/quality/tier-a-dossier-batch-3-pr357-spec.md', 'utf8');
const amendment = fs.readFileSync('docs/roadmap-amendments/2026-07-13-pr357-tier-a-batch-3-activation.md', 'utf8');
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

expect(config.schema_version === '1.0', 'PR #357 selection config schema version mismatch');
expect(config.config_id === 'sog_tier_a_dossier_batch_3_pr357_v1', 'PR #357 selection config ID mismatch');
expect(config.selection_rule === 'remaining_queue_asset_slug_ascending_non_ranking', 'PR #357 selection rule mismatch');
expect(config.max_assets === 5, 'PR #357 batch maximum must remain five assets');
expect(config.selected_assets?.length === 5, `PR #357 must select exactly five assets, found ${config.selected_assets?.length ?? 0}`);
expect(config.new_canonical_assets_allowed === false, 'PR #357 must not add new canonical assets');
expect(config.market_access_records_allowed === false, 'PR #357 must not change Market Access Records');
expect(config.new_public_surface_allowed === false, 'PR #357 must not add public surface');
expect(config.asset_rank === false, 'PR #357 must not rank assets');
expect(config.single_composite_score === false, 'PR #357 must not create a composite score');
expect(config.next_pr === 358, 'PR #357 next PR must be #358');

expect(summary.asset_count === 110, 'PR #353 summary must bind 110 assets');
expect(summary.dimension_count === 16, 'PR #353 summary must bind 16 dimensions');
expect(queue.candidate_count === 18, 'PR #353 Tier A queue must bind 18 candidates');
expect(queue.asset_rank === false, 'source queue must remain non-ranking');
expect(queue.queue_order === 'asset_slug_ascending_non_ranking', 'source queue order mismatch');

const batch1 = handoffs.find((row) => row.source_pr === 354);
const batch2 = handoffs.find((row) => row.review_pr === 355);
expect(Boolean(batch1), 'PR #354 reviewed handoff missing');
expect(Boolean(batch2), 'PR #355 reviewed handoff missing');
expect(batch1?.source_merge_commit === 'd8a10676aec2f190bc32923fdc547ef359feb5c8', 'PR #354 handoff merge commit mismatch');
expect(batch2?.source_merge_commit === 'b192c4c920e3a3626d006dd8b80f44e806f40da9', 'PR #355 handoff merge commit mismatch');
expect(batch1?.canonical_counts?.assets === 110, 'PR #354 handoff asset count mismatch');
expect(batch2?.canonical_counts?.assets === 110, 'PR #355 handoff asset count mismatch');

expect(pr356Handoff.status === 'reviewed_merged_handoff', 'PR #356 handoff status mismatch');
expect(pr356Handoff.review_pr === 356, 'PR #356 handoff review PR mismatch');
expect(pr356Handoff.source_merge_commit === 'ff48267a54333bd05c2fae1606c7744c3d5e200d', 'PR #356 handoff merge commit mismatch');
expect(pr356Handoff.canonical_counts?.assets === 110, 'PR #356 handoff asset count mismatch');
expect(pr356Handoff.canonical_counts?.evidence === 551, 'PR #356 handoff evidence count mismatch');
expect(pr356Handoff.canonical_counts?.market_access_records === 4, 'PR #356 handoff Market Access count mismatch');
expect(pr356Handoff.next_work_item === 'PR #357 Tier A Dossier Deepening — Batch 3', 'PR #356 handoff next work item mismatch');

const completed = [
  ...(batch1?.selected_asset_slugs ?? []),
  ...(batch2?.completed_asset_slugs ?? [])
].sort();
expect(isDeepStrictEqual(config.excluded_completed_asset_slugs, completed), `completed asset exclusions mismatch: ${completed.join(',')}`);
expect(isDeepStrictEqual(pr356Handoff.completed_tier_a_asset_slugs, completed), 'PR #356 handoff completed Tier A assets mismatch');

const queueSlugs = queue.candidates.map((row) => row.asset_slug);
const remaining = queueSlugs.filter((slug) => !completed.includes(slug));
const expectedSlugs = remaining.slice(0, config.max_assets);
const selectedSlugs = config.selected_assets.map((row) => row.asset_slug);
expect(isDeepStrictEqual(expectedSlugs, ['audd', 'fei', 'husd', 'mim', 'nzds']), `derived Batch 3 set mismatch: ${expectedSlugs.join(',')}`);
expect(isDeepStrictEqual(selectedSlugs, expectedSlugs), `selected asset set/order mismatch: ${selectedSlugs.join(',')}`);
expect(new Set(selectedSlugs).size === selectedSlugs.length, 'selected asset slugs must be unique');
expect(config.selected_assets.length <= config.max_assets, 'selected asset count exceeds maximum');
for (const slug of selectedSlugs) expect(!completed.includes(slug), `${slug}: completed asset selected again`);

const queueBySlug = new Map(queue.candidates.map((row) => [row.asset_slug, row]));
for (const selected of config.selected_assets) {
  const source = queueBySlug.get(selected.asset_slug);
  expect(Boolean(source), `${selected.asset_slug}: missing from immutable PR #353 queue`);
  if (!source) continue;
  expect(selected.asset_id === source.asset_id, `${selected.asset_slug}: asset ID differs from queue`);
  expect(isDeepStrictEqual(selected.queue_reasons, source.reasons), `${selected.asset_slug}: queue reasons differ from immutable queue`);
  expect(isDeepStrictEqual(selected.material_dossier_gaps, source.material_dossier_gaps), `${selected.asset_slug}: material gaps differ from immutable queue`);
  expect(selected.target_dimensions.every((dimension) => selected.material_dossier_gaps.includes(dimension)), `${selected.asset_slug}: target dimension is not an authorized material gap`);
}

expect(isDeepStrictEqual(config.authorized_redemption_asset_slugs, ['audd', 'husd', 'nzds']), 'redemption authorization mismatch');
expect(isDeepStrictEqual(config.authorized_legal_profile_asset_slugs, ['fei', 'husd', 'mim']), 'legal-profile authorization mismatch');
expect(isDeepStrictEqual(config.authorized_lifecycle_asset_slugs, ['audd', 'nzds']), 'lifecycle authorization mismatch');
expect(isDeepStrictEqual(config.authorized_organization_relationship_asset_slugs, ['audd', 'nzds']), 'organization-relationship authorization mismatch');

for (const selected of config.selected_assets) {
  if (selected.target_dimensions.includes('redemption')) expect(config.authorized_redemption_asset_slugs.includes(selected.asset_slug), `${selected.asset_slug}: redemption target not authorized`);
  if (selected.target_dimensions.includes('legal_profile')) expect(config.authorized_legal_profile_asset_slugs.includes(selected.asset_slug), `${selected.asset_slug}: legal-profile target not authorized`);
  if (selected.target_dimensions.includes('lifecycle') || selected.target_dimensions.includes('events')) expect(config.authorized_lifecycle_asset_slugs.includes(selected.asset_slug), `${selected.asset_slug}: lifecycle/event target not authorized`);
  if (selected.target_dimensions.includes('organization_relationships')) expect(config.authorized_organization_relationship_asset_slugs.includes(selected.asset_slug), `${selected.asset_slug}: organization-relationship target not authorized`);
}

for (const family of ['stablecoins','organizations','relationships','classifications','stablecoin_profiles','events','event_details','evidence','evidence_relations','legal_profiles','known_unknowns','regulatory_notes']) {
  expect(config.authorized_record_families.includes(family), `authorized record family missing: ${family}`);
}
expect(!config.authorized_record_families.includes('market_access_records'), 'Market Access records must not be authorized');

for (const marker of ['AUDD','FEI','HUSD','MIM','NZDS','PR #356 reviewed handoff','PR #358 Record Growth Batch 1']) expect(spec.includes(marker) || amendment.includes(marker), `PR #357 authority missing marker: ${marker}`);
expect(spec.includes('This is deterministic queue consumption, not a ranking or score.'), 'spec must preserve non-ranking selection semantics');
expect(amendment.includes('PR #357 Tier A Dossier Deepening — Batch 3: active'), 'amendment must identify PR #357 as active');
expect(amendment.includes('PR #358 Record Growth Batch 1: next'), 'amendment must identify PR #358 as next');

if (failures.length) {
  console.error('PR #357 Tier A batch selection validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  config_id: config.config_id,
  selected_assets: selectedSlugs,
  selected_count: selectedSlugs.length,
  completed_asset_exclusions: completed,
  remaining_after_selection: remaining.slice(config.max_assets),
  authorized_redemption_assets: config.authorized_redemption_asset_slugs,
  authorized_legal_profile_assets: config.authorized_legal_profile_asset_slugs,
  canonical_assets: pr356Handoff.canonical_counts.assets,
  canonical_evidence: pr356Handoff.canonical_counts.evidence,
  canonical_market_access_records: pr356Handoff.canonical_counts.market_access_records,
  next_pr: config.next_pr
}, null, 2));
