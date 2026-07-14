import fs from 'node:fs';
import path from 'node:path';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const root = process.cwd();
const failures = [];
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const audit = readJson('data/next-growth-candidate-audit-pr329.json');
const checkpoint = readJson('docs/migration/current-canonical-checkpoint.json');
const baseline = loadRegistryV2Baseline(root);
const group = (name) => (baseline.data_groups?.[name] ?? []).flatMap(readJson);
const stablecoins = group('stablecoins');
const rawCandidates = audit.candidates ?? [];
const rawPlan = audit.growth_plan ?? [];
const policy = audit.policy ?? {};
const fail = (condition, message) => { if (!condition) failures.push(message); };
const normalize = (value) => String(value ?? '').trim().toLowerCase();

const correctionFiles = fs.readdirSync(path.join(root, 'data'))
  .filter((name) => /^next-growth-candidate-corrections-pr\d+\.json$/.test(name))
  .sort()
  .map((name) => `data/${name}`);
const corrections = correctionFiles.flatMap(readJson);
const correctionById = new Map();
for (const row of corrections) {
  if (correctionById.has(row.candidate_id)) failures.push(`duplicate candidate correction for ${row.candidate_id}`);
  correctionById.set(row.candidate_id, row);
}

const numberingCorrectionFile = 'data/next-growth-pr-numbering-corrections-pr330.json';
const numberingCorrections = fs.existsSync(path.join(root, numberingCorrectionFile)) ? readJson(numberingCorrectionFile) : [];
const effectivePrByOriginal = new Map(numberingCorrections.map((row) => [row.original_planned_pr, row.actual_target_pr]));
const effectivePr = (value) => effectivePrByOriginal.get(value) ?? value;

const candidates = rawCandidates.map((row) => {
  const identityCorrected = { ...row, ...(correctionById.get(row.candidate_id) ?? {}) };
  return { ...identityCorrected, target_growth_pr: effectivePr(identityCorrected.target_growth_pr) };
});
const plan = rawPlan.map((row) => ({ ...row, pr: effectivePr(row.pr) }));

const promotionFiles = fs.readdirSync(path.join(root, 'data'))
  .filter((name) => /^candidate-promotions-batch-(?:2[2-6])\.json$/.test(name))
  .sort()
  .map((name) => `data/${name}`);
const promotions = promotionFiles.flatMap(readJson);
const promotionById = new Map(promotions.map((row) => [row.candidate_id, row]));

const expectedCandidateIds = Array.from({ length: 10 }, (_, index) => `sog_cand_${String(101 + index).padStart(6, '0')}`);
const expectedPrs = [330, 332, 333, 334, 335];
const expectedTransitions = [[100,102],[102,104],[104,106],[106,108],[108,110]];
const expectedBatches = ['batch_022','batch_023','batch_024','batch_025','batch_026'];
const expectedNumberingCorrections = [
  ['batch_023',331,332],['batch_024',332,333],['batch_025',333,334],['batch_026',334,335]
];

fail(audit.schema_version === '1.0', 'schema_version must be 1.0');
fail(audit.canonical_stablecoin_count_before_growth === 100, 'audit must preserve the 100-asset pre-growth boundary');
fail(candidates.length === 10, `candidate count must be 10, found ${candidates.length}`);
fail(plan.length === 5, `growth plan must contain five PR allocations, found ${plan.length}`);

if (fs.existsSync(path.join(root, numberingCorrectionFile))) {
  fail(numberingCorrections.length === expectedNumberingCorrections.length, `numbering correction count must be ${expectedNumberingCorrections.length}`);
  for (const [index, expected] of expectedNumberingCorrections.entries()) {
    const row = numberingCorrections[index] ?? {};
    const [batch, originalPr, actualPr] = expected;
    fail(row.target_batch === batch, `numbering correction row ${index + 1}: target batch must be ${batch}`);
    fail(row.original_planned_pr === originalPr, `numbering correction row ${index + 1}: original PR must be #${originalPr}`);
    fail(row.actual_target_pr === actualPr, `numbering correction row ${index + 1}: actual PR must be #${actualPr}`);
    fail(typeof row.reason === 'string' && row.reason.length > 0, `numbering correction row ${index + 1}: reason is required`);
  }
}

const candidateIds = candidates.map((row) => row.candidate_id);
fail(JSON.stringify(candidateIds) === JSON.stringify(expectedCandidateIds), 'candidate IDs must be exactly sog_cand_000101 through sog_cand_000110 in order');
fail(new Set(candidateIds).size === candidates.length, 'candidate IDs must be unique');
const proposedIds = candidates.map((row) => row.proposed_stablecoin_id);
const proposedSlugs = candidates.map((row) => normalize(row.proposed_slug));
fail(new Set(proposedIds).size === candidates.length, 'effective proposed stablecoin IDs must be unique');
fail(new Set(proposedSlugs).size === candidates.length, 'effective proposed slugs must be unique');

