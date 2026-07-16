# Stable or Gone Agent Instructions

This file is the current mandatory authority entry point. Historical authority through PR #366 remains archived and does not override this file.

## Required reading

1. `AGENTS.md`
2. `docs/spec-governance.md`
3. `docs/roadmap.md`
4. `docs/deployment-policy.md`
5. `docs/post-351-data-growth-operating-spec.md`
6. active roadmap amendments
7. the latest reviewed handoff and checkpoint
8. every named queue, history contract, audit, outcome, and prior output

Current reviewed authority:

```text
docs/roadmap-amendments/2026-07-16-pr380-evidence-archive-maintenance-batch-3-activation.md
docs/quality/evidence-archive-maintenance-batch-3-pr380-spec.md
config/evidence-archive-maintenance-batch-3-pr380.json
config/evidence-archive-maintenance-batch-3-pr380-decisions.json
docs/migration/evidence-archive-maintenance-batch-3-pr380-reviewed-handoff.json
docs/migration/current-canonical-checkpoint.json
```

## Current workstream

```text
Canonical stable assets: 112
Canonical Evidence: 559
Evidence Relations: 559
Archive recorded: 399
Archive not recorded: 160
Deployments: 174
Market Access Records: 8
PR #380 Evidence and Archive Maintenance Batch 3: reviewed complete; complete on merge
Current authority: REVIEW GATE
Next work item: none pre-authorized
```

## Binding PR #380 result

```text
selected Evidence identities: 10
changed Evidence records: 10
dated exact archives added: 9
reviewed source replacements: 1
reviewed no-safe-change: 0
```

The only source replacement is the reviewed Circle Mint Evidence identity and route change:

```text
sog_src_eurc_mint_page
https://www.circle.com/mint
→ https://www.circle.com/circle-mint
```

All nine archive additions use dated exact-source HTTP 200 captures with reviewed timestamps and digests. No Evidence identity or Evidence Relation was added, removed, or substituted.

## Activation trace

The completed implementation remains bound to the activation statements that governed it:

```text
PR #380 Evidence and Archive Maintenance Batch 3: active; complete on merge
REVIEW GATE: mandatory after PR #380
```

These lines are historical execution trace. The current authority is the review gate shown above.

## Current authority boundary

Work after PR #380 must pause at `REVIEW GATE`. A later PR must explicitly evaluate the PR #380 yield, the remaining 160 archive-not-recorded identities, archive review-history ingestion, Market Access breadth, dossier queue state, maintenance burden, monitoring usefulness, and verified external usage before authorizing another sequence.

The following are not pre-authorized:

```text
Evidence and Archive Maintenance Batch 4
archive queue refresh
archive review-history mutation
Tier A Dossier Deepening Batch 6
Market Access Pilot 3
Record Growth Batch 2
new public page or explorer
ranking, score, or recommendation
automatic monitoring promotion
automatic canonical promotion
```

Every non-trivial PR must state specification references, roadmap item, scope, non-goals, named inputs, preservation, validation, and deployment classification. A PR without new reviewed authority must pause.
