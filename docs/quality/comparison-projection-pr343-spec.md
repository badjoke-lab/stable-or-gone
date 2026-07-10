# SOG deterministic comparison projection — PR #343

Status: canonical public projection specification  
Updated: 2026-07-10

## 1. Purpose

PR #343 creates a deterministic machine-readable comparison projection from reviewed canonical SOG data.

The projection joins three layers without collapsing them:

```text
canonical comparison value
+ Comparison Readiness state
+ facet freshness state
```

The output is a public data projection, not a ranking, score, recommendation, or risk model.

## 2. Public endpoint

```text
/data/comparison.json
```

The endpoint is advertised from `/data/manifest.json` as a deterministic canonical comparison projection.

## 3. Output shape

The projection contains:

```text
assets: 110
dimensions: 19
cells: 2090
```

Each asset row contains:

```text
asset_id
slug
name
symbol
overall_readiness
facets
```

Each facet contains exactly:

```text
dimension_id
value
readiness
freshness
```

Public readiness fields are:

```text
state
scored
```

Public freshness fields are:

```text
state
anchor_date
age_days
date_semantics
inherited_review_anchor
```

## 4. Separation contract

Readiness and freshness remain separate axes.

A cell may be:

- comparison-ready while stale;
- comparison-ready with explicit unknowns while fresh;
- undated without being stale;
- missing a canonical supporting record without becoming a negative factual claim.

The projection must not derive one composite score from readiness, freshness, evidence count, reserve disclosure, legal status, regulatory notes, Market Access, lifecycle, or any other facet.

## 5. Canonical value projection

The projection emits deterministic comparison values for all nineteen dimensions.

### Identity

Name, symbol, and aliases are projected from the canonical stable-asset record.

### Organization boundary

Organization relationships are projected as relationship rows containing organization identity, role, state, and date boundaries. Organization-level claims are not copied into the asset root.

### Lifecycle, reference target, asset class, issuance, stabilization

These fields come from canonical classification data.

### Backing and reserve disclosure

Backing types remain multi-value. Reserve components remain separate rows. Percentages are never invented. Reserve disclosure profile, report count, component count, and latest report date semantics remain separate.

### Redemption

Redemption status, settlement asset, eligible-party scope, retail and institutional access, minimum, fee, settlement-time text, jurisdiction restrictions, review date, and confidence remain separate fields.

### Legal classification

Legal classifications remain jurisdiction-scoped arrays. Holder claim type, reserve ownership, reserve segregation, bankruptcy remoteness, and licensed/regulated-as values remain distinct.

No universal `regulated`, `compliant`, or `safe` boolean is generated.

### Regulatory action

Canonical Regulatory Notes are projected as scoped records. An empty record list is not represented as proof that no regulatory action exists.

### Market Access

Only canonical Market Access Records from PR #341 governance may enter the projection.

While the canonical file is empty, every asset projects:

```text
record_state: no_canonical_record
record_count: 0
records: []
```

PR #339 editorial research is not read into the public comparison projection.

### Launch and verification dates

Launch date and review date remain distinct. Null launch dates preserve tracked-unknown state when the canonical unresolved queue contains the asset.

### Unknown-state visibility

The projection exposes whether protected unresolved state remains visible and the canonical known-unknown count. It does not convert unknown to false or unavailable.

### Evidence and known unknowns

Evidence projection exposes count and canonical claim-scope categories, not an internal ranking. Known-unknown projection exposes count, topics, and severity counts from canonical rows.

## 6. Public data-safety boundary

The projection contract requires:

```text
canonical_only: true
includes_unreviewed_candidates: false
includes_internal_monitoring: false
includes_private_notes: false
includes_normalization_queue: false
includes_editorial_research: false
```

The public JSON must not contain:

```text
normalization_queue
reason_codes
supporting_inventory
monitoring_observations
monitoring_candidates
editorial_research_rows
private_review_notes
```

## 7. Determinism

The builder must:

- sort asset rows by canonical asset ID;
- preserve the Comparison Readiness contract dimension order;
- sort repeated projected rows deterministically;
- bind the readiness audit input digest;
- bind the freshness audit input digest;
- produce byte-identical JSON for repeated builds from identical inputs.

The public endpoint computes the projection from canonical repository inputs at build time using the same deterministic builder as the validator.

## 8. Summary layer

The public projection includes only high-level reconciliation summaries:

```text
readiness asset-state counts
freshness cell-state counts
```

Internal normalization queues and internal audit reason lists are excluded.

## 9. Manifest integration

`/data/manifest.json` must advertise:

```text
/data/comparison.json
```

and declare:

```text
readiness_and_freshness_separate: true
single_composite_score: false
excludes_unreviewed_candidates: true
excludes_internal_monitoring: true
excludes_editorial_research: true
```

## 10. Validation requirements

PR #343 validators must prove:

1. the projection contains exactly 110 assets;
2. every asset contains all nineteen dimensions exactly once;
3. the flattened projection contains exactly 2,090 cells;
4. asset identity set and ordering match canonical stable assets;
5. dimension order matches the readiness contract;
6. public readiness values exactly match the deterministic readiness audit;
7. public freshness values exactly match the deterministic freshness audit;
8. repeated projection builds are byte-identical;
9. forbidden internal fields are absent recursively;
10. Market Access has 110 `no_canonical_record` values while canonical records remain empty;
11. PR #339 editorial research remains noncanonical;
12. public route output matches the deterministic builder;
13. manifest discovery metadata advertises the endpoint;
14. general CI and dedicated PR #343 workflow are green.

## 11. Non-goals

PR #343 does not:

- create `/compare/` UI;
- add Compare presets;
- create a composite score;
- create ranking or recommendation;
- publish monitoring observations;
- publish candidate research;
- promote PR #339 research to canonical Market Access data;
- change Comparison Readiness states;
- change facet freshness rules;
- change canonical record counts;
- change immutable statistics history.

## 12. Next item

After PR #343 merges, PR #344 is authorized to implement `/compare/` v1 using the public deterministic projection.

The UI must consume the same value, readiness, and freshness axes without inventing a score or silently suppressing unresolved states.
