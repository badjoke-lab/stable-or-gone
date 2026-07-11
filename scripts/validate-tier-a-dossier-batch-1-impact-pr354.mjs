import fs from 'node:fs';
import { isDeepStrictEqual } from 'node:util';
import { buildTierABatch1Impact, serializeTierABatch1Impact } from './growth/build-tier-a-batch-1-impact-pr354.mjs';

const config = JSON.parse(fs.readFileSync('config/tier-a-dossier-batch-1-pr354.json', 'utf8'));
const sourceQueue = JSON.parse(fs.readFileSync('docs/migration/tier-a-candidate-queue-pr353.json', 'utf8'));
const sourceSummary = JSON.parse(fs.readFileSync('docs/migration/record-depth-baseline-pr353-summary.json', 'utf8'));
const marketAccess = JSON.parse(fs.readFileSync('data/market-access-records-v1.json', 'utf8'));
const evidenceExtra = JSON.parse(fs.readFileSync('data/evidence-extra.json', 'utf8'));
const legalBase = JSON.parse(fs.readFileSync('data/legal-profiles-v3.json', 'utf8'));
const legalD1 = JSON.parse(fs.readFileSync('data/legal-profiles-v3-batch-d1.json', 'utf8'));
const profileOverrides = JSON.parse(fs.readFileSync('data/stablecoin-profiles-pr354-tier-a-batch-1.json', 'utf8'));
const currentProfilesSource = fs.readFileSync('src/lib/data/currentProfiles.ts', 'utf8');
const stablecoinProfilesSource = fs.readFileSync('src/lib/data/stablecoinProfiles.ts', 'utf8');
const report = buildTierABatch1Impact();
const repeat = buildTierABatch1Impact();
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const selectedSlugs = config.selected_assets.map((row) => row.asset_slug);
const selectedIds = new Set(config.selected_assets.map((row) => row.asset_id));
const expectedSlugs = ['busd', 'dai', 'rlusd', 'usdc', 'usdt'];
const expectedEvidenceIds = new Set([
  'sog_src_usdt_terms_pr354',
  'sog_src_usdc_terms_pr354',
  'sog_src_dai_whitepaper_pr354',
  'sog_src_busd_paxos_statement_pr354'
]);
const mappedSourceTypes = new Set(['legal_terms', 'official_whitepaper', 'issuer_statement']);

expect(isDeepStrictEqual(selectedSlugs, expectedSlugs), `selected asset order mismatch: ${selectedSlugs.join(',')}`);
expect(report.schema_version === '1.0', 'impact report schema version mismatch');
expect(report.report_id === 'sog_tier_a_dossier_batch_1_pr354_impact', 'impact report ID mismatch');
expect(report.status === 'deterministic_internal_impact_report', 'impact report status mismatch');
expect(report.public_output === false, 'impact report must remain internal');
expect(report.review_pr === 354, 'impact report review PR mismatch');
expect(report.selected_asset_count === 5, `impact report must contain five selected assets, found ${report.selected_asset_count}`);
expect(isDeepStrictEqual(report.selected_asset_slugs, expectedSlugs), 'impact report selected slugs mismatch');
expect(report.expected_legal_profile_target_count === 5, 'expected legal target count must be five');
expect(report.expected_redemption_override_count === 2, 'expected redemption override count must be two');
expect(report.constraints.canonical_asset_count_expected === 110, 'expected canonical asset count contract changed');
expect(report.constraints.canonical_asset_count_actual === 110, `canonical asset count must remain 110, found ${report.constraints.canonical_asset_count_actual}`);
expect(report.constraints.market_access_record_count_expected === 0, 'Market Access expected count contract changed');
expect(marketAccess.length === 0, `PR #354 must not add Market Access Records, found ${marketAccess.length}`);
expect(report.constraints.new_public_surface_allowed === false, 'new public surface must remain forbidden');
expect(report.constraints.asset_rank === false, 'asset ranking must remain forbidden');
expect(report.constraints.single_composite_score === false, 'composite score must remain forbidden');
expect(serializeTierABatch1Impact(report) === serializeTierABatch1Impact(repeat), 'impact report must be byte deterministic');
expect(isDeepStrictEqual(report, repeat), 'impact report repeated object build mismatch');
expect(typeof report.input_digest_sha256 === 'string' && /^[a-f0-9]{64}$/.test(report.input_digest_sha256), 'impact report input digest invalid');
expect(report.source_baseline_id === sourceSummary.baseline_id, 'impact report source baseline ID mismatch');
expect(report.source_baseline_input_digest_sha256 === sourceSummary.input_digest_sha256, 'impact report source baseline digest mismatch');
expect(report.current_baseline_input_digest_sha256 !== report.source_baseline_input_digest_sha256, 'post-change baseline digest must differ from historical PR #353 digest');

