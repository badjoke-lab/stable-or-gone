import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { buildEvidenceArchiveReviewHistoryV4Outputs } from './build-evidence-archive-review-history-v4-pr392.mjs';

const root = process.cwd();
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const contract = readJson('config/evidence-archive-review-history-v4-pr392.json');
const authority = readJson('docs/migration/post-pr390-review-gate-pr391.json');
const manifest = readJson('docs/migration/evidence-archive-review-history-manifest-v4-pr392.json');
const audit = readJson('docs/migration/evidence-archive-review-history-audit-v4-pr392.json');
const priorContract = readJson('config/evidence-archive-review-history-v3-pr387.json');
const priorManifest = readJson('docs/migration/evidence-archive-review-history-manifest-v3-pr387.json');
const priorAudit = readJson('docs/migration/evidence-archive-review-history-audit-v3-pr387.json');
const checkpoint = readJson('docs/migration/current-canonical-checkpoint.json');
const outputs = buildEvidenceArchiveReviewHistoryV4Outputs();
const expected = contract.expected;

expect(same(manifest, outputs.manifest), 'committed History v4 manifest is not deterministic');
expect(same(audit, outputs.audit), 'committed History v4 audit is not deterministic');
expect(contract.review_pr === 392 && manifest.review_pr === 392 && audit.review_pr === 392, 'review PR identity changed');
expect(contract.contract_id === 'sog_evidence_archive_review_history_v4_pr392', 'contract ID changed');
expect(manifest.manifest_id === 'sog_evidence_archive_review_history_manifest_v4_pr392', 'manifest ID changed');
expect(audit.audit_id === 'sog_evidence_archive_review_history_audit_v4_pr392_2026_07_16', 'audit ID changed');
expect(manifest.contract_id === contract.contract_id && audit.contract_id === contract.contract_id, 'contract provenance mismatch');
expect(audit.source_manifest_id === manifest.manifest_id, 'audit manifest provenance mismatch');
expect(contract.prior_contract_id === priorContract.contract_id, 'prior contract provenance mismatch');
expect(manifest.prior_manifest_id === priorManifest.manifest_id, 'prior manifest provenance mismatch');
expect(audit.prior_audit_id === priorAudit.audit_id, 'prior audit provenance mismatch');
expect(manifest.public_output === false && audit.public_output === false, 'History v4 outputs must remain internal');

expect(authority.decisions?.evidence_archive_review_history_contract_v4?.pr === 392, 'PR #391 authority for PR #392 changed');
expect(authority.decisions?.evidence_archive_review_history_contract_v4?.decision === 'approved_internal', 'PR #391 History v4 decision changed');
expect(authority.expected_history_v4.sources === expected.history_source_count, 'authority source count changed');
expect(authority.expected_history_v4.events === expected.history_event_count, 'authority event count changed');
expect(authority.expected_history_v4.identities === expected.reviewed_evidence_identity_count, 'authority identity count changed');

const counts = manifest.counts;
expect(counts.history_source_count === expected.history_source_count, 'history source count mismatch');
expect(counts.history_event_count === expected.history_event_count, 'history event count mismatch');
expect(counts.reviewed_evidence_identity_count === expected.reviewed_evidence_identity_count, 'reviewed identity count mismatch');
expect(counts.effective_archive_present_count === expected.effective_archive_present_count, 'archive-present count mismatch');
expect(counts.effective_archive_removed_invalid_count === expected.effective_archive_removed_invalid_count, 'invalid-removal count mismatch');
expect(counts.effective_no_safe_change_count === expected.effective_no_safe_change_count, 'no-safe-change count mismatch');
expect(counts.effective_source_replacement_count === expected.effective_source_replacement_count, 'source-replacement count mismatch');
expect(counts.current_archive_not_recorded_count === expected.current_archive_not_recorded_count, 'archive-not-recorded count mismatch');
expect(counts.current_reviewed_unresolved_total_count === expected.current_reviewed_unresolved_total_count, 'unresolved total mismatch');
expect(counts.current_reviewed_suppressed_count === expected.current_reviewed_suppressed_count, 'suppressed count mismatch');
expect(counts.current_reviewed_reactivated_eligible_count === expected.current_reviewed_reactivated_eligible_count, 'reactivated count mismatch');
expect(manifest.history_events.length === counts.history_event_count, 'history event array count mismatch');
expect(manifest.effective_evidence_identities.length === counts.reviewed_evidence_identity_count, 'effective identity array count mismatch');
expect(new Set(manifest.history_events.map((row) => row.event_id)).size === manifest.history_events.length, 'history event IDs are not unique');
expect(new Set(manifest.effective_evidence_identities.map((row) => row.evidence_id)).size === manifest.effective_evidence_identities.length, 'effective Evidence IDs are not unique');
expect(same(manifest.sources.map((row) => row.review_pr), [360, 365, 380, 385, 390]), 'history source order changed');
for (const pr of [360, 365, 380, 385, 390]) expect(manifest.history_events.filter((row) => row.review_pr === pr).length === 10, `PR #${pr} event count changed`);

expect(audit.source_checkpoint.canonical_evidence_count === 559, 'audit Evidence count changed');
expect(audit.source_checkpoint.evidence_relation_count === 559, 'audit Evidence Relation count changed');
expect(audit.source_checkpoint.archive_recorded === 416, 'audit archive count changed');
expect(audit.source_checkpoint.archive_not_recorded === 143, 'audit no-archive count changed');
expect(checkpoint.expected_counts.evidence === 559, 'checkpoint Evidence count changed');
expect(checkpoint.evidence_quality.archive_index_count === 416, 'checkpoint archive count changed');
expect(checkpoint.evidence_quality.archive_not_recorded_count === 143, 'checkpoint no-archive count changed');

