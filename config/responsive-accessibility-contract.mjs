const table = (kind, mobile_representation, options = {}) => Object.freeze({
  kind,
  mobile_representation,
  horizontal_scroll_fallback: true,
  material_fields_preserved: true,
  row_identity_preserved: true,
  header_context_preserved: true,
  ...options
});

export const responsiveBands = Object.freeze([
  Object.freeze({ id: 'wide', min_width: 1024, max_width: null, columns: 'multi_column', navigation: 'grouped_desktop' }),
  Object.freeze({ id: 'medium', min_width: 720, max_width: 1023, columns: 'reduced_columns', navigation: 'grouped_compact' }),
  Object.freeze({ id: 'compact', min_width: 320, max_width: 719, columns: 'single_column', navigation: 'disclosure_menu' })
]);

export const pageFamilyContracts = Object.freeze([
  Object.freeze({ id: 'home', sources: Object.freeze(['src/pages/index.astro']), focus_order: Object.freeze(['skip_link', 'brand', 'primary_navigation', 'main_heading', 'registry_entry_actions', 'content_sections', 'footer']), mobile_rule: 'single-column entry cards; registry access precedes editorial and support content' }),
  Object.freeze({ id: 'stablecoin_index', sources: Object.freeze(['src/pages/stablecoins/index.astro']), focus_order: Object.freeze(['skip_link', 'brand', 'primary_navigation', 'main_heading', 'search', 'filters', 'sort', 'active_filters', 'result_summary', 'comparison_selection', 'results', 'footer']), mobile_rule: 'controls stack; rows become record summaries; comparison selection remains reachable' }),
  Object.freeze({ id: 'organization_index', sources: Object.freeze(['src/pages/issuers/index.astro']), focus_order: Object.freeze(['skip_link', 'brand', 'primary_navigation', 'main_heading', 'search', 'filters', 'sort', 'active_filters', 'result_summary', 'results', 'footer']), mobile_rule: 'compact rows preserve role, jurisdiction, connected-asset count, relationship count, and source count' }),
  Object.freeze({ id: 'event_index', sources: Object.freeze(['src/pages/events/index.astro']), focus_order: Object.freeze(['skip_link', 'brand', 'primary_navigation', 'main_heading', 'search', 'filters', 'sort', 'active_filters', 'result_summary', 'results', 'footer']), mobile_rule: 'compact chronological rows preserve date, severity, title, subject, type, effect, recovery, and source count' }),
  Object.freeze({ id: 'stablecoin_dossier', sources: Object.freeze(['src/components/StablecoinDetailView.astro', 'src/components/StablecoinValueStateSections.astro', 'src/components/MobileTableRuntime.astro']), focus_order: Object.freeze(['skip_link', 'brand', 'primary_navigation', 'record_heading', 'record_summary', 'local_dossier_navigation', 'identity', 'organizations', 'mechanics', 'deployments', 'history', 'evidence', 'known_unknowns', 'corrections_more', 'footer']), mobile_rule: 'all dossier sections remain addressable; every protected table has an equivalent compact representation and full table fallback' }),
  Object.freeze({ id: 'organization_detail', sources: Object.freeze(['src/pages/issuer/[slug].astro', 'src/components/OrganizationEditorialIdentity.astro', 'src/components/OrganizationEditorialHistory.astro']), focus_order: Object.freeze(['skip_link', 'brand', 'primary_navigation', 'record_heading', 'record_summary', 'overview', 'relationships', 'events', 'evidence', 'known_unknowns', 'corrections', 'footer']), mobile_rule: 'header owns primary facts; relationship and event tables have compact representations; known unknowns start collapsed' }),
  Object.freeze({ id: 'event_detail', sources: Object.freeze(['src/pages/event/[id].astro', 'src/components/StructuredEventDetail.astro', 'src/components/EventEditorialBody.astro']), focus_order: Object.freeze(['skip_link', 'brand', 'primary_navigation', 'record_heading', 'event_summary', 'affected_records', 'structured_details', 'evidence', 'corrections', 'footer']), mobile_rule: 'primary facts remain in the header; subjects, typed detail, and evidence remain reachable without a duplicate overview table' }),
  Object.freeze({ id: 'guide_index', sources: Object.freeze(['src/pages/guides/index.astro', 'src/components/GuideEditorialIndex.astro']), focus_order: Object.freeze(['skip_link', 'brand', 'primary_navigation', 'main_heading', 'category_navigation', 'guide_records', 'reference_actions', 'footer']), mobile_rule: 'guide cards preserve category, scope, publication state, current-through date, and route' }),
  Object.freeze({ id: 'guide_article', sources: Object.freeze(['src/layouts/BaseLayout.astro', 'src/components/GuideArticleHeader.astro']), focus_order: Object.freeze(['skip_link', 'brand', 'primary_navigation', 'contents_disclosure', 'article_heading', 'article_sections', 'related_records', 'corrections', 'footer']), mobile_rule: 'contents disclosure starts collapsed, exposes aria-expanded and aria-controls, and closes on Escape' }),
  Object.freeze({ id: 'reference_longform', sources: Object.freeze(['src/pages/models/index.astro', 'src/pages/glossary/index.astro', 'src/pages/updates/index.astro', 'src/pages/methodology/index.astro', 'src/pages/about/index.astro']), focus_order: Object.freeze(['skip_link', 'brand', 'primary_navigation', 'main_heading', 'reference_or_contents_navigation', 'content_records', 'contextual_actions', 'footer']), mobile_rule: 'reference records and long-form contents preserve terms, dates, definitions, project rules, and source order' }),
  Object.freeze({ id: 'utility', sources: Object.freeze(['src/pages/contact/index.astro', 'src/pages/support/index.astro']), focus_order: Object.freeze(['skip_link', 'brand', 'primary_navigation', 'main_heading', 'primary_action', 'secondary_actions', 'warnings', 'wallet_or_contact_records', 'feedback', 'footer']), mobile_rule: 'actions meet 44px minimum; full addresses, networks, warnings, correction routes, and copy feedback remain visible' })
]);

