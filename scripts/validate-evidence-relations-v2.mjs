import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const failures = [];
const baseline = JSON.parse(fs.readFileSync(path.join(root, 'docs/migration/registry-v2-baseline.json'), 'utf8'));

function read(relativePath) {
  try {
    const value = JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
    if (!Array.isArray(value)) failures.push(`${relativePath}: expected array`);
    return Array.isArray(value) ? value : [];
  } catch (error) {
    failures.push(`${relativePath}: ${error.message}`);
    return [];
  }
}
const group = (name) => (baseline.data_groups?.[name] ?? []).flatMap(read);
const stablecoins = group('stablecoins');
const organizations = group('organizations');
const events = group('events');
const evidence = group('evidence');
const stablecoinIds = new Set(stablecoins.map((row) => row.id));
const organizationIds = new Set(organizations.map((row) => row.id));
const eventIds = new Set(events.map((row) => row.id));
const evidenceIds = new Set();
const unique = (items) => [...new Set(items.filter((item) => typeof item === 'string' && item.length > 0))];
const project = (row) => ({
  evidence_id: row.id,
  stablecoin_ids: unique([...(row.stablecoin_ids ?? []), row.stablecoin_id]),
  organization_ids: unique([...(row.organization_ids ?? []), row.issuer_id]),
  event_ids: unique([...(row.event_ids ?? []), row.event_id]),
  claim_scopes: unique([...(row.claim_scopes ?? []), row.claim_scope])
});
const evidenceCountByEvent = new Map();

for (const row of evidence) {
  if (!row.id) { failures.push('evidence row missing id'); continue; }
  if (evidenceIds.has(row.id)) failures.push(`duplicate evidence id: ${row.id}`);
  evidenceIds.add(row.id);
  const relation = project(row);
  if (row.stablecoin_id && !relation.stablecoin_ids.includes(row.stablecoin_id)) failures.push(`${row.id}: legacy stablecoin_id missing`);
  if (row.issuer_id && !relation.organization_ids.includes(row.issuer_id)) failures.push(`${row.id}: legacy issuer_id missing`);
  if (row.event_id && !relation.event_ids.includes(row.event_id)) failures.push(`${row.id}: legacy event_id missing`);
  if (row.claim_scope && !relation.claim_scopes.includes(row.claim_scope)) failures.push(`${row.id}: legacy claim_scope missing`);
  for (const id of relation.stablecoin_ids) if (!stablecoinIds.has(id)) failures.push(`${row.id}: missing stablecoin ${id}`);
  for (const id of relation.organization_ids) if (!organizationIds.has(id)) failures.push(`${row.id}: missing organization ${id}`);
  for (const id of relation.event_ids) {
    if (!eventIds.has(id)) failures.push(`${row.id}: missing event ${id}`);
    evidenceCountByEvent.set(id, (evidenceCountByEvent.get(id) ?? 0) + 1);
  }
  if (relation.stablecoin_ids.length === 0 && relation.organization_ids.length === 0 && relation.event_ids.length === 0) failures.push(`${row.id}: relation has no subjects`);
}

for (const event of events.filter((row) => row.event_type === 'issuer_freeze')) {
  if (typeof event.source_count === 'number' && event.source_count !== (evidenceCountByEvent.get(event.id) ?? 0)) failures.push(`${event.id}: source_count ${event.source_count} does not match linked evidence ${evidenceCountByEvent.get(event.id) ?? 0}`);
}

const minimum = baseline.minimum_counts?.evidence ?? 0;
if (evidence.length < minimum) failures.push(`evidence count fell below protected minimum ${minimum}: ${evidence.length}`);

if (failures.length) {
  console.error('Evidence v2 relation validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log(`Evidence v2 relation validation passed: ${evidence.length} evidence rows projected into relation arrays.`);
