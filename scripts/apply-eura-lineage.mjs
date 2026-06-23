import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const today = '2026-06-23';
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const writeJson = (file, value) => fs.writeFileSync(path.join(root, file), `${JSON.stringify(value, null, 2)}\n`);
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const writeText = (file, value) => fs.writeFileSync(path.join(root, file), value);
const requireRow = (rows, id, file) => {
  const row = rows.find((item) => item.id === id);
  if (!row) throw new Error(`${file}: missing ${id}`);
  return row;
};
const appendUnique = (rows, row, file) => {
  if (rows.some((item) => item.id === row.id)) throw new Error(`${file}: duplicate ${row.id}`);
  rows.push(row);
};
const countGroup = (files = []) => files.flatMap((file) => readJson(file)).length;

const stablecoinFile = 'data/stablecoins-batch-j.json';
const stablecoins = readJson(stablecoinFile);
Object.assign(requireRow(stablecoins, 'sog_st_eura', stablecoinFile), {
  launch_date: '2021-11-03',
  last_verified_at: today,
  notes: 'Batch J promotion. The canonical asset launch is the agEUR mainnet launch on 2021-11-03. The 2024-03-14 EURA rename is a rebrand of the same token and is recorded separately.'
});
writeJson(stablecoinFile, stablecoins);

const eventsFile = 'data/events-batch-j.json';
const events = readJson(eventsFile);
appendUnique(events, {
  id: 'sog_ev_eura_2021_11_launch',
  stablecoin_id: 'sog_st_eura',
  issuer_id: 'sog_issuer_angle',
  event_type: 'launch',
  event_date: '2021-11-03',
  title: 'Angle launches agEUR on Ethereum mainnet',
  description: 'Angle Protocol announced its Ethereum mainnet launch on November 3, 2021 with agEUR as the protocol euro stablecoin. SOG uses this day as the canonical launch of the continuous asset now branded EURA.',
  impact_level: 'high',
  confidence: 'high',
  source_count: 1,
  event_status_effect: 'active',
  recovered: null,
  recovery_date: null,
  failure_mechanism: 'product_launch',
  notes: 'The later EURA name does not create a new asset identity.'
}, eventsFile);
appendUnique(events, {
  id: 'sog_ev_eura_2024_03_rebrand',
  stablecoin_id: 'sog_st_eura',
  issuer_id: 'sog_issuer_angle',
  event_type: 'rebrand',
  event_date: '2024-03-14',
  title: 'agEUR is rebranded as EURA',
  description: 'Angle Protocol renamed agEUR to EURA on March 14, 2024 after a governance vote. The official announcement states that the existing token address remained unchanged and no separate token was introduced.',
  impact_level: 'medium',
  confidence: 'high',
  source_count: 2,
  event_status_effect: 'none',
  recovered: null,
  recovery_date: null,
  failure_mechanism: 'same_token_rebrand',
  notes: 'Identity continuity is explicit: agEUR remains a historical alias of EURA.'
}, eventsFile);
writeJson(eventsFile, events);

const detailsFile = 'data/event-details-batch-j.json';
const details = readJson(detailsFile);
appendUnique(details, {
  id: 'sog_ev_eura_2021_11_launch',
  title: 'Angle launches agEUR on Ethereum mainnet',
  subject_stablecoin_ids: ['sog_st_eura'],
  subject_organization_ids: ['sog_issuer_angle'],
  evidence_ids: ['sog_src_eura_launch_2021'],
  event_detail_kind: 'launch',
  launch_detail: {
    summary: 'agEUR launched with Angle Protocol on Ethereum mainnet on 2021-11-03.',
    status: 'active_same_asset_now_branded_eura'
  }
}, detailsFile);
appendUnique(details, {
  id: 'sog_ev_eura_2024_03_rebrand',
  title: 'agEUR is rebranded as EURA',
  subject_stablecoin_ids: ['sog_st_eura'],
  subject_organization_ids: ['sog_issuer_angle'],
  evidence_ids: ['sog_src_eura_rebrand_2024', 'sog_src_eura_aip85_2024'],
  event_detail_kind: 'governance_change',
  governance_change_detail: {
    summary: 'Governance-approved rename from agEUR to EURA without a new token or address change.',
    status: 'implemented_same_token_rebrand',
    resolution_date: '2024-03-14',
    affected_deployment_ids: ['sog_dep_eura_ethereum_batch_j'],
    related_organization_ids: ['sog_issuer_angle']
  }
}, detailsFile);
writeJson(detailsFile, details);

