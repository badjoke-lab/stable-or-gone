import fs from 'node:fs';

const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const write = (file, value) => fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
const find = (rows, id, file) => {
  const row = rows.find((item) => item.id === id);
  if (!row) throw new Error(`${file}: missing ${id}`);
  return row;
};
const appendUnique = (rows, row, file) => {
  if (rows.some((item) => item.id === row.id)) throw new Error(`${file}: duplicate ${row.id}`);
  rows.push(row);
};

const stableCFile = 'data/stablecoins-batch-c.json';
const stableEFile = 'data/stablecoins-batch-e.json';
const stableFFile = 'data/stablecoins-batch-f.json';
const stableC = read(stableCFile);
const stableE = read(stableEFile);
const stableF = read(stableFFile);

Object.assign(find(stableE, 'sog_st_eurs', stableEFile), {
  launch_date: '2018-06-22',
  confidence: 'high',
  last_verified_at: '2026-06-22',
  notes: 'Batch E promotion. Launch-date follow-up uses STASIS anniversary statements identifying 2018-06-22 as the first EURS emission.'
});
Object.assign(find(stableF, 'sog_st_mountainusdm', stableFFile), {
  launch_date: '2023-09-11',
  confidence: 'high',
  last_verified_at: '2026-06-22',
  notes: 'Batch F promotion. The launch date follows Mountain Protocol’s dated statement that it publicly launched Mountain Protocol and USDM on 2023-09-11; later wind-down remains a separate lifecycle event.'
});
Object.assign(find(stableC, 'sog_st_usd0', stableCFile), {
  launch_date: '2024-07-09',
  confidence: 'high',
  last_verified_at: '2026-06-22',
  notes: 'Batch C promotion. The canonical date uses Usual’s dated announcement that its public mainnet had launched on 2024-07-09; earlier permissioned and product-introduction stages remain pre-public context.'
});
Object.assign(find(stableC, 'sog_st_usr', stableCFile), {
  launch_date: '2024-09-04',
  confidence: 'high',
  last_verified_at: '2026-06-22',
  notes: 'Batch C promotion. Resolv’s dated public program and one-year anniversary statement establish 2024-09-04 as the public-launch boundary; the March 2026 security incident remains a separate event.'
});
write(stableCFile, stableC);
write(stableEFile, stableE);
write(stableFFile, stableF);

const eventsCFile = 'data/events-batch-c.json';
const eventsEFile = 'data/events-batch-e.json';
const eventsFFile = 'data/events-batch-f.json';
const eventsC = read(eventsCFile);
const eventsE = read(eventsEFile);
const eventsF = read(eventsFFile);

Object.assign(find(eventsE, 'sog_ev_eurs_2018_launch', eventsEFile), {
  event_date: '2018-06-22',
  title: 'STASIS records the first EURS emission',
  description: 'STASIS identifies 22 June 2018 as the first EURS emission, establishing the operational launch boundary for the euro-backed stablecoin.',
  confidence: 'high',
  source_count: 4,
  notes: 'The day-level date is supported by repeated first-party anniversary statements tied to the first EURS emission.'
});
Object.assign(find(eventsC, 'sog_ev_usd0_2024_launch_phase', eventsCFile), {
  event_date: '2024-07-09',
  title: 'Usual launches its public mainnet with USD0 live',
  description: 'Usual announced on 9 July 2024 that its public mainnet had launched, with USD0 and USD0++ available for participation in the public Pills campaign.',
  confidence: 'high',
  source_count: 3,
  notes: 'The canonical boundary is unrestricted public-mainnet availability; earlier May 2024 introduction and permissioned activity remain pre-public context.'
});
appendUnique(eventsC, {
  id: 'sog_ev_usr_2024_09_public_launch',
  stablecoin_id: 'sog_st_usr',
  issuer_id: 'sog_issuer_resolv',
  event_type: 'launch',
  event_date: '2024-09-04',
  title: 'Resolv opens USR to public participation',
  description: 'Resolv opened its points program to the crypto community on 4 September 2024 with live USR holding, staking, liquidity, and trading activities; a later first-party anniversary statement identifies that date as the public launch.',
  impact_level: 'high',
  event_status_effect: 'active',
  recovered: null,
  recovery_date: null,
  failure_mechanism: 'not_applicable',
  confidence: 'high',
  source_count: 1,
  notes: 'The public-launch date is distinct from the March 2026 unauthorized-mint incident and recovery state.'
}, eventsCFile);
appendUnique(eventsF, {
  id: 'sog_ev_mountainusdm_2023_09_public_launch',
  stablecoin_id: 'sog_st_mountainusdm',
  issuer_id: 'sog_issuer_mountain_protocol',
  event_type: 'launch',
  event_date: '2023-09-11',
  title: 'Mountain Protocol publicly launches USDM',
  description: 'Mountain Protocol announced the public launch of the protocol and its first product, USDM, on 11 September 2023.',
  impact_level: 'high',
  event_status_effect: 'active',
  recovered: null,
  recovery_date: null,
  failure_mechanism: 'not_applicable',
  confidence: 'high',
  source_count: 1,
  notes: 'The public-launch event is preserved separately from the later USDM wind-down.'
}, eventsFFile);
write(eventsCFile, eventsC);
write(eventsEFile, eventsE);
write(eventsFFile, eventsF);

