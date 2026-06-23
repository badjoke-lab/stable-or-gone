import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const today = '2026-06-23';
const read = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const write = (file, value) => fs.writeFileSync(path.join(root, file), `${JSON.stringify(value, null, 2)}\n`);
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const writeText = (file, value) => fs.writeFileSync(path.join(root, file), value);

function requireRow(rows, id, file) {
  const row = rows.find((item) => item.id === id);
  if (!row) throw new Error(`${file}: missing ${id}`);
  return row;
}
function appendUnique(rows, row, file) {
  if (rows.some((item) => item.id === row.id)) throw new Error(`${file}: duplicate ${row.id}`);
  rows.push(row);
}
function countGroup(files = []) {
  return files.flatMap((file) => read(file)).length;
}
function replaceRequired(text, before, after, label) {
  if (!text.includes(before)) throw new Error(`${label}: missing text ${before}`);
  return text.replace(before, after);
}

const stablecoinFile = 'data/stablecoins.json';
const stablecoins = read(stablecoinFile);
Object.assign(requireRow(stablecoins, 'sog_st_susd', stablecoinFile), {
  status: 'impaired',
  reserve_disclosure_status: 'protocol_transparent_with_stressed_market_context',
  redemption_status: 'restricted_market_based_with_retirement_proposal',
  who_can_redeem: 'No generally available immediate one-dollar redemption path is established for ordinary legacy sUSD holders. Market exits remain liquidity-dependent. SIP-423 proposes a snapshot-based SNX compensation and retirement path, but it is Vote Pending and is not an executable redemption program.',
  retail_redemption: 'market_based_or_future_proposal_subject_to_eligibility',
  institutional_redemption: 'market_based_or_future_proposal_subject_to_eligibility',
  minimum_redemption: 'not_established',
  redemption_region_notes: 'Market exits, protocol access, Ethereum and Optimism legacy deployments, future snapshot eligibility, claim routing, DeFi custody, and frontend restrictions must be treated separately.',
  redemption_notes: 'SOG separates the observed market depeg from nominal one-dollar accounting, and separates the Vote Pending SIP-423 proposal from approved or implemented compensation. The proposed four-SNX entitlement is not immediately realizable one-dollar redemption.',
  summary: 'Legacy synthetic USD asset from Synthetix. SOG records sUSD as impaired after a prolonged and severe market depeg, while separately tracking the Vote Pending SIP-423 proposal to retire Ethereum and Optimism legacy sUSD and offer conditional SNX-denominated compensation.',
  confidence: 'high',
  last_verified_at: today,
  notes: 'Major lifecycle update on 2026-06-23. SIP-423 remains Vote Pending; sUSD is not classified as failed, discontinued, migrated, or terminated. Exact launch lineage, market low, snapshot, claim contract, eligibility, vote result, and implementation remain unresolved.'
});
write(stablecoinFile, stablecoins);

const classificationFile = 'data/stablecoin-classification-v2.json';
const classifications = read(classificationFile);
Object.assign(requireRow(classifications, 'sog_st_susd', classificationFile), {
  lifecycle_status: 'restricted',
  issuance_status: 'restricted',
  classification_notes: 'sUSD remains a live legacy token but is materially impaired by a persistent severe depeg. SNX-backed minting was deprecated during Synthetix redesign, and SIP-423 proposes—but has not yet approved or implemented—retirement and conditional SNX compensation.'
});
write(classificationFile, classifications);

