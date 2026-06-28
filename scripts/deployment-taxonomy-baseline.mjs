export const deploymentTaxonomyBaseline = {
  deployments: 130,
  unique_ids: 130,
  stablecoins_covered: 92,
  public_deployment_categories: {
    canonical_or_native_issuance: 10,
    cross_chain_representation: 8,
    historical_or_legacy: 15,
    issuer_or_institution_supported: 59,
    protocol_native_or_supported: 34,
    related_asset_or_wrapper: 1,
    technical_standard_only: 3
  },
  operational_states: {
    active: 85,
    collapsed: 2,
    impaired: 1,
    inactive: 6,
    limited: 2,
    migrated: 1,
    restricted: 6,
    terminated: 2,
    unknown: 23,
    winding_down: 2
  },
  change_states: {
    migration_recorded: 1,
    none_recorded: 124,
    rebrand_or_transition_recorded: 1,
    retirement_proposed: 2,
    wind_down_recorded: 2
  },
  canonicality: {
    canonical_bridge: 5,
    issuer_native: 60,
    legacy: 18,
    native: 40,
    synthetic: 1,
    unknown: 6
  },
  canonicality_record_state: {
    recorded: 130
  },
  verification_states: {
    identifier_recorded_unverified: 45,
    review_needed: 15,
    source_linked_no_identifier: 69,
    unknown: 1
  },
  contract_identity_states: {
    not_applicable_or_review_unresolved: 1,
    not_recorded: 69,
    recorded_identifier: 45,
    review_needed: 15
  },
  network_identity_states: {
    aggregate_context: 4,
    recorded_network: 124,
    review_needed: 2
  },
  verification_status_recorded: 130,
  records_with_evidence: 130,
  records_with_control_events: 18
};
