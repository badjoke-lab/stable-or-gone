import fs from 'node:fs';
import path from 'node:path';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const root = process.cwd();
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const rows = (files = []) => files.flatMap((file) => {
  const value = readJson(file);
  if (!Array.isArray(value)) throw new Error(`${file}: expected JSON array`);
  return value;
});
const uniqueIds = (records) => new Set(records.map((row) => row.id));
const basenamesPresent = (loaderText, files = []) => files.every((file) => loaderText.includes(path.posix.basename(file)));

const baseline = loadRegistryV2Baseline(root);
const foundation = readJson('docs/migration/registry-v3-foundation.json');
const incomeManifest = readJson('docs/migration/registry-v3-income-profiles.json');
const deploymentView = readJson('docs/migration/registry-v3-view-67.json');
const migrationAudit = readJson('docs/migration/registry-v3-migration-audit.json');

const stablecoins = rows(baseline.data_groups?.stablecoins);
const deployments = rows(baseline.data_groups?.deployments);
const legalProfiles = rows(foundation.data_groups?.legal_profiles);
const assetRelationships = rows(foundation.data_groups?.stable_asset_relationships);
const reserveComponents = rows(foundation.data_groups?.reserve_components);
const incomeProfiles = rows(incomeManifest.data_files);

const stablecoinIds = uniqueIds(stablecoins);
const legalIds = uniqueIds(legalProfiles);
const incomeIds = uniqueIds(incomeProfiles);
const reserveAssetIds = new Set(reserveComponents.map((row) => row.stablecoin_id));

check(stablecoins.length === 100, `v2 canonical stablecoin count must be 100, found ${stablecoins.length}`);
check(stablecoinIds.size === 100, `v2 canonical stablecoin IDs must be unique, found ${stablecoinIds.size}`);
check(legalProfiles.length === 100, `v3 legal profile count must be 100, found ${legalProfiles.length}`);
check(legalIds.size === 100, `v3 legal profile IDs must be unique, found ${legalIds.size}`);
check(assetRelationships.length === 4, `v3 stable-asset relationship count must be 4, found ${assetRelationships.length}`);
check(reserveComponents.length === 133, `v3 reserve component count must be 133, found ${reserveComponents.length}`);
check(incomeProfiles.length === 100, `v3 income profile count must be 100, found ${incomeProfiles.length}`);
check(incomeIds.size === 100, `v3 income profile IDs must be unique, found ${incomeIds.size}`);
check(deployments.length === 140, `v3 deployment view source count must be 140, found ${deployments.length}`);

for (const id of stablecoinIds) {
  check(legalIds.has(id), `legal profile missing for ${id}`);
  check(incomeIds.has(id), `income profile missing for ${id}`);
  check(reserveAssetIds.has(id), `reserve component coverage missing for ${id}`);
}
for (const id of legalIds) check(stablecoinIds.has(id), `orphan legal profile ${id}`);
for (const id of incomeIds) check(stablecoinIds.has(id), `orphan income profile ${id}`);
for (const id of reserveAssetIds) check(stablecoinIds.has(id), `orphan reserve component asset ${id}`);

check(foundation.minimum_counts?.legal_profiles === 100, 'foundation legal profile minimum must be 100');
check(foundation.minimum_counts?.stable_asset_relationships === 4, 'foundation relationship minimum must be 4');
check(foundation.minimum_counts?.reserve_components === 133, 'foundation reserve component minimum must be 133');
check(incomeManifest.minimum_count === 100, 'income profile minimum must be 100');
check(deploymentView.minimum_count === 140, 'deployment view minimum must be 140');
check(migrationAudit.coverage?.protected_stablecoins === 100, 'migration audit protected stablecoin coverage must be 100');
check(migrationAudit.minimum_counts?.legal_profiles === 100, 'migration audit legal profile minimum must be 100');
check(migrationAudit.minimum_counts?.reserve_components === 133, 'migration audit reserve component minimum must be 133');
check(migrationAudit.minimum_counts?.deployments === 140, 'migration audit deployment minimum must be 140');
check(migrationAudit.minimum_counts?.income_profiles === 100, 'migration audit income profile minimum must be 100');

const registryV3Loader = readText(foundation.loader);
const incomeLoader = readText(incomeManifest.loader);
check(basenamesPresent(registryV3Loader, foundation.data_groups?.legal_profiles), 'Registry v3 loader is missing a legal profile manifest file');
check(basenamesPresent(registryV3Loader, foundation.data_groups?.stable_asset_relationships), 'Registry v3 loader is missing a stable-asset relationship manifest file');
check(basenamesPresent(registryV3Loader, foundation.data_groups?.reserve_components), 'Registry v3 loader is missing a reserve component manifest file');
check(basenamesPresent(incomeLoader, incomeManifest.data_files), 'Income profile loader is missing a manifest file');

const machineReadable = readText('src/lib/machine-readable.ts');
const versionBase = readText('src/lib/versionBase.ts');
const manifestBase = readText('src/lib/data/manifestBase.ts');
check(machineReadable.includes("DATA_SCHEMA_VERSION = 'sog_registry_v2'"), 'existing v2 machine-readable contract must remain additive during PR #310');
check(machineReadable.includes("schema_version: 'sog_registry_v3'"), 'Registry v3 additive summary schema marker is missing');
check(machineReadable.includes('export function getRegistryV3Summary()'), 'Registry v3 machine-readable summary getter is missing');
for (const getter of ['getLegalProfiles', 'getStableAssetRelationships', 'getReserveComponents', 'getIncomeProfilesV3']) {
  check(machineReadable.includes(getter), `machine-readable v3 summary missing ${getter}`);
}
for (const family of ['legal_profile', 'stable_asset_relationship', 'reserve_component', 'income_profile']) {
  check(manifestBase.includes(`'${family}'`), `public manifest missing ${family}`);
}
check(versionBase.includes('registry_v3: getRegistryV3Summary()'), 'version endpoint missing Registry v3 summary');
check(manifestBase.includes('registry_v3: getRegistryV3Summary()'), 'manifest endpoint missing Registry v3 summary');
check(manifestBase.includes('data_schema_version: DATA_SCHEMA_VERSION'), 'public manifest must expose base data_schema_version');

const privatePathPattern = /(?:candidate|monitoring|private|editorial-research)/i;
for (const file of [
  ...Object.values(foundation.data_groups ?? {}).flat(),
  ...(incomeManifest.data_files ?? [])
]) {
  check(!privatePathPattern.test(file), `canonical v3 manifest includes non-canonical path: ${file}`);
}

if (failures.length) {
  console.error('Registry v2/v3 machine-readable parity validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  mode: 'additive',
  base_data_schema_version: 'sog_registry_v2',
  registry_v3_schema_version: 'sog_registry_v3',
  stablecoins: stablecoins.length,
  legal_profiles: legalProfiles.length,
  stable_asset_relationships: assetRelationships.length,
  reserve_components: reserveComponents.length,
  income_profiles: incomeProfiles.length,
  deployments: deployments.length
}, null, 2));
