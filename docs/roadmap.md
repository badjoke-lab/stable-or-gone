# Stable or Gone Roadmap

Updated: 2026-07-06  
Status: canonical execution schedule — active

## Current position

```text
Current reviewed main checkpoint before PR #315:
24c7d9e87becfa3fe182d42ee70b02332c00f8d2

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
Registry v2/v3 and machine-readable parity: complete via PR #311
PR #312 Ripple EU CASP guide update: complete
PR #313 first EEA-scope follow-up: closed without merge
PR #314 corrected guide follow-up: complete

Active workstream: schedule normalization after owner-directed editorial insertions
Current item: PR #315 schedule amendment and PR renumbering
Next item: PR #316 counts, manifest, version, and provenance integrity
```

The dedicated UI correction program ended after PR #295. Verified UI defects may be corrected through narrow maintenance PRs, but UI work must not displace the core data, monitoring, statistics, record-growth, comparison, and change-research schedule without a deliberate roadmap amendment.

The EU/EEA stablecoin market-access article was published through PR #307 after checkpoints 01-03, publication-gate review, a full prepublication re-audit, owner review, exact-head validation, and final article corrections. Later owner-directed factual corrections were merged through PR #312 and PR #314. PR #313 was closed without merge after its implementation violated the existing guide UI contract.

The dated guide remains a reviewed editorial snapshot and is not an automatic monitoring output. Editorial updates do not create canonical market-access records and do not change the review-only monitoring boundary.

The schedule renumbering is governed by:

```text
docs/roadmap-amendments/2026-07-06-editorial-insertions-and-pr-renumbering.md
```

For PR numbering, this roadmap and the amendment supersede older numeric labels in subordinate implementation plans and product specifications. Work order and scope remain unchanged.

## Completed foundation

- PR #296 resumed the core workstream and synchronized repository authority.
- PR #297 completed identity uniqueness and lineage audit.
- PR #298 completed organization and relationship integrity audit.
- PR #299 completed evidence and source-identity integrity audit.
- PR #300 completed reserve, redemption, and backing applicability audit.
- PR #301 completed deployment and chain identity audit.
- PR #302 completed lifecycle and relationship boundary audit.
- PR #303 merged the EU market-access research, publication, and monitoring specification and revised schedule.
- PR #304 merged the reviewed market-access matrix and checkpoints 01-02.
- PR #305 merged the checkpoint 03 schedule amendment.
- PR #306 merged function-matrix checkpoint 03 and current platform service-state research.
- PR #307 published the reviewed EU/EEA stablecoin market-access guide.
- PR #308 completed known-unknown and placeholder integrity audit.
- PR #309 completed monitoring coverage recalculation for all 100 canonical assets.
- PR #311 completed Registry v2/v3 and machine-readable parity.
- PR #312 merged a Ripple EU CASP guide update.
- PR #313 was closed without merge.
- PR #314 merged the corrected guide follow-up.
- The registry remains at the verified 100-record checkpoint.

## EU stablecoin market-access insertion — completed publication and reviewed updates

### Research and publication chain

```text
PR #303  specification and schedule amendment
PR #304  reviewed research matrix and checkpoints 01-02
PR #305  checkpoint 03 schedule amendment
PR #306  function-matrix research checkpoint 03
PR #307  reviewed guide publication
PR #312  Ripple EU CASP status update
PR #314  corrected latest reviewed update for EEA service scope
```

Research artifacts include:

```text
data/editorial-research/eu-stablecoin-market-access.json
data/editorial-research/eu-stablecoin-market-access-context-batch-02.json
data/editorial-research/eu-stablecoin-market-access-function-batch-03.json
data/editorial-research/eu-stablecoin-market-access-reaudit-batch-04.json
docs/audits/eu-stablecoin-market-access-publication-gate-review-2026-07-05.md
docs/audits/eu-stablecoin-market-access-prepublication-reaudit-2026-07-05.md
```

The article preserves separate dimensions for:

```text
issuer identity
token regulatory path
service-provider authorization
platform legal entity
platform service state
payment-services layer where applicable
geographic scope
customer cohort
function or access route
supported network where relevant
announcement date
effective date
review date
```

