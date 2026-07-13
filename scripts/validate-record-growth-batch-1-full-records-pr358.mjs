import fs from 'node:fs';
import path from 'node:path';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const root = process.cwd();
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const rows = (file) => {
  const value = readJson(file);
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.records)) return value.records;
  throw new Error(`${file}: expected array or { records: [] }`);
};
const group = (baseline, name) => (baseline.data_groups?.[name] ?? []).flatMap(rows);
const byId = (items) => new Map(items.map((row) => [row.id, row]));

const config = readJson('config/record-growth-batch-1-pr358.json');
const baseline = loadRegistryV2Baseline(root);
const foundation = readJson('docs/migration/registry-v3-foundation.json');
const incomeManifest = readJson('docs/migration/registry-v3-income-profiles.json');

const stablecoins = group(baseline, 'stablecoins');
const organizations = group(baseline, 'organizations');
const relationships = group(baseline, 'relationships');
const classifications = group(baseline, 'classifications');
const profiles = group(baseline, 'profiles');
const events = group(baseline, 'events');
const eventDetails = group(baseline, 'event_details');
const evidence = group(baseline, 'evidence');
const reserveReports = group(baseline, 'reserve_reports');
const knownUnknowns = group(baseline, 'known_unknowns');
const deployments = group(baseline, 'deployments');
const legalProfiles = (foundation.data_groups?.legal_profiles ?? []).flatMap(rows);
const assetRelationships = (foundation.data_groups?.stable_asset_relationships ?? []).flatMap(rows);
const reserveComponents = (foundation.data_groups?.reserve_components ?? []).flatMap(rows);
const incomeProfiles = (incomeManifest.data_files ?? []).flatMap(rows);
const marketAccess = readJson('data/market-access-records-v1.json');

const expectedCounts = config.expected_post_promotion_counts;
const actualCounts = {
  assets: stablecoins.length,
  organizations: organizations.length,
  relationships: relationships.length,
  events: events.length,
  evidence: evidence.length,
  market_access_records: marketAccess.length,
  reserve_reports: reserveReports.length,
  known_unknowns: knownUnknowns.length,
  regulatory_notes: group(baseline, 'regulatory_notes').length,
  deployments: deployments.length,
  legal_profiles: legalProfiles.length,
  stable_asset_relationships: assetRelationships.length,
  reserve_components: reserveComponents.length,
  income_profiles: incomeProfiles.length
};
for (const [name, expected] of Object.entries(expectedCounts ?? {})) check(actualCounts[name] === expected, `${name}: expected ${expected}, found ${actualCounts[name]}`);

const maps = {
  stablecoins: byId(stablecoins), organizations: byId(organizations), relationships: byId(relationships), classifications: byId(classifications), profiles: byId(profiles),
  events: byId(events), eventDetails: byId(eventDetails), evidence: byId(evidence), reserveReports: byId(reserveReports), knownUnknowns: byId(knownUnknowns), deployments: byId(deployments),
  legalProfiles: byId(legalProfiles), assetRelationships: byId(assetRelationships), reserveComponents: byId(reserveComponents), incomeProfiles: byId(incomeProfiles)
};

const assetSpecs = [
  {
    id: 'sog_st_xusd', slug: 'straitsx-usd-xusd', symbol: 'XUSD', organization: 'sog_issuer_straitsx_singapore', relationship: 'sog_rel_xusd_straitsx_pr358', role: 'legal_issuer',
    event: 'sog_ev_xusd_attestation_start_pr358', evidence: ['sog_src_xusd_product_pr358','sog_src_xusd_sg_pr358','sog_src_xusd_ledger_launch_pr358'],
    reserveReport: 'sog_rr_xusd_attestation_index_pr358', knownUnknownPrefix: 'sog_ku_xusd_', deployments: ['sog_dep_xusd_ethereum_pr358','sog_dep_xusd_bsc_pr358','sog_dep_xusd_solana_pr358'],
    legalClaim: 'direct_claim_on_issuer', incomeAvailability: 'none', incomeAccrual: 'none'
  },
  {
    id: 'sog_st_usdb', slug: 'blast-usdb', symbol: 'USDB', organization: 'sog_org_blast', relationship: 'sog_rel_usdb_blast_pr358', role: 'protocol_operator',
    event: 'sog_ev_usdb_blast_launch_pr358', evidence: ['sog_src_usdb_docs_pr358','sog_src_usdb_contract_pr358','sog_src_usdb_about_pr358'],
    reserveReport: 'sog_rr_usdb_protocol_backing_pr358', knownUnknownPrefix: 'sog_ku_usdb_', deployments: ['sog_dep_usdb_blast_pr358'],
    legalClaim: 'protocol_redemption_right', incomeAvailability: 'native', incomeAccrual: 'balance_rebase'
  }
];

