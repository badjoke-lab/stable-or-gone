import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const readJson = (path) => JSON.parse(fs.readFileSync(path, 'utf8'));
const writeJson = (path, value) => fs.writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
const replaceRequired = (path, search, replacement, label) => {
  let text = fs.readFileSync(path, 'utf8');
  if (!text.includes(search)) throw new Error(`${path}: missing ${label}`);
  text = text.replace(search, replacement);
  fs.writeFileSync(path, text);
};

replaceRequired(
  'README.md',
  '132 events\n132 Event v2 detail records\n397 evidence records\n397 evidence relation projections',
  '134 events\n134 Event v2 detail records\n401 evidence records\n401 evidence relation projections',
  'event and evidence counts'
);
replaceRequired('README.md', '201 known unknowns', '202 known unknowns', 'known unknown count');

replaceRequired(
  'docs/audits/musd-launch-boundary-review.md',
  'Result: PUBLIC LAUNCH DATE REMAINS UNRESOLVED',
  'Result: IMPLEMENTED — PUBLIC LAUNCH DATE REMAINS UNRESOLVED',
  'audit result'
);
replaceRequired(
  'docs/audits/musd-launch-boundary-review.md',
  '## Follow-up implementation',
  '## Implementation result',
  'implementation heading'
);

const remainingPath = 'docs/audits/remaining-launch-date-review.md';
let remaining = fs.readFileSync(remainingPath, 'utf8');
const completedAnchor = '- MIM — 2021-05-05 introduction, 2021-05-25 deployment, 2021-06-05 LP incentives, and live operation by 2021-06-11 were separated; the exact first Cauldron remains unresolved.';
if (remaining.includes(completedAnchor) && !remaining.includes('- mUSD — 2020-05-28 contract verification')) {
  remaining = remaining.replace(
    completedAnchor,
    `${completedAnchor}\n- mUSD — 2020-05-28 contract verification, the 2020-05-29 mainnet-live candidate, and 2020-06-05 production-security coverage were separated; the original first-party launch statement remains unresolved.`
  );
}
remaining = remaining.replace(
  '| mStable USD | `sog_st_musd` | — | Deployment, public launch, basket, and Save differ. |',
  '| mStable USD | `sog_st_musd` | 2020-05-29 | Contract verification, candidate mainnet availability, first mint, and Save activation differ; the original first-party launch source is not recovered. |'
);
remaining = remaining.replace('Next bounded review: mUSD', 'Next bounded review: USK');
fs.writeFileSync(remainingPath, remaining);

