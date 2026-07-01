const multiFilter = (id, source_axis, values_from = 'public_taxonomy') => Object.freeze({
  id,
  query_param: id,
  source_axis,
  mode: 'multi',
  values_from
});

const sort = (id, source_axis, direction, unknowns) => Object.freeze({
  id,
  source_axis,
  direction,
  ...(unknowns ? { unknowns } : {})
});

const search = (fields) => Object.freeze({
  query_param: 'q',
  fields: Object.freeze(fields),
  normalization: Object.freeze(['unicode_nfkc', 'case_fold', 'trim', 'collapse_whitespace']),
  fuzzy_matching: false
});

export const indexInteractionContracts = Object.freeze([
  Object.freeze({
    id: 'stablecoins',
    route: '/stablecoins/',
    source_file: 'src/pages/stablecoins/index.astro',
    record_kind: 'stablecoin',
    default_sort: 'name_asc',
    search: search(['canonical_name', 'symbol', 'slug', 'aliases', 'official_domain', 'organization_names']),
    filters: Object.freeze([
      multiFilter('lifecycle', 'lifecycle_status'),
      multiFilter('issuance', 'issuance_status'),
      multiFilter('asset_class', 'asset_class', 'canonical_data'),
      multiFilter('reference', 'reference_comparison_category'),
      multiFilter('backing', 'public_model_category'),
      multiFilter('stabilization', 'stabilization_mechanism')
    ]),
    sorts: Object.freeze([
      sort('name_asc', 'canonical_name', 'asc'),
      sort('name_desc', 'canonical_name', 'desc'),
      sort('lifecycle_then_name', 'lifecycle_status,canonical_name', 'asc'),
      sort('launch_oldest', 'launch_date', 'asc', 'last'),
      sort('launch_newest', 'launch_date', 'desc', 'last'),
      sort('evidence_most', 'public_source_identity_count', 'desc')
    ]),
    pagination: Object.freeze({
      enabled: true,
      query_param: 'page',
      page_size: 20,
      resets_on_search_filter_or_sort: true,
      browser_history_restores_page: true,
      server_rendered_first_page: true,
      all_records_remain_in_html_for_no_script_and_link_parity: true
    }),
    mobile_row_fields: Object.freeze([
      'canonical_name', 'symbol', 'lifecycle_status', 'issuance_status',
      'reference_comparison_category', 'public_model_category',
      'primary_display_organization', 'organization_relationship_count',
      'public_source_identity_count', 'known_unknown_count'
    ]),
    comparison: Object.freeze({
      enabled: true,
      minimum_records: 2,
      maximum_records: 4,
      query_param: 'compare',
      identity_key: 'slug',
      sections: Object.freeze([
        'identity_current_state', 'reference_backing_stabilization',
        'reserve_redemption', 'organizations_control', 'deployments',
        'event_summary', 'evidence_known_unknowns'
      ]),
      excluded_axes: Object.freeze([
        'price', 'market_cap', 'trading_volume', 'tvl', 'apy',
        'yield_ranking', 'safety_score', 'investment_rank'
      ])
    })
  }),
  Object.freeze({
    id: 'organizations',
    route: '/issuers/',
    source_file: 'src/pages/issuers/index.astro',
    record_kind: 'organization',
    default_sort: 'name_asc',
    search: search(['canonical_name', 'slug', 'aliases', 'jurisdiction', 'related_stablecoin_names', 'functional_roles']),
    filters: Object.freeze([
      multiFilter('category', 'public_organization_category'),
      multiFilter('regulatory', 'regulatory_character'),
      multiFilter('jurisdiction', 'jurisdiction_scope'),
      multiFilter('role', 'functional_role', 'canonical_data'),
      multiFilter('relationship_status', 'relationship_status', 'canonical_data')
    ]),
    sorts: Object.freeze([
      sort('name_asc', 'canonical_name', 'asc'),
      sort('name_desc', 'canonical_name', 'desc'),
      sort('assets_most', 'related_stablecoin_count', 'desc'),
      sort('relationships_most', 'relationship_count', 'desc'),
      sort('evidence_most', 'public_source_identity_count', 'desc')
    ]),
    mobile_row_fields: Object.freeze([
      'canonical_name', 'public_organization_category', 'jurisdiction_scope',
      'functional_roles', 'relationship_statuses', 'related_stablecoin_count',
      'relationship_count', 'public_source_identity_count'
    ]),
    comparison: Object.freeze({
      enabled: false,
      reason: 'Organization records have heterogeneous legal and functional roles; filters and sorts are appropriate, but a generic scorecard would imply false equivalence.'
    })
  }),
  Object.freeze({
    id: 'events',
    route: '/events/',
    source_file: 'src/pages/events/index.astro',
    record_kind: 'event',
    default_sort: 'date_desc',
    search: search(['title', 'description', 'event_id', 'stablecoin_names', 'organization_names', 'publisher_names']),
    filters: Object.freeze([
      multiFilter('category', 'public_event_category'),
      multiFilter('subtype', 'canonical_event_subtype', 'canonical_data'),
      multiFilter('status_effect', 'event_status_effect_category'),
      multiFilter('recovery', 'event_recovery_category'),
      multiFilter('year', 'event_year', 'canonical_data')
    ]),
    sorts: Object.freeze([
      sort('date_desc', 'event_date', 'desc', 'last'),
      sort('date_asc', 'event_date', 'asc', 'last'),
      sort('title_asc', 'title', 'asc'),
      sort('evidence_most', 'public_source_identity_count', 'desc')
    ]),
    mobile_row_fields: Object.freeze([
      'event_date', 'title', 'public_event_category', 'canonical_event_subtype',
      'subject_names', 'event_status_effect_category',
      'event_recovery_category', 'public_source_identity_count'
    ]),
    comparison: Object.freeze({
      enabled: false,
      reason: 'Events are chronological records with different scopes and subjects. Shared taxonomy and filters provide comparison without a scorecard.'
    })
  })
]);

export const sharedInteractionPolicy = Object.freeze({
  query_parameters_are_shareable: true,
  query_parameters_replace_history_on_typing: true,
  query_parameters_push_history_on_committed_filter_change: true,
  browser_back_forward_restores_state: true,
  empty_values_are_omitted: true,
  multi_value_separator: ',',
  unknown_query_values_are_ignored: true,
  active_filter_summary_required: true,
  clear_all_required: true,
  per_filter_clear_required: true,
  result_count_required: true,
  visible_range_required_for_paginated_indexes: true,
  zero_result_state_required: true,
  zero_result_state_must_offer_clear: true,
  keyboard_operable: true,
  pointer_only_controls_prohibited: true,
  mobile_material_information_suppression_prohibited: true,
  primary_relationship_does_not_replace_multi_role_summary: true,
  server_rendered_unfiltered_fallback_required: true,
  javascript_enhancement_only: true,
  route_changes_allowed: false
});

export const comparisonPolicy = Object.freeze({
  stablecoin_only: true,
  comparison_is_not_ranking: true,
  comparison_is_not_recommendation: true,
  value_states_remain_visible: true,
  unknown_values_are_not_zero: true,
  unknown_values_are_not_worst: true,
  source_identity_and_relation_counts_remain_distinct: true,
  current_and_historical_values_remain_distinct: true
});
