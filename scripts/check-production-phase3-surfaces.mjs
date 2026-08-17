import { PUBLIC_ORIGIN } from '../config/public-origin.mjs';

const origin = (process.env.SOG_BASE_URL || PUBLIC_ORIGIN).replace(/\/$/, '');
const expectedCommit = process.env.SOG_EXPECTED_COMMIT || process.env.GITHUB_SHA || null;
const attempts = Number(process.env.SOG_SMOKE_ATTEMPTS || 5);
const delayMs = Number(process.env.SOG_SMOKE_DELAY_MS || 10000);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const assert = (condition, message) => { if (!condition) throw new Error(message); };

async function read(pathname, accept) {
  const response = await fetch(`${origin}${pathname}?phase3_build=${encodeURIComponent(expectedCommit || Date.now())}`, {
    headers: { accept, 'cache-control': 'no-store', 'user-agent': 'sog-phase3-production-check/1.0' }
  });
  assert(response.ok, `${pathname}: HTTP ${response.status}`);
  const contentType = response.headers.get('content-type') || '';
  assert(contentType.includes(accept), `${pathname}: unexpected content type ${contentType}`);
  return response.text();
}

function openingTags(html, marker) {
  return [...html.matchAll(/<[^>]+>/g)].map((match) => match[0]).filter((tag) => tag.includes(marker));
}

function tagForSlug(html, marker, slug) {
  const tag = openingTags(html, marker).find((candidate) => candidate.includes(`data-record-slug="${slug}"`));
  assert(tag, `${slug}: ${marker} tag missing`);
  return tag;
}

function attr(tag, name) {
  const match = tag.match(new RegExp(`${name}="([^"]*)"`));
  return match?.[1] ?? '';
}

function comparisonSourceBlock(html, slug) {
  const sources = [...html.matchAll(/<div\b[^>]*data-comparison-source[^>]*>/g)];
  const index = sources.findIndex((match) => match[0].includes(`data-record-slug="${slug}"`));
  assert(index >= 0, `${slug}: comparison source missing`);
  const start = sources[index].index;
  const end = sources[index + 1]?.index ?? html.length;
  return html.slice(start, end);
}

function compareValue(html, slug, key) {
  const block = comparisonSourceBlock(html, slug);
  const match = block.match(new RegExp(`data-compare-value="${key}"[^>]*>([^<]*)<`));
  assert(match, `${slug}: Compare ${key} missing`);
  return match[1].replaceAll('&amp;', '&').replaceAll('&#39;', "'").replaceAll('&quot;', '"').trim();
}

async function checkOnce() {
  const version = JSON.parse(await read('/version.json', 'application/json'));
  assert(version.build?.commit, 'version build commit missing');
  if (expectedCommit) assert(version.build.commit === expectedCommit, `production commit ${version.build.commit} != ${expectedCommit}`);

  const manifest = JSON.parse(await read('/data/manifest.json', 'application/json'));
  assert(manifest.public_files?.stablecoin_record_template === '/data/stablecoin/{slug}.json', 'Stage 3 stablecoin dossier template missing');
  assert(manifest.record_dossiers?.stablecoin?.record_count === version.data?.record_counts?.primary_records, 'Stage 3 dossier count mismatch');

  const stablecoinsHtml = await read('/stablecoins/', 'text/html');
  assert(stablecoinsHtml.includes('Event lifecycle'), 'Stage 4 Event lifecycle filter missing');
  assert(stablecoinsHtml.includes('Depeg recovery'), 'Stage 4 Depeg recovery filter missing');
  assert(stablecoinsHtml.includes('data-filter-group="event_lifecycle"'), 'Stage 4 event lifecycle controls missing');
  assert(stablecoinsHtml.includes('data-filter-group="depeg_recovery"'), 'Stage 4 depeg recovery controls missing');

  const usdcRow = tagForSlug(stablecoinsHtml, 'data-registry-row', 'usdc');
  const ustRow = tagForSlug(stablecoinsHtml, 'data-registry-row', 'ust');
  const busdRow = tagForSlug(stablecoinsHtml, 'data-registry-row', 'busd');
  assert(attr(usdcRow, 'data-event-lifecycle').split(',').includes('depeg'), 'USDC depeg filter projection missing');
  assert(attr(usdcRow, 'data-depeg-recovery').split(',').includes('recovered'), 'USDC recovered filter projection missing');
  assert(attr(ustRow, 'data-event-lifecycle').split(',').includes('failure'), 'UST failure filter projection missing');
  assert(attr(ustRow, 'data-event-lifecycle').split(',').includes('depeg'), 'UST typed depeg filter projection missing');
  assert(attr(ustRow, 'data-depeg-recovery').split(',').includes('collapsed'), 'UST collapsed filter projection missing');
  const busdLifecycle = attr(busdRow, 'data-event-lifecycle').split(',');
  assert(busdLifecycle.includes('migration') || busdLifecycle.includes('wind_down'), 'BUSD migration/wind-down filter projection missing');

  for (const [slug, key, expected] of [
    ['usdc', 'depeg_recovery_state', 'Recovered'],
    ['usdc', 'recovery_dates', '2023-03-13'],
    ['ust', 'depeg_recovery_state', 'Collapsed']
  ]) assert(compareValue(stablecoinsHtml, slug, key).includes(expected), `${slug}: Stage 5 ${key} expected ${expected}`);
  for (const [slug, key] of [
    ['ust', 'failure_mechanisms'],
    ['busd', 'migration_termination_history'],
    ['usdt', 'regulatory_history'],
    ['dai', 'migration_termination_history']
  ]) assert(compareValue(stablecoinsHtml, slug, key) !== 'Not recorded', `${slug}: Stage 5 ${key} not projected`);

  const stats = JSON.parse(await read('/data/stats.json', 'application/json'));
  const quality = stats.events?.lifecycle_quality;
  assert(quality, 'Stage 6 events.lifecycle_quality missing');
  for (const key of ['regulatory', 'redemption_change', 'migration_or_termination']) {
    assert(Number(quality[key]?.event_count) > 0, `Stage 6 ${key} event_count missing`);
    assert(Number(quality[key]?.asset_coverage?.count) > 0, `Stage 6 ${key} asset coverage missing`);
  }
  assert(Number(quality.depeg?.event_count) > 0, 'Stage 6 depeg event_count missing');
  assert(Number(quality.depeg?.recovery_state_recorded?.denominator) === Number(quality.depeg?.event_count), 'Stage 6 depeg recovery denominator mismatch');

  const statsHtml = await read('/stats/', 'text/html');
  for (const marker of ['Recorded event lifecycle', 'Depeg recovery status', 'Typed lifecycle-event kinds', 'Migration / termination']) {
    assert(statsHtml.includes(marker), `Stage 6 Stats UI marker missing: ${marker}`);
  }

  return {
    ok: true,
    commit: version.build.commit,
    stablecoin_records: version.data?.record_counts?.primary_records,
    lifecycle_quality: quality
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
    console.error(`Phase 3 production check ${attempt}/${attempts} failed: ${error.message}`);
    if (attempt < attempts) await sleep(delayMs);
  }
}
throw lastError;
