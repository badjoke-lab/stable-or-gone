# Stable or Gone Roadmap

Updated: 2026-07-15  
Status: canonical execution schedule — PR #367 active

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
PR #367 Planning Dimension Semantics Audit: active; complete on merge
PR #368 Record Depth Baseline v2 Refresh: next
PR #369 Tier A Dossier Deepening Batch 5: after PR #368
REVIEW GATE: required after PR #369
```

The public-surface expansion sequence remains complete. The current program is internal planning semantics, reviewed data depth, corrections, evidence maintenance, monitoring review without automatic promotion, and monthly maintenance.

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
docs/quality/planning-dimension-semantics-audit-pr367-spec.md
config/planning-dimension-semantics-pr367.json
config/planning-dimension-semantics-v2.json
named validators and PR #367 outputs
```

Historical amendments and archived governance files do not override this active position.

## 3. Review-gate decision from PR #366

PR #366 found that the existing v1 planning baseline should not drive another dossier batch unchanged:

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

Recent bounded work remained valid but had limited yield:

```text
PR #364: 2 changed / 5 reviewed assets
PR #365: 3 changed / 10 reviewed Evidence records
```

The approved response is to improve planning semantics before recomputing the queue.

## 4. Approved bounded sequence

```text
PR #367  Planning Dimension Semantics Audit
PR #368  Record Depth Baseline v2 Refresh
PR #369  Tier A Dossier Deepening Batch 5 — maximum five existing assets
REVIEW GATE
```

No work item may skip its predecessor.

## 5. PR #367 — Planning Dimension Semantics Audit

Status: active; complete on merge.

PR #367 must:

- review all 16 planning dimensions;
- preserve the six planning quality states;
- define applicability separately from planning quality;
- define observation and source-support state separately from planning quality;
- distinguish applicable absence from out-of-scope, unobserved, and source-unavailable cases;
- classify each dimension as universal, conditional structural, or scoped observational;
- define which dimensions may trigger the default dossier queue;
- preserve all v1 planning files as immutable history;
- activate the PR #367–#369 sequence in `AGENTS.md` and this roadmap.

Required outputs:

```text
config/planning-dimension-semantics-pr367.json
config/planning-dimension-semantics-v2.json
docs/migration/planning-dimension-semantics-audit-pr367.json
docs/quality/planning-dimension-semantics-audit-pr367-spec.md
docs/roadmap-amendments/2026-07-15-pr367-planning-dimension-semantics-audit-activation.md
scripts/build-planning-dimension-semantics-audit-pr367.mjs
scripts/validate-planning-dimension-semantics-audit-pr367.mjs
scripts/check-workstream-124.mjs
.github/workflows/pr367-planning-dimension-semantics-audit.yml
```

PR #367 may revise internal planning contracts, validators, workflows, and governance pointers. It may not change canonical records, recompute the 112-asset baseline, or create a public surface.

## 6. Binding semantic model for PR #368

The six planning quality states remain:

```text
strong
usable
partial
sparse
absent
not_applicable
```

They are not enough by themselves. PR #368 must derive and retain three distinct axes:

```text
planning quality state
applicability state
observation/source-support state
```

Operational boundaries:

- `strong` and `usable` require an applicable dimension with observed support;
- `partial` and `sparse` describe applicable but incomplete or weakly supported representation;
- `absent` is permitted only when the dimension is applicable and no canonical representation exists;
- `absent` never asserts real-world nonexistence;
- `not_applicable` means not applicable to the current reviewed planning scope and never counts as a gap;
- `unobserved` means the scoped review has not established a supported result;
- `source_unavailable` means a scoped review was attempted but adequate source support was unavailable;
- unobserved or source-unavailable state does not authorize fabrication or a negative factual claim.

Dimension classes approved by PR #367:

```text
universal dossier dimensions: 11
conditional structural dimensions: 3
scoped observational dimensions: 2
```

The detailed dimension-by-dimension rules live in `config/planning-dimension-semantics-v2.json`.

## 7. PR #368 — Record Depth Baseline v2 Refresh

PR #368 may begin only after PR #367 merges.

It must:

- recompute exactly 112 canonical assets across exactly 16 dimensions;
- use the merged v2 semantics contract;
- preserve PR #353 and PR #363 baselines and queues unchanged;
- emit a new non-ranking v2 baseline, delta, and candidate queue;
- retain applicability and observation state in every planning cell;
- exclude `not_applicable` from unresolved-gap counts and queue triggers;
- prevent unobserved or source-unavailable scoped dimensions from becoming negative claims;
- change no canonical data and no public surface.

## 8. PR #369 — Tier A Dossier Deepening Batch 5

PR #369 may begin only from the merged PR #368 queue.

It may select no more than five existing assets and improve only source-supported material dossier gaps. It may not add an asset, Market Access record, deployment family, public surface, ranking, score, or automatic promotion path.

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
docs/migration/tier-a-batch-4-pr364-reviewed-handoff.json
docs/migration/evidence-archive-maintenance-batch-2-pr365-reviewed-handoff.json
docs/archive/AGENTS-through-pr366.md
docs/archive/roadmap-through-pr366.md
```

Later semantics or baseline changes must not rewrite these files.

## 11. Public and deployment boundary

PR #367 and PR #368 are internal planning work. Their contracts and reports must not be copied into `public/`, exposed as product surfaces, or presented as risk, safety, quality, transparency, or investment rankings.

Normal merged changes publish from `main` under `docs/deployment-policy.md`. The canonical public layer remains unchanged throughout PR #367 and PR #368.

## 12. Next gate

After PR #369, stop and review data-depth yield, source availability, archive maintenance burden, Market Access evidence breadth, monitoring usefulness, monthly maintenance burden, and verified external usage evidence before authorizing another numbered sequence.
