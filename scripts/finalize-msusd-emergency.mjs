import fs from 'node:fs';

const read = (file) => fs.readFileSync(file, 'utf8');
const write = (file, text) => fs.writeFileSync(file, text);
const writeJson = (file, value) => write(file, `${JSON.stringify(value, null, 2)}\n`);

function insertAfter(file, needle, addition) {
  let text = read(file);
  if (text.includes(addition.trim())) return;
  if (!text.includes(needle)) throw new Error(`Missing insertion anchor in ${file}: ${needle}`);
  text = text.replace(needle, `${needle}\n${addition}`);
  write(file, text);
}

function replaceOnce(file, needle, replacement) {
  let text = read(file);
  if (text.includes(replacement)) return;
  if (!text.includes(needle)) throw new Error(`Missing replacement anchor in ${file}: ${needle}`);
  text = text.replace(needle, replacement);
  write(file, text);
}

const registry = 'src/lib/data/registry.ts';
insertAfter(registry, "import stablecoinsBatchMData from '../../../data/stablecoins-batch-m.json';", "import stablecoinsBatchNData from '../../../data/stablecoins-batch-n.json';");
insertAfter(registry, "import stablecoinClassificationBatchMData from '../../../data/stablecoin-classification-batch-m.json';", "import stablecoinClassificationBatchNData from '../../../data/stablecoin-classification-batch-n.json';");
insertAfter(registry, "import organizationsBatchMData from '../../../data/organizations-batch-m.json';", "import organizationsBatchNData from '../../../data/organizations-batch-n.json';");
insertAfter(registry, "import relationshipsBatchMData from '../../../data/relationships-batch-m.json';", "import relationshipsBatchNData from '../../../data/relationships-batch-n.json';");
insertAfter(registry, "import eventsBatchMData from '../../../data/events-batch-m.json';", "import eventsBatchNData from '../../../data/events-batch-n.json';");
insertAfter(registry, "import eventDetailsBatchMData from '../../../data/event-details-batch-m.json';", "import eventDetailsBatchNData from '../../../data/event-details-batch-n.json';");
insertAfter(registry, "import evidenceBatchMData from '../../../data/evidence-batch-m.json';", "import evidenceBatchNData from '../../../data/evidence-batch-n.json';");
insertAfter(registry, "import reserveReportsBatchMBData from '../../../data/reserve-reports-batch-m-b.json';", "import reserveReportsBatchNData from '../../../data/reserve-reports-batch-n.json';");
insertAfter(registry, "import knownUnknownsBatchMData from '../../../data/known-unknowns-batch-m.json';", "import knownUnknownsBatchNData from '../../../data/known-unknowns-batch-n.json';");
insertAfter(registry, "import deploymentsBatchMData from '../../../data/deployments-batch-m.json';", "import deploymentsBatchNData from '../../../data/deployments-batch-n.json';");

for (const [oldText, newText] of [
  ['stablecoins-batch-m.json\n', 'stablecoins-batch-m.json stablecoins-batch-n.json\n'],
  ['organizations-batch-m.json\n', 'organizations-batch-m.json organizations-batch-n.json\n'],
  ['relationships-batch-m.json\n', 'relationships-batch-m.json relationships-batch-n.json\n'],
  ['stablecoin-classification-extension-batch-a.json\n', 'stablecoin-classification-extension-batch-a.json stablecoin-classification-batch-n.json\n'],
  ['stablecoin-profiles-batch-m.json\n', 'stablecoin-profiles-batch-m.json stablecoin-profiles-batch-n.json\n'],
  ['events-issuer-control-2026.json\n', 'events-issuer-control-2026.json events-batch-n.json\n'],
  ['event-details-issuer-control-2026.json\n', 'event-details-issuer-control-2026.json event-details-batch-n.json\n'],
  ['evidence-issuer-control-2026.json\n', 'evidence-issuer-control-2026.json evidence-batch-n.json\n'],
  ['reserve-reports-batch-m-b.json\n', 'reserve-reports-batch-m-b.json reserve-reports-batch-n.json\n'],
  ['known-unknowns-issuer-control-2026.json\n', 'known-unknowns-issuer-control-2026.json known-unknowns-batch-n.json\n'],
  ['deployments-issuer-control-2026.json\n', 'deployments-issuer-control-2026.json deployments-batch-n.json\n']
]) replaceOnce(registry, oldText, newText);

