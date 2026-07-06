# Stable or Gone Roadmap

Updated: 2026-07-06  
Status: canonical execution schedule — active

## Current position

```text
Current main checkpoint: 3fa7f2fe7d84f4fc2a0ba4e0dc8b11e1b1b789b9
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
Active workstream: monitoring coverage recalculation
Current item: PR #309 monitoring coverage recalculation for 100 assets
Next item: PR #310 Registry v2/v3 and machine-readable parity
```

The dedicated UI correction program ended after PR #295. Verified UI defects may be corrected through narrow maintenance PRs, but UI work must not displace the core data, monitoring, statistics, and record-growth schedule without a deliberate roadmap amendment.

The EU/EEA stablecoin market-access article was published through PR #307 after checkpoints 01-03, publication-gate review, a full prepublication re-audit, owner review, exact-head validation, and final article corrections. The article is a dated reviewed snapshot and is not an automatic monitoring output.

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
- Monitoring foundation and reviewed source coverage exist through the prior non-UI quality program.
- The registry remains at the verified 100-record checkpoint.

## EU stablecoin market-access insertion — complete

### PR #303 — specification and schedule amendment — complete

Merge checkpoint:

```text
39f6ef36ec381f25135e6369699af37537fef812
```

Binding specification:

```text
docs/quality/eu-stablecoin-market-access-research-and-monitoring-spec.md
```

### PR #304 — reviewed research matrix and checkpoints 01-02 — complete

Merge checkpoint:

```text
7c0dc8be7cd09a95982fd65c3f818a2c5bea3bdf
```

Research artifacts:

```text
data/editorial-research/eu-stablecoin-market-access.json
data/editorial-research/eu-stablecoin-market-access-context-batch-02.json
docs/audits/eu-stablecoin-market-access-research-checkpoint-2026-07-05.md
docs/audits/eu-stablecoin-market-access-research-checkpoint-02-2026-07-05.md
```

### PR #305 — checkpoint 03 schedule amendment — complete

Merge checkpoint:

```text
c26487f33f27f57518d18c66a6f6cf3d0fcd71a5
```

### PR #306 — function-matrix research checkpoint 03 — complete

Merge checkpoint:

```text
b03149c022b29d2b14e29948492cbacad5ea1d7e
```

Checkpoint artifacts:

```text
data/editorial-research/eu-stablecoin-market-access-function-batch-03.json
docs/audits/eu-stablecoin-market-access-research-checkpoint-03-2026-07-05.md
```

Checkpoint 03 fixed three evidence layers:

```text
A. asset-specific function evidence
B. current platform-wide service-state evidence
C. general service/licensing context without asset-specific function support
```

Only A-level evidence may populate direct function comparisons. B-level evidence explains current access context. C-level evidence remains bounded context.

### Publication gate and re-audit — complete

Review records:

```text
docs/audits/eu-stablecoin-market-access-publication-gate-review-2026-07-05.md
docs/audits/eu-stablecoin-market-access-prepublication-reaudit-2026-07-05.md
data/editorial-research/eu-stablecoin-market-access-reaudit-batch-04.json
```

The final article preserves issuer identity, token regulatory path, service legal entity, payment-services layer where applicable, platform service state, geography, customer cohort, function or access route, supported network, and effective date as separate dimensions.

### PR #307 — reviewed EU stablecoin market-access guide — complete

Merge checkpoint:

```text
4d7b12936b5ca8497219c09392e743947c1109b9
```

Published route:

```text
/guides/eu-stablecoin-access-after-mica/
```

The article is a dated reviewed editorial snapshot current through 2026-07-06. Monitoring output never edits it automatically.

## Phase A — 100-record registry-wide audit

Completed:

```text
PR #297 identity uniqueness and lineage
PR #298 organization and relationship integrity
PR #299 evidence and source-identity integrity
PR #300 reserve, redemption, and backing applicability
PR #301 deployment and chain identity
PR #302 lifecycle and relationship boundaries
PR #308 known-unknown and placeholder integrity
```

### PR #308 — known-unknown and placeholder integrity — complete

