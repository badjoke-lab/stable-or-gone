import fs from 'node:fs';

const from = new URL('./audit-registry-lifecycle-boundaries.mjs', import.meta.url);
const to = new URL('./tmp-lifecycle-boundary-audit-current.mjs', import.meta.url);
let source = fs.readFileSync(from, 'utf8');

const stablecoinAnchor = "const stablecoins = loadFiles(baseline.data_groups?.stablecoins);";
const stablecoinReplacement = `
const stablecoinBaseRows = loadFiles(baseline.data_groups?.stablecoins);
const stablecoinOverrideRows = [
  ...readJson('data/stablecoin-overrides-pr033.json'),
  ...readJson('data/stablecoin-overrides-pr034.json')
];
const stablecoinOverrideById = new Map(stablecoinOverrideRows.map((row) => [row.id, row]));
const stablecoins = stablecoinBaseRows.map((row) => ({ ...row, ...(stablecoinOverrideById.get(row.id) ?? {}) }));`;

const launchQueueAnchor = "const launchQueue = readJson('data/quality/launch-date-unresolved.json');";
const launchQueueReplacement = `
const launchQueueBase = readJson('data/quality/launch-date-unresolved.json');
const launchQueueGrowthFiles = fs.readdirSync(absolute('data/quality'))
  .filter((name) => /^launch-date-unresolved-growth-pr\\d+\\.json$/.test(name))
  .sort();
const launchQueueGrowthRecords = launchQueueGrowthFiles.flatMap((name) => readJson(\`data/quality/\${name}\`).records ?? []);
const launchQueue = { ...launchQueueBase, records: [...(launchQueueBase.records ?? []), ...launchQueueGrowthRecords] };`;

const terminalCoverageAnchor = "if (terminalLegacyStatuses.has(coin.status) && terminalEvents.length === 0) terminalAssetsWithoutBoundaryEvent.push(coin.id);";
const terminalCoverageReplacement = "if (['terminated', 'collapsed', 'migrated', 'rebranded'].includes(classification.lifecycle_status) && terminalEvents.length === 0) terminalAssetsWithoutBoundaryEvent.push(coin.id);";

if (!source.includes(stablecoinAnchor)) throw new Error('stablecoin audit anchor missing');
if (!source.includes(launchQueueAnchor)) throw new Error('launch queue audit anchor missing');
if (!source.includes(terminalCoverageAnchor)) throw new Error('terminal coverage audit anchor missing');

source = source
  .replace(stablecoinAnchor, stablecoinReplacement)
  .replace(launchQueueAnchor, launchQueueReplacement)
  .replace(terminalCoverageAnchor, terminalCoverageReplacement);
fs.writeFileSync(to, source);
try {
  await import(to.href);
} finally {
  fs.rmSync(to, { force: true });
}
