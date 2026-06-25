import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const readJson = (path) => JSON.parse(fs.readFileSync(path, 'utf8'));
const writeJson = (path, value) => fs.writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
const requireRow = (rows, id, path) => {
  const row = rows.find((item) => item.id === id);
  if (!row) throw new Error(`${path}: missing ${id}`);
  return row;
};
const ensureAbsent = (rows, id, path) => {
  if (rows.some((item) => item.id === id)) throw new Error(`${path}: duplicate ${id}`);
};
const replaceIn = (path, search, replacement, label) => {
  let text = fs.readFileSync(path, 'utf8');
  if (!text.includes(search)) throw new Error(`${path}: missing ${label}`);
  text = text.replace(search, replacement);
  fs.writeFileSync(path, text);
};

const introEventId = 'sog_ev_mim_introduction_2021';
const liquidityEventId = 'sog_ev_mim_liquidity_incentives_2021';

const eventsPath = 'data/events-batch-a.json';
const events = readJson(eventsPath);
ensureAbsent(events, introEventId, eventsPath);
ensureAbsent(events, liquidityEventId, eventsPath);
events.unshift(
  {
    id: introEventId,
    stablecoin_id: 'sog_st_mim',
    issuer_id: 'sog_issuer_abracadabra',
    event_type: 'announcement',
    event_date: '2021-05-05',
    title: 'Abracadabra introduces Magic Internet Money',
    description: 'Abracadabra published its original introduction to the protocol, SPELL, and Magic Internet Money. The article establishes the product introduction but does not prove that a public Cauldron or mint route was already operational.',
    impact_level: 'medium',
    event_status_effect: 'none',
    recovered: null,
    recovery_date: null,
    failure_mechanism: 'not_applicable',
    confidence: 'high',
    source_count: 1,
    notes: 'The canonical launch date remains unresolved because introduction is separate from first public borrowing and issuance.'
  },
  {
    id: liquidityEventId,
    stablecoin_id: 'sog_st_mim',
    issuer_id: 'sog_issuer_abracadabra',
    event_type: 'liquidity_incentive_start',
    event_date: '2021-06-05',
    title: 'MIM/3CRV LP staking rewards begin',
    description: 'Abracadabra recorded June 5, 2021 as the start of LP staking rewards for the MIM/3CRV liquidity program. A June 11 first-party proposal also confirmed that the first lending market and incentive program had launched less than two weeks earlier.',
    impact_level: 'medium',
    event_status_effect: 'active',
    recovered: null,
    recovery_date: null,
    failure_mechanism: 'not_applicable',
    confidence: 'high',
    source_count: 1,
    notes: 'This is a liquidity and incentive boundary, not the unresolved original public Cauldron launch.'
  }
);
writeJson(eventsPath, events);

const detailsPath = 'data/event-details-batch-a.json';
const details = readJson(detailsPath);
ensureAbsent(details, introEventId, detailsPath);
ensureAbsent(details, liquidityEventId, detailsPath);
details.unshift(
  {
    id: introEventId,
    title: 'Abracadabra introduces Magic Internet Money',
    subject_stablecoin_ids: ['sog_st_mim'],
    subject_organization_ids: ['sog_issuer_abracadabra'],
    evidence_ids: ['sog_src_mim_introduction_2021'],
    event_detail_kind: 'other'
  },
  {
    id: liquidityEventId,
    title: 'MIM/3CRV LP staking rewards begin',
    subject_stablecoin_ids: ['sog_st_mim'],
    subject_organization_ids: ['sog_issuer_abracadabra'],
    evidence_ids: ['sog_src_mim_curve_live_2021'],
    event_detail_kind: 'other'
  }
);
writeJson(detailsPath, details);

