# Stable or Gone monitoring coverage report

Status: canonical specification  
Updated: 2026-06-29  
Roadmap item: PR #245

## Purpose

PR #245 closes Phase B by generating a deterministic coverage report from the 92 canonical stable assets, canonical organizations and relationships, 24 reviewed monitoring sources, and 24 repository baseline records.

Coverage means only that a registered review-only source targets a canonical record. It does not mean the baseline is accepted, the source is complete, the page is currently reachable, the monitored claim is correct, or the asset has passed a quality assessment.

## Private output

The generator writes only:

```text
data-staging/monitoring-coverage/monitoring-coverage.json
data-staging/monitoring-coverage/monitoring-coverage.md
```

The directory is ignored by Git and is not part of the public build.

Run:

```text
node scripts/monitoring/audits/build-coverage-report.mjs
```

The generator performs no network request.

## Source families

Signals are grouped into four reporting families:

```text
reserve_assurance
redemption_terms
issuer_lifecycle
regulatory
```

Mapping:

```text
reserve_update                 -> reserve_assurance
assurance_update               -> reserve_assurance
backing_attestation_update     -> reserve_assurance
issuance_redemption_update     -> redemption_terms
lifecycle_update               -> issuer_lifecycle
regulatory_update              -> regulatory
```

A family is a reporting dimension, not a claim that the source fully covers that subject.

## Asset coverage classes

```text
no_registered_source
single_family_coverage
multi_family_coverage
```

`multi_family_coverage` means two or more of the four reporting families. It is not a higher safety or quality rating.

## Baseline distinction

The report separates:

```text
pending_initial_acceptance
accepted
missing
```

A registered source with a pending baseline is not counted as accepted monitoring coverage. Current accepted coverage remains zero until a separate human-reviewed baseline PR is merged.

## Summary fields

The report includes:

- canonical stablecoin, organization, and relationship counts;
- registered source and unique URL counts;
- covered and uncovered stablecoin counts and percentages;
- multi-family stablecoin counts and percentages;
- accepted-coverage stablecoin count;
- covered and uncovered organization counts and percentages;
- source counts by family;
- stablecoin counts by family;
- baseline status counts.

## Per-asset fields

Each of the 92 stable assets receives exactly one row containing:

```text
stablecoin_id
name
symbol
status
source_ids
source_count
source_families
source_family_count
signal_types
organization_ids
baseline_status_counts
coverage_class
accepted_monitoring_coverage
canonical_action
```

Fixed value:

```text
canonical_action: none
```

## Per-organization fields

Every canonical organization receives exactly one row containing its registered sources, targeted stable assets, family coverage, and coverage class.

## Per-source fields

All 24 sources receive exactly one row containing source kind, URL, source families, signals, canonical targets, baseline status, and fixed canonical action.

## Safety interpretation

The following values are fixed:

```text
coverage_is_not_quality_score: true
registered_source_is_not_accepted_baseline: true
pending_source_is_not_active_monitoring_proof: true
uncovered_is_not_unmonitorable: true
source_count_is_not_completeness: true
canonical_action: none
network_access: false
public_output: false
production_publication: false
```

An uncovered asset may still have monitorable official material that has not yet been reviewed or registered. A source-rich asset may still have important coverage gaps.

## Deterministic validation

CI must prove:

- exactly 92 canonical stable assets are represented once each;
- exactly 24 registered sources and 24 matching baselines are represented once each;
- source and baseline IDs match exactly;
- all canonical source targets and exact stablecoin-to-organization relationships resolve;
- only the four approved reporting families appear;
- coverage classes follow family counts;
- summary counts and percentages recalculate from row data;
- uncovered lists exactly match zero-source rows;
- baseline status counts recalculate from source rows;
- all current baselines remain `pending_initial_acceptance` and accepted coverage remains zero;
- generation is byte-deterministic;
- output remains in the ignored private staging directory;
- the generator contains no network or publication capability;
- no canonical record is changed.

## Phase B completion boundary

PR #245 completes the reviewed source-coverage implementation phase. It does not claim adequate coverage for all 92 assets. The report is the measured starting point for later coverage expansion and the PR #258 recalculation after growth to 100 assets.

## Deployment classification

```text
No production deployment required
```
