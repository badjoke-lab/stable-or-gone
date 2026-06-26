import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const root = process.cwd();
const outputPath = path.join(root, 'data/generated/build-provenance.json');

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
}

function resolveCommit() {
  const explicit = process.env.SOG_BUILD_COMMIT?.trim();
  if (explicit) return explicit;
  try {
    const value = execFileSync('git', ['rev-parse', 'HEAD'], {
      cwd: root,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    }).trim();
    if (/^[0-9a-f]{40}$/i.test(value)) return value;
  } catch {
    // Environment fallbacks below keep non-git build contexts explicit.
  }
  return process.env.CF_PAGES_COMMIT_SHA
    || process.env.VERCEL_GIT_COMMIT_SHA
    || process.env.GITHUB_SHA
    || 'unknown';
}

function resolveBranch() {
  return process.env.SOG_BUILD_BRANCH
    || process.env.CF_PAGES_BRANCH
    || process.env.VERCEL_GIT_COMMIT_REF
    || process.env.GITHUB_HEAD_REF
    || process.env.GITHUB_REF_NAME
    || 'main';
}

function resolveTimestamp() {
  const explicit = process.env.SOG_BUILD_TIMESTAMP?.trim();
  if (explicit) {
    const parsed = new Date(explicit);
    if (Number.isNaN(parsed.valueOf())) throw new Error(`Invalid SOG_BUILD_TIMESTAMP: ${explicit}`);
    return parsed.toISOString();
  }
  return new Date().toISOString();
}

function flattenGroupFiles(groups = {}) {
  return Object.values(groups).flatMap((files) => Array.isArray(files) ? files : []);
}

const registryV2 = loadRegistryV2Baseline(root);
const registryV3 = readJson('docs/migration/registry-v3-foundation.json');
const incomeProfiles = readJson('docs/migration/registry-v3-income-profiles.json');
const qualityBaseline = readJson('docs/migration/registry-v3-baseline.json');
const generatedStats = readJson(qualityBaseline.generated_stats);

const compatibilityFiles = [
  'data/stablecoin-overrides-pr033.json',
  'data/stablecoin-overrides-pr034.json'
].filter((relativePath) => fs.existsSync(path.join(root, relativePath)));

const canonicalFiles = [...new Set([
  ...flattenGroupFiles(registryV2.data_groups),
  ...flattenGroupFiles(registryV3.data_groups),
  ...(incomeProfiles.data_files ?? []),
  ...compatibilityFiles
])].sort();

const hash = crypto.createHash('sha256');
for (const relativePath of canonicalFiles) {
  const absolutePath = path.join(root, relativePath);
  if (!fs.existsSync(absolutePath)) throw new Error(`Canonical provenance input is missing: ${relativePath}`);
  hash.update(relativePath);
  hash.update('\0');
  hash.update(fs.readFileSync(absolutePath));
  hash.update('\0');
}

const counts = generatedStats.registry;
for (const [key, expected] of Object.entries(qualityBaseline.expected_counts)) {
  if (counts[key] !== expected) {
    throw new Error(`Generated registry count differs from Registry v3 baseline for ${key}: ${counts[key]} !== ${expected}`);
  }
}

const routeCounts = {
  stablecoin_detail: counts.stablecoins,
  organization_detail: counts.organizations,
  event_detail: counts.events,
  total_detail: counts.stablecoins + counts.organizations + counts.events,
  declared_main_routes: 13
};

const provenance = {
  schema_version: '1.0',
  source_commit: resolveCommit(),
  source_branch: resolveBranch(),
  generated_at: resolveTimestamp(),
  canonical_data_hash: `sha256:${hash.digest('hex')}`,
  canonical_file_count: canonicalFiles.length,
  canonical_record_counts: counts,
  route_counts: routeCounts,
  verification_marker: 'sog_build_provenance_v1'
};

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(provenance, null, 2)}\n`);

const summary = [
  '## SOG build provenance',
  '',
  `- Source commit: \`${provenance.source_commit}\``,
  `- Source branch: \`${provenance.source_branch}\``,
  `- Generated at: \`${provenance.generated_at}\``,
  `- Canonical data hash: \`${provenance.canonical_data_hash}\``,
  `- Canonical files: ${provenance.canonical_file_count}`,
  `- Stable assets: ${counts.stablecoins}`,
  `- Organizations: ${counts.organizations}`,
  `- Events: ${counts.events}`,
  `- Evidence: ${counts.evidence}`,
  `- Evidence relations: ${counts.evidence_relations}`,
  `- Expected detail routes: ${routeCounts.total_detail}`,
  ''
].join('\n');

if (process.env.GITHUB_STEP_SUMMARY) {
  fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary);
}

console.log(JSON.stringify(provenance, null, 2));
