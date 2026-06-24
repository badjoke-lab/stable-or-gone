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

const eventId = 'sog_ev_cashio_launch_batch_k';
const evidenceId = 'sog_src_cashio_public_launch_2021';

const stablecoinsPath = 'data/stablecoins-batch-k.json';
const stablecoins = readJson(stablecoinsPath);
const cashio = stablecoins.find((row) => row.id === 'sog_st_cashio');
if (!cashio) throw new Error('sog_st_cashio not found');
cashio.launch_date = '2021-11-09';
cashio.last_verified_at = '2026-06-24';
cashio.notes = 'Batch K promotion. Canonical public launch is 2021-11-09, when Saber announced a live CASH/USDC pool and documented active Cashio mint and redemption routes. The exact Solana CASH mint address remains unresolved. Exploit, peg collapse, and practical shutdown remain fixed to 2022-03-23.';
writeJson(stablecoinsPath, stablecoins);

const eventsPath = 'data/events-batch-k.json';
const events = readJson(eventsPath);
const launchEvent = events.find((row) => row.id === eventId);
if (!launchEvent) throw new Error('Cashio launch event not found');
launchEvent.event_date = '2021-11-09';
launchEvent.description = 'Cashio became publicly usable on Solana with a live CASH/USDC pool and documented mint, redemption, liquidity-provision, and swap routes.';
launchEvent.confidence = 'high';
launchEvent.source_count = 2;
launchEvent.notes = 'The public product boundary is supported by the official Cashio repository and Saber’s dated first-pool announcement. Later pool additions are liquidity expansion, not the original launch.';
writeJson(eventsPath, events);

const detailsPath = 'data/event-details-batch-k.json';
const details = readJson(detailsPath);
const detail = details.find((row) => row.id === eventId);
if (!detail) throw new Error('Cashio launch event detail not found');
detail.evidence_ids = [...new Set([...(detail.evidence_ids ?? []), evidenceId])];
detail.launch_detail = {
  summary: 'CASH became publicly mintable, redeemable, swappable, and usable in a live Solana CASH/USDC pool on 2021-11-09.',
  status: 'public_product_launch',
  related_organization_ids: ['sog_issuer_cashio']
};
writeJson(detailsPath, details);

const evidencePath = 'data/evidence-batch-k.json';
const evidence = readJson(evidencePath);
ensureOne(evidence, evidenceId, () => ({
  id: evidenceId,
  stablecoin_id: 'sog_st_cashio',
  issuer_id: 'sog_issuer_cashio',
  event_id: eventId,
  source_type: 'official_ecosystem_announcement',
  title: 'Saber Launches CASH / USDC Pool in Partnership with Cashio',
  url: 'https://medium.com/@saberteam/saber-launches-cash-usdc-pool-in-partnership-with-cashio-9ef6671be4e6',
  publisher: 'Saber Team',
  published_at: '2021-11-09',
  archived_url: 'https://web.archive.org/web/*/https://medium.com/@saberteam/saber-launches-cash-usdc-pool-in-partnership-with-cashio-9ef6671be4e6',
  accessed_at: '2026-06-24',
  reliability: 'high',
  claim_scope: 'public_launch_and_availability',
  stablecoin_ids: ['sog_st_cashio'],
  organization_ids: ['sog_issuer_cashio'],
  event_ids: [eventId],
  claim_scopes: ['launch_date', 'public_mint', 'redemption', 'liquidity_pool', 'swap_availability'],
  notes: 'Saber’s dated partnership announcement states that the CASH/USDC pool was live and that users could mint and redeem through Cashio or swap CASH on Saber.'
}));
writeJson(evidencePath, evidence);

const deploymentsPath = 'data/deployments-batch-k.json';
const deployments = readJson(deploymentsPath);
const deployment = deployments.find((row) => row.id === 'sog_dep_cashio_solana_batch_k');
if (!deployment) throw new Error('Cashio deployment not found');
deployment.notes = 'Historical Solana CASH deployment. Public product availability is fixed to 2021-11-09. The exact CASH mint and complete program-account map remain unresolved; the 2022-03-23 exploit ended practical operation.';
deployment.evidence_ids = [...new Set([...(deployment.evidence_ids ?? []), evidenceId])];
deployment.control_event_ids = [...new Set([eventId, ...(deployment.control_event_ids ?? [])])];
writeJson(deploymentsPath, deployments);

