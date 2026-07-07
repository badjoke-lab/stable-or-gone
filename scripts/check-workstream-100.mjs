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
const releaseBaseline = JSON.parse(read('docs/migration/registry-release-integrity-baseline.json'));
const reproducibleBaseline = JSON.parse(read('docs/migration/reproducible-build-output-baseline.json'));
const checkpoint = JSON.parse(read('docs/migration/audited-100-asset-canonical-checkpoint.json'));
const syncSpec = read('docs/quality/monitoring-baseline-synchronization-100-assets-spec.md');
const syncSnapshot = JSON.parse(read('scripts/monitoring/baselines/monitoring-baseline-sync-100-assets.json'));
const baselineSpec = read('docs/quality/monitoring-baseline-spec.md');
const marketAccessSpec = read('docs/quality/eu-stablecoin-market-access-research-and-monitoring-spec.md');
const matrix = JSON.parse(read('data/editorial-research/eu-stablecoin-market-access.json'));
const reauditBatch = JSON.parse(read('data/editorial-research/eu-stablecoin-market-access-reaudit-batch-04.json'));

const failures = [];
const requireText = (body, text, file) => {
  if (!body.includes(text)) failures.push(`${file}: missing required workstream marker: ${text}`);
};

requireText(roadmap, 'Current item: PR #321 100-asset monitoring baseline synchronization', 'docs/roadmap.md');
requireText(roadmap, 'Next item: PR #322 reserve and redemption source expansion', 'docs/roadmap.md');
requireText(roadmap, 'PR #320 non-UI release material: complete', 'docs/roadmap.md');
requireText(roadmap, 'PR #323 lifecycle, regulatory, and EU market-access source/schema expansion', 'docs/roadmap.md');
requireText(roadmap, 'PR #325 deterministic statistics generator and validator', 'docs/roadmap.md');
requireText(roadmap, 'PR #330 100 -> 102', 'docs/roadmap.md');

requireText(agents, 'Active: PR #321 100-asset monitoring baseline synchronization', 'AGENTS.md');
requireText(agents, 'Next: PR #322 reserve and redemption source expansion', 'AGENTS.md');
requireText(agents, 'Registered source reach is not accepted monitoring coverage.', 'AGENTS.md');
requireText(agents, 'A pending baseline is not an accepted baseline.', 'AGENTS.md');

requireText(governance, 'Monitoring baseline synchronization governance', 'docs/spec-governance.md');
requireText(governance, 'PR #321 100-asset monitoring baseline synchronization active', 'docs/spec-governance.md');
requireText(governance, 'zero coverage for a required domain is a valid audit result', 'docs/spec-governance.md');
requireText(nonUiPlan, 'PR #321 100-asset monitoring baseline synchronization: active', 'docs/quality/non-ui-quality-program.md');
requireText(nonUiPlan, 'PR #322 reserve and redemption source expansion: next', 'docs/quality/non-ui-quality-program.md');

requireText(editorialAmendment, 'PR #316  counts, manifest, version, and provenance integrity', 'editorial roadmap amendment');
requireText(maintenanceAmendment, 'PR #320 non-UI release material', 'PR #319 maintenance amendment');
requireText(maintenanceAmendment, 'PR #349+ natural-language filter translation only after separate approval', 'PR #319 maintenance amendment');

if (releaseBaseline.status !== 'current') failures.push('release-integrity baseline must be current');
if (releaseBaseline.expected_v2_counts?.stablecoins !== 100) failures.push('release-integrity baseline must protect 100 stable assets');
if (reproducibleBaseline.status !== 'current') failures.push('reproducible-build baseline must be current');
if (checkpoint.status !== 'audited') failures.push('audited checkpoint status must be audited');
if (checkpoint.v2_groups?.stablecoins?.record_count !== 100) failures.push('audited checkpoint must protect 100 stable assets');

requireText(syncSpec, '100-asset monitoring baseline synchronization specification', 'monitoring sync specification');
requireText(syncSpec, 'scripts/validate-monitoring-baseline-sync-100-assets.mjs', 'monitoring sync specification');
requireText(syncSpec, 'PR #321 must not change a pending row to accepted.', 'monitoring sync specification');
requireText(baselineSpec, 'reviewed official sources: 24', 'monitoring baseline specification');
requireText(baselineSpec, 'pending_initial_acceptance: 24', 'monitoring baseline specification');
requireText(baselineSpec, 'accepted: 0', 'monitoring baseline specification');

if (syncSnapshot.checkpoint_id !== checkpoint.checkpoint_id) failures.push('monitoring sync checkpoint ID mismatch');
if (syncSnapshot.canonical_counts?.stablecoins !== 100) failures.push('monitoring sync must protect 100 assets');
if (syncSnapshot.canonical_counts?.organizations !== 94) failures.push('monitoring sync must protect 94 organizations');
if (syncSnapshot.canonical_counts?.relationships !== 110) failures.push('monitoring sync must protect 110 relationships');
if (syncSnapshot.source_baseline_sync?.source_count !== 24) failures.push('monitoring sync must protect 24 sources');
if (syncSnapshot.source_baseline_sync?.baseline_count !== 24) failures.push('monitoring sync must protect 24 baselines');
if (syncSnapshot.source_baseline_sync?.source_baseline_id_parity !== true) failures.push('monitoring source/baseline parity must be true');
if (syncSnapshot.source_baseline_sync?.pending_initial_acceptance !== 24) failures.push('monitoring sync must preserve 24 pending baselines');
if (syncSnapshot.source_baseline_sync?.accepted !== 0) failures.push('monitoring sync accepted baseline count must remain zero');
if (syncSnapshot.source_baseline_sync?.missing !== 0) failures.push('monitoring sync missing baseline count must remain zero');
if (syncSnapshot.coverage?.registered_asset_reach_count !== 16) failures.push('monitoring registered asset reach must remain 16');
if (syncSnapshot.coverage?.uncovered_asset_count !== 84) failures.push('monitoring uncovered asset count must remain 84');
if (syncSnapshot.coverage?.accepted_asset_reach_count !== 0) failures.push('accepted asset reach must remain zero');
if (syncSnapshot.policy?.network_access_used !== false) failures.push('monitoring synchronization must remain offline');
if (syncSnapshot.policy?.canonical_action !== 'none') failures.push('monitoring synchronization canonical action must remain none');
if (syncSnapshot.policy?.public_output !== false) failures.push('monitoring synchronization public output must remain disabled');

requireText(marketAccessSpec, 'PR #307  reviewed EU stablecoin market-access article after publication gate passes', 'EU market-access specification');
if (matrix.research_id !== 'eu-stablecoin-market-access-2026') failures.push('research matrix id mismatch');
if (reauditBatch.article_gate_effect?.full_asset_and_platform_reaudit_complete !== true) failures.push('EU market-access reaudit completion missing');

if (failures.length) {
  console.error('100-record core workstream validation failed:');
  failures.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}

console.log('100-record core workstream checks passed: PR #320 is complete, PR #321 is active, and PR #322 remains next.');
