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

const launchEventId = 'sog_ev_vai_2020_11_launch';

const stablecoinPath = 'data/stablecoins-batch-g.json';
const stablecoins = readJson(stablecoinPath);
const vai = requireRow(stablecoins, 'sog_st_vai', stablecoinPath);
vai.status = 'active';
vai.launch_date = '2020-11-24';
vai.discontinued_date = null;
vai.summary = "Venus Protocol's USD-pegged stablecoin on BNB Chain, publicly mintable against supported collateral from the Venus mainnet launch on November 24, 2020, and later supported by stability-fee and peg-stability mechanisms.";
vai.confidence = 'high';
vai.last_verified_at = '2026-06-25';
vai.notes = 'Canonical public launch is 2020-11-24, when Venus announced mainnet operation and public VAI minting. The 2020-10-17 alpha testnet explicitly described VAI minting as future beta functionality. Exact contract deployment, first mint, initial distribution, later stability-fee changes, PSM deployment, and current Prime access conditions remain separate boundaries.';
writeJson(stablecoinPath, stablecoins);

const eventsPath = 'data/events-batch-g.json';
const events = readJson(eventsPath);
ensureAbsent(events, launchEventId, eventsPath);
events.push({
  id: launchEventId,
  stablecoin_id: 'sog_st_vai',
  issuer_id: 'sog_issuer_venus_protocol',
  event_type: 'launch',
  event_date: '2020-11-24',
  title: 'Venus launches mainnet and public VAI minting',
  description: 'Venus Protocol announced that its main network had officially launched on Binance Smart Chain and that users could mint VAI against supported collateral through the live Venus application.',
  impact_level: 'high',
  confidence: 'high',
  source_count: 2,
  event_status_effect: 'active',
  recovered: null,
  recovery_date: null,
  failure_mechanism: 'product_launch',
  notes: 'The October 17 alpha-testnet announcement still described VAI minting as future beta functionality. Exact contract deployment and first mint remain unresolved.'
});
const modelEvent = requireRow(events, 'sog_ev_vai_protocol_model_batch_g', eventsPath);
modelEvent.notes = 'This event records the later and current protocol model. VAI public launch is separately fixed to 2020-11-24; stability-fee changes and PSM deployment are later lifecycle boundaries.';
writeJson(eventsPath, events);

const detailsPath = 'data/event-details-batch-g.json';
const details = readJson(detailsPath);
ensureAbsent(details, launchEventId, detailsPath);
details.push({
  id: launchEventId,
  title: 'Venus launches mainnet and public VAI minting',
  subject_stablecoin_ids: ['sog_st_vai'],
  subject_organization_ids: ['sog_issuer_venus_protocol'],
  evidence_ids: ['sog_src_vai_testnet_prelaunch_2020', 'sog_src_vai_mainnet_launch_2020'],
  event_detail_kind: 'launch',
  launch_detail: {
    summary: 'Venus mainnet launched on 2020-11-24 and enabled users to mint VAI against supported collateral.',
    status: 'active',
    related_organization_ids: ['sog_issuer_venus_protocol']
  }
});
writeJson(detailsPath, details);

