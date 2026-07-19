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

const config = readJson('config/record-growth-batch-2-pr429.json');
const baseline = loadRegistryV2Baseline(root);
const foundation = readJson('docs/migration/registry-v3-foundation.json');
const incomeManifest = readJson('docs/migration/registry-v3-income-profiles.json');
const checkpoint = readJson('docs/migration/current-canonical-checkpoint.json');
const parity = readJson('docs/migration/registry-v3-parity-baseline.json');
const release = readJson('docs/migration/registry-release-integrity-baseline.json');
const handoff = readJson('docs/migration/record-growth-batch-2-pr429-handoff.json');
const statsCheckpoint = readJson('docs/migration/current-stats-history-checkpoint.json');
const history = readJson('data/stats-history.json');

const stablecoins = group(baseline, 'stablecoins');
const organizations = group(baseline, 'organizations');
const relationships = group(baseline, 'relationships');
const classifications = group(baseline, 'classifications');
const profiles = group(baseline, 'profiles');
const events = group(baseline, 'events');
const eventDetails = group(baseline, 'event_details');
const evidence = group(baseline, 'evidence');
const evidenceRelations = group(baseline, 'evidence_relations');
const reserveReports = group(baseline, 'reserve_reports');
const knownUnknowns = group(baseline, 'known_unknowns');
const deployments = group(baseline, 'deployments');
const legalProfiles = (foundation.data_groups?.legal_profiles ?? []).flatMap(rows);
const assetRelationships = (foundation.data_groups?.stable_asset_relationships ?? []).flatMap(rows);
const reserveComponents = (foundation.data_groups?.reserve_components ?? []).flatMap(rows);
const incomeProfiles = (incomeManifest.data_files ?? []).flatMap(rows);
const marketAccess = readJson('data/market-access-records-v1.json');
const promotions = readJson('data/candidate-promotions-batch-28.json');

const actualCounts = {
  stablecoins: stablecoins.length,
  organizations: organizations.length,
  relationships: relationships.length,
  events: events.length,
  evidence: evidence.length,
  evidence_relations: evidenceRelations.length,
  reserve_reports: reserveReports.length,
  known_unknowns: knownUnknowns.length,
  deployments: deployments.length,
  legal_profiles: legalProfiles.length,
  stable_asset_relationships: assetRelationships.length,
  reserve_components: reserveComponents.length,
  income_profiles: incomeProfiles.length,
  market_access_records: marketAccess.length,
  archive_recorded: evidence.filter((row) => typeof row.archived_url === 'string' && row.archived_url.length > 0).length,
  archive_not_recorded: evidence.filter((row) => !(typeof row.archived_url === 'string' && row.archived_url.length > 0)).length
};
for (const [name, expected] of Object.entries(config.expected_post_promotion_counts)) check(actualCounts[name] === expected, `${name}: expected ${expected}, found ${actualCounts[name]}`);
check(classifications.length === 114, `classifications: expected 114, found ${classifications.length}`);
check(profiles.length === 114, `profiles: expected 114, found ${profiles.length}`);
check(eventDetails.length === 189, `event_details: expected 189, found ${eventDetails.length}`);

const maps = {
  stablecoins: byId(stablecoins), organizations: byId(organizations), relationships: byId(relationships), classifications: byId(classifications), profiles: byId(profiles),
  events: byId(events), eventDetails: byId(eventDetails), evidence: byId(evidence), reserveReports: byId(reserveReports), knownUnknowns: byId(knownUnknowns), deployments: byId(deployments),
  legalProfiles: byId(legalProfiles), reserveComponents: byId(reserveComponents), incomeProfiles: byId(incomeProfiles)
};

const specs = [
  {
    id: 'sog_st_chfau', slug: 'chfau', symbol: 'CHFAU', peg: 'CHF', launch: '2026-02-26', relationship: 'sog_rel_chfau_allunity_pr429', event: 'sog_ev_chfau_launch_pr429',
    evidence: ['sog_src_chfau_launch_pr429','sog_src_chfau_product_pr429','sog_src_allunity_legal_pr429','sog_src_allunity_trust_pr429'],
    reserve: 'sog_rr_chfau_reserve_context_pr429', gapPrefix: 'sog_ku_chfau_', deployments: ['sog_dep_chfau_ethereum_pr429','sog_dep_chfau_tempo_pr429']
  },
  {
    id: 'sog_st_sekau', slug: 'sekau', symbol: 'SEKAU', peg: 'SEK', launch: '2026-06-19', relationship: 'sog_rel_sekau_allunity_pr429', event: 'sog_ev_sekau_launch_pr429',
    evidence: ['sog_src_sekau_launch_pr429','sog_src_sekau_product_pr429','sog_src_allunity_legal_pr429','sog_src_allunity_trust_pr429'],
    reserve: 'sog_rr_sekau_reserve_context_pr429', gapPrefix: 'sog_ku_sekau_', deployments: ['sog_dep_sekau_ethereum_pr429','sog_dep_sekau_polygon_pr429','sog_dep_sekau_base_pr429','sog_dep_sekau_solana_pr429']
  }
];

