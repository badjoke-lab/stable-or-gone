import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const handoff = readJson('docs/migration/evidence-archive-maintenance-batch-8-pr405-reviewed-handoff.json');
const gate = readJson('docs/migration/post-pr405-review-gate-pr406.json');
const decision = gate.decisions?.visa_open_usd_editorial_and_monitoring;

expect(handoff.status === 'reviewed_complete' && handoff.review_pr === 405, 'PR #405 handoff status changed');
expect(handoff.evidence_quality?.selected === 10 && handoff.evidence_quality?.changed === 0, 'PR #405 selected/changed boundary changed');
expect(handoff.evidence_quality?.dated_archive_added === 0, 'PR #405 dated archive boundary changed');
expect(handoff.evidence_quality?.reviewed_source_replacement === 0, 'PR #405 source replacement boundary changed');
expect(handoff.evidence_quality?.reviewed_no_safe_change === 10, 'PR #405 no-safe-change boundary changed');
expect(handoff.canonical_counts?.assets === 112, 'canonical asset count changed');
expect(handoff.canonical_counts?.evidence === 559 && handoff.canonical_counts?.evidence_relations === 559, 'canonical Evidence boundary changed');
expect(handoff.evidence_quality?.archive_recorded === 430 && handoff.evidence_quality?.archive_not_recorded === 129, 'archive coverage boundary changed');
expect(handoff.next_work_item?.decision === 'review_gate_required', 'PR #405 did not stop at review gate');

expect(gate.schema_version === '1.0', 'gate schema version changed');
expect(gate.review_pr === 406 && gate.status === 'reviewed_complete', 'gate status changed');
expect(gate.public_output === false, 'gate became public output');
expect(gate.source_pr === 405 && gate.source_merge_commit === 'bcf494b975a5e5cc38ddba218a4da9a787cef329', 'gate source binding changed');
expect(gate.binding_findings?.assets === 112, 'gate asset count changed');
expect(gate.binding_findings?.evidence === 559 && gate.binding_findings?.evidence_relations === 559, 'gate Evidence count changed');
expect(gate.binding_findings?.archive_recorded === 430 && gate.binding_findings?.archive_not_recorded === 129, 'gate archive boundary changed');
expect(gate.binding_findings?.pr405_selected === 10 && gate.binding_findings?.pr405_changed === 0, 'gate PR #405 review boundary changed');
expect(gate.binding_findings?.pr405_reviewed_no_safe_change === 10, 'gate PR #405 outcome changed');

expect(decision?.pr === 407, 'approved PR number changed');
expect(decision?.decision === 'approved_bounded_editorial_and_private_monitoring', 'approved decision changed');
expect(decision?.article_route === '/updates/visa-stablecoin-platform-open-usd/', 'article route changed');
expect(decision?.article_language === 'ja', 'article language changed');
expect(decision?.update_feed_entries === 1, 'Update Feed entry count changed');
expect(decision?.official_sources === 2, 'official source count changed');
expect(decision?.baseline_status === 'pending_initial_acceptance', 'baseline initial status changed');
expect(decision?.max_news_queries_added === 2, 'news query boundary changed');
expect(decision?.canonical_action === 'none', 'gate authorized canonical action');
expect(decision?.next_work_item === 'REVIEW GATE', 'PR #407 must stop at review gate');
expect(Array.isArray(decision?.monitoring_subjects) && decision.monitoring_subjects.length === 2, 'monitoring subject count changed');
expect(decision.monitoring_subjects?.[0]?.subject_id === 'open-usd' && decision.monitoring_subjects?.[0]?.canonical_record === false, 'Open USD subject boundary changed');
expect(decision.monitoring_subjects?.[1]?.subject_id === 'visa-stablecoin-platform' && decision.monitoring_subjects?.[1]?.canonical_record === false, 'VSP subject boundary changed');
expect(gate.boundaries?.canonical_counts_change === false, 'gate allowed canonical count changes');
expect(gate.boundaries?.canonical_data_change === false, 'gate allowed canonical data changes');
expect(gate.boundaries?.public_machine_readable_data_change === false, 'gate allowed public machine data changes');
expect(gate.boundaries?.private_monitoring_only === true, 'monitoring privacy boundary changed');
expect(gate.boundaries?.one_bounded_editorial_route === true, 'editorial route boundary changed');
expect(gate.boundaries?.automatic_promotion === false, 'automatic promotion was authorized');
expect(gate.boundaries?.review_gate_after_pr407 === true, 'review gate after PR #407 removed');

for (const required of [
  'open_usd_canonical_asset',
  'open_standard_canonical_issuer',
  'canonical_event_or_evidence',
  'public_monitoring_output',
  'automatic_baseline_acceptance',
  'automatic_canonical_promotion',
  'archive_batch_9',
  'unrelated_workstream'
]) expect(gate.prohibited?.includes(required), `missing prohibited boundary ${required}`);

try {
  git('rev-parse', '--verify', 'origin/main');
  for (const file of [
    'data/entities.json',
    'data/events.json',
    'data/evidence.json',
    'data/stats-history.json',
    'docs/migration/current-canonical-checkpoint.json',
    'docs/migration/current-stats-history-checkpoint.json',
    'docs/migration/registry-release-integrity-baseline.json'
  ]) expect(git('hash-object', file) === git('rev-parse', `origin/main:${file}`), `${file}: immutable content changed in review gate`);
} catch (error) {
  failures.push(`unable to verify origin/main immutability: ${error.message}`);
}

for (const [file, markers] of [
  ['AGENTS.md', ['PR #406 Post-PR #405 Review Gate: active; complete on merge', 'PR #407 Visa Stablecoin Platform article and OUSD/VSP private monitoring: approved next', 'PR #407 must stop at `REVIEW GATE`']],
  ['docs/roadmap.md', ['Status: canonical execution schedule — PR #406 active', 'PR #407 Visa Stablecoin Platform article and OUSD/VSP private monitoring registration', 'After PR #407, stop at `REVIEW GATE`']],
  ['docs/quality/post-pr405-review-gate-pr406-spec.md', ['PR #407 Visa Stablecoin Platform article and OUSD/VSP private monitoring registration', '/updates/visa-stablecoin-platform-open-usd/', 'The two new official-source baselines must begin as `pending_initial_acceptance`']]
]) {
  const value = readText(file);
  for (const marker of markers) expect(value.includes(marker), `${file}: missing authority marker ${marker}`);
}

for (const file of [
  'public/data/post-pr405-review-gate-pr406.json',
  'src/pages/post-pr405-review-gate-pr406.astro'
]) expect(!fs.existsSync(path.join(root, file)), `${file}: private review gate leaked into public surface`);

if (failures.length) {
  console.error('PR #406 post-PR #405 review gate validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  review_pr: 406,
  source_pr: 405,
  approved_next_pr: 407,
  article_route: decision.article_route,
  private_monitoring_subjects: decision.monitoring_subjects.length,
  canonical_action: decision.canonical_action,
  next_authority: decision.next_work_item
}, null, 2));
