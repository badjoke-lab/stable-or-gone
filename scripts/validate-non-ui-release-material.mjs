import fs from 'node:fs';

const read = (file) => fs.readFileSync(file, 'utf8');
const readJson = (file) => JSON.parse(read(file));

const checkpoint = readJson('docs/migration/audited-100-asset-canonical-checkpoint.json');
const releaseBaseline = readJson('docs/migration/registry-release-integrity-baseline.json');
const reproducibleBaseline = readJson('docs/migration/reproducible-build-output-baseline.json');
const updates = readJson('data/registry-updates.json');
const readme = read('README.md');
const release = read('docs/releases/100-asset-checkpoint-2026-07-06.md');
const roadmap = read('docs/roadmap.md');
const agents = read('AGENTS.md');

const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const requireText = (body, text, label) => check(body.includes(text), `${label}: missing ${text}`);

check(!readme.includes('92 stable assets'), 'README still contains stale 92-asset checkpoint count');
check(!readme.includes('Routine record growth is paused at 92 assets'), 'README still contains stale 92-asset workstream wording');

const expectedReadmeCounts = [
  '100 stable assets',
  '94 organizations',
  '110 stablecoin-organization relationships',
  '172 events',
  '502 evidence records',
  '289 known unknowns',
  '140 deployments',
  '100 legal profiles',
  '133 reserve components',
  '100 income profiles',
  '366 detail routes',
];
for (const marker of expectedReadmeCounts) requireText(readme, marker, 'README.md');

for (const route of ['/version.json', '/data/manifest.json', '/llms.txt', '/ai.txt']) requireText(readme, route, 'README.md');
for (const boundary of [
  'canonical_only = true',
  'includes_unreviewed_candidates = false',
  'includes_internal_monitoring = false',
  'includes_private_notes = false',
]) requireText(readme, boundary, 'README.md');

requireText(release, checkpoint.checkpoint_id, 'release note');
requireText(release, checkpoint.source_commit, 'release note');
requireText(release, `canonical files: ${checkpoint.canonical_file_count}`, 'release note');
requireText(release, checkpoint.canonical_content_sha256, 'release note');
requireText(release, checkpoint.canonical_identity_sha256, 'release note');
requireText(release, checkpoint.release_integrity_baseline_id, 'release note');
requireText(release, checkpoint.reproducible_build_baseline_id, 'release note');
requireText(release, checkpoint.reproducibility_checkpoint.tree_sha256, 'release note');
requireText(release, `output files: ${checkpoint.reproducibility_checkpoint.file_count}`, 'release note');
requireText(release, `total bytes: ${checkpoint.reproducibility_checkpoint.total_bytes}`, 'release note');
requireText(release, 'reproducible: true', 'release note');

for (const route of ['/version.json', '/data/manifest.json', '/llms.txt', '/ai.txt']) requireText(release, route, 'release note');
for (const boundary of [
  'canonical_only = true',
  'includes_unreviewed_candidates = false',
  'includes_internal_monitoring = false',
  'includes_private_notes = false',
]) requireText(release, boundary, 'release note');

check(checkpoint.release_integrity_baseline_id === releaseBaseline.baseline_id, 'checkpoint/release-integrity baseline ID mismatch');
check(checkpoint.reproducible_build_baseline_id === reproducibleBaseline.baseline_id, 'checkpoint/reproducible-build baseline ID mismatch');

const updateId = 'sog_update_2026_07_06_audited_100_asset_checkpoint';
const matchingUpdates = updates.filter((row) => row.id === updateId);
check(matchingUpdates.length === 1, `registry update ${updateId} must exist exactly once`);
const checkpointUpdate = matchingUpdates[0];
if (checkpointUpdate) {
  check(checkpointUpdate.date === '2026-07-06', 'checkpoint update date mismatch');
  check(checkpointUpdate.category === 'data', 'checkpoint update category must be data');
  for (const route of ['/stablecoins/', '/issuers/', '/events/', '/methodology/', '/updates/', '/data/manifest.json', '/version.json']) {
    check(checkpointUpdate.related_paths?.includes(route), `checkpoint update missing related path: ${route}`);
  }
  const forbiddenClaims = ['safest', 'risk score', 'complete monitoring coverage', 'Compare is available', 'Access & Regulation Explorer is available'];
  for (const claim of forbiddenClaims) {
    check(!`${checkpointUpdate.title} ${checkpointUpdate.summary}`.toLowerCase().includes(claim.toLowerCase()), `checkpoint update contains forbidden release claim: ${claim}`);
  }
}

requireText(roadmap, 'PR #320 non-UI release material: complete', 'docs/roadmap.md');
requireText(roadmap, 'PR #321 100-asset monitoring baseline synchronization: complete', 'docs/roadmap.md');
requireText(roadmap, 'Current item: PR #322 reserve and redemption source expansion', 'docs/roadmap.md');
requireText(roadmap, 'Next item: PR #323 lifecycle, regulatory, and EU market-access source/schema expansion', 'docs/roadmap.md');
requireText(agents, 'PR #320 non-UI release material: complete', 'AGENTS.md');
requireText(agents, 'PR #321 100-asset monitoring baseline synchronization: complete', 'AGENTS.md');
requireText(agents, 'Active: PR #322 reserve and redemption source expansion', 'AGENTS.md');
requireText(agents, 'Next: PR #323 lifecycle, regulatory, and EU market-access source/schema expansion', 'AGENTS.md');

if (failures.length) {
  console.error('Non-UI release material validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  checkpoint_id: checkpoint.checkpoint_id,
  stable_assets: checkpoint.v2_groups.stablecoins.record_count,
  organizations: checkpoint.v2_groups.organizations.record_count,
  events: checkpoint.v2_groups.events.record_count,
  evidence: checkpoint.v2_groups.evidence.record_count,
  canonical_file_count: checkpoint.canonical_file_count,
  update_id: updateId,
  active_roadmap_item: 'PR #322 reserve and redemption source expansion',
  next_roadmap_item: 'PR #323 lifecycle, regulatory, and EU market-access source/schema expansion',
}, null, 2));
