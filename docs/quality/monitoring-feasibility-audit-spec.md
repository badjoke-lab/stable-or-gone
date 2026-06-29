# Stable or Gone monitoring feasibility audit

Status: canonical specification  
Updated: 2026-06-29  
Roadmap item: PR #240

## Purpose

PR #240 classifies every current canonical stable asset by operational monitoring feasibility before Phase B source expansion.

The audit is generated from checked-in Registry v2 stablecoin, organization relationship, and evidence records. It performs no network request, registers no monitoring source, accepts no baseline, changes no canonical record, and publishes no output.

The classification is not a quality score, risk score, market recommendation, or statement that an official source is factually correct.

## Private output

The generator writes only:

```text
data-staging/monitoring-feasibility/monitoring-feasibility.json
data-staging/monitoring-feasibility/monitoring-feasibility.md
```

Run:

```text
node scripts/monitoring/audits/build-feasibility-audit.mjs
```

The directory is ignored by Git.

## Classifications

### automatically_monitorable

Used only when the asset is non-terminal, has at least one current fetchable official source targeting the asset directly, and current official evidence covers at least two source families.

This means source registration is operationally plausible. It does not approve registration or establish that every relevant fact is monitorable.

### partially_monitorable

Used when at least one current fetchable official source exists but directness, source-family coverage, or lifecycle value is incomplete.

### manual_review_only

Used when official evidence exists only as archived or manual-review material, including static documents, filings, social records, forums, press/news items, or PDFs.

### no_reliable_official_source

Used when canonical evidence contains no official source for the stable asset or its related organizations.

This is a canonical evidence-coverage finding, not proof that no official source exists elsewhere.

## Official-source heuristic

Evidence is treated as official for this audit when its reliability is `high` or its `source_type` identifies an issuer, reserve, assurance, regulator, protocol, legal, audit, court, filing, or other official source.

A source is considered currently fetchable only when it uses HTTPS, is not an Internet Archive URL, is not a PDF, and is not identified as archive, snapshot, social, forum, court, filing, press, or news material.

These are deterministic repository heuristics. PR #241 through PR #244 must still verify live ownership, redirects, host allowlisting, content type, source scope, and current response behavior before source registration.

## Source families

Evidence is grouped into:

```text
reserve_assurance
redemption_terms
regulatory
issuer_lifecycle
technical
general_official
```

Grouping uses canonical `claim_scope`, `source_type`, `title`, and URL metadata only. It does not inspect live page content.

## Per-asset record

Each asset record includes:

```text
stablecoin_id
name
symbol
status
classification
classification_reason
related_organization_ids
evidence_counts
current_source_families
all_official_source_families
blocking_gaps
recommended_next_scope
canonical_action
```

Fixed value:

```text
canonical_action: none
```

## Blocking gaps

Approved gap values:

```text
official_source_missing
current_fetchable_official_source_missing
direct_asset_source_missing
reserve_assurance_coverage_missing
redemption_terms_coverage_missing
issuer_lifecycle_coverage_missing
terminal_asset_monitoring_low_priority
```

A gap is an input to later manual review. It does not authorize inventing a URL, altering canonical evidence, or registering an unverified source.

## Deterministic validation

CI must prove:

- record count equals the canonical stablecoin count and currently equals 92;
- every canonical stablecoin ID appears exactly once;
- only the four approved classifications appear;
- classification counts sum to the record count;
- every reason, gap, family, and next-scope value belongs to the approved vocabulary;
- related organization IDs exist canonically;
- evidence-count invariants hold;
- terminal assets cannot be automatically monitorable;
- every automatically monitorable record has direct current official evidence and at least two current source families;
- repeated generation is byte-deterministic;
- policy values prohibit network access, source registration, canonical action, public output, and production publication;
- output remains in the ignored private staging directory.

## Phase B boundary

PR #240 itself adds no live source and accepts no baseline.

Before registration in PR #241 through PR #244, every source still requires official ownership review, HTTPS and final-host allowlisting, canonical target review, exact signal scope, normalization compatibility, a pending baseline record, deterministic fixtures, and no automatic canonical action.

## Deployment classification

```text
No production deployment required
```
