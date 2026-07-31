import fs from 'node:fs';

await import('./validate-record-growth-batch-4-candidate-audit-pr496.mjs');

const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const text = (file) => fs.readFileSync(file, 'utf8');
const ok = (condition, message) => { if (!condition) throw new Error(message); };
const sorted = (values) => [...values].sort().join('|');

const config = read('config/record-growth-batch-4-review-gate-pr497.json');
const report = read('docs/migration/record-growth-batch-4-review-gate-pr497.json');
const audit = read('data/editorial-research/record-growth-batch-4-candidate-audit-pr496.json');
const handoff = read('docs/migration/record-growth-batch-4-candidate-audit-pr496-handoff.json');
const spec = text('docs/quality/record-growth-batch-4-review-gate-pr497-spec.md');
const amendment = text('docs/roadmap-amendments/2026-07-31-record-growth-batch-4-review-gate.md');
const agents = text('AGENTS.md');
const roadmap = text('docs/roadmap.md');
const governance = text('docs/spec-governance.md');

const baseline = {
  stable_assets: 116,
  organizations: 107,
  relationships: 128,
  events: 191,
  evidence: 571,
  evidence_relations: 571,
  deployments: 182,
  market_access_records: 8,
  archive_recorded: 442,
  archive_not_recorded: 129,
  detail_routes: 414
};

ok(config.schema_version === '1.0', 'config schema mismatch');
ok(config.work_item === 'record_growth_batch_4_review_gate_pr497', 'config work item mismatch');
ok(config.status === 'reviewed_decision', 'config status mismatch');
ok(sorted(config.source_prs) === sorted([467, 492, 493, 495, 496]), 'config source PR lineage mismatch');
for (const [field, value] of Object.entries(baseline)) ok(config.canonical_baseline[field] === value, `config baseline mismatch: ${field}`);

ok(config.reviewed_candidates.authorized.length === 1, 'authorized candidate count must be one');
ok(config.reviewed_candidates.authorized[0].candidate_id === 'sog_cand_pr496_mnee', 'MNEE is not the sole authorized candidate');
ok(config.reviewed_candidates.authorized[0].authorization === 'complete_record_implementation_only', 'MNEE authorization boundary mismatch');
ok(config.reviewed_candidates.deferred.length === 1, 'deferred candidate count must be one');
ok(config.reviewed_candidates.deferred[0].candidate_id === 'sog_cand_pr496_ylds', 'YLDS is not the deferred candidate');

ok(config.decision.authorize_next_pr === 498, 'next PR must be #498');
ok(config.decision.authorize_work_item === 'Record Growth Batch 4 — MNEE', 'authorized work item mismatch');
ok(sorted(config.decision.selected_candidate_ids) === 'sog_cand_pr496_mnee', 'selected candidate set mismatch');
ok(config.decision.maximum_new_canonical_assets === 1, 'maximum additions must be one');
ok(config.decision.replacement_candidate_allowed === false, 'replacement candidate must be prohibited');
ok(config.decision.review_gate_after_pr498 === true, 'review gate after PR #498 missing');
ok(config.decision.canonical_changes_in_pr497 === 0, 'PR #497 canonical changes must be zero');
ok(config.decision.public_changes_in_pr497 === 0, 'PR #497 public changes must be zero');
for (const field of ['ranking','score','recommendation','automatic_promotion','automatic_canonical_pr_creation']) ok(config.decision[field] === false, `config boundary changed: ${field}`);

const requiredSelectionBasis = [
  'official_legal_issuer_terms',
  'explicit_one_to_one_reserve_backing_terms',
  'direct_verified_customer_issuance_and_redemption_terms',
  'published_fee_and_minimum_terms',
  'current_monthly_attestation_series',
  'official_multichain_technical_documentation',
  'complete_record_feasible_with_explicit_known_unknowns',
  'lower_scope_and_maintenance_risk_than_ylds'
];
for (const item of requiredSelectionBasis) ok(config.selection_basis.includes(item), `selection basis missing: ${item}`);

const entry = config.pr498_entry_gate;
for (const field of [
  'complete_record_only',
  'thin_record_forbidden',
  'fresh_duplicate_recheck_required',
  'fresh_manual_primary_source_review_required',
  'exact_contract_or_inscription_identity_confirmation_required',
  'first_public_issuance_date_review_required',
  'current_reserve_composition_and_custodian_review_required',
  'attestation_series_archive_review_required',
  'current_issuance_redemption_fee_and_minimum_review_required',
  'unsupported_values_must_remain_known_unknowns',
  'unconfirmed_candidate_must_be_withheld'
]) ok(entry[field] === true, `PR #498 entry gate missing: ${field}`);
ok(entry.replacement_candidate_allowed === false, 'PR #498 replacement candidate must be false');
ok(entry.required_record_families.includes('stablecoins'), 'stablecoins record family missing');
ok(entry.required_record_families.includes('evidence'), 'Evidence record family missing');
ok(entry.required_record_families.includes('deployments'), 'deployments record family missing');
ok(entry.required_record_families.includes('legal_profiles'), 'legal profiles record family missing');
ok(entry.required_record_families.includes('income_profiles'), 'income profiles record family missing');
ok(entry.public_surface_change === false && entry.market_access_change === false && entry.ui_change === false, 'PR #498 protected boundary changed');

