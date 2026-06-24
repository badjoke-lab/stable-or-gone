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

const stablecoinsPath = 'data/stablecoins-batch-f.json';
const stablecoins = readJson(stablecoinsPath);
const ausd = stablecoins.find((row) => row.id === 'sog_st_agoraausd');
if (!ausd) throw new Error('sog_st_agoraausd not found');
ausd.last_verified_at = '2026-06-24';
ausd.notes = 'Batch F promotion. The current Ethereum production contract was deployed on 2024-07-07, but exact first production mint, approved-customer access, and broad public availability remain unresolved. Network-specific issuance is tracked separately and launch_date remains null.';
writeJson(stablecoinsPath, stablecoins);

const eventId = 'sog_ev_agoraausd_launch';
const evidenceId = 'sog_src_agoraausd_ethereum_deployment_2024';

const eventsPath = 'data/events-batch-f.json';
const events = readJson(eventsPath);
const event = events.find((row) => row.id === eventId);
if (!event) throw new Error('Agora AUSD launch event not found');
event.source_count = 4;
event.notes = 'Exact day-level public launch remains unresolved. The current Ethereum production contract was created on 2024-07-07, which is recorded as a deployment boundary rather than a canonical public-launch date.';
writeJson(eventsPath, events);

const detailsPath = 'data/event-details-batch-f.json';
const details = readJson(detailsPath);
const detail = details.find((row) => row.id === eventId);
if (!detail) throw new Error('Agora AUSD event detail not found');
detail.evidence_ids = [...new Set([...(detail.evidence_ids ?? []), evidenceId])];
detail.launch_detail.summary = 'AUSD entered production under Agora Bermuda’s reserve-backed issuer framework; the 2024-07-07 Ethereum contract deployment is known while the exact original public-launch boundary remains unresolved.';
writeJson(detailsPath, details);

const evidencePath = 'data/evidence-batch-f.json';
const evidence = readJson(evidencePath);
ensureOne(evidence, evidenceId, () => ({
  id: evidenceId,
  stablecoin_id: 'sog_st_agoraausd',
  issuer_id: 'sog_issuer_agora_bermuda',
  event_id: eventId,
  source_type: 'onchain_explorer',
  title: 'Agora AUSD Ethereum contract creation',
  url: 'https://etherscan.io/tx/0xa892144a2bdb59bf3598e9e879c3863658bba90688de211bc538c38e6c3a6ed5',
  publisher: 'Etherscan',
  published_at: '2024-07-07',
  archived_url: 'https://web.archive.org/web/*/https://etherscan.io/tx/0xa892144a2bdb59bf3598e9e879c3863658bba90688de211bc538c38e6c3a6ed5',
  accessed_at: '2026-06-24',
  reliability: 'high',
  claim_scope: 'contract_deployment_before_public_launch',
  stablecoin_ids: ['sog_st_agoraausd'],
  organization_ids: ['sog_issuer_agora_bermuda'],
  event_ids: [eventId],
  claim_scopes: ['ethereum_deployment', 'contract_address', 'deployment_date', 'prelaunch_boundary'],
  notes: 'The transaction created the current canonical Ethereum AUSD token contract at 2024-07-07 22:28:59 UTC. Contract creation is not treated as proof of the original public-launch day.'
}));
writeJson(evidencePath, evidence);

const deploymentsPath = 'data/deployments-batch-f.json';
const deployments = readJson(deploymentsPath);
const deployment = deployments.find((row) => row.id === 'sog_dep_agoraausd_ethereum_batch_f');
if (!deployment) throw new Error('Agora AUSD Ethereum deployment not found');
deployment.contract_address = '0x00000000eFE302BEAA2b3e6e1b18d08D69a9012a';
deployment.notes = 'Canonical Ethereum AUSD production contract created on 2024-07-07 at 22:28:59 UTC. Contract deployment is separate from the unresolved first mint, approved-customer access, and broad public-availability boundaries.';
deployment.evidence_ids = [...new Set([...(deployment.evidence_ids ?? []), evidenceId])];
writeJson(deploymentsPath, deployments);

const unknownsPath = 'data/known-unknowns-batch-f.json';
const unknowns = readJson(unknownsPath);
const launchUnknown = unknowns.find((row) => row.id === 'sog_ku_agoraausd_launch_date_batch_f');
if (!launchUnknown) throw new Error('Agora AUSD launch unknown not found');
launchUnknown.description = 'The current Ethereum production contract was created on 2024-07-07, but the first production mint, approved-customer access, and broad public-availability day remain unresolved.';
launchUnknown.last_checked_at = '2026-06-24';
launchUnknown.notes = 'Preserve launch_date as null. Do not substitute contract creation or a later network launch for the original public boundary.';
const networkUnknown = unknowns.find((row) => row.id === 'sog_ku_agoraausd_network_map_batch_f');
if (!networkUnknown) throw new Error('Agora AUSD network unknown not found');
networkUnknown.last_checked_at = '2026-06-24';
networkUnknown.notes = 'Ethereum is normalized to the official current address. Solana, Avalanche, Sui, Injective, LayerZero, native, bridged, and winding-down representations still require deployment-level normalization.';
writeJson(unknownsPath, unknowns);

