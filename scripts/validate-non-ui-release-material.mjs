import fs from 'node:fs';

const read = (file) => fs.readFileSync(file, 'utf8');
const readJson = (file) => JSON.parse(read(file));
const checkpoint = readJson('docs/migration/audited-100-asset-canonical-checkpoint.json');
const currentCheckpoint = readJson('docs/migration/current-canonical-checkpoint.json');
const currentHistoryCheckpoint = readJson('docs/migration/current-stats-history-checkpoint.json');
const releaseBaseline = readJson('docs/migration/registry-release-integrity-baseline.json');
const reproducibleBaseline = readJson('docs/migration/reproducible-build-output-baseline.json');
const updates = readJson('data/registry-updates.json');
const history = readJson('data/stats-history.json');
const readme = read('README.md');
const release = read('docs/releases/100-asset-checkpoint-2026-07-06.md');
const roadmap = read('docs/roadmap.md');
const amendment = read('docs/roadmap-amendments/2026-07-08-pr326-history-activation.md');
const historicalDepthAmendment = read('docs/roadmap-amendments/2026-07-10-pr353-record-depth-baseline-activation.md');
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const requireText = (body, text, label) => check(body.includes(text), `${label}: missing ${text}`);

for (const marker of [
  'Canonical stable assets: 110',
  'PR #351 Monthly Maintenance Log: complete',
  'PR #352 post-351 authority reset: complete',
  'PR #354 Tier A Dossier Deepening — Batch 1: complete',
  'PR #355 Tier A Dossier Deepening — Batch 2: complete',
  'PR #356 Market Access Pilot 1: complete',
  'PR #357 Tier A Dossier Deepening — Batch 3: active',
  'PR #358 Record Growth Batch 1: next'
]) requireText(readme, marker, 'README.md');
for (const route of ['/version.json','/data/manifest.json','/llms.txt','/ai.txt']) requireText(readme, route, 'README.md');
for (const boundary of ['canonical_only = true','includes_unreviewed_candidates = false','includes_internal_monitoring = false','includes_private_notes = false']) requireText(readme, boundary, 'README.md');

for (const marker of [
  'stable assets: 100','organizations: 94','relationships: 110','events: 172','evidence: 502',
  'known unknowns: 289','deployments: 140','legal profiles: 100','reserve components: 133','income profiles: 100','detail routes: 366',
  checkpoint.checkpoint_id,
  checkpoint.source_commit,
  `canonical files: ${checkpoint.canonical_file_count}`,
  checkpoint.canonical_content_sha256,
  checkpoint.canonical_identity_sha256,
  checkpoint.release_integrity_baseline_id,
  checkpoint.reproducible_build_baseline_id,
  checkpoint.reproducibility_checkpoint.tree_sha256,
  `output files: ${checkpoint.reproducibility_checkpoint.file_count}`,
  `total bytes: ${checkpoint.reproducibility_checkpoint.total_bytes}`,
  'reproducible: true'
]) requireText(release, marker, 'historical 100-asset release note');
for (const route of ['/version.json','/data/manifest.json','/llms.txt','/ai.txt']) requireText(release, route, 'historical 100-asset release note');
for (const boundary of ['canonical_only = true','includes_unreviewed_candidates = false','includes_internal_monitoring = false','includes_private_notes = false']) requireText(release, boundary, 'historical 100-asset release note');

