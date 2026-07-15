# Roadmap Amendment — PR #370 Post-PR #369 Review Gate

Date: 2026-07-15  
Status: reviewed authority decision on merge

## Completed sequence

```text
PR #367  Planning Dimension Semantics Audit — complete
PR #368  Record Depth Baseline v2 Refresh — complete
PR #369  Tier A Dossier Deepening Batch 5 — complete
```

## Current checkpoint

```text
Assets:               112
Organizations:        107
Relationships:        124
Events:               187
Evidence:             559
Evidence Relations:   559
Deployments:          174
Market Access:          8
Archive recorded:     390
Archive not recorded: 169
```

## Review finding

PR #367 corrected planning semantics. PR #368 then produced a six-asset non-ranking queue. Every one of those six assets had already been reviewed in PR #354, #355, #357, or #364. PR #369 therefore produced zero safe canonical changes.

The repository code explains the recurrence:

```text
scripts/growth/build-reviewed-record-depth-baseline-pr353.mjs
  default profileOverrideFiles = []

scripts/build-record-depth-baseline-v2-refresh-pr368.mjs
  calls buildReviewedRecordDepthBaseline() without options
```

The next problem is not another dossier batch. It is complete planning-input coverage.

## Approved bounded sequence

```text
PR #371  Planning Input Coverage Audit
PR #372  Record Depth Baseline v2.1 Refresh
REVIEW GATE
```

### PR #371

Inventory every current canonical and reviewed profile overlay, map loader consumption, define one deterministic planning input manifest, and detect omitted or duplicate inputs. No canonical or public changes.

### PR #372

Recompute 112 assets × 16 dimensions from the approved complete planning input manifest, preserve all earlier planning checkpoints, and emit a corrected non-ranking queue. No canonical or public changes.

## Not approved

```text
Tier A Dossier Deepening Batch 6
Evidence and Archive Maintenance Batch 3
Market Access Pilot 3
Record Growth Batch 2
new canonical asset
new deployment family
new public page or explorer
ranking or composite score
automatic monitoring promotion
automatic canonical promotion
```

## Activation rule

PR #371 must update `AGENTS.md` and `docs/roadmap.md` to activate the sequence. PR #370 records authority but does not itself alter planning input contracts.
