import fs from 'node:fs';
import path from 'node:path';
import {
  architectureGroups,
  compatibilityRoutePolicy,
  globalNavigationGroups,
  recordContentOwnership,
  routeMigrationPolicy,
  siteArchitectureRoutes,
  utilityNavigation
} from '../config/site-architecture.mjs';

const root = process.cwd();
const auditPath = path.join(root, 'data/generated/site-architecture-audit.json');
const validationPath = path.join(root, 'data/generated/site-architecture-validation.json');
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };
const unique = (values) => [...new Set(values)];

assert(fs.existsSync(auditPath), 'site architecture audit is missing');
if (!fs.existsSync(auditPath)) {
  console.error(failures.join('\n'));
  process.exit(1);
}

const audit = JSON.parse(fs.readFileSync(auditPath, 'utf8'));
const actualRoutes = audit.routes ?? [];
const configuredRoutes = [...siteArchitectureRoutes];
const actualByPattern = new Map(actualRoutes.map((route) => [route.route, route]));
const configuredByPattern = new Map(configuredRoutes.map((route) => [route.pattern, route]));

assert(audit.schema_version === '1.0', 'site architecture audit schema version must be 1.0');
assert(audit.totals?.route_patterns === 27, `expected 27 route patterns, found ${audit.totals?.route_patterns}`);
assert(audit.totals?.html_route_patterns === 22, `expected 22 HTML route patterns, found ${audit.totals?.html_route_patterns}`);
assert(audit.totals?.machine_readable_route_patterns === 5, `expected 5 non-HTML route patterns, found ${audit.totals?.machine_readable_route_patterns}`);
assert(audit.totals?.dynamic_route_families === 3, `expected 3 dynamic route families, found ${audit.totals?.dynamic_route_families}`);
assert(audit.totals?.duplicate_routes === 0, 'route inventory must not contain duplicate patterns');
assert(audit.totals?.navigation_without_route === 0, 'current navigation must not point to missing routes');
assert(audit.totals?.declared_without_source === 0, 'declared main routes must have source routes');
assert(configuredRoutes.length === actualRoutes.length, `configured route count ${configuredRoutes.length} does not match actual route count ${actualRoutes.length}`);
assert(configuredByPattern.size === configuredRoutes.length, 'configured route patterns must be unique');

for (const actual of actualRoutes) {
  const configured = configuredByPattern.get(actual.route);
  assert(Boolean(configured), `route is missing from architecture map: ${actual.route}`);
  if (!configured) continue;
  assert(configured.source_file === actual.source_file, `${actual.route}: source file mismatch`);
  assert(configured.output_kind === actual.output_kind, `${actual.route}: output kind mismatch`);
  assert(architectureGroups.includes(configured.group), `${actual.route}: invalid architecture group ${configured.group}`);
  assert(configured.decision === 'keep', `${actual.route}: PR 17 must preserve the current route`);
  assert(typeof configured.role === 'string' && configured.role.length > 0, `${actual.route}: role is missing`);
  assert(typeof configured.navigation === 'string' && configured.navigation.length > 0, `${actual.route}: navigation treatment is missing`);
}

for (const configured of configuredRoutes) {
  assert(actualByPattern.has(configured.pattern), `architecture map contains a route without a current source: ${configured.pattern}`);
}

assert(globalNavigationGroups.length === 3, 'target global navigation must contain Registry, Learn, and Project groups');
assert(JSON.stringify(globalNavigationGroups.map((group) => group.id)) === JSON.stringify(['registry', 'learn', 'project']), 'global navigation group order must be Registry, Learn, Project');
for (const group of globalNavigationGroups) {
  assert(typeof group.purpose === 'string' && group.purpose.length > 0, `${group.id}: navigation purpose is missing`);
  assert(group.items.length === 3, `${group.id}: target navigation group must contain three items`);
  for (const item of group.items) {
    const route = configuredByPattern.get(item.href);
    assert(Boolean(route), `${group.id}: navigation item points to an unknown route ${item.href}`);
    assert(route?.group === group.id, `${group.id}: navigation item ${item.href} is assigned to ${route?.group}`);
    assert(route?.navigation === group.id, `${group.id}: route ${item.href} is not marked for group navigation`);
  }
}

assert(utilityNavigation.length === 2, 'target utility navigation must contain corrections and support');
assert(JSON.stringify(utilityNavigation.map((item) => item.id)) === JSON.stringify(['corrections', 'support']), 'utility order must be corrections then support');
for (const item of utilityNavigation) {
  const route = configuredByPattern.get(item.href);
  assert(Boolean(route), `utility navigation points to an unknown route ${item.href}`);
  assert(route?.navigation === 'utility', `${item.href}: utility route is not marked as utility navigation`);
}

assert(recordContentOwnership.length === 7, 'record content ownership must define seven canonical owners');
const ownerRoles = new Set();
for (const owner of recordContentOwnership) {
  assert(!ownerRoles.has(owner.owner_role), `duplicate content owner role: ${owner.owner_role}`);
  ownerRoles.add(owner.owner_role);
  const route = configuredByPattern.get(owner.route);
  assert(Boolean(route), `${owner.owner_role}: content owner route is missing: ${owner.route}`);
  assert(route?.role === owner.owner_role, `${owner.owner_role}: route role mismatch for ${owner.route}`);
  assert(Array.isArray(owner.responsibilities) && owner.responsibilities.length > 0, `${owner.owner_role}: responsibilities are missing`);
  assert(new Set(owner.responsibilities).size === owner.responsibilities.length, `${owner.owner_role}: responsibilities must be unique`);
}
const stablecoinOwner = recordContentOwnership.find((owner) => owner.owner_role === 'stablecoin_record');
assert(stablecoinOwner?.responsibilities.includes('evidence'), 'stablecoin record ownership must include evidence');
assert(stablecoinOwner?.responsibilities.includes('known_unknowns'), 'stablecoin record ownership must include known unknowns');
assert(stablecoinOwner?.responsibilities.includes('organization_relationships'), 'stablecoin record ownership must include organization relationships');
assert(stablecoinOwner?.responsibilities.includes('deployments'), 'stablecoin record ownership must include deployments');