const evidencePath = 'data/evidence-batch-n.json';
const evidence = readJson(evidencePath);
const additions = [
  {
    id: 'sog_src_mim_introduction_2021', stablecoin_id: 'sog_st_mim', issuer_id: 'sog_issuer_abracadabra', event_id: introEventId,
    source_type: 'official_blog', title: 'Abracadabra, SPELL and Magic Internet Money',
    url: 'https://medium.com/abracadabra-money/abracadabra-spell-and-magic-internet-money-a563637ce92e', publisher: 'Abracadabra Money', published_at: '2021-05-05',
    archived_url: 'https://web.archive.org/web/*/https://medium.com/abracadabra-money/abracadabra-spell-and-magic-internet-money-a563637ce92e', accessed_at: '2026-06-25', reliability: 'high',
    claim_scope: 'product_and_protocol_introduction', stablecoin_ids: ['sog_st_mim'], organization_ids: ['sog_issuer_abracadabra'], event_ids: [introEventId],
    claim_scopes: ['introduction_date', 'mim_identity', 'abracadabra_protocol_design'], notes: 'Dated first-party introduction. It does not establish the first public Cauldron or minting day.'
  },
  {
    id: 'sog_src_mim_ethereum_deployment_2021', stablecoin_id: 'sog_st_mim', issuer_id: 'sog_issuer_abracadabra', event_id: null,
    source_type: 'onchain_explorer', title: 'MIM Ethereum contract creation',
    url: 'https://etherscan.io/tx/0x42dc8aae5acb46454f0355787c9add15f58ec1a7cc9f79ca2ba5499bcf855ef7', publisher: 'Etherscan', published_at: '2021-05-25',
    archived_url: 'https://web.archive.org/web/*/https://etherscan.io/tx/0x42dc8aae5acb46454f0355787c9add15f58ec1a7cc9f79ca2ba5499bcf855ef7', accessed_at: '2026-06-25', reliability: 'high',
    claim_scope: 'ethereum_contract_deployment', stablecoin_ids: ['sog_st_mim'], organization_ids: ['sog_issuer_abracadabra'], event_ids: [],
    claim_scopes: ['contract_creation_date', 'deployment_boundary', 'pre_public_launch_deployment'], notes: 'The official MIM Ethereum contract was created on 2021-05-25. Deployment is not treated as public launch.'
  },
  {
    id: 'sog_src_mim_curve_live_2021', stablecoin_id: 'sog_st_mim', issuer_id: 'sog_issuer_abracadabra', event_id: liquidityEventId,
    source_type: 'governance_proposal', title: 'sCIP#40 Adding a MIM/3Pool metapool',
    url: 'https://gov.curve.finance/t/scip-40-adding-a-mim-3pool-metapool/1850', publisher: 'Abracadabra Money via Curve Governance', published_at: '2021-06-11',
    archived_url: 'https://web.archive.org/web/*/https://gov.curve.finance/t/scip-40-adding-a-mim-3pool-metapool/1850', accessed_at: '2026-06-25', reliability: 'high',
    claim_scope: 'early_lending_market_and_liquidity_operation', stablecoin_ids: ['sog_st_mim'], organization_ids: ['sog_issuer_abracadabra'], event_ids: [liquidityEventId],
    claim_scopes: ['first_lending_market_range', 'lp_rewards_start', 'live_protocol_use', 'mim_supply_and_liquidity'], notes: 'First-party proposal states that the first lending market and LP incentives launched less than two weeks earlier and fixes LP reward start to 2021-06-05.'
  }
];
for (const row of additions) { ensureAbsent(evidence, row.id, evidencePath); evidence.push(row); }
writeJson(evidencePath, evidence);

const deploymentPath = 'data/deployments-batch-a.json';
const deployments = readJson(deploymentPath);
const mimDeployment = requireRow(deployments, 'sog_dep_mim_ethereum', deploymentPath);
mimDeployment.notes = 'Official Ethereum MIM contract created on 2021-05-25. Contract deployment is separate from the unresolved first public Cauldron, first issuance, and UI-availability boundaries.';
mimDeployment.evidence_ids = ['sog_src_mim_tokenomics_batch_a', 'sog_src_mim_ethereum_deployment_2021'];
writeJson(deploymentPath, deployments);

