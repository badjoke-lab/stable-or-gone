# Stable or Gone Roadmap

Updated: 2026-07-08  
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

PR #324 merge checkpoint:
f4d54293862168356f8314d8b6f0d79004873dcf

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
PR #324 bounded scheduled read-only monitoring: complete

Active workstream: statistics implementation
Current item: PR #325 deterministic statistics generator and validator
Next item: PR #326 immutable checkpoint history
```

## Current numbering authority

```text
docs/roadmap-amendments/2026-07-06-editorial-insertions-and-pr-renumbering.md
docs/roadmap-amendments/2026-07-06-pr319-maintenance-and-renumbering.md
docs/roadmap-amendments/2026-07-08-pr325-statistics-activation.md
```

This roadmap and active amendments supersede older numeric labels or stale current-position wording in subordinate plans.

## Completed sequence through PR #324

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
PR #324  bounded scheduled read-only monitoring
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

### PR #321 historical synchronization checkpoint

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

### PR #322 historical reserve/redemption expansion checkpoint

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

### PR #323 current reviewed monitoring boundary

Binding specification:

```text
docs/quality/monitoring-lifecycle-regulatory-market-access-expansion-spec.md
```

Binding current snapshot:

```text
scripts/monitoring/baselines/monitoring-lifecycle-regulatory-market-access-expansion-100-assets.json
```

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

## Phase C — monitoring expansion and operation — complete

```text
PR #321 100-asset monitoring baseline synchronization — complete
PR #322 reserve and redemption source expansion — complete
PR #323 lifecycle, regulatory, and EU market-access source/schema expansion — complete
PR #324 bounded scheduled read-only monitoring — complete
```

PR #324 completed deterministic daily and weekly monitoring groups.

```text
daily reviewed official sources: 4
weekly reviewed official sources: 35
overlap: 0
union: all 39 reviewed sources
source/baseline parity: exact for both groups
all 39 repository baselines: pending_initial_acceptance
accepted baselines: 0
accepted asset reach: 0
```

Target cadence:

```text
platform policy sources: daily
platform service-state / platform announcement sources: daily
bounded news discovery: daily
ESMA and regulatory registers: weekly
issuer regulatory/transparency sources: weekly unless stricter cadence applies
article stale-state review: weekly
```

Monitoring output remains private artifact material. Monitoring may observe, compare, classify, prepare private review material, discover bounded news leads, and report stale review state. It may not write canonical data, accept its own baselines, create canonical pull requests automatically, edit guides automatically, publish candidates or leads, or deploy monitoring output.

## Phase D — statistics implementation — active

Binding specification:

```text
docs/stats-spec.md
```

```text
PR #325 deterministic statistics generator and validator — active
PR #326 immutable checkpoint history — next
PR #327 /stats/ foundation
PR #328 historical, deployment, organization, and data-quality statistics
```

### PR #325 active contract

PR #325 derives statistics only from reviewed canonical Registry v2 and Registry v3 inputs.

Required outputs and checks:

```text
canonical input loader driven by registry manifests
deterministic statistics model
generated private CI artifact
canonical total parity
single-select denominator integrity
multi-select semantics preserved
unknown values preserved
candidate/monitoring/editorial/private inputs excluded
live market metrics excluded
same inputs produce byte-equivalent model output
```

PR #325 does not publish `/data/stats.json`, create or mutate immutable `stats-history.json` checkpoints, or implement `/stats/` UI.

Statistics must not become live price, market-cap, APY, yield ranking, safety, transparency, or risk rankings.

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
- Candidate, monitoring, discovery, stale-state, editorial-research, and private material remain outside canonical statistics inputs.
- Historical monitoring snapshots remain immutable.
- Monitoring executions remain read-only and never update their own accepted baseline.
- Registered source reach is not accepted monitoring coverage.
- Issuer/protocol reach is not platform-policy coverage.
- Regulatory action pages are not regulatory-register coverage.
- Monitoring observations and editorial research matrices are not canonical Market Access Records.
- News-discovery leads are not canonical facts or public content.
- Statistics use reviewed canonical repository data only.
- Multi-select dimensions are not presented as mutually exclusive.
- Unknown categories are not silently dropped.
- Live market, price, market-cap, APY, yield-ranking, safety-score, and risk-score data are excluded from canonical stats output.
- Growth PRs contain no more than two new stable assets.
- A phase transition updates this roadmap before the next implementation sequence continues.

## Immediate next items

```text
1. Complete PR #325 deterministic statistics generator and validator.
2. Start PR #326 immutable checkpoint history.
3. Continue statistics through PR #328.
4. Continue candidate audit and controlled growth in PR #329-#334.
5. After the reviewed 110-asset checkpoint, activate Phase F at PR #335.
```
