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

replaceRequired('README.md', '134 events\n134 Event v2 detail records\n401 evidence records\n401 evidence relation projections', '136 events\n136 Event v2 detail records\n405 evidence records\n405 evidence relation projections', 'event and evidence counts');
replaceRequired('README.md', '22 unresolved launch dates', '21 unresolved launch dates', 'launch queue count');
replaceRequired('docs/audits/usk-launch-and-winddown-review.md', 'Result: LAUNCH RESOLVED; CURRENT WIND-DOWN UPDATE REQUIRED', 'Result: IMPLEMENTED — LAUNCH RESOLVED AND WIND-DOWN RECORDED', 'audit result');
replaceRequired('docs/audits/usk-launch-and-winddown-review.md', '## Implementation requirements', '## Implementation result', 'implementation heading');

const remainingPath = 'docs/audits/remaining-launch-date-review.md';
let remaining = fs.readFileSync(remainingPath, 'utf8');
const musdAnchor = '- mUSD — 2020-05-28 contract verification, the 2020-05-29 mainnet-live candidate, and 2020-06-05 production-security coverage were separated; the original first-party launch statement remains unresolved.';
if (remaining.includes(musdAnchor) && !remaining.includes('- USK — canonical public launch fixed to 2022-09-12')) {
  remaining = remaining.replace(musdAnchor, `${musdAnchor}\n- USK — canonical public launch fixed to 2022-09-12; the 2025-06-30 wind-down and repayment-only state are recorded separately while the final terminal date remains unresolved.`);
}
remaining = remaining.replaceAll('Total unresolved: 22', 'Total unresolved: 21');
remaining = remaining.replaceAll('Category C: 16', 'Category C: 15');
remaining = remaining.replace('| Kujira USK | `sog_st_usk` | — | Deployment, first issuance, and app availability differ. |\n', '');
remaining = remaining.replace('Current unresolved queue: 22', 'Current unresolved queue: 21');
remaining = remaining.replace('Next bounded review: USK', 'Next bounded review: VAI');
fs.writeFileSync(remainingPath, remaining);

const roadmapPath = 'docs/roadmap.md';
let roadmap = fs.readFileSync(roadmapPath, 'utf8');
roadmap = roadmap.replace(
`Latest merged PR: #146 — Implement mStable USD boundary chronology
Latest merged commit: f56d7a2e1e86391ee75f2d01f0d406c693e31641
Current work: USK launch and wind-down audit
Launch conclusion: set launch_date to 2022-09-12
Current-state conclusion: retain status limited and discontinued_date null
Next operation after audit: USK canonical implementation
Next bounded review after USK: VAI`,
`Latest merged PR: #147 — Audit USK launch and wind-down boundaries
Latest merged commit: 2ce73c1233b459a2c32762d4b5eaff320b5ffcbf
Current work: USK canonical implementation
Launch result: launch_date set to 2022-09-12
Current-state result: status limited; discontinued_date null; repayment-only wind-down recorded
Next bounded review after merge: VAI`
);
roadmap = roadmap.replace('Follow-up implementation:', 'Canonical implementation result:');
roadmap = roadmap.replace(
'- add the 2022-09-12 launch event\n- add the 2025-06-30 wind-down and repayment-only event\n- add first-party pre-launch, launch, and wind-down evidence\n- update the existing limited-status event and record notes\n- preserve final terminal date and successor-liability boundaries as known unknowns\n- remove USK from the unresolved launch queue\n- reduce the queue from 22 to 21 and Category C from 16 to 15',
'- 2022-09-12 launch event added\n- 2025-06-30 wind-down and repayment-only event added\n- first-party pre-launch, launch, and wind-down evidence added\n- existing limited-status event and record notes updated\n- final terminal date and successor-liability boundaries preserved as known unknowns\n- USK removed from the unresolved launch queue\n- queue reduced from 22 to 21 and Category C from 16 to 15'
);
roadmap = roadmap.replace('134 events\n134 Event v2 detail records\n401 evidence records\n401 evidence relation projections', '136 events\n136 Event v2 detail records\n405 evidence records\n405 evidence relation projections');
roadmap = roadmap.replace('Missing canonical launch dates:            22', 'Missing canonical launch dates:            21');
roadmap = roadmap.replace(
`Total unresolved before USK implementation: 22
Category B:                                 3
Category C:                                16
Category D:                                 3`,
`Total unresolved: 21
Category B:         3
Category C:        15
Category D:         3`
);
roadmap = roadmap.replace(
`Expected after USK implementation:

\`\`\`text
Total unresolved: 21
Category B:         3
Category C:        15
Category D:         3
\`\`\`

`,
''
);
roadmap = roadmap.replace('Next bounded review after USK implementation:', 'Next bounded review:');
roadmap = roadmap.replace(
`1. Complete CI and merge the USK audit PR.
2. Open the USK canonical implementation PR.
3. Set launch_date only to the audited 2022-09-12 boundary.
4. Record the 2025-06-30 wind-down without assigning a terminal date.
5. Start VAI after the USK implementation passes all six workflows.`,
`1. Complete final CI and merge the USK implementation PR.
2. Report the queue reduction to 21 total and Category C 15.
3. Start the bounded VAI launch-boundary audit.
4. Separate Venus protocol launch, first VAI issuance, stability-fee activation, and PSM boundaries.
5. Do not substitute later feature activation for original public launch.`
);
fs.writeFileSync(roadmapPath, roadmap);

const v2Path = 'docs/migration/registry-v2-baseline.json';
const v2 = readJson(v2Path);
v2.baseline_id = 'sog_registry_v2_usk_launch_winddown_2026_06_25';
v2.captured_at = '2026-06-25';
v2.source_commit = 'usk-launch-winddown';
v2.minimum_counts.events = 136;
v2.minimum_counts.event_details = 136;
v2.minimum_counts.evidence = 405;
v2.minimum_counts.evidence_relations = 405;
writeJson(v2Path, v2);

const v3Path = 'docs/migration/registry-v3-baseline.json';
const v3 = readJson(v3Path);
v3.baseline_id = 'sog_registry_v3_usk_launch_winddown_2026_06_25';
v3.recorded_at = '2026-06-25';
v3.data_checkpoint_commit = 'usk-launch-winddown';
v3.expected_counts.events = 136;
v3.expected_counts.event_details = 136;
v3.expected_counts.evidence = 405;
v3.quality.launch_date_unresolved = 21;
writeJson(v3Path, v3);

execFileSync('node', ['scripts/generate-registry-stats.mjs'], { stdio: 'inherit' });
execFileSync('node', ['scripts/audit-registry-integrity.mjs'], { stdio: 'inherit' });
execFileSync('node', ['scripts/validate-registry-stats.mjs'], { stdio: 'inherit' });
