import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const roadmapPath = path.join(root, 'docs/roadmap.md');
let roadmap = fs.readFileSync(roadmapPath, 'utf8');

const replaceRequired = (from, to) => {
  if (!roadmap.includes(from)) throw new Error(`Missing roadmap text: ${from}`);
  roadmap = roadmap.replace(from, to);
};

replaceRequired(
  'PR #93 — Promote Batch M stable assets\nMerge: cd745f315d2b0f935fc2288c2e118f6905e087b6',
  'PR #95 — Recover Falcon USDf launch date\nMerge: c11e42a685099c336c5c4551e2a4bdb63341a7b7'
);
replaceRequired(
  'PR #93 — Promote Batch M stable assets\n75-record production parity — PASS',
  'PR #93 — Promote Batch M stable assets\nPR #95 — Recover Falcon USDf launch date\n75-record production parity — PASS'
);
replaceRequired(
  'Phase 6D-4 — 80-record manual publication and parity: blocked pending Cloudflare access',
  'Phase 6D-4 — 80-record manual publication and parity: blocked pending Cloudflare access\nPhase 6D-5 — Falcon USDf launch-date recovery: complete'
);
fs.writeFileSync(roadmapPath, roadmap);

const checkpoint = `# Falcon USDf Launch-Date Merge Checkpoint

Recorded: 2026-06-22

PR #95 merged as \`c11e42a685099c336c5c4551e2a4bdb63341a7b7\`.

## Result

- Falcon USDf canonical launch date: \`2025-04-30\`
- Boundary: unrestricted public access after the earlier closed beta
- Evidence: 327 to 328
- Unresolved launch dates: 38 to 37
- Category B: 9 to 8
- Category C: 26 unchanged
- Category D: 3 unchanged
- Critical findings: 0
- Warnings: 0

## Final validation

All required pull-request checks passed on head \`7b6ba2477e448d91cca8a9c9762971ad4326146f\`:

- CI
- Registry integrity
- Public consistency
- Registry stats
- Registry v3 view
- Registry v3 income profiles

## Preserved uncertainty

BRZ, EURS, Mountain Protocol USDM, USD0, USR, Anzen USDz, Avalon USDa, and Berachain HONEY remain null because the reviewed first-party material supports only a month or year.

## Production status

No Cloudflare action or production publication was executed. The 80-record production parity checkpoint remains pending until access returns.
`;
fs.writeFileSync(path.join(root, 'docs/audits/falcon-usdf-launch-date-merge-checkpoint.md'), checkpoint);

console.log('Recorded Falcon USDf launch-date merge checkpoint.');
