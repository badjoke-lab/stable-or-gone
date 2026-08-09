import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const review = readJson('data/editorial-research/evidence-archive-payload-verification-batch-2-review-2026-08-09.json');
const candidates = readJson('data/editorial-research/evidence-archive-payload-verification-batch-2-candidates-2026-08-09.json');
const authority = readJson('config/evidence-archive-payload-verification-batch-2-review-authority.json');
const checkpoint = readJson('docs/migration/current-canonical-checkpoint.json');
const spec = readText('docs/quality/evidence-archive-payload-verification-batch-2-review-result-spec.md');
const amendment = readText('docs/roadmap-amendments/2026-08-10-evidence-archive-payload-verification-batch-2-review-result.md');
const active = readText('scripts/validate-active-workstream.mjs').trim();
const agents = readText('AGENTS.md');
const governance = readText('docs/spec-governance.md');
const roadmap = readText('docs/roadmap.md');
const deployment = readText('docs/deployment-policy.md');

const candidateIds = [...candidates.selected_evidence_ids].sort();
const reviewedIds = review.decisions.map((row) => row.evidence_id).sort();
const proposals = review.decisions.filter((row) => row.outcome === 'dated_exact_archive_proposal');
const noSafe = review.decisions.filter((row) => row.outcome === 'reviewed_no_safe_change');
const expectedProposalIds = [
  'sog_src_susd_legacy_context_batch_a',
  'sog_src_susd_rebuilding_2026',
  'sog_src_susd_roadmap_2026',
  'sog_src_susd_sip_status_2026',
  'sog_src_susd_synthetix_docs',
  'sog_src_susd_v3_faq_batch_a',
  'sog_src_terra_docs',
  'sog_src_tether_transparency'
].sort();
const expectedNoSafeIds = ['sog_src_susd_sip420_2024', 'sog_src_susd_sip423_2026'].sort();

expect(review.status === 'reviewed_complete', 'review is not complete');
expect(review.public_output === false, 'review artifact became public output');
expect(review.authority_pr === 537 && review.candidate_pr === 538 && review.review_pr === 539, 'review lineage changed');
expect(review.target_count === 10, 'review target count changed');
expect(review.dated_exact_archive_proposal_count === 8, 'proposal count changed');
expect(review.reviewed_no_safe_change_count === 2, 'no-safe-change count changed');
expect(review.canonical_change_authorized === false, 'review authorizes canonical mutation');
expect(JSON.stringify(candidateIds) === JSON.stringify(reviewedIds), 'reviewed Evidence IDs do not equal fixed candidate set');
expect(JSON.stringify(proposals.map((row) => row.evidence_id).sort()) === JSON.stringify(expectedProposalIds), 'proposal Evidence set changed');
expect(JSON.stringify(noSafe.map((row) => row.evidence_id).sort()) === JSON.stringify(expectedNoSafeIds), 'no-safe-change Evidence set changed');

for (const row of proposals) {
  expect(/^\d{14}$/.test(row.capture_timestamp), `${row.evidence_id}: invalid capture timestamp`);
  expect(row.fetch_status === 200, `${row.evidence_id}: exact archived payload is not HTTP 200`);
  expect(Number.isInteger(row.payload_bytes) && row.payload_bytes > 0, `${row.evidence_id}: invalid payload byte count`);
  expect(/^[0-9a-f]{64}$/.test(row.payload_sha256), `${row.evidence_id}: invalid payload SHA-256`);
  expect(row.archived_url_proposal === `https://web.archive.org/web/${row.capture_timestamp}/${row.canonical_url}`, `${row.evidence_id}: archive proposal is not exact canonical-source form`);
  expect(Array.isArray(row.payload_markers) && row.payload_markers.length >= 3, `${row.evidence_id}: insufficient payload markers`);
}

const sip420 = noSafe.find((row) => row.evidence_id === 'sog_src_susd_sip420_2024');
expect(sip420?.reviewed_fetch_status === 302, 'SIP-420 redirect-only disposition changed');
expect(sip420?.review_reason?.includes('HTTP 302'), 'SIP-420 redirect reason missing');
const sip423 = noSafe.find((row) => row.evidence_id === 'sog_src_susd_sip423_2026');
expect(sip423?.reviewed_http_200_capture_count === 0, 'SIP-423 no-capture disposition changed');
expect((sip423?.reviewed_cdx_queries ?? []).length === 3, 'SIP-423 retry query coverage changed');

expect(review.implementation_proposal.proposed_archive_addition_count === 8, 'implementation proposal bound changed');
expect(JSON.stringify([...review.implementation_proposal.proposed_evidence_ids].sort()) === JSON.stringify(expectedProposalIds), 'implementation proposal IDs changed');
expect(review.implementation_proposal.canonical_change_authorized === false, 'implementation proposal authorizes canonical mutation');
expect(review.implementation_proposal.separate_implementation_authority_required === true, 'separate implementation authority requirement removed');
expect(review.next_boundary === 'REVIEW_GATE', 'review does not exit to REVIEW_GATE');

const expected = authority.entry_canonical_checkpoint;
expect(checkpoint.counts.evidence === expected.evidence, 'Evidence count changed');
expect(checkpoint.counts.evidence_relations === expected.evidence_relations, 'Evidence Relation count changed');
expect(checkpoint.counts.archive_index_count === expected.archive_recorded, 'archive-recorded count changed');
expect(checkpoint.counts.archive_not_recorded_count === expected.archive_not_recorded, 'archive-not-recorded count changed');
expect(checkpoint.counts.market_access_records === expected.market_access_records, 'Market Access count changed');
expect(checkpoint.counts.detail_routes === expected.detail_routes, 'detail-route count changed');
expect(checkpoint.counts.metadata_checked_routes === expected.metadata_checked_routes, 'metadata-route count changed');

expect(spec.includes('separately reviewed and merged implementation authority'), 'result spec missing separate implementation authority boundary');
expect(spec.includes('dated exact archive proposals: 8'), 'result spec missing proposal count');
expect(amendment.includes('No canonical archive mutation is authorized'), 'roadmap amendment missing canonical mutation prohibition');
expect(active === "import './validate-evidence-archive-payload-verification-batch-2-review-result.mjs';", 'active validator wiring changed');

for (const text of [agents, governance, roadmap]) {
  expect(text.includes('REVIEW_GATE'), 'forward governance missing REVIEW_GATE');
  expect(text.includes('8'), 'forward governance missing eight-proposal result');
  expect(text.includes('2'), 'forward governance missing no-safe-change result');
}
expect(deployment.includes('review complete'), 'deployment policy does not record review completion');

if (failures.length) {
  console.error('Evidence Archive Payload Verification Batch 2 review result validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  review_id: review.review_id,
  reviewed: review.target_count,
  proposals: proposals.length,
  no_safe_change: noSafe.length,
  canonical_change_authorized: review.canonical_change_authorized,
  next_boundary: review.next_boundary
}, null, 2));