const queuePath = 'data/quality/launch-date-unresolved.json';
const queue = readJson(queuePath);
queue.records = queue.records.filter((row) => row.stablecoin_id !== 'sog_st_cashio');
queue.frozen_at = '2026-06-24';
queue.expected_total = queue.records.length;
queue.category_counts = { B: 0, C: 0, D: 0 };
for (const row of queue.records) queue.category_counts[row.category] += 1;
writeJson(queuePath, queue);

const v2Path = 'docs/migration/registry-v2-baseline.json';
const v2 = readJson(v2Path);
v2.baseline_id = 'sog_registry_v2_cashio_launch_2026_06_24';
v2.captured_at = '2026-06-24';
v2.source_commit = 'cashio-launch';
v2.minimum_counts.evidence = 382;
v2.minimum_counts.evidence_relations = 377;
writeJson(v2Path, v2);

const v3Path = 'docs/migration/registry-v3-baseline.json';
const v3 = readJson(v3Path);
v3.baseline_id = 'sog_registry_v3_cashio_launch_2026_06_24';
v3.recorded_at = '2026-06-24';
v3.data_checkpoint_commit = 'cashio-launch';
v3.expected_counts.evidence = 382;
v3.quality.launch_date_unresolved = queue.expected_total;
writeJson(v3Path, v3);

let readme = readText('README.md');
readme = readme
  .replace('381 evidence records', '382 evidence records')
  .replace('381 evidence relation projections', '382 evidence relation projections')
  .replace('24 unresolved launch dates', '23 unresolved launch dates');
writeText('README.md', readme);

const nameById = new Map();
for (const file of v2.data_groups.stablecoins) {
  for (const row of readJson(file)) nameById.set(row.id, row.name);
}
const rowsByCategory = Object.groupBy(queue.records, (row) => row.category);
const table = (category) => [
  '| Stable asset | ID | Best known range | Reason |',
  '|---|---|---|---|',
  ...(rowsByCategory[category] ?? []).map((row) => `| ${nameById.get(row.stablecoin_id) ?? row.stablecoin_id} | \`${row.stablecoin_id}\` | ${row.best_known_range ?? '—'} | ${row.review_note} |`)
].join('\n');
const review = `# Remaining Launch-Date Review\n\nUpdated: 2026-06-24\n\n## Purpose\n\nThis document is the human-readable companion to \`data/quality/launch-date-unresolved.json\`. The machine-readable queue and the canonical \`launch_date: null\` set must match exactly. Day-level dates are added only when a reviewed first-party or on-chain public boundary supports them.\n\n## Current queue\n\n\`\`\`text\nTotal unresolved: ${queue.expected_total}\nCategory B: ${queue.category_counts.B}\nCategory C: ${queue.category_counts.C}\nCategory D: ${queue.category_counts.D}\n\`\`\`\n\n## Recently resolved bounded records\n\n- EURA — agEUR launch separated from the later EURA rebrand.\n- lisUSD — HAY launch separated from the lisUSD rebrand.\n- sUSD — eUSD, nUSD launch, and sUSD rename separated.\n- Nuon — v1 and v2 product boundaries separated.\n- SPOT — original launch separated from later protocol versions.\n- fxUSD — public availability separated from announcement, seeding, and V2 upgrade.\n- MAI — Polygon public launch separated from rename and V2 activation.\n- Savings DAI — contract deployment on 2023-01-17 separated from public Spark availability on 2023-05-09.\n- Basis Cash — original public launch fixed to 2020-11-30 while V2 activation and unresolved terminal boundaries remain separate.\n- Cashio Dollar — public mint, redemption, liquidity, and swap availability fixed to 2021-11-09 while the exact Solana mint remains unresolved.\n\nUSDX, sUSDe, and Agora AUSD have completed bounded audits, but their canonical launch dates remain unresolved and therefore stay in Category C. Agora AUSD’s current Ethereum contract deployment is fixed to 2024-07-07 without treating deployment as public launch.\n\n## Category B — partial date only\n\n${table('B')}\n\n## Category C — boundary, version, or lineage conflict\n\n${table('C')}\n\n## Category D — adequate primary source not recovered\n\n${table('D')}\n\n## Fixed policy\n\n- Require day-level primary or on-chain evidence for a canonical launch date.\n- Do not coerce month or year into a date.\n- Do not use exchange listings as the default launch boundary.\n- Do not substitute a rebrand, migration, contract deployment, testnet, guarded beta, or later product version for the original public boundary.\n- Keep unresolved values as \`null\`.\n\n## Current completion state\n\n\`\`\`text\nOriginal review scope: complete\nCurrent unresolved queue: ${queue.expected_total}\nCategory B: ${queue.category_counts.B}\nCategory C: ${queue.category_counts.C}\nCategory D: ${queue.category_counts.D}\nMachine-readable queue: data/quality/launch-date-unresolved.json\nNext bounded review: DOLA\n\`\`\`\n`;
writeText('docs/audits/remaining-launch-date-review.md', review);

