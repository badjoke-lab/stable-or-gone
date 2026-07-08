import fs from 'node:fs';
import path from 'node:path';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const root = process.cwd();
const failures = [];
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const audit = readJson('data/next-growth-candidate-audit-pr329.json');
const baseline = loadRegistryV2Baseline(root);
const group = (name) => (baseline.data_groups?.[name] ?? []).flatMap(readJson);
const stablecoins = group('stablecoins');
const candidates = audit.candidates ?? [];
const plan = audit.growth_plan ?? [];
const policy = audit.policy ?? {};
const fail = (condition, message) => { if (!condition) failures.push(message); };
const normalize = (value) => String(value ?? '').trim().toLowerCase();

const expectedCandidateIds = Array.from({ length: 10 }, (_, index) => `sog_cand_${String(101 + index).padStart(6, '0')}`);
const expectedPrs = [330, 331, 332, 333, 334];
const expectedTransitions = [
  [100, 102],
  [102, 104],
  [104, 106],
  [106, 108],
  [108, 110]
];
const expectedBatches = ['batch_022', 'batch_023', 'batch_024', 'batch_025', 'batch_026'];

fail(audit.schema_version === '1.0', 'schema_version must be 1.0');
fail(audit.canonical_stablecoin_count_before_growth === 100, 'audit must start from 100 canonical assets');
fail(stablecoins.length === 100, `canonical stablecoin count must remain 100, found ${stablecoins.length}`);
fail(candidates.length === 10, `candidate count must be 10, found ${candidates.length}`);
fail(plan.length === 5, `growth plan must contain five PR allocations, found ${plan.length}`);

const candidateIds = candidates.map((row) => row.candidate_id);
fail(JSON.stringify(candidateIds) === JSON.stringify(expectedCandidateIds), 'candidate IDs must be exactly sog_cand_000101 through sog_cand_000110 in order');
fail(new Set(candidateIds).size === candidates.length, 'candidate IDs must be unique');

const proposedIds = candidates.map((row) => row.proposed_stablecoin_id);
const proposedSlugs = candidates.map((row) => normalize(row.proposed_slug));
fail(new Set(proposedIds).size === candidates.length, 'proposed stablecoin IDs must be unique');
fail(new Set(proposedSlugs).size === candidates.length, 'proposed slugs must be unique');

const canonicalIds = new Set(stablecoins.map((row) => row.id));
const canonicalSlugs = new Set(stablecoins.map((row) => normalize(row.slug)));
for (const row of candidates) {
  const id = row.candidate_id ?? '(missing)';
  fail(/^sog_cand_\d{6}$/.test(row.candidate_id ?? ''), `${id}: invalid candidate_id`);
  fail(/^sog_st_[a-z0-9]+$/.test(row.proposed_stablecoin_id ?? ''), `${id}: invalid proposed_stablecoin_id`);
  fail(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(row.proposed_slug ?? ''), `${id}: invalid proposed_slug`);
  fail(!canonicalIds.has(row.proposed_stablecoin_id), `${id}: proposed stablecoin ID already canonical`);
  fail(!canonicalSlugs.has(normalize(row.proposed_slug)), `${id}: proposed slug already canonical`);

  for (const field of [
    'canonical_name',
    'symbol',
    'proposed_organization_id',
    'organization_name',
    'proposed_status',
    'launch_date_precision',
    'mechanism',
    'stabilization',
    'reserve_applicability',
    'redemption_model',
    'lifecycle_decision',
    'deployment_scope',
    'historical_value',
    'target_growth_pr',
    'target_batch',
    'selection_decision'
  ]) fail(row[field] !== undefined && row[field] !== null && row[field] !== '', `${id}: missing ${field}`);

  fail(Array.isArray(row.aliases), `${id}: aliases must be an array`);
  fail(Array.isArray(row.value_contribution) && row.value_contribution.length >= 1, `${id}: value_contribution must be non-empty`);
  fail(Array.isArray(row.event_plan) && row.event_plan.length >= 1, `${id}: event_plan must be non-empty`);
  fail(Array.isArray(row.blocking_unknowns) && row.blocking_unknowns.length >= 1, `${id}: blocking_unknowns must be non-empty`);
  fail(row.duplicate_review && typeof row.duplicate_review === 'object', `${id}: duplicate_review is required`);
  fail(typeof row.duplicate_review?.decision === 'string' && row.duplicate_review.decision.length > 0, `${id}: duplicate decision is required`);
  fail(Array.isArray(row.evidence_leads) && row.evidence_leads.length >= 3, `${id}: at least three evidence leads are required`);

  for (const [index, lead] of (row.evidence_leads ?? []).entries()) {
    fail(/^https:\/\//.test(lead.url ?? ''), `${id}: evidence lead ${index + 1} must use HTTPS`);
    fail(lead.official === true, `${id}: evidence lead ${index + 1} must be official`);
    fail(typeof lead.publisher === 'string' && lead.publisher.length > 0, `${id}: evidence lead ${index + 1} publisher missing`);
    fail(typeof lead.claim_scope === 'string' && lead.claim_scope.length > 0, `${id}: evidence lead ${index + 1} claim_scope missing`);
  }
}

const planCandidateIds = [];
for (const [index, row] of plan.entries()) {
  fail(row.pr === expectedPrs[index], `growth plan row ${index + 1}: expected PR #${expectedPrs[index]}`);
  fail(row.from_count === expectedTransitions[index][0], `PR #${row.pr}: invalid from_count`);
  fail(row.to_count === expectedTransitions[index][1], `PR #${row.pr}: invalid to_count`);
  fail(Array.isArray(row.candidate_ids) && row.candidate_ids.length === 2, `PR #${row.pr}: exactly two candidates required`);
  for (const id of row.candidate_ids ?? []) planCandidateIds.push(id);
}
fail(JSON.stringify(planCandidateIds) === JSON.stringify(expectedCandidateIds), 'growth plan candidate order must exactly cover 101 through 110');
fail(new Set(planCandidateIds).size === 10, 'growth plan candidates must appear exactly once');

for (const [index, batch] of expectedBatches.entries()) {
  const rows = candidates.filter((row) => row.target_batch === batch);
  fail(rows.length === 2, `${batch}: exactly two candidates required`);
  fail(rows.every((row) => row.target_growth_pr === expectedPrs[index]), `${batch}: target growth PR mismatch`);
}

fail(policy.manual_review_required === true, 'manual review must remain required');
fail(policy.candidate_selection_is_not_canonical_promotion === true, 'candidate selection must not equal canonical promotion');
fail(policy.canonical_write_allowed === false, 'canonical writes must be disabled');
fail(policy.public_output === false, 'public output must be disabled');
fail(policy.production_publication === false, 'production publication must be disabled');

if (failures.length) {
  console.error('PR #329 next-growth candidate audit validation failed:');
  failures.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  canonical_assets: stablecoins.length,
  selected_candidates: candidates.length,
  growth_prs: expectedPrs,
  final_target_count: 110,
  canonical_write_allowed: policy.canonical_write_allowed,
  public_output: policy.public_output
}, null, 2));
