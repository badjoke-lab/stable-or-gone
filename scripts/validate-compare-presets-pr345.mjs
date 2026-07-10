import fs from 'node:fs';
import path from 'node:path';
import { buildComparisonProjection } from './comparison/build-comparison-projection-pr343.mjs';

const root = process.cwd();
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const presets = readJson('config/compare-v1-presets.json');
const dimensions = readJson('config/compare-v1-dimensions.json');
const projection = buildComparisonProjection();
const pageSource = readText('src/pages/compare/index.astro');
const scriptSource = readText('src/scripts/compare-presets.ts');
const cssSource = readText('src/styles/compare-presets.css');

const assetSlugs = new Set(projection.assets.map((asset) => asset.slug));
const groupIds = new Set((dimensions.groups ?? []).map((group) => group.id));
const presetIds = new Set();

expect(presets.schema_version === '1.0', 'preset config schema version mismatch');
expect(presets.config_id === 'sog_compare_presets_pr345_v1', 'preset config ID mismatch');
expect(presets.selection_contract?.minimum_assets === 2, 'preset minimum asset count must be 2');
expect(presets.selection_contract?.maximum_assets === 4, 'preset maximum asset count must be 4');
expect(presets.selection_contract?.presets_change_values === false, 'presets must not change values');
expect(presets.selection_contract?.presets_change_readiness === false, 'presets must not change readiness');
expect(presets.selection_contract?.presets_change_freshness === false, 'presets must not change freshness');
expect(presets.selection_contract?.presets_create_scores === false, 'presets must not create scores');
expect(Array.isArray(presets.presets) && presets.presets.length === 5, `PR #345 must define exactly 5 presets, found ${presets.presets?.length ?? 0}`);

for (const preset of presets.presets ?? []) {
  expect(typeof preset.id === 'string' && preset.id.length > 0, 'preset ID missing');
  expect(!presetIds.has(preset.id), `duplicate preset ID: ${preset.id}`);
  presetIds.add(preset.id);
  expect(typeof preset.label === 'string' && preset.label.length > 0, `${preset.id}: label missing`);
  expect(typeof preset.description === 'string' && preset.description.length > 0, `${preset.id}: description missing`);
  expect(Array.isArray(preset.asset_slugs), `${preset.id}: asset_slugs must be an array`);
  expect(preset.asset_slugs.length >= 2 && preset.asset_slugs.length <= 4, `${preset.id}: asset count must be 2-4`);
  expect(new Set(preset.asset_slugs).size === preset.asset_slugs.length, `${preset.id}: duplicate asset slug`);
  for (const slug of preset.asset_slugs) expect(assetSlugs.has(slug), `${preset.id}: unknown canonical asset slug ${slug}`);
  expect(Array.isArray(preset.visible_group_ids) && preset.visible_group_ids.length >= 1, `${preset.id}: visible groups missing`);
  expect(new Set(preset.visible_group_ids).size === preset.visible_group_ids.length, `${preset.id}: duplicate visible group ID`);
  for (const groupId of preset.visible_group_ids) expect(groupIds.has(groupId), `${preset.id}: unknown group ID ${groupId}`);
}

const expectedPresetIds = [
  'usd-issuer-comparison',
  'model-contrast',
  'lifecycle-outcomes',
  'protocol-stablecoins',
  'legal-access-focus'
];
expect(JSON.stringify([...presetIds]) === JSON.stringify(expectedPresetIds), 'preset order or identity set mismatch');

const modelContrast = presets.presets.find((preset) => preset.id === 'model-contrast');
expect(JSON.stringify(modelContrast?.asset_slugs) === JSON.stringify(['usdc', 'dai', 'frax', 'ust']), 'model contrast asset set mismatch');
expect(JSON.stringify(modelContrast?.visible_group_ids) === JSON.stringify(['identity_state', 'mechanism_reserves']), 'model contrast visible groups mismatch');

for (const text of [
  "import comparePresets from '../../../config/compare-v1-presets.json'",
  'data-compare-preset-id',
  'data-compare-group-toggle',
  'data-compare-preset-status',
  'Presets only choose assets and visible facet groups',
  "import '../../scripts/compare-presets'"
]) expect(pageSource.includes(text), `compare page missing preset contract text: ${text}`);

for (const text of [
  "params.get('preset')",
  "params.get('groups')",
  "params.set('preset'",
  "params.set('groups'",
  'selectionMatchesPreset',
  'applyPreset',
  'applyUrlPresetState',
  'At least one facet group must remain visible.',
  "window.addEventListener('popstate'"
]) expect(scriptSource.includes(text), `compare preset script missing behavior: ${text}`);

expect(cssSource.includes('.compare-preset-grid'), 'preset CSS missing preset grid');
expect(cssSource.includes('.compare-group-filter__grid'), 'preset CSS missing group filter grid');
expect(cssSource.includes('.compare-preset[aria-pressed="true"]'), 'preset CSS missing active state');
expect(cssSource.includes('.compare-facet-group[hidden]'), 'preset CSS missing hidden group rule');
expect(cssSource.includes('@media (max-width: 719px)'), 'preset CSS missing mobile layout');
expect(cssSource.includes('var(--sog-ink-body)'), 'preset CSS must use site readability body token');

expect(projection.asset_count === 110, 'preset work must preserve 110 projected assets');
expect(projection.dimension_count === 19, 'preset work must preserve 19 projected dimensions');
expect(projection.cell_count === 2090, 'preset work must preserve 2090 projected cells');
expect(projection.single_composite_score === false, 'preset work must preserve no-score boundary');

if (failures.length) {
  console.error('PR #345 Compare preset validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  preset_count: presets.presets.length,
  preset_ids: [...presetIds],
  canonical_asset_count: projection.asset_count,
  dimension_count: projection.dimension_count,
  cell_count: projection.cell_count,
  next_pr: 346
}, null, 2));