export const mobileTableContracts = Object.freeze([
  table('stablecoin-index', 'record_cards', { grouping: 'one stablecoin per card' }),
  table('organization-index', 'record_cards', { grouping: 'one organization per compact row' }),
  table('event-index', 'timeline_cards', { grouping: 'one event per compact row' }),
  table('stablecoin-overview', 'definition_list'),
  table('stablecoin-organizations', 'relationship_cards'),
  table('stablecoin-reserve-profile', 'definition_list'),
  table('stablecoin-redemption-profile', 'definition_list'),
  table('stablecoin-record-coverage', 'coverage_summary'),
  table('issuer-control-events', 'timeline_cards'),
  table('stablecoin-event-timeline', 'timeline_cards'),
  table('stablecoin-reserve-history', 'record_cards'),
  table('stablecoin-regulatory-notices', 'record_cards'),
  table('stablecoin-deployments', 'deployment_cards', { long_identifier_copy_required: true }),
  table('stablecoin-sources', 'source_cards'),
  table('stablecoin-open-questions', 'unknown_cards'),
  table('organization-relationships', 'relationship_cards'),
  table('organization-events', 'timeline_cards'),
  table('organization-sources', 'source_cards'),
  table('event-detail-overlay', 'definition_list'),
  table('event-sources', 'source_cards'),
  table('methodology-value-states', 'matrix_cards'),
  table('methodology-primary-display-relationships', 'matrix_cards'),
  table('methodology-evidence-source-identities', 'matrix_cards')
]);

