# PR #362 — 112-asset Record Depth Rebaseline

Status: canonical work-item specification  
Updated: 2026-07-14

## 1. Purpose

PR #362 remeasures the current 112-asset registry after the completed PR #354–#360 sequence.

The immutable PR #353 baseline covers 110 assets and cannot answer whether the completed dossier, growth, Market Access, and Evidence-maintenance work materially improved current planning coverage.

This rebaseline is internal planning infrastructure. It is not a public score, ranking, recommendation, or canonical data change.

## 2. Governing references

```text
AGENTS.md
docs/spec-governance.md
docs/roadmap.md
docs/deployment-policy.md
docs/post-351-data-growth-operating-spec.md
docs/roadmap-amendments/2026-07-14-post-pr360-review-gate.md
docs/migration/post-pr360-review-gate-2026-07-14.json
config/record-depth-rebaseline-pr362.json
docs/migration/record-depth-baseline-pr353-summary.json
docs/migration/tier-a-candidate-queue-pr353.json
docs/migration/current-canonical-checkpoint.json
docs/migration/current-stats-history-checkpoint.json
```

## 3. Required scope

The rebaseline must evaluate all 112 canonical assets across the existing 16 dimensions:

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

## 4. Required outputs

PR #362 must commit:

```text
docs/migration/record-depth-rebaseline-pr362-summary.json
docs/migration/record-depth-rebaseline-pr362-delta.json
docs/migration/tier-a-candidate-queue-pr362.json
```

The summary must include:

- asset, dimension, and cell counts;
- state counts overall and by dimension;
- input identities and deterministic digest;
- reviewed source checkpoint identities;
- current candidate count.

The delta must compare the current rebaseline to PR #353 without rewriting PR #353. It must separate:

- changes caused by the two new assets;
- changes caused by dossier deepening;
- changes caused by Market Access promotion;
- changes caused by Evidence maintenance;
- unchanged dimensions;
- reviewed no-safe-change outcomes.

The candidate queue must be deterministic, internal, and non-ranking.

## 5. Candidate policy

Candidate selection may consider:

```text
material dossier gaps
Compare leverage
Timeline leverage
Market Access potential
regional relevance
historical importance
Evidence maintenance leverage
high or critical known unknowns
```

Selection must not become an asset quality or safety ranking.

Previously reviewed no-safe-change outcomes must remain visible and must not be silently treated as unreviewed gaps.

The old PR #353 queue is historical input, not the current queue authority after PR #362.

## 6. Data boundaries

PR #362 must not:

- add, remove, or edit canonical stable assets;
- edit organizations, relationships, events, Evidence, deployments, legal profiles, or Market Access Records;
- promote monitoring or editorial research automatically;
- rewrite PR #353 baseline or queue files;
- change Comparison Readiness or Facet Freshness semantics;
- change Timeline, Update Feed, or Maintenance Log semantics;
- publish planning rows or add them to the manifest;
- add a public route or product surface;
- create a score, rank, leaderboard, or recommendation.

## 7. Validation

Validation must prove:

- exactly 112 canonical assets were evaluated;
- exactly 16 dimensions were evaluated per asset;
- the cell count is exactly 1,792;
- only approved planning states are used;
- PR #353 files are byte-preserved;
- current canonical and statistics checkpoints are used as inputs;
- outputs are deterministic for identical inputs;
- the candidate queue contains unique canonical asset IDs;
- queue order is asset-slug ascending and not ranking-derived;
- internal outputs do not appear in `dist`, the public manifest, sitemap, `llms.txt`, or `ai.txt`.

## 8. Completion and handoff

PR #362 completes when the reviewed summary, delta, and candidate queue are committed and all repository validation, build, and public-safety checks pass.

The reviewed queue then becomes the binding selection input for:

```text
PR #363 Tier A Dossier Deepening — Batch 4
```
