import fs from 'node:fs';
const file = 'data/evidence-batch-m.json';
const rows = JSON.parse(fs.readFileSync(file, 'utf8'));
const find = (id) => {
  const row = rows.find((item) => item.id === id);
  if (!row) throw new Error(`missing ${id}`);
  return row;
};
const add = (row) => {
  if (rows.some((item) => item.id === row.id)) throw new Error(`duplicate ${row.id}`);
  rows.push(row);
};

Object.assign(find('sog_src_mai_glossary_batch_m'), {
  claim_scope: 'identity_and_name_continuity',
  claim_scopes: ['identity', 'mimatic_previous_name', 'MAI_current_name', 'same_asset_continuity'],
  notes: 'Current official glossary explicitly defines MAI as previously miMatic but does not provide a day-level rename date.'
});
Object.assign(find('sog_src_mai_contracts_batch_m'), {
  claim_scope: 'current_multichain_token_and_vault_addresses',
  claim_scopes: ['polygon_native_token', 'multichain_addresses', 'vaults', 'deployment_inventory'],
  notes: 'Official address registry identifies the Polygon MAI token at 0xa3fa99a148fa48d14ed51d610c367c61876997f1 and lists additional chain representations and vault contracts. Current activity and canonicality remain chain-specific review questions.'
});

for (const row of [
  {
    id: 'sog_src_mai_launch_2021',
    event_id: 'sog_ev_mai_launch_batch_m',
    source_type: 'official_blog',
    title: 'Your Guide to Making Stablecoins on Polygon',
    url: 'https://qidaoprotocol.medium.com/your-guide-to-making-stablecoins-on-polygon-ec2723c170b6',
    publisher: 'QiDao Protocol',
    published_at: '2021-05-02',
    claim_scope: 'polygon_public_launch_and_borrowing',
    claim_scopes: ['launch_date', 'polygon', 'vault_creation', 'MAI_borrowing', 'mimatic_previous_name'],
    notes: 'First-party operating guide documents a live debt ceiling, app access, vault creation, and MAI borrowing. Used as the canonical public-availability boundary.'
  },
  {
    id: 'sog_src_mai_v2_2022',
    event_id: 'sog_ev_mai_v2_announcement_2022',
    source_type: 'official_blog',
    title: 'Introducing QiDao V2',
    url: 'https://qidaoprotocol.medium.com/introducing-qidao-v2-bcc82af7108',
    publisher: 'QiDao Protocol',
    published_at: '2022-06-28',
    claim_scope: 'v1_origin_and_v2_architecture',
    claim_scopes: ['v1_may_2021', 'v2_announcement', 'liquidation_engine', 'risk_management', 'chain_specific_design'],
    notes: 'Official article states that the first Polygon contracts were deployed in May 2021 and introduces V2. It does not establish one exact V2 activation transaction.'
  }
]) {
  add({
    ...row,
    stablecoin_id: 'sog_st_mai',
    issuer_id: 'sog_issuer_qidao',
    archived_url: `https://web.archive.org/web/*/${row.url}`,
    accessed_at: '2026-06-24',
    reliability: 'high',
    stablecoin_ids: ['sog_st_mai'],
    organization_ids: ['sog_issuer_qidao'],
    event_ids: [row.event_id]
  });
}

fs.writeFileSync(file, `${JSON.stringify(rows, null, 2)}\n`);