const unknownPath = 'data/known-unknowns-batch-a.json';
const unknowns = readJson(unknownPath);
ensureAbsent(unknowns, 'sog_unk_mim_launch_boundary', unknownPath);
unknowns.unshift({ id: 'sog_unk_mim_launch_boundary', stablecoin_id: 'sog_st_mim', issuer_id: 'sog_issuer_abracadabra', topic: 'exact_public_launch_boundary', description: 'The official introduction is fixed to 2021-05-05, Ethereum deployment to 2021-05-25, LP reward activation to 2021-06-05, and live protocol operation to no later than 2021-06-11. The exact first public Cauldron, first MIM issuance, and public UI-availability day remain unresolved.', severity: 'low', last_checked_at: '2026-06-25', notes: 'Keep launch_date null. Do not substitute introduction, contract deployment, factory-pool creation, or LP incentives for the first public borrowing and issuance boundary.' });
writeJson(unknownPath, unknowns);

const queuePath = 'data/quality/launch-date-unresolved.json';
const queue = readJson(queuePath);
const mimQueue = queue.records.find((row) => row.stablecoin_id === 'sog_st_mim');
if (!mimQueue) throw new Error(`${queuePath}: missing sog_st_mim`);
mimQueue.best_known_range = '2021-05 to 2021-06';
mimQueue.review_note = 'May 5 introduction, May 25 deployment, June 5 LP rewards, and live operation by June 11 are fixed; the exact first Cauldron, first issuance, and public UI day remain unresolved.';
queue.frozen_at = '2026-06-25';
writeJson(queuePath, queue);

replaceIn('README.md', '130 events\n130 Event v2 detail records\n394 evidence records\n394 evidence relation projections', '132 events\n132 Event v2 detail records\n397 evidence records\n397 evidence relation projections', 'README counts');
replaceIn('README.md', '200 known unknowns', '201 known unknowns', 'README unknowns');
replaceIn('docs/audits/mim-launch-boundary-review.md', 'Result: PUBLIC LAUNCH DATE REMAINS UNRESOLVED', 'Result: IMPLEMENTED — PUBLIC LAUNCH DATE REMAINS UNRESOLVED', 'audit result');
replaceIn('docs/audits/mim-launch-boundary-review.md', '## Resolved quality improvements\n\nAlthough the public launch date remains unresolved, the follow-up canonical implementation should:', '## Implementation result\n\nThe public launch date remains unresolved, and the canonical quality implementation:', 'audit heading');

const remainingPath = 'docs/audits/remaining-launch-date-review.md';
let remaining = fs.readFileSync(remainingPath, 'utf8');
remaining = remaining.replace('- USD1 — Ethereum and BNB Smart Chain deployments on 2025-01-28, the 2025-03-25 introduction, and the 2025-04-07 airdrop test were separated; public launch remains unresolved at April 2025 month level.', '- USD1 — Ethereum and BNB Smart Chain deployments on 2025-01-28, the 2025-03-25 introduction, and the 2025-04-07 airdrop test were separated; public launch remains unresolved at April 2025 month level.\n- MIM — 2021-05-05 introduction, 2021-05-25 deployment, 2021-06-05 LP incentives, and live operation by 2021-06-11 were separated; the exact first Cauldron remains unresolved.');
remaining = remaining.replace('| Magic Internet Money | `sog_st_mim` | — | Cauldron, first issuance, announcement, and UI differ. |', '| Magic Internet Money | `sog_st_mim` | 2021-05 to 2021-06 | Introduction, deployment, first Cauldron, first issuance, liquidity, incentives, and UI differ. |');
remaining = remaining.replace('Next bounded review: MIM', 'Next bounded review: mUSD');
fs.writeFileSync(remainingPath, remaining);

