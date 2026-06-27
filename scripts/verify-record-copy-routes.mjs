import fs from 'node:fs';
import path from 'node:path';
import { stablecoinPublicCopy, getStablecoinPublicSummary } from '../config/stablecoin-public-copy.mjs';
import { resolveEvidenceIdentityId } from '../config/evidence-source-identities.mjs';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const root = process.cwd();
const distDir = path.join(root, 'dist');
const baseline = loadRegistryV2Baseline(root);
const failures = [];

function readRows(relativePath) {
  const parsed = JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
  if (Array.isArray(parsed)) return parsed;
  if (Array.isArray(parsed.records)) return parsed.records;
  throw new Error(`${relativePath}: expected an array or records array`);
}

function group(name) {
  return (baseline.data_groups?.[name] ?? []).flatMap(readRows);
}

function applyById(rows, layers) {
  const maps = layers.map((layer) => new Map(layer.map((row) => [row.id, row])));
  return rows.map((row) => maps.reduce((merged, map) => ({ ...merged, ...(map.get(row.id) ?? {}) }), row));
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

function normalize(value) {
  return String(value ?? '').replace(/\s+/g, ' ').trim();
}

function fail(message) {
  failures.push(message);
}

const stablecoins = applyById(group('stablecoins'), [
  readRows('data/stablecoin-overrides-pr033.json'),
  readRows('data/stablecoin-overrides-pr034.json'),
  group('classifications'),
  group('classification_extensions'),
  group('profiles')
]);
const evidence = group('evidence');
const routes = stablecoins.map((coin) => {
  const route = `/stablecoin/${coin.slug}/`;
  const file = path.join(distDir, 'stablecoin', coin.slug, 'index.html');
  const exists = fs.existsSync(file);
  const html = exists ? fs.readFileSync(file, 'utf8') : '';
  const text = visibleText(html);
  const expectedSummary = getStablecoinPublicSummary(coin.slug, coin.summary);
  const coinEvidence = evidence.filter((row) => row.stablecoin_id === coin.id || row.stablecoin_ids?.includes(coin.id));
  const sourceIdentityCount = new Set(coinEvidence.map((row) => resolveEvidenceIdentityId(row.id))).size;
  const checks = {
    route_exists: exists,
    canonical_present: html.includes(`rel="canonical"`) && html.includes(`https://sog.badjoke-lab.com${route}`),
    title_present: text.includes(coin.name),
    expected_summary_present: text.includes(normalize(expectedSummary)),
    lifecycle_present: text.includes('Lifecycle'),
    issuance_present: text.includes('Issuance'),
    organizations_present: text.includes('Organizations and roles'),
    evidence_records_present: text.includes('Evidence records'),
    source_identities_present: text.includes('Source identities'),
    source_identity_count_present: text.includes(`Source identities ${sourceIdentityCount}`),
    deployments_present: text.includes('Blockchain deployments'),
    sources_present: text.includes('Sources'),
    open_questions_present: text.includes('Open questions')
  };
  const failedChecks = Object.entries(checks).filter(([, passed]) => !passed).map(([name]) => name);
  if (failedChecks.length > 0) fail(`${route}: ${failedChecks.join(', ')}`);

  return {
    stablecoin_id: coin.id,
    slug: coin.slug,
    route,
    summary_source: stablecoinPublicCopy[coin.slug] ? 'curated_copy_layer' : 'canonical_record',
    canonical_evidence_records: coinEvidence.length,
    source_identities: sourceIdentityCount,
    checks,
    pass: failedChecks.length === 0
  };
});

const report = {
  schema_version: '1.0',
  generated_at: new Date().toISOString(),
  baseline_id: baseline.baseline_id,
  totals: {
    expected_routes: stablecoins.length,
    checked_routes: routes.length,
    passing_routes: routes.filter((row) => row.pass).length,
    failing_routes: routes.filter((row) => !row.pass).length,
    curated_copy_routes: routes.filter((row) => row.summary_source === 'curated_copy_layer').length,
    canonical_summary_routes: routes.filter((row) => row.summary_source === 'canonical_record').length
  },
  failures,
  routes
};

const outputPath = path.join(root, 'data/generated/record-copy-route-regression.json');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`);

if (failures.length > 0) {
  console.error(JSON.stringify(report, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ ok: true, totals: report.totals }, null, 2));
