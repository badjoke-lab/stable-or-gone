import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const failures = [];
const baseline = JSON.parse(fs.readFileSync(path.join(root, 'docs/migration/registry-v2-baseline.json'), 'utf8'));

function read(relativePath) {
  try {
    const value = JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
    if (!Array.isArray(value)) {
      failures.push(`${relativePath}: expected array`);
      return [];
    }
    return value.map((row) => ({ ...row, __source_file: relativePath }));
  } catch (error) {
    failures.push(`${relativePath}: ${error.message}`);
    return [];
  }
}

const group = (name) => (baseline.data_groups?.[name] ?? []).flatMap(read);
const label = (row) => `${row.__source_file ?? 'unknown'}: ${row.id ?? row.slug ?? 'unknown'}`;
const required = (row, field) => {
  if (row[field] === undefined || row[field] === null || row[field] === '') failures.push(`${label(row)} missing ${field}`);
};
const unique = (name, rows, field) => {
  const seen = new Map();
  for (const row of rows) {
    const value = row[field];
    if (!value) continue;
    if (seen.has(value)) failures.push(`${name}: duplicate ${field} ${value} in ${seen.get(value)} and ${row.__source_file}`);
    else seen.set(value, row.__source_file);
  }
};
const validUrl = (row, field) => {
  const value = row[field];
  if (!value) return;
  try {
    const parsed = new URL(value);
    if (!['http:', 'https:'].includes(parsed.protocol)) failures.push(`${label(row)} ${field} must use http or https`);
  } catch {
    failures.push(`${label(row)} invalid ${field}: ${value}`);
  }
};

const stablecoins = group('stablecoins');
const organizations = group('organizations');
const relationships = group('relationships');
const events = group('events');
const evidence = group('evidence');
const reserveReports = group('reserve_reports');
const knownUnknowns = group('known_unknowns');
const regulatoryNotes = group('regulatory_notes');
const deployments = group('deployments');
const legacyIssuers = [
  ...read('data/issuers.json'),
  ...read('data/issuers-extra.json'),
  ...read('data/issuers-batch-b.json'),
  ...read('data/issuers-batch-c.json'),
  ...read('data/issuers-batch-d.json')
];

for (const row of stablecoins) {
  required(row, 'id'); required(row, 'slug'); required(row, 'name'); required(row, 'status'); required(row, 'issuer_id');
}
unique('stablecoins', stablecoins, 'id');
unique('stablecoins', stablecoins, 'slug');

for (const row of organizations) {
  required(row, 'id'); required(row, 'slug'); required(row, 'name'); required(row, 'organization_type'); validUrl(row, 'official_url');
}
unique('organizations', organizations, 'id');
unique('organizations', organizations, 'slug');

const organizationById = new Map(organizations.map((row) => [row.id, row]));
const legacyById = new Map(legacyIssuers.map((row) => [row.id, row]));
for (const row of organizations) {
  const legacy = legacyById.get(row.id);
  if (!legacy) failures.push(`${label(row)} has no legacy issuer compatibility record`);
  else if (legacy.slug !== row.slug) failures.push(`${label(row)} slug differs from legacy ${legacy.slug}`);
}
for (const row of legacyIssuers) if (!organizationById.has(row.id)) failures.push(`${label(row)} missing from organization groups`);

const stablecoinIds = new Set(stablecoins.map((row) => row.id));
const organizationIds = new Set(organizations.map((row) => row.id));
const eventIds = new Set(events.map((row) => row.id));
const evidenceIds = new Set(evidence.map((row) => row.id));

for (const row of relationships) {
  required(row, 'id'); required(row, 'stablecoin_id'); required(row, 'organization_id'); required(row, 'role');
  if (!stablecoinIds.has(row.stablecoin_id)) failures.push(`${label(row)} missing stablecoin ${row.stablecoin_id}`);
  if (!organizationIds.has(row.organization_id)) failures.push(`${label(row)} missing organization ${row.organization_id}`);
  for (const id of row.evidence_ids ?? []) if (!evidenceIds.has(id)) failures.push(`${label(row)} missing evidence ${id}`);
}
unique('relationships', relationships, 'id');

