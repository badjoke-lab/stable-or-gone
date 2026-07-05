# Stable or Gone Roadmap

Updated: 2026-07-05  
Status: canonical execution schedule — active

## Current position

```text
Current main checkpoint: afaffd6b200803a873208d0fc8718d2642b0b9c8
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
Active workstream: EU/EEA stablecoin market-access research checkpoint
Current item: PR #304 reviewed research matrix, checkpoints, and schedule synchronization
Next item: PR #305 reviewed EU stablecoin market-access guide after publication gates pass
```

The dedicated UI correction program ended after PR #295. Verified UI defects may be corrected through narrow maintenance PRs, but UI work must not displace the core data, monitoring, statistics, and record-growth schedule without a deliberate roadmap amendment.

The market-access article is not yet publishable. Research has met the breadth floor of ten platforms with reviewed findings or service context, but several platforms still lack scoped first-party function-level evidence. The article remains blocked until the publication gate in `docs/quality/eu-stablecoin-market-access-research-and-monitoring-spec.md` is satisfied.

## Completed foundation

- PR #296 resumed the core workstream and synchronized repository authority.
- PR #297 completed identity uniqueness and lineage audit.
- PR #298 completed organization and relationship integrity audit.
- PR #299 completed evidence and source-identity integrity audit.
- PR #300 completed reserve, redemption, and backing applicability audit.
- PR #301 completed deployment and chain identity audit.
- PR #302 completed lifecycle and relationship boundary audit.
- PR #303 merged the EU stablecoin market-access research, publication, and monitoring specification and revised execution schedule.
- Monitoring foundation and reviewed source coverage exist through the prior non-UI quality program.
- The registry has reached the verified 100-record checkpoint.

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

The specification fixes:

```text
research question
platform × asset × function × region/legal-entity matrix
source hierarchy
publication gate
article route and revision policy
material-change rules
later monitoring cadence
read-only monitoring safety boundary
```

### PR #304 — research checkpoint and schedule synchronization — active

Purpose:

```text
store reviewed research findings outside canonical registry data
record source hierarchy and unresolved evidence gaps
separate platform licensing/service context from stablecoin function availability
record current Binance 2026 service context separately from its 2025 stablecoin policy
record official Revolut CASP legal-entity context separately from unresolved USDT policy details
synchronize repository authority after PR #302 and PR #303 merges
```

Research artifacts:

```text
data/editorial-research/eu-stablecoin-market-access.json
data/editorial-research/eu-stablecoin-market-access-context-batch-02.json
docs/audits/eu-stablecoin-market-access-research-checkpoint-2026-07-05.md
docs/audits/eu-stablecoin-market-access-research-checkpoint-02-2026-07-05.md
```

Current research gate:

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

The stable-asset breadth result does not mean every asset has a complete cross-platform matrix. It means the research has touched at least fifteen assets through reviewed findings. Publication still requires adequate function-level evidence for the comparative claims actually used in the article.

### PR #305 — reviewed EU stablecoin market-access guide — next after gate completion

Target route:

```text
/guides/eu-stablecoin-access-after-mica/
```

Required preconditions:

```text
at least 10 platforms researched
at least 15 stable assets reviewed
function-level access states separated
EU/EEA/legal-entity scope preserved
major platform claims backed primarily by regulator or first-party sources
ESMA or relevant register cross-check completed
Revolut scope represented conservatively if first-party confirmation remains incomplete
article source list reviewed
publication-date current-state recheck completed
```

The article is a dated reviewed editorial snapshot. It is not a live dashboard and must not update automatically from monitoring output.

## Phase A — 100-record registry-wide audit

Completed:

```text
PR #297 identity uniqueness and lineage
PR #298 organization and relationship integrity
PR #299 evidence and source-identity integrity
PR #300 reserve, redemption, and backing applicability
PR #301 deployment and chain identity
PR #302 lifecycle and relationship boundaries
```

PR #302 merge checkpoint:

```text
afaffd6b200803a873208d0fc8718d2642b0b9c8
```

The audit preserved separate boundaries for contract deployment, first mint, guarded beta, public launch, exchange listing, migration announcement, migration start, redemption deadline, wind-down start, terminal state, relationship end, and rebrand transition.

### PR #306 — known-unknown and placeholder integrity

Audit known unknowns, missing-value states, future-event placeholders, conflicting-source states, stale resolvable unknowns, and internal placeholder leakage into public output.

### PR #307 — monitoring coverage recalculation for 100 assets

Classify every asset as automatically monitorable, partially monitorable, manual-review-only, or without a reliable official source.

The report must separately identify issuer/protocol monitoring coverage from EU market-access platform-policy coverage. Existing issuer-source reach is not evidence that a platform's buy, trade, deposit, withdrawal, custody, or conversion policy is monitored.

## Phase B — non-UI release hardening

```text
PR #308 Registry v2/v3 and machine-readable parity
PR #309 counts, manifest, version, and provenance integrity
PR #310 reproducible build and generated-output audit
PR #311 audited 100-record canonical checkpoint
PR #312 non-UI release material
```

## Phase C — monitoring expansion and operation

```text
PR #313 100-asset monitoring baseline synchronization
PR #314 reserve and redemption source expansion
PR #315 lifecycle, regulatory, and EU market-access source/schema expansion
PR #316 bounded scheduled read-only monitoring
```

PR #315 implements the approved market-access observation family described in:

```text
docs/quality/eu-stablecoin-market-access-research-and-monitoring-spec.md
```

The implementation must distinguish:

```text
platform policy
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

Target schedule after PR #316:

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
PR #317 deterministic statistics generator and validator
PR #318 immutable checkpoint history
PR #319 /stats/ foundation
PR #320 historical, deployment, organization, and data-quality statistics
```

Statistics derive from reviewed canonical data and must not become price, market-cap, yield, safety, or risk rankings.

## Phase E — controlled growth from 100 to 110

```text
PR #321 next candidate audit
PR #322 100 -> 102
PR #323 102 -> 104
PR #324 104 -> 106
PR #325 106 -> 108
PR #326 108 -> 110
```

Each growth PR is limited to two new stable assets and must preserve all applicable supporting record groups. Unknown information remains explicit.

## Operating rules

- Repository specifications are the source of truth.
- UI is maintenance-only unless the roadmap is deliberately amended.
- Every non-trivial PR cites the exact specification, queue, audit, fixture, baseline, and validator it changes.
- Unknown values remain unknown unless reviewed evidence supports a value.
- Market-access research preserves function-level and geographic scope instead of flattening access into an allowed/banned label.
- A platform licence is not proof of stablecoin function availability.
- A Global product page is not proof of EU/EEA service scope.
- A source change never updates the public market-access guide automatically.
- Monitoring executions remain read-only and never update their own accepted baseline.
- Growth PRs contain no more than two new stable assets.
- A phase transition updates this roadmap before the next implementation sequence continues.

## Immediate next items

```text
1. Merge PR #304 research checkpoint and schedule synchronization.
2. Continue first-party platform-policy research against the merged specification.
3. Resolve or conservatively bound Revolut USDT scope and schedule.
4. Resolve additional scoped function-level sources for Coinbase, OKX Europe, Crypto.com, Bybit EU, Bitpanda, Gemini, and Uphold where available.
5. Recheck current state at publication time.
6. Implement PR #305 only after the publication gate passes.
7. Resume the core registry-wide audit at PR #306.
```
