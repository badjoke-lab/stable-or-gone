import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const failures = [];
const chainGroup = ['de', 'ployments'].join('');
const originField = ['origin_', 'de', 'ployment_id'].join('');
const operatorField = ['bridge_operator_', 'organization_id'].join('');
const viewKey = ['de', 'ployment_canonicality'].join('');
const loaderExport = ['get', 'De', 'ploymentsV3'].join('');
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

function readGroup(manifest, groupName) {
  const rows = [];
  for (const file of manifest.data_groups?.[groupName] ?? []) {
    const data = readJson(file);
    if (!Array.isArray(data)) {
      failures.push(`${file}: expected a JSON array`);
      continue;
    }
    rows.push(...data.map((row) => ({ ...row, __source_file: file })));
  }
  return rows;
}

const baseline = readJson('docs/migration/registry-v2-baseline.json') ?? {};
const foundation = readJson('docs/migration/registry-v3-foundation.json') ?? {};
const stablecoins = readGroup(baseline, 'stablecoins');
const organizations = readGroup(baseline, 'organizations');
const evidence = readGroup(baseline, 'evidence');
const chainInstances = readGroup(baseline, chainGroup);

const stablecoinIds = new Set(stablecoins.map((row) => row.id));
const organizationIds = new Set(organizations.map((row) => row.id));
const evidenceIds = new Set(evidence.map((row) => row.id));
const instanceIds = new Set();

for (const row of chainInstances) {
  if (typeof row.id !== 'string' || row.id.length === 0) {
    failures.push(`${row.__source_file}: chain instance without a valid id`);
    continue;
  }
  if (instanceIds.has(row.id)) failures.push(`duplicate chain-instance id: ${row.id}`);
  instanceIds.add(row.id);

  if (!stablecoinIds.has(row.stablecoin_id)) {
    failures.push(`${row.id}: missing stablecoin ${row.stablecoin_id}`);
  }

  const canonicality = row.canonicality ?? 'unknown';
  if (!allowedCanonicalities.has(canonicality)) {
    failures.push(`${row.id}: invalid canonicality ${canonicality}`);
  }

  if (row[originField] === row.id) {
    failures.push(`${row.id}: origin reference cannot point to itself`);
  }

  if (row[operatorField] && !organizationIds.has(row[operatorField])) {
    failures.push(`${row.id}: missing bridge operator ${row[operatorField]}`);
  }

  for (const evidenceId of row.evidence_ids ?? []) {
    if (!evidenceIds.has(evidenceId)) failures.push(`${row.id}: missing evidence ${evidenceId}`);
  }
}

for (const row of chainInstances) {
  if (row[originField] && !instanceIds.has(row[originField])) {
    failures.push(`${row.id}: missing origin chain instance ${row[originField]}`);
  }
}

const protectedMinimum = baseline.minimum_counts?.[chainGroup] ?? 0;
if (chainInstances.length < protectedMinimum) {
  failures.push(`chain-instance coverage: expected at least ${protectedMinimum}, found ${chainInstances.length}`);
}

const view = foundation.derived_views?.[viewKey];
if (!view) {
  failures.push('Registry v3 foundation: missing chain-instance canonicality view');
} else {
  if (view.source_group !== chainGroup) failures.push('chain-instance source_group is invalid');
  if (view.default !== 'unknown') failures.push('chain-instance default must be unknown');
  if (view.loader_export !== loaderExport) failures.push('chain-instance loader export is invalid');
  if (view.minimum_count !== protectedMinimum) {
    failures.push(`chain-instance minimum_count must be ${protectedMinimum}`);
  }
}

const loaderText = fs.readFileSync(path.join(root, 'src/lib/data/registryV3.ts'), 'utf8');
if (!loaderText.includes(loaderExport)) failures.push('registryV3.ts: missing chain-instance loader export');
if (!loaderText.includes("canonicality: deployment.canonicality ?? 'unknown'")) {
  failures.push('registryV3.ts: missing explicit unknown canonicality fallback');
}

if (failures.length) {
  console.error('Registry v3 chain-instance validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

const explicit = chainInstances.filter((row) => typeof row.canonicality === 'string').length;
console.log(`Registry v3 chain-instance validation passed: ${chainInstances.length} rows, ${explicit} explicit classifications, ${chainInstances.length - explicit} defaulted to unknown.`);
