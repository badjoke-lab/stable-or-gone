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

const launchEventId = 'sog_ev_bac_2020_11_public_launch';
const v2EventId = 'sog_ev_bac_2021_04_v2_activation';
const launchEvidenceIds = [
  'sog_src_bac_distribution_guide_2020',
  'sog_src_bac_contract_creation_2020',
  'sog_src_bac_public_opening_2020'
];
const v2EvidenceId = 'sog_src_bac_v2_launch_2021';

const stablecoinsPath = 'data/stablecoins-batch-k.json';
const stablecoins = readJson(stablecoinsPath);
const bac = stablecoins.find((row) => row.id === 'sog_st_bac');
if (!bac) throw new Error('sog_st_bac not found');
bac.launch_date = '2020-11-30';
bac.discontinued_date = null;
bac.last_verified_at = '2026-06-24';
bac.notes = 'Batch K promotion. Canonical public launch is 2020-11-30, when the original Basis Cash contracts opened to users and the initial BAC distribution began. The 2021-04-26 Basis Cash V2 activation is a separate protocol-version event. Exact protocol cessation and final contract termination remain unresolved.';
writeJson(stablecoinsPath, stablecoins);

const eventsPath = 'data/events-batch-k.json';
const events = readJson(eventsPath);
ensureOne(events, launchEventId, () => ({
  id: launchEventId,
  stablecoin_id: 'sog_st_bac',
  issuer_id: 'sog_issuer_basis_cash',
  event_type: 'launch',
  event_date: '2020-11-30',
  title: 'Basis Cash opens its public protocol and BAC distribution',
  description: 'Basis Cash smart contracts opened to users and the original community distribution system for BAC became publicly accessible on November 30, 2020.',
  impact_level: 'high',
  confidence: 'high',
  source_count: 3,
  event_status_effect: 'active',
  recovered: null,
  recovery_date: null,
  failure_mechanism: 'not_applicable',
  notes: 'The 2020-11-17 official guide is pre-launch context. The public-opening date is kept separate from later exchange listings and the 2021 V2 activation.'
}));
ensureOne(events, v2EventId, () => ({
  id: v2EventId,
  stablecoin_id: 'sog_st_bac',
  issuer_id: 'sog_issuer_basis_cash',
  event_type: 'protocol_upgrade',
  event_date: '2021-04-26',
  title: 'Basis Cash V2 activates',
  description: 'Basis Cash activated its V2 protocol design at 00:00 UTC on April 26, 2021, introducing new liquidity incentives, vault mechanics, and bond and share utilities around the existing BAC system.',
  impact_level: 'high',
  confidence: 'high',
  source_count: 1,
  event_status_effect: 'none',
  recovered: null,
  recovery_date: null,
  failure_mechanism: 'protocol_version_upgrade',
  notes: 'V2 is a later protocol-version boundary and does not replace the original 2020-11-30 BAC launch date.'
}));
writeJson(eventsPath, events);

const detailsPath = 'data/event-details-batch-k.json';
const details = readJson(detailsPath);
ensureOne(details, launchEventId, () => ({
  id: launchEventId,
  title: 'Basis Cash opens its public protocol and BAC distribution',
  subject_stablecoin_ids: ['sog_st_bac'],
  subject_organization_ids: ['sog_issuer_basis_cash'],
  evidence_ids: launchEvidenceIds,
  event_detail_kind: 'launch',
  launch_detail: {
    summary: 'The original Basis Cash contracts and initial BAC community distribution became publicly accessible on 2020-11-30.',
    status: 'public_protocol_launch',
    related_organization_ids: ['sog_issuer_basis_cash']
  }
}));
ensureOne(details, v2EventId, () => ({
  id: v2EventId,
  title: 'Basis Cash V2 activates',
  subject_stablecoin_ids: ['sog_st_bac'],
  subject_organization_ids: ['sog_issuer_basis_cash'],
  evidence_ids: [v2EvidenceId],
  event_detail_kind: 'other'
}));
writeJson(detailsPath, details);