for (const [needle, replacement] of [
  ['...(stablecoinClassificationBatchMData as StablecoinRow[])', '...(stablecoinClassificationBatchMData as StablecoinRow[]),\n  ...(stablecoinClassificationBatchNData as StablecoinRow[])'],
  ['...(eventDetailsBatchMData as EventRow[])', '...(eventDetailsBatchMData as EventRow[]),\n  ...(eventDetailsBatchNData as EventRow[])'],
  ['...(stablecoinsBatchMData as StablecoinRow[])', '...(stablecoinsBatchMData as StablecoinRow[]),\n  ...(stablecoinsBatchNData as StablecoinRow[])'],
  ['...(organizationsBatchMData as OrganizationRow[])', '...(organizationsBatchMData as OrganizationRow[]),\n  ...(organizationsBatchNData as OrganizationRow[])'],
  ['...(relationshipsBatchMData as RelationshipRow[])', '...(relationshipsBatchMData as RelationshipRow[]),\n  ...(relationshipsBatchNData as RelationshipRow[])'],
  ['...(eventsBatchMData as EventRow[])', '...(eventsBatchMData as EventRow[]),\n  ...(eventsBatchNData as EventRow[])'],
  ['...(evidenceBatchMData as EvidenceRow[])', '...(evidenceBatchMData as EvidenceRow[]),\n  ...(evidenceBatchNData as EvidenceRow[])'],
  ['...(reserveReportsBatchMBData as ReserveReportRow[])', '...(reserveReportsBatchMBData as ReserveReportRow[]), ...(reserveReportsBatchNData as ReserveReportRow[])'],
  ['...(knownUnknownsBatchMData as KnownUnknownRow[])', '...(knownUnknownsBatchMData as KnownUnknownRow[]), ...(knownUnknownsBatchNData as KnownUnknownRow[])'],
  ['...(deploymentsBatchMData as DeploymentRow[])', '...(deploymentsBatchMData as DeploymentRow[]), ...(deploymentsBatchNData as DeploymentRow[])']
]) replaceOnce(registry, needle, replacement);

const profiles = 'src/lib/data/stablecoinProfiles.ts';
insertAfter(profiles, "import profileBatchMData from '../../../data/stablecoin-profiles-batch-m.json';", "import profileBatchNData from '../../../data/stablecoin-profiles-batch-n.json';");
replaceOnce(profiles, '...(profileBatchMData as StablecoinProfileV2[])', '...(profileBatchMData as StablecoinProfileV2[]),\n  ...(profileBatchNData as StablecoinProfileV2[])');

const registryV3 = 'src/lib/data/registryV3.ts';
insertAfter(registryV3, "import legalProfilesGrowthM from '../../../data/legal-profiles-v3-batch-growth-m.json';", "import legalProfilesGrowthN from '../../../data/legal-profiles-v3-batch-growth-n.json';");
insertAfter(registryV3, "import reserveComponentsBatchM from '../../../data/reserve-components-v3-batch-m.json';", "import reserveComponentsBatchN from '../../../data/reserve-components-v3-batch-n.json';");
replaceOnce(registryV3, '...legalProfilesGrowthM\n]', '...legalProfilesGrowthM,\n  ...legalProfilesGrowthN\n]');
replaceOnce(registryV3, '...reserveComponentsBatchM] as ReserveComponentV3[];', '...reserveComponentsBatchM, ...reserveComponentsBatchN] as ReserveComponentV3[];');

const income = 'src/lib/data/incomeProfilesV3.ts';
insertAfter(income, "import batchMB from '../../../data/income-profiles-v3-m-b.json';", "import batchN from '../../../data/income-profiles-v3-n.json';");
replaceOnce(income, '...batchMA, ...batchMB] as IncomeProfileV3[];', '...batchMA, ...batchMB, ...batchN] as IncomeProfileV3[];');

const launchFile = 'data/quality/launch-date-unresolved.json';
const launch = JSON.parse(read(launchFile));
if (!launch.records.some((row) => row.stablecoin_id === 'sog_st_msusd')) {
  launch.records.push({
    stablecoin_id: 'sog_st_msusd',
    category: 'C',
    best_known_range: null,
    reason_code: 'launch_boundary_conflict',
    review_note: 'Announcement, first mint, first deployment, and broad public availability are not resolved to one canonical day.'
  });
}
launch.records.sort((a, b) => a.stablecoin_id.localeCompare(b.stablecoin_id));
launch.expected_total = launch.records.length;
launch.category_counts = launch.records.reduce((acc, row) => {
  acc[row.category] = (acc[row.category] ?? 0) + 1;
  return acc;
}, {});
writeJson(launchFile, launch);

