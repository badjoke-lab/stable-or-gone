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
    items: Object.freeze([
      Object.freeze({ label: 'Stablecoins', href: '/stablecoins/' }),
      Object.freeze({ label: 'Organizations', href: '/issuers/' }),
      Object.freeze({ label: 'Events', href: '/events/' })
    ])
  }),
  Object.freeze({
    id: 'learn',
    label: 'Learn',
    items: Object.freeze([
      Object.freeze({ label: 'Guides', href: '/guides/' }),
      Object.freeze({ label: 'Glossary', href: '/glossary/' }),
      Object.freeze({ label: 'Models', href: '/models/' })
    ])
  }),
  Object.freeze({
    id: 'project',
    label: 'Project',
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

export const siteArchitectureRoutes = Object.freeze([
  Object.freeze({ pattern: '/', source_file: 'src/pages/index.astro', output_kind: 'html', group: 'entry', role: 'registry_home', decision: 'keep', navigation: 'brand' }),
  Object.freeze({ pattern: '/about/', source_file: 'src/pages/about/index.astro', output_kind: 'html', group: 'project', role: 'project_about', decision: 'keep', navigation: 'project' }),
  Object.freeze({ pattern: '/ai.txt', source_file: 'src/pages/ai.txt.ts', output_kind: 'text', group: 'data_access', role: 'ai_entrypoint', decision: 'keep', navigation: 'footer_data' }),
  Object.freeze({ pattern: '/contact/', source_file: 'src/pages/contact/index.astro', output_kind: 'html', group: 'project', role: 'corrections_and_submissions', decision: 'keep', navigation: 'utility' }),
  Object.freeze({ pattern: '/data/manifest.json', source_file: 'src/pages/data/manifest.json.ts', output_kind: 'json', group: 'data_access', role: 'public_data_manifest', decision: 'keep', navigation: 'footer_data' }),
  Object.freeze({ pattern: '/event/{id}/', source_file: 'src/pages/event/[id].astro', output_kind: 'html', group: 'registry', role: 'event_record', decision: 'keep', navigation: 'contextual' }),
  Object.freeze({ pattern: '/events/', source_file: 'src/pages/events/index.astro', output_kind: 'html', group: 'registry', role: 'event_index', decision: 'keep', navigation: 'registry' }),
  Object.freeze({ pattern: '/glossary/', source_file: 'src/pages/glossary/index.astro', output_kind: 'html', group: 'learn', role: 'glossary', decision: 'keep', navigation: 'learn' }),
  Object.freeze({ pattern: '/guides/', source_file: 'src/pages/guides/index.astro', output_kind: 'html', group: 'learn', role: 'guide_index', decision: 'keep', navigation: 'learn' }),
  Object.freeze({ pattern: '/guides/genius-act-stablecoins/', source_file: 'src/pages/guides/genius-act-stablecoins/index.astro', output_kind: 'html', group: 'learn', role: 'guide_article', decision: 'keep', navigation: 'contextual' }),
  Object.freeze({ pattern: '/guides/jpyc-vs-jpysc/', source_file: 'src/pages/guides/jpyc-vs-jpysc/index.astro', output_kind: 'html', group: 'learn', role: 'guide_article', decision: 'keep', navigation: 'contextual' }),
  Object.freeze({ pattern: '/guides/mica-stablecoins/', source_file: 'src/pages/guides/mica-stablecoins/index.astro', output_kind: 'html', group: 'learn', role: 'guide_article', decision: 'keep', navigation: 'contextual' }),
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
  Object.freeze({ pattern: '/support/', source_file: 'src/pages/support/index.astro', output_kind: 'html', group: 'project', role: 'project_support', decision: 'keep', navigation: 'utility' }),
  Object.freeze({ pattern: '/updates/', source_file: 'src/pages/updates/index.astro', output_kind: 'html', group: 'project', role: 'registry_updates', decision: 'keep', navigation: 'project' }),
  Object.freeze({ pattern: '/version.json', source_file: 'src/pages/version.json.ts', output_kind: 'json', group: 'data_access', role: 'build_and_data_version', decision: 'keep', navigation: 'footer_data' })
]);

export const routeMigrationPolicy = Object.freeze({
  current_pr_changes_routes: false,
  all_current_routes_preserved: true,
  redirects_introduced: Object.freeze([]),
  removals_introduced: Object.freeze([]),
  compatibility_changes_require_dedicated_migration: true
});
