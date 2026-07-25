import fs from 'node:fs';

const read = (path) => JSON.parse(fs.readFileSync(path, 'utf8'));
const text = (path) => fs.readFileSync(path, 'utf8');
const ok = (condition, message) => { if (!condition) throw new Error(message); };
const key = (values) => [...values].sort().join('|');

const config = read('config/post-ui-data-growth-review-gate-pr466.json');
const report = read('docs/migration/post-ui-data-growth-review-gate-pr466.json');
const current = read('docs/migration/current-canonical-checkpoint.json');
const audit = read('data/editorial-research/record-growth-candidate-audit-v2-pr427.json');
const coverage = read('docs/migration/record-growth-candidate-audit-v2-pr427-source-coverage.json');
const handoff = read('docs/migration/record-growth-candidate-audit-v2-pr427-handoff.json');
const promotions = read('data/candidate-promotions-batch-28.json');
const agents = text('AGENTS.md');
const roadmap = text('docs/roadmap.md');
const amendment = text('docs/roadmap-amendments/2026-07-25-pr466-post-ui-data-growth-review-gate.md');
const spec = text('docs/quality/post-ui-data-growth-review-gate-pr466-spec.md');

ok(config.schema_version === '1.0', 'config schema mismatch');
ok(config.work_item === 'post_ui_data_growth_review_gate_pr466', 'work item mismatch');
ok(config.status === 'reviewed_decision', 'config status mismatch');
ok(report.status === 'reviewed_decision', 'report status mismatch');

const c = current.expected_counts;
ok(current.status === 'reviewed_growth_checkpoint', 'current checkpoint status mismatch');
ok(current.asset_count === 114 && c.assets === 114, 'current asset count mismatch');
ok(c.organizations === 107, 'organization count mismatch');
ok(c.relationships === 126, 'relationship count mismatch');
ok(c.events === 189, 'event count mismatch');
ok(c.evidence === 565, 'Evidence count mismatch');
ok(c.deployments === 180, 'deployment count mismatch');
ok(c.market_access_records === 8, 'Market Access count mismatch');
ok(current.evidence_quality.archive_index_count === 436, 'archive recorded count mismatch');
ok(current.evidence_quality.archive_not_recorded_count === 129, 'archive not-recorded count mismatch');

for (const [field, value] of Object.entries({
  stable_assets: 114,
  organizations: 107,
  relationships: 126,
  events: 189,
  evidence: 565,
  evidence_relations: 565,
  deployments: 180,
  market_access_records: 8,
  archive_recorded: 436,
  archive_not_recorded: 129
})) ok(config.canonical_baseline[field] === value, `config canonical baseline mismatch: ${field}`);

const selectedIds = ['sog_cand_pr427_plnq', 'sog_cand_pr427_gbpq'];
const selectedSymbols = ['PLNQ', 'GBPQ'];
ok(config.decision.authorize_next_pr === 467, 'PR #467 must be the only authorized next PR');
ok(config.decision.authorize_work_item === 'Record Growth Batch 3', 'authorized work item mismatch');
ok(config.decision.selected_context_id === 'quantoz_regulated_non_eur_expansion', 'selected context mismatch');
ok(key(config.decision.selected_candidate_ids) === key(selectedIds), 'selected candidate set mismatch');
ok(key(config.decision.selected_symbols) === key(selectedSymbols), 'selected symbol set mismatch');
ok(config.decision.maximum_new_canonical_assets === 2, 'maximum asset bound mismatch');
ok(config.decision.review_gate_after_pr467 === true, 'review gate after PR #467 missing');
for (const field of ['ranking', 'score', 'recommendation', 'automatic_promotion']) ok(config.decision[field] === false, `decision boundary changed: ${field}`);

ok(handoff.decision_boundary.next_work_item === 'REVIEW_GATE', 'PR #427 handoff review boundary missing');
ok(key(handoff.review_gate_options.find((row) => row.context_id === 'quantoz_regulated_non_eur_expansion')?.candidate_ids ?? []) === key(selectedIds), 'PR #427 retained context mismatch');

