import fs from 'node:fs';

const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const writePretty = (file, value) => fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
const writeCompactArray = (file, rows) => fs.writeFileSync(file, `[\n${rows.map((row) => `  ${JSON.stringify(row)}`).join(',\n')}\n]\n`);
const find = (rows, id, file) => {
  const row = rows.find((item) => item.id === id);
  if (!row) throw new Error(`${file}: missing ${id}`);
  return row;
};
const appendUnique = (rows, row, file) => {
  if (rows.some((item) => item.id === row.id)) throw new Error(`${file}: duplicate ${row.id}`);
  rows.push(row);
};

const stableExtraFile = 'data/stablecoins-extra.json';
const stableFFile = 'data/stablecoins-batch-f.json';
const stableExtra = read(stableExtraFile);
const stableF = read(stableFFile);

Object.assign(find(stableExtra, 'sog_st_usdn', stableExtraFile), {
  discontinued_date: '2023-01-31',
  confidence: 'high',
  last_verified_at: '2026-06-23',
  notes: 'Batch A promotion. Terminal-date review records 2023-01-31 as the end of the original USDN hard-dollar stablecoin identity: Neutrino began the Waves on-chain asset rename to XTN through Update Asset Info on that date. External interfaces could retain the old ticker during the staged rebrand.'
});
Object.assign(find(stableF, 'sog_st_mountainusdm', stableFFile), {
  discontinued_date: '2025-08-22',
  confidence: 'high',
  last_verified_at: '2026-06-23',
  notes: 'Batch F promotion. Launch date is 2023-09-11. Terminal-date review records 2025-08-22 as the issuer-service discontinuation boundary, when Phase 3 terms ended Mountain Protocol issuance, direct redemption, and platform operation; residual on-chain exit routes remain separate post-discontinuation context.'
});
writeCompactArray(stableExtraFile, stableExtra);
writePretty(stableFFile, stableF);

const eventsAFile = 'data/events-batch-a.json';
const eventsFFile = 'data/events-batch-f.json';
const eventsA = read(eventsAFile);
const eventsF = read(eventsFFile);

Object.assign(find(eventsA, 'sog_ev_usdn_xtn_transition', eventsAFile), {
  event_date: '2023-01-31',
  title: 'Neutrino begins the Waves asset rename from USDN to XTN',
  description: 'Neutrino announced that it was starting the approved USDN-to-XTN transition on 31 January 2023 by renaming the token on Waves through an Update Asset Info transaction. SOG uses this on-chain identity change as the end of the original hard-USD stablecoin classification, while recognizing that external interfaces could retain USDN during the staged rollout.',
  confidence: 'high',
  source_count: 3,
  notes: 'The date marks the first executed on-chain rename step and stablecoin-classification end, not universal completion across every exchange, wallet, or data provider.'
});
Object.assign(find(eventsF, 'sog_ev_mountainusdm_wind_down', eventsFFile), {
  event_date: '2025-08-22',
  title: 'Mountain Protocol enters Phase 3 and ends issuer services for USDM',
  description: 'Mountain Protocol Phase 3 terms took effect on 22 August 2025. From that date Mountain Protocol no longer issued or directly redeemed USDM and no longer operated the issuer platform, while remaining reserves and exit liquidity moved to an on-chain wind-down structure.',
  impact_level: 'critical',
  confidence: 'high',
  source_count: 3,
  event_status_effect: 'discontinued',
  notes: 'The date is the issuer-service discontinuation boundary. Residual token transferability, rebasing, pools, and on-chain exits do not restore normal issuance or issuer redemption.'
});
writePretty(eventsAFile, eventsA);
writePretty(eventsFFile, eventsF);

const detailsAFile = 'data/event-details-batch-a.json';
const detailsFFile = 'data/event-details-batch-f.json';
const detailsA = read(detailsAFile);
const detailsF = read(detailsFFile);

Object.assign(find(detailsA, 'sog_ev_usdn_xtn_transition', detailsAFile), {
  evidence_ids: [
    'sog_src_usdn_xtn_transition_batch_a',
    'sog_src_usdn_current_batch_a',
    'sog_src_usdn_xtn_step_one_2023'
  ],
  event_detail_kind: 'migration',
  migration_detail: {
    summary: 'On 2023-01-31 Neutrino began the Waves on-chain rename from USDN to XTN, ending the original hard-USD stablecoin identity while the broader rebrand continued across external interfaces.'
  }
});
Object.assign(find(detailsF, 'sog_ev_mountainusdm_wind_down', detailsFFile), {
  termination_detail: {
    summary: 'Mountain Protocol issuance, direct redemption, and platform operation ended when Phase 3 took effect on 2025-08-22; residual on-chain wind-down and exit routes continue as post-discontinuation context.',
    status: 'discontinued',
    related_organization_ids: ['sog_issuer_mountain_protocol']
  }
});
writeCompactArray(detailsAFile, detailsA);
writePretty(detailsFFile, detailsF);

