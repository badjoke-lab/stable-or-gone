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

const launchEventId = 'sog_ev_vchf_2022_12_launch';

const stablecoinPath = 'data/stablecoins-batch-j.json';
const stablecoins = readJson(stablecoinPath);
const vchf = requireRow(stablecoins, 'sog_st_vchf', stablecoinPath);
vchf.status = 'active';
vchf.launch_date = '2022-12-15';
vchf.discontinued_date = null;
vchf.summary = 'Multichain Swiss-franc-referencing token launched by VNX Commodities on December 15, 2022 with original Ethereum issuance and issuer or exchange access, followed by later network expansions.';
vchf.confidence = 'high';
vchf.last_verified_at = '2026-06-25';
vchf.notes = 'Canonical launch is 2022-12-15, when VNX announced VEUR and VCHF launch with trading, deposit, and withdrawal access through Emirex. A 2022-12-27 first-party recap confirms December launch and Ethereum issuance. Later network launches and listings remain separate deployment or distribution boundaries.';
writeJson(stablecoinPath, stablecoins);

const eventsPath = 'data/events-batch-j.json';
const events = readJson(eventsPath);
ensureAbsent(events, launchEventId, eventsPath);
events.push({
  id: launchEventId,
  stablecoin_id: 'sog_st_vchf',
  issuer_id: 'sog_issuer_vnx_commodities',
  event_type: 'launch',
  event_date: '2022-12-15',
  title: 'VNX launches VNX Swiss Franc',
  description: 'VNX announced the launch of VNX Euro and VNX Swiss Franc, with users able to trade, deposit, and withdraw the tokens through Emirex. The initial VCHF issuance was on Ethereum.',
  impact_level: 'high',
  confidence: 'high',
  source_count: 2,
  event_status_effect: 'active',
  recovered: null,
  recovery_date: null,
  failure_mechanism: 'product_launch',
  notes: 'Later launches on Polygon, Avalanche, Stellar, Solana, Tezos, and other networks are separate deployment or distribution boundaries.'
});
const activeEvent = requireRow(events, 'sog_ev_vchf_active_batch_j', eventsPath);
activeEvent.event_date = '2026-06-25';
activeEvent.title = 'VCHF remains active after its 2022 launch and multichain expansion';
activeEvent.description = 'VCHF launched on December 15, 2022 and remains represented across multiple networks with issuer and market access documented separately from the original launch.';
activeEvent.source_count = 5;
activeEvent.notes = 'The original launch is now separately fixed. Reserve composition and the complete multichain deployment map remain known unknowns.';
writeJson(eventsPath, events);

const detailsPath = 'data/event-details-batch-j.json';
const details = readJson(detailsPath);
ensureAbsent(details, launchEventId, detailsPath);
details.push({
  id: launchEventId,
  title: 'VNX launches VNX Swiss Franc',
  subject_stablecoin_ids: ['sog_st_vchf'],
  subject_organization_ids: ['sog_issuer_vnx_commodities'],
  evidence_ids: ['sog_src_vchf_launch_2022', 'sog_src_vchf_recap_2022'],
  event_detail_kind: 'launch',
  launch_detail: {
    summary: 'VNX launched VCHF on 2022-12-15 with original Ethereum issuance and user access through Emirex.',
    status: 'active',
    related_organization_ids: ['sog_issuer_vnx_commodities']
  }
});
const activeDetail = requireRow(details, 'sog_ev_vchf_active_batch_j', detailsPath);
activeDetail.title = 'VCHF remains active after its 2022 launch and multichain expansion';
activeDetail.evidence_ids = ['sog_src_vchf_product_batch_j', 'sog_src_vchf_license_batch_j', 'sog_src_vchf_exchange_batch_j', 'sog_src_vchf_launch_2022', 'sog_src_vchf_recap_2022'];
writeJson(detailsPath, details);

