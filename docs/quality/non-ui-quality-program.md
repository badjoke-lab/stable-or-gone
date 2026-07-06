# Stable or Gone non-UI quality program

Status: canonical implementation plan — active  
Updated: 2026-07-06  
Registry checkpoint: 100 canonical stable assets

## Purpose

This program governs the core workstream after the dedicated UI correction program ended.

```text
100-record registry-wide audit — complete
-> EU market-access specification and research — complete
-> reviewed market-access article publication — complete
-> known-unknown and placeholder integrity audit — complete
-> monitoring coverage recalculation — complete
-> non-UI release hardening — active
-> monitoring expansion and scheduled read-only operation
-> statistics implementation
-> controlled growth from 100 to 110
-> Comparison Foundation
-> Compare
-> Change Research Tools
-> Reviewed Public Update Layer
```

The canonical execution order and current PR number are defined by `docs/roadmap.md`.

UI is maintenance-only until the roadmap reaches an approved product UI phase. A concrete verified UI defect may be corrected through a narrow PR, but UI work must not displace the approved sequence without an explicit roadmap amendment.

The EU stablecoin market-access work is governed by:

```text
docs/quality/eu-stablecoin-market-access-research-and-monitoring-spec.md
```

The post-110 comparison and change-product program is governed by:

```text
docs/comparison-and-change-product-spec.md
```

The public market-access article is a dated reviewed snapshot, not a live dashboard and not an automatic monitoring output.

## Current status

```text
Canonical stable assets: 100
Organizations: 94
Relationships: 110
Events: 172
Evidence: 502
Public source identities: 456
Evidence relations: 502
Deployments: 140
Detail routes: 366
Growth D: complete
100-record production verification: complete
PR #307 reviewed article: complete
PR #308 known-unknown and placeholder integrity audit: complete
PR #309 monitoring coverage recalculation: complete
PR #310 Registry v2/v3 and machine-readable parity: active
PR #311 counts, manifest, version, and provenance integrity: next
Monitoring foundation: implemented
Statistics specification: implemented as specification; page and public stats outputs not yet implemented
Growth beyond 100: not yet authorized until candidate-audit phase
Post-110 comparison program: approved but not active before reviewed 110-asset checkpoint
```

## Required reading order

Before changing canonical data, evidence, monitoring, statistics, workflows, quality documentation, comparison/change-product surfaces, or EU market-access editorial material:

1. `AGENTS.md`
2. `docs/spec-governance.md`
3. `docs/roadmap.md`
4. `docs/deployment-policy.md`
5. this document
6. the relevant canonical data, monitoring, editorial, statistics, comparison, or change-product specification
7. `docs/migration/registry-v3-baseline.json` when registry-v3 scope is relevant
8. every queue, validator, fixture, baseline, supporting audit, publication-gate review, and research checkpoint named by the work item

Relevant canonical specifications include:

```text
docs/stable-asset-scope.md
docs/classification-spec.md
docs/data-model-v3-spec.md
docs/stats-spec.md
docs/comparison-and-change-product-spec.md
docs/quality/monitoring-pipeline-spec.md
docs/quality/monitoring-official-source-spec.md
docs/quality/monitoring-official-source-schema.md
docs/quality/monitoring-review-material-spec.md
docs/quality/eu-stablecoin-market-access-research-and-monitoring-spec.md
```

## Fixed operating rules

- Repository specifications remain the source of truth.
- Every non-trivial PR cites the exact queue, audit, schema, fixture, baseline, validator, publication-gate review, and research checkpoint it changes.
- Unknown values remain unknown unless reviewed evidence supports a canonical value.
- Month- or year-level evidence is not coerced into a day-level date.
- UI work must not clear quality queues through hiding, defaults, or relabeling.
- Candidate monitoring output never writes directly to canonical public data.
- Monitoring baselines are accepted only through a separate human-reviewed repository change.
- Monitoring executions remain read-only and do not update their own baseline.
- An unchanged normalized official source must not create a candidate.
- Metadata-only changes and fetch failures must not masquerade as content changes.
- Platform-policy market access must preserve function or access route, service state, legal entity, customer scope, supported network where relevant, geography, and dates.
- A platform licence is not proof of stablecoin function availability.
- A global product page is not proof of EU/EEA service scope.
- A member-state page is not automatically an EEA-wide statement.
- Historical platform policy must be separated from later service-state changes.
- A market-access source change must not edit the public guide automatically.
- Registered source reach is not accepted baseline coverage.
- Issuer/protocol monitoring reach is not platform-policy coverage.
- Regulatory action pages are not regulatory-register coverage.
- Monitoring observations and editorial research matrices are not canonical market-access records.
- Comparison projections use reviewed canonical data only.
- Comparison work preserves protected unresolved states and must not fill gaps by inference.
- Facet freshness is derived from authoritative record families rather than copied into root asset records for display convenience.
- No growth PR may contain more than two new stable assets.
- Growth must use a fresh branch from current `main` and preserve all applicable record groups.
- Ordinary merged changes publish from `main` under `docs/deployment-policy.md`.

## Completed foundation

```text
PR #217-#225  date, reserve, evidence, and traceability quality
PR #226-#229  deployment quality
PR #230-#245  review-only monitoring foundation and source coverage
PR #246         final-eight candidate audit
PR #247-#250   controlled growth through 98 records, with consumed-number deviations recorded in history
PR #278         rebuilt Growth D to 100 records from current implementation lineage
PR #279-#280   production verification and count-aware closure hardening
PR #284-#295   UI recovery and maintenance fixes; dedicated UI program stopped
PR #296-#302   registry-wide audit through lifecycle and relationship boundaries
PR #303-#307   EU market-access specification, research, re-audit, and publication
PR #308         known-unknown and placeholder integrity audit
PR #309         monitoring coverage recalculation
```

