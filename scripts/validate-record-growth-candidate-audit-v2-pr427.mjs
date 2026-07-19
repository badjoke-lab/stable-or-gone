import fs from 'node:fs';

await import('./validate-post-ui-v3-data-growth-reset-pr426.mjs');

const read = (path) => JSON.parse(fs.readFileSync(path, 'utf8'));
const ok = (condition, message) => { if (!condition) throw new Error(message); };
const key = (values) => [...values].sort().join('|');

const config = read('config/record-growth-candidate-audit-v2-pr427.json');
const audit = read('data/editorial-research/record-growth-candidate-audit-v2-pr427.json');
const duplicates = read('docs/migration/record-growth-candidate-audit-v2-pr427-duplicate-report.json');
const coverage = read('docs/migration/record-growth-candidate-audit-v2-pr427-source-coverage.json');
const handoff = read('docs/migration/record-growth-candidate-audit-v2-pr427-handoff.json');
const agents = fs.readFileSync('AGENTS.md', 'utf8');
const roadmap = fs.readFileSync('docs/roadmap.md', 'utf8');
const spec = fs.readFileSync('docs/quality/record-growth-candidate-audit-v2-pr427-spec.md', 'utf8');

ok(config.schema_version === '1.0', 'config schema mismatch');
ok(config.work_item === 'record_growth_candidate_audit_v2_pr427', 'work item mismatch');
ok(config.status === 'reviewed_candidate_audit_complete', 'config status mismatch');
ok(config.authority_pr === 426 && config.implementation_pr === 427, 'authority lineage mismatch');
ok(config.candidate_limit === 12 && config.reviewed_candidates === 11, 'candidate count mismatch');
ok(config.reviewed_candidates <= config.candidate_limit, 'candidate limit exceeded');
ok(config.canonical_baseline.stable_assets === 112, 'canonical asset count mismatch');
ok(config.canonical_baseline.evidence === 559, 'Evidence count mismatch');
ok(config.next_boundary === 'REVIEW_GATE', 'review gate missing');
ok(config.future_growth_limit === 2, 'future growth limit mismatch');
for (const field of ['canonical_changes_allowed','public_changes_allowed','automatic_promotion','ranking','score','recommendation']) ok(config[field] === false, `config boundary changed: ${field}`);

ok(audit.status === 'reviewed_internal_complete', 'audit status mismatch');
ok(audit.authority_pr === 426 && audit.implementation_pr === 427, 'audit lineage mismatch');
ok(audit.canonical_baseline.stable_assets === 112 && audit.canonical_baseline.evidence === 559, 'audit baseline mismatch');
ok(audit.canonical_boundary.included_in_public_counts === false, 'audit leaked to public counts');
ok(audit.canonical_boundary.automatic_promotion === false, 'audit automatic promotion changed');
ok(audit.canonical_boundary.canonical_changes_allowed === false, 'audit canonical boundary changed');
ok(Array.isArray(audit.candidates) && audit.candidates.length === 11, 'audit candidate count mismatch');
ok(new Set(audit.candidates.map((row) => row.candidate_id)).size === 11, 'duplicate candidate IDs');

const expectedCounts = {
  ready_for_full_record_review: 4,
  duplicate_existing: 4,
  prelaunch_or_noncanonical: 1,
  insufficient_evidence: 1,
  out_of_scope: 0,
  deferred: 1
};
const counts = Object.fromEntries(Object.keys(expectedCounts).map((name) => [name, 0]));
for (const row of audit.candidates) {
  ok(Object.hasOwn(counts, row.reviewed_disposition), `invalid disposition: ${row.candidate_id}`);
  counts[row.reviewed_disposition] += 1;
  ok(row.name && row.proposed_slug && row.issuer_or_operator && row.official_domain, `identity field missing: ${row.candidate_id}`);
  ok(Array.isArray(row.source_leads) && row.source_leads.length > 0, `sources missing: ${row.candidate_id}`);
  ok(Array.isArray(row.blocking_unknowns) && row.blocking_unknowns.length > 0, `unknowns missing: ${row.candidate_id}`);
  ok(row.duplicate_review?.decision, `duplicate review missing: ${row.candidate_id}`);
  for (const source of row.source_leads) {
    ok(source.primary === true, `source must be primary: ${source.source_id}`);
    ok(source.url?.startsWith('https://'), `source URL must use HTTPS: ${source.source_id}`);
    ok(Array.isArray(source.claim_scopes) && source.claim_scopes.length > 0, `claim scopes missing: ${source.source_id}`);
  }
}
for (const [name, expected] of Object.entries(expectedCounts)) {
  ok(counts[name] === expected, `${name} count mismatch`);
  ok(config.disposition_counts[name] === expected, `config ${name} count mismatch`);
}

const ready = ['sog_cand_pr427_chfau','sog_cand_pr427_sekau','sog_cand_pr427_plnq','sog_cand_pr427_gbpq'];
ok(key(config.ready_candidate_ids) === key(ready), 'config ready set mismatch');
ok(key(audit.candidates.filter((row) => row.reviewed_disposition === 'ready_for_full_record_review').map((row) => row.candidate_id)) === key(ready), 'audit ready set mismatch');
for (const row of audit.candidates.filter((item) => ready.includes(item.candidate_id))) {
  ok(row.complete_record_feasibility?.complete_record_possible_now === true, `ready candidate not feasible: ${row.candidate_id}`);
  ok(row.source_leads.length >= 2, `ready candidate lacks source identities: ${row.candidate_id}`);
}

