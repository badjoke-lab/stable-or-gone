# PR #387 Evidence Archive Review-History Contract v3 Activation

Date: 2026-07-16  
Status: active internal contract update  
Public output: no

## Authority

Merged PR #386 authorizes exactly:

```text
PR #387 Evidence Archive Review-History Contract v3 Update
PR #388 Evidence Archive Maintenance Queue v4 Refresh
REVIEW GATE
```

## Scope

PR #387 must reconstruct reviewed archive-maintenance history from PR #360, PR #365, PR #380, and PR #385 outcomes while preserving all prior history versions unchanged.

Expected effective inventory:

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

The sole reviewed-reactivated identity is `sog_src_fdusd_site`. Circle Mint resolves to archive-present after PR #385.

## Boundaries

PR #387 may create only a new contract, versioned History v3 manifest and audit, deterministic builder, validator, workflow, and authority-pointer updates.

It may not change canonical data, statistics, checkpoints, release baselines, public surfaces, prior history versions, reviewed outcomes, or queues.

## Exit condition

PR #387 must hand the reviewed History v3 contract, manifest, and audit to PR #388 Evidence Archive Maintenance Queue v4 Refresh.