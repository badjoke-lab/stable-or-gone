import fs from 'node:fs';
import path from 'node:path';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';
import { loadDeploymentVerification } from './load-deployment-verification.mjs';

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
const promotions = read('data/candidate-promotions-batch-25.json');
const checkpoint = read('docs/migration/current-canonical-checkpoint.json');
const verification = loadDeploymentVerification(root);

const expectedCounts = {
  stablecoins:108, organizations:101, relationships:118, classifications:108, profiles:108,
  events:185, event_details:185, evidence:537, reserve_reports:116, known_unknowns:313,
  deployments:168, legal_profiles:108, reserve_components:141, income_profiles:108
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
const ids = ['sog_st_cadc','sog_st_zarp'];
for (const id of ids) {
  fail(stablecoinById.has(id), `${id}: canonical stablecoin missing`);
  fail(evidence.some((row) => row.stablecoin_id === id || row.stablecoin_ids?.includes(id)), `${id}: evidence missing`);
  fail(reserveReports.some((row) => row.stablecoin_id === id), `${id}: reserve context missing`);
  fail(legalProfiles.some((row) => row.id === id), `${id}: legal profile missing`);
  fail(reserveComponents.some((row) => row.stablecoin_id === id), `${id}: reserve component missing`);
  fail(incomeProfiles.some((row) => row.id === id), `${id}: income profile missing`);
}

for (const id of ids) {
  const coin = stablecoinById.get(id);
  fail(coin?.status === 'active', `${id}: legacy status must be active`);
  fail(coin?.launch_date === null, `${id}: original launch date must remain null`);
  fail(classificationById.get(id)?.lifecycle_status === 'active', `${id}: lifecycle must remain active`);
  fail(classificationById.get(id)?.issuance_status === 'restricted', `${id}: issuance status must remain restricted`);
  fail(profileById.get(id)?.redemption_profile?.status === 'eligible_customers_only', `${id}: redemption status must remain eligible_customers_only`);
}
fail(relationships.some((row) => row.stablecoin_id === 'sog_st_cadc' && row.organization_id === 'sog_issuer_loon_technology' && row.role === 'legal_issuer'), 'CADC legal issuer relationship missing');
fail(relationships.some((row) => row.stablecoin_id === 'sog_st_zarp' && row.organization_id === 'sog_issuer_zarp_stablecoin' && row.role === 'legal_issuer'), 'ZARP legal issuer relationship missing');
for (const organizationId of ['sog_issuer_loon_technology','sog_issuer_zarp_stablecoin']) {
  fail(organizations.some((row) => row.id === organizationId), `${organizationId}: organization missing`);
}

fail(promotions.length === 2, 'Batch 25 must contain exactly two promotions');
fail(JSON.stringify(promotions.map((row) => row.candidate_id)) === JSON.stringify(['sog_cand_000107','sog_cand_000108']), 'Batch 25 promotion IDs mismatch');
fail(promotions.every((row) => row.status === 'promoted' && row.promotion_pr === 334), 'Batch 25 promotions must be promoted by PR #334');
fail(promotions[0]?.promoted_record_id === 'sog_st_cadc', 'candidate 107 promotion target mismatch');
fail(promotions[1]?.promoted_record_id === 'sog_st_zarp', 'candidate 108 promotion target mismatch');

const batchEvents = events.filter((row) => ids.includes(row.stablecoin_id));
fail(batchEvents.length === 2, `Batch 25 event count must be 2, found ${batchEvents.length}`);
fail(batchEvents.some((row) => row.id === 'sog_ev_cadc_loon_transition_batch_x' && row.event_type === 'issuer_transition' && row.event_date === '2025-10-27'), 'CADC issuer transition event missing or changed');
fail(batchEvents.some((row) => row.id === 'sog_ev_zarp_solana_migration_batch_x' && row.event_type === 'token_migration' && row.event_date === '2025-07-11'), 'ZARP Solana migration event missing or changed');
for (const event of batchEvents) fail(eventDetails.some((detail) => detail.id === event.id), `${event.id}: typed event detail missing`);

const batchEvidence = evidence.filter((row) => ids.includes(row.stablecoin_id));
fail(batchEvidence.length === 12, `Batch 25 evidence count must be 12, found ${batchEvidence.length}`);

const batchDeployments = deployments.filter((row) => ids.includes(row.stablecoin_id));
fail(batchDeployments.length === 9, `Batch 25 deployment count must be 9, found ${batchDeployments.length}`);
const exactDeploymentIds = [
  'sog_dep_cadc_ethereum_batch_x','sog_dep_cadc_base_batch_x','sog_dep_cadc_polygon_batch_x',
  'sog_dep_cadc_arbitrum_batch_x','sog_dep_cadc_solana_batch_x','sog_dep_zarp_base_batch_x',
  'sog_dep_zarp_ethereum_batch_x','sog_dep_zarp_polygon_batch_x','sog_dep_zarp_solana_batch_x'
];
for (const id of exactDeploymentIds) fail(verification.status_ids?.verified?.includes(id), `${id}: exact deployment must be verified`);
fail(verification.expected_total === 168, `deployment verification expected_total must be 168, found ${verification.expected_total}`);
fail(verification.status_counts?.verified === 45, `verified deployment count must be 45, found ${verification.status_counts?.verified}`);
fail(verification.status_counts?.source_linked_no_identifier === 77, 'source-linked-no-identifier deployment count must remain 77');

const cadcDeployments = batchDeployments.filter((row) => row.stablecoin_id === 'sog_st_cadc');
fail(cadcDeployments.filter((row) => row.canonicality === 'issuer_native').length === 1, 'CADC must have exactly one issuer-native deployment');
fail(cadcDeployments.filter((row) => row.canonicality === 'canonical_bridge').length === 4, 'CADC must have four canonical bridge deployments');
const zarpChains = batchDeployments.filter((row) => row.stablecoin_id === 'sog_st_zarp').map((row) => row.chain).sort();
fail(JSON.stringify(zarpChains) === JSON.stringify(['Base','Ethereum','Polygon','Solana']), 'ZARP native chain set must be exactly Base/Ethereum/Polygon/Solana');
fail(!batchDeployments.some((row) => row.stablecoin_id === 'sog_st_zarp' && row.chain === 'Gnosis'), 'Gnosis must not be promoted as a current native ZARP deployment');

const requiredTopics = {
  sog_st_cadc:['launch_date','issuer_structure','deployment_lineage'],
  sog_st_zarp:['launch_date','reserve_reporting','deployment_lineage']
};
for (const [id, topics] of Object.entries(requiredTopics)) {
  const actual = new Set(knownUnknowns.filter((row) => row.stablecoin_id === id).map((row) => row.topic));
  for (const topic of topics) fail(actual.has(topic), `${id}: known unknown missing ${topic}`);
}

fail(checkpoint.checkpoint_id === 'sog_controlled_growth_108_checkpoint_pr334_2026_07_09', 'current checkpoint ID mismatch');
fail(checkpoint.asset_count === 108, 'current checkpoint asset_count must be 108');
fail(checkpoint.previous_checkpoint_id === 'sog_controlled_growth_106_checkpoint_pr333_2026_07_09', 'previous checkpoint linkage mismatch');
const checkpointExpected = {
  assets:108, organizations:101, relationships:118, events:185, evidence:537,
  reserve_reports:116, known_unknowns:313, regulatory_notes:9, deployments:168,
  legal_profiles:108, stable_asset_relationships:4, reserve_components:141, income_profiles:108
};
for (const [key, count] of Object.entries(checkpoint.expected_counts ?? {})) {
  fail(count === checkpointExpected[key], `checkpoint expected_counts.${key} mismatch`);
}

if (failures.length) {
  console.error('PR #334 controlled growth validation failed:');
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
  deployment_verification_total:verification.expected_total,
  lifecycle_statuses:ids.map((id) => [id, classificationById.get(id)?.lifecycle_status])
}, null, 2));
