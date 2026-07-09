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
const foundation = read('docs/migration/registry-v3-foundation.json');
const incomeManifest = read('docs/migration/registry-v3-income-profiles.json');
const legalProfiles = (foundation.data_groups?.legal_profiles ?? []).flatMap(read);
const reserveComponents = (foundation.data_groups?.reserve_components ?? []).flatMap(read);
const incomeProfiles = (incomeManifest.data_files ?? []).flatMap(read);
const promotions = read('data/candidate-promotions-batch-26.json');
const checkpoint = read('docs/migration/current-canonical-checkpoint.json');
const verification = loadDeploymentVerification(root);

const expectedCounts = {
  stablecoins:110, organizations:103, relationships:120, classifications:110, profiles:110,
  events:185, event_details:185, evidence:543, reserve_reports:118, known_unknowns:319,
  deployments:170, legal_profiles:110, reserve_components:143, income_profiles:110
};
const rowsByName = {
  stablecoins, organizations, relationships, classifications, profiles, events,
  event_details:eventDetails, evidence, reserve_reports:reserveReports,
  known_unknowns:knownUnknowns, deployments, legal_profiles:legalProfiles,
  reserve_components:reserveComponents, income_profiles:incomeProfiles
};
for (const [name, count] of Object.entries(expectedCounts)) fail(rowsByName[name].length === count, `${name}: expected ${count}, found ${rowsByName[name].length}`);

const ids = ['sog_st_audd','sog_st_nzds'];
const stablecoinById = new Map(stablecoins.map((row) => [row.id, row]));
const classificationById = new Map(classifications.map((row) => [row.id, row]));
const profileById = new Map(profiles.map((row) => [row.id, row]));
for (const id of ids) {
  fail(stablecoinById.has(id), `${id}: canonical stablecoin missing`);
  fail(evidence.some((row) => row.stablecoin_id === id || row.stablecoin_ids?.includes(id)), `${id}: evidence missing`);
  fail(reserveReports.some((row) => row.stablecoin_id === id), `${id}: reserve context missing`);
  fail(legalProfiles.some((row) => row.id === id), `${id}: legal profile missing`);
  fail(reserveComponents.some((row) => row.stablecoin_id === id), `${id}: reserve component missing`);
  fail(incomeProfiles.some((row) => row.id === id), `${id}: income profile missing`);
  fail(stablecoinById.get(id)?.status === 'unknown', `${id}: current legacy status must remain unknown until current issuer state is verified`);
  fail(stablecoinById.get(id)?.launch_date === null, `${id}: exact launch date must remain null`);
  fail(classificationById.get(id)?.lifecycle_status === 'unknown', `${id}: lifecycle must remain unknown`);
  fail(classificationById.get(id)?.issuance_status === 'unknown', `${id}: issuance status must remain unknown`);
  fail(profileById.get(id)?.redemption_profile?.status === 'unknown', `${id}: redemption status must remain unknown`);
}

fail(relationships.some((row) => row.stablecoin_id === 'sog_st_audd' && row.organization_id === 'sog_issuer_audd' && row.role === 'legal_issuer'), 'AUDD issuer relationship missing');
fail(relationships.some((row) => row.stablecoin_id === 'sog_st_nzds' && row.organization_id === 'sog_issuer_techemynt' && row.role === 'legal_issuer'), 'NZDS issuer relationship missing');
for (const organizationId of ['sog_issuer_audd','sog_issuer_techemynt']) fail(organizations.some((row) => row.id === organizationId), `${organizationId}: organization missing`);

fail(promotions.length === 2, 'Batch 26 must contain exactly two promotions');
fail(JSON.stringify(promotions.map((row) => row.candidate_id)) === JSON.stringify(['sog_cand_000109','sog_cand_000110']), 'Batch 26 promotion IDs mismatch');
fail(promotions.every((row) => row.status === 'promoted' && row.promotion_pr === 335), 'Batch 26 promotions must be promoted by PR #335');
fail(promotions[0]?.promoted_record_id === 'sog_st_audd', 'candidate 109 promotion target mismatch');
fail(promotions[1]?.promoted_record_id === 'sog_st_nzds', 'candidate 110 promotion target mismatch');

const batchEvidence = evidence.filter((row) => ids.includes(row.stablecoin_id));
fail(batchEvidence.length === 6, `Batch 26 evidence count must be 6, found ${batchEvidence.length}`);
const batchEvents = events.filter((row) => ids.includes(row.stablecoin_id));
fail(batchEvents.length === 0, `Batch 26 must not invent lifecycle events, found ${batchEvents.length}`);
const batchDeployments = deployments.filter((row) => ids.includes(row.stablecoin_id));
fail(batchDeployments.length === 2, `Batch 26 must contain exactly two explicit unresolved deployment-coverage rows, found ${batchDeployments.length}`);
for (const row of batchDeployments) {
  fail(row.chain === 'source_review_needed', `${row.id}: chain must remain source_review_needed until current first-party network scope is verified`);
  fail(row.status === 'source_review_needed', `${row.id}: deployment status must remain source_review_needed`);
  fail(row.canonicality === 'unknown', `${row.id}: canonicality must remain unknown`);
  fail(row.contract_address === null, `${row.id}: contract address must remain null`);
  fail(verification.status_ids?.source_linked_no_identifier?.includes(row.id), `${row.id}: deployment verification must classify the row as source_linked_no_identifier`);
}
fail(verification.expected_total === 170, `deployment verification expected_total must be 170, found ${verification.expected_total}`);

const requiredTopics = {
  sog_st_audd:['launch_date','issuer_structure','reserve_reporting_and_deployment_lineage'],
  sog_st_nzds:['launch_date','issuer_structure','reserve_reporting_and_deployment_lineage']
};
for (const [id, topics] of Object.entries(requiredTopics)) {
  const actual = new Set(knownUnknowns.filter((row) => row.stablecoin_id === id).map((row) => row.topic));
  for (const topic of topics) fail(actual.has(topic), `${id}: known unknown missing ${topic}`);
}

fail(checkpoint.checkpoint_id === 'sog_controlled_growth_110_checkpoint_pr335_2026_07_09', 'current checkpoint ID mismatch');
fail(checkpoint.asset_count === 110, 'current checkpoint asset_count must be 110');
fail(checkpoint.previous_checkpoint_id === 'sog_controlled_growth_108_checkpoint_pr334_2026_07_09', 'previous checkpoint linkage mismatch');
const checkpointExpected = {
  assets:110, organizations:103, relationships:120, events:185, evidence:543,
  reserve_reports:118, known_unknowns:319, regulatory_notes:9, deployments:170,
  legal_profiles:110, stable_asset_relationships:4, reserve_components:143, income_profiles:110
};
for (const [key, count] of Object.entries(checkpoint.expected_counts ?? {})) fail(count === checkpointExpected[key], `checkpoint expected_counts.${key} mismatch`);

if (failures.length) {
  console.error('PR #335 controlled growth validation failed:');
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
