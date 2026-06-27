import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { componentTreatments, mockManifest, mockReviewPolicy, visualTokens } from '../config/visual-system-contract.mjs';

const root = process.cwd();
const outputDir = path.join(root, 'data/generated/ui-mocks');
const indexPath = path.join(outputDir, 'mock-index.json');
const validationPath = path.join(root, 'data/generated/visual-system-mocks-validation.json');
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };
const unique = (values) => new Set(values).size === values.length;

function rgb(hex) {
  const value = hex.replace('#', '');
  return [0, 2, 4].map((offset) => Number.parseInt(value.slice(offset, offset + 2), 16) / 255);
}

function luminance(hex) {
  const channels = rgb(hex).map((channel) => channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

function contrast(left, right) {
  const a = luminance(left);
  const b = luminance(right);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

assert(fs.existsSync(indexPath), 'generated mock index is missing');
if (!fs.existsSync(indexPath)) {
  console.error(failures.join('\n'));
  process.exit(1);
}

const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
assert(index.schema_version === '1.0', 'mock index schema version must be 1.0');
assert(index.mock_count === 10, `expected 10 mocks, found ${index.mock_count}`);
assert(mockManifest.length === 10, 'mock manifest must contain ten entries');
assert(unique(mockManifest.map((mock) => mock.id)), 'mock IDs must be unique');
assert(unique(mockManifest.map((mock) => mock.file)), 'mock files must be unique');
assert(index.mocks.length === mockManifest.length, 'generated mock count does not match manifest');

const forbiddenPhrases = [
  'buy now',
  'sell now',
  'market cap',
  'trading volume',
  'yield ranking',
  'safety score',
  'investment rank',
  'recommended asset',
  'best stablecoin',
  'source review needed',
  'candidate queue',
  'internal overlay'
];
const requiredVisibleMarkers = {
  'stablecoin-index-desktop': ['Stablecoins', '4 of 92 records', 'Tether + 2 roles', 'Compare 2 selected'],
  'stablecoin-detail-desktop': ['Tether USDt (USDT)', 'Organizations and control', 'Evidence', 'Known unknown'],
  'stablecoin-index-mobile': ['Filters · 2 active', '36 sources · 1 unknown', 'Compare 2'],
  'stablecoin-detail-mobile': ['USDT dossier', '4 relationships', 'Known unknown'],
  'organization-detail': ['Tether Holdings', 'Roles and connected assets', 'Relationship history'],
  'event-detail': ['TerraUSD collapse', 'Canonical subtype', 'Affected records', 'Evidence'],
  home: ['Historical registry', 'Meaningful recent changes', 'Data access'],
  'open-filter-state': ['Filter stablecoins', 'Selected filters', 'Clear all', 'Apply filters'],
  'evidence-expanded-state': ['SOURCE IDENTITY', 'Supported claim scopes', 'Relation count'],
  'known-unknown-warning-state': ['Known unknown', 'What remains unclear', 'Last checked', 'Submit a correction']
};

for (const manifestEntry of mockManifest) {
  const generated = index.mocks.find((mock) => mock.id === manifestEntry.id);
  assert(Boolean(generated), `mock index entry is missing: ${manifestEntry.id}`);
  const filePath = path.join(outputDir, manifestEntry.file);
  assert(fs.existsSync(filePath), `mock SVG is missing: ${manifestEntry.file}`);
  if (!fs.existsSync(filePath) || !generated) continue;
  const source = fs.readFileSync(filePath, 'utf8');
  const [width, height] = manifestEntry.viewport;
  assert(generated.file === manifestEntry.file, `${manifestEntry.id}: generated filename mismatch`);
  assert(generated.width === width && generated.height === height, `${manifestEntry.id}: index dimensions mismatch`);
  assert(source.includes(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"`), `${manifestEntry.id}: SVG dimensions mismatch`);
  assert(source.includes('<title id="title">'), `${manifestEntry.id}: accessible title is missing`);
  assert(source.includes('<desc id="desc">'), `${manifestEntry.id}: accessible description is missing`);
  assert(source.includes('<metadata>'), `${manifestEntry.id}: contract metadata is missing`);
  assert(source.includes('role="img"'), `${manifestEntry.id}: image role is missing`);
  assert(source.includes('aria-labelledby="title desc"'), `${manifestEntry.id}: title and description linkage is missing`);
  assert(generated.sha256 === createHash('sha256').update(source).digest('hex'), `${manifestEntry.id}: SHA-256 mismatch`);
  assert(JSON.stringify(generated.required_elements) === JSON.stringify([...manifestEntry.required_elements]), `${manifestEntry.id}: required-element index mismatch`);
  for (const required of manifestEntry.required_elements) {
    assert(source.includes(required.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')), `${manifestEntry.id}: required element is absent from metadata: ${required}`);
  }
  for (const marker of requiredVisibleMarkers[manifestEntry.id] ?? []) {
    assert(source.includes(marker.replaceAll('&', '&amp;')), `${manifestEntry.id}: required visible marker is missing: ${marker}`);
  }
  const lower = source.toLowerCase();
  for (const phrase of forbiddenPhrases) assert(!lower.includes(phrase), `${manifestEntry.id}: prohibited visual language appears: ${phrase}`);
}

const colors = visualTokens.colors;
for (const [name, value] of Object.entries(colors)) assert(/^#[0-9A-Fa-f]{6}$/.test(value), `color token ${name} is not a six-digit hex color`);
assert(contrast(colors.text, colors.background) >= 4.5, 'primary text contrast against background is below 4.5:1');
assert(contrast(colors.text_muted, colors.background) >= 4.5, 'muted text contrast against background is below 4.5:1');
assert(contrast(colors.link, colors.background) >= 4.5, 'link contrast against background is below 4.5:1');
assert(contrast(colors.focus, colors.background) >= 3, 'focus contrast against background is below 3:1');
assert(visualTokens.density.control_min_height_px >= 44, 'control minimum height must be at least 44 CSS pixels');
assert(visualTokens.focus_ring.width_px >= 2, 'focus ring must be at least two CSS pixels');
assert(visualTokens.spacing_px.length === 8, 'spacing scale must contain eight values');
assert(Object.keys(visualTokens.typography.sizes_px).length === 6, 'typography scale must contain six sizes');

assert(componentTreatments.evidence.metadata_order.includes('claim_scopes'), 'evidence treatment must include claim scopes');
assert(componentTreatments.known_unknown.requires_last_checked === true, 'known-unknown treatment must require last checked');
assert(componentTreatments.known_unknown.requires_value_state === true, 'known-unknown treatment must require value state');
assert(componentTreatments.state_chip.color_only_prohibited === true, 'state chips must prohibit color-only meaning');
assert(componentTreatments.contract_value.copy_action === true, 'contract values must require a copy action');

for (const [key, value] of Object.entries(mockReviewPolicy)) {
  if (typeof value === 'boolean' && key !== 'route_changes_allowed' && key !== 'production_implementation_allowed') {
    assert(value === true, `mock review policy ${key} must remain true`);
  }
}
assert(mockReviewPolicy.approval_state === 'approved_against_pr17_pr21_contracts', 'mock approval state is not final');
assert(mockReviewPolicy.gate_d_passes_when_all_mocks_validate === true, 'Gate D approval must depend on all mocks passing');
assert(mockReviewPolicy.route_changes_allowed === false, 'PR 22 must not change routes');
assert(mockReviewPolicy.production_implementation_allowed === false, 'PR 22 must not implement production UI');

const validation = {
  schema_version: '1.0',
  generated_at: new Date().toISOString(),
  ok: failures.length === 0,
  totals: {
    mock_manifest_entries: mockManifest.length,
    generated_mocks: index.mocks.length,
    desktop_mocks: mockManifest.filter((mock) => mock.viewport[0] >= 1000).length,
    mobile_mocks: mockManifest.filter((mock) => mock.viewport[0] < 500).length,
    color_tokens: Object.keys(colors).length,
    failures: failures.length
  },
  contrast: {
    text_on_background: Number(contrast(colors.text, colors.background).toFixed(2)),
    muted_on_background: Number(contrast(colors.text_muted, colors.background).toFixed(2)),
    link_on_background: Number(contrast(colors.link, colors.background).toFixed(2)),
    focus_on_background: Number(contrast(colors.focus, colors.background).toFixed(2))
  },
  approval_state: mockReviewPolicy.approval_state,
  failures
};

fs.writeFileSync(validationPath, `${JSON.stringify(validation, null, 2)}\n`);
if (failures.length) {
  console.error(JSON.stringify(validation, null, 2));
  process.exit(1);
}
console.log(JSON.stringify(validation, null, 2));
