# Stable or Gone Roadmap

Updated: 2026-07-15  
Status: canonical execution schedule — PR #370 review gate active

The full roadmap that governed the repository through merged PR #366 is preserved byte-for-byte at:

```text
docs/archive/roadmap-through-pr366.md
```

That archive is historical evidence. This file is the current execution schedule.

## 1. Current position

```text
Canonical stable assets: 112
Organizations: 107
Relationships: 124
Events: 187
Evidence: 559
Evidence Relations: 559
Deployments: 174
Market Access Records: 8
Archive recorded: 390
Archive not recorded: 169

PR #367 Planning Dimension Semantics Audit: complete
PR #368 Record Depth Baseline v2 Refresh: complete
PR #369 Tier A Dossier Deepening Batch 5: complete
PR #370 Post-PR #369 Review Gate: active; complete on merge
Current authority: REVIEW GATE
```

The public-surface expansion sequence remains complete. PR #370 is an internal authority decision only.

## 2. Current authority

Read in this order:

```text
AGENTS.md
docs/spec-governance.md
docs/roadmap.md
docs/deployment-policy.md
docs/post-351-data-growth-operating-spec.md
docs/roadmap-amendments/2026-07-15-pr366-post-pr365-review-gate.md
docs/roadmap-amendments/2026-07-15-pr367-planning-dimension-semantics-audit-activation.md
docs/roadmap-amendments/2026-07-15-pr368-record-depth-baseline-v2-refresh-activation.md
docs/roadmap-amendments/2026-07-15-pr369-tier-a-dossier-batch-5-activation.md
docs/roadmap-amendments/2026-07-15-pr370-post-pr369-review-gate.md
docs/quality/post-pr369-review-gate-pr370-spec.md
config/post-pr369-review-gate-pr370.json
docs/migration/post-pr369-review-gate-pr370.json
```

## 3. Completed sequence

```text
PR #367  Planning Dimension Semantics Audit — complete
PR #368  Record Depth Baseline v2 Refresh — complete
PR #369  Tier A Dossier Deepening Batch 5 — complete
REVIEW GATE — current
```

## 4. PR #367 result

PR #367 established explicit planning quality, applicability, and observation/source-support semantics across 16 dimensions.

```text
universal dossier dimensions: 11
conditional structural dimensions: 3
scoped observational dimensions: 2
material dossier queue roles: 11
maintenance-only roles: 2
scoped non-dossier roles: 2
diagnostic-only roles: 1
```

## 5. PR #368 result

PR #368 recomputed:

```text
112 assets
16 dimensions
1,792 cells
```

Planning counts:

```text
strong: 604
usable: 718
partial: 250
sparse: 0
absent: 2
not_applicable: 218
```

The internal non-ranking queue contained six candidates:

```text
AUDD
BUSD
NZDS
poundtoken / 1GBP
RLUSD
USDP
```

## 6. PR #369 result

PR #369 reviewed five candidates:

```text
AUDD
BUSD
NZDS
poundtoken / 1GBP
USDP
```

Result:

```text
selected assets: 5
canonical improvement assets: 0
reviewed no-safe-change assets: 3
prior-completed duplicate changes rejected: 2
```

RLUSD was not selected because it already had PR #354 legal/redemption improvements, a PR #364 no-safe-change re-review, and PR #359 Market Access work.

Every PR #368 queue candidate had prior reviewed improvement or no-safe-change history before PR #369.

## 7. Review-gate finding

The queue recurrence is explained by the planning input path:

```text
scripts/growth/build-reviewed-record-depth-baseline-pr353.mjs
  default profileOverrideFiles = []

scripts/build-record-depth-baseline-v2-refresh-pr368.mjs
  invokes buildReviewedRecordDepthBaseline() without options
```

The next problem is not another dossier batch. The repository must first prove that the planning builder consumes every current reviewed profile overlay exactly once.

## 8. Approved next sequence

PR #370 approves but does not activate:

```text
PR #371  Planning Input Coverage Audit
PR #372  Record Depth Baseline v2.1 Refresh
REVIEW GATE
```

PR #371 must update `AGENTS.md` and `docs/roadmap.md` before changing planning input contracts.

### PR #371

Required scope:

```text
inventory canonical and reviewed profile overlays
map every public loader and planning-builder consumer
define one deterministic planning input manifest
detect omitted input paths
detect duplicate application
preserve canonical data
preserve public output
```

### PR #372

Required scope:

```text
begin only after PR #371 merges
consume the approved complete planning input manifest
recompute 112 assets × 16 dimensions
preserve PR #353, #363, and #368 checkpoints
emit a corrected internal non-ranking queue
preserve canonical data
preserve public output
stop at another review gate
```

## 9. Not approved

```text
Tier A Dossier Deepening Batch 6
Evidence and Archive Maintenance Batch 3
Market Access Pilot 3
Record Growth Batch 2
new canonical asset
new deployment family
new public page or explorer
asset ranking or composite score
automatic monitoring promotion
automatic canonical promotion
```

## 10. Data and public boundaries

PR #370 changes no:

```text
canonical data
Evidence identities or relations
Market Access records
deployments
statistics history
src product surface
public output
```

Its outputs remain internal planning and governance records.

## 11. Historical preservation

Do not rewrite:

```text
PR #353 and #363 planning checkpoints
PR #367 semantics contract and audit
PR #368 baseline, summary, delta, or queue
PR #369 outcomes and handoff
prior reviewed dossier handoffs
canonical release-integrity checkpoints
closed statistics or Maintenance Log history
```

## 12. Product-surface policy

The existing public product set remains sufficient:

```text
Registry records
Stats
Compare
Access & Regulation Explorer
Change Timeline
Update Feed
Maintenance Log
machine-readable projections
```

No new public surface is approved.

## 13. Next gate

After PR #372, stop and review the corrected queue, planning input manifest coverage, source availability, archive maintenance burden, Market Access evidence breadth, monitoring usefulness, monthly maintenance burden, and verified external usage evidence before authorizing any dossier or growth work.
