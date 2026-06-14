export const assetClasses = [
  'stablecoin',
  'stable_value_asset',
  'stablecoin_adjacent',
  'tokenized_commodity',
  'yield_bearing_stable_receipt',
  'experimental_stabilization_asset',
  'reserve_asset',
  'tokenized_deposit',
  'tokenized_fund_share',
  'unknown'
] as const;

export const referenceTargets = [
  'fiat',
  'commodity',
  'crypto_asset',
  'index',
  'basket',
  'floating',
  'protocol_internal',
  'none',
  'unknown'
] as const;

export const redemptionOrExitModels = [
  'issuer_redemption',
  'protocol_redemption',
  'market_exit',
  'conversion',
  'physical_redemption',
  'vault_withdrawal',
  'rebasing_or_repricing',
  'maturity_or_settlement',
  'none',
  'other',
  'unknown'
] as const;

export const valuationSourceTypes = [
  'issuer',
  'protocol',
  'oracle',
  'market',
  'index_provider',
  'custodian',
  'other',
  'unknown'
] as const;

export const yieldOrRebaseModes = [
  'none',
  'yield_bearing',
  'rebasing',
  'reward_accruing',
  'variable_rate',
  'other',
  'unknown'
] as const;

export const accrualTargets = [
  'asset',
  'wrapper',
  'external_receipt',
  'protocol_position',
  'none',
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

export const rateTypes = [
  'fixed',
  'variable',
  'discretionary',
  'protocol_determined',
  'none',
  'unknown'
] as const;

export type AssetClass = (typeof assetClasses)[number];
export type ReferenceTarget = (typeof referenceTargets)[number];
export type RedemptionOrExitModel = (typeof redemptionOrExitModels)[number];
export type ValuationSourceType = (typeof valuationSourceTypes)[number];
export type YieldOrRebaseMode = (typeof yieldOrRebaseModes)[number];
export type AccrualTarget = (typeof accrualTargets)[number];
export type YieldSource = (typeof yieldSources)[number];
export type AccrualMechanism = (typeof accrualMechanisms)[number];
export type RateType = (typeof rateTypes)[number];

export type ValuationSourceV2 = {
  source_type: ValuationSourceType;
  label?: string;
  url?: string;
  notes?: string;
};

export type YieldOrRebaseProfileV2 = {
  mode: YieldOrRebaseMode;
  accrual_target?: AccrualTarget;
  yield_source?: YieldSource;
  accrual_mechanism?: AccrualMechanism;
  rate_type?: RateType;
  rate_source?: string;
  notes?: string;
};

export type StableAssetExtensionFields = {
  asset_class?: AssetClass;
  reference_target?: ReferenceTarget;
  redemption_or_exit_model?: RedemptionOrExitModel;
  valuation_source?: ValuationSourceV2;
  yield_or_rebase_profile?: YieldOrRebaseProfileV2;
  classification_notes?: string;
};
