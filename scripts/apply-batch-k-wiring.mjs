import fs from 'node:fs';

const read = (file) => fs.readFileSync(file, 'utf8');
const write = (file, text) => fs.writeFileSync(file, text.endsWith('\n') ? text : `${text}\n`);

function update(file, replacements) {
  let text = read(file);
  for (const [from, to] of replacements) {
    if (!text.includes(from)) throw new Error(`${file}: missing anchor ${from}`);
    text = text.replace(from, to);
  }
  write(file, text);
}

update('src/lib/data/stablecoinProfiles.ts', [
  ["import profileBatchJData from '../../../data/stablecoin-profiles-batch-j.json';", "import profileBatchJData from '../../../data/stablecoin-profiles-batch-j.json';\nimport profileBatchKData from '../../../data/stablecoin-profiles-batch-k.json';"],
  ["...(profileBatchJData as StablecoinProfileV2[])\n]", "...(profileBatchJData as StablecoinProfileV2[]),\n  ...(profileBatchKData as StablecoinProfileV2[])\n]"]
]);

update('src/lib/data/incomeProfilesV3.ts', [
  ["import batchJ from '../../../data/asset-yield-state-batch-j.json';", "import batchJ from '../../../data/asset-yield-state-batch-j.json';\nimport batchK from '../../../data/asset-yield-state-batch-k.json';"],
  ["...batchH, ...batchJ]", "...batchH, ...batchJ, ...batchK]"]
]);

update('src/lib/data/registryV3.ts', [
  ["import legalProfilesGrowthJ from '../../../data/legal-profiles-v3-batch-growth-j.json';", "import legalProfilesGrowthJ from '../../../data/legal-profiles-v3-batch-growth-j.json';\nimport legalProfilesGrowthK from '../../../data/legal-profiles-v3-batch-growth-k.json';"],
  ["import reserveComponentsBatchJ from '../../../data/reserve-components-v3-batch-j.json';", "import reserveComponentsBatchJ from '../../../data/reserve-components-v3-batch-j.json';\nimport reserveComponentsBatchK from '../../../data/reserve-components-v3-batch-k.json';"],
  ["...legalProfilesGrowthJ\n]", "...legalProfilesGrowthJ,\n  ...legalProfilesGrowthK\n]"],
  ["...reserveComponentsBatchI, ...reserveComponentsBatchJ]", "...reserveComponentsBatchI, ...reserveComponentsBatchJ, ...reserveComponentsBatchK]"]
]);

update('src/lib/data/registry.ts', [
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

for (const file of ['scripts/validate-data.mjs', 'scripts/validate-registry-v2-compat.mjs']) {
  update(file, [["...read('data/issuers-batch-j.json')", "...read('data/issuers-batch-j.json'),\n  ...read('data/issuers-batch-k.json')"]]);
}

for (const file of ['scripts/validate-candidate-stable-assets.mjs', 'scripts/validate-batch-finalization.mjs']) {
  update(file, [["'data/candidate-promotions-batch-j.json'", "'data/candidate-promotions-batch-j.json', 'data/candidate-promotions-batch-k.json'"]]);
}

console.log('Minimal Batch K wiring applied.');
