import fs from 'node:fs';

const read = (path) => fs.readFileSync(path, 'utf8');
const write = (path, content) => fs.writeFileSync(path, content);
const ensureOnce = (content, marker, insertion, anchor) => {
  if (content.includes(marker)) return content;
  const index = content.indexOf(anchor);
  if (index < 0) throw new Error(`Anchor not found for ${marker}: ${anchor}`);
  return `${content.slice(0, index + anchor.length)}${insertion}${content.slice(index + anchor.length)}`;
};
const replaceOnce = (content, before, after) => {
  if (content.includes(after)) return content;
  const index = content.indexOf(before);
  if (index < 0) throw new Error(`Replacement anchor not found: ${before}`);
  return `${content.slice(0, index)}${after}${content.slice(index + before.length)}`;
};

{
  const path = 'src/lib/data/registry.ts';
  let text = read(path);
  text = ensureOnce(text, "stablecoinsBatchAAData", "\nimport stablecoinsBatchAAData from '../../../data/stablecoins-batch-aa.json';", "import stablecoinsBatchZData from '../../../data/stablecoins-batch-z.json';");
  text = ensureOnce(text, "stablecoinClassificationBatchAAData", "\nimport stablecoinClassificationBatchAAData from '../../../data/stablecoin-classification-batch-aa.json';", "import stablecoinClassificationBatchZData from '../../../data/stablecoin-classification-batch-z.json';");
  text = ensureOnce(text, "relationshipsBatchAAData", "\nimport relationshipsBatchAAData from '../../../data/relationships-batch-aa.json';", "import relationshipsBatchZData from '../../../data/relationships-batch-z.json';");
  text = ensureOnce(text, "eventsBatchAAData", "\nimport eventsBatchAAData from '../../../data/events-batch-aa.json';", "import eventsBatchZData from '../../../data/events-batch-z.json';");
  text = ensureOnce(text, "eventDetailsBatchAAData", "\nimport eventDetailsBatchAAData from '../../../data/event-details-batch-aa.json';", "import eventDetailsBatchZData from '../../../data/event-details-batch-z.json';");
  text = ensureOnce(text, "evidenceBatchAAData", "\nimport evidenceBatchAAData from '../../../data/evidence-batch-aa.json';", "import evidenceBatchZData from '../../../data/evidence-batch-z.json';");
  text = ensureOnce(text, "reserveReportsBatchAAData", "\nimport reserveReportsBatchAAData from '../../../data/batch-aa-context.json';", "import reserveReportsBatchZData from '../../../data/batch-z-context.json';");
  text = ensureOnce(text, "knownUnknownsBatchAAData", "\nimport knownUnknownsBatchAAData from '../../../data/batch-aa-review-gaps.json';", "import knownUnknownsBatchZData from '../../../data/batch-z-review-gaps.json';");
  text = ensureOnce(text, "deploymentsBatchAAData", "\nimport deploymentsBatchAAData from '../../../data/batch-aa-deployments.json';", "import deploymentsBatchZData from '../../../data/batch-z-deployments.json';");

  text = replaceOnce(text,
    "...(stablecoinClassificationBatchYData as StablecoinRow[]), ...(stablecoinClassificationBatchZData as StablecoinRow[])",
    "...(stablecoinClassificationBatchYData as StablecoinRow[]), ...(stablecoinClassificationBatchZData as StablecoinRow[]), ...(stablecoinClassificationBatchAAData as StablecoinRow[])");
  text = replaceOnce(text,
    "...(eventDetailsBatchXData as EventRow[]), ...(eventDetailsBatchYData as EventRow[]), ...(eventDetailsBatchZData as EventRow[])",
    "...(eventDetailsBatchXData as EventRow[]), ...(eventDetailsBatchYData as EventRow[]), ...(eventDetailsBatchZData as EventRow[]), ...(eventDetailsBatchAAData as EventRow[])");
  text = replaceOnce(text,
    "...(stablecoinsBatchYData as StablecoinRow[]), ...(stablecoinsBatchZData as StablecoinRow[])",
    "...(stablecoinsBatchYData as StablecoinRow[]), ...(stablecoinsBatchZData as StablecoinRow[]), ...(stablecoinsBatchAAData as StablecoinRow[])");
  text = replaceOnce(text,
    "...(relationshipsBatchYData as RelationshipRow[]), ...(relationshipsBatchZData as RelationshipRow[])",
    "...(relationshipsBatchYData as RelationshipRow[]), ...(relationshipsBatchZData as RelationshipRow[]), ...(relationshipsBatchAAData as RelationshipRow[])");
  text = replaceOnce(text,
    "...(eventsBatchYData as EventRow[]), ...(eventsBatchZData as EventRow[])",
    "...(eventsBatchYData as EventRow[]), ...(eventsBatchZData as EventRow[]), ...(eventsBatchAAData as EventRow[])");
  text = replaceOnce(text,
    "...(evidenceBatchYData as EvidenceRow[]), ...(evidenceBatchZData as EvidenceRow[]), ...(evidenceQualityPr219Data as EvidenceRow[])",
    "...(evidenceBatchYData as EvidenceRow[]), ...(evidenceBatchZData as EvidenceRow[]), ...(evidenceBatchAAData as EvidenceRow[]), ...(evidenceQualityPr219Data as EvidenceRow[])");
  text = replaceOnce(text,
    "...(reserveReportsBatchYData as ReserveReportRow[]), ...(reserveReportsBatchZData as ReserveReportRow[])]",
    "...(reserveReportsBatchYData as ReserveReportRow[]), ...(reserveReportsBatchZData as ReserveReportRow[]), ...(reserveReportsBatchAAData as ReserveReportRow[])]");
  text = replaceOnce(text,
    "...(knownUnknownsBatchYData as KnownUnknownRow[]), ...(knownUnknownsBatchZData as KnownUnknownRow[])]",
    "...(knownUnknownsBatchYData as KnownUnknownRow[]), ...(knownUnknownsBatchZData as KnownUnknownRow[]), ...(knownUnknownsBatchAAData as KnownUnknownRow[])]");
  text = replaceOnce(text,
    "...(deploymentsBatchYData as DeploymentRow[]), ...(deploymentsBatchZData as DeploymentRow[])]",
    "...(deploymentsBatchYData as DeploymentRow[]), ...(deploymentsBatchZData as DeploymentRow[]), ...(deploymentsBatchAAData as DeploymentRow[])]");
  write(path, text);
}

