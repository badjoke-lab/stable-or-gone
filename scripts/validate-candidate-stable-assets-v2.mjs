import fs from 'node:fs';
import path from 'node:path';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const root = process.cwd();
const failures = [];
const warnings = [];
const read = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const baseline = loadRegistryV2Baseline(root);
const growthContract = read('docs/growth/candidate-master-70.json');
const candidateFiles = growthContract.candidate_files ?? ['data/candidate-stable-assets.json'];
const master = candidateFiles.flatMap((file) => { const rows = read(file); if (!Array.isArray(rows)) { failures.push(`${file}: expected array`); return []; } return rows; });
const promotionFiles = fs.readdirSync(path.join(root, 'data')).filter((name) => /^candidate-promotions-batch-[a-z0-9-]+\.json$/.test(name)).sort().map((name) => `data/${name}`);
const patches = new Map();
for (const file of promotionFiles) {
  const rows = read(file);
  if (!Array.isArray(rows)) { failures.push(`${file}: expected array`); continue; }
  for (const row of rows) { if (!row.candidate_id) failures.push(`${file}: missing candidate_id`); if (patches.has(row.candidate_id)) failures.push(`duplicate promotion patch: ${row.candidate_id}`); patches.set(row.candidate_id, row); }
}
const candidates = master.map((row) => ({ ...row, ...(patches.get(row.candidate_id) ?? {}) }));
for (const id of patches.keys()) if (!master.some((row) => row.candidate_id === id)) failures.push(`promotion references missing candidate: ${id}`);
const group = (name) => (baseline.data_groups?.[name] ?? []).flatMap(read);
const stablecoins = group('stablecoins');
const classifications = group('classifications');
const profiles = group('profiles');
const organizations = group('organizations');
const relationships = group('relationships');
const events = group('events');
const evidence = group('evidence');
const allowedStatus = new Set(['candidate','accepted','promoted','duplicate','excluded','watchlist','needs_review']);
const allowedPriority = new Set(['P0','P1','P2','P3','P4','PX']);
const allowedType = new Set(['stablecoin','stable_value_asset','stablecoin_adjacent','tokenized_commodity','experimental_stabilization_asset','reserve_asset','unknown']);
const allowedClass = new Set(['stablecoin','stable_value_asset','stablecoin_adjacent','tokenized_commodity','yield_bearing_stable_receipt','experimental_stabilization_asset','reserve_asset','unknown']);
const allowedReference = new Set(['fiat','commodity','crypto_asset','index','floating','other','unknown']);
const normalize = (value) => String(value ?? '').trim().toLowerCase();
const stablecoinById = new Map(stablecoins.map((row) => [row.id, row]));
const stablecoinBySlug = new Map(stablecoins.map((row) => [normalize(row.slug), row]));
const classificationIds = new Set(classifications.map((row) => row.id));
const profileIds = new Set(profiles.map((row) => row.id));
const organizationIds = new Set(organizations.map((row) => [row.id, row]));
const candidateByRecordId = new Map();
const seenCandidateIds = new Set();
const seenRecordIds = new Set();
const seenSlugs = new Set();
const referencedIds = new Set();
for (const row of [...relationships, ...events, ...evidence]) { if (row.stablecoin_id) referencedIds.add(row.stablecoin_id); for (const field of ['stablecoin_ids','subject_stablecoin_ids']) for (const id of row[field] ?? []) referencedIds.add(id); }
for (const candidate of candidates) {
  const id = candidate.candidate_id ?? '(missing)';
  if (!/^sog_cand_\d{6}$/.test(candidate.candidate_id ?? '')) failures.push(`${id}: invalid candidate_id`);
  if (!/^sog_st_[a-z0-9]+(?:_[a-z0-9]+)*$/.test(candidate.proposed_record_id ?? '')) failures.push(`${id}: invalid proposed_record_id`);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(candidate.slug ?? '')) failures.push(`${id}: invalid slug`);
  if (!/^batch_\d{3}$/.test(candidate.target_batch ?? '')) failures.push(`${id}: invalid target_batch`);
  if (!Array.isArray(candidate.aliases)) failures.push(`${id}: aliases must be an array`);
  if (!allowedStatus.has(candidate.status)) failures.push(`${id}: invalid status ${candidate.status}`);
  if (!allowedPriority.has(candidate.priority)) failures.push(`${id}: invalid priority ${candidate.priority}`);
  if (!allowedType.has(candidate.candidate_type)) failures.push(`${id}: invalid candidate_type ${candidate.candidate_type}`);
  if (!allowedClass.has(candidate.asset_class)) failures.push(`${id}: invalid asset_class ${candidate.asset_class}`);
  if (!allowedReference.has(candidate.reference_kind)) failures.push(`${id}: invalid reference_kind ${candidate.reference_kind}`);
  if (seenCandidateIds.has(candidate.candidate_id)) failures.push(`duplicate candidate_id: ${candidate.candidate_id}`); seenCandidateIds.add(candidate.candidate_id);
  if (seenRecordIds.has(candidate.proposed_record_id)) failures.push(`duplicate proposed_record_id: ${candidate.proposed_record_id}`); seenRecordIds.add(candidate.proposed_record_id);
  const slug = normalize(candidate.slug); if (seenSlugs.has(slug)) failures.push(`duplicate slug: ${slug}`); seenSlugs.add(slug); candidateByRecordId.set(candidate.proposed_record_id, candidate);
  const canonical = stablecoinById.get(candidate.proposed_record_id); const canonicalBySlug = stablecoinBySlug.get(slug);
  if (candidate.status === 'promoted') {
    if (!canonical) failures.push(`${id}: promoted candidate lacks canonical record`);
    else { if (canonical.slug !== candidate.slug) failures.push(`${id}: canonical slug mismatch`); if (normalize(canonical.name) !== normalize(candidate.name)) failures.push(`${id}: canonical name mismatch (${candidate.name} vs ${canonical.name})`); if (normalize(canonical.symbol) !== normalize(candidate.symbol)) failures.push(`${id}: canonical symbol mismatch`); }
    if (!classificationIds.has(candidate.proposed_record_id)) failures.push(`${id}: missing classification`);
    if (!profileIds.has(candidate.proposed_record_id)) failures.push(`${id}: missing profile`);
  } else if (canonical || canonicalBySlug || classificationIds.has(candidate.proposed_record_id) || profileIds.has(candidate.proposed_record_id) || referencedIds.has(candidate.proposed_record_id)) failures.push(`${id}: non-promoted candidate collides with canonical data`);
  if (organizationIds.has(candidate.proposed_record_id)) failures.push(`${id}: proposed stablecoin ID collides with organization ID`);
}
for (const stablecoin of stablecoins) { const candidate = candidateByRecordId.get(stablecoin.id); if (!candidate) failures.push(`canonical stablecoin missing from candidate controls: ${stablecoin.id}`); else if (candidate.status !== 'promoted') failures.push(`canonical stablecoin not effectively promoted: ${stablecoin.id}`); }
for (const id of referencedIds) if (!stablecoinById.has(id)) failures.push(`relationship, event, or evidence references missing stablecoin: ${id}`);
const promoted = candidates.filter((row) => row.status === 'promoted').length;
const pending = candidates.length - promoted;
const minimums = growthContract.protected_minimums ?? {};
if (candidates.length < (minimums.total_candidates ?? 0)) failures.push(`candidate master must contain at least ${minimums.total_candidates} rows, found ${candidates.length}`);
if (promoted < (minimums.promoted_candidates ?? 0)) failures.push(`candidate master must retain at least ${minimums.promoted_candidates} promoted rows, found ${promoted}`);
if (pending < (minimums.pending_candidates ?? 0)) failures.push(`candidate master must retain at least ${minimums.pending_candidates} pending rows, found ${pending}`);
for (const [batch, rule] of Object.entries(growthContract.planned_batches ?? {})) { const actual = candidates.filter((row) => row.target_batch === batch).length; const minimum = rule.minimum_candidates ?? 0; if (actual < minimum) failures.push(`${batch} must contain at least ${minimum} candidates, found ${actual}`); }
if (warnings.length) warnings.forEach((warning) => console.warn(`warning: ${warning}`));
if (failures.length) { console.error('Candidate Stable Asset validation failed:'); failures.forEach((failure) => console.error(`- ${failure}`)); process.exit(1); }
const pendingP0 = candidates.filter((row) => row.priority === 'P0' && row.status !== 'promoted').length;
console.log(`Candidate Stable Asset validation passed: ${candidates.length} candidates, ${promoted} promoted, ${pending} pending, ${pendingP0} P0 pending, ${stablecoins.length} canonical stablecoins.`);