const detailsCFile = 'data/event-details-batch-c.json';
const detailsEFile = 'data/event-details-batch-e.json';
const detailsFFile = 'data/event-details-batch-f.json';
const detailsC = read(detailsCFile);
const detailsE = read(detailsEFile);
const detailsF = read(detailsFFile);

Object.assign(find(detailsE, 'sog_ev_eurs_2018_launch', detailsEFile), {
  evidence_ids: ['sog_src_eurs_product_batch_e', 'sog_src_eurs_transparency_batch_e', 'sog_src_eurs_terms_batch_e', 'sog_src_eurs_first_emission_2018'],
  event_detail_kind: 'launch',
  launch_detail: {
    summary: 'STASIS identifies 2018-06-22 as the first EURS emission.',
    status: 'active'
  }
});
delete find(detailsE, 'sog_ev_eurs_2018_launch', detailsEFile).other_detail;
Object.assign(find(detailsC, 'sog_ev_usd0_2024_launch_phase', detailsCFile), {
  evidence_ids: ['sog_src_usd0_overview_batch_c', 'sog_src_usd0_fact_sheet_batch_c', 'sog_src_usd0_public_mainnet_2024'],
  event_detail_kind: 'launch',
  launch_detail: {
    summary: 'Usual announced that its public mainnet and public USD0 participation were live on 2024-07-09.',
    status: 'active'
  }
});
delete find(detailsC, 'sog_ev_usd0_2024_launch_phase', detailsCFile).reserve_change_detail;
appendUnique(detailsC, {
  id: 'sog_ev_usr_2024_09_public_launch',
  subject_stablecoin_ids: ['sog_st_usr'],
  subject_organization_ids: ['sog_issuer_resolv'],
  evidence_ids: ['sog_src_usr_public_launch_2024'],
  event_detail_kind: 'launch',
  launch_detail: {
    summary: 'Resolv opened USR participation to the public on 2024-09-04.',
    status: 'active'
  }
}, detailsCFile);
appendUnique(detailsF, {
  id: 'sog_ev_mountainusdm_2023_09_public_launch',
  subject_stablecoin_ids: ['sog_st_mountainusdm'],
  subject_organization_ids: ['sog_issuer_mountain_protocol'],
  evidence_ids: ['sog_src_mountainusdm_public_launch_2023'],
  event_detail_kind: 'launch',
  launch_detail: {
    summary: 'Mountain Protocol publicly launched USDM on 2023-09-11.',
    status: 'active'
  }
}, detailsFFile);
write(detailsCFile, detailsC);
write(detailsEFile, detailsE);
write(detailsFFile, detailsF);

const evidenceCFile = 'data/evidence-batch-c.json';
const evidenceEFile = 'data/evidence-batch-e.json';
const evidenceFFile = 'data/evidence-batch-f.json';
const evidenceC = read(evidenceCFile);
const evidenceE = read(evidenceEFile);
const evidenceF = read(evidenceFFile);

