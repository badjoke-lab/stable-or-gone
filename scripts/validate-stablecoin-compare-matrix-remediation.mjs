import fs from 'node:fs';
import './validate-stablecoin-compare-matrix-remediation-authority.mjs';

const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const read = (path) => fs.readFileSync(path, 'utf8');

const pagePath = 'src/pages/stablecoins/index.astro';
const scriptPath = 'src/scripts/stablecoin-index.ts';
const sourcePath = 'src/components/StablecoinComparisonSource.astro';
for (const path of [pagePath, scriptPath, sourcePath]) check(fs.existsSync(path), `missing implementation file: ${path}`);

if (failures.length === 0) {
  const page = read(pagePath);
  const script = read(scriptPath);
  const source = read(sourcePath);

  for (const marker of [
    'data-comparison-differences',
    'Differences only',
    'comparison-matrix-shell',
    'data-comparison-grid',
    'Select two to four records'
  ]) check(page.includes(marker), `stablecoin register missing comparison marker: ${marker}`);

  for (const marker of [
    "table.className = 'comparison-matrix'",
    "attributeHead.textContent = 'Attribute'",
    'data.removeComparison',
    'data-remove-comparison',
    'compareDifferences?.addEventListener',
    "selectedComparisons.size >= 4",
    "slice(0, 4)",
    "new Set(values.map(normalize)).size > 1",
    "normalized === 'unknown'",
    "normalized === 'not recorded'",
    'selectedComparisons.delete(slug)',
    "writeUrl('push')"
  ]) check(script.includes(marker), `comparison runtime missing marker: ${marker}`);

  check(!script.includes('source.cloneNode(true)'), 'legacy stacked comparison clone renderer must be removed');
  check(!script.includes("clone.classList.add('comparison-record')"), 'legacy comparison-record dossier renderer must be removed');

  for (const label of [
    'Lifecycle', 'Issuance', 'Asset class', 'Launch', 'Reference', 'Backing', 'Stabilization',
    'Reserve disclosure', 'Redemption', 'Organizations / control', 'Deployments', 'Linked events',
    'Source identities', 'Evidence relations', 'Known unknowns'
  ]) check(script.includes(`label: '${label}'`), `comparison row missing: ${label}`);

  for (const key of [
    'lifecycle', 'issuance', 'asset_class', 'launch', 'reference', 'backing', 'stabilization',
    'reserve_disclosure', 'redemption', 'organizations_control', 'deployments', 'linked_events',
    'source_identities', 'evidence_relations', 'known_unknowns'
  ]) check(source.includes(`data-compare-value="${key}"`), `comparison source value missing: ${key}`);

  check(source.includes('data-record-name={record.name}'), 'comparison source must expose stablecoin name');
  check(source.includes('data-record-symbol={record.symbol'), 'comparison source must expose stablecoin symbol');
  check(source.includes('data-record-href='), 'comparison source must expose dossier href');

  const combined = `${page}\n${script}\n${source}`.toLowerCase();
  for (const forbidden of ['winner', 'loser', 'safety score', 'risk score', 'recommended stablecoin']) {
    check(!combined.includes(forbidden), `forbidden comparison framing detected: ${forbidden}`);
  }
}

const result = {
  schema_version: '1.0',
  generated_at: new Date().toISOString(),
  ok: failures.length === 0,
  route: '/stablecoins/',
  selection_contract: '2-4 selected records; fifth rejected',
  rendering_contract: 'one attribute-by-record matrix; no stacked dossier clones',
  canonical_delta: 0,
  failures
};

fs.mkdirSync('artifacts', { recursive: true });
fs.writeFileSync('artifacts/stablecoin-compare-matrix-remediation-validation.json', `${JSON.stringify(result, null, 2)}\n`);
console.log(JSON.stringify(result, null, 2));
if (failures.length) process.exit(1);
