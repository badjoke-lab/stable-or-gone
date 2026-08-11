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
const statsCheckpoint = json('docs/migration/current-stats-history-checkpoint.json');
const release = json('docs/migration/registry-release-integrity-baseline.json');
const history = json('data/stats-history.json');
const result = json('docs/migration/evidence-archive-payload-verification-batch-2-implementation-pr552.json');

const canonical = new Map();
for (const file of ['data/evidence.json', 'data/evidence-batch-a.json']) {
  for (const row of json(file)) canonical.set(row.id, { ...row, __file: file });
}

expect(authority.status === 'approved_bounded_implementation', 'implementation authority changed');
expect(authority.authorized_archive_additions?.length === 8, 'authority target count changed');
expect(authority.no_safe_change?.length === 2, 'authority no-safe-change count changed');
expect(review.decisions?.length === 10 && review.dated_exact_archive_proposal_count === 8 && review.reviewed_no_safe_change_count === 2, 'review result boundary changed');

const reviewedProposals = new Map(review.decisions.filter((row) => row.outcome === 'dated_exact_archive_proposal').map((row) => [row.evidence_id, row]));
const authorizedIds = new Set();
for (const item of authority.authorized_archive_additions) {
  authorizedIds.add(item.evidence_id);
  const row = canonical.get(item.evidence_id);
  const reviewed = reviewedProposals.get(item.evidence_id);
  expect(Boolean(row), `${item.evidence_id}: canonical Evidence row missing`);
  expect(Boolean(reviewed), `${item.evidence_id}: reviewed proposal missing`);
  if (row && reviewed) {
    expect(row.__file === item.source_file && reviewed.source_file === item.source_file, `${item.evidence_id}: source file changed`);
    expect(row.url === reviewed.canonical_url, `${item.evidence_id}: canonical source URL changed`);
    expect(item.archived_url === reviewed.archived_url_proposal, `${item.evidence_id}: authority/review archive URL mismatch`);
    expect(row.archived_url === item.archived_url, `${item.evidence_id}: exact archived_url not implemented`);
  }
}
expect(authorizedIds.size === 8, 'authorized Evidence IDs are not unique');

for (const id of authority.no_safe_change) {
  const row = canonical.get(id);
  expect(Boolean(row), `${id}: no-safe-change Evidence row missing`);
  if (row) expect(!String(row.archived_url ?? '').trim(), `${id}: no-safe-change record received archived_url`);
}

expect(checkpoint.status === 'reviewed_non_growth_maintenance_checkpoint', 'canonical checkpoint status changed');
expect(checkpoint.checkpoint_id === 'sog_evidence_archive_payload_verification_batch_2_canonical_119_checkpoint_pr552_2026_08_12', 'canonical checkpoint ID changed');
expect(checkpoint.maintenance_pr === 552 && checkpoint.authority_pr === 551 && checkpoint.source_review_pr === 543, 'canonical checkpoint lineage changed');
expect(checkpoint.counts?.assets === 119, 'asset count changed');
expect(checkpoint.counts?.evidence === 585, 'Evidence count changed');
expect(checkpoint.counts?.evidence_relations === 585, 'Evidence Relation count changed');
expect(checkpoint.counts?.market_access_records === 12, 'Market Access count changed');
expect(checkpoint.counts?.archive_index_count === 471, 'archive recorded count must be 471');
expect(checkpoint.counts?.archive_not_recorded_count === 114, 'archive not-recorded count must be 114');
expect(checkpoint.record_boundary?.next_boundary === 'REVIEW_GATE' && checkpoint.record_boundary?.automatic_continuation === false, 'post-implementation REVIEW_GATE boundary changed');

expect(statsCheckpoint.checkpoint_id === 'sog_stats_evidence_archive_payload_verification_batch_2_pr552_2026_08_12', 'stats checkpoint ID changed');
expect(statsCheckpoint.canonical_checkpoint_id === checkpoint.checkpoint_id, 'stats/canonical checkpoint binding changed');
expect(statsCheckpoint.expected_totals?.assets === 119 && statsCheckpoint.expected_totals?.evidence === 585 && statsCheckpoint.expected_totals?.market_access_records === 12, 'stats checkpoint counts changed');

expect(release.status === 'current', 'release baseline is not current');
expect(release.baseline_id === 'sog_release_integrity_pr552_119_assets_2026_08_12', 'release baseline ID changed');
expect(release.expected_v2_counts?.evidence === 585 && release.expected_v2_counts?.evidence_relations === 585, 'release Evidence counts changed');
expect(release.expected_market_access_records === 12, 'release Market Access count changed');
expect(release.evidence_quality?.archive_index_count === 471, 'release archive recorded count changed');
expect(release.evidence_quality?.archive_not_recorded_count === 114, 'release archive not-recorded count changed');

const latest = history.snapshots?.at(-1);
expect(latest?.checkpoint_id === statsCheckpoint.checkpoint_id, 'latest statistics snapshot is not PR552 checkpoint');
expect(latest?.canonical_checkpoint_id === checkpoint.checkpoint_id, 'latest statistics snapshot canonical binding changed');
expect(latest?.totals?.assets === 119 && latest?.totals?.evidence === 585 && latest?.totals?.market_access_records === 12, 'latest statistics totals changed');
expect(latest?.data_quality?.coverage?.archive_evidence?.count === 471, 'latest statistics archive coverage changed');

expect(result.status === 'implemented_bounded_exact_archive_additions', 'implementation result status changed');
expect(result.changed_count === 8 && result.changed?.length === 8, 'implementation result must record exactly eight changes');
expect(result.archive_coverage?.before_recorded === 463 && result.archive_coverage?.after_recorded === 471, 'implementation result archive coverage changed');
expect(result.archive_coverage?.before_not_recorded === 122 && result.archive_coverage?.after_not_recorded === 114, 'implementation result missing-archive coverage changed');
expect(result.next_boundary === 'REVIEW_GATE' && result.automatic_continuation === false, 'implementation result next boundary changed');

const active = read('scripts/validate-active-workstream.mjs').trim();
expect(active === "import './validate-evidence-archive-batch2-implementation-pr552.mjs';", 'active-workstream validator is not wired to PR552 implementation');

for (const file of ['AGENTS.md', 'docs/spec-governance.md', 'docs/roadmap.md', 'docs/deployment-policy.md']) {
  const text = read(file);
  expect(text.includes('Evidence Archive Payload Verification Batch 2'), `${file}: missing Evidence Archive lane`);
  expect(text.includes('IMPLEMENTATION_AUTHORIZED'), `${file}: missing implementation-authorized authority`);
  expect(text.includes('REVIEW_GATE'), `${file}: missing post-implementation review gate`);
}

if (failures.length) {
  console.error('Evidence Archive Batch 2 PR552 implementation validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log('Evidence Archive Batch 2 PR552 implementation validation passed.');
