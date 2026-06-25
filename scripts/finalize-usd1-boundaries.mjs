import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const readJson = (path) => JSON.parse(fs.readFileSync(path, 'utf8'));
const writeJson = (path, value) => fs.writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
const requireRow = (rows, id, path) => {
  const row = rows.find((item) => item.id === id);
  if (!row) throw new Error(`${path}: missing ${id}`);
  return row;
};
const replaceRequired = (text, search, replacement, label) => {
  if (!text.includes(search)) throw new Error(`Missing expected text for ${label}`);
  return text.replace(search, replacement);
};
const ensureAbsent = (rows, id, path) => {
  if (rows.some((item) => item.id === id)) throw new Error(`${path}: duplicate ${id}`);
};

const stablecoinPath = 'data/stablecoins-batch-f.json';
const stablecoins = readJson(stablecoinPath);
const usd1 = requireRow(stablecoins, 'sog_st_usd1', stablecoinPath);
usd1.launch_date = null;
usd1.last_verified_at = '2026-06-25';
usd1.notes = 'Batch F promotion. The official Ethereum and BNB Smart Chain contracts were created on 2025-01-28. World Liberty Financial announced plans to launch USD1 on 2025-03-25, and an official 2025-04-07 proposal still described an airdrop test before broader market access. First-party retrospective evidence establishes April 2025 only at month level, so launch_date remains null.';
writeJson(stablecoinPath, stablecoins);

const introductionEventId = 'sog_ev_usd1_introduction_2025';
const testingEventId = 'sog_ev_usd1_airdrop_test_2025';
const eventPath = 'data/events-batch-f.json';
const events = readJson(eventPath);
const introductionEvent = requireRow(events, 'sog_ev_usd1_2025_launch', eventPath);
introductionEvent.id = introductionEventId;
introductionEvent.event_type = 'announcement';
introductionEvent.event_date = '2025-03-25';
introductionEvent.title = 'World Liberty Financial announces plans for USD1';
introductionEvent.description = 'World Liberty Financial and BitGo publicly introduced USD1 and described plans for issuance on Ethereum and BNB Smart Chain. The announcement used future-oriented launch language and is recorded as an introduction rather than the canonical public launch.';
introductionEvent.impact_level = 'medium';
introductionEvent.confidence = 'high';
introductionEvent.source_count = 1;
introductionEvent.event_status_effect = 'none';
introductionEvent.notes = 'Contract deployment occurred on 2025-01-28. The exact day of broader public availability remains unresolved.';
ensureAbsent(events, testingEventId, eventPath);
events.push({
  id: testingEventId,
  stablecoin_id: 'sog_st_usd1',
  issuer_id: 'sog_issuer_bitgo',
  event_type: 'testing',
  event_date: '2025-04-07',
  title: 'World Liberty Financial proposes USD1 airdrop test',
  description: 'World Liberty Financial proposed distributing a small amount of USD1 to test on-chain airdrop functionality and described the exercise as preparation before broader market access.',
  impact_level: 'low',
  confidence: 'high',
  source_count: 1,
  event_status_effect: 'none',
  notes: 'This is a testing boundary and is not treated as the original public launch.'
});
writeJson(eventPath, events);

const detailPath = 'data/event-details-batch-f.json';
const details = readJson(detailPath);
const introductionDetail = requireRow(details, 'sog_ev_usd1_2025_launch', detailPath);
introductionDetail.id = introductionEventId;
introductionDetail.title = 'World Liberty Financial announces plans for USD1';
introductionDetail.evidence_ids = ['sog_src_usd1_introduction_2025'];
introductionDetail.event_detail_kind = 'other';
delete introductionDetail.launch_detail;
ensureAbsent(details, testingEventId, detailPath);
details.push({
  id: testingEventId,
  title: 'World Liberty Financial proposes USD1 airdrop test',
  subject_stablecoin_ids: ['sog_st_usd1'],
  subject_organization_ids: ['sog_issuer_bitgo', 'sog_org_world_liberty_financial'],
  evidence_ids: ['sog_src_usd1_airdrop_test_2025'],
  event_detail_kind: 'other'
});
writeJson(detailPath, details);

