import fs from 'node:fs';
import path from 'node:path';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const root = process.cwd();
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const rows = (file) => {
  const value = readJson(file);
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.records)) return value.records;
  throw new Error(`${file}: expected array or { records: [] }`);
};
const group = (baseline, name) => (baseline.data_groups?.[name] ?? []).flatMap(rows);
const byId = (items) => new Map(items.map((row) => [row.id, row]));

const config = readJson('config/record-growth-batch-3-pr467.json');
const baseline = loadRegistryV2Baseline(root);
const foundation = readJson('docs/migration/registry-v3-foundation.json');
const incomeManifest = readJson('docs/migration/registry-v3-income-profiles.json');
const checkpoint = readJson('docs/migration/current-canonical-checkpoint.json');
const parity = readJson('docs/migration/registry-v3-parity-baseline.json');
const release = readJson('docs/migration/registry-release-integrity-baseline.json');
const handoff = readJson('docs/migration/record-growth-batch-3-pr467-handoff.json');
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
const promotions = readJson('data/candidate-promotions-batch-29.json');
const newStablecoins = readJson('data/stablecoins-batch-ab.json');
const newEvidence = readJson('data/evidence-batch-ab.json');
const newDeployments = readJson('data/batch-ab-deployments.json');

check(config.status === 'reviewed_complete', 'work-item status must be reviewed_complete');
check(config.preserved_boundaries?.review_gate_after_pr467 === true, 'PR #467 must exit at REVIEW GATE');

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
for (const [name, expected] of Object.entries(config.expected_post_promotion_counts)) {
  check(actualCounts[name] === expected, `${name}: expected ${expected}, found ${actualCounts[name]}`);
}
check(classifications.length === 116, `classifications: expected 116, found ${classifications.length}`);
check(profiles.length === 116, `profiles: expected 116, found ${profiles.length}`);
check(eventDetails.length === 191, `event_details: expected 191, found ${eventDetails.length}`);

const maps = {
  stablecoins: byId(stablecoins),
  organizations: byId(organizations),
  relationships: byId(relationships),
  classifications: byId(classifications),
  profiles: byId(profiles),
  events: byId(events),
  eventDetails: byId(eventDetails),
  evidence: byId(evidence),
  reserveReports: byId(reserveReports),
  deployments: byId(deployments),
  legalProfiles: byId(legalProfiles),
  incomeProfiles: byId(incomeProfiles)
};

const sharedEvidence = [
  'sog_src_quantoz_launch_pr467',
  'sog_src_quantoz_marketing_pr467',
  'sog_src_quantoz_transparency_pr467',
  'sog_src_dnb_quantoz_pr467'
];
const specs = [
  {
    id: 'sog_st_plnq',
    candidate: 'sog_cand_pr427_plnq',
    slug: 'plnq',
    symbol: 'PLNQ',
    peg: 'PLN',
    relationship: 'sog_rel_plnq_quantoz_pr467',
    event: 'sog_ev_plnq_launch_pr467',
    whitepaper: 'sog_src_plnq_whitepaper_pr467',
    reserve: 'sog_rr_plnq_reserve_context_pr467',
    gapPrefix: 'sog_ku_plnq_',
    deployment: 'sog_dep_plnq_ethereum_pr467',
    contract: '0x00B81d7B21955837890d9346e4978b6b43762b3A'
  },
  {
    id: 'sog_st_gbpq',
    candidate: 'sog_cand_pr427_gbpq',
    slug: 'gbpq',
    symbol: 'GBPQ',
    peg: 'GBP',
    relationship: 'sog_rel_gbpq_quantoz_pr467',
    event: 'sog_ev_gbpq_launch_pr467',
    whitepaper: 'sog_src_gbpq_whitepaper_pr467',
    reserve: 'sog_rr_gbpq_reserve_context_pr467',
    gapPrefix: 'sog_ku_gbpq_',
    deployment: 'sog_dep_gbpq_ethereum_pr467',
    contract: '0xb92e69fd39bf33ee1f81e56b0b7933bdc49df46e'
  }
];

