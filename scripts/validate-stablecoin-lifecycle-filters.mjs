import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const htmlPath = path.join(root, 'dist/stablecoins/index.html');
const scriptPath = path.join(root, 'src/scripts/stablecoin-index.ts');
const assert = (condition, message) => { if (!condition) throw new Error(message); };

assert(fs.existsSync(htmlPath), 'dist/stablecoins/index.html is missing');
const html = fs.readFileSync(htmlPath, 'utf8');
const clientScript = fs.readFileSync(scriptPath, 'utf8');

const expectedEventOptions = [
  ['depeg', 'Depeg and peg stress'],
  ['regulatory', 'Regulatory action'],
  ['redemption', 'Redemption change'],
  ['migration', 'Migration and rebrand'],
  ['failure', 'Failure and collapse'],
  ['wind_down', 'Wind-down and termination'],
];
const expectedRecoveryOptions = [
  ['recovered', 'Recovered'],
  ['partially_recovered', 'Partially recovered'],
  ['not_recovered', 'Not recovered'],
  ['collapsed', 'Collapsed'],
  ['unknown', 'Unknown or unresolved'],
];

assert(html.includes('data-filter-group="event_lifecycle"'), 'Event lifecycle filter group missing');
assert(html.includes('data-filter-group="depeg_recovery"'), 'Depeg recovery filter group missing');
for (const [value, label] of expectedEventOptions) {
  assert(html.includes(`data-filter-group="event_lifecycle"`) && html.includes(`value="${value}"`), `Event lifecycle option ${value} missing`);
  assert(html.includes(`>${label}</span>`), `Event lifecycle label ${label} missing`);
}
for (const [value, label] of expectedRecoveryOptions) {
  assert(html.includes(`data-filter-group="depeg_recovery"`) && html.includes(`value="${value}"`), `Depeg recovery option ${value} missing`);
  assert(html.includes(`>${label}</span>`), `Depeg recovery label ${label} missing`);
}
assert(!/data-filter-group="depeg_recovery"[^>]*value="not_applicable"/.test(html), 'Depeg recovery must not expose not_applicable');

function rowAttributes(slug) {
  const match = html.match(new RegExp(`<tr[^>]*data-registry-row[^>]*data-record-slug="${slug}"[^>]*>`));
  assert(match, `Registry row for ${slug} missing`);
  return match[0];
}
function attributeValues(tag, name) {
  const match = tag.match(new RegExp(`${name}="([^"]*)"`));
  assert(match, `${name} missing from representative row`);
  return new Set(match[1].split(',').filter(Boolean));
}

const usdc = rowAttributes('usdc');
assert(attributeValues(usdc, 'data-event-lifecycle').has('depeg'), 'USDC depeg lifecycle metadata missing');
assert(attributeValues(usdc, 'data-depeg-recovery').has('recovered'), 'USDC recovered depeg metadata missing');

const ust = rowAttributes('ust');
assert(attributeValues(ust, 'data-event-lifecycle').has('depeg'), 'UST depeg lifecycle metadata missing');
assert(attributeValues(ust, 'data-depeg-recovery').has('collapsed'), 'UST collapsed depeg metadata missing');

const busd = rowAttributes('busd');
const busdLifecycle = attributeValues(busd, 'data-event-lifecycle');
assert(busdLifecycle.has('migration') || busdLifecycle.has('wind_down'), 'BUSD migration/wind-down lifecycle metadata missing');

assert(clientScript.includes("'event_lifecycle', 'depeg_recovery'"), 'Client filter groups do not include Phase 3 lifecycle groups');
assert(clientScript.includes("multiValueGroups.has(group)"), 'Client filter engine lacks multi-value group handling');
assert(clientScript.includes('selected.some((value) => currentValues.has(value))'), 'Client filter engine lacks within-group OR semantics');

console.log(JSON.stringify({
  ok: true,
  filter_groups: ['event_lifecycle', 'depeg_recovery'],
  event_lifecycle_options: expectedEventOptions.map(([value]) => value),
  depeg_recovery_options: expectedRecoveryOptions.map(([value]) => value),
  representative_checks: ['usdc_depeg_recovered', 'ust_depeg_collapsed', 'busd_migration_or_wind_down'],
  semantics: 'OR within each multi-value facet; AND across facet groups',
}, null, 2));