const profileFile = 'data/stablecoin-profiles-v2.json';
const profiles = read(profileFile);
const susdProfile = requireRow(profiles, 'sog_st_susd', profileFile);
susdProfile.reserve_profile = {
  backing_types: ['crypto_collateral'],
  summary: 'Backing and debt positions remain protocol-visible within the Synthetix system, but protocol accounting does not establish an immediately realizable one-dollar exit for ordinary holders during the severe market depeg.',
  disclosure_status: 'protocol_transparent_with_market_impairment',
  as_of_date: today,
  latest_report_id: 'sog_reserve_susd_protocol_seed',
  confidence: 'medium',
  evidence_ids: ['sog_src_susd_synthetix_docs', 'sog_src_susd_rebuilding_2026', 'sog_src_susd_sip423_2026']
};
susdProfile.redemption_profile = {
  status: 'restricted',
  settlement_asset: 'market_exit_or_proposed_snx_compensation',
  eligible_parties: 'Current market exits depend on available liquidity. The SIP-423 compensation path would be limited to a future governance-defined snapshot and final claim rules if approved and implemented.',
  retail_access: 'market_based_or_future_snapshot_claim',
  institutional_access: 'market_based_or_future_snapshot_claim',
  minimum_amount_text: 'Not established.',
  fee_text: 'Market, network, claim, and final governance terms remain applicable or unresolved.',
  settlement_time_text: 'No immediate one-dollar settlement is established; proposed SNX receipt and vesting timing remains subject to approval and implementation.',
  jurisdiction_restrictions: ['Frontend, wallet, jurisdiction, custody, and final claim restrictions remain unresolved.'],
  redemption_url: 'https://sips.synthetix.io/sips/sip-423',
  as_of_date: today,
  confidence: 'medium',
  evidence_ids: ['sog_src_susd_sip423_2026', 'sog_src_susd_sip_status_2026', 'sog_src_susd_metamask_market_2026_06_18']
};
write(profileFile, profiles);

const eventsFile = 'data/events-pr038.json';
const events = read(eventsFile);
appendUnique(events, {
  id: 'sog_ev_susd_severe_depeg_2026',
  stablecoin_id: 'sog_st_susd',
  issuer_id: 'sog_issuer_synthetix',
  event_type: 'major_depeg',
  event_date: '2026-06-18',
  title: 'sUSD remains in a severe market depeg',
  description: 'An indexed Ethereum market observation showed sUSD near $0.3104 on June 18, 2026, after Synthetix had already acknowledged that sUSD had traded below $0.70 for months. SOG records a severe unresolved depeg without treating one venue observation or an unverified quote as a universal redemption value or canonical all-time low.',
  impact_level: 'high',
  event_status_effect: 'impaired',
  recovered: false,
  recovery_date: null,
  failure_mechanism: 'persistent_market_depeg_and_impaired_exit_liquidity',
  confidence: 'medium',
  source_count: 3,
  notes: 'The $0.3104 observation is source-specific. User-provided screenshots suggested executable quotes near $0.74 and later $0.25 for 10,000 sUSD, but route, pool, block, chain, and timestamp were not canonicalized and those quotes are not stored as the official low.'
}, eventsFile);
appendUnique(events, {
  id: 'sog_ev_susd_sip423_proposed_2026',
  stablecoin_id: 'sog_st_susd',
  issuer_id: 'sog_issuer_synthetix',
  event_type: 'governance_change_proposed',
  event_date: '2026-06-12',
  title: 'SIP-423 proposes legacy sUSD retirement and SNX compensation',
  description: 'SIP-423 entered Vote Pending status with a proposal to retire legacy sUSD on Ethereum and Optimism, suspend transfer, mint, and burn functions after a successful vote, snapshot eligible holdings, close the 420 Pool structure, reform staking exits, and offer a proposed entitlement of four newly minted SNX per eligible sUSD. The proposal is not approved or implemented.',
  impact_level: 'critical',
  event_status_effect: 'impaired_context',
  recovered: null,
  recovery_date: null,
  failure_mechanism: 'governance_proposed_legacy_retirement_and_compensation',
  confidence: 'high',
  source_count: 5,
  notes: 'Vote Pending is distinct from Approved and Implemented. Snapshot block, final eligibility, claim contract, claim opening, vesting clock, expiration treatment, and execution transactions remain unresolved.'
}, eventsFile);
write(eventsFile, events);