const evidencePath = 'data/evidence-batch-k.json';
const evidence = readJson(evidencePath);
ensureOne(evidence, 'sog_src_bac_distribution_guide_2020', () => ({
  id: 'sog_src_bac_distribution_guide_2020',
  stablecoin_id: 'sog_st_bac',
  issuer_id: 'sog_issuer_basis_cash',
  event_id: launchEventId,
  source_type: 'official_blog',
  title: 'Overall guide for Basis Cash',
  url: 'https://medium.com/basis-cash/overall-guide-for-basis-cash-79b606c5ba8c',
  publisher: 'Basis Cash',
  published_at: '2020-11-17',
  archived_url: 'https://web.archive.org/web/*/https://medium.com/basis-cash/overall-guide-for-basis-cash-79b606c5ba8c',
  accessed_at: '2026-06-24',
  reliability: 'high',
  claim_scope: 'prelaunch_distribution_design',
  stablecoin_ids: ['sog_st_bac'],
  organization_ids: ['sog_issuer_basis_cash'],
  event_ids: [launchEventId],
  claim_scopes: ['distribution_design', 'BAC', 'BAB', 'BAS', 'application_flow', 'prelaunch_boundary'],
  notes: 'Official guide describing the five-pool initial BAC distribution and application flow. Publication predates the reviewed public-opening date.'
}));
ensureOne(evidence, 'sog_src_bac_contract_creation_2020', () => ({
  id: 'sog_src_bac_contract_creation_2020',
  stablecoin_id: 'sog_st_bac',
  issuer_id: 'sog_issuer_basis_cash',
  event_id: launchEventId,
  source_type: 'onchain_explorer',
  title: 'Basis Cash canonical BAC contract creation',
  url: 'https://etherscan.io/tx/0x19fa45dacde46f73af21893c7649c48eebc05feec8811ac9848931106fc6c947',
  publisher: 'Etherscan',
  published_at: null,
  archived_url: 'https://web.archive.org/web/*/https://etherscan.io/tx/0x19fa45dacde46f73af21893c7649c48eebc05feec8811ac9848931106fc6c947',
  accessed_at: '2026-06-24',
  reliability: 'high',
  claim_scope: 'contract_identity_and_deployment',
  stablecoin_ids: ['sog_st_bac'],
  organization_ids: ['sog_issuer_basis_cash'],
  event_ids: [launchEventId],
  claim_scopes: ['ethereum_deployment', 'contract_address', 'contract_creation_transaction'],
  notes: 'On-chain creation transaction for the canonical BAC token contract. Deployment supports the launch chronology but is not used alone as public-launch proof.'
}));
ensureOne(evidence, 'sog_src_bac_public_opening_2020', () => ({
  id: 'sog_src_bac_public_opening_2020',
  stablecoin_id: 'sog_st_bac',
  issuer_id: 'sog_issuer_basis_cash',
  event_id: launchEventId,
  source_type: 'news_article',
  title: "'Basis Cash' Launch Brings Defunct Stablecoin Into the DeFi Era",
  url: 'https://www.coindesk.com/tech/2020/11/30/basis-cash-launch-brings-defunct-stablecoin-into-the-defi-era',
  publisher: 'CoinDesk',
  published_at: '2020-11-30',
  archived_url: 'https://web.archive.org/web/*/https://www.coindesk.com/tech/2020/11/30/basis-cash-launch-brings-defunct-stablecoin-into-the-defi-era',
  accessed_at: '2026-06-24',
  reliability: 'high',
  claim_scope: 'public_launch_and_contract_opening',
  stablecoin_ids: ['sog_st_bac'],
  organization_ids: ['sog_issuer_basis_cash'],
  event_ids: [launchEventId],
  claim_scopes: ['launch_date', 'public_contract_opening', 'initial_distribution'],
  notes: 'Contemporaneous report states that Basis Cash smart contracts opened to users on 2020-11-30. Used with first-party and on-chain evidence.'
}));
ensureOne(evidence, v2EvidenceId, () => ({
  id: v2EvidenceId,
  stablecoin_id: 'sog_st_bac',
  issuer_id: 'sog_issuer_basis_cash',
  event_id: v2EventId,
  source_type: 'official_blog',
  title: 'Basis V2: Launch Day Is Here!',
  url: 'https://medium.com/basis-cash/basis-v2-launch-day-is-here-950900ac0a9f',
  publisher: 'Basis Cash',
  published_at: '2021-04-25',
  archived_url: 'https://web.archive.org/web/*/https://medium.com/basis-cash/basis-v2-launch-day-is-here-950900ac0a9f',
  accessed_at: '2026-06-24',
  reliability: 'high',
  claim_scope: 'protocol_version_activation',
  stablecoin_ids: ['sog_st_bac'],
  organization_ids: ['sog_issuer_basis_cash'],
  event_ids: [v2EventId],
  claim_scopes: ['v2', 'activation_date', 'liquidity_incentives', 'vault', 'bondroom'],
  notes: 'Official announcement states that Basis Cash V2 would go live at 00:00 UTC on 2021-04-26. This is a later protocol-version event.'
}));
writeJson(evidencePath, evidence);