ok(config.ylds_boundary.canonical_promotion_authorized === false, 'YLDS promotion incorrectly authorized');
ok(config.ylds_boundary.full_record_pr_authorized === false, 'YLDS full-record PR incorrectly authorized');
ok(config.ylds_boundary.ordinary_stablecoin_treatment_forbidden === true, 'YLDS ordinary stablecoin treatment must be forbidden');
ok(config.ylds_boundary.separate_scope_amendment_required === true, 'YLDS separate scope amendment missing');
for (const item of [
  'registered_security_scope',
  'face_amount_certificate_unit_semantics',
  'yield_and_interest_semantics',
  'issuer_credit_and_asset_backing_risk',
  'securities_eligibility_and_transfer_restrictions',
  'chain_and_wrapper_identity',
  'maintenance_burden'
]) ok(config.ylds_boundary.required_future_review.includes(item), `YLDS future review item missing: ${item}`);

ok(report.status === 'reviewed_decision', 'report status mismatch');
ok(report.source_pr === 496, 'report source PR mismatch');
for (const [field, value] of Object.entries(baseline)) ok(report.canonical_state[field] === value, `report baseline mismatch: ${field}`);
ok(report.canonical_state.changed_by_pr497 === false, 'report canonical state changed');
ok(report.reviewed_findings.pr496_reviewed_candidates === 8, 'report PR #496 candidate count mismatch');
ok(report.reviewed_findings.pr496_ready_for_full_record_review === 2, 'report PR #496 ready count mismatch');
ok(report.reviewed_findings.selected_for_next_complete_record_pr === 1, 'report selected count mismatch');
ok(report.reviewed_findings.deferred_for_separate_scope_review === 1, 'report deferred count mismatch');
ok(report.selected_candidate.candidate_id === 'sog_cand_pr496_mnee', 'report selected candidate mismatch');
ok(report.deferred_candidate.candidate_id === 'sog_cand_pr496_ylds', 'report deferred candidate mismatch');
ok(report.decision.authorize_next_pr === 498, 'report next PR mismatch');
ok(report.decision.maximum_new_canonical_assets === 1, 'report maximum addition mismatch');
ok(report.decision.replacement_candidate_allowed === false, 'report replacement boundary mismatch');

const mnee = audit.candidates.find((row) => row.candidate_id === 'sog_cand_pr496_mnee');
const ylds = audit.candidates.find((row) => row.candidate_id === 'sog_cand_pr496_ylds');
ok(mnee?.reviewed_disposition === 'ready_for_full_record_review', 'PR #496 MNEE disposition mismatch');
ok(mnee?.complete_record_feasibility?.complete_record_possible_now === true, 'PR #496 MNEE feasibility mismatch');
ok(mnee?.source_leads?.length === 4, 'PR #496 MNEE source coverage mismatch');
ok(ylds?.reviewed_disposition === 'ready_for_full_record_review', 'PR #496 YLDS disposition mismatch');
ok(ylds?.complete_record_feasibility?.complete_record_possible_now === true, 'PR #496 YLDS feasibility mismatch');
ok(ylds?.source_leads?.length === 3, 'PR #496 YLDS source coverage mismatch');
ok(sorted(handoff.ready_candidates.map((row) => row.candidate_id)) === sorted(['sog_cand_pr496_mnee', 'sog_cand_pr496_ylds']), 'PR #496 handoff candidate set mismatch');
ok(handoff.decision_boundary.record_growth_batch_4_promotion_authorized === false, 'PR #496 incorrectly pre-authorized promotion');

for (const body of [spec, amendment, agents, roadmap, governance]) {
  ok(body.includes('PR #497'), 'PR #497 authority missing');
  ok(body.includes('PR #498'), 'PR #498 authorization missing');
  ok(body.includes('MNEE'), 'MNEE decision missing');
  ok(body.includes('YLDS'), 'YLDS decision missing');
  ok(body.includes('REVIEW GATE'), 'review gate missing');
}
ok(spec.includes('Maximum new canonical assets: 1'), 'spec maximum addition missing');
ok(spec.includes('Replacement candidate: prohibited'), 'spec replacement prohibition missing');
ok(amendment.includes('No YLDS canonical work is authorized'), 'amendment YLDS prohibition missing');
ok(agents.includes('PR #497 Record Growth Batch 4 review gate: active'), 'AGENTS active workstream missing');
ok(roadmap.includes('Authorize MNEE only'), 'roadmap decision missing');
ok(governance.includes('PR #497 Record Growth Batch 4 review gate'), 'governance current item missing');
ok(text('scripts/validate-active-workstream.mjs').trim() === "import './validate-record-growth-batch-4-review-gate-pr497.mjs';", 'active-workstream validator not wired to PR #497');

console.log(JSON.stringify({
  ok: true,
  validation_id: 'sog_pr497_record_growth_batch_4_review_gate',
  canonical_assets: 116,
  authorized_next_pr: 498,
  authorized_candidate: 'sog_cand_pr496_mnee',
  maximum_new_canonical_assets: 1,
  replacement_candidate_allowed: false,
  deferred_candidate: 'sog_cand_pr496_ylds',
  canonical_changes: 0,
  public_changes: 0,
  next_boundary_after_pr498: 'REVIEW_GATE'
}, null, 2));
