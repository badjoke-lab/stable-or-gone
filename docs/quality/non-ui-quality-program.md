# Stable or Gone non-UI quality program

Status: canonical implementation plan — active  
Updated: 2026-07-07  
Registry checkpoint: 100 canonical stable assets

## Purpose

This program governs the core workstream after the dedicated UI correction program ended.

```text
100-record registry-wide audit — complete
-> EU market-access research and reviewed guide publication — complete
-> known-unknown and placeholder integrity audit — complete
-> monitoring coverage recalculation — complete
-> Registry v2/v3 and machine-readable parity — complete
-> release integrity — complete
-> reproducible build audit — complete
-> audited 100-record canonical checkpoint — complete
-> non-UI release material — complete
-> monitoring baseline synchronization — complete
-> reserve and redemption source expansion — active
-> lifecycle/regulatory/access source and schema expansion
-> bounded scheduled read-only monitoring
-> statistics implementation
-> controlled growth from 100 to 110
-> Comparison Foundation
-> Compare
-> Change Research Tools
-> Reviewed Public Update Layer
```

The canonical execution order and PR numbers are defined by `docs/roadmap.md` and active roadmap amendments.

UI remains maintenance-only until the roadmap reaches an approved product UI phase. Narrow maintenance may not silently consume planned roadmap work.

## Current status

```text
Canonical stable assets: 100
Organizations: 94
Relationships: 110
Events: 172
Evidence: 502
Deployments: 140
Detail routes: 366

PR #316 release integrity: complete
PR #317 reproducible build audit: complete
PR #318 audited 100-record canonical checkpoint: complete
PR #319 guide spacing maintenance: complete, inserted work
PR #320 non-UI release material: complete
PR #321 100-asset monitoring baseline synchronization: complete
PR #322 reserve and redemption source expansion: active
PR #323 lifecycle, regulatory, and EU market-access source/schema expansion: next
```

## Required reading order

Before changing canonical data, evidence, workflows, monitoring, statistics, comparison surfaces, or release integrity:

1. `AGENTS.md`
2. `docs/spec-governance.md`
3. `docs/roadmap.md`
4. `docs/deployment-policy.md`
5. every active roadmap amendment named by the roadmap
6. this document
7. the canonical specification for the active work item
8. every named baseline, validator, audit, queue, fixture, release note, publication-gate review, and research checkpoint

Current PR #322 work must read:

```text
docs/quality/monitoring-pipeline-spec.md
docs/quality/monitoring-official-source-spec.md
docs/quality/monitoring-baseline-spec.md
docs/quality/monitoring-baseline-synchronization-100-assets-spec.md
docs/quality/monitoring-reserve-redemption-source-expansion-spec.md
scripts/monitoring/sources/official-sources.json
scripts/monitoring/baselines/official-source-baselines.json
scripts/monitoring/baselines/monitoring-baseline-sync-100-assets.json
scripts/monitoring/baselines/monitoring-reserve-redemption-expansion-100-assets.json
```

## Fixed operating rules

- Repository specifications remain the source of truth.
- Unknown values remain unknown unless reviewed evidence supports a canonical value.
- Partial dates are not coerced into day-level dates.
- Candidate monitoring output never writes directly to canonical public data.
- Monitoring baselines are accepted only through a separate human-reviewed repository change.
- Monitoring executions remain read-only and do not update their own baseline.
- Platform access preserves function, service state, legal entity, customer scope, supported network, geography, and dates.
- A platform licence is not proof of stablecoin function availability.
- Monitoring observations and editorial research matrices are not canonical Market Access Records.
- Comparison projections use reviewed canonical data only and preserve unresolved states.
- Facet freshness derives from authoritative record families rather than display-only root timestamps.
- No growth PR may contain more than two new stable assets.

## Completed foundation

```text
PR #217-#225  date, reserve, evidence, and traceability quality
PR #226-#229  deployment quality
PR #230-#245  review-only monitoring foundation and source coverage
PR #246         final-eight candidate audit
PR #247-#250   controlled growth through 98 records with recorded deviations
PR #278         rebuilt Growth D to 100 records from current implementation lineage
PR #279-#280   production verification and count-aware closure hardening
PR #284-#295   UI recovery and maintenance fixes; dedicated UI program stopped
PR #296-#302   registry-wide audit through lifecycle and relationship boundaries
PR #303-#307   EU market-access specification, research, re-audit, and publication
PR #308         known-unknown and placeholder integrity audit
PR #309         monitoring coverage recalculation
PR #311         Registry v2/v3 and machine-readable parity
PR #312         Ripple EU CASP guide update
PR #314         corrected guide follow-up
PR #315         schedule amendment and PR renumbering
PR #316         release integrity
PR #317         reproducible build audit
PR #318         audited 100-record canonical checkpoint
PR #319         guide maintenance, inserted work
PR #320         non-UI release material
PR #321         100-asset monitoring baseline synchronization
```

## Monitoring pipeline boundary