for (const spec of specs) {
  const asset = maps.stablecoins.get(spec.id);
  check(Boolean(asset), `${spec.id}: stablecoin missing`);
  check(asset?.slug === spec.slug && asset?.symbol === spec.symbol, `${spec.id}: identity mismatch`);
  check(asset?.peg_asset === spec.peg, `${spec.id}: peg mismatch`);
  check(asset?.launch_date === '2026-04-14' && asset?.status === 'active', `${spec.id}: lifecycle mismatch`);
  check(asset?.issuer_id === 'sog_issuer_quantoz_payments', `${spec.id}: must reuse Quantoz issuer`);
  check(asset?.confidence === 'high', `${spec.id}: confidence must be high`);

  const relationship = maps.relationships.get(spec.relationship);
  check(relationship?.organization_id === 'sog_issuer_quantoz_payments' && relationship?.stablecoin_id === spec.id, `${spec.id}: issuer relationship mismatch`);
  check(relationship?.role === 'legal_issuer' && relationship?.status === 'active', `${spec.id}: relationship semantics mismatch`);

  const classification = maps.classifications.get(spec.id);
  check(classification?.lifecycle_status === 'active', `${spec.id}: classification lifecycle mismatch`);
  check(classification?.issuance_status === 'restricted', `${spec.id}: issuance mismatch`);
  check(classification?.stabilization_mechanism === 'issuer_redemption', `${spec.id}: stabilization mismatch`);
  check(Boolean(maps.profiles.get(spec.id)), `${spec.id}: reserve/redemption profile missing`);

  check(maps.events.get(spec.event)?.event_date === '2026-04-14', `${spec.id}: launch event mismatch`);
  check(maps.eventDetails.get(spec.event)?.event_detail_kind === 'launch', `${spec.id}: typed launch detail missing`);

  for (const evidenceId of [...sharedEvidence, spec.whitepaper]) {
    check(Boolean(maps.evidence.get(evidenceId)), `${spec.id}: missing Evidence ${evidenceId}`);
  }
  const assetEvidence = newEvidence.filter((row) => (row.stablecoin_ids ?? [row.stablecoin_id]).includes(spec.id));
  check(assetEvidence.length === 5, `${spec.id}: expected five linked new Evidence records, found ${assetEvidence.length}`);
  check(assetEvidence.every((row) => row.reliability === 'high'), `${spec.id}: Evidence reliability mismatch`);
  check(assetEvidence.every((row) => typeof row.archived_url === 'string' && row.archived_url.length > 0), `${spec.id}: archive index missing`);

  check(Boolean(maps.reserveReports.get(spec.reserve)), `${spec.id}: reserve context missing`);
  const gaps = knownUnknowns.filter((row) => row.stablecoin_id === spec.id && row.id.startsWith(spec.gapPrefix));
  check(gaps.length === 3, `${spec.id}: expected exactly three known unknowns, found ${gaps.length}`);
  check(gaps.some((row) => row.severity === 'high'), `${spec.id}: high-severity reserve unknown missing`);

  const assetDeployments = newDeployments.filter((row) => row.stablecoin_id === spec.id);
  check(assetDeployments.length === 1, `${spec.id}: exactly one verified deployment required`);
  const deployment = maps.deployments.get(spec.deployment);
  check(deployment?.chain === 'ethereum' && deployment?.contract_address === spec.contract, `${spec.id}: Ethereum contract mismatch`);
  check(deployment?.verification_status === 'verified' && deployment?.is_primary === true, `${spec.id}: deployment verification mismatch`);

  const legal = maps.legalProfiles.get(spec.id);
  check(legal?.holder_claim_type === 'direct_claim_on_issuer', `${spec.id}: legal claim mismatch`);
  check((legal?.claim_against_organization_ids ?? []).includes('sog_issuer_quantoz_payments'), `${spec.id}: legal issuer target missing`);
  check(Boolean(reserveComponents.find((row) => row.stablecoin_id === spec.id)), `${spec.id}: reserve component missing`);
  const income = maps.incomeProfiles.get(spec.id);
  check(income?.availability === 'none' && income?.accrual === 'none', `${spec.id}: income profile mismatch`);
}

check(newStablecoins.length === 2, 'exactly two new stable assets required');
check(newEvidence.length === 6, 'exactly six new Evidence records required');
check(newDeployments.length === 2 && newDeployments.every((row) => row.chain === 'ethereum'), 'only two verified Ethereum deployments may be added');
check(promotions.length === 2, 'exactly two promotion mappings required');
check(promotions.every((row) => row.status === 'promoted' && row.promotion_pr === 467), 'promotion semantics mismatch');
check(JSON.stringify(promotions.map((row) => row.candidate_id).sort()) === JSON.stringify(['sog_cand_000115', 'sog_cand_000116']), 'promotion candidate IDs mismatch');
check(new Set(promotions.map((row) => row.promoted_record_id)).size === 2, 'promotion target IDs must be unique');
check(organizations.filter((row) => row.id === 'sog_issuer_quantoz_payments').length === 1, 'Quantoz organization must be reused exactly once');
check(marketAccess.length === 8, 'eight Market Access Records must be preserved');

