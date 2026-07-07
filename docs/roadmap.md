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

PR #322 merge checkpoint:
3f1cd3e603f39a5327febc2b376b652897c1b825

PR #323 merge checkpoint:
9f588537b82bc1ed916e65114ce9877f812cd634

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
PR #322 reserve and redemption source expansion: complete
PR #323 lifecycle, regulatory, and EU market-access source/schema expansion: complete

Active workstream: monitoring expansion and operation
Current item: PR #324 bounded scheduled read-only monitoring
Next item: PR #325 deterministic statistics generator and validator
```

Current numbering authority:

```text
docs/roadmap-amendments/2026-07-06-editorial-insertions-and-pr-renumbering.md
docs/roadmap-amendments/2026-07-06-pr319-maintenance-and-renumbering.md
```

This roadmap and active amendments supersede older numeric labels in subordinate plans.

## Completed sequence through PR #323

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
PR #322  reserve and redemption source expansion
PR #323  lifecycle, regulatory, and EU market-access source/schema expansion
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

## Monitoring checkpoint history

### Historical PR #321 synchronization checkpoint

```text
snapshot:
scripts/monitoring/baselines/monitoring-baseline-sync-100-assets.json

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

### Historical PR #322 reserve/redemption expansion checkpoint

```text
snapshot:
scripts/monitoring/baselines/monitoring-reserve-redemption-expansion-100-assets.json

sources: 30
baseline rows: 30
pending: 30
accepted: 0
registered asset reach: 22
uncovered assets: 78
covered organizations: 18
accepted asset reach: 0
multi-family assets: 11
```

PR #322 historical family reach:

```text
reserve_assurance: 14 sources / 16 assets
redemption_terms: 11 sources / 12 assets
issuer_lifecycle: 5 sources / 5 assets
regulatory: 5 sources / 5 assets
platform_policy: 0
platform_service_state: 0
regulatory_register: 0
market-access schema-capable sources: 0
```

Historical snapshots are immutable. Successor expansion records current state separately.

## PR #323 current monitoring boundary

Binding specification:

```text
docs/quality/monitoring-lifecycle-regulatory-market-access-expansion-spec.md
```

Binding current snapshot:

```text
scripts/monitoring/baselines/monitoring-lifecycle-regulatory-market-access-expansion-100-assets.json
```

Current deterministic boundary:

```text
sources: 39
baseline rows: 39
source/baseline ID parity: true
pending_initial_acceptance: 39
accepted: 0
missing: 0
registered asset reach: 23
uncovered assets: 77
covered organizations: 18
accepted asset reach: 0
multi-family assets: 17
```

Current source-family reach:

```text
reserve_assurance: 14 sources / 16 assets
redemption_terms: 11 sources / 12 assets
issuer_lifecycle: 7 sources / 7 assets
regulatory: 9 sources / 8 assets
platform_policy: 3 sources / 12 mapped assets
platform_service_state: 1 source / 0 mapped assets
regulatory_register: 1 source / 0 mapped assets
```

Current scoped coverage:

```text
platform-policy sources: 3
platform service-state sources: 1
regulatory-register sources: 1
market-access schema-capable sources: 5
scoped platforms: 4
scoped region values: 4
```

Platform/register scope is not divided by the 100-asset denominator.

Current digests:

```text
asset sync SHA-256:
aad839e01ce17ce9904a3a10de4fbb48155a1aeba214694c3545209a4b5329c4

organization sync SHA-256:
89b8bbecbbf24ef827111f57ced2309165b621f3ec20c3b499f729255c00f92a

source/baseline sync SHA-256:
088c6b6f9d8706be3eadc4a92a90f847f7c66c9dcd049ffc095b02c787a80a95

monitoring scope SHA-256:
763e383489cc33cdfbf8227a49eaa0a747255bc4cc9d10ac76677dd4b35a4282

uncovered asset queue SHA-256:
3e68607f3edeee151db90ef9f7ac4652977afaea80da9a54fbd73ec492c32329
```

## PR #323 — lifecycle, regulatory, and EU market-access source/schema expansion — complete

PR #323 added four bounded issuer lifecycle/regulatory sources and five scoped platform/register sources.

Issuer lifecycle/regulatory additions:

```text
ripple-eu-emi-license
ripple-preliminary-mica-casp
banking-circle-euri-launch
sgforge-eurcv-stablecoin-elevation
```

Scoped market-access/register additions:

```text
binance-eea-stablecoin-policy
kraken-eea-stablecoin-offerings
bitstamp-europe-mica-assets
gemini-eea-account-closure
esma-mica-interim-register-hub
```

PR #323:

- added reviewed `monitoring_scope` metadata;
- separated platform policy, platform service state, and regulatory-register scope;
- preserved platform legal entity, region, function, and register family context;
- propagated scope into private observations and private review candidates;
- avoided fake canonical platform or issuer IDs;
- separated platform/register counts from the 100-asset denominator;
- kept every baseline pending;
- preserved zero accepted coverage;
- kept monitoring private, review-only, read-only, and non-publishing.

## PR #324 — bounded scheduled read-only monitoring — active