export const keyboardContracts = Object.freeze([
  Object.freeze({ id: 'skip_link', keys: Object.freeze(['Tab', 'Enter']), behavior: 'first focusable control moves focus to main content' }),
  Object.freeze({ id: 'global_navigation', keys: Object.freeze(['Tab', 'Shift+Tab', 'Enter', 'Space', 'Escape']), behavior: 'logical DOM order; disclosure menu closes on Escape and returns focus to trigger' }),
  Object.freeze({ id: 'index_search', keys: Object.freeze(['Tab', 'Shift+Tab']), behavior: 'typing updates results without stealing focus; Escape clears only when documented and announced' }),
  Object.freeze({ id: 'index_filters', keys: Object.freeze(['Tab', 'Shift+Tab', 'Space', 'Enter', 'Arrow keys']), behavior: 'native controls or equivalent semantics; selected values remain visible' }),
  Object.freeze({ id: 'active_filter_removal', keys: Object.freeze(['Tab', 'Shift+Tab', 'Enter', 'Space']), behavior: 'removes one named filter and announces result count' }),
  Object.freeze({ id: 'comparison_selection', keys: Object.freeze(['Tab', 'Shift+Tab', 'Space']), behavior: 'selection state exposed programmatically; maximum-four limit announced' }),
  Object.freeze({ id: 'comparison_panel', keys: Object.freeze(['Tab', 'Shift+Tab', 'Escape']), behavior: 'opening moves focus to heading only when user initiated; closing returns focus to trigger' }),
  Object.freeze({ id: 'local_dossier_navigation', keys: Object.freeze(['Tab', 'Shift+Tab', 'Enter']), behavior: 'anchor navigation moves focus to section heading without trapping focus' }),
  Object.freeze({ id: 'disclosure', keys: Object.freeze(['Tab', 'Shift+Tab', 'Enter', 'Space', 'Escape']), behavior: 'aria-expanded and aria-controls remain synchronized' }),
  Object.freeze({ id: 'copy_identifier', keys: Object.freeze(['Tab', 'Shift+Tab', 'Enter', 'Space']), behavior: 'copies full identifier and announces success or failure without replacing visible value' })
]);

export const announcementContracts = Object.freeze([
  Object.freeze({ id: 'result_count', priority: 'polite', trigger: 'search, filter, sort, or history-state change', message_content: Object.freeze(['visible_count', 'total_count']) }),
  Object.freeze({ id: 'active_filters', priority: 'polite', trigger: 'committed filter change', message_content: Object.freeze(['added_or_removed_filter', 'visible_count']) }),
  Object.freeze({ id: 'zero_results', priority: 'polite', trigger: 'result count reaches zero', message_content: Object.freeze(['zero_result_message', 'clear_action_available']) }),
  Object.freeze({ id: 'comparison_limit', priority: 'assertive', trigger: 'attempt to select fifth comparison record', message_content: Object.freeze(['maximum_four', 'selection_unchanged']) }),
  Object.freeze({ id: 'copy_result', priority: 'polite', trigger: 'copy identifier action', message_content: Object.freeze(['identifier_label', 'success_or_failure']) })
]);

export const longValueContract = Object.freeze({
  fields: Object.freeze(['contract_address', 'transaction_hash', 'source_url', 'archive_url', 'record_id']),
  full_value_remains_in_dom: true,
  visual_wrapping: 'overflow-wrap:anywhere',
  ellipsis_without_accessible_full_value_prohibited: true,
  copy_action_required_for_contract_and_transaction_identifiers: true,
  copy_action_has_specific_accessible_name: true,
  copy_feedback_announced: true
});

export const visualAccessibilityContract = Object.freeze({
  normal_text_contrast_minimum: 4.5,
  large_text_contrast_minimum: 3,
  non_text_ui_contrast_minimum: 3,
  minimum_pointer_target_css_px: 44,
  focus_indicator_required: true,
  focus_indicator_not_color_only: true,
  state_indicator_text_required: true,
  color_only_state_prohibited: true,
  zoom_200_percent_supported: true,
  reflow_320_css_px_supported: true,
  text_spacing_override_supported: true,
  forced_colors_supported: true,
  dark_theme_not_only_readability_mode: true
});

export const motionContract = Object.freeze({
  reduced_motion_media_query_required: true,
  essential_motion_only_under_reduced_motion: true,
  auto_animation_prohibited: true,
  parallax_prohibited: true,
  focus_scroll_uses_auto_under_reduced_motion: true
});

export const responsiveAccessibilityPolicies = Object.freeze({
  material_information_suppression_prohibited: true,
  horizontal_scroll_may_not_be_only_mobile_representation: true,
  generic_column_hiding_prohibited: true,
  semantic_heading_order_required: true,
  one_h1_per_page_required: true,
  main_landmark_target_required: true,
  skip_link_required: true,
  current_page_navigation_state_required: true,
  landmarks_have_unique_labels: true,
  native_controls_preferred: true,
  validation_errors_link_to_controls: true,
  implementation_deferred: false,
  implementation_starts_at_pr: 270,
  route_changes_allowed: false
});
