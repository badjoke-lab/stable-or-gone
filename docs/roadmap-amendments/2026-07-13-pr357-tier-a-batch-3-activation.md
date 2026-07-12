# PR #357 Tier A Dossier Deepening — Batch 3 Activation

Status: active roadmap amendment  
Date: 2026-07-13

## 1. Activation

PR #356 Market Access Pilot 1 is complete and merged at:

```text
ff48267a54333bd05c2fae1606c7744c3d5e200d
```

Its reviewed handoff is:

```text
docs/migration/market-access-pilot-1-pr356-reviewed-handoff.json
```

The active work item is now:

```text
PR #357 Tier A Dossier Deepening — Batch 3: active
PR #358 Record Growth Batch 1: next
```

## 2. Governing references

```text
AGENTS.md
docs/spec-governance.md
docs/roadmap.md
docs/post-351-data-growth-operating-spec.md
docs/roadmap-amendments/2026-07-13-pr357-tier-a-batch-3-activation.md
docs/quality/tier-a-dossier-batch-3-pr357-spec.md
config/tier-a-dossier-batch-3-pr357.json
docs/migration/record-depth-baseline-pr353-summary.json
docs/migration/tier-a-candidate-queue-pr353.json
docs/migration/tier-a-batch-1-pr354-reviewed-handoff.json
docs/migration/tier-a-batch-2-pr355-reviewed-handoff.json
docs/migration/market-access-pilot-1-pr356-reviewed-handoff.json
```

## 3. Deterministic selected batch

After excluding completed Batch 1 and Batch 2 assets from the non-ranking PR #353 queue, the first five remaining `asset_slug` values are:

```text
audd
fei
husd
mim
nzds
```

This order is deterministic queue consumption and is not a ranking.

## 4. Authorized targets

```text
AUDD: events, lifecycle, organization_relationships, redemption
FEI: legal_profile
HUSD: legal_profile, redemption
MIM: legal_profile
NZDS: events, lifecycle, organization_relationships, redemption
```

## 5. Boundaries

PR #357 must not:

```text
add canonical stable assets
add or change Market Access Records
change the four-record PR #356 Market Access boundary
add a new public product surface
change Compare preset membership
change Comparison Readiness semantics
change Facet Freshness semantics
rank assets
create a composite score
automatically promote monitoring or editorial research
rewrite historical checkpoints
```

## 6. Implementation sequence

```text
1. bind the PR #356 reviewed handoff
2. validate deterministic five-asset selection
3. audit current dossier state for each selected asset
4. review primary and archived sources
5. commit only evidence-supported canonical improvements
6. build a deterministic post-change impact report
7. synchronize canonical counts, statistics, and public projections
8. validate and merge
```

## 7. Completion and handoff

Completion requires green dedicated validation and general CI, plus a reviewed PR #357 handoff.

After PR #357 merges:

```text
PR #358 Record Growth Batch 1: active
PR #359 Market Access Pilot 2: next
```
