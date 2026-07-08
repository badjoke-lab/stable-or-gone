export const publicDeploymentCategories = [
  { value: 'issuer_or_institution_supported', public_label: 'Issuer- or institution-supported deployment', sort_order: 10 },
  { value: 'protocol_native_or_supported', public_label: 'Protocol-native or protocol-supported deployment', sort_order: 20 },
  { value: 'canonical_or_native_issuance', public_label: 'Canonical or native issuance', sort_order: 30 },
  { value: 'cross_chain_representation', public_label: 'Cross-chain or bridged representation', sort_order: 40 },
  { value: 'historical_or_legacy', public_label: 'Historical or legacy deployment', sort_order: 50 },
  { value: 'related_asset_or_wrapper', public_label: 'Related asset or wrapper', sort_order: 60 },
  { value: 'technical_standard_only', public_label: 'Technical-standard record', sort_order: 70 },
  { value: 'unknown', public_label: 'Unknown or not yet classified', sort_order: 80 }
];

const deploymentTypesByCategory = {
  issuer_or_institution_supported: [
    'issuer_native_fiat_token', 'issuer_native_token', 'issuer_native_tokenized_fund_share', 'issuer_native_tokenized_note',
    'issuer_or_network_supported_token', 'issuer_supported', 'issuer_supported_native_token',
    'issuer_supported_token', 'native_or_issuer_supported', 'erc20_or_issuer_supported', 'trust_issued_token'
  ],
  protocol_native_or_supported: [
    'native_or_protocol_supported', 'native_protocol_asset', 'protocol_asset', 'protocol_issued_synthetic',
    'protocol_issued_token', 'protocol_native_asset', 'protocol_native_token', 'protocol_native_vault_share',
    'protocol_supported_token', 'protocol_token'
  ],
  canonical_or_native_issuance: ['canonical_issuance', 'native'],
  cross_chain_representation: [
    'bridge_or_protocol_extension', 'bridge_representation', 'bridged',
    'cross_chain_representation', 'linked_native_representation'
  ],
  historical_or_legacy: [
    'historical_canonical_issuance', 'historical_issuer_supported_token', 'historical_original_issuance',
    'historical_protocol_native_token', 'historical_protocol_token', 'legacy_canonical_issuance', 'legacy_native',
    'legacy_protocol_token', 'native_historical'
  ],
  related_asset_or_wrapper: ['related_savings_token'],
  technical_standard_only: ['erc20', 'spl_token'],
  unknown: []
};

export const deploymentTypeCategoryMap = Object.fromEntries(
  Object.entries(deploymentTypesByCategory).flatMap(([category, values]) => values.map((value) => [value, category]))
);

export const deploymentOperationalStates = [
  { value: 'active', public_label: 'Active', sort_order: 10 },
  { value: 'restricted', public_label: 'Restricted', sort_order: 20 },
  { value: 'limited', public_label: 'Limited', sort_order: 30 },
  { value: 'impaired', public_label: 'Impaired', sort_order: 40 },
  { value: 'winding_down', public_label: 'Winding down', sort_order: 50 },
  { value: 'inactive', public_label: 'Inactive or historical', sort_order: 60 },
  { value: 'terminated', public_label: 'Terminated', sort_order: 70 },
  { value: 'collapsed', public_label: 'Collapsed or failed', sort_order: 80 },
  { value: 'migrated', public_label: 'Migrated', sort_order: 90 },
  { value: 'unknown', public_label: 'Unknown or unresolved', sort_order: 100 }
];

export const rawDeploymentStatusOperationalMap = {
  active: 'active',
  active_or_legacy_context: 'active',
  collapsed: 'collapsed',
  discontinued_or_wind_down_context: 'winding_down',
  explorer_reference_available: 'unknown',
  failed_legacy_context: 'collapsed',
  failed_or_inactive: 'unknown',
  historical_explorer_reference: 'inactive',
  historical_or_rebranded: 'inactive',
  impaired_retirement_proposed: 'impaired',
  inactive: 'inactive',
  inactive_or_source_review_needed: 'unknown',
  issuer_supported_source_review_needed: 'unknown',
  legacy_current_status_unresolved: 'unknown',
  limited: 'limited',
  migrated: 'migrated',
  related_asset_source_review_needed: 'unknown',
  restricted: 'restricted',
  retirement_proposed: 'unknown',
  source_review_needed: 'unknown',
  terminated: 'terminated',
  winding_down: 'winding_down'
};

export const deploymentChangeStates = [
  { value: 'none_recorded', public_label: 'No separate change state recorded', sort_order: 10 },
  { value: 'retirement_proposed', public_label: 'Retirement proposed, not implemented', sort_order: 20 },
  { value: 'wind_down_recorded', public_label: 'Wind-down recorded', sort_order: 30 },
  { value: 'migration_recorded', public_label: 'Migration recorded', sort_order: 40 },
  { value: 'rebrand_or_transition_recorded', public_label: 'Rebrand or transition recorded', sort_order: 50 },
  { value: 'unknown', public_label: 'Unknown or unresolved', sort_order: 60 }
];

export const rawDeploymentStatusChangeMap = {
  impaired_retirement_proposed: 'retirement_proposed',
  retirement_proposed: 'retirement_proposed',
  discontinued_or_wind_down_context: 'wind_down_recorded',
  winding_down: 'wind_down_recorded',
  migrated: 'migration_recorded',
  historical_or_rebranded: 'rebrand_or_transition_recorded'
};

