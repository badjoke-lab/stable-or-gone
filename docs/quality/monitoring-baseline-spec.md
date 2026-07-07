# Stable or Gone monitoring baseline specification

Status: canonical specification  
Updated: 2026-07-07  
Roadmap item: PR #234, amended by PR #238, PR #321, PR #322, and PR #323

## Purpose

A baseline is not canonical evidence. It is a human-reviewed comparison point for an official source.

The current monitoring configuration contains 39 reviewed sources and 39 baseline rows. All 39 remain `pending_initial_acceptance`.

## Storage

Live internal baseline set:

```text
scripts/monitoring/baselines/official-source-baselines.json
```

Historical and successor snapshots:

```text
PR #321
scripts/monitoring/baselines/monitoring-baseline-sync-100-assets.json

PR #322
scripts/monitoring/baselines/monitoring-reserve-redemption-expansion-100-assets.json

PR #323 current
scripts/monitoring/baselines/monitoring-lifecycle-regulatory-market-access-expansion-100-assets.json
```

Historical snapshots remain immutable. Later source expansion creates a successor snapshot rather than rewriting earlier counts or digests.

## Record states

```text
pending_initial_acceptance
accepted
```

A pending record keeps all accepted-only fields null.

An accepted record requires reviewed observation provenance under the current normalization version:

```text
accepted_final_url
body_sha256
normalized_content_sha256
content_type
accepted_observed_at
accepted_repository_commit
accepted_review_reference
```

Monitoring execution may read the baseline set but may not modify or accept it.

## Historical PR #321 boundary

```text
sources: 24
baseline rows: 24
pending: 24
accepted: 0
registered asset reach: 16
uncovered assets: 84
```

## Historical PR #322 boundary

```text
sources: 30
baseline rows: 30
pending: 30
accepted: 0
registered asset reach: 22
uncovered assets: 78
covered organizations: 18
multi-family assets: 11
```

PR #322 historical family reach:

```text
reserve_assurance: 14 sources / 16 assets
redemption_terms: 11 sources / 12 assets
issuer_lifecycle: 5 sources / 5 assets
regulatory: 5 sources / 5 assets
```

## Current PR #323 boundary

```text
sources: 39
baseline rows: 39
pending_initial_acceptance: 39
accepted: 0
missing: 0
registered asset reach: 23
uncovered assets: 77
covered organizations: 18
accepted asset reach: 0
multi-family assets: 17
```

Current source-family reach:

```text
reserve_assurance: 14 sources / 16 assets
redemption_terms: 11 sources / 12 assets
issuer_lifecycle: 7 sources / 7 assets
regulatory: 9 sources / 8 assets
platform_policy: 3 sources / 12 mapped assets
platform_service_state: 1 source / 0 mapped assets
regulatory_register: 1 source / 0 mapped assets
```

Current scoped coverage:

```text
platform-policy sources: 3
platform service-state sources: 1
regulatory-register sources: 1
market-access schema-capable sources: 5
scoped platforms: 4
scoped region values: 4
```

Platform and register scope are not divided by the 100-asset denominator.

## Normalization

`normalization_version` remains:

```text
sog_official_source_normalization_v2
```

Raw bodies and normalized page text are prohibited in the baseline file. A normalization change requires a separate reviewed migration.

## PR #323 governance

PR #323 is governed by:

```text
docs/quality/monitoring-lifecycle-regulatory-market-access-expansion-spec.md
docs/quality/monitoring-official-source-schema.md
scripts/monitoring/baselines/monitoring-lifecycle-regulatory-market-access-expansion-100-assets.json
```

Validation requires:

- exact 39-source / 39-baseline ID parity;
- all 39 rows pending;
- accepted count zero;
- accepted asset reach zero;
- canonical target references resolve;
- reviewed `monitoring_scope` values validate;
- platform, legal-entity, region, function, and register scope survive observation and candidate generation;
- current deterministic observation matches the PR #323 snapshot exactly;
- PR #321 and PR #322 historical snapshots remain unchanged.

## Fixed policy

```text
human_review_required: true
monitoring_write_allowed: false
canonical_evidence: false
public_output: false
automatic_pull_request: false
production_publication: false
network_access_used_for_snapshot: false
canonical_action: none
```

Neither baseline synchronization nor source expansion authorizes schedule activation, canonical writes, guide edits, automatic branches or canonical pull requests, candidate publication, or deployment.

## Public-output rule

The baseline set and monitoring snapshots remain internal. They are excluded from public pages, public JSON, public machine-readable files, sitemap output, and canonical evidence.

## Deployment classification

```text
No production deployment required
```
