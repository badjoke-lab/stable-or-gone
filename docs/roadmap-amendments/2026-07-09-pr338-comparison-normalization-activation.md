# PR #338 Comparison Readiness normalization activation

Status: active roadmap amendment  
Updated: 2026-07-10

## Authoritative current workstream

```text
Phase E controlled growth to 110 assets: complete
PR #336 Comparison Readiness contract and audit method: complete
PR #337 audit all 110 assets for comparison readiness: complete
PR #338 normalize comparison-critical gaps and validators: active
PR #339 Japan stablecoin access guide and reviewed research checkpoint: inserted and merged separately
PR #340 site-wide text hierarchy and readability remediation: inserted and merged separately
PR #341 define canonical Market Access Record schema and governance: next
```

## Binding source queue

```text
data/quality/comparison-readiness-normalization-queue-pr337.json
queue_count: 20
dimension: asset_class
reason: missing_asset_class
```

PR #338 may modify only the twenty canonical classification targets in that reviewed queue for the purpose of adding the missing `asset_class` field.

## Canonical normalization

The twenty target rows are normalized to:

```text
asset_class: stablecoin
```

No lifecycle, issuance, reference target, backing, stabilization, governance, legal, reserve, redemption, deployment, event, evidence, or known-unknown field is authorized to change in PR #338.

## Statistics-history forward checkpoint

The canonical asset denominator remains 110, but the normalization changes the deterministic statistics model. PR #338 therefore must not rewrite the immutable PR #335 110-asset snapshot.

Instead, PR #338 activates the reviewed forward extension specified in:

```text
docs/stats-history-forward-checkpoint-extension-pr338.md
```

and appends:

```text
checkpoint_id: sog_comparison_readiness_normalization_110_checkpoint_pr338_2026_07_10
checkpoint_kind: non_growth_normalization_checkpoint
asset_count: 110
source_checkpoint_id: sog_controlled_growth_110_checkpoint_pr335_2026_07_09
```

All six existing history snapshots remain an exact prefix.

## Required re-audit result

The same PR #336 contract and PR #337 deterministic builder must produce:

```text
assets: 110
dimensions: 19
comparison cells: 2090

ready: 0
ready_with_unknowns: 110
needs_normalization: 0
integrity_blocked: 0

normalization queue: 0
blocked dimensions: 0
needs-normalization dimensions: 0
```

This does not assert that all factual unknowns are resolved. Explicit unknowns remain protected and renderable.

## Market-access boundary

Market access remains outside canonical comparison readiness until PR #341 defines its schema and governance.

The separately merged PR #339 Japan stablecoin access guide and research checkpoint does not change this boundary. Its jurisdiction-access rows remain reviewed editorial research support outside canonical public counts and are not canonical Market Access Records.

For all 110 assets:

```text
state: ready_with_unknowns
readiness_scored: false
reason_code: deferred_canonical_schema
```

## Completion condition

PR #338 completes when:

- the reviewed PR #337 queue is preserved;
- exactly twenty unique queue targets are normalized;
- all twenty target classifications contain `asset_class: stablecoin`;
- deterministic re-audit produces zero normalization rows;
- deterministic re-audit produces zero integrity blockers;
- all 110 overall asset states are `ready_with_unknowns`;
- market access remains deferred and unscored for all 110 assets;
- canonical counts remain unchanged;
- all six prior statistics snapshots remain an exact immutable prefix;
- the reviewed PR #338 same-count statistics checkpoint is appended and matches deterministic generation exactly;
- the dedicated validator and read-only workflow are green;
- general CI, immutable statistics history, statistics foundation, statistics analysis, and active-workstream validation are green.

## Next item

After PR #338 merges, PR #341 is authorized to define the canonical Market Access Record schema and governance. PR #341 is a schema/governance item, not a license to publish monitoring observations directly. The reviewed research checkpoint merged in PR #339 can be considered for migration only after PR #341 establishes the canonical schema and review rules.
