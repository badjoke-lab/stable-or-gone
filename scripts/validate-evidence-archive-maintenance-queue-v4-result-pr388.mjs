import fs from 'node:fs';

const json = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const config = json('config/evidence-archive-maintenance-queue-v4-pr388.json');
const queue = json('docs/migration/evidence-archive-maintenance-queue-v4-pr388.json');
const delta = json('docs/migration/evidence-archive-maintenance-queue-v4-pr388-delta.json');
const expected = config.expected;
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };
const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);

expect(queue.eligible_pool_count === expected.eligible_pool_count, 'eligible pool count changed');
expect(queue.selected_count === expected.selected_count, 'selected count changed');
expect(same(queue.selected_candidates.map((row) => row.evidence_id), expected.selected_evidence_ids), 'selected Evidence IDs changed');
expect(delta.added_evidence_ids.length === expected.added_vs_queue_v3, 'Queue v3 added delta changed');
expect(delta.removed_evidence_ids.length === expected.removed_vs_queue_v3, 'Queue v3 removed delta changed');
expect(delta.retained_evidence_ids.length === expected.retained_vs_queue_v3, 'Queue v3 retained delta changed');
expect(delta.retained_evidence_ids.length === 1 && delta.retained_evidence_ids[0] === 'sog_src_fdusd_site', 'FDUSD is not the sole retained identity');
expect(queue.selected_candidates[0]?.evidence_id === 'sog_src_fdusd_site', 'FDUSD is not first in Queue v4');
expect(queue.selected_candidates[0]?.selection_tier === 0, 'FDUSD selection tier changed');
expect(queue.selected_candidates[0]?.reactivation_signal_present === true, 'FDUSD reactivation signal missing');
expect(queue.next_work_item === 'REVIEW GATE' && delta.next_work_item === 'REVIEW GATE', 'Queue v4 must end at review gate');

if (failures.length) {
  console.error('PR #388 reviewed Queue v4 result validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  eligible_pool: queue.eligible_pool_count,
  selected: queue.selected_count,
  selected_evidence_ids: queue.selected_candidates.map((row) => row.evidence_id),
  added_vs_queue_v3: delta.added_evidence_ids.length,
  removed_vs_queue_v3: delta.removed_evidence_ids.length,
  retained_vs_queue_v3: delta.retained_evidence_ids.length,
  next_work_item: queue.next_work_item
}, null, 2));
