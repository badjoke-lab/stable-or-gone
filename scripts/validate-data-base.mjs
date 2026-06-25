import fs from 'node:fs';
import path from 'node:path';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const root = process.cwd();
const failures = [];
const baseline = loadRegistryV2Baseline(root);

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
  ...read('data/issuers-batch-d.json'),
  ...read('data/issuers-batch-e.json'),
  ...read('data/issuers-batch-f.json'),
  ...read('data/issuers-batch-g.json'),
  ...read('data/issuers-batch-h.json'),
  ...read('data/issuers-batch-i.json'),
  ...read('data/issuers-batch-j.json'),
  ...read('data/issuers-batch-k.json'),
  ...read('data/issuers-batch-l.json'),
  ...read('data/issuers-batch-m.json'),
  ...read('data/issuers-batch-n.json'),
  ...read('data/issuers-batch-o.json'),
  ...read('data/issuers-batch-p.json')
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

for (const row of relationships) {
  required(row, 'id'); required(row, 'stablecoin_id'); required(row, 'organization_id'); required(row, 'role');
}
unique('relationships', relationships, 'id');

for (const row of events) {
  required(row, 'id'); required(row, 'title');
}
unique('events', events, 'id');

for (const row of evidence) {
  required(row, 'id'); required(row, 'title'); required(row, 'url'); validUrl(row, 'url'); validUrl(row, 'archived_url');
}
unique('evidence', evidence, 'id');

for (const row of reserveReports) {
  required(row, 'id'); validUrl(row, 'url'); validUrl(row, 'archived_url');
}
unique('reserve reports', reserveReports, 'id');

for (const row of knownUnknowns) {
  required(row, 'id'); required(row, 'topic'); required(row, 'description');
}
unique('known unknowns', knownUnknowns, 'id');

for (const row of regulatoryNotes) {
  required(row, 'id'); required(row, 'title'); required(row, 'summary'); required(row, 'source_url'); validUrl(row, 'source_url');
}
unique('regulatory notes', regulatoryNotes, 'id');

for (const row of deployments) {
  required(row, 'id'); required(row, 'stablecoin_id'); required(row, 'chain'); required(row, 'deployment_type'); required(row, 'status');
}
unique('deployments', deployments, 'id');

unique('legacy issuers', legacyIssuers, 'id');
unique('legacy issuers', legacyIssuers, 'slug');

if (failures.length) {
  console.error('Data validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Data validation passed: ${stablecoins.length} stablecoins, ${organizations.length} organizations, ${relationships.length} relationships, ${events.length} events, ${evidence.length} evidence records, ${reserveReports.length} reserve reports, ${knownUnknowns.length} known unknowns, ${regulatoryNotes.length} regulatory notes, ${deployments.length} deployments, ${legacyIssuers.length} issuer compatibility records.`);