const evidenceFPath = 'data/evidence-batch-f.json';
const evidenceF = readJson(evidenceFPath);
for (const id of ['sog_src_usd1_faq_batch_f', 'sog_src_usd1_reserves_batch_f', 'sog_src_usd1_risk_batch_f']) {
  const row = requireRow(evidenceF, id, evidenceFPath);
  row.event_id = null;
  row.event_ids = [];
}
writeJson(evidenceFPath, evidenceF);

const evidenceNPath = 'data/evidence-batch-n.json';
const evidenceN = readJson(evidenceNPath);
const newEvidence = [
  {
    id: 'sog_src_usd1_contract_addresses_2025',
    stablecoin_id: 'sog_st_usd1',
    issuer_id: 'sog_issuer_bitgo',
    event_id: null,
    source_type: 'official_documentation',
    title: 'USD1 official contract addresses',
    url: 'https://docs.worldlibertyfinancial.com/usd1-token/contract-addresses',
    publisher: 'World Liberty Financial',
    published_at: null,
    archived_url: 'https://web.archive.org/web/*/https://docs.worldlibertyfinancial.com/usd1-token/contract-addresses',
    accessed_at: '2026-06-25',
    reliability: 'high',
    claim_scope: 'deployment_identity',
    stablecoin_ids: ['sog_st_usd1'],
    organization_ids: ['sog_issuer_bitgo', 'sog_org_world_liberty_financial'],
    event_ids: [],
    claim_scopes: ['ethereum_contract', 'bnb_contract', 'issuer_supported_deployments'],
    notes: 'Official documentation identifies the same USD1 address on Ethereum and BNB Smart Chain.'
  },
  {
    id: 'sog_src_usd1_ethereum_deployment_2025',
    stablecoin_id: 'sog_st_usd1',
    issuer_id: 'sog_issuer_bitgo',
    event_id: null,
    source_type: 'onchain_explorer',
    title: 'USD1 Ethereum contract creation',
    url: 'https://etherscan.io/tx/0x1cf37f0670ce56d9489d7ec4c4ccddbd6ab59df95b316aafc353edc3a6862896',
    publisher: 'Etherscan',
    published_at: '2025-01-28',
    archived_url: 'https://web.archive.org/web/*/https://etherscan.io/tx/0x1cf37f0670ce56d9489d7ec4c4ccddbd6ab59df95b316aafc353edc3a6862896',
    accessed_at: '2026-06-25',
    reliability: 'high',
    claim_scope: 'ethereum_contract_deployment',
    stablecoin_ids: ['sog_st_usd1'],
    organization_ids: ['sog_issuer_bitgo', 'sog_org_world_liberty_financial'],
    event_ids: [],
    claim_scopes: ['contract_creation_date', 'deployment_boundary', 'pre_introduction_deployment'],
    notes: 'The official USD1 Ethereum contract was created on 2025-01-28 at 04:01:35 UTC. Deployment is not treated as public launch.'
  },
  {
    id: 'sog_src_usd1_bnb_deployment_2025',
    stablecoin_id: 'sog_st_usd1',
    issuer_id: 'sog_issuer_bitgo',
    event_id: null,
    source_type: 'onchain_explorer',
    title: 'USD1 BNB Smart Chain contract creation',
    url: 'https://bscscan.com/tx/0x0dcbe0103fadabf494e2c5717d5fd01b1e0016607b00283b97aeee23875abba3',
    publisher: 'BscScan',
    published_at: '2025-01-28',
    archived_url: 'https://web.archive.org/web/*/https://bscscan.com/tx/0x0dcbe0103fadabf494e2c5717d5fd01b1e0016607b00283b97aeee23875abba3',
    accessed_at: '2026-06-25',
    reliability: 'high',
    claim_scope: 'bnb_contract_deployment',
    stablecoin_ids: ['sog_st_usd1'],
    organization_ids: ['sog_issuer_bitgo', 'sog_org_world_liberty_financial'],
    event_ids: [],
    claim_scopes: ['contract_creation_date', 'deployment_boundary', 'pre_introduction_deployment'],
    notes: 'The official USD1 BNB Smart Chain contract was created on 2025-01-28 at 04:03:41 UTC. Deployment is not treated as public launch.'
  },
  {
    id: 'sog_src_usd1_introduction_2025',
    stablecoin_id: 'sog_st_usd1',
    issuer_id: 'sog_issuer_bitgo',
    event_id: introductionEventId,
    source_type: 'official_statement',
    title: 'World Liberty Financial plans to launch USD1',
    url: 'https://www.businesswire.com/news/home/20250325773694/en/World-Liberty-Financial-Plans-to-Launch-USD1-the-Institutional-Ready-Stablecoin',
    publisher: 'World Liberty Financial / Business Wire',
    published_at: '2025-03-25',
    archived_url: 'https://web.archive.org/web/*/https://www.businesswire.com/news/home/20250325773694/en/World-Liberty-Financial-Plans-to-Launch-USD1-the-Institutional-Ready-Stablecoin',
    accessed_at: '2026-06-25',
    reliability: 'high',
    claim_scope: 'product_introduction_and_planned_launch',
    stablecoin_ids: ['sog_st_usd1'],
    organization_ids: ['sog_issuer_bitgo', 'sog_org_world_liberty_financial'],
    event_ids: [introductionEventId],
    claim_scopes: ['announcement_date', 'planned_launch', 'initial_networks', 'issuer_and_brand_roles'],
    notes: 'The release uses plans-to-launch language and does not establish completed broad public availability on 2025-03-25.'
  },
  {
    id: 'sog_src_usd1_airdrop_test_2025',
    stablecoin_id: 'sog_st_usd1',
    issuer_id: 'sog_issuer_bitgo',
    event_id: testingEventId,
    source_type: 'governance_proposal',
    title: 'Proposal to test USD1 airdrop functionality',
    url: 'https://governance.worldlibertyfinancial.com/t/proposal-test-airdrop-functionality-by-distributing-usd1-to-all-wlfi-token-holders/4794',
    publisher: 'World Liberty Financial Governance',
    published_at: '2025-04-07',
    archived_url: 'https://web.archive.org/web/*/https://governance.worldlibertyfinancial.com/t/proposal-test-airdrop-functionality-by-distributing-usd1-to-all-wlfi-token-holders/4794',
    accessed_at: '2026-06-25',
    reliability: 'high',
    claim_scope: 'testing_before_broader_market_access',
    stablecoin_ids: ['sog_st_usd1'],
    organization_ids: ['sog_issuer_bitgo', 'sog_org_world_liberty_financial'],
    event_ids: [testingEventId],
    claim_scopes: ['airdrop_test', 'onchain_functionality_test', 'pre_broader_market_access'],
    notes: 'The proposal describes a small test distribution before broader market access and is not a public-launch statement.'
  }
];
for (const row of newEvidence) {
  ensureAbsent(evidenceN, row.id, evidenceNPath);
  evidenceN.push(row);
}
writeJson(evidenceNPath, evidenceN);

