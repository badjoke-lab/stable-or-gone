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
8. every named queue, history contract, audit, and checkpoint

Current authority:

```text
docs/roadmap-amendments/2026-07-15-pr379-post-pr378-review-gate.md
docs/quality/post-pr378-review-gate-pr379-spec.md
config/post-pr378-review-gate-pr379.json
```

## Current workstream

```text
Canonical stable assets: 112
Canonical Evidence: 559
Archive recorded: 390
Archive not recorded: 169
PR #377 Evidence Archive Review-History Contract Audit: complete
PR #378 Evidence Archive Maintenance Queue v2 Refresh: complete
PR #379 Post-PR #378 Review Gate: active; complete on merge
Current authority: REVIEW GATE
```

PR #379 may record an authority decision only. It may not change canonical Evidence or public surfaces.

## Binding PR #378 result

```text
reviewed unresolved Evidence suppressed: 10
reviewed reactivation signals: 0
fresh selected candidates: 10
maximum selected candidates: 10
next work item: REVIEW GATE
```

The exact selected Evidence IDs and deterministic priority order are fixed in `docs/migration/evidence-archive-maintenance-queue-v2-pr378.json`.

## Reviewed next sequence

PR #379 may approve exactly:

```text
PR #380 Evidence and Archive Maintenance Batch 3
REVIEW GATE
```

PR #380 must review exactly the ten PR #378 identities. Each identity must receive one outcome:

```text
dated_exact_archive_added
reviewed_source_replacement
reviewed_no_safe_change
```

A canonical change is allowed only after a reviewed exact capture or reviewed claim-scope-equivalent source replacement. Automatic capture, automatic replacement, rankings, scores, recommendations, and new public surfaces remain prohibited.

## Boundaries

PR #379 may change only internal authority, configuration, deterministic review output, validators, and workflow files.

It may not change:

```text
data/
src/
public/
canonical Evidence identities, relations, URLs, or archived URLs
Market Access records
deployments
statistics history
historical queues or outcomes
automatic monitoring or canonical promotion
```

Not approved before the next review gate:

```text
Evidence and Archive Maintenance Batch 4
Tier A Dossier Deepening Batch 6
Market Access Pilot 3
Record Growth Batch 2
new public page or explorer
```

Every non-trivial PR must state specification references, roadmap item, scope, non-goals, named inputs, preservation, validation, and deployment classification.
