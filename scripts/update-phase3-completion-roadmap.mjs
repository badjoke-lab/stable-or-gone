import fs from 'node:fs';

const file = 'docs/roadmap.md';
let text = fs.readFileSync(file, 'utf8');

function replaceRequired(before, after, label) {
  if (!text.includes(before)) throw new Error(`Missing roadmap anchor: ${label}`);
  text = text.replace(before, after);
}

replaceRequired(
  'All-unknown income profiles:                21',
  'All-unknown income profiles:                 0',
  'top queue count'
);

replaceRequired(
`PR #77 — Freeze historical terminal-date queue
PR #78 — Resolve fiat-backed income profiles`,
`PR #77 — Freeze historical terminal-date queue
PR #78 — Resolve fiat-backed income profiles
PR #79 — Resolve protocol stable-asset mechanics
PR #80 — Complete income-profile classification`,
  'completed work list'
);

replaceRequired(
`Phase 1 — Launch-date quality work: complete in PR #74
Phase 2 — Historical terminal-date work: complete in PR #77
Phase 3 — Income-profile completion: in progress`,
`Phase 1 — Launch-date quality work: complete in PR #74
Phase 2 — Historical terminal-date work: complete in PR #77
Phase 3 — Income-profile completion: complete in PR #80
Phase 4 — Reserve-report applicability and evidence: next`,
  'current phase state'
);

replaceRequired(
`1. Complete protocol mechanics batch in this change
2. Begin remaining profile completion`,
`1. Begin reserve-report applicability classification
2. Separate expected, not-applicable, and unresolved coverage`,
  'current action'
);

replaceRequired(
  'Current queue: **21 all-unknown income profiles after this change**',
  'Current queue: **0 all-unknown income profiles after PR #80**',
  'phase 3 queue'
);

replaceRequired(
`## Protocol stablecoin income profiles

Prioritize DAI, LUSD, crvUSD, GHO, FRAX, RAI, BOLD, alUSD, MIM, and similar protocol assets.`,
`## Protocol stablecoin income profiles

Status: **complete in PR #79 and PR #80**

Prioritize DAI, LUSD, crvUSD, GHO, FRAX, RAI, BOLD, alUSD, MIM, and similar protocol assets.`,
  'protocol section status'
);

replaceRequired(
`## Synthetic and yield-related profiles

Prioritize USDe, sUSDe, sDAI, sUSDS, USD0, USR, sUSD, SPOT, and NUON.`,
`## Synthetic and yield-related profiles

Status: **complete in PR #80**

Decision record:

\`\`\`text
docs/audits/income-profile-phase3-final-batch.md
\`\`\`

Prioritize USDe, sUSDe, sDAI, sUSDS, USD0, USR, sUSD, SPOT, and NUON.`,
  'synthetic section status'
);

replaceRequired(
`## Historical, commodity, and edge profiles

Cover failed, migrated, commodity-backed, and otherwise non-standard assets.`,
`## Historical, commodity, and edge profiles

Status: **complete in PR #80**

Cover failed, migrated, commodity-backed, and otherwise non-standard assets.`,
  'historical section status'
);

replaceRequired(
`Current: Protocol mechanics batch — complete in this change
Next:    Synthetic and historical profile completion
Then:    Synthetic and yield-related income profiles
Then:    Historical, commodity, and edge income profiles
Then:    Phase 3 completion audit`,
`Current: Income-profile completion — complete in PR #80
Next:    Reserve-report applicability classification
Then:    Reserve evidence deepening where applicable
Then:    Final 70-record quality audit
Then:    Freeze the 70-record quality baseline`,
  'immediate next work'
);

fs.writeFileSync(file, text);
console.log('Applied Phase 3 completion roadmap updates.');
