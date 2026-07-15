# Roadmap Amendment — PR #368 Record Depth Baseline v2 Refresh

Date: 2026-07-15  
Status: active; complete on merge

## Authority source

Merged PR #367 established the binding internal planning contract:

```text
config/planning-dimension-semantics-v2.json
contract_id: sog_planning_dimension_semantics_v2_pr367
```

The approved bounded sequence remains:

```text
PR #367  Planning Dimension Semantics Audit — complete
PR #368  Record Depth Baseline v2 Refresh — active
PR #369  Tier A Dossier Deepening Batch 5 — maximum five existing assets
REVIEW GATE
```

## Exact scope

PR #368 recomputes exactly:

```text
112 canonical assets
16 planning dimensions
1,792 planning cells
```

Every cell records planning quality, applicability, observation/source-support, dimension class, and queue role.

## Binding source files

```text
docs/migration/planning-dimension-semantics-audit-pr367.json
config/planning-dimension-semantics-v2.json
config/record-depth-baseline-v2-refresh-pr368.json
scripts/growth/build-reviewed-record-depth-baseline-pr353.mjs
docs/migration/record-depth-baseline-pr363-summary.json
```

## Required outputs

```text
docs/migration/record-depth-baseline-v2-pr368.json
docs/migration/record-depth-baseline-v2-pr368-summary.json
docs/migration/record-depth-baseline-v2-pr368-delta.json
docs/migration/tier-a-candidate-queue-v2-pr368.json
```

## Semantic boundaries

- `not_applicable` is outside the current reviewed planning scope and is not a gap.
- `absent` requires applicability and does not assert real-world nonexistence.
- `unobserved` and `source_unavailable` are knowledge states, not negative claims.
- Regulatory Notes and Market Access remain scoped observational dimensions.
- Deployment and Facet Freshness remain maintenance-only queue signals.
- Comparison Readiness remains diagnostic and non-ranking.
- Only material-dossier gaps may directly contribute to the default dossier queue.

## Preservation

PR #368 changes no canonical data and no public product surface. PR #353 and PR #363 planning files remain immutable historical checkpoints. The merged PR #367 contract and audit remain unchanged.

## Next authority

After PR #368 merges:

```text
PR #369 Tier A Dossier Deepening Batch 5
```

PR #369 may manually select no more than five existing assets from the v2 non-ranking queue and improve only source-supported material dossier gaps.

## Not approved

```text
canonical data change inside PR #368
new stable asset
new deployment family
Market Access change
Evidence and Archive Maintenance Batch 3
Market Access Pilot 3
Record Growth Batch 2
new public page or explorer
ranking or composite score
automatic monitoring promotion
automatic canonical promotion
```
