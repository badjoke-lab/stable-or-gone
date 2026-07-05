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
const checkpoint03 = read('docs/audits/eu-stablecoin-market-access-research-checkpoint-03-2026-07-05.md');

const failures = [];
const requireText = (body, text, file) => {
  if (!body.includes(text)) failures.push(`${file}: missing required workstream marker: ${text}`);
};

requireText(roadmap, 'Current item: PR #306 function-matrix research checkpoint 03', 'docs/roadmap.md');
requireText(roadmap, 'Next public item: PR #307 reviewed EU stablecoin market-access guide after publication gates pass', 'docs/roadmap.md');
requireText(roadmap, 'PR #305 merged the checkpoint 03 schedule amendment', 'docs/roadmap.md');
requireText(roadmap, 'PR #309 monitoring coverage recalculation for 100 assets', 'docs/roadmap.md');
requireText(roadmap, 'PR #317 lifecycle, regulatory, and EU market-access source/schema expansion', 'docs/roadmap.md');
requireText(roadmap, 'PR #319 deterministic statistics generator and validator', 'docs/roadmap.md');
requireText(roadmap, 'PR #324 100 -> 102', 'docs/roadmap.md');

requireText(agents, 'Active: PR #306 function-matrix research checkpoint 03', 'AGENTS.md');
requireText(agents, 'Next public implementation: PR #307 reviewed EU stablecoin market-access guide after publication gates pass', 'AGENTS.md');
requireText(agents, 'A. asset-specific function evidence', 'AGENTS.md');

requireText(governance, 'PR #306 function-matrix checkpoint 03 active', 'docs/spec-governance.md');
requireText(governance, 'PR #307 market-access guide blocked until publication gates pass', 'docs/spec-governance.md');
requireText(governance, 'A. asset-specific function evidence', 'docs/spec-governance.md');

requireText(nonUiPlan, 'PR #306 function-matrix checkpoint 03: active', 'docs/quality/non-ui-quality-program.md');
requireText(nonUiPlan, 'PR #307 article: blocked until publication gates pass', 'docs/quality/non-ui-quality-program.md');
requireText(nonUiPlan, 'PR #317 lifecycle, regulatory, and EU market-access source/schema expansion', 'docs/quality/non-ui-quality-program.md');

requireText(marketAccessSpec, 'PR #306  function-matrix research checkpoint 03', 'docs/quality/eu-stablecoin-market-access-research-and-monitoring-spec.md');
requireText(marketAccessSpec, 'PR #307  reviewed EU stablecoin market-access article after publication gate passes', 'docs/quality/eu-stablecoin-market-access-research-and-monitoring-spec.md');
requireText(marketAccessSpec, '## 17. Checkpoint 03 minimum content', 'docs/quality/eu-stablecoin-market-access-research-and-monitoring-spec.md');

if (matrix.research_id !== 'eu-stablecoin-market-access-2026') failures.push('research matrix id mismatch');
if (matrix.status !== 'research_in_progress') failures.push('research matrix must remain research_in_progress');
if (matrix.publication_gate?.publishable !== false) failures.push('base research matrix must remain not publishable');
if (matrix.publication_gate?.minimum_platforms_researched !== 10) failures.push('minimum platform research gate must remain 10');
if (matrix.publication_gate?.minimum_stable_assets_reviewed !== 15) failures.push('minimum stable asset research gate must remain 15');

if (contextBatch.research_id !== matrix.research_id) failures.push('context batch research id mismatch');
if (contextBatch.research_gate_effect?.minimum_platform_research_target_met !== true) failures.push('context batch must record the platform breadth target as met');
if (contextBatch.research_gate_effect?.publication_ready !== false) failures.push('context batch must not be publication ready');

if (functionBatch.research_id !== matrix.research_id) failures.push('function batch research id mismatch');
if (functionBatch.batch_id !== 'function-matrix-batch-03') failures.push('function batch id mismatch');
if (functionBatch.status !== 'reviewed_research_checkpoint') failures.push('function batch status mismatch');
if (functionBatch.gate_effect?.platform_breadth_floor_met !== true) failures.push('function batch platform breadth floor must remain met');
if (functionBatch.gate_effect?.stable_asset_breadth_floor_met !== true) failures.push('function batch stable asset breadth floor must remain met');
if (functionBatch.gate_effect?.function_level_evidence_depth_improved !== true) failures.push('function batch must record improved function evidence depth');
if (functionBatch.gate_effect?.revolut_first_party_policy_confirmed !== false) failures.push('Revolut first-party policy must remain unconfirmed');
if (functionBatch.gate_effect?.publication_date_recheck_complete !== false) failures.push('publication-date recheck must remain incomplete');
if (functionBatch.gate_effect?.article_source_list_review_complete !== false) failures.push('article source-list review must remain incomplete');
if (functionBatch.gate_effect?.publication_ready !== false) failures.push('checkpoint 03 must not mark the article publication ready');

const platformNames = new Set((functionBatch.platform_findings ?? []).map((row) => row.platform));
for (const platform of ['OKX Europe', 'Crypto.com', 'Bybit EU', 'Gemini', 'Uphold', 'Coinbase', 'Revolut']) {
  if (!platformNames.has(platform)) failures.push(`checkpoint 03 missing platform finding: ${platform}`);
}

requireText(checkpoint03, 'The article is still not publishable.', 'checkpoint 03 audit');
requireText(checkpoint03, 'A. asset-specific function evidence', 'checkpoint 03 audit');
requireText(checkpoint03, 'B. current platform-wide service-state evidence', 'checkpoint 03 audit');
requireText(checkpoint03, 'C. general service/licensing context without stablecoin matrix support', 'checkpoint 03 audit');

if (failures.length) {
  console.error('100-record core workstream validation failed:');
  failures.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}

console.log('100-record core workstream checks passed: PR #306 records checkpoint 03, the article remains not publication-ready, and PR #307 stays gated.');
