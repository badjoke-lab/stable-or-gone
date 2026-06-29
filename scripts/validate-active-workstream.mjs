import fs from 'node:fs';
import './validate-launch-date-pr220-review.mjs';
import './validate-terminal-relationship-review.mjs';
import './validate-evidence-reliability-pr223.mjs';
import './validate-direct-workflow-placeholders-pr224.mjs';
import './validate-evidence-traceability-pr225.mjs';
import './validate-deployment-canonicality-pr226.mjs';
import './validate-deployment-canonicality-pr227.mjs';
import './validate-deployment-source-status-pr229.mjs';
import './validate-current-monitoring-configuration.mjs';
import './validate-current-coverage.mjs';
import './validate-final-eight-candidate-audit-pr246.mjs';
import './validate-batch18-growth-a.mjs';

const roadmap = fs.readFileSync('docs/roadmap.md', 'utf8');
const program = fs.readFileSync('docs/quality/non-ui-quality-program.md', 'utf8');
const governance = fs.readFileSync('docs/spec-governance.md', 'utf8');
const agents = fs.readFileSync('AGENTS.md', 'utf8');

for (const phrase of [
  'Latest completed: PR #247',
  'Active: PR #248',
  'Next: PR #249',
  'Stable assets: 94',
  'Gate V2-F: not passed',
  'Growth B authorized for corrected candidates only',
  'PR #247 Growth A: 92 -> 94 — complete',
  'PR #248 Growth B: 94 -> 96',
  'PR #263 non-UI release-candidate material'
]) if (!roadmap.includes(phrase)) throw new Error(`roadmap missing: ${phrase}`);

for (const [document, phrase] of [
  [program, 'No growth PR may contain more than two new stable assets'],
  [program, 'Production publication remains deferred through PR #263'],
  [governance, 'Monitoring executions remain read-only'],
  [governance, 'PR #263 does not authorize publication'],
  [agents, 'Growth beyond 92 assets is permitted only after PR #246'],
  [agents, 'Production publication remains prohibited through PR #263']
]) if (!document.includes(phrase)) throw new Error(`active workstream document missing: ${phrase}`);

console.log('Active workstream validation passed: corrected Growth A is complete and PR #248 Growth B is active.');
