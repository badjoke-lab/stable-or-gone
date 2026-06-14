import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const failures = [];
const auditPath = 'docs/migration/registry-v3-migration-audit.json';

const absolute = (relativePath) => path.join(root, relativePath);
const fail = (message) => failures.push(message);

function readJson(relativePath) {
  try {
    return JSON.parse(fs.readFileSync(absolute(relativePath), 'utf8'));
  } catch (error) {
    fail(`${relativePath}: ${error.message}`);
    return null;
  }
}

function readText(relativePath) {
  try {
    return fs.readFileSync(absolute(relativePath), 'utf8');
  } catch (error) {
    fail(`${relativePath}: ${error.message}`);
    return '';
  }
}

function readArrays(files, label) {
  const rows = [];
  const seenFiles = new Set();
  for (const file of files ?? []) {
    if (seenFiles.has(file)) {
      fail(`${label}: duplicate file ${file}`);
      continue;
    }
    seenFiles.add(file);
    const value = readJson(file);
    if (!Array.isArray(value)) {
      fail(`${file}: expected a JSON array`);
      continue;
    }
    rows.push(...value);
  }
  return rows;
}

function ids(rows, label) {
  const result = new Set();
  for (const row of rows) {
    if (!row || typeof row.id !== 'string' || row.id.length === 0) {
      fail(`${label}: row without a valid id`);
      continue;
    }
    if (result.has(row.id)) fail(`${label}: duplicate id ${row.id}`);
    result.add(row.id);
  }
  return result;
}

function assertMinimum(label, actual, minimum) {
  if (!Number.isInteger(minimum) || minimum < 0) fail(`${auditPath}: invalid minimum for ${label}`);
  else if (actual < minimum) fail(`${label}: expected at least ${minimum}, found ${actual}`);
}

function requireCoverage(label, protectedIds, coveredIds) {
  for (const id of protectedIds) if (!coveredIds.has(id)) fail(`${label}: missing protected stablecoin ${id}`);
  for (const id of coveredIds) if (!protectedIds.has(id)) fail(`${label}: orphan stablecoin ${id}`);
}

function requireLoaderFiles(loaderPath, files, exportName) {
  const text = readText(loaderPath);
  for (const file of files ?? []) {
    const basename = path.posix.basename(file);
    if (!text.includes(basename)) fail(`${loaderPath}: missing data file ${basename}`);
  }
  if (!text.includes(`export function ${exportName}`)) fail(`${loaderPath}: missing export function ${exportName}`);
}

const audit = readJson(auditPath) ?? {};
const baseline = readJson(audit.base_registry ?? '') ?? {};
const foundationPath = audit.manifests?.foundation;
const deploymentPath = audit.manifests?.deployments;
const incomePath = audit.manifests?.income_profiles;
const foundation = readJson(foundationPath ?? '') ?? {};
const deploymentView = readJson(deploymentPath ?? '') ?? {};
const incomeManifest = readJson(incomePath ?? '') ?? {};

if (audit.schema_version !== '3.0-migration-audit') fail(`${auditPath}: invalid schema_version`);
if (audit.status !== 'protected_baseline') fail(`${auditPath}: status must be protected_baseline`);
if (foundation.base_registry !== audit.base_registry) fail(`${foundationPath}: base_registry mismatch`);
if (deploymentView.source_manifest !== audit.base_registry) fail(`${deploymentPath}: source_manifest mismatch`);
if (deploymentView.source_group !== 'deployments') fail(`${deploymentPath}: source_group must be deployments`);
if (incomeManifest.base_registry !== audit.base_registry) fail(`${incomePath}: base_registry mismatch`);

const protectedRows = baseline.protected_stablecoins ?? [];
const protectedIds = ids(protectedRows, 'protected stablecoins');
if (protectedIds.size !== audit.coverage?.protected_stablecoins) {
  fail(`protected stablecoins: expected ${audit.coverage?.protected_stablecoins}, found ${protectedIds.size}`);
}

const legalProfiles = readArrays(foundation.data_groups?.legal_profiles, 'legal profiles');
const relationships = readArrays(foundation.data_groups?.stable_asset_relationships, 'stable asset relationships');
const reserveComponents = readArrays(foundation.data_groups?.reserve_components, 'reserve components');
const deployments = readArrays(baseline.data_groups?.[deploymentView.source_group], 'deployments');
const incomeProfiles = readArrays(incomeManifest.data_files, 'income profiles');

const legalIds = ids(legalProfiles, 'legal profiles');
ids(relationships, 'stable asset relationships');
ids(reserveComponents, 'reserve components');
ids(deployments, 'deployments');
const incomeIds = ids(incomeProfiles, 'income profiles');