const evidenceFile = 'data/evidence-batch-j.json';
const evidence = readJson(evidenceFile);
appendUnique(evidence, {
  id: 'sog_src_eura_launch_2021',
  stablecoin_id: 'sog_st_eura',
  issuer_id: 'sog_issuer_angle',
  event_id: 'sog_ev_eura_2021_11_launch',
  source_type: 'official_protocol_announcement',
  title: 'Angle is live on the Ethereum mainnet',
  url: 'https://medium.com/angle-protocol/angle-is-live-on-the-ethereum-mainnet-a8253162daf0',
  publisher: 'Angle Protocol',
  published_at: '2021-11-03',
  archived_url: 'https://web.archive.org/web/*/https://medium.com/angle-protocol/angle-is-live-on-the-ethereum-mainnet-a8253162daf0',
  accessed_at: today,
  reliability: 'high',
  claim_scope: 'launch_date_and_mainnet_availability',
  stablecoin_ids: ['sog_st_eura'],
  organization_ids: ['sog_issuer_angle'],
  event_ids: ['sog_ev_eura_2021_11_launch'],
  claim_scopes: ['launch_date', 'ethereum_mainnet', 'ageur_identity']
}, evidenceFile);
appendUnique(evidence, {
  id: 'sog_src_eura_rebrand_2024',
  stablecoin_id: 'sog_st_eura',
  issuer_id: 'sog_issuer_angle',
  event_id: 'sog_ev_eura_2024_03_rebrand',
  source_type: 'official_protocol_announcement',
  title: 'agEUR rebrands to EURA',
  url: 'https://blog.angle.money/ageur-rebrands-to-eura',
  publisher: 'Angle Protocol',
  published_at: '2024-03-14',
  archived_url: 'https://web.archive.org/web/*/https://blog.angle.money/ageur-rebrands-to-eura',
  accessed_at: today,
  reliability: 'high',
  claim_scope: 'same_token_rebrand',
  stablecoin_ids: ['sog_st_eura'],
  organization_ids: ['sog_issuer_angle'],
  event_ids: ['sog_ev_eura_2024_03_rebrand'],
  claim_scopes: ['rebrand', 'same_contract', 'no_new_token', 'agEUR_alias']
}, evidenceFile);
appendUnique(evidence, {
  id: 'sog_src_eura_aip85_2024',
  stablecoin_id: 'sog_st_eura',
  issuer_id: 'sog_issuer_angle',
  event_id: 'sog_ev_eura_2024_03_rebrand',
  source_type: 'official_governance_proposal',
  title: 'AIP-85: Rebrand agEUR into EURA',
  url: 'https://gov.angle.money/t/aip-85-rebrand-ageur-into-eura/809',
  publisher: 'Angle Governance Forum',
  published_at: '2024-02-26',
  archived_url: 'https://web.archive.org/web/*/https://gov.angle.money/t/aip-85-rebrand-ageur-into-eura/809',
  accessed_at: today,
  reliability: 'high',
  claim_scope: 'rebrand_governance_context',
  stablecoin_ids: ['sog_st_eura'],
  organization_ids: ['sog_issuer_angle'],
  event_ids: ['sog_ev_eura_2024_03_rebrand'],
  claim_scopes: ['governance_proposal', 'symbol_change', 'name_change']
}, evidenceFile);
writeJson(evidenceFile, evidence);

