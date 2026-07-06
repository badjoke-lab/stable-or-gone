# Stable or Gone non-UI quality program

Status: canonical implementation plan — active  
Updated: 2026-07-06  
Registry checkpoint: 100 canonical stable assets

## Purpose

This program governs the core workstream after the dedicated UI correction program ended.

```text
100-record registry-wide audit — complete
-> EU market-access specification, research, publication, and reviewed updates — complete
-> known-unknown and placeholder integrity audit — complete
-> monitoring coverage recalculation — complete
-> Registry v2/v3 and machine-readable parity — complete
-> schedule normalization after inserted editorial work — complete
-> counts, manifest, version, and provenance integrity — complete
-> reproducible build and generated-output audit — complete
-> audited 100-record canonical checkpoint — active
-> non-UI release material
-> monitoring expansion and scheduled read-only operation
-> statistics implementation
-> controlled growth from 100 to 110
-> Comparison Foundation
-> Compare
-> Change Research Tools
-> Reviewed Public Update Layer
```

The canonical execution order and PR numbers are defined by `docs/roadmap.md` together with the active roadmap amendments.

UI remains maintenance-only until the roadmap reaches an approved product UI phase. Narrow verified maintenance may not silently consume planned roadmap work; consumed PR numbers must be recorded and the remaining plan renumbered before the main sequence resumes.

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

PR #311 Registry v2/v3 and machine-readable parity: complete
PR #312 Ripple EU CASP guide update: complete
PR #313 first EEA-scope follow-up: closed without merge
PR #314 corrected guide follow-up: complete
PR #315 schedule amendment and PR renumbering: complete
PR #316 counts, manifest, version, and provenance integrity: complete
PR #317 reproducible build and generated-output audit: complete
PR #318 audited 100-record canonical checkpoint: active
PR #319 guide article spacing maintenance: complete, inserted work
PR #320 non-UI release material: next planned item

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
docs/migration/registry-v3-parity-baseline.json
docs/audits/counts-manifest-version-provenance-integrity-100-assets.md
docs/reproducible-build-generated-output-audit-spec.md
docs/migration/reproducible-build-output-baseline.json
docs/audits/reproducible-build-generated-output-audit-2026-07-06.md
docs/audited-100-asset-canonical-checkpoint-spec.md
docs/migration/audited-100-asset-canonical-checkpoint.json
docs/audits/audited-100-asset-canonical-checkpoint-2026-07-06.md
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
- A global product page is not proof of EU/EEA service scope.
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
PR #247-#250   controlled growth through 98 records, with consumed-number deviations recorded
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
PR #319         guide article spacing maintenance, inserted work
```

The monitoring pipeline remains review-only:

```text
official-source observation
-> accepted-baseline comparison
-> change classification
-> private candidate
-> review material
-> evidence draft
-> draft PR material
-> human approval before canonical publication
```

It must not commit canonical data, accept its own baseline, publish, edit guides automatically, or deploy.

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

Source and schema expansion is scheduled for PR #322-#323. Scheduled read-only operation is PR #324.

## Phase B — non-UI release hardening — active

```text
PR #316 counts, manifest, version, and provenance integrity — complete
PR #317 reproducible build and generated-output audit — complete
PR #318 audited 100-record canonical checkpoint — active
PR #319 guide article spacing maintenance — complete, inserted work
PR #320 non-UI release material
```

PR #316 established the source-state contract tying canonical counts, machine-readable public count paths, route counts, and provenance semantics to the reviewed 100-asset checkpoint.

PR #317 established dependency-lock, pinned-runtime, deterministic timestamp, generated-output role, protected-input, and two-pass byte-reproducibility contracts.

PR #318 binds those contracts into a deterministic audited checkpoint. PR #319 was a narrow guide maintenance insertion and did not complete the planned release-material work. PR #320 now prepares non-UI release material.

## PR #318 checkpoint boundaries

Binding files:

```text
docs/audited-100-asset-canonical-checkpoint-spec.md
docs/migration/audited-100-asset-canonical-checkpoint.json
docs/audits/audited-100-asset-canonical-checkpoint-2026-07-06.md
scripts/generate-audited-100-checkpoint.mjs
scripts/validate-audited-100-checkpoint.mjs
scripts/check-production-audited-checkpoint.mjs
.github/workflows/audited-100-checkpoint.yml
```

The checkpoint binds:

```text
source commit 9a106f0938e6323de833c941d6ae863050f1f03b
334 canonical source files
Registry v2 group counts and digests
additive Registry v3 group counts and digests
global canonical content SHA-256
global canonical identity SHA-256
package-lock SHA-256
package.json SHA-256
PR #316 baseline ID
PR #317 baseline ID
PR #317 reproducible output tree result
production public-output/provenance/output-parity contract
production canonical hash/file-count/count parity contract
```

Observed global digests:

```text
canonical content:
8fa08219d1e587a0628576cdfcf0e64722348282897558016651a04ebea5a881

canonical identity:
cec075cd1fbe71d65370328ee2a43adca8534eacfe4922584b4392cf249265cd
```

PR #318 changes no canonical record content.

Production may contain a later noncanonical `main` release, including PR #319, only when public outputs, provenance, routes, canonical data hash, canonical file count, and reviewed counts remain consistent with the audited checkpoint.

## PR #317 reproducible-build boundaries

Binding files:

```text
docs/reproducible-build-generated-output-audit-spec.md
docs/migration/reproducible-build-output-baseline.json
.github/workflows/reproducible-build.yml
scripts/validate-reproducible-build-contract.mjs
scripts/capture-build-output-hashes.mjs
scripts/compare-build-output-hashes.mjs
```

Accepted result:

```text
output files: 414
total bytes: 15178769
tree SHA-256: 21fd8cbf5db373e1f0483dc5d74203b825c0203d08ba1ff7f34b8235495981a4
failures: 0
reproducible: true
```

Normal build must not rewrite `data/generated/registry-stats.json`.

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

Binding specification:

```text
docs/comparison-and-change-product-spec.md
```

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

Access and regulation may share a discovery surface while retaining separate canonical record families. The timeline is a derived projection and does not replace source record families.

## Phase I — Reviewed Public Update Layer

```text
PR #347 SOG Registry Update feed/page
PR #348 Monthly Stablecoin Change Log
```

These surfaces derive from reviewed merged canonical changes. They are not raw monitoring feeds and are not automatic news digests.

## Optional Phase J — Query Translation

```text
PR #349+ natural-language filter translation after separate approval
```

This optional layer may translate natural-language requests into structured filters only after the structured product surfaces are stable. It must not bypass canonical evidence or unresolved-state semantics.
