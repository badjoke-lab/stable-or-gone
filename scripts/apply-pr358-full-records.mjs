import fs from 'node:fs';

const writeJson = (file, value) => fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const replaceRequired = (file, from, to) => {
  const body = fs.readFileSync(file, 'utf8');
  if (!body.includes(from)) throw new Error(`${file}: replacement anchor missing: ${from.slice(0, 80)}`);
  fs.writeFileSync(file, body.replace(from, to));
};

const checkedAt = '2026-07-13';

const stablecoins = [
  {
    id: 'sog_st_xusd', slug: 'straitsx-usd-xusd', name: 'StraitsX USD', symbol: 'XUSD',
    aliases: ['XUSD', 'StraitsX XUSD', 'StraitsX USD'], status: 'active', issuer_id: 'sog_issuer_straitsx_singapore', peg_asset: 'USD',
    collateral_model: 'fiat_reserve_backed', reserve_disclosure_status: 'monthly_attestations_published', redemption_status: 'eligible_customers_only',
    who_can_redeem: 'Eligible StraitsX customers may convert XUSD to US dollars subject to account onboarding, product availability, fees, limits, and applicable jurisdiction restrictions.',
    retail_redemption: 'available_subject_to_onboarding', institutional_redemption: 'available_subject_to_onboarding', minimum_redemption: 'not_stated_in_reviewed_public_source',
    redemption_region_notes: 'Availability depends on StraitsX onboarding and jurisdiction rules. The public product page documents USD transfer and XUSD transfer pricing but does not establish universal access.',
    redemption_notes: 'The official product page states that XUSD is fully backed by reserve assets and redeemable 1:1 for US dollars. This record does not infer deposit insurance, bankruptcy remoteness, or universal redemption eligibility.',
    launch_date: null, discontinued_date: null,
    summary: 'US-dollar stablecoin issued under the StraitsX product family, with official Ethereum, BNB Smart Chain, and Solana identifiers, published reserve attestations, and issuer-mediated 1:1 US-dollar redemption.',
    confidence: 'high', last_verified_at: checkedAt,
    notes: 'PR #358 full-record promotion. Exact first public issuance date and the current legal issuer entity name remain explicit known unknowns.'
  },
  {
    id: 'sog_st_usdb', slug: 'blast-usdb', name: 'USDB', symbol: 'USDB',
    aliases: ['Blast USDB', 'Blast USD'], status: 'active', issuer_id: 'sog_org_blast', peg_asset: 'USD',
    collateral_model: 'protocol_bridged_stablecoin_with_native_rebase', reserve_disclosure_status: 'official_protocol_backing_description_no_asset_level_attestation', redemption_status: 'protocol_based',
    who_can_redeem: 'Users may bridge USDB back to Ethereum for DAI through the Blast bridge, subject to bridge operation, protocol rules, and applicable access conditions.',
    retail_redemption: 'protocol_bridge_available', institutional_redemption: 'protocol_bridge_available', minimum_redemption: 'not_stated_in_reviewed_public_source',
    redemption_region_notes: 'Protocol bridge access is not equivalent to a direct fiat redemption right and may depend on wallet, bridge, network, and interface availability.',
    redemption_notes: 'Blast documentation describes USDB as an auto-rebasing native stablecoin received when bridging stablecoins and redeemable for DAI when bridging back to Ethereum. No direct fiat claim or legal issuer claim is inferred.',
    launch_date: '2024-02-29', discontinued_date: null,
    summary: 'Blast-native auto-rebasing USD-referenced stablecoin. Official protocol documentation describes DAI bridge redemption and yield historically sourced from MakerDAO on-chain T-bill infrastructure.',
    confidence: 'high', last_verified_at: checkedAt,
    notes: 'PR #358 full-record promotion. Legal claim counterparty, bridge custody terms, current yield-source allocation, and governance controls remain explicit known unknowns.'
  }
];

const organizations = [
  {
    id: 'sog_issuer_straitsx_singapore', slug: 'straitsx-singapore', name: 'StraitsX Singapore',
    organization_type: 'regulated_payment_token_issuer', legacy_issuer_type: 'company', jurisdiction: 'Singapore', official_url: 'https://www.straitsx.com/sg',
    summary: 'StraitsX operating and issuer organization associated with XUSD and the StraitsX stablecoin platform in Singapore.', confidence: 'high', last_verified_at: checkedAt,
    notes: 'The public StraitsX site establishes the brand and issuer family. The exact legal entity name responsible for every XUSD holder claim remains separately tracked as a known unknown.'
  },
  {
    id: 'sog_org_blast', slug: 'blast', name: 'Blast', organization_type: 'protocol_ecosystem', legacy_issuer_type: 'protocol', jurisdiction: 'Decentralized / protocol', official_url: 'https://blast.io/',
    summary: 'Ethereum layer-2 protocol ecosystem that operates the native-yield and bridge infrastructure associated with USDB.', confidence: 'high', last_verified_at: checkedAt,
    notes: 'Blast is modeled as protocol operator, not asserted as a legal fiat issuer or direct holder-claim counterparty.'
  }
];

