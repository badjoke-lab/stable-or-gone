import fs from 'node:fs';

const read = (file) => fs.readFileSync(file, 'utf8');
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };
const requireText = (body, text, file) => expect(body.includes(text), `${file}: missing ${text}`);

const config = JSON.parse(read('config/evidence-correction-batch-pr360.json'));
const handoff = JSON.parse(read('docs/migration/market-access-pilot-2-pr359-reviewed-handoff.json'));
const queue = JSON.parse(read('docs/migration/evidence-correction-queue-pr360.json'));
const spec = read('docs/quality/evidence-correction-batch-pr360-spec.md');
const amendment = read('docs/roadmap-amendments/2026-07-14-pr360-evidence-correction-batch-activation.md');

for (const file of ['README.md','AGENTS.md','docs/spec-governance.md','docs/roadmap.md']) {
  const body = read(file);
  for (const marker of [
    'Canonical stable assets: 112',
    'PR #359 Market Access Pilot 2: complete',
    'PR #360 Evidence and Correction Batch: active',
    'post-PR #360 review gate: next',
    'docs/quality/evidence-correction-batch-pr360-spec.md',
    'config/evidence-correction-batch-pr360.json',
    'docs/migration/market-access-pilot-2-pr359-reviewed-handoff.json',
    'docs/migration/evidence-correction-queue-pr360.json'
  ]) requireText(body, marker, file);
}

expect(handoff.status === 'reviewed_merged_handoff', 'PR #359 handoff status mismatch');
expect(handoff.source_merge_commit === '043faab38160d693fb226c2955e2b6062d56946f', 'PR #359 handoff merge commit mismatch');
expect(handoff.canonical_counts?.assets === 112, 'PR #359 handoff asset count mismatch');
expect(handoff.canonical_counts?.evidence === 557, 'PR #359 handoff Evidence count mismatch');
expect(handoff.canonical_counts?.market_access_records === 8, 'PR #359 handoff Market Access count mismatch');
expect(handoff.next_work_item === 'PR #360 Evidence and Correction Batch', 'PR #359 handoff next work item mismatch');

expect(config.status === 'bounded_audit_and_manual_correction', 'PR #360 config status mismatch');
expect(config.maximum_canonical_evidence_records_touched === 10, 'PR #360 Evidence touch maximum mismatch');
expect(config.maximum_non_evidence_record_corrections === 5, 'PR #360 non-Evidence correction maximum mismatch');
expect(config.canonical_count_before === 112, 'PR #360 asset boundary mismatch');
expect(config.canonical_evidence_count_before === 557, 'PR #360 Evidence boundary mismatch');
expect(config.market_access_record_count_before === 8, 'PR #360 Market Access boundary mismatch');
for (const boundary of ['new_canonical_assets_allowed','market_access_record_changes_allowed','new_public_surface_allowed','comparison_readiness_semantics_change_allowed','facet_freshness_semantics_change_allowed','monitoring_auto_promotion_allowed','editorial_research_auto_promotion_allowed','asset_rank','single_composite_score']) {
  expect(config.boundaries?.[boundary] === false, `PR #360 boundary changed: ${boundary}`);
}

expect(queue.status === 'internal_review_queue_not_canonical_change', 'PR #360 queue status mismatch');
expect(queue.public_output === false, 'PR #360 queue must remain internal');
expect(queue.canonical_evidence_count === 557, 'PR #360 queue Evidence count mismatch');
expect(queue.archive_not_recorded_count === 177, 'PR #360 no-archive queue count mismatch');
expect(queue.selected_count === 10, 'PR #360 selected queue count mismatch');
expect(queue.selected_candidates?.length === 10, 'PR #360 selected candidates missing');
expect(queue.constraints?.automatic_canonical_write === false, 'PR #360 queue must not auto-write canonical data');
expect(new Set(queue.selected_candidates.map((row) => row.evidence_id)).size === 10, 'PR #360 queue Evidence IDs must be unique');

for (const marker of ['broken-link repair','archive supplementation','Evidence Relation correction','known-unknown resolution']) requireText(spec, marker, 'PR #360 specification');
requireText(amendment, 'PR #360 Evidence and Correction Batch: active', 'PR #360 amendment');
requireText(amendment, 'post-PR #360 review gate: next', 'PR #360 amendment');

if (failures.length) {
  console.error('PR #360 active workstream validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  active_workstream: 'pr360_evidence_correction_batch',
  selected_evidence_records: queue.selected_candidates.map((row) => row.evidence_id),
  archive_not_recorded_count: queue.archive_not_recorded_count,
  maximum_evidence_touches: config.maximum_canonical_evidence_records_touched,
  maximum_non_evidence_corrections: config.maximum_non_evidence_record_corrections,
  next_step: 'post_pr360_review_gate'
}, null, 2));