appendUnique(evidenceE, {
  id: 'sog_src_eurs_first_emission_2018',
  stablecoin_id: 'sog_st_eurs',
  issuer_id: 'sog_issuer_stasis',
  event_id: 'sog_ev_eurs_2018_launch',
  source_type: 'official_blog',
  title: 'STASIS Celebrates 4th Year Milestone of EURS Launch',
  url: 'https://medium.com/stasis-blog/stasis-celebrates-4th-year-milestone-of-eurs-launch-2ac119ae031c',
  publisher: 'STASIS',
  published_at: '2022-06-27',
  archived_url: 'https://web.archive.org/web/*/https://medium.com/stasis-blog/stasis-celebrates-4th-year-milestone-of-eurs-launch-2ac119ae031c',
  accessed_at: '2026-06-22',
  reliability: 'high',
  claim_scope: 'eurs_first_emission_date',
  stablecoin_ids: ['sog_st_eurs'],
  organization_ids: ['sog_issuer_stasis'],
  event_ids: ['sog_ev_eurs_2018_launch'],
  claim_scopes: ['launch_date', 'first_emission'],
  notes: 'First-party anniversary statement says 22 June marked the fourth anniversary of the first EURS emission, establishing 2018-06-22.'
}, evidenceEFile);
appendUnique(evidenceF, {
  id: 'sog_src_mountainusdm_public_launch_2023',
  stablecoin_id: 'sog_st_mountainusdm',
  issuer_id: 'sog_issuer_mountain_protocol',
  event_id: 'sog_ev_mountainusdm_2023_09_public_launch',
  source_type: 'official_blog',
  title: 'Unveiling Mountain Protocol',
  url: 'https://medium.com/@MountainUSDM/unveiling-mountain-protocol-db2ae9f50dc1',
  publisher: 'Mountain Protocol',
  published_at: '2023-09-11',
  archived_url: 'https://web.archive.org/web/*/https://medium.com/@MountainUSDM/unveiling-mountain-protocol-db2ae9f50dc1',
  accessed_at: '2026-06-22',
  reliability: 'high',
  claim_scope: 'mountain_protocol_and_usdm_public_launch',
  stablecoin_ids: ['sog_st_mountainusdm'],
  organization_ids: ['sog_issuer_mountain_protocol'],
  event_ids: ['sog_ev_mountainusdm_2023_09_public_launch'],
  claim_scopes: ['launch_date', 'public_launch', 'product_identity'],
  notes: 'Mountain Protocol states that it publicly launched the protocol and USDM on the publication date.'
}, evidenceFFile);
appendUnique(evidenceC, {
  id: 'sog_src_usd0_public_mainnet_2024',
  stablecoin_id: 'sog_st_usd0',
  issuer_id: 'sog_issuer_usual',
  event_id: 'sog_ev_usd0_2024_launch_phase',
  source_type: 'official_blog',
  title: 'Launch of the Pills Campaign!',
  url: 'https://usual.money/blog/pills-campaign-launch',
  publisher: 'Usual',
  published_at: '2024-07-09',
  archived_url: 'https://web.archive.org/web/*/https://usual.money/blog/pills-campaign-launch',
  accessed_at: '2026-06-22',
  reliability: 'high',
  claim_scope: 'usd0_public_mainnet_launch',
  stablecoin_ids: ['sog_st_usd0'],
  organization_ids: ['sog_issuer_usual'],
  event_ids: ['sog_ev_usd0_2024_launch_phase'],
  claim_scopes: ['launch_date', 'public_mainnet', 'USD0_public_availability'],
  notes: 'Usual’s dated announcement states that its public mainnet had launched and describes public participation using USD0 and USD0++.'
}, evidenceCFile);
appendUnique(evidenceC, {
  id: 'sog_src_usr_public_launch_2024',
  stablecoin_id: 'sog_st_usr',
  issuer_id: 'sog_issuer_resolv',
  event_id: 'sog_ev_usr_2024_09_public_launch',
  source_type: 'official_blog',
  title: 'Introducing Resolv Points Program',
  url: 'https://resolv.xyz/blog/introducing-resolv-points-program',
  publisher: 'Resolv',
  published_at: '2024-09-04',
  archived_url: 'https://web.archive.org/web/*/https://resolv.xyz/blog/introducing-resolv-points-program',
  accessed_at: '2026-06-22',
  reliability: 'high',
  claim_scope: 'usr_public_launch_and_participation',
  stablecoin_ids: ['sog_st_usr'],
  organization_ids: ['sog_issuer_resolv'],
  event_ids: ['sog_ev_usr_2024_09_public_launch'],
  claim_scopes: ['launch_date', 'public_launch', 'USR_live_participation'],
  notes: 'The dated page opens participation to the crypto community with live USR activities; Resolv’s 2025 anniversary article states that public launch occurred exactly one year earlier.'
}, evidenceCFile);
write(evidenceCFile, evidenceC);
write(evidenceEFile, evidenceE);
write(evidenceFFile, evidenceF);