check(checkpoint.release_integrity_baseline_id === 'sog_release_integrity_pr316_2026_07_06', 'historical 100-asset release-integrity baseline ID changed');
check(checkpoint.reproducible_build_baseline_id === reproducibleBaseline.baseline_id, 'historical checkpoint/reproducible-build baseline ID mismatch');
check(releaseBaseline.status === 'current', 'current release-integrity baseline must remain current');
check(releaseBaseline.expected_v2_counts?.stablecoins === currentCheckpoint.asset_count, 'current release-integrity baseline must match current checkpoint asset count');
check(releaseBaseline.expected_v2_counts?.organizations === currentCheckpoint.expected_counts?.organizations, 'current release-integrity baseline must match current checkpoint organization count');
check(releaseBaseline.expected_v2_counts?.events === currentCheckpoint.expected_counts?.events, 'current release-integrity baseline must match current checkpoint event count');
check(releaseBaseline.expected_v2_counts?.evidence === currentCheckpoint.expected_counts?.evidence, 'current release-integrity baseline must match current checkpoint evidence count');
check(history.snapshots?.[0]?.checkpoint_id === checkpoint.checkpoint_id, 'stats history initial checkpoint ID mismatch');
check(history.snapshots?.[0]?.asset_count === 100, 'stats history initial asset count must be 100');
const latestSnapshot = history.snapshots?.at(-1);
check(latestSnapshot?.checkpoint_id === currentHistoryCheckpoint.checkpoint_id, 'stats history current reviewed checkpoint snapshot missing');
check(latestSnapshot?.canonical_checkpoint_id === currentCheckpoint.checkpoint_id, 'stats history latest snapshot must bind the current canonical checkpoint');
check(latestSnapshot?.totals?.market_access_records === currentCheckpoint.expected_counts?.market_access_records, 'stats history latest snapshot must include the current Market Access record count');
check(currentHistoryCheckpoint.canonical_checkpoint_id === currentCheckpoint.checkpoint_id, 'current history checkpoint canonical binding mismatch');

const updateId = 'sog_update_2026_07_06_audited_100_asset_checkpoint';
const matchingUpdates = updates.filter((row) => row.id === updateId);
check(matchingUpdates.length === 1, `registry update ${updateId} must exist exactly once`);
if (matchingUpdates[0]) {
  check(matchingUpdates[0].date === '2026-07-06', 'checkpoint update date mismatch');
  check(matchingUpdates[0].category === 'data', 'checkpoint update category must be data');
  for (const route of ['/stablecoins/','/issuers/','/events/','/methodology/','/updates/','/data/manifest.json','/version.json']) check(matchingUpdates[0].related_paths?.includes(route), `checkpoint update missing related path: ${route}`);
}

for (const marker of [
  'PR #325 deterministic statistics generator and validator: complete',
  'PR #326 immutable checkpoint history: active',
  'PR #327 /stats/ foundation: next'
]) requireText(amendment, marker, 'historical PR #326 roadmap amendment');

for (const marker of [
  'Canonical stable assets: 110',
  'PR #354 Tier A Dossier Deepening — Batch 1: complete',
  'PR #355 Tier A Dossier Deepening — Batch 2: complete',
  'PR #356 Market Access Pilot 1: complete',
  'PR #357 Tier A Dossier Deepening — Batch 3: active',
  'PR #358 Record Growth Batch 1: next',
  'REVIEW GATE'
]) requireText(roadmap, marker, 'current roadmap');

for (const marker of [
  'PR #353 Record Depth & Coverage Baseline: active',
  'PR #354 Tier A Dossier Deepening — Batch 1: next',
  'Queue order must be deterministic and non-ranking.'
]) requireText(historicalDepthAmendment, marker, 'historical PR #353 roadmap amendment');

if (failures.length) {
  console.error('Non-UI release material validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  historical_checkpoint_id: checkpoint.checkpoint_id,
  historical_stable_assets: checkpoint.v2_groups.stablecoins.record_count,
  current_checkpoint_id: currentCheckpoint.checkpoint_id,
  current_history_checkpoint_id: currentHistoryCheckpoint.checkpoint_id,
  current_stable_assets: currentCheckpoint.asset_count,
  current_market_access_records: latestSnapshot?.totals?.market_access_records ?? 0,
  historical_release_integrity_baseline_id: checkpoint.release_integrity_baseline_id,
  current_release_integrity_baseline_id: releaseBaseline.baseline_id,
  reproducible_build_baseline_id: reproducibleBaseline.baseline_id,
  update_id: updateId,
  stats_history_snapshot_count: history.snapshots?.length ?? 0,
  active_workstream: 'pr357_tier_a_dossier_batch_3',
  next_workstream: 'pr358_record_growth_batch_1'
}, null, 2));
