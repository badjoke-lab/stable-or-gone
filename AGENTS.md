# Stable or Gone Agent Instructions

This file is the current mandatory authority entry point. Historical authority through PR #366 remains archived and does not override this file.

## Required reading

1. `AGENTS.md`
2. `docs/spec-governance.md`
3. `docs/roadmap.md`
4. `docs/deployment-policy.md`
5. `docs/post-351-data-growth-operating-spec.md`
6. active roadmap amendment
7. active work-item specification
8. every named handoff, outcome, history contract, manifest, audit, queue, and checkpoint

Current authority:

```text
docs/roadmap-amendments/2026-07-16-pr381-post-pr380-review-gate.md
docs/quality/post-pr380-review-gate-pr381-spec.md
config/post-pr380-review-gate-pr381.json
docs/migration/evidence-archive-maintenance-batch-3-pr380-reviewed-handoff.json
docs/migration/evidence-archive-maintenance-outcomes-pr380.json
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
PR #380 Evidence and Archive Maintenance Batch 3: complete
PR #381 Post-PR #380 Review Gate: active; complete on merge
Current authority: REVIEW GATE
```

PR #381 may record an authority decision only. It may change no canonical data or public surface.

## Binding review finding

The current PR #377 archive review-history contract contains only PR #360 and PR #365 outcomes. It does not include the nine PR #380 archive additions or the reviewed Circle Mint source replacement.

The consumed PR #378 queue may not be reused, and Archive Batch 4 is not authorized before a fresh history-aware queue is reviewed.

## Approved next sequence

```text
PR #382 Evidence Archive Review-History Contract v2 Update
PR #383 Evidence Archive Maintenance Queue v3 Refresh
REVIEW GATE
```

Expected PR #382 history inventory:

```text
history sources: 3
history events: 30
reviewed Evidence identities: 30
archive present: 19
invalid archive removed: 1
reviewed no-safe-change: 9
reviewed source replacement: 1
reviewed unresolved total: 11
reviewed unresolved suppressed: 10
reviewed reactivated eligible: 1
```

PR #382 and PR #383 are internal contract/queue work only. PR #383 may select at most ten candidates and may make no canonical or public change.

## Not approved

```text
Evidence and Archive Maintenance Batch 4
Tier A Dossier Deepening Batch 6
Market Access Pilot 3
Record Growth Batch 2
new public page or explorer
ranking, score, or recommendation
automatic monitoring promotion
automatic canonical promotion
```

Every non-trivial PR must state specification references, roadmap item, scope, non-goals, named inputs, preservation, validation, and deployment classification. PR #383 must stop at `REVIEW GATE`.
