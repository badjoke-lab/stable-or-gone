import fs from 'node:fs';
import path from 'node:path';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const root = process.cwd();
const failures = [];
const read = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const normalize = (value) => String(value ?? '').normalize('NFKD').toLowerCase().replace(/[^a-z0-9]+/g, '');
const audit = read('data/final-eight-candidate-audit-pr246.json');
const corrections = read('data/final-eight-candidate-corrections-pr247.json');
const controls = read('data/candidate-stable-assets-growth-100.json');
const promotions = [...read('data/candidate-promotions-batch-18.json'), ...read('data/candidate-promotions-batch-19.json'), ...read('data/candidate-promotions-batch-20.json')];
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
const controlById = new Map(controls.map((row) => [row.candidate_id, row]));
const promotionById = new Map(promotions.map((row) => [row.candidate_id, row]));
const stablecoinById = new Map(stablecoins.map((row) => [row.id, row]));
const organizationIds = new Set(organizations.map((row) => row.id));
const classificationIds = new Set(classifications.map((row) => row.id));
const profileIds = new Set(profiles.map((row) => row.id));
const canonicalNames = new Set(stablecoins.map((row) => normalize(row.name)));
const canonicalSlugs = new Set(stablecoins.map((row) => normalize(row.slug)));
const expectedIds = Array.from({ length: 8 }, (_, index) => `sog_cand_${String(index + 93).padStart(6, '0')}`);
const expectedRecords = ['sog_st_ist','sog_st_nearusn','sog_st_kavausdx','sog_st_bean','sog_st_uxd','sog_st_doc','sog_st_eurm','sog_st_usd3'];
const rejected = ['sog_st_dola','sog_st_ousd','sog_st_vai','sog_st_djed','sog_st_honey'];
const fail = (condition, message) => { if (!condition) failures.push(message); };

fail(audit.selection_status === 'corrected_after_canonical_duplicate_audit', 'corrected selection status missing');
fail((audit.rejected_duplicate_candidates ?? []).length === 5, 'five rejected duplicates required');
for (const id of rejected) fail(stablecoinById.has(id), `rejected duplicate is not canonical: ${id}`);
fail(JSON.stringify(candidates.map((row) => row.candidate_id)) === JSON.stringify(expectedIds), 'candidate id allocation mismatch');
fail(JSON.stringify(candidates.map((row) => row.proposed_stablecoin_id)) === JSON.stringify(expectedRecords), 'candidate record allocation mismatch');
fail(controls.length === 8, 'candidate control count must be eight');

const seenRecords = new Set();
const seenSlugs = new Set();
const seenOrganizations = new Set();
for (const candidate of candidates) {
  const id = candidate.candidate_id;
  const control = controlById.get(id);
  fail(Boolean(control), `${id}: control missing`);
  if (!control) continue;
  fail(control.proposed_record_id === candidate.proposed_stablecoin_id, `${id}: record mismatch`);
  fail(control.slug === candidate.proposed_slug, `${id}: slug mismatch`);
  fail(normalize(control.name) === normalize(candidate.canonical_name), `${id}: name mismatch`);
  fail(normalize(control.symbol) === normalize(candidate.symbol), `${id}: symbol mismatch`);
  fail(!seenRecords.has(candidate.proposed_stablecoin_id), `${id}: duplicate proposed record`);
  fail(!seenSlugs.has(normalize(candidate.proposed_slug)), `${id}: duplicate proposed slug`);
  fail(!seenOrganizations.has(candidate.proposed_organization_id), `${id}: organization reused`);
  seenRecords.add(candidate.proposed_stablecoin_id);
  seenSlugs.add(normalize(candidate.proposed_slug));
  seenOrganizations.add(candidate.proposed_organization_id);
  fail(Array.isArray(candidate.evidence_leads) && candidate.evidence_leads.length >= 3, `${id}: official evidence leads missing`);
  for (const lead of candidate.evidence_leads ?? []) {
    try { fail(new URL(lead.url).protocol === 'https:', `${id}: evidence URL must use HTTPS`); }
    catch { failures.push(`${id}: invalid evidence URL`); }
    fail(lead.official === true, `${id}: evidence lead must be official`);
  }
  fail(Array.isArray(candidate.blocking_unknowns) && candidate.blocking_unknowns.length >= 2, `${id}: open items missing`);
  const canonical = stablecoinById.get(candidate.proposed_stablecoin_id);
  if (candidate.target_growth_pr <= 250) {
    fail(Boolean(canonical), `${id}: promoted candidate missing`);
    fail(promotionById.get(id)?.status === 'promoted', `${id}: promotion row missing`);
    fail(classificationIds.has(candidate.proposed_stablecoin_id), `${id}: classification missing`);
    fail(profileIds.has(candidate.proposed_stablecoin_id), `${id}: profile missing`);
    fail(organizationIds.has(candidate.proposed_organization_id), `${id}: organization missing`);
  } else {
    fail(!canonical, `${id}: later candidate is already canonical`);
    fail(!canonicalNames.has(normalize(candidate.canonical_name)), `${id}: later name collision`);
    fail(!canonicalSlugs.has(normalize(candidate.proposed_slug)), `${id}: later slug collision`);
  }
}

fail(stablecoins.length === 98, `expected 98 canonical stablecoins, found ${stablecoins.length}`);
for (const id of ['sog_st_ist','sog_st_nearusn','sog_st_kavausdx','sog_st_bean','sog_st_uxd','sog_st_doc']) {
  fail(relationships.some((row) => row.stablecoin_id === id), `${id}: relationship missing`);
  fail(events.some((row) => row.stablecoin_id === id), `${id}: event missing`);
  fail(evidence.some((row) => row.stablecoin_id === id || row.stablecoin_ids?.includes(id)), `${id}: evidence missing`);
}

if (failures.length) {
  console.error('Current final-eight validation failed:');
  failures.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}
console.log('Current final-eight validation passed: six records promoted through Growth C and two remain.');
