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

const availabilityEventId = 'sog_ev_musd_mainnet_availability_2020';
const securityEventId = 'sog_ev_musd_security_program_2020';

const stablecoinPath = 'data/stablecoins-batch-d.json';
const stablecoins = readJson(stablecoinPath);
const musd = requireRow(stablecoins, 'sog_st_musd', stablecoinPath);
musd.launch_date = null;
musd.last_verified_at = '2026-06-25';
musd.notes = 'Batch D promotion. The Ethereum contract was verified on 2020-05-28. A contemporaneous record and independent historical account identify 2020-05-29 as the strongest public-mainnet candidate, while official production-security coverage is fixed to 2020-06-05. The original first-party launch announcement, exact creation transaction, and first permissionless mint remain unresolved.';
writeJson(stablecoinPath, stablecoins);

const eventsPath = 'data/events-batch-d.json';
const events = readJson(eventsPath);
ensureAbsent(events, availabilityEventId, eventsPath);
ensureAbsent(events, securityEventId, eventsPath);
events.push(
  {
    id: availabilityEventId,
    stablecoin_id: 'sog_st_musd',
    issuer_id: 'sog_issuer_mstable',
    event_type: 'mainnet_availability_report',
    event_date: '2020-05-29',
    title: 'mStable mainnet availability is reported',
    description: 'A contemporaneous community link record announced that mStable was live on mainnet on May 29, 2020, and a later independent historical account identified the same date. The original first-party outbound announcement was not recovered, so this event is medium-confidence and does not set the canonical launch date.',
    impact_level: 'medium',
    event_status_effect: 'active',
    recovered: null,
    recovery_date: null,
    failure_mechanism: 'not_applicable',
    confidence: 'medium',
    source_count: 2,
    notes: 'Best-known public-launch candidate only. The canonical launch_date remains null.'
  },
  {
    id: securityEventId,
    stablecoin_id: 'sog_st_musd',
    issuer_id: 'sog_issuer_mstable',
    event_type: 'production_security_program_start',
    event_date: '2020-06-05',
    title: 'mStable production security program covers core mUSD functions',
    description: 'mStable documentation states that its production bug-bounty program had been running since June 5, 2020 and covered the mAsset contracts together with MINT, SWAP, REDEEM, and SAVE functionality.',
    impact_level: 'medium',
    event_status_effect: 'active',
    recovered: null,
    recovery_date: null,
    failure_mechanism: 'not_applicable',
    confidence: 'high',
    source_count: 1,
    notes: 'This confirms production functionality by June 5 and remains separate from the unresolved original public-launch day.'
  }
);
writeJson(eventsPath, events);

const detailsPath = 'data/event-details-batch-d.json';
const details = readJson(detailsPath);
ensureAbsent(details, availabilityEventId, detailsPath);
ensureAbsent(details, securityEventId, detailsPath);
details.push(
  {
    id: availabilityEventId,
    title: 'mStable mainnet availability is reported',
    subject_stablecoin_ids: ['sog_st_musd'],
    subject_organization_ids: ['sog_issuer_mstable'],
    evidence_ids: ['sog_src_musd_mainnet_record_2020', 'sog_src_musd_defiant_history_2020'],
    event_detail_kind: 'other'
  },
  {
    id: securityEventId,
    title: 'mStable production security program covers core mUSD functions',
    subject_stablecoin_ids: ['sog_st_musd'],
    subject_organization_ids: ['sog_issuer_mstable'],
    evidence_ids: ['sog_src_musd_security_program_2020'],
    event_detail_kind: 'other'
  }
);
writeJson(detailsPath, details);

