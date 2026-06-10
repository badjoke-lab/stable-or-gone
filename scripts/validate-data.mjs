import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const dataDir = path.join(root, 'data');
const failures = [];

function readJsonArray(file) {
  const fullPath = path.join(dataDir, file);
  if (!fs.existsSync(fullPath)) {
    failures.push(`${file}: missing file`);
    return [];
  }
  try {
    const parsed = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
    if (!Array.isArray(parsed)) {
      failures.push(`${file}: expected a JSON array`);
      return [];
    }
    return parsed.map((row) => ({ ...row, __source_file: file }));
  } catch (error) {
    failures.push(`${file}: invalid JSON (${error.message})`);
    return [];
  }
}

function combine(...files) {
  return files.flatMap(readJsonArray);
}

function rowLabel(row) {
  return `${row.__source_file ?? 'unknown file'}: ${row.id ?? row.slug ?? 'unknown row'}`;
}

function requireField(row, field) {
  if (row[field] === undefined || row[field] === null || row[field] === '') failures.push(`${rowLabel(row)} missing ${field}`);
}

function uniqueAcross(label, rows, field) {
  const seen = new Map();
  for (const row of rows) {
    const value = row[field];
    if (!value) continue;
    if (seen.has(value)) failures.push(`${label}: duplicate ${field} ${value} in ${seen.get(value)} and ${row.__source_file}`);
    else seen.set(value, row.__source_file);
  }
}

function validateUrl(row, field) {
  const value = row[field];
  if (!value) return;
  try {
    const parsed = new URL(value);
    if (!['http:', 'https:'].includes(parsed.protocol)) failures.push(`${rowLabel(row)} ${field} must use http or https`);
  } catch {
    failures.push(`${rowLabel(row)} has invalid ${field}: ${value}`);
  }
}

const stablecoins = combine('stablecoins.json', 'stablecoins-extra.json');
const organizations = combine('organizations.json');
const relationships = combine('relationships.json');
const legacyIssuers = combine('issuers.json', 'issuers-extra.json');
const events = combine('events.json', 'events-pr036.json', 'events-pr037.json', 'events-pr038.json');
const evidence = combine('evidence.json', 'evidence-extra.json', 'evidence-pr033.json', 'evidence-events-pr036.json', 'evidence-events-pr037.json', 'evidence-events-pr038.json');
const reserveReports = combine('reserve-reports.json', 'reserve-reports-extra.json', 'reserve-reports-pr033.json', 'reserve-reports-pr034.json');
const knownUnknowns = combine('known-unknowns.json', 'known-unknowns-extra.json', 'known-unknowns-pr033.json', 'known-unknowns-pr034.json');
const regulatoryNotes = combine('regulatory-notes.json');
const deployments = combine('deployments.json', 'deployments-extra.json');

for (const row of stablecoins) {
  requireField(row, 'id');
  requireField(row, 'slug');
  requireField(row, 'name');
  requireField(row, 'status');
  requireField(row, 'issuer_id');
}
uniqueAcross('stablecoins', stablecoins, 'id');
uniqueAcross('stablecoins', stablecoins, 'slug');

for (const row of organizations) {
  requireField(row, 'id');
  requireField(row, 'slug');
  requireField(row, 'name');
  requireField(row, 'organization_type');
  validateUrl(row, 'official_url');
}
uniqueAcross('organizations', organizations, 'id');
uniqueAcross('organizations', organizations, 'slug');

const organizationById = new Map(organizations.map((row) => [row.id, row]));
const legacyIssuerById = new Map(legacyIssuers.map((row) => [row.id, row]));
for (const organization of organizations) {
  const legacy = legacyIssuerById.get(organization.id);
  if (!legacy) failures.push(`${rowLabel(organization)} has no legacy issuer compatibility record`);
  else if (legacy.slug !== organization.slug) failures.push(`${rowLabel(organization)} slug differs from legacy issuer record: ${legacy.slug}`);
}
for (const legacy of legacyIssuers) {
  if (!organizationById.has(legacy.id)) failures.push(`${rowLabel(legacy)} is missing from organizations.json`);
}

const stablecoinIds = new Set(stablecoins.map((row) => row.id));
const organizationIds = new Set(organizations.map((row) => row.id));
const eventIds = new Set(events.map((row) => row.id));
const evidenceIds = new Set(evidence.map((row) => row.id));

for (const row of relationships) {
  requireField(row, 'id');
  requireField(row, 'stablecoin_id');
  requireField(row, 'organization_id');
  requireField(row, 'role');
  if (!stablecoinIds.has(row.stablecoin_id)) failures.push(`${rowLabel(row)} references missing stablecoin ${row.stablecoin_id}`);
  if (!organizationIds.has(row.organization_id)) failures.push(`${rowLabel(row)} references missing organization ${row.organization_id}`);
  if (Array.isArray(row.evidence_ids)) for (const evidenceId of row.evidence_ids) if (!evidenceIds.has(evidenceId)) failures.push(`${rowLabel(row)} references missing evidence ${evidenceId}`);
}
uniqueAcross('relationships', relationships, 'id');

