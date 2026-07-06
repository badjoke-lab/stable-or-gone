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
const functionBatch = JSON.parse(read('data/editorial-research/eu-stablecoin-market-access-function-batch-03.json'));
const reauditBatch = JSON.parse(read('data/editorial-research/eu-stablecoin-market-access-reaudit-batch-04.json'));
const checkpoint03 = read('docs/audits/eu-stablecoin-market-access-research-checkpoint-03-2026-07-05.md');
const gateReview = read('docs/audits/eu-stablecoin-market-access-publication-gate-review-2026-07-05.md');

const failures = [];
const requireText = (body, text, file) => {
  if (!body.includes(text)) failures.push(`${file}: missing required workstream marker: ${text}`);
};

requireText(roadmap, 'Current item: PR #308 known-unknown and placeholder integrity audit', 'docs/roadmap.md');
requireText(roadmap, 'Next item: PR #309 monitoring coverage recalculation for 100 assets', 'docs/roadmap.md');
requireText(roadmap, 'PR #307 published the reviewed EU/EEA stablecoin market-access guide.', 'docs/roadmap.md');
requireText(roadmap, 'PR #317 lifecycle, regulatory, and EU market-access source/schema expansion', 'docs/roadmap.md');
requireText(roadmap, 'PR #319 deterministic statistics generator and validator', 'docs/roadmap.md');
requireText(roadmap, 'PR #324 100 -> 102', 'docs/roadmap.md');
requireText(roadmap, 'Explicit unknown-value semantics are not placeholders', 'docs/roadmap.md');

requireText(agents, 'Active: PR #308 known-unknown and placeholder integrity audit', 'AGENTS.md');
requireText(agents, 'Next: PR #309 monitoring coverage recalculation for 100 assets', 'AGENTS.md');
requireText(agents, 'A. asset-specific function evidence', 'AGENTS.md');

requireText(governance, 'PR #307 reviewed market-access guide published', 'docs/spec-governance.md');
requireText(governance, 'PR #308 known-unknown and placeholder integrity audit active', 'docs/spec-governance.md');
requireText(governance, 'PR #309 monitoring coverage recalculation next', 'docs/spec-governance.md');

requireText(nonUiPlan, 'PR #307 reviewed article: complete', 'docs/quality/non-ui-quality-program.md');
requireText(nonUiPlan, 'PR #308 known-unknown and placeholder integrity audit: active', 'docs/quality/non-ui-quality-program.md');
requireText(nonUiPlan, 'PR #309 monitoring coverage recalculation: next', 'docs/quality/non-ui-quality-program.md');
requireText(nonUiPlan, 'PR #317 lifecycle, regulatory, and EU market-access source/schema expansion', 'docs/quality/non-ui-quality-program.md');

requireText(marketAccessSpec, 'PR #307  reviewed EU stablecoin market-access article after publication gate passes', 'docs/quality/eu-stablecoin-market-access-research-and-monitoring-spec.md');
if (matrix.research_id !== 'eu-stablecoin-market-access-2026') failures.push('research matrix id mismatch');
if (matrix.status !== 'research_in_progress') failures.push('base research matrix status must remain historical research state');
if (matrix.publication_gate?.publishable !== false) failures.push('base research matrix must preserve pre-gate historical state');
if (contextBatch.research_gate_effect?.publication_ready !== false) failures.push('context batch must preserve historical not-ready state');
if (functionBatch.gate_effect?.publication_ready !== false) failures.push('checkpoint 03 must preserve historical not-ready state');
if (reauditBatch.article_gate_effect?.full_asset_and_platform_reaudit_complete !== true) failures.push('reaudit batch completion missing');

requireText(checkpoint03, 'A. asset-specific function evidence', 'checkpoint 03 audit');
requireText(gateReview, 'publication gate:                               pass', 'publication gate review');

if (failures.length) {
  console.error('100-record core workstream validation failed:');
  failures.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}

console.log('100-record core workstream checks passed: PR #307 is published, PR #308 is active, and PR #309 remains next.');
