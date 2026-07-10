# PR #346 access and regulation index activation

Status: active roadmap amendment  
Updated: 2026-07-10

## Authoritative current workstream

```text
PR #344 /compare/ v1: complete
PR #345 Compare presets: complete
PR #346 access and regulation index generator: active
PR #347 Access & Regulation Explorer: next
```

This amendment supersedes stale current-position wording in earlier roadmap amendments while preserving their historical implementation boundaries.

## Purpose

PR #346 creates a deterministic canonical index for searching legal, regulatory, and Market Access context across all 110 stable assets.

The index is not a score, rank, recommendation, or legal conclusion.

## Public endpoint

```text
/data/access-regulation-index.json
```

The endpoint is discovered through `/data/manifest.json`.

## Source boundary

The generator consumes:

```text
PR #343 deterministic comparison projection
PR #341 Market Access governance contract
```

and indexes exactly four canonical dimensions:

```text
lifecycle_semantics
legal_classification_comparability
regulatory_action_scope
market_access_applicability
```

The generator must not read editorial research, monitoring output, private notes, or unreviewed candidates.

## Absence boundary

PR #346 must preserve:

```text
no regulatory note != no regulatory action
no Market Access record != unavailable
unclassified legal profile != illegal
unclassified legal profile != unregulated
record presence != risk score
record count != risk score
```

## Market Access boundary

Canonical Market Access remains governed by PR #341.

At PR #346 start, canonical Market Access record count remains zero. Therefore all 110 assets must index:

```text
market_access.record_state: no_canonical_record
market_access.record_count: 0
market_access.freshness.state: no_canonical_record
```

PR #339 editorial Japan access research remains excluded.

## Index axes

PR #346 defines fourteen deterministic filter axes covering:

- lifecycle;
- legal profile state;
- legal classification and jurisdiction;
- licensed/regulated-as values;
- regulatory record state, note type, jurisdiction, and authority/source;
- Market Access record state, jurisdiction, function, access state, and platform.

Filter catalog counts are asset-presence counts, not record severity counts.

## Completion condition

PR #346 completes when:

- contract binds PR #343 projection and PR #341 governance;
- exactly 110 unique sorted asset rows are emitted;
- all fourteen filter axes exist for every row;
- filter catalog counts reconcile from row token presence;
- legal, regulatory, and Market Access readiness/freshness match PR #343 exactly;
- current empty Market Access yields 110 `no_canonical_record` rows;
- builder does not read PR #339 editorial research or monitoring output;
- repeated builds are byte-identical;
- built public endpoint matches deterministic artifact;
- manifest and site architecture discovery are valid;
- dedicated workflow and general CI are green;
- no canonical record counts, readiness, freshness, comparison values, or statistics history values change.

## Next item

After PR #346 merges, PR #347 is authorized to implement the Access & Regulation Explorer.

PR #347 must consume the PR #346 canonical index and preserve no-score, no-ranking, and no-absence-inference semantics.
