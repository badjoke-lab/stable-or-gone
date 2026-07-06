import fs from 'node:fs';
import path from 'node:path';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const root = process.cwd();
const failures = [];
const fail = (condition, message) => { if (!condition) failures.push(message); };
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const rows = (files = []) => files.flatMap((file) => {
  const value = readJson(file);
  if (!Array.isArray(value)) throw new Error(`${file}: expected JSON array`);
  return value;
});
const ids = (records, key = 'id') => new Set(records.map((row) => row[key]).filter(Boolean));

const audit = readJson('docs/migration/registry-v3-migration-audit.json');
const baseline = loadRegistryV2Baseline(root);
const foundation = readJson(audit.manifests.foundation);
const deploymentView = readJson(audit.manifests.deployments);
const incomeManifest = readJson(audit.manifests.income_profiles);

const protectedIds = ids(baseline.protected_stablecoins ?? []);
const legalProfiles = rows(foundation.data_groups.legal_profiles);
const relationships = rows(foundation.data_groups.stable_asset_relationships);
const reserveComponents = rows(foundation.data_groups.reserve_components);
const deployments = rows(baseline.data_groups[deploymentView.source_group]);
const incomeProfiles = rows(incomeManifest.data_files);

const legalIds = ids(legalProfiles);
const incomeIds = ids(incomeProfiles);
const reserveAssetIds = ids(reserveComponents, 'stablecoin_id');
const deploymentAssetIds = ids(deployments, 'stablecoin_id');

fail(protectedIds.size === audit.coverage.protected_stablecoins, `protected stablecoins: expected ${audit.coverage.protected_stablecoins}, found ${protectedIds.size}`);
fail(legalProfiles.length >= audit.minimum_counts.legal_profiles, `legal profiles: expected at least ${audit.minimum_counts.legal_profiles}, found ${legalProfiles.length}`);
fail(relationships.length >= audit.minimum_counts.stable_asset_relationships, `stable-asset relationships: expected at least ${audit.minimum_counts.stable_asset_relationships}, found ${relationships.length}`);
fail(reserveComponents.length >= audit.minimum_counts.reserve_components, `reserve components: expected at least ${audit.minimum_counts.reserve_components}, found ${reserveComponents.length}`);
fail(deployments.length >= audit.minimum_counts.deployments, `deployments: expected at least ${audit.minimum_counts.deployments}, found ${deployments.length}`);
fail(incomeProfiles.length >= audit.minimum_counts.income_profiles, `income profiles: expected at least ${audit.minimum_counts.income_profiles}, found ${incomeProfiles.length}`);

for (const id of protectedIds) {
  fail(legalIds.has(id), `legal profile missing for ${id}`);
  fail(incomeIds.has(id), `income profile missing for ${id}`);
  fail(reserveAssetIds.has(id), `reserve component coverage missing for ${id}`);
  fail(deploymentAssetIds.has(id), `deployment coverage missing for ${id}`);
}
for (const id of legalIds) fail(protectedIds.has(id), `orphan legal profile ${id}`);
for (const id of incomeIds) fail(protectedIds.has(id), `orphan income profile ${id}`);
for (const id of reserveAssetIds) fail(protectedIds.has(id), `orphan reserve component asset ${id}`);
for (const id of deploymentAssetIds) fail(protectedIds.has(id), `orphan deployment asset ${id}`);

const foundationLoader = readText(audit.loaders.foundation);
for (const file of [
  ...foundation.data_groups.legal_profiles,
  ...foundation.data_groups.stable_asset_relationships,
  ...foundation.data_groups.reserve_components,
]) {
  fail(foundationLoader.includes(path.posix.basename(file)), `${audit.loaders.foundation}: missing ${path.posix.basename(file)}`);
}
const incomeLoader = readText(audit.loaders.income_profiles);
for (const file of incomeManifest.data_files) {
  fail(incomeLoader.includes(path.posix.basename(file)), `${audit.loaders.income_profiles}: missing ${path.posix.basename(file)}`);
}

if (failures.length) {
  console.error('PR #310 Registry v3 migration validation failed:');
  failures.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  protected_assets: protectedIds.size,
  legal_profiles: legalProfiles.length,
  stable_asset_relationships: relationships.length,
  reserve_components: reserveComponents.length,
  deployments: deployments.length,
  income_profiles: incomeProfiles.length,
}, null, 2));
