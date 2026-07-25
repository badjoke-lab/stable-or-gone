const exactLabels: Record<string, string> = {
  fiat_backed: 'Fiat-backed',
  multi_collateral: 'Multi-collateral',
  crypto_collateralized: 'Crypto-collateralized',
  crypto_collateralized_or_overcollateralized: 'Crypto-collateralized / overcollateralized',
  company_or_product_group: 'Company / product group',
  dao_or_reserve_organization: 'DAO / reserve organization',
  protocol_or_company: 'Protocol / company',
  network_or_company_group: 'Network / company group',
  multi_jurisdiction: 'Multiple jurisdictions',
  source_review_needed: 'Public information incomplete',
  partial_or_protocol_transparent: 'Partial / protocol-transparent',
  protocol_transparent: 'Protocol-transparent',
  wind_down_available: 'Wind-down information available',
  active_wind_down_or_conversion: 'Active wind-down / conversion',
  protocol_based_or_market_based: 'Protocol-based / market-based',
  unclear_protocol_or_market_based: 'Unclear protocol / market-based',
  non_redeemable_protocol_design: 'No direct redemption',
  indirect_via_exchanges_wallets_or_partners: 'Via exchanges, wallets, or partners',
  available_to_verified_customers_subject_to_terms: 'Available to verified customers, subject to terms',
  market_stress_liquidation_event: 'Market stress and liquidations',
  rebrand_or_lifecycle_transition: 'Rebrand and transition',
  reserve_intervention_context: 'Reserve intervention',
  depeg_recovery_context: 'Depeg recovery',
  protocol_launch_or_lifecycle_context: 'Protocol launch or transition',
  protocol_lifecycle_context: 'Protocol history',
  launch_or_issuer_context: 'Product launch',
  exchange_adoption_context: 'Exchange adoption',
  regulatory_action: 'Regulatory action',
  regulatory_settlement: 'Regulatory settlement',
  protocol_transition: 'Protocol transition',
  chain_halt_context: 'Blockchain halt',
  chain_expansion: 'Blockchain expansion',
  exchange_phaseout: 'Exchange phase-out',
  legal_issuer: 'Legal issuer',
  brand_owner: 'Brand owner',
  protocol_operator: 'Protocol operator',
  governance_body: 'Governance body',
  reserve_manager: 'Reserve manager',
  custodian: 'Custodian',
  redemption_agent: 'Redemption agent',
  technology_provider: 'Technology provider',
  none: 'No recorded change'
};

const acronyms: Record<string, string> = {
  api: 'API',
  amm: 'AMM',
  cftc: 'CFTC',
  dao: 'DAO',
  defi: 'DeFi',
  lfg: 'LFG',
  nyag: 'NYAG',
  psm: 'PSM',
  sec: 'SEC',
  ui: 'UI',
  usd: 'USD',
  v1: 'V1',
  v2: 'V2',
  v3: 'V3'
};

const minorWords = new Set(['and', 'or', 'of', 'to', 'via', 'with', 'for', 'from', 'as']);

export function formatPublicLabel(value?: string | null, fallback = '—'): string {
  const normalized = String(value ?? '').trim();
  if (!normalized) return fallback;
  if (exactLabels[normalized]) return exactLabels[normalized];

  const isInternalValue = normalized.includes('_') || /^sog_(issuer|st|ev)_/.test(normalized);
  if (!isInternalValue) {
    const lower = normalized.toLowerCase();
    if (acronyms[lower]) return acronyms[lower];
    if (/^[a-z0-9-]+$/.test(normalized)) return lower.charAt(0).toUpperCase() + lower.slice(1);
    return normalized;
  }

  return normalized
    .replace(/^sog_(issuer|st|ev)_/, '')
    .split('_')
    .filter(Boolean)
    .map((word, index) => {
      const lower = word.toLowerCase();
      if (acronyms[lower]) return acronyms[lower];
      if (index > 0 && minorWords.has(lower)) return lower;
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(' ');
}

export function formatPublicText(value?: string | null, fallback = '—'): string {
  const normalized = String(value ?? '').trim();
  if (!normalized) return fallback;

  return normalized.replace(/\b[a-z][a-z0-9]*(?:_[a-z0-9]+)+\b/g, (token) => {
    if (token.startsWith('sog_')) return token;
    const label = formatPublicLabel(token, token);
    if (/^[A-Z0-9-]{2,}(?:\s|$)/.test(label)) return label;
    return label.charAt(0).toLowerCase() + label.slice(1);
  });
}

export function formatStatusLabel(value?: string | null): string {
  return formatPublicLabel(value, 'Unknown');
}
