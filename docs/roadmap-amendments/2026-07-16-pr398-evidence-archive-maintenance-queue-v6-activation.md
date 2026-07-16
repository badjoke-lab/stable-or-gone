# PR #398 Evidence Archive Maintenance Queue v6 Activation

Status: active  
Authority source: merged PR #396 and merged PR #397

## Authorized work

PR #398 is the second and final internal work item authorized by PR #396.

```text
PR #398 Evidence Archive Maintenance Queue v6 Refresh
REVIEW GATE
```

## Required result

```text
Canonical Evidence: 559
Archive recorded / not recorded: 425 / 134
History sources / events / identities: 6 / 60 / 58
Reviewed unresolved suppressed: 13
Reviewed reactivated eligible: 0
Eligible pool: 88
Selected: 10
Selected reactivated: 0
```

## Selection boundary

The queue is non-ranking and manual-review only. It may select at most ten identities using reactivated tier, source-priority bucket, and Evidence ID ordering. History v5 contains no reactivated identity.

## Boundaries

No canonical, checkpoint, statistics, release-baseline, or public change is permitted. Queue v5 and History v5 remain immutable. Archive Batch 7 is not authorized.

## Exit

After Queue v6 is merged, stop at `REVIEW GATE`.
