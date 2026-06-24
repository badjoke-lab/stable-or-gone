import fs from 'node:fs';
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const write = (file, value) => fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
const count = (files = []) => files.flatMap((file) => read(file)).length;
const date = '2026-06-24';

const baselineFile = 'docs/migration/registry-v2-baseline.json';
const baseline = read(baselineFile);
baseline.baseline_id = 'sog_registry_v2_fxusd_lineage_2026_06_24';
baseline.captured_at = date;
baseline.source_commit = 'fxusd-lineage';
for (const [name, files] of Object.entries(baseline.data_groups ?? {})) {
  baseline.minimum_counts[name] = count(files);
}
write(baselineFile, baseline);

const foundation = read('docs/migration/registry-v3-foundation.json');
const income = read('docs/migration/registry-v3-income-profiles.json');
const queue = read('data/quality/launch-date-unresolved.json');
const v3File = 'docs/migration/registry-v3-baseline.json';
const v3 = read(v3File);
v3.baseline_id = 'sog_registry_v3_fxusd_lineage_2026_06_24';
v3.recorded_at = date;
v3.data_checkpoint_commit = 'fxusd-lineage';
for (const [name, value] of Object.entries(baseline.minimum_counts)) {
  if (!['classification_extensions', 'evidence_relations'].includes(name)) v3.expected_counts[name] = value;
}
for (const [name, files] of Object.entries(foundation.data_groups ?? {})) {
  v3.expected_counts[name] = count(files);
}
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
    .replace(/Category C:\s+22/g, 'Category C:                          21')
    .replace(/Remaining launch_date null:\s+28/g, 'Remaining launch_date null:         27')
    .replace(/Missing launch dates:\s+28/g, 'Missing launch dates:             27');
  fs.writeFileSync(reviewFile, review);
}

let roadmap = fs.readFileSync('docs/roadmap.md', 'utf8');
roadmap = roadmap
  .replace('121 events', `${baseline.minimum_counts.events} events`)
  .replace('121 Event v2 detail records', `${baseline.minimum_counts.event_details} Event v2 detail records`)
  .replace('367 evidence records', `${baseline.minimum_counts.evidence} evidence records`)
  .replace('198 known unknowns', `${baseline.minimum_counts.known_unknowns} known unknowns`)
  .replace('Missing canonical launch dates:            28', `Missing canonical launch dates:            ${queue.expected_total}`)
  .replace('Total unresolved: 28', `Total unresolved: ${queue.expected_total}`)
  .replace('Category C:        22', 'Category C:        21')
  .replace('SPOT   — original launch separated from v2 proposal and v5 execution', 'SPOT   — original launch separated from v2 proposal and v5 execution\nfxUSD  — public availability separated from announcement, seeding, and same-proxy V2 upgrade')
  .replace('3. Audit fxUSD as the next bounded Category C version-boundary record.', '3. Audit MAI as the next bounded Category C rebrand and deployment-boundary record.')
  .replace('4. Separate fxUSD introduction, V1, V2, public availability, token contracts, and any holder or collateral migration.', '4. Separate miMATIC launch, MAI rename, current multi-chain deployments, and any canonical or bridged contract boundaries.')
  .replace('5. Assign no fxUSD launch date without a day-level first-party production boundary.', '5. Assign no MAI launch or rebrand date without day-level first-party evidence.');
fs.writeFileSync('docs/roadmap.md', roadmap);

fs.writeFileSync('docs/audits/fxusd-launch-lineage.md', `# fxUSD launch and V1/V2 lineage audit\n\nRecorded: 2026-06-24\n\n## Decision\n\n- Product announcement: 2024-01-11\n- Seeding phase begins: 2024-02-23\n- Canonical public-availability launch: 2024-02-27\n- Ethereum fxUSD proxy: 0x085780639CC2cACd35E474e71f4d000e2405d8f6\n- Reviewed V2 proxy upgrade: 2025-01-02\n- Asset continuity: one fxUSD token identity through the reviewed same-proxy upgrade\n\n## Launch boundary\n\nThe January article introduced fxUSD but did not establish public production availability. The February 23 seeding announcement explicitly made full mint and redeem access conditional on reaching a 500 ETH seed threshold. On February 27, an Ethereum Curve pool containing fxUSD was created on-chain after the seeding phase began. SOG uses that day as a conservative public-availability boundary. This does not assert that the pool creation transaction was the first-ever token mint.\n\n## V1/V2 boundary\n\nOfficial documentation distinguishes f(x) Protocol V1 and V2 and publishes one continuous fxUSD proxy. The proxy emitted an upgrade event on January 2, 2025. SOG records this as a protocol-version upgrade rather than a second stablecoin launch. V1 and V2 component contracts and position products remain distinct even though the base token proxy is continuous.\n\n## Registry treatment\n\nThe fxUSD launch date is 2024-02-27. The January announcement and February 23 seeding start remain evidence and context, not launch substitutes. fxSAVE, position products, stability-pool shares, and CreditNotes remain separate from base fxUSD.\n\n## Remaining unknowns\n\nThe complete V1-to-V2 component replacement graph, staged rollout chronology, pool migration, and treatment of every V1 position product remain unresolved. The separate base-token income-accrual question also remains open.\n`);

console.log({
  events: baseline.minimum_counts.events,
  event_details: baseline.minimum_counts.event_details,
  evidence: baseline.minimum_counts.evidence,
  known_unknowns: baseline.minimum_counts.known_unknowns,
  deployments: baseline.minimum_counts.deployments,
  launch_unresolved: queue.expected_total
});
