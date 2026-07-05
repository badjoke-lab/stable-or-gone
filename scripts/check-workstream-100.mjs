import fs from 'node:fs';
import './validate-batch21-growth-d.mjs';
import './validate-current-final-eight.mjs';

const read = (file) => fs.readFileSync(file, 'utf8');
const roadmap = read('docs/roadmap.md');
const agents = read('AGENTS.md');
const governance = read('docs/spec-governance.md');
const nonUiPlan = read('docs/quality/non-ui-quality-program.md');
const marketAccessSpec = read('docs/quality/eu-stablecoin-market-access-research-and-monitoring-spec.md');
const matrix = JSON.parse(read('data/editorial-research/eu-stablecoin-market-access.json'));
const contextBatch = JSON.parse(read('data/editorial-research/eu-stablecoin-market-access-context-batch-02.json'));

const failures = [];
const requireText = (body, text, file) => {
  if (!body.includes(text)) failures.push(`${file}: missing required workstream marker: ${text}`);
};

requireText(roadmap, 'Active workstream: EU/EEA stablecoin market-access research checkpoint', 'docs/roadmap.md');
requireText(roadmap, 'UI status: maintenance-only; no active redesign program', 'docs/roadmap.md');
requireText(roadmap, 'PR #302 completed lifecycle and relationship boundary audit', 'docs/roadmap.md');
requireText(roadmap, 'PR #303 merged the EU stablecoin market-access research, publication, and monitoring specification', 'docs/roadmap.md');
requireText(roadmap, '### PR #304 — research checkpoint and schedule synchronization — active', 'docs/roadmap.md');
requireText(roadmap, '### PR #305 — reviewed EU stablecoin market-access guide', 'docs/roadmap.md');
requireText(roadmap, 'PR #307 — monitoring coverage recalculation for 100 assets', 'docs/roadmap.md');
requireText(roadmap, 'PR #315 lifecycle, regulatory, and EU market-access source/schema expansion', 'docs/roadmap.md');
requireText(roadmap, 'PR #317 deterministic statistics generator and validator', 'docs/roadmap.md');
requireText(roadmap, 'PR #322 100 -> 102', 'docs/roadmap.md');

requireText(agents, 'The dedicated UI program is stopped. UI is maintenance-only.', 'AGENTS.md');
requireText(agents, 'Active: PR #304 EU/EEA market-access research checkpoint and schedule synchronization', 'AGENTS.md');
requireText(agents, 'Next public implementation: PR #305 reviewed EU stablecoin market-access guide after publication gates pass', 'AGENTS.md');

requireText(governance, 'Current execution state:', 'docs/spec-governance.md');
requireText(governance, 'PR #304 market-access research checkpoint and schedule synchronization active', 'docs/spec-governance.md');
requireText(governance, 'PR #305 market-access guide blocked until publication gates pass', 'docs/spec-governance.md');
requireText(governance, 'docs/quality/eu-stablecoin-market-access-research-and-monitoring-spec.md', 'docs/spec-governance.md');

requireText(nonUiPlan, 'Status: canonical implementation plan — active', 'docs/quality/non-ui-quality-program.md');
requireText(nonUiPlan, 'Registry checkpoint: 100 canonical stable assets', 'docs/quality/non-ui-quality-program.md');
requireText(nonUiPlan, '### PR #304 — research checkpoint and schedule synchronization — active', 'docs/quality/non-ui-quality-program.md');
requireText(nonUiPlan, 'PR #315 lifecycle, regulatory, and EU market-access source/schema expansion', 'docs/quality/non-ui-quality-program.md');

requireText(marketAccessSpec, 'Status: canonical specification', 'docs/quality/eu-stablecoin-market-access-research-and-monitoring-spec.md');
requireText(marketAccessSpec, '/guides/eu-stablecoin-access-after-mica/', 'docs/quality/eu-stablecoin-market-access-research-and-monitoring-spec.md');
requireText(marketAccessSpec, 'PR #304  reviewed research matrix, checkpoints, and schedule synchronization', 'docs/quality/eu-stablecoin-market-access-research-and-monitoring-spec.md');
requireText(marketAccessSpec, 'PR #305  reviewed EU stablecoin market-access article after publication gate passes', 'docs/quality/eu-stablecoin-market-access-research-and-monitoring-spec.md');

if (matrix.research_id !== 'eu-stablecoin-market-access-2026') failures.push('research matrix id mismatch');
if (matrix.status !== 'research_in_progress') failures.push('research matrix must remain research_in_progress');
if (matrix.publication_gate?.publishable !== false) failures.push('research matrix must not be marked publishable');
if (matrix.publication_gate?.minimum_platforms_researched !== 10) failures.push('minimum platform research gate must remain 10');
if (matrix.publication_gate?.minimum_stable_assets_reviewed !== 15) failures.push('minimum stable asset research gate must remain 15');
if (matrix.publication_gate?.function_level_matrix_complete !== false) failures.push('function-level matrix must remain incomplete at checkpoint 01');
if (matrix.publication_gate?.revolut_scope_confirmed !== false) failures.push('Revolut policy scope must remain unresolved at checkpoint 01');

if (contextBatch.research_id !== matrix.research_id) failures.push('context batch research id mismatch');
if (contextBatch.research_gate_effect?.minimum_platform_research_target_met !== true) failures.push('context batch must record the platform breadth target as met');
if (contextBatch.research_gate_effect?.function_level_matrix_complete !== false) failures.push('context batch must keep function-level matrix incomplete');
if (contextBatch.research_gate_effect?.publication_ready !== false) failures.push('context batch must not be publication ready');

if (failures.length) {
  console.error('100-record core workstream validation failed:');
  failures.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}

console.log('100-record core workstream checks passed: PR #302 and #303 are complete, PR #304 is the research checkpoint, and PR #305 remains gated on reviewed publication readiness.');
