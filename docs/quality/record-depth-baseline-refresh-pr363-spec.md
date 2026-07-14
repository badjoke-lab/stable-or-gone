# PR #363 — Record Depth and Coverage Baseline Refresh

Status: canonical work-item specification  
Updated: 2026-07-14

## 1. Purpose

PR #363 creates a new internal Record Depth planning checkpoint for all 112 canonical stable assets after the completed PR #354–#360 sequence.

The immutable PR #353 baseline covers 110 assets. It remains historical evidence and must not be rewritten.

This refresh measures planning coverage only. It is not a risk score, safety score, asset rank, value judgment, investment recommendation, or public product surface.

## 2. Governing references

```text
AGENTS.md
docs/spec-governance.md
docs/roadmap.md
docs/deployment-policy.md
docs/post-351-data-growth-operating-spec.md
docs/quality/post-pr360-review-gate-pr361-spec.md
docs/migration/post-pr360-review-gate-pr361.json
config/record-depth-baseline-refresh-pr363.json
docs/migration/record-depth-baseline-pr353-summary.json
docs/migration/tier-a-candidate-queue-pr353.json
docs/migration/record-growth-batch-1-pr358-reviewed-handoff.json
docs/migration/current-canonical-checkpoint.json
```

## 3. Required evaluation

Exactly 112 canonical assets must be evaluated across the existing 16 dimensions:

```text
identity
lifecycle
organization_relationships
mechanism_classification
reserve_structure
redemption
issuance
deployment
legal_profile
regulatory_notes
events
evidence_depth
known_unknowns
comparison_readiness
facet_freshness_support
canonical_market_access
```

Allowed planning states remain:

```text
strong
usable
partial
sparse
absent
not_applicable
```

The resulting matrix must contain exactly 1,792 cells.

## 4. Required outputs

```text
docs/migration/record-depth-baseline-pr363-summary.json
docs/migration/record-depth-baseline-pr363-delta.json
docs/migration/tier-a-candidate-queue-pr363.json
```

The summary must bind the current canonical checkpoint, statistics checkpoint, source contracts, input digest, state counts, dimension counts, and current candidate count.

The delta must compare PR #363 with immutable PR #353 and record:

- asset count change from 110 to 112;
- the two PR #358 additions, XUSD and USDB;
- overall planning-state deltas;
- per-dimension deltas;
- candidate count change from 18 to 10;
- continuing, exited, and newly entered candidate identities;
- the current contribution of the two new assets without claiming causality for unrelated dossier changes.

The queue must contain the complete current deterministic candidate set. It must be ordered by `asset_slug` ascending and explicitly marked non-ranking.

## 5. Candidate policy

The current candidate queue may consider material dossier gaps, historical importance, regional relevance, Compare leverage, Timeline leverage, Evidence maintenance leverage, and comparison preset membership.

Candidate inclusion authorizes review only. It does not authorize canonical promotion.

PR #364 may select at most five assets from this queue after manual source review. Selection must explain the chosen material gaps and product leverage without presenting a rank or score.

## 6. Data and product boundaries

PR #363 must not:

- add, remove, or edit canonical stable assets;
- edit organizations, relationships, events, Evidence, deployments, profiles, regulatory notes, or Market Access Records;
- rewrite PR #353 summary or queue files;
- change Comparison Readiness or Facet Freshness semantics;
- promote monitoring or editorial research automatically;
- publish planning outputs in the manifest, sitemap, `llms.txt`, `ai.txt`, or built site;
- create a new route, dashboard, explorer, ranking surface, score, or recommendation.

## 7. Validation

Validation must prove:

- exactly 112 canonical assets and 16 dimensions;
- exactly 1,792 planning cells;
- only approved planning states;
- deterministic byte-for-byte regeneration of all three outputs;
- the current input digest differs from PR #353 while PR #353 files are unchanged;
- the current candidate count is exactly 10;
- candidate IDs are unique canonical asset IDs;
- candidate order is `asset_slug` ascending;
- PR #358 promoted asset IDs are exactly XUSD and USDB;
- no changes under `data/` or `src/`;
- no internal planning output leaks into the public build.

## 8. Completion and handoff

PR #363 completes when all three reviewed outputs are committed and repository validation, build, statistics, immutable-history, and public-safety checks pass.

Its reviewed queue becomes the sole candidate authority for:

```text
PR #364 Tier A Dossier Deepening Batch 4
```
