# Stable or Gone Roadmap

Updated: 2026-07-05  
Status: canonical execution schedule — active

## Current position

```text
Current main checkpoint: c26487f33f27f57518d18c66a6f6cf3d0fcd71a5
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
Active workstream: EU/EEA stablecoin market-access research
Current item: PR #306 function-matrix research checkpoint 03
Next public item: PR #307 reviewed EU stablecoin market-access guide after publication gates pass
```

The dedicated UI correction program ended after PR #295. Verified UI defects may be corrected through narrow maintenance PRs, but UI work must not displace the core data, monitoring, statistics, and record-growth schedule without a deliberate roadmap amendment.

The market-access article remains publication-gated. Checkpoint 03 improves asset-specific and current platform service-state evidence, but the article still requires final comparative-claim scoping, publication-date current-state rechecks, source-list review, and conservative Revolut treatment before implementation.

## Completed foundation

- PR #296 resumed the core workstream and synchronized repository authority.
- PR #297 completed identity uniqueness and lineage audit.
- PR #298 completed organization and relationship integrity audit.
- PR #299 completed evidence and source-identity integrity audit.
- PR #300 completed reserve, redemption, and backing applicability audit.
- PR #301 completed deployment and chain identity audit.
- PR #302 completed lifecycle and relationship boundary audit.
- PR #303 merged the EU stablecoin market-access research, publication, and monitoring specification and revised schedule.
- PR #304 merged the first reviewed market-access matrix, two research checkpoints, current-service context, and publication-gate status.
- PR #305 merged the checkpoint 03 schedule amendment and shifted downstream PR numbers once.
- Monitoring foundation and reviewed source coverage exist through the prior non-UI quality program.
- The registry remains at the verified 100-record checkpoint.

## EU stablecoin market-access insertion

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

Merged research artifacts:

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

Result:

```text
PR #306 reserved for function-matrix checkpoint 03
PR #307 reserved for the reviewed article after gate completion
downstream audit, hardening, monitoring, stats, and growth numbers shifted explicitly
checkpoint 03 source-review scope frozen before research publication
```

### PR #306 — function-matrix research checkpoint 03 — active

Checkpoint artifacts:

```text
data/editorial-research/eu-stablecoin-market-access-function-batch-03.json
docs/audits/eu-stablecoin-market-access-research-checkpoint-03-2026-07-05.md
```

Checkpoint 03 records, with scope boundaries preserved:

```text
OKX Europe asset-specific USDT and USDC buy/sell evidence
Crypto.com Europe current general service and legal-entity context
Bybit EU current general product/function context
Gemini EEA customer-account closure context effective 2026-04-06
Uphold Europe temporary service restrictions with general withdrawal availability
Coinbase Germany first-party non-tradable status for USDT, DAI, and PYUSD
continued unresolved first-party Revolut USDT policy details
```

Current checkpoint 03 gate effect:

```text
platform breadth floor:                     met
stable-asset breadth floor:                 met
function-level evidence depth:              improved
current platform service-state coverage:    improved
Revolut first-party USDT policy confirmed:  no
publication-date current-state recheck:      no
article source-list review complete:         no
article publishable:                         no
```

Checkpoint 03 confirms that the article must separate three evidence layers:

```text
A. asset-specific function evidence
B. current platform-wide service-state evidence
C. general service/licensing context without asset-specific function support
```

Only A-level evidence should populate direct function comparisons. B-level evidence should explain current access context. C-level evidence must remain bounded context.

### PR #307 — reviewed EU stablecoin market-access guide — after gate completion

Target route:

```text
/guides/eu-stablecoin-access-after-mica/
```

Required preconditions:

```text
at least 10 platforms researched
at least 15 stable assets reviewed
function-level access states separated for comparative claims actually used
EU/EEA/member-state/legal-entity scope preserved
major platform claims backed primarily by regulator or first-party sources
ESMA or relevant register cross-check completed
Revolut represented conservatively if first-party policy confirmation remains incomplete
article source list reviewed
current platform service context separated from historical policy where necessary
publication-date current-state recheck completed
```

The article is a dated reviewed editorial snapshot. It is not a live dashboard and must not update automatically from monitoring output.

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

Remaining after the article insertion:

```text
PR #308 known-unknown and placeholder integrity
PR #309 monitoring coverage recalculation for 100 assets
```

PR #309 must distinguish issuer/protocol monitoring coverage from EU market-access platform-policy coverage. Existing issuer-source reach is not evidence that a platform's buy, sell, trade, deposit, withdrawal, custody, Earn, margin, or conversion policy is monitored.

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
product function
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
- Every non-trivial PR cites the exact specification, queue, audit, fixture, baseline, validator, and research checkpoint it changes.
- Unknown values remain unknown unless reviewed evidence supports a value.
- Market-access research preserves function-level, service-state, legal-entity, and geographic scope instead of flattening access into an allowed/banned label.
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
1. Merge PR #306 checkpoint 03 after exact-head validation.
2. Re-evaluate the article publication gate against checkpoints 01-03.
3. Define the final comparative table from asset-specific function evidence only.
4. Perform publication-date current-state rechecks for every major platform claim.
5. Review the final source list and recheck for first-party Revolut policy material.
6. Implement PR #307 only after the publication gate passes.
7. Resume the core registry-wide audit at PR #308.
```
