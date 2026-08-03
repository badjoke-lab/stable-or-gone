import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const decision = readJson('config/record-growth-batch-5-review-gate-pr516.json');
const auditConfig = readJson('config/record-growth-batch-5-candidate-audit-pr515.json');
const audit = readJson('data/editorial-research/record-growth-batch-5-candidate-audit-pr515.json');
const auditHandoff = readJson('docs/migration/record-growth-batch-5-candidate-audit-pr515-handoff.json');
const transition = readJson('docs/migration/record-growth-batch-5-review-gate-pr516.json');
const checkpoint = readJson('docs/migration/current-canonical-checkpoint.json');
const agents = readText('AGENTS.md');
const roadmap = readText('docs/roadmap.md');
const amendment = readText('docs/roadmap-amendments/2026-08-03-record-growth-batch-5-review-gate.md');
const spec = readText('docs/quality/record-growth-batch-5-review-gate-pr516-spec.md');
const active = readText('scripts/validate-active-workstream.mjs').trim();

const selected = ['sog_cand_pr515_bison_eub', 'sog_cand_pr515_bison_usb'];
const deferred = [
  'sog_cand_pr515_sofiusd',
  'sog_cand_pr515_usat',
  'sog_cand_pr515_xreur',
  'sog_cand_pr515_jpysc',
  'sog_cand_pr515_swiss_chf_sandbox',
  'sog_cand_pr515_hazel_network_token'
];

expect(decision.status === 'reviewed_decision', 'review-gate status changed');
expect(JSON.stringify(decision.source_prs) === JSON.stringify([514, 515]), 'source PR chain changed');
expect(decision.production_checkpoint.source_commit === 'e33bed83dead360570ab81907fbf4f237b63d136', 'PR #515 production commit changed');
expect(decision.production_checkpoint.public_origin === 'https://www.stableorgone.com', 'public origin changed');
expect(decision.production_checkpoint.canonical_hash === 'sha256:083860b341f6deebc1109b6b5b044dee584ba5e487e2e9b1722213772256b5bb', 'canonical hash changed');
expect(decision.production_checkpoint.convergence_attempt === 1, 'production convergence result changed');

expect(decision.canonical_baseline.stable_assets === 117, 'stable-asset baseline changed');
expect(decision.canonical_baseline.organizations === 108 && decision.canonical_baseline.relationships === 129, 'identity baseline changed');
expect(decision.canonical_baseline.events === 192, 'event baseline changed');
expect(decision.canonical_baseline.evidence === 579 && decision.canonical_baseline.evidence_relations === 579, 'Evidence baseline changed');
expect(decision.canonical_baseline.deployments === 184 && decision.canonical_baseline.market_access_records === 8, 'deployment or Market Access baseline changed');
expect(decision.canonical_baseline.archive_recorded === 457 && decision.canonical_baseline.archive_not_recorded === 122, 'archive partition changed');
expect(decision.canonical_baseline.detail_routes === 417 && decision.canonical_baseline.metadata_checked_routes === 417, 'route baseline changed');

const authorizedIds = decision.reviewed_candidates.authorized.map((candidate) => candidate.candidate_id);
const deferredIds = decision.reviewed_candidates.deferred.map((candidate) => candidate.candidate_id);
expect(JSON.stringify(authorizedIds) === JSON.stringify(selected), 'authorized candidate set changed');
expect(JSON.stringify(deferredIds) === JSON.stringify(deferred), 'deferred candidate set changed');
expect(decision.reviewed_candidates.authorized.every((candidate) => candidate.authorization === 'complete_record_implementation_only'), 'complete-record-only boundary changed');
expect(decision.reviewed_candidates.authorized[0].reference_asset === 'EUR', 'EUB reference asset changed');
expect(decision.reviewed_candidates.authorized[1].reference_asset === 'USD', 'USB reference asset changed');

