import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const failures = [];
const baselinePath = 'docs/migration/registry-v2-baseline.json';
const v3FoundationPath = 'docs/migration/registry-v3-foundation.json';
const candidateContractPath = 'docs/growth/candidate-master-70.json';

const fail = (message) => failures.push(message);
const absolute = (relativePath) => path.join(root, relativePath);
const exists = (relativePath) => fs.existsSync(absolute(relativePath));
const readText = (relativePath) => fs.readFileSync(absolute(relativePath), 'utf8');

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

function collectIds(label, rows) {
  const ids = new Set();
  for (const row of rows) {
    if (!row || typeof row.id !== 'string' || row.id.length === 0) {
      fail(`${label}: record without a valid id`);
      continue;
    }
    if (ids.has(row.id)) fail(`${label}: duplicate id ${row.id}`);
    ids.add(row.id);
  }
  return ids;
}

function walk(relativeDir) {
  const directory = absolute(relativeDir);
  if (!fs.existsSync(directory)) return [];
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const relativePath = path.posix.join(relativeDir, entry.name);
    if (entry.isDirectory()) files.push(...walk(relativePath));
    else files.push(relativePath);
  }
  return files;
}

function loadCandidateMaster() {
  const contract = readJson(candidateContractPath) ?? {};
  const master = readGroup(contract.candidate_files ?? ['data/candidate-stable-assets.json'], 'Candidate Master');
  const promotionFiles = ['data/candidate-promotions-batch-d.json', 'data/candidate-promotions-batch-f.json', 'data/candidate-promotions-batch-g.json', 'data/candidate-promotions-batch-h.json', 'data/candidate-promotions-batch-i.json', 'data/candidate-promotions-batch-j.json'];
  const patches = new Map();
  for (const file of promotionFiles) {
    if (!exists(file)) continue;
    const rows = readJson(file);
    if (!Array.isArray(rows)) {
      fail(`${file}: expected a JSON array`);
      continue;
    }
    for (const row of rows) {
      if (!row.candidate_id) {
        fail(`${file}: promotion without candidate_id`);
        continue;
      }
      if (patches.has(row.candidate_id)) fail(`Candidate Master: duplicate promotion patch ${row.candidate_id}`);
      patches.set(row.candidate_id, row);
    }
  }
  for (const candidateId of patches.keys()) {
    if (!master.some((row) => row.candidate_id === candidateId)) fail(`Candidate Master: promotion references missing candidate ${candidateId}`);
  }
  return master.map((row) => ({ ...row, ...(patches.get(row.candidate_id) ?? {}) }));
}

const baseline = readJson(baselinePath);
const v3Foundation = readJson(v3FoundationPath);
if (!baseline || !v3Foundation) process.exit(1);
if (v3Foundation.base_registry !== baselinePath) fail(`${v3FoundationPath}: base_registry must reference ${baselinePath}`);
if (v3Foundation.status !== 'additive') fail(`${v3FoundationPath}: status must be additive`);

const groups = {};
for (const [name, files] of Object.entries(baseline.data_groups ?? {})) groups[name] = readGroup(files, name);
const v3Groups = {};
for (const [name, files] of Object.entries(v3Foundation.data_groups ?? {})) v3Groups[name] = readGroup(files, `Registry v3 ${name}`);

for (const [name, minimum] of Object.entries(baseline.minimum_counts ?? {})) {
  const actual = groups[name]?.length;
  if (typeof actual !== 'number') fail(`baseline count ${name}: no matching data group`);
  else if (actual < minimum) fail(`baseline count ${name}: expected at least ${minimum}, found ${actual}`);
}
for (const [name, minimum] of Object.entries(v3Foundation.minimum_counts ?? {})) {
  const actual = v3Groups[name]?.length;
  if (typeof actual !== 'number') fail(`Registry v3 count ${name}: no matching data group`);
  else if (actual < minimum) fail(`Registry v3 count ${name}: expected at least ${minimum}, found ${actual}`);
}

