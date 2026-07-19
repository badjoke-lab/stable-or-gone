import fs from 'node:fs';

const agentsPath = 'AGENTS.md';
const roadmapPath = 'docs/roadmap.md';

const agents = `# Stable or Gone Agent Instructions

Current mandatory authority: PR #427 Record Growth Candidate Audit v2.

Current authority:

\`\`\`text
AGENTS.md
docs/spec-governance.md
docs/roadmap.md
docs/deployment-policy.md
docs/post-351-data-growth-operating-spec.md
docs/roadmap-amendments/2026-07-18-pr426-post-ui-v3-data-growth-reset.md
docs/quality/post-ui-v3-data-growth-reset-pr426-spec.md
config/post-ui-v3-data-growth-reset-pr426.json
docs/migration/post-ui-v3-data-growth-reset-pr426.json
docs/migration/ui-v3-owner-approval-pr422.json
docs/migration/ui-v3-issue-281-closure-pr425.md
docs/migration/tier-a-candidate-queue-v2-2-pr375.json
docs/migration/evidence-archive-maintenance-batch-8-pr405-reviewed-handoff.json
data/editorial-research/record-growth-batch-1-pr358-candidates.json
\`\`\`

## Current workstream

\`\`\`text
Canonical stable assets: 112
Organizations: 107
Relationships: 124
Events: 187
Canonical Evidence: 559
Evidence Relations: 559
Archive recorded: 430
Archive not recorded: 129
Deployments: 174
Market Access Records: 8
Issue #281 UI v3 rebuild: complete
Owner-approved desktop templates: 6 / 6
Owner-approved mobile templates: 6 / 6
UI v3 completion: true
PR #426 Post-UI v3 Data-Growth Reset: complete
PR #427 Record Growth Candidate Audit v2: active
Next boundary: REVIEW GATE
\`\`\`

UI v3 is complete and has no active implementation workstream. Future material UI changes require a new independently authorized workstream.

PR #427 is an internal, non-ranking, manual-review-only candidate audit. It reviews at most twelve candidate stable assets and stops at the mandatory review gate. Canonical Record Growth Batch 2 remains unapproved until that review gate records an explicit decision.
`;

const roadmap = `# Stable or Gone Roadmap

Updated: 2026-07-18  
Status: UI v3 complete; reviewed data growth resumed

## Current position

\`\`\`text
Canonical stable assets: 112
Organizations: 107
Relationships: 124
Events: 187
Evidence: 559
Evidence Relations: 559
Deployments: 174
Market Access Records: 8
Archive recorded: 430
Archive not recorded: 129
Issue #281 UI v3 rebuild: complete
Accepted desktop templates: 6
Accepted mobile templates: 6
Pending desktop templates: 0
Pending mobile templates: 0
UI completion: true
\`\`\`

## Active data-growth sequence

\`\`\`text
PR #426 Post-UI v3 Data-Growth Reset: complete
PR #427 Record Growth Candidate Audit v2: active
REVIEW GATE after PR #427
\`\`\`

PR #427 is an internal candidate audit over at most twelve stable-asset leads. It performs full duplicate, identity, lineage, and source-coverage review without changing canonical records or public output.

A canonical Record Growth Batch 2 is not authorized yet. The review gate after PR #427 may authorize at most two complete records only when the audit shows that complete evidence-backed record families can be produced.

## Completed UI v3 sequence

\`\`\`text
PR #409 design contract and failure gates
PR #410 review gate
PR #411 global shell and navigation
PR #412 review gate
PR #413 home and stablecoin register
PR #414 review gate
PR #415 stablecoin dossier
PR #416 review gate
PR #417 events and organizations
PR #418 review gate
PR #419 guides and secondary pages
PR #420 review gate
PR #421 full visual closure
PR #422 owner approval and completion record
PR #424 production checker aligned with UI v3
PR #425 active authority aligned and Issue #281 closed
\`\`\`

## Final visual result

\`\`\`text
Required captures: 14
Completed captures: 14
Visual failures: 0
Horizontal-overflow failures: 0
Approved template families: 6
Approved desktop states: 6
Approved mobile states: 6
\`\`\`

The owner reviewed and accepted the final visual package on 2026-07-18. Approval covers home, stablecoin register, stablecoin dossier, events, organizations, and guides on desktop and mobile.

## Preserved boundaries

\`\`\`text
Canonical data changed by PR #426: 0
Public UI changed by PR #426: 0
Routes changed: 0
Public machine-readable data changed: 0
Metadata contract changed: 0
Automatic candidate promotion: disabled
\`\`\`

Future material UI work requires a new authorized workstream. PR #427 must stop at a review gate before any canonical growth.
`;

fs.writeFileSync(agentsPath, agents);
fs.writeFileSync(roadmapPath, roadmap);
console.log('Applied PR #426 authority state.');
