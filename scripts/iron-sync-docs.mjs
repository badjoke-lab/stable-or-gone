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

replaceRequired('README.md', '138 events\n138 Event v2 detail records\n409 evidence records\n409 evidence relation projections', '140 events\n140 Event v2 detail records\n412 evidence records\n412 evidence relation projections', 'event and evidence counts');
replaceRequired('README.md', '202 known unknowns', '203 known unknowns', 'known unknown count');
replaceRequired('README.md', '116 deployments', '117 deployments', 'deployment count');
replaceRequired('README.md', '19 unresolved launch dates', '18 unresolved launch dates', 'launch queue count');
replaceRequired('docs/audits/iron-launch-boundary-review.md', 'Result: LAUNCH RESOLVED; DEPLOYMENT AND V2 BOUNDARIES REMAIN SEPARATE', 'Result: IMPLEMENTED — LAUNCH RESOLVED AND LINEAGE BOUNDARIES SEPARATED', 'audit result');
replaceRequired('docs/audits/iron-launch-boundary-review.md', 'Recommended canonical state:', 'Current canonical state:', 'canonical state heading');
replaceRequired('docs/audits/iron-launch-boundary-review.md', '## Implementation requirements', '## Implementation result', 'implementation heading');

const remainingPath = 'docs/audits/remaining-launch-date-review.md';
let remaining = fs.readFileSync(remainingPath, 'utf8');
const vchfAnchor = '- VCHF — canonical public launch fixed to 2022-12-15; original Ethereum issuance is separated from later multichain deployments and listings.';
if (remaining.includes(vchfAnchor) && !remaining.includes('- IRON — canonical entity-level public launch fixed to 2021-03-06')) {
  remaining = remaining.replace(vchfAnchor, `${vchfAnchor}\n- IRON — canonical entity-level public launch fixed to the original BSC protocol launch on 2021-03-06; Polygon deployment, June collapse, and August v2 redesign remain separate.`);
}
remaining = remaining.replaceAll('Total unresolved: 19', 'Total unresolved: 18');
remaining = remaining.replaceAll('Category C: 13', 'Category C: 12');
remaining = remaining.replace('| IRON | `sog_st_iron` | — | BSC, Polygon, and staged rollout boundaries differ. |\n', '');
remaining = remaining.replace('Current unresolved queue: 19', 'Current unresolved queue: 18');
remaining = remaining.replace('Next bounded review: IRON', 'Next bounded review: none — first launch-date quality wave complete');
fs.writeFileSync(remainingPath, remaining);

