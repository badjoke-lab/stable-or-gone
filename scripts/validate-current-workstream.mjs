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
import './validate-batch19-growth-b.mjs';
import './validate-batch20-growth-c.mjs';

const roadmap = fs.readFileSync('docs/roadmap.md', 'utf8');
const program = fs.readFileSync('docs/quality/non-ui-quality-program.md', 'utf8');
const amendment = fs.readFileSync('docs/quality/pr249-uk-stablecoin-guide-amendment.md', 'utf8');
const governance = fs.readFileSync('docs/spec-governance.md', 'utf8');
const agents = fs.readFileSync('AGENTS.md', 'utf8');

for (const phrase of [
  'Latest completed: PR #250',
  'Active: PR #251 — Growth D',
  'Next: PR #252 — 100-record identity audit',
  'Stable assets: 98',
  'Gate V2-F: not passed',
  'Record growth: Growth D authorized for corrected candidates only',
  'PR #249 Editorial guide: 96 -> 96 — complete',
  'PR #250 Growth C: 96 -> 98 — complete',
  'PR #251 Growth D: 98 -> 100',
  'PR #264 is not a separate publication checkpoint'
]) {
  if (!roadmap.includes(phrase)) throw new Error(`roadmap missing: ${phrase}`);
}

for (const [document, phrase] of [
  [program, 'No growth PR may contain more than two new stable assets'],
  [amendment, 'PR #249 is an editorial interruption and changes no canonical registry count'],
  [amendment, 'Production publication is governed by `docs/deployment-policy.md`'],
  [amendment, 'PR #250 Growth C: 96 -> 98'],
  [governance, 'Monitoring executions remain read-only'],
  [governance, 'PR #264 is not a separate publication checkpoint'],
  [agents, 'Growth beyond 92 assets is permitted only after PR #246'],
  [agents, 'A normal `main` merge triggers the production deployment workflow automatically'],
  [agents, 'PR #249 is limited to the UK stablecoin capital-rules guide']
]) {
  if (!document.includes(phrase)) throw new Error(`active workstream document missing: ${phrase}`);
}

console.log('Current workstream valid: Growth C is complete at 98 assets and Growth D follows in PR #251.');