const queueFile = 'data/quality/launch-date-unresolved.json';
const queue = readJson(queueFile);
const before = queue.records.length;
queue.records = queue.records.filter((row) => row.stablecoin_id !== 'sog_st_eura');
if (queue.records.length !== before - 1) throw new Error('EURA queue record missing or duplicated');
queue.expected_total = queue.records.length;
queue.category_counts.C = queue.records.filter((row) => row.category === 'C').length;
queue.category_counts.B = queue.records.filter((row) => row.category === 'B').length;
queue.category_counts.D = queue.records.filter((row) => row.category === 'D').length;
writeJson(queueFile, queue);

const baselineFile = 'docs/migration/registry-v2-baseline.json';
const baseline = readJson(baselineFile);
baseline.baseline_id = 'sog_registry_v2_eura_lineage_2026_06_23';
baseline.captured_at = today;
baseline.source_commit = 'category-c-eura-lineage';
for (const [name, files] of Object.entries(baseline.data_groups ?? {})) baseline.minimum_counts[name] = countGroup(files);
writeJson(baselineFile, baseline);

const foundation = readJson('docs/migration/registry-v3-foundation.json');
const income = readJson('docs/migration/registry-v3-income-profiles.json');
const v3File = 'docs/migration/registry-v3-baseline.json';
const v3 = readJson(v3File);
v3.baseline_id = 'sog_registry_v3_eura_lineage_2026_06_23';
v3.recorded_at = today;
v3.data_checkpoint_commit = 'category-c-eura-lineage';
for (const [name, count] of Object.entries(baseline.minimum_counts)) {
  if (name !== 'classification_extensions' && name !== 'evidence_relations') v3.expected_counts[name] = count;
}
for (const [name, files] of Object.entries(foundation.data_groups ?? {})) v3.expected_counts[name] = countGroup(files);
v3.expected_counts.income_profiles = countGroup(income.data_files);
v3.quality.launch_date_unresolved = queue.expected_total;
writeJson(v3File, v3);

let readme = readText('README.md');
readme = readme.replace(/\d+ events/, `${baseline.minimum_counts.events} events`);
readme = readme.replace(/\d+ Event v2 detail records/, `${baseline.minimum_counts.event_details} Event v2 detail records`);
readme = readme.replace(/\d+ evidence records/, `${baseline.minimum_counts.evidence} evidence records`);
readme = readme.replace(/\d+ evidence relation projections/, `${baseline.minimum_counts.evidence} evidence relation projections`);
readme = readme.replace(/\d+ unresolved launch dates/, `${queue.expected_total} unresolved launch dates`);
writeText('README.md', readme);

const reviewFile = 'docs/audits/remaining-launch-date-review.md';
if (fs.existsSync(path.join(root, reviewFile))) {
  let review = readText(reviewFile);
  review = review.replace(/Category C:\s+27/g, 'Category C:                          26');
  review = review.replace(/Remaining launch_date null:\s+33/g, 'Remaining launch_date null:         32');
  review = review.replace(/Missing launch dates:\s+33/g, 'Missing launch dates:             32');
  writeText(reviewFile, review);
}

const auditFile = 'docs/audits/eura-launch-lineage.md';
writeText(auditFile, `# EURA launch and lineage audit\n\nRecorded: 2026-06-23\n\n## Decision\n\n- Canonical asset launch: 2021-11-03\n- Launch identity: agEUR\n- Current identity: EURA\n- Rebrand date: 2024-03-14\n- Asset continuity: same token identity\n\n## Evidence boundary\n\nAngle announced the Ethereum mainnet launch on 2021-11-03 with agEUR as the protocol euro stablecoin. The 2024-03-14 Angle announcement states that agEUR became EURA, while the existing token address remained unchanged and no separate token was introduced.\n\n## Registry treatment\n\nThe asset launch date is therefore anchored to the agEUR mainnet launch. The EURA rename is stored as a separate governance/rebrand event and is not used as a replacement launch date. agEUR remains an alias, not a separate stablecoin record.\n`);

console.log(`Applied EURA lineage update: ${baseline.minimum_counts.events} events, ${baseline.minimum_counts.evidence} evidence, ${queue.expected_total} unresolved launch dates.`);
