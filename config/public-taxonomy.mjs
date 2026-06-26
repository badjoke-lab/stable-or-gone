const acronymLabels = {
  api: 'API',
  dao: 'DAO',
  defi: 'DeFi',
  usd: 'USD',
  eur: 'EUR',
  jpy: 'JPY',
  brl: 'BRL',
  chf: 'CHF',
  sgd: 'SGD',
  try: 'TRY',
  aed: 'AED',
  v1: 'V1',
  v2: 'V2',
  v3: 'V3',
  v5: 'V5',
  erc20: 'ERC-20',
  spl: 'SPL'
};

const labelOverrides = {
  fiat_and_cash_equivalent: 'Fiat and cash equivalents',
  crypto_collateralized: 'Crypto-collateralized',
  tokenized_asset_backed: 'Tokenized asset-backed',
  commodity_backed: 'Commodity-backed',
  algorithmic_or_unbacked: 'Algorithmic or unbacked',
  synthetic_or_hedged: 'Synthetic or hedged',
  hybrid_or_mixed: 'Hybrid or mixed',
  wrapper_or_receipt: 'Wrapper or receipt',
  historical_non_failure: 'Historical — non-failure',
  bank_or_trust: 'Bank or trust company',
  fund_or_investment_vehicle: 'Fund or investment vehicle',
  protocol_or_dao: 'Protocol or DAO',
  government_or_regulator: 'Government or regulator',
  network_or_infrastructure: 'Network or infrastructure',
  service_provider: 'Service provider',
  distribution_or_liquidity_partner: 'Distribution or liquidity partner',
  network_or_infrastructure_provider: 'Network or infrastructure provider',
  other_material_role: 'Other material role',
  unknown_after_review: 'Unknown after review',
  not_recorded: 'Not yet recorded',
  not_public: 'Not publicly disclosed',
  unverified: 'Not yet verified',
  issuer_native: 'Issuer-native',
  canonical_bridge: 'Canonical bridge',
  third_party_bridge: 'Third-party bridge',
  partially_verified: 'Partially verified',
  source_review_needed: 'Source review needed',
  protocol_based: 'Protocol-based',
  yield_bearing_stable_receipt: 'Yield-bearing stable receipt',
  experimental_stabilization_asset: 'Experimental stabilization asset',
  stable_value_asset: 'Stable-value asset',
  tokenized_commodity: 'Tokenized commodity',
  crypto_asset: 'Crypto asset',
  protocol_internal: 'Protocol-internal reference',
  algorithmic_supply: 'Algorithmic supply',
  delta_neutral: 'Delta-neutral',
  fund_share_valuation: 'Fund-share valuation',
  issuer_redemption: 'Issuer redemption',
  overcollateralized_vault: 'Overcollateralized vault',
  protocol_arbitrage: 'Protocol arbitrage',
  rebasing_or_repricing: 'Rebasing or repricing',
  dao_governed: 'DAO-governed',
  protocol_governed: 'Protocol-governed',
  primary_interface: 'Primary interface',
  primary_repository: 'Primary repository',
  primary_repository_index: 'Primary repository index',
  primary_or_ecosystem_dashboard: 'Primary or ecosystem dashboard'
};

