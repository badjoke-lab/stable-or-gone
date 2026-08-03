import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const config = readJson('config/record-growth-batch-5-candidate-audit-pr515.json');
const audit = readJson('data/editorial-research/record-growth-batch-5-candidate-audit-pr515.json');
const coverage = readJson('docs/migration/record-growth-batch-5-candidate-audit-pr515-source-coverage.json');
const duplicates = readJson('docs/migration/record-growth-batch-5-candidate-audit-pr515-duplicate-report.json');
const handoff = readJson('docs/migration/record-growth-batch-5-candidate-audit-pr515-handoff.json');
const checkpoint = readJson('docs/migration/current-canonical-checkpoint.json');
const active = readText('scripts/validate-active-workstream.mjs').trim();

const expectedIds = [
  'sog_cand_pr515_sofiusd',
  'sog_cand_pr515_usat',
  'sog_cand_pr515_xreur',
  'sog_cand_pr515_bison_eub',
  'sog_cand_pr515_bison_usb',
  'sog_cand_pr515_jpysc',
  'sog_cand_pr515_swiss_chf_sandbox',
  'sog_cand_pr515_hazel_network_token'
];
const expectedReady = ['sog_cand_pr515_bison_eub', 'sog_cand_pr515_bison_usb'];
const allowed = new Set([
  'ready_for_full_record_review',
  'prelaunch_or_noncanonical',
  'insufficient_current_evidence',
  'duplicate_existing',
  'out_of_scope'
]);

expect(config.status === 'reviewed_candidate_audit_complete', 'config completion status changed');
expect(config.authority_pr === 514 && config.implementation_pr === 515, 'authority chain changed');
expect(config.public_output === false, 'audit became public');
expect(config.reviewed_candidates === 8 && config.candidate_limit === 8, 'reviewed candidate count changed');
expect(JSON.stringify(config.candidate_ids) === JSON.stringify(expectedIds), 'fixed candidate set changed');
expect(JSON.stringify(config.ready_candidate_ids) === JSON.stringify(expectedReady), 'ready candidate set changed');
expect(config.disposition_counts.ready_for_full_record_review === 2, 'ready count changed');
expect(Object.values(config.disposition_counts).reduce((sum, value) => sum + value, 0) === 8, 'disposition counts do not sum to eight');
expect(config.maximum_ready_candidates === 2, 'ready limit changed');
expect(config.canonical_changes_allowed === false && config.public_changes_allowed === false, 'canonical or public changes were enabled');
expect(config.automatic_promotion === false && config.automatic_canonical_pr_creation === false, 'automatic promotion boundary changed');
expect(config.replacement_candidate === false, 'replacement candidate boundary changed');
expect(config.legacy_redirect_changes === 0, 'legacy redirect boundary changed');
expect(config.next_boundary === 'REVIEW_GATE', 'review gate exit changed');

expect(audit.status === 'reviewed_internal_complete', 'audit status changed');
expect(audit.candidates.length === 8, 'audit candidate count changed');
expect(JSON.stringify(audit.candidates.map((candidate) => candidate.candidate_id)) === JSON.stringify(expectedIds), 'audit candidate order changed');
expect(new Set(audit.candidates.map((candidate) => candidate.candidate_id)).size === 8, 'audit candidate IDs are not unique');
for (const candidate of audit.candidates) {
  expect(allowed.has(candidate.reviewed_disposition), `invalid disposition for ${candidate.candidate_id}`);
  expect(Array.isArray(candidate.source_leads) && candidate.source_leads.length > 0, `primary sources missing for ${candidate.candidate_id}`);
  expect(candidate.source_leads.every((source) => source.primary === true), `non-primary source entered for ${candidate.candidate_id}`);
  expect(Array.isArray(candidate.blocking_unknowns) && candidate.blocking_unknowns.length > 0, `blocking unknowns missing for ${candidate.candidate_id}`);
  expect(typeof candidate.complete_record_feasibility?.complete_record_possible_now === 'boolean', `feasibility missing for ${candidate.candidate_id}`);
}
const auditedReady = audit.candidates.filter((candidate) => candidate.reviewed_disposition === 'ready_for_full_record_review').map((candidate) => candidate.candidate_id);
expect(JSON.stringify(auditedReady) === JSON.stringify(expectedReady), 'audited ready set changed');
expect(audit.candidates.filter((candidate) => candidate.reviewed_disposition === 'ready_for_full_record_review').every((candidate) => candidate.complete_record_feasibility.complete_record_possible_now === true), 'ready candidate lacks complete-record feasibility');
expect(audit.candidates.filter((candidate) => candidate.reviewed_disposition !== 'ready_for_full_record_review').every((candidate) => candidate.complete_record_feasibility.complete_record_possible_now === false), 'non-ready candidate marked complete-record feasible');
expect(audit.canonical_boundary.included_in_public_counts === false, 'audit entered public counts');
expect(audit.canonical_boundary.canonical_changes_allowed === false && audit.canonical_boundary.public_changes_allowed === false, 'audit boundary permits changes');
expect(audit.next_boundary === 'REVIEW_GATE', 'audit review gate changed');

