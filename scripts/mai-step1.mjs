import fs from 'node:fs';
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const write = (file, value) => fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
const find = (rows, id) => {
  const row = rows.find((item) => item.id === id);
  if (!row) throw new Error(`missing ${id}`);
  return row;
};

let rows = read('data/stablecoins-batch-m.json');
Object.assign(find(rows, 'sog_st_mai'), {
  launch_date: '2021-05-02',
  confidence: 'high',
  last_verified_at: '2026-06-24',
  notes: 'Batch M. Canonical public-availability launch is the official Polygon borrowing guide published on 2021-05-02, which documents an operating protocol, MAI borrowing, and a live debt ceiling. MAI is the continuing stablecoin previously called miMATIC. The exact rename day and exact V2 production activation remain unresolved.'
});
write('data/stablecoins-batch-m.json', rows);

rows = read('data/events-batch-m.json');
Object.assign(find(rows, 'sog_ev_mai_launch_batch_m'), {
  event_date: '2021-05-02',
  title: 'QiDao publicly launches MAI borrowing on Polygon',
  description: 'QiDao published an operational Polygon borrowing guide on May 2, 2021 showing users how to create vaults and borrow MAI, previously called miMATIC. SOG uses this first-party public-availability boundary as the canonical launch date.',
  impact_level: 'high',
  confidence: 'high',
  source_count: 6,
  event_status_effect: 'active',
  notes: 'The exact earlier smart-contract deployment time and the exact miMATIC-to-MAI rename day are not inferred from this boundary.'
});
rows.push({
  id: 'sog_ev_mai_v2_announcement_2022',
  stablecoin_id: 'sog_st_mai',
  issuer_id: 'sog_issuer_qidao',
  event_type: 'protocol_upgrade_announced',
  event_date: '2022-06-28',
  title: 'QiDao introduces its V2 architecture',
  description: 'QiDao introduced V2 with a new liquidation engine, risk-management process, chain-specific tailoring, and vault-deprecation tools. The announcement confirms that V1 began on Polygon in May 2021 but does not establish one exact V2 production activation transaction.',
  impact_level: 'medium',
  confidence: 'high',
  source_count: 1,
  event_status_effect: 'version_transition_context',
  recovered: null,
  recovery_date: null,
  failure_mechanism: 'not_applicable',
  notes: 'Recorded as a version announcement, not as a second stablecoin launch or an exact activation date.'
});
write('data/events-batch-m.json', rows);

rows = read('data/event-details-batch-m.json');
Object.assign(find(rows, 'sog_ev_mai_launch_batch_m'), {
  title: 'QiDao publicly launches MAI borrowing on Polygon',
  evidence_ids: [
    'sog_src_mai_glossary_batch_m',
    'sog_src_mai_intro_batch_m',
    'sog_src_mai_psm_batch_m',
    'sog_src_mai_contracts_batch_m',
    'sog_src_mai_launch_2021',
    'sog_src_mai_v2_2022'
  ],
  event_detail_kind: 'launch',
  launch_detail: {
    summary: 'Official public instructions establish operating MAI borrowing on Polygon on 2021-05-02.',
    status: 'active_same_asset_previously_mimatic',
    related_organization_ids: ['sog_issuer_qidao']
  }
});
rows.push({
  id: 'sog_ev_mai_v2_announcement_2022',
  title: 'QiDao introduces its V2 architecture',
  subject_stablecoin_ids: ['sog_st_mai'],
  subject_organization_ids: ['sog_issuer_qidao'],
  evidence_ids: ['sog_src_mai_v2_2022'],
  event_detail_kind: 'governance_change',
  governance_change_detail: {
    summary: 'V2 architecture was introduced with revised liquidation, risk, chain, and vault-deprecation mechanics.',
    status: 'announced_activation_date_unresolved',
    resolution_date: null,
    affected_deployment_ids: ['sog_dep_mai_polygon_batch_m'],
    related_organization_ids: ['sog_issuer_qidao']
  }
});
write('data/event-details-batch-m.json', rows);
