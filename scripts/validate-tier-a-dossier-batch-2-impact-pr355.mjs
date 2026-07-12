import fs from 'node:fs';
import { isDeepStrictEqual } from 'node:util';
import { buildTierABatch2Impact, serializeTierABatch2Impact } from './growth/build-tier-a-batch-2-impact-pr355.mjs';

const report = buildTierABatch2Impact();
const repeat = buildTierABatch2Impact();
const config = JSON.parse(fs.readFileSync('config/tier-a-dossier-batch-2-pr355.json', 'utf8'));
const queue = JSON.parse(fs.readFileSync('docs/migration/tier-a-candidate-queue-pr353.json', 'utf8'));
const handoff = JSON.parse(fs.readFileSync('docs/migration/tier-a-batch-1-pr354-reviewed-handoff.json', 'utf8'));
const evidence = JSON.parse(fs.readFileSync('data/evidence-pr355-tier-a-batch-2.json', 'utf8'));
const overrides = JSON.parse(fs.readFileSync('data/stablecoin-profiles-pr355-tier-a-batch-2.json', 'utf8'));
const marketAccess = JSON.parse(fs.readFileSync('data/market-access-records-v1.json', 'utf8'));
const currentProfilesSource = fs.readFileSync('src/lib/data/currentProfiles.ts', 'utf8');
const stablecoinProfilesSource = fs.readFileSync('src/lib/data/stablecoinProfiles.ts', 'utf8');
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const expectedSlugs = ['fdusd', 'frax', 'pyusd', 'usdp', 'ust'];
const expectedNewEvidenceIds = [
  'sog_src_fdusd_product_pr355',
  'sog_src_frax_v3_overview_pr355',
  'sog_src_paxos_stablecoin_terms_pr355',
  'sog_src_pyusd_product_pr355',
  'sog_src_usdp_product_pr355'
];
const mappedSourceTypes = new Set(['official_product_page', 'protocol_docs', 'legal_terms']);

expect(report.schema_version === '1.0', 'impact schema version mismatch');
expect(report.report_id === 'sog_tier_a_dossier_batch_2_pr355_impact', 'impact report ID mismatch');
expect(report.status === 'deterministic_internal_impact_report', 'impact report status mismatch');
expect(report.public_output === false, 'impact report must remain internal');
expect(report.review_pr === 355, 'impact report review PR mismatch');
expect(report.selected_asset_count === 5, 'impact report must contain five assets');
expect(isDeepStrictEqual(report.selected_asset_slugs, expectedSlugs), 'impact selected slugs mismatch');
expect(isDeepStrictEqual(report.authorized_redemption_asset_slugs, ['frax', 'pyusd', 'usdp']), 'authorized redemption assets mismatch');
expect(report.prior_batch_handoff_id === handoff.handoff_id, 'prior handoff ID mismatch');
expect(report.prior_batch_merge_commit === handoff.source_merge_commit, 'prior handoff merge commit mismatch');
expect(report.current_canonical_checkpoint_id === 'sog_tier_a_dossier_batch_2_canonical_110_checkpoint_pr355_2026_07_12', 'current checkpoint mismatch');
expect(report.constraints.canonical_asset_count_actual === 110, 'canonical asset count changed');
expect(report.constraints.canonical_evidence_count_actual === 552, 'canonical evidence count must be 552');
expect(marketAccess.length === 0, 'PR #355 must not add Market Access Records');
expect(report.constraints.market_access_record_count_expected === 0, 'Market Access count contract changed');
expect(report.constraints.new_public_surface_allowed === false, 'new public surface boundary changed');
expect(report.constraints.asset_rank === false, 'asset rank boundary changed');
expect(report.constraints.single_composite_score === false, 'composite score boundary changed');
expect(serializeTierABatch2Impact(report) === serializeTierABatch2Impact(repeat), 'impact report must be byte deterministic');
expect(isDeepStrictEqual(report, repeat), 'impact repeated object build mismatch');
expect(/^[a-f0-9]{64}$/.test(report.input_digest_sha256), 'impact input digest invalid');
expect(report.current_baseline_input_digest_sha256 !== report.source_baseline_input_digest_sha256, 'current baseline digest must differ from immutable PR #353 baseline');

const queueBySlug = new Map(queue.candidates.map((row) => [row.asset_slug, row]));
for (const row of report.selected_assets) {
  const selected = config.selected_assets.find((entry) => entry.asset_slug === row.asset_slug);
  const source = queueBySlug.get(row.asset_slug);
  expect(Boolean(selected), `${row.asset_slug}: missing config row`);
  expect(Boolean(source), `${row.asset_slug}: missing queue row`);
  if (selected && source) {
    expect(isDeepStrictEqual(row.source_queue_reasons, source.reasons), `${row.asset_slug}: queue reasons changed`);
    expect(isDeepStrictEqual(row.historical_material_dossier_gaps, source.material_dossier_gaps), `${row.asset_slug}: historical material gaps changed`);
    expect(isDeepStrictEqual(row.target_dimensions, selected.target_dimensions), `${row.asset_slug}: target dimensions changed`);
  }
  expect(row.legal_profile !== null, `${row.asset_slug}: legal profile missing`);
  expect((row.legal_profile?.classifications ?? []).length >= 1, `${row.asset_slug}: classification missing`);
  expect(row.legal_profile.classifications.every((entry) => !['unclassified', 'unknown', null].includes(entry.classification)), `${row.asset_slug}: unresolved classification remains`);
  expect(row.legal_profile.classifications.every((entry) => typeof entry.jurisdiction === 'string' && entry.jurisdiction.length > 0), `${row.asset_slug}: classification jurisdiction missing`);
  expect(row.legal_profile.classifications.every((entry) => ['high', 'medium'].includes(entry.confidence)), `${row.asset_slug}: classification confidence missing`);
  expect(['usable', 'strong'].includes(row.current_planning_states.legal_profile), `${row.asset_slug}: legal planning state did not improve; current=${row.current_planning_states.legal_profile}`);
  expect(row.exact_pr355_evidence_ids.length >= 1, `${row.asset_slug}: exact reviewed evidence missing`);
  expect(row.exact_pr355_evidence_present === true, `${row.asset_slug}: exact reviewed evidence unresolved`);
}

