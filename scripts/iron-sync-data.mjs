import fs from 'node:fs';

const readJson = (path) => JSON.parse(fs.readFileSync(path, 'utf8'));
const writeJson = (path, value) => fs.writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
const requireRow = (rows, id, path) => {
  const row = rows.find((item) => item.id === id);
  if (!row) throw new Error(`${path}: missing ${id}`);
  return row;
};
const ensureAbsent = (rows, id, path) => {
  if (rows.some((item) => item.id === id)) throw new Error(`${path}: duplicate ${id}`);
};

const bscLaunchEventId = 'sog_ev_iron_2021_03_bsc_launch';
const polygonLaunchEventId = 'sog_ev_iron_2021_05_polygon_launch';
const collapseEventId = 'sog_ev_iron_2021_06_collapse';

const stablecoinPath = 'data/stablecoins-batch-d.json';
const stablecoins = readJson(stablecoinPath);
const iron = requireRow(stablecoins, 'sog_st_iron', stablecoinPath);
iron.status = 'failed';
iron.launch_date = '2021-03-06';
iron.discontinued_date = '2021-06-16';
iron.summary = 'Partially collateralized IRON stablecoin launched on Binance Smart Chain on March 6, 2021 and expanded through a separate Polygon deployment on May 18, 2021. The original Polygon IRON and TITAN design failed during the June 2021 bank run.';
iron.confidence = 'high';
iron.last_verified_at = '2026-06-25';
iron.notes = 'Canonical entity-level launch is the original BSC public protocol launch on 2021-03-06. Polygon used a separate IRON/TITAN token set launched on 2021-05-18. The Polygon system collapsed on 2021-06-16. A redesigned IRON v2 launched later in August 2021 and is preserved as a separate post-collapse product boundary rather than evidence that the original failed design recovered.';
writeJson(stablecoinPath, stablecoins);

const eventsPath = 'data/events-batch-d.json';
const events = readJson(eventsPath);
ensureAbsent(events, bscLaunchEventId, eventsPath);
ensureAbsent(events, polygonLaunchEventId, eventsPath);
events.push(
  {
    id: bscLaunchEventId,
    stablecoin_id: 'sog_st_iron',
    issuer_id: 'sog_issuer_iron_finance',
    event_type: 'launch',
    event_date: '2021-03-06',
    title: 'Iron Finance launches the original IRON protocol on BSC',
    description: 'Iron Finance launched the original partially collateralized IRON protocol on Binance Smart Chain, with public minting, redemption, liquidity, and an initial fully collateralized rollout phase.',
    impact_level: 'high',
    event_status_effect: 'active',
    recovered: null,
    recovery_date: null,
    failure_mechanism: 'product_launch',
    confidence: 'high',
    source_count: 1,
    notes: 'This is the earliest public launch of the IRON entity. Exact BSC contract identity and first mint remain unresolved.'
  },
  {
    id: polygonLaunchEventId,
    stablecoin_id: 'sog_st_iron',
    issuer_id: 'sog_issuer_iron_finance',
    event_type: 'launch',
    event_date: '2021-05-18',
    title: 'Iron Finance launches a separate IRON deployment on Polygon',
    description: 'Iron Finance expanded to Polygon with a separate IRON token collateralized by USDC and TITAN rather than bridging the original BSC token set.',
    impact_level: 'high',
    event_status_effect: 'active',
    recovered: null,
    recovery_date: null,
    failure_mechanism: 'network_expansion',
    confidence: 'high',
    source_count: 1,
    notes: 'This is a later chain deployment, not the original entity-level launch. The Polygon deployment became the principal June 2021 collapse case.'
  }
);
const collapseEvent = requireRow(events, collapseEventId, eventsPath);
collapseEvent.notes = 'The terminal June 2021 event applies to the original Polygon IRON and TITAN design. The earlier BSC deployment and the later redesigned IRON v2 remain separate lifecycle boundaries.';
writeJson(eventsPath, events);

