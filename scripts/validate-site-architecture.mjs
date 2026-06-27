import fs from 'node:fs';
import path from 'node:path';
import { globalNavigationGroups, siteArchitectureRoutes, utilityNavigation } from '../config/site-architecture.mjs';

const root = process.cwd();
const auditPath = path.join(root, 'data/generated/site-architecture-audit.json');
const outputPath = path.join(root, 'data/generated/site-architecture-validation.json');
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

check(fs.existsSync(auditPath), 'site architecture audit is missing');
if (!fs.existsSync(auditPath)) process.exit(1);
const audit = JSON.parse(fs.readFileSync(auditPath, 'utf8'));
const routeMap = new Map(siteArchitectureRoutes.map((route) => [route.pattern, route]));

check(audit.schema_version === '1.0', 'architecture schema changed');
check(audit.totals?.route_patterns === 27, 'route count changed');
check(audit.totals?.page_source_files === 27, 'page source count changed');
check(audit.totals?.html_route_patterns === 22, 'HTML route count changed');
check(audit.totals?.machine_readable_route_patterns === 5, 'machine route count changed');
check(audit.totals?.dynamic_route_families === 3, 'dynamic route count changed');
for (const key of ['duplicate_routes', 'navigation_without_route', 'declared_without_source', 'configured_without_source', 'source_without_configuration', 'unassigned_routes']) check(audit.totals?.[key] === 0, `inventory failure: ${key}`);

check(globalNavigationGroups.length === 3, 'navigation group count changed');
check(JSON.stringify(globalNavigationGroups.map((group) => group.id)) === JSON.stringify(['registry', 'learn', 'project']), 'navigation group order changed');
const grouped = globalNavigationGroups.flatMap((group) => group.items.map((item) => ({ href: item.href, label: item.label, group: group.id })));
check(grouped.length === 9, 'grouped navigation item count changed');
check(utilityNavigation.length === 2, 'utility item count changed');
const utilities = utilityNavigation.map((item) => ({ href: item.href, label: item.label, group: 'utility' }));
const expected = [...grouped, ...utilities];
const current = (audit.primary_navigation ?? []).map((item) => ({ href: item.href, label: item.label, group: item.group }));
check(audit.totals?.primary_navigation_items === 11, 'implemented navigation must contain 11 destinations');
check(JSON.stringify(current) === JSON.stringify(expected), 'implemented navigation differs from the architecture contract');

for (const item of grouped) {
  const route = routeMap.get(item.href);
  check(Boolean(route), `navigation route is missing: ${item.href}`);
  check(route?.group === item.group && route?.navigation === item.group, `navigation assignment mismatch: ${item.href}`);
}
for (const item of utilities) check(routeMap.get(item.href)?.navigation === 'utility', `utility assignment mismatch: ${item.href}`);
for (const route of siteArchitectureRoutes) {
  const actual = (audit.routes ?? []).find((item) => item.route === route.pattern);
  check(Boolean(actual), `route is missing: ${route.pattern}`);
  check(actual?.source_file === route.source_file, `source mismatch: ${route.pattern}`);
  check(actual?.output_kind === route.output_kind, `output mismatch: ${route.pattern}`);
  check(route.decision === 'keep', `route decision changed: ${route.pattern}`);
}

const validation = {
  schema_version: '1.0',
  generated_at: new Date().toISOString(),
  ok: failures.length === 0,
  totals: {
    configured_routes: siteArchitectureRoutes.length,
    current_routes_preserved: siteArchitectureRoutes.filter((route) => route.decision === 'keep').length,
    navigation_groups: globalNavigationGroups.length,
    grouped_navigation_items: grouped.length,
    utility_navigation_items: utilities.length,
    implemented_navigation_items: current.length,
    route_changes: 0,
    failures: failures.length
  },
  implemented_navigation: current,
  failures
};
fs.writeFileSync(outputPath, `${JSON.stringify(validation, null, 2)}\n`);
if (failures.length) { console.error(JSON.stringify(validation, null, 2)); process.exit(1); }
console.log(JSON.stringify(validation, null, 2));
