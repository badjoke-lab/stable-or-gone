# PR #328 statistics analysis expansion activation

Status: active roadmap amendment  
Updated: 2026-07-08

## Purpose

This amendment records the transition from the merged PR #327 public statistics foundation to active PR #328 analysis expansion.

It supersedes stale current-position wording that still describes PR #327 as active or PR #328 as next.

## Authoritative current workstream

```text
PR #325 deterministic statistics generator and validator: complete
PR #326 immutable checkpoint history: complete
PR #327 /stats/ foundation: complete
PR #328 historical, deployment, organization, and data-quality statistics: active
PR #329 next candidate audit: next
```

## Binding specifications

```text
docs/stats-spec.md
docs/stats-history-spec.md
docs/stats-foundation-spec.md
docs/stats-analysis-expansion-spec.md
```

## PR #328 boundary

PR #328 expands `/stats/` with reviewed deterministic analysis for:

- classification;
- historical events and failures;
- deployments;
- organizations;
- data quality and evidence coverage.

PR #328 reuses the deterministic statistics model and existing public JSON endpoints. It does not create a parallel manually maintained statistics dataset.

PR #328 does not:

- add live-market metrics;
- add rankings or recommendation scores;
- change canonical registry records;
- mutate statistics checkpoint history;
- start controlled record growth.

## Phase D close condition

Phase D closes after PR #328 is merged with full CI and independent audit workflows green.

After Phase D closes, the next roadmap item is:

```text
PR #329 next candidate audit
```

Controlled growth remains:

```text
PR #330 100 -> 102
PR #331 102 -> 104
PR #332 104 -> 106
PR #333 106 -> 108
PR #334 108 -> 110
```

## Data preservation

The audited 100-asset canonical checkpoint remains unchanged. Candidate, monitoring, discovery, editorial-research, stale-state, and private material remain outside public statistics inputs.
