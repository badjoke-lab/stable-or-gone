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

const roadmap = fs.readFileSync('docs/roadmap.md', 'utf8');
const program = fs.readFileSync('docs/quality/non-ui-quality-program.md', 'utf8');
const governance = fs.readFileSync('docs/spec-governance.md', 'utf8');
const agents = fs.readFileSync('AGENTS.md', 'utf8');
const coverageSpec = fs.readFileSync('docs/quality/monitoring-coverage-report-spec.md', 'utf8');

const checks = [
  [roadmap, 'Latest completed: PR #245'],
  [roadmap, 'Active: PR #246'],
  [roadmap, 'Next: PR #247'],
  [roadmap, 'Stable assets: 92'],
  [roadmap, 'Gate V2-F: not passed'],
  [roadmap, 'Record growth: authorized after PR #246 candidate audit'],
  [roadmap, 'Production publication: deferred'],
  [roadmap, 'Enabled official sources: 24'],
  [roadmap, 'Covered stable assets: 16'],
  [roadmap, 'Uncovered stable assets: 76'],
  [roadmap, 'Accepted baselines: 0'],
  [roadmap, 'PR #246 final-eight candidate audit and selection'],
  [roadmap, 'PR #263 non-UI release-candidate material'],
  [program, 'Growth is allowed only through PR #246-#250'],
  [program, 'No growth PR may contain more than two new stable assets'],
  [program, 'Production publication remains deferred through PR #263'],
  [governance, 'Monitoring executions remain read-only'],
  [governance, 'PR #263 does not authorize publication'],
  [agents, 'Growth beyond 92 assets is permitted only after PR #246'],
  [agents, 'Production publication remains prohibited through PR #263'],
  [coverageSpec, 'PR #245 completes the reviewed source-coverage implementation phase'],
  [coverageSpec, 'No production deployment required']
];

for (const [document, phrase] of checks) {
  if (!document.includes(phrase)) throw new Error(`active workstream document missing: ${phrase}`);
}

console.log('Active workstream validation passed: Phase B is complete and PR #246 candidate selection is active.');
