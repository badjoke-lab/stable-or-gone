import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { buildEvidenceArchiveReviewHistoryV3Outputs } from './build-evidence-archive-review-history-v3-pr387.mjs';

const root = process.cwd();
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const contract = readJson('config/evidence-archive-review-history-v3-pr387.json');
const authority = readJson('docs/migration/post-pr385-review-gate-pr386.json');
const manifest = readJson('docs/migration/evidence-archive-review-history-manifest-v3-pr387.json');
const audit = readJson('docs/migration/evidence-archive-review-history-audit-v3-pr387.json');
const priorManifest = readJson('docs/migration/evidence-archive-review-history-manifest-v2-pr382.json');
const priorAudit = readJson('docs/migration/evidence-archive-review-history-audit-v2-pr382.json');
const checkpoint = readJson('docs/migration/current-canonical-checkpoint.json');
const outputs = buildEvidenceArchiveReviewHistoryV3Outputs();
const expected = contract.expected;

expect(same(manifest, outputs.manifest), 'committed History v3 manifest is not deterministic');
expect(same(audit, outputs.audit), 'committed History v3 audit is not deterministic');
expect(contract.review_pr === 387 && manifest.review_pr === 387 && audit.review_pr === 387, 'review PR identity changed');
expect(contract.contract_id === 'sog_evidence_archive_review_history_v3_pr387', 'contract ID changed');
expect(manifest.manifest_id === 'sog_evidence_archive_review_history_manifest_v3_pr387', 'manifest ID changed');
expect(audit.audit_id === 'sog_evidence_archive_review_history_audit_v3_pr387_2026_07_16', 'audit ID changed');
expect(manifest.contract_id === contract.contract_id && audit.contract_id === contract.contract_id, 'contract provenance mismatch');
expect(audit.source_manifest_id === manifest.manifest_id, 'audit manifest provenance mismatch');
expect(manifest.prior_manifest_id === priorManifest.manifest_id, 'prior manifest provenance mismatch');
expect(audit.prior_audit_id === priorAudit.audit_id, 'prior audit provenance mismatch');
expect(manifest.public_output === false && audit.public_output === false, 'History v3 outputs must remain internal');

expect(authority.decisions?.evidence_archive_review_history_contract_v3?.pr === 387, 'PR #386 authority for PR #387 changed');
expect(authority.decisions?.evidence_archive_review_history_contract_v3?.decision === 'approved_internal', 'PR #386 History v3 decision changed');
expect(authority.expected_history_v3.sources === expected.history_source_count, 'authority History v3 source count changed');
expect(authority.expected_history_v3.events === expected.history_event_count, 'authority History v3 event count changed');
expect(authority.expected_history_v3.identities === expected.reviewed_evidence_identity_count, 'authority History v3 identity count changed');

const counts = manifest.counts;
expect(counts.history_source_count === expected.history_source_count, 'history source count mismatch');
expect(counts.history_event_count === expected.history_event_count, 'history event count mismatch');
expect(counts.reviewed_evidence_identity_count === expected.reviewed_evidence_identity_count, 'reviewed identity count mismatch');
expect(counts.effective_archive_present_count === expected.effective_archive_present_count, 'archive-present count mismatch');
expect(counts.effective_archive_removed_invalid_count === expected.effective_archive_removed_invalid_count, 'invalid-removal count mismatch');
expect(counts.effective_no_safe_change_count === expected.effective_no_safe_change_count, 'no-safe-change count mismatch');
expect(counts.effective_source_replacement_count === expected.effective_source_replacement_count, 'source-replacement count mismatch');
expect(counts.current_archive_not_recorded_count === expected.current_archive_not_recorded_count, 'current archive-not-recorded count mismatch');
expect(counts.current_reviewed_unresolved_total_count === expected.current_reviewed_unresolved_total_count, 'unresolved total mismatch');
expect(counts.current_reviewed_suppressed_count === expected.current_reviewed_suppressed_count, 'suppressed count mismatch');
expect(counts.current_reviewed_reactivated_eligible_count === expected.current_reviewed_reactivated_eligible_count, 'reactivated count mismatch');
expect(manifest.history_events.length === counts.history_event_count, 'history event array count mismatch');
expect(manifest.effective_evidence_identities.length === counts.reviewed_evidence_identity_count, 'effective identity array count mismatch');
expect(new Set(manifest.history_events.map((row) => row.event_id)).size === manifest.history_events.length, 'history event IDs are not unique');
expect(new Set(manifest.effective_evidence_identities.map((row) => row.evidence_id)).size === manifest.effective_evidence_identities.length, 'effective Evidence IDs are not unique');
expect(same(manifest.sources.map((row) => row.review_pr), [360, 365, 380, 385]), 'history source order changed');
expect(manifest.history_events.filter((row) => row.review_pr === 360).length === 10, 'PR #360 event count changed');
expect(manifest.history_events.filter((row) => row.review_pr === 365).length === 10, 'PR #365 event count changed');
expect(manifest.history_events.filter((row) => row.review_pr === 380).length === 10, 'PR #380 event count changed');
expect(manifest.history_events.filter((row) => row.review_pr === 385).length === 10, 'PR #385 event count changed');

