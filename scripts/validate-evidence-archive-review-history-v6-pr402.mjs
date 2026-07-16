import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { buildEvidenceArchiveReviewHistoryV6Outputs } from './build-evidence-archive-review-history-v6-pr402.mjs';

const root = process.cwd();
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const contract = readJson('config/evidence-archive-review-history-v6-pr402.json');
const authority = readJson('docs/migration/post-pr400-review-gate-pr401.json');
const manifest = readJson('docs/migration/evidence-archive-review-history-manifest-v6-pr402.json');
const audit = readJson('docs/migration/evidence-archive-review-history-audit-v6-pr402.json');
const priorContract = readJson('config/evidence-archive-review-history-v5-pr397.json');
const priorManifest = readJson('docs/migration/evidence-archive-review-history-manifest-v5-pr397.json');
const priorAudit = readJson('docs/migration/evidence-archive-review-history-audit-v5-pr397.json');
const pr400 = readJson('docs/migration/evidence-archive-maintenance-outcomes-pr400.json');
const checkpoint = readJson('docs/migration/current-canonical-checkpoint.json');
const outputs = buildEvidenceArchiveReviewHistoryV6Outputs();
const expected = contract.expected;

expect(same(manifest, outputs.manifest), 'committed History v6 manifest is not deterministic');
expect(same(audit, outputs.audit), 'committed History v6 audit is not deterministic');
expect(contract.review_pr === 402 && manifest.review_pr === 402 && audit.review_pr === 402, 'review PR identity changed');
expect(contract.contract_id === 'sog_evidence_archive_review_history_v6_pr402', 'contract ID changed');
expect(manifest.manifest_id === 'sog_evidence_archive_review_history_manifest_v6_pr402', 'manifest ID changed');
expect(audit.audit_id === 'sog_evidence_archive_review_history_audit_v6_pr402_2026_07_16', 'audit ID changed');
expect(manifest.contract_id === contract.contract_id && audit.contract_id === contract.contract_id, 'contract provenance mismatch');
expect(audit.source_manifest_id === manifest.manifest_id, 'audit manifest provenance mismatch');
expect(contract.prior_contract_id === priorContract.contract_id, 'prior contract provenance mismatch');
expect(manifest.prior_manifest_id === priorManifest.manifest_id, 'prior manifest provenance mismatch');
expect(audit.prior_audit_id === priorAudit.audit_id, 'prior audit provenance mismatch');
expect(manifest.public_output === false && audit.public_output === false, 'History v6 outputs must remain internal');

expect(authority.decisions?.evidence_archive_review_history_contract_v6?.pr === 402, 'PR #401 authority for PR #402 changed');
expect(authority.decisions?.evidence_archive_review_history_contract_v6?.decision === 'approved_internal', 'PR #401 History v6 decision changed');
expect(authority.expected_history_v6.sources === expected.history_source_count, 'authority source count changed');
expect(authority.expected_history_v6.events === expected.history_event_count, 'authority event count changed');
expect(authority.expected_history_v6.identities === expected.reviewed_evidence_identity_count, 'authority identity count changed');
expect(authority.activation_rule === 'PR #402 must update AGENTS.md and docs/roadmap.md before generating History v6 outputs.', 'authority activation rule changed');

const counts = manifest.counts;
for (const [field, value] of Object.entries(expected)) {
  if (field === 'current_reviewed_reactivated_evidence_ids') continue;
  expect(counts[field] === value, `${field} mismatch`);
}
expect(manifest.history_events.length === 70, 'history event array count changed');
expect(manifest.effective_evidence_identities.length === 68, 'effective identity array count changed');
expect(new Set(manifest.history_events.map((row) => row.event_id)).size === 70, 'history event IDs are not unique');
expect(new Set(manifest.effective_evidence_identities.map((row) => row.evidence_id)).size === 68, 'effective Evidence IDs are not unique');
expect(same(manifest.sources.map((row) => row.review_pr), [360, 365, 380, 385, 390, 395, 400]), 'history source order changed');
for (const pr of [360, 365, 380, 385, 390, 395, 400]) {
  expect(manifest.history_events.filter((row) => row.review_pr === pr).length === 10, `PR #${pr} event count changed`);
}
expect(manifest.sources.slice(0, 6).every((row, index) => same(row, priorManifest.sources[index])), 'History v5 source rows were rewritten');
expect(manifest.history_events.slice(0, 60).every((row, index) => same(row, priorManifest.history_events[index])), 'History v5 events were rewritten');

expect(checkpoint.expected_counts.evidence === 559, 'checkpoint Evidence count changed');
expect(checkpoint.evidence_quality.archive_index_count === 430, 'checkpoint archive count changed');
expect(checkpoint.evidence_quality.archive_not_recorded_count === 129, 'checkpoint no-archive count changed');
expect(audit.source_checkpoint.canonical_evidence_count === 559, 'audit Evidence count changed');
expect(audit.source_checkpoint.evidence_relation_count === 559, 'audit Evidence Relation count changed');
expect(audit.source_checkpoint.archive_recorded === 430, 'audit archive count changed');
expect(audit.source_checkpoint.archive_not_recorded === 129, 'audit no-archive count changed');

const unresolved = audit.reviewed_unresolved;
expect(unresolved.total_count === 18 && unresolved.suppressed_count === 18, 'audit unresolved/suppressed count changed');
expect(unresolved.reactivated_eligible_count === 0, 'audit reactivated count changed');
expect(unresolved.rows.length === 18, 'audit unresolved row count changed');
expect(unresolved.suppressed_evidence_ids.length === 18, 'audit suppressed ID count changed');
expect(same(unresolved.reactivated_eligible_evidence_ids, []), 'reviewed-reactivated identities changed');
expect(unresolved.suppressed_evidence_ids.includes('sog_src_busd_reuters_sec_2024'), 'invalid archive removal identity missing');

