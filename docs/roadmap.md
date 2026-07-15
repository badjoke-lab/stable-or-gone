# Stable or Gone Roadmap

Updated: 2026-07-15  
Status: canonical execution schedule — PR #368 active

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

PR #365 Evidence and Archive Maintenance Batch 2: complete
PR #366 Post-PR #365 Review Gate: complete
PR #367 Planning Dimension Semantics Audit: complete
PR #368 Record Depth Baseline v2 Refresh: active; complete on merge
PR #369 Tier A Dossier Deepening Batch 5: next
REVIEW GATE: required after PR #369
```

The public-surface expansion sequence remains complete. The current program is internal planning refresh, reviewed data depth, corrections, evidence maintenance, monitoring review without automatic promotion, and monthly maintenance.

## 2. Current authority

Read in this order:

```text
AGENTS.md
docs/spec-governance.md
docs/roadmap.md
docs/deployment-policy.md
docs/post-351-data-growth-operating-spec.md
docs/roadmap-amendments/2026-07-15-pr366-post-pr365-review-gate.md
docs/migration/post-pr365-review-gate-pr366.json
docs/roadmap-amendments/2026-07-15-pr367-planning-dimension-semantics-audit-activation.md
docs/migration/planning-dimension-semantics-audit-pr367.json
config/planning-dimension-semantics-v2.json
docs/roadmap-amendments/2026-07-15-pr368-record-depth-baseline-v2-refresh-activation.md
docs/quality/record-depth-baseline-v2-refresh-pr368-spec.md
config/record-depth-baseline-v2-refresh-pr368.json
named validators and PR #368 outputs
```

Historical amendments and archived governance files do not override this active position.

## 3. Review-gate decision from PR #366

PR #366 found that the v1 planning baseline should not drive another dossier batch unchanged:

```text
Planning cells: 1,792
absent: 219
not_applicable: 0
canonical_market_access absent: 110
regulatory_notes absent: 107
those two dimensions' share of all absent cells: 99.09%
deployment partial: 92
facet_freshness_support partial: 91
```

PR #367 therefore established explicit planning-quality, applicability, and observation/source-support axes before any new queue could be generated.

## 4. Approved bounded sequence

```text
PR #367  Planning Dimension Semantics Audit — complete
PR #368  Record Depth Baseline v2 Refresh — active
PR #369  Tier A Dossier Deepening Batch 5 — maximum five existing assets
REVIEW GATE
```

No work item may skip its predecessor.

## 5. PR #367 — Planning Dimension Semantics Audit

Status: complete.

Binding outputs:

```text
config/planning-dimension-semantics-v2.json
docs/migration/planning-dimension-semantics-audit-pr367.json
```

The merged contract preserves six planning quality states and adds orthogonal applicability and observation/source-support axes. It classifies 16 dimensions into 11 universal dossier, 3 conditional structural, and 2 scoped observational dimensions. It also separates 11 material-dossier, 2 maintenance-only, 2 scoped-non-dossier, and 1 diagnostic-only queue roles.

## 6. PR #368 — Record Depth Baseline v2 Refresh

Status: active; complete on merge.

PR #368 must recompute exactly:

```text
112 canonical assets
16 planning dimensions
1,792 planning cells
```

Every cell must retain:

```text
planning quality state
applicability state
observation/source-support state
dimension class
queue role
```

Required outputs:

```text
docs/migration/record-depth-baseline-v2-pr368.json
docs/migration/record-depth-baseline-v2-pr368-summary.json
docs/migration/record-depth-baseline-v2-pr368-delta.json
docs/migration/tier-a-candidate-queue-v2-pr368.json
scripts/build-record-depth-baseline-v2-refresh-pr368.mjs
scripts/validate-record-depth-baseline-v2-refresh-pr368.mjs
scripts/check-workstream-125.mjs
.github/workflows/pr368-record-depth-baseline-v2-refresh.yml
```

PR #368 may change internal planning outputs, validators, workflows, and authority pointers. It may not change canonical data or public product surfaces.

## 7. Binding semantic model

The six planning quality states remain:

```text
strong
usable
partial
sparse
absent
not_applicable
```

The v2 baseline retains three axes:

```text
planning quality state
applicability state
observation/source-support state
```

Operational boundaries:

- `strong` and `usable` require applicability and observed support;
- `partial` and `sparse` describe applicable but incomplete or weakly supported representation;
- `absent` is permitted only when the dimension is applicable and no canonical representation exists;
- `absent` never asserts real-world nonexistence;
- `not_applicable` means outside the current reviewed planning scope and never counts as a gap;
- `unobserved` means a supported result has not been established;
- `source_unavailable` means adequate source support was unavailable;
- unobserved or source-unavailable states do not authorize fabrication or negative factual claims.

Scoped and queue boundaries:

- Regulatory Notes and Market Access are scoped observational dimensions;
- Deployment and Facet Freshness are maintenance-only queue signals;
- Comparison Readiness is diagnostic and non-ranking;
- only `partial`, `sparse`, and `absent` cells in `material_dossier` dimensions may directly contribute a material dossier gap.

## 8. PR #369 — Tier A Dossier Deepening Batch 5

PR #369 may begin only from the merged PR #368 non-ranking queue.

It may manually select no more than five existing assets and improve only source-supported material dossier gaps. It may not add an asset, Market Access record, deployment family, public surface, ranking, score, or automatic promotion path.

## 9. Not approved in the current sequence

```text
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

