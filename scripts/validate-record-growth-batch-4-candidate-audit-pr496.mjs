import fs from 'node:fs';

await import('./validate-post-domain-authority-sync-pr495.mjs');

const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const text = (file) => fs.readFileSync(file, 'utf8');
const ok = (condition, message) => { if (!condition) throw new Error(message); };
const sorted = (values) => [...values].sort().join('|');

const config = read('config/record-growth-batch-4-candidate-audit-pr496.json');
const audit = read('data/editorial-research/record-growth-batch-4-candidate-audit-pr496.json');
const coverage = read('docs/migration/record-growth-batch-4-candidate-audit-pr496-source-coverage.json');
const duplicates = read('docs/migration/record-growth-batch-4-candidate-audit-pr496-duplicate-report.json');
const handoff = read('docs/migration/record-growth-batch-4-candidate-audit-pr496-handoff.json');
const spec = text('docs/quality/record-growth-batch-4-candidate-audit-pr496-spec.md');
const amendment = text('docs/roadmap-amendments/2026-07-31-record-growth-batch-4-candidate-audit.md');
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
  detail_routes: 414
};

ok(config.schema_version === '1.0', 'config schema mismatch');
ok(config.work_item === 'record_growth_batch_4_candidate_audit_pr496', 'config work item mismatch');
ok(config.status === 'reviewed_candidate_audit_complete', 'config status mismatch');
ok(config.authority_pr === 495 && config.implementation_pr === 496, 'config authority lineage mismatch');
ok(config.candidate_limit === 12 && config.reviewed_candidates === 8, 'config candidate boundary mismatch');
ok(config.reviewed_candidates <= config.candidate_limit, 'candidate limit exceeded');
ok(config.next_boundary === 'REVIEW_GATE', 'config review gate missing');
ok(config.maximum_future_canonical_additions === 2, 'future growth limit mismatch');
for (const [field, value] of Object.entries(baseline)) ok(config.canonical_baseline[field] === value, `config baseline mismatch: ${field}`);
for (const field of ['canonical_changes_allowed','public_changes_allowed','automatic_promotion','automatic_canonical_pr_creation','ranking','score','recommendation']) ok(config[field] === false, `config boundary changed: ${field}`);

ok(audit.status === 'reviewed_internal_complete', 'audit status mismatch');
ok(audit.authority_pr === 495 && audit.implementation_pr === 496, 'audit authority lineage mismatch');
for (const [field, value] of Object.entries(baseline)) ok(audit.canonical_baseline[field] === value, `audit baseline mismatch: ${field}`);
for (const field of ['included_in_public_counts','canonical_changes_allowed','public_changes_allowed','automatic_promotion','automatic_canonical_pr_creation','ranking','score','recommendation']) ok(audit.canonical_boundary[field] === false, `audit boundary changed: ${field}`);
ok(Array.isArray(audit.candidates) && audit.candidates.length === 8, 'audit candidate count mismatch');
ok(new Set(audit.candidates.map((row) => row.candidate_id)).size === 8, 'duplicate candidate IDs');

const expectedIds = [
  'sog_cand_pr496_open_usd',
  'sog_cand_pr496_fiusd',
  'sog_cand_pr496_roughrider',
  'sog_cand_pr496_mnee',
  'sog_cand_pr496_qivalis_eur',
  'sog_cand_pr496_anz_adc',
  'sog_cand_pr496_usdf_consortium',
  'sog_cand_pr496_ylds'
];
ok(sorted(audit.candidates.map((row) => row.candidate_id)) === sorted(expectedIds), 'candidate set mismatch');