const v2File = 'docs/migration/registry-v2-baseline.json';
const v2 = JSON.parse(read(v2File));
v2.baseline_id = 'sog_registry_v2_post_msusd_emergency_2026_06_22';
v2.source_commit = 'add-mainstreet-msusd-impaired-incident';
Object.assign(v2.minimum_counts, {
  stablecoins: 81,
  organizations: 70,
  relationships: 83,
  classifications: 81,
  profiles: 81,
  events: 109,
  event_details: 109,
  evidence: 333,
  evidence_relations: 333,
  reserve_reports: 88,
  known_unknowns: 195,
  regulatory_notes: 9,
  deployments: 112
});
const appendGroup = (group, file) => {
  if (!v2.data_groups[group].includes(file)) v2.data_groups[group].push(file);
};
appendGroup('stablecoins', 'data/stablecoins-batch-n.json');
appendGroup('organizations', 'data/organizations-batch-n.json');
appendGroup('relationships', 'data/relationships-batch-n.json');
appendGroup('classifications', 'data/stablecoin-classification-batch-n.json');
appendGroup('profiles', 'data/stablecoin-profiles-batch-n.json');
appendGroup('events', 'data/events-batch-n.json');
appendGroup('event_details', 'data/event-details-batch-n.json');
appendGroup('evidence', 'data/evidence-batch-n.json');
appendGroup('reserve_reports', 'data/reserve-reports-batch-n.json');
appendGroup('known_unknowns', 'data/known-unknowns-batch-n.json');
appendGroup('deployments', 'data/deployments-batch-n.json');
writeJson(v2File, v2);

const foundationFile = 'docs/migration/registry-v3-foundation.json';
const foundation = JSON.parse(read(foundationFile));
if (!foundation.data_groups.legal_profiles.includes('data/legal-profiles-v3-batch-growth-n.json')) foundation.data_groups.legal_profiles.push('data/legal-profiles-v3-batch-growth-n.json');
if (!foundation.data_groups.reserve_components.includes('data/reserve-components-v3-batch-n.json')) foundation.data_groups.reserve_components.push('data/reserve-components-v3-batch-n.json');
foundation.minimum_counts.legal_profiles = 81;
foundation.minimum_counts.reserve_components = 113;
writeJson(foundationFile, foundation);

const incomeManifestFile = 'docs/migration/registry-v3-income-profiles.json';
const incomeManifest = JSON.parse(read(incomeManifestFile));
if (!incomeManifest.data_files.includes('data/income-profiles-v3-n.json')) incomeManifest.data_files.push('data/income-profiles-v3-n.json');
incomeManifest.minimum_count = 81;
writeJson(incomeManifestFile, incomeManifest);

const deploymentManifestFile = 'docs/migration/registry-v3-view-67.json';
const deploymentManifest = JSON.parse(read(deploymentManifestFile));
deploymentManifest.minimum_count = 112;
writeJson(deploymentManifestFile, deploymentManifest);

const migrationAuditFile = 'docs/migration/registry-v3-migration-audit.json';
const migrationAudit = JSON.parse(read(migrationAuditFile));
Object.assign(migrationAudit.minimum_counts, {
  legal_profiles: 81,
  stable_asset_relationships: 4,
  reserve_components: 113,
  deployments: 112,
  income_profiles: 81
});
migrationAudit.coverage.protected_stablecoins = 81;
writeJson(migrationAuditFile, migrationAudit);

const v3File = 'docs/migration/registry-v3-baseline.json';
const v3 = JSON.parse(read(v3File));
v3.baseline_id = 'sog_registry_v3_quality_81_msusd_emergency_2026_06_22';
v3.data_checkpoint_commit = 'add-mainstreet-msusd-impaired-incident';
Object.assign(v3.expected_counts, {
  stablecoins: 81,
  organizations: 70,
  relationships: 83,
  classifications: 81,
  profiles: 81,
  events: 109,
  event_details: 109,
  evidence: 333,
  reserve_reports: 88,
  known_unknowns: 195,
  regulatory_notes: 9,
  deployments: 112,
  legal_profiles: 81,
  stable_asset_relationships: 4,
  reserve_components: 113,
  income_profiles: 81
});
Object.assign(v3.expected_coverage, {
  classifications: 81,
  profiles: 81,
  relationships: 81,
  evidence: 81,
  reserve_reports: 68,
  known_unknowns: 81,
  deployments: 81,
  events: 81,
  legal_profiles: 81,
  reserve_components: 81,
  income_profiles: 81
});
Object.assign(v3.quality, {
  canonical_assets: 81,
  candidate_promotions: 80,
  pending_candidates: 0,
  launch_date_unresolved: 38
});
writeJson(v3File, v3);

console.log('msUSD emergency registry wiring complete');