const deploymentsPath = 'data/deployments-batch-k.json';
const deployments = readJson(deploymentsPath);
const deployment = deployments.find((row) => row.id === 'sog_dep_bac_ethereum_batch_k');
if (!deployment) throw new Error('BAC Ethereum deployment not found');
deployment.contract_address = '0x3449fc1cd036255ba1eb19d65ff4ba2b8903a69a';
deployment.control_event_ids = [...new Set([launchEventId, v2EventId, ...(deployment.control_event_ids ?? [])])];
deployment.notes = 'Canonical historical BAC Ethereum token contract. The original public protocol launch is 2020-11-30 and the 2021-04-26 V2 activation is a separate protocol-version boundary. The deployment remains transferable, but the stablecoin system is classified failed and no exact contract termination is asserted.';
deployment.evidence_ids = [...new Set([...(deployment.evidence_ids ?? []), ...launchEvidenceIds, v2EvidenceId])];
writeJson(deploymentsPath, deployments);

const unknownsPath = 'data/known-unknowns-batch-k.json';
const unknowns = readJson(unknownsPath);
const terminalUnknown = unknowns.find((row) => row.id === 'sog_ku_bac_terminal_date_batch_k');
if (!terminalUnknown) throw new Error('BAC terminal unknown not found');
terminalUnknown.description = 'The original BAC launch is fixed to 2020-11-30 and V2 activation to 2021-04-26, but no definitive shutdown, final mint stop, governance termination, or contract end date is established.';
terminalUnknown.last_checked_at = '2026-06-24';
terminalUnknown.notes = 'BAC remains classified failed without inventing an end date. Continuing ERC-20 transferability is separate from protocol relevance.';
const relatedUnknown = unknowns.find((row) => row.id === 'sog_ku_bac_related_tokens_batch_k');
if (!relatedUnknown) throw new Error('BAC related-token unknown not found');
relatedUnknown.last_checked_at = '2026-06-24';
relatedUnknown.notes = 'BAB, BAS V1, BAS V2, boardroom, treasury, vault, oracle, and liquidity-migration contracts require a separate lineage normalization pass.';
writeJson(unknownsPath, unknowns);

const launchQueuePath = 'data/quality/launch-date-unresolved.json';
const launchQueue = readJson(launchQueuePath);
launchQueue.records = launchQueue.records.filter((row) => row.stablecoin_id !== 'sog_st_bac');
launchQueue.frozen_at = '2026-06-24';
launchQueue.expected_total = launchQueue.records.length;
launchQueue.category_counts = { B: 0, C: 0, D: 0 };
for (const row of launchQueue.records) launchQueue.category_counts[row.category] += 1;
writeJson(launchQueuePath, launchQueue);

const terminalQueuePath = 'data/quality/terminal-date-unresolved.json';
const terminalQueue = readJson(terminalQueuePath);
terminalQueue.frozen_at = '2026-06-24';
const terminalRow = terminalQueue.records.find((row) => row.stablecoin_id === 'sog_st_bac');
if (!terminalRow) throw new Error('BAC terminal queue row not found');
terminalRow.last_confirmed_activity = '2026-06-24 canonical BAC ERC-20 contract remains deployed and transferable';
terminalRow.review_note = 'The original BAC launch is fixed to 2020-11-30 and V2 activation to 2021-04-26. No first-party shutdown, final mint stop, governance termination, redemption termination, or contract end state is recovered; continued transferability does not restore active protocol status.';
terminalRow.future_review_target = 'official_shutdown_notice_final_mint_or_governance_disable_record_or_contract_level_end_state';
writeJson(terminalQueuePath, terminalQueue);