Binding specification:

```text
docs/quality/monitoring-bounded-scheduled-read-only-spec.md
```

PR #324 activates two deterministic scheduled groups:

```text
daily
weekly
```

Daily group:

```text
platform_policy sources
platform_service_state sources
bounded private news discovery

reviewed official sources: 4
```

Weekly group:

```text
all remaining reviewed official sources
issuer reserve/transparency sources
redemption and mint-term sources
issuer lifecycle sources
issuer/token regulatory sources
regulatory action sources
ESMA regulatory-register source
article/research stale-state review

reviewed official sources: 35
```

Partition contract:

```text
daily sources: 4
weekly sources: 35
overlap: 0
union: all 39 reviewed sources
source/baseline parity: true for both groups
all repository baselines remain pending: true
```

Bounded news-discovery contract:

```text
maximum queries per run: 4
maximum items retained per query: 20
maximum response body per feed: 1 MiB
raw response retention: false
discovery only: true
canonical action: none
public output: false
```

Article stale-state review is weekly and read-only. It may flag review_due, stale, severely_stale, or missing_date states but may not edit the guide, research matrix, or canonical data.

Workflow permissions remain:

```text
contents: read
```

The scheduled workflow may upload private artifacts. It may not write canonical data, accept its own baselines, edit guides automatically, create branches or canonical pull requests automatically, publish candidates or discovery leads, or deploy monitoring output.

Completion condition:

```text
daily selector contains exactly 4 reviewed sources
weekly selector contains exactly 35 reviewed sources
daily/weekly overlap is zero
daily/weekly union is all 39 reviewed sources
source/baseline parity is exact for each group
all 39 baselines remain pending
accepted baseline count remains zero
accepted asset reach remains zero
bounded news discovery fixture passes
article stale-state fixture passes
daily scheduled runner fixture passes
weekly scheduled runner fixture passes
manual monitoring remains backward compatible
scheduled workflow uses contents: read only
full monitoring chain passes
authority shows PR #324 active / PR #325 next
full CI and independent audit workflows are green
```

## Phase C — monitoring expansion and operation — active

```text
PR #321 100-asset monitoring baseline synchronization — complete
PR #322 reserve and redemption source expansion — complete
PR #323 lifecycle, regulatory, and EU market-access source/schema expansion — complete
PR #324 bounded scheduled read-only monitoring — active
```

Target cadence under PR #324:

```text
platform policy sources: daily
platform service-state / platform announcement sources: daily
news discovery: daily
ESMA and regulatory registers: weekly
issuer regulatory/transparency sources: weekly unless stricter cadence applies
article stale-state review: weekly
```

Monitoring may observe, compare, classify, create private review material, create private discovery leads, and create private stale-state reports. It may not write canonical data, accept its own baselines, edit guides automatically, create canonical pull requests automatically, publish candidates or leads, or deploy.

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

Each growth PR is limited to two new stable assets and preserves all applicable supporting record groups. Phase E closes at a reviewed 110-asset checkpoint.

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

Phase F starts only after the reviewed 110-asset checkpoint.

## Phase G — Compare

```text
PR #340 deterministic comparison projection generator and machine-readable output
PR #341 /compare/ v1
PR #342 Compare presets
```

Compare is factual side-by-side research and must not become a score or recommendation engine.

## Phase H — Change Research Tools

```text
PR #343 access and regulation index generator
PR #344 Access & Regulation Explorer
PR #345 change-timeline projection generator
PR #346 Change Timeline UI
```

## Phase I — Reviewed Public Update Layer

```text
PR #347 SOG Registry Update feed/page
PR #348 Monthly Stablecoin Change Log
```

Public update surfaces derive from reviewed merged canonical changes, not raw monitoring feeds.

## Optional Phase J — Query Translation

```text
PR #349+ natural-language filter translation only after separate approval
```

## Operating rules

- Repository specifications are the source of truth.
- UI remains maintenance-only until an approved product UI phase.
- Unknown values remain unknown unless reviewed evidence supports a value.
- Monitoring executions remain read-only and never update their own accepted baseline.
- Scheduled monitoring output remains private artifact material.
- Registered source reach is not accepted monitoring coverage.
- Issuer/protocol reach is not platform-policy coverage.
- Regulatory action pages are not regulatory-register coverage.
- Monitoring observations and editorial research matrices are not canonical Market Access Records.
- News-discovery leads are not canonical facts or public content.
- Stale-state findings do not edit public guides automatically.
- Platform policy, service state, issuer/token regulation, CASP authorization, geography, and function scope remain separate.
- Comparison projections derive from reviewed canonical data and preserve unresolved states.
- Growth PRs contain no more than two new stable assets.
- A phase transition updates this roadmap before the next implementation sequence continues.

## Immediate next items

```text
1. Complete PR #324 bounded scheduled read-only monitoring.
2. Start PR #325 deterministic statistics generator and validator.
3. Continue statistics through PR #328.
4. Continue candidate audit and controlled growth in PR #329-#334.
5. After the reviewed 110-asset checkpoint, activate Phase F at PR #335.
```
