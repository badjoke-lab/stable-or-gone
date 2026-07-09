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
const promotions = read('data/candidate-promotions-batch-24.json');
const checkpoint = read('docs/migration/current-canonical-checkpoint.json');
const verification = read('data/deployment-verification-pr229.json');

const expectedCounts = {
  stablecoins:106, organizations:99, relationships:116, classifications:106, profiles:106,
  events:183, event_details:183, evidence:525, reserve_reports:114, known_unknowns:307,
  deployments:159, legal_profiles:106, reserve_components:139, income_profiles:106
};
const rowsByName = {
  stablecoins, organizations, relationships, classifications, profiles, events,
  event_details:eventDetails, evidence, reserve_reports:reserveReports,
  known_unknowns:knownUnknowns, deployments, legal_profiles:legalProfiles,
  reserve_components:reserveComponents, income_profiles:incomeProfiles
};
for (const [name, count] of Object.entries(expectedCounts)) {
  fail(rowsByName[name].length === count, `${name}: expected ${count}, found ${rowsByName[name].length}`);
}

const stablecoinById = new Map(stablecoins.map((row) => [row.id, row]));
const classificationById = new Map(classifications.map((row) => [row.id, row]));
const profileById = new Map(profiles.map((row) => [row.id, row]));
const ids = ['sog_st_phpc','sog_st_xidr'];
for (const id of ids) {
  fail(stablecoinById.has(id), `${id}: canonical stablecoin missing`);
  fail(evidence.some((row) => row.stablecoin_id === id || row.stablecoin_ids?.includes(id)), `${id}: evidence missing`);
  fail(reserveReports.some((row) => row.stablecoin_id === id), `${id}: reserve context missing`);
  fail(legalProfiles.some((row) => row.id === id), `${id}: legal profile missing`);
  fail(reserveComponents.some((row) => row.stablecoin_id === id), `${id}: reserve component missing`);
  fail(incomeProfiles.some((row) => row.id === id), `${id}: income profile missing`);
}

const phpc = stablecoinById.get('sog_st_phpc');
fail(phpc?.status === 'limited', 'PHPC legacy status must remain limited');
fail(phpc?.launch_date === null, 'PHPC original launch date must remain null');
fail(classificationById.get('sog_st_phpc')?.lifecycle_status === 'restricted', 'PHPC lifecycle must remain restricted');
fail(classificationById.get('sog_st_phpc')?.issuance_status === 'restricted', 'PHPC issuance status must remain restricted');
fail(profileById.get('sog_st_phpc')?.redemption_profile?.status === 'restricted', 'PHPC redemption status must remain restricted');
fail(relationships.some((row) => row.stablecoin_id === 'sog_st_phpc' && row.organization_id === 'sog_issuer_coins_ph' && row.role === 'legal_issuer'), 'PHPC legal issuer relationship missing');

const xidr = stablecoinById.get('sog_st_xidr');
fail(xidr?.status === 'active', 'XIDR legacy status must be active');
fail(xidr?.launch_date === '2021-11-18', 'XIDR launch date must remain 2021-11-18');
fail(classificationById.get('sog_st_xidr')?.lifecycle_status === 'active', 'XIDR lifecycle must remain active');
fail(classificationById.get('sog_st_xidr')?.issuance_status === 'open', 'XIDR issuance status must remain open');
fail(profileById.get('sog_st_xidr')?.redemption_profile?.status === 'eligible_customers_only', 'XIDR redemption status must remain eligible_customers_only');
fail(relationships.some((row) => row.stablecoin_id === 'sog_st_xidr' && row.organization_id === 'sog_issuer_straitsx_indonesia' && row.role === 'legal_issuer'), 'XIDR legal issuer relationship missing');

for (const organizationId of ['sog_issuer_coins_ph','sog_issuer_straitsx_indonesia']) {
  fail(organizations.some((row) => row.id === organizationId), `${organizationId}: organization missing`);
}

fail(promotions.length === 2, 'Batch 24 must contain exactly two promotions');
fail(JSON.stringify(promotions.map((row) => row.candidate_id)) === JSON.stringify(['sog_cand_000105','sog_cand_000106']), 'Batch 24 promotion IDs mismatch');
fail(promotions.every((row) => row.status === 'promoted' && row.promotion_pr === 333), 'Batch 24 promotions must be promoted by PR #333');
fail(promotions[0]?.promoted_record_id === 'sog_st_phpc', 'candidate 105 promotion target mismatch');
fail(promotions[1]?.promoted_record_id === 'sog_st_xidr', 'candidate 106 promotion target mismatch');

