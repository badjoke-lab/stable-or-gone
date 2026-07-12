import fs from 'node:fs';
import { isDeepStrictEqual } from 'node:util';

const config = JSON.parse(fs.readFileSync('config/tier-a-dossier-batch-2-pr355.json', 'utf8'));
const queue = JSON.parse(fs.readFileSync(config.source_queue, 'utf8'));
const summary = JSON.parse(fs.readFileSync(config.source_summary, 'utf8'));
const handoff = JSON.parse(fs.readFileSync(config.prior_batch_handoff, 'utf8'));
const spec = fs.readFileSync('docs/quality/tier-a-dossier-batch-2-pr355-spec.md', 'utf8');
const amendment = fs.readFileSync('docs/roadmap-amendments/2026-07-12-pr355-tier-a-batch-2-activation.md', 'utf8');
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

expect(config.schema_version === '1.0', 'PR #355 selection config schema version mismatch');
expect(config.config_id === 'sog_tier_a_dossier_batch_2_pr355_v1', 'PR #355 selection config ID mismatch');
expect(config.max_assets === 5, 'PR #355 batch maximum must remain five assets');
expect(config.selected_assets?.length === 5, `PR #355 must select exactly five assets, found ${config.selected_assets?.length ?? 0}`);
expect(config.new_canonical_assets_allowed === false, 'PR #355 must not add new canonical assets');
expect(config.market_access_records_allowed === false, 'PR #355 must not add Market Access Records');
expect(config.new_public_surface_allowed === false, 'PR #355 must not add public surface');
expect(config.asset_rank === false, 'PR #355 must not rank assets');
expect(config.single_composite_score === false, 'PR #355 must not create a composite score');
expect(config.next_pr === 356, 'PR #355 next PR must be #356');

expect(summary.asset_count === 110, 'PR #353 summary must bind 110 assets');
expect(summary.dimension_count === 16, 'PR #353 summary must bind 16 dimensions');
expect(queue.candidate_count === 18, 'PR #353 Tier A queue must bind 18 candidates');
expect(queue.asset_rank === false, 'source queue must remain non-ranking');
expect(handoff.status === 'reviewed_merged_internal_handoff', 'PR #354 handoff status mismatch');
expect(handoff.source_pr === 354, 'PR #354 handoff source PR mismatch');
expect(handoff.source_merge_commit === 'd8a10676aec2f190bc32923fdc547ef359feb5c8', 'PR #354 handoff merge commit mismatch');
expect(handoff.canonical_counts?.assets === 110, 'PR #354 handoff asset count mismatch');
expect(handoff.canonical_counts?.evidence === 547, 'PR #354 handoff evidence count mismatch');
expect(handoff.market_access_record_count === 0, 'PR #354 handoff Market Access count mismatch');

const expectedSlugs = ['fdusd', 'frax', 'pyusd', 'usdp', 'ust'];
const selectedSlugs = config.selected_assets.map((row) => row.asset_slug);
expect(isDeepStrictEqual(selectedSlugs, expectedSlugs), `selected asset set/order mismatch: ${selectedSlugs.join(',')}`);
expect(new Set(selectedSlugs).size === selectedSlugs.length, 'selected asset slugs must be unique');
expect(config.selected_assets.length <= config.max_assets, 'selected asset count exceeds maximum');

const completed = handoff.completed_asset_exclusions_for_next_batch ?? [];
expect(isDeepStrictEqual(config.excluded_completed_asset_slugs, completed), 'completed PR #354 exclusions differ from reviewed handoff');
for (const slug of selectedSlugs) {
  expect(!completed.includes(slug), `${slug}: PR #354 completed asset selected again`);
}

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

expect(isDeepStrictEqual(config.authorized_redemption_asset_slugs, ['frax', 'pyusd', 'usdp']), 'only FRAX, PYUSD, and USDP may receive redemption field changes');
for (const selected of config.selected_assets) {
  if (selected.target_dimensions.includes('redemption')) {
    expect(config.authorized_redemption_asset_slugs.includes(selected.asset_slug), `${selected.asset_slug}: redemption target not authorized`);
  }
}

for (const family of ['legal_profiles', 'stablecoin_profiles', 'evidence', 'evidence_relations', 'regulatory_notes']) {
  expect(config.authorized_record_families.includes(family), `authorized record family missing: ${family}`);
}
expect(!config.authorized_record_families.includes('market_access_records'), 'Market Access records must not be authorized');

expect(spec.includes('docs/migration/tier-a-batch-1-pr354-reviewed-handoff.json'), 'spec must cite PR #354 handoff');
expect(amendment.includes('PR #356 Market Access Pilot 1: next'), 'amendment must identify PR #356 as next');
expect(spec.includes('PR #354 completed assets must not be selected again'), 'spec must preserve prior batch exclusion');

if (failures.length) {
  console.error('PR #355 Tier A batch selection validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  config_id: config.config_id,
  selected_assets: selectedSlugs,
  selected_count: selectedSlugs.length,
  excluded_completed_assets: completed,
  authorized_redemption_assets: config.authorized_redemption_asset_slugs,
  canonical_assets: handoff.canonical_counts.assets,
  canonical_evidence: handoff.canonical_counts.evidence,
  next_pr: config.next_pr
}, null, 2));