const detailsFile = 'data/event-details-v2.json';
const details = read(detailsFile);
appendUnique(details, {
  id: 'sog_ev_susd_severe_depeg_2026',
  title: 'sUSD remains in a severe market depeg',
  subject_stablecoin_ids: ['sog_st_susd'],
  subject_organization_ids: ['sog_issuer_synthetix'],
  evidence_ids: ['sog_src_susd_rebuilding_2026', 'sog_src_susd_metamask_market_2026_06_18', 'sog_src_susd_sip423_2026'],
  event_detail_kind: 'depeg',
  depeg_detail: {
    direction: 'below_peg',
    peg_reference: '1 USD',
    extreme_price: 0.3104,
    maximum_deviation_bps: 6896,
    recovery_status: 'not_recovered',
    recovery_date: null,
    cause_summary: 'Persistent market depeg and weak immediately realizable exit value during a broader Synthetix debt-pool and staking-system transition.',
    price_source_ids: ['sog_src_susd_metamask_market_2026_06_18']
  }
}, detailsFile);
appendUnique(details, {
  id: 'sog_ev_susd_sip423_proposed_2026',
  title: 'SIP-423 proposes legacy sUSD retirement and SNX compensation',
  subject_stablecoin_ids: ['sog_st_susd'],
  subject_organization_ids: ['sog_issuer_synthetix'],
  evidence_ids: ['sog_src_susd_sip423_2026', 'sog_src_susd_sip_status_2026', 'sog_src_susd_sip420_2024', 'sog_src_susd_rebuilding_2026', 'sog_src_susd_roadmap_2026'],
  event_detail_kind: 'governance_change',
  governance_change_detail: {
    summary: 'Vote Pending proposal for Ethereum and Optimism legacy sUSD retirement, a governance-defined holder snapshot, conditional four-SNX entitlement, 420 Pool closure, and staking reform.',
    status: 'vote_pending_not_approved_or_implemented',
    resolution_date: null,
    affected_deployment_ids: ['sog_dep_susd_ethereum_seed', 'sog_dep_susd_optimism_legacy'],
    related_organization_ids: ['sog_issuer_synthetix']
  }
}, detailsFile);
write(detailsFile, details);

