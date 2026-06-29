# Stable or Gone observation change classification

Status: canonical specification  
Updated: 2026-06-29  
Roadmap item: PR #237

## Purpose

PR #237 separates normalized-content changes from metadata-only differences and operational failures. The classification prevents a changed ETag, Last-Modified header, redirect target, content type, or byte representation from being presented as a stablecoin-content change.

Every observation receives exactly one operational classification. No classification is a canonical fact about the monitored stablecoin.

## Classification order

For an accepted baseline and successful observation, evaluate in this order:

```text
1. normalized_content_sha256 differs -> content_changed
2. normalized content matches but tracked metadata differs -> metadata_changed
3. normalized content and tracked metadata match -> unchanged
```

A pending or missing baseline is `new_source`. An unsuccessful observation is `fetch_failed`.

## States

### new_source

Used when no accepted comparison point exists.

```text
classification_reason:
  baseline_pending_initial_acceptance
  OR baseline_missing
```

A signal-bearing new source may create a private review candidate. The monitoring run cannot accept the source as its own baseline.

### unchanged

Used only when normalized content and all tracked metadata match the accepted baseline.

```text
classification_reason: normalized_content_and_metadata_match
metadata_changed: false
metadata_changes: []
```

An unchanged observation creates zero candidates.

### metadata_changed

Used when normalized content is identical but at least one tracked metadata value differs.

```text
classification_reason: normalized_content_same_metadata_differs
normalized_content_changed: false
metadata_changed: true
```

Tracked metadata keys are:

```text
exact_body_sha256
final_url
content_type
etag
last_modified
```

`exact_body_sha256` is treated as metadata-only when normalized content is unchanged. This captures HTML structure, whitespace, script/style payload, serialization, or other byte-level changes without claiming a semantic page change.

A metadata-only observation creates zero content-change candidates. It remains visible in private observation output and aggregate counts for operational review.

### content_changed

Used when the normalized-content digest differs.

```text
classification_reason: normalized_content_digest_changed
normalized_content_changed: true
```

Content change takes precedence even when tracked metadata also differs. The comparison records both facts.

A content change creates a private candidate only when an allowlisted signal also matches. It does not prove materiality, effective date, or a canonical stablecoin change.

### fetch_failed

Used when a successful observation is unavailable because of a network error, rejected redirect, size limit, non-success HTTP response, or other observation failure.

```text
classification_reason: successful_observation_unavailable
```

A fetch failure creates zero content-change candidates.

## Comparison record

Every `baseline_comparison` includes:

```text
state
classification_reason
baseline_status
baseline_body_sha256
baseline_normalized_content_sha256
observed_body_sha256
observed_normalized_content_sha256
exact_body_changed
normalized_content_changed
metadata_changed
metadata_changes
baseline_final_url
observed_final_url
baseline_content_type
observed_content_type
baseline_etag
observed_etag
baseline_last_modified
observed_last_modified
accepted_observed_at
accepted_repository_commit
accepted_review_reference
```

`metadata_changes` is a sorted-by-evaluation-order list containing only the tracked keys that differ.

## Aggregate counts

Private observation output, candidate output, manifest, and summary record:

```text
change_counts.unchanged
change_counts.metadata_changed
change_counts.content_changed
change_counts.new_source
change_counts.fetch_failed
```

The count total must equal `observation_count`.

## Candidate traceability

Every candidate must include:

```text
change_state
classification_reason
baseline_comparison
```

The candidate therefore carries the prior and current byte and normalized-content digests, the exact operational classification, metadata differences, and baseline approval provenance.

Candidates remain limited to:

```text
new_source + configured signal
content_changed + configured signal
```

`unchanged`, `metadata_changed`, and `fetch_failed` observations create no candidate.

## Review meaning

Classification is mechanical and operational:

- `metadata_changed` is not evidence of a reserve, redemption, issuer, regulatory, migration, or lifecycle change.
- `content_changed` is not proof that the changed text is material or true.
- `fetch_failed` is not evidence that a service or stablecoin failed.
- `new_source` is not evidence that the source is newly published.

Human review remains responsible for interpretation and any later baseline or canonical-data proposal.

## Deterministic validation

Offline fixtures must prove:

- exact match yields `unchanged`;
- byte-only change with identical normalized text yields `metadata_changed`;
- ETag-only change yields `metadata_changed`;
- normalized text change yields `content_changed` even when metadata also changes;
- failed observation yields `fetch_failed`;
- pending baseline yields `new_source`;
- metadata-only changes produce zero candidates;
- candidate comparison records include prior and current digests;
- aggregate counts equal observation count;
- raw response content remains absent;
- canonical and public files remain unchanged.

## Deployment classification

```text
No production deployment required
```