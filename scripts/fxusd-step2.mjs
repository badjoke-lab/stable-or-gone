import fs from 'node:fs';
const file = 'data/evidence-batch-m.json';
const rows = JSON.parse(fs.readFileSync(file, 'utf8'));
const accessedAt = '2026-06-24';
const find = (id) => {
  const row = rows.find((item) => item.id === id);
  if (!row) throw new Error(`missing ${id}`);
  return row;
};
const add = (row) => {
  if (rows.some((item) => item.id === row.id)) throw new Error(`duplicate ${row.id}`);
  rows.push(row);
};

Object.assign(find('sog_src_fxusd_contracts_batch_m'), {
  claim_scope: 'current_proxy_and_versioned_contracts',
  claim_scopes: ['ethereum_deployment', 'fxusd_proxy', 'version_1_contracts', 'version_2_contracts'],
  notes: 'Official contracts documentation identifies the continuous fxUSD proxy at 0x085780639CC2cACd35E474e71f4d000e2405d8f6 and separates current V2 contracts from historical V1 contracts.'
});

for (const row of [
  {
    id: 'sog_src_fxusd_announcement_2024',
    event_id: 'sog_ev_fxusd_launch_batch_m',
    source_type: 'official_blog',
    title: 'fxUSD: This ain’t your bank’s stablecoin',
    url: 'https://medium.com/@protocol_fx_667/fxusd-this-aint-your-bank-s-stablecoin-7d6a717af488',
    publisher: 'f(x) Protocol',
    published_at: '2024-01-11',
    claim_scope: 'product_announcement_before_launch',
    claim_scopes: ['announcement', 'identity', 'design', 'prelaunch_boundary'],
    reliability: 'high',
    notes: 'Official introduction of fxUSD. The announcement date is not used as the canonical launch date.'
  },
  {
    id: 'sog_src_fxusd_seeding_2024',
    event_id: 'sog_ev_fxusd_launch_batch_m',
    source_type: 'official_blog',
    title: 'fxUSD Seeding Event: The Race to 500 ETH!',
    url: 'https://medium.com/@protocol_fx_667/fxusd-seeding-event-the-race-to-500-eth-e8181f48cbc7',
    publisher: 'f(x) Protocol',
    published_at: '2024-02-23',
    claim_scope: 'seeding_phase_and_full_live_condition',
    claim_scopes: ['seeding_start', '500_eth_threshold', 'mint_redeem_condition', 'launch_boundary'],
    reliability: 'high',
    notes: 'Official seeding announcement states that fxUSD would go fully live after the first seed vault reached 500 ETH. The seeding-start date is not treated as launch.'
  },
  {
    id: 'sog_src_fxusd_curve_pool_2024',
    event_id: 'sog_ev_fxusd_launch_batch_m',
    source_type: 'onchain_explorer',
    title: 'GHO/fxUSD Curve pool creation on Ethereum',
    url: 'https://etherscan.io/address/0x8fFC7b89412eFD0D17EDEa2018F6634eA4C2FCb2',
    publisher: 'Etherscan',
    published_at: '2024-02-27',
    claim_scope: 'onchain_public_availability_boundary',
    claim_scopes: ['curve_pool_creation', 'ethereum', 'fxusd_public_liquidity', 'launch_date'],
    reliability: 'high',
    notes: 'Verified Curve StableSwap pool containing fxUSD was created at 2024-02-27 16:26:35 UTC. SOG uses the calendar day as a conservative public-availability launch boundary, not as a claim about the first token mint.'
  },
  {
    id: 'sog_src_fxusd_v1_v2_docs_2025',
    event_id: 'sog_ev_fxusd_v2_upgrade_2025',
    source_type: 'official_documentation',
    title: 'What is the difference between f(x) Protocol V1 and V2?',
    url: 'https://fxprotocol.gitbook.io/fx-docs/faq/what-is-the-difference-between-f-x-protocol-v1-and-v2',
    publisher: 'f(x) Protocol',
    published_at: null,
    claim_scope: 'v1_v2_architecture_boundary',
    claim_scopes: ['version_1', 'version_2', 'architecture_change', 'stablecoin_continuity'],
    reliability: 'high',
    notes: 'Official documentation distinguishes V1 and V2 product mechanics while continuing to describe fxUSD as the protocol stablecoin.'
  },
  {
    id: 'sog_src_fxusd_proxy_upgrade_2025',
    event_id: 'sog_ev_fxusd_v2_upgrade_2025',
    source_type: 'onchain_explorer',
    title: 'fxUSD proxy upgrade event on Ethereum',
    url: 'https://etherscan.io/address/0x085780639CC2cACd35E474e71f4d000e2405d8f6#events',
    publisher: 'Etherscan',
    published_at: '2025-01-02',
    claim_scope: 'same_proxy_v2_upgrade',
    claim_scopes: ['proxy_upgrade', 'same_token_address', 'v2_activation', 'ethereum'],
    reliability: 'high',
    notes: 'The continuous fxUSD proxy emitted an Upgraded event on 2025-01-02. Component rollout beyond this proxy event remains separately reviewable.'
  }
]) {
  add({
    ...row,
    stablecoin_id: 'sog_st_fxusd',
    issuer_id: 'sog_issuer_fx_protocol',
    archived_url: `https://web.archive.org/web/*/${row.url}`,
    accessed_at: accessedAt,
    stablecoin_ids: ['sog_st_fxusd'],
    organization_ids: ['sog_issuer_fx_protocol'],
    event_ids: [row.event_id]
  });
}

fs.writeFileSync(file, `${JSON.stringify(rows, null, 2)}\n`);
