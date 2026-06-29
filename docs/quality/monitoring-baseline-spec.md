# Stable or Gone monitoring baseline specification

Status: canonical specification  
Updated: 2026-06-29  
Roadmap item: PR #234

## Purpose

This specification defines the repository-reviewed comparison point used by later official-source monitoring runs.

An accepted monitoring baseline answers only this operational question:

```text
Has the normalized official-source response changed since the last human-approved comparison point?
```

A baseline is not canonical evidence that a stablecoin fact is true. It does not establish reserve composition, redemption access, issuer identity, regulatory status, migration state, depeg state, or lifecycle status. A detected difference remains private review material until separately evidenced and approved.

## Storage

The baseline set is stored at:

```text
scripts/monitoring/baselines/official-source-baselines.json
```

It is repository-controlled input. Monitoring execution may read this file but may not modify it, commit it, open a pull request for it, or replace it automatically.

## Top-level contract

Required fields:

```text
schema_version
baseline_set_id
updated_at
baselines
policy
```

Fixed policy values:

```text
policy.human_review_required: true
policy.monitoring_write_allowed: false
policy.canonical_evidence: false
policy.public_output: false
policy.automatic_pull_request: false
policy.production_publication: false
```

The baseline set must contain exactly one record for every enabled source in `scripts/monitoring/sources/official-sources.json`. Missing, duplicate, or unknown source IDs are invalid.

## Baseline record

Every record requires:

```text
source_id
source_url
status
accepted_final_url
body_sha256
normalized_content_sha256
content_type
etag
last_modified
accepted_observed_at
accepted_repository_commit
accepted_review_reference
```

Allowed status values:

```text
pending_initial_acceptance
accepted
```

### pending_initial_acceptance

A new official source starts in `pending_initial_acceptance` unless an observation has already been reviewed and approved in the same pull request.

For this state, all accepted-observation fields must be `null`:

```text
accepted_final_url
body_sha256
normalized_content_sha256
content_type
etag
last_modified
accepted_observed_at
accepted_repository_commit
accepted_review_reference
```

A source in this state is classified as `new_source` by later comparison logic. It must not be treated as changed or unchanged, and it must not produce an automatically accepted baseline.

### accepted

An accepted record requires:

- `source_url` equal to the configured official source URL;
- `accepted_final_url` using HTTPS and an allowlisted host;
- `body_sha256` as a lowercase 64-character SHA-256 digest of the fetched bytes;
- `normalized_content_sha256` as a lowercase 64-character SHA-256 digest of normalized content;
- a non-empty `content_type`;
- optional `etag` and `last_modified` strings when supplied by the source;
- `accepted_observed_at` as an ISO-8601 timestamp;
- `accepted_repository_commit` as the reviewed 40-character commit SHA;
- `accepted_review_reference` in `PR #<number>` form.

Acceptance means a human reviewer approved this observation as the next comparison point. It does not approve any canonical fact inferred from the page.

## Digest boundary

Two digests are kept because they answer different operational questions:

```text
body_sha256
  exact fetched-byte identity

normalized_content_sha256
  comparison identity after approved non-semantic normalization
```

PR #234 defines storage and validation only. PR #235 introduces comparison behavior. PR #238 later defines and hardens normalization rules.

Raw response bodies, normalized page text, screenshots, extracted documents, and large response fragments are prohibited in the baseline file.

## URL and redirect safety

The configured `source_url` must remain identical to its official-source allowlist entry. An accepted final URL must:

- use HTTPS;
- remain on one of that source's allowlisted hosts;
- contain no embedded credentials;
- be stored without a fragment.

A redirect outside the allowlist cannot become a baseline.

## Human approval boundary

A baseline change requires a separate repository pull request. The pull request must state:

```text
source IDs changed
observation run or fixture used
prior and proposed digests
redirect and content-type review
reason for acceptance or continued pending state
canonical/public data preservation
```

The monitoring workflow remains:

```text
workflow_dispatch only
contents: read
```

No monitoring run may acquire write permission because baseline updates exist.

## Validation

Repository validation must reject:

- missing or duplicate baseline records;
- baseline IDs not present in the enabled source allowlist;
- URL mismatch with the source configuration;
- non-HTTPS or non-allowlisted accepted final URLs;
- malformed digests, timestamps, commit SHAs, or review references;
- populated accepted fields in `pending_initial_acceptance` records;
- incomplete accepted records;
- raw-body or content-bearing fields;
- policy values that permit writes, public output, automatic pull requests, or publication.

Validation must also prove that the current four official sources have explicit baseline records. PR #234 intentionally initializes them as `pending_initial_acceptance`; no live page digest is invented or silently accepted.

## Public-output rule

The baseline file is internal repository configuration. It is not loaded into public pages, public JSON, manifest counts, version metadata, AI files, sitemap output, or canonical evidence.

## Deployment classification

```text
No production deployment required
```