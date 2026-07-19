import fs from 'node:fs';

const read = (path) => JSON.parse(fs.readFileSync(path, 'utf8'));
const ok = (condition, message) => { if (!condition) throw new Error(message); };
const key = (values) => [...values].sort().join('|');

const config = read('config/post-pr427-review-gate-pr428.json');
const report = read('docs/migration/post-pr427-review-gate-pr428.json');
const auditConfig = read('config/record-growth-candidate-audit-v2-pr427.json');
const audit = read('data/editorial-research/record-growth-candidate-audit-v2-pr427.json');
const duplicateReport = read('docs/migration/record-growth-candidate-audit-v2-pr427-duplicate-report.json');
const sourceCoverage = read('docs/migration/record-growth-candidate-audit-v2-pr427-source-coverage.json');
const handoff = read('docs/migration/record-growth-candidate-audit-v2-pr427-handoff.json');
const validation = read('docs/migration/record-growth-candidate-audit-v2-pr427-validation.json');
const agents = fs.readFileSync('AGENTS.md', 'utf8');
const roadmap = fs.readFileSync('docs/roadmap.md', 'utf8');
const amendment = fs.readFileSync('docs/roadmap-amendments/2026-07-18-pr428-post-pr427-review-gate.md', 'utf8');
const spec = fs.readFileSync('docs/quality/post-pr427-review-gate-pr428-spec.md', 'utf8');

ok(config.schema_version === '1.0', 'config schema mismatch');
ok(config.work_item === 'post_pr427_review_gate_pr428', 'work item mismatch');
ok(config.status === 'reviewed_decision', 'config status mismatch');
ok(config.source_pr === 427, 'source PR mismatch');
ok(config.source_head_commit === 'de85c9002867c9ebed6d5cad6448cf401ff2a3a0', 'source head mismatch');
ok(config.canonical_baseline.stable_assets === 112, 'canonical asset count mismatch');
ok(config.canonical_baseline.evidence === 559, 'Evidence count mismatch');
ok(config.canonical_baseline.market_access_records === 8, 'Market Access count mismatch');
ok(config.source_validation.status === 'success', 'source validation status mismatch');
ok(config.source_validation.reviewed_candidates === 11, 'source reviewed count mismatch');
ok(config.source_validation.ready_for_full_record_review === 4, 'source ready count mismatch');
ok(config.source_validation.duplicate_existing === 4, 'source duplicate count mismatch');
ok(config.source_validation.blocked_or_deferred === 3, 'source blocked count mismatch');

ok(validation.status === 'success', 'PR #427 validation receipt is not successful');
ok(validation.validated_work_item === 'record_growth_candidate_audit_v2_pr427', 'validation work item mismatch');
ok(validation.reviewed_candidates === 11, 'validation reviewed count mismatch');
ok(validation.ready_for_full_record_review === 4, 'validation ready count mismatch');
ok(validation.duplicate_existing === 4, 'validation duplicate count mismatch');
ok(validation.blocked_or_deferred === 3, 'validation blocked count mismatch');
ok(validation.canonical_changes === 0 && validation.public_changes === 0, 'source PR changed protected outputs');
ok(validation.automatic_promotion === false && validation.next_boundary === 'REVIEW_GATE', 'source exit boundary mismatch');

ok(auditConfig.reviewed_candidates === 11, 'audit config count mismatch');
ok(audit.summary.ready_for_full_record_review === 4, 'audit ready summary mismatch');
ok(audit.summary.duplicate_existing === 4, 'audit duplicate summary mismatch');
ok(duplicateReport.duplicate_count === 4, 'duplicate report mismatch');
ok(sourceCoverage.summary.full_record_feasible === 4, 'source coverage feasible count mismatch');
ok(handoff.decision_boundary.next_work_item === 'REVIEW_GATE', 'handoff review gate missing');
ok(handoff.decision_boundary.record_growth_batch_2_authorized === false, 'PR #427 incorrectly authorized growth');

