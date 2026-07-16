import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { buildEvidenceArchiveReviewHistoryV5Outputs } from './build-evidence-archive-review-history-v5-pr397.mjs';

const root = process.cwd();
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const git = (...args) => execFileSync('git', args, {
  cwd: root,
  encoding: 'utf8',
  stdio: ['ignore', 'pipe', 'pipe']
}).trim();
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const contract = readJson('config/evidence-archive-review-history-v5-pr397.json');
const authority = readJson('docs/migration/post-pr395-review-gate-pr396.json');
const manifest = readJson('docs/migration/evidence-archive-review-history-manifest-v5-pr397.json');
const audit = readJson('docs/migration/evidence-archive-review-history-audit-v5-pr397.json');
const priorContract = readJson('config/evidence-archive-review-history-v4-pr392.json');
const priorManifest = readJson('docs/migration/evidence-archive-review-history-manifest-v4-pr392.json');
const priorAudit = readJson('docs/migration/evidence-archive-review-history-audit-v4-pr392.json');
const pr395 = readJson('docs/migration/evidence-archive-maintenance-outcomes-pr395.json');
const checkpoint = readJson('docs/migration/current-canonical-checkpoint.json');
const outputs = buildEvidenceArchiveReviewHistoryV5Outputs();
const expected = contract.expected;

expect(same(manifest, outputs.manifest), 'committed History v5 manifest is not deterministic');
expect(same(audit, outputs.audit), 'committed History v5 audit is not deterministic');
expect(contract.review_pr === 397 && manifest.review_pr === 397 && audit.review_pr === 397, 'review PR identity changed');
expect(contract.contract_id === 'sog_evidence_archive_review_history_v5_pr397', 'contract ID changed');
expect(manifest.manifest_id === 'sog_evidence_archive_review_history_manifest_v5_pr397', 'manifest ID changed');
expect(audit.audit_id === 'sog_evidence_archive_review_history_audit_v5_pr397_2026_07_16', 'audit ID changed');
expect(manifest.contract_id === contract.contract_id && audit.contract_id === contract.contract_id, 'contract provenance mismatch');
expect(audit.source_manifest_id === manifest.manifest_id, 'audit manifest provenance mismatch');
expect(contract.prior_contract_id === priorContract.contract_id, 'prior contract provenance mismatch');
expect(manifest.prior_manifest_id === priorManifest.manifest_id, 'prior manifest provenance mismatch');
expect(audit.prior_audit_id === priorAudit.audit_id, 'prior audit provenance mismatch');
expect(manifest.public_output === false && audit.public_output === false, 'History v5 outputs must remain internal');

expect(authority.decisions?.evidence_archive_review_history_contract_v5?.pr === 397, 'PR #396 authority for PR #397 changed');
expect(authority.decisions?.evidence_archive_review_history_contract_v5?.decision === 'approved_internal', 'PR #396 History v5 decision changed');
expect(authority.expected_history_v5.sources === expected.history_source_count, 'authority source count changed');
expect(authority.expected_history_v5.events === expected.history_event_count, 'authority event count changed');
expect(authority.expected_history_v5.identities === expected.reviewed_evidence_identity_count, 'authority identity count changed');
expect(authority.activation_rule === 'PR #397 must update AGENTS.md and docs/roadmap.md before generating History v5 outputs.', 'authority activation rule changed');

const counts = manifest.counts;
for (const [field, value] of Object.entries(expected)) {
  if (field === 'current_reviewed_reactivated_evidence_ids') continue;
  expect(counts[field] === value, `${field} mismatch`);
}
expect(manifest.history_events.length === counts.history_event_count, 'history event array count mismatch');
expect(manifest.effective_evidence_identities.length === counts.reviewed_evidence_identity_count, 'effective identity array count mismatch');
expect(new Set(manifest.history_events.map((row) => row.event_id)).size === manifest.history_events.length, 'history event IDs are not unique');
expect(new Set(manifest.effective_evidence_identities.map((row) => row.evidence_id)).size === manifest.effective_evidence_identities.length, 'effective Evidence IDs are not unique');
expect(same(manifest.sources.map((row) => row.review_pr), [360, 365, 380, 385, 390, 395]), 'history source order changed');
for (const pr of [360, 365, 380, 385, 390, 395]) {
  expect(manifest.history_events.filter((row) => row.review_pr === pr).length === 10, `PR #${pr} event count changed`);
}
expect(manifest.sources.slice(0, 5).every((row, index) => same(row, priorManifest.sources[index])), 'History v4 source rows were rewritten');
expect(manifest.history_events.slice(0, 50).every((row, index) => same(row, priorManifest.history_events[index])), 'History v4 events were rewritten');

expect(audit.source_checkpoint.canonical_evidence_count === 559, 'audit Evidence count changed');
expect(audit.source_checkpoint.evidence_relation_count === 559, 'audit Evidence Relation count changed');
expect(audit.source_checkpoint.archive_recorded === 425, 'audit archive count changed');
expect(audit.source_checkpoint.archive_not_recorded === 134, 'audit no-archive count changed');
expect(checkpoint.expected_counts.evidence === 559, 'checkpoint Evidence count changed');
expect(checkpoint.evidence_quality.archive_index_count === 425, 'checkpoint archive count changed');
expect(checkpoint.evidence_quality.archive_not_recorded_count === 134, 'checkpoint no-archive count changed');

