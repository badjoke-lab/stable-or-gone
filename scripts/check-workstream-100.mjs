import fs from 'node:fs';
import './validate-batch21-growth-d.mjs';
import './validate-current-final-eight.mjs';
import './validate-next-growth-candidate-audit-pr329.mjs';
import './validate-batch22-growth-e.mjs';

const read = (file) => fs.readFileSync(file, 'utf8');
const roadmap = read('docs/roadmap.md');
const historyAmendment = read('docs/roadmap-amendments/2026-07-08-pr326-history-activation.md');
const foundationAmendment = read('docs/roadmap-amendments/2026-07-08-pr327-stats-foundation-activation.md');
const analysisAmendment = read('docs/roadmap-amendments/2026-07-08-pr328-stats-analysis-activation.md');
const candidateAmendment = read('docs/roadmap-amendments/2026-07-08-pr329-next-growth-candidate-audit-activation.md');
const growthAmendment = read('docs/roadmap-amendments/2026-07-08-pr330-growth-eure-1gbp-activation.md');
const foundationSpec = read('docs/stats-foundation-spec.md');
const analysisSpec = read('docs/stats-analysis-expansion-spec.md');
const candidateSpec = read('docs/quality/next-growth-candidate-audit-pr329-spec.md');
const statsSpec = read('docs/stats-spec.md');
const historySpec = read('docs/stats-history-spec.md');
const historyWorkflow = read('.github/workflows/immutable-statistics-history.yml');
const historyValidator = read('scripts/validate-stats-history.mjs');
const history = JSON.parse(read('data/stats-history.json'));
const releaseBaseline = JSON.parse(read('docs/migration/registry-release-integrity-baseline.json'));
const audited100Checkpoint = JSON.parse(read('docs/migration/audited-100-asset-canonical-checkpoint.json'));
const currentCheckpoint = JSON.parse(read('docs/migration/current-canonical-checkpoint.json'));
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
requireText(candidateAmendment, 'PR #328 statistics analysis expansion: complete', 'PR #329 amendment');
requireText(candidateAmendment, 'PR #329 next-growth candidate audit: active', 'PR #329 amendment');
requireText(candidateAmendment, 'PR #330 100 -> 102 controlled growth: next', 'PR #329 amendment');
requireText(growthAmendment, 'PR #329 next-growth candidate audit: complete', 'PR #330 amendment');
requireText(growthAmendment, 'PR #330 100 -> 102 controlled growth: active', 'PR #330 amendment');
requireText(growthAmendment, 'PR #331 UI remediation: complete', 'PR #330 amendment');
requireText(growthAmendment, 'PR #332 102 -> 104 controlled growth: next', 'PR #330 amendment');
requireText(growthAmendment, 'planned #331 -> actual #332', 'PR #330 amendment');
requireText(growthAmendment, 'planned #334 -> actual #335', 'PR #330 amendment');
requireText(foundationSpec, 'Status: canonical implementation specification — PR #327', 'stats foundation spec');
requireText(analysisSpec, 'Status: canonical implementation specification — PR #328', 'stats analysis spec');
requireText(candidateSpec, 'Status: canonical implementation specification — PR #329', 'candidate audit spec');
requireText(candidateSpec, 'PR #330  100 -> 102: EURe, GBPT', 'candidate audit spec');
requireText(candidateSpec, 'PR #334  108 -> 110: AUDD, NZDS', 'candidate audit spec');
requireText(statsSpec, 'immutable checkpoint snapshots, not every deployment build.', 'stats spec');
requireText(historySpec, 'append_only_reviewed_pr', 'stats history spec');
requireText(historySpec, 'all snapshots already present on the base branch must remain an exact prefix', 'stats history spec');
requireText(historyWorkflow, 'contents: read', 'history workflow');
requireText(historyWorkflow, 'fetch-depth: 0', 'history workflow');
requireText(historyWorkflow, 'SOG_STATS_HISTORY_BASE_REF', 'history workflow');
requireText(historyValidator, 'historical snapshot rewritten or reordered', 'history validator');

