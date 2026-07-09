import fs from 'node:fs';

const originalLog = console.log;
console.log = () => {};
try {
  await import('./validate-next-growth-candidate-audit-pr329.mjs');
  await import('./validate-batch26-growth-i.mjs');
  await import('./validate-comparison-readiness-contract-pr336.mjs');
  await import('./validate-comparison-readiness-audit-pr337.mjs');
} finally {
  console.log = originalLog;
}

const read = (file) => fs.readFileSync(file, 'utf8');
const roadmap = read('docs/roadmap.md');
const historyAmendment = read('docs/roadmap-amendments/2026-07-08-pr326-history-activation.md');
const foundationAmendment = read('docs/roadmap-amendments/2026-07-08-pr327-stats-foundation-activation.md');
const analysisAmendment = read('docs/roadmap-amendments/2026-07-08-pr328-stats-analysis-activation.md');
const candidateAmendment = read('docs/roadmap-amendments/2026-07-08-pr329-next-growth-candidate-audit-activation.md');
const growth330 = read('docs/roadmap-amendments/2026-07-08-pr330-growth-eure-1gbp-activation.md');
const growth332 = read('docs/roadmap-amendments/2026-07-09-pr332-growth-stablr-eurr-usdr-activation.md');
const growth333 = read('docs/roadmap-amendments/2026-07-09-pr333-growth-phpc-xidr-activation.md');
const growth334 = read('docs/roadmap-amendments/2026-07-09-pr334-growth-cadc-zarp-activation.md');
const growth335 = read('docs/roadmap-amendments/2026-07-09-pr335-growth-audd-nzds-activation.md');
const comparison336 = read('docs/roadmap-amendments/2026-07-09-pr336-comparison-readiness-contract-activation.md');
const comparison337 = read('docs/roadmap-amendments/2026-07-09-pr337-comparison-readiness-audit-activation.md');
const foundationSpec = read('docs/stats-foundation-spec.md');
const analysisSpec = read('docs/stats-analysis-expansion-spec.md');
const candidateSpec = read('docs/quality/next-growth-candidate-audit-pr329-spec.md');
const comparisonSpec = read('docs/quality/comparison-readiness-contract-pr336-spec.md');
const comparisonAuditSpec = read('docs/quality/comparison-readiness-audit-pr337-spec.md');
const statsSpec = read('docs/stats-spec.md');
const historySpec = read('docs/stats-history-spec.md');
const historyWorkflow = read('.github/workflows/immutable-statistics-history.yml');
const historyValidator = read('scripts/validate-stats-history.mjs');
const history = JSON.parse(read('data/stats-history.json'));
const comparisonContract = JSON.parse(read('data/quality/comparison-readiness-contract-v1.json'));
const releaseBaseline = JSON.parse(read('docs/migration/registry-release-integrity-baseline.json'));
const audited100Checkpoint = JSON.parse(read('docs/migration/audited-100-asset-canonical-checkpoint.json'));
const currentCheckpoint = JSON.parse(read('docs/migration/current-canonical-checkpoint.json'));
const historical321 = JSON.parse(read('scripts/monitoring/baselines/monitoring-baseline-sync-100-assets.json'));
const historical322 = JSON.parse(read('scripts/monitoring/baselines/monitoring-reserve-redemption-expansion-100-assets.json'));
const historical323 = JSON.parse(read('scripts/monitoring/baselines/monitoring-lifecycle-regulatory-market-access-expansion-100-assets.json'));

const failures = [];
const requireText = (body, text, file) => { if (!body.includes(text)) failures.push(`${file}: missing ${text}`); };

requireText(roadmap, 'PR #325 deterministic statistics generator and validator: complete', 'roadmap');
requireText(historyAmendment, 'PR #326 immutable checkpoint history: active', 'PR #326 amendment');
requireText(historyAmendment, 'PR #327 /stats/ foundation: next', 'PR #326 amendment');
requireText(foundationAmendment, 'PR #326 immutable checkpoint history: complete', 'PR #327 amendment');
requireText(foundationAmendment, 'PR #327 /stats/ foundation: active', 'PR #327 amendment');
requireText(analysisAmendment, 'PR #328 historical, deployment, organization, and data-quality statistics: active', 'PR #328 amendment');
requireText(candidateAmendment, 'PR #329 next-growth candidate audit: active', 'PR #329 amendment');
requireText(growth330, 'PR #330 100 -> 102 controlled growth: active', 'PR #330 amendment');
requireText(growth330, 'planned #331 -> actual #332', 'PR #330 amendment');
requireText(growth332, 'PR #332 102 -> 104 controlled growth: active', 'PR #332 amendment');
requireText(growth333, 'PR #333 104 -> 106 controlled growth: active', 'PR #333 amendment');
requireText(growth334, 'PR #334 106 -> 108 controlled growth: active', 'PR #334 amendment');
requireText(growth335, 'PR #334 106 -> 108 controlled growth: complete', 'PR #335 amendment');
requireText(growth335, 'PR #335 108 -> 110 controlled growth: active', 'PR #335 amendment');
requireText(growth335, 'PR #336 Comparison Readiness contract and audit method: next', 'PR #335 amendment');
requireText(comparison336, 'PR #335 108 -> 110 controlled growth: complete', 'PR #336 amendment');
requireText(comparison336, 'PR #336 Comparison Readiness contract and audit method: active', 'PR #336 amendment');
requireText(comparison336, 'PR #337 audit all 110 assets for comparison readiness: next', 'PR #336 amendment');
requireText(comparison337, 'PR #336 Comparison Readiness contract and audit method: complete', 'PR #337 amendment');
requireText(comparison337, 'PR #337 audit all 110 assets for comparison readiness: active', 'PR #337 amendment');
requireText(comparison337, 'PR #338 normalize comparison-critical gaps and validators: next', 'PR #337 amendment');
requireText(foundationSpec, 'Status: canonical implementation specification — PR #327', 'stats foundation spec');
requireText(analysisSpec, 'Status: canonical implementation specification — PR #328', 'stats analysis spec');
requireText(candidateSpec, 'Status: canonical implementation specification — PR #329', 'candidate audit spec');
requireText(comparisonSpec, 'Status: canonical implementation specification', 'comparison readiness spec');
requireText(comparisonSpec, 'exactly nineteen dimensions are defined', 'comparison readiness spec');
requireText(comparisonAuditSpec, 'exactly 110 canonical assets', 'comparison readiness audit spec');
requireText(comparisonAuditSpec, 'nineteen dimension rows for every asset', 'comparison readiness audit spec');
requireText(statsSpec, 'immutable checkpoint snapshots, not every deployment build.', 'stats spec');
requireText(historySpec, 'append_only_reviewed_pr', 'stats history spec');
requireText(historySpec, 'all snapshots already present on the base branch must remain an exact prefix', 'stats history spec');
requireText(historyWorkflow, 'contents: read', 'history workflow');
requireText(historyWorkflow, 'fetch-depth: 0', 'history workflow');
requireText(historyWorkflow, 'SOG_STATS_HISTORY_BASE_REF', 'history workflow');
requireText(historyValidator, 'historical snapshot rewritten or reordered', 'history validator');