Merge checkpoint:

```text
3fa7f2fe7d84f4fc2a0ba4e0dc8b11e1b1b789b9
```

Reviewed result:

```text
stable assets: 100
known unknowns: 289
assets with known-unknown coverage: 100
stale-over-30-days review queue: 44
structural placeholder findings: 0
critical findings after one wording clarification: 0
```

Intentional unresolved values remain protected semantics:

```text
null
unknown
not_recorded
not_applicable
source_review_needed
```

## PR #309 — monitoring coverage recalculation for 100 assets — active

PR #309 recalculates current monitoring reach from the checked-in 24-source configuration against the 100-asset registry.

The audit must separate:

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

A registered source is not an accepted baseline. Current issuer or protocol reach is not evidence that a platform's buy, sell, trade, deposit, withdrawal, custody, Earn, margin, conversion, direct mint, direct redemption, payment-rail, or network-specific policy is monitored.

PR #309 is an audit/recalculation item. It must not add platform-policy sources, extend the market-access monitoring schema, schedule workflows, accept baselines, write canonical data, or edit the public article. Those changes remain reserved for PR #315-#318 according to the monitoring phase.

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

PR #317 implements the approved market-access observation family described in:

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

Target schedule after PR #318:

```text
platform policy sources: daily
platform announcement sources: daily
news discovery: daily
ESMA and regulatory registers: weekly
issuer regulatory/transparency sources: weekly unless an existing cadence is stricter
article stale-state review: weekly
```

Monitoring may observe, compare, classify, and create private review material. It may not write canonical data, edit guides automatically, mutate accepted baselines, create branches or pull requests automatically, publish candidates, or deploy.

## Phase D — statistics implementation

The binding specification is `docs/stats-spec.md`.

```text
PR #319 deterministic statistics generator and validator
PR #320 immutable checkpoint history
PR #321 /stats/ foundation
PR #322 historical, deployment, organization, and data-quality statistics
```

Statistics derive from reviewed canonical data and must not become price, market-cap, yield, safety, or risk rankings.

## Phase E — controlled growth from 100 to 110

```text
PR #323 next candidate audit
PR #324 100 -> 102
PR #325 102 -> 104
PR #326 104 -> 106
PR #327 106 -> 108
PR #328 108 -> 110
```

Each growth PR is limited to two new stable assets and must preserve all applicable supporting record groups. Unknown information remains explicit.

## Operating rules

- Repository specifications are the source of truth.
- UI is maintenance-only unless the roadmap is deliberately amended.
- Every non-trivial PR cites the exact specification, queue, audit, fixture, baseline, validator, publication-gate review, and research checkpoint it changes.
- Unknown values remain unknown unless reviewed evidence supports a value.
- Explicit unknown-value semantics are not placeholders and must not be erased by completeness audits.
- Structural fake values in identity, URL, date, address, contract, or identifier fields are defects.
- Market-access research preserves function-level, service-state, legal-entity, geographic, customer-scope, payment-rail, network, and date distinctions.
- A platform licence is not proof of stablecoin function availability.
- A Global product page is not proof of EU/EEA service scope.
- A member-state page is not automatically an EEA-wide statement.
- Historical platform policy must be separated from later platform-wide service-state changes.
- A source change never updates the public market-access guide automatically.
- Monitoring executions remain read-only and never update their own accepted baseline.
- Registered monitoring reach is not accepted baseline coverage.
- Issuer/protocol coverage is not platform-policy coverage.
- Growth PRs contain no more than two new stable assets.
- A phase transition updates this roadmap before the next implementation sequence continues.

## Immediate next items

```text
1. Complete PR #309 monitoring coverage recalculation against all 100 assets.
2. Preserve separate issuer/protocol, regulatory, platform-policy, register, and market-access function coverage conclusions.
3. Merge PR #309 only after exact-head audit and repository CI pass.
4. Continue with PR #310 Registry v2/v3 and machine-readable parity.
5. Keep market-access source/schema expansion reserved for PR #317 and scheduled read-only operation for PR #318.
```