for (const spec of specs) {
  const asset = maps.stablecoins.get(spec.id);
  check(Boolean(asset), `${spec.id}: stablecoin missing`);
  check(asset?.slug === spec.slug, `${spec.id}: slug mismatch`);
  check(asset?.symbol === spec.symbol, `${spec.id}: symbol mismatch`);
  check(asset?.peg_asset === spec.peg, `${spec.id}: peg asset mismatch`);
  check(asset?.launch_date === spec.launch, `${spec.id}: launch date mismatch`);
  check(asset?.status === 'active', `${spec.id}: status must be active`);
  check(asset?.issuer_id === 'sog_issuer_allunity', `${spec.id}: must reuse AllUnity issuer`);
  check(asset?.confidence === 'high', `${spec.id}: confidence must be high`);

  const relationship = maps.relationships.get(spec.relationship);
  check(Boolean(relationship), `${spec.id}: legal-issuer relationship missing`);
  check(relationship?.organization_id === 'sog_issuer_allunity' && relationship?.stablecoin_id === spec.id, `${spec.id}: relationship endpoints mismatch`);
  check(relationship?.role === 'legal_issuer' && relationship?.status === 'active', `${spec.id}: relationship semantics mismatch`);
  check(Boolean(maps.organizations.get('sog_issuer_allunity')), `${spec.id}: existing AllUnity organization missing`);

  const classification = maps.classifications.get(spec.id);
  check(Boolean(classification), `${spec.id}: classification missing`);
  check(classification?.lifecycle_status === 'active', `${spec.id}: lifecycle mismatch`);
  check(classification?.issuance_status === 'restricted', `${spec.id}: issuance mismatch`);
  check(classification?.stabilization_mechanism === 'issuer_redemption', `${spec.id}: stabilization mismatch`);
  check(Boolean(maps.profiles.get(spec.id)), `${spec.id}: reserve/redemption profile missing`);

  check(Boolean(maps.events.get(spec.event)), `${spec.id}: launch event missing`);
  check(maps.events.get(spec.event)?.event_date === spec.launch, `${spec.id}: event date mismatch`);
  check(maps.eventDetails.get(spec.event)?.event_detail_kind === 'launch', `${spec.id}: launch event detail missing`);

  for (const evidenceId of spec.evidence) check(Boolean(maps.evidence.get(evidenceId)), `${spec.id}: missing Evidence ${evidenceId}`);
  const assetEvidence = evidence.filter((row) => (row.stablecoin_ids ?? [row.stablecoin_id]).includes(spec.id));
  check(assetEvidence.length >= 4, `${spec.id}: expected at least four Evidence records, found ${assetEvidence.length}`);
  check(assetEvidence.every((row) => row.reliability === 'high'), `${spec.id}: all PR #429 Evidence must be high reliability`);
  check(assetEvidence.every((row) => typeof row.archived_url === 'string' && row.archived_url.length > 0), `${spec.id}: every new Evidence row requires an archive index`);

  check(Boolean(maps.reserveReports.get(spec.reserve)), `${spec.id}: reserve context missing`);
  const gaps = knownUnknowns.filter((row) => row.stablecoin_id === spec.id && row.id.startsWith(spec.gapPrefix));
  check(gaps.length === 3, `${spec.id}: expected exactly three known unknowns, found ${gaps.length}`);
  check(gaps.some((row) => row.severity === 'high'), `${spec.id}: high-severity known unknown missing`);

  const assetDeployments = deployments.filter((row) => row.stablecoin_id === spec.id);
  check(assetDeployments.length === spec.deployments.length, `${spec.id}: deployment count mismatch`);
  for (const deploymentId of spec.deployments) check(Boolean(maps.deployments.get(deploymentId)), `${spec.id}: missing deployment ${deploymentId}`);
  check(assetDeployments.filter((row) => row.is_primary === true).length === 1, `${spec.id}: exactly one primary deployment required`);
  check(assetDeployments.every((row) => row.verification_status === 'verified'), `${spec.id}: all deployment identifiers must be verified`);

  const legal = maps.legalProfiles.get(spec.id);
  check(Boolean(legal), `${spec.id}: legal profile missing`);
  check(legal?.holder_claim_type === 'direct_claim_on_issuer', `${spec.id}: legal claim mismatch`);
  check((legal?.claim_against_organization_ids ?? []).includes('sog_issuer_allunity'), `${spec.id}: legal issuer claim target missing`);
  check(Boolean(reserveComponents.find((row) => row.stablecoin_id === spec.id)), `${spec.id}: reserve component missing`);
  const income = maps.incomeProfiles.get(spec.id);
  check(income?.availability === 'none' && income?.accrual === 'none', `${spec.id}: income profile mismatch`);
}

