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
`PR #70 — Complete Launch-date Batch P
PR #74 — Freeze unresolved launch-date queue`,
`PR #70 — Complete Launch-date Batch P
PR #74 — Freeze unresolved launch-date queue
PR #75 — Audit historical terminal-date boundaries`,
'completed quality work'
);

replaceRequired(
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
`Current development stage:

\`\`\`text
Phase 1 — Launch-date quality work: complete in PR #74
Phase 2 — Historical terminal-date work: complete in this change
Phase 3 — Income-profile completion: next
\`\`\`

Current next action:

\`\`\`text
1. Complete historical terminal-date freeze in this change
2. Begin fiat-backed income-profile completion
\`\`\``,
'current stage'
);

replaceRequired(
`## Historical terminal-date review

Status: **complete in this change**`,
`## Historical terminal-date review

Status: **complete in PR #75**`,
'historical review status'
);

replaceRequired(
`## Resolve or freeze terminal-date unknowns

Apply exact terminal dates only where supported. Otherwise retain \`null\` and record:`,
`## Resolve or freeze terminal-date unknowns

Status: **complete in this change**

Machine-readable queue:

\`\`\`text
data/quality/terminal-date-unresolved.json
\`\`\`

Validation command:

\`\`\`text
npm run validate:terminal-queue
\`\`\`

All four reviewed records remain \`null\`, with their strongest known boundary, unresolved definition, rejected shortcut dates, and future review target recorded explicitly.

Apply exact terminal dates only where supported. Otherwise retain \`null\` and record:`,
'resolve or freeze section'
);

replaceRequired(
`Phase completion conditions:

\`\`\`text
Unexplained terminal-date gaps: 0
Invented shutdown dates:        0
\`\`\``,
`Phase completion conditions:

\`\`\`text
Historical null terminal dates: 4
Machine-readable explanations:  4 / 4
Canonical null set vs queue:     exact match
Unexplained terminal-date gaps:  0
Invented shutdown dates:         0
\`\`\``,
'phase 2 completion conditions'
);

replaceRequired(
`Current: Historical terminal-date review — complete in this change
Next:    Historical terminal-date resolution or freeze
Then:    Fiat-backed income profiles
Then:    Protocol stablecoin income profiles
Then:    Synthetic and yield-related income profiles`,
`Current: Historical terminal-date freeze — complete in this change
Next:    Fiat-backed income profiles
Then:    Protocol stablecoin income profiles
Then:    Synthetic and yield-related income profiles
Then:    Historical, commodity, and edge income profiles`,
'immediate next work'
);

fs.writeFileSync(file, text);
console.log('Applied historical terminal-date freeze roadmap updates.');
