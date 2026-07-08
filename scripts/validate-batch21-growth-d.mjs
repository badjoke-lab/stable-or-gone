import fs from 'node:fs';
import path from 'node:path';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const root = process.cwd();
const read = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const baseline = loadRegistryV2Baseline(root);
const group = (name) => (baseline.data_groups?.[name] ?? []).flatMap(read);
const stablecoins = group('stablecoins');
const organizations = group('organizations');
const relationships = group('relationships');
const classifications = group('classifications');
const profiles = group('profiles');
const events = group('events');
const details = group('event_details');
const evidence = group('evidence');
const reports = group('reserve_reports');
const unknowns = group('known_unknowns');
const deployments = group('deployments');
const promotions = read('data/candidate-promotions-batch-21.json');
const components = read('data/batch-t-components.json');
const income = read('data/batch-t-income.json');
const currentCheckpoint = read('docs/migration/current-canonical-checkpoint.json');
const ids = ['sog_st_eurm', 'sog_st_usd3'];

check(Number.isInteger(currentCheckpoint.asset_count) && currentCheckpoint.asset_count >= 100, 'current checkpoint must preserve at least the completed 100-asset boundary');
check(stablecoins.length === currentCheckpoint.asset_count, `canonical stablecoin count must match current checkpoint ${currentCheckpoint.asset_count}, found ${stablecoins.length}`);
check(read('data/stablecoins-batch-t.json').length === 2, 'Batch T must contain two stablecoins');
check(read('data/organizations-batch-t.json').length === 1, 'Batch T must add only the new Reserve Protocol organization; Mento must reuse the existing canonical identity');
check(read('data/relationships-batch-t.json').length === 2, 'Batch T must contain two relationships');
check(read('data/events-batch-t.json').length === 6, 'Batch T must contain six events');
check(read('data/event-details-batch-t-a.json').length + read('data/event-details-batch-t-b.json').length === 6, 'Batch T must contain six event details');
check(read('data/evidence-batch-t.json').length + read('data/evidence-batch-t-b1.json').length + read('data/evidence-batch-t-b2.json').length === 12, 'Batch T must contain twelve evidence records');
check(read('data/batch-t-review-gaps.json').length === 6, 'Batch T must contain six explicit review gaps');
check(read('data/batch-t-deployments.json').length === 2, 'Batch T must contain two deployments');
check(components.length === 2, 'Batch T must contain two reserve components');
check(income.length === 2, 'Batch T must contain two income profiles');
check(promotions.length === 2 && promotions.every((row) => row.status === 'promoted' && row.promotion_pr === 278), 'Batch T promotion rows are invalid');

for (const id of ids) {
  check(stablecoins.some((row) => row.id === id), `${id}: stablecoin missing`);
  check(classifications.some((row) => row.id === id), `${id}: classification missing`);
  check(profiles.some((row) => row.id === id), `${id}: profile missing`);
  check(relationships.some((row) => row.stablecoin_id === id), `${id}: relationship missing`);
  check(events.some((row) => row.stablecoin_id === id), `${id}: event missing`);
  check(evidence.some((row) => row.stablecoin_id === id || row.stablecoin_ids?.includes(id)), `${id}: evidence missing`);
  check(reports.some((row) => row.stablecoin_id === id), `${id}: reserve context missing`);
  check(unknowns.some((row) => row.stablecoin_id === id), `${id}: review gap missing`);
  check(deployments.some((row) => row.stablecoin_id === id), `${id}: deployment missing`);
  check(components.some((row) => row.stablecoin_id === id), `${id}: reserve component missing`);
  check(income.some((row) => row.id === id), `${id}: income profile missing`);
}

check(organizations.some((row) => row.id === 'sog_issuer_mento'), 'Mento organization missing');
check(organizations.filter((row) => row.id === 'sog_issuer_mento').length === 1, 'Mento organization identity must remain unique');
check(organizations.some((row) => row.id === 'sog_issuer_reserve_protocol'), 'Reserve Protocol organization missing');
for (const event of events.filter((row) => ids.includes(row.stablecoin_id))) {
  check(details.some((row) => row.id === event.id), `${event.id}: detail missing`);
  const linked = evidence.filter((row) => row.event_ids?.includes(event.id) || row.event_id === event.id);
  check(linked.length === event.source_count, `${event.id}: source count mismatch`);
}

if (failures.length) {
  console.error('Batch 21 Growth D validation failed:');
  failures.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}
console.log(`Batch 21 Growth D valid: Mento Euro and Web 3 Dollar remain promoted; canonical count matches the current ${currentCheckpoint.asset_count}-asset checkpoint.`);
