# Stable or Gone monitoring baseline specification

Status: canonical specification  
Updated: 2026-06-29  
Roadmap item: PR #234, amended by PR #238

## Purpose

A baseline is not canonical evidence. It is a human-reviewed comparison point for an official source.

## Storage

The baseline set is stored at `scripts/monitoring/baselines/official-source-baselines.json`.

Monitoring execution may read this file but may not modify it.

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

A `pending_initial_acceptance` record keeps all accepted fields null. An accepted record requires an allowlisted final URL, `body_sha256`, `normalized_content_sha256`, content type, observation timestamp, reviewed commit SHA, and `PR #<number>` review reference.

The current four source records remain pending; no live page digest is invented or silently accepted.

## Normalization

Canonical rules are defined in `docs/quality/monitoring-normalization-spec.md`. Raw bodies and normalized page text are prohibited in the baseline file.

A normalization version change requires a separate reviewed baseline migration. No monitoring run may acquire write permission because baseline updates exist.

## Fixed policy

```text
human_review_required: true
monitoring_write_allowed: false
canonical_evidence: false
public_output: false
automatic_pull_request: false
production_publication: false
```

## Validation

Validation rejects missing or duplicate records, unknown sources, URL mismatch, stale normalization version, malformed digests or provenance, populated pending fields, content-bearing fields, and unsafe policy values.

## Public-output rule

The baseline set remains internal and is excluded from public pages, public JSON, machine-readable public files, sitemap output, and canonical evidence.

## Deployment classification

```text
No production deployment required
```