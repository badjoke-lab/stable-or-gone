# Stable or Gone Roadmap

Updated: 2026-07-07  
Status: canonical execution schedule — active

## Current position

```text
Audited canonical source checkpoint:
9a106f0938e6323de833c941d6ae863050f1f03b

PR #318 merge checkpoint:
b275178f3816d1ebf3828f223b546f04de1edae7

PR #320 merge checkpoint:
5c742177ee52aa661a115b7c5364526d8ad46aef

PR #321 merge checkpoint:
ec7c41142977114c111409a2aa6584e0480e7454

Canonical stable assets: 100
Organizations: 94
Relationships: 110
Events: 172
Evidence: 502
Deployments: 140
Detail routes: 366
UI status: maintenance-only; no active redesign program

PR #316 release integrity: complete
PR #317 reproducible build audit: complete
PR #318 audited 100-record canonical checkpoint: complete
PR #319 guide spacing maintenance: complete, inserted work
PR #320 non-UI release material: complete
PR #321 100-asset monitoring baseline synchronization: complete

Active workstream: monitoring expansion and operation
Current item: PR #322 reserve and redemption source expansion
Next item: PR #323 lifecycle, regulatory, and EU market-access source/schema expansion
```

Current numbering authority:

```text
docs/roadmap-amendments/2026-07-06-editorial-insertions-and-pr-renumbering.md
docs/roadmap-amendments/2026-07-06-pr319-maintenance-and-renumbering.md
```

This roadmap and active amendments supersede older numeric labels in subordinate plans. Work order and scope remain unchanged unless deliberately amended.

## Completed sequence through PR #321

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
PR #309  monitoring coverage recalculation for 100 assets
PR #311  Registry v2/v3 and machine-readable parity
PR #312  Ripple EU CASP guide update
PR #313  first EEA-scope follow-up — closed without merge
PR #314  corrected guide follow-up
PR #315  schedule amendment and PR renumbering
PR #316  release integrity
PR #317  reproducible build audit
PR #318  audited 100-record canonical checkpoint
PR #319  guide spacing maintenance — inserted work
PR #320  non-UI release material
PR #321  100-asset monitoring baseline synchronization
```

## Audited 100-asset checkpoint

Binding checkpoint:

```text
docs/migration/audited-100-asset-canonical-checkpoint.json
```

```text
source commit: 9a106f0938e6323de833c941d6ae863050f1f03b
canonical files: 334
canonical content SHA-256: 8fa08219d1e587a0628576cdfcf0e64722348282897558016651a04ebea5a881
canonical identity SHA-256: cec075cd1fbe71d65370328ee2a43adca8534eacfe4922584b4392cf249265cd
```

Registry boundary:

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
detail routes: 366
```

Protected unresolved states remain:

```text
null
unknown
not_recorded
not_applicable
source_review_needed
```

## Monitoring history and current boundary

### Historical PR #321 synchronization checkpoint

Binding historical snapshot:

```text
scripts/monitoring/baselines/monitoring-baseline-sync-100-assets.json
```

```text
sources: 24
baseline rows: 24
pending: 24
accepted: 0
missing: 0
registered asset reach: 16
uncovered assets: 84
covered organizations: 12
accepted asset reach: 0
multi-family assets: 7
```

The PR #321 snapshot is historical and immutable. Later source expansion is recorded in successor snapshots rather than overwriting PR #321 history.

### PR #322 current reserve/redemption expansion boundary

Binding specification:

```text
docs/quality/monitoring-reserve-redemption-source-expansion-spec.md
```

Binding current snapshot:

```text
scripts/monitoring/baselines/monitoring-reserve-redemption-expansion-100-assets.json
```

PR #322 adds six first-party source rows and six matching pending baseline rows for:

```text
TUSD
EURA
EURCV
EURI
EURQ
VCHF
```

Current deterministic boundary:

```text
sources: 30
baseline rows: 30
source/baseline ID parity: true
pending_initial_acceptance: 30
accepted: 0
missing: 0
registered asset reach: 22
uncovered assets: 78
covered organizations: 18
accepted asset reach: 0
multi-family assets: 11
```

Current source-family reach:

```text
reserve_assurance: 14 sources / 16 assets
redemption_terms: 11 sources / 12 assets
issuer_lifecycle: 5 sources / 5 assets
regulatory: 5 sources / 5 assets
```

Current expansion digests:

