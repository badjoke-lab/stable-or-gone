import fs from 'node:fs';
import path from 'node:path';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const root = process.cwd();
const failures = [];
const fail = (message) => failures.push(message);
const audit = JSON.parse(fs.readFileSync('data/final-eight-candidate-audit-pr246.json', 'utf8'));
const spec = fs.readFileSync('docs/quality/final-eight-candidate-audit-spec.md', 'utf8');

function readRows(relativePath) {
  const value = JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
  return Array.isArray(value) ? value : value.records ?? [];
}

function loadGroup(baseline, group) {
  return (baseline.data_groups?.[group] ?? []).flatMap(readRows);
}

function normalize(value) {
  return String(value ?? '')
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '');
}

function hasDuplicates(values) {
  return new Set(values).size !== values.length;
}

function dateMatchesPrecision(value, precision) {
  if (precision === 'unknown') return value === null;
  if (precision === 'year') return /^\d{4}$/.test(value ?? '');
  if (precision === 'month') return /^\d{4}-(0[1-9]|1[0-2])$/.test(value ?? '');
  if (precision === 'day') return /^\d{4}-(0[1-9]|1[0-2])-([0-2]\d|3[01])$/.test(value ?? '');
  return false;
}

const registry = loadRegistryV2Baseline(root);
const stablecoins = loadGroup(registry, 'stablecoins');
const canonicalIds = new Set(stablecoins.map((row) => row.id));
const canonicalSlugs = new Set(stablecoins.map((row) => normalize(row.slug)));
const canonicalSymbols = new Set(stablecoins.map((row) => normalize(row.symbol)));
const canonicalNamesAndAliases = new Set(stablecoins.flatMap((row) => [row.name, ...(row.aliases ?? [])]).map(normalize).filter(Boolean));

if (stablecoins.length !== 92) fail(`canonical stablecoin count must remain 92, found ${stablecoins.length}`);
if (audit.schema_version !== '1.0') fail('schema_version must be 1.0');
if (audit.audit_id !== 'sog_final_eight_candidate_audit_pr246') fail('audit_id mismatch');
if (audit.canonical_stablecoin_count_before_growth !== 92) fail('audit must record canonical baseline count 92');
if (audit.selection_status !== 'accepted_for_four_reviewed_growth_prs') fail('selection_status mismatch');
if (!Array.isArray(audit.candidates) || audit.candidates.length !== 8) fail('exactly eight candidates are required');
if (!Array.isArray(audit.growth_plan) || audit.growth_plan.length !== 4) fail('exactly four growth plan rows are required');

const candidates = audit.candidates ?? [];
const expectedCandidateIds = Array.from({ length: 8 }, (_, index) => `sog_cand_${String(index + 93).padStart(6, '0')}`);
const candidateIds = candidates.map((row) => row.candidate_id);
if (JSON.stringify(candidateIds) !== JSON.stringify(expectedCandidateIds)) fail('candidate IDs must be sequential 000093 through 000100');

for (const [field, values] of Object.entries({
  candidate_id: candidates.map((row) => row.candidate_id),
  proposed_stablecoin_id: candidates.map((row) => row.proposed_stablecoin_id),
  proposed_slug: candidates.map((row) => normalize(row.proposed_slug)),
  canonical_name: candidates.map((row) => normalize(row.canonical_name)),
  symbol: candidates.map((row) => normalize(row.symbol)),
  proposed_organization_id: candidates.map((row) => row.proposed_organization_id)
})) {
  if (hasDuplicates(values)) fail(`candidate field must be unique: ${field}`);
}

const expectedDisambiguation = {
  IST: ['sog_st_ist', 'agoric-ist'],
  USN: ['sog_st_nearusn', 'near-usn'],
  VAI: ['sog_st_vai', 'venus-vai'],
  USDX: ['sog_st_kavausdx', 'kava-usdx'],
  HONEY: ['sog_st_berahoney', 'berachain-honey']
};

