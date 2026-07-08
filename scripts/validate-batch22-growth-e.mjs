import fs from 'node:fs';
import path from 'node:path';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const root = process.cwd();
const failures = [];
const read = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const fail = (condition, message) => { if (!condition) failures.push(message); };
const baseline = loadRegistryV2Baseline(root);
const group = (name) => (baseline.data_groups?.[name] ?? []).flatMap(read);

const stablecoins = group('stablecoins');
const organizations = group('organizations');
const relationships = group('relationships');
const classifications = group('classifications');
const profiles = group('profiles');
const events = group('events');
const eventDetails = group('event_details');
const evidence = group('evidence');
const reserveReports = group('reserve_reports');
const knownUnknowns = group('known_unknowns');
const deployments = group('deployments');
const legalManifest = read('docs/migration/registry-v3-foundation.json');
const incomeManifest = read('docs/migration/registry-v3-income-profiles.json');
const legalProfiles = (legalManifest.data_groups?.legal_profiles ?? []).flatMap(read);
const reserveComponents = (legalManifest.data_groups?.reserve_components ?? []).flatMap(read);
const incomeProfiles = (incomeManifest.data_files ?? []).flatMap(read);
const corrections = read('data/next-growth-candidate-corrections-pr330.json');
const promotions = read('data/candidate-promotions-batch-22.json');
const checkpoint = read('docs/migration/current-canonical-checkpoint.json');

const expectedCounts = {
  stablecoins: 102,
  organizations: 96,
  relationships: 112,
  classifications: 102,
  profiles: 102,
  events: 174,
  event_details: 174,
  evidence: 508,
  reserve_reports: 110,
  known_unknowns: 295,
  deployments: 147,
  legal_profiles: 102,
  reserve_components: 135,
  income_profiles: 102
};

for (const [name, count] of Object.entries(expectedCounts)) {
  const rows = ({ stablecoins, organizations, relationships, classifications, profiles, events, event_details: eventDetails, evidence, reserve_reports: reserveReports, known_unknowns: knownUnknowns, deployments, legal_profiles: legalProfiles, reserve_components: reserveComponents, income_profiles: incomeProfiles })[name];
  fail(rows.length === count, `${name}: expected ${count}, found ${rows.length}`);
}

const stablecoinById = new Map(stablecoins.map((row) => [row.id, row]));
for (const id of ['sog_st_eure', 'sog_st_1gbp']) fail(stablecoinById.has(id), `${id}: canonical stablecoin missing`);
fail(!stablecoinById.has('sog_st_gbpt'), 'phantom sog_st_gbpt record must not exist');
fail(stablecoinById.get('sog_st_eure')?.status === 'active', 'EURe must be active');
fail(stablecoinById.get('sog_st_1gbp')?.status === 'unknown', '1GBP must preserve unknown lifecycle state');
fail(stablecoinById.get('sog_st_1gbp')?.symbol === '1GBP', 'poundtoken symbol must be 1GBP');

fail(corrections.length === 1, 'exactly one PR #330 candidate correction is required');
fail(corrections[0]?.candidate_id === 'sog_cand_000102', 'candidate correction must target 102');
fail(corrections[0]?.proposed_stablecoin_id === 'sog_st_1gbp', 'candidate 102 corrected stablecoin ID mismatch');
fail(corrections[0]?.symbol === '1GBP', 'candidate 102 corrected symbol mismatch');

fail(promotions.length === 2, 'Batch 22 must contain exactly two promotions');
fail(JSON.stringify(promotions.map((row) => row.candidate_id)) === JSON.stringify(['sog_cand_000101','sog_cand_000102']), 'Batch 22 promotion IDs mismatch');
fail(promotions.every((row) => row.status === 'promoted' && row.promotion_pr === 330), 'Batch 22 promotions must be promoted by PR #330');
fail(promotions[0]?.promoted_record_id === 'sog_st_eure', 'candidate 101 promotion target mismatch');
fail(promotions[1]?.promoted_record_id === 'sog_st_1gbp', 'candidate 102 promotion target mismatch');