const deploymentPath = 'data/deployments-batch-f.json';
const deployments = readJson(deploymentPath);
const ethereumDeployment = requireRow(deployments, 'sog_dep_usd1_ethereum_batch_f', deploymentPath);
ethereumDeployment.contract_address = '0x8d0d000ee44948fc98c9b98a4fa4921476f08b0d';
ethereumDeployment.notes = 'Official issuer-supported Ethereum USD1 contract created on 2025-01-28 at 04:01:35 UTC. Contract creation predates the March 25 introduction and does not establish public launch.';
ethereumDeployment.evidence_ids = ['sog_src_usd1_faq_batch_f', 'sog_src_usd1_reserves_batch_f', 'sog_src_usd1_contract_addresses_2025', 'sog_src_usd1_ethereum_deployment_2025'];
const bnbDeployment = requireRow(deployments, 'sog_dep_usd1_bnb_batch_f', deploymentPath);
bnbDeployment.contract_address = '0x8d0d000ee44948fc98c9b98a4fa4921476f08b0d';
bnbDeployment.notes = 'Official issuer-supported BNB Smart Chain USD1 contract created on 2025-01-28 at 04:03:41 UTC. Contract creation predates the March 25 introduction and does not establish public launch.';
bnbDeployment.evidence_ids = ['sog_src_usd1_faq_batch_f', 'sog_src_usd1_reserves_batch_f', 'sog_src_usd1_contract_addresses_2025', 'sog_src_usd1_bnb_deployment_2025'];
writeJson(deploymentPath, deployments);

