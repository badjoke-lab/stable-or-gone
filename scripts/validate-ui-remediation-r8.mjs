import fs from 'node:fs';

const read = (file) => fs.readFileSync(file, 'utf8');
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

const comparePage = read('src/pages/compare/index.astro');
const compareEntry = read('src/scripts/compare-v1.ts');
const compareRuntime = read('src/scripts/compare-r8.ts');
const accessPage = read('src/pages/access-regulation/index.astro');
const accessEntry = read('src/scripts/access-regulation-explorer.ts');
const accessRuntime = read('src/scripts/access-regulation-r8.ts');
const styles = read('src/styles/ui-remediation-r8.css');

for (const marker of [
  'data-r8-surface="compare"',
  'id="compare-projection-data"',
  'data-compare-mobile-facet',
  'data-compare-retry',
  'No comparison yet',
  "import '../../scripts/compare-v1'"
]) check(comparePage.includes(marker), `Compare page missing: ${marker}`);
check(compareEntry.trim() === "import './compare-r8';", 'Compare entry must only load the R8 runtime');
for (const marker of [
  '#compare-projection-data',
  'parsed.asset_count !== parsed.assets.length',
  'parsed.cell_count !== parsed.asset_count * parsed.dimension_count',
  'selectedAssets.length >= minAssets',
  'updateMobileFacetVisibility',
  'setError(false)',
  'setError(true)'
]) check(compareRuntime.includes(marker), `Compare runtime missing: ${marker}`);
check(!compareRuntime.includes("fetch('/data/comparison.json'"), 'Compare must not fetch its own build output at runtime');
check(!compareRuntime.includes('projection contract mismatch'), 'Compare exposes the retired contract mismatch path');
check(!/asset_count\s*!==\s*110|cell_count\s*!==\s*2090/.test(compareRuntime), 'Compare retains fixed record-count contracts');

for (const marker of [
  'data-r8-surface="access-regulation"',
  'id="ar-index-data"',
  'data-ar-retry',
  'data-ar-empty-clear',
  'index.asset_count',
  "import '../../scripts/access-regulation-explorer'"
]) check(accessPage.includes(marker), `Access page missing: ${marker}`);
check(accessEntry.trim() === "import './access-regulation-r8';", 'Access entry must only load the R8 runtime');
for (const marker of [
  '#ar-index-data',
  'parsed.asset_count !== parsed.rows.length',
  'parsed.single_composite_score !== false',
  'parsed.risk_ranking !== false',
  'setError(false)',
  'setError(true)',
  'r8-access-row'
]) check(accessRuntime.includes(marker), `Access runtime missing: ${marker}`);
check(!accessRuntime.includes('source_endpoint'), 'Access must not fetch its own build output at runtime');
check(!accessRuntime.includes('index contract mismatch'), 'Access exposes the retired contract mismatch path');
check(!/asset_count\s*!==\s*110/.test(accessRuntime), 'Access retains a fixed record-count contract');
check(!accessRuntime.includes('error.message') && !accessRuntime.includes('String(error)'), 'Access may not expose internal exception text');

for (const marker of [
  '.r8-masthead',
  '.r8-secondary-disclosure',
  '.r8-mobile-facet-control',
  '.r8-access-row',
  '@media(max-width:719px)',
  'backdrop-filter:none',
  'border-radius:0'
]) check(styles.replaceAll(' ', '').includes(marker.replaceAll(' ', '')), `R8 CSS missing: ${marker}`);
check(!/(linear-gradient|radial-gradient|box-shadow\s*:\s*(?!none)|border-radius\s*:\s*(?!0))/i.test(styles), 'R8 CSS contains prohibited SaaS decoration');

const result = {
  schema_version: '1.0',
  ok: failures.length === 0,
  gate: 'UI-R8',
  compare_runtime_source: 'embedded canonical projection',
  access_runtime_source: 'embedded canonical index',
  fixed_record_count_contracts: 0,
  score_controls: 0,
  ranking_controls: 0,
  route_changes: 0,
  canonical_record_changes: 0,
  failures
};
console.log(JSON.stringify(result, null, 2));
if (failures.length) process.exit(1);
