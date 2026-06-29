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
const legal = read('data/r-legal.json');
const returnProfiles = read('data/r-returns.json');
const reserveComponents = read('data/reserve-components-v3-batch-r.json');
const promotions = read('data/candidate-promotions-batch-19.json');
const overlay = read('docs/migration/registry-v2-baseline-batch-r.json');
const batchEvidence = read('data/evidence-batch-r.json');

const coinIds = ['sog_st_kavausdx','sog_st_bean'];
const organizationIds = ['sog_issuer_kava','sog_issuer_beanstalk'];
const eventIds = ['sog_ev_kavausdx_launch_batch_r','sog_ev_bean_launch_batch_r','sog_ev_bean_exploit_batch_r','sog_ev_bean_replant_batch_r','sog_ev_bean_arbitrum_batch_r'];
const stablecoinById = new Map(stablecoins.map((row) => [row.id, row]));
const canonicalOrganizationIds = new Set(organizations.map((row) => row.id));
const evidenceIds = new Set(evidence.map((row) => row.id));
const eventDetailIds = new Set(eventDetails.map((row) => row.id));

fail(stablecoins.length === 96, `canonical stablecoin count must be 96, found ${stablecoins.length}`);
fail(baseline.minimum_counts?.stablecoins === 96, 'baseline minimum stablecoin count must be 96');
fail(read('data/stablecoins-batch-r.json').length === 2, 'Batch R must contain two stablecoins');
fail(read('data/organizations-batch-r.json').length === 2, 'Batch R must contain two organizations');
fail(read('data/relationships-batch-r.json').length === 2, 'Batch R must contain two relationships');
fail(read('data/stablecoin-classification-batch-r.json').length === 2, 'Batch R must contain two classifications');
fail(read('data/r-profiles.json').length === 2, 'Batch R must contain two profiles');
fail(read('data/events-batch-r.json').length === 5, 'Batch R must contain five events');
fail(read('data/event-details-batch-r.json').length === 5, 'Batch R must contain five event details');
fail(batchEvidence.length === 10, 'Batch R must contain ten evidence records');
fail(read('data/r-protocol-context.json').length === 2, 'Batch R must contain two protocol context rows');
fail(read('data/r-open-items.json').length === 10, 'Batch R must contain ten open items');
fail(read('data/deployments-batch-r.json').length === 3, 'Batch R must contain three deployments');
fail(legal.length === 2 && returnProfiles.length === 2 && reserveComponents.length === 2, 'Batch R supplemental layers must cover both assets');
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

fail(stablecoinById.get('sog_st_kavausdx')?.launch_date === '2020-06-10', 'Kava USDX launch date must be 2020-06-10');
fail(stablecoinById.get('sog_st_bean')?.launch_date === '2021-08-06', 'Bean launch date must be 2021-08-06');
for (const id of organizationIds) fail(canonicalOrganizationIds.has(id), `${id}: organization missing`);
for (const id of eventIds) fail(eventDetailIds.has(id), `${id}: event detail missing`);

for (const event of events.filter((row) => eventIds.includes(row.id))) {
  const linked = evidence.filter((row) => row.event_id === event.id || row.event_ids?.includes(event.id));
  fail(linked.length === event.source_count, `${event.id}: source_count ${event.source_count} does not match ${linked.length}`);
}
for (const row of relationships.filter((item) => coinIds.includes(item.stablecoin_id))) for (const id of row.evidence_ids ?? []) fail(evidenceIds.has(id), `${row.id}: evidence reference missing ${id}`);
for (const row of deployments.filter((item) => coinIds.includes(item.stablecoin_id))) for (const id of row.evidence_ids ?? []) fail(evidenceIds.has(id), `${row.id}: evidence reference missing ${id}`);
fail(deployments.filter((row) => row.stablecoin_id === 'sog_st_bean').length === 2, 'Bean must retain historical Ethereum and current Arbitrum deployments');
fail(promotions.length === 2 && promotions.every((row) => row.status === 'promoted'), 'two Growth B promotion rows required');
fail(new Set(batchEvidence.map((row) => row.id)).size === 10, 'Batch R evidence IDs must be unique');

if (failures.length) {
  console.error('Batch 19 Growth B validation failed:');
  failures.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}
console.log('Batch 19 Growth B valid: Kava USDX and Bean promoted as active assets; canonical count is 96.');
