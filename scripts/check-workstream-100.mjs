import fs from 'node:fs';
import './validate-batch21-growth-d.mjs';
import './validate-current-final-eight.mjs';

const read = (file) => fs.readFileSync(file, 'utf8');
const roadmap = read('docs/roadmap.md');
const agents = read('AGENTS.md');
const governance = read('docs/spec-governance.md');
const nonUiPlan = read('docs/quality/non-ui-quality-program.md');

const failures = [];
const requireText = (body, text, file) => {
  if (!body.includes(text)) failures.push(`${file}: missing required workstream marker: ${text}`);
};
const forbidText = (body, text, file) => {
  if (body.includes(text)) failures.push(`${file}: stale workstream marker remains: ${text}`);
};

requireText(roadmap, 'Active workstream: 100-record registry-wide audit', 'docs/roadmap.md');
requireText(roadmap, 'UI status: maintenance-only; no active redesign program', 'docs/roadmap.md');
requireText(roadmap, 'PR #297 — identity uniqueness and lineage — complete', 'docs/roadmap.md');
requireText(roadmap, 'PR #298 — organization and relationship integrity — active', 'docs/roadmap.md');
requireText(roadmap, 'PR #299 — evidence and source-identity integrity — next', 'docs/roadmap.md');
requireText(roadmap, 'PR #304 — monitoring coverage recalculation for 100 assets', 'docs/roadmap.md');
requireText(roadmap, 'PR #314 deterministic statistics generator and validator', 'docs/roadmap.md');
requireText(roadmap, 'PR #319 100 -> 102', 'docs/roadmap.md');
forbidText(roadmap, 'Active workstream: Terminal UI restoration', 'docs/roadmap.md');

requireText(agents, 'The dedicated UI program is stopped. UI is maintenance-only.', 'AGENTS.md');
requireText(agents, 'The active workstream is the 100-record registry-wide audit', 'AGENTS.md');
requireText(agents, 'Active: PR #298 organization and relationship integrity audit', 'AGENTS.md');
requireText(agents, 'Next: PR #299 evidence and source-identity integrity audit', 'AGENTS.md');
forbidText(agents, 'The active workstream is the Editorial Ledger UI v3 remediation', 'AGENTS.md');

requireText(governance, 'The active core workstream is governed by:', 'docs/spec-governance.md');
requireText(governance, 'UI is maintenance-only.', 'docs/spec-governance.md');
requireText(governance, '100-record registry-wide audit active', 'docs/spec-governance.md');

requireText(nonUiPlan, 'Status: canonical implementation plan — active', 'docs/quality/non-ui-quality-program.md');
requireText(nonUiPlan, 'Registry checkpoint: 100 canonical stable assets', 'docs/quality/non-ui-quality-program.md');
requireText(nonUiPlan, 'Active Phase A — 100-record registry-wide audit', 'docs/quality/non-ui-quality-program.md');

if (failures.length) {
  console.error('100-record core workstream validation failed:');
  failures.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}

console.log('100-record core workstream checks passed: PR #297 is complete, PR #298 audit is active, and PR #299 is next.');
