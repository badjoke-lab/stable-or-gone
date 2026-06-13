import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const candidatePath = path.join(root, 'data', 'candidate-stable-assets.json');
const baselinePath = path.join(root, 'docs', 'migration', 'registry-v2-baseline.json');
const failures = [];
const warnings = [];

const allowedStatuses = new Set(['candidate', 'accepted', 'promoted', 'duplicate', 'excluded', 'watchlist', 'needs_review']);
const allowedPriorities = new Set(['P0', 'P1', 'P2', 'P3', 'P4', 'PX']);
const allowedCandidateTypes = new Set(['stablecoin', 'stable_value_asset', 'stablecoin_adjacent', 'tokenized_commodity', 'experimental_stabilization_asset', 'reserve_asset', 'unknown']);
const allowedAssetClasses = new Set(['stablecoin', 'stable_value_asset', 'stablecoin_adjacent', 'tokenized_commodity', 'yield_bearing_stable_receipt', 'experimental_stabilization_asset', 'reserve_asset', 'unknown']);
const allowedReferenceKinds = new Set(['fiat', 'commodity', 'crypto_asset', 'index', 'floating', 'other', 'unknown']);
const requiredFields = ['candidate_id', 'proposed_record_id', 'slug', 'name', 'symbol', 'aliases', 'candidate_type', 'asset_class', 'reference_kind', 'reference_label', 'priority', 'status', 'target_batch', 'notes'];

function readJson(filePath) {
  if (!fs.existsSync(filePath)) {
    failures.push(`missing file: ${path.relative(root, filePath)}`);
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    failures.push(`invalid JSON: ${path.relative(root, filePath)} (${error.message})`);
    return null;
  }
}

function readArray(relativePath) {
  const value = readJson(path.join(root, relativePath));
  if (value === null) return [];
  if (!Array.isArray(value)) {
    failures.push(`expected JSON array: ${relativePath}`);
    return [];
  }
  return value;
}

function readGroup(paths) {
  return (paths ?? []).flatMap(readArray);
}

function normalize(value) {
  if (value === null || value === undefined) return '';
  return String(value).trim().toLowerCase();
}

function registerUnique(map, key, label, candidateId) {
  if (!key) return;
  const existing = map.get(key);
  if (existing) failures.push(`${label} duplicate: ${key} (${existing}, ${candidateId})`);
  else map.set(key, candidateId);
}

function collectStablecoinReferences(rows) {
  const ids = new Set();
  for (const row of rows) {
    if (typeof row?.stablecoin_id === 'string' && row.stablecoin_id) ids.add(row.stablecoin_id);
    for (const field of ['stablecoin_ids', 'subject_stablecoin_ids']) {
      for (const id of row?.[field] ?? []) {
        if (typeof id === 'string' && id) ids.add(id);
      }
    }
  }
  return ids;
}

const candidates = readJson(candidatePath);
const baseline = readJson(baselinePath);

if (!Array.isArray(candidates)) failures.push('data/candidate-stable-assets.json must be a JSON array');
if (!baseline) failures.push('Registry v2 baseline is required for candidate validation');