const evidencePath = 'data/evidence-batch-d.json';
const evidence = readJson(evidencePath);
const additions = [
  {
    id: 'sog_src_musd_contract_verification_2020',
    stablecoin_id: 'sog_st_musd',
    issuer_id: 'sog_issuer_mstable',
    event_id: null,
    source_type: 'onchain_contract',
    title: 'mUSD Ethereum contract and source verification',
    url: 'https://etherscan.io/address/0xe2f2a5C287993345a840Db3B0845fbC70f5935a5',
    publisher: 'Etherscan',
    published_at: '2020-05-28',
    archived_url: 'https://web.archive.org/web/*/https://etherscan.io/address/0xe2f2a5C287993345a840Db3B0845fbC70f5935a5',
    accessed_at: '2026-06-25',
    reliability: 'high',
    claim_scope: 'ethereum_contract_identity_and_verification',
    stablecoin_ids: ['sog_st_musd'],
    organization_ids: ['sog_issuer_mstable'],
    event_ids: [],
    claim_scopes: ['contract_identity', 'source_verification_date', 'deployment_readiness'],
    notes: 'Etherscan identifies the official mUSD contract and records source-code submission for verification on 2020-05-28. The exact creation transaction and public launch remain unresolved.'
  },
  {
    id: 'sog_src_musd_mainnet_record_2020',
    stablecoin_id: 'sog_st_musd',
    issuer_id: 'sog_issuer_mstable',
    event_id: availabilityEventId,
    source_type: 'contemporaneous_record',
    title: 'mStable Now Live on Mainnet',
    url: 'https://www.reddit.com/r/ethfinance/comments/gsu4ae',
    publisher: 'EthFinance community link record',
    published_at: '2020-05-29',
    archived_url: 'https://web.archive.org/web/*/https://www.reddit.com/r/ethfinance/comments/gsu4ae',
    accessed_at: '2026-06-25',
    reliability: 'medium',
    claim_scope: 'contemporaneous_mainnet_availability_record',
    stablecoin_ids: ['sog_st_musd'],
    organization_ids: ['sog_issuer_mstable'],
    event_ids: [availabilityEventId],
    claim_scopes: ['candidate_launch_date', 'mainnet_availability'],
    notes: 'The dated title is preserved, but the original shared first-party outbound URL was not recovered.'
  },
  {
    id: 'sog_src_musd_defiant_history_2020',
    stablecoin_id: 'sog_st_musd',
    issuer_id: 'sog_issuer_mstable',
    event_id: availabilityEventId,
    source_type: 'news_article',
    title: 'DeFi Produces COMP Short Selling',
    url: 'https://thedefiant.io/newsletter/archive/defi-produces-comp-short-selling',
    publisher: 'The Defiant',
    publhed_at: '2020-06-26',
    archived_url: 'https://web.archive.org/web/*/https://thedefiant.io/newsletter/archive/defi-produces-comp-short-selling',
    accessed_at: '2026-06-25',
    reliability: 'medium',
    claim_scope: 'historical_launch_date_support',
    stablecoin_ids: ['sog_st_musd'],
    organization_ids: ['sog_issuer_mstable'],
    event_ids: [availabilityEventId],
    claim_scopes: ['candidate_launch_date', 'early_protocol_history'],
    notes: 'Independent historical support for May 29, 2020. It does not replace a missing first-party launch source.'
  },
  {
    id: 'sog_src_musd_security_program_2020',
    stablecoin_id: 'sog_st_musd',
    issuer_id: 'sog_issuer_mstable',
    event_id: securityEventId,
    source_type: 'official_documentation',
    title: 'mStable bug bounty and production security scope',
    url: 'https://developers.mstable.org/security/bug-bounty',
    publisher: 'mStable Developer Documentation',
    publhed_at: '2020-06-05',
    archived_url: 'https://web.archive.org/web/*/https://developers.mstable.org/security/bug-bounty',
    accessed_at: '2026-06-25',
    reliability: 'high',
    claim_scope: 'production_security_and_functionality',
    stablecoin_ids: ['sog_st_musd'],
    organization_ids: ['sog_issuer_mstable'],
    event_ids: [securityEventId],
    claim_scopes: ['security_program_start', 'masset_contracts', 'mint', 'swap', 'redeem', 'save'],
    notes: 'First-party documentation confirms that production contract functionality was covered by the security program from 2020-06-05.'
  }
];
for (const row of additions) {
  ensureAbsent(evidence, row.id, evidencePath);
  evidence.push(row);
}
writeJson(evidencePath, evidence);

const deploymentPath = 'data/deployments-batch-d.json';
const deployments = readJson(deploymentPath);
const musdDeployment = requireRow(deployments, 'sog_dep_musd_ethereum_batch_d', deploymentPath);
musdDeployment.notes = 'Official Ethereum mUSD token. Source code was submitted for verification on 2020-05-28. The exact creation transaction, first permissionless mint, and canonical public-launch day remain unresolved.';
musdDeployment.evidence_ids = ['sog_src_musd_docs_batch_d', 'sog_src_mstable_withdrawal_batch_d', 'sog_src_musd_contract_verification_2020'];
writeJson(deploymentPath, deployments);

const unknownPath = 'data/known-unknowns-batch-d.json';
const unknowns = readJson(unknownPath);
ensureAbsent(unknowns, 'sog_unk_musd_launch_boundary_batch_d', unknownPath);
unknowns.push({
  id: 'sog_unk_musd_launch_boundary_batch_d',
  stablecoin_id: 'sog_st_musd',
  issuer_id: 'sog_issuer_mstable',
  topic: 'exact_public_launch_boundary',
  description: 'The Ethereum contract verification is fixed to 2020-05-28, May 29 is the strongest recovered mainnet-live candidate, and official production-security coverage is fixed to 2020-06-05. The original first-party launch announcement, exact creation transaction, and first permissionless mint remain unresolved.',
  severity: 'low',
  last_checked_at: '2026-06-25',
  notes: 'Keep launch_date null. Do not substitute contract verification, secondary historical reporting, or later Save activation for a primary-source public-launch boundary.'
});
writeJson(unknownPath, unknowns);

const queuePath = 'data/quality/launch-date-unresolved.json';
const queue = readJson(queuePath);
const musdQueue = queue.records.find((row) => row.stablecoin_id === 'sog_st_musd');
if (!musdQueue) throw new Error(`${queuePath}: missing sog_st_musd`);
musdQueue.best_known_range = '2020-05-29';
musdQueue.reason_code = 'primary_launch_source_not_recovered';
musdQueue.review_note = 'May 28 contract verification, the May 29 mainnet-live candidate, and June 5 official production-security coverage are fixed; the original first-party launch statement, exact creation transaction, and first permissionless mint remain unresolved.';
queue.frozen_at = '2026-06-25';
writeJson(queuePath, queue);
