#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { PUBLIC_ORIGIN } from '../config/public-origin.mjs';

const root = process.cwd();
const outputDir = path.join(root, 'artifacts', 'domain-migration-audit');
const legacyHostname = ['sog', 'badjoke-lab', 'com'].join('.');
const legacyOrigin = `https://${legacyHostname}`;
const strict = process.argv.includes('--strict');
const failures = [];
const redirectFindings = [];

function decodeXml(value) {
  return value.replaceAll('&amp;', '&').replaceAll('&lt;', '<').replaceAll('&gt;', '>');
}

async function request(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    return await fetch(url, {
      redirect: options.redirect ?? 'manual',
      signal: controller.signal,
      headers: {
        'user-agent': 'Stable-or-Gone-domain-migration-audit/1.0',
        accept: options.accept ?? 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchText(url) {
  const response = await request(url, { redirect: 'follow' });
  if (!response.ok) throw new Error(`${url} returned HTTP ${response.status}`);
  return response.text();
}

async function collectPublicRoutes() {
  const indexUrl = `${PUBLIC_ORIGIN}/sitemap-index.xml`;
  const indexXml = await fetchText(indexUrl);
  const indexLocs = [...indexXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => decodeXml(match[1]));
  const sitemapUrls = indexLocs.filter((url) => url.endsWith('.xml'));
  const directRoutes = indexLocs.filter((url) => !url.endsWith('.xml')).map((url) => new URL(url).pathname);
  const routes = new Set(directRoutes);

  for (const sitemapUrl of sitemapUrls) {
    const xml = await fetchText(sitemapUrl);
    for (const match of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      const value = decodeXml(match[1]);
      try {
        const url = new URL(value);
        if (url.origin === PUBLIC_ORIGIN) routes.add(url.pathname);
      } catch {
        // Invalid entries are covered by production sitemap checks elsewhere.
      }
    }
  }
  routes.add('/');
  return [...routes].sort();
}

function firstRoute(routes, prefix, excludeExact = null) {
  return routes.find((route) => route.startsWith(prefix) && route !== excludeExact) ?? null;
}

function representativeRoutes(routes) {
  const desired = [
    '/',
    '/stablecoins/',
    firstRoute(routes, '/stablecoin/'),
    '/issuers/',
    firstRoute(routes, '/issuer/'),
    '/events/',
    firstRoute(routes, '/event/'),
    '/guides/',
    firstRoute(routes, '/guides/', '/guides/'),
    '/updates/',
    firstRoute(routes, '/updates/', '/updates/'),
    '/methodology/',
    '/about/',
    '/support/',
    '/stats/'
  ].filter(Boolean);
  return [...new Set(desired)].filter((route) => routes.includes(route));
}

function extractMeta(html, kind) {
  if (kind === 'canonical') {
    return html.match(/<link\b[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i)?.[1]
      ?? html.match(/<link\b[^>]*href=["']([^"']+)["'][^>]*rel=["']canonical["'][^>]*>/i)?.[1]
      ?? null;
  }
  if (kind === 'og:url') {
    return html.match(/<meta\b[^>]*property=["']og:url["'][^>]*content=["']([^"']+)["'][^>]*>/i)?.[1]
      ?? html.match(/<meta\b[^>]*content=["']([^"']+)["'][^>]*property=["']og:url["'][^>]*>/i)?.[1]
      ?? null;
  }
  return null;
}

async function auditRoute(route, { query = '' } = {}) {
  const expected = new URL(`${route}${query}`, `${PUBLIC_ORIGIN}/`);
  const legacy = new URL(`${route}${query}`, `${legacyOrigin}/`);
  const record = {
    route,
    query,
    official_url: expected.toString(),
    legacy_url: legacy.toString(),
    official_status: null,
    official_canonical: null,
    official_og_url: null,
    legacy_status: null,
    legacy_location: null,
    redirect_ok: false,
    issues: []
  };

  try {
    const officialResponse = await request(expected, { redirect: 'follow' });
    record.official_status = officialResponse.status;
    const contentType = officialResponse.headers.get('content-type') ?? '';
    const html = contentType.includes('text/html') ? await officialResponse.text() : '';
    if (officialResponse.status !== 200) record.issues.push(`official returned HTTP ${officialResponse.status}`);
    if (html) {
      record.official_canonical = extractMeta(html, 'canonical');
      record.official_og_url = extractMeta(html, 'og:url');
      const expectedWithoutQuery = new URL(route, `${PUBLIC_ORIGIN}/`).toString();
      if (record.official_canonical !== expectedWithoutQuery) record.issues.push(`canonical mismatch: ${record.official_canonical ?? 'missing'}`);
      if (record.official_og_url !== expectedWithoutQuery) record.issues.push(`og:url mismatch: ${record.official_og_url ?? 'missing'}`);
    }
  } catch (error) {
    record.issues.push(`official request failed: ${error instanceof Error ? error.message : String(error)}`);
  }

  try {
    const legacyResponse = await request(legacy, { redirect: 'manual' });
    record.legacy_status = legacyResponse.status;
    record.legacy_location = legacyResponse.headers.get('location');
    if (legacyResponse.status === 301 && record.legacy_location) {
      const actual = new URL(record.legacy_location, legacy);
      record.redirect_ok = actual.toString() === expected.toString();
      if (!record.redirect_ok) record.issues.push(`legacy Location mismatch: ${actual.toString()}`);
    } else {
      record.issues.push(`legacy expected HTTP 301, got ${legacyResponse.status}`);
    }
  } catch (error) {
    record.issues.push(`legacy request failed: ${error instanceof Error ? error.message : String(error)}`);
  }

  return record;
}

await fs.promises.rm(outputDir, { recursive: true, force: true });
await fs.promises.mkdir(outputDir, { recursive: true });

let routes = [];
try {
  routes = await collectPublicRoutes();
} catch (error) {
  failures.push(`could not collect public routes: ${error instanceof Error ? error.message : String(error)}`);
}

const selected = representativeRoutes(routes);
if (selected.length < 10) failures.push(`representative route selection too small: ${selected.length}`);

const records = [];
for (const route of selected) records.push(await auditRoute(route));
const queryProbeRoute = firstRoute(routes, '/stablecoin/') ?? '/stablecoins/';
records.push(await auditRoute(queryProbeRoute, { query: '?source=legacy-audit' }));

for (const record of records) {
  const officialIssues = record.issues.filter((issue) => issue.startsWith('official') || issue.startsWith('canonical') || issue.startsWith('og:url'));
  if (officialIssues.length) failures.push(`${record.route}${record.query}: ${officialIssues.join('; ')}`);
  if (!record.redirect_ok) redirectFindings.push(`${record.route}${record.query}: ${record.issues.filter((issue) => issue.startsWith('legacy')).join('; ')}`);
}

if (strict && redirectFindings.length) failures.push(...redirectFindings.map((item) => `redirect: ${item}`));

const report = {
  schema_version: '1.0',
  generated_at: new Date().toISOString(),
  strict,
  official_origin: PUBLIC_ORIGIN,
  legacy_origin: legacyOrigin,
  discovered_route_count: routes.length,
  representative_route_count: selected.length,
  request_count: records.length,
  official_failures: failures.filter((item) => !item.startsWith('redirect:')).length,
  redirect_ready_count: records.filter((record) => record.redirect_ok).length,
  redirect_pending_count: records.filter((record) => !record.redirect_ok).length,
  migration_complete: records.length > 0 && records.every((record) => record.redirect_ok),
  records,
  redirect_findings: redirectFindings,
  failures
};

const summary = [
  '# Stable or Gone domain migration audit',
  '',
  `- Generated: ${report.generated_at}`,
  `- Official origin: ${report.official_origin}`,
  `- Legacy origin: ${report.legacy_origin}`,
  `- Public routes discovered: ${report.discovered_route_count}`,
  `- Representative routes checked: ${report.representative_route_count}`,
  `- Legacy redirect ready: ${report.redirect_ready_count}/${report.request_count}`,
  `- Migration complete: ${report.migration_complete ? 'yes' : 'no'}`,
  '',
  '## Redirect findings',
  ...(redirectFindings.length ? redirectFindings.map((item) => `- ${item}`) : ['- none']),
  '',
  '## Official-origin failures',
  ...(failures.filter((item) => !item.startsWith('redirect:')).length ? failures.filter((item) => !item.startsWith('redirect:')).map((item) => `- ${item}`) : ['- none'])
].join('\n');

await fs.promises.writeFile(path.join(outputDir, 'report.json'), `${JSON.stringify(report, null, 2)}\n`);
await fs.promises.writeFile(path.join(outputDir, 'summary.md'), `${summary}\n`);
console.log(summary);

if (failures.length) process.exit(1);
