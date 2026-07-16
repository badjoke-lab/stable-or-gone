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
docs/roadmap-amendments/2026-07-16-pr387-evidence-archive-review-history-v3-activation.md
docs/quality/evidence-archive-review-history-contract-v3-pr387-spec.md
config/evidence-archive-review-history-v3-pr387.json
docs/migration/post-pr385-review-gate-pr386.json
docs/migration/evidence-archive-maintenance-outcomes-pr385.json
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
PR #386 Post-PR #385 Review Gate: complete
PR #387 Evidence Archive Review-History Contract v3 Update: active; complete on merge
PR #388 Evidence Archive Maintenance Queue v4 Refresh: approved next
REVIEW GATE: mandatory after PR #388
```

PR #387 may create internal versioned History v3 contract outputs only. It may change no canonical data, statistics, checkpoints, release baselines, or public surfaces.

## Binding History v3 inventory

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

The sole reviewed-reactivated identity is:

```text
sog_src_fdusd_site
```

Circle Mint resolves to archive-present because PR #385 added an exact archive. Time elapsed, queue presence, HTTP movement, and unreviewed URL or Wayback results do not reactivate suppressed identities.

## Approved next sequence

```text
PR #387 Evidence Archive Review-History Contract v3 Update
PR #388 Evidence Archive Maintenance Queue v4 Refresh
REVIEW GATE
```

PR #388 must consume History v3, exclude all twelve reviewed suppressions, include the reviewed FDUSD reactivation explicitly, select at most ten candidates, and make no canonical or public change.

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