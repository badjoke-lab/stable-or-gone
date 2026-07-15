import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { buildPlanningInputCoverageAudit } from './build-planning-input-coverage-audit-pr371.mjs';

const root = process.cwd();
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');
const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const config = readJson('config/planning-input-coverage-audit-pr371.json');
const manifest = readJson('docs/migration/planning-input-manifest-pr371.json');
const audit = readJson('docs/migration/planning-input-coverage-audit-pr371.json');
const generated = buildPlanningInputCoverageAudit();

expect(same(manifest, generated.manifest), 'committed planning input manifest is not deterministic');
expect(same(audit, generated.audit), 'committed planning input audit is not deterministic');
expect(config.review_pr === 371 && manifest.review_pr === 371 && audit.review_pr === 371, 'review PR identity changed');
expect(manifest.status === 'reviewed_internal_complete_profile_input_manifest', 'manifest status changed');
expect(audit.status === 'reviewed_complete', 'audit status changed');
expect(manifest.public_output === false && audit.public_output === false, 'audit outputs must remain internal');
expect(manifest.composition_semantics.source_order === 'public_loader_import_order', 'manifest source order changed');
expect(manifest.composition_semantics.duplicate_asset_resolution === 'last_write_wins', 'duplicate resolution changed');

const files = manifest.ordered_profile_files;
expect(files.length === config.expected.public_profile_loader_file_count, 'public profile file count mismatch');
expect(audit.public_loader.file_count === config.expected.public_profile_loader_file_count, 'audit public loader count mismatch');
expect(audit.legacy_planning_input.file_count === config.expected.legacy_baseline_profile_file_count, 'legacy planning file count mismatch');
expect(audit.coverage_gap.missing_profile_file_count === config.expected.missing_from_planning_file_count, 'missing profile file count mismatch');
expect(manifest.counts.ordered_file_count === 29, 'manifest must contain 29 ordered profile files');
expect(manifest.counts.legacy_baseline_file_count === 15, 'manifest must contain 15 legacy baseline files');
expect(manifest.counts.reviewed_overlay_file_count === 14, 'manifest must contain 14 reviewed overlay files');
expect(manifest.counts.unique_asset_ids === config.expected.canonical_assets, 'manifest must resolve exactly 112 asset IDs');
expect(audit.public_loader.unique_asset_ids === config.expected.canonical_assets, 'public loader must resolve exactly 112 asset IDs');
expect(audit.source_checkpoint.assets === config.expected.canonical_assets, 'canonical checkpoint asset count changed');
expect(audit.public_loader.profile_export_delegates_to_current_loader === true, 'stablecoinProfiles export must delegate to currentProfiles');
expect(audit.public_loader.deduplication === 'last_write_wins', 'public loader deduplication changed');
expect(audit.coverage_gap.legacy_only_file_count === 0, 'legacy planning profile list contains files absent from public loader');
expect(audit.coverage_gap.missing_profile_files.length === 14, 'missing profile file list length mismatch');
expect(audit.coverage_gap.asset_ids_missing_from_legacy_input_count > 0, 'audit must identify asset IDs missing from legacy planning input');
expect(audit.coverage_gap.affected_asset_id_count > 0, 'audit must identify affected asset IDs');

const paths = files.map((row) => row.path);
expect(new Set(paths).size === paths.length, 'manifest contains duplicate file paths');
expect(same(files.map((row) => row.order_index), files.map((_, index) => index)), 'manifest order indexes are not contiguous');
for (const row of files) {
  const absolute = path.join(root, row.path);
  expect(fs.existsSync(absolute), `${row.path}: manifest input file missing`);
  if (!fs.existsSync(absolute)) continue;
  const content = readText(row.path);
  const parsed = JSON.parse(content);
  expect(Array.isArray(parsed), `${row.path}: profile input must be an array`);
  expect(parsed.length === row.row_count, `${row.path}: row count mismatch`);
  expect(new Set(parsed.map((item) => item.id)).size === row.unique_id_count, `${row.path}: unique ID count mismatch`);
  expect(sha256(content) === row.content_sha256, `${row.path}: content SHA-256 mismatch`);
  expect(row.role === (row.in_legacy_registry_baseline ? 'legacy_baseline_input' : 'reviewed_overlay_input'), `${row.path}: input role mismatch`);
}

const occurrences = new Map();
for (const row of files) {
  for (const item of readJson(row.path)) {
    if (!occurrences.has(item.id)) occurrences.set(item.id, []);
    occurrences.get(item.id).push(row.path);
  }
}
expect(manifest.asset_winners.length === occurrences.size, 'asset winner count mismatch');
for (const winner of manifest.asset_winners) {
  const sourceFiles = occurrences.get(winner.asset_id) ?? [];
  expect(sourceFiles.length === winner.occurrence_count, `${winner.asset_id}: occurrence count mismatch`);
  expect(sourceFiles.at(-1) === winner.winning_file, `${winner.asset_id}: last-write-wins file mismatch`);
  expect(same(sourceFiles.slice(0, -1), winner.superseded_files), `${winner.asset_id}: superseded file list mismatch`);
}
expect(manifest.counts.duplicate_asset_ids === manifest.asset_winners.filter((row) => row.occurrence_count > 1).length, 'duplicate asset count mismatch');
expect(manifest.counts.duplicate_row_occurrences === manifest.counts.total_row_occurrences - manifest.counts.unique_asset_ids, 'duplicate occurrence total mismatch');