assertMinimum('legal profiles', legalProfiles.length, audit.minimum_counts?.legal_profiles);
assertMinimum('stable asset relationships', relationships.length, audit.minimum_counts?.stable_asset_relationships);
assertMinimum('reserve components', reserveComponents.length, audit.minimum_counts?.reserve_components);
assertMinimum('deployments', deployments.length, audit.minimum_counts?.deployments);
assertMinimum('income profiles', incomeProfiles.length, audit.minimum_counts?.income_profiles);

if (foundation.minimum_counts?.legal_profiles !== audit.minimum_counts?.legal_profiles) fail(`${foundationPath}: legal profile minimum mismatch`);
if (foundation.minimum_counts?.stable_asset_relationships !== audit.minimum_counts?.stable_asset_relationships) fail(`${foundationPath}: relationship minimum mismatch`);
if (foundation.minimum_counts?.reserve_components !== audit.minimum_counts?.reserve_components) fail(`${foundationPath}: reserve component minimum mismatch`);
if (deploymentView.minimum_count !== audit.minimum_counts?.deployments) fail(`${deploymentPath}: deployment minimum mismatch`);
if (incomeManifest.minimum_count !== audit.minimum_counts?.income_profiles) fail(`${incomePath}: income profile minimum mismatch`);

if (audit.coverage?.legal_profiles_required_for_each) requireCoverage('legal profiles', protectedIds, legalIds);
if (audit.coverage?.income_profiles_required_for_each) requireCoverage('income profiles', protectedIds, incomeIds);
if (audit.coverage?.reserve_components_required_for_each) {
  const reserveAssetIds = new Set(reserveComponents.map((row) => row.stablecoin_id));
  requireCoverage('reserve components', protectedIds, reserveAssetIds);
}

for (const row of reserveComponents) {
  if (!protectedIds.has(row.stablecoin_id)) fail(`reserve component ${row.id}: missing protected stablecoin ${row.stablecoin_id}`);
}
for (const row of deployments) {
  if (!protectedIds.has(row.stablecoin_id)) fail(`deployment ${row.id}: missing protected stablecoin ${row.stablecoin_id}`);
}

const foundationFiles = [
  ...(foundation.data_groups?.legal_profiles ?? []),
  ...(foundation.data_groups?.stable_asset_relationships ?? []),
  ...(foundation.data_groups?.reserve_components ?? [])
];
requireLoaderFiles(audit.loaders?.foundation, foundationFiles, 'getReserveComponents');
const foundationLoader = readText(audit.loaders?.foundation ?? '');
for (const exportName of ['getLegalProfiles', 'getStableAssetRelationships', 'getDeploymentsV3']) {
  if (!foundationLoader.includes(`export function ${exportName}`)) fail(`${audit.loaders?.foundation}: missing export function ${exportName}`);
}
requireLoaderFiles(audit.loaders?.income_profiles, incomeManifest.data_files, 'getIncomeProfilesV3');

for (const validator of audit.validators ?? []) {
  if (!fs.existsSync(absolute(validator))) fail(`${auditPath}: missing validator ${validator}`);
}

const packageJson = readJson('package.json') ?? {};
const scripts = packageJson.scripts ?? {};
const expectedScripts = {
  'validate:v3': 'scripts/validate-registry-v3-foundation.mjs',
  'validate:deployments-v3': 'scripts/validate-registry-v3-deployments.mjs',
  'validate:income-v3': 'scripts/validate-registry-v3-income-profiles.mjs',
  'validate:migration-v3': 'scripts/validate-registry-v3-migration-audit.mjs'
};
for (const [name, validator] of Object.entries(expectedScripts)) {
  if (typeof scripts[name] !== 'string' || !scripts[name].includes(validator)) fail(`package.json: ${name} must run ${validator}`);
}
if (typeof scripts['validate:finalization'] !== 'string' || !scripts['validate:finalization'].includes('npm run validate:migration-v3')) {
  fail('package.json: validate:finalization must include validate:migration-v3');
}
if (typeof scripts.build !== 'string' || !scripts.build.includes('npm run validate:finalization')) {
  fail('package.json: build must include validate:finalization');
}

if (failures.length) {
  console.error('Registry v3 migration audit failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Registry v3 migration audit passed: ${protectedIds.size} protected assets, ${legalProfiles.length} legal profiles, ${relationships.length} relationships, ${reserveComponents.length} reserve components, ${deployments.length} deployments, ${incomeProfiles.length} income profiles.`);
