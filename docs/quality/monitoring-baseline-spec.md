# Stable or Gone monitoring baseline specification

Status: canonical specification  
Updated: 2026-07-07  
Roadmap item: PR #234, amended by PR #238, PR #321, and PR #322

## Purpose

A baseline is not canonical evidence. It is a human-reviewed comparison point for an official source.

PR #321 synchronized the first 24-source configuration with the audited 100-asset registry checkpoint without accepting live page digests.

PR #322 expands reserve and redemption source reach to 30 reviewed official sources while preserving the same zero-accepted baseline boundary.

## Storage

The live internal baseline set is stored at:

```text
scripts/monitoring/baselines/official-source-baselines.json
```

Monitoring execution may read this file but may not modify it.

Historical PR #321 synchronization state is stored at:

```text
scripts/monitoring/baselines/monitoring-baseline-sync-100-assets.json
```

Current PR #322 expansion state is stored at:

```text
scripts/monitoring/baselines/monitoring-reserve-redemption-expansion-100-assets.json
```

Both snapshots are internal monitoring contracts. Neither is a replacement baseline set and neither is canonical evidence.

## Required top-level fields

```text
schema_version
baseline_set_id
normalization_version
updated_at
baselines
policy
```

`normalization_version` must remain `sog_official_source_normalization_v2`. A digest produced under another normalization version is not comparable and requires separate reviewed migration.

## Record states

```text
pending_initial_acceptance
accepted
```

A `pending_initial_acceptance` record keeps all accepted-only fields null.

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

## Historical PR #321 state

PR #321 recorded:

```text
reviewed official sources: 24
baseline rows: 24
pending_initial_acceptance: 24
accepted: 0
missing: 0
registered asset reach: 16
uncovered assets: 84
accepted asset reach: 0
```

That snapshot remains immutable historical state and is not rewritten by later source expansion.

## Current PR #322 reviewed state

After reserve and redemption source expansion:

```text
reviewed official sources: 30
baseline rows: 30
pending_initial_acceptance: 30
accepted: 0
missing: 0
registered asset reach: 22
uncovered assets: 78
covered organizations: 18
accepted asset reach: 0
multi-family assets: 11
```

Current family reach:

```text
reserve_assurance: 14 sources / 16 assets
redemption_terms: 11 sources / 12 assets
issuer_lifecycle: 5 sources / 5 assets
regulatory: 5 sources / 5 assets
```

All 30 baseline records remain pending. No live page digest is invented, inferred, or silently accepted.

PR #322 adds only pending rows for TUSD, EURA, EURCV, EURI, EURQ, and VCHF first-party source pages.

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

## Historical synchronization rule

PR #321 remains governed by:

```text
docs/quality/monitoring-baseline-synchronization-100-assets-spec.md
scripts/monitoring/baselines/monitoring-baseline-sync-100-assets.json
```

Its historical validator protects the original 24-source counts and digests directly.

## Current reserve/redemption expansion rule

PR #322 is governed by:

```text
docs/quality/monitoring-reserve-redemption-source-expansion-spec.md
scripts/monitoring/baselines/monitoring-reserve-redemption-expansion-100-assets.json
```

Current expansion validation verifies:

- 100 canonical stable assets remain the registry boundary;
- 94 canonical organizations and 110 relationships remain the boundary;
- 30 enabled source IDs match 30 baseline IDs exactly;
- all configured canonical references resolve;
- all 30 baseline rows remain pending;
- accepted baseline count remains zero;
- accepted monitoring asset reach remains zero;
- six approved PR #322 source rows exist exactly once;
- reserve/assurance and redemption family counts match the reviewed expansion snapshot;
- deterministic current-state digests match the reviewed PR #322 snapshot.

Neither synchronization nor expansion authorizes baseline acceptance, schedule activation, canonical writes, guide edits, automatic canonical pull requests, candidate publication, or deployment.

## Fixed policy

```text
human_review_required: true
monitoring_write_allowed: false
canonical_evidence: false
public_output: false
automatic_pull_request: false
production_publication: false
```

Snapshot generators additionally record:

```text
network_access_used: false
canonical_action: none
```

## Validation

Validation rejects:

- missing or duplicate source/baseline records;
- unknown canonical references;
- source/baseline ID mismatch;
- source URL mismatch;
- stale normalization version;
- malformed accepted digests or provenance;
- populated accepted-only fields on pending rows;
- content-bearing fields;
- unsafe policy values;
- expansion snapshot digest drift;
- unapproved PR #322 source IDs;
- lifecycle/regulatory signal expansion inside PR #322 rows;
- accepted coverage claims unsupported by reviewed accepted rows.

## Public-output rule

The baseline set and monitoring synchronization/expansion snapshots remain internal. They are excluded from public pages, public JSON, public machine-readable files, sitemap output, and canonical evidence.

## Deployment classification

```text
No production deployment required
```