const roadmapPath = 'docs/roadmap.md';
let roadmap = fs.readFileSync(roadmapPath, 'utf8');
roadmap = roadmap.replace('Latest merged PR: #142 — Implement USD1 deployment and testing boundaries\nLatest merged commit: 39304080bd5bb7019949f4b4ea24c99fe2b50058\nCurrent work: MIM bounded launch-boundary audit\nCanonical launch conclusion: keep launch_date null\nResolved implementation target: introduction, deployment, liquidity incentive, and live-protocol chronology\nNext bounded review after MIM implementation: mUSD', 'Latest merged PR: #143 — Audit MIM launch boundaries\nLatest merged commit: 56309708750cb4f90815fa61e32f5c4c82106559\nCurrent work: MIM canonical quality implementation\nCanonical launch conclusion: launch_date remains null\nImplementation result: introduction, deployment, liquidity incentive, and live-protocol chronology normalized\nNext bounded review after merge: mUSD');
roadmap = roadmap.replace('Follow-up implementation:', 'Canonical implementation result:');
roadmap = roadmap.replace('130 events\n130 Event v2 detail records\n394 evidence records\n394 evidence relation projections', '132 events\n132 Event v2 detail records\n397 evidence records\n397 evidence relation projections');
roadmap = roadmap.replace('200 known unknowns', '201 known unknowns');
roadmap = roadmap.replace('Next bounded review after MIM implementation:', 'Next bounded review:');
roadmap = roadmap.replace('1. Complete CI and merge the MIM audit PR.\n2. Report that launch_date remains null and queue counts remain 22 / C16.\n3. Open the MIM canonical quality implementation PR.\n4. Record introduction, deployment, and liquidity-incentive boundaries without labeling them as public launch.\n5. Start mUSD only after the MIM implementation passes all six workflows.', '1. Complete final CI and merge the MIM implementation PR.\n2. Report that launch_date remains null and queue counts remain 22 / C16.\n3. Start the bounded mUSD launch-boundary audit.\n4. Separate deployment, public launch, basket activation, and Save-product boundaries.\n5. Do not force a date without day-level primary or on-chain public evidence.');
fs.writeFileSync(roadmapPath, roadmap);

const v2Path = 'docs/migration/registry-v2-baseline.json';
const v2 = readJson(v2Path);
v2.baseline_id = 'sog_registry_v2_mim_boundaries_2026_06_25';
v2.captured_at = '2026-06-25';
v2.source_commit = 'mim-boundaries';
v2.minimum_counts.events = 132;
v2.minimum_counts.event_details = 132;
v2.minimum_counts.evidence = 397;
v2.minimum_counts.evidence_relations = 397;
v2.minimum_counts.known_unknowns = 201;
writeJson(v2Path, v2);

const v3Path = 'docs/migration/registry-v3-baseline.json';
const v3 = readJson(v3Path);
v3.baseline_id = 'sog_registry_v3_mim_boundaries_2026_06_25';
v3.recorded_at = '2026-06-25';
v3.data_checkpoint_commit = 'mim-boundaries';
v3.expected_counts.events = 132;
v3.expected_counts.event_details = 132;
v3.expected_counts.evidence = 397;
v3.expected_counts.known_unknowns = 201;
v3.quality.launch_date_unresolved = 22;
writeJson(v3Path, v3);

execFileSync('node', ['scripts/generate-registry-stats.mjs'], { stdio: 'inherit' });
execFileSync('node', ['scripts/audit-registry-integrity.mjs'], { stdio: 'inherit' });
execFileSync('node', ['scripts/validate-registry-stats.mjs'], { stdio: 'inherit' });

fs.writeFileSync('.github/workflows/registry-stats.yml', `name: Registry stats\n\non:\n  pull_request:\n  push:\n    branches: [main]\n\npermissions:\n  contents: read\n\njobs:\n  validate:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with:\n          node-version: 22\n      - name: Validate current output\n        run: node scripts/validate-registry-stats.mjs\n      - name: Rebuild output\n        run: node scripts/generate-registry-stats.mjs\n      - name: Validate rebuilt output\n        run: node scripts/validate-registry-stats.mjs\n      - uses: actions/upload-artifact@v4\n        with:\n          name: registry-stats\n          path: data/generated/registry-stats.json\n`);
fs.unlinkSync('scripts/finalize-mim-boundaries.mjs');

if (process.env.GITHUB_ACTIONS === 'true') {
  const headRef = process.env.GITHUB_HEAD_REF;
  if (!headRef) throw new Error('GITHUB_HEAD_REF is required');
  execFileSync('git', ['config', 'user.name', 'github-actions[bot]']);
  execFileSync('git', ['config', 'user.email', '41898282+github-actions[bot]@users.noreply.github.com']);
  execFileSync('git', ['add', '-A']);
  execFileSync('git', ['commit', '-m', 'Implement MIM boundary chronology'], { stdio: 'inherit' });
  execFileSync('git', ['push', 'origin', `HEAD:${headRef}`], { stdio: 'inherit' });
}
