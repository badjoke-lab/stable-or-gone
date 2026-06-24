import fs from 'node:fs';
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const write = (file, value) => fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
const find = (rows, id) => {
  const row = rows.find((item) => item.id === id);
  if (!row) throw new Error(`missing ${id}`);
  return row;
};

let rows = read('data/deployments-batch-m.json');
Object.assign(find(rows, 'sog_dep_mai_polygon_batch_m'), {
  chain: 'Polygon',
  deployment_type: 'protocol_native_token',
  token_standard: 'ERC-20',
  contract_address: '0xa3Fa99A148fA48D14Ed51d610c367C61876997F1',
  status: 'active',
  canonicality: 'native',
  is_primary: true,
  contract_version: 'continuous_mimatic_mai_identity',
  mint_authority_type: 'protocol_vault_and_psm_mint',
  control_event_ids: ['sog_ev_mai_launch_batch_m', 'sog_ev_mai_v2_announcement_2022'],
  notes: 'Original Polygon MAI token, historically labeled miMATIC. The current official address registry continues to identify this Polygon address while listing additional chain representations. Cross-chain activity, bridge canonicality, and current fungibility remain separate review questions.',
  evidence_ids: [
    'sog_src_mai_launch_2021',
    'sog_src_mai_glossary_batch_m',
    'sog_src_mai_contracts_batch_m',
    'sog_src_mai_v2_2022'
  ]
});
write('data/deployments-batch-m.json', rows);

rows = read('data/known-unknowns-batch-m.json');
Object.assign(find(rows, 'sog_ku_mai_dates_batch_m'), {
  topic: 'rename_and_v2_activation_dates',
  description: 'The MAI public-availability launch is resolved to 2021-05-02. Official sources establish that MAI was previously called miMATIC and that V2 was introduced on 2022-06-28, but they do not establish one exact rename day or one exact V2 production activation transaction.',
  severity: 'medium',
  last_checked_at: '2026-06-24',
  notes: 'Keep the launch date fixed. Do not invent a separate rebrand or V2 activation day without day-level first-party or on-chain evidence.'
});
Object.assign(find(rows, 'sog_ku_mai_deployments_batch_m'), {
  topic: 'current_multichain_deployment_inventory_and_canonicality',
  description: 'The original Polygon MAI token address is normalized. Official documentation lists many additional chain addresses, but current activity, native versus bridged status, bridge operators, paused fungibility, and retired deployments are not yet a complete reviewed inventory.',
  severity: 'high',
  last_checked_at: '2026-06-24',
  notes: 'Do not infer canonicality or current support from symbol reuse or an address list alone.'
});
write('data/known-unknowns-batch-m.json', rows);

const queueFile = 'data/quality/launch-date-unresolved.json';
const queue = read(queueFile);
const before = queue.records.length;
queue.records = queue.records.filter((row) => row.stablecoin_id !== 'sog_st_mai');
if (queue.records.length !== before - 1) throw new Error('MAI launch queue entry missing or duplicated');
queue.expected_total = queue.records.length;
for (const category of ['B', 'C', 'D']) {
  queue.category_counts[category] = queue.records.filter((row) => row.category === category).length;
}
write(queueFile, queue);
