import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const write = (file, value) => fs.writeFileSync(path.join(root, file), value);

function replaceRequired(text, before, after, label) {
  if (!text.includes(before)) throw new Error(`Missing documentation anchor: ${label}`);
  return text.replace(before, after);
}

{
  const file = 'docs/audits/remaining-launch-date-review.md';
  let text = read(file);

  text = replaceRequired(
    text,
`Category B:                           5
Category C:                          23
Category D:                           3
Remaining launch_date null:         31`,
`Category B:                           5
Category C:                          23
Category D:                           3
Remaining launch_date null:         31
Queue status:                       frozen and validator-enforced
Machine-readable queue:             data/quality/launch-date-unresolved.json`,
    'remaining review queue summary'
  );

  text = replaceRequired(
    text,
`### Launch-date unresolved queue freeze

- re-check whether any Category B record can be promoted using an archived first-party day-level source
- resolve any Category C record whose version or lineage can be documented safely
- retain all other launch dates as \`null\`
- record the final B/C/D classification as the maintained unresolved queue`,
`### Launch-date unresolved queue freeze — complete

- all 31 category B, C, and D records are stored in \`data/quality/launch-date-unresolved.json\`
- category counts are fixed at B 5, C 23, and D 3
- the canonical null-date set and machine-readable queue must match exactly
- future promotion requires new day-level primary evidence and simultaneous removal from the queue
- month/year coercion, exchange-listing substitution, and rebrand substitution remain prohibited`,
    'remaining review freeze section'
  );

  text = replaceRequired(
    text,
`Remaining launch_date null: 31
Remaining category-A records: none
Next work item: Launch-date unresolved queue freeze`,
`Remaining launch_date null: 31
Remaining category-A records: none
Unresolved queue: frozen and validator-enforced
Next work item: Historical terminal-date review`,
    'remaining review completion state'
  );

  write(file, text);
}

{
  const file = 'docs/roadmap.md';
  let text = read(file);

  text = replaceRequired(
    text,
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
    'roadmap latest data checkpoint'
  );

  text = replaceRequired(
    text,
`PR #57 — Audit and classify the remaining launch-date queue
PR #69 — Complete Launch-date Batch O`,
`PR #57 — Audit and classify the remaining launch-date queue
PR #69 — Complete Launch-date Batch O
PR #70 — Complete Launch-date Batch P`,
    'roadmap completed quality work'
  );

  text = replaceRequired(
    text,
`Current development stage:

\`\`\`text
Phase 1 — Launch-date quality work
\`\`\`

Current next action:

\`\`\`text
1. Complete Launch-date Batch P in this change
2. Launch-date unresolved queue freeze
\`\`\``,
`Current development stage:

\`\`\`text
Phase 1 — Launch-date quality work: complete in this change
Phase 2 — Historical terminal-date work: next
\`\`\`

Current next action:

\`\`\`text
1. Complete the launch-date unresolved queue freeze in this change
2. Historical terminal-date review for BAC, DSD, ESD, and USDN
\`\`\``,
    'roadmap current stage'
  );

  text = replaceRequired(
    text,
`Issue #66 remains open as a deferred verification item. It no longer blocks 70-record quality work.`,
`Issue #66 remains open as a deferred verification item. It no longer blocks 70-record quality work.

Cloudflare operator access is temporarily unavailable. Do not attempt production deployment, dashboard changes, credential setup, or production parity execution until the operator reports that access has been restored. GitHub-only quality work continues normally.`,
    'roadmap cloudflare unavailable state'
  );

  text = replaceRequired(
    text,
`Current remaining queue: **31 records**`,
`Current frozen unresolved queue: **31 records**`,
    'roadmap frozen queue label'
  );

  text = replaceRequired(
    text,
`## Launch-date Batch P

Status: **complete in this change**`,
`## Launch-date Batch P

Status: **complete in PR #70**`,
    'roadmap batch P status'
  );

  text = replaceRequired(
    text,
`## Launch-date unresolved queue freeze

Recheck the remaining category B, C, and D records. Apply an additional day-level date only if newly found primary evidence resolves the exact launch boundary.

Otherwise retain \`launch_date: null\` and preserve:`,
`## Launch-date unresolved queue freeze

Status: **complete in this change**

The remaining category B, C, and D records are frozen in the machine-readable queue:

\`\`\`text
data/quality/launch-date-unresolved.json
\`\`\`

The normal CI workflow and full build run \`npm run validate:launch-queue\` and require the canonical \`launch_date: null\` set to match the queue exactly.

Recheck the remaining records only when new primary evidence resolves the exact launch boundary. Otherwise retain \`launch_date: null\` and preserve:`,
    'roadmap queue freeze section'
  );

  text = replaceRequired(
    text,
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
    'roadmap phase 1 completion conditions'
  );

  text = replaceRequired(
    text,
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
    'roadmap immediate next work'
  );

  write(file, text);
}

console.log('Applied launch-date queue freeze documentation updates.');
