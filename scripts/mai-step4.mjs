import fs from 'node:fs';
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const write = (file, value) => fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
const count = (files = []) => files.flatMap((file) => read(file)).length;
const date = '2026-06-24';

const baselineFile = 'docs/migration/registry-v2-baseline.json';
const baseline = read(baselineFile);
baseline.baseline_id = 'sog_registry_v2_mai_lineage_2026_06_24';
baseline.captured_at = date;
baseline.source_commit = 'mai-lineage';
for (const [name, files] of Object.entries(baseline.data_groups ?? {})) baseline.minimum_counts[name] = count(files);
write(baselineFile, baseline);

const foundation = read('docs/migration/registry-v3-foundation.json');
const income = read('docs/migration/registry-v3-income-profiles.json');
const queue = read('data/quality/launch-date-unresolved.json');
const v3File = 'docs/migration/registry-v3-baseline.json';
const v3 = read(v3File);
v3.baseline_id = 'sog_registry_v3_mai_lineage_2026_06_24';
v3.recorded_at = date;
v3.data_checkpoint_commit = 'mai-lineage';
for (const [name, value] of Object.entries(baseline.minimum_counts)) {
  if (!['classification_extensions', 'evidence_relations'].includes(name)) v3.expected_counts[name] = value;
}
for (const [name, files] of Object.entries(foundation.data_groups ?? {})) v3.expected_counts[name] = count(files);
v3.expected_counts.income_profiles = count(income.data_files);
v3.quality.launch_date_unresolved = queue.expected_total;
write(v3File, v3);

let readme = fs.readFileSync('README.md', 'utf8');
readme = readme
  .replace(/\d+ events/, `${baseline.minimum_counts.events} events`)
  .replace(/\d+ Event v2 detail records/, `${baseline.minimum_counts.event_details} Event v2 detail records`)
  .replace(/\d+ evidence records/, `${baseline.minimum_counts.evidence} evidence records`)
  .replace(/\d+ evidence relation projections/, `${baseline.minimum_counts.evidence} evidence relation projections`)
  .replace(/\d+ known unknowns/, `${baseline.minimum_counts.known_unknowns} known unknowns`)
  .replace(/\d+ unresolved launch dates/, `${queue.expected_total} unresolved launch dates`);
fs.writeFileSync('README.md', readme);

const reviewFile = 'docs/audits/remaining-launch-date-review.md';
if (fs.existsSync(reviewFile)) {
  let review = fs.readFileSync(reviewFile, 'utf8');
  review = review
    .replace(/Category C:\s+21/g, 'Category C:                          20')
    .replace(/Remaining launch_date null:\s+27/g, 'Remaining launch_date null:         26')
    .replace(/Missing launch dates:\s+27/g, 'Missing launch dates:             26');
  fs.writeFileSync(reviewFile, review);
}

let roadmap = fs.readFileSync('docs/roadmap.md', 'utf8');
roadmap = roadmap
  .replace('122 events', `${baseline.minimum_counts.events} events`)
  .replace('122 Event v2 detail records', `${baseline.minimum_counts.event_details} Event v2 detail records`)
  .replace('372 evidence records', `${baseline.minimum_counts.evidence} evidence records`)
  .replace('Missing canonical launch dates:            27', `Missing canonical launch dates:            ${queue.expected_total}`)
  .replace('Total unresolved: 27', `Total unresolved: ${queue.expected_total}`)
  .replace('Category C:        21', 'Category C:        20')
  .replace('fxUSD  — public availability separated from announcement, seeding, and same-proxy V2 upgrade', 'fxUSD  — public availability separated from announcement, seeding, and same-proxy V2 upgrade\nMAI    — Polygon public launch fixed while rename and V2 activation remain unresolved')
  .replace('3. Audit MAI as the next bounded Category C rebrand and deployment-boundary record.', '3. Audit Stables Labs USDX as the next bounded Category C launch-boundary record.')
  .replace('4. Separate miMATIC launch, MAI rename, current multi-chain deployments, and any canonical or bridged contract boundaries.', '4. Separate USDX announcement, public mint availability, approved-participant access, and sUSDX wrapper launch.')
  .replace('5. Assign no MAI launch or rebrand date without day-level first-party evidence.', '5. Assign no USDX launch date without day-level first-party production evidence.');
fs.writeFileSync('docs/roadmap.md', roadmap);

fs.writeFileSync('docs/audits/mai-mimatic-launch-lineage.md', `# MAI / miMATIC launch and lineage audit\n\nRecorded: 2026-06-24\n\n## Decision\n\n- Canonical public-availability launch: 2021-05-02\n- Launch network: Polygon\n- Current name: MAI\n- Historical name: miMATIC\n- Polygon token: 0xa3Fa99A148fA48D14Ed51d610c367C61876997F1\n- V2 introduction article: 2022-06-28\n- Exact miMATIC-to-MAI rename day: unresolved\n- Exact V2 production activation transaction: unresolved\n\n## Launch boundary\n\nQiDao's May 2, 2021 first-party guide documents an operating application, a current MAI debt ceiling, vault creation, collateral deposits, and MAI borrowing on Polygon. SOG uses that day as the canonical public-availability boundary. A later official V2 article independently states that the first Polygon contracts were deployed in May 2021.\n\n## Name continuity\n\nThe launch guide already describes MAI as previously miMATIC, and the current official glossary preserves the same relationship. This supports one continuous stablecoin identity but does not establish a day-level rename event. The registry therefore retains miMATIC as an alias without inventing a separate rebrand date.\n\n## V2 boundary\n\nQiDao introduced V2 on June 28, 2022 with a new liquidation engine, risk-management process, chain-specific tailoring, and vault-deprecation tools. The source does not identify one exact activation transaction, so the date is recorded as a version announcement rather than a second asset launch.\n\n## Deployment treatment\n\nThe original Polygon MAI token address is normalized as the primary native deployment. Official documentation lists many additional chain addresses, but current support, bridge canonicality, paused fungibility, and retired deployments require a separate inventory audit.\n\n## Remaining unknowns\n\nThe exact rename day, exact V2 activation transaction, and complete current native-versus-bridged deployment map remain unresolved.\n`);

console.log({
  events: baseline.minimum_counts.events,
  event_details: baseline.minimum_counts.event_details,
  evidence: baseline.minimum_counts.evidence,
  known_unknowns: baseline.minimum_counts.known_unknowns,
  deployments: baseline.minimum_counts.deployments,
  launch_unresolved: queue.expected_total
});