const unresolved = audit.reviewed_unresolved;
expect(unresolved.total_count === 12 && unresolved.suppressed_count === 12, 'audit unresolved/suppressed count changed');
expect(unresolved.reactivated_eligible_count === 0, 'audit reactivated count changed');
expect(unresolved.rows.length === unresolved.total_count, 'audit unresolved row count changed');
expect(unresolved.suppressed_evidence_ids.length === unresolved.suppressed_count, 'audit suppressed ID count changed');
expect(unresolved.reactivated_eligible_evidence_ids.length === 0, 'unexpected reviewed-reactivated identity');
expect(same(unresolved.reactivated_eligible_evidence_ids, expected.current_reviewed_reactivated_evidence_ids), 'reviewed-reactivated identities changed');
expect(unresolved.suppressed_evidence_ids.includes('sog_src_fei_addresses_batch_a'), 'Fei addresses no-safe identity missing');
expect(unresolved.suppressed_evidence_ids.includes('sog_src_busd_reuters_sec_2024'), 'invalid archive removal identity missing');

const fdusd = manifest.effective_evidence_identities.find((row) => row.evidence_id === 'sog_src_fdusd_site');
expect(fdusd?.effective_review_outcome === 'reviewed_archive_present', 'FDUSD is not archive-present');
expect(Boolean(fdusd?.current_archived_url), 'FDUSD current archive missing');
expect(fdusd?.eligibility_state_without_new_signal === 'not_eligible_archive_present', 'FDUSD eligibility state changed');
expect(fdusd?.candidate_eligible_under_contract === false, 'FDUSD remains queue-eligible');
expect(fdusd?.reactivation_signal_present === false && fdusd?.reactivation_signal_type === null, 'FDUSD reactivation signal remains');

expect(audit.decision.contract_complete === true, 'History v4 contract is not complete');
expect(audit.decision.next_work_item === 'PR #393 Evidence Archive Maintenance Queue v5 Refresh', 'History v4 handoff changed');
expect(audit.decision.archive_queue_generation_allowed_in_pr392 === false, 'PR #392 unexpectedly generated a queue');
expect(audit.decision.canonical_data_change_allowed === false && audit.decision.public_surface_change_allowed === false, 'History v4 canonical/public boundary changed');
expect(Object.values(audit.boundaries).every((value) => value === false), 'History v4 audit boundary changed');
expect(manifest.manifest_digest_sha256 === audit.manifest_digest_sha256, 'manifest/audit digest mismatch');
expect(manifest.source_digest_sha256 === audit.source_digest_sha256, 'source digest mismatch');

let originMainAvailable = false;
try { git('rev-parse', '--verify', 'origin/main'); originMainAvailable = true; } catch {}
if (originMainAvailable) {
  for (const file of [
    'config/evidence-archive-review-history-v3-pr387.json',
    'docs/migration/evidence-archive-review-history-manifest-v3-pr387.json',
    'docs/migration/evidence-archive-review-history-audit-v3-pr387.json',
    'docs/migration/evidence-correction-outcomes-pr360.json',
    'docs/migration/evidence-archive-maintenance-outcomes-pr365.json',
    'docs/migration/evidence-archive-maintenance-outcomes-pr380.json',
    'docs/migration/evidence-archive-maintenance-outcomes-pr385.json',
    'docs/migration/evidence-archive-maintenance-outcomes-pr390.json',
    'docs/migration/post-pr390-review-gate-pr391.json',
    'docs/migration/current-canonical-checkpoint.json'
  ]) {
    try { expect(git('hash-object', file) === git('rev-parse', `origin/main:${file}`), `${file}: immutable Git blob identity changed`); }
    catch (error) { failures.push(`${file}: unable to verify origin/main blob identity: ${error.message}`); }
  }
}

for (const [file, markers] of [
  ['AGENTS.md', ['PR #392 Evidence Archive Review-History Contract v4 Update: active; complete on merge', 'history sources: 5', 'reviewed reactivated eligible: 0', 'PR #393 Evidence Archive Maintenance Queue v5 Refresh: approved next']],
  ['docs/roadmap.md', ['Status: canonical execution schedule — PR #392 active', 'reviewed Evidence identities: 48', 'reviewed unresolved suppressed: 12', 'PR #393 Evidence Archive Maintenance Queue v5 Refresh']],
  ['docs/quality/evidence-archive-review-history-contract-v4-pr392-spec.md', ['History v4', 'reviewed reactivated eligible: 0', 'PR #393 Evidence Archive Maintenance Queue v5 Refresh']],
  ['docs/roadmap-amendments/2026-07-16-pr392-evidence-archive-review-history-v4-activation.md', ['history events: 50', 'source replacement: 0', 'PR #393 Evidence Archive Maintenance Queue v5 Refresh']]
]) {
  const value = readText(file);
  for (const marker of markers) expect(value.includes(marker), `${file}: missing authority marker ${marker}`);
}

for (const file of [
  'public/data/evidence-archive-review-history-manifest-v4-pr392.json',
  'public/data/evidence-archive-review-history-audit-v4-pr392.json',
  'src/pages/evidence-archive-review-history-v4.astro'
]) expect(!fs.existsSync(path.join(root, file)), `${file}: internal output leaked into public surface`);

if (failures.length) {
  console.error('PR #392 Evidence Archive Review-History v4 validation failed:');
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