const queueBySlug = new Map(sourceQueue.candidates.map((row) => [row.asset_slug, row]));
for (const selected of report.selected_assets) {
  const configRow = config.selected_assets.find((row) => row.asset_slug === selected.asset_slug);
  const queueRow = queueBySlug.get(selected.asset_slug);
  expect(Boolean(configRow), `${selected.asset_slug}: missing selection config row`);
  expect(Boolean(queueRow), `${selected.asset_slug}: missing historical queue row`);
  if (configRow && queueRow) {
    expect(isDeepStrictEqual(selected.source_queue_reasons, queueRow.reasons), `${selected.asset_slug}: source queue reasons changed`);
    expect(isDeepStrictEqual(selected.historical_material_dossier_gaps, queueRow.material_dossier_gaps), `${selected.asset_slug}: historical material gaps changed`);
    expect(isDeepStrictEqual(selected.target_dimensions, configRow.target_dimensions), `${selected.asset_slug}: target dimensions differ from config`);
  }

  expect(selected.legal_profile !== null, `${selected.asset_slug}: legal profile missing`);
  expect(['usable', 'strong'].includes(selected.current_planning_states.legal_profile), `${selected.asset_slug}: legal_profile planning state did not improve beyond historical material gap; current=${selected.current_planning_states.legal_profile}`);
  expect(selected.legal_profile?.classification_count >= 1, `${selected.asset_slug}: legal classification missing`);
  expect(selected.legal_profile?.classifications.every((row) => row.classification && row.classification !== 'unclassified' && row.classification !== 'unknown'), `${selected.asset_slug}: unresolved legal classification remains`);
  expect(selected.legal_profile?.classifications.every((row) => typeof row.jurisdiction === 'string' && row.jurisdiction.length > 0), `${selected.asset_slug}: scoped legal jurisdiction missing`);
  expect(selected.legal_profile?.classifications.every((row) => row.confidence === 'high' || row.confidence === 'medium'), `${selected.asset_slug}: legal classification confidence missing`);
  expect(selected.legal_profile?.exact_evidence_ids.length >= 1, `${selected.asset_slug}: exact primary evidence linkage missing`);
  expect(selected.legal_profile?.exact_evidence_present === true, `${selected.asset_slug}: exact evidence linkage unresolved`);
}

const evidenceById = new Map(evidenceExtra.map((row) => [row.id, row]));
for (const evidenceId of expectedEvidenceIds) {
  const row = evidenceById.get(evidenceId);
  expect(Boolean(row), `required PR #354 evidence row missing: ${evidenceId}`);
  if (!row) continue;
  expect(mappedSourceTypes.has(row.source_type), `${evidenceId}: unmapped source_type ${row.source_type}`);
  expect(row.reliability === 'high', `${evidenceId}: exact primary evidence must be high reliability`);
  expect(typeof row.url === 'string' && row.url.startsWith('https://'), `${evidenceId}: primary source URL invalid`);
}
expect(evidenceById.get('sog_src_dai_whitepaper_pr354')?.source_type === 'official_whitepaper', 'DAI exact source must use mapped official_whitepaper type');

const legalRows = [...legalBase, ...legalD1];
const selectedLegalRows = legalRows.filter((row) => selectedIds.has(row.id));
expect(selectedLegalRows.length === 5, `exactly five selected legal profiles must be present, found ${selectedLegalRows.length}`);
for (const row of selectedLegalRows) {
  expect((row.evidence_ids ?? []).length >= 1, `${row.id}: legal profile evidence_ids missing`);
  expect((row.classifications ?? []).every((entry) => Array.isArray(entry.evidence_ids) && entry.evidence_ids.length >= 1), `${row.id}: legal classification evidence linkage missing`);
}