export const deploymentCanonicalityLabels = {
  native: 'Native deployment',
  issuer_native: 'Issuer-native deployment',
  canonical_bridge: 'Canonical bridge representation',
  third_party_bridge: 'Third-party bridge representation',
  wrapped: 'Wrapped representation',
  synthetic: 'Synthetic representation',
  legacy: 'Legacy deployment',
  unknown: 'Unknown or not recorded'
};

export const deploymentCanonicalityRecordStates = [
  { value: 'recorded', public_label: 'Canonicality recorded', sort_order: 10 },
  { value: 'not_recorded', public_label: 'Canonicality not recorded', sort_order: 20 }
];

export const deploymentVerificationStates = [
  { value: 'verified', public_label: 'Verified', sort_order: 10 },
  { value: 'identifier_recorded_unverified', public_label: 'Identifier recorded; verification not recorded', sort_order: 20 },
  { value: 'source_linked_no_identifier', public_label: 'Source-linked record; identifier not recorded', sort_order: 30 },
  { value: 'review_needed', public_label: 'Source review needed', sort_order: 40 },
  { value: 'not_recorded', public_label: 'Verification not recorded', sort_order: 50 },
  { value: 'unknown', public_label: 'Unknown or unresolved', sort_order: 60 }
];

export const contractIdentityStates = [
  { value: 'recorded_identifier', public_label: 'Identifier recorded', sort_order: 10 },
  { value: 'not_recorded', public_label: 'Identifier not recorded', sort_order: 20 },
  { value: 'review_needed', public_label: 'Source review needed', sort_order: 30 },
  { value: 'not_applicable_or_review_unresolved', public_label: 'Not applicable or review needed; unresolved', sort_order: 40 }
];

export const networkIdentityStates = [
  { value: 'recorded_network', public_label: 'Specific network recorded', sort_order: 10 },
  { value: 'aggregate_context', public_label: 'Aggregate or multi-chain context', sort_order: 20 },
  { value: 'review_needed', public_label: 'Network source review needed', sort_order: 30 }
];

function labelFor(entries, value, fallback) {
  return entries.find((entry) => entry.value === value)?.public_label ?? fallback;
}

export function getPublicDeploymentCategory(deploymentType) {
  return deploymentTypeCategoryMap[deploymentType] ?? 'unknown';
}

export function getPublicDeploymentCategoryLabel(value) {
  return labelFor(publicDeploymentCategories, value, 'Unknown or not yet classified');
}

export function getDeploymentOperationalState(rawStatus) {
  return rawDeploymentStatusOperationalMap[rawStatus] ?? 'unknown';
}

export function getDeploymentOperationalStateLabel(value) {
  return labelFor(deploymentOperationalStates, value, 'Unknown or unresolved');
}

export function getDeploymentChangeState(rawStatus) {
  return rawDeploymentStatusChangeMap[rawStatus] ?? 'none_recorded';
}

export function getDeploymentChangeStateLabel(value) {
  return labelFor(deploymentChangeStates, value, 'Unknown or unresolved');
}

export function getDeploymentCanonicalityLabel(value) {
  return deploymentCanonicalityLabels[value] ?? deploymentCanonicalityLabels.unknown;
}

export function getDeploymentCanonicalityRecordState(canonicality) {
  return canonicality === null || canonicality === undefined || canonicality === '' ? 'not_recorded' : 'recorded';
}

export function getDeploymentCanonicalityRecordStateLabel(value) {
  return labelFor(deploymentCanonicalityRecordStates, value, 'Canonicality not recorded');
}

export function getContractIdentityState(contractAddress, deploymentIdentifier = null) {
  if (deploymentIdentifier !== null && deploymentIdentifier !== undefined && deploymentIdentifier !== '') return 'recorded_identifier';
  if (contractAddress === null || contractAddress === undefined || contractAddress === '') return 'not_recorded';
  if (contractAddress === 'source_review_needed') return 'review_needed';
  if (contractAddress === 'not_applicable_or_source_review_needed') return 'not_applicable_or_review_unresolved';
  return 'recorded_identifier';
}

export function getContractIdentityStateLabel(value) {
  return labelFor(contractIdentityStates, value, 'Identifier state unresolved');
}

export function getNetworkIdentityState(chain) {
  if (chain === null || chain === undefined || chain === '' || chain === 'source_review_needed') return 'review_needed';
  if (String(chain).startsWith('multi_chain')) return 'aggregate_context';
  return 'recorded_network';
}

export function getNetworkIdentityStateLabel(value) {
  return labelFor(networkIdentityStates, value, 'Network state unresolved');
}

export function getDeploymentVerificationState(deployment) {
  const explicit = deployment?.verification_status;
  if (deploymentVerificationStates.some((entry) => entry.value === explicit)) return explicit;

  const contractState = getContractIdentityState(deployment?.contract_address, deployment?.deployment_identifier);
  if (contractState === 'recorded_identifier') return 'identifier_recorded_unverified';
  if (contractState === 'review_needed') return 'review_needed';
  if (contractState === 'not_applicable_or_review_unresolved') return 'unknown';
  if (Array.isArray(deployment?.evidence_ids) && deployment.evidence_ids.length > 0) return 'source_linked_no_identifier';
  return 'not_recorded';
}

export function getDeploymentVerificationStateLabel(value) {
  return labelFor(deploymentVerificationStates, value, 'Unknown or unresolved');
}
