import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const dist = path.join(root, 'dist');
const origin = 'https://sog.badjoke-lab.com';
const baseline = JSON.parse(fs.readFileSync(path.join(root, 'docs/migration/registry-v2-baseline.json'), 'utf8'));
const fail = (message) => { throw new Error(message); };
const assert = (condition, message) => { if (!condition) fail(message); };
const readJson = (relative) => JSON.parse(fs.readFileSync(path.join(root, relative), 'utf8'));
const rows = (relative) => { const value = readJson(relative); return Array.isArray(value) ? value : value.records; };
const group = (name) => (baseline.data_groups?.[name] || []).flatMap(rows);
const routeFile = (route) => route === '/' ? path.join(dist, 'index.html') : path.join(dist, route.replace(/^\//, '').replace(/\/$/, ''), 'index.html');
const readRoute = (route) => { const file = routeFile(route); assert(fs.existsSync(file), `missing route ${route}`); return fs.readFileSync(file, 'utf8'); };
const count = (text, needle) => text.split(needle).length - 1;
const sitemapUrls = (xml) => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);

const stablecoins = group('stablecoins');
const organizations = group('organizations');
const events = group('events');
const evidence = group('evidence');
const reserveReports = group('reserve_reports');
const knownUnknowns = group('known_unknowns');
const regulatoryNotes = group('regulatory_notes');
const deployments = group('deployments');
const version = readJson('dist/version.json');
const manifest = readJson('dist/data/manifest.json');
const home = readRoute('/');
const stablecoinIndex = readRoute('/stablecoins/');
const organizationIndex = readRoute('/issuers/');
const eventIndex = readRoute('/events/');
const sitemap = sitemapUrls(fs.readFileSync(path.join(dist, 'sitemap-index.xml'), 'utf8'));

const expected = {
  stablecoins: stablecoins.length,
  organizations: organizations.length,
  events: events.length,
  evidence: evidence.length,
  reserve_reports: reserveReports.length,
  known_unknowns: knownUnknowns.length,
  regulatory_notes: regulatoryNotes.length,
  deployments: deployments.length,
};

assert(version.data.record_counts.primary_records === expected.stablecoins, 'version stablecoin count mismatch');
assert(version.data.record_counts.events === expected.events, 'version event count mismatch');
assert(version.data.record_counts.evidence === expected.evidence, 'version evidence count mismatch');
assert(version.data.record_count_breakdown.organizations === expected.organizations, 'version organization count mismatch');
assert(version.data.record_count_breakdown.reserve_reports === expected.reserve_reports, 'version reserve report count mismatch');
assert(version.data.record_count_breakdown.known_unknowns === expected.known_unknowns, 'version known unknown count mismatch');
assert(version.data.record_count_breakdown.regulatory_notes === expected.regulatory_notes, 'version regulatory note count mismatch');
assert(version.data.record_count_breakdown.deployments === expected.deployments, 'version deployment count mismatch');
assert(JSON.stringify(manifest.record_counts) === JSON.stringify(version.data.record_counts), 'manifest primary counts mismatch');
assert(JSON.stringify(manifest.record_count_breakdown) === JSON.stringify(version.data.record_count_breakdown), 'manifest breakdown mismatch');

assert(home.includes(`<span>Stablecoins</span><strong>${expected.stablecoins}</strong>`), 'home stablecoin count mismatch');
assert(home.includes(`<span>Organizations</span><strong>${expected.organizations}</strong>`), 'home organization count mismatch');
assert(home.includes(`<span>Events</span><strong>${expected.events}</strong>`), 'home event count mismatch');
assert(home.includes(`<span>Sources</span><strong>${expected.evidence}</strong>`), 'home evidence count mismatch');
assert(count(stablecoinIndex, 'data-registry-row') === expected.stablecoins, 'stablecoin row count mismatch');
assert(stablecoinIndex.includes(`${expected.stablecoins}</span> of ${expected.stablecoins} records`), 'stablecoin summary mismatch');
assert(count(eventIndex, 'data-event-row') === expected.events, 'event row count mismatch');
assert(eventIndex.includes(`${expected.events}</span> of ${expected.events} events`), 'event summary mismatch');
assert(organizationIndex.includes(`<span>Organizations</span><strong>${expected.organizations}</strong>`), 'organization count mismatch');

for (const row of stablecoins) assert(stablecoinIndex.includes(`/stablecoin/${row.slug}/`), `stablecoin missing from list: ${row.id}`);
for (const row of organizations) assert(organizationIndex.includes(`/issuer/${row.slug}/`), `organization missing from list: ${row.id}`);
for (const row of events) assert(eventIndex.includes(`/event/${row.id}/`), `event missing from list: ${row.id}`);

const routes = [
  '/', '/stablecoins/', '/issuers/', '/events/',
  ...stablecoins.map((row) => `/stablecoin/${row.slug}/`),
  ...organizations.map((row) => `/issuer/${row.slug}/`),
  ...events.map((row) => `/event/${row.id}/`),
];
for (const route of routes) {
  const html = readRoute(route);
  const canonical = `${origin}${route}`;
  assert(html.includes(`<link rel="canonical" href="${canonical}">`), `${route}: canonical mismatch`);
  assert(html.includes(`<link rel="alternate" hreflang="en" href="${canonical}">`), `${route}: en alternate missing`);
  assert(html.includes(`<link rel="alternate" hreflang="x-default" href="${canonical}">`), `${route}: x-default alternate missing`);
  assert(html.includes(`<meta property="og:url" content="${canonical}">`), `${route}: OG URL mismatch`);
  assert(html.includes('<meta name="description" content="'), `${route}: meta description missing`);
  assert(html.includes('<meta property="og:title" content="'), `${route}: OG title missing`);
  assert(html.includes('<script type="application/ld+json">'), `${route}: JSON-LD missing`);
  assert(html.includes(`<meta name="sog-build-commit" content="${version.build.commit}">`), `${route}: build marker mismatch`);
  assert(html.includes('<meta name="sog-canonical-only" content="true">'), `${route}: canonical-only marker missing`);
}

assert(new Set(sitemap).size === sitemap.length, 'duplicate sitemap URLs');
assert(sitemap.filter((url) => url.startsWith(`${origin}/stablecoin/`)).length === expected.stablecoins, 'sitemap stablecoin count mismatch');
assert(sitemap.filter((url) => url.startsWith(`${origin}/issuer/`)).length === expected.organizations, 'sitemap organization count mismatch');
assert(sitemap.filter((url) => url.startsWith(`${origin}/event/`)).length === expected.events, 'sitemap event count mismatch');
for (const route of routes) assert(sitemap.includes(`${origin}${route}`), `sitemap missing ${route}`);

for (const row of stablecoins) assert(row.last_verified_at, `stablecoin missing last_verified_at: ${row.id}`);
for (const row of organizations) assert(row.last_verified_at, `organization missing last_verified_at: ${row.id}`);
for (const row of reserveReports) assert(row.report_date || row.period_covered, `reserve report missing time context: ${row.id}`);
for (const row of knownUnknowns) assert(row.last_checked_at, `known unknown missing last_checked_at: ${row.id}`);
for (const row of regulatoryNotes) assert(row.note_date, `regulatory note missing note_date: ${row.id}`);

const publicText = [
  fs.readFileSync(path.join(root, 'README.md'), 'utf8'),
  home, stablecoinIndex, organizationIndex, eventIndex,
  fs.readFileSync(path.join(dist, 'llms.txt'), 'utf8'),
  fs.readFileSync(path.join(dist, 'ai.txt'), 'utf8'),
].join('\n');
for (const stale of ['20 records / 16 issuers', '20 of 20 records', '23 events', '40 stable assets', '32 organizations']) {
  assert(!publicText.toLowerCase().includes(stale.toLowerCase()), `stale public count remains: ${stale}`);
}

console.log(JSON.stringify({ ok: true, expected, verified_routes: routes.length, sitemap_urls: sitemap.length }, null, 2));