const roadmapPath = 'docs/roadmap.md';
let roadmap = fs.readFileSync(roadmapPath, 'utf8');
roadmap = roadmap.replace(
`Latest merged PR: #144 — Implement MIM boundary chronology
Latest merged commit: 1e7347c7acb1b55cb8e76774e7e8a9bc2b54c83a
Current work: mUSD bounded launch-boundary audit
Canonical conclusion: keep launch_date null
Best-known public-launch candidate: 2020-05-29
Next operation after audit: mUSD canonical quality implementation
Next bounded review: USK`,
`Latest merged PR: #145 — Audit mStable USD launch history
Latest merged commit: e750081fc183aa2c44932f5e077c36f52d9257bd
Current work: mUSD canonical quality implementation
Canonical conclusion: launch_date remains null
Implementation result: deployment-readiness, candidate mainnet availability, and production-security boundaries normalized
Next bounded review after merge: USK`
);
roadmap = roadmap.replace(
'Follow-up implementation:',
'Canonical implementation result:'
);
roadmap = roadmap.replace(
'- preserve the official Ethereum mUSD address\n- record 2020-05-28 as a verified deployment-readiness boundary\n- preserve 2020-05-29 as the best-known candidate without coercion\n- add a medium-confidence mainnet-availability event\n- add the official 2020-06-05 production-security boundary\n- keep Save and imUSD separate from the base mUSD launch\n- add a launch-specific known unknown\n- keep mUSD in the unresolved queue',
'- official Ethereum mUSD address preserved\n- 2020-05-28 deployment-readiness boundary recorded\n- 2020-05-29 candidate mainnet-availability event added at medium confidence\n- 2020-06-05 production-security boundary added\n- Save and imUSD remain separate from the base mUSD launch\n- launch-specific known unknown added\n- mUSD remains in the unresolved queue'
);
roadmap = roadmap.replace(
'DOLA, USD1, and MIM quality work does not increase the stable-asset count or trigger automatic production publication.',
'DOLA, USD1, MIM, and mUSD quality work does not increase the stable-asset count or trigger automatic production publication.'
);
roadmap = roadmap.replace(
'132 events\n132 Event v2 detail records\n397 evidence records\n397 evidence relation projections',
'134 events\n134 Event v2 detail records\n401 evidence records\n401 evidence relation projections'
);
roadmap = roadmap.replace('201 known unknowns', '202 known unknowns');
roadmap = roadmap.replace(
'Next bounded review after mUSD implementation:',
'Next bounded review:'
);
roadmap = roadmap.replace(
`1. Complete CI and merge the mUSD audit PR.
2. Preserve launch_date as null.

Phase 2 — mUSD canonical quality implementation
3. Record the 2020-05-28 deployment-readiness boundary.
4. Add the 2020-05-29 candidate mainnet-availability event at medium confidence.
5. Add the official 2020-06-05 production-security boundary.
6. Add a launch-specific known unknown and update the queue note without reducing counts.
7. Synchronize baselines, generated outputs, README, audits, and roadmap.
8. Run all six CI workflows and merge only after every check passes.`,
`1. Complete final CI and merge the mUSD implementation PR.
2. Preserve launch_date as null and retain the 2020-05-29 candidate as non-canonical.
3. Confirm that all temporary synchronization code is removed.`
);
roadmap = roadmap.replace(
`1. Complete CI and merge the mUSD audit PR.
2. Report that launch_date remains null and queue counts remain 22 / C16.
3. Open the mUSD canonical quality implementation PR.
4. Add boundary records without representing 2020-05-29 as confirmed canonical launch.
5. Start USK after the mUSD implementation passes all six workflows.`,
`1. Complete final CI and merge the mUSD implementation PR.
2. Report that launch_date remains null and queue counts remain 22 / C16.
3. Start the bounded USK launch-boundary audit.
4. Separate deployment, first issuance, interface availability, chain state, and successor-network boundaries.
5. Do not mark USK migrated or terminated without authoritative evidence.`
);
fs.writeFileSync(roadmapPath, roadmap);

const v2Path = 'docs/migration/registry-v2-baseline.json';
const v2 = readJson(v2Path);
v2.baseline_id = 'sog_registry_v2_musd_boundaries_2026_06_25';
v2.captured_at = '2026-06-25';
v2.source_commit = 'musd-boundaries';
v2.minimum_counts.events = 134;
v2.minimum_counts.event_details = 134;
v2.minimum_counts.evidence = 401;
v2.minimum_counts.evidence_relations = 401;
v2.minimum_counts.known_unknowns = 202;
writeJson(v2Path, v2);

const v3Path = 'docs/migration/registry-v3-baseline.json';
const v3 = readJson(v3Path);
v3.baseline_id = 'sog_registry_v3_musd_boundaries_2026_06_25';
v3.recorded_at = '2026-06-25';
v3.data_checkpoint_commit = 'musd-boundaries';
v3.expected_counts.events = 134;
v3.expected_counts.event_details = 134;
v3.expected_counts.evidence = 401;
v3.expected_counts.known_unknowns = 202;
v3.quality.launch_date_unresolved = 22;
writeJson(v3Path, v3);

execFileSync('node', ['scripts/generate-registry-stats.mjs'], { stdio: 'inherit' });
execFileSync('node', ['scripts/audit-registry-integrity.mjs'], { stdio: 'inherit' });
execFileSync('node', ['scripts/validate-registry-stats.mjs'], { stdio: 'inherit' });
