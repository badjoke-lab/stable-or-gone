import fs from 'node:fs';
import path from 'node:path';
import { isDeepStrictEqual } from 'node:util';

const root = process.cwd();
const distDir = path.join(root, 'dist');
const baseline = JSON.parse(fs.readFileSync(path.join(root, 'docs/migration/registry-v2-baseline.json'), 'utf8'));
const failures = [];
const INDEX_PAGE_SIZE = 20;

function fail(message) { failures.push(message); }
function assert(condition, message) { if (!condition) fail(message); }
function readJson(relativePath) { return JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8')); }
function recordsFromJson(relativePath) {
  const value = readJson(relativePath);
  if (Array.isArray(value)) return value;
  if (Array.isArray(value.records)) return value.records;
  throw new Error(`${relativePath}: expected an array or { records: [] }`);
}
function group(name) { return (baseline.data_groups?.[name] ?? []).flatMap(recordsFromJson); }
function applyById(rows, layers) {
  const maps = layers.map((layer) => new Map(layer.map((row) => [row.id, row])));
  return rows.map((row) => maps.reduce((merged, map) => ({ ...merged, ...(map.get(row.id) ?? {}) }), row));
}
function routeFile(route) {
  if (route === '/') return path.join(distDir, 'index.html');
  const normalized = route.replace(/^\//, '').replace(/\/$/, '');
  return path.join(distDir, normalized, 'index.html');
}
function requireRoute(route, label) {
  const file = routeFile(route);
  assert(fs.existsSync(file), `${label} route missing: ${route}`);
  return file;
}
function readRoute(route) {
  const file = requireRoute(route, 'public');
  return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
}
function visibleText(html) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}
function uniqueInternalLinks(html, prefix) {
  const values = new Set();
  for (const match of html.matchAll(/href=["']([^"']+)["']/g)) {
    if (match[1].startsWith(prefix)) values.add(match[1]);
  }
  return values;
}
function requireMetadata(html, route) {
  assert(/<meta\s+name=["']description["']/i.test(html), `${route}: meta description missing`);
  assert(/<link\s+rel=["']canonical["']/i.test(html), `${route}: canonical link missing`);
  assert(/hreflang=["']en["']/i.test(html), `${route}: English hreflang missing`);
  assert(/hreflang=["']x-default["']/i.test(html), `${route}: x-default hreflang missing`);
  assert(/property=["']og:title["']/i.test(html), `${route}: og:title missing`);
  assert(/property=["']og:description["']/i.test(html), `${route}: og:description missing`);
  assert(/property=["']og:url["']/i.test(html), `${route}: og:url missing`);
  assert(/property=["']og:image["']/i.test(html), `${route}: og:image missing`);
  assert(/type=["']application\/ld\+json["']/i.test(html), `${route}: JSON-LD missing`);
  assert(html.includes('/version.json') && html.includes('/data/manifest.json') && html.includes('/llms.txt') && html.includes('/ai.txt'), `${route}: machine-readable alternate links missing`);
}
function ids(rows) { return new Set(rows.map((row) => row.id)); }
function assertReference(value, set, label) { if (value) assert(set.has(value), `${label}: missing referenced id ${value}`); }

assert(fs.existsSync(distDir), 'dist directory missing; run astro build first');

const stablecoins = applyById(group('stablecoins'), [
  recordsFromJson('data/stablecoin-overrides-pr033.json'),
  recordsFromJson('data/stablecoin-overrides-pr034.json'),
  group('classifications'),
  group('classification_extensions'),
  group('profiles')
]);
const organizations = group('organizations');
const relationships = group('relationships');
const events = applyById(group('events'), [group('event_details')]);
const evidence = group('evidence');
const reserveReports = group('reserve_reports');
const knownUnknowns = group('known_unknowns');
const regulatoryNotes = group('regulatory_notes');
const deployments = group('deployments');

const counts = {
  stablecoins: stablecoins.length,
  organizations: organizations.length,
  relationships: relationships.length,
  events: events.length,
  evidence: evidence.length,
  reserve_reports: reserveReports.length,
  deployments: deployments.length,
  known_unknowns: knownUnknowns.length,
  regulatory_notes: regulatoryNotes.length
};

const stablecoinIds = ids(stablecoins);
const organizationIds = ids(organizations);
const eventIds = ids(events);
const evidenceIds = ids(evidence);

for (const row of stablecoins) {
  assert(Boolean(row.id && row.slug), 'stablecoin missing id or slug');
  assert(Boolean(row.last_verified_at), `${row.id}: last_verified_at missing`);
  if (row.reserve_profile) assert(Boolean(row.reserve_profile.as_of_date || row.last_verified_at), `${row.id}: reserve profile lacks as_of_date or record verification date`);
  if (row.redemption_profile) assert(Boolean(row.redemption_profile.as_of_date || row.last_verified_at), `${row.id}: redemption profile lacks as_of_date or record verification date`);
}
for (const row of organizations) {
  assert(Boolean(row.id && row.slug), 'organization missing id or slug');
  assert(Boolean(row.last_verified_at), `${row.id}: last_verified_at missing`);
}
for (const row of relationships) {
  assertReference(row.stablecoin_id, stablecoinIds, `${row.id} relationship stablecoin`);
  assertReference(row.organization_id, organizationIds, `${row.id} relationship organization`);
}
for (const row of events) {
  assertReference(row.stablecoin_id, stablecoinIds, `${row.id} event stablecoin`);
  assertReference(row.issuer_id, organizationIds, `${row.id} event organization`);
  for (const id of row.subject_stablecoin_ids ?? []) assertReference(id, stablecoinIds, `${row.id} event stablecoin subject`);
  for (const id of row.subject_organization_ids ?? []) assertReference(id, organizationIds, `${row.id} event organization subject`);
  for (const id of row.evidence_ids ?? []) assertReference(id, evidenceIds, `${row.id} event evidence`);
}
for (const row of evidence) {
  assertReference(row.stablecoin_id, stablecoinIds, `${row.id} evidence stablecoin`);
  assertReference(row.issuer_id, organizationIds, `${row.id} evidence organization`);
  assertReference(row.event_id, eventIds, `${row.id} evidence event`);
  for (const id of row.stablecoin_ids ?? []) assertReference(id, stablecoinIds, `${row.id} evidence stablecoin relation`);
  for (const id of row.organization_ids ?? []) assertReference(id, organizationIds, `${row.id} evidence organization relation`);
  for (const id of row.event_ids ?? []) assertReference(id, eventIds, `${row.id} evidence event relation`);
}
for (const row of reserveReports) {
  assertReference(row.stablecoin_id, stablecoinIds, `${row.id} reserve report stablecoin`);
  assert(Boolean(row.report_date || row.as_of_date || row.published_at), `${row.id}: reserve report lacks report_date/as_of_date/published_at`);
}
for (const row of knownUnknowns) {
  assertReference(row.stablecoin_id, stablecoinIds, `${row.id} known unknown stablecoin`);
  assert(Boolean(row.last_checked_at), `${row.id}: known unknown lacks last_checked_at`);
}
for (const row of regulatoryNotes) {
  assertReference(row.stablecoin_id, stablecoinIds, `${row.id} regulatory note stablecoin`);
  assert(Boolean(row.note_date || row.published_at), `${row.id}: regulatory note lacks note_date/published_at`);
}
for (const row of deployments) {
  assertReference(row.stablecoin_id, stablecoinIds, `${row.id} deployment stablecoin`);
  for (const id of row.evidence_ids ?? []) assertReference(id, evidenceIds, `${row.id} deployment evidence`);
}

const homeHtml = readRoute('/');
const stablecoinsHtml = readRoute('/stablecoins/');
const organizationsHtml = readRoute('/issuers/');
const eventsHtml = readRoute('/events/');
const homeText = visibleText(homeHtml);
const stablecoinsText = visibleText(stablecoinsHtml);
const organizationsText = visibleText(organizationsHtml);
const eventsText = visibleText(eventsHtml);

assert(homeText.includes(`${counts.stablecoins} stable assets`), `home stablecoin count mismatch: expected ${counts.stablecoins}`);
assert(homeText.includes(`${counts.organizations} organizations`), `home organization count mismatch: expected ${counts.organizations}`);
assert(homeText.includes(`${counts.events} events`), `home event count mismatch: expected ${counts.events}`);
assert(homeText.includes(`${counts.evidence} source records`), `home evidence count mismatch: expected ${counts.evidence}`);
assert(stablecoinsText.includes(`Stable assets ${counts.stablecoins}`), 'stablecoin index record count mismatch');
assert(stablecoinsText.includes(`Organizations ${counts.organizations}`), 'stablecoin index organization count mismatch');
assert(stablecoinsText.includes(`${counts.stablecoins} of ${counts.stablecoins} records`), 'stablecoin index visible result count mismatch');
assert(organizationsText.includes(`Organizations ${counts.organizations}`), 'organization index count mismatch');
assert(organizationsText.includes(`Relationships ${counts.relationships}`), 'organization index relationship count mismatch');
assert(organizationsText.includes(`1–${Math.min(INDEX_PAGE_SIZE, counts.organizations)} of ${counts.organizations} organizations`), 'organization index bounded visible result count mismatch');
assert(eventsText.includes(`Events ${counts.events}`), 'event index count mismatch');
assert(eventsText.includes(`1–${Math.min(INDEX_PAGE_SIZE, counts.events)} of ${counts.events} events`), 'event index bounded visible result count mismatch');

const stablecoinLinks = uniqueInternalLinks(stablecoinsHtml, '/stablecoin/');
const organizationLinks = uniqueInternalLinks(organizationsHtml, '/issuer/');
const eventLinks = uniqueInternalLinks(eventsHtml, '/event/');
assert(stablecoinLinks.size === counts.stablecoins, `stablecoin index links ${stablecoinLinks.size}, expected ${counts.stablecoins}`);
assert(organizationLinks.size === counts.organizations, `organization index links ${organizationLinks.size}, expected ${counts.organizations}`);
assert(eventLinks.size === counts.events, `event index links ${eventLinks.size}, expected ${counts.events}`);

for (const route of ['/', '/stablecoins/', '/issuers/', '/events/']) requireMetadata(readRoute(route), route);
for (const row of stablecoins) {
  const route = `/stablecoin/${row.slug}/`;
  const html = readRoute(route);
  requireMetadata(html, route);
  const text = visibleText(html);
  for (const heading of ['Redemption profile', 'Reserve and attestation history', 'Regulatory and official notices', 'Blockchain deployments', 'Open questions', 'Sources']) assert(text.includes(heading), `${route}: missing ${heading} section`);
}
for (const row of organizations) requireMetadata(readRoute(`/issuer/${row.slug}/`), `/issuer/${row.slug}/`);
for (const row of events) requireMetadata(readRoute(`/event/${row.id}/`), `/event/${row.id}/`);

const versionPath = path.join(distDir, 'version.json');
const manifestPath = path.join(distDir, 'data/manifest.json');
assert(fs.existsSync(versionPath), 'version.json missing');
assert(fs.existsSync(manifestPath), 'data/manifest.json missing');
if (fs.existsSync(versionPath) && fs.existsSync(manifestPath)) {
  const version = JSON.parse(fs.readFileSync(versionPath, 'utf8'));
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const expectedPrimary = { primary_records: counts.stablecoins, events: counts.events, evidence: counts.evidence };
  assert(isDeepStrictEqual(version.data?.record_counts, expectedPrimary), 'version.json primary counts mismatch');
  assert(isDeepStrictEqual(manifest.record_counts, expectedPrimary), 'manifest primary counts mismatch');
  for (const [key, value] of Object.entries(counts)) {
    const manifestKey = key === 'evidence' ? null : key;
    if (manifestKey && manifest.record_count_breakdown?.[manifestKey] !== undefined) assert(manifest.record_count_breakdown[manifestKey] === value, `manifest ${manifestKey} count mismatch`);
  }
  assert(Boolean(version.schema_version && version.data?.generated_at), 'version schema_version/generated_at missing');
  assert(Boolean(manifest.schema_version && manifest.generated_at), 'manifest schema_version/generated_at missing');
  assert(manifest.data_safety?.canonical_only === true, 'manifest canonical_only must be true');
  assert(manifest.data_safety?.includes_unreviewed_candidates === false, 'unreviewed candidates exposed in manifest');
  assert(manifest.data_safety?.includes_internal_monitoring === false, 'internal monitoring exposed in manifest');
}

const robotsPath = path.join(distDir, 'robots.txt');
const sitemapPath = path.join(distDir, 'sitemap-index.xml');
assert(fs.existsSync(robotsPath), 'robots.txt missing');
assert(fs.existsSync(sitemapPath), 'sitemap-index.xml missing');
if (fs.existsSync(robotsPath)) assert(fs.readFileSync(robotsPath, 'utf8').includes('https://www.stableorgone.com/sitemap-index.xml'), 'robots.txt sitemap URL mismatch');
if (fs.existsSync(sitemapPath)) {
  const sitemap = fs.readFileSync(sitemapPath, 'utf8');
  const collect = (pattern) => new Set([...sitemap.matchAll(pattern)].map((match) => match[1]));
  const listedStablecoins = collect(/<loc>https:\/\/sog\.badjoke-lab\.com\/stablecoin\/([^<]+)\/<\/loc>/g);
  const listedOrganizations = collect(/<loc>https:\/\/sog\.badjoke-lab\.com\/issuer\/([^<]+)\/<\/loc>/g);
  const listedEvents = collect(/<loc>https:\/\/sog\.badjoke-lab\.com\/event\/([^<]+)\/<\/loc>/g);
  assert(listedStablecoins.size === counts.stablecoins, `sitemap stablecoin routes ${listedStablecoins.size}, expected ${counts.stablecoins}`);
  assert(listedOrganizations.size === counts.organizations, `sitemap organization routes ${listedOrganizations.size}, expected ${counts.organizations}`);
  assert(listedEvents.size === counts.events, `sitemap event routes ${listedEvents.size}, expected ${counts.events}`);
}

if (failures.length > 0) {
  console.error('Public consistency verification failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(JSON.stringify({ ok: true, counts, verified_routes: { stablecoin_details: stablecoins.length, organization_details: organizations.length, event_details: events.length } }, null, 2));
