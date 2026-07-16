# PR #398 Evidence Archive Maintenance Queue v6 Specification

Status: active internal queue refresh  
Review PR: 398  
Public output: false

## Objective

Consume completed History v5 and generate a deterministic, non-ranking manual-review queue from current archive gaps.

## Binding input

```text
Canonical Evidence: 559
Archive recorded: 425
Archive not recorded: 134
History sources / events / identities: 6 / 60 / 58
Reviewed unresolved / suppressed / reactivated: 13 / 13 / 0
```

## Selection

- exclude alias identities;
- exclude Web Archive source URLs;
- exclude rows without source URLs;
- exclude all thirteen reviewed suppressions;
- place reviewed-reactivated identities first, but History v5 contains none;
- use source-priority bucket then Evidence ID ordering;
- select at most ten identities;
- do not rank assets or Evidence.

Expected eligible pool: **88**.  
Expected selected count: **10**.  
Expected selected reactivated count: **0**.

## Required outputs

```text
docs/migration/evidence-archive-maintenance-queue-v6-pr398.json
docs/migration/evidence-archive-maintenance-queue-v6-pr398-delta.json
```

## Boundaries

PR #398 is an internal manual-review queue only. It may not change canonical records, checkpoints, statistics, release baselines, or public surfaces. It does not authorize Archive Batch 7.

## Exit condition

Queue v6 and its Queue v5 delta regenerate deterministically, contain ten unique ordinary unreviewed candidates, enforce all thirteen suppressions, include no reactivated identity, and stop at `REVIEW GATE`.
