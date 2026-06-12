import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const dataDir = path.join(root, 'data');
const failures = [];

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

function exists(relativePath) {
  if (!fs.existsSync(path.join(root, relativePath))) failures.push(`missing required file: ${relativePath}`);
}

const stablecoins = [...readArray('stablecoins.json'), ...readArray('stablecoins-extra.json')];
const organizations = readArray('organizations.json');
const relationships = readArray('relationships.json');
const classifications = readArray('stablecoin-classification-v2.json');
const profiles = readArray('stablecoin-profiles-v2.json');
const events = [...readArray('events.json'), ...readArray('events-pr036.json'), ...readArray('events-pr037.json'), ...readArray('events-pr038.json')];
const eventDetails = readArray('event-details-v2.json');
const evidence = [
  ...readArray('evidence.json'),
  ...readArray('evidence-extra.json'),
  ...readArray('evidence-pr033.json'),
  ...readArray('evidence-events-pr036.json'),
  ...readArray('evidence-events-pr037.json'),
  ...readArray('evidence-events-pr038.json')
];

const stablecoinIds = new Set(stablecoins.map((row) => row.id));
const organizationIds = new Set(organizations.map((row) => row.id));
const eventIds = new Set(events.map((row) => row.id));
const evidenceIds = new Set(evidence.map((row) => row.id));

if (stablecoins.length < 20) failures.push(`stablecoins: expected at least 20, found ${stablecoins.length}`);
if (organizations.length < 16) failures.push(`organizations: expected at least 16, found ${organizations.length}`);
if (relationships.length < 20) failures.push(`relationships: expected at least 20, found ${relationships.length}`);
if (classifications.length !== stablecoins.length) failures.push(`classifications: expected ${stablecoins.length}, found ${classifications.length}`);
if (profiles.length !== stablecoins.length) failures.push(`profiles: expected ${stablecoins.length}, found ${profiles.length}`);
if (eventDetails.length !== events.length) failures.push(`event_details: expected ${events.length}, found ${eventDetails.length}`);
if (evidence.length < 90) failures.push(`evidence: expected at least 90, found ${evidence.length}`);

for (const row of stablecoins) {
  const classification = classifications.find((item) => item.id === row.id);
  const profile = profiles.find((item) => item.id === row.id);
  if (!classification) failures.push(`${row.id}: missing Registry v2 classification`);
  if (!profile) failures.push(`${row.id}: missing Registry v2 reserve/redemption profile`);
  if (!relationships.some((item) => item.stablecoin_id === row.id)) failures.push(`${row.id}: missing organization relationship`);
}

for (const row of relationships) {
  if (!stablecoinIds.has(row.stablecoin_id)) failures.push(`${row.id}: missing stablecoin ${row.stablecoin_id}`);
  if (!organizationIds.has(row.organization_id)) failures.push(`${row.id}: missing organization ${row.organization_id}`);
  for (const evidenceId of row.evidence_ids ?? []) if (!evidenceIds.has(evidenceId)) failures.push(`${row.id}: missing evidence ${evidenceId}`);
}

for (const row of eventDetails) {
  if (!eventIds.has(row.id)) failures.push(`${row.id}: event detail without matching event`);
  for (const stablecoinId of row.subject_stablecoin_ids ?? []) if (!stablecoinIds.has(stablecoinId)) failures.push(`${row.id}: missing subject stablecoin ${stablecoinId}`);
  for (const organizationId of row.subject_organization_ids ?? []) if (!organizationIds.has(organizationId)) failures.push(`${row.id}: missing subject organization ${organizationId}`);
}

for (const row of evidence) {
  if (row.stablecoin_id && !stablecoinIds.has(row.stablecoin_id)) failures.push(`${row.id}: missing stablecoin ${row.stablecoin_id}`);
  if (row.issuer_id && !organizationIds.has(row.issuer_id)) failures.push(`${row.id}: missing organization ${row.issuer_id}`);
  if (row.event_id && !eventIds.has(row.event_id)) failures.push(`${row.id}: missing event ${row.event_id}`);
}

exists('public/llms.txt');
exists('src/pages/issuer/[slug].astro');
exists('src/pages/issuers/index.astro');
exists('src/pages/methodology/index.astro');
exists('src/pages/glossary/index.astro');
exists('src/components/StablecoinDetailView.astro');

if (failures.length > 0) {
  console.error('Registry v2 final validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Registry v2 final validation passed. Record growth can resume after build verification.');
