import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const json = (file) => JSON.parse(read(file));
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const authority = json('config/evidence-archive-payload-verification-batch-2-implementation-authority.json');
const review = json('data/editorial-research/evidence-archive-payload-verification-batch-2-review-2026-08-09.json');
const checkpoint = json('docs/migration/current-canonical-checkpoint.json');
const canonicalFiles = ['data/evidence.json', 'data/evidence-batch-a.json'];
const canonical = new Map();
for (const file of canonicalFiles) {
  for (const row of json(file)) canonical.set(row.id, { ...row, __file: file });
}

expect(authority.status === 'approved_bounded_implementation', 'authority status changed');
expect(authority.entry_main_commit === '2825eb293f833061deb1ef8bdb628b32a93538cc', 'authority entry main changed');
expect(authority.review_result_pr === 543, 'review-result PR changed');
expect(authority.implementation_exit === 'REVIEW_GATE', 'implementation exit changed');
expect(authority.authorized_archive_additions.length === 8, 'authorized archive addition count must be 8');
expect(authority.no_safe_change.length === 2, 'no-safe-change target count must be 2');

expect(review.status === 'reviewed_complete', 'Batch 2 review is not complete');
expect(review.target_count === 10 && review.decisions.length === 10, 'Batch 2 review count changed');
expect(review.dated_exact_archive_proposal_count === 8, 'Batch 2 proposal count changed');
expect(review.reviewed_no_safe_change_count === 2, 'Batch 2 no-safe-change count changed');
expect(review.canonical_change_authorized === false, 'review artifact itself unexpectedly authorizes canonical change');
expect(review.next_boundary === 'REVIEW_GATE', 'review artifact next boundary changed');

const proposals = new Map(review.decisions.filter((row) => row.outcome === 'dated_exact_archive_proposal').map((row) => [row.evidence_id, row]));
const noSafe = new Set(review.decisions.filter((row) => row.outcome === 'reviewed_no_safe_change').map((row) => row.evidence_id));

const seen = new Set();
for (const item of authority.authorized_archive_additions) {
  expect(!seen.has(item.evidence_id), `duplicate authorized Evidence ID ${item.evidence_id}`);
  seen.add(item.evidence_id);
  const reviewed = proposals.get(item.evidence_id);
  expect(Boolean(reviewed), `${item.evidence_id} is not an accepted dated archive proposal`);
  if (reviewed) {
    expect(item.archived_url === reviewed.archived_url_proposal, `${item.evidence_id} archive URL differs from reviewed proposal`);
    expect(item.source_file === reviewed.source_file, `${item.evidence_id} source file differs from review artifact`);
    expect(reviewed.fetch_status === 200, `${item.evidence_id} reviewed archive did not return HTTP 200`);
  }
  const row = canonical.get(item.evidence_id);
  expect(Boolean(row), `${item.evidence_id} missing from canonical Evidence`);
  if (row) {
    expect(row.__file === item.source_file, `${item.evidence_id} canonical source file changed`);
    expect(row.archived_url == null || row.archived_url === '', `${item.evidence_id} already has a recorded archived_url before implementation`);
    expect(row.url === reviewed?.canonical_url, `${item.evidence_id} canonical source URL changed since review`);
  }
}

expect([...seen].every((id) => !noSafe.has(id)), 'no-safe-change target was authorized for implementation');
expect(authority.no_safe_change.every((id) => noSafe.has(id)), 'authority no-safe-change list differs from review result');
expect(authority.no_safe_change.every((id) => !seen.has(id)), 'no-safe-change target appears in authorized additions');

const counts = checkpoint.counts;
expect(counts.assets === 119, 'asset count changed before implementation');
expect(counts.evidence === 585, 'Evidence count changed before implementation');
expect(counts.evidence_relations === 585, 'Evidence Relation count changed before implementation');
expect(counts.market_access_records === 12, 'Market Access count changed before implementation');
expect(counts.archive_index_count === 463, 'archive recorded count changed before implementation');
expect(counts.archive_not_recorded_count === 122, 'archive not-recorded count changed before implementation');

const boundary = authority.canonical_boundary;
expect(boundary.archive_recorded_before === 463 && boundary.archive_not_recorded_before === 122, 'authority pre-implementation archive boundary changed');
expect(boundary.archive_recorded_after_max === 471 && boundary.archive_not_recorded_after_min === 114, 'authority post-implementation archive boundary changed');
expect(boundary.maximum_archive_additions === 8 && boundary.maximum_archive_removals_from_not_recorded === 8, 'authority archive delta changed');
expect(boundary.evidence_identity_delta === 0 && boundary.evidence_relation_delta === 0 && boundary.asset_delta === 0 && boundary.market_access_delta === 0, 'authority permits unrelated canonical deltas');

const active = read('scripts/validate-active-workstream.mjs').trim();
expect(active === "import './validate-evidence-archive-batch2-implementation-authority.mjs';", 'active-workstream validator is not wired to Batch 2 implementation authority');

for (const file of ['AGENTS.md', 'docs/spec-governance.md', 'docs/roadmap.md', 'docs/deployment-policy.md']) {
  const text = read(file);
  expect(text.includes('Evidence Archive Payload Verification Batch 2'), `${file} missing active Evidence Archive lane`);
  expect(text.includes('IMPLEMENTATION_AUTHORIZED'), `${file} missing implementation-authorized stage`);
  expect(text.includes('8'), `${file} missing bounded eight-target scope`);
  expect(text.includes('REVIEW_GATE'), `${file} missing post-implementation REVIEW_GATE`);
}

if (failures.length) {
  console.error('Evidence Archive Batch 2 implementation authority validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log('Evidence Archive Batch 2 implementation authority validation passed.');