expect(decision.decision.authorize_next_pr === 517, 'next PR changed');
expect(JSON.stringify(decision.decision.selected_candidate_ids) === JSON.stringify(selected), 'selected candidate order changed');
expect(decision.decision.maximum_new_canonical_assets === 2, 'maximum new assets changed');
expect(decision.decision.maximum_new_organizations === 1, 'maximum new organizations changed');
expect(decision.decision.paired_sibling_implementation_required === true, 'paired implementation boundary changed');
expect(decision.decision.partial_implementation_allowed_only_if_other_candidate_fails_entry_gate === true, 'partial implementation boundary changed');
expect(decision.decision.replacement_candidate_allowed === false, 'replacement candidate enabled');
expect(decision.decision.review_gate_after_pr517 === true, 'post-PR #517 review gate missing');
expect(decision.decision.canonical_changes_in_pr516 === 0 && decision.decision.public_changes_in_pr516 === 0, 'PR #516 permits canonical or public changes');
expect(decision.decision.automatic_promotion === false && decision.decision.automatic_canonical_pr_creation === false, 'automatic promotion boundary changed');
expect(decision.decision.ranking === false && decision.decision.score === false && decision.decision.recommendation === false, 'ranking or recommendation enabled');
expect(decision.decision.legacy_redirect_changes === 0, 'legacy redirect boundary changed');
expect(decision.next_boundary_after_pr517 === 'REVIEW_GATE', 'required exit changed');

expect(decision.pr517_entry_gate.complete_record_only === true && decision.pr517_entry_gate.thin_record_forbidden === true, 'complete-record gate changed');
expect(decision.pr517_entry_gate.fresh_duplicate_recheck_required === true, 'duplicate recheck missing');
expect(decision.pr517_entry_gate.fresh_manual_primary_source_review_required === true, 'fresh source review missing');
expect(decision.pr517_entry_gate.official_whitepaper_payload_review_required === true, 'whitepaper payload review missing');
expect(decision.pr517_entry_gate.exact_solana_mint_identity_search_required === true, 'Solana mint search missing');
expect(decision.pr517_entry_gate.exact_identifier_requires_second_authoritative_or_direct_onchain_confirmation === true, 'second identifier confirmation missing');
expect(decision.pr517_entry_gate.issuer_level_audit_claim_must_not_be_promoted_to_token_specific_attestation === true, 'audit claim boundary missing');
expect(decision.pr517_entry_gate.unsupported_values_must_remain_known_unknowns === true, 'known-unknown boundary missing');
expect(decision.pr517_entry_gate.unconfirmed_candidate_must_be_withheld === true, 'withhold boundary missing');
expect(decision.pr517_entry_gate.replacement_candidate_allowed === false, 'entry gate replacement enabled');
expect(decision.pr517_entry_gate.public_surface_change === false && decision.pr517_entry_gate.market_access_change === false && decision.pr517_entry_gate.ui_change === false, 'unrelated public work enabled');
expect(decision.pr517_entry_gate.legacy_redirect_change === false, 'entry gate legacy redirect enabled');

expect(auditConfig.status === 'reviewed_candidate_audit_complete', 'PR #515 audit config changed');
expect(auditConfig.reviewed_candidates === 8, 'PR #515 reviewed candidate count changed');
expect(JSON.stringify(auditConfig.ready_candidate_ids) === JSON.stringify(selected), 'PR #515 ready candidate set changed');
expect(audit.candidates.length === 8, 'PR #515 audit rows changed');
expect(JSON.stringify(audit.reviewed_result.ready_for_full_record_review) === JSON.stringify(selected), 'PR #515 reviewed result changed');
expect(auditHandoff.canonical_implementation_authorized === false, 'PR #515 handoff was retroactively changed');
expect(auditHandoff.required_next_decision.boundary === 'REVIEW_GATE', 'PR #515 handoff review gate changed');

