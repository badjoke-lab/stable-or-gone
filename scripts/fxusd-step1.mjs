import fs from 'node:fs';
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const write = (file, value) => fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
const find = (rows, id) => {
  const row = rows.find((item) => item.id === id);
  if (!row) throw new Error(`missing ${id}`);
  return row;
};

let rows = read('data/stablecoins-batch-m.json');
Object.assign(find(rows, 'sog_st_fxusd'), {
  launch_date: '2024-02-27',
  confidence: 'high',
  last_verified_at: '2026-06-24',
  notes: 'Batch M. The canonical public-availability boundary is 2024-02-27, after the official seeding phase began and an Ethereum Curve pool containing fxUSD was created on-chain. The January announcement and February 23 seeding start are not used as the launch date. f(x) Protocol V2 upgraded the same fxUSD proxy on 2025-01-02; V2 is recorded as a protocol upgrade rather than a new asset launch.'
});
write('data/stablecoins-batch-m.json', rows);

rows = read('data/events-batch-m.json');
Object.assign(find(rows, 'sog_ev_fxusd_launch_batch_m'), {
  event_date: '2024-02-27',
  title: 'fxUSD becomes publicly available on Ethereum',
  description: 'After f(x) Protocol announced fxUSD and opened a seeding phase, an Ethereum Curve pool containing fxUSD was created on February 27, 2024. SOG uses this on-chain public-availability boundary as the canonical launch date rather than the earlier announcement or seeding-start dates.',
  impact_level: 'high',
  confidence: 'high',
  source_count: 7,
  event_status_effect: 'active',
  notes: 'This is a conservative public-availability boundary. It does not claim that the pool transaction was the first-ever fxUSD mint.'
});
rows.push({
  id: 'sog_ev_fxusd_v2_upgrade_2025',
  stablecoin_id: 'sog_st_fxusd',
  issuer_id: 'sog_issuer_fx_protocol',
  event_type: 'protocol_upgrade',
  event_date: '2025-01-02',
  title: 'fxUSD proxy is upgraded for f(x) Protocol V2',
  description: 'The continuous Ethereum fxUSD proxy emitted an on-chain upgrade event on January 2, 2025 as f(x) Protocol moved into its V2 architecture. Official documentation distinguishes V1 and V2 while retaining the same base fxUSD token identity.',
  impact_level: 'high',
  confidence: 'high',
  source_count: 3,
  event_status_effect: 'active_v2',
  recovered: null,
  recovery_date: null,
  failure_mechanism: 'not_applicable',
  notes: 'The same proxy address is retained. Component contracts and product mechanics changed, so V2 is not treated as a second asset launch.'
});
write('data/events-batch-m.json', rows);

rows = read('data/event-details-batch-m.json');
Object.assign(find(rows, 'sog_ev_fxusd_launch_batch_m'), {
  title: 'fxUSD becomes publicly available on Ethereum',
  evidence_ids: [
    'sog_src_fxusd_products_batch_m',
    'sog_src_fxusd_functions_batch_m',
    'sog_src_fxusd_contracts_batch_m',
    'sog_src_fxusd_announcement_2024',
    'sog_src_fxusd_seeding_2024',
    'sog_src_fxusd_curve_pool_2024',
    'sog_src_fxusd_v1_v2_docs_2025'
  ],
  event_detail_kind: 'launch',
  launch_detail: {
    summary: 'fxUSD reached a reviewed public-availability boundary on Ethereum on 2024-02-27 after its seeding phase began.',
    status: 'active_same_proxy_now_v2',
    related_organization_ids: ['sog_issuer_fx_protocol']
  }
});
rows.push({
  id: 'sog_ev_fxusd_v2_upgrade_2025',
  title: 'fxUSD proxy is upgraded for f(x) Protocol V2',
  subject_stablecoin_ids: ['sog_st_fxusd'],
  subject_organization_ids: ['sog_issuer_fx_protocol'],
  evidence_ids: [
    'sog_src_fxusd_contracts_batch_m',
    'sog_src_fxusd_v1_v2_docs_2025',
    'sog_src_fxusd_proxy_upgrade_2025'
  ],
  event_detail_kind: 'migration',
  migration_detail: {
    summary: 'Same-proxy transition from the V1 product architecture to f(x) Protocol V2.',
    status: 'implemented_same_token_proxy_upgrade'
  }
});
write('data/event-details-batch-m.json', rows);