const expectedCounts = {
  ready_for_full_record_review: 2,
  prelaunch_or_noncanonical: 3,
  insufficient_current_evidence: 3,
  duplicate_existing: 0,
  out_of_scope: 0
};
const counts = Object.fromEntries(Object.keys(expectedCounts).map((key) => [key, 0]));
let sourceCount = 0;
for (const row of audit.candidates) {
  ok(Object.hasOwn(counts, row.reviewed_disposition), `invalid disposition: ${row.candidate_id}`);
  counts[row.reviewed_disposition] += 1;
  ok(row.name && row.proposed_slug && row.issuer_or_operator && row.official_domain, `identity field missing: ${row.candidate_id}`);
  ok(row.scope_note, `scope note missing: ${row.candidate_id}`);
  ok(row.duplicate_review?.decision, `duplicate review missing: ${row.candidate_id}`);
  ok(Array.isArray(row.source_leads) && row.source_leads.length > 0, `source leads missing: ${row.candidate_id}`);
  ok(Array.isArray(row.blocking_unknowns) && row.blocking_unknowns.length > 0, `blocking unknowns missing: ${row.candidate_id}`);
  ok(typeof row.complete_record_feasibility?.complete_record_possible_now === 'boolean', `feasibility missing: ${row.candidate_id}`);
  for (const source of row.source_leads) {
    sourceCount += 1;
    ok(source.primary === true, `source is not primary: ${source.source_id}`);
    ok(source.url?.startsWith('https://'), `source URL must use HTTPS: ${source.source_id}`);
    ok(source.reviewed_at === '2026-07-31', `source review date mismatch: ${source.source_id}`);
    ok(Array.isArray(source.claim_scopes) && source.claim_scopes.length > 0, `source claim scopes missing: ${source.source_id}`);
  }
}
ok(sourceCount === 20, 'primary source count mismatch');
for (const [name, expected] of Object.entries(expectedCounts)) {
  ok(counts[name] === expected, `${name} count mismatch`);
  ok(config.disposition_counts[name] === expected, `config ${name} count mismatch`);
}

const ready = ['sog_cand_pr496_mnee', 'sog_cand_pr496_ylds'];
const prelaunch = ['sog_cand_pr496_open_usd', 'sog_cand_pr496_roughrider', 'sog_cand_pr496_qivalis_eur'];
const insufficient = ['sog_cand_pr496_fiusd', 'sog_cand_pr496_anz_adc', 'sog_cand_pr496_usdf_consortium'];
ok(sorted(config.ready_candidate_ids) === sorted(ready), 'config ready set mismatch');
ok(sorted(config.prelaunch_candidate_ids) === sorted(prelaunch), 'config prelaunch set mismatch');
ok(sorted(config.insufficient_candidate_ids) === sorted(insufficient), 'config insufficient set mismatch');
ok(sorted(audit.candidates.filter((row) => row.complete_record_feasibility.complete_record_possible_now).map((row) => row.candidate_id)) === sorted(ready), 'audit feasible set mismatch');
for (const id of ready) {
  const row = audit.candidates.find((item) => item.candidate_id === id);
  ok(row.reviewed_disposition === 'ready_for_full_record_review', `ready disposition mismatch: ${id}`);
  ok(row.source_leads.length >= 3, `ready source coverage too thin: ${id}`);
}
for (const id of [...prelaunch, ...insufficient]) {
  const row = audit.candidates.find((item) => item.candidate_id === id);
  ok(row.complete_record_feasibility.complete_record_possible_now === false, `blocked candidate marked feasible: ${id}`);
}

ok(coverage.status === 'reviewed_complete', 'coverage status mismatch');
ok(coverage.rows.length === 8 && new Set(coverage.rows.map((row) => row.candidate_id)).size === 8, 'coverage row mismatch');
ok(coverage.summary.reviewed_candidates === 8, 'coverage reviewed count mismatch');
ok(coverage.summary.full_record_feasible === 2, 'coverage feasible count mismatch');
ok(coverage.summary.prelaunch_or_noncanonical === 3, 'coverage prelaunch count mismatch');
ok(coverage.summary.insufficient_current_evidence === 3, 'coverage insufficient count mismatch');
ok(coverage.summary.primary_source_identities === 20, 'coverage source count mismatch');
ok(coverage.summary.canonical_changes === 0 && coverage.summary.public_changes === 0, 'coverage boundary changed');
ok(sorted(coverage.rows.filter((row) => row.full_record_feasible).map((row) => row.candidate_id)) === sorted(ready), 'coverage feasible set mismatch');

