import fs from 'node:fs';

function readJson(path) {
  return JSON.parse(fs.readFileSync(path, 'utf8'));
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const config = readJson('config/post-ui-v3-data-growth-reset-pr426.json');
const decision = readJson('docs/migration/post-ui-v3-data-growth-reset-pr426.json');
const agents = fs.readFileSync('AGENTS.md', 'utf8');
const roadmap = fs.readFileSync('docs/roadmap.md', 'utf8');
const amendment = fs.readFileSync('docs/roadmap-amendments/2026-07-18-pr426-post-ui-v3-data-growth-reset.md', 'utf8');
const spec = fs.readFileSync('docs/quality/post-ui-v3-data-growth-reset-pr426-spec.md', 'utf8');

assert(config.schema_version === '1.0', 'config schema version mismatch');
assert(config.work_item === 'post_ui_v3_data_growth_reset_pr426', 'config work item mismatch');
assert(config.status === 'approved_on_merge', 'config status mismatch');
assert(config.source_state.canonical_assets === 112, 'canonical asset count mismatch');
assert(config.source_state.evidence === 559, 'Evidence count mismatch');
assert(config.source_state.evidence_relations === 559, 'Evidence Relation count mismatch');
assert(config.source_state.archive_recorded === 430, 'archive-recorded count mismatch');
assert(config.source_state.archive_not_recorded === 129, 'archive-not-recorded count mismatch');
assert(config.source_state.ui_v3_complete === true, 'UI v3 completion must remain true');
assert(config.source_state.issue_281_closed === true, 'Issue #281 closure must remain true');
assert(config.review_findings.history_aware_dossier_queue_candidates === 0, 'dossier queue finding mismatch');
assert(config.review_findings.archive_batch_8_selected === 10, 'Archive Batch 8 selection mismatch');
assert(config.review_findings.archive_batch_8_safe_canonical_changes === 0, 'Archive Batch 8 result mismatch');
assert(config.approved_next_sequence.length === 1, 'exactly one next PR must be authorized');
assert(config.approved_next_sequence[0].pr === 427, 'PR #427 must be the only authorized next PR');
assert(config.approved_next_sequence[0].canonical_changes_allowed === false, 'PR #427 must remain noncanonical');
assert(config.pr427_scope.maximum_candidates === 12, 'PR #427 candidate limit mismatch');
assert(config.pr427_scope.future_growth_limit === 2, 'future growth limit mismatch');
assert(config.pr427_scope.automatic_promotion === false, 'automatic promotion must remain disabled');
assert(config.review_gate_after_sequence === true, 'review gate must follow PR #427');

assert(decision.status === 'reviewed_decision', 'decision status mismatch');
assert(decision.source_merge_commit === '1f03af5fa540c7d0179fb5354b0cd9cd77b59fd7', 'source merge commit mismatch');
assert(decision.reviewed_state.canonical_assets === config.source_state.canonical_assets, 'decision/config asset mismatch');
assert(decision.reviewed_state.evidence === config.source_state.evidence, 'decision/config Evidence mismatch');
assert(decision.reviewed_state.archive_recorded === config.source_state.archive_recorded, 'decision/config archive mismatch');
assert(decision.lane_review.dossier_lane.latest_history_aware_candidate_count === 0, 'decision dossier finding mismatch');
assert(decision.lane_review.archive_lane.safe_canonical_changes === 0, 'decision archive finding mismatch');
assert(decision.decision.next_pr === 427, 'decision next PR mismatch');
assert(decision.decision.canonical_changes_allowed === false, 'decision must not authorize canonical changes');
assert(decision.decision.review_gate_after_next_pr === true, 'decision must stop at review gate');
assert(decision.preserved_boundaries.automatic_promotion === false, 'decision automatic-promotion boundary mismatch');

for (const disposition of [
  'ready_for_full_record_review',
  'duplicate_existing',
  'prelaunch_or_noncanonical',
  'insufficient_evidence',
  'out_of_scope',
  'deferred'
]) {
  assert(config.pr427_scope.allowed_dispositions.includes(disposition), `missing disposition: ${disposition}`);
}

assert(agents.includes('Current mandatory authority: PR #427 Record Growth Candidate Audit v2.'), 'AGENTS current authority mismatch');
assert(agents.includes('PR #426 Post-UI v3 Data-Growth Reset: complete'), 'AGENTS PR #426 state missing');
assert(agents.includes('PR #427 Record Growth Candidate Audit v2: active'), 'AGENTS PR #427 state missing');
assert(agents.includes('Canonical stable assets: 112'), 'AGENTS canonical count missing');
assert(agents.includes('UI v3 completion: true'), 'AGENTS UI completion boundary missing');

assert(roadmap.includes('Status: UI v3 complete; reviewed data growth resumed'), 'roadmap status mismatch');
assert(roadmap.includes('PR #426 Post-UI v3 Data-Growth Reset: complete'), 'roadmap PR #426 state missing');
assert(roadmap.includes('PR #427 Record Growth Candidate Audit v2: active'), 'roadmap PR #427 state missing');
assert(roadmap.includes('REVIEW GATE after PR #427'), 'roadmap review-gate state missing');

for (const text of [amendment, spec]) {
  assert(text.includes('PR #427'), 'governing text must name PR #427');
  assert(text.includes('REVIEW GATE'), 'governing text must require a review gate');
  assert(text.includes('112'), 'governing text must bind the 112-asset state');
}

console.log(JSON.stringify({
  ok: true,
  work_item: config.work_item,
  canonical_assets: config.source_state.canonical_assets,
  evidence: config.source_state.evidence,
  archive_recorded: config.source_state.archive_recorded,
  archive_not_recorded: config.source_state.archive_not_recorded,
  next_pr: config.approved_next_sequence[0].pr,
  candidate_limit: config.pr427_scope.maximum_candidates,
  canonical_changes_allowed: false,
  review_gate_after_pr427: true
}, null, 2));
