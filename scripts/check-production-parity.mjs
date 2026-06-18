const base = (process.env.SOG_BASE_URL || 'https://sog.badjoke-lab.com').replace(/\/$/, '');
const wantedCommit = process.env.SOG_EXPECTED_COMMIT || process.env.GITHUB_SHA || '';
const tries = Number(process.env.SOG_SMOKE_ATTEMPTS || 12);
const delay = Number(process.env.SOG_SMOKE_DELAY_MS || 15000);
const floor = { primary_records: 70, events: 92, evidence: 279, organizations: 59, reserve_reports: 72, known_unknowns: 153, regulatory_notes: 9, deployments: 101 };
const assert = (ok, message) => { if (!ok) throw new Error(message); };
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const count = (text, value) => text.split(value).length - 1;

async function get(path, type) {
  const response = await fetch(`${base}${path}`, { headers: { accept: type, 'user-agent': 'sog-production-parity' } });
  assert(response.ok, `${path} returned ${response.status}`);
  assert((response.headers.get('content-type') || '').includes(type), `${path} content type mismatch`);
  return response.text();
}

function checkHtml(path, html, commit) {
  const url = `${base}${path}`;
  assert(html.includes(`<link rel="canonical" href="${url}">`), `${path} canonical mismatch`);
  assert(html.includes(`<link rel="alternate" hreflang="en" href="${url}">`), `${path} alternate missing`);
  assert(html.includes(`<meta property="og:url" content="${url}">`), `${path} OG mismatch`);
  assert(html.includes('<meta name="description" content="'), `${path} description missing`);
  assert(html.includes('<script type="application/ld+json">'), `${path} JSON-LD missing`);
  assert(html.includes(`<meta name="sog-build-commit" content="${commit}">`), `${path} build mismatch`);
  assert(html.includes('<meta name="sog-canonical-only" content="true">'), `${path} canonical flag missing`);
}

async function run() {
  const [versionRaw, manifestRaw, home, coins, orgs, events, sitemap, robots, llms, ai] = await Promise.all([
    get('/version.json', 'application/json'), get('/data/manifest.json', 'application/json'),
    get('/', 'text/html'), get('/stablecoins/', 'text/html'), get('/issuers/', 'text/html'), get('/events/', 'text/html'),
    get('/sitemap-index.xml', 'application/xml'), get('/robots.txt', 'text/plain'), get('/llms.txt', 'text/plain'), get('/ai.txt', 'text/plain')
  ]);
  const version = JSON.parse(versionRaw);
  const manifest = JSON.parse(manifestRaw);
  const main = version.data.record_counts;
  const more = version.data.record_count_breakdown;
  const commit = version.build.commit;

  assert(version.data.data_schema_version === 'sog_registry_v2_v3', 'schema mismatch');
  assert(version.canonical_data_source.runtime_loader === 'src/lib/data/registry.ts', 'canonical source mismatch');
  assert(version.data_safety.canonical_only === true, 'canonical safety flag missing');
  assert(commit && commit !== 'unknown', 'build commit missing');
  if (wantedCommit) assert(commit === wantedCommit, `deployed ${commit}, expected ${wantedCommit}`);
  for (const key of ['primary_records', 'events', 'evidence']) assert(main[key] >= floor[key], `${key} below checkpoint`);
  for (const key of ['organizations', 'reserve_reports', 'known_unknowns', 'regulatory_notes', 'deployments']) assert(more[key] >= floor[key], `${key} below checkpoint`);
  assert(JSON.stringify(manifest.record_counts) === JSON.stringify(main), 'manifest count mismatch');
  assert(JSON.stringify(manifest.record_count_breakdown) === JSON.stringify(more), 'manifest breakdown mismatch');

  assert(home.includes(`<span>Stablecoins</span><strong>${main.primary_records}</strong>`), 'home stablecoin count mismatch');
  assert(home.includes(`<span>Events</span><strong>${main.events}</strong>`), 'home event count mismatch');
  assert(count(coins, '<tr data-registry-row') === main.primary_records, 'stablecoin row mismatch');
  assert(count(events, '<tr data-event-row') === main.events, 'event row mismatch');
  assert(orgs.includes(`<span>Organizations</span><strong>${more.organizations}</strong>`), 'organization count mismatch');

  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  const detailUrls = urls.filter((url) => /\/(stablecoin|issuer|event)\//.test(url));
  assert(urls.filter((url) => url.startsWith(`${base}/stablecoin/`)).length === main.primary_records, 'sitemap stablecoin mismatch');
  assert(urls.filter((url) => url.startsWith(`${base}/issuer/`)).length === more.organizations, 'sitemap organization mismatch');
  assert(urls.filter((url) => url.startsWith(`${base}/event/`)).length === main.events, 'sitemap event mismatch');
  assert(robots.includes(`Sitemap: ${base}/sitemap-index.xml`), 'robots mismatch');
  [['/', home], ['/stablecoins/', coins], ['/issuers/', orgs], ['/events/', events]].forEach(([path, html]) => checkHtml(path, html, commit));

  for (let i = 0; i < detailUrls.length; i += 16) {
    const batch = detailUrls.slice(i, i + 16);
    const pages = await Promise.all(batch.map((url) => get(url.slice(base.length), 'text/html')));
    pages.forEach((html, index) => checkHtml(batch[index].slice(base.length), html, commit));
  }

  const text = [home, coins, orgs, events, llms, ai].join('\n').toLowerCase();
  for (const old of ['20 records / 16 issuers', '20 of 20 records', '23 events', '40 stable assets']) assert(!text.includes(old), `stale count remains: ${old}`);
  assert(llms.includes(`- Stablecoins: ${main.primary_records}`), 'llms count mismatch');
  assert(ai.includes(`Stablecoins: ${main.primary_records}`), 'ai count mismatch');
  return { ok: true, build: version.build, record_counts: main, record_count_breakdown: more, verified_html_routes: detailUrls.length + 4 };
}

let error;
for (let attempt = 1; attempt <= tries; attempt += 1) {
  try { console.log(JSON.stringify({ ...(await run()), attempt }, null, 2)); error = null; break; }
  catch (caught) { error = caught; console.error(`attempt ${attempt}/${tries}: ${caught.message}`); if (attempt < tries) await sleep(delay); }
}
if (error) throw error;
