# Stable or Gone Roadmap

Updated: 2026-07-06  
Status: canonical execution schedule — active

## Current position

```text
Current main checkpoint: 4d7b12936b5ca8497219c09392e743947c1109b9
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
Active workstream: 100-record registry-wide audit
Current item: PR #308 known-unknown and placeholder integrity audit
Next item: PR #309 monitoring coverage recalculation for 100 assets
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

## Remaining Phase A — 100-record registry-wide audit

Completed:

```text
PR #297 identity uniqueness and lineage
PR #298 organization and relationship integrity
PR #299 evidence and source-identity integrity
PR #300 reserve, redemption, and backing applicability
PR #301 deployment and chain identity
PR #302 lifecycle and relationship boundaries
```

Active and next:

```text
PR #308 known-unknown and placeholder integrity — active
PR #309 monitoring coverage recalculation for 100 assets — next
```

### PR #308 — known-unknown and placeholder integrity — active

Audit all canonical known-unknown records and structural placeholder risk across the current registry.

Required checks:

```text
known-unknown ID uniqueness
canonical stable-asset and issuer references
100-asset known-unknown coverage
severity and last-checked date validity
specific, non-generic topics and descriptions
normalized duplicate topic/description review queues
stale-review inventory without silent resolution
structural placeholder-like values in IDs, URLs, dates, addresses, contracts, and identifiers
explicit unknown / not_recorded / not_applicable / source_review_needed value states preserved as intentional semantics
```

Unknown values remain unknown unless reviewed evidence resolves them. `null`, `unknown`, `not_recorded`, `not_applicable`, and `source_review_needed` are not to be erased merely to satisfy completeness. Structural placeholders such as fake URLs, TODO/TBD identity fields, or fabricated identifiers are defects.

### PR #309 — monitoring coverage recalculation for 100 assets — next

PR #309 must distinguish issuer/protocol monitoring coverage from EU market-access platform-policy coverage. Existing issuer-source reach is not evidence that a platform's buy, sell, trade, deposit, withdrawal, custody, Earn, margin, conversion, direct mint, direct redemption, payment-rail, or network-specific policy is monitored.

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
- Growth PRs contain no more than two new stable assets.
- A phase transition updates this roadmap before the next implementation sequence continues.

## Immediate next items

```text
1. Complete PR #308 known-unknown and placeholder integrity audit.
2. Preserve unresolved review queues rather than filling them with guessed values.
3. Merge PR #308 only after exact-head audit and repository CI pass.
4. Continue with PR #309 monitoring coverage recalculation for all 100 assets.
5. Preserve the approved market-access monitoring extension for PR #317-#318.
```