const relationships = [
  {
    id: 'sog_rel_xusd_straitsx_pr358', stablecoin_id: 'sog_st_xusd', organization_id: 'sog_issuer_straitsx_singapore', role: 'legal_issuer', start_date: null, end_date: null, status: 'active',
    evidence_ids: ['sog_src_xusd_product_pr358', 'sog_src_xusd_sg_pr358'],
    notes: 'Official StraitsX product and Singapore pages associate XUSD with StraitsX. Exact legal-entity naming remains subject to terms-level verification.'
  },
  {
    id: 'sog_rel_usdb_blast_pr358', stablecoin_id: 'sog_st_usdb', organization_id: 'sog_org_blast', role: 'protocol_operator', start_date: '2024-02-29', end_date: null, status: 'active',
    evidence_ids: ['sog_src_usdb_docs_pr358', 'sog_src_usdb_contract_pr358'],
    notes: 'Blast operates the protocol, bridge, rebasing, and deployment context associated with USDB. This is not a legal-issuer assertion.'
  }
];

const classifications = [
  {
    id: 'sog_st_xusd', lifecycle_status: 'active', issuance_status: 'open',
    peg_reference: { kind: 'fiat', asset: 'USD', target_value: 1, notes: 'XUSD targets one US dollar through issuer reserve backing and redemption.' },
    backing_types: ['cash', 'bank_deposits'], stabilization_mechanism: 'issuer_redemption', governance_model: 'centralized', asset_class: 'stablecoin', reference_target: 'fiat', redemption_or_exit_model: 'issuer_redemption',
    yield_or_rebase_profile: { mode: 'none', accrual_target: 'none', yield_source: 'none', accrual_mechanism: 'none', rate_type: 'none', rate_source: null, notes: 'No issuer-native XUSD yield or balance rebase is asserted.' },
    classification_notes: 'Fiat-reserve-backed issuer stablecoin with direct issuer-mediated USD conversion, monthly attestation publication, and multiple issuer-native deployments.'
  },
  {
    id: 'sog_st_usdb', lifecycle_status: 'active', issuance_status: 'protocol_based',
    peg_reference: { kind: 'fiat', asset: 'USD', target_value: 1, notes: 'USDB is USD-referenced and redeemable through the Blast bridge for DAI rather than directly for fiat.' },
    backing_types: ['stablecoin_collateral', 'tokenized_fund'], stabilization_mechanism: 'hybrid', governance_model: 'protocol_governed', asset_class: 'yield_bearing_stable_receipt', reference_target: 'fiat', redemption_or_exit_model: 'protocol_redemption',
    yield_or_rebase_profile: { mode: 'rebasing', accrual_target: 'asset', yield_source: 'reserve_income', accrual_mechanism: 'balance_rebase', rate_type: 'protocol_determined', rate_source: 'Blast protocol documentation', notes: 'USDB balances rebase automatically. Historical documentation identifies MakerDAO on-chain T-bill infrastructure as the yield source, while allowing future replacement.' },
    classification_notes: 'Protocol-native, bridge-issued, auto-rebasing stablecoin with DAI bridge redemption and external yield-source dependency.'
  }
];

const profiles = [
  {
    id: 'sog_st_xusd',
    reserve_profile: {
      backing_types: ['cash', 'bank_deposits'], summary: 'StraitsX states that XUSD is fully backed by reserve assets and publishes reserve attestation reports from an ISCA-listed auditing firm on a monthly basis.',
      disclosure_status: 'monthly_attestations_published', as_of_date: checkedAt, latest_report_id: 'sog_rr_xusd_attestation_index_pr358', confidence: 'high',
      evidence_ids: ['sog_src_xusd_product_pr358', 'sog_src_xusd_sg_pr358']
    },
    redemption_profile: {
      status: 'eligible_customers_only', settlement_asset: 'USD', eligible_parties: 'Eligible StraitsX customers subject to onboarding, product availability, fees, limits, and jurisdiction restrictions.',
      retail_access: 'available_subject_to_onboarding', institutional_access: 'available_subject_to_onboarding', minimum_amount_text: 'Not established in the reviewed public source set.',
      fee_text: 'The public product page lists transfer pricing; complete issuer-redemption pricing and account-tier terms require terms-level review.', settlement_time_text: 'Not established in the reviewed public source set.',
      jurisdiction_restrictions: ['StraitsX onboarding and jurisdiction restrictions apply.', 'No universal global redemption eligibility is inferred.'], redemption_url: 'https://www.straitsx.com/xusd', as_of_date: checkedAt, confidence: 'high',
      evidence_ids: ['sog_src_xusd_product_pr358', 'sog_src_xusd_sg_pr358']
    }
  },
  {
    id: 'sog_st_usdb',
    reserve_profile: {
      backing_types: ['stablecoin_collateral', 'tokenized_fund'], summary: 'Blast documentation describes USDB as issued when users bridge stablecoins, historically linked to DAI and MakerDAO on-chain T-bill yield. This is a protocol backing description, not an issuer reserve attestation.',
      disclosure_status: 'official_protocol_description_no_asset_level_attestation', as_of_date: checkedAt, latest_report_id: 'sog_rr_usdb_protocol_backing_pr358', confidence: 'high',
      evidence_ids: ['sog_src_usdb_docs_pr358', 'sog_src_usdb_about_pr358']
    },
    redemption_profile: {
      status: 'protocol_based', settlement_asset: 'DAI', eligible_parties: 'Users able to access and operate the Blast bridge.', retail_access: 'protocol_bridge_available', institutional_access: 'protocol_bridge_available',
      minimum_amount_text: 'Not established in the reviewed public source set.', fee_text: 'Bridge and network fees may apply; exact terms require current bridge review.', settlement_time_text: 'Depends on bridge and network operation.',
      jurisdiction_restrictions: ['Protocol and interface access conditions apply.', 'DAI bridge redemption is not direct fiat redemption.'], redemption_url: null, as_of_date: checkedAt, confidence: 'high',
      evidence_ids: ['sog_src_usdb_docs_pr358', 'sog_src_usdb_about_pr358']
    }
  }
];

