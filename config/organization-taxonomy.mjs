export const publicOrganizationCategories = [
  { value: 'company_or_corporate_group', public_label: 'Company or corporate group', sort_order: 10 },
  { value: 'protocol_or_software_system', public_label: 'Protocol or software system', sort_order: 20 },
  { value: 'dao_or_governance_body', public_label: 'DAO or governance body', sort_order: 30 },
  { value: 'bank_trust_or_credit_institution', public_label: 'Bank, trust, or credit institution', sort_order: 40 },
  { value: 'payment_or_e_money_institution', public_label: 'Payment or e-money institution', sort_order: 50 },
  { value: 'digital_asset_service_or_infrastructure', public_label: 'Digital-asset service or infrastructure provider', sort_order: 60 },
  { value: 'network_or_ecosystem', public_label: 'Network or ecosystem', sort_order: 70 },
  { value: 'fund_or_investment_vehicle', public_label: 'Fund or investment vehicle', sort_order: 80 },
  { value: 'reserve_or_special_purpose_body', public_label: 'Reserve or special-purpose body', sort_order: 90 },
  { value: 'product_or_brand_organization', public_label: 'Product or brand organization', sort_order: 100 },
  { value: 'unknown', public_label: 'Unknown or not yet classified', sort_order: 110 }
];

const organizationTypesByCategory = {
  company_or_corporate_group: [
    'blockchain_company', 'company', 'company_group', 'crypto_asset_platform_company',
    'digital_asset_financial_group', 'financial_technology_company', 'payment_company',
    'protocol_company', 'stablecoin_company', 'technology_company'
  ],
  protocol_or_software_system: [
    'blockchain_asset_issuance_protocol', 'crypto_asset_protocol', 'decentralized_finance_protocol',
    'decentralized_protocol', 'defi_protocol', 'protocol_ecosystem'
  ],
  dao_or_governance_body: ['dao_and_protocol_ecosystem', 'decentralized_autonomous_organization'],
  bank_trust_or_credit_institution: [
    'credit_institution', 'limited_purpose_trust_company', 'regulated_bank',
    'regulated_financial_company', 'trust_and_custody_company', 'trust_bank'
  ],
  payment_or_e_money_institution: [
    'electronic_money_institution', 'registered_funds_transfer_service_provider',
    'regulated_emoney_institution', 'regulated_payment_token_issuer'
  ],
  digital_asset_service_or_infrastructure: [
    'digital_asset_infrastructure_provider', 'licensed_token_generator',
    'regulated_crypto_asset_and_electronic_payment_instrument_service_provider',
    'regulated_crypto_asset_service_provider', 'regulated_digital_asset_business',
    'regulated_stablecoin_infrastructure_provider'
  ],
  network_or_ecosystem: ['blockchain_ecosystem', 'network'],
  fund_or_investment_vehicle: ['mutual_fund'],
  reserve_or_special_purpose_body: ['reserve_organization'],
  product_or_brand_organization: ['product_organization'],
  unknown: []
};

export const organizationTypeCategoryMap = Object.fromEntries(
  Object.entries(organizationTypesByCategory).flatMap(([category, values]) => values.map((value) => [value, category]))
);

export const regulatoryCharacters = [
  { value: 'regulated_bank_or_credit_institution', public_label: 'Regulated bank, trust, or credit institution', sort_order: 10 },
  { value: 'regulated_payment_or_e_money', public_label: 'Regulated payment or e-money institution', sort_order: 20 },
  { value: 'regulated_digital_asset_service', public_label: 'Regulated digital-asset service provider', sort_order: 30 },
  { value: 'regulated_fund_or_investment_vehicle', public_label: 'Regulated fund or investment vehicle', sort_order: 40 },
  { value: 'protocol_or_decentralized_system', public_label: 'Protocol or decentralized system', sort_order: 50 },
  { value: 'not_recorded', public_label: 'Not recorded in canonical data', sort_order: 60 },
  { value: 'unknown', public_label: 'Unknown or unresolved', sort_order: 70 }
];