const v2Path = 'docs/migration/registry-v2-baseline.json';
const v2 = readJson(v2Path);
v2.baseline_id = 'sog_registry_v2_basis_cash_lineage_2026_06_24';
v2.captured_at = '2026-06-24';
v2.source_commit = 'basis-cash-lineage';
v2.minimum_counts.events = 126;
v2.minimum_counts.event_details = 126;
v2.minimum_counts.evidence = 381;
v2.minimum_counts.evidence_relations = 376;
writeJson(v2Path, v2);

const v3Path = 'docs/migration/registry-v3-baseline.json';
const v3 = readJson(v3Path);
v3.baseline_id = 'sog_registry_v3_basis_cash_lineage_2026_06_24';
v3.recorded_at = '2026-06-24';
v3.data_checkpoint_commit = 'basis-cash-lineage';
v3.expected_counts.events = 126;
v3.expected_counts.event_details = 126;
v3.expected_counts.evidence = 381;
v3.quality.launch_date_unresolved = launchQueue.expected_total;
writeJson(v3Path, v3);

let readme = readText('README.md');
readme = readme
  .replace('124 events', '126 events')
  .replace('124 Event v2 detail records', '126 Event v2 detail records')
  .replace('377 evidence records', '381 evidence records')
  .replace('377 evidence relation projections', '381 evidence relation projections')
  .replace('25 unresolved launch dates', '24 unresolved launch dates');
writeText('README.md', readme);

const nameById = new Map();
for (const file of v2.data_groups.stablecoins) {
  for (const row of readJson(file)) nameById.set(row.id, row.name);
}
const rowsByCategory = Object.groupBy(launchQueue.records, (row) => row.category);
const table = (category) => {
  const rows = rowsByCategory[category] ?? [];
  return [
    '| Stable asset | ID | Best known range | Reason |',
    '|---|---|---|---|',
    ...rows.map((row) => `| ${nameById.get(row.stablecoin_id) ?? row.stablecoin_id} | \`${row.stablecoin_id}\` | ${row.best_known_range ?? '—'} | ${row.review_note} |`)
  ].join('\n');
};
const review = `# Remaining Launch-Date Review\n\nUpdated: 2026-06-24\n\n## Purpose\n\nThis document is the human-readable companion to \`data/quality/launch-date-unresolved.json\`. The machine-readable queue and the canonical \`launch_date: null\` set must match exactly. Day-level dates are added only when a reviewed first-party or on-chain public boundary supports them.\n\n## Current queue\n\n\`\`\`text\nTotal unresolved: ${launchQueue.expected_total}\nCategory B: ${launchQueue.category_counts.B}\nCategory C: ${launchQueue.category_counts.C}\nCategory D: ${launchQueue.category_counts.D}\n\`\`\`\n\n## Recently resolved bounded records\n\n- EURA — agEUR launch separated from the later EURA rebrand.\n- lisUSD — HAY launch separated from the lisUSD rebrand.\n- sUSD — eUSD, nUSD launch, and sUSD rename separated.\n- Nuon — v1 and v2 product boundaries separated.\n- SPOT — original launch separated from later protocol versions.\n- fxUSD — public availability separated from announcement, seeding, and V2 upgrade.\n- MAI — Polygon public launch separated from rename and V2 activation.\n- Savings DAI — contract deployment on 2023-01-17 separated from public Spark availability on 2023-05-09.\n- Basis Cash — original public launch fixed to 2020-11-30 while V2 activation and unresolved terminal boundaries remain separate.\n\nUSDX, sUSDe, and Agora AUSD have completed bounded audits, but their canonical launch dates remain unresolved and therefore stay in Category C. Agora AUSD’s current Ethereum contract deployment is fixed to 2024-07-07 without treating deployment as public launch.\n\n## Category B — partial date only\n\n${table('B')}\n\n## Category C — boundary, version, or lineage conflict\n\n${table('C')}\n\n## Category D — adequate primary source not recovered\n\n${table('D')}\n\n## Fixed policy\n\n- Require day-level primary or on-chain evidence for a canonical launch date.\n- Do not coerce month or year into a date.\n- Do not use exchange listings as the default launch boundary.\n- Do not substitute a rebrand, migration, contract deployment, testnet, guarded beta, or later product version for the original public boundary.\n- Keep unresolved values as \`null\`.\n\n## Current completion state\n\n\`\`\`text\nOriginal review scope: complete\nCurrent unresolved queue: ${launchQueue.expected_total}\nCategory B: ${launchQueue.category_counts.B}\nCategory C: ${launchQueue.category_counts.C}\nCategory D: ${launchQueue.category_counts.D}\nMachine-readable queue: data/quality/launch-date-unresolved.json\nNext bounded review: Cashio Dollar\n\`\`\`\n`;
writeText('docs/audits/remaining-launch-date-review.md', review);

