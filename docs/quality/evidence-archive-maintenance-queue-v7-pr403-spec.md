# PR #403 Evidence Archive Maintenance Queue v7 Specification

Status: active internal queue refresh  
Review PR: 403  
Public output: false

## Objective

Consume completed History v6 and generate a deterministic, non-ranking manual-review queue from current archive gaps.

## Binding input

```text
Canonical Evidence: 559
Archive recorded / not recorded: 430 / 129
History sources / events / identities: 7 / 70 / 68
Reviewed unresolved / suppressed / reactivated: 18 / 18 / 0
```

## Selection

- exclude alias identities;
- exclude Web Archive source URLs;
- exclude rows without source URLs;
- exclude all eighteen reviewed suppressions;
- place reviewed-reactivated identities first, but History v6 contains none;
- use source-priority bucket then Evidence ID ordering;
- select at most ten identities;
- do not rank assets or Evidence.

Expected eligible pool: **78**.  
Expected selected count: **10**.  
Expected selected reactivated count: **0**.

```text
Alias identities excluded: 33
Reviewed suppressions excluded: 18
Added / removed / retained versus Queue v6: 10 / 10 / 0
```

## Required outputs

```text
docs/migration/evidence-archive-maintenance-queue-v7-pr403.json
docs/migration/evidence-archive-maintenance-queue-v7-pr403-delta.json
```

## Boundaries

PR #403 is an internal manual-review queue only. It may not change canonical records, checkpoints, statistics, release baselines, or public surfaces. It does not authorize Archive Batch 8.

## Exit condition

Queue v7 and its Queue v6 delta regenerate deterministically, exclude all eighteen suppressions, include no reactivated identity, select exactly ten ordinary unreviewed candidates, and stop at `REVIEW GATE`.
