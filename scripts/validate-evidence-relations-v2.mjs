import fs from 'node:fs';
import path from 'node:path';

const dataDir = path.join(process.cwd(), 'data');
const failures = [];

const evidenceFiles = [
  'evidence.json',
  'evidence-extra.json',
  'evidence-pr033.json',
  'evidence-events-pr036.json',
  'evidence-events-pr037.json',
  'evidence-events-pr038.json'
];

const eventFiles = ['events.json', 'events-pr036.json', 'events-pr037.json', 'events-pr038.json'];

function readArray(file) {
  try {
    const value = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf8'));
    if (!Array.isArray(value)) failures.push(`${file}: expected array`);
    return Array.isArray(value) ? value : [];
  } catch (error) {
    failures.push(`${file}: ${error.message}`);
    return [];
  }
}

const stablecoins = [...readArray('stablecoins.json'), ...readArray('stablecoins-extra.json')];
const organizations = readArray('organizations.json');
const events = eventFiles.flatMap(readArray);
const evidence = evidenceFiles.flatMap(readArray);

const stablecoinIds = new Set(stablecoins.map((row) => row.id));
const organizationIds = new Set(organizations.map((row) => row.id));
const eventIds = new Set(events.map((row) => row.id));
const evidenceIds = new Set();

function unique(items) {
  return [...new Set(items.filter((item) => typeof item === 'string' && item.length > 0))];
}

function projectEvidence(row) {
  return {
    evidence_id: row.id,
    stablecoin_ids: unique([...(row.stablecoin_ids ?? []), row.stablecoin_id]),
    organization_ids: unique([...(row.organization_ids ?? []), row.issuer_id]),
    event_ids: unique([...(row.event_ids ?? []), row.event_id]),
    claim_scopes: unique([...(row.claim_scopes ?? []), row.claim_scope])
  };
}

for (const row of evidence) {
  if (!row.id) {
    failures.push('evidence row missing id');
    continue;
  }
  if (evidenceIds.has(row.id)) failures.push(`duplicate evidence id: ${row.id}`);
  evidenceIds.add(row.id);

  const relation = projectEvidence(row);
  if (relation.evidence_id !== row.id) failures.push(`${row.id}: relation evidence_id mismatch`);

  if (row.stablecoin_id && !relation.stablecoin_ids.includes(row.stablecoin_id)) failures.push(`${row.id}: legacy stablecoin_id missing from stablecoin_ids`);
  if (row.issuer_id && !relation.organization_ids.includes(row.issuer_id)) failures.push(`${row.id}: legacy issuer_id missing from organization_ids`);
  if (row.event_id && !relation.event_ids.includes(row.event_id)) failures.push(`${row.id}: legacy event_id missing from event_ids`);
  if (row.claim_scope && !relation.claim_scopes.includes(row.claim_scope)) failures.push(`${row.id}: legacy claim_scope missing from claim_scopes`);

  for (const stablecoinId of relation.stablecoin_ids) if (!stablecoinIds.has(stablecoinId)) failures.push(`${row.id}: missing stablecoin ${stablecoinId}`);
  for (const organizationId of relation.organization_ids) if (!organizationIds.has(organizationId)) failures.push(`${row.id}: missing organization ${organizationId}`);
  for (const eventId of relation.event_ids) if (!eventIds.has(eventId)) failures.push(`${row.id}: missing event ${eventId}`);

  if (relation.stablecoin_ids.length === 0 && relation.organization_ids.length === 0 && relation.event_ids.length === 0) failures.push(`${row.id}: evidence relation has no subject ids`);
}

if (evidence.length !== 90) failures.push(`evidence count expected 90, found ${evidence.length}`);

if (failures.length > 0) {
  console.error('Evidence v2 relation validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Evidence v2 relation validation passed: ${evidence.length} evidence rows projected into relation arrays.`);
