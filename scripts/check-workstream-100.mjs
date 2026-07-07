import fs from 'node:fs';
import './validate-batch21-growth-d.mjs';
import './validate-current-final-eight.mjs';

const read = (file) => fs.readFileSync(file, 'utf8');
const roadmap = read('docs/roadmap.md');
const historyAmendment = read('docs/roadmap-amendments/2026-07-08-pr326-history-activation.md');
const foundationAmendment = read('docs/roadmap-amendments/2026-07-08-pr327-stats-foundation-activation.md');
const analysisAmendment = read('docs/roadmap-amendments/2026-07-08-pr328-stats-analysis-activation.md');
const foundationSpec = read('docs/stats-foundation-spec.md');
const analysisSpec = read('docs/stats-analysis-expansion-spec.md');
const statsSpec = read('docs/stats-spec.md');
const historySpec = read('docs/stats-history-spec.md');
const historyWorkflow = read('.github/workflows/immutable-statistics-history.yml');
const historyValidator = read('scripts/validate-stats-history.mjs');
const history = JSON.parse(read('data/stats-history.json'));
const releaseBaseline = JSON.parse(read('docs/migration/registry-release-integrity-baseline.json'));
const checkpoint = JSON.parse(read('docs/migration/audited-100-asset-canonical-checkpoint.json'));
const historical321 = JSON.parse(read('scripts/monitoring/baselines/monitoring-baseline-sync-100-assets.json'));
const historical322 = JSON.parse(read('scripts/monitoring/baselines/monitoring-reserve-redemption-expansion-100-assets.json'));
const current323 = JSON.parse(read('scripts/monitoring/baselines/monitoring-lifecycle-regulatory-market-access-expansion-100-assets.json'));

const failures = [];
const requireText = (body, text, file) => {
  if (!body.includes(text)) failures.push(`${file}: missing ${text}`);
};

requireText(roadmap, 'PR #325 deterministic statistics generator and validator: complete', 'roadmap');
requireText(roadmap, 'Phase D — statistics implementation — active', 'roadmap');
requireText(historyAmendment, 'PR #326 immutable checkpoint history: active', 'PR #326 amendment');
requireText(historyAmendment, 'PR #327 /stats/ foundation: next', 'PR #326 amendment');
requireText(foundationAmendment, 'PR #326 immutable checkpoint history: complete', 'PR #327 amendment');
requireText(foundationAmendment, 'PR #327 /stats/ foundation: active', 'PR #327 amendment');
requireText(foundationAmendment, 'PR #328 historical, deployment, organization, and data-quality statistics: next', 'PR #327 amendment');
requireText(analysisAmendment, 'PR #327 /stats/ foundation: complete', 'PR #328 amendment');
requireText(analysisAmendment, 'PR #328 historical, deployment, organization, and data-quality statistics: active', 'PR #328 amendment');
requireText(analysisAmendment, 'PR #329 next candidate audit: next', 'PR #328 amendment');
requireText(foundationSpec, 'Status: canonical implementation specification — PR #327', 'stats foundation spec');
requireText(analysisSpec, 'Status: canonical implementation specification — PR #328', 'stats analysis spec');
requireText(analysisSpec, 'Historical events and failures', 'stats analysis spec');
requireText(analysisSpec, 'Deployment analysis', 'stats analysis spec');
requireText(analysisSpec, 'Organization analysis', 'stats analysis spec');
requireText(analysisSpec, 'Data-quality analysis', 'stats analysis spec');
requireText(statsSpec, 'immutable checkpoint snapshots, not every deployment build.', 'stats spec');
requireText(historySpec, 'append_only_reviewed_pr', 'stats history spec');
requireText(historySpec, 'all snapshots already present on the base branch must remain an exact prefix', 'stats history spec');
requireText(historyWorkflow, 'contents: read', 'history workflow');
requireText(historyWorkflow, 'fetch-depth: 0', 'history workflow');
requireText(historyWorkflow, 'SOG_STATS_HISTORY_BASE_REF', 'history workflow');
requireText(historyValidator, 'historical snapshot rewritten or reordered', 'history validator');

if (history.schema_version !== '1.0') failures.push('stats history schema version must be 1.0');
if (history.checkpoint_policy !== 'append_only_reviewed_pr') failures.push('stats history policy mismatch');
if (history.snapshots?.length !== 1) failures.push('PR #328 expects exactly one reviewed initial history snapshot before controlled growth');
if (history.snapshots?.[0]?.asset_count !== 100) failures.push('initial stats history snapshot must be the 100-asset checkpoint');
if (history.snapshots?.[0]?.checkpoint_id !== checkpoint.checkpoint_id) failures.push('initial stats history checkpoint ID mismatch');

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

console.log('Workstream valid: PR #327 complete, PR #328 active, PR #329 next.');
