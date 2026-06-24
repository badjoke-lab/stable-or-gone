import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const writeJson = (file, value) => fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
const readText = (file) => fs.readFileSync(file, 'utf8');
const writeText = (file, value) => fs.writeFileSync(file, value.endsWith('\n') ? value : `${value}\n`);
const ensureOne = (rows, id, build) => {
  const index = rows.findIndex((row) => row.id === id);
  if (index >= 0) rows[index] = build(rows[index]);
  else rows.push(build({}));
};

const stablecoinsPath = 'data/stablecoins-batch-h.json';
const stablecoins = readJson(stablecoinsPath);
const sdai = stablecoins.find((row) => row.id === 'sog_st_sdai');
if (!sdai) throw new Error('sog_st_sdai not found');
sdai.launch_date = '2023-05-09';
sdai.last_verified_at = '2026-06-24';
sdai.notes = 'Batch H boundary record. Canonical public launch is 2023-05-09, when Maker announced Spark Protocol availability for all DeFi users and explicitly included sDAI. The canonical Ethereum SavingsDai contract was deployed earlier on 2023-01-17; deployment, DSR history, public Spark availability, and the later sUSDS transition remain separate lifecycle boundaries.';
writeJson(stablecoinsPath, stablecoins);

const launchEventId = 'sog_ev_sdai_2023_05_launch';
const launchEvidenceIds = ['sog_src_sdai_launch_2023', 'sog_src_sdai_contract_deployment_2023'];

const eventsPath = 'data/events-batch-h.json';
const events = readJson(eventsPath);
ensureOne(events, launchEventId, () => ({
  id: launchEventId,
  stablecoin_id: 'sog_st_sdai',
  issuer_id: 'sog_issuer_makerdao_sky',
  event_type: 'launch',
  event_date: '2023-05-09',
  title: 'Savings DAI becomes publicly available through Spark Protocol',
  description: 'Maker announced that Spark Protocol would become available to all DeFi users on May 9, 2023 and explicitly included sDAI among the supported assets. SOG uses this first-party public-availability boundary rather than the earlier contract-deployment date.',
  impact_level: 'medium',
  confidence: 'high',
  source_count: 2,
  event_status_effect: 'none',
  recovered: null,
  recovery_date: null,
  failure_mechanism: 'product_launch',
  notes: 'The canonical SavingsDai contract was deployed on 2023-01-17. Contract deployment, public Spark availability, and the later sUSDS transition are recorded as separate boundaries.'
}));
writeJson(eventsPath, events);

const detailsPath = 'data/event-details-batch-h.json';
const details = readJson(detailsPath);
ensureOne(details, launchEventId, () => ({
  id: launchEventId,
  title: 'Savings DAI becomes publicly available through Spark Protocol',
  subject_stablecoin_ids: ['sog_st_sdai'],
  subject_organization_ids: ['sog_issuer_makerdao_sky'],
  evidence_ids: launchEvidenceIds,
  event_detail_kind: 'launch',
  launch_detail: {
    summary: 'Maker announced general DeFi-user availability for Spark Protocol and sDAI effective 2023-05-09.',
    status: 'public_product_launch',
    related_stablecoin_ids: ['sog_st_dai', 'sog_st_susds'],
    related_organization_ids: ['sog_issuer_makerdao_sky']
  }
}));
writeJson(detailsPath, details);

const evidencePath = 'data/evidence-batch-h.json';
const evidence = readJson(evidencePath);
ensureOne(evidence, 'sog_src_sdai_launch_2023', () => ({
  id: 'sog_src_sdai_launch_2023',
  event_id: launchEventId,
  stablecoin_id: 'sog_st_sdai',
  issuer_id: 'sog_issuer_makerdao_sky',
  source_type: 'official_social',
  title: 'Maker announces Spark Protocol availability for all DeFi users',
  url: 'https://twitter.com/MakerDAO/status/1655575088547127311',
  publisher: 'MakerDAO',
  published_at: '2023-05-08',
  archived_url: 'https://web.archive.org/web/*/https://twitter.com/MakerDAO/status/1655575088547127311',
  accessed_at: '2026-06-24',
  reliability: 'high',
  claim_scope: 'public_launch_and_availability',
  stablecoin_ids: ['sog_st_sdai'],
  organization_ids: ['sog_issuer_makerdao_sky'],
  event_ids: [launchEventId],
  claim_scopes: ['launch_date', 'spark_protocol', 'public_availability', 'sDAI_support'],
  notes: 'The official announcement was published on 2023-05-08 and states that Spark Protocol would be available to all DeFi users starting 2023-05-09. SOG uses the stated effective date.'
}));
ensureOne(evidence, 'sog_src_sdai_contract_deployment_2023', () => ({
  id: 'sog_src_sdai_contract_deployment_2023',
  event_id: launchEventId,
  stablecoin_id: 'sog_st_sdai',
  issuer_id: 'sog_issuer_makerdao_sky',
  source_type: 'onchain_explorer',
  title: 'SavingsDai contract creation on Ethereum',
  url: 'https://etherscan.io/tx/0xa2f51048265f2fe9ffaf69b94cb5a2a4113be49bdecd2040d530dd6f68facc42',
  publisher: 'Etherscan',
  published_at: '2023-01-17',
  archived_url: 'https://web.archive.org/web/*/https://etherscan.io/tx/0xa2f51048265f2fe9ffaf69b94cb5a2a4113be49bdecd2040d530dd6f68facc42',
  accessed_at: '2026-06-24',
  reliability: 'high',
  claim_scope: 'contract_deployment_before_public_launch',
  stablecoin_ids: ['sog_st_sdai'],
  organization_ids: ['sog_issuer_makerdao_sky'],
  event_ids: [launchEventId],
  claim_scopes: ['ethereum_deployment', 'contract_address', 'deployment_date', 'prelaunch_boundary'],
  notes: 'The canonical SavingsDai contract was created at 2023-01-17 17:52:11 UTC in block 16428133. Deployment is recorded separately from the 2023-05-09 public product launch.'
}));
writeJson(evidencePath, evidence);

