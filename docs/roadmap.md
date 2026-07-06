# Stable or Gone Roadmap

Updated: 2026-07-06  
Status: canonical execution schedule — active

## Current position

```text
Current reviewed main checkpoint before PR #318:
9a106f0938e6323de833c941d6ae863050f1f03b

Canonical stable assets: 100
Organizations: 94
Relationships: 110
Events: 172
Evidence: 502
Public source identities: 456
Evidence relations: 502
Deployments: 140
Detail routes: 366
Production data and routes: healthy
UI status: maintenance-only; no active redesign program

PR #309 monitoring coverage recalculation: complete
PR #311 Registry v2/v3 and machine-readable parity: complete
PR #312 Ripple EU CASP guide update: complete
PR #313 first EEA-scope follow-up: closed without merge
PR #314 corrected guide follow-up: complete
PR #315 schedule amendment and PR renumbering: complete
PR #316 counts, manifest, version, and provenance integrity: complete
PR #317 reproducible build and generated-output audit: complete

Active workstream: non-UI release hardening
Current item: PR #318 audited 100-record canonical checkpoint
Next item: PR #319 non-UI release material
```

The dedicated UI correction program ended after PR #295. Verified UI defects may be corrected through narrow maintenance PRs, but UI work must not displace the core data, monitoring, statistics, record-growth, comparison, and change-research schedule without a deliberate roadmap amendment.

The July 6 editorial insertions and resulting PR renumbering are governed by:

```text
docs/roadmap-amendments/2026-07-06-editorial-insertions-and-pr-renumbering.md
```

For PR numbering, this roadmap and that amendment supersede older numeric labels in subordinate implementation plans and product specifications. Work order and scope remain unchanged.

## Completed foundation

```text
PR #296  resume core workstream and synchronize repository authority
PR #297  identity uniqueness and lineage audit
PR #298  organization and relationship integrity audit
PR #299  evidence and source-identity integrity audit
PR #300  reserve, redemption, and backing applicability audit
PR #301  deployment and chain identity audit
PR #302  lifecycle and relationship boundary audit
PR #303  EU market-access specification and schedule amendment
PR #304  reviewed market-access matrix and checkpoints 01-02
PR #305  checkpoint 03 schedule amendment
PR #306  function-matrix checkpoint 03 and platform service-state research
PR #307  reviewed EU/EEA market-access guide publication
PR #308  known-unknown and placeholder integrity audit
PR #309  monitoring coverage recalculation for all 100 canonical assets
PR #311  Registry v2/v3 and machine-readable parity
PR #312  Ripple EU CASP guide update
PR #313  first EEA-scope follow-up — closed without merge
PR #314  corrected guide follow-up
PR #315  schedule amendment and PR renumbering
PR #316  counts, manifest, version, and provenance integrity
PR #317  reproducible build and generated-output audit
```

The registry remains at the reviewed 100-record checkpoint.

## EU stablecoin market-access publication chain

```text
PR #303  specification and schedule amendment
PR #304  reviewed research matrix and checkpoints 01-02
PR #305  checkpoint 03 schedule amendment
PR #306  function-matrix research checkpoint 03
PR #307  reviewed guide publication
PR #312  Ripple EU CASP status update
PR #314  corrected latest reviewed update for EEA service scope
```

The dated guide is a reviewed editorial snapshot, not a monitoring output. Provider authorization, token-level status, platform service state, geography, customer cohort, function or access route, supported network, announcement date, effective date, and review date remain separate dimensions.

## 100-record audit boundaries

### Known-unknown integrity

```text
stable assets: 100
known unknowns: 289
assets with known-unknown coverage: 100
stale-over-30-days review queue: 44
structural placeholder findings: 0
critical findings after wording clarification: 0
```

Protected unresolved states remain:

```text
null
unknown
not_recorded
not_applicable
source_review_needed
```

### Monitoring coverage boundary

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

A registered source is not an accepted baseline. Issuer/protocol reach is not platform-policy coverage. Regulatory action pages are not regulatory-register coverage. A generic issuer or product page is not function-level market-access coverage.

### Registry v2/v3 parity boundary

PR #311 established the 100-asset additive parity checkpoint.

```text
stable assets: 100
organizations: 94
relationships: 110
events: 172
evidence: 502
known unknowns: 289
deployments: 140
legal profiles: 100
income profiles: 100
stable-asset relationships: 4
reserve components: 133
deployment view rows: 140
```

The public machine-readable contract remains Registry v2-compatible with additive Registry v3 summary data.

