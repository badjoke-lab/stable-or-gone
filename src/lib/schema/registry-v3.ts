import type { RelationshipStatus } from './registry-v2';

export const legalClassifications = [
  'fiat_backed_stablecoin',
  'e_money_token',
  'asset_referenced_token',
  'tokenized_deposit',
  'bank_liability_token',
  'fund_share',
  'security_token',
  'commodity_claim',
  'protocol_asset',
  'unclassified',
  'unknown'
] as const;

export const holderClaimTypes = [
  'direct_claim_on_issuer',
  'direct_claim_on_bank',
  'beneficial_interest_in_reserve',
  'fund_share_claim',
  'commodity_ownership_or_claim',
  'protocol_redemption_right',
  'contractual_conversion_right',
  'no_direct_claim',
  'unclear',
  'unknown'
] as const;

export const reserveOwnershipTypes = [
  'issuer_owned',
  'issuer_owned_for_holders',
  'trust_or_custodial',
  'fund_owned',
  'protocol_controlled',
  'holder_owned',
  'mixed',
  'unclear',
  'unknown'
] as const;

export const reserveSegregationTypes = [
  'legally_segregated',
  'stated_segregated',
  'operationally_separate',
  'not_segregated',
  'not_applicable',
  'unclear',
  'unknown'
] as const;

export const bankruptcyRemotenessTypes = [
  'confirmed',
  'stated',
  'limited',
  'not_established',
  'not_applicable',
  'unclear',
  'unknown'
] as const;

export const stableAssetRelationshipTypes = [
  'predecessor_of',
  'successor_of',
  'rebranded_as',
  'migrated_to',
  'wrapper_of',
  'yield_wrapper_of',
  'receipt_for',
  'bridged_representation_of',
  'redeemable_into',
  'collateralized_by',
  'basket_contains',
  'fork_of',
  'other',
  'unknown'
] as const;

export const reserveComponentCategories = [
  'cash',
  'cash_equivalents',
  'bank_deposits',
  'government_securities',
  'commercial_paper',
  'corporate_bonds',
  'private_credit',
  'receivables',
  'secured_loans',
  'crypto_collateral',
  'stablecoin_collateral',
  'tokenized_fund',
  'fund_share',
  'commodity',
  'insurance_or_guarantee',
  'other',
  'unknown'
] as const;

export const liquidityClasses = ['high', 'medium', 'low', 'illiquid', 'not_applicable', 'unknown'] as const;
export const maturityBuckets = ['on_demand', 'under_30_days', 'under_90_days', 'under_1_year', 'over_1_year', 'perpetual', 'not_applicable', 'unknown'] as const;

export const deploymentCanonicalities = [
  'native',
  'issuer_native',
  'canonical_bridge',
  'third_party_bridge',
  'wrapped',
  'synthetic',
  'legacy',
  'unknown'
] as const;

export const yieldSources = [
  'reserve_income',
  'lending',
  'staking',
  'derivatives_funding',
  'protocol_incentives',
  'token_emissions',
  'mixed',
  'none',
  'unknown'
] as const;

export const accrualMechanisms = [
  'balance_rebase',
  'exchange_rate_increase',
  'claimable_reward',
  'wrapper_value_increase',
  'external_distribution',
  'protocol_position',
  'none',
  'unknown'
] as const;

export const rateTypes = ['fixed', 'variable', 'discretionary', 'protocol_determined', 'none', 'unknown'] as const;

export type LegalClassification = (typeof legalClassifications)[number];
export type HolderClaimType = (typeof holderClaimTypes)[number];
export type ReserveOwnershipType = (typeof reserveOwnershipTypes)[number];
export type ReserveSegregationType = (typeof reserveSegregationTypes)[number];
export type BankruptcyRemotenessType = (typeof bankruptcyRemotenessTypes)[number];
export type StableAssetRelationshipType = (typeof stableAssetRelationshipTypes)[number];
export type ReserveComponentCategory = (typeof reserveComponentCategories)[number];
export type LiquidityClass = (typeof liquidityClasses)[number];
export type MaturityBucket = (typeof maturityBuckets)[number];
export type DeploymentCanonicality = (typeof deploymentCanonicalities)[number];
export type YieldSource = (typeof yieldSources)[number];
export type AccrualMechanism = (typeof accrualMechanisms)[number];
export type RateType = (typeof rateTypes)[number];

export type LegalClassificationEntryV3 = {
  classification: LegalClassification;
  jurisdiction?: string;
  effective_from?: string | null;
  effective_to?: string | null;
  authority_or_basis?: string | null;
  confidence?: string;
  evidence_ids: string[];
};

export type LegalProfileV3 = {
  id: string;
  classifications: LegalClassificationEntryV3[];
  holder_claim_type: HolderClaimType;
  claim_against_organization_ids: string[];
  reserve_ownership: ReserveOwnershipType;
  reserve_segregation: ReserveSegregationType;
  bankruptcy_remoteness: BankruptcyRemotenessType;
  licensed_or_regulated_as: string[];
  notes?: string | null;
  evidence_ids: string[];
};

export type StableAssetRelationshipV3 = {
  id: string;
  from_asset_id: string;
  to_asset_id: string;
  relationship_type: StableAssetRelationshipType;
  status: RelationshipStatus;
  start_date?: string | null;
  end_date?: string | null;
  conversion_terms?: string | null;
  evidence_ids: string[];
  notes?: string | null;
};

export type ReserveComponentV3 = {
  id: string;
  stablecoin_id: string;
  reserve_report_id?: string | null;
  asset_category: ReserveComponentCategory;
  asset_label?: string | null;
  share_percent?: number | null;
  amount_text?: string | null;
  currency?: string | null;
  liquidity_class?: LiquidityClass;
  maturity_bucket?: MaturityBucket;
  custodian_organization_id?: string | null;
  as_of_date?: string | null;
  confidence?: string;
  evidence_ids: string[];
  notes?: string | null;
};

export type DeploymentV3Fields = {
  canonicality?: DeploymentCanonicality;
  origin_deployment_id?: string | null;
  bridge_operator_organization_id?: string | null;
  mint_authority_type?: string | null;
  contract_version?: string | null;
  is_primary?: boolean;
};

export type GenericEventDetailV3 = {
  summary?: string;
  status?: string;
  affected_deployment_ids?: string[];
  related_organization_ids?: string[];
  loss_or_exposure_text?: string | null;
  resolution_date?: string | null;
};

export type EventV3Fields = {
  security_incident_detail?: GenericEventDetailV3;
  oracle_failure_detail?: GenericEventDetailV3;
  collateral_impairment_detail?: GenericEventDetailV3;
  insolvency_detail?: GenericEventDetailV3;
  governance_change_detail?: GenericEventDetailV3;
  bridge_or_chain_incident_detail?: GenericEventDetailV3;
  termination_detail?: GenericEventDetailV3;
  launch_detail?: GenericEventDetailV3;
};