const unchangedUst = legalBase.find((row) => row.id === 'sog_st_ust');
expect(isDeepStrictEqual(unchangedUst, {id:'sog_st_ust',classifications:[{classification:'unclassified',evidence_ids:[]}],holder_claim_type:'unknown',claim_against_organization_ids:[],reserve_ownership:'unknown',reserve_segregation:'unknown',bankruptcy_remoteness:'unknown',licensed_or_regulated_as:[],evidence_ids:[]}), 'non-selected UST legal profile changed');
const unchangedEurc = legalD1.find((row) => row.id === 'sog_st_eurc');
const unchangedUsdp = legalD1.find((row) => row.id === 'sog_st_usdp');
for (const [slug, row] of [['eurc', unchangedEurc], ['usdp', unchangedUsdp]]) {
  expect(isDeepStrictEqual(row, {id:`sog_st_${slug}`,classifications:[{classification:'unclassified',evidence_ids:[]}],holder_claim_type:'unknown',claim_against_organization_ids:[],reserve_ownership:'unknown',reserve_segregation:'unknown',bankruptcy_remoteness:'unknown',licensed_or_regulated_as:[],evidence_ids:[]}), `non-selected ${slug.toUpperCase()} legal profile changed`);
}

expect(profileOverrides.length === 2, `exactly two redemption override profiles required, found ${profileOverrides.length}`);
expect(isDeepStrictEqual(profileOverrides.map((row) => row.id).sort(), ['sog_st_busd', 'sog_st_rlusd']), 'only BUSD and RLUSD may have PR #354 profile overrides');
for (const row of profileOverrides) {
  const redemption = row.redemption_profile;
  expect(redemption.status === 'eligible_customers_only', `${row.id}: redemption status mismatch`);
  expect(redemption.confidence === 'high', `${row.id}: redemption confidence must be high`);
  expect(redemption.as_of_date === '2026-07-11', `${row.id}: redemption as_of_date mismatch`);
  expect(Array.isArray(redemption.evidence_ids) && redemption.evidence_ids.length >= 2, `${row.id}: redemption evidence linkage insufficient`);
  expect(!['source_review_needed', 'unknown', null, undefined].includes(redemption.retail_access), `${row.id}: retail access remains unresolved`);
  expect(!['source_review_needed', 'unknown', null, undefined].includes(redemption.institutional_access), `${row.id}: institutional access remains unresolved`);
}

expect(currentProfilesSource.includes("profilePr354Data"), 'currentProfiles runtime must import PR #354 override file');
expect(currentProfilesSource.includes('const rawProfiles = ['), 'currentProfiles raw profile collection missing');
expect(currentProfilesSource.includes('new Map(rawProfiles.map'), 'currentProfiles deterministic last-write merge missing');
expect(currentProfilesSource.includes('const profiles = [...byId.values()]'), 'currentProfiles unique profile projection missing');
expect(stablecoinProfilesSource.includes('stablecoin-profiles-pr354-tier-a-batch-1.json'), 'profile loader inventory missing PR #354 override file');

const serialized = JSON.stringify(report);
for (const forbidden of ['risk_score','safety_score','quality_score','transparency_score','priority_score','composite_score','"rank"']) {
  expect(!serialized.includes(forbidden), `impact report contains forbidden score/rank token: ${forbidden}`);
}

if (failures.length) {
  console.error('PR #354 Tier A dossier impact validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  selected_assets: report.selected_asset_slugs,
  current_legal_profile_states: Object.fromEntries(report.selected_assets.map((row) => [row.asset_slug, row.current_planning_states.legal_profile])),
  redemption_override_assets: profileOverrides.map((row) => row.id),
  canonical_asset_count: report.constraints.canonical_asset_count_actual,
  market_access_record_count: marketAccess.length,
  current_baseline_input_digest_sha256: report.current_baseline_input_digest_sha256,
  impact_input_digest_sha256: report.input_digest_sha256
}, null, 2));
