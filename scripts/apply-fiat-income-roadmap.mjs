import fs from 'node:fs';

const file = 'docs/roadmap.md';
let text = fs.readFileSync(file, 'utf8');

function replaceRequired(before, after, label) {
  if (!text.includes(before)) throw new Error(`Missing roadmap anchor: ${label}`);
  text = text.replace(before, after);
}

replaceRequired(
  'All-unknown income profiles:                41',
  'All-unknown income profiles:                31',
  'top queue count'
);

replaceRequired(
`PR #74 — Freeze unresolved launch-date queue
PR #75 — Audit historical terminal-date boundaries`,
`PR #74 — Freeze unresolved launch-date queue
PR #75 — Audit historical terminal-date boundaries
PR #77 — Freeze historical terminal-date queue`,
  'completed work list'
);

replaceRequired(
`Phase 1 — Launch-date quality work: complete in PR #74
Phase 2 — Historical terminal-date work: complete in this change
Phase 3 — Income-profile completion: next`,
`Phase 1 — Launch-date quality work: complete in PR #74
Phase 2 — Historical terminal-date work: complete in PR #77
Phase 3 — Income-profile completion: in progress`,
  'current phase state'
);

replaceRequired(
`1. Complete historical terminal-date freeze in this change
2. Begin fiat-backed income-profile completion`,
`1. Complete fiat-backed income-profile batch in this change
2. Begin protocol stablecoin income-profile completion`,
  'current action'
);

replaceRequired(
  'Current queue: **41 all-unknown income profiles**',
  'Current queue: **31 all-unknown income profiles after this change**',
  'phase 3 queue'
);

replaceRequired(
`## Fiat-backed income profiles

Prioritize issuer-backed assets such as USDT, USDC, PYUSD, FDUSD, RLUSD, EURC, USDP, USDG, TUSD, and GUSD.`,
`## Fiat-backed income profiles

Status: **complete in this change**

Decision record:

\`\`\`text
docs/audits/fiat-backed-income-profile-batch.md
\`\`\`

Resolved assets:

\`\`\`text
USDT  USDC  TUSD  FDUSD  PYUSD
GUSD  RLUSD EURC  USDP   USDG
\`\`\`

All ten canonical tokens are classified as having no native token-holder income. Issuer reserve earnings, exchange campaigns, partner incentives, and external lending rates are not treated as intrinsic token yield.

Queue impact:

\`\`\`text
All-unknown income profiles: 41 → 31
\`\`\`

Prioritize issuer-backed assets such as USDT, USDC, PYUSD, FDUSD, RLUSD, EURC, USDP, USDG, TUSD, and GUSD.`,
  'fiat income section'
);

replaceRequired(
`Current: Historical terminal-date freeze — complete in this change
Next:    Fiat-backed income profiles
Then:    Protocol stablecoin income profiles
Then:    Synthetic and yield-related income profiles
Then:    Historical, commodity, and edge income profiles`,
`Current: Fiat-backed income profiles — complete in this change
Next:    Protocol stablecoin income profiles
Then:    Synthetic and yield-related income profiles
Then:    Historical, commodity, and edge income profiles
Then:    Phase 3 completion audit`,
  'immediate next work'
);

fs.writeFileSync(file, text);
console.log('Applied fiat-backed income-profile roadmap updates.');
