# PR #342 facet freshness derivation activation

Status: active roadmap amendment  
Updated: 2026-07-10

## Authoritative current workstream

```text
PR #338 bounded asset_class normalization and same-count statistics checkpoint: complete
PR #339 Japan access guide and reviewed research checkpoint: complete
PR #340 site-wide text readability remediation: complete
PR #341 canonical Market Access Record schema and governance: complete
PR #342 facet-freshness derivation contract and validators: active
PR #343 deterministic comparison projection and machine-readable output: next
```

This amendment supersedes stale current-position wording in earlier roadmap amendments while preserving their historical boundaries.

## Purpose

PR #342 creates deterministic freshness metadata for every asset × Comparison Readiness dimension cell.

The output shape is:

```text
assets: 110
dimensions: 19
cells: 2090
```

Freshness remains separate from readiness, confidence, truth, safety, ranking, and recommendation.

## Binding files

```text
contract:
data/quality/facet-freshness-contract-v1.json

builder:
scripts/comparison/build-facet-freshness-pr342.mjs

validator:
scripts/validate-facet-freshness-contract-pr342.mjs

specification:
docs/quality/facet-freshness-pr342-spec.md
```

## Freshness-state boundary

```text
fresh
aging
stale
undated
no_canonical_record
not_applicable
```

`undated` is not stale.

`no_canonical_record` is not a negative claim.

The derivation must never convert absence into:

- unavailable;
- illegal;
- no regulatory action;
- no uncertainty;
- not applicable.

## Deterministic date boundary

PR #342 uses the fixed contract date:

```text
2026-07-10
```

Wall-clock time and CI run time are forbidden derivation inputs.

Future anchors fail validation and are not clamped to age zero.

## Regulatory and historical-date boundary

Historical subject dates must remain separate from review freshness.

The following must not automatically become freshness anchors:

- launch date;
- relationship start date;
- event date;
- regulatory action `note_date`;
- legal effective date.

Regulatory freshness accepts only explicit review-like dates. Existing regulatory rows without review metadata derive `undated`, not stale.

## Market Access boundary

PR #341 canonical Market Access records remain zero.

Therefore PR #342 must derive:

```text
market_access_applicability:
  no_canonical_record: 110
```

PR #339 editorial research and monitoring outputs remain excluded.

## Output boundary

PR #342 output remains:

```text
canonical_only: true
public_output: false
single_composite_score: false
```

No public comparison projection is authorized in PR #342.

## Completion condition

PR #342 completes when:

- all nineteen comparison dimensions have exactly one freshness rule;
- all threshold profiles are valid;
- deterministic audit contains 110 assets × 19 facets = 2,090 cells;
- every cell uses a permitted canonical anchor;
- all summary counts reconcile;
- Market Access derives 110 `no_canonical_record` states;
- regulatory action dates are not used as review freshness;
- no monitoring or editorial research enters the derivation;
- dedicated workflow and general CI are green;
- no canonical registry counts or statistics history values change.

## Next item

After PR #342 merges, PR #343 is authorized to build deterministic comparison projection and machine-readable output.

PR #343 may join readiness and freshness metadata, but must preserve them as independent axes and must not produce a single composite score.