const relationshipsByStablecoin = new Map();
for (const relationship of relationships) {
  const list = relationshipsByStablecoin.get(relationship.stablecoin_id) ?? [];
  list.push(relationship);
  relationshipsByStablecoin.set(relationship.stablecoin_id, list);
}
for (const stablecoin of stablecoins) {
  if (!organizationIds.has(stablecoin.issuer_id)) failures.push(`${rowLabel(stablecoin)} references missing organization ${stablecoin.issuer_id}`);
  const related = relationshipsByStablecoin.get(stablecoin.id) ?? [];
  if (related.length === 0) failures.push(`${rowLabel(stablecoin)} has no organization relationship`);
  if (!related.some((relationship) => relationship.organization_id === stablecoin.issuer_id)) failures.push(`${rowLabel(stablecoin)} legacy issuer_id ${stablecoin.issuer_id} is not represented in relationships.json`);
}

for (const row of events) {
  requireField(row, 'id');
  requireField(row, 'title');
  if (row.stablecoin_id && !stablecoinIds.has(row.stablecoin_id)) failures.push(`${rowLabel(row)} references missing stablecoin ${row.stablecoin_id}`);
  if (row.issuer_id && !organizationIds.has(row.issuer_id)) failures.push(`${rowLabel(row)} references missing organization ${row.issuer_id}`);
}
uniqueAcross('events', events, 'id');

for (const row of evidence) {
  requireField(row, 'id');
  requireField(row, 'title');
  requireField(row, 'url');
  validateUrl(row, 'url');
  if (row.stablecoin_id && !stablecoinIds.has(row.stablecoin_id)) failures.push(`${rowLabel(row)} references missing stablecoin ${row.stablecoin_id}`);
  if (row.issuer_id && !organizationIds.has(row.issuer_id)) failures.push(`${rowLabel(row)} references missing organization ${row.issuer_id}`);
  if (row.event_id && !eventIds.has(row.event_id)) failures.push(`${rowLabel(row)} references missing event ${row.event_id}`);
}
uniqueAcross('evidence', evidence, 'id');

for (const row of reserveReports) {
  requireField(row, 'id');
  validateUrl(row, 'url');
  if (row.stablecoin_id && !stablecoinIds.has(row.stablecoin_id)) failures.push(`${rowLabel(row)} references missing stablecoin ${row.stablecoin_id}`);
  if (row.issuer_id && !organizationIds.has(row.issuer_id)) failures.push(`${rowLabel(row)} references missing organization ${row.issuer_id}`);
}
uniqueAcross('reserve reports', reserveReports, 'id');

for (const row of knownUnknowns) {
  requireField(row, 'id');
  requireField(row, 'topic');
  requireField(row, 'description');
  if (row.stablecoin_id && !stablecoinIds.has(row.stablecoin_id)) failures.push(`${rowLabel(row)} references missing stablecoin ${row.stablecoin_id}`);
  if (row.issuer_id && !organizationIds.has(row.issuer_id)) failures.push(`${rowLabel(row)} references missing organization ${row.issuer_id}`);
}
uniqueAcross('known unknowns', knownUnknowns, 'id');

for (const row of regulatoryNotes) {
  requireField(row, 'id');
  requireField(row, 'title');
  requireField(row, 'summary');
  requireField(row, 'source_url');
  validateUrl(row, 'source_url');
  if (row.stablecoin_id && !stablecoinIds.has(row.stablecoin_id)) failures.push(`${rowLabel(row)} references missing stablecoin ${row.stablecoin_id}`);
  if (row.issuer_id && !organizationIds.has(row.issuer_id)) failures.push(`${rowLabel(row)} references missing organization ${row.issuer_id}`);
  if (row.event_id && !eventIds.has(row.event_id)) failures.push(`${rowLabel(row)} references missing event ${row.event_id}`);
}
uniqueAcross('regulatory notes', regulatoryNotes, 'id');

for (const row of deployments) {
  requireField(row, 'id');
  requireField(row, 'stablecoin_id');
  requireField(row, 'chain');
  requireField(row, 'deployment_type');
  requireField(row, 'status');
  if (row.stablecoin_id && !stablecoinIds.has(row.stablecoin_id)) failures.push(`${rowLabel(row)} references missing stablecoin ${row.stablecoin_id}`);
  if (Array.isArray(row.evidence_ids)) for (const evidenceId of row.evidence_ids) if (!evidenceIds.has(evidenceId)) failures.push(`${rowLabel(row)} references missing evidence ${evidenceId}`);
}
uniqueAcross('deployments', deployments, 'id');

if (failures.length > 0) {
  console.error('SOG data validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`SOG data validation passed: ${stablecoins.length} stablecoins, ${organizations.length} organizations, ${relationships.length} relationships, ${events.length} events, ${evidence.length} evidence records, ${reserveReports.length} reserve references, ${knownUnknowns.length} known unknowns, ${regulatoryNotes.length} regulatory notes, ${deployments.length} deployments.`);