const deploymentsPath = 'data/deployments-batch-h.json';
const deployments = readJson(deploymentsPath);
const deployment = deployments.find((row) => row.id === 'sog_dep_sdai_ethereum_batch_h');
if (!deployment) throw new Error('sDAI deployment not found');
deployment.contract_address = '0x83F20F44975D03b1b09e64809B757c47f942BEeA';
deployment.control_event_ids = [...new Set([launchEventId, ...(deployment.control_event_ids ?? [])])];
deployment.notes = 'Canonical Ethereum SavingsDai ERC-4626 vault-share contract deployed on 2023-01-17. Public product availability is fixed separately to 2023-05-09 through Maker\'s Spark Protocol launch announcement. The deployment remains restricted/limited in the current Sky-era view; no termination or mandatory migration is asserted.';
deployment.evidence_ids = [...new Set([...(deployment.evidence_ids ?? []), ...launchEvidenceIds])];
writeJson(deploymentsPath, deployments);

const queuePath = 'data/quality/launch-date-unresolved.json';
const queue = readJson(queuePath);
queue.records = queue.records.filter((row) => row.stablecoin_id !== 'sog_st_sdai');
queue.frozen_at = '2026-06-24';
queue.source_review = 'docs/audits/remaining-launch-date-review.md';
queue.expected_total = queue.records.length;
queue.category_counts = { B: 0, C: 0, D: 0 };
for (const row of queue.records) queue.category_counts[row.category] += 1;
writeJson(queuePath, queue);

const v2Path = 'docs/migration/registry-v2-baseline.json';
const v2 = readJson(v2Path);
v2.baseline_id = 'sog_registry_v2_sdai_launch_2026_06_24';
v2.captured_at = '2026-06-24';
v2.source_commit = 'sdai-launch';
v2.minimum_counts.events = 124;
v2.minimum_counts.event_details = 124;
v2.minimum_counts.evidence = 376;
v2.minimum_counts.evidence_relations = 371;
writeJson(v2Path, v2);

const v3Path = 'docs/migration/registry-v3-baseline.json';
const v3 = readJson(v3Path);
v3.baseline_id = 'sog_registry_v3_sdai_launch_2026_06_24';
v3.recorded_at = '2026-06-24';
v3.data_checkpoint_commit = 'sdai-launch';
v3.expected_counts.events = 124;
v3.expected_counts.event_details = 124;
v3.expected_counts.evidence = 376;
v3.quality.launch_date_unresolved = queue.expected_total;
v3.audit_report = 'docs/audits/registry-70-final-audit.md';
writeJson(v3Path, v3);

let readme = readText('README.md');
readme = readme
  .replace('123 events', '124 events')
  .replace('123 Event v2 detail records', '124 Event v2 detail records')
  .replace('374 evidence records', '376 evidence records')
  .replace('374 evidence relation projections', '376 evidence relation projections')
  .replace('26 unresolved launch dates', '25 unresolved launch dates');
writeText('README.md', readme);

