import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const failures = [];
const allowedCanonicalities = new Set([
  'native',
  'issuer_native',
  'canonical_bridge',
  'third_party_bridge',
  'wrapped',
  'synthetic',
  'legacy',
  'unknown'
]);

function readJson(relativePath) {
  try {
    return JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
  } catch (error) {
    failures.push(`${relativePath}: ${error.message}`);
    return null;
  }
}

const baseline = readJson('docs/migration/registry-v2-baseline.json') ?? {};
const foundation = readJson('docs/migration/registry-v3-foundation.json') ?? {};
const deployments = [];

for (const file of baseline.data_groups?.deployments ?? []) {
  const rows = readJson(file);
  if (!Array.isArray(rows)) {
    failures.push(`${file}: expected a JSON array`);
    continue;
  }
  deployments.push(...rows.map((row) => ({ ...row, __source_file: file })));
}

const ids = new Set();
for (const row of deployments) {
  if (typeof row.id !== 'string' || row.id.length === 0) {
    failures.push(`${row.__source_file}: deployment without a valid id`);
    continue;
  }
  if (ids.has(row.id)) failures.push(`duplicate deployment id: ${row.id}`);
  ids.add(row.id);

  const canonicality = row.canonicality ?? 'unknown';
  if (!allowedCanonicalities.has(canonicality)) {
    failures.push(`${row.id}: invalid canonicality ${canonicality}`);
  }
  if (row.origin_deployment_id && row.origin_deployment_id === row.id) {
    failures.push(`${row.id}: origin_deployment_id cannot reference itself`);
  }
}

for (const row of deployments) {
  if (row.origin_deployment_id && !ids.has(row.origin_deployment_id)) {
    failures.push(`${row.id}: missing origin deployment ${row.origin_deployment_id}`);
  }
}

const protectedMinimum = baseline.minimum_counts?.deployments ?? 0;
if (deployments.length < protectedMinimum) {
  failures.push(`deployment canonicality coverage: expected at least ${protectedMinimum}, found ${deployments.length}`);
}

const view = foundation.derived_views?.deployment_canonicality;
if (!view) failures.push('Registry v3 foundation: missing deployment_canonicality derived view');
else {
  if (view.source_group !== 'deployments') failures.push('deployment_canonicality source_group must be deployments');
  if (view.default !== 'unknown') failures.push('deployment_canonicality default must be unknown');
  if (view.loader_export !== 'getDeploymentsV3') failures.push('deployment_canonicality loader_export must be getDeploymentsV3');
  if (view.minimum_count !== protectedMinimum) failures.push(`deployment_canonicality minimum_count must be ${protectedMinimum}`);
}

const loaderText = fs.readFileSync(path.join(root, 'src/lib/data/registryV3.ts'), 'utf8');
if (!loaderText.includes('getDeploymentsV3')) failures.push('registryV3.ts: missing getDeploymentsV3 export');
if (!loaderText.includes("canonicality: deployment.canonicality ?? 'unknown'")) failures.push('registryV3.ts: missing explicit unknown canonicality fallback');

if (failures.length) {
  console.error('Registry v3 deployment validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Registry v3 deployment validation passed: ${deployments.length} deployments normalized, ${deployments.filter((row) => row.canonicality).length} explicitly classified, ${deployments.filter((row) => !row.canonicality).length} defaulted to unknown.`);