const queueFile = 'data/quality/launch-date-unresolved.json';
const queue = read(queueFile);
const resolvedIds = new Set(['sog_st_eurs', 'sog_st_mountainusdm', 'sog_st_usd0', 'sog_st_usr']);
queue.records = queue.records.filter((row) => !resolvedIds.has(row.stablecoin_id));
queue.expected_total = queue.records.length;
queue.category_counts = queue.records.reduce((counts, row) => {
  counts[row.category] = (counts[row.category] ?? 0) + 1;
  return counts;
}, {});
queue.frozen_at = '2026-06-22';
queue.source_review = 'docs/audits/launch-date-category-b-resolution.md';
if (queue.expected_total !== 34 || queue.category_counts.B !== 4 || queue.category_counts.C !== 27 || queue.category_counts.D !== 3) {
  throw new Error(`unexpected launch queue counts: ${JSON.stringify(queue.category_counts)} total=${queue.expected_total}`);
}
write(queueFile, queue);

const v2File = 'docs/migration/registry-v2-baseline.json';
const v2 = read(v2File);
v2.baseline_id = 'sog_registry_v2_post_category_b_launch_dates_2026_06_22';
v2.captured_at = '2026-06-22';
v2.source_commit = 'resolve-category-b-launch-dates';
v2.minimum_counts.events = 111;
v2.minimum_counts.event_details = 111;
v2.minimum_counts.evidence = 337;
v2.minimum_counts.evidence_relations = 332;
write(v2File, v2);

const v3File = 'docs/migration/registry-v3-baseline.json';
const v3 = read(v3File);
v3.baseline_id = 'sog_registry_v3_quality_81_category_b_launch_dates_2026_06_22';
v3.recorded_at = '2026-06-22';
v3.data_checkpoint_commit = 'resolve-category-b-launch-dates';
v3.expected_counts.events = 111;
v3.expected_counts.event_details = 111;
v3.expected_counts.evidence = 337;
v3.quality.launch_date_unresolved = 34;
v3.audit_report = 'docs/audits/launch-date-category-b-resolution.md';
write(v3File, v3);

const audit = `# Category B Launch-Date Resolution\n\nRecorded: 2026-06-22\n\n## Result\n\nFour Category B records now have day-level canonical launch dates backed by first-party sources:\n\n- EURS — \`2018-06-22\`: first EURS emission, confirmed by repeated STASIS anniversary statements.\n- Mountain Protocol USDM — \`2023-09-11\`: Mountain Protocol’s dated public-launch announcement.\n- USD0 — \`2024-07-09\`: Usual’s dated announcement that the public mainnet had launched; earlier permissioned activity remains pre-public context.\n- USR — \`2024-09-04\`: Resolv’s dated public participation opening, corroborated by its exact one-year public-launch anniversary statement.\n\nThe unresolved queue changes from 38 to 34. Category B changes from 8 to 4; Category C remains 27 and Category D remains 3.\n\n## Records kept unresolved\n\n- BRZ — first-party material still establishes only 2019.\n- Anzen USDz — first-party material still establishes only June 2024; tutorial recording dates are not treated as launch statements.\n- Avalon USDa — first-party material still establishes only November 2024.\n- Berachain HONEY — Berachain mainnet has a day-level launch date, but the reviewed evidence does not yet establish that mainnet genesis is the correct first-production-availability boundary for HONEY itself.\n\nNo month or year was coerced into a day, and exchange listings were not used as default launch boundaries.\n\n## Coupled updates\n\n- canonical stablecoin launch dates and verification notes\n- launch events and Event v2 details\n- four first-party evidence records\n- launch-date unresolved queue\n- Registry v2 and v3 count baselines\n- generated stats and integrity audit\n\n## Production status\n\nNo Cloudflare action, production deployment, or public parity assertion is performed.\n`;
fs.writeFileSync('docs/audits/launch-date-category-b-resolution.md', audit);

console.log('Category B launch-date resolutions applied: EURS, Mountain USDM, USD0, USR');