const unknownPath = 'data/known-unknowns-batch-f.json';
const unknowns = readJson(unknownPath);
const launchUnknown = requireRow(unknowns, 'sog_ku_usd1_launch_date_batch_f', unknownPath);
launchUnknown.topic = 'exact_public_launch_date';
launchUnknown.description = 'The official Ethereum and BNB Smart Chain deployments are fixed to 2025-01-28, the first-party introduction to 2025-03-25, and the airdrop testing proposal to 2025-04-07. First-party retrospective evidence supports April 2025 only at month level, while the exact first issuance and broader public-access day remain unresolved.';
launchUnknown.severity = 'low';
launchUnknown.last_checked_at = '2026-06-25';
launchUnknown.notes = 'Keep launch_date null. Do not substitute contract creation, planned-launch announcement, testing, or a later exchange listing for the original public boundary.';
writeJson(unknownPath, unknowns);

const queuePath = 'data/quality/launch-date-unresolved.json';
const queue = readJson(queuePath);
const usd1Queue = queue.records.find((row) => row.stablecoin_id === 'sog_st_usd1');
if (!usd1Queue) throw new Error(`${queuePath}: missing sog_st_usd1`);
usd1Queue.best_known_range = '2025-04';
usd1Queue.reason_code = 'launch_boundary_conflict';
usd1Queue.review_note = 'January 28 deployments, March 25 introduction, and April 7 testing are fixed; a first-party retrospective establishes April 2025 only at month level, while first issuance and broader public availability remain unresolved.';
queue.frozen_at = '2026-06-25';
writeJson(queuePath, queue);

const auditPath = 'docs/audits/usd1-launch-boundary-review.md';
let audit = fs.readFileSync(auditPath, 'utf8');
audit = replaceRequired(audit, 'Result: PUBLIC LAUNCH DATE REMAINS UNRESOLVED', 'Result: IMPLEMENTED — PUBLIC LAUNCH DATE REMAINS UNRESOLVED', 'USD1 audit result');
audit = replaceRequired(audit, '## Resolved quality improvements\n\nAlthough the public launch date remains unresolved, the follow-up implementation should:', '## Implementation result\n\nThe public launch date remains unresolved, and the canonical quality implementation:', 'USD1 implementation heading');
audit = audit.replace('1. normalize the official Ethereum contract address\n2. normalize the official BNB Smart Chain contract address\n3. record both 2025-01-28 contract-creation boundaries\n4. add the official March 25 introduction as a dated event separate from launch\n5. add the April 7 test-airdrop proposal as a testing boundary\n6. preserve an April 2025 best-known launch range without coercing it into a day\n7. update the USD1 known unknown to distinguish deployment, testing, introduction, issuance, and broad access\n8. keep USD1 in the unresolved launch queue\n9. keep the total queue at 22 and Category C at 16', '1. normalizes the official Ethereum contract address\n2. normalizes the official BNB Smart Chain contract address\n3. records both 2025-01-28 contract-creation boundaries\n4. adds the official March 25 introduction as a dated event separate from launch\n5. adds the April 7 test-airdrop proposal as a testing boundary\n6. preserves an April 2025 best-known launch range without coercing it into a day\n7. updates the USD1 known unknown to distinguish deployment, testing, introduction, issuance, and broad access\n8. keeps USD1 in the unresolved launch queue\n9. keeps the total queue at 22 and Category C at 16');
fs.writeFileSync(auditPath, audit);

