# PR #374 Planning Queue Review-History Contract Audit Specification

Status: active internal planning specification  
Review PR: 374  
Public output: false

## Objective

Prevent recurrent dossier queues from immediately resurfacing assets and dimensions that already have a reviewed complete, partial, or no-safe-change outcome without a new source signal.

## Required inputs

```text
config/planning-queue-review-history-v1-pr374.json
config/tier-a-dossier-batch-1-pr354.json
docs/migration/tier-a-batch-1-pr354-reviewed-handoff.json
config/tier-a-dossier-batch-2-pr355.json
docs/migration/tier-a-batch-2-pr355-reviewed-handoff.json
docs/migration/tier-a-batch-3-pr357-review-outcomes.json
docs/migration/tier-a-dossier-batch-4-pr364-findings.json
docs/migration/tier-a-batch-4-pr364-reviewed-handoff.json
docs/migration/tier-a-batch-5-pr369-review-outcomes.json
docs/migration/tier-a-candidate-queue-v2-1-pr372.json
docs/migration/post-pr372-review-gate-pr373.json
```

## History model

The primary key is:

```text
asset_id + dimension_id
```

Events are ordered by reviewed date, PR number, and deterministic source order. The latest event is effective.

Outcomes:

```text
reviewed_complete
reviewed_partial
reviewed_no_safe_change
```

All three suppress the same dimension when no reviewed reactivation signal exists.

## Expiry rule

There is no automatic time expiry. A review does not become stale merely because time passes. The unresolved claim can return to the queue only through a reviewed source or semantics signal.

## Reactivation rule

Accepted triggers:

```text
reviewed_new_source
reviewed_semantics_change
```

A reviewed new-source signal must be later than the effective review, identify a new source identity or changed source-version digest, name the affected dimension, and declare support scope.

A reviewed semantics-change signal must name the changed contract, affected dimension, and explicit reinterpretation of the prior outcome.

The following are not reactivation signals:

```text
queue presence
planning-state movement alone
maintenance-only gaps
time elapsed
unreviewed monitoring rows
```

## Candidate rule

A candidate remains eligible only when at least one material dossier gap is unreviewed or reactivated. If every material dossier gap is suppressed, the asset is excluded.

Queue order remains asset-slug ascending and non-ranking.

## Expected result

```text
history sources: 5
history events: 48
reviewed assets: 18
effective asset-dimension outcomes: 33
reviewed complete: 20
reviewed partial: 0
reviewed no-safe-change: 13
current queue candidates: 3
fully suppressed candidates: 3
projected v2.2 candidates without new signals: 0
```

## Required outputs

```text
docs/migration/planning-queue-review-history-manifest-pr374.json
docs/migration/planning-queue-review-history-audit-pr374.json
```

## Prohibited work

- baseline recomputation;
- canonical or public changes;
- historical queue rewrites;
- automatic source or canonical promotion;
- rankings, scores, recommendations, or dossier authorization.

## Exit condition

PR #374 ends by handing the reviewed contract and manifest to PR #375 Candidate Queue v2.2 Refresh.