const evidencePath = 'data/evidence-batch-n.json';
const evidence = readJson(evidencePath);
const additions = [
  {
    id: 'sog_src_vai_testnet_prelaunch_2020',
    stablecoin_id: 'sog_st_vai',
    issuer_id: 'sog_issuer_venus_protocol',
    event_id: launchEventId,
    source_type: 'official_blog',
    title: 'Venus Protocol Testnet Launch',
    url: 'https://medium.com/venusprotocol/venus-protocol-testnet-launch-6b3641c0d5d7',
    publisher: 'Venus Protocol',
    published_at: '2020-10-17',
    archived_url: 'https://web.archive.org/web/*/https://medium.com/venusprotocol/venus-protocol-testnet-launch-6b3641c0d5d7',
    accessed_at: '2026-06-25',
    reliability: 'high',
    claim_scope: 'explicit_prelaunch_testnet_boundary',
    stablecoin_ids: ['sog_st_vai'],
    organization_ids: ['sog_issuer_venus_protocol'],
    event_ids: [launchEventId],
    claim_scopes: ['alpha_testnet', 'vai_minting_future_beta', 'pre_mainnet_boundary'],
    notes: 'First-party alpha-testnet article explicitly states that VAI minting would be released in a later beta stage and that mainnet remained a future milestone.'
  },
  {
    id: 'sog_src_vai_mainnet_launch_2020',
    stablecoin_id: 'sog_st_vai',
    issuer_id: 'sog_issuer_venus_protocol',
    event_id: launchEventId,
    source_type: 'official_blog',
    title: 'Venus Protocol Main Network Launched',
    url: 'https://medium.com/venusprotocol/venus-protocol-main-network-launched-52ea9929091f',
    publisher: 'Venus Protocol',
    published_at: '2020-11-24',
    archived_url: 'https://web.archive.org/web/*/https://medium.com/venusprotocol/venus-protocol-main-network-launched-52ea9929091f',
    accessed_at: '2026-06-25',
    reliability: 'high',
    claim_scope: 'same_day_mainnet_and_vai_public_launch',
    stablecoin_ids: ['sog_st_vai'],
    organization_ids: ['sog_issuer_venus_protocol'],
    event_ids: [launchEventId],
    claim_scopes: ['launch_date', 'mainnet_launch', 'public_vai_minting', 'supported_collateral'],
    notes: 'First-party same-day launch statement that Venus mainnet was live and users could mint VAI through the public application.'
  }
];
for (const row of additions) {
  ensureAbsent(evidence, row.id, evidencePath);
  evidence.push(row);
}
writeJson(evidencePath, evidence);

const deploymentPath = 'data/deployments-batch-g.json';
const deployments = readJson(deploymentPath);
const deployment = requireRow(deployments, 'sog_dep_vai_bnb_batch_g', deploymentPath);
deployment.control_event_ids = [launchEventId, 'sog_ev_vai_protocol_model_batch_g'];
deployment.notes = 'Official Venus VAI BNB Chain deployment. Public mainnet minting is fixed to 2020-11-24; the exact contract-creation timestamp and first VAI mint transaction remain unresolved.';
deployment.evidence_ids = ['sog_src_vai_docs_batch_g', 'sog_src_vai_contracts_batch_g', 'sog_src_vai_testnet_prelaunch_2020', 'sog_src_vai_mainnet_launch_2020'];
writeJson(deploymentPath, deployments);

const unknownPath = 'data/known-unknowns-batch-g.json';
const unknowns = readJson(unknownPath);
const launchUnknown = requireRow(unknowns, 'sog_ku_vai_launch_date_batch_g', unknownPath);
launchUnknown.topic = 'exact_contract_deployment_first_mint_and_initial_distribution';
launchUnknown.description = 'The public Venus mainnet and VAI minting launch is fixed to 2020-11-24. The exact VAI contract-creation timestamp, first mint transaction, and initial distribution sequence are not normalized.';
launchUnknown.severity = 'low';
launchUnknown.last_checked_at = '2026-06-25';
launchUnknown.notes = 'The unresolved deployment and first-mint details do not override the documented public mainnet launch boundary.';
writeJson(unknownPath, unknowns);

const queuePath = 'data/quality/launch-date-unresolved.json';
const queue = readJson(queuePath);
const before = queue.records.length;
queue.records = queue.records.filter((row) => row.stablecoin_id !== 'sog_st_vai');
if (queue.records.length !== before - 1) throw new Error(`${queuePath}: expected exactly one VAI row`);
queue.expected_total = 20;
queue.category_counts.C = 14;
queue.frozen_at = '2026-06-25';
writeJson(queuePath, queue);