let roadmap = readText('docs/roadmap.md');
roadmap = roadmap
  .replace('PR #122 — Audit Agora AUSD launch boundary\nMerge: fa4742eed871f9fb82a5573501ca7a88a8c73943', 'PR #124 — Audit Basis Cash launch and terminal boundaries\nMerge: 334d5ef8a4a31a10a754d5b30fdbdb26ef17d05f')
  .replace('Latest reviewed record: Agora AUSD\nNext bounded record: Basis Cash', 'Latest resolved record: Basis Cash launch\nNext bounded record: Cashio Dollar')
  .replace('PR #122 — Audit Agora AUSD launch boundary', 'PR #122 — Audit Agora AUSD launch boundary\nPR #123 — Normalize Agora AUSD Ethereum deployment\nPR #124 — Audit Basis Cash launch and terminal boundaries')
  .replace('## Current canonical registry after Agora AUSD deployment normalization', '## Current canonical registry after Basis Cash launch resolution')
  .replace('124 events\n124 Event v2 detail records\n377 evidence records', '126 events\n126 Event v2 detail records\n381 evidence records')
  .replace('Missing canonical launch dates:            25', 'Missing canonical launch dates:            24')
  .replace('Total unresolved: 25\nCategory B:         3\nCategory C:        19\nCategory D:         3', 'Total unresolved: 24\nCategory B:         3\nCategory C:        18\nCategory D:         3')
  .replace('AUSD   — Ethereum production contract fixed to 2024-07-07 while first mint, approved access, and public launch remain unresolved', 'AUSD   — Ethereum production contract fixed to 2024-07-07 while first mint, approved access, and public launch remain unresolved\nBAC    — original public launch fixed to 2020-11-30; V2 activation fixed to 2021-04-26; terminal date remains unresolved')
  .replace(/1\. Do not deploy or change Cloudflare while access is unavailable\.\n2\. Audit Basis Cash[\s\S]*?6\. When Cloudflare access returns, publish latest merged main manually and verify production parity before controlled record growth resumes\./, '1. Do not deploy or change Cloudflare while access is unavailable.\n2. Audit Cashio Dollar as the next bounded Category C launch-boundary record.\n3. Separate Solana mint deployment, first public mint availability, initial liquidity, exploit, peg collapse, and practical shutdown.\n4. Assign no Cashio launch date without day-level primary or on-chain public-availability evidence.\n5. Keep launch and terminal queues, generated outputs, integrity audit, Registry v3 baseline, README, and roadmap synchronized in every quality PR.\n6. When Cloudflare access returns, publish latest merged main manually and verify production parity before controlled record growth resumes.');
writeText('docs/roadmap.md', roadmap);

execFileSync(process.execPath, ['scripts/generate-registry-stats.mjs'], { stdio: 'inherit' });
execFileSync(process.execPath, ['scripts/audit-registry-integrity.mjs'], { stdio: 'inherit' });
console.log('Basis Cash canonical lineage synchronization complete.');
