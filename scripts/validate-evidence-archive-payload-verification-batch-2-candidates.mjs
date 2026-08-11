import fs from 'node:fs';
import path from 'node:path';
import { buildBatch2ArchiveCandidates } from './build-evidence-archive-payload-verification-batch-2-candidates.mjs';

const root = process.cwd();
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const artifactPath = 'data/editorial-research/evidence-archive-payload-verification-batch-2-candidates-2026-08-09.json';
const artifact = readJson(artifactPath);
const authority = readJson('config/evidence-archive-payload-verification-batch-2-review-authority.json');
const batch1 = readJson('config/evidence-archive-payload-verification-batch-1.json');
const checkpoint = readJson('docs/migration/current-canonical-checkpoint.json');
const implementationAuthorityPath = 'config/evidence-archive-payload-verification-batch-2-implementation-authority.json';
const implementationResultPath = 'docs/migration/evidence-archive-payload-verification-batch-2-implementation-pr552.json';
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const archiveNotRecorded = checkpoint.counts?.archive_not_recorded_count;
const isCandidateEntryState = archiveNotRecorded === 122;
const isImplementedState = archiveNotRecorded === 114
  && checkpoint.checkpoint_id === 'sog_evidence_archive_payload_verification_batch_2_canonical_119_checkpoint_pr552_2026_08_12';

if (isCandidateEntryState) {
  const generated = buildBatch2ArchiveCandidates();
  expect(JSON.stringify(artifact) === JSON.stringify(generated), 'committed candidate artifact does not match deterministic regeneration');
} else if (isImplementedState) {
  expect(fs.existsSync(path.join(root, implementationAuthorityPath)), 'implementation authority missing in post-implementation state');
  expect(fs.existsSync(path.join(root, implementationResultPath)), 'implementation result missing in post-implementation state');
  if (fs.existsSync(path.join(root, implementationAuthorityPath)) && fs.existsSync(path.join(root, implementationResultPath))) {
    const implementationAuthority = readJson(implementationAuthorityPath);
    const implementationResult = readJson(implementationResultPath);
    const expectedIds = new Set([
      ...(implementationAuthority.authorized_archive_additions ?? []).map((row) => row.evidence_id),
      ...(implementationAuthority.no_safe_change ?? [])
    ]);
    expect(expectedIds.size === 10, 'implementation lineage does not preserve the ten reviewed Batch 2 identities');
    expect(artifact.selected_evidence_ids.every((id) => expectedIds.has(id)), 'historical candidate artifact identity is outside implemented/reviewed Batch 2 scope');
    expect(implementationResult.changed_count === 8, 'post-implementation result does not record eight archive additions');
    expect(implementationResult.next_boundary === 'REVIEW_GATE', 'post-implementation result does not return to REVIEW_GATE');
  }
} else {
  expect(false, `unexpected current archive-not-recorded state ${archiveNotRecorded}`);
}

expect(artifact.status === 'generated_internal_review_candidates', 'candidate artifact status changed');
expect(artifact.public_output === false, 'candidate artifact became public output');
expect(artifact.canonical_change_authorized === false, 'candidate artifact authorizes canonical mutation');
expect(artifact.authority_id === authority.authority_id, 'candidate artifact authority changed');
expect(artifact.canonical_evidence_count === 585, 'historical candidate Evidence count changed');
expect(artifact.archive_not_recorded_count === 122, 'historical candidate entry archive-not-recorded count changed');
expect(artifact.selected_count === 10, 'candidate count is not exactly 10');
expect(new Set(artifact.selected_evidence_ids).size === 10, 'candidate IDs are not unique');
expect(artifact.eligible_pool_count === 68, 'eligible pool changed');
expect(artifact.exclusion_counts.alias_identity === 33, 'alias exclusion count changed');
expect(artifact.exclusion_counts.reviewed_suppressed_without_signal === 18, 'review-history suppression count changed');
expect(artifact.exclusion_counts.batch_1_reviewed === 3, 'current-unarchived Batch 1 exclusion count changed');

const batch1Ids = new Set(batch1.target_evidence_ids ?? []);
expect(artifact.selected_evidence_ids.every((id) => !batch1Ids.has(id)), 'Batch 1 reviewed identity leaked into Batch 2 selection');
expect(artifact.selected_candidates.every((row) => row.review_status === 'pending_manual_payload_review'), 'candidate review status changed');
expect(artifact.selected_candidates.every((row) => row.canonical_change_authorized === false), 'candidate row authorizes canonical mutation');
expect(artifact.selected_candidates.every((row) => row.priority_rank === 2 && row.priority_bucket === 'official_issuer_protocol_product'), 'deterministic priority boundary changed');
expect(artifact.next_boundary === 'MANUAL_PAYLOAD_REVIEW', 'historical candidate next boundary changed');

if (failures.length) {
  console.error('Evidence Archive Payload Verification Batch 2 candidate validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  mode: isCandidateEntryState ? 'deterministic_entry_state' : 'historical_post_implementation',
  artifact_id: artifact.artifact_id,
  eligible_pool: artifact.eligible_pool_count,
  selected_count: artifact.selected_count,
  selected_evidence_ids: artifact.selected_evidence_ids,
  canonical_change_authorized: artifact.canonical_change_authorized,
  historical_next_boundary: artifact.next_boundary,
  current_archive_not_recorded: archiveNotRecorded
}, null, 2));
