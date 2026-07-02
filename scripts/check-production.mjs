const DEFAULT_BASE_URL = 'https://sog.badjoke-lab.com';
const DEFAULT_ATTEMPTS = 20;
const DEFAULT_DELAY_MS = 15000;

const baseUrl = (process.env.SOG_BASE_URL || DEFAULT_BASE_URL).replace(/\/$/, '');
const expectedCommit = process.env.SOG_EXPECTED_COMMIT || process.env.GITHUB_SHA || null;
const attempts = Number(process.env.SOG_SMOKE_ATTEMPTS || DEFAULT_ATTEMPTS);
const delayMs = Number(process.env.SOG_SMOKE_DELAY_MS || DEFAULT_DELAY_MS);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
function sleep(ms) { return new Promise((resolve) => setTimeout(resolve, ms)); }
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
  const links = new Set();
  for (const match of html.matchAll(/href=["']([^"']+)["']/g)) {
    if (match[1].startsWith(prefix)) links.add(match[1]);
  }
  return links;
}
function requireMetadata(html, pathname) {
  assert(/<meta\s+name=["']description["']/i.test(html), `${pathname}: meta description missing`);
  assert(/<link\s+rel=["']canonical["']/i.test(html), `${pathname}: canonical link missing`);
  assert(/hreflang=["']en["']/i.test(html), `${pathname}: English hreflang missing`);
  assert(/hreflang=["']x-default["']/i.test(html), `${pathname}: x-default hreflang missing`);
  assert(/property=["']og:title["']/i.test(html), `${pathname}: og:title missing`);
  assert(/property=["']og:description["']/i.test(html), `${pathname}: og:description missing`);
  assert(/property=["']og:url["']/i.test(html), `${pathname}: og:url missing`);
  assert(/property=["']og:image["']/i.test(html), `${pathname}: og:image missing`);
  assert(/type=["']application\/ld\+json["']/i.test(html), `${pathname}: JSON-LD missing`);
}

async function read(pathname, expectedContentType) {
  const response = await fetch(`${baseUrl}${pathname}`, {
    headers: {
      accept: expectedContentType,
      'user-agent': 'sog-public-consistency-smoke/3.2',
      'cache-control': 'no-cache'
    }
  });
  if (!response.ok) throw new Error(`${pathname} returned HTTP ${response.status}`);
  const contentType = response.headers.get('content-type') || '';
  assert(contentType.includes(expectedContentType), `${pathname} returned unexpected content-type: ${contentType || 'missing'}`);
  return { text: await response.text(), headers: response.headers };
}

async function checkOnce() {
  const versionResponse = await read('/version.json', 'application/json');
  const manifestResponse = await read('/data/manifest.json', 'application/json');
  const llmsResponse = await read('/llms.txt', 'text/plain');
  const aiResponse = await read('/ai.txt', 'text/plain');
  const homeResponse = await read('/', 'text/html');
  const stablecoinsResponse = await read('/stablecoins/', 'text/html');
  const organizationsResponse = await read('/issuers/', 'text/html');
  const eventsResponse = await read('/events/', 'text/html');
  const robotsResponse = await read('/robots.txt', 'text/plain');
  const sitemapResponse = await read('/sitemap-index.xml', 'application/xml');

  const version = JSON.parse(versionResponse.text);
  const manifest = JSON.parse(manifestResponse.text);
  const llmsText = llmsResponse.text;
  const aiText = aiResponse.text;

  assert(version.schema_version === '1.0.0', 'version schema mismatch');
  assert(version.project_id === 'stable-or-gone', 'version project id mismatch');
  assert(version.registry_family === 'badjoke-lab-ledger-series', 'version registry family mismatch');
  assert(version.registry_type === 'stablecoin_issuer_registry', 'version registry type mismatch');
  assert(version.canonical_origin === 'https://sog.badjoke-lab.com', 'version origin mismatch');
  assert(version.build?.verification_marker === 'sog_machine_readable_layer_v1', 'verification marker mismatch');
  assert(version.build?.commit && typeof version.build.commit === 'string', 'build commit missing');
  assert(version.build?.branch && typeof version.build.branch === 'string', 'build branch missing');
  assert(version.data?.data_schema_version === 'sog_registry_v2', 'data schema mismatch');
  assert(version.data?.generated_at, 'version data generated_at missing');

  if (expectedCommit) {
    assert(version.build.commit === expectedCommit, `production commit ${version.build.commit} does not match expected ${expectedCommit}`);
  }

  const counts = version.data?.record_counts;
  const breakdown = version.data?.record_count_breakdown;
  assert(Number.isInteger(counts?.primary_records) && counts.primary_records > 0, 'stablecoin count invalid');
  assert(Number.isInteger(counts?.events) && counts.events > 0, 'event count invalid');
  assert(Number.isInteger(counts?.evidence) && counts.evidence > 0, 'evidence count invalid');
  for (const key of ['organizations', 'relationships', 'reserve_reports', 'deployments', 'known_unknowns', 'regulatory_notes', 'evidence_source_identities']) {
    assert(Number.isInteger(breakdown?.[key]), `${key} count missing`);
  }

  assert(manifest.schema_version === version.schema_version, 'manifest schema mismatch');
  assert(manifest.project_id === version.project_id, 'manifest project mismatch');
  assert(manifest.registry_family === version.registry_family, 'manifest family mismatch');
  assert(manifest.registry_type === version.registry_type, 'manifest type mismatch');
  assert(manifest.canonical_origin === version.canonical_origin, 'manifest origin mismatch');
  assert(manifest.data_model?.primary_record === 'stablecoin', 'manifest primary record mismatch');
  assert(JSON.stringify(manifest.record_counts) === JSON.stringify(counts), 'version and manifest counts differ');
  assert(JSON.stringify(manifest.record_count_breakdown) === JSON.stringify(breakdown), 'version and manifest breakdown differ');
  assert(manifest.schema_version && manifest.generated_at, 'manifest schema_version/generated_at missing');
  assert(manifest.data_safety?.canonical_only === true, 'canonical-only flag missing');
  assert(manifest.data_safety?.includes_unreviewed_candidates === false, 'candidate safety flag invalid');
  assert(manifest.data_safety?.includes_internal_monitoring === false, 'monitoring safety flag invalid');
  assert(manifest.data_safety?.includes_private_notes === false, 'review-material safety flag invalid');

  const homeText = visibleText(homeResponse.text);
  const stablecoinsText = visibleText(stablecoinsResponse.text);
  const organizationsText = visibleText(organizationsResponse.text);
  const eventsText = visibleText(eventsResponse.text);
  const initialStablecoinRangeEnd = Math.min(20, counts.primary_records);

  assert(homeText.includes(`${counts.primary_records} stable assets`), 'home stable asset count mismatch');
  assert(homeText.includes(`${breakdown.organizations} organizations`), 'home organization count mismatch');
  assert(homeText.includes(`${counts.events} events`), 'home event count mismatch');
  assert(homeText.includes(`${breakdown.evidence_source_identities} Source identities`), 'home source identity count mismatch');
  assert(stablecoinsText.includes(`${counts.primary_records} records`), 'stablecoin index record count mismatch');
  assert(stablecoinsText.includes(`1–${initialStablecoinRangeEnd} of ${counts.primary_records} records`), 'stablecoin index initial range mismatch');
  assert(stablecoinsText.includes('20 per page'), 'stablecoin index page-size marker missing');
  assert(organizationsText.includes(`Organizations ${breakdown.organizations}`), 'organization index count mismatch');
  assert(organizationsText.includes(`Relationships ${breakdown.relationships}`), 'organization relationship count mismatch');
  assert(eventsText.includes(`Events ${counts.events}`), 'event index count mismatch');
  assert(eventsText.includes(`${counts.events} of ${counts.events} events`), 'event index result count mismatch');

  const stablecoinLinks = uniqueInternalLinks(stablecoinsResponse.text, '/stablecoin/');
  const organizationLinks = uniqueInternalLinks(organizationsResponse.text, '/issuer/');
  const eventLinks = uniqueInternalLinks(eventsResponse.text, '/event/');
  assert(stablecoinLinks.size === counts.primary_records, `stablecoin detail links ${stablecoinLinks.size}, expected ${counts.primary_records}`);
  assert(organizationLinks.size === breakdown.organizations, `organization detail links ${organizationLinks.size}, expected ${breakdown.organizations}`);
  assert(eventLinks.size === counts.events, `event detail links ${eventLinks.size}, expected ${counts.events}`);

  for (const [pathname, html] of [['/', homeResponse.text], ['/stablecoins/', stablecoinsResponse.text], ['/issuers/', organizationsResponse.text], ['/events/', eventsResponse.text]]) {
    requireMetadata(html, pathname);
  }

  const sampleStablecoin = [...stablecoinLinks][0];
  const sampleOrganization = [...organizationLinks][0];
  const sampleEvent = [...eventLinks][0];
  if (sampleStablecoin) {
    const response = await read(sampleStablecoin, 'text/html');
    requireMetadata(response.text, sampleStablecoin);
    const text = visibleText(response.text);
    for (const heading of ['Identity and current state', 'Organizations and control', 'How the asset works', 'Reserve and redemption', 'Deployments and legal context', 'History', 'Evidence', 'Known unknowns and coverage']) {
      assert(text.includes(heading), `${sampleStablecoin}: missing ${heading}`);
    }
  }
  if (sampleOrganization) requireMetadata((await read(sampleOrganization, 'text/html')).text, sampleOrganization);
  if (sampleEvent) requireMetadata((await read(sampleEvent, 'text/html')).text, sampleEvent);

  assert(robotsResponse.text.includes(`${baseUrl}/sitemap-index.xml`), 'robots sitemap URL missing');
  const sitemap = sitemapResponse.text;
  const sitemapStablecoins = new Set([...sitemap.matchAll(/<loc>https:\/\/sog\.badjoke-lab\.com\/stablecoin\/([^<]+)\/<\/loc>/g)].map((match) => match[1]));
  const sitemapOrganizations = new Set([...sitemap.matchAll(/<loc>https:\/\/sog\.badjoke-lab\.com\/issuer\/([^<]+)\/<\/loc>/g)].map((match) => match[1]));
  const sitemapEvents = new Set([...sitemap.matchAll(/<loc>https:\/\/sog\.badjoke-lab\.com\/event\/([^<]+)\/<\/loc>/g)].map((match) => match[1]));
  assert(sitemapStablecoins.size === counts.primary_records, `sitemap stablecoin URLs ${sitemapStablecoins.size}, expected ${counts.primary_records}`);
  assert(sitemapOrganizations.size === breakdown.organizations, `sitemap organization URLs ${sitemapOrganizations.size}, expected ${breakdown.organizations}`);
  assert(sitemapEvents.size === counts.events, `sitemap event URLs ${sitemapEvents.size}, expected ${counts.events}`);

  const combinedHtml = [homeText, stablecoinsText, organizationsText, eventsText].join('\n');
  for (const marker of ['Issuer records 16', 'Stablecoins linked 20', '23 of 23 events', 'Events 23']) {
    assert(!combinedHtml.includes(marker), `legacy production marker remains: ${marker}`);
  }

  assert(llmsText.includes('/data/manifest.json'), 'llms.txt manifest route missing');
  assert(llmsText.includes('/ai.txt'), 'llms.txt AI route missing');
  assert(llmsText.includes('not live market data'), 'llms.txt warning missing');
  assert(aiText.includes('Version endpoint: /version.json'), 'ai.txt version endpoint missing');
  assert(aiText.includes('LLM guide: /llms.txt'), 'ai.txt LLM guide missing');
  assert(aiText.includes('reviewed public registry information only'), 'ai.txt public-data boundary missing');

  return {
    ok: true,
    base_url: baseUrl,
    schema_version: version.schema_version,
    build: version.build,
    record_counts: counts,
    record_count_breakdown: {
      stablecoins: counts.primary_records,
      organizations: breakdown.organizations,
      events: counts.events,
      evidence: counts.evidence,
      source_identities: breakdown.evidence_source_identities,
      reserve_reports: breakdown.reserve_reports,
      deployments: breakdown.deployments,
      known_unknowns: breakdown.known_unknowns,
      regulatory_notes: breakdown.regulatory_notes
    },
    html_detail_links: {
      stablecoins: stablecoinLinks.size,
      organizations: organizationLinks.size,
      events: eventLinks.size
    },
    sitemap_detail_urls: {
      stablecoins: sitemapStablecoins.size,
      organizations: sitemapOrganizations.size,
      events: sitemapEvents.size
    },
    records_last_reviewed_at: version.data.records_last_reviewed_at
  };
}

let lastError;
for (let attempt = 1; attempt <= attempts; attempt += 1) {
  try {
    const result = await checkOnce();
    console.log(JSON.stringify({ ...result, attempt }, null, 2));
    process.exit(0);
  } catch (error) {
    lastError = error;
    console.error(`Production check attempt ${attempt}/${attempts} failed: ${error.message}`);
    if (attempt < attempts) await sleep(delayMs);
  }
}

throw lastError;
