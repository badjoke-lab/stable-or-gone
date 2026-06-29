import fs from 'node:fs';
import './validate-launch-date-pr220-review.mjs';
import './validate-terminal-relationship-review.mjs';
import './validate-evidence-reliability-pr223.mjs';
import './validate-direct-workflow-placeholders-pr224.mjs';
import './validate-evidence-traceability-pr225.mjs';
import './validate-deployment-canonicality-pr226.mjs';
import './validate-deployment-canonicality-pr227.mjs';
import './validate-deployment-source-status-pr229.mjs';

const roadmap = fs.readFileSync('docs/roadmap.md', 'utf8');
const program = fs.readFileSync('docs/quality/non-ui-quality-program.md', 'utf8');
const governance = fs.readFileSync('docs/spec-governance.md', 'utf8');
const agents = fs.readFileSync('AGENTS.md', 'utf8');
const reviewSpec = fs.readFileSync('docs/quality/monitoring-review-material-spec.md', 'utf8');
const baselineSpec = fs.readFileSync('docs/quality/monitoring-baseline-spec.md', 'utf8');

for (const phrase of [
  'Latest completed: PR #234',
  'Active: PR #235',
  'Next: PR #236',
  'Stable assets: 92',
  'Gate V2-F: not passed',
  'Record growth: authorized after PR #246 candidate audit',
  'Production publication: deferred',
  'PR #234 monitoring baseline specification and pending source records',
  'Initial state: pending_initial_acceptance',
  'Live digests invented: false',
  'PR #246 final-eight candidate audit and selection',
  'PR #263 non-UI release-candidate material'
]) {
  if (!roadmap.includes(phrase)) throw new Error(`roadmap missing: ${phrase}`);
}

for (const phrase of [
  'PR #233 amends the earlier 92-record-only program',
  'Growth is allowed only through PR #246-#250',
  'No growth PR may contain more than two new stable assets',
  'Production publication remains deferred through PR #263',
  'After PR #263, continuation stops'
]) {
  if (!program.includes(phrase)) throw new Error(`non-UI program missing: ${phrase}`);
}

for (const phrase of [
  'PR #233 authorizes the bounded continuation through PR #263',
  'An accepted monitoring baseline is a repository-reviewed comparison point',
  'Monitoring executions remain read-only',
  'PR #263 does not authorize publication'
]) {
  if (!governance.includes(phrase)) throw new Error(`governance missing: ${phrase}`);
}

for (const phrase of [
  'PR #233 authorizes the bounded non-UI sequence through PR #263',
  'Growth beyond 92 assets is permitted only after PR #246',
  'Production publication remains prohibited through PR #263'
]) {
  if (!agents.includes(phrase)) throw new Error(`AGENTS.md missing: ${phrase}`);
}

for (const phrase of [
  'observed_facts',
  'inferences',
  'unresolved_questions',
  'rejected_duplicates',
  'Human approval required',
  'Automatic pull request: false',
  'No production deployment required'
]) {
  if (!reviewSpec.includes(phrase)) throw new Error(`PR #232 review specification missing: ${phrase}`);
}

for (const phrase of [
  'A baseline is not canonical evidence',
  'pending_initial_acceptance',
  'Monitoring execution may read this file but may not modify it',
  'No monitoring run may acquire write permission',
  'No production deployment required'
]) {
  if (!baselineSpec.includes(phrase)) throw new Error(`PR #234 baseline specification missing: ${phrase}`);
}

console.log('Active workstream validation passed: PR #234 is complete and PR #235 baseline-aware detection is active.');