A provider authorization is not proof of token-level legal status, universal retail availability, or universal platform access.

## Phase A — 100-record registry-wide audit — complete

Completed:

```text
PR #297 identity uniqueness and lineage
PR #298 organization and relationship integrity
PR #299 evidence and source-identity integrity
PR #300 reserve, redemption, and backing applicability
PR #301 deployment and chain identity
PR #302 lifecycle and relationship boundaries
PR #308 known-unknown and placeholder integrity
PR #309 monitoring coverage recalculation
PR #311 Registry v2/v3 and machine-readable parity
```

### Known-unknown boundary

```text
stable assets: 100
known unknowns: 289
assets with known-unknown coverage: 100
stale-over-30-days review queue: 44
structural placeholder findings: 0
critical findings after one wording clarification: 0
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
canonical stable assets: 100
canonical organizations: 94
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

A registered source is not an accepted baseline. Issuer/protocol source reach is not platform-policy coverage. Regulatory action pages are not regulatory-register coverage. A generic issuer or product page is not function-level market-access coverage.

### Registry v2/v3 parity boundary

PR #311 fulfilled the original parity work item.

The public machine-readable contract remains Registry v2-compatible while additive Registry v3 layers are validated and exposed through machine-readable metadata.

Reviewed parity targets include:

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

## PR #315 — schedule amendment and PR renumbering — active

Purpose:

- record PR #311 as the completed parity implementation;
- record PR #312 and PR #314 as merged editorial interruptions;
- record PR #313 as closed without merge;
- renumber all remaining planned work without changing order or scope;
- update the active-workstream validator to the new current and next items;
- preserve all data, monitoring, statistics, growth, and post-110 product boundaries.

Completion condition:

```text
roadmap updated
AGENTS updated
spec-governance updated
numbering amendment merged
active-workstream validator updated
CI green
```

## Phase B — remaining non-UI release hardening

```text
PR #316 counts, manifest, version, and provenance integrity
PR #317 reproducible build and generated-output audit
PR #318 audited 100-record canonical checkpoint
PR #319 non-UI release material
```

Phase B establishes a reliable release boundary before monitoring and product expansion. It does not add comparison UI or the future canonical market-access record family.

## Phase C — monitoring expansion and operation

```text
PR #320 100-asset monitoring baseline synchronization
PR #321 reserve and redemption source expansion
PR #322 lifecycle, regulatory, and EU market-access source/schema expansion
PR #323 bounded scheduled read-only monitoring
```

PR #322 implements the approved market-access observation family described in:

```text
docs/quality/eu-stablecoin-market-access-research-and-monitoring-spec.md
```

The implementation must distinguish:

```text
platform policy
platform service state
regulatory-register state
issuer state
geographic scope
legal entity
stablecoin
product function or access route
supported network where relevant
announcement date
effective date
source identity
review state
```

Target schedule after PR #323:

```text
platform policy sources: daily
platform announcement sources: daily
news discovery: daily
ESMA and regulatory registers: weekly
issuer regulatory/transparency sources: weekly unless an existing cadence is stricter
article stale-state review: weekly
```

Monitoring may observe, compare, classify, and create private review material. It may not write canonical data, edit guides automatically, mutate accepted baselines, create branches or pull requests automatically, publish candidates, or deploy.

Monitoring observation records are not canonical market-access records. The future canonical Market Access Record is defined and implemented only in the post-110 sequence.

## Phase D — statistics implementation

The binding specification is `docs/stats-spec.md`.

```text
PR #324 deterministic statistics generator and validator
PR #325 immutable checkpoint history
PR #326 /stats/ foundation
PR #327 historical, deployment, organization, and data-quality statistics
```

Statistics derive from reviewed canonical data and must not become price, market-cap, APY, safety, transparency, or risk rankings.

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

Phase F is data- and contract-first. It must not begin with Compare UI implementation.

The audit must preserve separate analytical layers for:

```text
asset lifecycle
issuance and redemption
legal and regulatory state
market access
```

The first three layers build on existing canonical record families. Market access becomes a separately governed canonical record family and must remain distinct from monitoring observations and editorial research matrices.

## Phase G — Compare

```text
PR #339 deterministic comparison projection generator and machine-readable output
PR #340 /compare/ v1
PR #341 Compare presets
```

Compare is a factual side-by-side research tool. It must preserve unknown states, evidence scope, date scope, jurisdiction scope, and multi-select dimensions.

Compare must not become a safety score, risk score, recommendation engine, live price table, market-cap ranking, or APY ranking.

## Phase H — Change Research Tools

```text
PR #342 access and regulation index generator
PR #343 Access & Regulation Explorer
PR #344 change-timeline projection generator
PR #345 Change Timeline UI
```

The Access & Regulation Explorer may combine discovery surfaces while keeping canonical market-access and regulatory records distinct.

The Change Timeline is a derived projection across canonical record families. It must not replace those record families with a lossy generic event model.

A universal green/red country availability map is not approved because access can differ by platform, legal entity, customer scope, function, supported network, and date.

## Phase I — Reviewed Public Update Layer

```text
PR #346 SOG Registry Update feed/page
PR #347 Monthly Stablecoin Change Log
```

Public update surfaces derive from reviewed merged canonical changes. They are not raw monitoring feeds or automatic news digests.

The Monthly Stablecoin Change Log may cover launches, migrations, discontinuations, regulatory actions, market-access changes, redemption changes, major depeg events, and material reserve-framework changes when supported by reviewed canonical records.

## Optional Phase J — Query Translation

```text
PR #348+ natural-language filter translation, only if separately approved after structured surfaces are stable
```

The natural-language layer may translate user requests into structured filters. It must not bypass canonical data, evidence, unknown-state semantics, or scoped query constraints.

PR numbers after #347 are not preallocated beyond this optional marker.

## Operating rules

- Repository specifications are the source of truth.
- UI is maintenance-only until the roadmap reaches an approved product UI phase or is deliberately amended.
- Every non-trivial PR cites the exact specification, queue, audit, fixture, baseline, validator, publication-gate review, research checkpoint, and roadmap amendment it changes.
- Unknown values remain unknown unless reviewed evidence supports a value.
- Explicit unknown-value semantics are not placeholders and must not be erased by completeness or comparison audits.
- Structural fake values in identity, URL, date, address, contract, or identifier fields are defects.
- Market-access research preserves function-level, service-state, legal-entity, geographic, customer-scope, payment-rail, network, and date distinctions.
- A platform licence is not proof of stablecoin function availability.
- A global product page is not proof of EU/EEA service scope.
- A member-state page is not automatically an EEA-wide statement.
- Historical platform policy must be separated from later platform-wide service-state changes.
- A source change never updates the public market-access guide automatically.
- Monitoring executions remain read-only and never update their own accepted baseline.
- Registered monitoring reach is not accepted baseline coverage.
- Issuer/protocol coverage is not platform-policy coverage.
- Monitoring observations and editorial research matrices are not canonical market-access records.
- Comparison projections derive from reviewed canonical data and preserve unresolved states.
- Facet freshness is derived from authoritative record families; display timestamps must not be duplicated into root asset records merely for convenience.
- Growth PRs contain no more than two new stable assets.
- A phase transition updates this roadmap before the next implementation sequence continues.
- Inserted urgent factual corrections, verified breakage fixes, owner-directed dated editorial work, or security fixes must record consumed PR numbers before the planned sequence resumes.

## Immediate next items

```text
1. Complete PR #315 schedule amendment and numbering normalization.
2. Start PR #316 counts, manifest, version, and provenance integrity from current main.
3. Continue PR #317-#319 remaining non-UI release hardening.
4. Keep monitoring expansion in PR #320-#322 and scheduled read-only operation in PR #323.
5. Keep statistics in PR #324-#327 and candidate audit/growth in PR #328-#333.
6. After the reviewed 110-asset checkpoint, activate Phase F at PR #334 under docs/comparison-and-change-product-spec.md plus the current numbering amendment.
```