expect(audit.source_checkpoint.canonical_evidence_count === 559, 'audit Evidence count changed');
expect(audit.source_checkpoint.evidence_relation_count === 559, 'audit Evidence Relation count changed');
expect(audit.source_checkpoint.archive_recorded === 406, 'audit archive count changed');
expect(audit.source_checkpoint.archive_not_recorded === 153, 'audit no-archive count changed');
expect(checkpoint.expected_counts.evidence === 559, 'checkpoint Evidence count changed');
expect(checkpoint.evidence_quality.archive_index_count === 406, 'checkpoint archive count changed');
expect(checkpoint.evidence_quality.archive_not_recorded_count === 153, 'checkpoint no-archive count changed');

const unresolved = audit.reviewed_unresolved;
expect(unresolved.total_count === expected.current_reviewed_unresolved_total_count, 'audit unresolved total changed');
expect(unresolved.suppressed_count === expected.current_reviewed_suppressed_count, 'audit suppressed count changed');
expect(unresolved.reactivated_eligible_count === expected.current_reviewed_reactivated_eligible_count, 'audit reactivated count changed');
expect(unresolved.rows.length === unresolved.total_count, 'audit unresolved row count changed');
expect(unresolved.suppressed_evidence_ids.length === unresolved.suppressed_count, 'audit suppressed ID count changed');
expect(unresolved.reactivated_eligible_evidence_ids.length === unresolved.reactivated_eligible_count, 'audit reactivated ID count changed');
expect(same(unresolved.reactivated_eligible_evidence_ids, expected.current_reviewed_reactivated_evidence_ids), 'reviewed-reactivated identity changed');
expect(unresolved.reactivated_eligible_evidence_ids[0] === 'sog_src_fdusd_site', 'FDUSD is not the reviewed-reactivated identity');
expect(!unresolved.reactivated_eligible_evidence_ids.includes('sog_src_eurc_mint_page'), 'Circle Mint remained incorrectly reactivated');
expect(unresolved.suppressed_evidence_ids.includes('sog_src_fei_addresses_batch_a'), 'Fei addresses no-safe identity missing');
expect(unresolved.suppressed_evidence_ids.includes('sog_src_fei_tip121c_execution_2022'), 'Fei TIP-121c no-safe identity missing');

const circle = manifest.effective_evidence_identities.find((row) => row.evidence_id === 'sog_src_eurc_mint_page');
expect(circle?.effective_review_outcome === 'reviewed_archive_present', 'Circle Mint effective outcome changed');
expect(Boolean(circle?.current_archived_url), 'Circle Mint current archive missing');
expect(circle?.candidate_eligible_under_contract === false, 'Circle Mint remains queue-eligible');
const fdusd = manifest.effective_evidence_identities.find((row) => row.evidence_id === 'sog_src_fdusd_site');
expect(fdusd?.effective_review_outcome === 'reviewed_source_replacement', 'FDUSD effective outcome changed');
expect(fdusd?.current_archived_url === null, 'FDUSD unexpectedly has an archive');
expect(fdusd?.eligibility_state_without_new_signal === 'reactivated_reviewed_source_replacement', 'FDUSD eligibility state changed');
expect(fdusd?.candidate_eligible_under_contract === true, 'FDUSD reviewed reactivation missing');
expect(fdusd?.reactivation_signal_present === true && fdusd?.reactivation_signal_type === 'reviewed_source_replacement', 'FDUSD reactivation signal changed');