const detailsPath = 'data/event-details-batch-d.json';
const details = readJson(detailsPath);
ensureAbsent(details, bscLaunchEventId, detailsPath);
ensureAbsent(details, polygonLaunchEventId, detailsPath);
details.push(
  {
    id: bscLaunchEventId,
    title: 'Iron Finance launches the original IRON protocol on BSC',
    subject_stablecoin_ids: ['sog_st_iron'],
    subject_organization_ids: ['sog_issuer_iron_finance'],
    evidence_ids: ['sog_src_iron_bsc_launch_2021'],
    event_detail_kind: 'launch',
    launch_detail: {
      summary: 'The original IRON protocol opened publicly on Binance Smart Chain on 2021-03-06.',
      status: 'failed',
      related_organization_ids: ['sog_issuer_iron_finance']
    }
  },
  {
    id: polygonLaunchEventId,
    title: 'Iron Finance launches a separate IRON deployment on Polygon',
    subject_stablecoin_ids: ['sog_st_iron'],
    subject_organization_ids: ['sog_issuer_iron_finance'],
    evidence_ids: ['sog_src_iron_polygon_launch_2021'],
    event_detail_kind: 'other'
  }
);
writeJson(detailsPath, details);

const evidencePath = 'data/evidence-batch-n.json';
const evidence = readJson(evidencePath);
const additions = [
  {
    id: 'sog_src_iron_bsc_launch_2021',
    stablecoin_id: 'sog_st_iron',
    issuer_id: 'sog_issuer_iron_finance',
    event_id: bscLaunchEventId,
    source_type: 'official_blog',
    title: 'IRON: The first partial-collateralized stablecoin on Binance Smart Chain',
    url: 'https://ironfinance.medium.com/iron-the-first-partial-collateralized-stablecoin-on-binance-smart-chain-8c22c426cace',
    publisher: 'Iron Finance',
    published_at: '2021-03-04',
    archived_url: 'https://web.archive.org/web/*/https://ironfinance.medium.com/iron-the-first-partial-collateralized-stablecoin-on-binance-smart-chain-8c22c426cace',
    accessed_at: '2026-06-25',
    reliability: 'high',
    claim_scope: 'original_bsc_public_launch',
    stablecoin_ids: ['sog_st_iron'],
    organization_ids: ['sog_issuer_iron_finance'],
    event_ids: [bscLaunchEventId],
    claim_scopes: ['launch_date', 'bsc_launch', 'minting', 'redemption', 'liquidity_rollout'],
    notes: 'First-party article fixing the original IRON protocol launch to 2021-03-06 at 11:00 UTC.'
  },
  {
    id: 'sog_src_iron_polygon_launch_2021',
    stablecoin_id: 'sog_st_iron',
    issuer_id: 'sog_issuer_iron_finance',
    event_id: polygonLaunchEventId,
    source_type: 'official_blog',
    title: 'Iron Finance Expansion to Polygon',
    url: 'https://ironfinance.medium.com/iron-finance-expansion-to-polygon-8a714ba5635e',
    publisher: 'Iron Finance',
    published_at: '2021-05-16',
    archived_url: 'https://web.archive.org/web/*/https://ironfinance.medium.com/iron-finance-expansion-to-polygon-8a714ba5635e',
    accessed_at: '2026-06-25',
    reliability: 'high',
    claim_scope: 'polygon_network_launch_and_separate_token_set',
    stablecoin_ids: ['sog_st_iron'],
    organization_ids: ['sog_issuer_iron_finance'],
    event_ids: [polygonLaunchEventId],
    claim_scopes: ['polygon_launch_date', 'separate_deployment', 'usdc_titan_collateral', 'bsc_predecessor'],
    notes: 'First-party expansion article fixing Polygon launch to 2021-05-18 and stating that Iron Finance first launched on BSC.'
  },
  {
    id: 'sog_src_iron_v2_launch_2021',
    stablecoin_id: 'sog_st_iron',
    issuer_id: 'sog_issuer_iron_finance',
    event_id: null,
    source_type: 'official_blog',
    title: 'IRON Stablecoin Launch — 25 August 2021',
    url: 'https://ironfinance.medium.com/iron-stablecoin-launch-606941fff49f',
    publisher: 'Iron Finance',
    published_at: '2021-08-24',
    archived_url: 'https://web.archive.org/web/*/https://ironfinance.medium.com/iron-stablecoin-launch-606941fff49f',
    accessed_at: '2026-06-25',
    reliability: 'high',
    claim_scope: 'post_collapse_redesigned_v2_launch',
    stablecoin_ids: ['sog_st_iron'],
    organization_ids: ['sog_issuer_iron_finance'],
    event_ids: [],
    claim_scopes: ['v2_launch', 'redesigned_collateral_model', 'post_collapse_successor_boundary'],
    notes: 'The August 2021 product used a redesigned overcollateralized model with ICE and IronLend. It is not treated as recovery of the failed v1 deployment without a separate lineage determination.'
  }
];
for (const row of additions) {
  ensureAbsent(evidence, row.id, evidencePath);
  evidence.push(row);
}
writeJson(evidencePath, evidence);