const selectedIds = ['sog_cand_pr427_chfau','sog_cand_pr427_sekau'];
const selectedSymbols = ['CHFAU','SEKAU'];
ok(config.decision.authorize_next_pr === 429, 'PR #429 must be the only authorized next PR');
ok(config.decision.authorize_work_item === 'Record Growth Batch 2', 'next work item mismatch');
ok(config.decision.selected_context_id === 'allunity_regulated_non_eur_expansion', 'selected context mismatch');
ok(key(config.decision.selected_candidate_ids) === key(selectedIds), 'selected candidate set mismatch');
ok(key(config.decision.selected_symbols) === key(selectedSymbols), 'selected symbol set mismatch');
ok(config.decision.maximum_new_canonical_assets === 2, 'growth limit mismatch');
ok(config.decision.review_gate_after_pr429 === true, 'review gate after PR #429 missing');
for (const field of ['ranking','score','recommendation']) ok(config.decision[field] === false, `decision boundary changed: ${field}`);

for (const candidateId of selectedIds) {
  const auditRow = audit.candidates.find((row) => row.candidate_id === candidateId);
  const coverageRow = sourceCoverage.rows.find((row) => row.candidate_id === candidateId);
  ok(auditRow?.reviewed_disposition === 'ready_for_full_record_review', `selected candidate not review-ready: ${candidateId}`);
  ok(auditRow.complete_record_feasibility?.complete_record_possible_now === true, `selected candidate not complete-record feasible: ${candidateId}`);
  ok(coverageRow?.full_record_feasible === true, `selected candidate source coverage insufficient: ${candidateId}`);
}

ok(report.status === 'reviewed_decision', 'report status mismatch');
ok(report.source_pr === 427 && report.source_head_commit === config.source_head_commit, 'report source mismatch');
ok(report.reviewed_findings.reviewed_candidates === 11, 'report reviewed count mismatch');
ok(report.reviewed_findings.ready_for_full_record_review === 4, 'report ready count mismatch');
ok(report.reviewed_findings.duplicate_existing === 4, 'report duplicate count mismatch');
ok(report.reviewed_findings.blocked_or_deferred === 3, 'report blocked count mismatch');
ok(report.decision.next_pr === 429, 'report next PR mismatch');
ok(report.decision.selected_context_id === config.decision.selected_context_id, 'report selected context mismatch');
ok(key(report.decision.selected_candidates.map((row) => row.candidate_id)) === key(selectedIds), 'report selected candidates mismatch');
ok(report.decision.maximum_new_canonical_assets === 2, 'report growth limit mismatch');
ok(report.decision.canonical_changes_in_pr428 === false, 'PR #428 must remain governance-only');
ok(report.decision.review_gate_after_pr429 === true, 'report review gate missing');
ok(report.retained_for_future_review[0]?.context_id === 'quantoz_regulated_non_eur_expansion', 'retained context mismatch');
ok(key(report.retained_for_future_review[0]?.candidate_symbols ?? []) === key(['PLNQ','GBPQ']), 'retained candidate set mismatch');

ok(config.pr429_requirements.complete_record_only === true, 'complete-record requirement missing');
ok(config.pr429_requirements.thin_records_forbidden === true, 'thin-record prohibition missing');
ok(config.pr429_requirements.duplicate_recheck_required === true, 'duplicate recheck missing');
ok(config.pr429_requirements.manual_source_review_required === true, 'manual source review missing');
for (const field of ['automatic_promotion','public_surface_change','market_access_change']) ok(config.pr429_requirements[field] === false, `PR #429 boundary changed: ${field}`);

ok(agents.includes('Current mandatory authority: PR #429 Record Growth Batch 2 — CHFAU and SEKAU.'), 'AGENTS authority mismatch');
ok(agents.includes('PR #428 Post-PR #427 Review Gate: complete on merge'), 'AGENTS PR #428 state missing');
ok(agents.includes('Next boundary after PR #429: REVIEW GATE'), 'AGENTS exit boundary missing');
ok(roadmap.includes('PR #429 Record Growth Batch 2 — CHFAU and SEKAU: authorized next'), 'roadmap PR #429 state missing');
ok(roadmap.includes('PLNQ and GBPQ remain retained for future review'), 'roadmap retained context missing');
for (const text of [amendment, spec]) {
  ok(text.includes('PR #429'), 'governing text must name PR #429');
  ok(text.includes('CHFAU') && text.includes('SEKAU'), 'governing text must name selected pair');
  ok(text.includes('REVIEW GATE'), 'governing text must require review gate');
}

console.log(JSON.stringify({
  ok: true,
  work_item: config.work_item,
  source_pr: 427,
  next_pr: 429,
  selected_context: config.decision.selected_context_id,
  selected_symbols: selectedSymbols,
  maximum_new_canonical_assets: 2,
  canonical_changes_in_pr428: 0,
  next_boundary: 'REVIEW_GATE'
}, null, 2));
