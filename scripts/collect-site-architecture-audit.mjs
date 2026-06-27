import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';

const root = process.cwd();
const pagesRoot = path.join(root, 'src/pages');
const outputPath = path.join(root, 'data/generated/site-architecture-audit.json');
const pageExtensions = ['.astro', '.md', '.mdx', '.js', '.ts'];

function walk(directory) {
  if (!fs.existsSync(directory)) return [];
  const files = [];
  const stack = [directory];
  while (stack.length > 0) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const absolute = path.join(current, entry.name);
      if (entry.isDirectory()) stack.push(absolute);
      else files.push(absolute);
    }
  }
  return files.sort();
}

function removePageExtension(relativePath) {
  const extension = pageExtensions.find((candidate) => relativePath.endsWith(candidate));
  return extension ? relativePath.slice(0, -extension.length) : relativePath;
}

function routeSegment(segment) {
  const restMatch = segment.match(/^\[\.\.\.(.+)\]$/);
  if (restMatch) return `{${restMatch[1]}*}`;
  const dynamicMatch = segment.match(/^\[(.+)\]$/);
  if (dynamicMatch) return `{${dynamicMatch[1]}}`;
  return segment;
}

function sourceToRoute(relativePath) {
  const withoutExtension = removePageExtension(relativePath);
  const rawSegments = withoutExtension.split('/').filter(Boolean);
  const isIndex = rawSegments.at(-1) === 'index';
  const segments = (isIndex ? rawSegments.slice(0, -1) : rawSegments).map(routeSegment);
  const last = segments.at(-1) ?? '';
  const fileLike = last.includes('.') && !last.startsWith('{');
  const route = `/${segments.join('/')}${segments.length === 0 || fileLike ? '' : '/'}`;
  return route || '/';
}

function roleHint(route) {
  if (route === '/') return 'registry_entry';
  if (/^\/(stablecoins|stablecoin|issuers|issuer|events|event)(\/|$)/.test(route)) return 'registry';
  if (/^\/(guides|glossary|models)(\/|$)/.test(route)) return 'learn';
  if (/^\/(methodology|updates|contact|support)(\/|$)/.test(route)) return 'project';
  if (/^\/(version\.json|data\/|llms\.txt|ai\.txt)/.test(route)) return 'data_access';
  if (/sitemap|robots/.test(route)) return 'discovery';
  return 'unassigned';
}

function outputKind(route) {
  if (route.endsWith('.json')) return 'json';
  if (route.endsWith('.txt')) return 'text';
  if (route.endsWith('.xml')) return 'xml';
  return 'html';
}

function parseNavigation() {
  const file = 'src/layouts/BaseLayout.astro';
  const source = fs.readFileSync(path.join(root, file), 'utf8');
  const navigation = [];
  const navBlock = source.match(/<nav class="nav"[\s\S]*?<\/nav>/)?.[0] ?? '';
  for (const match of navBlock.matchAll(/<a\s+href="([^"]+)"(?:\s+[^>]*)?>([^<]+)<\/a>/g)) {
    navigation.push({ href: match[1], label: match[2].trim(), source_file: file });
  }
  return navigation;
}

function parseDeclaredMainRoutes() {
  const file = 'src/lib/machine-readable.ts';
  const source = fs.readFileSync(path.join(root, file), 'utf8');
  const block = source.match(/export const MAIN_ROUTES = \[([\s\S]*?)\] as const;/)?.[1] ?? '';
  return [...block.matchAll(/'([^']+)'/g)].map((match) => match[1]);
}

const pageFiles = walk(pagesRoot)
  .filter((absolute) => pageExtensions.some((extension) => absolute.endsWith(extension)))
  .map((absolute) => path.relative(pagesRoot, absolute).replaceAll(path.sep, '/'));

const routes = pageFiles.map((sourceFile) => {
  const route = sourceToRoute(sourceFile);
  return {
    route,
    source_file: `src/pages/${sourceFile}`,
    output_kind: outputKind(route),
    dynamic: route.includes('{'),
    role_hint: roleHint(route)
  };
}).sort((left, right) => left.route.localeCompare(right.route));

const navigation = parseNavigation();
const declaredMainRoutes = parseDeclaredMainRoutes();
const routeSet = new Set(routes.map((item) => item.route));
const duplicateRoutes = [...new Set(routes.filter((item, index) => routes.findIndex((candidate) => candidate.route === item.route) !== index).map((item) => item.route))].sort();
const navigationWithoutRoute = navigation.filter((item) => !routeSet.has(item.href) && !routes.some((route) => route.dynamic && item.href.startsWith(route.route.split('{')[0])));
const declaredWithoutSource = declaredMainRoutes.filter((declared) => !routeSet.has(declared) && !routes.some((route) => route.dynamic && declared.split('{')[0] === route.route.split('{')[0]));
const unassignedRoutes = routes.filter((item) => item.role_hint === 'unassigned');
const digest = createHash('sha256').update(JSON.stringify({ routes, navigation, declaredMainRoutes })).digest('hex');

const audit = {
  schema_version: '1.0',
  generated_at: new Date().toISOString(),
  totals: {
    page_source_files: pageFiles.length,
    route_patterns: routes.length,
    static_routes: routes.filter((item) => !item.dynamic).length,
    dynamic_route_families: routes.filter((item) => item.dynamic).length,
    html_route_patterns: routes.filter((item) => item.output_kind === 'html').length,
    machine_readable_route_patterns: routes.filter((item) => item.output_kind !== 'html').length,
    primary_navigation_items: navigation.length,
    declared_main_routes: declaredMainRoutes.length,
    duplicate_routes: duplicateRoutes.length,
    navigation_without_route: navigationWithoutRoute.length,
    declared_without_source: declaredWithoutSource.length,
    unassigned_routes: unassignedRoutes.length
  },
  role_hint_counts: Object.fromEntries(['registry_entry', 'registry', 'learn', 'project', 'data_access', 'discovery', 'unassigned'].map((role) => [role, routes.filter((item) => item.role_hint === role).length])),
  routes,
  primary_navigation: navigation,
  declared_main_routes: declaredMainRoutes,
  duplicate_routes: duplicateRoutes,
  navigation_without_route: navigationWithoutRoute,
  declared_without_source: declaredWithoutSource,
  unassigned_routes: unassignedRoutes,
  inventory_digest: `sha256:${digest}`
};

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(audit, null, 2)}\n`);
console.log(JSON.stringify(audit.totals, null, 2));