for (const spec of assetSpecs) {
  const asset = maps.stablecoins.get(spec.id);
  check(Boolean(asset), `${spec.id}: stablecoin missing`);
  check(asset?.slug === spec.slug, `${spec.id}: slug mismatch`);
  check(asset?.symbol === spec.symbol, `${spec.id}: symbol mismatch`);
  check(asset?.status === 'active', `${spec.id}: must be active`);
  check(asset?.confidence === 'high', `${spec.id}: confidence must be high`);

  const organization = maps.organizations.get(spec.organization);
  check(Boolean(organization), `${spec.id}: organization missing`);
  const relationship = maps.relationships.get(spec.relationship);
  check(Boolean(relationship), `${spec.id}: organization relationship missing`);
  check(relationship?.stablecoin_id === spec.id && relationship?.organization_id === spec.organization, `${spec.id}: relationship endpoints mismatch`);
  check(relationship?.role === spec.role, `${spec.id}: relationship role mismatch`);

  check(Boolean(maps.classifications.get(spec.id)), `${spec.id}: classification missing`);
  check(Boolean(maps.profiles.get(spec.id)), `${spec.id}: reserve/redemption profile missing`);
  check(Boolean(maps.events.get(spec.event)), `${spec.id}: event missing`);
  check(Boolean(maps.eventDetails.get(spec.event)), `${spec.id}: event detail missing`);
  check(maps.eventDetails.get(spec.event)?.event_detail_kind === 'launch', `${spec.id}: event detail kind must be launch`);

  for (const evidenceId of spec.evidence) check(Boolean(maps.evidence.get(evidenceId)), `${spec.id}: missing Evidence ${evidenceId}`);
  const assetEvidence = evidence.filter((row) => (row.stablecoin_ids ?? [row.stablecoin_id]).includes(spec.id));
  check(assetEvidence.length >= 3, `${spec.id}: expected at least three Evidence records, found ${assetEvidence.length}`);
  check(assetEvidence.some((row) => row.reliability === 'high'), `${spec.id}: high-reliability Evidence missing`);

  check(Boolean(maps.reserveReports.get(spec.reserveReport)), `${spec.id}: reserve report missing`);
  const gaps = knownUnknowns.filter((row) => row.stablecoin_id === spec.id && row.id.startsWith(spec.knownUnknownPrefix));
  check(gaps.length >= 3, `${spec.id}: expected at least three known unknowns, found ${gaps.length}`);
  check(gaps.some((row) => row.severity === 'high'), `${spec.id}: high-severity known unknown missing`);

  for (const deploymentId of spec.deployments) check(Boolean(maps.deployments.get(deploymentId)), `${spec.id}: missing deployment ${deploymentId}`);
  const assetDeployments = deployments.filter((row) => row.stablecoin_id === spec.id);
  check(assetDeployments.length === spec.deployments.length, `${spec.id}: unexpected deployment count ${assetDeployments.length}`);
  check(assetDeployments.filter((row) => row.is_primary === true).length === 1, `${spec.id}: exactly one primary deployment required`);
  check(assetDeployments.every((row) => row.verification_status === 'verified'), `${spec.id}: all promoted deployment identifiers must be verified`);

  const legal = maps.legalProfiles.get(spec.id);
  check(Boolean(legal), `${spec.id}: legal profile missing`);
  check(legal?.holder_claim_type === spec.legalClaim, `${spec.id}: holder claim type mismatch`);
  const component = reserveComponents.find((row) => row.stablecoin_id === spec.id);
  check(Boolean(component), `${spec.id}: reserve component missing`);
  const income = maps.incomeProfiles.get(spec.id);
  check(Boolean(income), `${spec.id}: income profile missing`);
  check(income?.availability === spec.incomeAvailability, `${spec.id}: income availability mismatch`);
  check(income?.accrual === spec.incomeAccrual, `${spec.id}: income accrual mismatch`);
}

const usdbRelation = maps.assetRelationships.get('sog_ar_usdb_redeemable_into_dai_pr358');
check(Boolean(usdbRelation), 'USDB to DAI relationship missing');
check(usdbRelation?.from_asset_id === 'sog_st_usdb' && usdbRelation?.to_asset_id === 'sog_st_dai', 'USDB to DAI relationship endpoints mismatch');
check(usdbRelation?.relationship_type === 'redeemable_into', 'USDB to DAI relationship type mismatch');

check(maps.deployments.get('sog_dep_usdb_blast_pr358')?.contract_address === '0x4300000000000000000000000000000000000003', 'USDB Blast contract mismatch');
check(maps.deployments.get('sog_dep_xusd_ethereum_pr358')?.contract_address === '0xC08e7E23C235073C6807C2EFE7021304cb7c2815', 'XUSD Ethereum contract mismatch');
check(maps.deployments.get('sog_dep_xusd_bsc_pr358')?.contract_address === '0xF81aC2E1A0373ddE1BCE01E2Fe694a9b7E3bfcB9', 'XUSD BSC contract mismatch');
check(maps.deployments.get('sog_dep_xusd_solana_pr358')?.contract_address === '4UbvZiomFvXDnZSz6vdHiDNiHozH2ykTEqjhhbVHiv9z', 'XUSD Solana identifier mismatch');
check(marketAccess.length === 4, 'four canonical Market Access records must be preserved');

const requiredFiles = [
  'data/stablecoins-batch-z.json','data/organizations-batch-z.json','data/relationships-batch-z.json','data/stablecoin-classification-batch-z.json','data/batch-z-reserve-redemption.json',
  'data/events-batch-z.json','data/event-details-batch-z.json','data/evidence-batch-z.json','data/batch-z-context.json','data/batch-z-review-gaps.json','data/batch-z-deployments.json',
  'data/z-legal.json','data/stable-asset-relationships-v3-pr358.json','data/batch-z-components.json','data/batch-z-income.json','docs/migration/registry-v2-baseline-batch-za.json'
];
for (const file of requiredFiles) check(fs.existsSync(path.join(root, file)), `required PR #358 file missing: ${file}`);

if (failures.length) {
  console.error('PR #358 full-record validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  validation_id: 'sog_pr358_xusd_usdb_full_records',
  counts: actualCounts,
  promoted_assets: assetSpecs.map((row) => row.id),
  usdb_related_asset: 'sog_st_dai',
  public_surface_added: false,
  market_access_records_preserved: marketAccess.length
}, null, 2));