if (history.schema_version !== '1.0') failures.push('stats history schema version must be 1.0');
if (history.checkpoint_policy !== 'append_only_reviewed_pr') failures.push('stats history policy mismatch');
if (history.snapshots?.length !== 2) failures.push('PR #330 requires exactly two reviewed history snapshots after the 102-asset append');
if (history.snapshots?.[0]?.asset_count !== 100) failures.push('first stats history snapshot must remain the 100-asset checkpoint');
if (history.snapshots?.[0]?.checkpoint_id !== audited100Checkpoint.checkpoint_id) failures.push('immutable 100-asset history checkpoint ID mismatch');
if (history.snapshots?.[1]?.asset_count !== 102) failures.push('second stats history snapshot must be the 102-asset checkpoint');
if (history.snapshots?.[1]?.checkpoint_id !== currentCheckpoint.checkpoint_id) failures.push('102-asset history checkpoint ID mismatch');

if (releaseBaseline.status !== 'current') failures.push('release baseline must be current');
if (releaseBaseline.expected_v2_counts?.stablecoins !== 102) failures.push('current release-integrity baseline must protect the 102-asset growth checkpoint');
if (audited100Checkpoint.status !== 'audited') failures.push('100-asset checkpoint must remain audited');
if (audited100Checkpoint.v2_groups?.stablecoins?.record_count !== 100) failures.push('audited checkpoint must continue to protect 100 assets');
if (currentCheckpoint.status !== 'reviewed_growth_checkpoint') failures.push('current checkpoint must be a reviewed growth checkpoint');
if (currentCheckpoint.asset_count !== 102) failures.push('current checkpoint must bind 102 assets');
if (currentCheckpoint.previous_checkpoint_id !== audited100Checkpoint.checkpoint_id) failures.push('current checkpoint must link to the audited 100-asset checkpoint');

if (historical321.source_baseline_sync?.source_count !== 24) failures.push('PR #321 historical source count changed');
if (historical321.coverage?.registered_asset_reach_count !== 16) failures.push('PR #321 historical reach changed');
if (historical321.coverage?.uncovered_asset_count !== 84) failures.push('PR #321 historical uncovered queue changed');
if (historical321.source_baseline_sync?.accepted !== 0) failures.push('PR #321 historical accepted count changed');

if (historical322.source_baseline_sync?.source_count !== 30) failures.push('PR #322 historical source count changed');
if (historical322.coverage?.registered_asset_reach_count !== 22) failures.push('PR #322 historical reach changed');
if (historical322.coverage?.uncovered_asset_count !== 78) failures.push('PR #322 historical uncovered queue changed');
if (historical322.source_baseline_sync?.accepted !== 0) failures.push('PR #322 historical accepted count changed');

if (current323.source_baseline_sync?.source_count !== 39) failures.push('current monitoring source count must remain 39');
if (current323.source_baseline_sync?.baseline_count !== 39) failures.push('current monitoring baseline count must remain 39');
if (current323.source_baseline_sync?.pending_initial_acceptance !== 39) failures.push('current monitoring pending count must remain 39');
if (current323.source_baseline_sync?.accepted !== 0) failures.push('current monitoring accepted count must remain zero');
if (current323.source_baseline_sync?.missing !== 0) failures.push('current monitoring missing count must remain zero');
if (current323.policy?.network_access_used !== false) failures.push('monitoring checkpoint generation must remain offline');
if (current323.policy?.canonical_action !== 'none') failures.push('monitoring checkpoint canonical action must remain none');
if (current323.policy?.public_output !== false) failures.push('monitoring checkpoint public output must remain false');

if (failures.length) {
  console.error('PR #330 controlled-growth workstream validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Workstream valid: PR #329 complete, PR #330 active, PR #331 UI remediation complete, PR #332 growth next; immutable 100 and reviewed 102 statistics checkpoints are bound.');
