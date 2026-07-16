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
docs/roadmap-amendments/2026-07-16-pr383-evidence-archive-maintenance-queue-v3-activation.md
docs/quality/evidence-archive-maintenance-queue-v3-pr383-spec.md
config/evidence-archive-maintenance-queue-v3-pr383.json
docs/migration/post-pr380-review-gate-pr381.json
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
PR #381 Post-PR #380 Review Gate: complete
PR #382 Evidence Archive Review-History Contract v2 Update: complete
PR #383 Evidence Archive Maintenance Queue v3 Refresh: active; complete on merge
REVIEW GATE: mandatory after PR #383
```

PR #383 may generate internal queue and delta outputs only. It may change no canonical data or public surface.

## Binding queue v3 scope

PR #383 must start from the current 160 archive-not-recorded canonical Evidence identities and consume the reviewed PR #382 history v2 contract.

History v2 boundary:

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

The ten reviewed suppressed identities remain excluded. The sole reviewed reactivated identity is:

```text
sog_src_eurc_mint_page
```

It must be included in the fresh manual-review queue before ordinary unreviewed archive gaps. This is queue eligibility only and does not authorize an automatic archive, source change, or canonical promotion.

After the reviewed-reactivated tier, candidates use the existing deterministic non-ranking priority order and Evidence ID tie-break. PR #383 may select at most ten candidates.

## Boundaries

PR #383 may change only internal authority, queue configuration, deterministic builder, versioned queue/delta outputs, validator, and workflow files.

It may not change canonical Evidence, Evidence Relations, assets, deployments, Market Access records, statistics, public outputs, rankings, scores, recommendations, or any reviewed PR #360/#365/#377/#378/#380/#381/#382 source or output file.

Not approved before the next review gate:

```text
Evidence and Archive Maintenance Batch 4
Tier A Dossier Deepening Batch 6
Market Access Pilot 3
Record Growth Batch 2
new public page or explorer
automatic monitoring promotion
automatic canonical promotion
```

Every non-trivial PR must state specification references, roadmap item, scope, non-goals, named inputs, preservation, validation, and deployment classification. PR #383 must stop at `REVIEW GATE`.