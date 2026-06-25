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

replaceRequired('README.md', '136 events\n136 Event v2 detail records\n405 evidence records\n405 evidence relation projections', '137 events\n137 Event v2 detail records\n407 evidence records\n407 evidence relation projections', 'event and evidence counts');
replaceRequired('README.md', '21 unresolved launch dates', '20 unresolved launch dates', 'launch queue count');
replaceRequired('docs/audits/vai-launch-boundary-review.md', 'Result: LAUNCH RESOLVED', 'Result: IMPLEMENTED — LAUNCH RESOLVED', 'audit result');
replaceRequired('docs/audits/vai-launch-boundary-review.md', 'Current canonical launch date: `null`', 'Current canonical launch date: `2020-11-24`', 'canonical launch field');
replaceRequired('docs/audits/vai-launch-boundary-review.md', '## Implementation requirements\n\nThe follow-up canonical implementation must:', '## Implementation result\n\nThe canonical implementation:', 'implementation heading');

const remainingPath = 'docs/audits/remaining-launch-date-review.md';
let remaining = fs.readFileSync(remainingPath, 'utf8');
const uskAnchor = '- USK — canonical public launch fixed to 2022-09-12; the 2025-06-30 wind-down and repayment-only state are recorded separately while the final terminal date remains unresolved.';
if (remaining.includes(uskAnchor) && !remaining.includes('- VAI — canonical public launch fixed to 2020-11-24')) {
  remaining = remaining.replace(uskAnchor, `${uskAnchor}\n- VAI — canonical public launch fixed to 2020-11-24, when Venus mainnet opened and public VAI minting became available; exact deployment and first mint remain unresolved.`);
}
remaining = remaining.replaceAll('Total unresolved: 21', 'Total unresolved: 20');
remaining = remaining.replaceAll('Category C: 15', 'Category C: 14');
remaining = remaining.replace('| Vai | `sog_st_vai` | — | Venus, first VAI issuance, and feature activation differ. |\n', '');
remaining = remaining.replace('Current unresolved queue: 21', 'Current unresolved queue: 20');
remaining = remaining.replace('Next bounded review: VAI', 'Next bounded review: VCHF');
fs.writeFileSync(remainingPath, remaining);

const roadmapPath = 'docs/roadmap.md';
let roadmap = fs.readFileSync(roadmapPath, 'utf8');
roadmap = roadmap.replace(
`Latest merged PR: #148 — Implement USK launch and wind-down chronology
Latest merged commit: fe34fbaa1c6b4c28682c214941f937caadb6d983
Current work: VAI bounded launch-boundary audit
Launch conclusion: set launch_date to 2020-11-24
Current-state conclusion: retain status active
Next operation after audit: VAI canonical implementation
Next bounded review after VAI: VCHF`,
`Latest merged PR: #149 — Audit VAI launch boundary
Latest merged commit: 2ce768064623dee173594c11dd3f57a469420a76
Current work: VAI canonical implementation
Launch result: launch_date set to 2020-11-24
Current-state result: status active; discontinued_date null
Next bounded review after merge: VCHF`
);
roadmap = roadmap.replace('Follow-up implementation:', 'Canonical implementation result:');
roadmap = roadmap.replace(
'- add the 2020-11-24 public launch event\n- add first-party testnet and mainnet evidence\n- preserve exact deployment and first mint as known unknowns\n- keep later stability-fee and PSM changes separate from launch\n- update the BNB Chain deployment note and evidence\n- remove VAI from the unresolved launch queue\n- reduce the queue from 21 to 20 and Category C from 15 to 14',
'- 2020-11-24 public launch event added\n- first-party testnet and mainnet evidence added\n- exact deployment and first mint preserved as known unknowns\n- later stability-fee and PSM changes remain separate from launch\n- BNB Chain deployment note and evidence updated\n- VAI removed from the unresolved launch queue\n- queue reduced from 21 to 20 and Category C from 15 to 14'
);
roadmap = roadmap.replace('136 events\n136 Event v2 detail records\n405 evidence records\n405 evidence relation projections', '137 events\n137 Event v2 detail records\n407 evidence records\n407 evidence relation projections');
roadmap = roadmap.replace('Missing canonical launch dates:            21', 'Missing canonical launch dates:            20');
roadmap = roadmap.replace(
`Total unresolved before VAI implementation: 21
Category B:                                  3
Category C:                                 15
Category D:                                  3`,
`Total unresolved: 20
Category B:         3
Category C:        14
Category D:         3`
);
roadmap = roadmap.replace(
`Expected after VAI implementation:

\`\`\`text
Total unresolved: 20
Category B:         3
Category C:        14
Category D:         3
\`\`\`

`,
''
);
roadmap = roadmap.replace('Next bounded review after VAI implementation:', 'Next bounded review:');
roadmap = roadmap.replace(
`1. Complete CI and merge the VAI audit PR.
2. Open the VAI canonical implementation PR.
3. Set launch_date only to the audited 2020-11-24 mainnet boundary.
4. Preserve exact deployment and first mint as unresolved.
5. Start VCHF after the VAI implementation passes all six workflows.`,
`1. Complete final CI and merge the VAI implementation PR.
2. Report the queue reduction to 20 total and Category C 14.
3. Start the bounded VCHF launch-boundary audit.
4. Separate issuer announcement, token issuance, chain deployment, and public availability.
5. Do not substitute a later listing or chain expansion for original launch.`
);
fs.writeFileSync(roadmapPath, roadmap);

const v2Path = 'docs/migration/registry-v2-baseline.json';
const v2 = readJson(v2Path);
v2.baseline_id = 'sog_registry_v2_vai_launch_2026_06_25';
v2.captured_at = '2026-06-25';
v2.source_commit = 'vai-launch';
v2.minimum_counts.events = 137;
v2.minimum_counts.event_details = 137;
v2.minimum_counts.evidence = 407;
v2.minimum_counts.evidence_relations = 407;
writeJson(v2Path, v2);

const v3Path = 'docs/migration/registry-v3-baseline.json';
const v3 = readJson(v3Path);
v3.baseline_id = 'sog_registry_v3_vai_launch_2026_06_25';
v3.recorded_at = '2026-06-25';
v3.data_checkpoint_commit = 'vai-launch';
v3.expected_counts.events = 137;
v3.expected_counts.event_details = 137;
v3.expected_counts.evidence = 407;
v3.quality.launch_date_unresolved = 20;
writeJson(v3Path, v3);

execFileSync('node', ['scripts/generate-registry-stats.mjs'], { stdio: 'inherit' });
execFileSync('node', ['scripts/audit-registry-integrity.mjs'], { stdio: 'inherit' });
execFileSync('node', ['scripts/validate-registry-stats.mjs'], { stdio: 'inherit' });
