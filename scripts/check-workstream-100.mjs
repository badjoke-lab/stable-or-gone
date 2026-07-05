import fs from 'node:fs';
import './validate-batch21-growth-d.mjs';
import './validate-current-final-eight.mjs';

const read = (file) => fs.readFileSync(file, 'utf8');
const roadmap = read('docs/roadmap.md');
const agents = read('AGENTS.md');
const governance = read('docs/spec-governance.md');
const nonUiPlan = read('docs/quality/non-ui-quality-program.md');
const marketAccessSpec = read('docs/quality/eu-stablecoin-market-access-research-and-monitoring-spec.md');

const failures = [];
const requireText = (body, text, file) => {
  if (!body.includes(text)) failures.push(`${file}: missing required workstream marker: ${text}`);
};

requireText(roadmap, 'Active workstream: 100-record registry-wide audit', 'docs/roadmap.md');
requireText(roadmap, 'UI status: maintenance-only; no active redesign program', 'docs/roadmap.md');
requireText(roadmap, 'PR #301 — deployment and chain identity — complete', 'docs/roadmap.md');
requireText(roadmap, 'PR #302 — lifecycle and relationship boundary audit — active', 'docs/roadmap.md');
requireText(roadmap, 'PR #303 — specification and schedule amendment — active', 'docs/roadmap.md');
requireText(roadmap, 'PR #304 — reviewed EU stablecoin market-access guide', 'docs/roadmap.md');
requireText(roadmap, 'PR #306 — monitoring coverage recalculation for 100 assets', 'docs/roadmap.md');
requireText(roadmap, 'PR #314 lifecycle, regulatory, and EU market-access source/schema expansion', 'docs/roadmap.md');
requireText(roadmap, 'PR #316 deterministic statistics generator and validator', 'docs/roadmap.md');
requireText(roadmap, 'PR #321 100 -> 102', 'docs/roadmap.md');

requireText(agents, 'The dedicated UI program is stopped. UI is maintenance-only.', 'AGENTS.md');
requireText(agents, 'Active: PR #302 lifecycle and relationship boundary audit', 'AGENTS.md');
requireText(agents, 'Owner-directed insertion: PR #303 EU market-access specification and schedule amendment', 'AGENTS.md');
requireText(agents, 'Next public implementation after PR #302: PR #304 reviewed EU stablecoin market-access guide', 'AGENTS.md');

requireText(governance, 'The active core workstream is governed by:', 'docs/spec-governance.md');
requireText(governance, 'UI is maintenance-only.', 'docs/spec-governance.md');
requireText(governance, 'docs/quality/eu-stablecoin-market-access-research-and-monitoring-spec.md', 'docs/spec-governance.md');

requireText(nonUiPlan, 'Status: canonical implementation plan — active', 'docs/quality/non-ui-quality-program.md');
requireText(nonUiPlan, 'Registry checkpoint: 100 canonical stable assets', 'docs/quality/non-ui-quality-program.md');
requireText(nonUiPlan, 'Active Phase A — 100-record registry-wide audit', 'docs/quality/non-ui-quality-program.md');
requireText(nonUiPlan, 'PR #314 lifecycle, regulatory, and EU market-access source/schema expansion', 'docs/quality/non-ui-quality-program.md');

requireText(marketAccessSpec, 'Status: canonical specification', 'docs/quality/eu-stablecoin-market-access-research-and-monitoring-spec.md');
requireText(marketAccessSpec, '/guides/eu-stablecoin-access-after-mica/', 'docs/quality/eu-stablecoin-market-access-research-and-monitoring-spec.md');
requireText(marketAccessSpec, 'at least 10 platforms researched', 'docs/quality/eu-stablecoin-market-access-research-and-monitoring-spec.md');
requireText(marketAccessSpec, 'at least 15 stable assets reviewed', 'docs/quality/eu-stablecoin-market-access-research-and-monitoring-spec.md');

if (failures.length) {
  console.error('100-record core workstream validation failed:');
  failures.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}

console.log('100-record core workstream checks passed: PR #302 is active, PR #303 defines the market-access insertion, and PR #304 is the next public implementation after PR #302.');
