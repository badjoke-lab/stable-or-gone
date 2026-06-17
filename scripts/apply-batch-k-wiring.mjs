import fs from 'node:fs';

const read = (p) => fs.readFileSync(p, 'utf8');
const write = (p, v) => fs.writeFileSync(p, v.endsWith('\n') ? v : `${v}\n`);
const replaceOnce = (text, from, to, file) => {
  if (!text.includes(from)) throw new Error(`${file}: missing wiring anchor: ${from}`);
  return text.replace(from, to);
};
const updateText = (file, replacements) => {
  let text = read(file);
  for (const [from, to] of replacements) text = replaceOnce(text, from, to, file);
  write(file, text);
};
const updateJson = (file, fn) => {
  const value = JSON.parse(read(file));
  fn(value);
  write(file, `${JSON.stringify(value, null, 2)}\n`);
};
const appendUnique = (array, value) => { if (!array.includes(value)) array.push(value); };

updateJson('docs/migration/registry-v2-baseline.json', (v) => {
  v.baseline_id = 'sog_registry_v2_post_batch_k_2026_06_17';
  v.captured_at = '2026-06-17';
  v.source_commit = 'batch-k-historical-failures';
  Object.assign(v.minimum_counts, {stablecoins:70, organizations:59, relationships:72, classifications:70, profiles:70, events:84, event_details:84, evidence:273, evidence_relations:273, reserve_reports:72, known_unknowns:153, regulatory_notes:9, deployments:100});
  const additions = {
    stablecoins:'data/stablecoins-batch-k.json', organizations:'data/organizations-batch-k.json', relationships:'data/relationships-batch-k.json', classifications:'data/stablecoin-classification-batch-k.json', profiles:'data/stablecoin-profiles-batch-k.json', events:'data/events-batch-k.json', event_details:'data/event-details-batch-k.json', evidence:'data/evidence-batch-k.json', evidence_relations:'data/evidence-batch-k.json', reserve_reports:'data/reserve-reports-batch-k.json', known_unknowns:'data/known-unknowns-batch-k.json', deployments:'data/deployments-batch-k.json'
  };
  for (const [group, file] of Object.entries(additions)) appendUnique(v.data_groups[group], file);
  for (const row of [
    {id:'sog_st_esd',slug:'empty-set-dollar'},{id:'sog_st_bac',slug:'basis-cash'},{id:'sog_st_dsd',slug:'dynamic-set-dollar'},{id:'sog_st_cashio',slug:'cashio-dollar'},{id:'sog_st_acalaausd',slug:'acala-ausd'}
  ]) if (!v.protected_stablecoins.some((x) => x.id === row.id)) v.protected_stablecoins.push(row);
  for (const row of [
    {id:'sog_issuer_empty_set_squad',slug:'empty-set-squad'},{id:'sog_issuer_basis_cash',slug:'basis-cash'},{id:'sog_issuer_dynamic_set_dollar',slug:'dynamic-set-dollar'},{id:'sog_issuer_cashio',slug:'cashio'},{id:'sog_issuer_acala',slug:'acala-network'}
  ]) if (!v.protected_organizations.some((x) => x.id === row.id)) v.protected_organizations.push(row);
});

updateJson('docs/migration/registry-v3-foundation.json', (v) => {
  appendUnique(v.data_groups.legal_profiles, 'data/legal-profiles-v3-batch-growth-k.json');
  appendUnique(v.data_groups.reserve_components, 'data/reserve-components-v3-batch-k.json');
  v.minimum_counts.legal_profiles = 70;
  v.minimum_counts.reserve_components = 102;
});
updateJson('docs/migration/registry-v3-income-profiles.json', (v) => {
  appendUnique(v.data_files, 'data/asset-yield-state-batch-k.json');
  v.minimum_count = 70;
});
updateJson('docs/growth/candidate-master-70.json', (v) => {
  v.status = 'growth_target_reached';
  v.protected_minimums.promoted_candidates = 70;
  v.protected_minimums.pending_candidates = 0;
});