const idSets = Object.fromEntries(Object.entries(groups).map(([name, rows]) => [name, collectIds(name, rows)]));
const v3IdSets = Object.fromEntries(Object.entries(v3Groups).map(([name, rows]) => [name, collectIds(`Registry v3 ${name}`, rows)]));
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

for (const id of v3IdSets.legal_profiles ?? []) if (!stablecoinIds.has(id)) fail(`Registry v3 legal profile ${id}: orphan stablecoin reference`);
for (const row of v3Groups.stable_asset_relationships ?? []) {
  if (!stablecoinIds.has(row.from_asset_id)) fail(`Registry v3 asset relationship ${row.id}: missing from asset ${row.from_asset_id}`);
  if (!stablecoinIds.has(row.to_asset_id)) fail(`Registry v3 asset relationship ${row.id}: missing to asset ${row.to_asset_id}`);
}
for (const row of v3Groups.reserve_components ?? []) if (!stablecoinIds.has(row.stablecoin_id)) fail(`Registry v3 reserve component ${row.id}: missing stablecoin ${row.stablecoin_id}`);

const candidates = loadCandidateMaster();
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

const registryLoader = readText('src/lib/data/registry.ts');
const profileLoader = readText('src/lib/data/stablecoinProfiles.ts');
const v3LoaderPath = v3Foundation.loader;
if (!v3LoaderPath || !exists(v3LoaderPath)) fail(`${v3FoundationPath}: missing Registry v3 loader ${v3LoaderPath ?? '(undefined)'}`);
const v3Loader = v3LoaderPath && exists(v3LoaderPath) ? readText(v3LoaderPath) : '';
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
  for (const file of baseline.data_groups?.[groupName] ?? []) if (!loaderText.includes(path.posix.basename(file))) fail(`${file}: listed in baseline but missing from runtime loader for ${groupName}`);
}
for (const [groupName, files] of Object.entries(v3Foundation.data_groups ?? {})) {
  for (const file of files) if (!v3Loader.includes(path.posix.basename(file))) fail(`${file}: listed in Registry v3 foundation but missing from runtime loader for ${groupName}`);
}

if (!v3Foundation.validator || !exists(v3Foundation.validator)) fail(`${v3FoundationPath}: missing Registry v3 validator ${v3Foundation.validator ?? '(undefined)'}`);
const packageJsonText = readText('package.json');
if (!packageJsonText.includes('validate:v3')) fail('package.json: Registry v3 validator is not exposed as validate:v3');
if (!packageJsonText.includes('npm run validate:v3')) fail('package.json: Registry v3 validator is not included in the build chain');
const ciText = readText('.github/workflows/ci.yml');
if (!ciText.includes('npm run validate:v3')) fail('.github/workflows/ci.yml: Registry v3 validator is not included in CI');

const validateDataText = readText('scripts/validate-data.mjs');
const validateCompatText = readText('scripts/validate-registry-v2-compat.mjs');
for (const organizationFile of baseline.data_groups?.organizations ?? []) {
  const match = path.posix.basename(organizationFile).match(/^organizations-(batch-[a-z0-9-]+)\.json$/);
  if (!match) continue;
  const issuerFile = `data/issuers-${match[1]}.json`;
  if (!exists(issuerFile)) continue;
  if (!validateDataText.includes(issuerFile)) fail(`${issuerFile}: missing from validate-data legacy issuer loader`);
  if (!validateCompatText.includes(issuerFile)) fail(`${issuerFile}: missing from compatibility validator legacy issuer loader`);
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

console.log(`Batch finalization validation passed: ${stablecoinIds.size} stablecoins, ${promoted.length} promoted candidates, ${eventIds.size} events, ${evidenceIds.size} evidence records, ${v3Groups.legal_profiles?.length ?? 0} legal profiles, ${v3Groups.stable_asset_relationships?.length ?? 0} asset relationships, ${v3Groups.reserve_components?.length ?? 0} reserve components.`);