const events = [
  {
    id: 'sog_ev_xusd_attestation_start_pr358', stablecoin_id: 'sog_st_xusd', issuer_id: 'sog_issuer_straitsx_singapore', event_type: 'mainnet_availability_report', event_date: '2024-02-29',
    title: 'XUSD reserve attestation history is published from February 2024', description: 'The current StraitsX XUSD product page publishes a reserve-attestation series beginning with a 29 February 2024 report and later continuing on a monthly cadence.',
    impact_level: 'medium', confidence: 'high', source_count: 2, event_status_effect: 'active',
    notes: 'This is the earliest dated official XUSD checkpoint in the reviewed source set; it is not asserted as the exact first mint or launch date.'
  },
  {
    id: 'sog_ev_usdb_blast_launch_pr358', stablecoin_id: 'sog_st_usdb', issuer_id: 'sog_org_blast', event_type: 'launch', event_date: '2024-02-29',
    title: 'Blast mainnet introduces native USDB', description: 'Blast mainnet made USDB available as its native auto-rebasing stablecoin, with stablecoin bridge deposits represented as USDB and bridge-back redemption described in DAI.',
    impact_level: 'high', confidence: 'high', source_count: 3, event_status_effect: 'active',
    notes: 'The event records protocol launch context and does not establish a direct fiat issuer claim.'
  }
];

const eventDetails = [
  {
    id: 'sog_ev_xusd_attestation_start_pr358', title: 'XUSD reserve attestation history is published from February 2024', subject_stablecoin_ids: ['sog_st_xusd'], subject_organization_ids: ['sog_issuer_straitsx_singapore'],
    evidence_ids: ['sog_src_xusd_product_pr358', 'sog_src_xusd_sg_pr358'], event_detail_kind: 'launch',
    launch_detail: { summary: 'Earliest dated official XUSD reserve-attestation checkpoint in the reviewed source set.', status: 'active', resolution_date: null, affected_deployment_ids: ['sog_dep_xusd_ethereum_pr358', 'sog_dep_xusd_bsc_pr358', 'sog_dep_xusd_solana_pr358'], related_organization_ids: ['sog_issuer_straitsx_singapore'] }
  },
  {
    id: 'sog_ev_usdb_blast_launch_pr358', title: 'Blast mainnet introduces native USDB', subject_stablecoin_ids: ['sog_st_usdb'], subject_organization_ids: ['sog_org_blast'],
    evidence_ids: ['sog_src_usdb_docs_pr358', 'sog_src_usdb_contract_pr358', 'sog_src_usdb_about_pr358'], event_detail_kind: 'launch',
    launch_detail: { summary: 'Blast mainnet launch context for the native auto-rebasing USDB contract.', status: 'active', resolution_date: null, affected_deployment_ids: ['sog_dep_usdb_blast_pr358'], related_organization_ids: ['sog_org_blast'] }
  }
];