updateText('src/lib/data/stablecoinProfiles.ts', [
  ["import profileBatchJData from '../../../data/stablecoin-profiles-batch-j.json';", "import profileBatchJData from '../../../data/stablecoin-profiles-batch-j.json';\nimport profileBatchKData from '../../../data/stablecoin-profiles-batch-k.json';"],
  ["...(profileBatchJData as StablecoinProfileV2[])\n]", "...(profileBatchJData as StablecoinProfileV2[]),\n  ...(profileBatchKData as StablecoinProfileV2[])\n]"]
]);
updateText('src/lib/data/incomeProfilesV3.ts', [
  ["import batchJ from '../../../data/asset-yield-state-batch-j.json';", "import batchJ from '../../../data/asset-yield-state-batch-j.json';\nimport batchK from '../../../data/asset-yield-state-batch-k.json';"],
  ["...batchH, ...batchJ]", "...batchH, ...batchJ, ...batchK]"]
]);
updateText('src/lib/data/registryV3.ts', [
  ["import legalProfilesGrowthJ from '../../../data/legal-profiles-v3-batch-growth-j.json';", "import legalProfilesGrowthJ from '../../../data/legal-profiles-v3-batch-growth-j.json';\nimport legalProfilesGrowthK from '../../../data/legal-profiles-v3-batch-growth-k.json';"],
  ["import reserveComponentsBatchJ from '../../../data/reserve-components-v3-batch-j.json';", "import reserveComponentsBatchJ from '../../../data/reserve-components-v3-batch-j.json';\nimport reserveComponentsBatchK from '../../../data/reserve-components-v3-batch-k.json';"],
  ["...legalProfilesGrowthJ\n]", "...legalProfilesGrowthJ,\n  ...legalProfilesGrowthK\n]"],
  ["...reserveComponentsBatchI, ...reserveComponentsBatchJ]", "...reserveComponentsBatchI, ...reserveComponentsBatchJ, ...reserveComponentsBatchK]"]
]);

