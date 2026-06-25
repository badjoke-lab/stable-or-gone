import fs from 'node:fs';

const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const failures = [];
const fail = (message) => failures.push(message);
const expectedAssets = ['sog_st_unitedu','sog_st_usdgo','sog_st_sofiusd','sog_st_solsticeusx','sog_st_ousd'];
const expectedCandidates = ['sog_cand_000083','sog_cand_000084','sog_cand_000085','sog_cand_000086','sog_cand_000087'];
const files = {
  promotions: 'data/candidate-promotions-batch-16.json',
  stablecoins: 'data/stablecoins-batch-o.json',
  organizations: 'data/organizations-batch-o.json',
  relationships: 'data/relationships-batch-o.json',
  classifications: 'data/stablecoin-classification-batch-o.json',
  profiles: 'data/stablecoin-profiles-batch-o.json',
  events: 'data/events-batch-o.json',
  details: 'data/event-details-batch-o.json',
  evidence: 'data/evidence-batch-o.json',
  reports: 'data/reserve-reports-batch-o.json',
  unknowns: 'data/known-unknowns-batch-o.json',
  deployments: 'data/deployments-batch-o.json',
  legal: 'data/legal-profiles-v3-batch-growth-o.json',
  components: 'data/reserve-components-v3-batch-o.json',
  income: 'data/income-profiles-v3-o.json'
};
const rows = Object.fromEntries(Object.entries(files).map(([key, file]) => [key, read(file)]));
const counts = {promotions:5,stablecoins:5,organizations:6,relationships:6,classifications:5,profiles:5,events:5,details:5,evidence:19,reports:5,unknowns:25,deployments:7,legal:5,components:5,income:5};
for (const [key, count] of Object.entries(counts)) if (rows[key].length !== count) fail(`${files[key]} expected ${count}, found ${rows[key].length}`);
const ids = (items, field = 'id') => new Set(items.map((row) => row[field]));
const assetIds = ids(rows.stablecoins);
const orgIds = ids(rows.organizations);
const eventIds = ids(rows.events);
const evidenceIds = ids(rows.evidence);
const reportIds = ids(rows.reports);
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
for (const row of rows.stablecoins) if (!orgIds.has(row.issuer_id)) fail(`${row.id} missing issuer ${row.issuer_id}`);
for (const row of rows.relationships) {
  if (!assetIds.has(row.stablecoin_id)) fail(`${row.id} missing stablecoin reference`);
  if (!orgIds.has(row.organization_id)) fail(`${row.id} missing organization reference`);
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
const usdgoIssuer = rows.relationships.find((row) => row.stablecoin_id === 'sog_st_usdgo' && row.organization_id === 'sog_issuer_anchorage_digital_bank');
const usdgoBrand = rows.relationships.find((row) => row.stablecoin_id === 'sog_st_usdgo' && row.organization_id === 'sog_org_osl_group');
if (usdgoIssuer?.role !== 'legal_issuer') fail('USDGO legal issuer boundary missing');
if (usdgoBrand?.role !== 'brand_owner') fail('USDGO brand boundary missing');
if (!/dForce USX/.test(rows.stablecoins.find((row) => row.id === 'sog_st_solsticeusx')?.redemption_notes ?? '')) fail('Solstice USX identity boundary missing');
const ousdIncome = rows.income.find((row) => row.id === 'sog_st_ousd');
if (ousdIncome?.availability !== 'native' || ousdIncome?.accrual !== 'balance_rebase') fail('OUSD income boundary missing');
if (failures.length) {
  console.error('Batch 16 promotion validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log('Batch 16 promotion validation passed.');
