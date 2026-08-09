import fs from 'node:fs';
import path from 'node:path';
import { buildBatch2ArchiveCandidates } from './build-evidence-archive-payload-verification-batch-2-candidates.mjs';

const root = process.cwd();
const artifactPath = 'data/editorial-research/evidence-archive-payload-verification-batch-2-candidates-2026-08-09.json';
const artifact = JSON.parse(fs.readFileSync(path.join(root, artifactPath), 'utf8'));
const generated = buildBatch2ArchiveCandidates();
const authority = JSON.parse(fs.readFileSync(path.join(root, 'config/evidence-archive-payload-verification-batch-2-review-authority.json'), 'utf8'));
const batch1 = JSON.parse(fs.readFileSync(path.join(root, 'config/evidence-archive-payload-verification-batch-1.json'), 'utf8'));
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

expect(JSON.stringify(artifact) === JSON.stringify(generated), 'committed candidate artifact does not match deterministic regeneration');
expect(artifact.status === 'generated_internal_review_candidates', 'candidate artifact status changed');
expect(artifact.public_output === false, 'candidate artifact became public output');
expect(artifact.canonical_change_authorized === false, 'candidate artifact authorizes canonical mutation');
expect(artifact.authority_id === authority.authority_id, 'candidate artifact authority changed');
expect(artifact.canonical_evidence_count === 585, 'Evidence count changed');
expect(artifact.archive_not_recorded_count === 122, 'archive-not-recorded count changed');
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
expect(artifact.next_boundary === 'MANUAL_PAYLOAD_REVIEW', 'next boundary changed');

if (failures.length) {
  console.error('Evidence Archive Payload Verification Batch 2 candidate validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  artifact_id: artifact.artifact_id,
  eligible_pool: artifact.eligible_pool_count,
  selected_count: artifact.selected_count,
  selected_evidence_ids: artifact.selected_evidence_ids,
  canonical_change_authorized: artifact.canonical_change_authorized,
  next_boundary: artifact.next_boundary
}, null, 2));
