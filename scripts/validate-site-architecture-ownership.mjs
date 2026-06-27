import fs from 'node:fs';
import path from 'node:path';
import {
  compatibilityRoutePolicy,
  globalNavigationGroups,
  recordContentOwnership,
  routeMigrationPolicy,
  siteArchitectureRoutes,
  utilityNavigation
} from '../config/site-architecture.mjs';

const root = process.cwd();
const auditPath = path.join(root, 'data/generated/site-architecture-audit.json');
const outputPath = path.join(root, 'data/generated/site-architecture-ownership-validation.json');
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };

assert(fs.existsSync(auditPath), 'site architecture audit is missing');
if (!fs.existsSync(auditPath)) {
  console.error(failures.join('\n'));
  process.exit(1);
}

const audit = JSON.parse(fs.readFileSync(auditPath, 'utf8'));
const routeByPattern = new Map(siteArchitectureRoutes.map((route) => [route.pattern, route]));
const responsibilityOwners = new Map();
const ownerRoles = new Set();

assert(audit.totals?.unassigned_routes === 0, `every current route must be classified; found ${audit.totals?.unassigned_routes}`);
assert((audit.unassigned_routes ?? []).length === 0, 'unassigned route inventory must be empty');

for (const group of globalNavigationGroups) {
  assert(typeof group.purpose === 'string' && group.purpose.length > 0, `${group.id}: navigation purpose is missing`);
}

assert(routeMigrationPolicy.current_pr_changes_routes === false, 'PR 17 must not change routes');
assert(routeMigrationPolicy.current_pr_changes_navigation_markup === false, 'PR 17 must not implement grouped navigation markup');
assert(routeMigrationPolicy.all_current_routes_preserved === true, 'all current routes must remain preserved');
assert(routeMigrationPolicy.redirects_introduced.length === 0, 'PR 17 must not introduce redirects');
assert(routeMigrationPolicy.removals_introduced.length === 0, 'PR 17 must not remove routes');
assert(routeMigrationPolicy.compatibility_changes_require_dedicated_migration === true, 'future compatibility changes require a dedicated migration');
assert(routeMigrationPolicy.grouped_navigation_implementation_deferred_to_pr === 23, 'grouped navigation implementation must remain deferred to PR 23');

assert(compatibilityRoutePolicy.organization_public_term === 'Organizations', 'public organization terminology must remain Organizations');
assert(compatibilityRoutePolicy.preserved_index_path === '/issuers/', 'organization index path must remain /issuers/');
assert(compatibilityRoutePolicy.preserved_detail_path === '/issuer/{slug}/', 'organization detail path must remain /issuer/{slug}/');
assert(compatibilityRoutePolicy.path_names_are_not_record_fields === true, 'compatibility path names must not become record fields');
assert(compatibilityRoutePolicy.compatibility_labels_in_record_content === false, 'compatibility labels must not appear in record content');
assert(compatibilityRoutePolicy.future_path_change_requires_dedicated_migration === true, 'future path changes require a dedicated migration');

const issuerSource = fs.readFileSync(path.join(root, 'src/pages/issuer/[slug].astro'), 'utf8');
assert(!issuerSource.includes('Compatibility URL'), 'organization record exposes an implementation-facing compatibility label');

for (const ownership of recordContentOwnership) {
  const route = routeByPattern.get(ownership.route);
  assert(Boolean(route), `${ownership.owner_role}: ownership route is missing`);
  assert(route?.role === ownership.owner_role, `${ownership.owner_role}: route role mismatch`);
  assert(!ownerRoles.has(ownership.owner_role), `duplicate owner role: ${ownership.owner_role}`);
  ownerRoles.add(ownership.owner_role);
  assert(ownership.responsibilities.length > 0, `${ownership.owner_role}: responsibilities are empty`);
  for (const responsibility of ownership.responsibilities) {
    const owners = responsibilityOwners.get(responsibility) ?? [];
    owners.push(ownership.owner_role);
    responsibilityOwners.set(responsibility, owners);
  }
}

for (const responsibility of ['evidence', 'known_unknowns', 'organization_relationships', 'history', 'corrections_and_further_reading']) {
  assert((responsibilityOwners.get(responsibility) ?? []).includes('stablecoin_record'), `stablecoin record must own ${responsibility}`);
}
for (const responsibility of ['current_and_historical_roles', 'connected_assets', 'evidence', 'corrections']) {
  assert((responsibilityOwners.get(responsibility) ?? []).includes('organization_record'), `organization record must own ${responsibility}`);
}
for (const responsibility of ['subjects', 'status_effect', 'recovery', 'structured_detail', 'evidence', 'corrections']) {
  assert((responsibilityOwners.get(responsibility) ?? []).includes('event_record'), `event record must own ${responsibility}`);
}
assert((responsibilityOwners.get('machine_readable_inventory') ?? []).includes('public_data_manifest'), 'data manifest must own machine-readable inventory');
assert((responsibilityOwners.get('correction_submission') ?? []).includes('corrections_and_submissions'), 'contact route must own corrections');

for (const route of siteArchitectureRoutes.filter((item) => item.group === 'data_access')) {
  assert(route.navigation === 'footer_data', `${route.pattern}: data-access route must use footer data discovery`);
}
for (const route of siteArchitectureRoutes.filter((item) => item.group === 'discovery')) {
  assert(route.navigation === 'none', `${route.pattern}: discovery route must not appear in global navigation`);
}

const currentHrefs = new Set((audit.primary_navigation ?? []).map((item) => item.href));
const targetHrefs = new Set([
  ...globalNavigationGroups.flatMap((group) => group.items.map((item) => item.href)),
  ...utilityNavigation.map((item) => item.href)
]);
const added = [...targetHrefs].filter((href) => !currentHrefs.has(href)).sort();
const removed = [...currentHrefs].filter((href) => !targetHrefs.has(href)).sort();
assert(JSON.stringify(added) === JSON.stringify(['/about/', '/models/']), 'target navigation additions must be About and Models');
assert(removed.length === 0, `target navigation would orphan current destinations: ${removed.join(', ')}`);

const validation = {
  schema_version: '1.0',
  generated_at: new Date().toISOString(),
  ok: failures.length === 0,
  totals: {
    content_ownership_records: recordContentOwnership.length,
    unassigned_routes: audit.totals?.unassigned_routes ?? null,
    target_navigation_additions: added.length,
    target_navigation_removals: removed.length,
    failures: failures.length
  },
  target_navigation_additions: added,
  target_navigation_removals: removed,
  content_ownership: recordContentOwnership,
  compatibility_route_policy: compatibilityRoutePolicy,
  route_migration_policy: routeMigrationPolicy,
  failures
};

fs.writeFileSync(outputPath, `${JSON.stringify(validation, null, 2)}\n`);
if (failures.length > 0) {
  console.error(JSON.stringify(validation, null, 2));
  process.exit(1);
}
console.log(JSON.stringify(validation, null, 2));
