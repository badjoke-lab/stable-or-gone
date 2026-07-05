# Stable or Gone Roadmap

Updated: 2026-07-05  
Status: canonical execution schedule — active

## Current position

```text
Current main checkpoint: 7c0dc8be7cd09a95982fd65c3f818a2c5bea3bdf
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
Current item: PR #305 schedule amendment for research checkpoint 03
Next research item: PR #306 function-matrix checkpoint 03
Next public item: PR #307 reviewed EU stablecoin market-access guide after publication gates pass
```

The dedicated UI correction program ended after PR #295. Verified UI defects may be corrected through narrow maintenance PRs, but UI work must not displace the core data, monitoring, statistics, and record-growth schedule without a deliberate roadmap amendment.

The market-access article is not yet publishable. PR #304 established the reviewed research matrix, two checkpoints, and a 10-platform breadth floor, but function-level evidence is still incomplete for several current EU/EEA platform states. New primary-source research must be recorded in a third checkpoint before article implementation.

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

### PR #304 — reviewed research matrix and checkpoints — complete

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

Current merged research gate:

```text
minimum platform breadth:                    met
platforms with reviewed findings/context:    10
minimum stable-asset breadth:                met as touched-by-reviewed-findings breadth
function-level matrix complete:              no
ESMA register cross-check started:           yes
Revolut USDT policy scope confirmed:         no
publication-date current-state recheck:       no
article publishable:                         no
```

The breadth floors do not mean every asset or platform has a complete function matrix.

### PR #305 — checkpoint 03 schedule amendment — active

Purpose:

```text
record that additional primary-source findings require one more research checkpoint before article implementation
reserve PR #306 for function-matrix checkpoint 03
move the reviewed article to PR #307
shift downstream PR numbers once, explicitly
keep article publication gated instead of forcing incomplete rows into prose
```

This PR changes authority documents and the workstream validator only. It does not add research facts, publish an article, modify canonical records, add monitoring sources, schedule jobs, change UI, or deploy.

### PR #306 — function-matrix research checkpoint 03 — next

Checkpoint 03 must record reviewed source findings already identified for research, including where supported:

```text
OKX Europe asset-specific USDT and USDC buy/sell evidence
Crypto.com Europe current service and legal-entity context
Bybit EU current general product/function context
Gemini EEA customer-account closure context effective 2026-04-06
Uphold Europe post-transition temporary service restrictions and withdrawal availability
Coinbase Germany first-party non-tradable status for USDT, DAI, and PYUSD
continued conservative treatment of Revolut USDT policy details when first-party notice remains unavailable
```

The checkpoint must distinguish asset-specific function evidence from platform-wide service context. It must not infer deposit, withdrawal, custody, margin, Earn, or conversion states from pages that do not support them.

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
EU/EEA/legal-entity scope preserved
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
- Market-access research preserves function-level and geographic scope instead of flattening access into an allowed/banned label.
- A platform licence is not proof of stablecoin function availability.
- A Global product page is not proof of EU/EEA service scope.
- Historical platform policy must be separated from later platform-wide service-state changes.
- A source change never updates the public market-access guide automatically.
- Monitoring executions remain read-only and never update their own accepted baseline.
- Growth PRs contain no more than two new stable assets.
- A phase transition updates this roadmap before the next implementation sequence continues.

## Immediate next items

```text
1. Merge PR #305 schedule amendment.
2. Record the additional first-party and regulator findings in PR #306 checkpoint 03.
3. Re-evaluate the publication gate after checkpoint 03.
4. Resolve or conservatively bound Revolut USDT scope and schedule.
5. Recheck all current-state claims immediately before publication.
6. Implement PR #307 only after the publication gate passes.
7. Resume the core registry-wide audit at PR #308.
```