const nameById = new Map();
for (const file of v2.data_groups.stablecoins) {
  for (const row of readJson(file)) nameById.set(row.id, row.name);
}
const rowsByCategory = Object.groupBy(queue.records, (row) => row.category);
const table = (category) => {
  const rows = rowsByCategory[category] ?? [];
  return [
    '| Stable asset | ID | Best known range | Reason |',
    '|---|---|---|---|',
    ...rows.map((row) => `| ${nameById.get(row.stablecoin_id) ?? row.stablecoin_id} | \`${row.stablecoin_id}\` | ${row.best_known_range ?? '—'} | ${row.review_note} |`)
  ].join('\n');
};
const review = `# Remaining Launch-Date Review\n\nUpdated: 2026-06-24\n\n## Purpose\n\nThis document is the human-readable companion to \`data/quality/launch-date-unresolved.json\`. The machine-readable queue and the canonical \`launch_date: null\` set must match exactly. Day-level dates are added only when a reviewed first-party or on-chain public boundary supports them.\n\n## Current queue\n\n\`\`\`text\nTotal unresolved: ${queue.expected_total}\nCategory B: ${queue.category_counts.B}\nCategory C: ${queue.category_counts.C}\nCategory D: ${queue.category_counts.D}\n\`\`\`\n\n## Recently resolved bounded records\n\n- EURA — agEUR launch separated from the later EURA rebrand.\n- lisUSD — HAY launch separated from the lisUSD rebrand.\n- sUSD — eUSD, nUSD launch, and sUSD rename separated.\n- Nuon — v1 and v2 product boundaries separated.\n- SPOT — original launch separated from later protocol versions.\n- fxUSD — public availability separated from announcement, seeding, and V2 upgrade.\n- MAI — Polygon public launch separated from rename and V2 activation.\n- Savings DAI — contract deployment on 2023-01-17 separated from public Spark availability on 2023-05-09.\n\nUSDX and sUSDe have also completed bounded audits, but their canonical launch dates remain unresolved and therefore stay in Category C.\n\n## Category B — partial date only\n\n${table('B')}\n\n## Category C — boundary, version, or lineage conflict\n\n${table('C')}\n\n## Category D — adequate primary source not recovered\n\n${table('D')}\n\n## Fixed policy\n\n- Require day-level primary or on-chain evidence for a canonical launch date.\n- Do not coerce month or year into a date.\n- Do not use exchange listings as the default launch boundary.\n- Do not substitute a rebrand, migration, contract deployment, testnet, guarded beta, or later product version for the original public boundary.\n- Keep unresolved values as \`null\`.\n\n## Current completion state\n\n\`\`\`text\nOriginal review scope: complete\nCurrent unresolved queue: ${queue.expected_total}\nCategory B: ${queue.category_counts.B}\nCategory C: ${queue.category_counts.C}\nCategory D: ${queue.category_counts.D}\nMachine-readable queue: data/quality/launch-date-unresolved.json\nNext bounded review: Agora AUSD\n\`\`\`\n`;
writeText('docs/audits/remaining-launch-date-review.md', review);

let roadmap = readText('docs/roadmap.md');
roadmap = roadmap
  .replace(/PR #118 — Audit Ethena product activation boundary\nMerge: e5f6906b05da7a98173ddebd257248e1461bd714/, 'PR #120 — Audit Savings DAI launch boundary\nMerge: 9a0e33136002ecdf32284a8b85fa6d24c5514131')
  .replace('Latest reviewed record: Staked USDe\nNext bounded record: Savings DAI', 'Latest resolved record: Savings DAI\nNext bounded record: Agora AUSD')
  .replace('PR #118 — Audit Ethena product activation boundary', 'PR #118 — Audit Ethena product activation boundary\nPR #120 — Audit Savings DAI launch boundary')
  .replace('## Current canonical registry after MAI change', '## Current canonical registry after Savings DAI launch resolution')
  .replace('123 events\n123 Event v2 detail records\n374 evidence records', '124 events\n124 Event v2 detail records\n376 evidence records')
  .replace('Warnings:                                 0', 'Blocking warnings:                        0\nIntegrity audit warnings:                  3 non-blocking source-count mismatches')
  .replace('Missing canonical launch dates:            26', 'Missing canonical launch dates:            25')
  .replace('Total unresolved: 26\nCategory B:         3\nCategory C:        20\nCategory D:         3', 'Total unresolved: 25\nCategory B:         3\nCategory C:        19\nCategory D:         3')
  .replace('sUSDe  — current contract deployment fixed to 2023-11-14 while stealth activity, public mainnet, staking access, and reward payout remain separate unresolved boundaries', 'sUSDe  — current contract deployment fixed to 2023-11-14 while stealth activity, public mainnet, staking access, and reward payout remain separate unresolved boundaries\nsDAI   — Ethereum contract deployment fixed to 2023-01-17 and public Spark availability fixed to 2023-05-09')
  .replace(/1\. Do not deploy or change Cloudflare while access is unavailable\.\n2\. Audit Savings DAI[\s\S]*?6\. When Cloudflare access returns, publish latest merged main manually and verify production parity before controlled record growth resumes\./, '1. Do not deploy or change Cloudflare while access is unavailable.\n2. Audit Agora AUSD as the next bounded Category C launch-boundary record.\n3. Separate announcement, first mint, first network deployment, institutional access, and broad public availability.\n4. Assign no AUSD launch date without day-level first-party or on-chain evidence for the selected public boundary.\n5. Keep launch queue, generated outputs, integrity audit, Registry v3 baseline, README, and roadmap synchronized in every quality PR.\n6. When Cloudflare access returns, publish latest merged main manually and verify production parity before controlled record growth resumes.');
writeText('docs/roadmap.md', roadmap);

execFileSync(process.execPath, ['scripts/generate-registry-stats.mjs'], { stdio: 'inherit' });
execFileSync(process.execPath, ['scripts/audit-registry-integrity.mjs'], { stdio: 'inherit' });
console.log('Savings DAI canonical synchronization complete.');
