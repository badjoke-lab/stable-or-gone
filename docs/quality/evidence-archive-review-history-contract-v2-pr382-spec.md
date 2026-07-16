# PR #382 Evidence Archive Review-History Contract v2 Specification

Status: active internal contract update  
Review PR: 382  
Public output: false

## Objective

Extend the reviewed archive-maintenance history with PR #380 outcomes so that a fresh queue can distinguish archive-present identities, still-suppressed prior gaps, and the reviewed Circle Mint source replacement that remains archive-not-recorded.

## Required inputs

```text
config/evidence-archive-review-history-v2-pr382.json
docs/migration/post-pr380-review-gate-pr381.json
docs/migration/evidence-correction-outcomes-pr360.json
docs/migration/evidence-archive-maintenance-outcomes-pr365.json
docs/migration/evidence-archive-maintenance-outcomes-pr380.json
docs/migration/evidence-archive-review-history-manifest-pr377.json
docs/migration/evidence-archive-review-history-audit-pr377.json
docs/migration/current-canonical-checkpoint.json
```

## History model

Primary key:

```text
evidence_id
```

Resolution order:

```text
reviewed_at ascending
review_pr ascending
source_order ascending
```

The latest reviewed event wins.

Supported outcomes:

```text
reviewed_archive_present
reviewed_archive_removed_invalid
reviewed_no_safe_change
reviewed_source_replacement
```

## Eligibility model

- current archive present → `not_eligible_archive_present`;
- reviewed invalid archive removal without a later reviewed signal → `suppressed_reviewed_invalid_archive_removed`;
- reviewed no-safe-change without a later reviewed signal → `suppressed_reviewed_no_safe_change`;
- reviewed source replacement with no archive → `reactivated_reviewed_source_replacement`;
- time elapsed, queue presence, HTTP movement, and unreviewed URL or Wayback results never reactivate an identity.

The Circle Mint replacement is eligible for a fresh manual archive review only. It does not authorize a canonical archive or another source replacement automatically.

## Expected inventory

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

## Required outputs

```text
docs/migration/evidence-archive-review-history-manifest-v2-pr382.json
docs/migration/evidence-archive-review-history-audit-v2-pr382.json
```

## Preservation requirements

PR #360, PR #365, PR #377, PR #380, and PR #381 reviewed outputs remain immutable. PR #382 creates new versioned outputs rather than rewriting PR #377 history files.

## Prohibited work

- canonical Evidence or relation changes;
- archive queue generation;
- automatic source/capture promotion;
- public output, ranking, scoring, or recommendation;
- historical reviewed-output rewrites.

## Exit condition

PR #382 hands the reviewed v2 contract, manifest, and audit to PR #383 Evidence Archive Maintenance Queue v3 Refresh.