let roadmap = readText('docs/roadmap.md');
roadmap = roadmap
  .replace('PR #124 — Audit Basis Cash launch and terminal boundaries\nMerge: 334d5ef8a4a31a10a754d5b30fdbdb26ef17d05f', 'PR #126 — Audit Cashio Dollar launch boundary\nMerge: 019f14e14928cffc0651670f2bb7cd8e9ab6c7fb')
  .replace('Latest resolved record: Basis Cash launch\nNext bounded record: Cashio Dollar', 'Latest resolved record: Cashio Dollar\nNext bounded record: DOLA')
  .replace('PR #124 — Audit Basis Cash launch and terminal boundaries', 'PR #124 — Audit Basis Cash launch and terminal boundaries\nPR #125 — Resolve Basis Cash launch lineage\nPR #126 — Audit Cashio Dollar launch boundary')
  .replace('## Current canonical registry after Basis Cash launch resolution', '## Current canonical registry after Cashio Dollar launch resolution')
  .replace('381 evidence records', '382 evidence records')
  .replace('Missing canonical launch dates:            24', 'Missing canonical launch dates:            23')
  .replace('Total unresolved: 24\nCategory B:         3\nCategory C:        18\nCategory D:         3', 'Total unresolved: 23\nCategory B:         3\nCategory C:        17\nCategory D:         3')
  .replace('BAC    — original public launch fixed to 2020-11-30; V2 activation fixed to 2021-04-26; terminal date remains unresolved', 'BAC    — original public launch fixed to 2020-11-30; V2 activation fixed to 2021-04-26; terminal date remains unresolved\nCASH   — public mint, redemption, liquidity, and swap availability fixed to 2021-11-09; exact Solana mint remains unresolved')
  .replace(/1\. Do not deploy or change Cloudflare while access is unavailable\.\n2\. Audit Cashio Dollar[\s\S]*?6\. When Cloudflare access returns, publish latest merged main manually and verify production parity before controlled record growth resumes\./, '1. Do not deploy or change Cloudflare while access is unavailable.\n2. Audit DOLA as the next bounded Category C launch-boundary record.\n3. Separate initial token deployment, first mint, public release, FiRM issuance, and later product integrations.\n4. Assign no DOLA launch date without day-level first-party or on-chain public-availability evidence.\n5. Keep launch and terminal queues, generated outputs, integrity audit, Registry v3 baseline, README, and roadmap synchronized in every quality PR.\n6. When Cloudflare access returns, publish latest merged main manually and verify production parity before controlled record growth resumes.');
writeText('docs/roadmap.md', roadmap);

execFileSync(process.execPath, ['scripts/generate-registry-stats.mjs'], { stdio: 'inherit' });
execFileSync(process.execPath, ['scripts/audit-registry-integrity.mjs'], { stdio: 'inherit' });
console.log('Cashio Dollar launch synchronization complete.');
