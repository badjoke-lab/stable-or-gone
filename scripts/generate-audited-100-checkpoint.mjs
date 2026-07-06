import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const root = process.cwd();
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const unique = (values) => [...new Set(values)];
const sha256 = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');

function rows(files = []) {
  return files.flatMap((file) => {
    const value = readJson(file);
    if (Array.isArray(value)) return value;
    if (Array.isArray(value.records)) return value.records;
    throw new Error(`${file}: expected array or { records: [] }`);
  });
}

function contentDigest(files = []) {
  const digest = crypto.createHash('sha256');
  for (const file of [...files].sort()) {
    digest.update(file);
    digest.update('\0');
    digest.update(fs.readFileSync(path.join(root, file)));
    digest.update('\0');
  }
  return digest.digest('hex');
}

function identityDigest(groupRows = []) {
  const ids = groupRows.map((row) => row.id).filter(Boolean).sort();
  return sha256(Buffer.from(ids.join('\n')));
}

function groupCheckpoint(files = []) {
  const groupRows = rows(files);
  return {
    record_count: groupRows.length,
    file_count: files.length,
    identity_sha256: identityDigest(groupRows),
    content_sha256: contentDigest(files),
  };
}

const v2 = loadRegistryV2Baseline(root);
const v3Foundation = readJson('docs/migration/registry-v3-foundation.json');
const incomeManifest = readJson('docs/migration/registry-v3-income-profiles.json');
const releaseBaseline = readJson('docs/migration/registry-release-integrity-baseline.json');
const reproducibleBaseline = readJson('docs/migration/reproducible-build-output-baseline.json');

const v3Groups = {
  legal_profiles: unique([
    ...(v3Foundation.data_groups?.legal_profiles ?? []),
    'data/q-legal.json',
    'data/r-legal.json',
    'data/s-legal.json',
    'data/t-legal.json',
  ]),
  stable_asset_relationships: unique(v3Foundation.data_groups?.stable_asset_relationships ?? []),
  reserve_components: unique([
    ...(v3Foundation.data_groups?.reserve_components ?? []),
    'data/reserve-components-v3-batch-q.json',
    'data/reserve-components-v3-batch-r.json',
    'data/reserve-components-v3-batch-s.json',
    'data/batch-t-components.json',
  ]),
  income_profiles: unique([
    ...(incomeManifest.data_files ?? []),
    'data/yield-profiles-v3-q.json',
    'data/r-returns.json',
    'data/s-returns.json',
    'data/batch-t-income.json',
  ]),
};

const compatibilityFiles = [
  'data/stablecoin-overrides-pr033.json',
  'data/stablecoin-overrides-pr034.json',
].filter((file) => fs.existsSync(path.join(root, file)));

const v2Groups = Object.fromEntries(
  Object.entries(v2.data_groups ?? {}).map(([name, files]) => [name, groupCheckpoint(files)])
);
const v3Checkpoints = Object.fromEntries(
  Object.entries(v3Groups).map(([name, files]) => [name, groupCheckpoint(files)])
);

const canonicalFiles = unique([
  ...Object.values(v2.data_groups ?? {}).flat(),
  ...Object.values(v3Groups).flat(),
  ...compatibilityFiles,
]).sort();

const canonicalIdentityDigest = crypto.createHash('sha256');
for (const [name, checkpoint] of Object.entries({ ...v2Groups, ...v3Checkpoints }).sort(([a], [b]) => a.localeCompare(b))) {
  canonicalIdentityDigest.update(name);
  canonicalIdentityDigest.update('\0');
  canonicalIdentityDigest.update(checkpoint.identity_sha256);
  canonicalIdentityDigest.update('\0');
}

const output = {
  schema_version: '1.0',
  checkpoint_kind: 'audited_100_asset_canonical_checkpoint_observation',
  source_commit: process.env.SOG_CHECKPOINT_SOURCE_COMMIT || process.env.GITHUB_SHA || 'unknown',
  release_integrity_baseline_id: releaseBaseline.baseline_id,
  reproducible_build_baseline_id: reproducibleBaseline.baseline_id,
  canonical_file_count: canonicalFiles.length,
  canonical_content_sha256: contentDigest(canonicalFiles),
  canonical_identity_sha256: canonicalIdentityDigest.digest('hex'),
  package_lock_sha256: sha256(fs.readFileSync(path.join(root, 'package-lock.json'))),
  package_json_sha256: sha256(fs.readFileSync(path.join(root, 'package.json'))),
  v2_groups: v2Groups,
  v3_groups: v3Checkpoints,
  compatibility_files: compatibilityFiles,
  release_expected_counts: {
    v2: releaseBaseline.expected_v2_counts,
    v3: releaseBaseline.expected_v3_counts,
    routes: releaseBaseline.expected_route_counts,
  },
  reproducibility_checkpoint: {
    audited_pr_head: '41ae5cdc07f8e5bae74642cd6f8ada3c7ebba96f',
    tree_sha256: '21fd8cbf5db373e1f0483dc5d74203b825c0203d08ba1ff7f34b8235495981a4',
    file_count: 414,
    total_bytes: 15178769,
    failures: 0,
    reproducible: true,
  },
};

const outputPath = process.env.SOG_CHECKPOINT_OUTPUT || 'artifacts/audited-100-checkpoint-observed.json';
fs.mkdirSync(path.dirname(path.join(root, outputPath)), { recursive: true });
fs.writeFileSync(path.join(root, outputPath), `${JSON.stringify(output, null, 2)}\n`);
console.log(JSON.stringify({
  output: outputPath,
  source_commit: output.source_commit,
  canonical_file_count: output.canonical_file_count,
  canonical_content_sha256: output.canonical_content_sha256,
  canonical_identity_sha256: output.canonical_identity_sha256,
  stablecoins: output.v2_groups.stablecoins?.record_count ?? null,
  events: output.v2_groups.events?.record_count ?? null,
  evidence: output.v2_groups.evidence?.record_count ?? null,
}, null, 2));