const duplicateMap = {
  sog_cand_pr427_eurau: ['sog_st_eurau','data/stablecoins-batch-p.json','EURAU'],
  sog_cand_pr427_eurq: ['sog_st_eurq','data/stablecoins-batch-j.json','EURQ'],
  sog_cand_pr427_usdq: ['sog_st_usdq','data/stablecoins-batch-f.json','USDQ'],
  sog_cand_pr427_usr: ['sog_st_usr','data/stablecoins-batch-c.json','USR']
};
for (const [candidateId, [canonicalId, file, symbol]] of Object.entries(duplicateMap)) {
  const row = audit.candidates.find((item) => item.candidate_id === candidateId);
  ok(row?.reviewed_disposition === 'duplicate_existing', `duplicate disposition mismatch: ${candidateId}`);
  ok(row.duplicate_review.existing_canonical_id === canonicalId, `duplicate ID mismatch: ${candidateId}`);
  ok(row.duplicate_review.canonical_source_file === file, `duplicate file mismatch: ${candidateId}`);
  const canonical = read(file).find((item) => item.id === canonicalId);
  ok(canonical?.symbol === symbol && canonical.slug === row.proposed_slug, `canonical duplicate mismatch: ${canonicalId}`);
}
ok(duplicates.status === 'reviewed_complete', 'duplicate report status mismatch');
ok(duplicates.canonical_asset_count === 112 && duplicates.reviewed_candidate_count === 11, 'duplicate report baseline mismatch');
ok(duplicates.duplicate_count === 4 && duplicates.distinct_candidate_count === 7, 'duplicate report counts mismatch');
ok(key(duplicates.duplicates.map((row) => row.candidate_id)) === key(Object.keys(duplicateMap)), 'duplicate report set mismatch');

const blocked = {
  sog_cand_pr427_open_usd: 'deferred',
  sog_cand_pr427_fiusd: 'insufficient_evidence',
  sog_cand_pr427_roughrider: 'prelaunch_or_noncanonical'
};
for (const [candidateId, disposition] of Object.entries(blocked)) {
  const row = audit.candidates.find((item) => item.candidate_id === candidateId);
  ok(row?.reviewed_disposition === disposition, `blocked disposition mismatch: ${candidateId}`);
  ok(row.complete_record_feasibility?.complete_record_possible_now === false, `blocked candidate marked feasible: ${candidateId}`);
}

ok(coverage.status === 'reviewed_complete' && coverage.rows.length === 11, 'coverage report mismatch');
ok(new Set(coverage.rows.map((row) => row.candidate_id)).size === 11, 'coverage IDs not unique');
ok(coverage.summary.full_record_feasible === 4, 'coverage feasible count mismatch');
ok(coverage.summary.duplicates_not_reassessed_as_new_records === 4, 'coverage duplicate count mismatch');
ok(coverage.summary.blocked_or_deferred === 3, 'coverage blocked count mismatch');
ok(key(coverage.rows.filter((row) => row.full_record_feasible).map((row) => row.candidate_id)) === key(ready), 'coverage feasible set mismatch');

ok(handoff.status === 'reviewed_handoff', 'handoff status mismatch');
ok(handoff.source_authority_pr === 426 && handoff.source_pr === 427, 'handoff lineage mismatch');
ok(handoff.canonical_state.stable_assets === 112 && handoff.canonical_state.changed_by_pr427 === false, 'handoff canonical boundary mismatch');
ok(handoff.audit_result.reviewed_candidates === 11 && handoff.audit_result.ready_for_full_record_review === 4 && handoff.audit_result.duplicate_existing === 4, 'handoff counts mismatch');
ok(key(handoff.ready_candidates.map((row) => row.candidate_id)) === key(ready), 'handoff ready set mismatch');
ok(key(handoff.duplicate_candidates.map((row) => row.candidate_id)) === key(Object.keys(duplicateMap)), 'handoff duplicate set mismatch');
ok(handoff.decision_boundary.next_work_item === 'REVIEW_GATE', 'handoff review gate missing');
ok(handoff.decision_boundary.record_growth_batch_2_authorized === false, 'growth batch 2 incorrectly authorized');
ok(handoff.decision_boundary.maximum_future_canonical_additions === 2, 'handoff future limit mismatch');
for (const field of ['canonical_changes_allowed_in_pr427','public_changes_allowed_in_pr427','automatic_promotion','automatic_canonical_pr_creation','ranking','score','recommendation']) ok(handoff.decision_boundary[field] === false, `handoff boundary changed: ${field}`);

ok(agents.includes('Current mandatory authority: PR #427 Record Growth Candidate Audit v2.'), 'AGENTS authority missing');
ok(agents.includes('Next boundary: REVIEW GATE'), 'AGENTS review gate missing');
ok(roadmap.includes('Four rows are existing canonical identities'), 'roadmap duplicate finding missing');
ok(roadmap.includes('CHFAU, SEKAU, PLNQ, and GBPQ'), 'roadmap ready pool missing');
ok(roadmap.includes('REVIEW GATE after PR #427'), 'roadmap review gate missing');
ok(spec.includes('Four leads are exact existing canonical identities'), 'spec duplicate finding missing');
ok(spec.includes('Four distinct launched identities'), 'spec ready finding missing');
ok(spec.includes('REVIEW GATE'), 'spec review gate missing');

console.log(JSON.stringify({ok:true,reviewed:11,ready,duplicates:Object.keys(duplicateMap),blocked,canonical_changes:0,public_changes:0,next_boundary:'REVIEW_GATE'}, null, 2));
