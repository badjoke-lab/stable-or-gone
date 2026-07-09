# PR #338 Comparison Readiness normalization activation

Status: active roadmap amendment  
Updated: 2026-07-09

## Authoritative current workstream

```text
Phase E controlled growth to 110 assets: complete
PR #336 Comparison Readiness contract and audit method: complete
PR #337 audit all 110 assets for comparison readiness: complete
PR #338 normalize comparison-critical gaps and validators: active
PR #339 define canonical Market Access Record schema and governance: next
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

Market access remains outside canonical comparison readiness until PR #339 defines its schema and governance.

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
- a dedicated validator and read-only workflow are green;
- general CI and active-workstream validation are green.

## Next item

After PR #338 merges, PR #339 is authorized to define the canonical Market Access Record schema and governance. PR #339 is a schema/governance item, not a license to publish monitoring observations directly.
