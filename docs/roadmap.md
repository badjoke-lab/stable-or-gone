# Stable or Gone Roadmap

Updated: 2026-07-15  
Status: canonical execution schedule — PR #369 active

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
PR #368 Record Depth Baseline v2 Refresh: complete
PR #369 Tier A Dossier Deepening Batch 5: active; complete on merge
REVIEW GATE: next and mandatory
```

The public-surface expansion sequence remains complete. The current work is the final bounded manual dossier review before another authority decision.

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
docs/quality/tier-a-dossier-batch-5-pr369-spec.md
config/tier-a-dossier-batch-5-pr369.json
docs/migration/tier-a-candidate-queue-v2-pr368.json
prior reviewed handoffs
```

## 3. Approved bounded sequence

```text
PR #367  Planning Dimension Semantics Audit — complete
PR #368  Record Depth Baseline v2 Refresh — complete
PR #369  Tier A Dossier Deepening Batch 5 — active
REVIEW GATE
```

No work item may skip its predecessor. No PR after #369 is pre-authorized.

## 4. PR #367 result

PR #367 established the internal three-axis planning model:

```text
planning quality
applicability
observation/source support
```

Dimension classes:

```text
universal_dossier: 11
conditional_structural: 3
scoped_observational: 2
```

Queue roles:

```text
material_dossier: 11
maintenance_only: 2
scoped_non_dossier: 2
diagnostic_only: 1
```

## 5. PR #368 result

PR #368 recomputed:

```text
112 assets
16 dimensions
1,792 cells
```

Reviewed planning counts:

```text
strong: 604
usable: 718
partial: 250
sparse: 0
absent: 2
not_applicable: 218
```

The non-ranking queue contains six candidates:

```text
AUDD
BUSD
NZDS
poundtoken / 1GBP
RLUSD
USDP
```

The queue is planning infrastructure. It does not override prior reviewed handoffs or authorize automatic canonical changes.

## 6. PR #369 — Tier A Dossier Deepening Batch 5

Status: active; complete on merge.

Selected review set:

```text
AUDD
BUSD
NZDS
poundtoken / 1GBP
USDP
```

RLUSD is not selected because it was improved in PR #354, reviewed again with no safe canonical change in PR #364, and received bounded Market Access records in PR #359.

Configured reviewed outcomes:

```text
AUDD       reviewed_no_safe_change — PR #357 boundary retained
BUSD       prior_completed_no_duplicate_change — PR #354 retained
NZDS       reviewed_no_safe_change — PR #357 boundary retained
poundtoken reviewed_no_safe_change — PR #364 boundary retained
USDP       prior_completed_no_duplicate_change — PR #355 retained
```

Expected result:

```text
selected assets: 5
canonical improvement assets: 0
reviewed no-safe-change assets: 3
prior-completed duplicate changes rejected: 2
canonical counts unchanged: true
public surface unchanged: true
```

A zero-change result is valid. The repository must not force unsupported or duplicate canonical edits to manufacture batch yield.

Required outputs:

```text
docs/migration/tier-a-batch-5-pr369-review-outcomes.json
docs/migration/tier-a-batch-5-pr369-reviewed-handoff.json
scripts/build-tier-a-dossier-batch-5-pr369.mjs
scripts/validate-tier-a-dossier-batch-5-pr369.mjs
scripts/check-workstream-126.mjs
.github/workflows/pr369-tier-a-dossier-batch-5.yml
```

## 7. Data and public boundaries

The configured PR #369 outcome changes no:

```text
canonical data
Evidence identities or relations
Market Access records
deployments
statistics history
src product surface
public output
```

If new reviewed source support is introduced before merge, the scope, config, outputs, canonical validators, and PR body must all be updated together. Otherwise `data/`, `src/`, and `public/` remain unchanged.

## 8. Not approved

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

## 9. Parallel operating lanes

### Data depth and growth

Paused after PR #369 until the review gate authorizes another bounded sequence.

### Market Access

No Pilot 3 is approved. Existing eight records remain canonical and evidence-scoped.

### Monitoring

Monitoring remains private, review-only, and read-only with respect to canonical data.

### Corrections and evidence maintenance

Small correctness and safety fixes remain allowed, but Evidence and Archive Maintenance Batch 3 is not authorized as a numbered work item.

### Monthly maintenance

The current month may remain `in_progress` until month-end review. Closed months remain immutable.

## 10. Product-surface policy

The existing public product set is sufficient for the current phase:

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

PR #369 adds no public surface.

## 11. Core data rules

- Unknown values remain unknown unless reviewed evidence supports a value.
- Do not coerce partial dates into day-level dates.
- Preserve evidence relations, known unknowns, deployments, source identities, and value states.
- Candidate, monitoring, editorial-research, discovery, and private material remain outside canonical public claims.
- A planning gap is not a negative real-world claim.
- Prior reviewed handoffs remain authoritative for completed or no-safe-change outcomes.
- SOG does not create composite asset risk scores or rankings.

## 12. Next gate

After PR #369 merges, stop at `REVIEW GATE`.

The review must evaluate:

```text
zero-change PR #369 yield
repeated prior-review candidates in the PR #368 queue
planning-builder and profile-overlay coverage
source availability
archive maintenance burden
Market Access evidence breadth
monitoring usefulness
monthly maintenance burden
verified external usage evidence
```

A new numbered sequence requires a reviewed roadmap amendment.