check(checkpoint.checkpoint_id === 'sog_record_growth_batch_3_canonical_116_checkpoint_pr467_2026_07_25', 'canonical checkpoint ID mismatch');
check(checkpoint.counts.assets === 116 && checkpoint.counts.evidence === 571 && checkpoint.counts.deployments === 182, 'canonical checkpoint counts mismatch');
check(checkpoint.counts.archive_index_count === 442 && checkpoint.counts.archive_not_recorded_count === 129, 'canonical archive counts mismatch');
check(parity.expected_v2_counts.stablecoins === 116 && parity.expected_v3_counts.legal_profiles === 116, 'parity baseline counts mismatch');
check(release.expected_public_record_counts.primary_records === 116 && release.expected_route_counts.total_detail === 414, 'release baseline counts mismatch');
check(statsCheckpoint.asset_count === 116 && statsCheckpoint.previous_history_checkpoint_id === 'sog_record_growth_batch_2_114_checkpoint_pr429_2026_07_18', 'stats checkpoint chain mismatch');
const previousSnapshot = history.snapshots.find((row) => row.checkpoint_id === 'sog_record_growth_batch_2_114_checkpoint_pr429_2026_07_18');
check(previousSnapshot?.snapshot_sha256 === 'eb893ff27c2a6880fabfed805caf70d4bca59dff6bb3332123142edd42a7dc4d', 'immutable PR #429 stats-history prefix changed');
check(history.snapshots.at(-1)?.checkpoint_id === statsCheckpoint.checkpoint_id && history.snapshots.at(-1)?.asset_count === 116, '116-asset stats snapshot must be final');
check(handoff.status === 'reviewed_complete' && handoff.next_work_item === 'REVIEW_GATE', 'handoff exit state mismatch');

const wiring = [
  ['src/lib/data/registry.ts', 'stablecoins-batch-ab.json'],
  ['src/lib/data/registry.ts', 'evidence-batch-ab.json'],
  ['src/lib/data/currentProfiles.ts', 'batch-ab-reserve-redemption.json'],
  ['src/lib/data/registryV3.ts', 'ab-legal.json'],
  ['src/lib/data/registryV3.ts', 'batch-ab-components.json'],
  ['src/lib/data/incomeProfilesV3.ts', 'batch-ab-income.json'],
  ['docs/migration/registry-v3-foundation.json', 'data/ab-legal.json'],
  ['docs/migration/registry-v3-income-profiles.json', 'data/batch-ab-income.json']
];
for (const [file, marker] of wiring) check(readText(file).includes(marker), `${file}: missing loader/manifest wiring for ${marker}`);

const requiredFiles = [
  'data/stablecoins-batch-ab.json', 'data/relationships-batch-ab.json', 'data/stablecoin-classification-batch-ab.json',
  'data/batch-ab-reserve-redemption.json', 'data/events-batch-ab.json', 'data/event-details-batch-ab.json',
  'data/evidence-batch-ab.json', 'data/batch-ab-context.json', 'data/batch-ab-review-gaps.json',
  'data/batch-ab-deployments.json', 'data/ab-legal.json', 'data/batch-ab-components.json',
  'data/batch-ab-income.json', 'data/candidate-stable-assets-growth-116.json', 'data/candidate-promotions-batch-29.json',
  'data/deployment-verification-growth-pr467.json',
  'docs/migration/registry-v2-baseline-batch-zc.json', 'docs/migration/record-growth-batch-3-pr467-handoff.json'
];
for (const file of requiredFiles) check(fs.existsSync(path.join(root, file)), `required PR #467 file missing: ${file}`);

if (failures.length) {
  console.error('PR #467 Record Growth Batch 3 validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  validation_id: 'sog_pr467_plnq_gbpq_full_records',
  counts: actualCounts,
  promoted_assets: specs.map((row) => row.id),
  verified_deployments: config.verified_deployments,
  market_access_records_preserved: marketAccess.length,
  next_work_item: 'REVIEW_GATE'
}, null, 2));