The monitoring pipeline remains review-only:

```text
official-source observation
-> accepted-baseline comparison
-> change classification
-> private candidate
-> review material
-> evidence draft
-> human approval before canonical publication
```

It must not commit canonical data, accept its own baseline, publish candidates, edit guides automatically, create automatic canonical PRs, or deploy.

## Historical PR #321 monitoring checkpoint

```text
sources: 24
baseline rows: 24
pending: 24
accepted: 0
registered asset reach: 16
uncovered assets: 84
covered organizations: 12
accepted asset reach: 0
multi-family assets: 7
```

Historical binding snapshot:

```text
scripts/monitoring/baselines/monitoring-baseline-sync-100-assets.json
```

The PR #321 snapshot is immutable. Successor source expansion uses a separate current snapshot.

## Current PR #322 monitoring boundary

```text
sources: 30
baseline rows: 30
pending: 30
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

Binding current snapshot:

```text
scripts/monitoring/baselines/monitoring-reserve-redemption-expansion-100-assets.json
```

PR #322 adds exactly six first-party source rows and six pending baseline rows for TUSD, EURA, EURCV, EURI, EURQ, and VCHF.

No baseline is accepted. Accepted asset reach remains zero.

## Phase B — release hardening — complete

```text
PR #316 release integrity — complete
PR #317 reproducible build audit — complete
PR #318 audited 100-record canonical checkpoint — complete
PR #319 guide maintenance — complete, inserted work
PR #320 non-UI release material — complete
```

## Phase C — monitoring expansion and operation — active

```text
PR #321 100-asset monitoring baseline synchronization — complete
PR #322 reserve and redemption source expansion — active
PR #323 lifecycle, regulatory, and EU market-access source/schema expansion
PR #324 bounded scheduled read-only monitoring
```

### PR #322 contract

Binding files:

```text
docs/quality/monitoring-reserve-redemption-source-expansion-spec.md
scripts/monitoring/baselines/monitoring-reserve-redemption-expansion-100-assets.json
scripts/validate-monitoring-reserve-redemption-expansion-100-assets.mjs
.github/workflows/monitoring-reserve-redemption-expansion.yml
```

PR #322:

- adds six reviewed first-party source rows;
- adds six matching pending baseline rows;
- increases registered asset reach from 16 to 22;
- reduces uncovered queue from 84 to 78;
- expands reserve/assurance asset reach from 11 to 16;
- expands redemption-terms asset reach from 7 to 12;
- keeps lifecycle and regulatory family counts unchanged;
- preserves historical PR #309/#321 checkpoints;
- keeps every baseline pending;
- keeps accepted coverage at zero;
- performs no network access during deterministic snapshot generation;
- performs no canonical action;
- creates no public monitoring output.

PR #323 handles lifecycle, regulatory, platform/access, and schema expansion. PR #324 alone activates bounded schedule triggers.

## Phase D — statistics implementation

```text
PR #325 deterministic statistics generator and validator
PR #326 immutable checkpoint history
PR #327 /stats/ foundation
PR #328 historical, deployment, organization, and data-quality statistics
```

Statistics derive from reviewed canonical data and must not become price, market-cap, APY, safety, transparency, or risk rankings.

## Phase E — candidate audit and controlled growth from 100 to 110

```text
PR #329 next candidate audit
PR #330 100 -> 102
PR #331 102 -> 104
PR #332 104 -> 106
PR #333 106 -> 108
PR #334 108 -> 110
```

Growth remains blocked until monitoring, statistics, and candidate audit complete.

## Phase F — Comparison Foundation

```text
PR #335 define Comparison Readiness contract and audit method
PR #336 audit all 110 assets for comparison readiness
PR #337 normalize comparison-critical gaps and validators
PR #338 define canonical Market Access Record schema and governance
PR #339 define facet-freshness derivation contract and validators
```

Phase F is data- and contract-first. Compare UI work must not begin before readiness and normalization are complete.

## Phase G — Compare

```text
PR #340 deterministic comparison projection generator and machine-readable output
PR #341 /compare/ v1
PR #342 Compare presets
```

Compare presents factual materials under shared definitions. It does not score, rank, recommend, or fill missing values by inference.

## Phase H — Change Research Tools

```text
PR #343 access and regulation index generator
PR #344 Access & Regulation Explorer
PR #345 change-timeline projection generator
PR #346 Change Timeline UI
```

Access and regulation may share a discovery surface while retaining separate canonical record families. Change Timeline is derived and does not replace source record families.

## Phase I — Reviewed Public Update Layer

```text
PR #347 SOG Registry Update feed/page
PR #348 Monthly Stablecoin Change Log
```

These future surfaces derive from reviewed merged canonical changes. They are not raw monitoring feeds or automatic news digests.

## Optional Phase J — Query Translation

```text
PR #349+ natural-language filter translation after separate approval
```

This optional layer may translate natural-language requests into structured filters only after structured product surfaces are stable. It must not bypass canonical evidence or unresolved-state semantics.