const roadmapPath = 'docs/roadmap.md';
let roadmap = fs.readFileSync(roadmapPath, 'utf8');
roadmap = roadmap.replace(
`Latest merged PR: #152 — Implement VCHF launch date
Latest merged commit: 1582f2844b5390d161e6454fb00d14d540f3f37d
Current work: IRON bounded launch and lineage audit
Launch conclusion: set launch_date to 2021-03-06
Terminal state: retain failed and discontinued_date 2021-06-16
Next operation after audit: IRON canonical implementation
Next phase after IRON: cross-queue maintenance, then controlled growth`,
`Latest merged PR: #153 — Audit IRON launch boundary
Latest merged commit: 98276eef87b1b334ba3f929000d2903f7723ae79
Current work: IRON canonical implementation
Launch result: launch_date set to 2021-03-06
Terminal state: failed with discontinued_date 2021-06-16
Quality-wave result: first bounded launch-date wave complete
Next phase after merge: cross-queue maintenance, then controlled growth`
);
roadmap = roadmap.replace('Implementation requirements:', 'Canonical implementation result:');
roadmap = roadmap.replace(
'- add the 2021-03-06 BSC launch event\n- add the 2021-05-18 Polygon deployment event\n- preserve the June 16 collapse event\n- add first-party BSC launch and Polygon expansion evidence\n- preserve IRON v2 as a later redesigned-product boundary\n- update known unknowns for BSC identity, first mint, Polygon deployment, and v1/v2 continuity\n- remove IRON from the unresolved launch queue\n- reduce the queue from 19 to 18 and Category C from 13 to 12',
'- 2021-03-06 BSC launch event added\n- 2021-05-18 Polygon deployment event added\n- June 16 collapse event preserved\n- first-party BSC launch, Polygon expansion, and v2 evidence added\n- IRON v2 preserved as a later redesigned-product boundary\n- BSC deployment and v1/v2 lineage unknowns updated\n- IRON removed from the unresolved launch queue\n- queue reduced from 19 to 18 and Category C from 13 to 12'
);
roadmap = roadmap.replace('138 events\n138 Event v2 detail records\n409 evidence records\n409 evidence relation projections', '140 events\n140 Event v2 detail records\n412 evidence records\n412 evidence relation projections');
roadmap = roadmap.replace('202 known unknowns', '203 known unknowns');
roadmap = roadmap.replace('116 deployments', '117 deployments');
roadmap = roadmap.replace('Missing canonical launch dates:            19', 'Missing canonical launch dates:            18');
roadmap = roadmap.replace(
`Total unresolved before IRON implementation: 19
Category B:                                  3
Category C:                                 13
Category D:                                  3`,
`Total unresolved: 18
Category B:         3
Category C:        12
Category D:         3`
);
roadmap = roadmap.replace(
`Expected after IRON implementation:

\`\`\`text
Total unresolved: 18
Category B:         3
Category C:        12
Category D:         3
\`\`\`

`,
''
);
roadmap = roadmap.replace(
`Phase 1 — IRON audit
1. Complete CI and merge the IRON audit PR.
2. Preserve BSC launch, Polygon deployment, collapse, and v2 redesign as separate boundaries.

Phase 2 — IRON canonical implementation
3. Set launch_date to 2021-03-06.
4. Retain failed status and discontinued_date 2021-06-16.
5. Add BSC launch and Polygon deployment events plus Event v2 details.
6. Add first-party launch and expansion evidence.
7. Update deployments and known unknowns.
8. Remove IRON from the unresolved launch queue.
9. Synchronize baselines, generated outputs, README, audits, and roadmap.
10. Run all six workflows and merge only after every check passes.`,
`Phase 1 — Complete the first launch-date quality wave
1. Complete final CI and merge the IRON implementation PR.
2. Preserve BSC launch, Polygon deployment, collapse, and v2 redesign as separate boundaries.
3. Confirm temporary synchronization code is removed.`
);
roadmap = roadmap.replace(
`1. Complete CI and merge the IRON audit PR.
2. Open the IRON canonical implementation PR.
3. Set launch_date only to the original 2021-03-06 BSC boundary.
4. Keep Polygon deployment, June collapse, and August v2 redesign separate.
5. Complete the first launch-date quality wave, then move to cross-queue maintenance.`,
`1. Complete final CI and merge the IRON implementation PR.
2. Report the queue reduction to 18 total and Category C 12.
3. Audit HUSD and EURT reserve-source recovery status as the first cross-queue maintenance batch.
4. Recheck BAC, DSD, and ESD terminal dates only if new primary evidence exists.
5. Resume controlled growth after the cross-queue checkpoint.`
);
fs.writeFileSync(roadmapPath, roadmap);

const v2Path = 'docs/migration/registry-v2-baseline.json';
const v2 = readJson(v2Path);
v2.baseline_id = 'sog_registry_v2_iron_launch_2026_06_25';
v2.captured_at = '2026-06-25';
v2.source_commit = 'iron-launch';
v2.minimum_counts.events = 140;
v2.minimum_counts.event_details = 140;
v2.minimum_counts.evidence = 412;
v2.minimum_counts.evidence_relations = 412;
v2.minimum_counts.known_unknowns = 203;
v2.minimum_counts.deployments = 117;
writeJson(v2Path, v2);

const v3Path = 'docs/migration/registry-v3-baseline.json';
const v3 = readJson(v3Path);
v3.baseline_id = 'sog_registry_v3_iron_launch_2026_06_25';
v3.recorded_at = '2026-06-25';
v3.data_checkpoint_commit = 'iron-launch';
v3.expected_counts.events = 140;
v3.expected_counts.event_details = 140;
v3.expected_counts.evidence = 412;
v3.expected_counts.known_unknowns = 203;
v3.expected_counts.deployments = 117;
v3.quality.launch_date_unresolved = 18;
writeJson(v3Path, v3);

execFileSync('node', ['scripts/generate-registry-stats.mjs'], { stdio: 'inherit' });
execFileSync('node', ['scripts/audit-registry-integrity.mjs'], { stdio: 'inherit' });
execFileSync('node', ['scripts/validate-registry-stats.mjs'], { stdio: 'inherit' });
