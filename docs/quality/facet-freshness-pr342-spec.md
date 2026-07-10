# SOG facet freshness derivation — PR #342

Status: canonical implementation specification  
Updated: 2026-07-10

## 1. Purpose

PR #342 defines deterministic freshness metadata for comparison facets.

Freshness answers only:

> How old is the explicit canonical review, as-of, observation, access, or last-checked anchor used for this facet?

Freshness does not answer:

- whether the fact is true;
- whether the record is comparison-ready;
- whether the evidence is reliable;
- whether an asset is safe;
- whether an asset should be ranked or recommended.

PR #342 remains an internal derivation and validator workstream. It does not publish comparison output or a freshness score.

## 2. Binding contract

```text
data/quality/facet-freshness-contract-v1.json
```

The contract binds:

- deterministic `as_of_date`;
- freshness-state vocabulary;
- threshold profiles;
- canonical source boundaries;
- one derivation rule for each of the nineteen Comparison Readiness dimensions;
- output shape and next-workstream boundary.

## 3. Freshness states

```text
fresh
aging
stale
undated
no_canonical_record
not_applicable
```

### fresh

An explicit freshness anchor exists and its age is within the configured fresh window for the facet.

### aging

An explicit anchor exists and is older than the fresh window but still within the configured aging window.

### stale

An explicit anchor exists and is older than the configured aging window.

### undated

The canonical facet record or structure exists but no permitted freshness anchor is recorded.

`undated` is not equivalent to stale. No age may be invented.

### no_canonical_record

The facet uses a record-present or canonical-record source family and no canonical row exists for the asset.

This state is not a negative factual claim. For example:

- no Market Access Record does not mean unavailable;
- no Regulatory Note does not mean no regulatory action occurred;
- no known-unknown row does not prove that no uncertainty exists.

### not_applicable

Reserved for a future rule that explicitly establishes non-applicability from canonical semantics. PR #342 does not infer non-applicability from record absence.

## 4. Deterministic reference date

The v1 contract uses:

```text
as_of_date: 2026-07-10
```

The builder must not use wall-clock time or the CI run timestamp.

A future anchor relative to the contract `as_of_date` is a validation error. It must not be clamped to age zero.

## 5. Threshold profiles

Freshness windows are facet-specific.

Examples:

```text
standard review:       fresh <= 90d, aging <= 180d
reserve disclosure:    fresh <= 45d, aging <= 90d
reserve report:        fresh <= 45d, aging <= 90d
redemption terms:      fresh <= 90d, aging <= 180d
legal review:          fresh <= 180d, aging <= 365d
regulatory review:     fresh <= 180d, aging <= 365d
market access:         fresh <= 30d, aging <= 90d
evidence review:       fresh <= 90d, aging <= 180d
known unknown review:  fresh <= 90d, aging <= 180d
```

These windows are operational review thresholds. They are not claims about legal validity, market safety, or factual expiration.

## 6. Allowed freshness anchors

The v1 builder supports:

```text
asset_last_verified_at
reserve_profile_as_of_date
latest_reserve_report_date
redemption_profile_as_of_date
legal_profile_review_date
latest_regulatory_review_date
latest_market_access_observed_at
latest_evidence_accessed_at
latest_known_unknown_checked_at
```

Each Comparison Readiness dimension has exactly one explicit rule.

## 7. Date-semantic boundaries

### Historical event and effective dates

Historical event dates, relationship start dates, legal effective dates, regulatory action dates, and asset launch dates must not be treated as freshness anchors merely because they are recent or old.

For example, a 2021 regulatory action remains a 2021 event. Its `note_date` does not say when the regulatory facet was last reviewed.

The regulatory freshness rule therefore accepts only explicit review-like fields:

```text
reviewed_at
last_checked_at
last_verified_at
```

If a Regulatory Note exists but these are absent, freshness is `undated`, not stale.

### Launch date

The launch-date facet uses the asset review date as the freshness anchor. The launch date itself is historical subject matter and must not determine freshness.

### Reserve reports

The reserve-report date facet uses the latest canonical report/as-of date as its content-time anchor. It remains separately labeled as source report date semantics and must not be displayed as an editorial review date.

## 8. Inherited review anchors

Several current canonical classification surfaces do not yet carry independent review metadata.

For those dimensions, PR #342 explicitly permits `asset.last_verified_at` as an inherited review proxy. The output marks:

```text
inherited_review_anchor: true
```

This is transparent technical debt, not hidden date substitution.

Dimensions using inherited review proxy include classification-oriented surfaces such as lifecycle, reference target, asset class, issuance, stabilization, issuer boundary, and unknown-state surface.

A later schema may replace these inherited anchors with facet-native review dates without changing the meaning of earlier audits.

## 9. Market Access boundary

PR #341 created the canonical Market Access schema and governance foundation with zero canonical records.

PR #342 therefore derives:

```text
market_access_applicability:
  no_canonical_record for all 110 assets
```

It must not use:

- PR #339 editorial research rows;
- monitoring observations;
- monitoring candidates;
- source-discovery URLs;
- article copy.

When canonical Market Access Records are later added, the anchor is the latest canonical `observed_at` date for the asset.

## 10. Output contract

The deterministic audit must contain:

```text
assets: 110
dimensions per asset: 19
cells: 2090
```

Each cell contains:

```text
dimension_id
freshness_state
anchor_kind
anchor_date
age_days
threshold_profile
date_semantics
inherited_review_anchor
canonical_record_count
reason_code
```

The output must remain:

```text
canonical_only: true
public_output: false
single_composite_score: false
```

## 11. Canonical source boundary

Allowed source families are:

```text
stable_assets
profiles
reserve_reports
legal_profiles
regulatory_notes
market_access_records
evidence
known_unknowns
```

Excluded source families include:

```text
monitoring_observations
monitoring_candidates
editorial_research
candidate_research
news_discovery
private_notes
live_price
market_cap
apy
risk_feed
```

## 12. Validation requirements

PR #342 validators must prove:

1. all nineteen Comparison Readiness dimensions have exactly one freshness rule;
2. threshold profiles are internally ordered;
3. derivation uses the fixed contract date;
4. future dates fail rather than clamp;
5. all 110 assets emit nineteen cells;
6. the audit contains exactly 2,090 cells;
7. per-dimension summaries each total 110;
8. global state counts total 2,090;
9. empty canonical Market Access data yields 110 `no_canonical_record` cells;
10. regulatory `note_date` is never used as review freshness;
11. no composite score is emitted;
12. output remains internal and canonical-only.

## 13. Non-goals

PR #342 does not:

- change Comparison Readiness states;
- make Market Access research canonical;
- add Market Access records;
- publish `/compare/`;
- publish freshness badges;
- create a freshness score;
- create a safety or risk score;
- rank stablecoins;
- alter canonical registry counts;
- alter immutable statistics history.

## 14. Next item

After PR #342 merges, PR #343 is authorized to build the deterministic comparison projection and machine-readable output.

PR #343 may consume both Comparison Readiness and PR #342 freshness metadata, but it must preserve them as separate axes and must not collapse them into one score.