for (const candidate of candidates) {
  const id = candidate.candidate_id ?? 'unknown';
  const requiredStrings = [
    'proposed_stablecoin_id', 'proposed_slug', 'canonical_name', 'symbol',
    'proposed_organization_id', 'organization_name', 'proposed_status',
    'launch_date_precision', 'mechanism', 'stabilization', 'reserve_applicability',
    'redemption_model', 'lifecycle_decision', 'deployment_scope',
    'historical_value', 'selection_decision'
  ];
  for (const field of requiredStrings) if (!String(candidate[field] ?? '').trim()) fail(`${id}: required field missing: ${field}`);

  if (canonicalIds.has(candidate.proposed_stablecoin_id)) fail(`${id}: proposed stablecoin ID already exists canonically`);
  if (canonicalSlugs.has(normalize(candidate.proposed_slug))) fail(`${id}: proposed slug already exists canonically`);
  if (canonicalNamesAndAliases.has(normalize(candidate.canonical_name))) fail(`${id}: proposed name already exists canonically`);
  for (const alias of candidate.aliases ?? []) if (canonicalNamesAndAliases.has(normalize(alias))) fail(`${id}: alias already exists canonically: ${alias}`);
  if (canonicalSymbols.has(normalize(candidate.symbol))) fail(`${id}: proposed symbol already exists canonically: ${candidate.symbol}`);

  if (!['active', 'discontinued'].includes(candidate.proposed_status)) fail(`${id}: proposed status must be active or discontinued`);
  if (candidate.symbol === 'USN' ? candidate.proposed_status !== 'discontinued' : candidate.proposed_status !== 'active') fail(`${id}: proposed status does not match selection boundary`);
  if (!dateMatchesPrecision(candidate.launch_date, candidate.launch_date_precision)) fail(`${id}: launch date does not match declared precision`);

  if (!Array.isArray(candidate.value_contribution) || candidate.value_contribution.length < 2) fail(`${id}: at least two value-contribution tags are required`);
  if (!Array.isArray(candidate.event_plan) || candidate.event_plan.length < 2) fail(`${id}: event plan must contain at least two items`);
  if (!Array.isArray(candidate.blocking_unknowns) || candidate.blocking_unknowns.length < 2) fail(`${id}: blocking unknowns must remain explicit`);
  if (!Array.isArray(candidate.evidence_leads) || candidate.evidence_leads.length < 3) fail(`${id}: at least three official evidence leads are required`);

  const evidenceUrls = [];
  for (const lead of candidate.evidence_leads ?? []) {
    try {
      const parsed = new URL(lead.url);
      if (parsed.protocol !== 'https:') fail(`${id}: evidence lead must use HTTPS: ${lead.url}`);
    } catch {
      fail(`${id}: invalid evidence URL: ${lead.url}`);
    }
    evidenceUrls.push(lead.url);
    if (lead.official !== true) fail(`${id}: every evidence lead must be marked official`);
    if (!String(lead.publisher ?? '').trim() || !String(lead.claim_scope ?? '').trim()) fail(`${id}: evidence publisher and claim scope are required`);
  }
  if (hasDuplicates(evidenceUrls)) fail(`${id}: evidence lead URLs must be distinct within a candidate`);

  const duplicateReview = candidate.duplicate_review ?? {};
  for (const field of ['name_match', 'slug_match', 'symbol_match', 'id_match']) if (duplicateReview[field] !== false) fail(`${id}: duplicate review ${field} must be false`);
  if (!String(duplicateReview.decision ?? '').startsWith('new_identity')) fail(`${id}: duplicate decision must preserve new-identity result`);
  if (![247, 248, 249, 250].includes(candidate.target_growth_pr)) fail(`${id}: invalid target growth PR`);
  if (candidate.selection_decision !== 'selected') fail(`${id}: selection decision must be selected`);

  if (expectedDisambiguation[candidate.symbol]) {
    const [expectedId, expectedSlug] = expectedDisambiguation[candidate.symbol];
    if (candidate.proposed_stablecoin_id !== expectedId || candidate.proposed_slug !== expectedSlug) fail(`${id}: generic symbol disambiguation mismatch`);
  }
}

const expectedPlans = [
  { pr: 247, from_count: 92, to_count: 94, candidate_ids: ['sog_cand_000093', 'sog_cand_000094'] },
  { pr: 248, from_count: 94, to_count: 96, candidate_ids: ['sog_cand_000095', 'sog_cand_000096'] },
  { pr: 249, from_count: 96, to_count: 98, candidate_ids: ['sog_cand_000097', 'sog_cand_000098'] },
  { pr: 250, from_count: 98, to_count: 100, candidate_ids: ['sog_cand_000099', 'sog_cand_000100'] }
];
if (JSON.stringify(audit.growth_plan) !== JSON.stringify(expectedPlans)) fail('growth allocation must be continuous with exactly two candidates per PR');
for (const candidate of candidates) {
  const plan = audit.growth_plan.find((row) => row.pr === candidate.target_growth_pr);
  if (!plan?.candidate_ids.includes(candidate.candidate_id)) fail(`${candidate.candidate_id}: target PR and growth plan mismatch`);
}

const requiredDiversity = new Set([
  'long_running_defi', 'yield_bearing_history', 'cosmos_coverage',
  'historical_failure', 'bnb_chain_coverage', 'cardano_coverage',
  'non_evm_native_asset', 'new_chain_coverage'
]);
const diversityTags = new Set(candidates.flatMap((row) => row.value_contribution ?? []));
for (const tag of requiredDiversity) if (!diversityTags.has(tag)) fail(`required diversity tag missing: ${tag}`);

const expectedPolicy = {
  manual_review_required: true,
  candidate_selection_is_not_canonical_promotion: true,
  canonical_write_allowed: false,
  public_output: false,
  production_publication: false
};
for (const [key, expected] of Object.entries(expectedPolicy)) if (audit.policy?.[key] !== expected) fail(`policy.${key} must be ${expected}`);

for (const phrase of [
  'selects the eight candidates for reviewed growth from 92 to 100 stable assets',
  'PR #247 92 -> 94: DOLA, OUSD',
  'PR #250 98 -> 100: USDX, HONEY',
  'Selection is a research decision only',
  'No single organization may supply more than one selected asset',
  'candidate_selection_is_not_canonical_promotion: true',
  'No production deployment required'
]) if (!spec.includes(phrase)) fail(`PR #246 specification missing: ${phrase}`);

if (failures.length) {
  console.error('PR #246 final-eight candidate audit validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log('PR #246 final-eight audit valid: eight non-canonical candidates allocated two each across PR #247 through PR #250.');
