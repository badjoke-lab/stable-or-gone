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
const reserveReports = group('reserve_reports');
const openItems = group('known_unknowns');
const deployments = group('deployments');
const legal = read('data/q-legal.json');
const yieldProfiles = read('data/yield-profiles-v3-q.json');
const reserveComponents = read('data/reserve-components-v3-batch-q.json');
const promotions = read('data/candidate-promotions-batch-18.json');
const overlay = read('docs/migration/registry-v2-baseline-batch-q.json');

const qCoinIds = ['sog_st_ist','sog_st_nearusn'];
const qOrganizationIds = ['sog_issuer_inter_protocol','sog_org_agoric','sog_issuer_decentral_bank'];
const qEventIds = ['sog_ev_ist_launch_batch_q','sog_ev_ist_sunset_batch_q','sog_ev_usn_launch_batch_q','sog_ev_usn_v2_batch_q','sog_ev_usn_winddown_batch_q'];
const qEvidenceIds = evidence.filter((row) => row.__source_file === 'data/evidence-batch-q.json').map((row) => row.id);
const stablecoinById = new Map(stablecoins.map((row) => [row.id, row]));
const organizationIds = new Set(organizations.map((row) => row.id));
const evidenceIds = new Set(evidence.map((row) => row.id));
const eventDetailIds = new Set(eventDetails.map((row) => row.id));

fail(stablecoins.length === 94, `canonical stablecoin count must be 94, found ${stablecoins.length}`);
fail(baseline.minimum_counts?.stablecoins === 94, 'baseline minimum stablecoin count must be 94');
fail(read('data/stablecoins-batch-q.json').length === 2, 'Batch Q must contain two stablecoins');
fail(read('data/organizations-batch-q.json').length === 3, 'Batch Q must contain three organizations');
fail(read('data/relationships-batch-q.json').length === 3, 'Batch Q must contain three relationships');
fail(read('data/stablecoin-classification-batch-q.json').length === 2, 'Batch Q must contain two classifications');
fail(read('data/stablecoin-profiles-batch-q.json').length === 2, 'Batch Q must contain two profiles');
fail(read('data/events-batch-q.json').length === 5, 'Batch Q must contain five events');
fail(read('data/event-details-batch-q.json').length === 5, 'Batch Q must contain five event details');
fail(read('data/evidence-batch-q.json').length === 9, 'Batch Q must contain nine evidence records');
fail(read('data/reserve-reports-batch-q.json').length === 2, 'Batch Q must contain two reserve reports');
fail(read('data/q-open-items.json').length === 10, 'Batch Q must contain ten explicit open items');
fail(read('data/deployments-batch-q.json').length === 2, 'Batch Q must contain two deployments');
fail(legal.length === 2 && yieldProfiles.length === 2 && reserveComponents.length === 2, 'Batch Q v3 supplemental layers must cover both assets');
fail(overlay.defer_legacy_v3_full_coverage === true, 'legacy v3 full-coverage deferral must be explicit');

for (const id of qCoinIds) {
  const coin = stablecoinById.get(id);
  fail(Boolean(coin), `${id}: canonical stablecoin missing`);
  fail(coin?.status === 'discontinued', `${id}: status must be discontinued`);
  fail(classifications.some((row) => row.id === id), `${id}: classification missing`);
  fail(profiles.some((row) => row.id === id), `${id}: profile missing`);
  fail(relationships.some((row) => row.stablecoin_id === id), `${id}: relationship missing`);
  fail(events.some((row) => row.stablecoin_id === id), `${id}: event missing`);
  fail(evidence.some((row) => row.stablecoin_id === id || row.stablecoin_ids?.includes(id)), `${id}: evidence missing`);
  fail(reserveReports.some((row) => row.stablecoin_id === id), `${id}: reserve report missing`);
  fail(openItems.filter((row) => row.stablecoin_id === id).length === 5, `${id}: five open items required`);
  fail(deployments.some((row) => row.stablecoin_id === id), `${id}: deployment missing`);
  fail(legal.some((row) => row.id === id), `${id}: legal profile missing`);
  fail(yieldProfiles.some((row) => row.id === id), `${id}: yield profile missing`);
  fail(reserveComponents.some((row) => row.stablecoin_id === id), `${id}: reserve component missing`);
}

fail(stablecoinById.get('sog_st_ist')?.launch_date === '2022-10-27', 'IST launch date must be 2022-10-27');
fail(stablecoinById.get('sog_st_ist')?.discontinued_date === '2025-07-02', 'IST terminal date must be 2025-07-02');
fail(stablecoinById.get('sog_st_nearusn')?.launch_date === '2022-04-25', 'USN launch date must be 2022-04-25');
fail(stablecoinById.get('sog_st_nearusn')?.discontinued_date === '2022-10-24', 'USN terminal date must be 2022-10-24');
for (const id of qOrganizationIds) fail(organizationIds.has(id), `${id}: organization missing`);
for (const id of qEventIds) fail(eventDetailIds.has(id), `${id}: event detail missing`);

for (const event of events.filter((row) => qEventIds.includes(row.id))) {
  const linked = evidence.filter((row) => row.event_id === event.id || row.event_ids?.includes(event.id));
  fail(linked.length === event.source_count, `${event.id}: source_count ${event.source_count} does not match ${linked.length}`);
}
for (const row of relationships.filter((item) => qCoinIds.includes(item.stablecoin_id))) for (const id of row.evidence_ids ?? []) fail(evidenceIds.has(id), `${row.id}: evidence reference missing ${id}`);
for (const row of deployments.filter((item) => qCoinIds.includes(item.stablecoin_id))) {
  fail(row.status === 'terminated', `${row.id}: deployment status must be terminated`);
  for (const id of row.evidence_ids ?? []) fail(evidenceIds.has(id), `${row.id}: evidence reference missing ${id}`);
}
fail(promotions.length === 2 && promotions.every((row) => row.status === 'promoted'), 'two Growth A promotion rows required');
fail(new Set(qEvidenceIds).size === 9, 'Batch Q evidence IDs must be unique');

if (failures.length) {
  console.error('Batch 18 Growth A validation failed:');
  failures.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}
console.log('Batch 18 Growth A valid: IST and USN promoted as discontinued historical assets; canonical count is 94.');