const unresolved = audit.reviewed_unresolved;
expect(unresolved.total_count === 13 && unresolved.suppressed_count === 13, 'audit unresolved/suppressed count changed');
expect(unresolved.reactivated_eligible_count === 0, 'audit reactivated count changed');
expect(unresolved.rows.length === unresolved.total_count, 'audit unresolved row count changed');
expect(unresolved.suppressed_evidence_ids.length === unresolved.suppressed_count, 'audit suppressed ID count changed');
expect(same(unresolved.reactivated_eligible_evidence_ids, expected.current_reviewed_reactivated_evidence_ids), 'reviewed-reactivated identities changed');
expect(unresolved.suppressed_evidence_ids.includes('sog_src_makerdao_docs_dai'), 'Sky Dai no-safe identity missing');
expect(unresolved.suppressed_evidence_ids.includes('sog_src_busd_reuters_sec_2024'), 'invalid archive removal identity missing');

const maker = manifest.effective_evidence_identities.find((row) => row.evidence_id === 'sog_src_makerdao_docs_dai');
expect(maker?.effective_review_outcome === 'reviewed_no_safe_change', 'Sky Dai outcome changed');
expect(maker?.current_archived_url == null, 'Sky Dai unexpectedly has an archive');
expect(maker?.eligibility_state_without_new_signal === 'suppressed_reviewed_no_safe_change', 'Sky Dai suppression changed');
expect(maker?.candidate_eligible_under_contract === false, 'Sky Dai is unexpectedly queue-eligible');

const pr395Changed = pr395.outcomes.filter((row) => row.decision === 'dated_exact_archive_added').map((row) => row.evidence_id);
expect(pr395Changed.length === 9, 'PR #395 exact archive outcome count changed');
for (const evidenceId of pr395Changed) {
  const row = manifest.effective_evidence_identities.find((item) => item.evidence_id === evidenceId);
  expect(row?.effective_review_outcome === 'reviewed_archive_present', `${evidenceId}: not archive-present`);
  expect(Boolean(row?.current_archived_url), `${evidenceId}: current archive missing`);
  expect(row?.candidate_eligible_under_contract === false, `${evidenceId}: remains queue-eligible`);
}

expect(audit.decision.contract_complete === true, 'History v5 contract is not complete');
expect(audit.decision.next_work_item === 'PR #398 Evidence Archive Maintenance Queue v6 Refresh', 'History v5 handoff changed');
expect(audit.decision.archive_queue_generation_allowed_in_pr397 === false, 'PR #397 unexpectedly generated a queue');
expect(audit.decision.canonical_data_change_allowed === false && audit.decision.public_surface_change_allowed === false, 'History v5 canonical/public boundary changed');
expect(Object.values(audit.boundaries).every((value) => value === false), 'History v5 audit boundary changed');
expect(manifest.manifest_digest_sha256 === audit.manifest_digest_sha256, 'manifest/audit digest mismatch');
expect(manifest.source_digest_sha256 === audit.source_digest_sha256, 'source digest mismatch');

let originMainAvailable = false;
try { git('rev-parse', '--verify', 'origin/main'); originMainAvailable = true; } catch {}
if (originMainAvailable) {
  for (const file of [
    'config/evidence-archive-review-history-v4-pr392.json',
    'docs/migration/evidence-archive-review-history-manifest-v4-pr392.json',
    'docs/migration/evidence-archive-review-history-audit-v4-pr392.json',
    'docs/migration/evidence-archive-maintenance-outcomes-pr395.json',
    'docs/migration/post-pr395-review-gate-pr396.json',
    'docs/migration/current-canonical-checkpoint.json',
    'docs/migration/current-stats-history-checkpoint.json',
    'docs/migration/registry-release-integrity-baseline.json'
  ]) {
    try {
      expect(git('hash-object', file) === git('rev-parse', `origin/main:${file}`), `${file}: immutable Git blob identity changed`);
    } catch (error) {
      failures.push(`${file}: unable to verify origin/main blob identity: ${error.message}`);
    }
  }
}

for (const [file, markers] of [
  ['AGENTS.md', ['PR #397 Evidence Archive Review-History Contract v5 Update: active; complete on merge', 'history sources: 6', 'reviewed reactivated eligible: 0', 'PR #398 Evidence Archive Maintenance Queue v6 Refresh: approved next']],
  ['docs/roadmap.md', ['Status: canonical execution schedule — PR #397 active', 'reviewed Evidence identities: 58', 'reviewed unresolved suppressed: 13', 'PR #398 Evidence Archive Maintenance Queue v6 Refresh']],
  ['docs/quality/evidence-archive-review-history-contract-v5-pr397-spec.md', ['History v5', 'reviewed reactivated eligible: 0', 'PR #398 Evidence Archive Maintenance Queue v6 Refresh']],
  ['docs/roadmap-amendments/2026-07-16-pr397-evidence-archive-review-history-v5-activation.md', ['history events: 60', 'source replacement: 0', 'PR #398 Evidence Archive Maintenance Queue v6 Refresh']]
]) {
  const value = readText(file);
  for (const marker of markers) expect(value.includes(marker), `${file}: missing authority marker ${marker}`);
}

for (const file of [
  'public/data/evidence-archive-review-history-manifest-v5-pr397.json',
  'public/data/evidence-archive-review-history-audit-v5-pr397.json',
  'src/pages/evidence-archive-review-history-v5.astro'
]) {
  expect(!fs.existsSync(path.join(root, file)), `${file}: internal output leaked into public surface`);
}

if (failures.length) {
  console.error('PR #397 Evidence Archive Review-History v5 validation failed:');
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