for (const candidateId of selectedIds) {
  const auditRow = audit.candidates.find((row) => row.candidate_id === candidateId);
  const coverageRow = coverage.rows.find((row) => row.candidate_id === candidateId);
  ok(auditRow?.reviewed_disposition === 'ready_for_full_record_review', `candidate is not review-ready: ${candidateId}`);
  ok(auditRow?.complete_record_feasibility?.complete_record_possible_now === true, `candidate is not complete-record feasible: ${candidateId}`);
  ok(auditRow?.duplicate_review?.existing_canonical_id === null, `candidate already mapped to canonical record: ${candidateId}`);
  ok(coverageRow?.full_record_feasible === true, `candidate source coverage insufficient: ${candidateId}`);
  ok(coverageRow?.primary_source_count === 3, `candidate primary-source count mismatch: ${candidateId}`);
}

ok(promotions.length === 2, 'PR #429 promotion set must remain exactly two records');
ok(key(promotions.map((row) => row.promoted_record_id)) === key(['sog_st_chfau', 'sog_st_sekau']), 'PR #429 promotion identities changed');
ok(promotions.every((row) => row.status === 'promoted' && row.promotion_pr === 429), 'PR #429 promotion status mismatch');

ok(config.pr467_requirements.complete_record_only === true, 'complete-record requirement missing');
ok(config.pr467_requirements.thin_records_forbidden === true, 'thin-record prohibition missing');
ok(config.pr467_requirements.fresh_duplicate_recheck_required === true, 'fresh duplicate review missing');
ok(config.pr467_requirements.fresh_manual_source_review_required === true, 'fresh source review missing');
ok(config.pr467_requirements.exact_contract_identity_confirmation_required === true, 'contract confirmation gate missing');
ok(config.pr467_requirements.unconfirmed_candidate_must_be_withheld === true, 'withhold rule missing');
ok(config.pr467_requirements.reuse_existing_quantoz_organization === true, 'Quantoz organization reuse requirement missing');
for (const field of ['automatic_promotion', 'public_surface_change', 'market_access_change', 'ui_change']) ok(config.pr467_requirements[field] === false, `PR #467 boundary changed: ${field}`);

ok(report.decision.next_pr === 467, 'report next PR mismatch');
ok(report.decision.work_item.includes('PLNQ') && report.decision.work_item.includes('GBPQ'), 'report selected pair missing');
ok(key(report.decision.selected_candidates.map((row) => row.candidate_id)) === key(selectedIds), 'report candidate set mismatch');
ok(report.decision.maximum_new_canonical_assets === 2, 'report asset bound mismatch');
ok(report.decision.canonical_changes_in_pr466 === false, 'PR #466 must remain governance-only');
ok(report.decision.public_changes_in_pr466 === false, 'PR #466 public boundary changed');
ok(report.next_boundary === 'REVIEW_GATE_AFTER_PR467', 'report exit boundary mismatch');

ok(agents.includes('PR #466 Post-UI data-growth review gate: active'), 'AGENTS PR #466 state missing');
ok(agents.includes('PR #467 Record Growth Batch 3 — PLNQ and GBPQ: authorized next'), 'AGENTS PR #467 authority missing');
ok(agents.includes('Next boundary after PR #467: REVIEW GATE'), 'AGENTS review boundary missing');
ok(roadmap.includes('PR #466 Post-UI data-growth review gate: active'), 'roadmap PR #466 state missing');
ok(roadmap.includes('PR #467 Record Growth Batch 3 — PLNQ and GBPQ: authorized next'), 'roadmap PR #467 state missing');

for (const body of [amendment, spec]) {
  ok(body.includes('PR #467'), 'governing text must name PR #467');
  ok(body.includes('PLNQ') && body.includes('GBPQ'), 'governing text must name selected pair');
  ok(body.includes('REVIEW GATE'), 'governing text must require review gate');
  ok(body.includes('thin') || body.includes('Thin'), 'governing text must prohibit thin records');
}

console.log(JSON.stringify({
  ok: true,
  work_item: config.work_item,
  canonical_assets: 114,
  next_pr: 467,
  selected_context: config.decision.selected_context_id,
  selected_symbols: selectedSymbols,
  maximum_new_canonical_assets: 2,
  canonical_changes_in_pr466: 0,
  next_boundary: 'REVIEW_GATE_AFTER_PR467'
}, null, 2));
