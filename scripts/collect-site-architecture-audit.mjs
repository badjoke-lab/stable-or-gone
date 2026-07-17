import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { globalNavigationGroups, siteArchitectureRoutes, utilityNavigation } from '../config/site-architecture.mjs';

const root = process.cwd();
const outputPath = path.join(root, 'data/generated/site-architecture-audit.json');
const pageExtensions = ['.astro', '.md', '.mdx', '.js', '.ts'];

function walk(directory) {
  if (!fs.existsSync(directory)) return [];
  const output = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) output.push(...walk(absolute));
    else output.push(absolute);
  }
  return output;
}

const actualPageSources = walk(path.join(root, 'src/pages'))
  .filter((file) => pageExtensions.some((extension) => file.endsWith(extension)))
  .map((file) => path.relative(root, file).replaceAll(path.sep, '/'))
  .sort();
const configuredSources = siteArchitectureRoutes.map((route) => route.source_file).sort();
const familyManagedPageSources = actualPageSources
  .filter((source) => /^src\/pages\/updates\/[^/]+\/index\.astro$/.test(source))
  .sort();
const routes = siteArchitectureRoutes.map((route) => ({
  route: route.pattern,
  source_file: route.source_file,
  output_kind: route.output_kind,
  dynamic: route.pattern.includes('{'),
  role_hint: route.group === 'entry' ? 'registry_entry' : route.group
})).sort((left, right) => left.route.localeCompare(right.route));
const navigation = [
  ...globalNavigationGroups.flatMap((group) => group.items.map((item) => ({ href: item.href, label: item.label, group: group.id, source_file: 'config/site-architecture.mjs' }))),
  ...utilityNavigation.map((item) => ({ href: item.href, label: item.label, group: 'utility', source_file: 'config/site-architecture.mjs' }))
];
const routeSet = new Set(routes.map((route) => route.route));
const duplicateRoutes = [...new Set(routes.filter((route, index) => routes.findIndex((candidate) => candidate.route === route.route) !== index).map((route) => route.route))].sort();
const navigationWithoutRoute = navigation.filter((item) => !routeSet.has(item.href));
const configuredWithoutSource = configuredSources.filter((source) => !actualPageSources.includes(source));
const sourceWithoutConfiguration = actualPageSources.filter((source) => !configuredSources.includes(source) && !familyManagedPageSources.includes(source));
const machineSource = fs.readFileSync(path.join(root, 'src/lib/machine-readable.ts'), 'utf8');
const mainBlock = machineSource.match(/export const MAIN_ROUTES = \[([\s\S]*?)\] as const;/)?.[1] ?? '';
const declaredMainRoutes = [...mainBlock.matchAll(/'([^']+)'/g)].map((match) => match[1]);
const declaredWithoutSource = declaredMainRoutes.filter((declared) => !routeSet.has(declared) && !routes.some((route) => route.dynamic && declared.split('{')[0] === route.route.split('{')[0]));
const digest = createHash('sha256').update(JSON.stringify({ routes, navigation, declaredMainRoutes, actualPageSources, familyManagedPageSources })).digest('hex');

const audit = {
  schema_version: '1.0',
  generated_at: new Date().toISOString(),
  totals: {
    page_source_files: actualPageSources.length,
    route_patterns: routes.length,
    static_routes: routes.filter((route) => !route.dynamic).length,
    dynamic_route_families: routes.filter((route) => route.dynamic).length,
    html_route_patterns: routes.filter((route) => route.output_kind === 'html').length,
    machine_readable_route_patterns: routes.filter((route) => route.output_kind !== 'html').length,
    primary_navigation_items: navigation.length,
    declared_main_routes: declaredMainRoutes.length,
    family_managed_page_sources: familyManagedPageSources.length,
    duplicate_routes: duplicateRoutes.length,
    navigation_without_route: navigationWithoutRoute.length,
    declared_without_source: declaredWithoutSource.length,
    configured_without_source: configuredWithoutSource.length,
    source_without_configuration: sourceWithoutConfiguration.length,
    unassigned_routes: 0
  },
  role_hint_counts: Object.fromEntries(['registry_entry', 'registry', 'learn', 'project', 'data_access', 'discovery'].map((role) => [role, routes.filter((route) => route.role_hint === role).length])),
  routes,
  primary_navigation: navigation,
  declared_main_routes: declaredMainRoutes,
  family_managed_page_sources: familyManagedPageSources,
  duplicate_routes: duplicateRoutes,
  navigation_without_route: navigationWithoutRoute,
  declared_without_source: declaredWithoutSource,
  configured_without_source: configuredWithoutSource,
  source_without_configuration: sourceWithoutConfiguration,
  unassigned_routes: [],
  inventory_digest: `sha256:${digest}`
};
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(audit, null, 2)}\n`);
console.log(JSON.stringify(audit.totals, null, 2));