## PR #315 — schedule amendment and PR renumbering — complete

PR #315 recorded the inserted editorial work, preserved PR #313 as unmerged history, recorded PR #311 as the completed parity implementation, renumbered the remaining roadmap, and updated the workstream guard.

Merge checkpoint:

```text
4d90b6dffee88f45e3f985ef73ea973e83dfec2f
```

## PR #316 — counts, manifest, version, and provenance integrity — complete

Binding specification:

```text
docs/counts-manifest-version-provenance-integrity-spec.md
```

Binding baseline:

```text
docs/migration/registry-release-integrity-baseline.json
```

Supporting audit:

```text
docs/audits/counts-manifest-version-provenance-integrity-100-assets.md
```

Merged checkpoint:

```text
47c110b69ec7fd61121cbeee247f4ef12d466117
```

PR #316 tied composed canonical counts, public machine-readable count surfaces, route counts, and provenance semantics to the reviewed 100-asset checkpoint. It also aligned the checked-in provenance sentinel with current counts while preserving explicit sentinel semantics before build.

## PR #317 — reproducible build and generated-output audit — complete

Binding specification:

```text
docs/reproducible-build-generated-output-audit-spec.md
```

Binding baseline:

```text
docs/migration/reproducible-build-output-baseline.json
```

Supporting audit:

```text
docs/audits/reproducible-build-generated-output-audit-2026-07-06.md
```

Merged checkpoint:

```text
9a106f0938e6323de833c941d6ae863050f1f03b
```

PR #317 completed dependency-lock, pinned-runtime, deterministic-timestamp, generated-output-role, protected-input, and two-pass byte-reproducibility hardening.

Accepted reproducibility result:

```text
audited PR head: 41ae5cdc07f8e5bae74642cd6f8ada3c7ebba96f
output files: 414
total bytes: 15178769
tree SHA-256: 21fd8cbf5db373e1f0483dc5d74203b825c0203d08ba1ff7f34b8235495981a4
failures: 0
reproducible: true
```

## PR #318 — audited 100-record canonical checkpoint — active

Binding specification:

```text
docs/audited-100-asset-canonical-checkpoint-spec.md
```

Binding checkpoint:

```text
docs/migration/audited-100-asset-canonical-checkpoint.json
```

Supporting audit:

```text
docs/audits/audited-100-asset-canonical-checkpoint-2026-07-06.md
```

Purpose:

- bind the merged PR #317 main checkpoint as the reviewed 100-asset source state;
- record per-group count, identity digest, and content digest;
- record global canonical identity and content digests;
- link the PR #316 release-integrity baseline;
- link the PR #317 reproducible-build baseline and accepted output result;
- bind package-lock and package manifest digests;
- validate the checkpoint deterministically in general CI;
- verify production at the PR #317 merge commit through existing production checks.

Observed checkpoint:

```text
source commit: 9a106f0938e6323de833c941d6ae863050f1f03b
canonical files: 334
canonical content SHA-256: 8fa08219d1e587a0628576cdfcf0e64722348282897558016651a04ebea5a881
canonical identity SHA-256: cec075cd1fbe71d65370328ee2a43adca8534eacfe4922584b4392cf249265cd
```

Completion condition:

```text
binding checkpoint exists
checkpoint generator exists
checkpoint validator exists
general CI runs checkpoint validation
dedicated checkpoint workflow exists
source counts and digests match checkpoint
release and reproducibility baseline IDs match
package digests match
accepted PR #317 reproducibility result matches
production verifies PR #317 merge commit
roadmap and workstream guard show PR #318 active / PR #319 next
full CI and checkpoint workflow green
```

## Phase B — remaining non-UI release hardening

```text
PR #316 counts, manifest, version, and provenance integrity — complete
PR #317 reproducible build and generated-output audit — complete
PR #318 audited 100-record canonical checkpoint — active
PR #319 non-UI release material
```

Phase B establishes a reliable release boundary before monitoring and product expansion. It does not add Compare UI or the future canonical Market Access Record family.

## Phase C — monitoring expansion and operation

```text
PR #320 100-asset monitoring baseline synchronization
PR #321 reserve and redemption source expansion
PR #322 lifecycle, regulatory, and EU market-access source/schema expansion
PR #323 bounded scheduled read-only monitoring
```

PR #322 expands the approved observation family. It does not create the later canonical Market Access Record family.

Target schedule after PR #323:

```text
platform policy sources: daily
platform announcement sources: daily
news discovery: daily
ESMA and regulatory registers: weekly
issuer regulatory/transparency sources: weekly unless a stricter cadence is already defined
article stale-state review: weekly
```