const evidencePath = 'data/evidence-batch-n.json';
const evidence = readJson(evidencePath);
const additions = [
  {
    id: 'sog_src_vchf_launch_2022',
    stablecoin_id: 'sog_st_vchf',
    issuer_id: 'sog_issuer_vnx_commodities',
    event_id: launchEventId,
    source_type: 'official_blog',
    title: 'VNX launches Europe’s first tokens referencing fiat currencies',
    url: 'https://medium.com/@vnx/vnx-launches-europes-first-tokens-referencing-fiat-currencies-with-an-underlying-gold-base-value-26867d197042',
    publisher: 'VNX',
    published_at: '2022-12-15',
    archived_url: 'https://web.archive.org/web/*/https://medium.com/@vnx/vnx-launches-europes-first-tokens-referencing-fiat-currencies-with-an-underlying-gold-base-value-26867d197042',
    accessed_at: '2026-06-25',
    reliability: 'high',
    claim_scope: 'same_day_product_launch_and_public_access',
    stablecoin_ids: ['sog_st_vchf'],
    organization_ids: ['sog_issuer_vnx_commodities'],
    event_ids: [launchEventId],
    claim_scopes: ['launch_date', 'vchf_identity', 'emirex_access', 'trade_deposit_withdraw'],
    notes: 'First-party same-day launch release for VEUR and VCHF.'
  },
  {
    id: 'sog_src_vchf_recap_2022',
    stablecoin_id: 'sog_st_vchf',
    issuer_id: 'sog_issuer_vnx_commodities',
    event_id: launchEventId,
    source_type: 'official_blog',
    title: 'VNX’s Recap of 2022',
    url: 'https://vnx.li/vnxs-recap-of-2022/',
    publisher: 'VNX',
    published_at: '2022-12-27',
    archived_url: 'https://web.archive.org/web/*/https://vnx.li/vnxs-recap-of-2022/',
    accessed_at: '2026-06-25',
    reliability: 'high',
    claim_scope: 'launch_retrospective_and_initial_deployment',
    stablecoin_ids: ['sog_st_vchf'],
    organization_ids: ['sog_issuer_vnx_commodities'],
    event_ids: [launchEventId],
    claim_scopes: ['december_2022_launch', 'ethereum_issuance', 'emirex_listing'],
    notes: 'First-party year-end review corroborating December launch and original Ethereum issuance.'
  }
];
for (const row of additions) {
  ensureAbsent(evidence, row.id, evidencePath);
  evidence.push(row);
}
writeJson(evidencePath, evidence);

const deploymentPath = 'data/deployments-batch-j.json';
const deployments = readJson(deploymentPath);
const deployment = requireRow(deployments, 'sog_dep_vchf_ethereum_batch_j', deploymentPath);
deployment.control_event_ids = [launchEventId, 'sog_ev_vchf_active_batch_j'];
deployment.notes = 'Original VCHF Ethereum issuance was publicly launched on 2022-12-15. Exact first issuance transaction and the complete later multichain deployment map remain unresolved.';
deployment.evidence_ids = ['sog_src_vchf_product_batch_j', 'sog_src_vchf_exchange_batch_j', 'sog_src_vchf_launch_2022', 'sog_src_vchf_recap_2022'];
writeJson(deploymentPath, deployments);

const unknownPath = 'data/known-unknowns-batch-j.json';
const unknowns = readJson(unknownPath);
const deploymentUnknown = requireRow(unknowns, 'sog_ku_vchf_complete_deployments_batch_j', unknownPath);
deploymentUnknown.topic = 'exact_first_issuance_and_complete_network_map';
deploymentUnknown.description = 'The public VCHF launch is fixed to 2022-12-15 and original Ethereum issuance is established, but the exact first issuance transaction, initial distribution sequence, and complete canonical or bridged multichain contract map are not normalized.';
deploymentUnknown.severity = 'medium';
deploymentUnknown.last_checked_at = '2026-06-25';
deploymentUnknown.notes = 'The unresolved first issuance and later deployment map do not override the documented public launch boundary.';
writeJson(unknownPath, unknowns);

const queuePath = 'data/quality/launch-date-unresolved.json';
const queue = readJson(queuePath);
const before = queue.records.length;
queue.records = queue.records.filter((row) => row.stablecoin_id !== 'sog_st_vchf');
if (queue.records.length !== before - 1) throw new Error(`${queuePath}: expected exactly one VCHF row`);
queue.expected_total = 19;
queue.category_counts.C = 13;
queue.frozen_at = '2026-06-25';
writeJson(queuePath, queue);
