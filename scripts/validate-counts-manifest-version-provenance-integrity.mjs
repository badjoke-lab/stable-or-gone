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
  if (Array.isArray(value)) return value;
  if (Array.isArray(value.records)) return value.records;
  throw new Error(`${file}: expected JSON array or { records: [] }`);
});
const countGroups = (manifest, groups) => Object.fromEntries(
  groups.map((name) => [name, rows(manifest.data_groups?.[name] ?? []).length])
);

const releaseBaseline = readJson('docs/migration/registry-release-integrity-baseline.json');
const parityBaseline = readJson('docs/migration/registry-v3-parity-baseline.json');
const v2 = loadRegistryV2Baseline(root);
const foundation = readJson('docs/migration/registry-v3-foundation.json');
const incomeManifest = readJson('docs/migration/registry-v3-income-profiles.json');
const provenanceTemplate = readJson('data/generated/build-provenance.json');

const machineReadable = readText('src/lib/machine-readable.ts');
const versionBase = readText('src/lib/versionBase.ts');
const manifestBase = readText('src/lib/data/manifestBase.ts');
const provenanceGenerator = readText('scripts/generate-current-provenance.mjs');

const v2GroupNames = [
  'stablecoins',
  'organizations',
  'relationships',
  'classifications',
  'profiles',
  'events',
  'event_details',
  'evidence',
  'evidence_relations',
  'reserve_reports',
  'known_unknowns',
  'regulatory_notes',
  'deployments',
];
const actualV2 = countGroups(v2, v2GroupNames);
const actualV3 = {
  legal_profiles: rows(foundation.data_groups?.legal_profiles ?? []).length,
  stable_asset_relationships: rows(foundation.data_groups?.stable_asset_relationships ?? []).length,
  reserve_components: rows(foundation.data_groups?.reserve_components ?? []).length,
  income_profiles: rows(incomeManifest.data_files ?? []).length,
  deployment_view: actualV2.deployments,
};

check(releaseBaseline.status === 'current', 'release-integrity baseline must be current');
check(releaseBaseline.registry_parity_baseline === 'docs/migration/registry-v3-parity-baseline.json', 'release-integrity baseline must point to current parity baseline');

for (const [name, expected] of Object.entries(releaseBaseline.expected_v2_counts ?? {})) {
  check(actualV2[name] === expected, `release v2 ${name} count must be ${expected}, found ${actualV2[name]}`);
  check(parityBaseline.expected_v2_counts?.[name] === expected, `release/parity v2 ${name} baseline mismatch`);
}
for (const [name, expected] of Object.entries(releaseBaseline.expected_v3_counts ?? {})) {
  check(actualV3[name] === expected, `release v3 ${name} count must be ${expected}, found ${actualV3[name]}`);
  check(parityBaseline.expected_v3_counts?.[name] === expected, `release/parity v3 ${name} baseline mismatch`);
}

const expectedPublicCounts = releaseBaseline.expected_public_record_counts ?? {};
check(expectedPublicCounts.primary_records === actualV2.stablecoins, 'public primary record count must equal canonical stablecoin count');
check(expectedPublicCounts.events === actualV2.events, 'public event count must equal canonical event count');
check(expectedPublicCounts.evidence === actualV2.evidence, 'public evidence count must equal canonical evidence count');

for (const [name, expected] of Object.entries(releaseBaseline.expected_public_breakdown_counts ?? {})) {
  check(actualV2[name] === expected, `public breakdown ${name} must equal canonical count ${expected}, found ${actualV2[name]}`);
}

const expectedRoutes = releaseBaseline.expected_route_counts ?? {};
check(expectedRoutes.stablecoin_detail === actualV2.stablecoins, 'stablecoin detail route count must equal stablecoin count');
check(expectedRoutes.organization_detail === actualV2.organizations, 'organization detail route count must equal organization count');
check(expectedRoutes.event_detail === actualV2.events, 'event detail route count must equal event count');
check(expectedRoutes.total_detail === actualV2.stablecoins + actualV2.organizations + actualV2.events, 'total detail route count arithmetic mismatch');

