export const assetClasses = [
  'stablecoin',
  'stable_value_asset',
  'stablecoin_adjacent',
  'tokenized_commodity',
  'yield_bearing_stable_receipt',
  'experimental_stabilization_asset',
  'reserve_asset',
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

export type AssetClass = (typeof assetClasses)[number];
export type ReferenceTarget = (typeof referenceTargets)[number];
export type RedemptionOrExitModel = (typeof redemptionOrExitModels)[number];
export type ValuationSourceType = (typeof valuationSourceTypes)[number];
export type YieldOrRebaseMode = (typeof yieldOrRebaseModes)[number];
export type AccrualTarget = (typeof accrualTargets)[number];

export type ValuationSourceV2 = {
  source_type: ValuationSourceType;
  label?: string;
  url?: string;
  notes?: string;
};

export type YieldOrRebaseProfileV2 = {
  mode: YieldOrRebaseMode;
  accrual_target?: AccrualTarget;
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
