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
  let parsed;
  try {
    parsed = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
  } catch (error) {
    failures.push(`${file}: invalid JSON (${error.message})`);
    return [];
  }
  if (!Array.isArray(parsed)) {
    failures.push(`${file}: expected a JSON array`);
    return [];
  }
  return parsed;
}

function requireField(file, row, field) {
  if (row[field] === undefined || row[field] === null || row[field] === '') {
    failures.push(`${file}: ${row.id ?? row.slug ?? 'unknown row'} missing ${field}`);
  }
}

function unique(file, rows, field) {
  const seen = new Set();
  for (const row of rows) {
    const value = row[field];
    if (!value) continue;
    if (seen.has(value)) failures.push(`${file}: duplicate ${field} ${value}`);
    seen.add(value);
  }
}

const stablecoins = readJsonArray('stablecoins.json');
const issuers = readJsonArray('issuers.json');
const events = readJsonArray('events.json');
const evidence = readJsonArray('evidence.json');
const reserveReports = readJsonArray('reserve-reports.json');
const knownUnknowns = readJsonArray('known-unknowns.json');
const regulatoryNotes = readJsonArray('regulatory-notes.json');
const deployments = readJsonArray('deployments.json');

for (const row of stablecoins) {
  requireField('stablecoins.json', row, 'id');
  requireField('stablecoins.json', row, 'slug');
  requireField('stablecoins.json', row, 'name');
  requireField('stablecoins.json', row, 'status');
  requireField('stablecoins.json', row, 'issuer_id');
}
unique('stablecoins.json', stablecoins, 'id');
unique('stablecoins.json', stablecoins, 'slug');

for (const row of issuers) {
  requireField('issuers.json', row, 'id');
  requireField('issuers.json', row, 'slug');
  requireField('issuers.json', row, 'name');
}
unique('issuers.json', issuers, 'id');
unique('issuers.json', issuers, 'slug');

const stablecoinIds = new Set(stablecoins.map((row) => row.id));
const issuerIds = new Set(issuers.map((row) => row.id));
const eventIds = new Set(events.map((row) => row.id));
const evidenceIds = new Set(evidence.map((row) => row.id));

for (const row of stablecoins) {
  if (row.issuer_id && !issuerIds.has(row.issuer_id)) failures.push(`stablecoins.json: ${row.id} references missing issuer ${row.issuer_id}`);
}

for (const row of events) {
  requireField('events.json', row, 'id');
  requireField('events.json', row, 'title');
  if (row.stablecoin_id && !stablecoinIds.has(row.stablecoin_id)) failures.push(`events.json: ${row.id} references missing stablecoin ${row.stablecoin_id}`);
  if (row.issuer_id && !issuerIds.has(row.issuer_id)) failures.push(`events.json: ${row.id} references missing issuer ${row.issuer_id}`);
}
unique('events.json', events, 'id');

for (const row of evidence) {
  requireField('evidence.json', row, 'id');
  requireField('evidence.json', row, 'title');
  requireField('evidence.json', row, 'url');
  if (row.stablecoin_id && !stablecoinIds.has(row.stablecoin_id)) failures.push(`evidence.json: ${row.id} references missing stablecoin ${row.stablecoin_id}`);
  if (row.issuer_id && !issuerIds.has(row.issuer_id)) failures.push(`evidence.json: ${row.id} references missing issuer ${row.issuer_id}`);
  if (row.event_id && !eventIds.has(row.event_id)) failures.push(`evidence.json: ${row.id} references missing event ${row.event_id}`);
}
unique('evidence.json', evidence, 'id');

for (const row of reserveReports) {
  requireField('reserve-reports.json', row, 'id');
  if (row.stablecoin_id && !stablecoinIds.has(row.stablecoin_id)) failures.push(`reserve-reports.json: ${row.id} references missing stablecoin ${row.stablecoin_id}`);
  if (row.issuer_id && !issuerIds.has(row.issuer_id)) failures.push(`reserve-reports.json: ${row.id} references missing issuer ${row.issuer_id}`);
}
unique('reserve-reports.json', reserveReports, 'id');

for (const row of knownUnknowns) {
  requireField('known-unknowns.json', row, 'id');
  requireField('known-unknowns.json', row, 'topic');
  requireField('known-unknowns.json', row, 'description');
  if (row.stablecoin_id && !stablecoinIds.has(row.stablecoin_id)) failures.push(`known-unknowns.json: ${row.id} references missing stablecoin ${row.stablecoin_id}`);
  if (row.issuer_id && !issuerIds.has(row.issuer_id)) failures.push(`known-unknowns.json: ${row.id} references missing issuer ${row.issuer_id}`);
}
unique('known-unknowns.json', knownUnknowns, 'id');

for (const row of regulatoryNotes) {
  requireField('regulatory-notes.json', row, 'id');
  requireField('regulatory-notes.json', row, 'title');
  requireField('regulatory-notes.json', row, 'summary');
  requireField('regulatory-notes.json', row, 'source_url');
  if (row.stablecoin_id && !stablecoinIds.has(row.stablecoin_id)) failures.push(`regulatory-notes.json: ${row.id} references missing stablecoin ${row.stablecoin_id}`);
  if (row.issuer_id && !issuerIds.has(row.issuer_id)) failures.push(`regulatory-notes.json: ${row.id} references missing issuer ${row.issuer_id}`);
  if (row.event_id && !eventIds.has(row.event_id)) failures.push(`regulatory-notes.json: ${row.id} references missing event ${row.event_id}`);
}
unique('regulatory-notes.json', regulatoryNotes, 'id');

for (const row of deployments) {
  requireField('deployments.json', row, 'id');
  requireField('deployments.json', row, 'stablecoin_id');
  requireField('deployments.json', row, 'chain');
  requireField('deployments.json', row, 'deployment_type');
  requireField('deployments.json', row, 'status');
  if (row.stablecoin_id && !stablecoinIds.has(row.stablecoin_id)) failures.push(`deployments.json: ${row.id} references missing stablecoin ${row.stablecoin_id}`);
  if (Array.isArray(row.evidence_ids)) {
    for (const evidenceId of row.evidence_ids) {
      if (!evidenceIds.has(evidenceId)) failures.push(`deployments.json: ${row.id} references missing evidence ${evidenceId}`);
    }
  }
}
unique('deployments.json', deployments, 'id');

if (failures.length > 0) {
  console.error('SOG data validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`SOG data validation passed: ${stablecoins.length} stablecoins, ${issuers.length} issuers, ${events.length} events, ${evidence.length} evidence records, ${regulatoryNotes.length} regulatory notes, ${deployments.length} deployments.`);
