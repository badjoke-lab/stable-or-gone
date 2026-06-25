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

replaceRequired('README.md', '137 events\n137 Event v2 detail records\n407 evidence records\n407 evidence relation projections', '138 events\n138 Event v2 detail records\n409 evidence records\n409 evidence relation projections', 'event and evidence counts');
replaceRequired('README.md', '20 unresolved launch dates', '19 unresolved launch dates', 'launch queue count');
replaceRequired('docs/audits/vchf-launch-boundary-review.md', 'Result: LAUNCH RESOLVED', 'Result: IMPLEMENTED — LAUNCH RESOLVED', 'audit result');
replaceRequired('docs/audits/vchf-launch-boundary-review.md', 'Recommended canonical launch date: `2022-12-15`', 'Current canonical launch date: `2022-12-15`', 'canonical launch field');
replaceRequired('docs/audits/vchf-launch-boundary-review.md', '## Implementation requirements', '## Implementation result', 'implementation heading');

const remainingPath = 'docs/audits/remaining-launch-date-review.md';
let remaining = fs.readFileSync(remainingPath, 'utf8');
const vaiAnchor = '- VAI — canonical public launch fixed to 2020-11-24, when Venus mainnet opened and public VAI minting became available; exact deployment and first mint remain unresolved.';
if (remaining.includes(vaiAnchor) && !remaining.includes('- VCHF — canonical public launch fixed to 2022-12-15')) {
  remaining = remaining.replace(vaiAnchor, `${vaiAnchor}\n- VCHF — canonical public launch fixed to 2022-12-15; original Ethereum issuance is separated from later multichain deployments and listings.`);
}
remaining = remaining.replaceAll('Total unresolved: 20', 'Total unresolved: 19');
remaining = remaining.replaceAll('Category C: 14', 'Category C: 13');
remaining = remaining.replace('| VNX Swiss Franc | `sog_st_vchf` | — | Announcement, issuance, and availability remain unresolved. |\n', '');
remaining = remaining.replace('Current unresolved queue: 20', 'Current unresolved queue: 19');
remaining = remaining.replace('Next bounded review: VCHF', 'Next bounded review: IRON');
fs.writeFileSync(remainingPath, remaining);

const roadmapPath = 'docs/roadmap.md';
let roadmap = fs.readFileSync(roadmapPath, 'utf8');
roadmap = roadmap.replace(
`Latest merged PR: #150 — Implement VAI launch boundary
Latest merged commit: 83a52866378bbba6e219893b3e038b2b6b734ca7
Current work: VCHF bounded launch-boundary audit
Launch conclusion: set launch_date to 2022-12-15
Current-state conclusion: retain status active and discontinued_date null
Next operation after audit: VCHF canonical implementation
Next bounded review after VCHF: IRON`,
`Latest merged PR: #151 — Audit VCHF launch date
Latest merged commit: 4cfbf3ced51c82b96c66adcedce0ae06e1ecbde0
Current work: VCHF canonical implementation
Launch result: launch_date set to 2022-12-15
Current-state result: status active; discontinued_date null
Next bounded review after merge: IRON`
);
roadmap = roadmap.replace('Follow-up implementation:', 'Canonical implementation result:');
roadmap = roadmap.replace(
'- add the 2022-12-15 launch event and Event v2 launch detail\n- add first-party launch and year-end review evidence\n- update the Ethereum deployment note and evidence\n- preserve later chain launches as deployment boundaries\n- replace the launch unknown with exact first issuance and distribution unknowns\n- remove VCHF from the unresolved launch queue\n- reduce the queue from 20 to 19 and Category C from 14 to 13',
'- 2022-12-15 launch event and Event v2 launch detail added\n- first-party launch and year-end review evidence added\n- Ethereum deployment note and evidence updated\n- later chain launches preserved as deployment boundaries\n- exact first issuance and distribution retained as known unknowns\n- VCHF removed from the unresolved launch queue\n- queue reduced from 20 to 19 and Category C from 14 to 13'
);
roadmap = roadmap.replace('137 events\n137 Event v2 detail records\n407 evidence records\n407 evidence relation projections', '138 events\n138 Event v2 detail records\n409 evidence records\n409 evidence relation projections');
roadmap = roadmap.replace('Missing canonical launch dates:            20', 'Missing canonical launch dates:            19');
roadmap = roadmap.replace(
`Total unresolved before VCHF implementation: 20
Category B:                                   3
Category C:                                  14
Category D:                                   3`,
`Total unresolved: 19
Category B:         3
Category C:        13
Category D:         3`
);
roadmap = roadmap.replace(
`Expected after VCHF implementation:

\`\`\`text
Total unresolved: 19
Category B:         3
Category C:        13
Category D:         3
\`\`\`

`,
''
);
roadmap = roadmap.replace('Next bounded review after VCHF implementation:', 'Next bounded review:');
roadmap = roadmap.replace(
`1. Complete CI and merge the VCHF audit PR.
2. Preserve original launch and later chain-expansion boundaries separately.

Phase 2 — VCHF canonical implementation
3. Set launch_date to 2022-12-15.
4. Retain status active and discontinued_date null.
5. Add the launch event and Event v2 launch detail.
6. Add first-party launch and retrospective evidence.
7. Update the launch unknown and Ethereum deployment note.
8. Remove VCHF from the unresolved launch queue.
9. Synchronize baselines, generated outputs, README, audits, and roadmap.
10. Run all six workflows and merge only after every check passes.`,
`1. Complete final CI and merge the VCHF implementation PR.
2. Preserve original launch and later chain-expansion boundaries separately.
3. Confirm temporary synchronization code is removed.`
);
roadmap = roadmap.replace(
`1. Complete CI and merge the VCHF audit PR.
2. Open the VCHF canonical implementation PR.
3. Set launch_date only to the audited 2022-12-15 boundary.
4. Preserve later chain launches and exact first issuance as separate boundaries.
5. Start IRON after the VCHF implementation passes all six workflows.`,
`1. Complete final CI and merge the VCHF implementation PR.
2. Report the queue reduction to 19 total and Category C 13.
3. Start the bounded IRON launch-boundary audit.
4. Separate BSC launch, Polygon deployment, staged minting, and public availability.
5. Complete the first launch-date quality wave before controlled growth resumes.`
);
fs.writeFileSync(roadmapPath, roadmap);

const v2Path = 'docs/migration/registry-v2-baseline.json';
const v2 = readJson(v2Path);
v2.baseline_id = 'sog_registry_v2_vchf_launch_2026_06_25';
v2.captured_at = '2026-06-25';
v2.source_commit = 'vchf-launch';
v2.minimum_counts.events = 138;
v2.minimum_counts.event_details = 138;
v2.minimum_counts.evidence = 409;
v2.minimum_counts.evidence_relations = 409;
writeJson(v2Path, v2);

const v3Path = 'docs/migration/registry-v3-baseline.json';
const v3 = readJson(v3Path);
v3.baseline_id = 'sog_registry_v3_vchf_launch_2026_06_25';
v3.recorded_at = '2026-06-25';
v3.data_checkpoint_commit = 'vchf-launch';
v3.expected_counts.events = 138;
v3.expected_counts.event_details = 138;
v3.expected_counts.evidence = 409;
v3.quality.launch_date_unresolved = 19;
writeJson(v3Path, v3);

execFileSync('node', ['scripts/generate-registry-stats.mjs'], { stdio: 'inherit' });
execFileSync('node', ['scripts/audit-registry-integrity.mjs'], { stdio: 'inherit' });
execFileSync('node', ['scripts/validate-registry-stats.mjs'], { stdio: 'inherit' });