updateText('src/lib/data/registry.ts', [
  ["import stablecoinsBatchJData from '../../../data/stablecoins-batch-j.json';", "import stablecoinsBatchJData from '../../../data/stablecoins-batch-j.json';\nimport stablecoinsBatchKData from '../../../data/stablecoins-batch-k.json';"],
  ["import stablecoinClassificationBatchJData from '../../../data/stablecoin-classification-batch-j.json';", "import stablecoinClassificationBatchJData from '../../../data/stablecoin-classification-batch-j.json';\nimport stablecoinClassificationBatchKData from '../../../data/stablecoin-classification-batch-k.json';"],
  ["import organizationsBatchJData from '../../../data/organizations-batch-j.json';", "import organizationsBatchJData from '../../../data/organizations-batch-j.json';\nimport organizationsBatchKData from '../../../data/organizations-batch-k.json';"],
  ["import relationshipsBatchJData from '../../../data/relationships-batch-j.json';", "import relationshipsBatchJData from '../../../data/relationships-batch-j.json';\nimport relationshipsBatchKData from '../../../data/relationships-batch-k.json';"],
  ["import eventsBatchJData from '../../../data/events-batch-j.json';", "import eventsBatchJData from '../../../data/events-batch-j.json';\nimport eventsBatchKData from '../../../data/events-batch-k.json';"],
  ["import eventDetailsBatchJData from '../../../data/event-details-batch-j.json';", "import eventDetailsBatchJData from '../../../data/event-details-batch-j.json';\nimport eventDetailsBatchKData from '../../../data/event-details-batch-k.json';"],
  ["import evidenceBatchJData from '../../../data/evidence-batch-j.json';", "import evidenceBatchJData from '../../../data/evidence-batch-j.json';\nimport evidenceBatchKData from '../../../data/evidence-batch-k.json';"],
  ["import reserveReportsBatchJData from '../../../data/reserve-reports-batch-j.json';", "import reserveReportsBatchJData from '../../../data/reserve-reports-batch-j.json';\nimport reserveReportsBatchKData from '../../../data/reserve-reports-batch-k.json';"],
  ["import knownUnknownsBatchJData from '../../../data/known-unknowns-batch-j.json';", "import knownUnknownsBatchJData from '../../../data/known-unknowns-batch-j.json';\nimport knownUnknownsBatchKData from '../../../data/known-unknowns-batch-k.json';"],
  ["import deploymentsBatchJData from '../../../data/deployments-batch-j.json';", "import deploymentsBatchJData from '../../../data/deployments-batch-j.json';\nimport deploymentsBatchKData from '../../../data/deployments-batch-k.json';"],
  ["...(stablecoinClassificationBatchJData as StablecoinClassificationV2[])", "...(stablecoinClassificationBatchJData as StablecoinClassificationV2[]), ...(stablecoinClassificationBatchKData as StablecoinClassificationV2[])"],
  ["...(eventDetailsBatchJData as EventRow[]), ...(eventDetailsIssuerControl2026Data as EventRow[])", "...(eventDetailsBatchJData as EventRow[]), ...(eventDetailsBatchKData as EventRow[]), ...(eventDetailsIssuerControl2026Data as EventRow[])"],
  ["...(stablecoinsBatchJData as StablecoinRow[])]", "...(stablecoinsBatchJData as StablecoinRow[]), ...(stablecoinsBatchKData as StablecoinRow[])]"],
  ["...(organizationsBatchJData as OrganizationRow[])]", "...(organizationsBatchJData as OrganizationRow[]), ...(organizationsBatchKData as OrganizationRow[])]"],
  ["...(relationshipsBatchJData as RelationshipRow[])]", "...(relationshipsBatchJData as RelationshipRow[]), ...(relationshipsBatchKData as RelationshipRow[])]"],
  ["...(eventsBatchJData as EventRow[]), ...(eventsIssuerControl2026Data as EventRow[])]", "...(eventsBatchJData as EventRow[]), ...(eventsBatchKData as EventRow[]), ...(eventsIssuerControl2026Data as EventRow[])]"],
  ["...(evidenceBatchJData as EvidenceRow[]), ...(evidenceIssuerControl2026Data as EvidenceRow[])]", "...(evidenceBatchJData as EvidenceRow[]), ...(evidenceBatchKData as EvidenceRow[]), ...(evidenceIssuerControl2026Data as EvidenceRow[])]"],
  ["...(reserveReportsBatchJData as ReserveReportRow[])]", "...(reserveReportsBatchJData as ReserveReportRow[]), ...(reserveReportsBatchKData as ReserveReportRow[])]"],
  ["...(knownUnknownsBatchJData as KnownUnknownRow[]), ...(knownUnknownsIssuerControl2026Data as KnownUnknownRow[])]", "...(knownUnknownsBatchJData as KnownUnknownRow[]), ...(knownUnknownsBatchKData as KnownUnknownRow[]), ...(knownUnknownsIssuerControl2026Data as KnownUnknownRow[])]"],
  ["...(deploymentsBatchJData as DeploymentRow[]), ...(deploymentsIssuerControl2026Data as DeploymentRow[])]", "...(deploymentsBatchJData as DeploymentRow[]), ...(deploymentsBatchKData as DeploymentRow[]), ...(deploymentsIssuerControl2026Data as DeploymentRow[])]"]
]);

for (const file of ['scripts/validate-data.mjs','scripts/validate-registry-v2-compat.mjs']) {
  updateText(file, [["...read('data/issuers-batch-j.json')", "...read('data/issuers-batch-j.json'),\n  ...read('data/issuers-batch-k.json')"]]);
}
for (const file of ['scripts/validate-candidate-stable-assets.mjs','scripts/validate-batch-finalization.mjs']) {
  updateText(file, [["'data/candidate-promotions-batch-j.json'", "'data/candidate-promotions-batch-j.json', 'data/candidate-promotions-batch-k.json'"]]);
}

console.log('Batch K wiring applied.');
