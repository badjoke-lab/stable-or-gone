import { isDeepStrictEqual } from 'node:util';
import fs from 'node:fs';
import { buildReviewedRecordDepthBaseline, serializeReviewedRecordDepthBaseline } from './growth/build-reviewed-record-depth-baseline-pr353.mjs';

const config = JSON.parse(fs.readFileSync('config/record-depth-baseline-v1.json', 'utf8'));
const presets = JSON.parse(fs.readFileSync('config/compare-v1-presets.json', 'utf8'));
const baseline = buildReviewedRecordDepthBaseline();
const repeat = buildReviewedRecordDepthBaseline();
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };
const presetSlugs = new Set((presets.presets ?? []).flatMap((preset) => preset.asset_slugs ?? []));
const materialDimensions = new Set(config.queue_policy.material_dossier_gap_dimensions);

expect(serializeReviewedRecordDepthBaseline(baseline) === serializeReviewedRecordDepthBaseline(repeat), 'reviewed baseline must be byte-deterministic');
expect(isDeepStrictEqual(baseline, repeat), 'reviewed baseline repeated object build mismatch');
expect(baseline.asset_count === 110, 'reviewed baseline must preserve 110 assets');
expect(baseline.dimension_count === 16, 'reviewed baseline must preserve 16 dimensions');
expect(baseline.cell_count === 1760, 'reviewed baseline must preserve 1760 cells');
expect(baseline.public_output === false, 'reviewed baseline must remain internal');
expect(baseline.asset_rank === false, 'reviewed baseline must not rank assets');
expect(baseline.single_composite_score === false, 'reviewed baseline must not create composite score');
expect(baseline.source_contracts?.comparison_preset_config_id === presets.config_id, 'reviewed baseline must bind Compare preset config');
expect(baseline.source_contracts?.comparison_preset_source === 'config/compare-v1-presets.json', 'reviewed baseline preset source mismatch');
expect(typeof baseline.input_digest_sha256 === 'string' && /^[a-f0-9]{64}$/.test(baseline.input_digest_sha256), 'reviewed baseline input digest invalid');

for (const asset of baseline.assets) {
  expect(typeof asset.product_leverage_flags?.comparison_preset_member === 'boolean', `${asset.asset_slug}: comparison_preset_member flag missing`);
  expect(asset.product_leverage_flags.comparison_preset_member === presetSlugs.has(asset.asset_slug), `${asset.asset_slug}: preset membership mismatch`);
}

const queue = baseline.tier_a_candidate_queue;
expect(Array.isArray(queue), 'reviewed Tier A candidate queue must be array');
expect(queue.length > 0, 'reviewed Tier A queue must not be empty');
expect(queue.length <= 30, `reviewed Tier A queue must remain bounded to at most 30 assets, found ${queue.length}`);
expect(queue.length < baseline.asset_count, 'reviewed Tier A queue must remain selective');
expect(baseline.summary.tier_a_candidate_count === queue.length, 'reviewed queue summary count mismatch');
expect(baseline.queue_order === 'asset_slug_ascending_non_ranking', 'reviewed queue order must remain non-ranking');
const slugs = queue.map((row) => row.asset_slug);
expect(JSON.stringify(slugs) === JSON.stringify([...slugs].sort()), 'reviewed Tier A queue must use slug order');
expect(new Set(slugs).size === slugs.length, 'reviewed Tier A queue slugs must be unique');

for (const row of queue) {
  expect(Array.isArray(row.reasons) && row.reasons.length > 0, `${row.asset_slug}: reviewed queue reasons missing`);
  expect(Array.isArray(row.material_dossier_gaps), `${row.asset_slug}: material_dossier_gaps missing`);
  expect(row.material_dossier_gaps.every((dimensionId) => materialDimensions.has(dimensionId)), `${row.asset_slug}: non-material gap leaked into material_dossier_gaps`);
  expect(typeof row.product_leverage_flags?.comparison_preset_member === 'boolean', `${row.asset_slug}: preset membership flag missing in queue`);
  expect(!Object.prototype.hasOwnProperty.call(row, 'rank'), `${row.asset_slug}: rank forbidden`);
  expect(!Object.prototype.hasOwnProperty.call(row, 'score'), `${row.asset_slug}: score forbidden`);
  expect(!Object.prototype.hasOwnProperty.call(row, 'priority_score'), `${row.asset_slug}: priority_score forbidden`);

  const reasonSet = new Set(row.reasons);
  if (reasonSet.has('comparison_preset_member_with_material_dossier_gap')) {
    expect(presetSlugs.has(row.asset_slug), `${row.asset_slug}: preset reason requires actual preset membership`);
    expect(row.material_dossier_gaps.length >= config.queue_policy.comparison_preset_material_gap_min, `${row.asset_slug}: preset reason lacks material gap`);
  }
  if (reasonSet.has('historical_importance_with_multiple_material_dossier_gaps')) {
    expect(row.product_leverage_flags.historical_importance === true, `${row.asset_slug}: historical reason requires historical_importance`);
    expect(row.material_dossier_gaps.length >= config.queue_policy.historical_material_gap_min, `${row.asset_slug}: historical reason lacks required material gaps`);
  }
  if (reasonSet.has('regional_relevance_with_multiple_material_dossier_gaps')) {
    expect(row.product_leverage_flags.regional_relevance === true, `${row.asset_slug}: regional reason requires regional relevance`);
    expect(row.material_dossier_gaps.length >= config.queue_policy.regional_material_gap_min, `${row.asset_slug}: regional reason lacks required material gaps`);
  }
  if (reasonSet.has('comparison_and_evidence_maintenance_leverage')) {
    expect(row.product_leverage_flags.compare_leverage === true, `${row.asset_slug}: compare/evidence reason requires compare leverage`);
    expect(row.product_leverage_flags.evidence_maintenance_leverage === true, `${row.asset_slug}: compare/evidence reason requires evidence maintenance leverage`);
  }
}

const expectedPresetQueueMembers = [...presetSlugs].filter((slug) => {
  const asset = baseline.assets.find((row) => row.asset_slug === slug);
  if (!asset) return false;
  const materialGapCount = asset.priority_gaps.filter((dimensionId) => materialDimensions.has(dimensionId)).length;
  return materialGapCount >= config.queue_policy.comparison_preset_material_gap_min;
});
for (const slug of expectedPresetQueueMembers) {
  expect(queue.some((row) => row.asset_slug === slug && row.reasons.includes('comparison_preset_member_with_material_dossier_gap')), `${slug}: qualifying preset member missing from reviewed queue`);
}

if (failures.length) {
  console.error('PR #353 reviewed Tier A queue validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  candidate_count: queue.length,
  candidate_slugs: slugs,
  preset_config_id: presets.config_id,
  queue_order: baseline.queue_order,
  input_digest_sha256: baseline.input_digest_sha256
}, null, 2));
