import fs from 'node:fs';
import path from 'node:path';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const root = process.cwd();
const failures = [];
const fail = (condition, message) => { if (!condition) failures.push(message); };
const read = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
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
const contextRows = group('reserve_reports');
const openItems = group('known_unknowns');
const deployments = group('deployments');
const legal = read('data/s-legal.json');
const returnProfiles = read('data/s-returns.json');
const reserveComponents = read('data/reserve-components-v3-batch-s.json');
const promotions = read('data/candidate-promotions-batch-20.json');
const overlay = read('docs/migration/registry-v2-baseline-batch-s.json');
const batchEvidence = read('data/evidence-batch-s.json');

const coinIds = ['sog_st_uxd','sog_st_doc'];
const organizationIds = ['sog_issuer_uxd_protocol','sog_issuer_money_on_chain'];
const eventIds = ['sog_ev_uxd_launch_batch_s','sog_ev_uxd_alm_batch_s','sog_ev_doc_launch_batch_s','sog_ev_doc_arbitrum_batch_s','sog_ev_doc_oracle_pause_batch_s','sog_ev_doc_oracle_unpause_batch_s'];
const stablecoinById = new Map(stablecoins.map((row) => [row.id, row]));
const canonicalOrganizationIds = new Set(organizations.map((row) => row.id));
const evidenceIds = new Set(evidence.map((row) => row.id));
const eventDetailIds = new Set(eventDetails.map((row) => row.id));

fail(stablecoins.length === 98, `canonical stablecoin count must be 98, found ${stablecoins.length}`);
fail(baseline.minimum_counts?.stablecoins === 98, 'baseline minimum stablecoin count must be 98');
fail(read('data/stablecoins-batch-s.json').length === 2, 'Batch S must contain two stablecoins');
fail(read('data/organizations-batch-s.json').length === 2, 'Batch S must contain two organizations');
fail(read('data/relationships-batch-s.json').length === 2, 'Batch S must contain two relationships');
fail(read('data/stablecoin-classification-batch-s.json').length === 2, 'Batch S must contain two classifications');
fail(read('data/s-profiles.json').length === 2, 'Batch S must contain two profiles');
fail(read('data/events-batch-s.json').length === 6, 'Batch S must contain six events');
fail(read('data/event-details-batch-s.json').length === 6, 'Batch S must contain six event details');
fail(batchEvidence.length === 13, 'Batch S must contain thirteen evidence records');
fail(read('data/s-protocol-context.json').length === 2, 'Batch S must contain two protocol context rows');
fail(read('data/s-open-items.json').length === 10, 'Batch S must contain ten open items');
fail(read('data/deployments-batch-s.json').length === 3, 'Batch S must contain three deployments');
fail(legal.length === 2 && returnProfiles.length === 2 && reserveComponents.length === 2, 'Batch S supplemental layers must cover both assets');
fail(overlay.defer_legacy_v3_full_coverage === true, 'legacy full-coverage deferral must be explicit');

for (const id of coinIds) {
  const coin = stablecoinById.get(id);
  fail(Boolean(coin), `${id}: canonical stablecoin missing`);
  fail(coin?.status === 'active', `${id}: status must be active`);
  fail(classifications.some((row) => row.id === id), `${id}: classification missing`);
  fail(profiles.some((row) => row.id === id), `${id}: profile missing`);
  fail(relationships.some((row) => row.stablecoin_id === id), `${id}: relationship missing`);
  fail(events.some((row) => row.stablecoin_id === id), `${id}: event missing`);
  fail(evidence.some((row) => row.stablecoin_id === id || row.stablecoin_ids?.includes(id)), `${id}: evidence missing`);
  fail(contextRows.some((row) => row.stablecoin_id === id), `${id}: protocol context missing`);
  fail(openItems.filter((row) => row.stablecoin_id === id).length === 5, `${id}: five open items required`);
  fail(deployments.some((row) => row.stablecoin_id === id), `${id}: deployment missing`);
  fail(legal.some((row) => row.id === id), `${id}: legal profile missing`);
  fail(returnProfiles.some((row) => row.id === id), `${id}: return profile missing`);
  fail(reserveComponents.some((row) => row.stablecoin_id === id), `${id}: reserve component context missing`);
}

fail(stablecoinById.get('sog_st_uxd')?.launch_date === '2022-01-18', 'UXD launch date must be 2022-01-18');
fail(stablecoinById.get('sog_st_doc')?.launch_date === '2019-12-12', 'Dollar on Chain launch date must be 2019-12-12');
for (const id of organizationIds) fail(canonicalOrganizationIds.has(id), `${id}: organization missing`);
for (const id of eventIds) fail(eventDetailIds.has(id), `${id}: event detail missing`);

for (const event of events.filter((row) => eventIds.includes(row.id))) {
  const linked = evidence.filter((row) => row.event_id === event.id || row.event_ids?.includes(event.id));
  fail(linked.length === event.source_count, `${event.id}: source_count ${event.source_count} does not match ${linked.length}`);
}
for (const row of relationships.filter((item) => coinIds.includes(item.stablecoin_id))) for (const id of row.evidence_ids ?? []) fail(evidenceIds.has(id), `${row.id}: evidence reference missing ${id}`);
for (const row of deployments.filter((item) => coinIds.includes(item.stablecoin_id))) for (const id of row.evidence_ids ?? []) fail(evidenceIds.has(id), `${row.id}: evidence reference missing ${id}`);
fail(deployments.filter((row) => row.stablecoin_id === 'sog_st_doc').length === 2, 'Dollar on Chain must retain Rootstock native and Arbitrum bridge deployments');
fail(deployments.filter((row) => row.stablecoin_id === 'sog_st_uxd').length === 1, 'UXD must expose only the verified Solana deployment');
fail(promotions.length === 2 && promotions.every((row) => row.status === 'promoted' && row.promotion_pr === 250), 'two Growth C promotion rows for PR 250 required');
fail(new Set(batchEvidence.map((row) => row.id)).size === 13, 'Batch S evidence IDs must be unique');

if (failures.length) {
  console.error('Batch 20 Growth C validation failed:');
  failures.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}
console.log('Batch 20 Growth C valid: UXD and Dollar on Chain promoted as active assets; canonical count is 98.');