const relationshipsByStablecoin = new Map();
for (const row of relationships) {
  const rows = relationshipsByStablecoin.get(row.stablecoin_id) ?? [];
  rows.push(row);
  relationshipsByStablecoin.set(row.stablecoin_id, rows);
}
for (const row of stablecoins) {
  if (!organizationIds.has(row.issuer_id)) failures.push(`${label(row)} missing organization ${row.issuer_id}`);
  const rows = relationshipsByStablecoin.get(row.id) ?? [];
  if (!rows.length) failures.push(`${label(row)} has no organization relationship`);
  if (!rows.some((relationship) => relationship.organization_id === row.issuer_id)) failures.push(`${label(row)} issuer_id not represented in relationships`);
}

for (const row of events) {
  required(row, 'id'); required(row, 'title');
  if (row.stablecoin_id && !stablecoinIds.has(row.stablecoin_id)) failures.push(`${label(row)} missing stablecoin ${row.stablecoin_id}`);
  if (row.issuer_id && !organizationIds.has(row.issuer_id)) failures.push(`${label(row)} missing organization ${row.issuer_id}`);
}
unique('events', events, 'id');

for (const row of evidence) {
  required(row, 'id'); required(row, 'title'); required(row, 'url'); validUrl(row, 'url'); validUrl(row, 'archived_url');
  if (row.stablecoin_id && !stablecoinIds.has(row.stablecoin_id)) failures.push(`${label(row)} missing stablecoin ${row.stablecoin_id}`);
  if (row.issuer_id && !organizationIds.has(row.issuer_id)) failures.push(`${label(row)} missing organization ${row.issuer_id}`);
  if (row.event_id && !eventIds.has(row.event_id)) failures.push(`${label(row)} missing event ${row.event_id}`);
  for (const id of row.event_ids ?? []) if (!eventIds.has(id)) failures.push(`${label(row)} missing event ${id}`);
}
unique('evidence', evidence, 'id');

for (const row of reserveReports) {
  required(row, 'id'); validUrl(row, 'url'); validUrl(row, 'archived_url');
  if (row.stablecoin_id && !stablecoinIds.has(row.stablecoin_id)) failures.push(`${label(row)} missing stablecoin`);
  if (row.issuer_id && !organizationIds.has(row.issuer_id)) failures.push(`${label(row)} missing organization`);
}
unique('reserve reports', reserveReports, 'id');

for (const row of knownUnknowns) {
  required(row, 'id'); required(row, 'topic'); required(row, 'description');
  if (row.stablecoin_id && !stablecoinIds.has(row.stablecoin_id)) failures.push(`${label(row)} missing stablecoin`);
  if (row.issuer_id && !organizationIds.has(row.issuer_id)) failures.push(`${label(row)} missing organization`);
}
unique('known unknowns', knownUnknowns, 'id');

for (const row of regulatoryNotes) {
  required(row, 'id'); required(row, 'title'); required(row, 'summary'); required(row, 'source_url'); validUrl(row, 'source_url');
  if (row.stablecoin_id && !stablecoinIds.has(row.stablecoin_id)) failures.push(`${label(row)} missing stablecoin`);
  if (row.issuer_id && !organizationIds.has(row.issuer_id)) failures.push(`${label(row)} missing organization`);
  if (row.event_id && !eventIds.has(row.event_id)) failures.push(`${label(row)} missing event`);
}
unique('regulatory notes', regulatoryNotes, 'id');

for (const row of deployments) {
  required(row, 'id'); required(row, 'stablecoin_id'); required(row, 'chain'); required(row, 'deployment_type'); required(row, 'status');
  if (!stablecoinIds.has(row.stablecoin_id)) failures.push(`${label(row)} missing stablecoin ${row.stablecoin_id}`);
  for (const id of row.evidence_ids ?? []) if (!evidenceIds.has(id)) failures.push(`${label(row)} missing evidence ${id}`);
  for (const id of row.control_event_ids ?? []) if (!eventIds.has(id)) failures.push(`${label(row)} missing control event ${id}`);
  if (row.freeze_capability !== undefined && typeof row.freeze_capability !== 'boolean') failures.push(`${label(row)} freeze_capability must be boolean`);
  if (row.blacklist_capability !== undefined && typeof row.blacklist_capability !== 'boolean') failures.push(`${label(row)} blacklist_capability must be boolean`);
}
unique('deployments', deployments, 'id');

if (failures.length) {
  console.error('SOG data validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`SOG data validation passed: ${stablecoins.length} stablecoins, ${organizations.length} organizations, ${relationships.length} relationships, ${events.length} events, ${evidence.length} evidence records, ${reserveReports.length} reserve references, ${knownUnknowns.length} known unknowns, ${regulatoryNotes.length} regulatory notes, ${deployments.length} deployments.`);
