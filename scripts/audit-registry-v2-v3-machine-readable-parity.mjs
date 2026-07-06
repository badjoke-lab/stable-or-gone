import fs from 'node:fs';
import path from 'node:path';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const root = process.cwd();
const absolute = (file) => path.join(root, file);
const readText = (file) => fs.readFileSync(absolute(file), 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const readRows = (file) => {
  const value = readJson(file);
  if (Array.isArray(value)) return value;
  if (Array.isArray(value.records)) return value.records;
  throw new Error(`${file}: expected array or records array`);
};
const loadFiles = (files = []) => files.flatMap(readRows);
const unique = (values) => [...new Set(values.filter(Boolean))].sort();
const sameSet = (a, b) => a.length === b.length && a.every((value, index) => value === b[index]);
const basename = (file) => path.basename(file);
const idSet = (rows) => new Set(rows.map((row) => row.id));
const duplicateIds = (rows) => {
  const seen = new Set();
  const duplicates = new Set();
  for (const row of rows) {
    if (seen.has(row.id)) duplicates.add(row.id);
    seen.add(row.id);
  }
  return [...duplicates].sort();
};

const v2 = loadRegistryV2Baseline(root);
const foundation = readJson('docs/migration/registry-v3-foundation.json');
const incomeManifest = readJson('docs/migration/registry-v3-income-profiles.json');
const parityBaseline = readJson('docs/migration/registry-v3-parity-baseline.json');
const historicalBaseline = readJson('docs/migration/registry-v3-baseline.json');

const v2Groups = Object.fromEntries(
  Object.entries(v2.data_groups ?? {}).map(([group, files]) => [group, loadFiles(files)])
);
const stablecoins = v2Groups.stablecoins ?? [];
const organizations = v2Groups.organizations ?? [];
const evidence = v2Groups.evidence ?? [];
const reserveReports = v2Groups.reserve_reports ?? [];
const deployments = v2Groups.deployments ?? [];
const stablecoinIds = idSet(stablecoins);
const organizationIds = idSet(organizations);
const evidenceIds = idSet(evidence);
const reserveReportIds = idSet(reserveReports);

const legalProfiles = loadFiles(foundation.data_groups?.legal_profiles ?? []);
const assetRelationships = loadFiles(foundation.data_groups?.stable_asset_relationships ?? []);
const reserveComponents = loadFiles(foundation.data_groups?.reserve_components ?? []);
const incomeProfiles = loadFiles(incomeManifest.data_files ?? []);

const requiredV2Groups = [
  'stablecoins', 'organizations', 'relationships', 'classifications', 'profiles', 'events',
  'event_details', 'evidence', 'evidence_relations', 'reserve_reports', 'known_unknowns',
  'regulatory_notes', 'deployments'
];
const v2Counts = Object.fromEntries(requiredV2Groups.map((group) => [group, (v2Groups[group] ?? []).length]));
const v3Counts = {
  legal_profiles: legalProfiles.length,
  stable_asset_relationships: assetRelationships.length,
  reserve_components: reserveComponents.length,
  income_profiles: incomeProfiles.length,
  deployment_view: deployments.length
};
const v3Coverage = {
  legal_profiles: unique(legalProfiles.map((row) => row.id)).filter((id) => stablecoinIds.has(id)).length,
  income_profiles: unique(incomeProfiles.map((row) => row.id)).filter((id) => stablecoinIds.has(id)).length,
  deployment_view_assets: unique(deployments.map((row) => row.stablecoin_id)).filter((id) => stablecoinIds.has(id)).length
};

const critical = [];
const warnings = [];
const observations = [];

for (const [group, expected] of Object.entries(parityBaseline.expected_v2_counts ?? {})) {
  const actual = v2Counts[group];
  if (actual !== expected) critical.push(`V2 count mismatch ${group}: expected ${expected}, found ${actual}`);
}
for (const [group, expected] of Object.entries(parityBaseline.expected_v3_counts ?? {})) {
  const actual = v3Counts[group];
  if (actual !== expected) critical.push(`V3 count mismatch ${group}: expected ${expected}, found ${actual}`);
}
for (const [group, expected] of Object.entries(parityBaseline.expected_v3_coverage ?? {})) {
  const actual = v3Coverage[group];
  if (actual !== expected) critical.push(`V3 coverage mismatch ${group}: expected ${expected}, found ${actual}`);
}

for (const [group, rows] of Object.entries(v2Groups)) {
  const duplicates = duplicateIds(rows);
  if (duplicates.length) critical.push(`V2 ${group} duplicate IDs: ${duplicates.join(', ')}`);
}
for (const [group, rows] of Object.entries({ legal_profiles: legalProfiles, stable_asset_relationships: assetRelationships, reserve_components: reserveComponents, income_profiles: incomeProfiles })) {
  const duplicates = duplicateIds(rows);
  if (duplicates.length) critical.push(`V3 ${group} duplicate IDs: ${duplicates.join(', ')}`);
}

const missingLegal = stablecoins.map((row) => row.id).filter((id) => !legalProfiles.some((row) => row.id === id)).sort();
const extraLegal = legalProfiles.map((row) => row.id).filter((id) => !stablecoinIds.has(id)).sort();
const missingIncome = stablecoins.map((row) => row.id).filter((id) => !incomeProfiles.some((row) => row.id === id)).sort();
const extraIncome = incomeProfiles.map((row) => row.id).filter((id) => !stablecoinIds.has(id)).sort();
if (missingLegal.length) critical.push(`Missing legal profiles: ${missingLegal.join(', ')}`);
if (extraLegal.length) critical.push(`Legal profiles for non-canonical assets: ${extraLegal.join(', ')}`);
if (missingIncome.length) critical.push(`Missing income profiles: ${missingIncome.join(', ')}`);
if (extraIncome.length) critical.push(`Income profiles for non-canonical assets: ${extraIncome.join(', ')}`);

const relationshipReferenceErrors = [];
for (const row of assetRelationships) {
  if (!stablecoinIds.has(row.from_asset_id)) relationshipReferenceErrors.push(`${row.id}: missing from_asset_id ${row.from_asset_id}`);
  if (!stablecoinIds.has(row.to_asset_id)) relationshipReferenceErrors.push(`${row.id}: missing to_asset_id ${row.to_asset_id}`);
  for (const evidenceId of row.evidence_ids ?? []) if (!evidenceIds.has(evidenceId)) relationshipReferenceErrors.push(`${row.id}: missing evidence ${evidenceId}`);
}
if (relationshipReferenceErrors.length) critical.push(...relationshipReferenceErrors);

const reserveReferenceErrors = [];
for (const row of reserveComponents) {
  if (!stablecoinIds.has(row.stablecoin_id)) reserveReferenceErrors.push(`${row.id}: missing stablecoin ${row.stablecoin_id}`);
  if (row.reserve_report_id && !reserveReportIds.has(row.reserve_report_id)) reserveReferenceErrors.push(`${row.id}: missing reserve report ${row.reserve_report_id}`);
  if (row.custodian_organization_id && !organizationIds.has(row.custodian_organization_id)) reserveReferenceErrors.push(`${row.id}: missing custodian ${row.custodian_organization_id}`);
  for (const evidenceId of row.evidence_ids ?? []) if (!evidenceIds.has(evidenceId)) reserveReferenceErrors.push(`${row.id}: missing evidence ${evidenceId}`);
}
if (reserveReferenceErrors.length) critical.push(...reserveReferenceErrors);

const legalReferenceErrors = [];
for (const row of legalProfiles) {
  for (const orgId of row.claim_against_organization_ids ?? []) if (!organizationIds.has(orgId)) legalReferenceErrors.push(`${row.id}: missing claim organization ${orgId}`);
  for (const evidenceId of row.evidence_ids ?? []) if (!evidenceIds.has(evidenceId)) legalReferenceErrors.push(`${row.id}: missing evidence ${evidenceId}`);
  for (const entry of row.classifications ?? []) for (const evidenceId of entry.evidence_ids ?? []) if (!evidenceIds.has(evidenceId)) legalReferenceErrors.push(`${row.id}: classification missing evidence ${evidenceId}`);
}
if (legalReferenceErrors.length) critical.push(...legalReferenceErrors);

const incomeReferenceErrors = [];
for (const row of incomeProfiles) {
  for (const relatedId of row.related_asset_ids ?? []) if (!stablecoinIds.has(relatedId)) incomeReferenceErrors.push(`${row.id}: missing related asset ${relatedId}`);
  for (const evidenceId of row.evidence_ids ?? []) if (!evidenceIds.has(evidenceId)) incomeReferenceErrors.push(`${row.id}: missing evidence ${evidenceId}`);
}
if (incomeReferenceErrors.length) critical.push(...incomeReferenceErrors);

const v2LoaderTexts = [
  'src/lib/data/registryBase.ts',
  'src/lib/data/registry.ts',
  'src/lib/data/currentProfiles.ts',
  'src/lib/data/stablecoinProfiles.ts'
].map(readText).join('\n');
const v2LoaderMissingFiles = [];
for (const group of requiredV2Groups) {
  for (const file of v2.data_groups?.[group] ?? []) {
    if (!v2LoaderTexts.includes(basename(file))) v2LoaderMissingFiles.push({ group, file });
  }
}
if (v2LoaderMissingFiles.length) critical.push(`V2 baseline files missing from runtime loader inventory: ${v2LoaderMissingFiles.map((row) => `${row.group}:${row.file}`).join(', ')}`);

const extractDataImports = (text) => unique([...text.matchAll(/\.\.\/\.\.\/\.\.\/data\/([^'\"]+\.json)/g)].map((match) => match[1]));
const v3LoaderText = readText('src/lib/data/registryV3.ts');
const v3LoaderImports = extractDataImports(v3LoaderText);
const v3ManifestFiles = unique([
  ...(foundation.data_groups?.legal_profiles ?? []),
  ...(foundation.data_groups?.stable_asset_relationships ?? []),
  ...(foundation.data_groups?.reserve_components ?? [])
].map(basename));
const missingInV3Loader = v3ManifestFiles.filter((file) => !v3LoaderImports.includes(file));
const extraInV3Loader = v3LoaderImports.filter((file) => !v3ManifestFiles.includes(file));
if (missingInV3Loader.length) critical.push(`V3 manifest files missing from registryV3 loader: ${missingInV3Loader.join(', ')}`);
if (extraInV3Loader.length) critical.push(`V3 loader files missing from foundation manifest: ${extraInV3Loader.join(', ')}`);

const incomeLoaderText = readText('src/lib/data/incomeProfilesV3.ts');
const incomeLoaderImports = extractDataImports(incomeLoaderText);
const incomeManifestFiles = unique((incomeManifest.data_files ?? []).map(basename));
const missingInIncomeLoader = incomeManifestFiles.filter((file) => !incomeLoaderImports.includes(file));
const extraInIncomeLoader = incomeLoaderImports.filter((file) => !incomeManifestFiles.includes(file));
if (missingInIncomeLoader.length) critical.push(`Income manifest files missing from loader: ${missingInIncomeLoader.join(', ')}`);
if (extraInIncomeLoader.length) critical.push(`Income loader files missing from manifest: ${extraInIncomeLoader.join(', ')}`);

if (historicalBaseline.status !== 'historical') critical.push('Legacy 92-asset Registry v3 baseline is not marked historical');
if (historicalBaseline.superseded_by !== 'docs/migration/registry-v3-parity-baseline.json') critical.push('Legacy Registry v3 baseline does not point to current parity baseline');
if (historicalBaseline.expected_counts?.stablecoins !== 92) warnings.push('Historical Registry v3 baseline no longer preserves its 92-asset checkpoint');
if (parityBaseline.status !== 'current') critical.push('Current Registry v3 parity baseline is not marked current');
if (parityBaseline.expected_v2_counts?.stablecoins !== 100) critical.push('Current parity baseline does not target 100 canonical assets');

const machineReadableText = readText('src/lib/machine-readable.ts');
const manifestText = readText('src/lib/data/manifestBase.ts');
const versionText = readText('src/lib/versionBase.ts');
const verifyPublicText = readText('scripts/verify-public-layer.mjs');
const machineChecks = {
  schema_version: machineReadableText.includes("MACHINE_READABLE_SCHEMA_VERSION = '1.0.0'"),
  data_schema_version: machineReadableText.includes("DATA_SCHEMA_VERSION = 'sog_registry_v2'"),
  record_counts_runtime: machineReadableText.includes('primary_records: getStablecoins().length') && machineReadableText.includes('events: getEvents().length') && machineReadableText.includes('evidence: getEvidence().length'),
  version_uses_runtime_counts: versionText.includes('getRecordCounts()') && versionText.includes('getRecordCountBreakdown()'),
  manifest_uses_runtime_counts: manifestText.includes('getRecordCounts()') && manifestText.includes('getRecordCountBreakdown()'),
  public_verifier_uses_composed_baseline: verifyPublicText.includes('loadRegistryV2Baseline(root)'),
  safety_canonical_only: machineReadableText.includes('canonical_only: true'),
  safety_candidates_excluded: machineReadableText.includes('includes_unreviewed_candidates: false'),
  safety_monitoring_excluded: machineReadableText.includes('includes_internal_monitoring: false'),
  safety_private_notes_excluded: machineReadableText.includes('includes_private_notes: false')
};
for (const [key, ok] of Object.entries(machineChecks)) if (!ok) critical.push(`Machine-readable parity contract check failed: ${key}`);

const supportingRecordsMatch = manifestText.match(/supporting_records:\s*\[([\s\S]*?)\]/)?.[1] ?? '';
const declaredV3Groups = ['legal_profile', 'stable_asset_relationship', 'reserve_component', 'income_profile'].filter((name) => supportingRecordsMatch.includes(`'${name}'`));
const publicDeclarationDecision = parityBaseline.machine_readable_contract?.v3_public_record_group_declaration;
if (declaredV3Groups.length === 0 && publicDeclarationDecision !== 'intentional_compatibility_boundary') {
  critical.push('V3 groups are omitted from public data-model declaration without an explicit compatibility-boundary decision');
}
if (declaredV3Groups.length > 0 && publicDeclarationDecision === 'intentional_compatibility_boundary') {
  warnings.push(`Public manifest already declares V3 groups despite compatibility-boundary decision: ${declaredV3Groups.join(', ')}`);
}

observations.push(`Current V2 composed baseline has ${stablecoins.length} assets and ${deployments.length} deployments.`);
observations.push(`V3 coverage: ${legalProfiles.length} legal profiles, ${incomeProfiles.length} income profiles, ${reserveComponents.length} reserve components, ${assetRelationships.length} stable-asset relationships.`);
observations.push(`Legacy 92-asset V3 baseline is retained as historical and superseded by ${parityBaseline.baseline_id}.`);
observations.push(`Public machine-readable V3 group omission decision: ${publicDeclarationDecision}.`);

const report = {
  schema_version: '1.0',
  audit_id: 'sog_registry_v2_v3_machine_readable_parity_pr310',
  audit_date: '2026-07-06',
  v2_baseline_id: v2.baseline_id,
  v3_parity_baseline_id: parityBaseline.baseline_id,
  counts: { v2: v2Counts, v3: v3Counts },
  coverage: {
    v3: v3Coverage,
    missing_legal_profile_ids: missingLegal,
    extra_legal_profile_ids: extraLegal,
    missing_income_profile_ids: missingIncome,
    extra_income_profile_ids: extraIncome
  },
  reference_integrity: {
    legal_profile_errors: legalReferenceErrors,
    stable_asset_relationship_errors: relationshipReferenceErrors,
    reserve_component_errors: reserveReferenceErrors,
    income_profile_errors: incomeReferenceErrors
  },
  loader_manifest_parity: {
    v2_loader_missing_files: v2LoaderMissingFiles,
    v3_foundation_missing_in_loader: missingInV3Loader,
    v3_foundation_extra_in_loader: extraInV3Loader,
    income_missing_in_loader: missingInIncomeLoader,
    income_extra_in_loader: extraInIncomeLoader
  },
  baseline_freshness: {
    historical_baseline_id: historicalBaseline.baseline_id,
    historical_status: historicalBaseline.status,
    historical_stablecoin_count: historicalBaseline.expected_counts?.stablecoins,
    superseded_by: historicalBaseline.superseded_by,
    current_parity_status: parityBaseline.status,
    current_parity_stablecoin_count: parityBaseline.expected_v2_counts?.stablecoins
  },
  machine_readable: {
    checks: machineChecks,
    public_v3_declared_groups: declaredV3Groups,
    v3_public_record_group_declaration: publicDeclarationDecision,
    compatibility_mode: parityBaseline.machine_readable_contract?.compatibility_mode,
    data_safety: parityBaseline.machine_readable_contract?.data_safety
  },
  findings: { critical, warnings, observations },
  result: critical.length === 0 ? 'pass' : 'fail'
};

fs.mkdirSync(absolute('data/generated'), { recursive: true });
fs.writeFileSync(absolute('data/generated/registry-v2-v3-machine-readable-parity-audit.json'), `${JSON.stringify(report, null, 2)}\n`);

console.log(JSON.stringify({
  audit_id: report.audit_id,
  result: report.result,
  v2_stablecoins: v2Counts.stablecoins,
  v2_events: v2Counts.events,
  v2_evidence: v2Counts.evidence,
  v2_deployments: v2Counts.deployments,
  v3_legal_profiles: v3Counts.legal_profiles,
  v3_income_profiles: v3Counts.income_profiles,
  v3_reserve_components: v3Counts.reserve_components,
  v3_asset_relationships: v3Counts.stable_asset_relationships,
  critical_findings: critical.length,
  warnings: warnings.length
}, null, 2));

if (critical.length) {
  console.error('Critical parity findings:');
  critical.forEach((item) => console.error(`- ${item}`));
  process.exitCode = 1;
}