expect(audit.planning_code_path.canonical_builder_uses_legacy_registry_profile_group === true, 'canonical builder legacy profile-group finding not reproduced');
expect(audit.planning_code_path.canonical_builder_defaults_profile_overrides_empty === true, 'empty profile override default finding not reproduced');
expect(audit.planning_code_path.v2_builder_calls_canonical_builder_without_options === true, 'PR #368 no-options call finding not reproduced');
expect(audit.planning_code_path.current_planning_input_matches_public_loader === false, 'planning/public input mismatch must remain explicit');
expect(audit.decision.complete_manifest_required === true, 'complete manifest decision changed');
expect(audit.decision.approved_manifest === 'docs/migration/planning-input-manifest-pr371.json', 'approved manifest path changed');
expect(audit.decision.next_work_item === 'PR #372 Record Depth Baseline v2.1 Refresh', 'next work item changed');
expect(audit.decision.baseline_recompute_allowed_in_pr371 === false, 'PR #371 must not recompute baseline');
expect(audit.decision.canonical_data_change_allowed === false, 'PR #371 canonical boundary changed');
expect(audit.decision.public_surface_change_allowed === false, 'PR #371 public boundary changed');
expect(audit.decision.review_gate_after_pr372 === true, 'PR #372 must end at review gate');
expect(manifest.manifest_digest_sha256 === audit.manifest_digest_sha256, 'manifest/audit digest mismatch');
expect(manifest.source_digest_sha256 === audit.source_digest_sha256, 'source digest mismatch');

for (const key of ['canonical_data_change_allowed', 'public_loader_change_allowed', 'public_surface_change_allowed', 'baseline_recompute_allowed', 'historical_checkpoint_rewrite_allowed', 'ranking_allowed', 'single_composite_score_allowed', 'automatic_promotion_allowed']) {
  expect(config.boundaries?.[key] === false, `PR #371 boundary changed: ${key}`);
}
for (const key of ['canonical_data_changed', 'public_loader_changed', 'public_surface_changed', 'baseline_recomputed', 'historical_outputs_rewritten', 'ranking_or_score', 'automatic_promotion']) {
  expect(audit.boundaries?.[key] === false, `audit boundary changed: ${key}`);
}

for (const file of [
  'src/lib/data/currentProfiles.ts',
  'src/lib/data/stablecoinProfiles.ts',
  'docs/migration/registry-v2-baseline.json',
  'scripts/growth/build-reviewed-record-depth-baseline-pr353.mjs',
  'scripts/build-record-depth-baseline-v2-refresh-pr368.mjs',
  'docs/migration/post-pr369-review-gate-pr370.json',
  'docs/migration/record-depth-baseline-v2-pr368.json',
  'docs/migration/record-depth-baseline-v2-pr368-summary.json',
  'docs/migration/record-depth-baseline-v2-pr368-delta.json',
  'docs/migration/tier-a-candidate-queue-v2-pr368.json',
  'docs/migration/tier-a-batch-5-pr369-review-outcomes.json',
  'docs/migration/tier-a-batch-5-pr369-reviewed-handoff.json',
  'docs/migration/current-canonical-checkpoint.json'
]) {
  try {
    expect(git('hash-object', file) === git('rev-parse', `origin/main:${file}`), `${file}: immutable Git blob identity changed`);
  } catch (error) {
    failures.push(`${file}: unable to verify origin/main blob identity: ${error.message}`);
  }
}

for (const [file, markers] of [
  ['AGENTS.md', ['PR #371 Planning Input Coverage Audit: active; complete on merge', 'PR #372 Record Depth Baseline v2.1 Refresh: next after PR #371', 'public loader files: 29']],
  ['docs/roadmap.md', ['Status: canonical execution schedule — PR #371 active', 'reviewed overlay files omitted by default planning input: 14', 'PR #372  Record Depth Baseline v2.1 Refresh']],
  ['docs/quality/planning-input-coverage-audit-pr371-spec.md', ['public profile loader files: 29', 'last-write-wins', 'no baseline recomputation']],
  ['docs/roadmap-amendments/2026-07-15-pr371-planning-input-coverage-audit-activation.md', ['PR #371', 'public profile input files: 29', 'PR #372 Record Depth Baseline v2.1 Refresh']]
]) {
  const text = readText(file);
  for (const marker of markers) expect(text.includes(marker), `${file}: missing authority marker ${marker}`);
}

for (const file of [
  'public/data/planning-input-manifest-pr371.json',
  'public/data/planning-input-coverage-audit-pr371.json',
  'src/pages/planning-input-coverage.astro'
]) expect(!fs.existsSync(path.join(root, file)), `${file}: internal audit output leaked into public surface`);

if (failures.length) {
  console.error('PR #371 Planning Input Coverage Audit validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  manifest_id: manifest.manifest_id,
  profile_files: manifest.counts.ordered_file_count,
  legacy_files: manifest.counts.legacy_baseline_file_count,
  reviewed_overlay_files: manifest.counts.reviewed_overlay_file_count,
  unique_asset_ids: manifest.counts.unique_asset_ids,
  duplicate_asset_ids: manifest.counts.duplicate_asset_ids,
  affected_asset_ids: audit.coverage_gap.affected_asset_id_count,
  next_work_item: audit.decision.next_work_item
}, null, 2));