const evidenceFile = 'data/evidence.json';
const evidence = read(evidenceFile);
const evidenceRows = [
  {
    id: 'sog_src_susd_sip423_2026', stablecoin_id: 'sog_st_susd', issuer_id: 'sog_issuer_synthetix', event_id: 'sog_ev_susd_sip423_proposed_2026', source_type: 'official_governance_proposal', title: 'SIP-423: sUSD Retirement & Staking Reform', url: 'https://sips.synthetix.io/sips/sip-423', publisher: 'Synthetix Improvement Proposals', published_at: '2026-06-12', accessed_at: today, reliability: 'high', claim_scope: 'vote_pending_retirement_compensation_and_staking_reform', notes: 'Primary proposal source. Records Vote Pending status, Ethereum and Optimism scope, proposed transfer/mint/burn suspension, snapshot, four-SNX entitlement, claim and vesting design, 420 Pool closure, Debt Jubilee reform, and deferred implementation work.', stablecoin_ids: ['sog_st_susd'], organization_ids: ['sog_issuer_synthetix'], event_ids: ['sog_ev_susd_severe_depeg_2026', 'sog_ev_susd_sip423_proposed_2026'], claim_scopes: ['governance_status', 'retirement_proposal', 'compensation_proposal', 'snapshot_proposal', '420_pool', 'staking_reform']
  },
  {
    id: 'sog_src_susd_sip_status_2026', stablecoin_id: 'sog_st_susd', issuer_id: 'sog_issuer_synthetix', event_id: 'sog_ev_susd_sip423_proposed_2026', source_type: 'official_governance_documentation', title: 'Synthetix Improvement Proposal status definitions', url: 'https://sips.synthetix.io/', publisher: 'Synthetix Improvement Proposals', published_at: null, accessed_at: today, reliability: 'high', claim_scope: 'proposal_status_taxonomy', notes: 'Defines Vote Pending, Approved, and Implemented as distinct states. Used to prevent the Vote Pending SIP-423 from being represented as an approved or implemented retirement.', stablecoin_ids: ['sog_st_susd'], organization_ids: ['sog_issuer_synthetix'], event_ids: ['sog_ev_susd_sip423_proposed_2026'], claim_scopes: ['vote_pending', 'approved', 'implemented']
  },
  {
    id: 'sog_src_susd_sip420_2024', stablecoin_id: 'sog_st_susd', issuer_id: 'sog_issuer_synthetix', event_id: null, source_type: 'official_governance_proposal', title: 'SIP-420: SNX Staking 420 Pool', url: 'https://sips.synthetix.io/sips/sip-420', publisher: 'Synthetix Improvement Proposals', published_at: '2024-12-18', accessed_at: today, reliability: 'high', claim_scope: '420_pool_and_protocol_owned_debt_context', notes: 'Primary historical governance source for the implemented 420 Pool, delegated staking, protocol-owned debt, debt migration, and sUSD-related liquidity structure preceding SIP-423.', stablecoin_ids: ['sog_st_susd'], organization_ids: ['sog_issuer_synthetix'], event_ids: ['sog_ev_susd_sip423_proposed_2026'], claim_scopes: ['420_pool', 'debt_jubilee', 'staking', 'protocol_owned_debt']
  },
  {
    id: 'sog_src_susd_rebuilding_2026', stablecoin_id: 'sog_st_susd', issuer_id: 'sog_issuer_synthetix', event_id: 'sog_ev_susd_severe_depeg_2026', source_type: 'official_protocol_update', title: 'Rebuilding sUSD', url: 'https://blog.synthetix.io/rebuilding-susd/', publisher: 'Synthetix', published_at: '2026-02-12', accessed_at: today, reliability: 'high', claim_scope: 'persistent_depeg_and_repeg_measures', notes: 'Synthetix acknowledged that sUSD had remained depegged for months and was below $0.70, described deprecation of SNX-backed sUSD minting during redesign, and outlined 420 Pool and repeg measures.', stablecoin_ids: ['sog_st_susd'], organization_ids: ['sog_issuer_synthetix'], event_ids: ['sog_ev_susd_severe_depeg_2026', 'sog_ev_susd_sip423_proposed_2026'], claim_scopes: ['persistent_depeg', 'minting_deprecation', 'repeg_plan', '420_pool']
  },
  {
    id: 'sog_src_susd_roadmap_2026', stablecoin_id: 'sog_st_susd', issuer_id: 'sog_issuer_synthetix', event_id: 'sog_ev_susd_sip423_proposed_2026', source_type: 'official_protocol_roadmap', title: 'Synthetix 2026 Roadmap', url: 'https://blog.synthetix.io/2026-roadmap/', publisher: 'Synthetix', published_at: '2026-03-13', accessed_at: today, reliability: 'high', claim_scope: 'repeg_buybacks_and_collateral_transition_plan', notes: 'Official roadmap source for buybacks, Q2 stability goals, and a later basis-trade collateral transition. Used as pre-SIP-423 lifecycle context, not as evidence that the roadmap succeeded.', stablecoin_ids: ['sog_st_susd'], organization_ids: ['sog_issuer_synthetix'], event_ids: ['sog_ev_susd_sip423_proposed_2026'], claim_scopes: ['roadmap', 'repeg_plan', 'buybacks', 'collateral_transition']
  },
  {
    id: 'sog_src_susd_metamask_market_2026_06_18', stablecoin_id: 'sog_st_susd', issuer_id: 'sog_issuer_synthetix', event_id: 'sog_ev_susd_severe_depeg_2026', source_type: 'market_data_page', title: 'MetaMask sUSD price page', url: 'https://metamask.io/price/susd', publisher: 'MetaMask', published_at: null, accessed_at: today, reliability: 'medium', claim_scope: 'ethereum_market_price_observation', notes: 'Third-party indexed observation showing Ethereum sUSD near $0.3104 on 2026-06-18 04:37 UTC. This is venue/source-specific market evidence, not a guaranteed redemption value or canonical all-time low.', stablecoin_ids: ['sog_st_susd'], organization_ids: ['sog_issuer_synthetix'], event_ids: ['sog_ev_susd_severe_depeg_2026'], claim_scopes: ['market_price', 'depeg', 'ethereum_contract_context']
  }
];
for (const row of evidenceRows) appendUnique(evidence, row, evidenceFile);
write(evidenceFile, evidence);