const machineContract = releaseBaseline.machine_readable_contract ?? {};
check(machineReadable.includes(`MACHINE_READABLE_SCHEMA_VERSION = '${machineContract.schema_version}'`), 'machine-readable schema version marker mismatch');
check(machineReadable.includes(`DATA_SCHEMA_VERSION = '${machineContract.data_schema_version}'`), 'data schema version marker mismatch');
for (const getter of ['getBuildMetadata', 'getRecordCounts', 'getRecordCountBreakdown', 'getRegistryV3Summary']) {
  check(machineReadable.includes(`export function ${getter}(`), `machine-readable shared getter missing: ${getter}`);
}
for (const source of [versionBase, manifestBase]) {
  check(source.includes('getBuildMetadata'), 'version/manifest source must use getBuildMetadata');
  check(source.includes('getRecordCounts'), 'version/manifest source must use getRecordCounts');
  check(source.includes('getRecordCountBreakdown'), 'version/manifest source must use getRecordCountBreakdown');
  check(source.includes('getRegistryV3Summary'), 'version/manifest source must use getRegistryV3Summary');
}
check(versionBase.includes('record_counts: getRecordCounts()'), 'version endpoint must expose shared record counts');
check(versionBase.includes('record_count_breakdown: getRecordCountBreakdown()'), 'version endpoint must expose shared count breakdown');
check(versionBase.includes('registry_v3: getRegistryV3Summary()'), 'version endpoint must expose additive Registry v3 summary');
check(manifestBase.includes('record_counts: getRecordCounts()'), 'manifest endpoint must expose shared record counts');
check(manifestBase.includes('record_count_breakdown: getRecordCountBreakdown()'), 'manifest endpoint must expose shared count breakdown');
check(manifestBase.includes('registry_v3: getRegistryV3Summary()'), 'manifest endpoint must expose additive Registry v3 summary');
check(manifestBase.includes('generated_at: build.generated_at'), 'manifest generated_at must derive from build provenance');
check(versionBase.includes('generated_at: build.generated_at'), 'version data generated_at must derive from build provenance');

for (const marker of [
  'canonical_only: true',
  'includes_unreviewed_candidates: false',
  'includes_internal_monitoring: false',
  'includes_private_notes: false',
]) {
  check(machineReadable.includes(marker), `machine-readable data safety marker missing: ${marker}`);
}

const provenanceContract = releaseBaseline.provenance_contract ?? {};
check(provenanceTemplate.schema_version === provenanceContract.schema_version, 'provenance template schema mismatch');
check(provenanceTemplate.verification_marker === provenanceContract.verification_marker, 'provenance template verification marker mismatch');
check(provenanceTemplate.source_commit === provenanceContract.source_template_commit, 'provenance source template commit must remain explicit sentinel');
check(provenanceTemplate.source_branch === provenanceContract.source_template_branch, 'provenance source template branch mismatch');
check(provenanceTemplate.generated_at === provenanceContract.source_template_generated_at, 'provenance source template timestamp mismatch');
check(provenanceTemplate.canonical_data_hash === provenanceContract.source_template_hash, 'provenance source template hash mismatch');
check(provenanceTemplate.canonical_file_count === provenanceContract.source_template_file_count, 'provenance source template file count mismatch');

for (const [name, expected] of Object.entries(releaseBaseline.expected_v2_counts ?? {})) {
  check(provenanceTemplate.canonical_record_counts?.[name] === expected, `provenance template v2 count mismatch for ${name}`);
}
for (const name of ['legal_profiles', 'stable_asset_relationships', 'reserve_components', 'income_profiles']) {
  const expected = releaseBaseline.expected_v3_counts?.[name];
  check(provenanceTemplate.canonical_record_counts?.[name] === expected, `provenance template v3 count mismatch for ${name}`);
}
for (const [name, expected] of Object.entries(expectedRoutes)) {
  check(provenanceTemplate.route_counts?.[name] === expected, `provenance template route count mismatch for ${name}`);
}

for (const requiredText of [
  "loadRegistryV2Baseline",
  "registry-v3-foundation.json",
  "registry-v3-income-profiles.json",
  "createHash('sha256')",
  "canonical_data_hash",
  "source_commit",
  "canonical_record_counts",
  "route_counts",
]) {
  check(provenanceGenerator.includes(requiredText), `provenance generator contract marker missing: ${requiredText}`);
}
check(provenanceGenerator.includes("process.env.SOG_BUILD_COMMIT"), 'provenance generator must accept explicit build commit');
check(provenanceGenerator.includes("process.env.SOG_BUILD_BRANCH"), 'provenance generator must accept explicit build branch');
check(provenanceGenerator.includes("process.env.SOG_BUILD_TIMESTAMP"), 'provenance generator must accept explicit build timestamp');

const report = {
  schema_version: '1.0',
  audit_id: 'sog_counts_manifest_version_provenance_integrity_pr316',
  audit_date: '2026-07-06',
  baseline_id: releaseBaseline.baseline_id,
  counts: {
    v2: actualV2,
    v3: actualV3,
    public: expectedPublicCounts,
  },
  route_counts: expectedRoutes,
  provenance_template_mode: provenanceContract.source_template_mode,
  failures,
  ok: failures.length === 0,
};

fs.mkdirSync(path.join(root, 'data/generated'), { recursive: true });
fs.writeFileSync(
  path.join(root, 'data/generated/counts-manifest-version-provenance-integrity-audit.json'),
  `${JSON.stringify(report, null, 2)}\n`,
);

if (failures.length) {
  console.error('Counts, manifest, version, and provenance integrity validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(JSON.stringify(report, null, 2));
