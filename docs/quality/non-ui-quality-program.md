# Stable or Gone non-UI quality program

Status: canonical implementation schedule — paused  
Updated: 2026-07-01  
Registry checkpoint: 98 canonical stable assets

## Purpose

This document records the non-UI continuation that operated while detailed owner visual review was unavailable. It remains the historical source for completed monitoring, data-quality, and reviewed-growth work, but it is no longer the active workstream.

The active workstream is now the Editorial Ledger UI v3 remediation defined by:

```text
docs/architecture/approved-editorial-ledger-ui-v3.md
docs/ui-redesign/implementation-plan.md
docs/roadmap.md
```

## Current status

```text
Completed through: Growth C / PR #250
Canonical stable assets: 98
Latest completed repository PR: #260
Growth D PR #251: stale draft; do not merge as-is
Non-UI continuation: paused
100-record audit: not started
Non-UI release preparation: not started
Production publication: automatic on main
```

Owner visual review has resumed and rejected the former Modern Data Product presentation as the final UI. The UI v3 remediation is inserted before Growth D, the 100-record audit, and non-UI release preparation.

## Required reading order for later resumption

Before restarting non-UI growth or quality work after UI v3 closes, read:

1. `AGENTS.md`
2. `docs/spec-governance.md`
3. `docs/roadmap.md`
4. `docs/deployment-policy.md`
5. this document
6. the relevant canonical data or monitoring specification
7. `docs/migration/registry-v3-baseline.json`
8. the queue, validator, fixture, and supporting audit named by the resumed PR

Relevant canonical specifications include:

```text
docs/stable-asset-scope.md
docs/classification-spec.md
docs/data-model-v3-spec.md
docs/stats-spec.md
docs/quality/monitoring-pipeline-spec.md
docs/quality/monitoring-official-source-spec.md
docs/quality/monitoring-official-source-schema.md
docs/quality/monitoring-review-material-spec.md
```

## Fixed operating rules

- Repository specifications remain the source of truth.
- Every non-trivial PR cites the exact queue, audit, schema, fixture, baseline, and validator it changes.
- Unknown values remain unknown unless reviewed evidence supports a canonical value.
- Month- or year-level evidence is not coerced into a day-level date.
- UI work must not clear quality queues through hiding, defaults, or relabeling.
- Candidate monitoring output never writes directly to canonical public data.
- Monitoring baselines are accepted only through a separate human-reviewed repository change.
- Monitoring executions remain read-only and do not update their own baseline.
- Ordinary merged changes publish automatically from `main` under `docs/deployment-policy.md`.
- No growth PR may contain more than two new stable assets.
- Growth must use a fresh branch from the then-current main and must preserve all applicable record groups.

## Completed foundation

### PR #217-#225 — date, reserve, and evidence quality

The sequence aligned launch-date, terminal-date, relationship-end, reserve-applicability, evidence-reliability, placeholder, source-identity, and evidence-relation queues with canonical data.

### PR #226-#229 — deployment quality

The sequence reviewed deployment canonicality, verification, and source status without treating chain presence as proof of issuer endorsement.

### PR #230-#232 — review-only monitoring pipeline

The implemented sequence is:

```text
official-source observation
-> private candidate record
-> duplicate and lineage checks
-> evidence draft
-> reviewable material
-> human approval before canonical publication
```

The monitoring workflow remains read-only and review-only. It may not write canonical data automatically.

### PR #234-#245 — monitoring baseline and source coverage

Completed work includes:

- baseline specification;
- baseline-aware change detection;
- human-approved baseline update flow;
- change classification;
- normalization and noise suppression;
- deterministic safety audit;
- 92-record feasibility audit;
- reserve and assurance sources;
- redemption and terms sources;
- issuer, migration, and shutdown sources;
- regulatory-source boundary;
- deterministic monitoring coverage report.

Current monitoring snapshot remains internal and review-only.

### PR #246 — final candidate audit

PR #246 selected the reviewed growth set and enforced duplication, lineage, source, lifecycle, reference, backing, redemption, reserve, deployment, event, and historical-significance checks.

### PR #247-#250 — reviewed growth through 98

```text
PR #247 Growth A: 92 -> 94
PR #248 Growth B: 94 -> 96
PR #249 owner-requested guide interruption: 96 -> 96
PR #250 Growth C: 96 -> 98
```

Each completed growth PR added no more than two stable assets and included applicable supporting records.

## Deferred Growth D

Growth D remains required to reach 100 records, but the old PR #251 is not an approved merge candidate.

After UI v3 closes through PR #272, Growth D must be rebuilt from latest main. The rebuilt PR must:

```text
start from current main
use only reviewed corrected candidates
add exactly two stable assets at most
repeat duplicate and lineage checks
preserve all existing canonical records
include all applicable supporting layers
preserve unknown values
run current validators
update the roadmap before starting
```

## Deferred 100-record audit

After Growth D reaches 100, the audit must cover:

- ID, slug, alias, and symbol uniqueness;
- organization, issuer, and relationship integrity;
- evidence URL, source identity, and duplication integrity;
- reserve, redemption, and backing applicability;
- deployment, contract, and chain identity;
- launch, terminal, migration, and relationship boundaries;
- known-unknown and placeholder integrity;
- monitoring coverage recalculation for 100 assets.

A valid outcome may resolve a value, preserve it as unknown, record that no official source is available, or record a bounded unresolved conflict. It must not reduce uncertainty by guessing.

## Deferred non-UI release preparation

After the 100-record audit, non-UI release preparation must cover:

- Registry v2/v3 and machine-readable parity;
- counts, manifest, version, and provenance integrity;
- reproducible build and generated-output audit;
- 100-record canonical data freeze;
- release-candidate material.

This work must be performed against the actual post-UI-v3 repository state. The old PR-number allocation is retired because PR #252 through PR #260 were consumed by guide-publication, deployment, screenshot, and editorial work.

## Pause rule

No agent may restart Growth D, the 100-record audit, or non-UI release preparation before:

1. PR #272 completes or the roadmap explicitly changes the UI closure point;
2. the roadmap assigns a fresh post-UI sequence;
3. the work starts from the latest main;
4. stale PR #251 is closed or explicitly archived.

Urgent factual corrections, source-backed guide corrections, security fixes, or verified public breakage remain permitted as narrow interruptions.

## Deployment classification

Ordinary changes use:

```text
Automatic production deployment on main
```

Manual or emergency classifications remain governed by `docs/deployment-policy.md`.
