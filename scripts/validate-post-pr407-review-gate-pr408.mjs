import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const handoff = readJson('docs/migration/visa-open-usd-article-monitoring-pr407-handoff.json');
const gate = readJson('docs/migration/post-pr407-review-gate-pr408.json');
const decision = gate.decisions?.ui_v3_rebuild_design_contract;

expect(handoff.status === 'implementation_complete' && handoff.implementation_pr === 407, 'PR #407 handoff status changed');
expect(handoff.article?.route === '/updates/visa-stablecoin-platform-open-usd/', 'PR #407 article route changed');
expect(handoff.article?.canonical_stablecoin_record === false, 'PR #407 article became a canonical stablecoin record');
expect(handoff.private_monitoring?.subject_count === 2, 'PR #407 monitoring subject count changed');
expect(handoff.private_monitoring?.pending_initial_baseline_count === 2, 'PR #407 pending baseline count changed');
expect(handoff.private_monitoring?.public_output === false, 'PR #407 monitoring became public');
expect(handoff.canonical_counts?.assets === 112, 'canonical asset count changed');
expect(handoff.canonical_counts?.evidence === 559 && handoff.canonical_counts?.evidence_relations === 559, 'canonical Evidence counts changed');
expect(handoff.canonical_changes === 0 && handoff.public_machine_readable_canonical_changes === 0, 'PR #407 canonical boundary changed');
expect(handoff.next_work_item?.decision === 'review_gate_required', 'PR #407 did not stop at review gate');

expect(gate.review_pr === 408 && gate.source_pr === 407, 'PR #408 identity changed');
expect(gate.source_merge_commit === '7fcd5b245b1ae8d184cb0ef5a34d0ca55434b5f8', 'PR #408 source merge binding changed');
expect(gate.status === 'reviewed_complete' && gate.public_output === false, 'PR #408 gate status changed');
expect(gate.binding_findings?.assets === 112, 'gate asset count changed');
expect(gate.binding_findings?.evidence === 559 && gate.binding_findings?.evidence_relations === 559, 'gate Evidence counts changed');
expect(gate.binding_findings?.canonical_changes === 0, 'gate records canonical changes');
expect(decision?.issue === 281 && decision?.pr === 409, 'UI rebuild issue/PR binding changed');
expect(decision?.decision === 'approved_specification_and_failure_gates_only', 'PR #409 authorization changed');
expect(decision?.phase === 'PR A', 'UI rebuild phase changed');
expect(decision?.production_ui_change === false, 'PR #409 was authorized to change production UI');
expect(decision?.canonical_action === 'none', 'PR #409 was authorized to change canonical data');
expect(decision?.next_work_item === 'REVIEW GATE', 'PR #409 must stop at review gate');
expect(gate.boundaries?.canonical_counts_change === false, 'gate allows canonical count changes');
expect(gate.boundaries?.canonical_data_change === false, 'gate allows canonical data changes');
expect(gate.boundaries?.public_machine_readable_data_change === false, 'gate allows public machine-readable changes');
expect(gate.boundaries?.one_next_work_item === true, 'gate must authorize exactly one next work item');
expect(gate.boundaries?.review_gate_after_pr409 === true, 'review gate after PR #409 removed');

try {
  git('rev-parse', '--verify', 'origin/main');
  const changed = git('diff', '--name-only', 'origin/main...HEAD', '--', 'data/', 'src/', 'public/', 'config/', 'scripts/monitoring/').split('\n').filter(Boolean);
  expect(changed.length === 0, `PR #408 contains implementation/data changes: ${changed.join(', ')}`);
  for (const file of [
    'data/stats-history.json',
    'docs/migration/current-canonical-checkpoint.json',
    'docs/migration/current-stats-history-checkpoint.json',
    'docs/migration/registry-release-integrity-baseline.json'
  ]) expect(git('hash-object', file) === git('rev-parse', `origin/main:${file}`), `${file}: immutable checkpoint changed`);
} catch (error) {
  failures.push(`origin/main comparison failed: ${error.message}`);
}

for (const [file, markers] of [
  ['AGENTS.md', ['PR #408 Post-PR #407 Review Gate: active; complete on merge', 'PR #409 UI v3 Rebuild A — design contract and failure gates: approved next', 'PR #409 must stop at `REVIEW GATE`']],
  ['docs/roadmap.md', ['Status: canonical execution schedule — PR #408 active review gate', 'PR #409 — UI v3 Rebuild A: design contract and failure gates', 'After PR #409, stop at `REVIEW GATE`']],
  ['docs/quality/post-pr407-review-gate-pr408-spec.md', ['PR #409 — UI v3 Rebuild A: design contract and failure gates', 'make visual-audit skipping a hard failure', 'stops at another `REVIEW GATE`']]
]) {
  const value = readText(file);
  for (const marker of markers) expect(value.includes(marker), `${file}: missing authority marker ${marker}`);
}

if (failures.length) {
  console.error('PR #408 post-PR #407 review gate validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  review_pr: 408,
  source_pr: 407,
  approved_issue: 281,
  approved_next_pr: 409,
  phase: decision.phase,
  production_ui_change: decision.production_ui_change,
  canonical_action: decision.canonical_action,
  next_authority: decision.next_work_item
}, null, 2));
