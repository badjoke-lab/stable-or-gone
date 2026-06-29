import fs from 'node:fs';
import path from 'node:path';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const root = process.cwd();
const failures = [];
const fail = (message) => failures.push(message);
const read = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const normalize = (value) => String(value ?? '').normalize('NFKD').toLowerCase().replace(/[^a-z0-9]+/g, '');

const audit = read('data/final-eight-candidate-audit-pr246.json');
const corrections = read('data/final-eight-candidate-corrections-pr247.json');
const controls = read('data/candidate-stable-assets-growth-100.json');
const promotions = read('data/candidate-promotions-batch-18.json');
const baseline = loadRegistryV2Baseline(root);
const group = (name) => (baseline.data_groups?.[name] ?? []).flatMap(read);
const stablecoins = group('stablecoins');
const organizations = group('organizations');
const classifications = group('classifications');
const profiles = group('profiles');
const relationships = group('relationships');
const events = group('events');
const evidence = group('evidence');

const correctionById = new Map(corrections.map((row) => [row.candidate_id, row]));
const candidates = (audit.candidates ?? []).map((row) => ({ ...row, ...(correctionById.get(row.candidate_id) ?? {}) }));
const candidateById = new Map(candidates.map((row) => [row.candidate_id, row]));
const controlById = new Map(controls.map((row) => [row.candidate_id, row]));
const promotionById = new Map(promotions.map((row) => [row.candidate_id, row]));
const stablecoinById = new Map(stablecoins.map((row) => [row.id, row]));
const organizationIds = new Set(organizations.map((row) => row.id));
const classificationIds = new Set(classifications.map((row) => row.id));
const profileIds = new Set(profiles.map((row) => row.id));
const canonicalNames = new Map(stablecoins.map((row) => [normalize(row.name), row.id]));
const canonicalSlugs = new Map(stablecoins.map((row) => [normalize(row.slug), row.id]));

const expectedIds = Array.from({ length: 8 }, (_, index) => `sog_cand_${String(index + 93).padStart(6, '0')}`);
const expectedRecords = ['sog_st_ist','sog_st_nearusn','sog_st_kavausdx','sog_st_bean','sog_st_uxd','sog_st_doc','sog_st_eurm','sog_st_usd3'];
const rejectedCanonicalIds = ['sog_st_dola','sog_st_ousd','sog_st_vai','sog_st_djed','sog_st_honey'];

if (audit.selection_status !== 'corrected_after_canonical_duplicate_audit') fail('selection status must record the corrected duplicate audit');
if ((audit.rejected_duplicate_candidates ?? []).length !== 5) fail('exactly five prior selections must be rejected as canonical duplicates');
for (const id of rejectedCanonicalIds) {
  if (!stablecoinById.has(id)) fail(`rejected duplicate is not canonical: ${id}`);
  if (!(audit.rejected_duplicate_candidates ?? []).some((row) => row.canonical_id === id && row.reason === 'already_canonical')) fail(`rejected duplicate record missing: ${id}`);
}
if (JSON.stringify(candidates.map((row) => row.candidate_id)) !== JSON.stringify(expectedIds)) fail('corrected candidate IDs must be 000093 through 000100');
if (JSON.stringify(candidates.map((row) => row.proposed_stablecoin_id)) !== JSON.stringify(expectedRecords)) fail('corrected candidate record allocation mismatch');
if (controls.length !== 8) fail('corrected candidate control file must contain eight rows');

