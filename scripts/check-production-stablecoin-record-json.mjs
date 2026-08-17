import fs from 'node:fs';
import path from 'node:path';
import { PUBLIC_ORIGIN } from '../config/public-origin.mjs';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const root = process.cwd();
const origin = (process.env.SOG_BASE_URL || PUBLIC_ORIGIN).replace(/\/$/, '');
const expectedCommit = process.env.SOG_EXPECTED_COMMIT || process.env.GITHUB_SHA || null;
const concurrency = Number(process.env.SOG_PARITY_CONCURRENCY || 12);
const attempts = Number(process.env.SOG_SMOKE_ATTEMPTS || 5);
const delayMs = Number(process.env.SOG_SMOKE_DELAY_MS || 10000);
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function readRows(relativePath) {
  const value = JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
  if (Array.isArray(value)) return value;
  if (Array.isArray(value.records)) return value.records;
  throw new Error(`${relativePath}: expected an array or records array`);
}

const baseline = loadRegistryV2Baseline(root);
const stablecoinsById = new Map();
for (const file of baseline.data_groups?.stablecoins ?? []) {
  for (const row of readRows(file)) stablecoinsById.set(row.id, row);
}
const stablecoins = [...stablecoinsById.values()].sort((left, right) => left.id.localeCompare(right.id));

async function readJson(pathname, cacheBust) {
  const response = await fetch(`${origin}${pathname}?sog_build=${encodeURIComponent(cacheBust)}`, {
    headers: {
      accept: 'application/json',
      'user-agent': 'sog-production-stablecoin-record-json/1.0',
      'cache-control': 'no-store',
    },
  });
  assert(response.ok, `${pathname}: HTTP ${response.status}`);
  assert((response.headers.get('content-type') || '').includes('application/json'), `${pathname}: JSON content type missing`);
  return response.json();
}

async function waitForExpectedManifest() {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const cacheBust = `${expectedCommit || 'unknown'}-${attempt}-${Date.now()}`;
    try {
      const manifest = await readJson('/data/manifest.json', cacheBust);
      if (expectedCommit) assert(manifest.build?.commit === expectedCommit, `manifest commit ${manifest.build?.commit} does not match expected ${expectedCommit}`);
      assert(manifest.public_files?.stablecoin_record_template === '/data/stablecoin/{slug}.json', 'manifest stablecoin record template missing');
      assert(manifest.record_dossiers?.stablecoin?.record_count === stablecoins.length, 'manifest stablecoin record count mismatch');
      return { manifest, cacheBust, attempt };
    } catch (error) {
      lastError = error;
      console.error(`Stablecoin dossier convergence attempt ${attempt}/${attempts} failed: ${error.message}`);
      if (attempt < attempts) await sleep(delayMs);
    }
  }
  throw lastError;
}

async function mapConcurrent(items, limit, worker) {
  let cursor = 0;
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor++;
      await worker(items[index], index);
    }
  });
  await Promise.all(runners);
}

const { manifest, cacheBust, attempt: convergenceAttempt } = await waitForExpectedManifest();
const dossiers = new Map();
await mapConcurrent(stablecoins, concurrency, async (stablecoin) => {
  const pathname = `/data/stablecoin/${stablecoin.slug}.json`;
  const dossier = await readJson(pathname, cacheBust);
  assert(dossier.schema_version === manifest.schema_version, `${pathname}: schema version mismatch`);
  assert(dossier.data_schema_version === manifest.data_schema_version, `${pathname}: data schema mismatch`);
  assert(dossier.project_id === 'stable-or-gone', `${pathname}: project mismatch`);
  assert(dossier.record_type === 'stablecoin', `${pathname}: record type mismatch`);
  assert(dossier.id === stablecoin.id && dossier.slug === stablecoin.slug, `${pathname}: identity mismatch`);
  assert(dossier.record?.id === stablecoin.id && dossier.record?.slug === stablecoin.slug, `${pathname}: canonical record mismatch`);
  assert(dossier.self_url === `${origin}${pathname}`, `${pathname}: self URL mismatch`);
  assert(dossier.canonical_page_url === `${origin}/stablecoin/${stablecoin.slug}/`, `${pathname}: canonical page URL mismatch`);
  assert(dossier.canonical_only === true && dossier.data_safety?.canonical_only === true, `${pathname}: canonical-only marker missing`);
  assert(dossier.includes_unreviewed_candidates === false && dossier.data_safety?.includes_unreviewed_candidates === false, `${pathname}: candidate marker invalid`);
  assert(dossier.build?.commit === manifest.build?.commit, `${pathname}: build commit mismatch`);
  assert(dossier.build?.canonical_data_hash === manifest.build?.canonical_data_hash, `${pathname}: canonical hash mismatch`);
  dossiers.set(stablecoin.slug, dossier);
});

const usdcDepeg = dossiers.get('usdc')?.related?.events?.find((row) => row.id === 'sog_ev_usdc_2023_03_depeg');
assert(usdcDepeg?.depeg_detail?.recovery_status === 'recovered', 'production USDC recovered depeg state missing');
const ustCollapse = dossiers.get('ust')?.related?.events?.find((row) => row.id === 'sog_ev_ust_2022_05_collapse');
assert(ustCollapse?.depeg_detail?.recovery_status === 'collapsed', 'production UST collapsed depeg state missing');
assert(dossiers.get('busd')?.related?.events?.some((row) => row.event_detail_kind === 'migration'), 'production BUSD migration context missing');

console.log(JSON.stringify({
  ok: true,
  origin,
  source_commit: manifest.build?.commit,
  canonical_data_hash: manifest.build?.canonical_data_hash,
  convergence_attempt: convergenceAttempt,
  stablecoin_dossiers: dossiers.size,
  representative_checks: ['usdc_recovered_depeg', 'ust_collapsed_depeg', 'busd_migration_context'],
}, null, 2));
