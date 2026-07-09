# PR #336 Comparison Readiness contract activation

Status: active roadmap amendment  
Updated: 2026-07-09

## Authoritative current workstream

```text
Phase E controlled growth to 110 assets: complete
PR #335 108 -> 110 controlled growth: complete
PR #336 Comparison Readiness contract and audit method: active
PR #337 audit all 110 assets for comparison readiness: next
PR #338 normalize comparison-critical gaps and validators: queued
```

This amendment supersedes stale numeric labels in `docs/roadmap.md` and `docs/comparison-and-change-product-spec.md`. Work order and product scope are unchanged. The current post-110 numbering authority remains the schedule established after PR #331 was consumed by UI remediation.

## PR #336 scope

PR #336 may add only:

- Comparison Readiness canonical implementation specification;
- machine-readable readiness contract;
- contract validator and dedicated read-only workflow;
- roadmap/workstream authority updates.

PR #336 must not:

- audit all 110 assets;
- publish readiness results;
- normalize canonical data;
- change canonical record counts;
- implement comparison projection;
- implement `/compare/`;
- create canonical Market Access Records;
- publish monitoring or candidate material;
- add scores, rankings, recommendations, live prices, market cap, APY, safety scores, or risk scores.

## Binding checkpoint

```text
checkpoint_id: sog_controlled_growth_110_checkpoint_pr335_2026_07_09
asset_count: 110
```

PR #336 must fail if the readiness contract binds a different checkpoint or denominator.

## Contract boundary

The contract must define:

```text
readiness result states
protected unresolved states
applicability modes
severity model
canonical source allowlist
excluded source families
nineteen readiness dimensions
PR #337 audit output requirements
PR #338 normalization boundary
explicit non-goals
```

Readiness is not a numeric score.

The permitted result states are:

```text
ready
ready_with_unknowns
needs_normalization
integrity_blocked
```

Protected unresolved states remain:

```text
null
unknown
not_recorded
not_applicable
source_review_needed
```

## Market-access boundary

Canonical Market Access Records do not exist yet.

Therefore PR #336 must treat market access as:

```text
applicability: future_canonical_schema
readiness_scored: false
output: deferred_canonical_schema only
```

Monitoring observations, monitoring candidates, news discovery, and editorial research matrices remain excluded from canonical comparison readiness.

## Completion condition

PR #336 completes when:

- the reviewed 110-asset checkpoint is bound exactly;
- the machine-readable contract contains exactly nineteen unique dimensions;
- all dimension source families are canonical allowlisted sources;
- excluded candidate, monitoring, news, editorial, and private sources are absent;
- all four readiness states are fixed;
- all five protected unresolved states are fixed;
- market access remains deferred and unscored;
- PR #337 is fixed as the 110-asset audit;
- PR #338 is fixed as normalization;
- a dedicated validator and read-only CI workflow are green;
- general CI and active-workstream validation are green.

## Next item

After PR #336 merges, PR #337 is authorized to audit exactly 110 canonical assets against the fixed readiness contract and produce an internal reviewed per-asset, per-dimension audit with a normalization queue and no composite score.