const evidence = [
  {
    id: 'sog_src_xusd_product_pr358', stablecoin_id: 'sog_st_xusd', issuer_id: 'sog_issuer_straitsx_singapore', event_id: 'sog_ev_xusd_attestation_start_pr358', source_type: 'official_website', title: 'XUSD — StraitsX digital US Dollar',
    url: 'https://www.straitsx.com/xusd', publisher: 'StraitsX', published_at: null, archived_url: 'https://web.archive.org/web/*/https://www.straitsx.com/xusd', accessed_at: checkedAt, reliability: 'high',
    claim_scope: 'xusd_identity_reserve_redemption_attestation_and_deployment_context', stablecoin_ids: ['sog_st_xusd'], organization_ids: ['sog_issuer_straitsx_singapore'],
    claim_scopes: ['identity', 'issuer', 'reserve', 'redemption', 'deployment', 'event'], event_ids: ['sog_ev_xusd_attestation_start_pr358']
  },
  {
    id: 'sog_src_xusd_sg_pr358', stablecoin_id: 'sog_st_xusd', issuer_id: 'sog_issuer_straitsx_singapore', event_id: 'sog_ev_xusd_attestation_start_pr358', source_type: 'official_website', title: 'StraitsX Singapore',
    url: 'https://www.straitsx.com/sg', publisher: 'StraitsX', published_at: null, archived_url: 'https://web.archive.org/web/*/https://www.straitsx.com/sg', accessed_at: checkedAt, reliability: 'high',
    claim_scope: 'straitsx_singapore_organization_and_platform_context', stablecoin_ids: ['sog_st_xusd'], organization_ids: ['sog_issuer_straitsx_singapore'],
    claim_scopes: ['organization_identity', 'issuer', 'jurisdiction', 'event'], event_ids: ['sog_ev_xusd_attestation_start_pr358']
  },
  {
    id: 'sog_src_xusd_ledger_launch_pr358', stablecoin_id: 'sog_st_xusd', issuer_id: 'sog_issuer_straitsx_singapore', source_type: 'news_article', title: 'StraitsX launches XUSD',
    url: 'https://www.ledger.com/academy/topics/crypto/straitsx-launches-xusd', publisher: 'Ledger', published_at: null, archived_url: 'https://web.archive.org/web/*/https://www.ledger.com/academy/topics/crypto/straitsx-launches-xusd', accessed_at: checkedAt, reliability: 'medium',
    claim_scope: 'secondary_launch_network_reserve_and_redemption_context', stablecoin_ids: ['sog_st_xusd'], organization_ids: ['sog_issuer_straitsx_singapore'], claim_scopes: ['launch_context', 'deployment', 'reserve', 'redemption'], event_ids: []
  },
  {
    id: 'sog_src_usdb_docs_pr358', stablecoin_id: 'sog_st_usdb', issuer_id: 'sog_org_blast', event_id: 'sog_ev_usdb_blast_launch_pr358', source_type: 'official_documentation', title: 'About Blast',
    url: 'https://docs.blast.io/about-blast', publisher: 'Blast', published_at: null, archived_url: 'https://web.archive.org/web/*/https://docs.blast.io/about-blast', accessed_at: checkedAt, reliability: 'high',
    claim_scope: 'usdb_identity_rebasing_yield_source_and_dai_bridge_redemption', stablecoin_ids: ['sog_st_usdb'], organization_ids: ['sog_org_blast'], claim_scopes: ['identity', 'protocol_operator', 'income', 'redemption', 'backing', 'event'], event_ids: ['sog_ev_usdb_blast_launch_pr358']
  },
  {
    id: 'sog_src_usdb_contract_pr358', stablecoin_id: 'sog_st_usdb', issuer_id: 'sog_org_blast', event_id: 'sog_ev_usdb_blast_launch_pr358', source_type: 'official_documentation', title: 'Blast bridged token addresses',
    url: 'https://docs.blast.io/building/bridged-token-addresses', publisher: 'Blast', published_at: null, archived_url: 'https://web.archive.org/web/*/https://docs.blast.io/building/bridged-token-addresses', accessed_at: checkedAt, reliability: 'high',
    claim_scope: 'usdb_blast_mainnet_contract_identity', stablecoin_ids: ['sog_st_usdb'], organization_ids: ['sog_org_blast'], claim_scopes: ['deployment', 'contract_identity', 'event'], event_ids: ['sog_ev_usdb_blast_launch_pr358']
  },
  {
    id: 'sog_src_usdb_about_pr358', stablecoin_id: 'sog_st_usdb', issuer_id: 'sog_org_blast', event_id: 'sog_ev_usdb_blast_launch_pr358', source_type: 'official_website', title: 'Blast — native yield for ETH and stablecoins',
    url: 'https://blast.io/en/about', publisher: 'Blast', published_at: null, archived_url: 'https://web.archive.org/web/*/https://blast.io/en/about', accessed_at: checkedAt, reliability: 'high',
    claim_scope: 'usdb_protocol_product_rebasing_and_dai_redemption_context', stablecoin_ids: ['sog_st_usdb'], organization_ids: ['sog_org_blast'], claim_scopes: ['identity', 'income', 'redemption', 'protocol_context', 'event'], event_ids: ['sog_ev_usdb_blast_launch_pr358']
  }
];

const reserveReports = [
  {
    id: 'sog_rr_xusd_attestation_index_pr358', stablecoin_id: 'sog_st_xusd', issuer_id: 'sog_issuer_straitsx_singapore', publisher: 'StraitsX', report_type: 'monthly_reserve_attestation_index',
    asset_categories: ['cash', 'bank_deposits'], url: 'https://www.straitsx.com/xusd', archived_url: 'https://web.archive.org/web/*/https://www.straitsx.com/xusd', confidence: 'high',
    notes: 'The product page publishes recurring attestation links and states full reserve backing. This aggregate index does not invent report-level reserve percentages.'
  },
  {
    id: 'sog_rr_usdb_protocol_backing_pr358', stablecoin_id: 'sog_st_usdb', issuer_id: 'sog_org_blast', publisher: 'Blast', report_type: 'official_protocol_backing_description',
    asset_categories: ['stablecoin_collateral', 'tokenized_fund'], url: 'https://docs.blast.io/about-blast', archived_url: 'https://web.archive.org/web/*/https://docs.blast.io/about-blast', confidence: 'high',
    notes: 'Official protocol documentation describes DAI bridge redemption and historical MakerDAO T-bill yield sourcing. This is not an audited asset-level reserve report.'
  }
];

