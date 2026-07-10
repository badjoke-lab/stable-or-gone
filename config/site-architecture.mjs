export const architectureGroups = Object.freeze([
  'entry',
  'registry',
  'learn',
  'project',
  'data_access',
  'discovery'
]);

export const globalNavigationGroups = Object.freeze([
  Object.freeze({
    id: 'registry',
    label: 'Registry',
    purpose: 'Browse canonical stablecoin, comparison, access/regulation, organization, event, and derived statistics records.',
    items: Object.freeze([
      Object.freeze({ label: 'Stablecoins', href: '/stablecoins/' }),
      Object.freeze({ label: 'Compare', href: '/compare/' }),
      Object.freeze({ label: 'Access & Regulation', href: '/access-regulation/' }),
      Object.freeze({ label: 'Organizations', href: '/issuers/' }),
      Object.freeze({ label: 'Events', href: '/events/' }),
      Object.freeze({ label: 'Stats', href: '/stats/' })
    ])
  }),
  Object.freeze({
    id: 'learn',
    label: 'Learn',
    purpose: 'Understand terms, models, regulation, and historical context.',
    items: Object.freeze([
      Object.freeze({ label: 'Guides', href: '/guides/' }),
      Object.freeze({ label: 'Glossary', href: '/glossary/' }),
      Object.freeze({ label: 'Models', href: '/models/' })
    ])
  }),
  Object.freeze({
    id: 'project',
    label: 'Project',
    purpose: 'Review methodology, changes, scope, and project identity.',
    items: Object.freeze([
      Object.freeze({ label: 'Methodology', href: '/methodology/' }),
      Object.freeze({ label: 'Updates', href: '/updates/' }),
      Object.freeze({ label: 'About', href: '/about/' })
    ])
  })
]);

export const utilityNavigation = Object.freeze([
  Object.freeze({ id: 'corrections', label: 'Corrections', href: '/contact/', prominence: 'primary_utility' }),
  Object.freeze({ id: 'support', label: 'Support', href: '/support/', prominence: 'secondary_utility' })
]);

export const primaryNavigation = Object.freeze([
  Object.freeze({ id: 'register', label: 'Register', href: '/stablecoins/' }),
  Object.freeze({ id: 'compare', label: 'Compare', href: '/compare/' }),
  Object.freeze({ id: 'events', label: 'Events', href: '/events/' }),
  Object.freeze({ id: 'organizations', label: 'Organizations', href: '/issuers/' }),
  Object.freeze({ id: 'stats', label: 'Stats', href: '/stats/' }),
  Object.freeze({ id: 'guides', label: 'Guides', href: '/guides/' })
]);

export const aboutNavigation = Object.freeze([
  Object.freeze({ id: 'about', label: 'About', href: '/about/' }),
  Object.freeze({ id: 'methodology', label: 'Methodology', href: '/methodology/' }),
  Object.freeze({ id: 'glossary', label: 'Glossary', href: '/glossary/' }),
  Object.freeze({ id: 'models', label: 'Models', href: '/models/' }),
  Object.freeze({ id: 'updates', label: 'Updates', href: '/updates/' }),
  Object.freeze({ id: 'corrections', label: 'Corrections', href: '/contact/' }),
  Object.freeze({ id: 'support', label: 'Support', href: '/support/' })
]);

export const footerNavigationGroups = Object.freeze([
  Object.freeze({
    id: 'registry',
    label: 'Registry',
    items: Object.freeze([
      Object.freeze({ label: 'Stablecoins', href: '/stablecoins/' }),
      Object.freeze({ label: 'Compare', href: '/compare/' }),
      Object.freeze({ label: 'Access & Regulation', href: '/access-regulation/' }),
      Object.freeze({ label: 'Organizations', href: '/issuers/' }),
      Object.freeze({ label: 'Events', href: '/events/' }),
      Object.freeze({ label: 'Stats', href: '/stats/' }),
      Object.freeze({ label: 'Guides', href: '/guides/' })
    ])
  }),
  Object.freeze({
    id: 'reference',
    label: 'Reference',
    items: Object.freeze([
      Object.freeze({ label: 'Glossary', href: '/glossary/' }),
      Object.freeze({ label: 'Models', href: '/models/' }),
      Object.freeze({ label: 'Methodology', href: '/methodology/' }),
      Object.freeze({ label: 'Updates', href: '/updates/' })
    ])
  }),
  Object.freeze({
    id: 'project',
    label: 'Project',
    items: Object.freeze([
      Object.freeze({ label: 'About', href: '/about/' }),
      Object.freeze({ label: 'Corrections', href: '/contact/' }),
      Object.freeze({ label: 'Support', href: '/support/' }),
      Object.freeze({ label: 'GitHub Issues', href: 'https://github.com/badjoke-lab/stable-or-gone/issues' })
    ])
  })
]);

