export const visualTokens = Object.freeze({
  colors: Object.freeze({
    background: '#071018',
    background_subtle: '#0A151F',
    surface: '#0D1924',
    surface_raised: '#112332',
    surface_emphasis: '#172C3B',
    line: '#284555',
    line_subtle: '#1B3443',
    text: '#EAF3F6',
    text_muted: '#9AB0BA',
    link: '#75D5FF',
    focus: '#F4C96B',
    positive: '#78D7A9',
    warning: '#E9C96F',
    critical: '#F08A8A',
    unknown: '#B7A9DD',
    inactive: '#A7B3B9'
  }),
  typography: Object.freeze({
    display_stack: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
    body_stack: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
    mono_stack: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    sizes_px: Object.freeze({ xs: 12, sm: 14, md: 16, lg: 20, xl: 28, display: 42 }),
    line_heights: Object.freeze({ tight: 1.15, normal: 1.5, relaxed: 1.7 })
  }),
  spacing_px: Object.freeze([4, 8, 12, 16, 24, 32, 48, 64]),
  radius_px: Object.freeze({ compact: 6, panel: 10, prominent: 14 }),
  border_width_px: 1,
  focus_ring: Object.freeze({ width_px: 3, offset_px: 2, color_token: 'focus' }),
  shadows: Object.freeze({ panel: '0 12px 40px rgba(0,0,0,0.22)', elevated: '0 20px 60px rgba(0,0,0,0.30)' }),
  content_width_px: Object.freeze({ reading: 760, registry: 1180, wide: 1360 }),
  density: Object.freeze({ control_min_height_px: 44, table_row_min_height_px: 48, card_padding_px: 18 })
});

export const componentTreatments = Object.freeze({
  panel: Object.freeze({ background: 'surface', border: 'line_subtle', radius: 'panel', shadow: 'panel' }),
  primary_action: Object.freeze({ background: 'surface_emphasis', foreground: 'text', border: 'focus', minimum_height_px: 44 }),
  secondary_action: Object.freeze({ background: 'transparent', foreground: 'link', border: 'line', minimum_height_px: 44 }),
  evidence: Object.freeze({ accent: 'link', icon_text: 'SOURCE', metadata_order: Object.freeze(['publisher', 'category', 'provenance', 'publication_date', 'archive', 'reliability', 'claim_scopes']) }),
  known_unknown: Object.freeze({ accent: 'unknown', icon_text: '?', title: 'Known unknown', requires_last_checked: true, requires_value_state: true }),
  warning: Object.freeze({ accent: 'warning', icon_text: '!', text_label_required: true }),
  critical: Object.freeze({ accent: 'critical', icon_text: '×', text_label_required: true }),
  positive: Object.freeze({ accent: 'positive', icon_text: '✓', text_label_required: true }),
  state_chip: Object.freeze({ text_label_required: true, icon_optional: true, color_only_prohibited: true }),
  contract_value: Object.freeze({ font: 'mono', full_value_visible: true, wrap: 'anywhere', copy_action: true }),
  section_heading: Object.freeze({ eyebrow_optional: true, divider: 'line_subtle', anchor_link: true })
});

export const mockManifest = Object.freeze([
  Object.freeze({ id: 'stablecoin-index-desktop', file: 'stablecoin-index-desktop.svg', viewport: Object.freeze([1440, 1000]), record: 'multi-record registry sample', required_elements: Object.freeze(['grouped navigation', 'search', 'active filters', 'result count', 'stablecoin rows', 'multi-organization indicator', 'comparison selection']) }),
  Object.freeze({ id: 'stablecoin-detail-desktop', file: 'stablecoin-detail-desktop.svg', viewport: Object.freeze([1440, 1200]), record: 'USDT representative complex dossier', required_elements: Object.freeze(['record heading', 'current state', 'local navigation', 'organizations', 'mechanics', 'deployments', 'history', 'evidence', 'known unknowns']) }),
  Object.freeze({ id: 'stablecoin-index-mobile', file: 'stablecoin-index-mobile.svg', viewport: Object.freeze([390, 844]), record: 'multi-record registry sample', required_elements: Object.freeze(['mobile navigation', 'search', 'filter action', 'result count', 'record cards', 'material mobile fields']) }),
  Object.freeze({ id: 'stablecoin-detail-mobile', file: 'stablecoin-detail-mobile.svg', viewport: Object.freeze([390, 1000]), record: 'USDT representative complex dossier', required_elements: Object.freeze(['record heading', 'state summary', 'section navigation', 'organization count', 'evidence summary', 'known unknown summary']) }),
  Object.freeze({ id: 'organization-detail', file: 'organization-detail.svg', viewport: Object.freeze([1280, 1000]), record: 'Tether representative organization', required_elements: Object.freeze(['organization category', 'jurisdiction', 'roles', 'relationship cards', 'connected assets', 'events', 'evidence']) }),
  Object.freeze({ id: 'event-detail', file: 'event-detail.svg', viewport: Object.freeze([1280, 1000]), record: 'Terra collapse representative event', required_elements: Object.freeze(['event date', 'category', 'subtype', 'subjects', 'status effect', 'recovery', 'typed details', 'evidence']) }),
  Object.freeze({ id: 'home', file: 'home.svg', viewport: Object.freeze([1440, 1000]), record: 'registry home', required_elements: Object.freeze(['registry purpose', 'global search', 'record families', 'meaningful changes', 'methodology', 'data access', 'secondary support']) }),
  Object.freeze({ id: 'open-filter-state', file: 'open-filter-state.svg', viewport: Object.freeze([390, 844]), record: 'stablecoin mobile filters', required_elements: Object.freeze(['filter heading', 'selected filters', 'multi-value controls', 'result preview', 'clear all', 'apply action']) }),
  Object.freeze({ id: 'evidence-expanded-state', file: 'evidence-expanded-state.svg', viewport: Object.freeze([1280, 1000]), record: 'USDT evidence source identity', required_elements: Object.freeze(['source identity', 'publisher', 'provenance', 'primary state', 'publication date', 'archive', 'reliability', 'claim scopes', 'relation count']) }),
  Object.freeze({ id: 'known-unknown-warning-state', file: 'known-unknown-warning-state.svg', viewport: Object.freeze([1280, 900]), record: 'deployment verification unknown', required_elements: Object.freeze(['known unknown label', 'topic', 'value state', 'what remains unclear', 'priority', 'last checked', 'related section', 'correction action']) })
]);

export const mockReviewPolicy = Object.freeze({
  deterministic_svg_generation: true,
  every_visible_label_maps_to_public_contract: true,
  internal_enum_language_prohibited: true,
  work_queue_language_prohibited: true,
  market_dashboard_visuals_prohibited: true,
  ranking_visuals_prohibited: true,
  recommendation_visuals_prohibited: true,
  evidence_first_class: true,
  known_unknowns_first_class: true,
  multi_organization_context_required: true,
  mobile_material_fields_required: true,
  approval_state: 'approved_against_pr17_pr21_contracts',
  gate_d_passes_when_all_mocks_validate: true,
  route_changes_allowed: false,
  production_implementation_allowed: false
});