const knownUnknowns = [
  { id: 'sog_ku_xusd_launch_pr358', stablecoin_id: 'sog_st_xusd', issuer_id: 'sog_issuer_straitsx_singapore', topic: 'launch_date', description: 'The reviewed official page publishes an attestation checkpoint from 29 February 2024, but the exact first mint or public launch date is not established.', severity: 'medium', last_checked_at: checkedAt, notes: 'No launch date is inferred from the attestation date.' },
  { id: 'sog_ku_xusd_legal_entity_pr358', stablecoin_id: 'sog_st_xusd', issuer_id: 'sog_issuer_straitsx_singapore', topic: 'legal_issuer_identity', description: 'The StraitsX issuer family is clear, but the exact legal entity against which every XUSD holder claim runs requires terms-level verification.', severity: 'high', last_checked_at: checkedAt, notes: 'The organization record does not invent a company suffix.' },
  { id: 'sog_ku_xusd_reserve_protection_pr358', stablecoin_id: 'sog_st_xusd', issuer_id: 'sog_issuer_straitsx_singapore', topic: 'reserve_segregation_and_bankruptcy_remoteness', description: 'Full reserve backing and recurring attestations are documented, but legal segregation, reserve ownership, deposit insurance, and bankruptcy remoteness are not established by the reviewed sources.', severity: 'high', last_checked_at: checkedAt, notes: 'Marketing and assurance statements are not converted into legal-protection conclusions.' },
  { id: 'sog_ku_usdb_legal_claim_pr358', stablecoin_id: 'sog_st_usdb', issuer_id: 'sog_org_blast', topic: 'legal_claim_counterparty', description: 'Official protocol documentation establishes USDB mechanics but does not establish a direct legal issuer or corporate claim counterparty.', severity: 'high', last_checked_at: checkedAt, notes: 'Blast is modeled as protocol operator only.' },
  { id: 'sog_ku_usdb_bridge_terms_pr358', stablecoin_id: 'sog_st_usdb', issuer_id: 'sog_org_blast', topic: 'bridge_custody_and_redemption_terms', description: 'DAI bridge redemption is documented, but complete bridge custody, failure, fee, delay, governance, and recovery terms remain unresolved.', severity: 'high', last_checked_at: checkedAt, notes: 'Protocol redemption is not treated as fiat redemption.' },
  { id: 'sog_ku_usdb_yield_governance_pr358', stablecoin_id: 'sog_st_usdb', issuer_id: 'sog_org_blast', topic: 'yield_source_and_governance', description: 'Historical documentation identifies MakerDAO on-chain T-bill infrastructure as the yield source while allowing future replacement; current allocation, counterparties, rate policy, and governance controls require continuing review.', severity: 'high', last_checked_at: checkedAt, notes: 'No fixed or risk-free yield claim is recorded.' }
];

const deployments = [
  {
    id: 'sog_dep_xusd_ethereum_pr358', stablecoin_id: 'sog_st_xusd', chain: 'ethereum', deployment_type: 'issuer_native_token', token_standard: 'erc20', contract_address: '0xC08e7E23C235073C6807C2EFE7021304cb7c2815', status: 'active', canonicality: 'issuer_native', is_primary: true,
    mint_authority_type: 'issuer_controlled', verification_status: 'verified', control_event_ids: [], evidence_ids: ['sog_src_xusd_product_pr358'], notes: 'Official XUSD product page publishes this Ethereum ERC-20 contract.'
  },
  {
    id: 'sog_dep_xusd_bsc_pr358', stablecoin_id: 'sog_st_xusd', chain: 'bnb_smart_chain', deployment_type: 'issuer_native_token', token_standard: 'bep20', contract_address: '0xF81aC2E1A0373ddE1BCE01E2Fe694a9b7E3bfcB9', status: 'active', canonicality: 'issuer_native', is_primary: false,
    mint_authority_type: 'issuer_controlled', verification_status: 'verified', control_event_ids: [], evidence_ids: ['sog_src_xusd_product_pr358'], notes: 'Official XUSD product page publishes this BNB Smart Chain BEP-20 contract.'
  },
  {
    id: 'sog_dep_xusd_solana_pr358', stablecoin_id: 'sog_st_xusd', chain: 'solana', deployment_type: 'issuer_native_token', token_standard: 'spl_token', contract_address: '4UbvZiomFvXDnZSz6vdHiDNiHozH2ykTEqjhhbVHiv9z', status: 'active', canonicality: 'issuer_native', is_primary: false,
    mint_authority_type: 'issuer_controlled', verification_status: 'verified', control_event_ids: [], evidence_ids: ['sog_src_xusd_product_pr358'], notes: 'Official XUSD product page publishes this Solana token identifier.'
  },
  {
    id: 'sog_dep_usdb_blast_pr358', stablecoin_id: 'sog_st_usdb', chain: 'blast', deployment_type: 'protocol_native_token', token_standard: 'erc20', contract_address: '0x4300000000000000000000000000000000000003', status: 'active', canonicality: 'native', is_primary: true,
    mint_authority_type: 'bridge_and_protocol_controlled', verification_status: 'verified', control_event_ids: ['sog_ev_usdb_blast_launch_pr358'], evidence_ids: ['sog_src_usdb_contract_pr358', 'sog_src_usdb_docs_pr358'], notes: 'Blast documentation publishes this USDB mainnet contract and describes native rebasing and bridge redemption.'
  }
];

