# PR #382 Evidence Archive Review-History Contract v2 Activation

Date: 2026-07-16  
Status: active internal contract update  
Public output: no

## Authority

Merged PR #381 authorizes exactly:

```text
PR #382 Evidence Archive Review-History Contract v2 Update
PR #383 Evidence Archive Maintenance Queue v3 Refresh
REVIEW GATE
```

## Scope

PR #382 must ingest PR #380 outcomes as the third immutable archive-review history source while preserving PR #360, PR #365, and PR #380 outcome files unchanged.

The history key remains `evidence_id` and the latest reviewed event wins.

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

The sole reviewed reactivated identity is:

```text
sog_src_eurc_mint_page
```

It has a reviewed same-product source replacement and no archive. It is eligible for fresh manual archive review under PR #383, but no canonical change is automatic or authorized by PR #382.

## Boundaries

PR #382 may change only internal authority, contract, deterministic builder, manifest, audit, validator, and workflow files.

It may not change canonical Evidence, Evidence Relations, assets, deployments, Market Access records, statistics, public outputs, rankings, scores, recommendations, or historical reviewed source files.

## Exit condition

PR #382 must produce a deterministic history v2 manifest and audit, generate no queue, and hand authority to PR #383.
