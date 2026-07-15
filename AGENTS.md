# Stable or Gone Agent Instructions

This file is the mandatory current-authority entry point for humans, AI agents, and automation working in this repository.

Historical authority through PR #366 is preserved at `docs/archive/AGENTS-through-pr366.md` and does not override this file.

## Required reading

Read, in order:

1. `AGENTS.md`
2. `docs/spec-governance.md`
3. `docs/roadmap.md`
4. `docs/deployment-policy.md`
5. `docs/post-351-data-growth-operating-spec.md`
6. active roadmap amendments
7. active work-item specification
8. every named input and prior output

Current authority:

```text
docs/roadmap-amendments/2026-07-15-pr376-post-pr375-review-gate.md
docs/roadmap-amendments/2026-07-15-pr377-evidence-archive-review-history-contract-activation.md
docs/roadmap-amendments/2026-07-15-pr378-evidence-archive-maintenance-queue-v2-refresh-activation.md
docs/quality/evidence-archive-maintenance-queue-v2-pr378-spec.md
config/evidence-archive-maintenance-queue-v2-pr378.json
```

## Current workstream

```text
Canonical stable assets: 112
Canonical Evidence: 559
Archive recorded: 390
Archive not recorded: 169
PR #377 Evidence Archive Review-History Contract Audit: complete
PR #378 Evidence Archive Maintenance Queue v2 Refresh: active; complete on merge
REVIEW GATE: next and mandatory
```

## Binding review-history result

```text
history sources: 2
history events: 20
reviewed Evidence identities: 20
archive present: 10
invalid archive removed: 1
reviewed no-safe-change: 9
reviewed unresolved archive gaps: 10
```

The ten unresolved identities remain suppressed unless a reviewed exact-capture or reviewed source-replacement signal exists. Time elapsed, queue presence, HTTP movement, and unreviewed Wayback or URL results are not reactivation signals.

## PR #378 authority

PR #378 must:

- load current canonical Evidence identities without changing them;
- start from archive-not-recorded identities with a source URL;
- exclude aliases and Web Archive source URLs;
- exclude PR #377 reviewed suppressed identities without a reviewed signal;
- preserve the PR #365 deterministic priority order;
- select no more than ten candidates;
- record exclusions, provenance, and queue delta deterministically;
- remain internal, non-ranking, and manual-review-only;
- stop at `REVIEW GATE`.

Required outputs:

```text
docs/migration/evidence-archive-maintenance-queue-v2-pr378.json
docs/migration/evidence-archive-maintenance-queue-v2-pr378-delta.json
```

## Boundaries

PR #378 may change only internal authority, configuration, builders, generated internal outputs, validators, and workflow files.

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
rankings, scores, recommendations, or leaderboards
automatic capture, source replacement, monitoring, or canonical promotion
```

Not approved before the next review gate:

```text
Evidence and Archive Maintenance Batch 3 canonical changes
Tier A Dossier Deepening Batch 6
Market Access Pilot 3
Record Growth Batch 2
new public page or explorer
```

Every non-trivial PR must state specification references, roadmap item, scope, non-goals, named inputs, preservation, validation, and deployment classification. A PR without approved authority must pause.
