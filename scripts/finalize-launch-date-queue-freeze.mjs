import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const write = (file, value) => fs.writeFileSync(path.join(root, file), value);
const replaceRequired = (text, before, after, label) => {
  if (!text.includes(before)) throw new Error(`Missing anchor: ${label}`);
  return text.replace(before, after);
};

{
  const file = 'docs/roadmap.md';
  let text = read(file);
  text = replaceRequired(text,
`Latest completed data checkpoint:

\`\`\`text
PR #69 — Launch-date Batch O
Merge: 1b12963bbe7e5d1bb0653842e6b57a86357e63bc
\`\`\``,
`Latest completed data checkpoint:

\`\`\`text
PR #70 — Launch-date Batch P
Merge: ca70f6ba470fdcde638c7546d9dad64d278a7dfb
\`\`\``,
'latest checkpoint');
  text = replaceRequired(text,
`PR #57 — Audit and classify the remaining launch-date queue
PR #69 — Complete Launch-date Batch O`,
`PR #57 — Audit and classify the remaining launch-date queue
PR #69 — Complete Launch-date Batch O
PR #70 — Complete Launch-date Batch P`,
'completed quality work');
  text = replaceRequired(text,
`Current development stage:

\`\`\`text
Phase 1 — Launch-date quality work
\`\`\``,
`Current development stage:

\`\`\`text
Phase 1 — Launch-date quality work: complete in this change
Phase 2 — Historical terminal-date work: next
\`\`\``,
'current stage');
  text = replaceRequired(text,
`Current next action:

\`\`\`text
1. Complete Launch-date Batch P in this change
2. Launch-date unresolved queue freeze
\`\`\``,
`Current next action:

\`\`\`text
1. Complete the launch-date unresolved queue freeze in this change
2. Historical terminal-date review for BAC, DSD, ESD, and USDN
\`\`\``,
'next action');
  text = replaceRequired(text, 'Current remaining queue: **31 records**', 'Current frozen unresolved queue: **31 records**', 'queue label');
  text = replaceRequired(text, 'Status: **complete in this change**\n\nApply the remaining two currently approved category-A dates:', 'Status: **complete in PR #70**\n\nApply the remaining two currently approved category-A dates:', 'Batch P status');
  text = replaceRequired(text,
`## Launch-date unresolved queue freeze

Recheck the remaining category B, C, and D records. Apply an additional day-level date only if newly found primary evidence resolves the exact launch boundary.`,
`## Launch-date unresolved queue freeze

Status: **complete in this change**

The remaining category B, C, and D records are frozen in the machine-readable queue:

\`\`\`text
data/quality/launch-date-unresolved.json
\`\`\`

The build now runs \`npm run validate:launch-queue\` and requires the canonical \`launch_date: null\` set to match the queue exactly.

Recheck the remaining category B, C, and D records only when new primary evidence resolves the exact launch boundary.`,
'freeze section');
  text = replaceRequired(text,
`Missing launch dates:            31 unless stronger evidence is found
All remaining null dates:        explicitly classified and documented
Artificial month/year-first date: 0
Critical findings:                0
Warnings:                         0`,
`Missing launch dates:             31 frozen
Category B / C / D:                5 / 23 / 3
All remaining null dates:         machine-readable and documented
Canonical null set vs queue:      exact match
Artificial month/year-first date: 0
Critical findings:                0
Warnings:                         0`,
'phase completion result');
  text = replaceRequired(text,
`Current: Launch-date Batch P — complete in this change
Next:    Launch-date unresolved queue freeze
Then:    Historical terminal-date review
Then:    Historical terminal-date resolution or freeze
Then:    Fiat-backed income profiles`,
`Current: Launch-date unresolved queue freeze — complete in this change
Next:    Historical terminal-date review
Then:    Historical terminal-date resolution or freeze
Then:    Fiat-backed income profiles
Then:    Protocol stablecoin income profiles`,
'immediate work');
  write(file, text);
}

{
  const file = 'docs/audits/remaining-launch-date-review.md';
  let text = read(file);
  text = replaceRequired(text,
`Remaining launch_date null:         31
\`\`\``,
`Remaining launch_date null:         31
Queue status:                       frozen and validator-enforced
Machine-readable queue:             data/quality/launch-date-unresolved.json
\`\`\``,
'queue status');
  text = replaceRequired(text, '### Launch-date unresolved queue freeze', '### Launch-date unresolved queue freeze — complete', 'freeze heading');
  text = replaceRequired(text,
`- re-check whether any Category B record can be promoted using an archived first-party day-level source
- resolve any Category C record whose version or lineage can be documented safely
- retain all other launch dates as \`null\`
- record the final B/C/D classification as the maintained unresolved queue`,
`- all 31 category B, C, and D records are stored in \`data/quality/launch-date-unresolved.json\`
- category counts are fixed at B 5, C 23, and D 3
- the canonical null-date set and machine-readable queue must match exactly
- future promotion requires new day-level primary evidence and simultaneous removal from the queue
- month/year coercion, exchange-listing substitution, and rebrand substitution remain prohibited`,
'freeze bullets');
  text = replaceRequired(text,
`Remaining launch_date null: 31
Remaining category-A records: none
Next work item: Launch-date unresolved queue freeze`,
`Remaining launch_date null: 31
Remaining category-A records: none
Unresolved queue: frozen and validator-enforced
Next work item: Historical terminal-date review`,
'completion state');
  write(file, text);
}

write('docs/audits/launch-date-unresolved-freeze.md', `# Launch-date Unresolved Queue Freeze

Updated: 2026-06-19

## Result

The seven category-A records identified in the original 38-record review were promoted through Launch-date Batches O and P. The remaining 31 records are intentionally unresolved and remain \`launch_date: null\`.

\`\`\`text
Category B — partial date only:                 5
Category C — boundary, version, or lineage:    23
Category D — adequate primary source absent:    3
Total frozen unresolved queue:                 31
\`\`\`

## Machine-readable source

\`data/quality/launch-date-unresolved.json\` is the canonical unresolved queue.

Each entry records:

- canonical stablecoin ID
- category B, C, or D
- strongest known range where available
- reason code
- review note

## Enforcement

\`scripts/validate-launch-date-unresolved.mjs\` loads the stablecoin files declared in the Registry v2 baseline and verifies:

- every queue ID exists
- every queued asset still has \`launch_date: null\`
- every canonical null launch date appears in the queue
- there are no duplicate IDs
- the total is 31
- category counts are B 5, C 23, D 3
- anti-fabrication policy flags remain enabled

The validator runs in the normal \`npm run build\` chain as \`npm run validate:launch-queue\`.

## Update rule

A future launch-date promotion must update the canonical record and remove the same ID from this queue in one PR. CI must fail when only one side changes.

## Next work

Historical terminal-date review for BAC, DSD, ESD, and USDN.
`);

console.log('Finalized launch-date unresolved queue freeze documentation.');