const organizationTypesByRegulatoryCharacter = {
  regulated_bank_or_credit_institution: [
    'credit_institution', 'limited_purpose_trust_company', 'regulated_bank',
    'regulated_financial_company', 'trust_and_custody_company', 'trust_bank'
  ],
  regulated_payment_or_e_money: [
    'electronic_money_institution', 'registered_funds_transfer_service_provider',
    'regulated_emoney_institution', 'regulated_payment_token_issuer'
  ],
  regulated_digital_asset_service: [
    'licensed_token_generator',
    'regulated_crypto_asset_and_electronic_payment_instrument_service_provider',
    'regulated_crypto_asset_service_provider', 'regulated_digital_asset_business',
    'regulated_stablecoin_infrastructure_provider'
  ],
  regulated_fund_or_investment_vehicle: ['mutual_fund'],
  protocol_or_decentralized_system: [
    'blockchain_asset_issuance_protocol', 'blockchain_ecosystem', 'crypto_asset_protocol',
    'dao_and_protocol_ecosystem', 'decentralized_autonomous_organization',
    'decentralized_finance_protocol', 'decentralized_protocol', 'defi_protocol',
    'protocol_ecosystem'
  ],
  not_recorded: [
    'blockchain_company', 'company', 'company_group', 'crypto_asset_platform_company',
    'digital_asset_financial_group', 'digital_asset_infrastructure_provider',
    'financial_technology_company', 'network', 'payment_company', 'product_organization',
    'protocol_company', 'reserve_organization', 'stablecoin_company', 'technology_company'
  ],
  unknown: []
};

export const organizationTypeRegulatoryCharacterMap = Object.fromEntries(
  Object.entries(organizationTypesByRegulatoryCharacter).flatMap(([character, values]) => values.map((value) => [value, character]))
);

export const jurisdictionScopes = [
  { value: 'country_or_territory', public_label: 'Country or territory', sort_order: 10 },
  { value: 'multi_jurisdiction', public_label: 'Multiple jurisdictions', sort_order: 20 },
  { value: 'decentralized_or_protocol', public_label: 'Decentralized or protocol-based', sort_order: 30 },
  { value: 'unknown', public_label: 'Unknown or not publicly resolved', sort_order: 40 }
];

export const legalFormStates = [
  { value: 'recorded', public_label: 'Recorded', sort_order: 10 },
  { value: 'not_recorded', public_label: 'Not recorded in canonical data', sort_order: 20 },
  { value: 'unknown', public_label: 'Unknown or unresolved', sort_order: 30 }
];

export const functionalRoleLabels = {
  legal_issuer: 'Legal issuer',
  brand_owner: 'Brand owner',
  protocol_operator: 'Protocol operator',
  governance_body: 'Governance body',
  reserve_manager: 'Reserve manager',
  custodian: 'Custodian',
  redemption_agent: 'Redemption agent',
  technology_provider: 'Technology provider',
  other: 'Other recorded role'
};

export const relationshipStatusLabels = {
  active: 'Active relationship',
  ended: 'Ended relationship',
  planned: 'Planned relationship',
  unknown: 'Unknown relationship state'
};

export function getPublicOrganizationCategory(organizationType) {
  return organizationTypeCategoryMap[organizationType] ?? 'unknown';
}

export function getPublicOrganizationCategoryLabel(value) {
  return publicOrganizationCategories.find((entry) => entry.value === value)?.public_label ?? 'Unknown or not yet classified';
}

export function getRegulatoryCharacter(organizationType) {
  return organizationTypeRegulatoryCharacterMap[organizationType] ?? 'unknown';
}

export function getRegulatoryCharacterLabel(value) {
  return regulatoryCharacters.find((entry) => entry.value === value)?.public_label ?? 'Unknown or unresolved';
}

export function getJurisdictionScope(jurisdiction) {
  const normalized = String(jurisdiction ?? '').trim().toLowerCase();
  if (!normalized || normalized === 'unknown') return 'unknown';
  if (normalized.startsWith('decentralized')) return 'decentralized_or_protocol';
  if (normalized.includes('multi_jurisdiction') || normalized.includes('multi-jurisdiction')) return 'multi_jurisdiction';
  if (normalized.includes(' / ') && normalized !== 'united states / new york') return 'multi_jurisdiction';
  return 'country_or_territory';
}

export function getJurisdictionScopeLabel(value) {
  return jurisdictionScopes.find((entry) => entry.value === value)?.public_label ?? 'Unknown or not publicly resolved';
}

export function getLegalFormState(organization) {
  if (organization?.legal_form) return 'recorded';
  return 'not_recorded';
}

export function getLegalFormLabel(organization) {
  return organization?.legal_form || 'Not recorded in canonical data';
}

export function getFunctionalRoleLabel(value) {
  return functionalRoleLabels[value] ?? 'Other recorded role';
}

export function getRelationshipStatusLabel(value) {
  return relationshipStatusLabels[value] ?? 'Unknown relationship state';
}
