import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const authority = readJson('config/evidence-archive-payload-verification-batch-2-review-authority.json');
const batch1 = readJson('config/evidence-archive-payload-verification-batch-1.json');
const queueV7 = readJson('config/evidence-archive-maintenance-queue-v7-pr403.json');
const checkpoint = readJson('docs/migration/current-canonical-checkpoint.json');
const spec = readText('docs/quality/evidence-archive-payload-verification-batch-2-review-authority-spec.md');
const amendment = readText('docs/roadmap-amendments/2026-08-09-evidence-archive-payload-verification-batch-2-review-authority.md');
const active = readText('scripts/validate-active-workstream.mjs').trim();

const expected = authority.entry_canonical_checkpoint;
const batch1Ids = [...batch1.target_evidence_ids].sort();
const excluded = [...authority.review_lane.batch_1_reviewed_evidence_ids].sort();

expect(authority.status === 'approved_bounded_review_only', 'authority is not review-only');
expect(authority.entry_repository_commit === 'c9588b092277bd14d87ce9209ba087e4752b3346', 'entry commit changed');
expect(authority.review_lane.name === 'Evidence Archive Payload Verification Batch 2', 'lane name changed');
expect(authority.review_lane.target_count === 10, 'target count changed');
expect(authority.review_lane.queue_v7_priority_mode === queueV7.selection.mode, 'Queue v7 selection mode not preserved');
expect(JSON.stringify(authority.review_lane.priority_order) === JSON.stringify(queueV7.selection.priority_order), 'Queue v7 priority order not preserved');
expect(JSON.stringify(excluded) === JSON.stringify(batch1Ids), 'Batch 1 reviewed set is not exactly excluded');
expect(new Set(excluded).size === 10, 'Batch 1 exclusion set must contain 10 unique IDs');
expect(authority.review_lane.eligibility.batch_1_reviewed_excluded === true, 'Batch 1 exclusion disabled');
expect(authority.review_lane.manual_review_requirements.archived_payload_independently_fetched === true, 'independent payload fetch disabled');
expect(authority.review_lane.manual_review_requirements.redirect_only_or_cdx_metadata_only_insufficient === true, 'redirect/CDX-only rejection disabled');
expect(authority.implementation_boundary.current === 'REVIEW_GATE', 'implementation boundary changed');
expect(authority.implementation_boundary.canonical_changes_allowed === false, 'canonical mutation enabled');
expect(authority.implementation_boundary.maximum_canonical_archive_additions === 0, 'authority permits canonical archive additions');
expect(authority.implementation_boundary.later_archive_additions_require_separate_merged_implementation_authority === true, 'separate implementation authority requirement disabled');

expect(checkpoint.counts.assets === expected.assets, 'asset count changed');
expect(checkpoint.counts.organizations === expected.organizations, 'organization count changed');
expect(checkpoint.counts.relationships === expected.relationships, 'relationship count changed');
expect(checkpoint.counts.events === expected.events, 'event count changed');
expect(checkpoint.counts.evidence === expected.evidence, 'Evidence count changed');
expect(checkpoint.counts.evidence_relations === expected.evidence_relations, 'Evidence Relation count changed');
expect(checkpoint.counts.deployments === expected.deployments, 'deployment count changed');
expect(checkpoint.counts.market_access_records === expected.market_access_records, 'Market Access count changed');
expect(checkpoint.counts.archive_index_count === expected.archive_recorded, 'archive-recorded count changed');
expect(checkpoint.counts.archive_not_recorded_count === expected.archive_not_recorded, 'archive-not-recorded count changed');
expect(checkpoint.counts.detail_routes === expected.detail_routes, 'detail-route count changed');
expect(checkpoint.counts.metadata_checked_routes === expected.metadata_checked_routes, 'metadata-route count changed');

for (const forbidden of ['canonical_archived_url_change', 'source_url_replacement', 'new_evidence_identity', 'automatic_archive_promotion']) {
  expect(authority.prohibited.includes(forbidden), `missing prohibition: ${forbidden}`);
}
expect(spec.includes('separately reviewed and merged implementation authority'), 'spec missing separately reviewed and merged implementation authority boundary');
expect(spec.includes('exactly ten candidates'), 'spec missing exact candidate bound');
expect(amendment.includes('No canonical archive mutation is authorized'), 'amendment missing canonical mutation prohibition');
const allowedActiveWiring = new Set([
  "import './validate-evidence-archive-payload-verification-batch-2-review-authority.mjs';",
  "import './validate-post-pr541-compare-closeout-evidence-review-restoration.mjs';"
]);
expect(allowedActiveWiring.has(active), 'active validator wiring changed outside direct/restored Evidence review authority');

if (failures.length) {
  console.error('Evidence Archive Payload Verification Batch 2 review authority validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Evidence Archive Payload Verification Batch 2 review authority validation passed.');
