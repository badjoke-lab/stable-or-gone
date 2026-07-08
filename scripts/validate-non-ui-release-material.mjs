import fs from 'node:fs';

const read = (file) => fs.readFileSync(file, 'utf8');
const readJson = (file) => JSON.parse(read(file));
const checkpoint = readJson('docs/migration/audited-100-asset-canonical-checkpoint.json');
const currentCheckpoint = readJson('docs/migration/current-canonical-checkpoint.json');
const releaseBaseline = readJson('docs/migration/registry-release-integrity-baseline.json');
const reproducibleBaseline = readJson('docs/migration/reproducible-build-output-baseline.json');
const updates = readJson('data/registry-updates.json');
const history = readJson('data/stats-history.json');
const readme = read('README.md');
const release = read('docs/releases/100-asset-checkpoint-2026-07-06.md');
const roadmap = read('docs/roadmap.md');
const amendment = read('docs/roadmap-amendments/2026-07-08-pr326-history-activation.md');
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const requireText = (body, text, label) => check(body.includes(text), `${label}: missing ${text}`);

for (const marker of [
  '100 stable assets','94 organizations','110 stablecoin-organization relationships','172 events','502 evidence records',
  '289 known unknowns','140 deployments','100 legal profiles','133 reserve components','100 income profiles','366 detail routes'
]) requireText(readme, marker, 'README.md');
for (const route of ['/version.json','/data/manifest.json','/llms.txt','/ai.txt']) requireText(readme, route, 'README.md');
for (const boundary of ['canonical_only = true','includes_unreviewed_candidates = false','includes_internal_monitoring = false','includes_private_notes = false']) requireText(readme, boundary, 'README.md');

for (const marker of [
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
]) requireText(release, marker, 'release note');
for (const route of ['/version.json','/data/manifest.json','/llms.txt','/ai.txt']) requireText(release, route, 'release note');
for (const boundary of ['canonical_only = true','includes_unreviewed_candidates = false','includes_internal_monitoring = false','includes_private_notes = false']) requireText(release, boundary, 'release note');

check(checkpoint.release_integrity_baseline_id === 'sog_release_integrity_pr316_2026_07_06', 'historical 100-asset release-integrity baseline ID changed');
check(checkpoint.reproducible_build_baseline_id === reproducibleBaseline.baseline_id, 'historical checkpoint/reproducible-build baseline ID mismatch');
check(releaseBaseline.status === 'current', 'current release-integrity baseline must remain current');
check(releaseBaseline.expected_v2_counts?.stablecoins === currentCheckpoint.asset_count, 'current release-integrity baseline must match current checkpoint asset count');
check(releaseBaseline.expected_v2_counts?.organizations === currentCheckpoint.expected_counts?.organizations, 'current release-integrity baseline must match current checkpoint organization count');
check(releaseBaseline.expected_v2_counts?.events === currentCheckpoint.expected_counts?.events, 'current release-integrity baseline must match current checkpoint event count');
check(releaseBaseline.expected_v2_counts?.evidence === currentCheckpoint.expected_counts?.evidence, 'current release-integrity baseline must match current checkpoint evidence count');
check(history.snapshots?.[0]?.checkpoint_id === checkpoint.checkpoint_id, 'stats history initial checkpoint ID mismatch');
check(history.snapshots?.[0]?.asset_count === 100, 'stats history initial asset count must be 100');
check(history.snapshots?.some((snapshot) => snapshot.checkpoint_id === currentCheckpoint.checkpoint_id), 'stats history current checkpoint snapshot missing');

const updateId = 'sog_update_2026_07_06_audited_100_asset_checkpoint';
const matchingUpdates = updates.filter((row) => row.id === updateId);
check(matchingUpdates.length === 1, `registry update ${updateId} must exist exactly once`);
if (matchingUpdates[0]) {
  check(matchingUpdates[0].date === '2026-07-06', 'checkpoint update date mismatch');
  check(matchingUpdates[0].category === 'data', 'checkpoint update category must be data');
  for (const route of ['/stablecoins/','/issuers/','/events/','/methodology/','/updates/','/data/manifest.json','/version.json']) check(matchingUpdates[0].related_paths?.includes(route), `checkpoint update missing related path: ${route}`);
}

for (const marker of [
  'PR #320 non-UI release material: complete',
  'PR #321 100-asset monitoring baseline synchronization: complete',
  'PR #322 reserve and redemption source expansion: complete',
  'PR #323 lifecycle, regulatory, and EU market-access source/schema expansion: complete',
  'PR #324 bounded scheduled read-only monitoring: complete',
  'PR #325 deterministic statistics generator and validator: complete',
  'Current item: PR #326 immutable checkpoint history',
  'Next item: PR #327 /stats/ foundation'
]) requireText(roadmap, marker, 'docs/roadmap.md');
for (const marker of [
  'PR #325 deterministic statistics generator and validator: complete',
  'PR #326 immutable checkpoint history: active',
  'PR #327 /stats/ foundation: next'
]) requireText(amendment, marker, 'PR #326 roadmap amendment');

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
  current_stable_assets: currentCheckpoint.asset_count,
  historical_release_integrity_baseline_id: checkpoint.release_integrity_baseline_id,
  current_release_integrity_baseline_id: releaseBaseline.baseline_id,
  reproducible_build_baseline_id: reproducibleBaseline.baseline_id,
  update_id: updateId,
  stats_history_snapshot_count: history.snapshots?.length ?? 0
}, null, 2));
