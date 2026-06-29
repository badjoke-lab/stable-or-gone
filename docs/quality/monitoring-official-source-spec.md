# Stable or Gone official-source monitoring

Status: canonical specification  
Updated: 2026-06-29  
Roadmap items: PR #231, amended through PR #238

## Purpose

Official-source monitoring observes allowlisted issuer or protocol pages, normalizes responses deterministically, compares them with reviewed baselines, and produces private review material only.

Observations and candidates are not canonical facts or public classifications.

Related specifications:

```text
docs/quality/monitoring-pipeline-spec.md
docs/quality/monitoring-baseline-spec.md
docs/quality/monitoring-change-detection-spec.md
docs/quality/monitoring-observation-classification-spec.md
docs/quality/monitoring-normalization-spec.md
```

## Trigger and permissions

The workflow remains manual-only and read-only:

```text
workflow_dispatch
contents: read
```

There is no schedule, automatic commit, automatic pull request, baseline mutation, canonical write, or production action.

## Source allowlist

Sources exist only in `scripts/monitoring/sources/official-sources.json` and require:

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

URLs must use HTTPS. Configured and final hosts must be allowlisted. Target IDs must already exist. Authentication, cookies, and bypass behavior are prohibited.

## Baseline and normalization

Comparison points exist in `scripts/monitoring/baselines/official-source-baselines.json`.

The baseline and every observation use:

```text
normalization_version: sog_official_source_normalization_v2
```

The monitor records exact-byte and normalized-content SHA-256 digests. Raw response bodies and normalized page text are not stored. No source-specific normalization exception is approved.

A run may read the baseline but cannot modify or accept it.

## Observation contract

Private observations include source identity, URLs, timestamp, fetch state, response metadata, exact and normalized digests, normalization version, matched signals, classification, comparison provenance, and any fetch error.

Allowed states:

```text
new_source
unchanged
metadata_changed
content_changed
fetch_failed
```

Tracked metadata includes exact body digest, final URL, content type, ETag, and Last-Modified.

Fetch limits:

```text
timeout: 20 seconds per source
maximum response body: 2 MiB
user agent: Stable-or-Gone-Review-Monitor/1.0
```

## Candidate contract

A candidate exists only when the fetch succeeded, at least one configured signal matched visible normalized content, and the state is `new_source` or `content_changed`.

`unchanged`, `metadata_changed`, and `fetch_failed` create zero candidates.

Every candidate carries normalization version, classification reason, prior/current digests, metadata differences, target IDs, duplicate review, lineage review, and these fixed values:

```text
status: needs_human_review
canonical_action: none
```

No candidate authorizes a baseline update or canonical change.

## Output contract

Review-disabled runs retain the five-file contract. Review-enabled runs retain the nine-file contract. Private manifests, observation reports, candidate reports, and summaries record the normalization version and five-state counts.

The canonical before/after digest and path set must remain identical.

## Test rule

Offline fixtures validate allowlists, baselines, normalization, classification, identifiers, review material, no raw-content retention, and zero canonical changes.

Live official-source access occurs only in the manually dispatched workflow.

## Public-output rule

Sources, baselines, observations, normalized digests, comparisons, and candidates remain excluded from public pages, public JSON, machine-readable public files, sitemap output, and canonical counts.

## Deployment classification

```text
No production deployment required
```