const expectedArchiveIds = [
  'sog_src_nuon_overview_batch_b',
  'sog_src_paxg_launch_batch_b',
  'sog_src_pyusd_paxos_page',
  'sog_src_pyusd_paypal_official',
  'sog_src_rai_faq_batch_b'
];
const expectedNoSafeIds = [
  'sog_src_paxg_allocation_batch_b',
  'sog_src_paxg_pricing_batch_b',
  'sog_src_paxg_redemption_batch_b',
  'sog_src_paxos_busd_announcement',
  'sog_src_pyusd_paxos_official'
];
expect(pr400.outcomes.length === 10, 'PR #400 outcome count changed');
for (const evidenceId of expectedArchiveIds) {
  const row = manifest.effective_evidence_identities.find((item) => item.evidence_id === evidenceId);
  expect(row?.effective_review_outcome === 'reviewed_archive_present', `${evidenceId}: not archive-present`);
  expect(Boolean(row?.current_archived_url), `${evidenceId}: current archive missing`);
  expect(row?.candidate_eligible_under_contract === false, `${evidenceId}: remains queue-eligible`);
}
for (const evidenceId of expectedNoSafeIds) {
  const row = manifest.effective_evidence_identities.find((item) => item.evidence_id === evidenceId);
  expect(row?.effective_review_outcome === 'reviewed_no_safe_change', `${evidenceId}: no-safe outcome missing`);
  expect(row?.current_archived_url == null, `${evidenceId}: unexpectedly has archive`);
  expect(row?.eligibility_state_without_new_signal === 'suppressed_reviewed_no_safe_change', `${evidenceId}: suppression changed`);
  expect(row?.candidate_eligible_under_contract === false, `${evidenceId}: unexpectedly queue-eligible`);
  expect(unresolved.suppressed_evidence_ids.includes(evidenceId), `${evidenceId}: missing from suppression list`);
}

expect(audit.decision.contract_complete === true, 'History v6 contract is not complete');
expect(audit.decision.next_work_item === 'PR #403 Evidence Archive Maintenance Queue v7 Refresh', 'History v6 handoff changed');
expect(audit.decision.archive_queue_generation_allowed_in_pr402 === false, 'PR #402 unexpectedly generated a queue');
expect(audit.decision.canonical_data_change_allowed === false && audit.decision.public_surface_change_allowed === false, 'History v6 canonical/public boundary changed');
expect(audit.decision.review_gate_after_pr403 === true, 'review gate after PR #403 changed');
expect(Object.values(audit.boundaries).every((value) => value === false), 'History v6 audit boundary changed');
expect(manifest.manifest_digest_sha256 === audit.manifest_digest_sha256, 'manifest/audit digest mismatch');
expect(manifest.source_digest_sha256 === audit.source_digest_sha256, 'source digest mismatch');

try {
  git('rev-parse', '--verify', 'origin/main');
  for (const file of [
    'config/evidence-archive-review-history-v5-pr397.json',
    'docs/migration/evidence-archive-review-history-manifest-v5-pr397.json',
    'docs/migration/evidence-archive-review-history-audit-v5-pr397.json',
    'docs/migration/evidence-archive-maintenance-outcomes-pr400.json',
    'docs/migration/post-pr400-review-gate-pr401.json',
    'docs/migration/current-canonical-checkpoint.json',
    'docs/migration/current-stats-history-checkpoint.json',
    'docs/migration/registry-release-integrity-baseline.json'
  ]) expect(git('hash-object', file) === git('rev-parse', `origin/main:${file}`), `${file}: immutable Git blob identity changed`);
} catch {}

for (const [file, markers] of [
  ['AGENTS.md', ['PR #402 Evidence Archive Review-History Contract v6 Update: active; complete on merge', 'history sources: 7', 'reviewed reactivated eligible: 0', 'PR #403 Evidence Archive Maintenance Queue v7 Refresh: approved next']],
  ['docs/roadmap.md', ['Status: canonical execution schedule — PR #402 active', 'reviewed Evidence identities: 68', 'reviewed unresolved suppressed: 18', 'PR #403 Evidence Archive Maintenance Queue v7 Refresh']],
  ['docs/quality/evidence-archive-review-history-contract-v6-pr402-spec.md', ['History v6', 'Reviewed unresolved / suppressed / reactivated eligible: 18 / 18 / 0', 'PR #403 Evidence Archive Maintenance Queue v7 Refresh']],
  ['docs/roadmap-amendments/2026-07-16-pr402-evidence-archive-review-history-v6-activation.md', ['history events: 70', 'source replacement: 0', 'PR #403 Evidence Archive Maintenance Queue v7 Refresh']]
]) for (const marker of markers) expect(readText(file).includes(marker), `${file}: missing authority marker ${marker}`);

for (const file of [
  'public/data/evidence-archive-review-history-manifest-v6-pr402.json',
  'public/data/evidence-archive-review-history-audit-v6-pr402.json',
  'src/pages/evidence-archive-review-history-v6.astro'
]) expect(!fs.existsSync(path.join(root, file)), `${file}: internal output leaked into public surface`);

if (failures.length) {
  console.error('PR #402 Evidence Archive Review-History v6 validation failed:');
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