export const siteArchitectureRoutes = Object.freeze([
  Object.freeze({ pattern: '/', source_file: 'src/pages/index.astro', output_kind: 'html', group: 'entry', role: 'registry_home', decision: 'keep', navigation: 'brand' }),
  Object.freeze({ pattern: '/about/', source_file: 'src/pages/about/index.astro', output_kind: 'html', group: 'project', role: 'project_about', decision: 'keep', navigation: 'project' }),
  Object.freeze({ pattern: '/access-regulation/', source_file: 'src/pages/access-regulation/index.astro', output_kind: 'html', group: 'registry', role: 'access_regulation_explorer', decision: 'add', navigation: 'registry' }),
  Object.freeze({ pattern: '/ai.txt', source_file: 'src/pages/ai.txt.ts', output_kind: 'text', group: 'data_access', role: 'ai_entrypoint', decision: 'keep', navigation: 'footer_data' }),
  Object.freeze({ pattern: '/compare/', source_file: 'src/pages/compare/index.astro', output_kind: 'html', group: 'registry', role: 'comparison_explorer', decision: 'add', navigation: 'registry' }),
  Object.freeze({ pattern: '/contact/', source_file: 'src/pages/contact/index.astro', output_kind: 'html', group: 'project', role: 'corrections_and_submissions', decision: 'keep', navigation: 'utility' }),
  Object.freeze({ pattern: '/data/access-regulation-index.json', source_file: 'src/pages/data/access-regulation-index.json.ts', output_kind: 'json', group: 'data_access', role: 'access_regulation_index', decision: 'add', navigation: 'data_manifest' }),
  Object.freeze({ pattern: '/data/comparison.json', source_file: 'src/pages/data/comparison.json.ts', output_kind: 'json', group: 'data_access', role: 'deterministic_comparison_projection', decision: 'add', navigation: 'data_manifest' }),
  Object.freeze({ pattern: '/data/manifest.json', source_file: 'src/pages/data/manifest.json.ts', output_kind: 'json', group: 'data_access', role: 'public_data_manifest', decision: 'keep', navigation: 'footer_data' }),
  Object.freeze({ pattern: '/data/stats-history.json', source_file: 'src/pages/data/stats-history.json.ts', output_kind: 'json', group: 'data_access', role: 'statistics_checkpoint_history', decision: 'add', navigation: 'stats' }),
  Object.freeze({ pattern: '/data/stats.json', source_file: 'src/pages/data/stats.json.ts', output_kind: 'json', group: 'data_access', role: 'current_registry_statistics', decision: 'add', navigation: 'stats' }),
  Object.freeze({ pattern: '/event/{id}/', source_file: 'src/pages/event/[id].astro', output_kind: 'html', group: 'registry', role: 'event_record', decision: 'keep', navigation: 'contextual' }),
  Object.freeze({ pattern: '/events/', source_file: 'src/pages/events/index.astro', output_kind: 'html', group: 'registry', role: 'event_index', decision: 'keep', navigation: 'registry' }),
  Object.freeze({ pattern: '/glossary/', source_file: 'src/pages/glossary/index.astro', output_kind: 'html', group: 'learn', role: 'glossary', decision: 'keep', navigation: 'learn' }),
  Object.freeze({ pattern: '/guides/', source_file: 'src/pages/guides/index.astro', output_kind: 'html', group: 'learn', role: 'guide_index', decision: 'keep', navigation: 'learn' }),
  Object.freeze({ pattern: '/guides/japan-stablecoin-access-usdc-rlusd-jpysc/', source_file: 'src/pages/guides/japan-stablecoin-access-usdc-rlusd-jpysc/index.astro', output_kind: 'html', group: 'learn', role: 'guide_article', decision: 'add', navigation: 'contextual' }),
  Object.freeze({ pattern: '/guides/eu-stablecoin-access-after-mica/', source_file: 'src/pages/guides/eu-stablecoin-access-after-mica/index.astro', output_kind: 'html', group: 'learn', role: 'guide_article', decision: 'keep', navigation: 'contextual' }),
  Object.freeze({ pattern: '/guides/genius-act-stablecoins/', source_file: 'src/pages/guides/genius-act-stablecoins/index.astro', output_kind: 'html', group: 'learn', role: 'guide_article', decision: 'keep', navigation: 'contextual' }),
  Object.freeze({ pattern: '/guides/jpyc-vs-jpysc/', source_file: 'src/pages/guides/jpyc-vs-jpysc/index.astro', output_kind: 'html', group: 'learn', role: 'guide_article', decision: 'keep', navigation: 'contextual' }),
  Object.freeze({ pattern: '/guides/mica-stablecoins/', source_file: 'src/pages/guides/mica-stablecoins/index.astro', output_kind: 'html', group: 'learn', role: 'guide_article', decision: 'keep', navigation: 'contextual' }),
  Object.freeze({ pattern: '/guides/open-usd-reserve-revenue-model/', source_file: 'src/pages/guides/open-usd-reserve-revenue-model/index.astro', output_kind: 'html', group: 'learn', role: 'guide_article', decision: 'keep', navigation: 'contextual' }),
  Object.freeze({ pattern: '/guides/uk-stablecoin-capital-rules-2026/', source_file: 'src/pages/guides/uk-stablecoin-capital-rules-2026/index.astro', output_kind: 'html', group: 'learn', role: 'guide_article', decision: 'keep', navigation: 'contextual' }),
  Object.freeze({ pattern: '/guides/reserve-disclosure-basics/', source_file: 'src/pages/guides/reserve-disclosure-basics/index.astro', output_kind: 'html', group: 'learn', role: 'guide_article', decision: 'keep', navigation: 'contextual' }),
  Object.freeze({ pattern: '/guides/stablecoin-lifecycle-terms/', source_file: 'src/pages/guides/stablecoin-lifecycle-terms/index.astro', output_kind: 'html', group: 'learn', role: 'guide_article', decision: 'keep', navigation: 'contextual' }),
  Object.freeze({ pattern: '/guides/status-vs-event/', source_file: 'src/pages/guides/status-vs-event/index.astro', output_kind: 'html', group: 'learn', role: 'guide_article', decision: 'keep', navigation: 'contextual' }),
  Object.freeze({ pattern: '/guides/what-is-a-depeg/', source_file: 'src/pages/guides/what-is-a-depeg/index.astro', output_kind: 'html', group: 'learn', role: 'guide_article', decision: 'keep', navigation: 'contextual' }),
  Object.freeze({ pattern: '/issuer/{slug}/', source_file: 'src/pages/issuer/[slug].astro', output_kind: 'html', group: 'registry', role: 'organization_record', decision: 'keep', navigation: 'contextual' }),
  Object.freeze({ pattern: '/issuers/', source_file: 'src/pages/issuers/index.astro', output_kind: 'html', group: 'registry', role: 'organization_index', decision: 'keep', navigation: 'registry' }),
  Object.freeze({ pattern: '/llms.txt', source_file: 'src/pages/llms.txt.ts', output_kind: 'text', group: 'data_access', role: 'llm_guide', decision: 'keep', navigation: 'footer_data' }),
  Object.freeze({ pattern: '/methodology/', source_file: 'src/pages/methodology/index.astro', output_kind: 'html', group: 'project', role: 'methodology', decision: 'keep', navigation: 'project' }),
  Object.freeze({ pattern: '/models/', source_file: 'src/pages/models/index.astro', output_kind: 'html', group: 'learn', role: 'model_explainer', decision: 'keep', navigation: 'learn' }),
  Object.freeze({ pattern: '/sitemap-index.xml', source_file: 'src/pages/sitemap-index.xml.ts', output_kind: 'xml', group: 'discovery', role: 'sitemap_index', decision: 'keep', navigation: 'none' }),
  Object.freeze({ pattern: '/stablecoin/{slug}/', source_file: 'src/pages/stablecoin/[slug].astro', output_kind: 'html', group: 'registry', role: 'stablecoin_record', decision: 'keep', navigation: 'contextual' }),
  Object.freeze({ pattern: '/stablecoins/', source_file: 'src/pages/stablecoins/index.astro', output_kind: 'html', group: 'registry', role: 'stablecoin_index', decision: 'keep', navigation: 'registry' }),
  Object.freeze({ pattern: '/stats/', source_file: 'src/pages/stats/index.astro', output_kind: 'html', group: 'registry', role: 'registry_statistics', decision: 'add', navigation: 'registry' }),
  Object.freeze({ pattern: '/support/', source_file: 'src/pages/support/index.astro', output_kind: 'html', group: 'project', role: 'project_support', decision: 'keep', navigation: 'utility' }),
  Object.freeze({ pattern: '/updates/', source_file: 'src/pages/updates/index.astro', output_kind: 'html', group: 'project', role: 'registry_updates', decision: 'keep', navigation: 'project' }),
  Object.freeze({ pattern: '/version.json', source_file: 'src/pages/version.json.ts', output_kind: 'json', group: 'data_access', role: 'build_and_data_version', decision: 'keep', navigation: 'footer_data' })
]);