if (failures.length > 0) {
  console.error('Candidate Stable Asset Master validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

const stablecoins = readGroup(baseline.data_groups?.stablecoins);
const classifications = readGroup(baseline.data_groups?.classifications);
const profiles = readGroup(baseline.data_groups?.profiles);
const organizations = readGroup(baseline.data_groups?.organizations);
const relationships = readGroup(baseline.data_groups?.relationships);
const events = readGroup(baseline.data_groups?.events);
const evidence = readGroup(baseline.data_groups?.evidence);

const stablecoinById = new Map(stablecoins.map((row) => [row.id, row]));
const stablecoinBySlug = new Map(stablecoins.map((row) => [normalize(row.slug), row]));
const classificationIds = new Set(classifications.map((row) => row.id));
const profileIds = new Set(profiles.map((row) => row.id));
const organizationIds = new Set(organizations.map((row) => row.id));
const referencedStablecoinIds = new Set([
  ...collectStablecoinReferences(relationships),
  ...collectStablecoinReferences(events),
  ...collectStablecoinReferences(evidence)
]);

const candidateIds = new Map();
const proposedIds = new Map();
const slugs = new Map();
const candidatesByProposedId = new Map();
const symbols = new Map();
const identityOwners = new Map();

for (const candidate of candidates) {
  const candidateId = candidate?.candidate_id ?? '(missing candidate_id)';

  if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) {
    failures.push(`candidate row must be an object: ${JSON.stringify(candidate)}`);
    continue;
  }

  for (const field of requiredFields) {
    if (!(field in candidate)) failures.push(`${candidateId}: missing required field ${field}`);
  }

  if (!/^sog_cand_\d{6}$/.test(candidate.candidate_id ?? '')) failures.push(`${candidateId}: invalid candidate_id format`);
  if (!/^sog_st_[a-z0-9]+$/.test(candidate.proposed_record_id ?? '')) failures.push(`${candidateId}: invalid proposed_record_id format`);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(candidate.slug ?? '')) failures.push(`${candidateId}: invalid slug format`);
  if (!/^batch_\d{3}$/.test(candidate.target_batch ?? '')) failures.push(`${candidateId}: invalid target_batch format`);
  if (!Array.isArray(candidate.aliases)) failures.push(`${candidateId}: aliases must be an array`);
  if (!allowedStatuses.has(candidate.status)) failures.push(`${candidateId}: invalid status ${candidate.status}`);
  if (!allowedPriorities.has(candidate.priority)) failures.push(`${candidateId}: invalid priority ${candidate.priority}`);
  if (!allowedCandidateTypes.has(candidate.candidate_type)) failures.push(`${candidateId}: invalid candidate_type ${candidate.candidate_type}`);
  if (!allowedAssetClasses.has(candidate.asset_class)) failures.push(`${candidateId}: invalid asset_class ${candidate.asset_class}`);
  if (!allowedReferenceKinds.has(candidate.reference_kind)) failures.push(`${candidateId}: invalid reference_kind ${candidate.reference_kind}`);

  registerUnique(candidateIds, candidate.candidate_id, 'candidate_id', candidateId);
  registerUnique(proposedIds, candidate.proposed_record_id, 'proposed_record_id', candidateId);
  registerUnique(slugs, normalize(candidate.slug), 'slug', candidateId);
  candidatesByProposedId.set(candidate.proposed_record_id, candidate);

  const symbolKey = normalize(candidate.symbol);
  if (symbolKey) {
    const owners = symbols.get(symbolKey) ?? new Set();
    owners.add(candidateId);
    symbols.set(symbolKey, owners);
  }

  const rowIdentities = [candidate.name, candidate.symbol, ...(Array.isArray(candidate.aliases) ? candidate.aliases : [])]
    .map(normalize)
    .filter(Boolean);
  const seenInRow = new Set();
  for (const identity of rowIdentities) {
    if (seenInRow.has(identity)) warnings.push(`${candidateId}: repeated name/symbol/alias value ${identity}`);
    seenInRow.add(identity);
    const owners = identityOwners.get(identity) ?? new Set();
    owners.add(candidateId);
    identityOwners.set(identity, owners);
  }

  const existingById = stablecoinById.get(candidate.proposed_record_id);
  const existingBySlug = stablecoinBySlug.get(normalize(candidate.slug));

  if (candidate.status === 'promoted') {
    if (!existingById) failures.push(`${candidateId}: promoted candidate has no canonical record ${candidate.proposed_record_id}`);
    else {
      if (existingById.slug !== candidate.slug) failures.push(`${candidateId}: promoted slug mismatch (${candidate.slug} vs ${existingById.slug})`);
      if (normalize(existingById.name) !== normalize(candidate.name)) failures.push(`${candidateId}: promoted name mismatch (${candidate.name} vs ${existingById.name})`);
      if (normalize(existingById.symbol) !== normalize(candidate.symbol)) failures.push(`${candidateId}: promoted symbol mismatch (${candidate.symbol} vs ${existingById.symbol})`);
    }
    if (!classificationIds.has(candidate.proposed_record_id)) failures.push(`${candidateId}: promoted record lacks Registry v2 classification`);
    if (!profileIds.has(candidate.proposed_record_id)) failures.push(`${candidateId}: promoted record lacks Registry v2 reserve/redemption profile`);
  } else {
    if (existingById) failures.push(`${candidateId}: non-promoted candidate collides with canonical ID ${candidate.proposed_record_id}`);
    if (existingBySlug) failures.push(`${candidateId}: non-promoted candidate collides with canonical slug ${candidate.slug}`);
    if (classificationIds.has(candidate.proposed_record_id)) failures.push(`${candidateId}: non-promoted candidate collides with classification record`);
    if (profileIds.has(candidate.proposed_record_id)) failures.push(`${candidateId}: non-promoted candidate collides with profile record`);
    if (referencedStablecoinIds.has(candidate.proposed_record_id)) failures.push(`${candidateId}: non-promoted candidate ID is already referenced by relationships, events, or evidence`);
  }

  if (organizationIds.has(candidate.proposed_record_id)) failures.push(`${candidateId}: proposed stablecoin ID collides with an organization ID`);
}