const canonicalIds = new Set(stablecoins.map((row) => row.id));
const canonicalSlugs = new Set(stablecoins.map((row) => normalize(row.slug)));
for (const row of candidates) {
  const id = row.candidate_id ?? '(missing)';
  const promotion = promotionById.get(row.candidate_id);
  fail(/^sog_cand_\d{6}$/.test(row.candidate_id ?? ''), `${id}: invalid candidate_id`);
  fail(/^sog_st_[a-z0-9]+$/.test(row.proposed_stablecoin_id ?? ''), `${id}: invalid proposed_stablecoin_id`);
  fail(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(row.proposed_slug ?? ''), `${id}: invalid proposed_slug`);
  if (promotion?.status === 'promoted') {
    fail(promotion.promoted_record_id === row.proposed_stablecoin_id, `${id}: promotion target must match effective audited identity`);
    fail(canonicalIds.has(row.proposed_stablecoin_id), `${id}: promoted candidate must exist canonically`);
    fail(canonicalSlugs.has(normalize(row.proposed_slug)), `${id}: promoted candidate slug must exist canonically`);
  } else {
    fail(!canonicalIds.has(row.proposed_stablecoin_id), `${id}: unpromoted candidate ID already canonical`);
    fail(!canonicalSlugs.has(normalize(row.proposed_slug)), `${id}: unpromoted candidate slug already canonical`);
  }
  for (const field of ['canonical_name','symbol','proposed_organization_id','organization_name','proposed_status','launch_date_precision','mechanism','stabilization','reserve_applicability','redemption_model','lifecycle_decision','deployment_scope','historical_value','target_growth_pr','target_batch','selection_decision']) {
    fail(row[field] !== undefined && row[field] !== null && row[field] !== '', `${id}: missing ${field}`);
  }
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
  for (const candidateId of row.candidate_ids ?? []) planCandidateIds.push(candidateId);
}
fail(JSON.stringify(planCandidateIds) === JSON.stringify(expectedCandidateIds), 'growth plan candidate order must exactly cover 101 through 110');
fail(new Set(planCandidateIds).size === 10, 'growth plan candidates must appear exactly once');
for (const [index, batch] of expectedBatches.entries()) {
  const rows = candidates.filter((row) => row.target_batch === batch);
  fail(rows.length === 2, `${batch}: exactly two candidates required`);
  fail(rows.every((row) => row.target_growth_pr === expectedPrs[index]), `${batch}: target growth PR mismatch`);
}
const promotedNextGrowth = promotions.filter((row) => row.status === 'promoted');
const completedPlanCount = audit.canonical_stablecoin_count_before_growth + promotedNextGrowth.length;
fail(promotedNextGrowth.length === 10, `all ten PR #329 candidates must remain promoted; found ${promotedNextGrowth.length}`);
fail(completedPlanCount === 110, `PR #329 growth plan must terminate at 110 assets; found ${completedPlanCount}`);
fail(stablecoins.length === checkpoint.asset_count, `current canonical assets must match the current checkpoint; found ${stablecoins.length} vs ${checkpoint.asset_count}`);
fail(stablecoins.length >= completedPlanCount, `current canonical assets cannot fall below the completed PR #329 plan boundary ${completedPlanCount}`);
fail(policy.manual_review_required === true, 'manual review must remain required');
fail(policy.candidate_selection_is_not_canonical_promotion === true, 'candidate selection must not equal canonical promotion');
fail(policy.canonical_write_allowed === false, 'PR #329 audit policy must preserve canonical write disabled at selection stage');
fail(policy.public_output === false, 'PR #329 audit policy must preserve public output disabled');
fail(policy.production_publication === false, 'PR #329 audit policy must preserve production publication disabled');

if (failures.length) {
  console.error('PR #329 next-growth candidate audit validation failed:');
  failures.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}
console.log(JSON.stringify({ok:true,pre_growth_canonical_assets:audit.canonical_stablecoin_count_before_growth,completed_pr329_plan_assets:completedPlanCount,current_canonical_assets:stablecoins.length,post_pr329_plan_growth_assets:stablecoins.length-completedPlanCount,selected_candidates:candidates.length,promoted_next_growth_candidates:promotedNextGrowth.length,growth_prs:expectedPrs,identity_corrections_applied:corrections.length,numbering_corrections_applied:numberingCorrections.length,canonical_write_allowed_at_selection_stage:policy.canonical_write_allowed,public_output_at_selection_stage:policy.public_output}, null, 2));
