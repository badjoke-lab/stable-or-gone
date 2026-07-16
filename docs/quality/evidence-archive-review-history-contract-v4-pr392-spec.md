# PR #392 Evidence Archive Review-History Contract v4 Specification

Status: active internal history refresh  
Review PR: 392  
Public output: false

## Objective

Build a fresh versioned archive-review history from PR #360, PR #365, PR #380, PR #385, and PR #390 without rewriting earlier history versions or changing canonical data.

## Required inventory

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

## Resolution rule

Events are ordered by reviewed date, review PR, source order, and Evidence ID. The latest reviewed event wins for each Evidence identity. Current canonical `archived_url` determines whether the identity is archive-present.

## Required outputs

```text
docs/migration/evidence-archive-review-history-manifest-v4-pr392.json
docs/migration/evidence-archive-review-history-audit-v4-pr392.json
```

## Binding findings

- PR #390 contributes ten archive-present review events.
- `sog_src_fdusd_site` is archive-present and no longer reviewed-reactivated.
- Twelve unresolved identities remain suppressed.
- No source-replacement identity remains queue-eligible.
- History v3 and all source outcomes remain immutable.

## Boundaries

PR #392 may create only the v4 contract, manifest, audit, authority, builder, validator, and workflow. It may not generate Queue v5, change canonical data, update checkpoints or statistics, expose public output, rank Evidence, or authorize Batch 6.

## Exit condition

History v4 is deterministic, exact counts match the contract, all source blobs remain unchanged, and the only next work item is `PR #393 Evidence Archive Maintenance Queue v5 Refresh`.