const queuePath = 'data/quality/launch-date-unresolved.json';
const queue = readJson(queuePath);
const queueRow = queue.records.find((row) => row.stablecoin_id === 'sog_st_agoraausd');
if (!queueRow) throw new Error('Agora AUSD launch queue row not found');
queueRow.review_note = 'Ethereum contract deployment is fixed to 2024-07-07; first mint, approved access, and broad public availability remain unresolved.';
queue.frozen_at = '2026-06-24';
writeJson(queuePath, queue);

const v2Path = 'docs/migration/registry-v2-baseline.json';
const v2 = readJson(v2Path);
v2.baseline_id = 'sog_registry_v2_agora_ausd_deployment_2026_06_24';
v2.captured_at = '2026-06-24';
v2.source_commit = 'agora-ausd-deployment';
v2.minimum_counts.evidence = 377;
v2.minimum_counts.evidence_relations = 372;
writeJson(v2Path, v2);

const v3Path = 'docs/migration/registry-v3-baseline.json';
const v3 = readJson(v3Path);
v3.baseline_id = 'sog_registry_v3_agora_ausd_deployment_2026_06_24';
v3.recorded_at = '2026-06-24';
v3.data_checkpoint_commit = 'agora-ausd-deployment';
v3.expected_counts.evidence = 377;
writeJson(v3Path, v3);

let readme = readText('README.md');
readme = readme
  .replace('376 evidence records', '377 evidence records')
  .replace('376 evidence relation projections', '377 evidence relation projections');
writeText('README.md', readme);

let review = readText('docs/audits/remaining-launch-date-review.md');
review = review.replace(
  'USDX and sUSDe have also completed bounded audits, but their canonical launch dates remain unresolved and therefore stay in Category C.',
  'USDX, sUSDe, and Agora AUSD have completed bounded audits, but their canonical launch dates remain unresolved and therefore stay in Category C. Agora AUSD’s current Ethereum contract deployment is fixed to 2024-07-07 without treating deployment as public launch.'
);
review = review.replace('Next bounded review: Agora AUSD', 'Next bounded review: Basis Cash');
writeText('docs/audits/remaining-launch-date-review.md', review);

let roadmap = readText('docs/roadmap.md');
roadmap = roadmap
  .replace('PR #120 — Audit Savings DAI launch boundary\nMerge: 9a0e33136002ecdf32284a8b85fa6d24c5514131', 'PR #122 — Audit Agora AUSD launch boundary\nMerge: fa4742eed871f9fb82a5573501ca7a88a8c73943')
  .replace('Latest resolved record: Savings DAI\nNext bounded record: Agora AUSD', 'Latest reviewed record: Agora AUSD\nNext bounded record: Basis Cash')
  .replace('PR #120 — Audit Savings DAI launch boundary', 'PR #120 — Audit Savings DAI launch boundary\nPR #122 — Audit Agora AUSD launch boundary')
  .replace('## Current canonical registry after Savings DAI launch resolution', '## Current canonical registry after Agora AUSD deployment normalization')
  .replace('376 evidence records', '377 evidence records')
  .replace('sDAI   — Ethereum contract deployment fixed to 2023-01-17 and public Spark availability fixed to 2023-05-09', 'sDAI   — Ethereum contract deployment fixed to 2023-01-17 and public Spark availability fixed to 2023-05-09\nAUSD   — Ethereum production contract fixed to 2024-07-07 while first mint, approved access, and public launch remain unresolved')
  .replace(/1\. Do not deploy or change Cloudflare while access is unavailable\.\n2\. Audit Agora AUSD[\s\S]*?6\. When Cloudflare access returns, publish latest merged main manually and verify production parity before controlled record growth resumes\./, '1. Do not deploy or change Cloudflare while access is unavailable.\n2. Audit Basis Cash as the next bounded Category C launch and terminal-lineage record.\n3. Separate deployment, first distribution, epoch activation, public availability, peg failure, and practical cessation boundaries.\n4. Assign no BAC launch or terminal date without day-level primary or on-chain evidence for the selected boundary.\n5. Keep launch and terminal queues, generated outputs, integrity audit, Registry v3 baseline, README, and roadmap synchronized in every quality PR.\n6. When Cloudflare access returns, publish latest merged main manually and verify production parity before controlled record growth resumes.');
writeText('docs/roadmap.md', roadmap);

execFileSync(process.execPath, ['scripts/generate-registry-stats.mjs'], { stdio: 'inherit' });
execFileSync(process.execPath, ['scripts/audit-registry-integrity.mjs'], { stdio: 'inherit' });
console.log('Agora AUSD Ethereum deployment synchronization complete.');