ok(duplicates.status === 'reviewed_complete', 'duplicate report status mismatch');
ok(duplicates.canonical_asset_count === 116 && duplicates.reviewed_candidate_count === 8, 'duplicate baseline mismatch');
ok(duplicates.exact_duplicate_count === 0 && duplicates.distinct_candidate_count === 8, 'duplicate counts mismatch');
ok(duplicates.symbol_collision_count === 1 && duplicates.symbol_collisions.length === 1, 'symbol collision count mismatch');
const collision = duplicates.symbol_collisions[0];
ok(collision.candidate_id === 'sog_cand_pr496_usdf_consortium', 'USDF collision candidate mismatch');
ok(collision.existing_canonical_id === 'sog_st_usdf', 'USDF canonical collision target mismatch');
ok(collision.decision === 'distinct_identity_do_not_merge', 'USDF collision decision mismatch');
ok(duplicates.canonical_boundary.canonical_changes === 0, 'duplicate report canonical boundary changed');

ok(handoff.status === 'reviewed_handoff', 'handoff status mismatch');
ok(handoff.source_authority_pr === 495 && handoff.source_pr === 496, 'handoff lineage mismatch');
ok(handoff.canonical_state.stable_assets === 116 && handoff.canonical_state.changed_by_pr496 === false, 'handoff canonical state mismatch');
ok(handoff.audit_result.reviewed_candidates === 8, 'handoff reviewed count mismatch');
ok(handoff.audit_result.ready_for_full_record_review === 2, 'handoff ready count mismatch');
ok(sorted(handoff.ready_candidates.map((row) => row.candidate_id)) === sorted(ready), 'handoff ready set mismatch');
ok(handoff.decision_boundary.next_work_item === 'REVIEW_GATE', 'handoff review gate missing');
ok(handoff.decision_boundary.record_growth_batch_4_promotion_authorized === false, 'promotion incorrectly authorized');
ok(handoff.decision_boundary.maximum_future_canonical_additions === 2, 'handoff future limit mismatch');
for (const field of ['canonical_changes_allowed_in_pr496','public_changes_allowed_in_pr496','automatic_promotion','automatic_canonical_pr_creation','ranking','score','recommendation']) ok(handoff.decision_boundary[field] === false, `handoff boundary changed: ${field}`);

for (const body of [spec, amendment, agents, roadmap, governance]) {
  ok(body.includes('PR #496'), 'PR #496 authority missing');
  ok(body.includes('REVIEW GATE'), 'review gate text missing');
}
ok(spec.includes('MNEE') && spec.includes('Figure YLDS'), 'spec ready candidate set missing');
ok(spec.includes('Canonical changes: 0') && spec.includes('Public changes: 0'), 'spec preservation result missing');
ok(amendment.includes('No promotion PR, candidate pair, or later batch is authorized'), 'amendment promotion prohibition missing');
ok(agents.includes('Record Growth Batch 4 candidate audit: active'), 'AGENTS workstream missing');
ok(roadmap.includes('MNEE and Figure YLDS'), 'roadmap feasible set missing');
ok(governance.includes('PR #496 Record Growth Batch 4 candidate audit'), 'governance current item missing');
ok(text('scripts/validate-active-workstream.mjs').trim() === "import './validate-record-growth-batch-4-candidate-audit-pr496.mjs';", 'active-workstream validator not wired to PR #496');

console.log(JSON.stringify({
  ok: true,
  validation_id: 'sog_pr496_record_growth_batch_4_candidate_audit',
  reviewed_candidates: 8,
  ready_for_full_record_review: ready,
  prelaunch_or_noncanonical: prelaunch,
  insufficient_current_evidence: insufficient,
  exact_duplicates: 0,
  symbol_collisions: ['sog_cand_pr496_usdf_consortium'],
  canonical_changes: 0,
  public_changes: 0,
  next_boundary: 'REVIEW_GATE'
}, null, 2));