Monitoring may observe, compare, classify, and create private review material. It may not write canonical data, edit guides automatically, mutate accepted baselines, create branches or pull requests automatically, publish candidates, or deploy.

## Phase D — statistics implementation

Binding specification:

```text
docs/stats-spec.md
```

```text
PR #324 deterministic statistics generator and validator
PR #325 immutable checkpoint history
PR #326 /stats/ foundation
PR #327 historical, deployment, organization, and data-quality statistics
```

Statistics derive from reviewed canonical data and must not become live price, market-cap, APY, safety, transparency, or risk rankings.

## Phase E — candidate audit and controlled growth from 100 to 110

```text
PR #328 next candidate audit
PR #329 100 -> 102
PR #330 102 -> 104
PR #331 104 -> 106
PR #332 106 -> 108
PR #333 108 -> 110
```

Each growth PR is limited to two new stable assets and must preserve all applicable supporting record groups. Unknown information remains explicit.

Phase E closes at a reviewed 110-asset checkpoint. Phase F may not begin before that checkpoint is complete and the roadmap transition is recorded.

## Phase F — Comparison Foundation

Binding specification:

```text
docs/comparison-and-change-product-spec.md
```

Current numbering is defined by this roadmap and the July 6 numbering amendment.

```text
PR #334 define Comparison Readiness contract and audit method
PR #335 audit all 110 assets for comparison readiness
PR #336 normalize comparison-critical gaps and validators
PR #337 define canonical Market Access Record schema and governance
PR #338 define facet-freshness derivation contract and validators
```

Phase F is data- and contract-first. It must preserve separate analytical layers for asset lifecycle, issuance/redemption, legal/regulatory state, and market access.

## Phase G — Compare

```text
PR #339 deterministic comparison projection generator and machine-readable output
PR #340 /compare/ v1
PR #341 Compare presets
```

Compare is a factual side-by-side research tool. It preserves unknown states, evidence scope, date scope, jurisdiction scope, and multi-select dimensions. It must not become a score, recommendation engine, live price table, market-cap ranking, or APY ranking.

## Phase H — Change Research Tools

```text
PR #342 access and regulation index generator
PR #343 Access & Regulation Explorer
PR #344 change-timeline projection generator
PR #345 Change Timeline UI
```

Access and regulation may share discovery surfaces while preserving distinct canonical record families. Change Timeline is a derived projection and must not replace source record families with a lossy generic event model.

A universal green/red country availability map is not approved because access can differ by platform, legal entity, customer scope, function, supported network, and date.

## Phase I — Reviewed Public Update Layer

```text
PR #346 SOG Registry Update feed/page
PR #347 Monthly Stablecoin Change Log
```

Public update surfaces derive from reviewed merged canonical changes. They are not raw monitoring feeds or automatic news digests.

## Optional Phase J — Query Translation

```text
PR #348+ natural-language filter translation only after separate approval
```

The natural-language layer may translate requests into structured filters. It must not bypass canonical data, evidence, unknown-state semantics, or scoped query constraints.

## Operating rules

- Repository specifications are the source of truth.
- UI remains maintenance-only until an approved product UI phase.
- Every non-trivial PR cites the exact specification, queue, audit, fixture, baseline, validator, publication-gate review, research checkpoint, and roadmap amendment it changes.
- Unknown values remain unknown unless reviewed evidence supports a value.
- Structural fake values in identity, URL, date, address, contract, or identifier fields are defects.
- Market-access research preserves function-level, service-state, legal-entity, geographic, customer-scope, payment-rail, network, and date distinctions.
- Monitoring executions remain read-only and never update their own accepted baseline.
- Monitoring observations and editorial research matrices are not canonical market-access records.
- Comparison projections derive from reviewed canonical data and preserve unresolved states.
- Growth PRs contain no more than two new stable assets.
- A phase transition updates this roadmap before the next implementation sequence continues.
- Inserted urgent factual corrections, verified breakage fixes, owner-directed dated editorial work, or security fixes must record consumed PR numbers before planned work resumes.

## Immediate next items

```text
1. Complete PR #318 audited 100-record canonical checkpoint.
2. Start PR #319 non-UI release material from current main.
3. Continue monitoring expansion in PR #320-#322 and scheduled read-only operation in PR #323.
4. Continue statistics in PR #324-#327.
5. Continue candidate audit and controlled growth in PR #328-#333.
6. After the reviewed 110-asset checkpoint, activate Phase F at PR #334.
```