const evidenceAFile = 'data/evidence-batch-a.json';
const evidenceA = read(evidenceAFile);
appendUnique(evidenceA, {
  id: 'sog_src_usdn_xtn_step_one_2023',
  stablecoin_id: 'sog_st_usdn',
  issuer_id: 'sog_issuer_neutrino',
  event_id: 'sog_ev_usdn_xtn_transition',
  source_type: 'official_social_statement',
  title: 'USDN>XTN: Step One',
  url: 'https://t.me/s/neutrino_protocol_news?before=361',
  publisher: 'Neutrino Protocol',
  published_at: '2023-01-31',
  archived_url: null,
  accessed_at: '2026-06-23',
  reliability: 'high',
  claim_scope: 'usdn_xtn_onchain_rename_start_and_stablecoin_classification_end',
  stablecoin_ids: ['sog_st_usdn'],
  organization_ids: ['sog_issuer_neutrino'],
  event_ids: ['sog_ev_usdn_xtn_transition'],
  claim_scopes: ['rebrand_effective_date', 'waves_update_asset_info', 'hard_usd_classification_end'],
  notes: 'First-party Neutrino announcement states that the approved transition started that day by renaming the token on Waves through an Update Asset Info transaction; staged renaming across external interfaces continued afterward.'
}, evidenceAFile);
writeCompactArray(evidenceAFile, evidenceA);

const queueFile = 'data/quality/terminal-date-unresolved.json';
const queue = read(queueFile);
const resolved = new Set(['sog_st_mountainusdm', 'sog_st_usdn']);
queue.records = queue.records.filter((row) => !resolved.has(row.stablecoin_id));
queue.expected_total = queue.records.length;
queue.frozen_at = '2026-06-23';
queue.source_review = 'docs/audits/terminal-date-resolution-usdm-usdn.md';
if (queue.expected_total !== 4) throw new Error(`unexpected terminal queue total ${queue.expected_total}`);
writePretty(queueFile, queue);

const v2File = 'docs/migration/registry-v2-baseline.json';
const v2 = read(v2File);
v2.baseline_id = 'sog_registry_v2_post_terminal_date_resolution_2026_06_23';
v2.captured_at = '2026-06-23';
v2.source_commit = 'resolve-terminal-dates-usdm-usdn';
v2.minimum_counts.evidence = 338;
v2.minimum_counts.evidence_relations = 333;
writePretty(v2File, v2);

const v3File = 'docs/migration/registry-v3-baseline.json';
const v3 = read(v3File);
v3.baseline_id = 'sog_registry_v3_quality_81_terminal_dates_2026_06_23';
v3.recorded_at = '2026-06-23';
v3.data_checkpoint_commit = 'resolve-terminal-dates-usdm-usdn';
v3.expected_counts.evidence = 338;
v3.quality.terminal_date_unresolved = 4;
v3.audit_report = 'docs/audits/terminal-date-resolution-usdm-usdn.md';
writePretty(v3File, v3);

const statsFile = 'data/generated/registry-stats.json';
const stats = read(statsFile);
stats.baseline_id = v2.baseline_id;
stats.registry.evidence = 338;
writePretty(statsFile, stats);

const audit = `# Terminal-Date Resolution: Mountain USDM and USDN\n\nRecorded: 2026-06-23\n\n## Resolved boundaries\n\n- Mountain Protocol USDM — \`2025-08-22\`: Phase 3 terms took effect and Mountain Protocol ended issuance, direct redemption, and platform operation. Remaining on-chain pools and exit routes are retained as post-discontinuation context rather than treated as continuing issuer service.\n- Neutrino USD / USDN — \`2023-01-31\`: Neutrino began the approved Waves on-chain asset rename to XTN through Update Asset Info. SOG uses this executed identity change as the end of the original hard-USD stablecoin classification; external interfaces could continue showing USDN during the staged rollout.\n\n## Records kept unresolved\n\n- Basis Cash — no first-party shutdown, mint-stop, redemption-stop, or governance-termination boundary recovered.\n- Dynamic Set Dollar — April 2021 design activity does not establish final shutdown or migration execution.\n- Empty Set Dollar — the 2021-08-02 successor migration opening does not prove final cessation of all original contracts or claims.\n- GYEN — orderly wind-down began 2026-05-15, but the initial redemption period remains open until 2026-11-11 and final termination has not occurred.\n\n## Queue effect\n\n- Terminal-date unresolved: \`6 → 4\`\n- Canonical stable assets: unchanged at \`81\`\n- Events and Event v2 details: unchanged at \`111\` each\n- Evidence: \`337 → 338\`\n\n## Boundary policy\n\nA canonical discontinued date may mark the end of the issuer service or the old stablecoin identity even when residual contracts, balances, pools, or migration routes remain. Those residual states must remain separately documented and must not be described as restored issuance or redemption.\n\n## Production status\n\nNo Cloudflare action, production deployment, or public parity assertion is performed.\n`;
fs.writeFileSync('docs/audits/terminal-date-resolution-usdm-usdn.md', audit);

console.log('Resolved terminal dates for Mountain USDM and USDN');
