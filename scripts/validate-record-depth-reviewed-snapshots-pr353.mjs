import { isDeepStrictEqual } from 'node:util';
import fs from 'node:fs';
import { buildReviewedRecordDepthBaseline } from './growth/build-reviewed-record-depth-baseline-pr353.mjs';

const SUMMARY_PATH = 'docs/migration/record-depth-baseline-pr353-summary.json';
const QUEUE_PATH = 'docs/migration/tier-a-candidate-queue-pr353.json';
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

expect(fs.existsSync(SUMMARY_PATH), `reviewed summary snapshot missing: ${SUMMARY_PATH}`);
expect(fs.existsSync(QUEUE_PATH), `reviewed Tier A queue snapshot missing: ${QUEUE_PATH}`);

if (failures.length) {
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

const summarySnapshot = JSON.parse(fs.readFileSync(SUMMARY_PATH, 'utf8'));
const queueSnapshot = JSON.parse(fs.readFileSync(QUEUE_PATH, 'utf8'));
const baseline = buildReviewedRecordDepthBaseline();

expect(summarySnapshot.schema_version === baseline.schema_version, 'summary snapshot schema version mismatch');
expect(summarySnapshot.baseline_id === baseline.baseline_id, 'summary snapshot baseline ID mismatch');
expect(summarySnapshot.status === 'reviewed_internal_planning_checkpoint', 'summary snapshot status mismatch');
expect(summarySnapshot.public_output === false, 'summary snapshot must remain internal');
expect(summarySnapshot.review_pr === 353, 'summary snapshot review PR mismatch');
expect(summarySnapshot.reviewed_at === '2026-07-10', 'summary snapshot reviewed_at mismatch');
expect(summarySnapshot.asset_count === baseline.asset_count, 'summary snapshot asset count mismatch');
expect(summarySnapshot.dimension_count === baseline.dimension_count, 'summary snapshot dimension count mismatch');
expect(summarySnapshot.cell_count === baseline.cell_count, 'summary snapshot cell count mismatch');
expect(summarySnapshot.input_digest_sha256 === baseline.input_digest_sha256, 'summary snapshot input digest mismatch');
expect(isDeepStrictEqual(summarySnapshot.planning_states, baseline.planning_states), 'summary snapshot planning states mismatch');
expect(isDeepStrictEqual(summarySnapshot.dimension_order, baseline.dimension_order), 'summary snapshot dimension order mismatch');
expect(isDeepStrictEqual(summarySnapshot.source_contracts, baseline.source_contracts), 'summary snapshot source contracts mismatch');
expect(isDeepStrictEqual(summarySnapshot.summary, baseline.summary), 'summary snapshot aggregate summary mismatch');

expect(queueSnapshot.schema_version === baseline.schema_version, 'queue snapshot schema version mismatch');
expect(queueSnapshot.baseline_id === baseline.baseline_id, 'queue snapshot baseline ID mismatch');
expect(queueSnapshot.status === 'internal_reviewed_planning_queue', 'queue snapshot status mismatch');
expect(queueSnapshot.public_output === false, 'queue snapshot must remain internal');
expect(queueSnapshot.asset_rank === false, 'queue snapshot must not rank assets');
expect(queueSnapshot.review_pr === 353, 'queue snapshot review PR mismatch');
expect(queueSnapshot.reviewed_at === '2026-07-10', 'queue snapshot reviewed_at mismatch');
expect(queueSnapshot.queue_order === baseline.queue_order, 'queue snapshot order contract mismatch');
expect(queueSnapshot.candidate_count === baseline.tier_a_candidate_queue.length, 'queue snapshot candidate count mismatch');
expect(queueSnapshot.input_digest_sha256 === baseline.input_digest_sha256, 'queue snapshot input digest mismatch');
expect(isDeepStrictEqual(queueSnapshot.source_contracts, baseline.source_contracts), 'queue snapshot source contracts mismatch');
expect(isDeepStrictEqual(queueSnapshot.candidates, baseline.tier_a_candidate_queue), 'queue snapshot candidates differ from deterministic reviewed queue');

expect(!fs.readFileSync(SUMMARY_PATH, 'utf8').includes('risk_score'), 'summary snapshot must not contain risk_score');
expect(!fs.readFileSync(QUEUE_PATH, 'utf8').includes('priority_score'), 'queue snapshot must not contain priority_score');
expect(!fs.readFileSync(QUEUE_PATH, 'utf8').includes('"rank"'), 'queue snapshot must not contain rank');

if (failures.length) {
  console.error('PR #353 reviewed snapshot parity validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  baseline_id: baseline.baseline_id,
  asset_count: baseline.asset_count,
  dimension_count: baseline.dimension_count,
  cell_count: baseline.cell_count,
  tier_a_candidate_count: baseline.tier_a_candidate_queue.length,
  input_digest_sha256: baseline.input_digest_sha256,
  summary_snapshot: SUMMARY_PATH,
  queue_snapshot: QUEUE_PATH
}, null, 2));
