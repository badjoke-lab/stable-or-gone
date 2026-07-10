# SOG access and regulation index — PR #346

Status: canonical public index specification  
Updated: 2026-07-10

## 1. Purpose

PR #346 creates a deterministic public index for searching and grouping canonical legal, regulatory, and Market Access context across all 110 stable assets.

The index exists to support the next Access & Regulation Explorer workstream.

It is not:

- a legal compliance score;
- a jurisdiction approval list;
- an availability score;
- a risk ranking;
- a recommendation engine;
- a substitute for source review.

## 2. Public endpoint

```text
/data/access-regulation-index.json
```

The endpoint is advertised from `/data/manifest.json`.

## 3. Canonical source boundary

PR #346 consumes the PR #343 deterministic comparison projection and the PR #341 Market Access governance contract.

The source dimensions are exactly:

```text
lifecycle_semantics
legal_classification_comparability
regulatory_action_scope
market_access_applicability
```

The generator must not read:

- PR #339 editorial research rows;
- monitoring observations;
- monitoring candidates;
- private review notes;
- source-discovery queues;
- unreviewed candidates.

## 4. Row model

The index contains one row per canonical stable asset.

Each row contains:

```text
asset identity
lifecycle status
legal layer
regulatory layer
Market Access layer
filter tokens
```

The expected row count is:

```text
110
```

Rows are sorted by canonical asset ID.

## 5. Legal layer

The legal layer preserves:

```text
profile_state
classifications
holder_claim_type
reserve_ownership
reserve_segregation
bankruptcy_remoteness
licensed_or_regulated_as
readiness
freshness
```

### Legal profile states

```text
explicit_classification_present
unclassified_only
no_classification_record
```

`unclassified_only` means the canonical legal profile currently records only the controlled `unclassified` value.

It does not mean:

- illegal;
- unregulated;
- banned;
- unavailable;
- unsafe.

`no_classification_record` means no classification row is present in the projected legal value. It is not a legal conclusion.

## 6. Regulatory layer

The regulatory layer preserves canonical Regulatory Note records and indexes:

```text
record_state
record_count
note_type
jurisdiction
authority_or_source
readiness
freshness
```

The record-state vocabulary is:

```text
canonical_records_present
no_canonical_record
```

`no_canonical_record` does not prove that no regulatory action, warning, inquiry, legal change, or other relevant development exists.

PR #346 must preserve note-type distinctions. A banking context note, protocol lifecycle context, issuer operational notice, exchange notice, reported follow-up, and regulatory action must not be collapsed into one universal adverse-action category.

Record count is inventory context only and must not be used as a risk score.

## 7. Market Access layer

The Market Access layer preserves only canonical PR #341 records.

It indexes:

```text
record_state
record_count
jurisdiction country code
function
access_state
platform name
readiness
freshness
```

While the canonical Market Access entrypoint remains empty, all 110 rows must preserve:

```text
record_state: no_canonical_record
record_count: 0
freshness.state: no_canonical_record
```

This state does not mean unavailable.

PR #339 editorial Japan access research must not enter the index.

## 8. Index axes

PR #346 defines fourteen filter axes:

```text
lifecycle_status
legal_profile_state
legal_classification
legal_jurisdiction
licensed_or_regulated_as
regulatory_record_state
regulatory_note_type
regulatory_jurisdiction
regulatory_authority_or_source
market_access_record_state
market_access_jurisdiction
market_access_function
market_access_state
market_access_platform
```

Each index row contains token arrays for all fourteen axes.

## 9. Filter catalog semantics

The top-level filter catalog counts assets containing each token.

For example:

```text
regulatory_note_type = regulatory_action
asset_count = number of distinct assets containing at least one matching canonical note
```

The catalog does not count duplicate records as separate assets.

This makes the catalog suitable for deterministic explorer filter options without implying severity.

## 10. Readiness and freshness

The legal, regulatory, and Market Access layers preserve their PR #343 readiness and freshness metadata exactly.

These remain independent axes.

A row may therefore contain combinations such as:

```text
ready_with_unknowns + fresh
ready_with_unknowns + undated
ready_with_unknowns + no_canonical_record
```

The index must not merge them into one score.

## 11. Absence semantics

The binding contract requires:

```text
no regulatory note ≠ no regulatory action
no Market Access record ≠ unavailable
unclassified legal profile ≠ illegal
unclassified legal profile ≠ unregulated
record presence ≠ risk score
record count ≠ risk score
```

The next Explorer UI must preserve these semantics.

## 12. Determinism

The generator must:

- use the deterministic PR #343 projection;
- bind the PR #341 Market Access governance ID;
- sort rows by asset ID;
- deterministically sort nested legal, regulatory, and Market Access records;
- deterministically sort token values;
- generate filter catalogs in contract axis order;
- produce byte-identical JSON from identical inputs.

## 13. Manifest integration

`/data/manifest.json` must advertise:

```text
/data/access-regulation-index.json
```

and declare:

```text
source_boundary: reviewed_canonical_projection_only
legal_regulatory_and_access_layers_separate: true
readiness_and_freshness_preserved: true
single_composite_score: false
risk_ranking: false
no_absence_inference: true
excludes_unreviewed_candidates: true
excludes_internal_monitoring: true
excludes_editorial_research: true
```

## 14. Validation requirements

PR #346 validators must prove:

1. the contract binds PR #343 projection and PR #341 governance;
2. exactly 110 unique asset rows are emitted;
3. asset order and identity set match the canonical comparison projection;
4. all fourteen filter axes exist on every row;
5. filter catalog asset counts recompute exactly from row token presence;
6. legal, regulatory, and Market Access readiness/freshness match PR #343 exactly;
7. regulatory record counts match indexed record arrays;
8. Market Access record counts match indexed record arrays;
9. current empty canonical Market Access yields zero assets with access records and 110 `no_canonical_record` rows;
10. editorial research remains noncanonical and is not read by the builder;
11. monitoring output is not read by the builder;
12. repeated builds are byte-identical;
13. built public endpoint exactly matches the deterministic artifact;
14. manifest discovery and absence-semantics metadata are valid;
15. general CI and dedicated PR #346 workflow are green.

## 15. Non-goals

PR #346 does not:

- implement the Explorer UI;
- add Market Access Records;
- promote PR #339 research;
- change legal profiles;
- change Regulatory Notes;
- infer compliance;
- infer illegality;
- infer availability;
- calculate risk;
- calculate ranking;
- change canonical record counts;
- change Comparison Readiness;
- change freshness derivation;
- change immutable statistics history.

## 16. Next item

After PR #346 merges, PR #347 is authorized to implement the Access & Regulation Explorer.

The Explorer must consume this canonical index and preserve the no-score, no-ranking, and no-absence-inference boundaries.