expect(audit.decision.contract_complete === true, 'History v3 contract is not complete');
expect(audit.decision.next_work_item === 'PR #388 Evidence Archive Maintenance Queue v4 Refresh', 'History v3 handoff changed');
expect(audit.decision.archive_queue_generation_allowed_in_pr387 === false, 'PR #387 unexpectedly generated a queue');
expect(audit.decision.canonical_data_change_allowed === false && audit.decision.public_surface_change_allowed === false, 'History v3 canonical/public boundary changed');
expect(Object.values(audit.boundaries).every((value) => value === false), 'History v3 audit boundary changed');
expect(manifest.manifest_digest_sha256 === audit.manifest_digest_sha256, 'manifest/audit digest mismatch');
expect(manifest.source_digest_sha256 === audit.source_digest_sha256, 'source digest mismatch');

let originMainAvailable = false;
try { git('rev-parse', '--verify', 'origin/main'); originMainAvailable = true; } catch {}
if (originMainAvailable) {
  for (const file of [
    'config/evidence-archive-review-history-v2-pr382.json',
    'docs/migration/evidence-archive-review-history-manifest-v2-pr382.json',
    'docs/migration/evidence-archive-review-history-audit-v2-pr382.json',
    'docs/migration/evidence-correction-outcomes-pr360.json',
    'docs/migration/evidence-archive-maintenance-outcomes-pr365.json',
    'docs/migration/evidence-archive-maintenance-outcomes-pr380.json',
    'docs/migration/evidence-archive-maintenance-outcomes-pr385.json',
    'docs/migration/post-pr385-review-gate-pr386.json',
    'docs/migration/current-canonical-checkpoint.json'
  ]) {
    try {
      expect(git('hash-object', file) === git('rev-parse', `origin/main:${file}`), `${file}: immutable Git blob identity changed`);
    } catch (error) {
      failures.push(`${file}: unable to verify origin/main blob identity: ${error.message}`);
    }
  }
}

for (const [file, markers] of [
  ['AGENTS.md', ['PR #387 Evidence Archive Review-History Contract v3 Update: active; complete on merge', 'history sources: 4', 'sog_src_fdusd_site', 'PR #388 Evidence Archive Maintenance Queue v4 Refresh: approved next']],
  ['docs/roadmap.md', ['Status: canonical execution schedule — PR #387 active', 'reviewed Evidence identities: 39', 'reviewed unresolved suppressed: 12', 'PR #388 Evidence Archive Maintenance Queue v4 Refresh']],
  ['docs/quality/evidence-archive-review-history-contract-v3-pr387-spec.md', ['History v3', 'reviewed reactivated eligible: 1', 'PR #388 Evidence Archive Maintenance Queue v4 Refresh']],
  ['docs/roadmap-amendments/2026-07-16-pr387-evidence-archive-review-history-v3-activation.md', ['history events: 40', 'sog_src_fdusd_site', 'PR #388 Evidence Archive Maintenance Queue v4 Refresh']]
]) {
  const value = readText(file);
  for (const marker of markers) expect(value.includes(marker), `${file}: missing authority marker ${marker}`);
}

for (const file of [
  'public/data/evidence-archive-review-history-manifest-v3-pr387.json',
  'public/data/evidence-archive-review-history-audit-v3-pr387.json',
  'src/pages/evidence-archive-review-history-v3.astro'
]) expect(!fs.existsSync(path.join(root, file)), `${file}: internal output leaked into public surface`);

if (failures.length) {
  console.error('PR #387 Evidence Archive Review-History v3 validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  manifest_id: manifest.manifest_id,
  history_sources: counts.history_source_count,
  history_events: counts.history_event_count,
  reviewed_evidence_identities: counts.reviewed_evidence_identity_count,
  archive_present: counts.effective_archive_present_count,
  archive_removed_invalid: counts.effective_archive_removed_invalid_count,
  no_safe_change: counts.effective_no_safe_change_count,
  source_replacement: counts.effective_source_replacement_count,
  reviewed_unresolved_total: unresolved.total_count,
  reviewed_suppressed: unresolved.suppressed_count,
  reviewed_reactivated_eligible: unresolved.reactivated_eligible_count,
  next_work_item: audit.decision.next_work_item
}, null, 2));
