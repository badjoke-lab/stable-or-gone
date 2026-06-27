import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { componentTreatments, mockManifest, mockReviewPolicy, visualTokens } from '../config/visual-system-contract.mjs';

const root = process.cwd();
const mockDir = path.join(root, 'docs/ui-redesign/mocks/pr22');
const reviewPath = path.join(mockDir, 'review.json');
const outputPath = path.join(root, 'data/generated/visual-system-mocks-validation.json');
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };
const unique = (values) => new Set(values).size === values.length;

const expectedText = {
  'stablecoin-index-desktop': ['Stablecoin registry', 'ACTIVE FILTERS', '34 of 92 records', 'Multiple organizations', 'Comparison selection'],
  'stablecoin-detail-desktop': ['Current state', 'Organizations and control', 'How the asset works', 'Deployments and legal context', 'History', 'Evidence', 'Known unknowns'],
  'stablecoin-index-mobile': ['Stablecoins', 'Filters · 3 active', '34 of 92 records', 'Circle + 2 roles', 'Compare 2 selected'],
  'stablecoin-detail-mobile': ['STATE SUMMARY', 'SECTION NAVIGATION', 'Organizations and control', 'Deployments', 'EVIDENCE', 'KNOWN UNKNOWNS'],
  'organization-detail': ['Organization record', 'CATEGORY', 'JURISDICTION', 'ROLES', 'Relationship cards', 'Connected assets', 'Events and evidence'],
  'event-detail': ['Event record', 'EVENT DATE', 'CATEGORY', 'SUBTYPE', 'SUBJECTS', 'STATUS EFFECT', 'Typed event details', 'Evidence'],
  home: ['Stablecoin history', 'Global search', 'RECORD FAMILIES', 'Meaningful recent changes', 'Methodology and data access', 'Support is secondary'],
  'open-filter-state': ['Filters', '3 selected', 'Clear all', 'LIFECYCLE', 'BACKING', 'REFERENCE', 'Result preview', 'Apply filters'],
  'evidence-expanded-state': ['SOURCE IDENTITY', 'PUBLISHER', 'PROVENANCE', 'PRIMARY STATE', 'PUBLICATION DATE', 'ARCHIVE', 'RELIABILITY', 'CLAIM SCOPES', 'RELATION COUNT'],
  'known-unknown-warning-state': ['KNOWN UNKNOWN LABEL', 'VALUE STATE', 'TOPIC', 'PRIORITY', 'WHAT REMAINS UNCLEAR', 'LAST CHECKED', 'RELATED SECTION', 'Submit correction']
};
const prohibitedPatterns = [/\bAPY\b/i, /\b24h volume\b/i, /\bmarket cap rank\b/i, /\bbuy now\b/i, /\bsell now\b/i, /\brecommended asset\b/i, /source_review_needed/i, /registry[-_ ]v3/i, /work[-_ ]queue/i, /\bTODO\b/i];

