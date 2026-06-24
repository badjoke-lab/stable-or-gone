import fs from 'node:fs';
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const write = (file, value) => fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
const find = (rows, id) => {
  const row = rows.find((item) => item.id === id);
  if (!row) throw new Error(`missing ${id}`);
  return row;
};

let rows = read('data/deployments-batch-m.json');
Object.assign(find(rows, 'sog_dep_fxusd_ethereum_batch_m'), {
  deployment_type: 'protocol_native_token',
  token_standard: 'ERC-20',
  contract_address: '0x085780639CC2cACd35E474e71f4d000e2405d8f6',
  status: 'active',
  canonicality: 'native',
  is_primary: true,
  contract_version: 'continuous_proxy_v2',
  mint_authority_type: 'protocol_collateral_position_mint',
  control_event_ids: ['sog_ev_fxusd_launch_batch_m', 'sog_ev_fxusd_v2_upgrade_2025'],
  notes: 'Continuous Ethereum fxUSD proxy used for the reviewed 2024 public launch boundary and retained through the 2025 V2 proxy upgrade. V1 and V2 component contracts remain distinct even though the base token proxy is continuous.',
  evidence_ids: [
    'sog_src_fxusd_contracts_batch_m',
    'sog_src_fxusd_curve_pool_2024',
    'sog_src_fxusd_v1_v2_docs_2025',
    'sog_src_fxusd_proxy_upgrade_2025'
  ]
});
write('data/deployments-batch-m.json', rows);

rows = read('data/known-unknowns-batch-m.json');
const before = rows.length;
rows = rows.filter((row) => row.id !== 'sog_ku_fxusd_launch_batch_m');
if (rows.length !== before - 1) throw new Error('fxUSD launch unknown missing or duplicated');
Object.assign(find(rows, 'sog_ku_fxusd_version_batch_m'), {
  topic: 'v1_v2_component_and_rollout_history',
  description: 'The continuous fxUSD proxy and its 2025-01-02 upgrade are normalized. The complete V1-to-V2 component-contract replacement graph, staged rollout chronology, pool migration, and treatment of every V1 position product remain incomplete.',
  severity: 'medium',
  last_checked_at: '2026-06-24',
  notes: 'Do not split the base fxUSD token into separate assets. Do not imply that every V1 component remained active or migrated automatically.'
});
write('data/known-unknowns-batch-m.json', rows);

const queueFile = 'data/quality/launch-date-unresolved.json';
const queue = read(queueFile);
const queueBefore = queue.records.length;
queue.records = queue.records.filter((row) => row.stablecoin_id !== 'sog_st_fxusd');
if (queue.records.length !== queueBefore - 1) throw new Error('fxUSD launch queue entry missing or duplicated');
queue.expected_total = queue.records.length;
for (const category of ['B', 'C', 'D']) {
  queue.category_counts[category] = queue.records.filter((row) => row.category === category).length;
}
write(queueFile, queue);
