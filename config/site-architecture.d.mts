export type ArchitectureGroup = 'entry' | 'registry' | 'learn' | 'project' | 'data_access' | 'discovery';
export type RouteOutputKind = 'html' | 'json' | 'text' | 'xml';
export type RouteDecision = 'keep' | 'merge' | 'redirect' | 'replace' | 'remove';
export type NavigationTreatment = 'brand' | 'registry' | 'learn' | 'project' | 'utility' | 'contextual' | 'footer_data' | 'none';

export type NavigationItem = { label: string; href: string };
export type NavigationGroup = { id: 'registry' | 'learn' | 'project'; label: string; purpose: string; items: readonly NavigationItem[] };
export type UtilityNavigationItem = { id: 'corrections' | 'support'; label: string; href: string; prominence: string };
export type ArchitectureRoute = {
  pattern: string;
  source_file: string;
  output_kind: RouteOutputKind;
  group: ArchitectureGroup;
  role: string;
  decision: RouteDecision;
  navigation: NavigationTreatment;
};
export type ContentOwnership = { owner_role: string; route: string; responsibilities: readonly string[] };

export const architectureGroups: readonly ArchitectureGroup[];
export const globalNavigationGroups: readonly NavigationGroup[];
export const utilityNavigation: readonly UtilityNavigationItem[];
export const siteArchitectureRoutes: readonly ArchitectureRoute[];
export const recordContentOwnership: readonly ContentOwnership[];
export const compatibilityRoutePolicy: Readonly<{
  organization_public_term: string;
  preserved_index_path: string;
  preserved_detail_path: string;
  path_names_are_not_record_fields: boolean;
  compatibility_labels_in_record_content: boolean;
  future_path_change_requires_dedicated_migration: boolean;
}>;
export const routeMigrationPolicy: Readonly<{
  current_pr_changes_routes: boolean;
  current_pr_changes_navigation_markup: boolean;
  all_current_routes_preserved: boolean;
  redirects_introduced: readonly string[];
  removals_introduced: readonly string[];
  compatibility_changes_require_dedicated_migration: boolean;
  grouped_navigation_implementation_deferred_to_pr: number;
}>;