const legalProfiles = [
  {
    id: 'sog_st_xusd', classifications: [{ classification: 'fiat_backed_stablecoin', jurisdiction: 'Singapore', effective_from: null, effective_to: null, authority_or_basis: 'Official StraitsX XUSD product and Singapore platform materials', confidence: 'high', evidence_ids: ['sog_src_xusd_product_pr358', 'sog_src_xusd_sg_pr358'] }],
    holder_claim_type: 'direct_claim_on_issuer', claim_against_organization_ids: ['sog_issuer_straitsx_singapore'], reserve_ownership: 'unclear', reserve_segregation: 'unknown', bankruptcy_remoteness: 'unknown', licensed_or_regulated_as: [],
    evidence_ids: ['sog_src_xusd_product_pr358', 'sog_src_xusd_sg_pr358'],
    notes: 'Official materials support issuer redemption and fiat-backed classification. Exact legal issuer name, reserve ownership, segregation, deposit insurance, and bankruptcy remoteness remain unresolved.'
  },
  {
    id: 'sog_st_usdb', classifications: [{ classification: 'protocol_asset', jurisdiction: 'Decentralized / protocol', effective_from: '2024-02-29', effective_to: null, authority_or_basis: 'Official Blast protocol, bridge, and contract documentation', confidence: 'high', evidence_ids: ['sog_src_usdb_docs_pr358', 'sog_src_usdb_contract_pr358', 'sog_src_usdb_about_pr358'] }],
    holder_claim_type: 'protocol_redemption_right', claim_against_organization_ids: [], reserve_ownership: 'protocol_controlled', reserve_segregation: 'unclear', bankruptcy_remoteness: 'not_established', licensed_or_regulated_as: [],
    evidence_ids: ['sog_src_usdb_docs_pr358', 'sog_src_usdb_contract_pr358', 'sog_src_usdb_about_pr358'],
    notes: 'USDB provides protocol bridge redemption into DAI. No direct fiat issuer claim, legal reserve segregation, or bankruptcy-remoteness conclusion is inferred.'
  }
];

const assetRelationships = [
  {
    id: 'sog_ar_usdb_redeemable_into_dai_pr358', from_asset_id: 'sog_st_usdb', to_asset_id: 'sog_st_dai', relationship_type: 'redeemable_into', status: 'active', start_date: '2024-02-29', end_date: null,
    evidence_ids: ['sog_src_usdb_docs_pr358', 'sog_src_usdb_about_pr358'], conversion_terms: 'USDB is described as redeemable for DAI when bridging back to Ethereum.',
    notes: 'This relation records protocol bridge conversion, not a direct one-dollar fiat redemption claim.'
  }
];

const reserveComponents = [
  {
    id: 'sog_rc_xusd_reserve_assets_pr358', stablecoin_id: 'sog_st_xusd', reserve_report_id: 'sog_rr_xusd_attestation_index_pr358', asset_category: 'other', asset_label: 'US-dollar reserve assets supporting XUSD; exact current allocation is report-specific', share_percent: null, amount_text: null, currency: 'USD', liquidity_class: 'unknown', maturity_bucket: 'unknown', custodian_organization_id: null, as_of_date: checkedAt, confidence: 'high',
    evidence_ids: ['sog_src_xusd_product_pr358'], notes: 'Official material establishes full reserve backing and recurring attestations but the aggregate page does not establish a single fixed instrument allocation.'
  },
  {
    id: 'sog_rc_usdb_dai_rwa_context_pr358', stablecoin_id: 'sog_st_usdb', reserve_report_id: 'sog_rr_usdb_protocol_backing_pr358', asset_category: 'stablecoin_collateral', asset_label: 'DAI bridge-redemption context with historical MakerDAO on-chain T-bill yield sourcing', share_percent: null, amount_text: null, currency: 'USD', liquidity_class: 'unknown', maturity_bucket: 'unknown', custodian_organization_id: null, as_of_date: checkedAt, confidence: 'high',
    evidence_ids: ['sog_src_usdb_docs_pr358', 'sog_src_usdb_about_pr358'], notes: 'This component records documented protocol dependency without asserting asset-level custody, allocation percentage, or bankruptcy protection.'
  }
];

const incomeProfiles = [
  { id: 'sog_st_xusd', availability: 'none', source: 'none', accrual: 'none', rate: 'none', related_asset_ids: [], evidence_ids: ['sog_src_xusd_product_pr358'], notes: 'No issuer-native XUSD yield or balance rebase is asserted. Third-party DeFi opportunities are outside this profile.' },
  { id: 'sog_st_usdb', availability: 'native', source: 'reserve_income', accrual: 'balance_rebase', rate: 'protocol_determined', related_asset_ids: ['sog_st_dai'], evidence_ids: ['sog_src_usdb_docs_pr358', 'sog_src_usdb_about_pr358'], notes: 'USDB is described as auto-rebasing. Historical documentation names MakerDAO on-chain T-bill infrastructure as the yield source and allows future replacement; no fixed rate is asserted.' }
];

writeJson('data/stablecoins-batch-z.json', stablecoins);
writeJson('data/organizations-batch-z.json', organizations);
writeJson('data/relationships-batch-z.json', relationships);
writeJson('data/stablecoin-classification-batch-z.json', classifications);
writeJson('data/batch-z-reserve-redemption.json', profiles);
writeJson('data/events-batch-z.json', events);
writeJson('data/event-details-batch-z.json', eventDetails);
writeJson('data/evidence-batch-z.json', evidence);
writeJson('data/batch-z-context.json', reserveReports);
writeJson('data/batch-z-review-gaps.json', knownUnknowns);
writeJson('data/batch-z-deployments.json', deployments);
writeJson('data/z-legal.json', legalProfiles);
writeJson('data/stable-asset-relationships-v3-pr358.json', assetRelationships);
writeJson('data/batch-z-components.json', reserveComponents);
writeJson('data/batch-z-income.json', incomeProfiles);