const unknownsFile = 'data/known-unknowns.json';
const unknowns = read(unknownsFile);
Object.assign(requireRow(unknowns, 'sog_unknown_susd_v2_v3_lifecycle', unknownsFile), {
  description: 'sUSD launch lineage from eUSD to nUSD to sUSD, Synthetix V2/V3 boundaries, SNX-backed minting deprecation, 420 Pool history, debt-pool mechanics, and any successor or parallel stable assets require a dedicated source-backed lifecycle backfill.',
  severity: 'high',
  last_checked_at: today,
  notes: 'The 2026 impaired-state and SIP-423 proposal are now recorded separately. The older lineage and version-boundary audit remains unresolved.'
});
const unknownRows = [
  ['sog_unknown_susd_sip423_governance_implementation', 'sip423_governance_and_implementation', 'SIP-423 remains Vote Pending. Vote opening and closing dates, Spartan Council result, approval or rejection, implementation schedule, deployed contracts, and on-chain execution transactions are not yet established.'],
  ['sog_unknown_susd_snapshot_claim_eligibility', 'snapshot_claim_and_compensation_eligibility', 'The final snapshot block, eligible contracts and wallets, treatment of post-snapshot purchases, LP and vault receipts, DeFi deposits, Optimism Safe routing, claim opening and deadline, burn mechanics, maximum SNX issuance, lock start, vesting start, transferability, and frontend or jurisdiction restrictions remain unresolved.'],
  ['sog_unknown_susd_420_pool_exit_treatment', '420_pool_staker_exit_and_debt_treatment', 'Final handling of each 420 Pool position, debt-backed SNX, debt-free SNX, returned sUSD, early debt repayment, cooldown, accrued and undistributed rewards, four-year continuation lock, one-year vesting, and any alternative USDT compensation remains subject to approval and implementation details.'],
  ['sog_unknown_susd_depeg_market_execution', 'depeg_market_price_and_execution', 'The canonical market low, exact duration, Ethereum and Optimism price divergence, pool reserves, TVL, route, block, spot price, and executable prices for 1,000, 10,000, and 100,000 sUSD remain source-specific. User screenshots are investigation leads and are not canonical price evidence without route and timestamp verification.']
];
for (const [id, topic, description] of unknownRows) appendUnique(unknowns, { id, stablecoin_id: 'sog_st_susd', issuer_id: 'sog_issuer_synthetix', topic, description, severity: 'high', last_checked_at: today, notes: 'Keep visible until direct governance, contract, pool, or market evidence resolves the field.' }, unknownsFile);
write(unknownsFile, unknowns);

const deploymentsFile = 'data/deployments.json';
const deployments = read(deploymentsFile);
Object.assign(requireRow(deployments, 'sog_dep_susd_ethereum_seed', deploymentsFile), {
  status: 'impaired_retirement_proposed',
  notes: 'Ethereum legacy sUSD remains a live impaired deployment. SIP-423 proposes transfer, mint, and burn suspension after a successful vote and a seven-day implementation window; those changes are not yet approved or implemented. Exact canonical contract metadata remains under source review.',
  evidence_ids: ['sog_src_susd_synthetix_docs', 'sog_src_susd_sip423_2026', 'sog_src_susd_metamask_market_2026_06_18']
});
appendUnique(deployments, {
  id: 'sog_dep_susd_optimism_legacy',
  stablecoin_id: 'sog_st_susd',
  chain: 'Optimism',
  deployment_type: 'legacy_protocol_token',
  contract_address: 'source_review_needed',
  status: 'retirement_proposed',
  notes: 'SIP-423 explicitly includes Optimism legacy sUSD in the proposed retirement. Exact contract identity, bridge and custody treatment, snapshot routing, and current transfer or mint state require direct chain-specific verification. No suspension is recorded before implementation.',
  evidence_ids: ['sog_src_susd_synthetix_docs', 'sog_src_susd_sip423_2026']
}, deploymentsFile);
write(deploymentsFile, deployments);