for (const id of ['sog_st_eure', 'sog_st_1gbp']) {
  fail(classifications.some((row) => row.id === id), `${id}: classification missing`);
  fail(profiles.some((row) => row.id === id), `${id}: reserve/redemption profile missing`);
  fail(relationships.some((row) => row.stablecoin_id === id), `${id}: relationship missing`);
  fail(events.some((row) => row.stablecoin_id === id), `${id}: event missing`);
  fail(eventDetails.some((row) => row.subject_stablecoin_ids?.includes(id)), `${id}: typed event detail missing`);
  fail(evidence.some((row) => row.stablecoin_id === id || row.stablecoin_ids?.includes(id)), `${id}: evidence missing`);
  fail(reserveReports.some((row) => row.stablecoin_id === id), `${id}: reserve context missing`);
  fail(knownUnknowns.some((row) => row.stablecoin_id === id), `${id}: known unknown missing`);
  fail(deployments.some((row) => row.stablecoin_id === id), `${id}: deployment missing`);
  fail(legalProfiles.some((row) => row.id === id), `${id}: legal profile missing`);
  fail(reserveComponents.some((row) => row.stablecoin_id === id), `${id}: reserve component missing`);
  fail(incomeProfiles.some((row) => row.id === id), `${id}: income profile missing`);
}

const eureDeployments = deployments.filter((row) => row.stablecoin_id === 'sog_st_eure');
fail(eureDeployments.length === 6, `EURe must have six exact official EVM deployments, found ${eureDeployments.length}`);
fail(eureDeployments.every((row) => /^0x[a-fA-F0-9]{40}$/.test(row.contract_address ?? '')), 'EURe deployment contract identifiers must be exact EVM addresses');
const gbpDeployments = deployments.filter((row) => row.stablecoin_id === 'sog_st_1gbp');
fail(gbpDeployments.length === 1, '1GBP must have exactly one verified Ethereum deployment in PR #330');
fail(gbpDeployments[0]?.contract_address?.toLowerCase() === '0x86b4dbe5d203e634a12364c0e428fa242a3fba98', '1GBP contract mismatch');

const gbpUnknownTopics = new Set(knownUnknowns.filter((row) => row.stablecoin_id === 'sog_st_1gbp').map((row) => row.topic));
for (const topic of ['current_service_state','reserve_detail','launch_date']) fail(gbpUnknownTopics.has(topic), `1GBP known unknown missing: ${topic}`);

fail(checkpoint.checkpoint_id === 'sog_controlled_growth_102_checkpoint_pr330_2026_07_08', 'current checkpoint ID mismatch');
fail(checkpoint.asset_count === 102, 'current checkpoint asset_count must be 102');
fail(checkpoint.previous_checkpoint_id === 'sog_audited_100_asset_checkpoint_pr318_2026_07_06', 'previous checkpoint linkage mismatch');
for (const [key, count] of Object.entries(checkpoint.expected_counts ?? {})) {
  fail(count === ({ assets:102, organizations:96, relationships:112, events:174, evidence:508, reserve_reports:110, known_unknowns:295, regulatory_notes:9, deployments:147, legal_profiles:102, stable_asset_relationships:4, reserve_components:135, income_profiles:102 })[key], `checkpoint expected_counts.${key} mismatch`);
}

if (failures.length) {
  console.error('PR #330 controlled growth validation failed:');
  failures.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  canonical_assets: stablecoins.length,
  promoted_candidates: promotions.map((row) => row.candidate_id),
  corrected_identity: corrections[0],
  checkpoint_id: checkpoint.checkpoint_id,
  eure_deployments: eureDeployments.length,
  poundtoken_lifecycle: stablecoinById.get('sog_st_1gbp')?.status
}, null, 2));