const sourceRelations = audit.candidates.reduce((sum, candidate) => sum + candidate.source_leads.length, 0);
const uniqueSourceUrls = new Set(audit.candidates.flatMap((candidate) => candidate.source_leads.map((source) => source.url))).size;
expect(coverage.candidate_count === 8, 'coverage candidate count changed');
expect(coverage.primary_source_relation_count === sourceRelations, 'source relation count mismatch');
expect(coverage.unique_primary_source_count === uniqueSourceUrls, 'unique source count mismatch');
expect(coverage.candidate_coverage.length === 8, 'coverage rows changed');
expect(coverage.result.all_candidates_have_primary_sources === true, 'source coverage result changed');
expect(coverage.result.ready_candidate_count === 2, 'coverage ready count changed');

expect(duplicates.canonical_asset_baseline === 117, 'duplicate baseline changed');
expect(duplicates.candidate_count === 8, 'duplicate candidate count changed');
expect(duplicates.exact_canonical_duplicates.length === 0, 'canonical duplicate introduced');
expect(duplicates.symbol_collisions.length === 0, 'symbol collision introduced');
expect(duplicates.result.ready_candidates_are_distinct_from_each_other === true, 'ready candidates are not distinct');
expect(duplicates.result.ready_candidates_are_distinct_from_117_asset_baseline === true, 'ready candidate duplicates canonical baseline');
expect(duplicates.result.replacement_candidates_added === 0, 'replacement candidate added');

expect(handoff.status === 'review_gate_handoff', 'handoff status changed');
expect(JSON.stringify(handoff.ready_candidate_ids) === JSON.stringify(expectedReady), 'handoff ready set changed');
expect(handoff.ready_candidate_limit === 2, 'handoff limit changed');
expect(handoff.canonical_implementation_authorized === false, 'canonical implementation was pre-authorized');
expect(handoff.required_next_decision.boundary === 'REVIEW_GATE', 'handoff review gate changed');
expect(handoff.required_next_decision.automatic_choice === false, 'automatic next choice enabled');
expect(handoff.canonical_changes === 0 && handoff.public_changes === 0 && handoff.legacy_redirect_changes === 0, 'handoff boundary changed');

expect(config.canonical_baseline.canonical_hash === 'sha256:083860b341f6deebc1109b6b5b044dee584ba5e487e2e9b1722213772256b5bb', 'canonical hash changed');
expect(config.canonical_baseline.stable_assets === 117, 'asset baseline changed');
expect(config.canonical_baseline.organizations === 108 && config.canonical_baseline.relationships === 129, 'identity baseline changed');
expect(config.canonical_baseline.events === 192, 'event baseline changed');
expect(config.canonical_baseline.evidence === 579 && config.canonical_baseline.evidence_relations === 579, 'Evidence baseline changed');
expect(config.canonical_baseline.deployments === 184 && config.canonical_baseline.market_access_records === 8, 'deployment or Market Access baseline changed');
expect(config.canonical_baseline.detail_routes === 417 && config.canonical_baseline.metadata_checked_routes === 417, 'route baseline changed');
expect(config.canonical_baseline.archive_recorded === 457 && config.canonical_baseline.archive_not_recorded === 122, 'archive baseline changed');
expect(checkpoint.counts.assets === 117 && checkpoint.counts.organizations === 108 && checkpoint.counts.relationships === 129, 'canonical identity checkpoint changed');
expect(checkpoint.counts.events === 192 && checkpoint.counts.evidence === 579 && checkpoint.counts.evidence_relations === 579, 'canonical event or Evidence checkpoint changed');
expect(checkpoint.counts.deployments === 184 && checkpoint.counts.market_access_records === 8, 'canonical deployment checkpoint changed');
expect(checkpoint.counts.detail_routes === 417 && checkpoint.counts.metadata_checked_routes === 417, 'canonical route checkpoint changed');
expect(checkpoint.counts.archive_index_count === 457 && checkpoint.counts.archive_not_recorded_count === 122, 'canonical archive checkpoint changed');
expect(active === "import './validate-record-growth-batch-5-candidate-audit-pr515.mjs';", 'active validator is not wired to PR #515');

if (failures.length) {
  console.error('PR #515 Record Growth Batch 5 candidate audit validation failed:');
  failures.forEach((failure) => console.error('- ' + failure));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  authority_pr: 514,
  implementation_pr: 515,
  reviewed_candidates: 8,
  ready_candidate_ids: expectedReady,
  disposition_counts: config.disposition_counts,
  primary_source_relations: sourceRelations,
  unique_primary_sources: uniqueSourceUrls,
  canonical_changes: 0,
  public_changes: 0,
  legacy_redirect_changes: 0,
  next_boundary: 'REVIEW_GATE'
}, null, 2));
