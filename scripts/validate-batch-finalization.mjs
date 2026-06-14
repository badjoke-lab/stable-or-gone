import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const failures = [];
const baselinePath = 'docs/migration/registry-v2-baseline.json';

function fail(message) {
  failures.push(message);
}

function exists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function readText(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function readJson(relativePath) {
  try {
    return JSON.parse(readText(relativePath));
  } catch (error) {
    fail(`${relativePath}: ${error.message}`);
    return null;
  }
}

function readGroup(files, label) {
  const rows = [];
  const seenFiles = new Set();
  for (const file of files ?? []) {
    if (seenFiles.has(file)) {
      fail(`${label}: duplicate data-group path ${file}`);
      continue;
    }
    seenFiles.add(file);
    if (!exists(file)) {
      fail(`${label}: missing data-group file ${file}`);
      continue;
    }
    const data = readJson(file);
    if (!Array.isArray(data)) {
      fail(`${label}: ${file} must contain a JSON array`);
      continue;
    }
    rows.push(...data);
  }
  return rows;
}

function duplicateIds(label, rows) {
  const seen = new Set();
  for (const row of rows) {
    if (!row || typeof row.id !== 'string' || row.id.length === 0) {
      fail(`${label}: record without a valid id`);
      continue;
    }
    if (seen.has(row.id)) fail(`${label}: duplicate id ${row.id}`);
    seen.add(row.id);
  }
  return seen;
}

function walk(relativeDir) {
  const base = path.join(root, relativeDir);
  if (!fs.existsSync(base)) return [];
  const output = [];
  for (const entry of fs.readdirSync(base, { withFileTypes: true })) {
    const relativePath = path.posix.join(relativeDir, entry.name);
    if (entry.isDirectory()) output.push(...walk(relativePath));
    else output.push(relativePath);
  }
  return output;
}

const baseline = readJson(baselinePath);
if (!baseline) process.exit(1);

const groups = {};
for (const [name, files] of Object.entries(baseline.data_groups ?? {})) {
  groups[name] = readGroup(files, name);
}

const countAliases = {
  evidence_relations: 'evidence_relations'
};
for (const [name, expected] of Object.entries(baseline.minimum_counts ?? {})) {
  const groupName = countAliases[name] ?? name;
  const actual = groups[groupName]?.length;
  if (typeof actual !== 'number') {
    fail(`baseline count ${name}: no matching data group`);
  } else if (actual !== expected) {
    fail(`baseline count ${name}: expected ${expected}, found ${actual}; update data and baseline together`);
  }
}

const idSets = {};
for (const [name, rows] of Object.entries(groups)) idSets[name] = duplicateIds(name, rows);

const stablecoinIds = idSets.stablecoins ?? new Set();
const organizationIds = idSets.organizations ?? new Set();
const classificationIds = idSets.classifications ?? new Set();
const profileIds = idSets.profiles ?? new Set();
const eventIds = idSets.events ?? new Set();
const eventDetailIds = idSets.event_details ?? new Set();
const evidenceIds = idSets.evidence ?? new Set();

for (const id of stablecoinIds) {
  if (!classificationIds.has(id)) fail(`stablecoin ${id}: missing classification`);
  if (!profileIds.has(id)) fail(`stablecoin ${id}: missing reserve/redemption profile`);
}
for (const id of classificationIds) if (!stablecoinIds.has(id)) fail(`classification ${id}: orphan stablecoin reference`);
for (const id of profileIds) if (!stablecoinIds.has(id)) fail(`profile ${id}: orphan stablecoin reference`);
for (const id of eventIds) if (!eventDetailIds.has(id)) fail(`event ${id}: missing Event v2 detail`);
for (const id of eventDetailIds) if (!eventIds.has(id)) fail(`event detail ${id}: orphan event detail`);

const relationshipsByStablecoin = new Map();
for (const row of groups.relationships ?? []) {
  if (!stablecoinIds.has(row.stablecoin_id)) fail(`relationship ${row.id}: missing stablecoin ${row.stablecoin_id}`);
  if (!organizationIds.has(row.organization_id)) fail(`relationship ${row.id}: missing organization ${row.organization_id}`);
  relationshipsByStablecoin.set(row.stablecoin_id, (relationshipsByStablecoin.get(row.stablecoin_id) ?? 0) + 1);
  for (const evidenceId of row.evidence_ids ?? []) if (!evidenceIds.has(evidenceId)) fail(`relationship ${row.id}: missing evidence ${evidenceId}`);
}
for (const id of stablecoinIds) if (!relationshipsByStablecoin.has(id)) fail(`stablecoin ${id}: no organization relationship`);

for (const row of groups.events ?? []) {
  for (const id of row.subject_stablecoin_ids ?? []) if (!stablecoinIds.has(id)) fail(`event ${row.id}: missing stablecoin ${id}`);
  for (const id of row.subject_organization_ids ?? []) if (!organizationIds.has(id)) fail(`event ${row.id}: missing organization ${id}`);
  for (const id of row.evidence_ids ?? []) if (!evidenceIds.has(id)) fail(`event ${row.id}: missing evidence ${id}`);
}
for (const row of groups.evidence ?? []) {
  for (const id of row.stablecoin_ids ?? []) if (!stablecoinIds.has(id)) fail(`evidence ${row.id}: missing stablecoin ${id}`);
  for (const id of row.organization_ids ?? []) if (!organizationIds.has(id)) fail(`evidence ${row.id}: missing organization ${id}`);
  for (const id of row.event_ids ?? []) if (!eventIds.has(id)) fail(`evidence ${row.id}: missing event ${id}`);
}
for (const row of groups.deployments ?? []) {
  if (!stablecoinIds.has(row.stablecoin_id)) fail(`deployment ${row.id}: missing stablecoin ${row.stablecoin_id}`);
  for (const id of row.evidence_ids ?? []) if (!evidenceIds.has(id)) fail(`deployment ${row.id}: missing evidence ${id}`);
}

const candidates = readJson('data/candidate-stable-assets.json') ?? [];
const promoted = candidates.filter((row) => row.status === 'promoted');
const promotedIds = new Set();
for (const row of promoted) {
  if (!row.proposed_record_id) {
    fail(`candidate ${row.candidate_id ?? 'unknown'}: promoted without proposed_record_id`);
    continue;
  }
  if (promotedIds.has(row.proposed_record_id)) fail(`candidate master: duplicate promoted record ${row.proposed_record_id}`);
  promotedIds.add(row.proposed_record_id);
  if (!stablecoinIds.has(row.proposed_record_id)) fail(`candidate ${row.candidate_id}: promoted record missing from canonical registry`);
}
for (const id of stablecoinIds) if (!promotedIds.has(id)) fail(`stablecoin ${id}: missing promoted Candidate Master entry`);
if (promoted.length !== stablecoinIds.size) fail(`Candidate Master: ${promoted.length} promoted records but ${stablecoinIds.size} canonical stablecoins`);

for (const row of baseline.protected_stablecoins ?? []) {
  const match = (groups.stablecoins ?? []).find((item) => item.id === row.id);
  if (!match) fail(`protected stablecoin missing: ${row.id}`);
  else if (match.slug !== row.slug) fail(`protected stablecoin ${row.id}: expected slug ${row.slug}, found ${match.slug}`);
}
for (const row of baseline.protected_organizations ?? []) {
  const match = (groups.organizations ?? []).find((item) => item.id === row.id);
  if (!match) fail(`protected organization missing: ${row.id}`);
  else if (match.slug !== row.slug) fail(`protected organization ${row.id}: expected slug ${row.slug}, found ${match.slug}`);
}
for (const file of baseline.required_route_sources ?? []) if (!exists(file)) fail(`required route source missing: ${file}`);

const batchPatterns = [
  ['stablecoins', /^stablecoins-batch-[a-z0-9-]+\.json$/],
  ['organizations', /^organizations-batch-[a-z0-9-]+\.json$/],
  ['relationships', /^relationships-batch-[a-z0-9-]+\.json$/],
  ['classifications', /^stablecoin-classification-batch-[a-z0-9-]+\.json$/],
  ['classification_extensions', /^stablecoin-classification-extension-batch-[a-z0-9-]+\.json$/],
  ['profiles', /^stablecoin-profiles-batch-[a-z0-9-]+\.json$/],
  ['events', /^events-batch-[a-z0-9-]+\.json$/],
  ['event_details', /^event-details-batch-[a-z0-9-]+\.json$/],
  ['evidence', /^evidence-batch-[a-z0-9-]+\.json$/],
  ['reserve_reports', /^reserve-reports-batch-[a-z0-9-]+\.json$/],
  ['known_unknowns', /^known-unknowns-batch-[a-z0-9-]+\.json$/],
  ['deployments', /^deployments-batch-[a-z0-9-]+\.json$/]
];
const dataFiles = walk('data').filter((file) => file.endsWith('.json'));
for (const [groupName, pattern] of batchPatterns) {
  const listed = new Set(baseline.data_groups?.[groupName] ?? []);
  for (const file of dataFiles) {
    if (pattern.test(path.posix.basename(file)) && !listed.has(file)) fail(`${file}: batch file is not listed in baseline group ${groupName}`);
  }
}

const registryLoader = readText('src/lib/data/registry.ts');
const profileLoader = readText('src/lib/data/stablecoinProfiles.ts');
const loaderMap = {
  stablecoins: registryLoader,
  organizations: registryLoader,
  relationships: registryLoader,
  classifications: registryLoader,
  classification_extensions: registryLoader,
  profiles: profileLoader,
  events: registryLoader,
  event_details: registryLoader,
  evidence: registryLoader,
  reserve_reports: registryLoader,
  known_unknowns: registryLoader,
  regulatory_notes: registryLoader,
  deployments: registryLoader
};
for (const [groupName, loaderText] of Object.entries(loaderMap)) {
  for (const file of baseline.data_groups?.[groupName] ?? []) {
    const basename = path.posix.basename(file);
    if (!loaderText.includes(basename)) fail(`${file}: listed in baseline but missing from runtime loader for ${groupName}`);
  }
}

const validateDataText = readText('scripts/validate-data.mjs');
const validateCompatText = readText('scripts/validate-registry-v2-compat.mjs');
for (const file of dataFiles.filter((file) => /^issuers-batch-[a-z0-9-]+\.json$/.test(path.posix.basename(file)))) {
  if (!validateDataText.includes(file)) fail(`${file}: missing from validate-data legacy issuer loader`);
  if (!validateCompatText.includes(file)) fail(`${file}: missing from compatibility validator legacy issuer loader`);
}

const forbiddenPatterns = [
  /^\.github\/workflows\/apply-batch-[^/]+\.ya?ml$/i,
  /^\.github\/workflows\/batch-[^/]+-(?:bootstrap|preview|source-artifact|generation)[^/]*\.ya?ml$/i,
  /^scripts\/apply-batch-[^/]+\.mjs$/i,
  /^scripts\/batch-[^/]+-source\//i,
  /^docs\/batch-[^/]+-pr-sync(?:-\d+)?\.md$/i,
  /^docs\/__branch_probe__\.md$/i,
  /^docs\/batch-[^/]+-validation-error\.txt$/i,
  /^data\/[^/]*-partial(?:-[^/]*)?\.json$/i
];
for (const file of [...walk('.github'), ...walk('scripts'), ...walk('docs'), ...walk('data')]) {
  if (forbiddenPatterns.some((pattern) => pattern.test(file))) fail(`${file}: temporary batch artifact must not remain in the canonical branch`);
}

if (failures.length) {
  console.error('Batch finalization validation failed:');
  for (const message of failures) console.error(`- ${message}`);
  process.exit(1);
}

console.log(`Batch finalization validation passed: ${stablecoinIds.size} stablecoins, ${promoted.length} promoted candidates, ${eventIds.size} events, ${evidenceIds.size} evidence records.`);
