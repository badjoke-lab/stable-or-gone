import fs from 'node:fs';
import './validate-batch21-growth-d.mjs';
import './validate-current-final-eight.mjs';

const read = (file) => fs.readFileSync(file, 'utf8');
const roadmap = read('docs/roadmap.md');
const agents = read('AGENTS.md');
const governance = read('docs/spec-governance.md');
const nonUiPlan = read('docs/quality/non-ui-quality-program.md');
const amendment = read('docs/roadmap-amendments/2026-07-06-editorial-insertions-and-pr-renumbering.md');
const releaseSpec = read('docs/counts-manifest-version-provenance-integrity-spec.md');
const releaseBaseline = JSON.parse(read('docs/migration/registry-release-integrity-baseline.json'));
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

requireText(roadmap, 'Current item: PR #316 counts, manifest, version, and provenance integrity', 'docs/roadmap.md');
requireText(roadmap, 'Next item: PR #317 reproducible build and generated-output audit', 'docs/roadmap.md');
requireText(roadmap, 'PR #315 schedule amendment and PR renumbering: complete', 'docs/roadmap.md');
requireText(roadmap, 'PR #322 lifecycle, regulatory, and EU market-access source/schema expansion', 'docs/roadmap.md');
requireText(roadmap, 'PR #324 deterministic statistics generator and validator', 'docs/roadmap.md');
requireText(roadmap, 'PR #329 100 -> 102', 'docs/roadmap.md');
requireText(roadmap, 'Issuer/protocol reach is not platform-policy coverage.', 'docs/roadmap.md');

requireText(agents, 'Active: PR #316 counts, manifest, version, and provenance integrity', 'AGENTS.md');
requireText(agents, 'Next: PR #317 reproducible build and generated-output audit', 'AGENTS.md');
requireText(agents, 'PR #315 schedule amendment and PR renumbering: complete', 'AGENTS.md');
requireText(agents, 'Registered source reach is not accepted monitoring coverage.', 'AGENTS.md');
requireText(agents, 'Regulatory action pages are not regulatory-register coverage.', 'AGENTS.md');

requireText(governance, 'Zero coverage for a required domain is a valid audit result', 'docs/spec-governance.md');
requireText(governance, 'docs/roadmap.md', 'docs/spec-governance.md');
requireText(nonUiPlan, 'PR #316 counts, manifest, version, and provenance integrity', 'docs/quality/non-ui-quality-program.md');
requireText(amendment, 'PR #316  counts, manifest, version, and provenance integrity', 'roadmap amendment');
requireText(amendment, 'PR #348+  natural-language filter translation only after separate approval', 'roadmap amendment');

requireText(releaseSpec, 'source-to-public integrity boundary', 'release integrity specification');
requireText(releaseSpec, 'npm run validate:release-integrity', 'release integrity specification');
if (releaseBaseline.status !== 'current') failures.push('release-integrity baseline must be current');
if (releaseBaseline.expected_v2_counts?.stablecoins !== 100) failures.push('release-integrity baseline must protect 100 stable assets');
if (releaseBaseline.expected_route_counts?.total_detail !== 366) failures.push('release-integrity baseline must protect 366 detail routes');

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

console.log('100-record core workstream checks passed: parity and schedule amendment are complete, PR #316 is active, and PR #317 remains next.');
