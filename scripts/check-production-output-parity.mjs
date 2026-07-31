import { isDeepStrictEqual } from 'node:util';
import { PUBLIC_ORIGIN } from '../config/public-origin.mjs';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const origin = (process.env.SOG_BASE_URL || PUBLIC_ORIGIN).replace(/\/$/, '');
const concurrency = Number(process.env.SOG_PARITY_CONCURRENCY || 12);
const expectedCommit = process.env.SOG_EXPECTED_COMMIT || process.env.GITHUB_SHA || null;
const attempts = Number(process.env.SOG_SMOKE_ATTEMPTS || 5);
const delayMs = Number(process.env.SOG_SMOKE_DELAY_MS || 10000);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function readRows(relativePath) {
  const value = JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
  if (Array.isArray(value)) return value;
  if (Array.isArray(value.records)) return value.records;
  throw new Error(`${relativePath}: expected an array or { records: [] }`);
}

function uniqueById(rows) {
  return [...new Map(rows.map((row) => [row.id, row])).values()];
}

function difference(left, right) {
  return [...left].filter((value) => !right.has(value)).sort();
}

function assertSameSet(actual, expected, label) {
  const missing = difference(expected, actual);
  const unexpected = difference(actual, expected);
  assert(missing.length === 0, `${label}: missing ${missing.join(', ')}`);
  assert(unexpected.length === 0, `${label}: unexpected ${unexpected.join(', ')}`);
}

function extractLinks(html, prefix) {
  const links = new Set();
  for (const match of html.matchAll(/href=["']([^"']+)["']/g)) {
    if (match[1].startsWith(prefix)) links.add(match[1]);
  }
  return links;
}

function extractCanonical(html) {
  const tags = [...html.matchAll(/<link\b[^>]*>/gi)].map((match) => match[0]);
  const tag = tags.find((value) => /\brel=["']canonical["']/i.test(value));
  return tag?.match(/\bhref=["']([^"']+)["']/i)?.[1] ?? null;
}

function extractJsonLd(html) {
  const values = [];
  for (const match of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    const parsed = JSON.parse(match[1]);
    values.push(...(Array.isArray(parsed) ? parsed : [parsed]));
  }
  return values;
}

async function read(pathname, expectedType, cacheBust) {
  const separator = pathname.includes('?') ? '&' : '?';
  const response = await fetch(`${origin}${pathname}${separator}sog_build=${encodeURIComponent(cacheBust)}`, {
    headers: {
      accept: expectedType,
      'user-agent': 'sog-production-output-parity/1.2',
      'cache-control': 'no-store'
    }
  });
  assert(response.ok, `${pathname}: HTTP ${response.status}`);
  const contentType = response.headers.get('content-type') || '';
  assert(contentType.includes(expectedType), `${pathname}: unexpected content type ${contentType || 'missing'}`);
  return response.text();
}

async function waitForCoherentSource() {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const cacheBust = `${expectedCommit || 'unknown'}-${attempt}-${Date.now()}`;
    try {
      const [versionText, manifestText] = await Promise.all([
        read('/version.json', 'application/json', cacheBust),
        read('/data/manifest.json', 'application/json', cacheBust)
      ]);
      const version = JSON.parse(versionText);
      const manifest = JSON.parse(manifestText);
      assert(isDeepStrictEqual(version.build, manifest.build), 'version and manifest provenance differ');
      if (expectedCommit) {
        assert(version.build?.commit === expectedCommit, `production commit ${version.build?.commit} does not match expected ${expectedCommit}`);
      }
      return { version, manifest, cacheBust, attempt };
    } catch (error) {
      lastError = error;
      console.error(`Production parity convergence attempt ${attempt}/${attempts} failed: ${error.message}`);
      if (attempt < attempts) await sleep(delayMs);
    }
  }
  throw lastError;
}

async function mapConcurrent(items, limit, worker) {
  let cursor = 0;
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      await worker(items[index], index);
    }
  });
  await Promise.all(runners);
}