function luminance(hex) {
  const values = [1, 3, 5].map((index) => Number.parseInt(hex.slice(index, index + 2), 16) / 255).map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return 0.2126 * values[0] + 0.7152 * values[1] + 0.0722 * values[2];
}
function contrast(first, second) {
  const values = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

assert(mockManifest.length === 10, 'exactly ten visual mocks are required');
assert(unique(mockManifest.map((entry) => entry.id)), 'mock IDs must be unique');
assert(unique(mockManifest.map((entry) => entry.file)), 'mock filenames must be unique');
assert(fs.existsSync(reviewPath), 'explicit mock review record is missing');
const review = fs.existsSync(reviewPath) ? JSON.parse(fs.readFileSync(reviewPath, 'utf8')) : { mocks: [] };
assert(review.schema_version === '1.0', 'mock review schema version must be 1.0');
assert(review.mocks?.length === 10, 'review record must contain ten mock decisions');
assert(unique((review.mocks ?? []).map((entry) => entry.id)), 'review mock IDs must be unique');
assert(review.gate_d_decision === 'pass_after_pr22_merge', 'Gate D decision must be explicit');

const files = [];
for (const mock of mockManifest) {
  const filePath = path.join(mockDir, mock.file);
  assert(fs.existsSync(filePath), `${mock.id}: SVG file is missing`);
  if (!fs.existsSync(filePath)) continue;
  const svg = fs.readFileSync(filePath, 'utf8');
  const width = Number(svg.match(/<svg\b[^>]*\bwidth="(\d+)"/)?.[1]);
  const height = Number(svg.match(/<svg\b[^>]*\bheight="(\d+)"/)?.[1]);
  assert(width === mock.viewport[0], `${mock.id}: expected width ${mock.viewport[0]}, found ${width}`);
  assert(height === mock.viewport[1], `${mock.id}: expected height ${mock.viewport[1]}, found ${height}`);
  assert(/<title\b[^>]*>[^<]+<\/title>/.test(svg), `${mock.id}: accessible SVG title is missing`);
  assert(/role="img"/.test(svg), `${mock.id}: SVG image role is missing`);
  assert(svg.includes(visualTokens.colors.background), `${mock.id}: approved background token is missing`);
  for (const required of expectedText[mock.id] ?? []) assert(svg.includes(required), `${mock.id}: required visible text is missing: ${required}`);
  for (const pattern of prohibitedPatterns) assert(!pattern.test(svg), `${mock.id}: prohibited visual language matched ${pattern}`);
  const decision = review.mocks?.find((entry) => entry.id === mock.id);
  assert(decision?.decision === 'approved', `${mock.id}: explicit approved decision is missing`);
  assert(typeof decision?.notes === 'string' && decision.notes.length >= 40, `${mock.id}: review notes are incomplete`);
  files.push({ id: mock.id, file: mock.file, viewport: [width, height], bytes: Buffer.byteLength(svg), sha256: createHash('sha256').update(svg).digest('hex'), decision: decision?.decision ?? null });
}

const contrastResults = [];
for (const token of ['text', 'text_muted', 'link', 'positive', 'warning', 'critical', 'unknown']) {
  for (const background of ['background', 'surface']) {
    const ratio = contrast(visualTokens.colors[token], visualTokens.colors[background]);
    contrastResults.push({ token, background, ratio: Number(ratio.toFixed(2)) });
    assert(ratio >= 4.5, `${token} against ${background} must meet 4.5:1 contrast`);
  }
}
for (const background of ['background', 'surface']) assert(contrast(visualTokens.colors.focus, visualTokens.colors[background]) >= 3, `focus against ${background} must meet 3:1 contrast`);

assert(visualTokens.density.control_min_height_px === 44, 'control minimum height must be 44 CSS pixels');
assert(visualTokens.focus_ring.width_px >= 3, 'focus ring must be at least 3 CSS pixels');
assert(componentTreatments.evidence.metadata_order.length === 7, 'evidence treatment must preserve seven metadata groups');
assert(componentTreatments.known_unknown.requires_last_checked === true, 'known unknown treatment must require last checked');
assert(componentTreatments.known_unknown.requires_value_state === true, 'known unknown treatment must require value state');
assert(componentTreatments.state_chip.color_only_prohibited === true, 'state chips must prohibit color-only meaning');
assert(componentTreatments.contract_value.full_value_visible === true, 'contract value must preserve the full visible value');
assert(componentTreatments.contract_value.copy_action === true, 'contract value must include copy action');
for (const [key, value] of Object.entries(mockReviewPolicy)) {
  if (typeof value === 'boolean' && key !== 'route_changes_allowed' && key !== 'production_implementation_allowed') assert(value === true, `mock review policy ${key} must remain true`);
}
assert(mockReviewPolicy.approval_state === 'approved_against_pr17_pr21_contracts', 'mock approval state changed unexpectedly');
assert(mockReviewPolicy.route_changes_allowed === false, 'PR 22 must not change routes');
assert(mockReviewPolicy.production_implementation_allowed === false, 'PR 22 must not implement production UI');

const validation = {
  schema_version: '1.0',
  generated_at: new Date().toISOString(),
  ok: failures.length === 0,
  totals: {
    visual_mocks: mockManifest.length,
    approved_mocks: (review.mocks ?? []).filter((entry) => entry.decision === 'approved').length,
    desktop_mocks: mockManifest.filter((entry) => entry.viewport[0] >= 1000).length,
    mobile_mocks: mockManifest.filter((entry) => entry.viewport[0] < 500).length,
    color_tokens: Object.keys(visualTokens.colors).length,
    contrast_checks: contrastResults.length,
    failures: failures.length
  },
  files,
  contrast: contrastResults,
  gate_d_decision: review.gate_d_decision,
  failures
};
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(validation, null, 2)}\n`);
if (failures.length) {
  console.error(JSON.stringify(validation, null, 2));
  process.exit(1);
}
console.log(JSON.stringify(validation.totals, null, 2));
