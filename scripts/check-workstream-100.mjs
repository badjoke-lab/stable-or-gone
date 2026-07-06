import fs from 'node:fs';
import './validate-batch21-growth-d.mjs';
import './validate-current-final-eight.mjs';

const read = (file) => fs.readFileSync(file, 'utf8');
const roadmap = read('docs/roadmap.md');
const agents = read('AGENTS.md');
const governance = read('docs/spec-governance.md');
const nonUiPlan = read('docs/quality/non-ui-quality-program.md');
const editorialAmendment = read('docs/roadmap-amendments/2026-07-06-editorial-insertions-and-pr-renumbering.md');
const maintenanceAmendment = read('docs/roadmap-amendments/2026-07-06-pr319-maintenance-and-renumbering.md');
const releaseSpec = read('docs/counts-manifest-version-provenance-integrity-spec.md');
const releaseBaseline = JSON.parse(read('docs/migration/registry-release-integrity-baseline.json'));
const reproducibleSpec = read('docs/reproducible-build-generated-output-audit-spec.md');
const reproducibleBaseline = JSON.parse(read('docs/migration/reproducible-build-output-baseline.json'));
const checkpointSpec = read('docs/audited-100-asset-canonical-checkpoint-spec.md');
const checkpoint = JSON.parse(read('docs/migration/audited-100-asset-canonical-checkpoint.json'));
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

requireText(roadmap, 'Current item: PR #318 audited 100-record canonical checkpoint', 'docs/roadmap.md');
requireText(roadmap, 'Next planned item: PR #320 non-UI release material', 'docs/roadmap.md');
requireText(roadmap, 'PR #319 guide article spacing maintenance: complete, inserted work', 'docs/roadmap.md');
requireText(roadmap, 'PR #323 lifecycle, regulatory, and EU market-access source/schema expansion', 'docs/roadmap.md');
requireText(roadmap, 'PR #325 deterministic statistics generator and validator', 'docs/roadmap.md');
requireText(roadmap, 'PR #330 100 -> 102', 'docs/roadmap.md');
requireText(roadmap, 'Issuer/protocol reach is not platform-policy coverage.', 'docs/roadmap.md');

requireText(agents, 'Active: PR #318 audited 100-record canonical checkpoint', 'AGENTS.md');
requireText(agents, 'PR #319 guide article spacing maintenance: complete, inserted work', 'AGENTS.md');
requireText(agents, 'Next planned: PR #320 non-UI release material', 'AGENTS.md');
requireText(agents, 'Registered source reach is not accepted monitoring coverage.', 'AGENTS.md');
requireText(agents, 'Regulatory action pages are not regulatory-register coverage.', 'AGENTS.md');

requireText(governance, 'Zero coverage for a required domain is a valid audit result', 'docs/spec-governance.md');
requireText(governance, 'Audited checkpoint governance', 'docs/spec-governance.md');
requireText(governance, 'PR #319 guide article spacing maintenance complete, inserted work', 'docs/spec-governance.md');
requireText(nonUiPlan, 'PR #318 audited 100-record canonical checkpoint: active', 'docs/quality/non-ui-quality-program.md');
requireText(nonUiPlan, 'PR #320 non-UI release material: next planned item', 'docs/quality/non-ui-quality-program.md');

requireText(editorialAmendment, 'PR #316  counts, manifest, version, and provenance integrity', 'editorial roadmap amendment');
requireText(editorialAmendment, 'PR #348+  natural-language filter translation only after separate approval', 'editorial roadmap amendment');
requireText(maintenanceAmendment, 'PR #319 guide article spacing maintenance — complete, inserted work', 'PR #319 maintenance amendment');
requireText(maintenanceAmendment, 'PR #320 non-UI release material', 'PR #319 maintenance amendment');
requireText(maintenanceAmendment, 'PR #349+ natural-language filter translation only after separate approval', 'PR #319 maintenance amendment');

requireText(releaseSpec, 'source-to-public integrity boundary', 'release integrity specification');
requireText(releaseSpec, 'npm run validate:release-integrity', 'release integrity specification');
if (releaseBaseline.status !== 'current') failures.push('release-integrity baseline must be current');
if (releaseBaseline.expected_v2_counts?.stablecoins !== 100) failures.push('release-integrity baseline must protect 100 stable assets');
if (releaseBaseline.expected_route_counts?.total_detail !== 366) failures.push('release-integrity baseline must protect 366 detail routes');

requireText(reproducibleSpec, 'locked dependency graph', 'reproducible build specification');
requireText(reproducibleSpec, 'npm run validate:reproducible-build', 'reproducible build specification');
if (reproducibleBaseline.status !== 'current') failures.push('reproducible-build baseline must be current');
if (reproducibleBaseline.runtime?.node_version !== '22.22.0') failures.push('reproducible-build baseline must pin Node 22.22.0');
if (!Array.isArray(reproducibleBaseline.hashed_output_roots) || !reproducibleBaseline.hashed_output_roots.includes('dist')) failures.push('reproducible-build baseline must hash dist output');

requireText(checkpointSpec, 'audited canonical checkpoint', 'audited checkpoint specification');
requireText(checkpointSpec, 'scripts/validate-audited-100-checkpoint.mjs', 'audited checkpoint specification');
if (checkpoint.status !== 'audited') failures.push('audited checkpoint status must be audited');
if (checkpoint.source_commit !== '9a106f0938e6323de833c941d6ae863050f1f03b') failures.push('audited checkpoint source commit mismatch');
if (checkpoint.canonical_file_count !== 334) failures.push('audited checkpoint must protect 334 canonical files');
if (checkpoint.v2_groups?.stablecoins?.record_count !== 100) failures.push('audited checkpoint must protect 100 stable assets');
if (checkpoint.v2_groups?.events?.record_count !== 172) failures.push('audited checkpoint must protect 172 events');
if (checkpoint.v2_groups?.evidence?.record_count !== 502) failures.push('audited checkpoint must protect 502 evidence records');
if (checkpoint.release_expected_counts?.routes?.total_detail !== 366) failures.push('audited checkpoint must protect 366 detail routes');
if (checkpoint.reproducibility_checkpoint?.reproducible !== true) failures.push('audited checkpoint reproducibility result must be true');
if (checkpoint.production_verification?.requires_exact_commit_match !== false) failures.push('production checkpoint contract must allow later noncanonical main releases');
if (checkpoint.production_verification?.requires_checkpoint_hash_match !== true) failures.push('production checkpoint contract must require canonical hash parity');
if (checkpoint.production_verification?.requires_checkpoint_file_count_match !== true) failures.push('production checkpoint contract must require canonical file-count parity');

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

console.log('100-record core workstream checks passed: PR #318 is active, PR #319 maintenance is recorded, and PR #320 is the next planned work item.');