const remainingPath = 'docs/audits/remaining-launch-date-review.md';
let remaining = fs.readFileSync(remainingPath, 'utf8');
remaining = replaceRequired(remaining, '- DOLA — Ethereum contract creation on 2021-02-23 separated from the public Anchor and DOLA launch on 2021-02-25; the exact first mint remains unresolved.', '- DOLA — Ethereum contract creation on 2021-02-23 separated from the public Anchor and DOLA launch on 2021-02-25; the exact first mint remains unresolved.\n- USD1 — Ethereum and BNB Smart Chain deployments on 2025-01-28, the 2025-03-25 introduction, and the 2025-04-07 airdrop test were separated; public launch remains unresolved at April 2025 month level.', 'remaining audit USD1 bullet');
remaining = replaceRequired(remaining, '| World Liberty Financial USD | `sog_st_usd1` | 2025-03 | Introduction, issuance, testing, and availability differ. |', '| World Liberty Financial USD | `sog_st_usd1` | 2025-04 | January deployments, March introduction, April testing, first issuance, and broader availability differ. |', 'remaining audit USD1 row');
remaining = replaceRequired(remaining, 'Next bounded review: USD1', 'Next bounded review: MIM', 'remaining audit next review');
fs.writeFileSync(remainingPath, remaining);

const readmePath = 'README.md';
let readme = fs.readFileSync(readmePath, 'utf8');
readme = replaceRequired(readme, '129 events\n129 Event v2 detail records\n389 evidence records\n389 evidence relation projections', '130 events\n130 Event v2 detail records\n394 evidence records\n394 evidence relation projections', 'README counts');
fs.writeFileSync(readmePath, readme);

const roadmapPath = 'docs/roadmap.md';
let roadmap = fs.readFileSync(roadmapPath, 'utf8');
roadmap = replaceRequired(roadmap, 'Latest merged PR: #140 — Resolve DOLA launch boundary\nLatest merged commit: d7ea9cb79a03bc0911423652926ea9a034ded1f1\nCurrent work: USD1 bounded launch-boundary audit\nCanonical launch conclusion: keep launch_date null\nResolved implementation target: normalize deployments and dated introduction/testing events\nNext bounded review after USD1 implementation: MIM', 'Latest merged PR: #141 — Audit USD1 launch boundaries\nLatest merged commit: c2ecd9a537fb8a339e81c50bf79d0eb6f0b8a032\nCurrent work: USD1 canonical quality implementation\nCanonical launch conclusion: launch_date remains null\nImplementation result: deployments, introduction, and testing boundaries normalized\nNext bounded review after merge: MIM', 'roadmap current position');
roadmap = replaceRequired(roadmap, 'Follow-up canonical implementation must:', 'Canonical implementation result:');
roadmap = roadmap.replace('- normalize the official Ethereum and BNB Smart Chain contract addresses\n- record both January 28 deployment boundaries\n- add the March 25 introduction event\n- add the April 7 testing event\n- preserve the April 2025 best-known range without coercing a day\n- keep USD1 in the unresolved launch queue', '- official Ethereum and BNB Smart Chain contract addresses normalized\n- both January 28 deployment boundaries recorded\n- March 25 introduction event added\n- April 7 testing event added\n- April 2025 best-known range preserved without coercing a day\n- USD1 remains in the unresolved launch queue');
roadmap = replaceRequired(roadmap, '129 events\n129 Event v2 detail records\n389 evidence records\n389 evidence relation projections', '130 events\n130 Event v2 detail records\n394 evidence records\n394 evidence relation projections', 'roadmap counts');
roadmap = replaceRequired(roadmap, 'Next bounded launch-date review after USD1 implementation:', 'Next bounded launch-date review:');
const sequenceStart = roadmap.indexOf('## Full execution sequence');
const immediateStart = roadmap.indexOf('## Immediate next work', sequenceStart);
if (sequenceStart < 0 || immediateStart < 0) throw new Error('Unable to locate roadmap execution sections');
roadmap = `${roadmap.slice(0, sequenceStart)}## Full execution sequence\n\n\`\`\`text\nPhase 1 — Complete USD1 implementation\n1. Synchronize baselines, generated outputs, README, audits, and roadmap.\n2. Remove temporary synchronization code.\n3. Run all six CI workflows.\n4. Merge the USD1 implementation PR only after every check passes.\n\nPhase 2 — Continue launch-date quality wave\n5. Audit MIM Cauldron deployment, first issuance, announcement, and UI availability boundaries.\n6. Audit mUSD.\n7. Audit USK.\n8. Audit VAI.\n9. Audit VCHF.\n10. Audit IRON.\n\nPhase 3 — Cross-queue maintenance\n11. Recheck HUSD and EURT reserve-source status only when durable product-specific evidence is found.\n12. Keep BAC, DSD, ESD, and GYEN terminal dates unresolved until matching end-boundary evidence exists.\n\nPhase 4 — Controlled growth\n13. Prepare a reviewed candidate master.\n14. Promote no more than five complete stable-asset records per batch.\n15. Publish and verify production after each growth batch.\n16. Do not allow production to trail main by more than one growth batch.\n\nPhase 5 — Normal operating cycle\n17. Alternate two or three existing-record quality audits with one growth batch of no more than five records.\n18. Insert urgent incident, regulatory, depeg, wind-down, or redemption updates ahead of the routine queue when necessary.\n\`\`\`\n\n${roadmap.slice(immediateStart)}`;
const productionStart = roadmap.indexOf('## Production policy', roadmap.indexOf('## Immediate next work'));
roadmap = `${roadmap.slice(0, roadmap.indexOf('## Immediate next work'))}## Immediate next work\n\n\`\`\`text\n1. Complete final CI and merge the USD1 implementation PR.\n2. Report that launch_date remains null and queue counts remain 22 / C16.\n3. Start the bounded MIM launch-boundary audit.\n4. Separate Cauldron deployment, first issuance, announcement, and public UI availability.\n5. Do not substitute a later chain deployment or rebrand for the original MIM boundary.\n\`\`\`\n\n${roadmap.slice(productionStart)}`;
fs.writeFileSync(roadmapPath, roadmap);