```text
asset sync SHA-256:
c9005a7ab4ad6a69de03058d19e0c0cf62cd792025788362293aa80caf8f5240

organization sync SHA-256:
d48c0dc2c6fef802b96c35973bdb72a428879ca861d0aec588ccb96f9232b316

source/baseline sync SHA-256:
53f13c8d231e69593afd3ebca59c77f2b80702ccab9cc1f5071c19a7bb43c834

uncovered asset queue SHA-256:
3e89c2e87db491290221630512afba56bb75752076e61ebb81d1cdf9188df8c0
```

Zero checked-in coverage remains recorded for:

```text
platform-policy sources
platform service-state sources
regulatory-register sources
market-access schema-capable sources
accepted baselines
```

A registered source is not an accepted baseline. A pending baseline is not accepted monitoring coverage. Issuer/protocol reach is not platform-policy coverage. Regulatory action pages are not regulatory-register coverage. A generic issuer or product page is not function-level market-access coverage.

## PR #322 — reserve and redemption source expansion — active

Purpose:

- add six approved first-party reserve/redemption source rows;
- add six matching pending baseline rows;
- preserve zero accepted baselines and zero accepted asset reach;
- increase registered asset reach from 16 to 22;
- reduce uncovered queue from 84 to 78;
- increase reserve/assurance family reach from 11 to 16 assets;
- increase redemption-terms family reach from 7 to 12 assets;
- preserve lifecycle and regulatory family counts unchanged;
- preserve historical PR #309/#321 checkpoints;
- validate current 30-source state with deterministic snapshot digests;
- keep monitoring private, read-only, review-only, and non-publishing.

Completion condition:

```text
six approved source rows exist
six matching pending baseline rows exist
all 30 baselines remain pending
accepted baseline count remains zero
accepted asset reach remains zero
historical PR #321 snapshot remains unchanged and valid
current PR #322 snapshot matches deterministic observation exactly
current monitoring configuration validates 30 sources and 30 baselines
current coverage validates reach 22 / uncovered 78
monitoring validation chain includes PR #322 validator
dedicated reserve/redemption expansion workflow passes
authority shows PR #322 active / PR #323 next
full CI and monitoring-related workflows green
```

## Phase C — monitoring expansion and operation — active

```text
PR #321 100-asset monitoring baseline synchronization — complete
PR #322 reserve and redemption source expansion — active
PR #323 lifecycle, regulatory, and EU market-access source/schema expansion
PR #324 bounded scheduled read-only monitoring
```

PR #322 adds only reserve/assurance/redemption source coverage. PR #323 handles lifecycle, regulatory, platform/access, and schema expansion. PR #324 alone activates bounded schedule triggers.

Target schedule after PR #324:

```text
platform policy sources: daily
platform announcement sources: daily
news discovery: daily
ESMA and regulatory registers: weekly
issuer regulatory/transparency sources: weekly unless stricter cadence applies
article stale-state review: weekly
```

Monitoring may observe, compare, classify, and create private review material. It may not write canonical data, accept its own baselines, edit guides automatically, create canonical pull requests automatically, publish candidates, or deploy.

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

Phase F is data- and contract-first. Lifecycle, issuance/redemption, legal/regulatory state, and market access remain separate analytical layers.

## Phase G — Compare

```text
PR #340 deterministic comparison projection generator and machine-readable output
PR #341 /compare/ v1
PR #342 Compare presets
```

Compare is factual side-by-side research. It preserves unknown states, evidence scope, date scope, jurisdiction scope, and multi-select dimensions. It must not become a score, recommendation engine, live price table, market-cap ranking, or APY ranking.

## Phase H — Change Research Tools

```text
PR #343 access and regulation index generator
PR #344 Access & Regulation Explorer
PR #345 change-timeline projection generator
PR #346 Change Timeline UI
```

Access and regulation may share discovery surfaces while preserving distinct canonical record families. Change Timeline is derived and must not replace source record families with a lossy generic event model.

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
- Unknown values remain unknown unless reviewed evidence supports a value.
- Monitoring executions remain read-only and never update their own accepted baseline.
- Registered source reach is not accepted monitoring coverage.
- Monitoring observations and editorial research matrices are not canonical Market Access Records.
- Comparison projections derive from reviewed canonical data and preserve unresolved states.
- Growth PRs contain no more than two new stable assets.
- A phase transition updates this roadmap before the next implementation sequence continues.
- Inserted work must record consumed PR numbers before planned work resumes.

## Immediate next items

```text
1. Complete PR #322 reserve and redemption source expansion.
2. Start PR #323 lifecycle, regulatory, and EU market-access source/schema expansion.
3. Activate bounded scheduled read-only monitoring in PR #324.
4. Continue statistics in PR #325-#328.
5. Continue candidate audit and controlled growth in PR #329-#334.
6. After the reviewed 110-asset checkpoint, activate Phase F at PR #335.
```
