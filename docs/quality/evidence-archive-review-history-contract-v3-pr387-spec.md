# PR #387 Evidence Archive Review-History Contract v3 Specification

Status: active internal contract update  
Review PR: 387  
Public output: false

## Objective

Extend reviewed archive-maintenance history with PR #385 outcomes so Queue v4 can distinguish current archive-present identities, reviewed suppressions, and the reviewed FDUSD source replacement that remains archive-not-recorded.

## Required inputs

```text
config/evidence-archive-review-history-v3-pr387.json
docs/migration/post-pr385-review-gate-pr386.json
docs/migration/evidence-correction-outcomes-pr360.json
docs/migration/evidence-archive-maintenance-outcomes-pr365.json
docs/migration/evidence-archive-maintenance-outcomes-pr380.json
docs/migration/evidence-archive-maintenance-outcomes-pr385.json
docs/migration/evidence-archive-review-history-manifest-v2-pr382.json
docs/migration/evidence-archive-review-history-audit-v2-pr382.json
docs/migration/current-canonical-checkpoint.json
```

## History model

Primary key: `evidence_id`. Resolution order is reviewed date, review PR, then source order ascending. The latest reviewed event wins.

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

The FDUSD replacement is eligible for fresh manual archive review only. It does not authorize an archive or another replacement automatically.

## Expected inventory

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

## Required outputs

```text
docs/migration/evidence-archive-review-history-manifest-v3-pr387.json
docs/migration/evidence-archive-review-history-audit-v3-pr387.json
```

## Preservation requirements

PR #360, PR #365, PR #377, PR #380, PR #382, PR #385, and PR #386 reviewed outputs remain immutable. PR #387 creates new versioned outputs rather than rewriting v1 or v2.

## Prohibited work

- canonical Evidence or relation changes;
- archive queue generation;
- automatic source or capture promotion;
- public output, ranking, scoring, or recommendation;
- historical reviewed-output rewrites.

## Exit condition

PR #387 hands the reviewed v3 contract, manifest, and audit to PR #388 Evidence Archive Maintenance Queue v4 Refresh.