const batchEvents = events.filter((row) => ids.includes(row.stablecoin_id));
fail(batchEvents.filter((row) => row.stablecoin_id === 'sog_st_phpc').length === 2, 'PHPC must have exactly two Batch 24 canonical events');
fail(batchEvents.filter((row) => row.stablecoin_id === 'sog_st_xidr').length === 1, 'XIDR must have exactly one Batch 24 canonical event');
fail(batchEvents.some((row) => row.id === 'sog_ev_phpc_sandbox_batch_w' && row.event_type === 'regulatory_action'), 'PHPC sandbox event missing');
fail(batchEvents.some((row) => row.id === 'sog_ev_phpc_ronin_launch_batch_w' && row.event_type === 'network_launch'), 'PHPC Ronin launch event missing');
fail(batchEvents.some((row) => row.id === 'sog_ev_xidr_launch_batch_w' && row.event_type === 'launch'), 'XIDR launch event missing');
for (const event of batchEvents) fail(eventDetails.some((detail) => detail.id === event.id), `${event.id}: typed event detail missing`);

const batchEvidence = evidence.filter((row) => ids.includes(row.stablecoin_id));
fail(batchEvidence.length === 9, `Batch 24 evidence count must be 9, found ${batchEvidence.length}`);

const batchDeployments = deployments.filter((row) => ids.includes(row.stablecoin_id));
fail(batchDeployments.length === 5, `Batch 24 deployment count must be 5, found ${batchDeployments.length}`);
const exactDeploymentIds = [
  'sog_dep_phpc_ronin_batch_w',
  'sog_dep_xidr_ethereum_batch_w',
  'sog_dep_xidr_polygon_batch_w',
  'sog_dep_xidr_zilliqa_batch_w'
];
for (const id of exactDeploymentIds) fail(verification.status_ids?.verified?.includes(id), `${id}: exact deployment must be verified`);
fail(verification.status_ids?.source_linked_no_identifier?.includes('sog_dep_phpc_polygon_batch_w'), 'PHPC Polygon deployment must remain source-linked without asserted identifier');
fail(verification.expected_total === 159, 'deployment verification expected_total must be 159');
fail(verification.status_counts?.verified === 36, 'verified deployment count must be 36');
fail(verification.status_counts?.source_linked_no_identifier === 77, 'source-linked-no-identifier deployment count must be 77');

const requiredTopics = {
  sog_st_phpc:['launch_date','current_service_state','reserve_reporting','deployment_identifier'],
  sog_st_xidr:['reserve_reporting','redemption_terms']
};
for (const [id, topics] of Object.entries(requiredTopics)) {
  const actual = new Set(knownUnknowns.filter((row) => row.stablecoin_id === id).map((row) => row.topic));
  for (const topic of topics) fail(actual.has(topic), `${id}: known unknown missing ${topic}`);
}

fail(checkpoint.checkpoint_id === 'sog_controlled_growth_106_checkpoint_pr333_2026_07_09', 'current checkpoint ID mismatch');
fail(checkpoint.asset_count === 106, 'current checkpoint asset_count must be 106');
fail(checkpoint.previous_checkpoint_id === 'sog_controlled_growth_104_checkpoint_pr332_2026_07_09', 'previous checkpoint linkage mismatch');
const checkpointExpected = {
  assets:106, organizations:99, relationships:116, events:183, evidence:525,
  reserve_reports:114, known_unknowns:307, regulatory_notes:9, deployments:159,
  legal_profiles:106, stable_asset_relationships:4, reserve_components:139, income_profiles:106
};
for (const [key, count] of Object.entries(checkpoint.expected_counts ?? {})) {
  fail(count === checkpointExpected[key], `checkpoint expected_counts.${key} mismatch`);
}

if (failures.length) {
  console.error('PR #333 controlled growth validation failed:');
  failures.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}

console.log(JSON.stringify({
  ok:true,
  canonical_assets:stablecoins.length,
  promoted_candidates:promotions.map((row) => row.candidate_id),
  checkpoint_id:checkpoint.checkpoint_id,
  batch_events:batchEvents.length,
  batch_evidence:batchEvidence.length,
  batch_deployments:batchDeployments.length,
  lifecycle_statuses:ids.map((id) => [id, classificationById.get(id)?.lifecycle_status])
}, null, 2));