const deploymentPath = 'data/deployments-batch-d.json';
const deployments = readJson(deploymentPath);
ensureAbsent(deployments, 'sog_dep_iron_bnb_batch_d', deploymentPath);
deployments.splice(1, 0, {
  id: 'sog_dep_iron_bnb_batch_d',
  stablecoin_id: 'sog_st_iron',
  chain: 'BNB Smart Chain',
  deployment_type: 'historical_original_issuance',
  contract_address: null,
  status: 'failed_or_inactive',
  control_event_ids: [bscLaunchEventId],
  notes: 'Original IRON protocol deployment launched on 2021-03-06 using BUSD, USDT, and the STEEL share token. Exact contract identity, first mint, and final BSC lifecycle remain unresolved.',
  evidence_ids: ['sog_src_iron_bsc_launch_2021']
});
const polygonDeployment = requireRow(deployments, 'sog_dep_iron_polygon_batch_d', deploymentPath);
polygonDeployment.control_event_ids = [polygonLaunchEventId, collapseEventId];
polygonDeployment.notes = 'Separate Polygon IRON deployment launched on 2021-05-18 using USDC and TITAN. This deployment became the principal June 2021 bank-run and collapse case.';
polygonDeployment.evidence_ids = ['sog_src_iron_contract_batch_d', 'sog_src_iron_polygon_launch_2021', 'sog_src_iron_fed_batch_d', 'sog_src_iron_postmortem_batch_d'];
writeJson(deploymentPath, deployments);

const unknownPath = 'data/known-unknowns-batch-d.json';
const unknowns = readJson(unknownPath);
const bnbUnknown = requireRow(unknowns, 'sog_unk_iron_bnb_identity_batch_d', unknownPath);
bnbUnknown.topic = 'bnb_contract_first_mint_and_final_lifecycle';
bnbUnknown.description = 'The original BSC public launch is fixed to 2021-03-06, but the complete BSC contract identity, exact first mint, supply history, and final deployment lifecycle are not normalized.';
bnbUnknown.last_checked_at = '2026-06-25';
bnbUnknown.notes = 'Do not copy Polygon contract identity or collapse metrics onto the BSC deployment.';
ensureAbsent(unknowns, 'sog_unk_iron_v1_v2_lineage_batch_d', unknownPath);
unknowns.push({
  id: 'sog_unk_iron_v1_v2_lineage_batch_d',
  stablecoin_id: 'sog_st_iron',
  issuer_id: 'sog_issuer_iron_finance',
  topic: 'v1_v2_token_and_liability_continuity',
  description: 'Iron Finance launched a redesigned IRON v2 in August 2021 after stating that the stablecoin would be rebuilt from scratch. Token-contract continuity, holder migration, liability continuity, and the final v2 lifecycle are not normalized.',
  severity: 'high',
  last_checked_at: '2026-06-25',
  notes: 'Do not treat the v2 launch as recovery of the original failed BSC or Polygon deployment without separate evidence.'
});
writeJson(unknownPath, unknowns);

const queuePath = 'data/quality/launch-date-unresolved.json';
const queue = readJson(queuePath);
const before = queue.records.length;
queue.records = queue.records.filter((row) => row.stablecoin_id !== 'sog_st_iron');
if (queue.records.length !== before - 1) throw new Error(`${queuePath}: expected exactly one IRON row`);
queue.expected_total = 18;
queue.category_counts.C = 12;
queue.frozen_at = '2026-06-25';
writeJson(queuePath, queue);