const baseline = loadRegistryV2Baseline(root);
const group = (name) => uniqueById((baseline.data_groups?.[name] ?? []).flatMap(readRows));
const stablecoins = group('stablecoins');
const organizations = group('organizations');
const events = group('events');

const expected = {
  stablecoins: new Set(stablecoins.map((row) => `/stablecoin/${row.slug}/`)),
  organizations: new Set(organizations.map((row) => `/issuer/${row.slug}/`)),
  events: new Set(events.map((row) => `/event/${row.id}/`))
};

const { version, cacheBust, attempt: convergenceAttempt } = await waitForCoherentSource();
const [stablecoinIndex, organizationIndex, eventIndex, sitemap] = await Promise.all([
  read('/stablecoins/', 'text/html', cacheBust),
  read('/issuers/', 'text/html', cacheBust),
  read('/events/', 'text/html', cacheBust),
  read('/sitemap-index.xml', 'application/xml', cacheBust)
]);

assert(version.data?.record_counts?.primary_records === stablecoins.length, 'production stablecoin count mismatch');
assert(version.data?.record_count_breakdown?.organizations === organizations.length, 'production organization count mismatch');
assert(version.data?.record_counts?.events === events.length, 'production event count mismatch');
assert(version.build?.route_counts?.stablecoin_detail === stablecoins.length, 'production provenance stablecoin route count mismatch');
assert(version.build?.route_counts?.organization_detail === organizations.length, 'production provenance organization route count mismatch');
assert(version.build?.route_counts?.event_detail === events.length, 'production provenance event route count mismatch');

assertSameSet(extractLinks(stablecoinIndex, '/stablecoin/'), expected.stablecoins, 'production stablecoin index links');
assertSameSet(extractLinks(organizationIndex, '/issuer/'), expected.organizations, 'production organization index links');
assertSameSet(extractLinks(eventIndex, '/event/'), expected.events, 'production event index links');

const escapedOrigin = origin.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const sitemapSets = {
  stablecoins: new Set([...sitemap.matchAll(new RegExp(`<loc>${escapedOrigin}(/stablecoin/[^<]+/)</loc>`, 'g'))].map((match) => match[1])),
  organizations: new Set([...sitemap.matchAll(new RegExp(`<loc>${escapedOrigin}(/issuer/[^<]+/)</loc>`, 'g'))].map((match) => match[1])),
  events: new Set([...sitemap.matchAll(new RegExp(`<loc>${escapedOrigin}(/event/[^<]+/)</loc>`, 'g'))].map((match) => match[1]))
};
assertSameSet(sitemapSets.stablecoins, expected.stablecoins, 'production sitemap stablecoins');
assertSameSet(sitemapSets.organizations, expected.organizations, 'production sitemap organizations');
assertSameSet(sitemapSets.events, expected.events, 'production sitemap events');

const detailPaths = [...expected.stablecoins, ...expected.organizations, ...expected.events];
await mapConcurrent(detailPaths, concurrency, async (pathname) => {
  const html = await read(pathname, 'text/html', cacheBust);
  const expectedUrl = `${origin}${pathname}`;
  assert(extractCanonical(html) === expectedUrl, `${pathname}: canonical URL mismatch`);
  const jsonLd = extractJsonLd(html);
  assert(jsonLd.length > 0, `${pathname}: JSON-LD missing`);
  assert(jsonLd.some((value) => value && typeof value === 'object' && value.url === expectedUrl), `${pathname}: JSON-LD URL mismatch`);
});

console.log(JSON.stringify({
  ok: true,
  origin,
  source_commit: version.build.commit,
  canonical_data_hash: version.build.canonical_data_hash,
  convergence_attempt: convergenceAttempt,
  exact_sets: {
    stablecoins: stablecoins.length,
    organizations: organizations.length,
    events: events.length,
    total_detail_routes: detailPaths.length
  },
  metadata_checked_routes: detailPaths.length
}, null, 2));
