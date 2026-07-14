# PR #363 Record Depth and Coverage Baseline Refresh activation

Status: active roadmap amendment  
Updated: 2026-07-14

## Current position

```text
Canonical stable assets: 112
PR #361 Post-PR #360 Review Gate: complete
PR #363 Record Depth and Coverage Baseline Refresh: active
PR #364 Tier A Dossier Deepening Batch 4: next
```

PR #362 was closed as a duplicate during review-gate processing and is not an executable work item.

## Governing references

```text
docs/migration/post-pr360-review-gate-pr361.json
docs/quality/record-depth-baseline-refresh-pr363-spec.md
config/record-depth-baseline-refresh-pr363.json
docs/migration/record-depth-baseline-pr353-summary.json
docs/migration/tier-a-candidate-queue-pr353.json
docs/migration/record-growth-batch-1-pr358-reviewed-handoff.json
```

## Authorized scope

PR #363 may:

- recompute all 16 existing Record Depth dimensions for exactly 112 canonical assets;
- create a new internal summary without rewriting PR #353;
- create a deterministic delta from PR #353 to PR #363;
- create a complete current non-ranking Tier A candidate queue;
- update repository authority and active-workstream validation;
- validate build and public non-leakage.

PR #363 may not:

- change canonical data or public application source;
- change Market Access Records;
- rewrite historical planning or statistics checkpoints;
- change Comparison Readiness or Facet Freshness semantics;
- promote monitoring or editorial research automatically;
- add a public route or machine-readable planning output;
- rank assets or produce a composite score or recommendation.

## Required outputs

```text
docs/migration/record-depth-baseline-pr363-summary.json
docs/migration/record-depth-baseline-pr363-delta.json
docs/migration/tier-a-candidate-queue-pr363.json
```

## Handoff

After reviewed completion, the PR #363 candidate queue is the sole selection authority for:

```text
PR #364 Tier A Dossier Deepening Batch 4
```

PR #364 may select no more than five assets and must perform manual source review before any canonical change.