const auditFile = 'docs/audits/susd-2026-depeg-and-sip423.md';
const audit = `# sUSD 2026 Severe Depeg and SIP-423 Audit\n\nRecorded: 2026-06-23\n\n## Decision\n\n- Asset status: impaired\n- SIP-423 status: Vote Pending\n- Not classified as failed, discontinued, migrated, or terminated\n- No canonical $0.25 market low recorded\n- No approval, implementation, snapshot, or claim event recorded\n\n## Canonical event split\n\n1. 2026-06-18 severe unresolved market depeg, using a source-specific $0.3104 Ethereum observation.\n2. 2026-06-12 SIP-423 Vote Pending retirement and SNX-compensation proposal.\n3. Future vote result remains a separate event.\n4. Future contract suspension, snapshot, receipt deployment, claim opening, or terminal state remains a separate event.\n\n## Proposal boundaries\n\nSIP-423 proposes Ethereum and Optimism legacy sUSD retirement, a governance-defined snapshot, a four-SNX entitlement per eligible sUSD, 420 Pool closure, and staking reform. These are proposal terms, not currently executable redemption rights. Nominal compensation value is not immediately realizable redemption value.\n\n## Evidence hierarchy\n\nPrimary sources: SIP-423, SIP status definitions, SIP-420, Rebuilding sUSD, and the 2026 roadmap. The MetaMask price page is retained only as a third-party market observation. User screenshots remain investigation leads because route, pool, block, timestamp, and chain were not canonicalized.\n\n## Remaining unknowns\n\nVote result, implementation date, snapshot block, eligible holdings, LP and vault handling, claim contract, SNX issuance cap, lock and vesting clocks, claim expiration, 420 Pool position treatment, Optimism contract identity, canonical market low, and final terminal date remain unresolved.\n`;
fs.mkdirSync(path.dirname(path.join(root, auditFile)), { recursive: true });
writeText(auditFile, audit);

const baselineFile = 'docs/migration/registry-v2-baseline.json';
const baseline = read(baselineFile);
baseline.baseline_id = 'sog_registry_v2_susd_impaired_sip423_2026_06_23';
baseline.captured_at = today;
baseline.source_commit = 'record-susd-depeg-sip423';
for (const [name, files] of Object.entries(baseline.data_groups ?? {})) baseline.minimum_counts[name] = countGroup(files);
write(baselineFile, baseline);

const foundation = read('docs/migration/registry-v3-foundation.json');
const income = read('docs/migration/registry-v3-income-profiles.json');
const v3File = 'docs/migration/registry-v3-baseline.json';
const v3 = read(v3File);
v3.baseline_id = 'sog_registry_v3_susd_impaired_sip423_2026_06_23';
v3.recorded_at = today;
v3.data_checkpoint_commit = 'record-susd-depeg-sip423';
for (const [name, count] of Object.entries(baseline.minimum_counts)) v3.expected_counts[name] = count;
for (const [name, files] of Object.entries(foundation.data_groups ?? {})) v3.expected_counts[name] = countGroup(files);
v3.expected_counts.income_profiles = countGroup(income.data_files);
write(v3File, v3);

const counts = baseline.minimum_counts;
let readme = readText('README.md');
const replacements = [
  ['111 events', `${counts.events} events`],
  ['111 Event v2 detail records', `${counts.event_details} Event v2 detail records`],
  ['340 evidence records', `${counts.evidence} evidence records`],
  ['340 evidence relation projections', `${counts.evidence} evidence relation projections`],
  ['195 known unknowns', `${counts.known_unknowns} known unknowns`],
  ['112 deployments', `${counts.deployments} deployments`]
];
for (const [before, after] of replacements) readme = replaceRequired(readme, before, after, 'README.md');
writeText('README.md', readme);

let roadmap = readText('docs/roadmap.md');
roadmap = roadmap.replace(/Latest merged checkpoint:\n\n```text\n[\s\S]*?\n```/, 'Latest merged checkpoint:\n\n```text\nPR #103 — Record Category C lineage audit plan\nMerge: 8d2aa3b8bc27e67332e37ead057854bb5f56d304\n```');
roadmap = roadmap.replace(/Current quality PR:\n\n```text\n[\s\S]*?\n```/, 'Current quality work:\n\n```text\nsUSD severe depeg and SIP-423 Vote Pending proposal\nBranch: record-susd-depeg-sip423\n```');
for (const [before, after] of replacements.filter(([before]) => !before.includes('relation projections'))) roadmap = replaceRequired(roadmap, before, after, 'docs/roadmap.md');
writeText('docs/roadmap.md', roadmap);

console.log(`Applied sUSD update: ${counts.events} events, ${counts.event_details} details, ${counts.evidence} evidence, ${counts.known_unknowns} unknowns, ${counts.deployments} deployments.`);
