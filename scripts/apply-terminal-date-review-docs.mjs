import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const file = path.join(root, 'docs/roadmap.md');
let text = fs.readFileSync(file, 'utf8');

function replaceRequired(before, after, label) {
  if (!text.includes(before)) throw new Error(`Missing roadmap anchor: ${label}`);
  text = text.replace(before, after);
}

replaceRequired(
`PR #69 — Complete Launch-date Batch O
PR #70 — Complete Launch-date Batch P`,
`PR #69 — Complete Launch-date Batch O
PR #70 — Complete Launch-date Batch P
PR #74 — Freeze unresolved launch-date queue`,
'completed quality work'
);

replaceRequired(
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
`Current development stage:

\`\`\`text
Phase 1 — Launch-date quality work: complete in PR #74
Phase 2 — Historical terminal-date work: in progress
\`\`\`

Current next action:

\`\`\`text
1. Complete historical terminal-date review in this change
2. Resolve or freeze terminal-date unknowns
\`\`\``,
'current stage'
);

replaceRequired(
`## Launch-date unresolved queue freeze

Status: **complete in this change**`,
`## Launch-date unresolved queue freeze

Status: **complete in PR #74**`,
'launch queue status'
);

replaceRequired(
`## Historical terminal-date review

For each asset, distinguish:`,
`## Historical terminal-date review

Status: **complete in this change**

Review source:

\`\`\`text
docs/audits/historical-terminal-date-review.md
\`\`\`

Current review decision:

\`\`\`text
BAC   retain null — no first-party shutdown or cessation date recovered
DSD   retain null — April 2021 V2 activity is not a shutdown date
ESD   retain null — 2021-08-02 migration start is not final cessation
USDN  retain null — XTN transition confirmed without effective date
\`\`\`

For each asset, distinguish:`,
'historical review section'
);

replaceRequired(
`Current: Launch-date unresolved queue freeze — complete in this change
Next:    Historical terminal-date review
Then:    Historical terminal-date resolution or freeze
Then:    Fiat-backed income profiles
Then:    Protocol stablecoin income profiles`,
`Current: Historical terminal-date review — complete in this change
Next:    Historical terminal-date resolution or freeze
Then:    Fiat-backed income profiles
Then:    Protocol stablecoin income profiles
Then:    Synthetic and yield-related income profiles`,
'immediate next work'
);

fs.writeFileSync(file, text);
console.log('Applied historical terminal-date review roadmap updates.');
