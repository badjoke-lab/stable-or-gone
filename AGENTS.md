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
docs/roadmap-amendments/2026-07-16-pr384-post-pr383-review-gate.md
docs/quality/post-pr383-review-gate-pr384-spec.md
config/post-pr383-review-gate-pr384.json
docs/migration/evidence-archive-maintenance-queue-v3-pr383.json
docs/migration/evidence-archive-maintenance-queue-v3-pr383-delta.json
config/evidence-archive-review-history-v2-pr382.json
docs/migration/evidence-archive-review-history-manifest-v2-pr382.json
docs/migration/evidence-archive-review-history-audit-v2-pr382.json
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
PR #383 Evidence Archive Maintenance Queue v3 Refresh: complete
PR #384 Post-PR #383 Review Gate: active; complete on merge
PR #385 Evidence and Archive Maintenance Batch 4: approved next
REVIEW GATE: mandatory after PR #385
```

PR #384 may record an authority decision only. It may change no canonical data or public surface.

## Binding review finding

Queue v3 is deterministic, non-ranking, manual-review-only, and bounded:

```text
Eligible pool: 117
Selected: 10
Reviewed suppressed excluded: 10
Reviewed reactivated selected: 1
Added / removed / retained versus Queue v2: 9 / 9 / 1
```

The selected reviewed-reactivated identity is `sog_src_eurc_mint_page`. The remaining nine selected identities are fresh unreviewed archive gaps.

## Approved next sequence

```text
PR #385 Evidence and Archive Maintenance Batch 4
REVIEW GATE
```

PR #385 may review exactly the ten Queue v3 identities. It may add a dated exact archive only after exact-source verification, use a reviewed source replacement only after publisher/product and claim-scope equivalence review, or record reviewed no-safe-change.

No candidate is presumed to change. PR #385 must update `AGENTS.md` and `docs/roadmap.md` before changing canonical Evidence.

## Boundaries

PR #384 may change only internal authority, deterministic review report, validator, and workflow files.

PR #385 may change canonical Evidence only through explicit reviewed outcomes for the ten Queue v3 identities. It may not add or remove Evidence identities, alter Evidence Relations, assets, deployments, Market Access records, or public surfaces.

Not approved before the next review gate:

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

Every non-trivial PR must state specification references, roadmap item, scope, non-goals, named inputs, preservation, validation, and deployment classification. PR #385 must stop at `REVIEW GATE`.