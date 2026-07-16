# Stable or Gone Agent Instructions

This file is the current mandatory authority entry point. Historical authority through PR #390 remains archived and does not override this file.

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
docs/roadmap-amendments/2026-07-16-pr391-post-pr390-review-gate.md
docs/quality/post-pr390-review-gate-pr391-spec.md
config/post-pr390-review-gate-pr391.json
docs/migration/evidence-archive-maintenance-outcomes-pr390.json
docs/migration/evidence-archive-maintenance-batch-5-pr390-reviewed-handoff.json
config/evidence-archive-review-history-v3-pr387.json
docs/migration/evidence-archive-review-history-manifest-v3-pr387.json
docs/migration/evidence-archive-review-history-audit-v3-pr387.json
```

## Current workstream

```text
Canonical stable assets: 112
Canonical Evidence: 559
Evidence Relations: 559
Archive recorded: 416
Archive not recorded: 143
Deployments: 174
Market Access Records: 8
PR #390 Evidence and Archive Maintenance Batch 5: complete
PR #391 Post-PR #390 Review Gate: active; complete on merge
PR #392 Evidence Archive Review-History Contract v4 Update: approved next
PR #393 Evidence Archive Maintenance Queue v5 Refresh: approved after PR #392
REVIEW GATE: mandatory after PR #393
```

PR #391 may record an authority decision only. It may change no canonical data, statistics, checkpoints, release baselines, or public surfaces.

## Binding History v4 projection

```text
history sources: 5
history events: 50
reviewed Evidence identities: 48
archive present: 36
invalid archive removed: 1
reviewed no-safe-change: 11
reviewed source replacement: 0
reviewed unresolved total: 12
reviewed unresolved suppressed: 12
reviewed reactivated eligible: 0
```

## Approved next sequence

```text
PR #392 Evidence Archive Review-History Contract v4 Update
PR #393 Evidence Archive Maintenance Queue v5 Refresh
REVIEW GATE
```

PR #392 and PR #393 are internal-only and may not change canonical data or public surfaces. PR #393 may select at most ten manual-review candidates and authorizes no canonical maintenance.

Not approved:

```text
Evidence and Archive Maintenance Batch 6
Tier A Dossier Deepening Batch 6
Market Access Pilot 3
Record Growth Batch 2
new public page or explorer
ranking, score, or recommendation
automatic monitoring promotion
automatic canonical promotion
```

PR #391 must stop with authority limited to PR #392, PR #393, and the following `REVIEW GATE`.