expect(transition.status === 'reviewed_authority_transition', 'transition status changed');
expect(transition.source_audit_pr === 515 && transition.source_audit_merge_commit === 'e33bed83dead360570ab81907fbf4f237b63d136', 'transition source changed');
expect(transition.source_audit_production.verified === true, 'PR #515 production verification missing');
expect(transition.source_audit_production.run_id === 30787037820, 'production run changed');
expect(JSON.stringify(transition.authorized_next.candidate_ids) === JSON.stringify(selected), 'transition selected set changed');
expect(transition.authorized_next.pr === 517, 'transition next PR changed');
expect(transition.authorized_next.maximum_new_canonical_assets === 2 && transition.authorized_next.maximum_new_organizations === 1, 'transition maximums changed');
expect(transition.authorized_next.complete_record_only === true, 'transition complete-record boundary changed');
expect(transition.authorized_next.replacement_candidate_allowed === false, 'transition replacement enabled');
expect(transition.authorized_next.canonical_implementation_in_pr516 === false && transition.authorized_next.public_change_in_pr516 === false, 'transition permits PR #516 data changes');
expect(JSON.stringify(transition.deferred_candidate_ids) === JSON.stringify(deferred), 'transition deferred set changed');
expect(transition.required_exit_after_pr517 === 'REVIEW_GATE', 'transition exit changed');
expect(transition.legacy_redirect_changes === 0, 'transition legacy redirect changed');

expect(checkpoint.counts.assets === 117 && checkpoint.counts.organizations === 108 && checkpoint.counts.relationships === 129, 'canonical identity checkpoint changed');
expect(checkpoint.counts.events === 192 && checkpoint.counts.evidence === 579 && checkpoint.counts.evidence_relations === 579, 'canonical event or Evidence checkpoint changed');
expect(checkpoint.counts.deployments === 184 && checkpoint.counts.market_access_records === 8, 'canonical deployment checkpoint changed');
expect(checkpoint.counts.detail_routes === 417 && checkpoint.counts.metadata_checked_routes === 417, 'canonical route checkpoint changed');
expect(checkpoint.counts.archive_index_count === 457 && checkpoint.counts.archive_not_recorded_count === 122, 'canonical archive checkpoint changed');

expect(agents.includes('Repository authority: PR #516 active authority review'), 'AGENTS current authority missing');
expect(agents.includes('Authorized next implementation: PR #517 only'), 'AGENTS next PR boundary missing');
expect(agents.includes('Current production checkpoint: e33bed83dead360570ab81907fbf4f237b63d136'), 'AGENTS production checkpoint missing');
expect(agents.includes('No canonical work beyond PR #517 is currently authorized.'), 'AGENTS stop boundary missing');
expect(roadmap.includes('Status: PR #516 active authority review'), 'roadmap status missing');
expect(roadmap.includes('PR #517 — Record Growth Batch 5: Bison Bank EUB and USB'), 'roadmap authorized work missing');
expect(roadmap.includes('Later lanes remain planned but are not yet implementation-authorized.'), 'later lane boundary missing');
expect(amendment.includes('PR #517 may add at most two assets and one shared issuer organization.'), 'amendment maximum missing');
expect(amendment.includes('No replacement candidate is allowed.'), 'amendment replacement boundary missing');
expect(spec.includes('PR #516 changes authority only.'), 'spec authority-only boundary missing');
expect(spec.includes('PR #517 exits only to another mandatory REVIEW GATE'), 'spec exit boundary missing');
expect(active === "import './validate-record-growth-batch-5-review-gate-pr516.mjs';", 'active workstream is not wired to PR #516');

for (const file of [
  'config/record-growth-batch-5-review-gate-pr516.json',
  'docs/quality/record-growth-batch-5-review-gate-pr516-spec.md',
  'docs/roadmap-amendments/2026-08-03-record-growth-batch-5-review-gate.md',
  'docs/migration/record-growth-batch-5-review-gate-pr516.json'
]) expect(fs.existsSync(path.join(root, file)), `required PR #516 file missing: ${file}`);

if (failures.length) {
  console.error('PR #516 Record Growth Batch 5 review-gate validation failed:');
  failures.forEach((failure) => console.error('- ' + failure));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  authority_pr: 516,
  authorized_next_pr: 517,
  selected_candidate_ids: selected,
  deferred_candidate_ids: deferred,
  maximum_new_canonical_assets: 2,
  maximum_new_organizations: 1,
  canonical_changes_in_pr516: 0,
  public_changes_in_pr516: 0,
  legacy_redirect_changes: 0,
  required_exit_after_pr517: 'REVIEW_GATE'
}, null, 2));