for (const stablecoin of stablecoins) {
  const candidate = candidatesByProposedId.get(stablecoin.id);
  if (!candidate) failures.push(`canonical stablecoin missing from candidate master: ${stablecoin.id}`);
  else if (candidate.status !== 'promoted') failures.push(`canonical stablecoin is not marked promoted in candidate master: ${stablecoin.id}`);
}

for (const classificationId of classificationIds) {
  if (!stablecoinById.has(classificationId)) failures.push(`classification references missing canonical stablecoin: ${classificationId}`);
}
for (const profileId of profileIds) {
  if (!stablecoinById.has(profileId)) failures.push(`profile references missing canonical stablecoin: ${profileId}`);
}
for (const referencedId of referencedStablecoinIds) {
  if (!stablecoinById.has(referencedId)) failures.push(`relationship, event, or evidence references missing canonical stablecoin: ${referencedId}`);
}

for (const [symbol, owners] of symbols) {
  if (owners.size > 1) warnings.push(`symbol collision: ${symbol} (${[...owners].join(', ')})`);
}
for (const [identity, owners] of identityOwners) {
  if (owners.size > 1) warnings.push(`name or alias collision: ${identity} (${[...owners].join(', ')})`);
}

if (warnings.length > 0) {
  console.warn('Candidate Stable Asset Master warnings:');
  warnings.forEach((warning) => console.warn(`- ${warning}`));
}

if (failures.length > 0) {
  console.error('Candidate Stable Asset Master validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

const promoted = candidates.filter((row) => row.status === 'promoted').length;
const p0 = candidates.filter((row) => row.priority === 'P0').length;
const pendingP0 = candidates.filter((row) => row.priority === 'P0' && row.status !== 'promoted').length;
console.log('Candidate Stable Asset Master validation passed:');
console.log(`- total candidates: ${candidates.length}`);
console.log(`- promoted: ${promoted}`);
console.log(`- P0 total: ${p0}`);
console.log(`- P0 pending: ${pendingP0}`);
console.log(`- canonical stablecoins scanned: ${stablecoins.length}`);
console.log(`- classifications scanned: ${classifications.length}`);
console.log(`- profiles scanned: ${profiles.length}`);
console.log(`- organizations scanned: ${organizations.length}`);
console.log(`- relationships scanned: ${relationships.length}`);
console.log(`- events scanned: ${events.length}`);
console.log(`- evidence scanned: ${evidence.length}`);
