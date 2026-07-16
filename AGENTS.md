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
docs/roadmap-amendments/2026-07-16-pr382-evidence-archive-review-history-v2-activation.md
docs/quality/evidence-archive-review-history-contract-v2-pr382-spec.md
config/evidence-archive-review-history-v2-pr382.json
docs/migration/post-pr380-review-gate-pr381.json
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
PR #381 Post-PR #380 Review Gate: complete
PR #382 Evidence Archive Review-History Contract v2 Update: active; complete on merge
PR #383 Evidence Archive Maintenance Queue v3 Refresh: next after PR #382
REVIEW GATE: mandatory after PR #383
```

PR #382 may update internal history contracts and outputs only. It may change no canonical data or public surface.

## Binding history v2 scope

PR #382 must ingest PR #360, PR #365, and PR #380 as three immutable reviewed sources keyed by `evidence_id`. The latest reviewed event wins.

Expected inventory:

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

The sole reactivated identity is:

```text
sog_src_eurc_mint_page
```

Its reviewed same-product source replacement makes it eligible for fresh manual archive review under PR #383. It does not authorize an automatic archive, source change, or canonical promotion.

## Boundaries

PR #382 may change only internal authority, contract, deterministic builder, versioned manifest/audit, validator, and workflow files.

It may not change canonical Evidence, Evidence Relations, assets, deployments, Market Access records, statistics, public outputs, rankings, scores, recommendations, or any reviewed PR #360/#365/#377/#380/#381 source file.

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
