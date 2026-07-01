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
const governance = fs.readFileSync('docs/spec-governance.md', 'utf8');
const agents = fs.readFileSync('AGENTS.md', 'utf8');
const uiPlan = fs.readFileSync('docs/ui-redesign/implementation-plan.md', 'utf8');
const uiV3 = fs.readFileSync('docs/architecture/approved-editorial-ledger-ui-v3.md', 'utf8');
const uiV2 = fs.readFileSync('docs/architecture/approved-modern-data-product-ui-v2.md', 'utf8');
const mocksV3 = fs.readFileSync('docs/ui-redesign/approved-mocks-v3/README.md', 'utf8');

for (const phrase of [
  'Latest completed: PR #260',
  'Active: PR #261 — Editorial Ledger UI v3 specification and schedule alignment',
  'Next: PR #262 — shared Editorial Ledger shell',
  'Canonical stable assets: 98',
  'Open stale draft: PR #251 — Growth D; do not merge as-is',
  'Active workstream: UI remediation',
  'PR #262 — shared Editorial Ledger shell',
  'PR #270 — representative all-family visual audit',
  'PR #272 — production verification and UI v3 closure',
  'Growth D to 100 records'
]) {
  if (!roadmap.includes(phrase)) throw new Error(`roadmap missing: ${phrase}`);
}

for (const [document, phrase] of [
  [program, 'Status: canonical implementation schedule — paused'],
  [program, 'Growth D PR #251: stale draft; do not merge as-is'],
  [program, 'No growth PR may contain more than two new stable assets'],
  [program, 'After UI v3 closes through PR #272'],
  [governance, 'the binding workstream is the Editorial Ledger UI v3 remediation'],
  [governance, 'Monitoring executions remain read-only'],
  [governance, 'PR #251 is a stale Growth D draft and must not be merged as-is'],
  [agents, 'The active workstream is the Editorial Ledger UI v3 remediation'],
  [agents, 'A normal `main` merge triggers the production deployment workflow automatically'],
  [agents, 'The old PR #251 must not be merged as-is'],
  [uiPlan, 'Status: canonical implementation schedule — active'],
  [uiPlan, 'Visual direction: Editorial Ledger'],
  [uiPlan, 'PR #262 — shared Editorial Ledger shell'],
  [uiPlan, 'PR #272 — production verification and closure'],
  [uiV3, 'Status: canonical visual and page-implementation contract'],
  [uiV3, 'The default public surface is light, not dark'],
  [uiV3, 'do not create a new logo'],
  [uiV2, 'Status: historical plan — superseded'],
  [mocksV3, 'Status: canonical reference description']
]) {
  if (!document.includes(phrase)) throw new Error(`active workstream document missing: ${phrase}`);
}

console.log('Current workstream valid: 98 canonical assets are preserved and Editorial Ledger UI v3 is active through PR #272.');
