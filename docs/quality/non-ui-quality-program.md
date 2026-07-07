# Stable or Gone non-UI quality program

Status: canonical implementation plan — active  
Updated: 2026-07-06  
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
-> non-UI release material — active
-> monitoring expansion and scheduled read-only operation
-> statistics implementation
-> controlled growth from 100 to 110
-> Comparison Foundation
-> Compare
-> Change Research Tools
-> Reviewed Public Update Layer
```

The canonical execution order and PR numbers are defined by `docs/roadmap.md` and the active roadmap amendments.

UI remains maintenance-only until the roadmap reaches an approved product UI phase. Narrow verified maintenance may not silently consume planned roadmap work.

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

PR #316 release integrity: complete
PR #317 reproducible build audit: complete
PR #318 audited 100-record canonical checkpoint: complete
PR #319 guide article spacing maintenance: complete, inserted work
PR #320 non-UI release material: active
PR #321 100-asset monitoring baseline synchronization: next

Monitoring foundation: implemented
Statistics specification: implemented as specification; page and public stats outputs not yet implemented
Growth beyond 100: blocked until the candidate-audit phase
Post-110 comparison program: approved but inactive before the reviewed 110-asset checkpoint
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
8. every named baseline, validator, audit, queue, fixture, publication-gate review, and research checkpoint

Current release-hardening work must read:

```text
docs/counts-manifest-version-provenance-integrity-spec.md
docs/migration/registry-release-integrity-baseline.json
docs/reproducible-build-generated-output-audit-spec.md
docs/migration/reproducible-build-output-baseline.json
docs/audited-100-asset-canonical-checkpoint-spec.md
docs/migration/audited-100-asset-canonical-checkpoint.json
docs/non-ui-release-material-spec.md
docs/releases/100-asset-checkpoint-2026-07-06.md
```

## Fixed operating rules

- Repository specifications remain the source of truth.
- Unknown values remain unknown unless reviewed evidence supports a canonical value.
- Partial dates are not coerced into day-level dates.
- Candidate monitoring output never writes directly to canonical public data.
- Monitoring baselines are accepted only through a separate human-reviewed repository change.
- Monitoring executions remain read-only and do not update their own baseline.
- Platform-policy access preserves function or route, service state, legal entity, customer scope, supported network, geography, and dates.
- A platform licence is not proof of stablecoin function availability.
- Monitoring observations and editorial research matrices are not canonical Market Access Records.
- Comparison projections use reviewed canonical data only and preserve unresolved states.
- Facet freshness derives from authoritative record families rather than display-only root timestamps.
- No growth PR may contain more than two new stable assets.
- Ordinary merged changes publish from `main` under `docs/deployment-policy.md`.

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
PR #316         counts, manifest, version, and provenance integrity
PR #317         reproducible build and generated-output audit
PR #318         audited 100-record canonical checkpoint
PR #319         guide article spacing maintenance, inserted work
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

## 100-record quality boundaries

Known-unknown integrity:

```text
stable assets: 100
known unknowns: 289
assets with known-unknown coverage: 100
stale-over-30-days review queue: 44
structural placeholder findings: 0
```

Monitoring coverage recalculation:

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

Zero current checked-in coverage remains recorded for:

```text
platform-policy sources
platform service-state sources
regulatory-register sources
market-access schema-capable sources
accepted baselines
```

Monitoring baseline synchronization is PR #321. Source expansion is PR #322-#323. Scheduled read-only operation is PR #324.

## Phase B — non-UI release hardening — active

```text
PR #316 release integrity — complete
PR #317 reproducible build audit — complete
PR #318 audited 100-record canonical checkpoint — complete
PR #319 guide maintenance — complete, inserted work
PR #320 non-UI release material — active
```

PR #320 converts the reviewed checkpoint into accurate release material without changing canonical registry data.

Required outputs:

```text
README.md
docs/non-ui-release-material-spec.md
docs/releases/100-asset-checkpoint-2026-07-06.md
data/registry-updates.json
scripts/validate-non-ui-release-material.mjs
```

Release material must:

- use binding checkpoint counts and digests;
- distinguish checkpoint source from later noncanonical production sources;
- point to existing `/version.json`, `/data/manifest.json`, `/llms.txt`, and `/ai.txt` entry points;
- preserve public data-safety boundaries;
- avoid claims of complete monitoring or unimplemented product surfaces;
- avoid creating a second count authority.

## Phase C — monitoring expansion and operation

```text
PR #321 100-asset monitoring baseline synchronization
PR #322 reserve and redemption source expansion
PR #323 lifecycle, regulatory, and EU market-access source/schema expansion
PR #324 bounded scheduled read-only monitoring
```

PR #323 expands the approved observation family but does not create the later canonical Market Access Record family.

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

Growth remains blocked until release hardening, monitoring, statistics, and candidate audit complete.

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
