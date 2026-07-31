#!/usr/bin/env node
import { readdir, readFile, stat, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const DEFAULT_SITE = 'https://www.stableorgone.com';
const DEFAULT_OUTPUT = 'artifacts/screenshots/routes.json';
const MAINTAINED_ROUTE_LIST = 'config/public-routes.json';
const EXCLUDED_EXTENSIONS = new Set(['.xml', '.json', '.txt', '.css', '.js', '.mjs', '.svg', '.png', '.jpg', '.jpeg', '.webp', '.gif', '.ico', '.pdf', '.map', '.woff', '.woff2', '.ttf']);

function argValue(name, fallback) {
  const flag = `--${name}`;
  const index = process.argv.indexOf(flag);
  return index === -1 ? fallback : process.argv[index + 1];
}

function normalizeBaseUrl(value) {
  return value.replace(/\/$/, '');
}

function normalizeRoute(value) {
  const route = value.startsWith('http') ? new URL(value).pathname : value;
  if (!route.startsWith('/')) return null;
  const decoded = route.split(/[?#]/)[0];
  if (!decoded || decoded.includes('..')) return null;
  const extension = path.extname(decoded).toLowerCase();
  if (extension && EXCLUDED_EXTENSIONS.has(extension)) return null;
  if (decoded.includes('/_astro/') || decoded.includes('/assets/') || decoded.includes('/brand/') || decoded.includes('/og/')) return null;
  return decoded.endsWith('/') ? decoded : `${decoded}/`;
}

function isPublicHtmlRoute(route) {
  return Boolean(normalizeRoute(route));
}

function uniqueSorted(routes) {
  return [...new Set(routes.map(normalizeRoute).filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

function extractLocs(xml) {
  return [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/gi)].map((match) => match[1].trim());
}

async function fetchText(url) {
  const response = await fetch(url, { redirect: 'follow' });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return response.text();
}

async function collectFromSitemap(baseUrl) {
  const attempts = [`${baseUrl}/sitemap-index.xml`, `${baseUrl}/sitemap.xml`];
  const errors = [];
  for (const sitemapUrl of attempts) {
    try {
      const xml = await fetchText(sitemapUrl);
      const locs = extractLocs(xml);
      const sitemapLocs = locs.filter((loc) => loc.endsWith('.xml'));
      const pageLocs = locs.filter((loc) => !loc.endsWith('.xml'));
      for (const nested of sitemapLocs) {
        try {
          pageLocs.push(...extractLocs(await fetchText(nested)));
        } catch (error) {
          errors.push(`${nested}: ${error.message}`);
        }
      }
      const routes = uniqueSorted(pageLocs.filter(isPublicHtmlRoute));
      if (routes.length > 0) return { source: sitemapUrl, routes, errors };
    } catch (error) {
      errors.push(`${sitemapUrl}: ${error.message}`);
    }
  }
  return { source: null, routes: [], errors };
}

async function walkHtmlRoutes(dir, prefix = '/') {
  const entries = await readdir(dir, { withFileTypes: true });
  const routes = [];
  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      routes.push(...await walkHtmlRoutes(absolute, `${prefix}${entry.name}/`));
    } else if (entry.isFile() && entry.name === 'index.html') {
      routes.push(prefix);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      routes.push(`${prefix}${entry.name.replace(/\.html$/, '')}/`);
    }
  }
  return routes;
}

async function collectFromBuildOutput(distDir) {
  try {
    const info = await stat(distDir);
    if (!info.isDirectory()) return { source: null, routes: [] };
    const routes = uniqueSorted(await walkHtmlRoutes(distDir));
    return { source: distDir, routes };
  } catch {
    return { source: null, routes: [] };
  }
}

async function readJsonArray(file) {
  try {
    const value = JSON.parse(await readFile(file, 'utf8'));
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

async function collectJsonValues(prefix, field) {
  const dataDir = path.resolve(ROOT, 'data');
  const entries = await readdir(dataDir);
  const values = [];
  for (const entry of entries) {
    if (!entry.startsWith(prefix) || !entry.endsWith('.json') || entry.includes('candidate')) continue;
    const rows = await readJsonArray(path.join(dataDir, entry));
    for (const row of rows) {
      if (row && typeof row === 'object' && row[field]) values.push(String(row[field]));
    }
  }
  return [...new Set(values)];
}

async function collectGuideRoutes() {
  const guidesDir = path.resolve(ROOT, 'src/pages/guides');
  const entries = await readdir(guidesDir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => `/guides/${entry.name}/`);
}

async function collectFromSourceRoutes() {
  try {
    const staticRoutes = [
      '/',
      '/stablecoins/',
      '/issuers/',
      '/events/',
      '/models/',
      '/guides/',
      ...await collectGuideRoutes(),
      '/glossary/',
      '/methodology/',
      '/updates/',
      '/about/',
      '/support/',
      '/contact/'
    ];
    const [stablecoinSlugs, organizationSlugs, eventIds] = await Promise.all([
      collectJsonValues('stablecoins', 'slug'),
      collectJsonValues('organizations', 'slug'),
      collectJsonValues('events', 'id')
    ]);
    const dynamicRoutes = [
      ...stablecoinSlugs.map((slug) => `/stablecoin/${slug}/`),
      ...organizationSlugs.map((slug) => `/issuer/${slug}/`),
      ...eventIds.map((id) => `/event/${id}/`)
    ];
    return { source: 'src/pages plus canonical data JSON route discovery', routes: uniqueSorted([...staticRoutes, ...dynamicRoutes]) };
  } catch (error) {
    return { source: null, routes: [], error: error.message };
  }
}

async function collectFromMaintainedList(file) {
  const json = JSON.parse(await readFile(file, 'utf8'));
  const routes = Array.isArray(json) ? json : json.routes;
  if (!Array.isArray(routes)) throw new Error(`${file} must contain an array or { "routes": [] }`);
  return { source: file, routes: uniqueSorted(routes) };
}

const baseUrl = normalizeBaseUrl(argValue('base-url', process.env.SOG_SCREENSHOT_BASE_URL ?? DEFAULT_SITE));
const output = argValue('output', DEFAULT_OUTPUT);
const distDir = argValue('dist', 'dist');
const maintainedRouteList = argValue('route-list', MAINTAINED_ROUTE_LIST);

const sitemap = await collectFromSitemap(baseUrl);
let source = sitemap.source;
let sourceType = 'sitemap';
let routes = sitemap.routes;
let errors = sitemap.errors;

if (routes.length === 0) {
  const build = await collectFromBuildOutput(path.resolve(ROOT, distDir));
  source = build.source;
  sourceType = 'build-output';
  routes = build.routes;
}

if (routes.length === 0) {
  const sourceRoutes = await collectFromSourceRoutes();
  source = sourceRoutes.source;
  sourceType = 'source-route-discovery';
  routes = sourceRoutes.routes;
  if (sourceRoutes.error) errors.push(`source-route-discovery: ${sourceRoutes.error}`);
}

if (routes.length === 0) {
  const maintained = await collectFromMaintainedList(path.resolve(ROOT, maintainedRouteList));
  source = maintained.source;
  sourceType = 'maintained-route-list';
  routes = maintained.routes;
}

const manifest = {
  generated_at: new Date().toISOString(),
  base_url: baseUrl,
  source_type: sourceType,
  source,
  route_count: routes.length,
  errors,
  routes
};

await mkdir(path.dirname(output), { recursive: true });
await writeFile(output, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(JSON.stringify(manifest, null, 2));