writeJson('docs/migration/registry-v2-baseline-batch-za.json', {
  schema_version: '1.0', base_manifest: 'docs/migration/registry-v2-baseline.json', batch_id: 'batch_027', defer_legacy_v3_full_coverage: false,
  minimum_counts: { stablecoins: 112, organizations: 105, relationships: 122, classifications: 112, profiles: 112, events: 187, event_details: 187, evidence: 557, evidence_relations: 557, reserve_reports: 120, known_unknowns: 325, regulatory_notes: 9, deployments: 174, classification_extensions: 2 },
  data_group_additions: {
    stablecoins: ['data/stablecoins-batch-z.json'], organizations: ['data/organizations-batch-z.json'], relationships: ['data/relationships-batch-z.json'], classifications: ['data/stablecoin-classification-batch-z.json'], profiles: ['data/batch-z-reserve-redemption.json'],
    events: ['data/events-batch-z.json'], event_details: ['data/event-details-batch-z.json'], evidence: ['data/evidence-batch-z.json'], evidence_relations: ['data/evidence-batch-z.json'], reserve_reports: ['data/batch-z-context.json'], known_unknowns: ['data/batch-z-review-gaps.json'], deployments: ['data/batch-z-deployments.json']
  }
});

const foundation = readJson('docs/migration/registry-v3-foundation.json');
for (const file of ['data/z-legal.json']) if (!foundation.data_groups.legal_profiles.includes(file)) foundation.data_groups.legal_profiles.push(file);
for (const file of ['data/stable-asset-relationships-v3-pr358.json']) if (!foundation.data_groups.stable_asset_relationships.includes(file)) foundation.data_groups.stable_asset_relationships.push(file);
for (const file of ['data/batch-z-components.json']) if (!foundation.data_groups.reserve_components.includes(file)) foundation.data_groups.reserve_components.push(file);
foundation.minimum_counts = { legal_profiles: 112, stable_asset_relationships: 5, reserve_components: 145 };
writeJson('docs/migration/registry-v3-foundation.json', foundation);

const incomeManifest = readJson('docs/migration/registry-v3-income-profiles.json');
if (!incomeManifest.data_files.includes('data/batch-z-income.json')) incomeManifest.data_files.push('data/batch-z-income.json');
incomeManifest.minimum_count = 112;
writeJson('docs/migration/registry-v3-income-profiles.json', incomeManifest);

replaceRequired('src/lib/data/currentProfiles.ts',
  "import profileBatchYData from '../../../data/batch-y-reserve-redemption.json';",
  "import profileBatchYData from '../../../data/batch-y-reserve-redemption.json';\nimport profileBatchZData from '../../../data/batch-z-reserve-redemption.json';");
replaceRequired('src/lib/data/currentProfiles.ts',
  ',...profileBatchYData,...profilePr354Data',
  ',...profileBatchYData,...profileBatchZData,...profilePr354Data');

replaceRequired('src/lib/data/incomeProfilesV3.ts',
  "import batchY from '../../../data/batch-y-income.json';",
  "import batchY from '../../../data/batch-y-income.json';\nimport batchZ from '../../../data/batch-z-income.json';");
replaceRequired('src/lib/data/incomeProfilesV3.ts',
  ',...batchX,...batchY] as IncomeProfileV3[];',
  ',...batchX,...batchY,...batchZ] as IncomeProfileV3[];');

replaceRequired('src/lib/data/registryV3.ts',
  "import legalProfilesGrowthY from '../../../data/y-legal.json';",
  "import legalProfilesGrowthY from '../../../data/y-legal.json';\nimport legalProfilesGrowthZ from '../../../data/z-legal.json';");
replaceRequired('src/lib/data/registryV3.ts',
  "import stableAssetRelationshipsBatchH from '../../../data/stable-asset-relationships-v3-batch-h.json';",
  "import stableAssetRelationshipsBatchH from '../../../data/stable-asset-relationships-v3-batch-h.json';\nimport stableAssetRelationshipsPr358 from '../../../data/stable-asset-relationships-v3-pr358.json';");
replaceRequired('src/lib/data/registryV3.ts',
  "import reserveComponentsBatchY from '../../../data/batch-y-components.json';",
  "import reserveComponentsBatchY from '../../../data/batch-y-components.json';\nimport reserveComponentsBatchZ from '../../../data/batch-z-components.json';");
replaceRequired('src/lib/data/registryV3.ts',
  '...legalProfilesGrowthX, ...legalProfilesGrowthY,',
  '...legalProfilesGrowthX, ...legalProfilesGrowthY, ...legalProfilesGrowthZ,');
replaceRequired('src/lib/data/registryV3.ts',
  '...stableAssetRelationshipsBatchH,',
  '...stableAssetRelationshipsBatchH, ...stableAssetRelationshipsPr358,');
replaceRequired('src/lib/data/registryV3.ts',
  '...reserveComponentsBatchY,',
  '...reserveComponentsBatchY, ...reserveComponentsBatchZ,');