const v2Path = 'docs/migration/registry-v2-baseline.json';
const v2 = readJson(v2Path);
v2.baseline_id = 'sog_registry_v2_usd1_boundaries_2026_06_25';
v2.captured_at = '2026-06-25';
v2.source_commit = 'usd1-boundaries';
v2.minimum_counts.events = 130;
v2.minimum_counts.event_details = 130;
v2.minimum_counts.evidence = 394;
v2.minimum_counts.evidence_relations = 394;
writeJson(v2Path, v2);

const v3Path = 'docs/migration/registry-v3-baseline.json';
const v3 = readJson(v3Path);
v3.baseline_id = 'sog_registry_v3_usd1_boundaries_2026_06_25';
v3.recorded_at = '2026-06-25';
v3.data_checkpoint_commit = 'usd1-boundaries';
v3.expected_counts.events = 130;
v3.expected_counts.event_details = 130;
v3.expected_counts.evidence = 394;
v3.quality.launch_date_unresolved = 22;
writeJson(v3Path, v3);

execFileSync('node', ['scripts/generate-registry-stats.mjs'], { stdio: 'inherit' });
execFileSync('node', ['scripts/audit-registry-integrity.mjs'], { stdio: 'inherit' });
execFileSync('node', ['scripts/validate-registry-stats.mjs'], { stdio: 'inherit' });

const workflowPath = '.github/workflows/registry-stats.yml';
fs.writeFileSync(workflowPath, `name: Registry stats\n\non:\n  pull_request:\n  push:\n    branches: [main]\n\npermissions:\n  contents: read\n\njobs:\n  validate:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with:\n          node-version: 22\n      - name: Validate current output\n        run: node scripts/validate-registry-stats.mjs\n      - name: Rebuild output\n        run: node scripts/generate-registry-stats.mjs\n      - name: Validate rebuilt output\n        run: node scripts/validate-registry-stats.mjs\n      - uses: actions/upload-artifact@v4\n        with:\n          name: registry-stats\n          path: data/generated/registry-stats.json\n`);

fs.unlinkSync('scripts/finalize-usd1-boundaries.mjs');

if (process.env.GITHUB_ACTIONS === 'true') {
  const headRef = process.env.GITHUB_HEAD_REF;
  if (!headRef) throw new Error('GITHUB_HEAD_REF is required');
  execFileSync('git', ['config', 'user.name', 'github-actions[bot]']);
  execFileSync('git', ['config', 'user.email', '41898282+github-actions[bot]@users.noreply.github.com']);
  execFileSync('git', ['add', '-A']);
  execFileSync('git', ['commit', '-m', 'Implement USD1 deployment and testing boundaries'], { stdio: 'inherit' });
  execFileSync('git', ['push', 'origin', `HEAD:${headRef}`], { stdio: 'inherit' });
}
