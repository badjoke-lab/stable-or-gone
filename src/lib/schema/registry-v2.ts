export const lifecycleStatuses = [
  'announced',
  'active',
  'restricted',
  'suspended',
  'winding_down',
  'inactive',
  'terminated',
  'collapsed',
  'migrated',
  'rebranded',
  'unknown'
] as const;

export const issuanceStatuses = [
  'open',
  'restricted',
  'paused',
  'terminated',
  'protocol_based',
  'unknown'
] as const;

export const redemptionStatuses = [
  'public_direct',
  'eligible_customers_only',
  'institutional_only',
  'protocol_based',
  'restricted',
  'suspended',
  'terminated',
  'not_applicable',
  'unknown'
] as const;

export const pegReferenceKinds = [
  'fiat',
  'commodity',
  'crypto_asset',
  'index',
  'floating',
  'other',
  'unknown'
] as const;

export const backingTypes = [
  'cash',
  'bank_deposits',
  'government_securities',
  'commercial_paper',
  'crypto_collateral',
  'stablecoin_collateral',
  'tokenized_fund',
  'commodity',
  'unbacked',
  'mixed',
  'other',
  'unknown'
] as const;

export const stabilizationMechanisms = [
  'issuer_redemption',
  'overcollateralized_vault',
  'algorithmic_supply',
  'delta_neutral',
  'protocol_arbitrage',
  'hybrid',
  'other',
  'unknown'
] as const;

export const governanceModels = [
  'centralized',
  'dao_governed',
  'protocol_governed',
  'hybrid',
  'unknown'
] as const;

export const organizationRoles = [
  'legal_issuer',
  'brand_owner',
  'protocol_operator',
  'governance_body',
  'reserve_manager',
  'custodian',
  'redemption_agent',
  'technology_provider',
  'other'
] as const;

export const eventDetailKinds = ['depeg', 'regulatory', 'reserve_change', 'redemption_change', 'migration', 'other'] as const;
export const relationshipStatuses = ['active', 'ended', 'planned', 'unknown'] as const;
export const depegDirections = ['below_peg', 'above_peg', 'both', 'unknown'] as const;
export const recoveryStatuses = ['recovered', 'partially_recovered', 'not_recovered', 'collapsed', 'unknown'] as const;

export type LifecycleStatus = (typeof lifecycleStatuses)[number];
export type IssuanceStatus = (typeof issuanceStatuses)[number];
export type RedemptionStatusV2 = (typeof redemptionStatuses)[number];
export type PegReferenceKind = (typeof pegReferenceKinds)[number];
export type BackingType = (typeof backingTypes)[number];
export type StabilizationMechanism = (typeof stabilizationMechanisms)[number];
export type GovernanceModel = (typeof governanceModels)[number];
export type OrganizationRole = (typeof organizationRoles)[number];
export type EventDetailKind = (typeof eventDetailKinds)[number];
export type RelationshipStatus = (typeof relationshipStatuses)[number];
export type DepegDirection = (typeof depegDirections)[number];
export type RecoveryStatus = (typeof recoveryStatuses)[number];

export type PegReferenceV2 = {
  kind: PegReferenceKind;
  asset?: string;
  target_value?: number;
  notes?: string;
};

export type ReserveProfileV2 = {
  backing_types: BackingType[];
  summary?: string;
  disclosure_status?: string;
  as_of_date?: string | null;
  latest_report_id?: string | null;
  confidence?: string;
  evidence_ids?: string[];
};

export type RedemptionProfileV2 = {
  status: RedemptionStatusV2;
  settlement_asset?: string;
  eligible_parties?: string;
  retail_access?: string;
  institutional_access?: string;
  minimum_amount_text?: string;
  fee_text?: string;
  settlement_time_text?: string;
  jurisdiction_restrictions?: string[];
  redemption_url?: string;
  as_of_date?: string | null;
  confidence?: string;
  evidence_ids?: string[];
};

export type OrganizationRelationshipV2 = {
  id?: string;
  stablecoin_id?: string;
  organization_id: string;
  role: OrganizationRole;
  start_date?: string | null;
  end_date?: string | null;
  status?: RelationshipStatus;
  evidence_ids?: string[];
  notes?: string;
};

export type DepegDetailV2 = {
  peg_reference?: string;
  direction?: DepegDirection;
  extreme_price?: number | null;
  maximum_deviation_bps?: number | null;
  duration_minutes?: number | null;
  recovery_status?: RecoveryStatus;
  recovery_date?: string | null;
  cause_summary?: string;
  price_source_ids?: string[];
};

export type RegulatoryDetailV2 = {
  jurisdiction?: string;
  authority?: string;
  action_type?: string;
  case_reference?: string;
  effective_date?: string | null;
  resolution_date?: string | null;
};

export type ReserveChangeDetailV2 = {
  summary?: string;
};

export type RedemptionChangeDetailV2 = {
  summary?: string;
};

export type MigrationDetailV2 = {
  summary?: string;
};

export type StablecoinV2Fields = {
  lifecycle_status?: LifecycleStatus;
  issuance_status?: IssuanceStatus;
  peg_reference?: PegReferenceV2;
  backing_types?: BackingType[];
  stabilization_mechanism?: StabilizationMechanism;
  governance_model?: GovernanceModel;
  reserve_profile?: ReserveProfileV2;
  redemption_profile?: RedemptionProfileV2;
  organization_relationships?: OrganizationRelationshipV2[];
};

export type EventV2Fields = {
  subject_stablecoin_ids?: string[];
  subject_organization_ids?: string[];
  evidence_ids?: string[];
  event_detail_kind?: EventDetailKind;
  depeg_detail?: DepegDetailV2;
  regulatory_detail?: RegulatoryDetailV2;
  reserve_change_detail?: ReserveChangeDetailV2;
  redemption_change_detail?: RedemptionChangeDetailV2;
  migration_detail?: MigrationDetailV2;
};

export type EvidenceV2Fields = {
  stablecoin_ids?: string[];
  organization_ids?: string[];
  event_ids?: string[];
  claim_scopes?: string[];
};

export const legacyStatusCompatibility: Record<string, readonly LifecycleStatus[]> = {
  active: ['active'],
  limited: ['restricted'],
  impaired: ['restricted', 'suspended'],
  discontinued: ['winding_down', 'inactive', 'terminated'],
  failed: ['collapsed'],
  rebranded: ['rebranded'],
  migrated: ['migrated'],
  unknown: ['unknown']
};

export function isLegacyStatusCompatible(legacyStatus?: string, lifecycleStatus?: LifecycleStatus): boolean {
  if (!legacyStatus || !lifecycleStatus) return true;
  return legacyStatusCompatibility[legacyStatus]?.includes(lifecycleStatus) ?? false;
}
