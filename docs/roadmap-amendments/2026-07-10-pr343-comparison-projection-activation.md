# PR #343 deterministic comparison projection activation

Status: active roadmap amendment  
Updated: 2026-07-10

## Authoritative current workstream

```text
PR #341 canonical Market Access Record schema and governance: complete
PR #342 facet-freshness derivation contract and validators: complete
PR #343 deterministic comparison projection and machine-readable output: active
PR #344 /compare/ v1: next
PR #345 Compare presets: later
```

This amendment supersedes stale numbering in earlier roadmap amendments while preserving their historical implementation boundaries.

## Purpose

PR #343 creates the public deterministic comparison projection by joining:

```text
canonical comparison value
+ readiness state
+ freshness state
```

These axes remain separate.

## Public endpoint

```text
/data/comparison.json
```

The endpoint must be advertised from `/data/manifest.json`.

## Binding files

```text
projection contract:
data/quality/comparison-projection-contract-v1.json

builder:
scripts/comparison/build-comparison-projection-pr343.mjs

validator:
scripts/validate-comparison-projection-pr343.mjs

public data helper:
src/lib/comparisonData.mjs

public route:
src/pages/data/comparison.json.ts

specification:
docs/quality/comparison-projection-pr343-spec.md
```

## Projection boundary

```text
assets: 110
dimensions: 19
cells: 2090
```

Each cell contains:

```text
dimension_id
value
readiness
freshness
```

No composite score is authorized.

## Public-safety boundary

The projection must remain:

```text
canonical_only: true
includes_unreviewed_candidates: false
includes_internal_monitoring: false
includes_private_notes: false
includes_normalization_queue: false
includes_editorial_research: false
```

Internal audit queues and reason-code lists must not appear in the public JSON.

## Market Access boundary

Canonical Market Access remains empty at the start of PR #343.

Therefore all 110 Market Access facets must project:

```text
record_state: no_canonical_record
record_count: 0
records: []
```

PR #339 editorial research must not enter the projection.

## Completion condition

PR #343 completes when:

- projection contract is present;
- deterministic builder produces 110 asset rows;
- every asset contains nineteen facets exactly once;
- flattened cell count is 2,090;
- readiness values exactly match the deterministic readiness audit;
- freshness values exactly match the deterministic freshness audit;
- projection values are derived only from canonical source families;
- forbidden internal fields are absent recursively;
- repeated builds are byte-identical;
- `/data/comparison.json` builds successfully;
- `/data/manifest.json` advertises comparison output and separation boundaries;
- dedicated workflow and general CI are green;
- no canonical counts or statistics-history values change.

## Next item

After PR #343 merges, PR #344 is authorized to implement `/compare/` v1.

PR #344 must consume the deterministic projection contract and preserve value, readiness, and freshness as separate axes.