{
  const path = 'src/lib/data/currentProfiles.ts';
  let text = read(path);
  text = ensureOnce(text, "profileBatchAAData", "\nimport profileBatchAAData from '../../../data/batch-aa-reserve-redemption.json';", "import profileBatchZData from '../../../data/batch-z-reserve-redemption.json';");
  text = replaceOnce(text, ",...profileBatchYData,...profileBatchZData,...profilePr354Data", ",...profileBatchYData,...profileBatchZData,...profileBatchAAData,...profilePr354Data");
  write(path, text);
}

{
  const path = 'src/lib/data/registryV3.ts';
  let text = read(path);
  text = ensureOnce(text, "legalProfilesGrowthAA", "\nimport legalProfilesGrowthAA from '../../../data/aa-legal.json';", "import legalProfilesGrowthZ from '../../../data/z-legal.json';");
  text = ensureOnce(text, "reserveComponentsBatchAA", "\nimport reserveComponentsBatchAA from '../../../data/batch-aa-components.json';", "import reserveComponentsBatchZ from '../../../data/batch-z-components.json';");
  text = replaceOnce(text, "...legalProfilesGrowthX, ...legalProfilesGrowthY, ...legalProfilesGrowthZ,", "...legalProfilesGrowthX, ...legalProfilesGrowthY, ...legalProfilesGrowthZ, ...legalProfilesGrowthAA,");
  text = replaceOnce(text, "...reserveComponentsBatchY, ...reserveComponentsBatchZ,", "...reserveComponentsBatchY, ...reserveComponentsBatchZ, ...reserveComponentsBatchAA,");
  write(path, text);
}

{
  const path = 'src/lib/data/incomeProfilesV3.ts';
  let text = read(path);
  text = ensureOnce(text, "batchAA", "\nimport batchAA from '../../../data/batch-aa-income.json';", "import batchZ from '../../../data/batch-z-income.json';");
  text = replaceOnce(text, ",...batchX,...batchY,...batchZ] as IncomeProfileV3[]", ",...batchX,...batchY,...batchZ,...batchAA] as IncomeProfileV3[]");
  write(path, text);
}

{
  const path = 'docs/migration/registry-v3-foundation.json';
  const data = JSON.parse(read(path));
  if (!data.data_groups.legal_profiles.includes('data/aa-legal.json')) data.data_groups.legal_profiles.push('data/aa-legal.json');
  if (!data.data_groups.reserve_components.includes('data/batch-aa-components.json')) data.data_groups.reserve_components.push('data/batch-aa-components.json');
  data.minimum_counts.legal_profiles = 114;
  data.minimum_counts.reserve_components = 147;
  write(path, `${JSON.stringify(data, null, 2)}\n`);
}

{
  const path = 'docs/migration/registry-v3-income-profiles.json';
  const data = JSON.parse(read(path));
  if (!data.data_files.includes('data/batch-aa-income.json')) data.data_files.push('data/batch-aa-income.json');
  data.minimum_count = 114;
  write(path, `${JSON.stringify(data, null, 2)}\n`);
}

console.log(JSON.stringify({ok:true,work_item:'record_growth_batch_2_pr429',loaders_updated:true,manifests_updated:true}, null, 2));
