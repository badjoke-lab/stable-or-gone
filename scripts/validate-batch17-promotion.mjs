import fs from 'node:fs';

const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const failures = [];
const fail = (message) => failures.push(message);
const expectedAssets = ['sog_st_usat','sog_st_eurau','sog_st_nobleusdn','sog_st_usdh','sog_st_aecoin'];
const expectedCandidates = ['sog_cand_000088','sog_cand_000089','sog_cand_000090','sog_cand_000091','sog_cand_000092'];
const files = {
  promotions:'data/candidate-promotions-batch-17.json', stablecoins:'data/stablecoins-batch-p.json', organizations:'data/organizations-batch-p.json', issuers:'data/issuers-batch-p.json',
  relationships:'data/relationships-batch-p.json', classifications:'data/stablecoin-classification-batch-p.json', profiles:'data/stablecoin-profiles-batch-p.json', events:'data/events-batch-p.json',
  details:'data/event-details-batch-p.json', evidence:'data/evidence-batch-p.json', reports:'data/reserve-reports-batch-p.json', unknowns:'data/known-unknowns-batch-p.json',
  deployments:'data/deployments-batch-p.json', legal:'data/legal-profiles-v3-batch-growth-p.json', components:'data/reserve-components-v3-batch-p.json', income:'data/income-profiles-v3-p.json'
};
const rows = Object.fromEntries(Object.entries(files).map(([key,file]) => [key, read(file)]));
const counts = {promotions:5,stablecoins:5,organizations:7,issuers:7,relationships:9,classifications:5,profiles:5,events:5,details:5,evidence:21,reports:5,unknowns:25,deployments:6,legal:5,components:5,income:5};
for (const [key,count] of Object.entries(counts)) if (rows[key].length !== count) fail(`${files[key]} expected ${count}, found ${rows[key].length}`);
const ids = (items, field='id') => new Set(items.map((row) => row[field]));
const assetIds = ids(rows.stablecoins); const orgIds = ids(rows.organizations); const eventIds = ids(rows.events); const evidenceIds = ids(rows.evidence); const reportIds = ids(rows.reports);
for (const id of expectedCandidates) if (!rows.promotions.some((row) => row.candidate_id === id && row.status === 'promoted')) fail(`missing promotion ${id}`);
for (const id of expectedAssets) {
  if (!assetIds.has(id)) fail(`missing stablecoin ${id}`);
  for (const key of ['classifications','profiles','legal','income']) if (!rows[key].some((row) => row.id === id)) fail(`${id} missing ${key}`);
  if (!rows.components.some((row) => row.stablecoin_id === id)) fail(`${id} missing reserve component`);
  if (!rows.relationships.some((row) => row.stablecoin_id === id)) fail(`${id} missing relationship`);
  if (!rows.events.some((row) => row.stablecoin_id === id)) fail(`${id} missing event`);
  if (!rows.evidence.some((row) => row.stablecoin_id === id || row.stablecoin_ids?.includes(id))) fail(`${id} missing evidence`);
  if (!rows.reports.some((row) => row.stablecoin_id === id)) fail(`${id} missing reserve report`);
  if (rows.unknowns.filter((row) => row.stablecoin_id === id).length !== 5) fail(`${id} must retain five known unknowns`);
  if (!rows.deployments.some((row) => row.stablecoin_id === id)) fail(`${id} missing deployment`);
}
const externalOrgIds = new Set(['sog_issuer_anchorage_digital_bank','sog_issuer_m0_protocol']);
for (const row of rows.stablecoins) if (!orgIds.has(row.issuer_id) && !externalOrgIds.has(row.issuer_id)) fail(`${row.id} missing issuer ${row.issuer_id}`);
for (const row of rows.relationships) {
  if (!assetIds.has(row.stablecoin_id)) fail(`${row.id} missing stablecoin reference`);
  if (!orgIds.has(row.organization_id) && !externalOrgIds.has(row.organization_id)) fail(`${row.id} missing organization ${row.organization_id}`);
  for (const id of row.evidence_ids ?? []) if (!evidenceIds.has(id)) fail(`${row.id} missing evidence ${id}`);
}
for (const event of rows.events) {
  const linked = rows.evidence.filter((row) => row.event_ids?.includes(event.id) || row.event_id === event.id).length;
  if (!rows.details.some((row) => row.id === event.id)) fail(`${event.id} missing detail`);
  if (event.source_count !== linked) fail(`${event.id} source_count ${event.source_count} differs from ${linked}`);
}
for (const row of rows.details) {
  if (!eventIds.has(row.id)) fail(`${row.id} orphan detail`);
  for (const id of row.evidence_ids ?? []) if (!evidenceIds.has(id)) fail(`${row.id} missing evidence ${id}`);
}
for (const row of rows.profiles) if (row.reserve_profile?.latest_report_id && !reportIds.has(row.reserve_profile.latest_report_id)) fail(`${row.id} missing reserve report`);
for (const row of rows.components) if (row.reserve_report_id && !reportIds.has(row.reserve_report_id)) fail(`${row.id} missing reserve report`);
const usat = rows.stablecoins.find((row) => row.id === 'sog_st_usat'); if (!/separate from USD₮/.test(usat?.redemption_notes ?? '')) fail('USA₮ identity boundary missing');
const noble = rows.stablecoins.find((row) => row.id === 'sog_st_nobleusdn'); if (!/separate from Neutrino USD/.test(noble?.redemption_notes ?? '')) fail('Noble USDN collision boundary missing');
const usdh = rows.stablecoins.find((row) => row.id === 'sog_st_usdh'); if (usdh?.status !== 'limited' || usdh?.launch_date !== null) fail('USDH lifecycle/date boundary missing');
const aec = rows.stablecoins.find((row) => row.id === 'sog_st_aecoin'); if (aec?.launch_date !== null || !/Appointed agents/.test(aec?.redemption_notes ?? '')) fail('AE Coin date/agent boundary missing');
const nobleIncome = rows.income.find((row) => row.id === 'sog_st_nobleusdn'); if (nobleIncome?.availability !== 'native' || nobleIncome?.accrual !== 'balance_rebase') fail('Noble USDN income boundary missing');
if (failures.length) { console.error('Batch 17 promotion validation failed:'); failures.forEach((failure) => console.error(`- ${failure}`)); process.exit(1); }
console.log('Batch 17 promotion validation passed.');