check(maps.deployments.get('sog_dep_chfau_ethereum_pr429')?.contract_address === '0xBD4DfC058eb95b8De5ceAF39966A1a70F5556F78', 'CHFAU Ethereum contract mismatch');
check(maps.deployments.get('sog_dep_chfau_tempo_pr429')?.contract_address === '0x20C00000000000000000000042109aef2f8B28e1', 'CHFAU Tempo identifier mismatch');
for (const id of ['sog_dep_sekau_ethereum_pr429','sog_dep_sekau_polygon_pr429','sog_dep_sekau_base_pr429']) check(maps.deployments.get(id)?.contract_address === '0x0297B579B0CB603B5eE814EB7322b960D3ae7A66', `${id}: EVM contract mismatch`);
check(maps.deployments.get('sog_dep_sekau_solana_pr429')?.contract_address === 'Go6xKqsTwEWCsnzpW3ZLj9PYnPnZypFdqambKzGBP9J5', 'SEKAU Solana identifier mismatch');

check(promotions.length === 2, 'exactly two promotion mappings required');
check(promotions.every((row) => row.status === 'promoted' && row.promotion_pr === 429), 'promotion mapping semantics mismatch');
check(new Set(promotions.map((row) => row.promoted_record_id)).size === 2, 'promotion target IDs must be unique');
check(!stablecoins.some((row) => ['sog_st_plnq','sog_st_gbpq','sog_st_open_usd','sog_st_fiusd','sog_st_roughrider'].includes(row.id)), 'unauthorized third candidate promoted');
check(organizations.filter((row) => row.id === 'sog_issuer_allunity').length === 1, 'AllUnity organization must be reused exactly once');
check(marketAccess.length === 8, 'eight Market Access Records must be preserved');

check(checkpoint.status === 'reviewed_growth_checkpoint', 'canonical checkpoint status mismatch');
check(checkpoint.checkpoint_id === 'sog_record_growth_batch_2_canonical_114_checkpoint_pr429_2026_07_18', 'canonical checkpoint ID mismatch');
check(checkpoint.counts.assets === 114 && checkpoint.counts.evidence === 565 && checkpoint.counts.deployments === 180, 'canonical checkpoint counts mismatch');
check(checkpoint.counts.archive_index_count === 436 && checkpoint.counts.archive_not_recorded_count === 129, 'canonical archive counts mismatch');
check(parity.expected_v2_counts.stablecoins === 114 && parity.expected_v3_counts.legal_profiles === 114, 'parity baseline counts mismatch');
check(release.expected_public_record_counts.primary_records === 114 && release.expected_route_counts.total_detail === 410, 'release baseline counts mismatch');
check(statsCheckpoint.status === 'reviewed_growth_checkpoint' && statsCheckpoint.asset_count === 114, 'stats checkpoint mismatch');
check(history.snapshots.some((row) => row.checkpoint_id === statsCheckpoint.checkpoint_id && row.asset_count === 114), '114-asset stats snapshot missing');
check(handoff.status === 'reviewed_complete' && handoff.next_work_item === 'REVIEW_GATE', 'handoff exit state mismatch');

const requiredFiles = [
  'data/stablecoins-batch-aa.json','data/relationships-batch-aa.json','data/stablecoin-classification-batch-aa.json','data/batch-aa-reserve-redemption.json',
  'data/events-batch-aa.json','data/event-details-batch-aa.json','data/evidence-batch-aa.json','data/batch-aa-context.json','data/batch-aa-review-gaps.json',
  'data/batch-aa-deployments.json','data/aa-legal.json','data/batch-aa-components.json','data/batch-aa-income.json','data/candidate-promotions-batch-28.json',
  'docs/migration/registry-v2-baseline-batch-zb.json','docs/migration/record-growth-batch-2-pr429-handoff.json'
];
for (const file of requiredFiles) check(fs.existsSync(path.join(root, file)), `required PR #429 file missing: ${file}`);

if (failures.length) {
  console.error('PR #429 Record Growth Batch 2 validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  validation_id: 'sog_pr429_chfau_sekau_full_records',
  counts: actualCounts,
  promoted_assets: specs.map((row) => row.id),
  verified_deployments: config.verified_deployments,
  market_access_records_preserved: marketAccess.length,
  next_work_item: 'REVIEW_GATE'
}, null, 2));
