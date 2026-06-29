import fs from 'node:fs';
import './validate-launch-date-pr220-review.mjs';
import './validate-terminal-relationship-review.mjs';
import './validate-evidence-reliability-pr223.mjs';
import './validate-direct-workflow-placeholders-pr224.mjs';
import './validate-evidence-traceability-pr225.mjs';
import './validate-deployment-canonicality-pr226.mjs';
import './validate-deployment-canonicality-pr227.mjs';
import './validate-deployment-source-status-pr229.mjs';
import './validate-monitoring-reserve-assurance-pr241.mjs';
import './validate-monitoring-redemption-terms-pr242.mjs';
import './validate-monitoring-issuer-lifecycle-pr243.mjs';
import './validate-monitoring-regulatory-boundary-pr244.mjs';
import './validate-monitoring-coverage-pr245.mjs';
import './validate-final-eight-candidate-audit-pr246.mjs';

const roadmap = fs.readFileSync('docs/roadmap.md', 'utf8');
const program = fs.readFileSync('docs/quality/non-ui-quality-program.md', 'utf8');
const governance = fs.readFileSync('docs/spec-governance.md', 'utf8');
const agents = fs.readFileSync('AGENTS.md', 'utf8');
const selection = fs.readFileSync('docs/quality/final-eight-candidate-audit-spec.md', 'utf8');

for (const phrase of [
  'Latest completed: PR #246', 'Active: PR #247', 'Next: PR #248',
  'Stable assets: 92', 'Gate V2-F: not passed',
  'Growth A authorized for selected candidates only',
  'PR #247 Growth A: 92 -> 94 — DOLA, OUSD',
  'PR #263 non-UI release-candidate material'
]) if (!roadmap.includes(phrase)) throw new Error(`roadmap missing: ${phrase}`);

for (const [document, phrase] of [
  [program, 'No growth PR may contain more than two new stable assets'],
  [program, 'Production publication remains deferred through PR #263'],
  [governance, 'Monitoring executions remain read-only'],
  [governance, 'PR #263 does not authorize publication'],
  [agents, 'Growth beyond 92 assets is permitted only after PR #246'],
  [selection, 'Selection is a research decision only'],
  [selection, 'exactly eight candidates exist with IDs 93 through 100'],
  [selection, 'No production deployment required']
]) if (!document.includes(phrase)) throw new Error(`active workstream document missing: ${phrase}`);

console.log('Active workstream validation passed: PR #246 complete; PR #247 Growth A active.');
