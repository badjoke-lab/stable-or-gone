import fs from 'node:fs';

const authorityPath = 'config/stablecoin-compare-matrix-remediation-authority.json';
const amendmentPath = 'docs/roadmap-amendments/2026-08-10-stablecoin-compare-matrix-remediation-authority.md';
const specPath = 'docs/quality/stablecoin-compare-matrix-remediation-spec.md';

const fail = (message) => {
  console.error(`Stablecoin compare matrix remediation authority validation failed: ${message}`);
  process.exitCode = 1;
};

for (const path of [authorityPath, amendmentPath, specPath]) {
  if (!fs.existsSync(path)) fail(`missing required file ${path}`);
}

if (process.exitCode) process.exit(process.exitCode);

const authority = JSON.parse(fs.readFileSync(authorityPath, 'utf8'));
const amendment = fs.readFileSync(amendmentPath, 'utf8');
const spec = fs.readFileSync(specPath, 'utf8');

if (authority.authority_id !== 'sog_stablecoin_compare_matrix_remediation_2026_08_10') fail('unexpected authority_id');
if (authority.entry_main_commit !== '0eb362e930fb44a78a535a05fda86e20b010aadd') fail('entry main commit drifted');
if (authority.public_route !== '/stablecoins/') fail('authority must remain bounded to /stablecoins/');
if (authority.selection?.minimum_ready !== 2 || authority.selection?.maximum !== 4 || authority.selection?.reject_fifth !== true) fail('selection contract must remain 2-4 with fifth rejected');
if (authority.selection?.preserve_url_order !== true) fail('shared comparison URL must preserve selected order');

const requiredFeatures = new Set(authority.required_features ?? []);
for (const feature of [
  'attribute_by_record_matrix',
  'two_three_four_record_support',
  'individual_column_removal',
  'differences_only',
  'explicit_unknown_and_not_recorded',
  'bounded_horizontal_scroll_on_narrow_viewports',
  'shared_compare_url_restoration'
]) {
  if (!requiredFeatures.has(feature)) fail(`missing required feature ${feature}`);
}

const requiredRows = new Set(authority.required_rows ?? []);
for (const row of [
  'lifecycle', 'issuance', 'asset_class', 'launch', 'reference', 'backing', 'stabilization',
  'reserve_disclosure', 'redemption', 'organizations_control', 'deployments', 'linked_events',
  'source_identities', 'evidence_relations', 'known_unknowns'
]) {
  if (!requiredRows.has(row)) fail(`missing required comparison row ${row}`);
}

for (const [key, value] of Object.entries(authority.canonical_delta ?? {})) {
  if (value !== 0) fail(`canonical delta ${key} must remain zero`);
}

if (authority.canonical_baseline?.stable_assets !== 119) fail('stable asset baseline must remain 119');
if (authority.canonical_baseline?.evidence !== 585) fail('Evidence baseline must remain 585');
if (authority.canonical_baseline?.evidence_relations !== 585) fail('Evidence Relations baseline must remain 585');
if (authority.canonical_baseline?.market_access !== 12) fail('Market Access baseline must remain 12');
if (authority.canonical_baseline?.archive_recorded !== 463 || authority.canonical_baseline?.archive_not_recorded !== 122) fail('archive baseline drifted');
if (authority.canonical_baseline?.canonical_hash !== 'sha256:f386c1043ca5e83cafbd88e99746d0609aab0154ed48de1970677758a66ed5fa') fail('canonical hash drifted');
if (authority.canonical_baseline?.canonical_file_count !== 466) fail('canonical file count drifted');

if (authority.paused_lane?.name !== 'Evidence Archive Payload Verification Batch 2') fail('paused lane must remain Evidence Archive Payload Verification Batch 2');
if (authority.paused_lane?.stage !== 'MANUAL_PAYLOAD_REVIEW') fail('paused Evidence Archive stage drifted');
if (authority.paused_lane?.draft_pr !== 539) fail('paused review PR must remain #539');
if (authority.paused_lane?.canonical_promotions_authorized !== 0) fail('paused lane must authorize zero canonical promotions');

for (const phrase of [
  'two-to-four-record comparison boundary',
  'Differences only',
  'fifth selected record',
  'canonical stablecoin, organization, relationship, event, evidence',
  'PR #539'
]) {
  if (!amendment.includes(phrase)) fail(`roadmap amendment missing phrase: ${phrase}`);
}

for (const phrase of [
  'Attribute | Record 1 | Record 2 | Record 3 | Record 4',
  'Differences only',
  'fifth attempted selection',
  'No winner/loser treatment',
  'no page-level horizontal overflow'
]) {
  if (!spec.includes(phrase)) fail(`quality spec missing phrase: ${phrase}`);
}

if (!process.exitCode) console.log('Stablecoin compare matrix remediation authority: pass');
