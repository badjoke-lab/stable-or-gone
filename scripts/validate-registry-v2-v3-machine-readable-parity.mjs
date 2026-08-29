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
const parityBaseline = readJson('docs/migration/registry-v3-parity-baseline.json');

const stablecoins = rows(baseline.data_groups?.stablecoins);
const organizations = rows(baseline.data_groups?.organizations);
const relationships = rows(baseline.data_groups?.relationships);
const classifications = rows(baseline.data_groups?.classifications);
const profiles = rows(baseline.data_groups?.profiles);
const events = rows(baseline.data_groups?.events);
const eventDetails = rows(baseline.data_groups?.event_details);
const evidence = rows(baseline.data_groups?.evidence);
const evidenceRelations = rows(baseline.data_groups?.evidence_relations);
const reserveReports = rows(baseline.data_groups?.reserve_reports);
const knownUnknowns = rows(baseline.data_groups?.known_unknowns);
const regulatoryNotes = rows(baseline.data_groups?.regulatory_notes);
const deployments = rows(baseline.data_groups?.deployments);
const legalProfiles = rows(foundation.data_groups?.legal_profiles);
const assetRelationships = rows(foundation.data_groups?.stable_asset_relationships);
const reserveComponents = rows(foundation.data_groups?.reserve_components);
const incomeProfiles = rows(incomeManifest.data_files);

const stablecoinIds = uniqueIds(stablecoins);
const legalIds = uniqueIds(legalProfiles);
const incomeIds = uniqueIds(incomeProfiles);
const reserveAssetIds = new Set(reserveComponents.map((row) => row.stablecoin_id));
const deploymentAssetIds = new Set(deployments.map((row) => row.stablecoin_id));
const deploymentUnknownIds = new Set(
  knownUnknowns
    .filter((row) => /deployment|contract|token proxy|asset identity/i.test(`${row.topic ?? ''} ${row.description ?? ''}`))
    .map((row) => row.stablecoin_id)
    .filter(Boolean),
);

const v2Counts = {
  stablecoins: stablecoins.length,
  organizations: organizations.length,
  relationships: relationships.length,
  classifications: classifications.length,
  profiles: profiles.length,
  events: events.length,
  event_details: eventDetails.length,
  evidence: evidence.length,
  evidence_relations: evidenceRelations.length,
  reserve_reports: reserveReports.length,
  known_unknowns: knownUnknowns.length,
  regulatory_notes: regulatoryNotes.length,
  deployments: deployments.length,
};
const v3Counts = {
  legal_profiles: legalProfiles.length,
  stable_asset_relationships: assetRelationships.length,
  reserve_components: reserveComponents.length,
  income_profiles: incomeProfiles.length,
  deployment_view: deployments.length,
};
const v3Coverage = {
  legal_profiles: [...legalIds].filter((id) => stablecoinIds.has(id)).length,
  income_profiles: [...incomeIds].filter((id) => stablecoinIds.has(id)).length,
  reserve_component_assets: [...reserveAssetIds].filter((id) => stablecoinIds.has(id)).length,
  deployment_view_assets: [...deploymentAssetIds].filter((id) => stablecoinIds.has(id)).length,
};

check(parityBaseline.status === 'current', 'Registry v3 parity baseline must be current');
for (const [name, expected] of Object.entries(parityBaseline.expected_v2_counts ?? {})) {
  check(v2Counts[name] === expected, `v2 ${name} count must be ${expected}, found ${v2Counts[name]}`);
}
for (const [name, expected] of Object.entries(parityBaseline.expected_v3_counts ?? {})) {
  check(v3Counts[name] === expected, `v3 ${name} count must be ${expected}, found ${v3Counts[name]}`);
}
for (const [name, expected] of Object.entries(parityBaseline.expected_v3_coverage ?? {})) {
  check(v3Coverage[name] === expected, `v3 ${name} coverage must be ${expected}, found ${v3Coverage[name]}`);
}

check(stablecoinIds.size === stablecoins.length, `v2 canonical stablecoin IDs must be unique, found ${stablecoinIds.size} unique of ${stablecoins.length}`);
check(legalIds.size === legalProfiles.length, `v3 legal profile IDs must be unique, found ${legalIds.size} unique of ${legalProfiles.length}`);
check(incomeIds.size === incomeProfiles.length, `v3 income profile IDs must be unique, found ${incomeIds.size} unique of ${incomeProfiles.length}`);