function publicLabel(value) {
  if (labelOverrides[value]) return labelOverrides[value];
  if (/^[A-Z0-9_-]+$/.test(value)) return value.replaceAll('_', ' ');
  return value
    .split('_')
    .filter(Boolean)
    .map((part, index) => {
      const lower = part.toLowerCase();
      if (acronymLabels[lower]) return acronymLabels[lower];
      if (index > 0 && ['and', 'or', 'of', 'to', 'via', 'with', 'for', 'from', 'as'].includes(lower)) return lower;
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(' ');
}

function entriesFromGroups(groups, options = {}) {
  const entries = [];
  let order = 10;
  for (const [publicCategory, values] of Object.entries(groups)) {
    for (const canonicalValue of values) {
      entries.push({
        canonical_value: canonicalValue,
        public_category: publicCategory,
        public_label: options.labels?.[canonicalValue] ?? publicLabel(canonicalValue),
        legacy_aliases: options.legacyAliases?.[canonicalValue] ?? [],
        sort_order: order,
        ...(options.filterable === false ? { is_filterable: false } : { is_filterable: true }),
        ...(options.definitions?.[canonicalValue] ? { short_definition: options.definitions[canonicalValue] } : {})
      });
      order += 10;
    }
  }
  return entries;
}

const lifecycleGroups = {
  operating: ['active'],
  constrained: ['restricted', 'suspended', 'winding_down'],
  historical_non_failure: ['inactive', 'terminated', 'migrated', 'rebranded'],
  failed: ['collapsed'],
  other: ['announced', 'unknown']
};

const issuanceGroups = {
  open: ['open'],
  restricted: ['restricted'],
  paused: ['paused'],
  terminated: ['terminated'],
  protocol_based: ['protocol_based'],
  unknown: ['unknown']
};

const assetClassGroups = {
  stablecoin: ['stablecoin'],
  adjacent_stable_value_asset: ['stable_value_asset'],
  wrapper_or_receipt: ['yield_bearing_stable_receipt'],
  commodity_backed: ['tokenized_commodity'],
  experimental: ['experimental_stabilization_asset']
};

const referenceKindGroups = {
  fiat: ['fiat'],
  commodity: ['commodity'],
  crypto_asset: ['crypto_asset'],
  index: ['index'],
  basket: ['basket'],
  floating: ['floating'],
  protocol_internal: ['protocol_internal'],
  none: ['none'],
  unknown: ['unknown']
};

const referenceAssetGroups = {
  fiat_currency: ['AED', 'BRL', 'CHF', 'EUR', 'JPY', 'SGD', 'TRY', 'USD'],
  commodity: ['GOLD'],
  methodology_reference: ['AMPL_CPI_ADJUSTED_TARGET', 'RAI_REDEMPTION_PRICE', 'USD_WITH_TRUFLATION_LINKED_REBASE']
};

const backingTypeGroups = {
  fiat_and_cash_equivalent: ['bank_deposits', 'cash', 'government_securities'],
  crypto_collateralized: ['crypto_collateral', 'stablecoin_collateral'],
  tokenized_asset_backed: ['private_credit', 'receivables', 'secured_loans', 'tokenized_fund'],
  commodity_backed: ['commodity'],
  algorithmic_or_unbacked: ['unbacked'],
  hybrid_or_mixed: ['mixed'],
  other: ['other'],
  unknown: ['unknown']
};

const publicModelGroups = {
  fiat_and_cash_equivalent: ['fiat_and_cash_equivalent'],
  crypto_collateralized: ['crypto_collateralized'],
  tokenized_asset_backed: ['tokenized_asset_backed'],
  commodity_backed: ['commodity_backed'],
  algorithmic_or_unbacked: ['algorithmic_or_unbacked'],
  synthetic_or_hedged: ['synthetic_or_hedged'],
  hybrid_or_mixed: ['hybrid_or_mixed'],
  wrapper_or_receipt: ['wrapper_or_receipt'],
  other: ['other'],
  unknown: ['unknown']
};

const stabilizationGroups = {
  issuer_redemption: ['issuer_redemption'],
  overcollateralized_vault: ['overcollateralized_vault'],
  algorithmic_supply: ['algorithmic_supply'],
  delta_neutral: ['delta_neutral'],
  protocol_arbitrage: ['protocol_arbitrage'],
  hybrid: ['hybrid'],
  bank_deposit_claim: ['bank_deposit_claim'],
  fund_share_valuation: ['fund_share_valuation'],
  commodity_redemption: ['commodity_redemption'],
  rebasing_or_repricing: ['rebasing_or_repricing'],
  other: ['other'],
  unknown: ['unknown']
};

const governanceGroups = {
  centralized: ['centralized'],
  dao_governed: ['dao_governed'],
  hybrid: ['hybrid'],
  protocol_governed: ['protocol_governed']
};

const organizationTypeGroups = {
  company: [
    'blockchain_company', 'company', 'company_group', 'company_or_product_group',
    'crypto_asset_platform_company', 'digital_asset_financial_group', 'financial_technology_company',
    'payment_company', 'product_organization', 'regulated_financial_company',
    'regulated_payment_token_issuer', 'stablecoin_company', 'technology_company'
  ],
  bank_or_trust: [
    'bank', 'credit_institution', 'limited_purpose_trust_company', 'regulated_bank',
    'trust_and_custody_company', 'trust_bank'
  ],
  fund_or_investment_vehicle: ['mutual_fund'],
  protocol_or_dao: [
    'blockchain_asset_issuance_protocol', 'crypto_asset_protocol', 'dao',
    'dao_and_protocol_ecosystem', 'dao_or_reserve_organization',
    'decentralized_autonomous_organization', 'decentralized_finance_protocol',
    'decentralized_protocol', 'defi_protocol', 'protocol', 'protocol_company',
    'protocol_ecosystem', 'protocol_or_company', 'protocol_or_dao'
  ],
  network_or_infrastructure: [
    'blockchain_ecosystem', 'digital_asset_infrastructure_provider', 'network',
    'network_or_company_group', 'regulated_stablecoin_infrastructure_provider'
  ],
  service_provider: [
    'electronic_money_institution', 'licensed_token_generator',
    'registered_funds_transfer_service_provider',
    'regulated_crypto_asset_and_electronic_payment_instrument_service_provider',
    'regulated_crypto_asset_service_provider', 'regulated_digital_asset_business',
    'regulated_emoney_institution', 'reserve_organization'
  ]
};

const relationshipRoleGroups = {
  issuer: ['legal_issuer'],
  brand: ['brand_owner'],
  protocol: ['protocol_operator'],
  governance: ['governance_body'],
  reserve: ['reserve_manager'],
  custody: ['custodian'],
  redemption: ['redemption_agent'],
  distribution: ['distribution_or_liquidity_partner'],
  infrastructure: ['network_or_infrastructure_provider', 'technology_provider'],
  other_material_role: ['other']
};

const relationshipStatusGroups = {
  current: ['active'],
  historical: ['ended'],
  unknown: ['unknown']
};

const eventTypeGroups = {
  launch: [
    'launch', 'launched', 'launch_or_issuer_context', 'mainnet_availability_report',
    'protocol_launch_or_lifecycle_context', 'protocol_v2_public_launch', 'restricted_v2_launch_phase'
  ],
  depeg: [
    'depeg', 'major_depeg', 'market_stress_liquidation_event', 'peg_failure',
    'peg_failure_and_protocol_supersession'
  ],
  recovery: ['depeg_recovery_context', 'recovery'],
  reserve: ['reserve_intervention_context', 'reserve_verification_termination'],
  redemption: ['redemption_change'],
  regulatory: ['regulatory', 'regulatory_action', 'regulatory_settlement'],
  control: ['issuer_freeze'],
  security: [
    'chain_halt_context', 'erroneous_mint_incident', 'exploit', 'production_security_program_start',
    'protocol_exploit', 'security_incident'
  ],
  migration: [
    'issuer_transition', 'migration', 'predecessor_trial_lifecycle', 'protocol_transition',
    'rebrand', 'rebrand_and_classification_change', 'rebrand_or_lifecycle_transition', 'token_migration'
  ],
  wind_down: [
    'exchange_phaseout', 'shutdown_effective', 'wind_down', 'wind_down_and_final_redemption',
    'wind_down_announced'
  ],
  governance: [
    'governance_change_proposed', 'governance_transition', 'protocol_model_update',
    'protocol_upgrade', 'protocol_upgrade_announced'
  ],
  other: [
    'acquired', 'announcement', 'chain_expansion', 'collapse', 'exchange_adoption_context',
    'liquidity_incentive_start', 'status_review', 'testing'
  ]
};

const eventDetailKindGroups = {
  depeg: ['depeg'],
  governance: ['governance_change'],
  control: ['issuer_control'],
  launch: ['launch'],
  migration: ['migration'],
  other: ['other'],
  redemption: ['redemption_change'],
  regulatory: ['regulatory'],
  reserve: ['reserve_change'],
  security: ['security_incident'],
  wind_down: ['termination']
};

const eventImpactGroups = {
  critical: ['critical'],
  high: ['high'],
  medium: ['medium'],
  low: ['low']
};

const eventStatusEffectGroups = {
  active: [
    'active', 'active_current_v5', 'active_historical', 'active_v1', 'active_v2',
    'active_version_transition', 'active_with_governance_transition',
    'active_with_security_incident_context'
  ],
  collapsed: ['collapsed', 'failed', 'failed_context'],
  historical_context: ['discontinued', 'discontinued_context', 'predecessor_closed'],
  restricted: ['impaired', 'impaired_context', 'limited', 'restricted', 'restricted_v2'],
  inactive: ['inactive'],
  migrated: ['migrated'],
  rebranded: ['rebranded'],
  terminated: ['terminated'],
  no_lifecycle_change: ['none', 'version_transition_context']
};

const recoveryStatusGroups = {
  recovered: ['recovered'],
  not_recovered: ['not_recovered'],
  collapsed: ['collapsed']
};

const evidenceReliabilityGroups = {
  high: ['high'],
  medium: ['medium'],
  low: ['low'],
  unknown: ['unknown']
};

const evidenceSourceTypeGroups = {
  official: [
    'developer_docs', 'governance_proposal', 'governance_reference', 'issuer_or_network_page',
    'issuer_or_product_page', 'issuer_page', 'issuer_statement', 'issuer_support',
    'network_terms_or_docs', 'official_application', 'official_blog', 'official_documentation',
    'official_ecosystem_announcement', 'official_ecosystem_publication',
    'official_governance_documentation', 'official_governance_proposal',
    'official_incident_report', 'official_launch_announcement', 'official_postmortem',
    'official_protocol_announcement', 'official_protocol_guide', 'official_protocol_milestone',
    'official_protocol_roadmap', 'official_protocol_update', 'official_report', 'official_social',
    'official_social_statement', 'official_statement', 'official_website', 'official_whitepaper',
    'product_page', 'protocol_app', 'protocol_docs', 'protocol_or_reserve_page', 'protocol_page',
    'protocol_postmortem', 'reserve_or_governance_page', 'reserve_transparency_page', 'whitepaper'
  ],
  regulatory: ['regulatory_notice', 'regulatory_source'],
  onchain: ['explorer', 'issuer_contract_event', 'onchain_contract', 'onchain_explorer', 'onchain_transaction'],
  repository: ['code_repository', 'official_repository', 'repository', 'repository_index'],
  archive: ['archive_capture', 'archived_official_site', 'contemporaneous_record', 'registry_snapshot'],
  news: ['news_analysis', 'news_article', 'news_report', 'wire_service'],
  research: ['investigator_report', 'research_paper', 'research_report'],
  market_or_analytics: ['analytics_dashboard', 'database_reference', 'market_data_page', 'market_reference'],
  legal: ['legal_terms', 'official_terms', 'risk_disclosure', 'terms_of_service'],
  assurance: ['official_attestation', 'reserve_report', 'reserve_report_index'],
  security: ['security_analysis', 'security_audit'],
  other: ['exchange_notice']
};

const deploymentStatusGroups = {
  active: ['active'],
  restricted: ['limited', 'restricted'],
  inactive: ['inactive'],
  winding_down: [
    'discontinued_or_wind_down_context', 'impaired_retirement_proposed', 'retirement_proposed', 'winding_down'
  ],
  terminated: ['terminated'],
  failed: ['collapsed', 'failed_legacy_context', 'failed_or_inactive'],
  migrated: ['historical_or_rebranded', 'migrated'],
  legacy_or_context: [
    'active_or_legacy_context', 'explorer_reference_available', 'historical_explorer_reference',
    'legacy_current_status_unresolved'
  ],
  unknown_after_review: [
    'inactive_or_source_review_needed', 'issuer_supported_source_review_needed',
    'related_asset_source_review_needed', 'source_review_needed'
  ]
};

const deploymentTypeGroups = {
  bridged: [
    'bridge_or_protocol_extension', 'bridge_representation', 'bridged',
    'cross_chain_representation', 'linked_native_representation'
  ],
  issuer_native: [
    'canonical_issuance', 'erc20', 'erc20_or_issuer_supported', 'issuer_native_fiat_token',
    'issuer_native_tokenized_fund_share', 'issuer_native_tokenized_note',
    'issuer_or_network_supported_token', 'issuer_supported', 'issuer_supported_native_token',
    'issuer_supported_token', 'native_or_issuer_supported', 'spl_token', 'trust_issued_token'
  ],
  protocol_native: [
    'native', 'native_or_protocol_supported', 'native_protocol_asset', 'protocol_asset',
    'protocol_issued_synthetic', 'protocol_issued_token', 'protocol_native_asset',
    'protocol_native_token', 'protocol_native_vault_share', 'protocol_supported_token', 'protocol_token'
  ],
  legacy: [
    'historical_canonical_issuance', 'historical_issuer_supported_token',
    'historical_original_issuance', 'historical_protocol_native_token',
    'legacy_canonical_issuance', 'legacy_native', 'legacy_protocol_token', 'native_historical'
  ],
  related_asset: ['related_savings_token']
};

const deploymentCanonicalityGroups = {
  native: ['native'],
  issuer_native: ['issuer_native'],
  canonical_bridge: ['canonical_bridge'],
  third_party_bridge: ['third_party_bridge'],
  wrapped: ['wrapped'],
  synthetic: ['synthetic'],
  legacy: ['legacy'],
  unknown: ['unknown']
};

const deploymentVerificationGroups = {
  verified: ['verified'],
  partially_verified: ['partially_verified'],
  unverified: ['unverified'],
  not_applicable: ['not_applicable'],
  unknown: ['unknown']
};

const valueStateGroups = {
  known: ['known'],
  unknown_after_review: ['unknown_after_review'],
  not_recorded: ['not_recorded'],
  not_applicable: ['not_applicable'],
  not_public: ['not_public'],
  unverified: ['unverified'],
  disputed: ['disputed'],
  approximate: ['approximate']
};

const severityGroups = {
  high: ['high'],
  medium: ['medium'],
  low: ['low']
};

const redemptionStatusGroups = {
  public_direct: ['public_direct'],
  eligible_customers_only: ['eligible_customers_only'],
  institutional_only: ['institutional_only'],
  protocol_based: ['protocol_based'],
  restricted: ['restricted'],
  terminated: ['terminated'],
  not_applicable: ['not_applicable'],
  unknown: ['unknown']
};

export const publicTaxonomy = {
  schema_version: '1.0',
  registry_id: 'sog_public_taxonomy_v1',
  specification: 'docs/public-taxonomy-spec.md',
  axes: {
    lifecycle_status: { is_filterable: true, entries: entriesFromGroups(lifecycleGroups) },
    issuance_status: { is_filterable: true, entries: entriesFromGroups(issuanceGroups) },
    asset_class: { is_filterable: true, entries: entriesFromGroups(assetClassGroups) },
    reference_kind: { is_filterable: true, entries: entriesFromGroups(referenceKindGroups) },
    reference_asset: {
      is_filterable: true,
      entries: entriesFromGroups(referenceAssetGroups, {
        labels: {
          AED: 'UAE dirham', BRL: 'Brazilian real', CHF: 'Swiss franc', EUR: 'Euro',
          GOLD: 'Gold', JPY: 'Japanese yen', SGD: 'Singapore dollar', TRY: 'Turkish lira',
          USD: 'US dollar', AMPL_CPI_ADJUSTED_TARGET: 'CPI-adjusted target',
          RAI_REDEMPTION_PRICE: 'Floating redemption price',
          USD_WITH_TRUFLATION_LINKED_REBASE: 'US dollar with Truflation-linked rebase'
        }
      })
    },
    backing_type: { is_filterable: false, entries: entriesFromGroups(backingTypeGroups, { filterable: false }) },
    public_model_category: { is_filterable: true, entries: entriesFromGroups(publicModelGroups) },
    stabilization_mechanism: { is_filterable: true, entries: entriesFromGroups(stabilizationGroups) },
    governance_model: { is_filterable: false, entries: entriesFromGroups(governanceGroups, { filterable: false }) },
    organization_type: { is_filterable: true, entries: entriesFromGroups(organizationTypeGroups) },
    relationship_role: { is_filterable: true, entries: entriesFromGroups(relationshipRoleGroups) },
    relationship_status: { is_filterable: false, entries: entriesFromGroups(relationshipStatusGroups, { filterable: false }) },
    event_type: { is_filterable: true, entries: entriesFromGroups(eventTypeGroups) },
    event_detail_kind: { is_filterable: false, entries: entriesFromGroups(eventDetailKindGroups, { filterable: false }) },
    event_impact: { is_filterable: true, entries: entriesFromGroups(eventImpactGroups) },
    event_status_effect: { is_filterable: false, entries: entriesFromGroups(eventStatusEffectGroups, { filterable: false }) },
    recovery_status: { is_filterable: false, entries: entriesFromGroups(recoveryStatusGroups, { filterable: false }) },
    evidence_reliability: { is_filterable: false, entries: entriesFromGroups(evidenceReliabilityGroups, { filterable: false }) },
    evidence_source_type: { is_filterable: true, entries: entriesFromGroups(evidenceSourceTypeGroups) },
    deployment_status: { is_filterable: true, entries: entriesFromGroups(deploymentStatusGroups) },
    deployment_type: { is_filterable: false, entries: entriesFromGroups(deploymentTypeGroups, { filterable: false }) },
    deployment_canonicality: { is_filterable: true, entries: entriesFromGroups(deploymentCanonicalityGroups) },
    deployment_verification_status: { is_filterable: false, entries: entriesFromGroups(deploymentVerificationGroups, { filterable: false }) },
    value_state: { is_filterable: false, entries: entriesFromGroups(valueStateGroups, { filterable: false }) },
    known_unknown_severity: { is_filterable: false, entries: entriesFromGroups(severityGroups, { filterable: false }) },
    redemption_status: { is_filterable: false, entries: entriesFromGroups(redemptionStatusGroups, { filterable: false }) }
  },
  legacy_value_rules: {
    lifecycle_status: [
      { legacy_value: 'failed', target_canonical_value: 'collapsed', review_required: false, action: 'map' },
      { legacy_value: 'limited', target_canonical_value: 'restricted', review_required: false, action: 'map' },
      { legacy_value: 'impaired', target_canonical_value: 'restricted', review_required: false, action: 'map' },
      { legacy_value: 'discontinued', target_canonical_value: null, review_required: true, action: 'resolve_per_record' }
    ],
    evidence_reliability: [
      { legacy_value: 'explorer', target_canonical_value: null, review_required: true, action: 'split_source_provenance' },
      { legacy_value: 'primary', target_canonical_value: null, review_required: true, action: 'split_source_provenance' },
      { legacy_value: 'primary_interface', target_canonical_value: null, review_required: true, action: 'split_source_provenance' },
      { legacy_value: 'primary_or_ecosystem_dashboard', target_canonical_value: null, review_required: true, action: 'split_source_provenance' },
      { legacy_value: 'primary_repository', target_canonical_value: null, review_required: true, action: 'split_source_provenance' },
      { legacy_value: 'primary_repository_index', target_canonical_value: null, review_required: true, action: 'split_source_provenance' }
    ]
  },
  descriptive_axes: {
    evidence_claim_scope: { is_filterable: false, reason: 'Claim relations are descriptive and may be record-specific.' },
    known_unknown_topic: { is_filterable: false, reason: 'Known-unknown topics are reviewed issue descriptions, not navigation categories.' },
    reserve_disclosure_status: { is_filterable: false, reason: 'Current values contain descriptive disclosure summaries and must not become filter options.' }
  }
};

export function flattenTaxonomyEntries(registry = publicTaxonomy) {
  return Object.fromEntries(Object.entries(registry.axes).map(([axis, definition]) => [axis, definition.entries]));
}

export function taxonomyLabel(axis, value, fallback = null) {
  const definition = publicTaxonomy.axes[axis];
  if (!definition) return fallback;
  const entry = definition.entries.find((item) => item.canonical_value === value || item.legacy_aliases.includes(value));
  return entry?.public_label ?? fallback;
}
