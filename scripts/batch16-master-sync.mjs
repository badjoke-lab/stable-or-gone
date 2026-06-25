import fs from 'node:fs';

const readJson = (path) => JSON.parse(fs.readFileSync(path, 'utf8'));
const writeJson = (path, value) => fs.writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);

const growthPath = 'docs/growth/candidate-master-70.json';
const growth = readJson(growthPath);
growth.schema_version = '1.2';
growth.status = 'batch_016_research_complete';
if (!growth.candidate_files.includes('data/candidate-stable-assets-growth-85.json')) growth.candidate_files.push('data/candidate-stable-assets-growth-85.json');
growth.protected_minimums = { total_candidates: 87, promoted_candidates: 82, pending_candidates: 5 };
growth.planned_batches.batch_016 = { minimum_candidates: 5, theme: 'current bank, enterprise, ecosystem-native, and yield-bearing USD assets' };
growth.promotion_policy.production_record_parity_at_82_passed = true;
growth.promotion_policy.batch_016_research_complete = true;
growth.promotion_policy.batch_016_promotion_complete = false;
growth.promotion_policy.ordinary_growth_remains_blocked = false;
writeJson(growthPath, growth);

const roadmapPath = 'docs/roadmap.md';
let roadmap = fs.readFileSync(roadmapPath, 'utf8');
const oldPosition = `Latest merged PR: #156 — Add reserve source context
Latest merged commit: 02b1b9baf9b8c1a37d0787506ffa4e135a91f8a6
Completed phases: first launch-date quality wave and reserve-source cross-queue maintenance
Current work: terminal-date checkpoint
Terminal result: BAC, DSD, ESD, and GYEN remain unresolved
Next phase after merge: controlled growth in batches of no more than five records
Publication requirement: manual publish and parity verification after each growth batch`;
const newPosition = `Latest merged PR: #157 — Record terminal-date checkpoint
Latest merged commit: 59d6abc1960578f9f281522e23b7d85a0bfe7c29
Completed phases: launch-date wave, reserve-source checkpoint, and terminal-date checkpoint
Current work: Batch 16 candidate research
Candidate result: 5 accepted candidates; 82 canonical assets remain unchanged
Next operation after merge: full-layer Batch 16 promotion draft
Publication requirement: manual publish and parity verification after canonical promotion`;
if (!roadmap.includes(oldPosition)) throw new Error('roadmap current position anchor missing');
roadmap = roadmap.replace(oldPosition, newPosition);

const productionAnchor = '## Production checkpoint';
if (!roadmap.includes('## Batch 16 candidate checkpoint')) {
  const section = `## Batch 16 candidate checkpoint

\`\`\`text
Accepted candidates: 5
Canonical promotions: 0
Canonical stable assets: 82
Target batch: batch_016
\`\`\`

Selected candidates:

\`\`\`text
United Stables U — reserve-backed issuer token with restricted direct redemption
USDGO — Anchorage-issued enterprise stablecoin distributed by OSL
SoFiUSD / SOFID — national-bank-issued payment stablecoin
Solstice USX — Solana-native stablecoin, disambiguated from dForce USX
Origin Dollar / OUSD — rebasing yield-bearing stablecoin with 2020 exploit history
\`\`\`

Deferred from this batch:

- YLDS — official material defines it as a registered fixed-income security rather than a stablecoin; retain for a separate stablecoin-adjacent scope decision
- Blast USDB — bridged and rebasing representation requires a dedicated DAI/USDC/USDT identity and bridge-liability review
- UXD — current backing model and lifecycle require a deeper protocol-state review before promotion

Research files:

\`\`\`text
data/candidate-stable-assets-growth-85.json
data/candidate-research-batch-16.json
\`\`\`

`;
  roadmap = roadmap.replace(productionAnchor, `${section}${productionAnchor}`);
}

roadmap = roadmap.replace(
`Phase 1 — Candidate master
1. Read the existing reviewed candidate and pending-candidate files.
2. Exclude duplicates, out-of-scope projects, and thin records.
3. Select no more than five candidates that can support complete canonical layers.
4. Record why every scanned candidate was selected, deferred, or rejected.

Phase 2 — Growth batch
5. Add complete stable-asset, organization, relationship, classification, reserve/redemption, event, evidence, deployment, legal, reserve-component, and income-profile layers as applicable.`,
`Phase 1 — Candidate master complete
1. Five accepted candidates are fixed in Batch 16 research.
2. Symbol and identity collisions are explicitly disambiguated.
3. Deferred records retain separate scope decisions.

Phase 2 — Growth batch
4. Draft complete stable-asset, organization, relationship, classification, reserve/redemption, event, evidence, deployment, legal, reserve-component, and income-profile layers for the five accepted candidates.`
);
roadmap = roadmap.replace('6. Add no placeholder reserve-report rows.\n7. Keep unreviewed candidates and private monitoring out of public files.\n8. Run all six workflows and merge only after every check passes.', '5. Add no placeholder reserve-report rows.\n6. Keep unreviewed candidates and private monitoring out of public files.\n7. Run all six workflows and merge only after every check passes.');
roadmap = roadmap.replace('9. Manually publish latest main through the approved GitHub Actions workflow.\n10. Verify deployed commit, public counts, canonical routes, machine-readable files, sitemap, and consistency.\n11. Record production parity before starting the next growth batch.', '8. Manually publish latest main through the approved GitHub Actions workflow.\n9. Verify deployed commit, public counts, canonical routes, machine-readable files, sitemap, and consistency.\n10. Record production parity before starting the next growth batch.');
roadmap = roadmap.replace('12. Alternate one growth batch with two or three existing-record quality audits.\n13. Insert urgent incident, depeg, regulatory, wind-down, or redemption changes ahead of the routine queue.\n14. Never allow production to trail main by more than one growth batch.', '11. Alternate one growth batch with two or three existing-record quality audits.\n12. Insert urgent incident, depeg, regulatory, wind-down, or redemption changes ahead of the routine queue.\n13. Never allow production to trail main by more than one growth batch.');
roadmap = roadmap.replace(
`1. Complete CI and merge the terminal-date checkpoint PR.
2. Build the first reviewed candidate master after the quality pause.
3. Select no more than five complete candidates.
4. Implement the first controlled growth batch.
5. Manually publish and verify production parity after merge.`,
`1. Complete CI and merge the Batch 16 candidate-research PR.
2. Build complete canonical drafts for the five accepted candidates.
3. Resolve contract, issuer, reserve, redemption, and income boundaries before promotion.
4. Implement Batch 16 in one bounded five-record PR.
5. Manually publish and verify production parity after canonical merge.`
);
fs.writeFileSync(roadmapPath, roadmap);
