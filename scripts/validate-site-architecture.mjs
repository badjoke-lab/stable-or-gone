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
check(audit.totals?.route_patterns === 38, 'route count must include Explorer, access/regulation index, Compare, comparison projection, Japan guide, and stats routes');
check(audit.totals?.page_source_files === 38, 'page source count must include Explorer and all existing routes');
check(audit.totals?.html_route_patterns === 29, 'HTML route count must include Access & Regulation Explorer');
check(audit.totals?.machine_readable_route_patterns === 9, 'machine route count must include access/regulation, comparison, and stats JSON routes');
check(audit.totals?.dynamic_route_families === 3, 'dynamic route count changed');
for (const key of ['duplicate_routes', 'navigation_without_route', 'declared_without_source', 'configured_without_source', 'source_without_configuration', 'unassigned_routes']) check(audit.totals?.[key] === 0, `inventory failure: ${key}`);

check(globalNavigationGroups.length === 3, 'navigation group count changed');
check(JSON.stringify(globalNavigationGroups.map((group) => group.id)) === JSON.stringify(['registry', 'learn', 'project']), 'navigation group order changed');
const grouped = globalNavigationGroups.flatMap((group) => group.items.map((item) => ({ href: item.href, label: item.label, group: group.id })));
check(grouped.length === 12, 'grouped navigation must include Compare, Access & Regulation, and Stats');
check(utilityNavigation.length === 2, 'utility item count changed');
const utilities = utilityNavigation.map((item) => ({ href: item.href, label: item.label, group: 'utility' }));
const expected = [...grouped, ...utilities];
const current = (audit.primary_navigation ?? []).map((item) => ({ href: item.href, label: item.label, group: item.group }));
check(audit.totals?.primary_navigation_items === 14, 'implemented architecture navigation must contain 14 destinations');
check(JSON.stringify(current) === JSON.stringify(expected), 'implemented navigation differs from the architecture contract');

for (const item of grouped) {
  const route = routeMap.get(item.href);
  check(Boolean(route), `navigation route is missing: ${item.href}`);
  check(route?.group === item.group && ['registry', 'learn', 'project'].includes(route?.navigation), `navigation assignment mismatch: ${item.href}`);
}
for (const item of utilities) check(routeMap.get(item.href)?.navigation === 'utility', `utility assignment mismatch: ${item.href}`);
for (const route of siteArchitectureRoutes) {
  const actual = (audit.routes ?? []).find((item) => item.route === route.pattern);
  check(Boolean(actual), `route is missing: ${route.pattern}`);
  check(actual?.source_file === route.source_file, `source mismatch: ${route.pattern}`);
  check(actual?.output_kind === route.output_kind, `output mismatch: ${route.pattern}`);
  check(['keep', 'add'].includes(route.decision), `unsupported route decision: ${route.pattern}`);
}

for (const pattern of ['/stats/', '/data/stats.json', '/data/stats-history.json']) {
  check(routeMap.get(pattern)?.decision === 'add', `PR #327 route must be marked add: ${pattern}`);
}
check(routeMap.get('/guides/japan-stablecoin-access-usdc-rlusd-jpysc/')?.decision === 'add', 'PR #339 Japan guide route must be marked add');
check(routeMap.get('/data/comparison.json')?.decision === 'add', 'PR #343 comparison projection route must be marked add');
check(routeMap.get('/data/comparison.json')?.role === 'deterministic_comparison_projection', 'PR #343 comparison projection role mismatch');
check(routeMap.get('/compare/')?.decision === 'add', 'PR #344 compare route must be marked add');
check(routeMap.get('/compare/')?.role === 'comparison_explorer', 'PR #344 compare route role mismatch');
check(routeMap.get('/compare/')?.navigation === 'registry', 'PR #344 compare route must be in registry navigation');
check(routeMap.get('/data/access-regulation-index.json')?.decision === 'add', 'PR #346 access/regulation index route must be marked add');
check(routeMap.get('/data/access-regulation-index.json')?.role === 'access_regulation_index', 'PR #346 access/regulation route role mismatch');
check(routeMap.get('/data/access-regulation-index.json')?.navigation === 'data_manifest', 'PR #346 access/regulation route must be discovered through data manifest');
check(routeMap.get('/access-regulation/')?.decision === 'add', 'PR #347 Explorer route must be marked add');
check(routeMap.get('/access-regulation/')?.role === 'access_regulation_explorer', 'PR #347 Explorer role mismatch');
check(routeMap.get('/access-regulation/')?.navigation === 'registry', 'PR #347 Explorer must be in Registry navigation');

const validation = {
  schema_version: '1.0',
  generated_at: new Date().toISOString(),
  ok: failures.length === 0,
  totals: {
    configured_routes: siteArchitectureRoutes.length,
    current_routes_preserved: siteArchitectureRoutes.filter((route) => route.decision === 'keep').length,
    added_routes: siteArchitectureRoutes.filter((route) => route.decision === 'add').length,
    navigation_groups: globalNavigationGroups.length,
    grouped_navigation_items: grouped.length,
    utility_navigation_items: utilities.length,
    implemented_navigation_items: current.length,
    route_changes: 8,
    failures: failures.length
  },
  implemented_navigation: current,
  failures
};
fs.writeFileSync(outputPath, `${JSON.stringify(validation, null, 2)}\n`);
if (failures.length) { console.error(JSON.stringify(validation, null, 2)); process.exit(1); }
console.log(JSON.stringify(validation, null, 2));
