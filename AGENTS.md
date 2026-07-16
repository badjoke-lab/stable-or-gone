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
docs/roadmap-amendments/2026-07-16-pr386-post-pr385-review-gate.md
docs/quality/post-pr385-review-gate-pr386-spec.md
config/post-pr385-review-gate-pr386.json
docs/migration/evidence-archive-maintenance-outcomes-pr385.json
docs/migration/evidence-archive-maintenance-batch-4-pr385-reviewed-handoff.json
docs/migration/evidence-archive-review-history-manifest-v2-pr382.json
docs/migration/evidence-archive-review-history-audit-v2-pr382.json
```

## Current workstream

```text
Canonical stable assets: 112
Canonical Evidence: 559
Evidence Relations: 559
Archive recorded: 406
Archive not recorded: 153
Deployments: 174
Market Access Records: 8
PR #385 Evidence and Archive Maintenance Batch 4: complete
PR #386 Post-PR #385 Review Gate: active; complete on merge
PR #387 Evidence Archive Review-History Contract v3 Update: approved next
PR #388 Evidence Archive Maintenance Queue v4 Refresh: approved after PR #387
REVIEW GATE: mandatory after PR #388
```

PR #386 may record an authority decision only. It may change no canonical data, statistics, checkpoint, release baseline, or public surface.

## Binding review finding

PR #385 completed:

```text
Selected: 10
Changed: 8
Dated exact archives added: 7
Reviewed source replacements: 1
Reviewed no-safe-change: 2
Archive recorded: 399 → 406
Archive not recorded: 160 → 153
```

The current History v2 contract is stale because it includes PR #360, PR #365, and PR #380 only. Queue v3 is consumed and may not authorize another canonical batch.

Expected History v3 inventory:

```text
history sources: 4
history events: 40
reviewed Evidence identities: 39
archive present: 26
invalid archive removed: 1
reviewed no-safe-change: 11
reviewed source replacement: 1
reviewed unresolved total: 13
reviewed unresolved suppressed: 12
reviewed reactivated eligible: 1
```

Circle Mint becomes archive-present. `sog_src_fdusd_site` becomes the sole reviewed-reactivated source-replacement eligibility.

## Approved next sequence

```text
PR #387 Evidence Archive Review-History Contract v3 Update
PR #388 Evidence Archive Maintenance Queue v4 Refresh
REVIEW GATE
```

PR #387 and PR #388 are internal-only. They may not change canonical data or public surfaces. Queue v4 may select at most ten candidates.

## Not approved

```text
Evidence and Archive Maintenance Batch 5
Tier A Dossier Deepening Batch 6
Market Access Pilot 3
Record Growth Batch 2
new public page or explorer
ranking, score, or recommendation
automatic monitoring promotion
automatic canonical promotion
```

Every non-trivial PR must state specification references, roadmap item, scope, non-goals, named inputs, preservation, validation, and deployment classification. PR #388 must stop at `REVIEW GATE`.