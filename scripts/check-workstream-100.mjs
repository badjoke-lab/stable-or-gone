import fs from 'node:fs';
import './validate-batch21-growth-d.mjs';
import './validate-current-final-eight.mjs';

const read = (file) => fs.readFileSync(file, 'utf8');
const roadmap = read('docs/roadmap.md');
const amendment = read('docs/roadmap-amendments/2026-07-08-pr325-statistics-activation.md');
const statsSpec = read('docs/stats-spec.md');
const statsWorkflow = read('.github/workflows/deterministic-statistics.yml');
const statsBuilder = read('scripts/build-stats.mjs');
const statsValidator = read('scripts/validate-stats.mjs');
const releaseBaseline = JSON.parse(read('docs/migration/registry-release-integrity-baseline.json'));
const checkpoint = JSON.parse(read('docs/migration/audited-100-asset-canonical-checkpoint.json'));
const historical321 = JSON.parse(read('scripts/monitoring/baselines/monitoring-baseline-sync-100-assets.json'));
const historical322 = JSON.parse(read('scripts/monitoring/baselines/monitoring-reserve-redemption-expansion-100-assets.json'));
const current323 = JSON.parse(read('scripts/monitoring/baselines/monitoring-lifecycle-regulatory-market-access-expansion-100-assets.json'));

const failures = [];
const requireText = (body, text, file) => {
  if (!body.includes(text)) failures.push(`${file}: missing ${text}`);
};

requireText(roadmap, 'PR #324 bounded scheduled read-only monitoring: complete', 'roadmap');
requireText(roadmap, 'Current item: PR #325 deterministic statistics generator and validator', 'roadmap');
requireText(roadmap, 'Next item: PR #326 immutable checkpoint history', 'roadmap');
requireText(roadmap, 'Phase D — statistics implementation — active', 'roadmap');
requireText(amendment, 'PR #325 deterministic statistics generator and validator: active', 'PR #325 amendment');
requireText(amendment, 'PR #326 immutable checkpoint history: next', 'PR #325 amendment');
requireText(statsSpec, 'All statistics are derived from reviewed canonical repository data at build time.', 'stats spec');
requireText(statsSpec, 'scripts/build-stats.mjs', 'stats spec');
requireText(statsSpec, 'scripts/validate-stats.mjs', 'stats spec');
requireText(statsWorkflow, 'contents: read', 'stats workflow');
requireText(statsWorkflow, 'node scripts/build-stats.mjs', 'stats workflow');
requireText(statsWorkflow, 'node scripts/validate-stats.mjs', 'stats workflow');
requireText(statsBuilder, "artifacts/stats-current.json", 'stats builder');
requireText(statsValidator, 'same inputs must generate byte-equivalent statistics models', 'stats validator');

if (releaseBaseline.status !== 'current') failures.push('release baseline must be current');
if (releaseBaseline.expected_v2_counts?.stablecoins !== 100) failures.push('release baseline must protect 100 assets');
if (checkpoint.status !== 'audited') failures.push('checkpoint must be audited');
if (checkpoint.v2_groups?.stablecoins?.record_count !== 100) failures.push('checkpoint must protect 100 assets');

if (historical321.source_baseline_sync?.source_count !== 24) failures.push('PR #321 historical source count changed');
if (historical321.coverage?.registered_asset_reach_count !== 16) failures.push('PR #321 historical reach changed');
if (historical321.coverage?.uncovered_asset_count !== 84) failures.push('PR #321 historical uncovered queue changed');
if (historical321.source_baseline_sync?.accepted !== 0) failures.push('PR #321 historical accepted count changed');

if (historical322.source_baseline_sync?.source_count !== 30) failures.push('PR #322 historical source count changed');
if (historical322.coverage?.registered_asset_reach_count !== 22) failures.push('PR #322 historical reach changed');
if (historical322.coverage?.uncovered_asset_count !== 78) failures.push('PR #322 historical uncovered queue changed');
if (historical322.source_baseline_sync?.accepted !== 0) failures.push('PR #322 historical accepted count changed');

if (current323.source_baseline_sync?.source_count !== 39) failures.push('current source count must be 39');
if (current323.source_baseline_sync?.baseline_count !== 39) failures.push('current baseline count must be 39');
if (current323.source_baseline_sync?.pending_initial_acceptance !== 39) failures.push('current pending count must be 39');
if (current323.source_baseline_sync?.accepted !== 0) failures.push('current accepted count must be zero');
if (current323.source_baseline_sync?.missing !== 0) failures.push('current missing count must be zero');
if (current323.coverage?.registered_asset_reach_count !== 23) failures.push('current reach must be 23');
if (current323.coverage?.uncovered_asset_count !== 77) failures.push('current uncovered queue must be 77');
if (current323.coverage?.covered_organization_count !== 18) failures.push('current covered organization count must be 18');
if (current323.coverage?.accepted_asset_reach_count !== 0) failures.push('accepted asset reach must be zero');
if (current323.scoped_coverage?.market_access_schema_capable_source_count !== 5) failures.push('market-access schema-capable source count must be 5');
if (current323.scoped_coverage?.scoped_platform_count !== 4) failures.push('scoped platform count must be 4');
if (current323.policy?.network_access_used !== false) failures.push('snapshot generation must be offline');
if (current323.policy?.canonical_action !== 'none') failures.push('snapshot canonical action must be none');
if (current323.policy?.public_output !== false) failures.push('snapshot public output must be false');

if (failures.length) {
  console.error('100-record core workstream validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Workstream valid: PR #324 complete, PR #325 active, PR #326 next.');
