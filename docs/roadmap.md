# Stable or Gone Roadmap

Updated: 2026-07-06  
Status: canonical execution schedule — active

## Current position

```text
Audited canonical source checkpoint:
9a106f0938e6323de833c941d6ae863050f1f03b

PR #318 merge checkpoint:
b275178f3816d1ebf3828f223b546f04de1edae7

Canonical stable assets: 100
Organizations: 94
Relationships: 110
Events: 172
Evidence: 502
Public source identities: 456
Evidence relations: 502
Deployments: 140
Detail routes: 366
UI status: maintenance-only; no active redesign program

PR #316 counts, manifest, version, and provenance integrity: complete
PR #317 reproducible build and generated-output audit: complete
PR #318 audited 100-record canonical checkpoint: complete
PR #319 guide article spacing maintenance: complete, inserted work

Active workstream: non-UI release hardening
Current item: PR #320 non-UI release material
Next item: PR #321 100-asset monitoring baseline synchronization
```

Current numbering authority:

```text
docs/roadmap-amendments/2026-07-06-editorial-insertions-and-pr-renumbering.md
docs/roadmap-amendments/2026-07-06-pr319-maintenance-and-renumbering.md
```

This roadmap and the active amendments supersede older numeric labels in subordinate plans. Work order and scope remain unchanged unless deliberately amended.