const ust = report.selected_assets.find((row) => row.asset_slug === 'ust');
expect(ust?.legal_profile?.evidence_ids.includes('sog_src_ust_sec_2023_32'), 'UST must reuse existing canonical SEC evidence identity');
expect(ust?.exact_pr355_evidence_ids.includes('sog_src_ust_sec_2023_32'), 'UST impact must include reviewed existing SEC source');

for (const slug of ['frax', 'pyusd', 'usdp']) {
  const row = report.selected_assets.find((entry) => entry.asset_slug === slug);
  expect(Boolean(row?.redemption_override), `${slug}: redemption override missing`);
  expect(['usable', 'strong'].includes(row?.current_planning_states.redemption), `${slug}: redemption planning state did not improve; current=${row?.current_planning_states.redemption}`);
  expect(row?.redemption_override?.as_of_date === '2026-07-12', `${slug}: redemption as_of_date mismatch`);
  expect(row?.redemption_override?.confidence === 'high', `${slug}: redemption confidence must be high`);
  expect((row?.redemption_override?.evidence_ids ?? []).length >= 1, `${slug}: redemption evidence missing`);
  expect(!['unknown', 'source_review_needed', null].includes(row?.redemption_override?.retail_access), `${slug}: retail access unresolved`);
  expect(!['unknown', 'source_review_needed', null].includes(row?.redemption_override?.institutional_access), `${slug}: institutional access unresolved`);
}
for (const slug of ['fdusd', 'ust']) {
  const row = report.selected_assets.find((entry) => entry.asset_slug === slug);
  expect(row?.redemption_override === null, `${slug}: unauthorized redemption override present`);
}

expect(overrides.length === 3, `expected three redemption overrides, found ${overrides.length}`);
expect(isDeepStrictEqual(overrides.map((row) => row.id).sort(), ['sog_st_frax', 'sog_st_pyusd', 'sog_st_usdp']), 'override asset set mismatch');

const evidenceById = new Map(evidence.map((row) => [row.id, row]));
expect(evidence.length === 5, `expected five new evidence rows, found ${evidence.length}`);
expect(new Set(evidence.map((row) => row.url)).size === evidence.length, 'PR #355 new evidence URLs must be unique');
for (const id of expectedNewEvidenceIds) {
  const row = evidenceById.get(id);
  expect(Boolean(row), `missing evidence ${id}`);
  if (!row) continue;
  expect(mappedSourceTypes.has(row.source_type), `${id}: unmapped source type ${row.source_type}`);
  expect(row.reliability === 'high', `${id}: reliability must be high`);
  expect(typeof row.url === 'string' && row.url.startsWith('https://'), `${id}: URL invalid`);
}
const sharedPaxos = evidenceById.get('sog_src_paxos_stablecoin_terms_pr355');
expect(isDeepStrictEqual(sharedPaxos?.stablecoin_ids, ['sog_st_pyusd', 'sog_st_usdp']), 'Paxos terms must be one multi-subject evidence row');

for (const completed of handoff.completed_asset_exclusions_for_next_batch) {
  expect(!report.selected_asset_slugs.includes(completed), `${completed}: completed PR #354 asset selected again`);
}

expect(currentProfilesSource.includes('profilePr355Data'), 'currentProfiles must load PR #355 overrides');
expect(currentProfilesSource.includes('...profilePr354Data,...profilePr355Data'), 'PR #355 overrides must load after PR #354 overrides');
expect(stablecoinProfilesSource.includes('stablecoin-profiles-pr355-tier-a-batch-2.json'), 'profile loader inventory missing PR #355 file');

const forbiddenKeys = new Set(['risk_score', 'safety_score', 'quality_score', 'transparency_score', 'priority_score', 'composite_score', 'rank']);
const inspectKeys = (value, path = '$') => {
  if (Array.isArray(value)) {
    value.forEach((entry, index) => inspectKeys(entry, `${path}[${index}]`));
    return;
  }
  if (!value || typeof value !== 'object') return;
  for (const [key, nested] of Object.entries(value)) {
    expect(!forbiddenKeys.has(key), `impact report contains forbidden exact key ${key} at ${path}`);
    inspectKeys(nested, `${path}.${key}`);
  }
};
inspectKeys(report);

if (failures.length) {
  console.error('PR #355 Tier A dossier impact validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  selected_assets: report.selected_asset_slugs,
  legal_states: Object.fromEntries(report.selected_assets.map((row) => [row.asset_slug, row.current_planning_states.legal_profile])),
  redemption_states: Object.fromEntries(report.selected_assets.map((row) => [row.asset_slug, row.current_planning_states.redemption])),
  new_primary_evidence_count: evidence.length,
  reused_existing_evidence_ids: ['sog_src_ust_sec_2023_32'],
  canonical_asset_count: report.constraints.canonical_asset_count_actual,
  canonical_evidence_count: report.constraints.canonical_evidence_count_actual,
  market_access_record_count: marketAccess.length,
  input_digest_sha256: report.input_digest_sha256
}, null, 2));