## 10. Historical checkpoint preservation

The following remain immutable historical checkpoints:

```text
config/record-depth-baseline-v1.json
docs/migration/record-depth-baseline-pr353-summary.json
docs/migration/tier-a-candidate-queue-pr353.json
docs/migration/record-depth-baseline-pr363-summary.json
docs/migration/record-depth-baseline-pr363-delta.json
docs/migration/tier-a-candidate-queue-pr363.json
docs/migration/planning-dimension-semantics-audit-pr367.json
config/planning-dimension-semantics-v2.json
docs/archive/AGENTS-through-pr366.md
docs/archive/roadmap-through-pr366.md
```

Later planning or dossier changes must not rewrite these files.

## 11. Parallel operating lanes

### Data depth and growth

Deepen existing records and add new canonical assets only through reviewed evidence-backed PRs explicitly authorized by a review gate.

### Market Access

Promote only bounded evidence-backed access claims through manual review.

### Monitoring

Monitoring remains private, review-only, and read-only with respect to canonical data.

### Corrections and evidence maintenance

Broken links, archives, evidence relations, source identities, dates, relationships, wording, and known unknowns remain maintenance work, but Batch 3 is not approved in this sequence.

### Monthly maintenance

The current month may remain `in_progress` until month-end review. Closed months are immutable and history grows append-only.

## 12. Product-surface policy

The existing public product set is sufficient for the current operating phase:

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

PR #368 is internal planning work. Its outputs must not be copied into `public/`, exposed as a product surface, or presented as a risk, safety, quality, transparency, or investment ranking.

## 13. Core data rules

- Unknown values remain unknown unless reviewed evidence supports a value.
- Do not coerce partial dates into day-level dates.
- Preserve evidence relations, known unknowns, deployments, source identities, and value states.
- Candidate, monitoring, editorial-research, discovery, and private material remain outside canonical public release claims.
- Monitoring observations are not canonical Market Access Records.
- A platform licence is not proof of asset/function availability.
- Comparison Readiness remains separate from value truth and facet freshness.
- Record Depth planning states remain internal planning coverage states and do not replace canonical facts, Readiness, or Freshness.
- SOG does not create composite asset risk scores or rankings.

Protected unresolved states include:

```text
null
unknown
not_recorded
not_applicable
source_review_needed
unclear
```

## 14. Mandatory pre-implementation check

Before every non-trivial PR:

1. read the repository authority chain;
2. confirm the active roadmap item;
3. read the work-item specification;
4. read named inputs and prior outputs;
5. state scope and non-goals;
6. state data-preservation checks;
7. state validation plan;
8. confirm deployment classification.

A PR that cannot cite an approved roadmap item and governing specification must pause until repository authority is corrected.

## 15. Next gate

After PR #369, stop and review data-depth yield, source availability, archive maintenance burden, Market Access evidence breadth, monitoring usefulness, monthly maintenance burden, and verified external usage evidence before authorizing another numbered sequence.
