import fs from 'node:fs';
import path from 'node:path';
import { isDeepStrictEqual } from 'node:util';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const root = process.cwd();
const distDir = path.join(root, 'dist');
const origin = 'https://www.stableorgone.com';
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
}

function readRows(relativePath) {
  const value = readJson(relativePath);
  if (Array.isArray(value)) return value;
  if (Array.isArray(value.records)) return value.records;
  throw new Error(`${relativePath}: expected an array or { records: [] }`);
}

function uniqueById(rows) {
  return [...new Map(rows.map((row) => [row.id, row])).values()];
}

function setDifference(left, right) {
  return [...left].filter((value) => !right.has(value)).sort();
}

function compareSets(actual, expected, label) {
  const missing = setDifference(expected, actual);
  const unexpected = setDifference(actual, expected);
  check(missing.length === 0, `${label}: missing ${missing.join(', ')}`);
  check(unexpected.length === 0, `${label}: unexpected ${unexpected.join(', ')}`);
}

function extractLinks(html, prefix) {
  const links = new Set();
  for (const match of html.matchAll(/href=["']([^"']+)["']/g)) {
    if (match[1].startsWith(prefix)) links.add(match[1]);
  }
  return links;
}

function extractCanonical(html) {
  const tag = html.match(/<link\b[^>]*\brel=["']canonical["'][^>]*>/i)?.[0]
    || html.match(/<link\b[^>]*\bhref=["'][^"']+["'][^>]*\brel=["']canonical["'][^>]*>/i)?.[0];
  return tag?.match(/\bhref=["']([^"']+)["']/i)?.[1] ?? null;
}

function extractJsonLd(html) {
  const values = [];
  for (const match of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const parsed = JSON.parse(match[1]);
      values.push(...(Array.isArray(parsed) ? parsed : [parsed]));
    } catch (error) {
      failures.push(`invalid JSON-LD: ${error.message}`);
    }
  }
  return values;
}

function generatedSlugs(directory) {
  const absolute = path.join(distDir, directory);
  if (!fs.existsSync(absolute)) return new Set();
  return new Set(fs.readdirSync(absolute, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(absolute, entry.name, 'index.html')))
    .map((entry) => entry.name));
}

function readHtml(relativePath) {
  return fs.readFileSync(path.join(distDir, relativePath), 'utf8');
}

function verifyDetailFamily({ label, directory, expectedRows, routeFor }) {
  const expectedSlugs = new Set(expectedRows.map((row) => routeFor(row).split('/').filter(Boolean).at(-1)));
  const actualSlugs = generatedSlugs(directory);
  compareSets(actualSlugs, expectedSlugs, `${label} generated routes`);

  for (const row of expectedRows) {
    const publicPath = routeFor(row);
    const slug = publicPath.split('/').filter(Boolean).at(-1);
    const htmlPath = `${directory}/${slug}/index.html`;
    const absolute = path.join(distDir, htmlPath);
    if (!fs.existsSync(absolute)) continue;
    const html = readHtml(htmlPath);
    const expectedUrl = `${origin}${publicPath}`;
    check(extractCanonical(html) === expectedUrl, `${publicPath}: canonical URL mismatch`);
    const jsonLd = extractJsonLd(html);
    check(jsonLd.length > 0, `${publicPath}: JSON-LD missing`);
    check(jsonLd.some((value) => value && typeof value === 'object' && value.url === expectedUrl), `${publicPath}: JSON-LD URL mismatch`);
  }

  return { expected: expectedSlugs.size, generated: actualSlugs.size };
}

const baseline = loadRegistryV2Baseline(root);
const group = (name) => uniqueById((baseline.data_groups?.[name] ?? []).flatMap(readRows));
const stablecoins = group('stablecoins');
const organizations = group('organizations');
const events = group('events');

const expectedPaths = {
  stablecoins: new Set(stablecoins.map((row) => `/stablecoin/${row.slug}/`)),
  organizations: new Set(organizations.map((row) => `/issuer/${row.slug}/`)),
  events: new Set(events.map((row) => `/event/${row.id}/`))
};

const stablecoinIndex = readHtml('stablecoins/index.html');
const organizationIndex = readHtml('issuers/index.html');
const eventIndex = readHtml('events/index.html');
compareSets(extractLinks(stablecoinIndex, '/stablecoin/'), expectedPaths.stablecoins, 'stablecoin index links');
compareSets(extractLinks(organizationIndex, '/issuer/'), expectedPaths.organizations, 'organization index links');
compareSets(extractLinks(eventIndex, '/event/'), expectedPaths.events, 'event index links');

const routeInventory = {
  stablecoins: verifyDetailFamily({
    label: 'stablecoin',
    directory: 'stablecoin',
    expectedRows: stablecoins,
    routeFor: (row) => `/stablecoin/${row.slug}/`
  }),
  organizations: verifyDetailFamily({
    label: 'organization',
    directory: 'issuer',
    expectedRows: organizations,
    routeFor: (row) => `/issuer/${row.slug}/`
  }),
  events: verifyDetailFamily({
    label: 'event',
    directory: 'event',
    expectedRows: events,
    routeFor: (row) => `/event/${row.id}/`
  })
};

const sitemap = readHtml('sitemap-index.xml');
const sitemapPaths = {
  stablecoins: new Set([...sitemap.matchAll(/<loc>https:\/\/www\.stableorgone\.com(\/stablecoin\/[^<]+\/)<\/loc>/g)].map((match) => match[1])),
  organizations: new Set([...sitemap.matchAll(/<loc>https:\/\/www\.stableorgone\.com(\/issuer\/[^<]+\/)<\/loc>/g)].map((match) => match[1])),
  events: new Set([...sitemap.matchAll(/<loc>https:\/\/www\.stableorgone\.com(\/event\/[^<]+\/)<\/loc>/g)].map((match) => match[1]))
};
compareSets(sitemapPaths.stablecoins, expectedPaths.stablecoins, 'sitemap stablecoin URLs');
compareSets(sitemapPaths.organizations, expectedPaths.organizations, 'sitemap organization URLs');
compareSets(sitemapPaths.events, expectedPaths.events, 'sitemap event URLs');

const version = readJson('dist/version.json');
const manifest = readJson('dist/data/manifest.json');
const provenance = readJson('data/generated/build-provenance.json');
check(isDeepStrictEqual(version.build, manifest.build), 'version and manifest build provenance differ');
check(version.build?.canonical_data_hash === provenance.canonical_data_hash, 'version canonical hash differs from generated provenance');
check(version.data?.record_counts?.primary_records === stablecoins.length, 'version stablecoin count differs from canonical set');
check(version.data?.record_count_breakdown?.organizations === organizations.length, 'version organization count differs from canonical set');
check(version.data?.record_counts?.events === events.length, 'version event count differs from canonical set');
check(provenance.route_counts?.stablecoin_detail === stablecoins.length, 'provenance stablecoin route count differs from canonical set');
check(provenance.route_counts?.organization_detail === organizations.length, 'provenance organization route count differs from canonical set');
check(provenance.route_counts?.event_detail === events.length, 'provenance event route count differs from canonical set');

const outputInventory = {
  schema_version: '1.0',
  source_commit: version.build?.commit,
  canonical_data_hash: version.build?.canonical_data_hash,
  checked_at: new Date().toISOString(),
  canonical_sets: {
    stablecoins: stablecoins.length,
    organizations: organizations.length,
    events: events.length
  },
  generated_routes: routeInventory,
  index_links: {
    stablecoins: expectedPaths.stablecoins.size,
    organizations: expectedPaths.organizations.size,
    events: expectedPaths.events.size
  },
  sitemap_urls: {
    stablecoins: sitemapPaths.stablecoins.size,
    organizations: sitemapPaths.organizations.size,
    events: sitemapPaths.events.size
  },
  metadata_checked_routes: stablecoins.length + organizations.length + events.length,
  failures
};

fs.mkdirSync(path.join(distDir, 'data'), { recursive: true });
fs.writeFileSync(path.join(distDir, 'data/output-parity.json'), `${JSON.stringify(outputInventory, null, 2)}\n`);

if (failures.length > 0) {
  console.error('Full output parity verification failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(JSON.stringify({ ...outputInventory, ok: true }, null, 2));
