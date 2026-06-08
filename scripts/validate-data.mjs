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

  return parsed.map((row) => ({ ...row, __source_file: file }));
}

function combine(...files) {
  return files.flatMap((file) => readJsonArray(file));
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
const issuers = combine('issuers.json', 'issuers-extra.json');
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

for (const row of issuers) {
  requireField(row, 'id');
  requireField(row, 'slug');
  requireField(row, 'name');
  validateUrl(row, 'official_url');
}
uniqueAcross('issuers', issuers, 'id');
uniqueAcross('issuers', issuers, 'slug');

const stablecoinIds = new Set(stablecoins.map((row) => row.id));
const issuerIds = new Set(issuers.map((row) => row.id));
const eventIds = new Set(events.map((row) => row.id));
const evidenceIds = new Set(evidence.map((row) => row.id));

for (const row of stablecoins) if (row.issuer_id && !issuerIds.has(row.issuer_id)) failures.push(`${rowLabel(row)} references missing issuer ${row.issuer_id}`);

for (const row of events) {
  requireField(row, 'id');
  requireField(row, 'title');
  if (row.stablecoin_id && !stablecoinIds.has(row.stablecoin_id)) failures.push(`${rowLabel(row)} references missing stablecoin ${row.stablecoin_id}`);
  if (row.issuer_id && !issuerIds.has(row.issuer_id)) failures.push(`${rowLabel(row)} references missing issuer ${row.issuer_id}`);
}
uniqueAcross('events', events, 'id');

for (const row of evidence) {
  requireField(row, 'id');
  requireField(row, 'title');
  requireField(row, 'url');
  validateUrl(row, 'url');
  if (row.stablecoin_id && !stablecoinIds.has(row.stablecoin_id)) failures.push(`${rowLabel(row)} references missing stablecoin ${row.stablecoin_id}`);
  if (row.issuer_id && !issuerIds.has(row.issuer_id)) failures.push(`${rowLabel(row)} references missing issuer ${row.issuer_id}`);
  if (row.event_id && !eventIds.has(row.event_id)) failures.push(`${rowLabel(row)} references missing event ${row.event_id}`);
}
uniqueAcross('evidence', evidence, 'id');

for (const row of reserveReports) {
  requireField(row, 'id');
  validateUrl(row, 'url');
  if (row.stablecoin_id && !stablecoinIds.has(row.stablecoin_id)) failures.push(`${rowLabel(row)} references missing stablecoin ${row.stablecoin_id}`);
  if (row.issuer_id && !issuerIds.has(row.issuer_id)) failures.push(`${rowLabel(row)} references missing issuer ${row.issuer_id}`);
}
uniqueAcross('reserve reports', reserveReports, 'id');

for (const row of knownUnknowns) {
  requireField(row, 'id');
  requireField(row, 'topic');
  requireField(row, 'description');
  if (row.stablecoin_id && !stablecoinIds.has(row.stablecoin_id)) failures.push(`${rowLabel(row)} references missing stablecoin ${row.stablecoin_id}`);
  if (row.issuer_id && !issuerIds.has(row.issuer_id)) failures.push(`${rowLabel(row)} references missing issuer ${row.issuer_id}`);
}
uniqueAcross('known unknowns', knownUnknowns, 'id');

for (const row of regulatoryNotes) {
  requireField(row, 'id');
  requireField(row, 'title');
  requireField(row, 'summary');
  requireField(row, 'source_url');
  validateUrl(row, 'source_url');
  if (row.stablecoin_id && !stablecoinIds.has(row.stablecoin_id)) failures.push(`${rowLabel(row)} references missing stablecoin ${row.stablecoin_id}`);
  if (row.issuer_id && !issuerIds.has(row.issuer_id)) failures.push(`${rowLabel(row)} references missing issuer ${row.issuer_id}`);
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

console.log(`SOG data validation passed: ${stablecoins.length} stablecoins, ${issuers.length} issuers, ${events.length} events, ${evidence.length} evidence records, ${reserveReports.length} reserve references, ${knownUnknowns.length} known unknowns, ${regulatoryNotes.length} regulatory notes, ${deployments.length} deployments.`);
