# Stable or Gone non-UI quality program

Status: canonical implementation plan — active  
Updated: 2026-07-06  
Registry checkpoint: 100 canonical stable assets

## Purpose

This program governs the core workstream after the dedicated UI correction program ended.

```text
100-record registry-wide audit through lifecycle boundaries — complete
-> EU market-access specification and research — complete
-> reviewed market-access article publication — complete
-> known-unknown and placeholder integrity audit — complete
-> monitoring coverage recalculation — active
-> non-UI release hardening
-> monitoring expansion and scheduled read-only operation
-> statistics implementation
-> controlled growth from 100 to 110
```

The canonical execution order and current PR number are defined by `docs/roadmap.md`.

UI is maintenance-only. A concrete verified UI defect may be corrected through a narrow PR, but UI work is not an active redesign program and must not displace this sequence without an explicit roadmap amendment.

The EU stablecoin market-access work is governed by:

```text
docs/quality/eu-stablecoin-market-access-research-and-monitoring-spec.md
```

The article is a dated reviewed snapshot, not a live dashboard and not an automatic monitoring output.

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
PR #309 monitoring coverage recalculation: active
PR #310 Registry v2/v3 and machine-readable parity: next
Monitoring foundation: implemented
Statistics specification: implemented as specification; page and public stats outputs not yet implemented
Growth beyond 100: not yet authorized until candidate audit phase
```

## Required reading order

Before changing canonical data, evidence, monitoring, statistics, workflows, quality documentation, or EU market-access editorial material:

1. `AGENTS.md`
2. `docs/spec-governance.md`
3. `docs/roadmap.md`
4. `docs/deployment-policy.md`
5. this document
6. the relevant canonical data, monitoring, editorial, or statistics specification
7. `docs/migration/registry-v3-baseline.json`
8. every queue, validator, fixture, baseline, supporting audit, publication-gate review, and research checkpoint named by the work item

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
- Platform-policy market access must be recorded by function/access route, service state, legal entity, customer scope, supported network where relevant, and geography.
- A platform licence is not proof of stablecoin function availability.
- A Global product page is not proof of EU/EEA service scope.
- A member-state page is not automatically an EEA-wide statement.
- Historical platform policy must be separated from later service-state changes.
- A market-access source change must not edit the public guide automatically.
- Registered source reach is not accepted baseline coverage.
- Issuer/protocol monitoring reach is not platform-policy coverage.
- Regulatory action pages are not regulatory-register coverage.
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
PR #284-#295   UI recovery and maintenance fixes; dedicated UI program now stopped
PR #296-#302   registry-wide audit through lifecycle and relationship boundaries
PR #303-#307   EU market-access specification, research, re-audit, and publication
PR #308         known-unknown and placeholder integrity audit
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
-> human approval before any canonical publication
```

The pipeline is review-only. It must not commit, open a pull request, update canonical data, mutate accepted baselines, publish, or deploy automatically.

## EU market-access insertion — complete

The research and publication sequence completed through PR #307. The final published article is current through 2026-07-06 and preserves:

```text
issuer identity
token regulatory path
CASP / service legal entity
payment-services layer where applicable
platform service state
EU / EEA / member-state scope
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

## Phase A closure item — PR #309 monitoring coverage recalculation

PR #308 completed known-unknown and placeholder integrity with:

```text
stable assets: 100
known unknowns: 289
assets with known-unknown coverage: 100
stale-over-30-days review queue: 44
structural placeholder findings: 0
```

PR #309 is the final audit/recalculation item before non-UI release hardening.

### PR #309 audit contract

Recalculate current coverage from the checked-in 24-source monitoring allowlist and current baseline state against all 100 canonical assets.

Coverage dimensions must be reported independently:

```text
issuer/protocol source reach
reserve/assurance reach
redemption/mint terms reach
issuer lifecycle reach
regulatory action/guidance reach
platform-policy reach
platform service-state reach
regulatory-register reach
EU/EEA market-access function reach
accepted-baseline reach
```

The audit must preserve these distinctions:

```text
registered source != accepted baseline
pending baseline != accepted monitoring coverage
issuer/protocol page != platform-policy coverage
regulatory action page != live regulatory-register coverage
generic product page != function-level market-access coverage
source count != completeness score
```

PR #309 may expose zero-coverage domains. It must not fill them through inference.

Explicit non-goals:

```text
no new platform-policy source additions
no market-access schema extension
no baseline acceptance
no workflow scheduling
no canonical writes
no automatic guide edits
no publication or deployment action
```

Those changes remain reserved for:

```text
PR #315 baseline synchronization
PR #316 reserve and redemption source expansion
PR #317 lifecycle, regulatory, and EU market-access source/schema expansion
PR #318 bounded scheduled read-only monitoring
```

## Phase B — non-UI release hardening

```text
PR #310 Registry v2/v3 and machine-readable parity
PR #311 counts, manifest, version, and provenance integrity
PR #312 reproducible build and generated-output audit
PR #313 audited 100-record canonical checkpoint
PR #314 non-UI release material
```

## Phase C — monitoring expansion and operation

```text
PR #315 100-asset monitoring baseline synchronization
PR #316 reserve and redemption source expansion
PR #317 lifecycle, regulatory, and EU market-access source/schema expansion
PR #318 bounded scheduled read-only monitoring
```

## Phase D — statistics implementation

```text
PR #319 deterministic statistics generator and validator
PR #320 immutable checkpoint history
PR #321 /stats/ foundation
PR #322 historical, deployment, organization, and data-quality statistics
```

Statistics derive from reviewed canonical data and must not become price, market-cap, yield, safety, transparency, or risk rankings.

## Phase E — controlled growth from 100 to 110

```text
PR #323 next candidate audit
PR #324 100 -> 102
PR #325 102 -> 104
PR #326 104 -> 106
PR #327 106 -> 108
PR #328 108 -> 110
```

Growth remains blocked until the preceding audit, hardening, monitoring, statistics, and candidate-audit phases complete.
