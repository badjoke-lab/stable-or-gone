# Roadmap Amendment — PR #367 Planning Dimension Semantics Audit

Date: 2026-07-15  
Status: active; complete on merge

## Authority source

PR #366 completed the post-PR #365 review gate and approved:

```text
PR #367  Planning Dimension Semantics Audit
PR #368  Record Depth Baseline v2 Refresh
PR #369  Tier A Dossier Deepening Batch 5 — maximum five existing assets
REVIEW GATE
```

Binding source:

```text
docs/roadmap-amendments/2026-07-15-pr366-post-pr365-review-gate.md
docs/migration/post-pr365-review-gate-pr366.json
```

## Activation

PR #367 updates `AGENTS.md` and `docs/roadmap.md` before introducing the v2 planning contract.

The prior full governance files are preserved exactly at:

```text
docs/archive/AGENTS-through-pr366.md
docs/archive/roadmap-through-pr366.md
```

## Exact scope

PR #367 reviews all 16 existing planning dimensions. It preserves the six planning quality states and adds explicit applicability and observation/source-support axes.

The audit must distinguish:

```text
applicable supported representation
applicable limited representation
applicable absence
not applicable to current reviewed scope
unobserved state
source-unavailable state
```

No category may be converted into a negative real-world claim.

## Approved contract

The binding v2 contract is:

```text
config/planning-dimension-semantics-v2.json
contract_id: sog_planning_dimension_semantics_v2_pr367
```

Dimension classes:

```text
universal_dossier: 11
conditional_structural: 3
scoped_observational: 2
```

Default queue roles:

```text
material_dossier: 11
maintenance_only: 2
scoped_non_dossier: 2
diagnostic_only: 1
```

## Binding decisions

- Historical v1 baselines, queues, builders, and input digests remain unchanged.
- `not_applicable` is not a gap.
- `absent` requires applicability and does not assert real-world nonexistence.
- `unobserved` and `source_unavailable` remain separate knowledge states.
- Regulatory notes and canonical Market Access are scoped observational dimensions.
- Reserve structure, redemption, and facet freshness are conditional structural dimensions.
- Explicit source-supported redemption `not_applicable` must be honored.
- Deployment and facet freshness are maintenance-only for the default dossier queue.
- Comparison Readiness is diagnostic and non-ranking.
- PR #367 does not recompute the 112-asset baseline.

## Required output

```text
docs/migration/planning-dimension-semantics-audit-pr367.json
```

The output is deterministic, internal, and non-public.

## Next authority

After PR #367 merges:

```text
PR #368 Record Depth Baseline v2 Refresh
```

PR #368 must recompute exactly 112 assets × 16 dimensions using the merged contract, preserve all v1 snapshots, retain all three semantic axes, and emit a non-ranking baseline and queue.

## Not approved

```text
canonical data change
baseline recomputation inside PR #367
Evidence and Archive Maintenance Batch 3
Market Access Pilot 3
Record Growth Batch 2
new asset or deployment family
new public page or explorer
ranking or composite score
automatic monitoring promotion
automatic canonical promotion
```