Completed monitoring architecture already includes:

```text
official-source observation
-> accepted-baseline comparison
-> change classification
-> private monitoring candidate
-> review material
-> evidence draft
-> draft PR material
-> human approval before canonical publication
```

The pipeline is review-only. It must not commit, open a pull request, update canonical data, mutate accepted baselines, publish, or deploy automatically.

## EU market-access insertion — complete

The research and publication sequence completed through PR #307. The final published article is current through 2026-07-06 and preserves:

```text
issuer identity
token regulatory path
CASP or service legal entity
payment-services layer where applicable
platform service state
EU, EEA, or member-state scope
customer cohort and B2B/retail eligibility
function or access route
supported network where relevant
effective date and transition period
```

Publication evidence layers remain:

```text
A. asset-specific function evidence
B. current platform-wide service-state evidence
C. general service/licensing context without asset-specific function support
```

The article remains separate from raw monitoring output. Future material changes require reviewed source confirmation, editorial revision, date update, and revision-history entry.

## Phase A closure — complete

PR #308 completed known-unknown and placeholder integrity with:

```text
stable assets: 100
known unknowns: 289
assets with known-unknown coverage: 100
stale-over-30-days review queue: 44
structural placeholder findings: 0
```

PR #309 completed current monitoring-coverage recalculation against the checked-in 24-source configuration.

Reviewed PR #309 conclusions include:

```text
registered official sources: 24
assets reached by at least one registered source: 16
registered asset reach: 16.00%
uncovered assets: 84
organizations reached: 12
accepted sources: 0
accepted asset reach: 0
pending_initial_acceptance baselines: 24
```

Zero current checked-in coverage was recorded for:

```text
platform-policy sources
platform service-state sources
regulatory-register sources
market-access schema-capable sources
accepted baselines
```

The audit preserved these distinctions:

```text
registered source != accepted baseline
pending baseline != accepted monitoring coverage
issuer/protocol page != platform-policy coverage
regulatory action page != regulatory-register coverage
generic product page != function-level market-access coverage
source count != completeness score
```

Source and schema expansion remain reserved for PR #315-#317. Scheduled read-only operation remains PR #318.

## Phase B — non-UI release hardening — active

```text
PR #310 Registry v2/v3 and machine-readable parity
PR #311 counts, manifest, version, and provenance integrity
PR #312 reproducible build and generated-output audit
PR #313 audited 100-record canonical checkpoint
PR #314 non-UI release material
```

Phase B establishes reliable data and output parity before later monitoring, statistics, growth, and comparison work.

## Phase C — monitoring expansion and operation

```text
PR #315 100-asset monitoring baseline synchronization
PR #316 reserve and redemption source expansion
PR #317 lifecycle, regulatory, and EU market-access source/schema expansion
PR #318 bounded scheduled read-only monitoring
```

PR #317 expands the approved observation family. It does not create the later canonical Market Access Record family.

## Phase D — statistics implementation

```text
PR #319 deterministic statistics generator and validator
PR #320 immutable checkpoint history
PR #321 /stats/ foundation
PR #322 historical, deployment, organization, and data-quality statistics
```

Statistics derive from reviewed canonical data and must not become price, market-cap, yield, safety, transparency, or risk rankings.

The existing statistics phase remains unchanged. Post-110 extensions require a reviewed specification amendment and must not delay PR #319-#322.

## Phase E — controlled growth from 100 to 110

```text
PR #323 next candidate audit
PR #324 100 -> 102
PR #325 102 -> 104
PR #326 104 -> 106
PR #327 106 -> 108
PR #328 108 -> 110
```

Growth remains blocked until the preceding hardening, monitoring, statistics, and candidate-audit phases complete.

## Phase F — Comparison Foundation

Binding specification:

```text
docs/comparison-and-change-product-spec.md
```

```text
PR #329 define Comparison Readiness contract and audit method
PR #330 audit all 110 assets for comparison readiness
PR #331 normalize comparison-critical gaps and validators
PR #332 define canonical Market Access Record schema and governance
PR #333 define facet-freshness derivation contract and validators
```

This phase is data- and contract-first. Compare UI work must not begin before readiness and normalization are complete.

The audit preserves four analytical layers:

```text
asset lifecycle
issuance and redemption
legal and regulatory state
market access
```

The first three build on existing canonical record families. Market access becomes a separately governed canonical family and remains distinct from monitoring observations and editorial matrices.

## Phase G — Compare

```text
PR #334 deterministic comparison projection generator and machine-readable output
PR #335 /compare/ v1
PR #336 Compare presets
```

Compare presents factual materials under shared definitions. It does not score, rank, recommend, or fill missing values by inference.

## Phase H — Change Research Tools

```text
PR #337 access and regulation index generator
PR #338 Access & Regulation Explorer
PR #339 change-timeline projection generator
PR #340 Change Timeline UI
```

Access and regulation may share a discovery surface while retaining separate canonical record families. The timeline is a derived projection and does not replace source record families.

## Phase I — Reviewed Public Update Layer

```text
PR #341 SOG Registry Update feed/page
PR #342 Monthly Stablecoin Change Log
```

These surfaces derive from reviewed merged canonical changes. They are not raw monitoring feeds and are not automatic news digests.

## Optional Phase J — Query Translation

```text
PR #343+ natural-language filter translation after separate approval
```

This optional layer may translate natural-language requests into structured filters only after the structured product surfaces are stable. It must not bypass canonical evidence or unresolved-state semantics.