export const recordContentOwnership = Object.freeze([
  Object.freeze({ owner_role: 'stablecoin_record', route: '/stablecoin/{slug}/', responsibilities: Object.freeze(['identity_and_current_state', 'organization_relationships', 'reserve_and_redemption', 'deployments', 'legal_and_regulatory_context', 'history', 'evidence', 'known_unknowns', 'corrections_and_further_reading']) }),
  Object.freeze({ owner_role: 'organization_record', route: '/issuer/{slug}/', responsibilities: Object.freeze(['organization_identity', 'current_and_historical_roles', 'connected_assets', 'events', 'evidence', 'corrections']) }),
  Object.freeze({ owner_role: 'event_record', route: '/event/{id}/', responsibilities: Object.freeze(['event_identity', 'subjects', 'status_effect', 'recovery', 'structured_detail', 'evidence', 'corrections']) }),
  Object.freeze({ owner_role: 'registry_statistics', route: '/stats/', responsibilities: Object.freeze(['derived_registry_totals', 'lifecycle_composition', 'reviewed_checkpoint_history', 'statistics_methodology_links']) }),
  Object.freeze({ owner_role: 'comparison_explorer', route: '/compare/', responsibilities: Object.freeze(['bounded_asset_selection', 'canonical_facet_comparison', 'readiness_visibility', 'freshness_visibility', 'shareable_query_state']) }),
  Object.freeze({ owner_role: 'access_regulation_explorer', route: '/access-regulation/', responsibilities: Object.freeze(['canonical_legal_filtering', 'regulatory_note_filtering', 'market_access_record_filtering', 'readiness_visibility', 'freshness_visibility', 'shareable_filter_state', 'absence_semantics']) }),
  Object.freeze({ owner_role: 'methodology', route: '/methodology/', responsibilities: Object.freeze(['taxonomy_definitions', 'value_state_semantics', 'evidence_model', 'relationship_model', 'selection_rules']) }),
  Object.freeze({ owner_role: 'registry_updates', route: '/updates/', responsibilities: Object.freeze(['public_change_history']) }),
  Object.freeze({ owner_role: 'corrections_and_submissions', route: '/contact/', responsibilities: Object.freeze(['correction_submission', 'source_submission']) }),
  Object.freeze({ owner_role: 'public_data_manifest', route: '/data/manifest.json', responsibilities: Object.freeze(['machine_readable_inventory', 'canonical_data_safety']) })
]);

export const compatibilityRoutePolicy = Object.freeze({
  organization_public_term: 'Organizations',
  preserved_index_path: '/issuers/',
  preserved_detail_path: '/issuer/{slug}/',
  path_names_are_not_record_fields: true,
  compatibility_labels_in_record_content: false,
  future_path_change_requires_dedicated_migration: true
});

export const routeMigrationPolicy = Object.freeze({
  current_pr_changes_routes: true,
  current_pr_changes_navigation_markup: true,
  all_current_routes_preserved: true,
  redirects_introduced: Object.freeze([]),
  removals_introduced: Object.freeze([]),
  compatibility_changes_require_dedicated_migration: true,
  navigation_model: 'editorial_ledger_v3',
  navigation_implemented_in_pr: 327
});
