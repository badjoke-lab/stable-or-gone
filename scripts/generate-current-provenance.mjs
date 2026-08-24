import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';
import { buildRegistryStats } from './generate-registry-stats-batch-o.mjs';
import { resolveBuildTimestamp } from './lib/build-timestamp.mjs';

const root = process.cwd();
const read = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const rows = (file) => {
  const value = read(file);
  if (Array.isArray(value)) return value;
  if (Array.isArray(value.records)) return value.records;
  throw new Error(`${file}: expected rows`);
};
const count = (files = []) => files.reduce((sum, file) => sum + rows(file).length, 0);
const flatten = (groups = {}) => Object.values(groups).flatMap((files) => Array.isArray(files) ? files : []);
const unique = (values) => [...new Set(values)];

function commit() {
  if (process.env.SOG_BUILD_COMMIT?.trim()) return process.env.SOG_BUILD_COMMIT.trim();
  try {
    const value = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    if (/^[0-9a-f]{40}$/i.test(value)) return value;
  } catch {}
  return process.env.CF_PAGES_COMMIT_SHA || process.env.VERCEL_GIT_COMMIT_SHA || process.env.GITHUB_SHA || 'unknown';
}

function branch() {
  return process.env.SOG_BUILD_BRANCH || process.env.CF_PAGES_BRANCH || process.env.VERCEL_GIT_COMMIT_REF || process.env.GITHUB_HEAD_REF || process.env.GITHUB_REF_NAME || 'main';
}

const v2 = loadRegistryV2Baseline(root);
const v3base = read('docs/migration/registry-v3-foundation.json');
const yieldBase = read('docs/migration/registry-v3-income-profiles.json');
const quality = read('docs/migration/registry-v3-baseline.json');
const currentCheckpoint = read('docs/migration/current-canonical-checkpoint.json');
const v3 = {
  ...v3base,
  data_groups: {
    ...v3base.data_groups,
    legal_profiles: unique([...(v3base.data_groups?.legal_profiles ?? []), 'data/q-legal.json', 'data/r-legal.json', 'data/s-legal.json', 'data/t-legal.json']),
    reserve_components: unique([...(v3base.data_groups?.reserve_components ?? []), 'data/reserve-components-v3-batch-q.json', 'data/reserve-components-v3-batch-r.json', 'data/reserve-components-v3-batch-s.json', 'data/batch-t-components.json'])
  }
};
const yields = unique([...(yieldBase.data_files ?? []), 'data/yield-profiles-v3-q.json', 'data/r-returns.json', 'data/s-returns.json', 'data/batch-t-income.json']);

const stats = buildRegistryStats();

const compatibility = ['data/stablecoin-overrides-pr033.json', 'data/stablecoin-overrides-pr034.json']
  .filter((file) => fs.existsSync(path.join(root, file)));
const files = unique([...flatten(v2.data_groups), ...flatten(v3.data_groups), ...yields, ...compatibility]).sort();
const digest = crypto.createHash('sha256');
for (const file of files) {
  const absolute = path.join(root, file);
  if (!fs.existsSync(absolute)) throw new Error(`Canonical provenance input is missing: ${file}`);
  digest.update(file);
  digest.update('\0');
  digest.update(fs.readFileSync(absolute));
  digest.update('\0');
}

const counts = { ...stats.registry, evidence_relations: count(v2.data_groups.evidence_relations) };
const expected = { ...quality.expected_counts };
for (const [key, value] of Object.entries(v2.minimum_counts ?? {})) {
  if (Object.hasOwn(counts, key)) expected[key] = value;
}

const currentExpected = { ...(currentCheckpoint.counts ?? {}), ...(currentCheckpoint.expected_counts ?? {}) };
const checkpointToStatsKey = {
  assets: 'stablecoins',
  organizations: 'organizations',
  relationships: 'relationships',
  events: 'events',
  evidence: 'evidence',
  evidence_relations: 'evidence_relations',
  reserve_reports: 'reserve_reports',
  known_unknowns: 'known_unknowns',
  regulatory_notes: 'regulatory_notes',
  deployments: 'deployments',
  legal_profiles: 'legal_profiles',
  stable_asset_relationships: 'stable_asset_relationships',
  reserve_components: 'reserve_components',
  income_profiles: 'income_profiles'
};
for (const [checkpointKey, statsKey] of Object.entries(checkpointToStatsKey)) {
  if (Object.hasOwn(currentExpected, checkpointKey) && Object.hasOwn(counts, statsKey)) {
    expected[statsKey] = currentExpected[checkpointKey];
  }
}

expected.legal_profiles = count(v3.data_groups.legal_profiles);
expected.stable_asset_relationships = count(v3.data_groups.stable_asset_relationships);
expected.reserve_components = count(v3.data_groups.reserve_components);
expected.income_profiles = count(yields);
for (const [key, value] of Object.entries(expected)) {
  if (counts[key] !== value) throw new Error(`Current canonical count mismatch for ${key}: ${counts[key]} !== ${value}`);
}
if (counts.evidence_relations !== counts.evidence) throw new Error('Evidence relation count must match evidence count');

const routeCounts = {
  stablecoin_detail: counts.stablecoins,
  organization_detail: counts.organizations,
  event_detail: counts.events,
  total_detail: counts.stablecoins + counts.organizations + counts.events,
  declared_main_routes: 13
};
const output = {
  schema_version: '1.0',
  source_commit: commit(),
  source_branch: branch(),
  generated_at: resolveBuildTimestamp(process.env.SOG_BUILD_TIMESTAMP),
  canonical_data_hash: `sha256:${digest.digest('hex')}`,
  canonical_file_count: files.length,
  canonical_record_counts: counts,
  route_counts: routeCounts,
  verification_marker: 'sog_build_provenance_v1'
};
const outputPath = path.join(root, 'data/generated/build-provenance.json');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`);
if (process.env.GITHUB_STEP_SUMMARY) {
  fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `## SOG build provenance\n\n- Stable assets: ${counts.stablecoins}\n- Organizations: ${counts.organizations}\n- Events: ${counts.events}\n- Evidence: ${counts.evidence}\n`);
}
console.log(JSON.stringify(output, null, 2));
