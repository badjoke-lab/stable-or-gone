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
const promotions = read('data/candidate-promotions-batch-23.json');
const checkpoint = read('docs/migration/current-canonical-checkpoint.json');
const verification = read('data/deployment-verification-pr229.json');

const expectedCounts = {
  stablecoins:104, organizations:97, relationships:114, classifications:104, profiles:104,
  events:180, event_details:180, evidence:516, reserve_reports:112, known_unknowns:301,
  deployments:154, legal_profiles:104, reserve_components:137, income_profiles:104
};
for (const [name, count] of Object.entries(expectedCounts)) {
  const rows = ({ stablecoins, organizations, relationships, classifications, profiles, events, event_details:eventDetails, evidence, reserve_reports:reserveReports, known_unknowns:knownUnknowns, deployments, legal_profiles:legalProfiles, reserve_components:reserveComponents, income_profiles:incomeProfiles })[name];
  fail(rows.length === count, `${name}: expected ${count}, found ${rows.length}`);
}

const ids = ['sog_st_eurr','sog_st_stablrusdr'];
const stablecoinById = new Map(stablecoins.map((row) => [row.id, row]));
for (const id of ids) {
  const coin = stablecoinById.get(id);
  fail(Boolean(coin), `${id}: canonical stablecoin missing`);
  fail(coin?.status === 'restricted', `${id}: lifecycle status must be restricted`);
  fail(classifications.find((row) => row.id === id)?.issuance_status === 'paused', `${id}: issuance status must be paused`);
  fail(profiles.find((row) => row.id === id)?.redemption_profile?.status === 'suspended', `${id}: redemption status must be suspended`);
  fail(relationships.some((row) => row.stablecoin_id === id && row.organization_id === 'sog_issuer_stablr' && row.role === 'legal_issuer'), `${id}: StablR legal issuer relationship missing`);
  fail(events.filter((row) => row.stablecoin_id === id).length >= 3, `${id}: incident/recovery event chain incomplete`);
  fail(eventDetails.filter((row) => row.subject_stablecoin_ids?.includes(id)).length >= 3, `${id}: typed incident/recovery details incomplete`);
  fail(evidence.some((row) => row.stablecoin_id === id || row.stablecoin_ids?.includes(id)), `${id}: evidence missing`);
  fail(reserveReports.some((row) => row.stablecoin_id === id), `${id}: reserve context missing`);
  fail(legalProfiles.some((row) => row.id === id), `${id}: legal profile missing`);
  fail(reserveComponents.some((row) => row.stablecoin_id === id), `${id}: reserve component missing`);
  fail(incomeProfiles.some((row) => row.id === id), `${id}: income profile missing`);
}

fail(organizations.some((row) => row.id === 'sog_issuer_stablr'), 'StablR organization missing');
fail(promotions.length === 2, 'Batch 23 must contain exactly two promotions');
fail(JSON.stringify(promotions.map((row) => row.candidate_id)) === JSON.stringify(['sog_cand_000103','sog_cand_000104']), 'Batch 23 promotion IDs mismatch');
fail(promotions.every((row) => row.status === 'promoted' && row.promotion_pr === 332), 'Batch 23 promotions must be promoted by PR #332');
fail(promotions[0]?.promoted_record_id === 'sog_st_eurr', 'candidate 103 promotion target mismatch');
fail(promotions[1]?.promoted_record_id === 'sog_st_stablrusdr', 'candidate 104 promotion target mismatch');

const batchEvents = events.filter((row) => ids.includes(row.stablecoin_id));
for (const id of ids) {
  const types = new Set(batchEvents.filter((row) => row.stablecoin_id === id).map((row) => row.event_type));
  fail(types.has('security_incident'), `${id}: security incident event missing`);
  fail(types.has('redemption_change'), `${id}: recovery-plan redemption-change event missing`);
  fail(types.has('security_incident_update'), `${id}: containment update event missing`);
}

const stablrEvidence = evidence.filter((row) => row.organization_ids?.includes('sog_issuer_stablr') || row.issuer_id === 'sog_issuer_stablr');
fail(stablrEvidence.length === 8, `StablR evidence count must be 8, found ${stablrEvidence.length}`);

const stablrDeployments = deployments.filter((row) => ids.includes(row.stablecoin_id));
fail(stablrDeployments.length === 7, `StablR deployment count must be 7, found ${stablrDeployments.length}`);
fail(stablrDeployments.every((row) => row.evidence_ids?.includes('sog_src_stablr_contracts_batch_v')), 'all StablR deployments must cite official contract documentation');
const expectedDeploymentIds = [
  'sog_dep_eurr_ethereum_batch_v','sog_dep_eurr_plasma_batch_v','sog_dep_eurr_concordium_batch_v','sog_dep_eurr_solana_batch_v',
  'sog_dep_usdr_ethereum_batch_v','sog_dep_usdr_plasma_batch_v','sog_dep_usdr_concordium_batch_v'
];
fail(expectedDeploymentIds.every((id) => verification.status_ids?.verified?.includes(id)), 'all seven StablR deployments must be verified in deployment overlay');
fail(verification.expected_total === 154, 'deployment verification expected_total must be 154');
fail(verification.status_counts?.verified === 32, 'verified deployment count must be 32');

for (const id of ids) {
  const topics = new Set(knownUnknowns.filter((row) => row.stablecoin_id === id).map((row) => row.topic));
  for (const topic of ['launch_date','current_service_state','incident_impact']) fail(topics.has(topic), `${id}: known unknown missing ${topic}`);
}

fail(checkpoint.checkpoint_id === 'sog_controlled_growth_104_checkpoint_pr332_2026_07_09', 'current checkpoint ID mismatch');
fail(checkpoint.asset_count === 104, 'current checkpoint asset_count must be 104');
fail(checkpoint.previous_checkpoint_id === 'sog_controlled_growth_102_checkpoint_pr330_2026_07_08', 'previous checkpoint linkage mismatch');
const checkpointExpected = { assets:104, organizations:97, relationships:114, events:180, evidence:516, reserve_reports:112, known_unknowns:301, regulatory_notes:9, deployments:154, legal_profiles:104, stable_asset_relationships:4, reserve_components:137, income_profiles:104 };
for (const [key, count] of Object.entries(checkpoint.expected_counts ?? {})) fail(count === checkpointExpected[key], `checkpoint expected_counts.${key} mismatch`);

if (failures.length) {
  console.error('PR #332 controlled growth validation failed:');
  failures.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}
console.log(JSON.stringify({
  ok:true,
  canonical_assets:stablecoins.length,
  promoted_candidates:promotions.map((row) => row.candidate_id),
  checkpoint_id:checkpoint.checkpoint_id,
  stablr_events:batchEvents.length,
  stablr_evidence:stablrEvidence.length,
  stablr_deployments:stablrDeployments.length,
  lifecycle_statuses:ids.map((id) => [id, stablecoinById.get(id)?.status])
}, null, 2));
