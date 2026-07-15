# PR #377 Evidence Archive Review-History Contract Audit Specification

Status: active internal planning specification  
Review PR: 377  
Public output: false

## Objective

Prevent archive-maintenance queues from resurfacing canonical Evidence identities that already received a reviewed invalid-archive removal or reviewed no-safe-change outcome without a new reviewed capture or source-replacement signal.

## Required inputs

```text
config/evidence-archive-review-history-v1-pr377.json
docs/migration/evidence-correction-outcomes-pr360.json
docs/migration/evidence-archive-maintenance-outcomes-pr365.json
docs/migration/evidence-archive-maintenance-batch-2-pr365-reviewed-handoff.json
docs/migration/current-canonical-checkpoint.json
docs/migration/post-pr375-review-gate-pr376.json
```

## History model

Primary key:

```text
evidence_id
```

The latest reviewed event wins. Outcomes:

```text
reviewed_archive_present
reviewed_archive_removed_invalid
reviewed_no_safe_change
```

## Suppression rule

An Evidence identity with a current archive is not eligible. A reviewed invalid-archive removal or reviewed no-safe-change identity remains suppressed while the archive is not recorded.

There is no automatic time expiry.

The following do not reactivate an identity:

```text
queue presence
HTTP status movement alone
an unreviewed Wayback result
an unreviewed source URL change
time elapsed
```

## Reactivation rule

Accepted triggers:

```text
reviewed_exact_capture
reviewed_source_replacement
```

An exact-capture signal must identify the canonical source URL, successful capture timestamp, capture digest, source-version scope, and a review later than the effective prior outcome.

A source-replacement signal must identify the replacement source, preserve canonical claim scope, establish reviewed source-version equivalence, and be reviewed later than the effective prior outcome.

## Expected result

```text
history sources: 2
history events: 20
reviewed Evidence identities: 20
archive present: 10
invalid archive removed: 1
reviewed no-safe-change: 9
currently reviewed unresolved archive gaps: 10
```

The ten unresolved identities are excluded from PR #378 unless a reviewed reactivation signal exists.

## Required outputs

```text
docs/migration/evidence-archive-review-history-manifest-pr377.json
docs/migration/evidence-archive-review-history-audit-pr377.json
```

## Prohibited work

- canonical Evidence or archive URL changes;
- archive queue generation;
- historical outcome rewrites;
- automatic capture or source-replacement promotion;
- public output, ranking, scoring, recommendation, or batch authorization.

## Exit condition

PR #377 hands the reviewed contract, manifest, and audit to PR #378 Evidence Archive Maintenance Queue v2 Refresh.
