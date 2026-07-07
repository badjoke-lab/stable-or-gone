# Stable or Gone monitoring baseline specification

Status: canonical specification  
Updated: 2026-07-07  
Roadmap item: PR #234, amended by PR #238 and PR #321

## Purpose

A baseline is not canonical evidence. It is a human-reviewed comparison point for an official source.

PR #321 synchronizes the existing baseline configuration with the audited 100-asset registry checkpoint without accepting live page digests.

## Storage

The baseline set is stored at:

```text
scripts/monitoring/baselines/official-source-baselines.json
```

Monitoring execution may read this file but may not modify it.

The 100-asset synchronization snapshot is stored separately at:

```text
scripts/monitoring/baselines/monitoring-baseline-sync-100-assets.json
```

The synchronization snapshot records deterministic configuration and coverage state. It is not a replacement baseline set and is not canonical evidence.

## Required top-level fields

```text
schema_version
baseline_set_id
normalization_version
updated_at
baselines
policy
```

`normalization_version` must be `sog_official_source_normalization_v2`. A digest produced under another normalization version is not comparable and must be reviewed again.

## Record states

```text
pending_initial_acceptance
accepted
```

A `pending_initial_acceptance` record keeps all accepted fields null.

An accepted record requires:

```text
allowlisted accepted_final_url
body_sha256
normalized_content_sha256
content_type
accepted_observed_at
accepted_repository_commit
accepted_review_reference
```

Optional response metadata such as ETag and Last-Modified may remain null when unavailable.

## Current reviewed state

At the PR #321 synchronization checkpoint:

```text
reviewed official sources: 24
baseline rows: 24
pending_initial_acceptance: 24
accepted: 0
missing: 0
```

All 24 current baseline records remain pending. No live page digest is invented, inferred, or silently accepted.

PR #321 records this zero-accepted state as an explicit reviewed synchronization boundary. It does not convert any row to `accepted`.

## Acceptance boundary

A future pending-to-accepted transition requires a separate reviewed baseline-acceptance change with:

- a live observation produced under the current normalization version;
- an allowlisted final URL;
- exact and normalized SHA-256 digests;
- content type;
- exact observation timestamp;
- reviewed repository commit SHA;
- `PR #<number>` review reference;
- human review.

Monitoring execution itself may never accept its own baseline.

## Normalization

Canonical normalization rules are defined in:

```text
docs/quality/monitoring-normalization-spec.md
```

Raw bodies and normalized page text are prohibited in the baseline file.

A normalization version change requires a separate reviewed baseline migration. No monitoring run may acquire write permission because baseline updates exist.

## 100-asset synchronization rule

PR #321 is governed by:

```text
docs/quality/monitoring-baseline-synchronization-100-assets-spec.md
scripts/monitoring/baselines/monitoring-baseline-sync-100-assets.json
```

Synchronization verifies:

- 100 canonical stable assets are represented in coverage calculation;
- 94 canonical organizations are represented;
- 110 canonical relationships are represented;
- 24 enabled source IDs match 24 baseline IDs exactly;
- every configured canonical reference resolves;
- all 24 baseline rows remain pending;
- accepted baseline count remains zero;
- accepted monitoring asset reach remains zero;
- registered source reach remains distinct from accepted monitoring coverage;
- deterministic synchronization digests match the reviewed snapshot.

A synchronization snapshot does not authorize source expansion, baseline acceptance, schedule activation, canonical writes, guide edits, or publication.

## Fixed policy

```text
human_review_required: true
monitoring_write_allowed: false
canonical_evidence: false
public_output: false
automatic_pull_request: false
production_publication: false
```

The synchronization layer additionally records:

```text
network_access_used: false
canonical_action: none
```

## Validation

Validation rejects:

- missing or duplicate records;
- unknown sources;
- source/baseline ID mismatch;
- source URL mismatch;
- stale normalization version;
- malformed accepted digests or provenance;
- populated accepted-only fields on pending rows;
- content-bearing fields;
- unsafe policy values;
- synchronization digest drift;
- accepted coverage claims unsupported by reviewed accepted rows.

## Public-output rule

The baseline set and synchronization snapshot remain internal. They are excluded from public pages, public JSON, machine-readable public files, sitemap output, and canonical evidence.

## Deployment classification

```text
No production deployment required
```