const registryPath = 'src/lib/data/registry.ts';
replaceRequired(registryPath, "import stablecoinsBatchYData from '../../../data/stablecoins-batch-y.json';", "import stablecoinsBatchYData from '../../../data/stablecoins-batch-y.json';\nimport stablecoinsBatchZData from '../../../data/stablecoins-batch-z.json';");
replaceRequired(registryPath, "import stablecoinClassificationBatchYData from '../../../data/stablecoin-classification-batch-y.json';", "import stablecoinClassificationBatchYData from '../../../data/stablecoin-classification-batch-y.json';\nimport stablecoinClassificationBatchZData from '../../../data/stablecoin-classification-batch-z.json';");
replaceRequired(registryPath, "import organizationsBatchYData from '../../../data/organizations-batch-y.json';", "import organizationsBatchYData from '../../../data/organizations-batch-y.json';\nimport organizationsBatchZData from '../../../data/organizations-batch-z.json';");
replaceRequired(registryPath, "import relationshipsBatchYData from '../../../data/relationships-batch-y.json';", "import relationshipsBatchYData from '../../../data/relationships-batch-y.json';\nimport relationshipsBatchZData from '../../../data/relationships-batch-z.json';");
replaceRequired(registryPath, "import eventsBatchYData from '../../../data/events-batch-y.json';", "import eventsBatchYData from '../../../data/events-batch-y.json';\nimport eventsBatchZData from '../../../data/events-batch-z.json';");
replaceRequired(registryPath, "import eventDetailsBatchYData from '../../../data/event-details-batch-y.json';", "import eventDetailsBatchYData from '../../../data/event-details-batch-y.json';\nimport eventDetailsBatchZData from '../../../data/event-details-batch-z.json';");
replaceRequired(registryPath, "import evidenceBatchYData from '../../../data/evidence-batch-y.json';", "import evidenceBatchYData from '../../../data/evidence-batch-y.json';\nimport evidenceBatchZData from '../../../data/evidence-batch-z.json';");
replaceRequired(registryPath, "import reserveReportsBatchYData from '../../../data/batch-y-context.json';", "import reserveReportsBatchYData from '../../../data/batch-y-context.json';\nimport reserveReportsBatchZData from '../../../data/batch-z-context.json';");
replaceRequired(registryPath, "import knownUnknownsBatchYData from '../../../data/batch-y-review-gaps.json';", "import knownUnknownsBatchYData from '../../../data/batch-y-review-gaps.json';\nimport knownUnknownsBatchZData from '../../../data/batch-z-review-gaps.json';");
replaceRequired(registryPath, "import deploymentsBatchYData from '../../../data/batch-y-deployments.json';", "import deploymentsBatchYData from '../../../data/batch-y-deployments.json';\nimport deploymentsBatchZData from '../../../data/batch-z-deployments.json';");
replaceRequired(registryPath, '...(stablecoinClassificationBatchYData as StablecoinRow[])', '...(stablecoinClassificationBatchYData as StablecoinRow[]), ...(stablecoinClassificationBatchZData as StablecoinRow[])');
replaceRequired(registryPath, '...(eventDetailsBatchXData as EventRow[]), ...(eventDetailsBatchYData as EventRow[])', '...(eventDetailsBatchXData as EventRow[]), ...(eventDetailsBatchYData as EventRow[]), ...(eventDetailsBatchZData as EventRow[])');
replaceRequired(registryPath, '...(stablecoinsBatchYData as StablecoinRow[])', '...(stablecoinsBatchYData as StablecoinRow[]), ...(stablecoinsBatchZData as StablecoinRow[])');
replaceRequired(registryPath, '...(organizationsBatchYData as OrganizationRow[])', '...(organizationsBatchYData as OrganizationRow[]), ...(organizationsBatchZData as OrganizationRow[])');
replaceRequired(registryPath, '...(relationshipsBatchYData as RelationshipRow[])', '...(relationshipsBatchYData as RelationshipRow[]), ...(relationshipsBatchZData as RelationshipRow[])');
replaceRequired(registryPath, '...(eventsBatchYData as EventRow[])', '...(eventsBatchYData as EventRow[]), ...(eventsBatchZData as EventRow[])');
replaceRequired(registryPath, '...(evidenceBatchYData as EvidenceRow[]), ...(evidenceQualityPr219Data as EvidenceRow[])', '...(evidenceBatchYData as EvidenceRow[]), ...(evidenceBatchZData as EvidenceRow[]), ...(evidenceQualityPr219Data as EvidenceRow[])');
replaceRequired(registryPath, '...(reserveReportsBatchYData as ReserveReportRow[])].map', '...(reserveReportsBatchYData as ReserveReportRow[]), ...(reserveReportsBatchZData as ReserveReportRow[])].map');
replaceRequired(registryPath, '...(knownUnknownsBatchYData as KnownUnknownRow[])].map', '...(knownUnknownsBatchYData as KnownUnknownRow[]), ...(knownUnknownsBatchZData as KnownUnknownRow[])].map');
replaceRequired(registryPath, '...(deploymentsBatchYData as DeploymentRow[])].map', '...(deploymentsBatchYData as DeploymentRow[]), ...(deploymentsBatchZData as DeploymentRow[])].map');

console.log(JSON.stringify({
  ok: true,
  assets: stablecoins.map((row) => row.id),
  counts_added: { stablecoins: 2, organizations: 2, relationships: 2, classifications: 2, profiles: 2, events: 2, event_details: 2, evidence: 6, reserve_reports: 2, known_unknowns: 6, deployments: 4, legal_profiles: 2, stable_asset_relationships: 1, reserve_components: 2, income_profiles: 2 }
}, null, 2));