## Completed sequence through the 100-asset checkpoint

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
PR #318  audited 100-record canonical checkpoint
PR #319  guide article list clipping and spacing maintenance — inserted maintenance
```

The registry remains at the reviewed 100-asset checkpoint while Phase B closes.

## 100-record quality boundaries

### Known unknowns

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

Zero checked-in coverage remains recorded for:

```text
platform-policy sources
platform service-state sources
regulatory-register sources
market-access schema-capable sources
accepted baselines
```

A registered source is not an accepted baseline. Issuer/protocol reach is not platform-policy coverage. Regulatory action pages are not regulatory-register coverage. A generic issuer or product page is not function-level market-access coverage.

### Registry v2/v3 parity boundary

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

## PR #316 — release integrity — complete

Binding files:

```text
docs/counts-manifest-version-provenance-integrity-spec.md
docs/migration/registry-release-integrity-baseline.json
docs/audits/counts-manifest-version-provenance-integrity-100-assets.md
```

Merged checkpoint:

```text
47c110b69ec7fd61121cbeee247f4ef12d466117
```

PR #316 tied canonical counts, public machine-readable count surfaces, route counts, and provenance semantics to the reviewed 100-asset checkpoint.

## PR #317 — reproducible build — complete

Binding files:

```text
docs/reproducible-build-generated-output-audit-spec.md
docs/migration/reproducible-build-output-baseline.json
docs/audits/reproducible-build-generated-output-audit-2026-07-06.md
```

Merged checkpoint:

```text
9a106f0938e6323de833c941d6ae863050f1f03b
```

Accepted result:

```text
audited PR head: 41ae5cdc07f8e5bae74642cd6f8ada3c7ebba96f
output files: 414
total bytes: 15178769
tree SHA-256: 21fd8cbf5db373e1f0483dc5d74203b825c0203d08ba1ff7f34b8235495981a4
failures: 0
reproducible: true
```

## PR #318 — audited 100-asset canonical checkpoint — complete

Binding files:

```text
docs/audited-100-asset-canonical-checkpoint-spec.md
docs/migration/audited-100-asset-canonical-checkpoint.json
docs/audits/audited-100-asset-canonical-checkpoint-2026-07-06.md
```

Merge checkpoint:

```text
b275178f3816d1ebf3828f223b546f04de1edae7
```

Observed checkpoint:

```text
source commit: 9a106f0938e6323de833c941d6ae863050f1f03b
canonical files: 334
canonical content SHA-256: 8fa08219d1e587a0628576cdfcf0e64722348282897558016651a04ebea5a881
canonical identity SHA-256: cec075cd1fbe71d65370328ee2a43adca8534eacfe4922584b4392cf249265cd
```

PR #318 bound source counts, group identity/content digests, global canonical identity/content digests, package graph linkage, release-integrity baseline, reproducible-build baseline, accepted reproducibility result, current production provenance, exact output parity, and canonical checkpoint parity.

## PR #319 — guide article spacing maintenance — complete, inserted work

Actual merge:

```text
PR #319 Fix guide article list clipping and spacing
Merge commit: 547c639df35e39f657a77bbfd82a49a988877367
```

This was a narrow guide presentation fix and did not perform the planned non-UI release-material work. Remaining unused work was renumbered by:

```text
docs/roadmap-amendments/2026-07-06-pr319-maintenance-and-renumbering.md
```

## PR #320 — non-UI release material — active

Binding specification:

```text
docs/non-ui-release-material-spec.md
```

Required outputs:

```text
README.md
docs/releases/100-asset-checkpoint-2026-07-06.md
data/registry-updates.json
scripts/validate-non-ui-release-material.mjs
```

Purpose:

- replace stale 92-asset README claims with the reviewed 100-asset checkpoint;
- publish a repository release note tied to the audited checkpoint;
- add one reviewed checkpoint entry to the existing public update history;
- expose existing machine-readable entry points without creating a second count authority;
- state public data-safety and monitoring boundaries explicitly;
- state the approved next roadmap sequence without claiming unimplemented products.

PR #320 does not modify canonical asset, organization, event, evidence, reserve, relationship, deployment, or Registry v3 source records.

Completion condition:

```text
README matches the binding checkpoint
release note matches checkpoint counts, digests, baselines, and reproducibility result
reviewed update entry exists exactly once
release material validator passes
general CI runs release material validation
PR #318 remains reproducibly and canonically protected
authority shows PR #320 active / PR #321 next
full CI and relevant independent workflows green
```

## Phase B — non-UI release hardening

```text
PR #316 counts, manifest, version, and provenance integrity — complete
PR #317 reproducible build and generated-output audit — complete
PR #318 audited 100-record canonical checkpoint — complete
PR #319 guide article spacing maintenance — complete, inserted work
PR #320 non-UI release material — active
```

Phase B closes when PR #320 merges.

## Phase C — monitoring expansion and operation

```text
PR #321 100-asset monitoring baseline synchronization
PR #322 reserve and redemption source expansion
PR #323 lifecycle, regulatory, and EU market-access source/schema expansion
PR #324 bounded scheduled read-only monitoring
```

PR #323 expands the approved observation family. It does not create the later canonical Market Access Record family.

Target schedule after PR #324:

```text
platform policy sources: daily
platform announcement sources: daily
news discovery: daily
ESMA and regulatory registers: weekly
issuer regulatory/transparency sources: weekly unless stricter cadence applies
article stale-state review: weekly
```

Monitoring may observe, compare, classify, and create private review material. It may not write canonical data, edit guides automatically, mutate accepted baselines, create branches or canonical PRs automatically, publish candidates, or deploy.

## Phase D — statistics implementation

Binding specification:

```text
docs/stats-spec.md
```

```text
PR #325 deterministic statistics generator and validator
PR #326 immutable checkpoint history
PR #327 /stats/ foundation
PR #328 historical, deployment, organization, and data-quality statistics
```

Statistics derive from reviewed canonical data and must not become live price, market-cap, APY, safety, transparency, or risk rankings.

## Phase E — candidate audit and controlled growth from 100 to 110

```text
PR #329 next candidate audit
PR #330 100 -> 102
PR #331 102 -> 104
PR #332 104 -> 106
PR #333 106 -> 108
PR #334 108 -> 110
```

Each growth PR is limited to two new stable assets and must preserve all applicable supporting record groups. Unknown information remains explicit.

Phase E closes at a reviewed 110-asset checkpoint. Phase F may not begin before that checkpoint is complete.

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

Phase F is data- and contract-first. It preserves separate analytical layers for asset lifecycle, issuance/redemption, legal/regulatory state, and market access.

## Phase G — Compare

```text
PR #340 deterministic comparison projection generator and machine-readable output
PR #341 /compare/ v1
PR #342 Compare presets
```

Compare is a factual side-by-side research tool. It preserves unknown states, evidence scope, date scope, jurisdiction scope, and multi-select dimensions. It must not become a score, recommendation engine, live price table, market-cap ranking, or APY ranking.

## Phase H — Change Research Tools

```text
PR #343 access and regulation index generator
PR #344 Access & Regulation Explorer
PR #345 change-timeline projection generator
PR #346 Change Timeline UI
```

Access and regulation may share discovery surfaces while preserving distinct canonical record families. Change Timeline is a derived projection and must not replace source record families with a lossy generic event model.

A universal green/red country availability map is not approved because access can differ by platform, legal entity, customer scope, function, supported network, and date.

## Phase I — Reviewed Public Update Layer

```text
PR #347 SOG Registry Update feed/page
PR #348 Monthly Stablecoin Change Log
```

Public update surfaces derive from reviewed merged canonical changes. They are not raw monitoring feeds or automatic news digests.

## Optional Phase J — Query Translation

```text
PR #349+ natural-language filter translation only after separate approval
```

The natural-language layer may translate requests into structured filters. It must not bypass canonical data, evidence, unknown-state semantics, or scoped query constraints.

## Operating rules

- Repository specifications are the source of truth.
- UI remains maintenance-only until an approved product UI phase.
- Every non-trivial PR cites the exact specification, queue, audit, fixture, baseline, validator, publication-gate review, research checkpoint, and roadmap amendment it changes.
- Unknown values remain unknown unless reviewed evidence supports a value.
- Structural fake values in identity, URL, date, address, contract, or identifier fields are defects.
- Monitoring executions remain read-only and never update their own accepted baseline.
- Monitoring observations and editorial research matrices are not canonical Market Access Records.
- Comparison projections derive from reviewed canonical data and preserve unresolved states.
- Growth PRs contain no more than two new stable assets.
- A phase transition updates this roadmap before the next implementation sequence continues.
- Inserted urgent factual corrections, verified breakage fixes, dated editorial work, or narrow maintenance must record consumed PR numbers before planned work resumes.

## Immediate next items

```text
1. Complete PR #320 non-UI release material.
2. Start PR #321 100-asset monitoring baseline synchronization.
3. Continue monitoring expansion in PR #322-#323 and scheduled read-only operation in PR #324.
4. Continue statistics in PR #325-#328.
5. Continue candidate audit and controlled growth in PR #329-#334.
6. After the reviewed 110-asset checkpoint, activate Phase F at PR #335.
```