if (history.schema_version !== '1.0') failures.push('stats history schema version must be 1.0');
if (history.checkpoint_policy !== 'append_only_reviewed_pr') failures.push('stats history policy mismatch');
if (history.snapshots?.length !== 6) failures.push('post-110 workstream requires exactly six reviewed history snapshots');
const expectedAssetCounts = [100,102,104,106,108,110];
for (let index = 0; index < expectedAssetCounts.length; index += 1) {
  if (history.snapshots?.[index]?.asset_count !== expectedAssetCounts[index]) failures.push(`stats history snapshot ${index + 1} must bind ${expectedAssetCounts[index]} assets`);
}
if (history.snapshots?.[0]?.checkpoint_id !== audited100Checkpoint.checkpoint_id) failures.push('immutable 100-asset history checkpoint ID mismatch');
if (history.snapshots?.[4]?.checkpoint_id !== currentCheckpoint.previous_checkpoint_id) failures.push('108-asset predecessor checkpoint ID mismatch');
if (history.snapshots?.[5]?.checkpoint_id !== currentCheckpoint.checkpoint_id) failures.push('110-asset history checkpoint ID mismatch');

if (releaseBaseline.status !== 'current') failures.push('release baseline must be current');
if (releaseBaseline.expected_v2_counts?.stablecoins !== 110) failures.push('current release-integrity baseline must protect the 110-asset checkpoint');
if (audited100Checkpoint.status !== 'audited') failures.push('100-asset checkpoint must remain audited');
if (audited100Checkpoint.v2_groups?.stablecoins?.record_count !== 100) failures.push('audited checkpoint must continue to protect 100 assets');
if (currentCheckpoint.status !== 'reviewed_growth_checkpoint') failures.push('current checkpoint must remain the reviewed 110-asset growth checkpoint');
if (currentCheckpoint.asset_count !== 110) failures.push('current checkpoint must bind 110 assets');
if (currentCheckpoint.previous_checkpoint_id !== 'sog_controlled_growth_108_checkpoint_pr334_2026_07_09') failures.push('current checkpoint must link to reviewed 108-asset checkpoint');
if (comparisonContract.checkpoint_id !== currentCheckpoint.checkpoint_id) failures.push('comparison readiness contract must bind current 110-asset checkpoint');
if (comparisonContract.asset_denominator !== 110) failures.push('comparison readiness contract denominator must be 110');
if (comparisonContract.dimensions?.length !== 19) failures.push('comparison readiness contract must define 19 dimensions');
if (comparisonContract.audit_output_contract?.next_pr !== 337) failures.push('comparison readiness audit must be PR #337');
if (comparisonContract.normalization_boundary?.target_pr !== 338) failures.push('comparison readiness normalization must be PR #338');

if (historical321.source_baseline_sync?.source_count !== 24 || historical321.coverage?.uncovered_asset_count !== 84) failures.push('PR #321 historical monitoring checkpoint changed');
if (historical322.source_baseline_sync?.source_count !== 30 || historical322.coverage?.uncovered_asset_count !== 78) failures.push('PR #322 historical monitoring checkpoint changed');
if (historical323.source_baseline_sync?.source_count !== 39 || historical323.coverage?.uncovered_asset_count !== 77) failures.push('PR #323 historical monitoring checkpoint changed');
for (const checkpoint of [historical321, historical322, historical323]) {
  if (checkpoint.source_baseline_sync?.accepted !== 0) failures.push('historical monitoring accepted count changed');
  if (checkpoint.policy?.network_access_used !== false) failures.push('historical monitoring checkpoint must remain offline');
  if (checkpoint.policy?.canonical_action !== 'none') failures.push('historical monitoring checkpoint canonical action must remain none');
  if (checkpoint.policy?.public_output !== false) failures.push('historical monitoring checkpoint public output must remain false');
}

if (failures.length) {
  console.error('PR #337 Comparison Readiness audit workstream validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log('Workstream valid: PR #336 contract complete, PR #337 audits all 110 assets across 19 dimensions, and PR #338 remains bounded normalization.');