assert(compatibilityRoutePolicy.organization_public_term === 'Organizations', 'public organization term must remain Organizations');
assert(compatibilityRoutePolicy.preserved_index_path === '/issuers/', 'organization index compatibility path must remain /issuers/');
assert(compatibilityRoutePolicy.preserved_detail_path === '/issuer/{slug}/', 'organization detail compatibility path must remain /issuer/{slug}/');
assert(compatibilityRoutePolicy.path_names_are_not_record_fields === true, 'compatibility paths must not be exposed as record fields');
assert(compatibilityRoutePolicy.compatibility_labels_in_record_content === false, 'compatibility labels must not appear in record content');
assert(compatibilityRoutePolicy.future_path_change_requires_dedicated_migration === true, 'future organization path changes must require a dedicated migration');
const organizationPage = fs.readFileSync(path.join(root, 'src/pages/issuer/[slug].astro'), 'utf8');
assert(!organizationPage.includes('Compatibility URL'), 'organization record still exposes a compatibility implementation label');

assert(routeMigrationPolicy.current_pr_changes_routes === false, 'PR 17 must not change routes');
assert(routeMigrationPolicy.current_pr_changes_navigation_markup === false, 'PR 17 must not implement grouped navigation markup');
assert(routeMigrationPolicy.all_current_routes_preserved === true, 'PR 17 must preserve every current route');
assert(routeMigrationPolicy.redirects_introduced.length === 0, 'PR 17 must not introduce redirects');
assert(routeMigrationPolicy.removals_introduced.length === 0, 'PR 17 must not remove routes');
assert(routeMigrationPolicy.compatibility_changes_require_dedicated_migration === true, 'compatibility changes must require a dedicated migration');
assert(routeMigrationPolicy.grouped_navigation_implementation_deferred_to_pr === 23, 'grouped navigation implementation must remain deferred to PR 23');

const targetGroupItems = globalNavigationGroups.flatMap((group) => group.items.map((item) => ({ ...item, group: group.id })));
const targetUtilityItems = utilityNavigation.map((item) => ({ ...item, group: 'utility' }));
const currentNavigation = audit.primary_navigation ?? [];
const currentHrefs = new Set(currentNavigation.map((item) => item.href));
const targetHrefs = new Set([...targetGroupItems, ...targetUtilityItems].map((item) => item.href));
const navigationTransition = {
  current_flat_items: currentNavigation,
  target_groups: globalNavigationGroups,
  target_utilities: utilityNavigation,
  added_to_grouped_navigation: [...targetHrefs].filter((href) => !currentHrefs.has(href)).sort(),
  retained_in_target_navigation: [...targetHrefs].filter((href) => currentHrefs.has(href)).sort(),
  removed_from_navigation: [...currentHrefs].filter((href) => !targetHrefs.has(href)).sort(),
  moved_from_flat_nav_to_utility: utilityNavigation.map((item) => item.href).filter((href) => currentHrefs.has(href)),
  implementation_deferred_to_pr: routeMigrationPolicy.grouped_navigation_implementation_deferred_to_pr
};

assert(navigationTransition.removed_from_navigation.length === 0, 'approved target navigation must not orphan a current navigation destination');
assert(JSON.stringify(navigationTransition.added_to_grouped_navigation) === JSON.stringify(['/about/', '/models/']), 'target grouped navigation additions must be About and Models');

const roleCounts = Object.fromEntries(architectureGroups.map((group) => [group, configuredRoutes.filter((route) => route.group === group).length]));
const decisionCounts = Object.fromEntries(unique(configuredRoutes.map((route) => route.decision)).sort().map((decision) => [decision, configuredRoutes.filter((route) => route.decision === decision).length]));
const validation = {
  schema_version: '1.0',
  generated_at: new Date().toISOString(),
  ok: failures.length === 0,
  totals: {
    configured_routes: configuredRoutes.length,
    current_routes_preserved: configuredRoutes.filter((route) => route.decision === 'keep').length,
    navigation_groups: globalNavigationGroups.length,
    grouped_navigation_items: targetGroupItems.length,
    utility_navigation_items: targetUtilityItems.length,
    content_owners: recordContentOwnership.length,
    route_changes: routeMigrationPolicy.current_pr_changes_routes ? 1 : 0,
    navigation_markup_changes: routeMigrationPolicy.current_pr_changes_navigation_markup ? 1 : 0,
    failures: failures.length
  },
  role_counts: roleCounts,
  decision_counts: decisionCounts,
  content_ownership: recordContentOwnership,
  compatibility_route_policy: compatibilityRoutePolicy,
  navigation_transition: navigationTransition,
  failures
};

fs.writeFileSync(validationPath, `${JSON.stringify(validation, null, 2)}\n`);
if (failures.length > 0) {
  console.error(JSON.stringify(validation, null, 2));
  process.exit(1);
}
console.log(JSON.stringify(validation, null, 2));