for (const id of stablecoinIds) {
  check(legalIds.has(id), `legal profile missing for ${id}`);
  check(incomeIds.has(id), `income profile missing for ${id}`);
  check(reserveAssetIds.has(id), `reserve component coverage missing for ${id}`);
  check(
    deploymentAssetIds.has(id) || deploymentUnknownIds.has(id),
    `deployment view or explicit deployment-unknown coverage missing for ${id}`,
  );
}
for (const id of legalIds) check(stablecoinIds.has(id), `orphan legal profile ${id}`);
for (const id of incomeIds) check(stablecoinIds.has(id), `orphan income profile ${id}`);
for (const id of reserveAssetIds) check(stablecoinIds.has(id), `orphan reserve component asset ${id}`);
for (const id of deploymentAssetIds) check(stablecoinIds.has(id), `orphan deployment asset ${id}`);
for (const id of deploymentUnknownIds) check(stablecoinIds.has(id), `orphan deployment unknown asset ${id}`);

check(foundation.minimum_counts?.legal_profiles === parityBaseline.expected_v3_counts?.legal_profiles, 'foundation legal profile minimum does not match current parity baseline');
check(foundation.minimum_counts?.stable_asset_relationships === parityBaseline.expected_v3_counts?.stable_asset_relationships, 'foundation relationship minimum does not match current parity baseline');
check(foundation.minimum_counts?.reserve_components === parityBaseline.expected_v3_counts?.reserve_components, 'foundation reserve component minimum does not match current parity baseline');
check(incomeManifest.minimum_count === parityBaseline.expected_v3_counts?.income_profiles, 'income profile minimum does not match current parity baseline');
check(deploymentView.minimum_count === parityBaseline.expected_v3_counts?.deployment_view, 'deployment view minimum does not match current parity baseline');
check(migrationAudit.coverage?.protected_stablecoins === parityBaseline.expected_v2_counts?.stablecoins, 'migration audit protected stablecoin coverage does not match parity baseline');
check(migrationAudit.minimum_counts?.legal_profiles === parityBaseline.expected_v3_counts?.legal_profiles, 'migration audit legal profile minimum mismatch');
check(migrationAudit.minimum_counts?.reserve_components === parityBaseline.expected_v3_counts?.reserve_components, 'migration audit reserve component minimum mismatch');
check(migrationAudit.minimum_counts?.deployments === parityBaseline.expected_v3_counts?.deployment_view, 'migration audit deployment minimum mismatch');
check(migrationAudit.minimum_counts?.income_profiles === parityBaseline.expected_v3_counts?.income_profiles, 'migration audit income profile minimum mismatch');

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
check(parityBaseline.machine_readable_contract?.compatibility_mode === 'v2_public_contract_with_additive_v3_summary', 'parity baseline machine-readable compatibility mode mismatch');

const privatePathPattern = /(?:candidate|monitoring|private|editorial-research)/i;
for (const file of [
  ...Object.values(foundation.data_groups ?? {}).flat(),
  ...(incomeManifest.data_files ?? [])
]) {
  check(!privatePathPattern.test(file), `canonical v3 manifest includes non-canonical path: ${file}`);
}

const report = {
  schema_version: '1.0',
  audit_id: 'sog_registry_v2_v3_machine_readable_parity_pr310',
  audit_date: '2026-07-06',
  parity_baseline_id: parityBaseline.baseline_id,
  mode: 'additive',
  base_data_schema_version: 'sog_registry_v2',
  registry_v3_schema_version: 'sog_registry_v3',
  counts: { v2: v2Counts, v3: v3Counts },
  coverage: v3Coverage,
  deployment_unknown_assets: [...deploymentUnknownIds].filter((id) => stablecoinIds.has(id)).sort(),
  failures,
  ok: failures.length === 0,
};
fs.mkdirSync(path.join(root, 'data/generated'), { recursive: true });
fs.writeFileSync(path.join(root, 'data/generated/registry-v2-v3-machine-readable-parity-audit.json'), `${JSON.stringify(report, null, 2)}\n`);

if (failures.length) {
  console.error('Registry v2/v3 machine-readable parity validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(JSON.stringify(report, null, 2));
