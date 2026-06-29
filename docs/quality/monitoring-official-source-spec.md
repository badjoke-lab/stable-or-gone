# Stable or Gone official-source monitoring

Status: canonical specification  
Updated: 2026-06-29  
Roadmap items: PR #231, amended by PR #235 and PR #237

## Purpose

PR #231 introduced allowlisted official-source observation and private candidate generation. PR #235 made candidate generation baseline-aware. PR #237 separates metadata-only differences from normalized-content changes.

Observations and candidates are private research inputs, not canonical facts or public classifications.

This specification supplements:

```text
docs/quality/monitoring-pipeline-spec.md
docs/quality/monitoring-baseline-spec.md
docs/quality/monitoring-change-detection-spec.md
docs/quality/monitoring-observation-classification-spec.md
```

## Trigger and permissions

The workflow remains manual-only and read-only:

```text
workflow_dispatch
contents: read
```

There is no schedule, push trigger, write permission, automatic commit, automatic pull request, baseline mutation, or production action.

## Modes

```text
health-only
  Repository-health run without external network access.

official-sources
  Allowlisted HTTPS observation, baseline comparison, classification, and private candidate generation.
```

## Source allowlist

Sources exist only in:

```text
scripts/monitoring/sources/official-sources.json
```

Each source requires:

```text
source_id
display_name
url
allowed_hosts
source_kind
affected_stablecoin_ids
affected_organization_ids
signal_types
enabled
```

URLs must use HTTPS. Configured and final hosts must be allowlisted. Target IDs must already exist. API keys, authenticated pages, and bypass behavior are prohibited.

## Baseline input

Comparison points exist only in:

```text
scripts/monitoring/baselines/official-source-baselines.json
```

Every enabled source has one pending or accepted record. A run may read the baseline but cannot modify or accept it.

## Observation contract

`official-source-observations.json` contains:

```text
observation_id
source_id
source_identity
source_url
final_url
observed_at
fetch_status
http_status
content_type
etag
last_modified
body_sha256
normalized_content_sha256
body_bytes
matched_signal_types
matched_keywords
baseline_comparison
error
```

The comparison record includes:

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

Allowed states:

```text
new_source
unchanged
metadata_changed
content_changed
fetch_failed
```

Raw response bodies and normalized page text are not stored.

Fetch limits:

```text
timeout: 20 seconds per source
maximum response body: 2 MiB
user agent: Stable-or-Gone-Review-Monitor/1.0
```

## Candidate contract

A candidate exists only when:

```text
fetch_status == ok
matched_signal_types is not empty
state is new_source or content_changed
```

`unchanged`, `metadata_changed`, and `fetch_failed` create zero candidates.

Required candidate fields:

```text
candidate_id
status
created_at
observation_id
source_id
source_url
change_state
classification_reason
baseline_comparison
affected_stablecoin_ids
affected_organization_ids
signal_types
matched_keywords
duplicate_review
lineage_review
canonical_action
```

Fixed values:

```text
status: needs_human_review
canonical_action: none
```

The candidate carries prior and observed digests and exact classification. It remains a prompt for human review.

Duplicate review confirms existing target IDs. Lineage review records matching canonical organization relationships. Neither approves a canonical change.

## Output contract

Review-disabled official-source runs write exactly five files. Review-enabled runs retain the nine-file PR #232 contract.

Private reports record:

```text
baseline_set_id
observation_count
candidate_count
source_errors
change_counts.unchanged
change_counts.metadata_changed
change_counts.content_changed
change_counts.new_source
change_counts.fetch_failed
canonical_guard
```

The count sum equals `observation_count`. Canonical before/after paths and digest remain identical.

## Test rule

Repository validation uses injected offline fixtures for:

- source and baseline validation;
- redirect and size enforcement;
- exact-match classification;
- metadata-only classification;
- content-change classification;
- failed-observation classification;
- deterministic identifiers;
- duplicate and lineage review;
- zero canonical changes;
- no raw content retention;
- exact five-file and nine-file contracts.

Live official-source access occurs only in the manually dispatched workflow.

## Public-output rule

Observations, baselines, comparisons, and candidates remain excluded from public pages, public JSON, machine-readable public files, sitemap output, and canonical counts.

## Deployment classification

```text
No production deployment required
```