const seenRecords = new Set();
const seenSlugs = new Set();
const seenOrganizations = new Set();
for (const candidate of candidates) {
  const id = candidate.candidate_id;
  const control = controlById.get(id);
  if (!control) { fail(`${id}: candidate control missing`); continue; }
  if (control.proposed_record_id !== candidate.proposed_stablecoin_id) fail(`${id}: proposed record mismatch`);
  if (control.slug !== candidate.proposed_slug) fail(`${id}: slug mismatch`);
  if (normalize(control.name) !== normalize(candidate.canonical_name)) fail(`${id}: canonical name mismatch`);
  if (normalize(control.symbol) !== normalize(candidate.symbol)) fail(`${id}: symbol mismatch`);
  if (seenRecords.has(candidate.proposed_stablecoin_id)) fail(`${id}: duplicate proposed record id`);
  if (seenSlugs.has(normalize(candidate.proposed_slug))) fail(`${id}: duplicate proposed slug`);
  if (seenOrganizations.has(candidate.proposed_organization_id)) fail(`${id}: organization reused by multiple selected assets`);
  seenRecords.add(candidate.proposed_stablecoin_id);
  seenSlugs.add(normalize(candidate.proposed_slug));
  seenOrganizations.add(candidate.proposed_organization_id);
  if (!Array.isArray(candidate.evidence_leads) || candidate.evidence_leads.length < 3) fail(`${id}: at least three official evidence leads required`);
  for (const lead of candidate.evidence_leads ?? []) {
    try { if (new URL(lead.url).protocol !== 'https:') fail(`${id}: evidence lead must use HTTPS`); }
    catch { fail(`${id}: invalid evidence URL ${lead.url}`); }
    if (lead.official !== true) fail(`${id}: evidence lead must be official`);
  }
  if (!Array.isArray(candidate.blocking_unknowns) || candidate.blocking_unknowns.length < 2) fail(`${id}: blocking unknowns must remain explicit`);
  if (![247,248,249,250].includes(candidate.target_growth_pr)) fail(`${id}: invalid target growth PR`);

  const canonical = stablecoinById.get(candidate.proposed_stablecoin_id);
  if (candidate.target_growth_pr === 247) {
    if (!canonical) fail(`${id}: Growth A candidate must now be canonical`);
    if (promotionById.get(id)?.status !== 'promoted') fail(`${id}: Growth A promotion patch missing`);
    if (!classificationIds.has(candidate.proposed_stablecoin_id)) fail(`${id}: classification missing`);
    if (!profileIds.has(candidate.proposed_stablecoin_id)) fail(`${id}: profile missing`);
    if (!organizationIds.has(candidate.proposed_organization_id)) fail(`${id}: selected organization missing`);
  } else {
    if (canonical) fail(`${id}: later growth candidate must remain non-canonical`);
    if (canonicalNames.has(normalize(candidate.canonical_name))) fail(`${id}: later candidate name collides with canonical data`);
    if (canonicalSlugs.has(normalize(candidate.proposed_slug))) fail(`${id}: later candidate slug collides with canonical data`);
  }
}

if (candidateById.get('sog_cand_000093')?.proposed_status !== 'discontinued') fail('IST candidate must be corrected to discontinued');
if (candidateById.get('sog_cand_000093')?.proposed_organization_id !== 'sog_issuer_inter_protocol') fail('IST candidate must target Inter Protocol');
if (candidateById.get('sog_cand_000093')?.launch_date !== '2022-10-27') fail('IST launch date correction missing');
if (candidateById.get('sog_cand_000094')?.proposed_status !== 'discontinued') fail('USN candidate must remain discontinued');
if (stablecoins.length !== 94) fail(`Growth A must produce 94 canonical stablecoins, found ${stablecoins.length}`);

for (const stablecoinId of ['sog_st_ist','sog_st_nearusn']) {
  if (!relationships.some((row) => row.stablecoin_id === stablecoinId)) fail(`${stablecoinId}: relationship missing`);
  if (!events.some((row) => row.stablecoin_id === stablecoinId)) fail(`${stablecoinId}: event missing`);
  if (!evidence.some((row) => row.stablecoin_id === stablecoinId || row.stablecoin_ids?.includes(stablecoinId))) fail(`${stablecoinId}: evidence missing`);
}

if (failures.length) {
  console.error('Corrected final-eight candidate audit validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log('Corrected final-eight audit valid: five canonical duplicates rejected, IST and USN promoted, six candidates remain for PR #248-#250.');
