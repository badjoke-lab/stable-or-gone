import fs from 'node:fs';
import path from 'node:path';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const root = process.cwd();
const failures = [];
const read = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const audit = read('data/final-eight-candidate-audit-pr246.json');
const corrections = read('data/final-eight-candidate-corrections-pr247.json');
const promotions = [...read('data/candidate-promotions-batch-18.json'), ...read('data/candidate-promotions-batch-19.json'), ...read('data/candidate-promotions-batch-20.json'), ...read('data/candidate-promotions-batch-21.json')];
const baseline = loadRegistryV2Baseline(root);
const group = (name) => (baseline.data_groups?.[name] ?? []).flatMap(read);
const stablecoins = group('stablecoins');
const organizations = group('organizations');
const classifications = group('classifications');
const profiles = group('profiles');
const relationships = group('relationships');
const events = group('events');
const evidence = group('evidence');
const currentCheckpoint = read('docs/migration/current-canonical-checkpoint.json');
const correctionById = new Map(corrections.map((row) => [row.candidate_id, row]));
const candidates = (audit.candidates ?? []).map((row) => ({ ...row, ...(correctionById.get(row.candidate_id) ?? {}) }));
const promotionById = new Map(promotions.map((row) => [row.candidate_id, row]));
const stablecoinIds = new Set(stablecoins.map((row) => row.id));
const organizationIds = new Set(organizations.map((row) => row.id));
const classificationIds = new Set(classifications.map((row) => row.id));
const profileIds = new Set(profiles.map((row) => row.id));
const expectedRecords = ['sog_st_ist','sog_st_nearusn','sog_st_kavausdx','sog_st_bean','sog_st_uxd','sog_st_doc','sog_st_eurm','sog_st_usd3'];
const fail = (condition, message) => { if (!condition) failures.push(message); };

fail(candidates.length === 8, 'candidate count must be eight');
fail(promotions.length === 8, 'promotion count must be eight');
fail(Number.isInteger(currentCheckpoint.asset_count) && currentCheckpoint.asset_count >= 100, 'current checkpoint must preserve at least the completed 100-asset boundary');
fail(stablecoins.length === currentCheckpoint.asset_count, `canonical stablecoin count must match current checkpoint ${currentCheckpoint.asset_count}, found ${stablecoins.length}`);
for (const candidate of candidates) {
  const recordId = candidate.proposed_stablecoin_id;
  fail(stablecoinIds.has(recordId), `${recordId}: stablecoin missing`);
  fail(organizationIds.has(candidate.proposed_organization_id), `${recordId}: organization missing`);
  fail(classificationIds.has(recordId), `${recordId}: classification missing`);
  fail(profileIds.has(recordId), `${recordId}: profile missing`);
  fail(promotionById.get(candidate.candidate_id)?.status === 'promoted', `${recordId}: promotion missing`);
  fail(relationships.some((row) => row.stablecoin_id === recordId), `${recordId}: relationship missing`);
  fail(events.some((row) => row.stablecoin_id === recordId), `${recordId}: event missing`);
  fail(evidence.some((row) => row.stablecoin_id === recordId || row.stablecoin_ids?.includes(recordId)), `${recordId}: evidence missing`);
}
fail(JSON.stringify(candidates.map((row) => row.proposed_stablecoin_id)) === JSON.stringify(expectedRecords), 'final-eight identity order changed');

if (failures.length) {
  console.error('Current final-eight validation failed:');
  failures.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}
console.log(`Current final-eight validation passed: all eight reviewed candidates remain canonical and the registry matches the current ${currentCheckpoint.asset_count}-asset checkpoint.`);
