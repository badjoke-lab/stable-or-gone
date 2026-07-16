# PR #402 Evidence Archive Review-History Contract v6 Specification

Status: active internal history refresh  
Review PR: 402  
Public output: false

## Objective

Preserve completed History v5 unchanged and append the ten reviewed PR #400 outcomes as the seventh review source.

## Binding result

```text
History sources / events / identities: 7 / 70 / 68
Archive present / invalid removed / no-safe-change / source replacement: 50 / 1 / 17 / 0
Current archive recorded / not recorded: 430 / 129
Reviewed unresolved / suppressed / reactivated eligible: 18 / 18 / 0
```

The five PR #400 exact archive additions become archive-present outcomes. The five PR #400 no-safe-change identities become new reviewed suppressions. No reviewed identity is eligible for reactivation.

## Resolution rule

History is keyed by `evidence_id`, ordered by review date, review PR, and source order. The latest reviewed event is effective. No outcome expires automatically.

## Required outputs

```text
docs/migration/evidence-archive-review-history-manifest-v6-pr402.json
docs/migration/evidence-archive-review-history-audit-v6-pr402.json
```

## Boundaries

PR #402 may not change canonical data, checkpoints, statistics, release baselines, public surfaces, History v5, PR #400 outcomes, or prior queues. It does not generate Queue v7 and does not authorize Batch 8.

## Exit condition

History v6 regenerates deterministically, the first six source rows and first sixty events remain byte-equivalent to History v5, all counts match the binding above, and the next work item is `PR #403 Evidence Archive Maintenance Queue v7 Refresh`.
