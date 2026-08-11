# Stable or Gone Roadmap

Updated: 2026-08-11  
Status: Russia USDT Regulation Guide update authorized; canonical Evidence Archive Batch 2 remains preserved at REVIEW_GATE

## Current reviewed checkpoint

```text
Canonical stable assets: 119
Organizations: 109
Relationships: 131
Events: 194
Evidence: 585
Evidence Relations: 585
Reserve reports: 127
Known unknowns: 352
Regulatory notes: 9
Deployments: 186
Legal profiles: 119
Reserve components: 153
Income profiles: 119
Market Access Records: 12
Archive recorded: 463
Archive not recorded: 122
Detail routes: 422
Metadata-checked routes: 422
Official origin: https://www.stableorgone.com
Last canonical-changing commit: 77e80dd3e2a62fea53ea0eabe91ef78a2d8ab1da
Canonical hash: sha256:f386c1043ca5e83cafbd88e99746d0609aab0154ed48de1970677758a66ed5fa
Canonical file count: 466
Canonical delta: 0
```

## Completed current-cycle work

```text
PR #523 — JPYSC canonical Market Access implementation
PR #534 — REVIEW_GATE restoration
PR #535/#536 — Japan Market Access Expansion Review Batch 1 — no-go
PR #537/#538/#539 — Evidence Archive Payload Verification Batch 2 research/review lineage
PR #540/#541 — first Stablecoin Compare matrix remediation
PR #542 — first Compare closeout / Evidence review restoration
PR #543 — clean Evidence Archive Batch 2 review result
PR #544/#545/#546 — Compare discovery/navigation remediation and footer-overlap closure
PR #547 — Compare closeout and REVIEW_GATE restoration
```

## Current bounded public lane — Russia USDT Regulation Guide

The July 2026 Russian crypto-market law and Bank of Russia implementation work materially supersede the consultation-only framing currently used in SOG's Russia Guide.

The update is bounded to three existing public files:

```text
src/pages/guides/russia-stablecoin-rules-2026/index.astro
src/pages/guides/global-stablecoin-regulation-2026/index.astro
src/data/guideCatalog.ts
```

Source-reviewed claims permitted in the implementation:

```text
law effective: 2026-09-01
non-qualified investors: most liquid cryptocurrencies after testing, up to RUB 300,000/year via one intermediary
qualified investors: broader purchase/sale access after testing
foreign stablecoins: included in the Bank of Russia framework
organized trading: July draft regulations published
domestic cryptocurrency payments: prohibited
BTC / ETH / USDT: identified by First Deputy Governor Vladimir Chistyukhin as the initial three currently meeting the principles, not a permanent statutory whitelist
```

Watcher.Guru is discovery only and must not appear as a public source or canonical Evidence.

## Market Access v1 decision

No canonical Market Access promotion is authorized by this lane.

`docs/market-access-record-spec.md` requires a provider-scoped analytical unit:

```text
asset × jurisdiction × platform/service × function × access state × effective date
```

The reviewed Russian legal framework is jurisdiction-level. It does not establish a named provider/service observation for `buy_sell`, `deposit`, `withdrawal`, `external_wallet_transfer`, `direct_issuer_mint`, or `direct_issuer_redemption`.

Therefore:

```text
Market Access Records: 12 -> 12
Evidence: 585 -> 585
Evidence Relations: 585 -> 585
Stable assets: 119 -> 119
Canonical delta: 0
```

A later Market Access review may start only after a named regulated intermediary or organised-trading platform publishes function-scoped USDT support with an effective date.

## Required public implementation outcome

```text
Russia guide current through 2026-08-11
Russia guide updated from consultation-only framing to enacted framework + July implementation rules
BTC/ETH/USDT claim explicitly attributed and temporally qualified
global seven-jurisdiction comparison synchronized
2026 timeline synchronized
guideCatalog updatedAt/revision history recorded
no permanent-whitelist wording
no universal USDT availability claim
no canonical-data change
```

## Preserved canonical lane — Evidence Archive Payload Verification Batch 2

The PR #543 review result remains unchanged:

```text
reviewed: 10
dated exact archive proposals: 8
reviewed no safe change: 2
canonical changes: 0
public-output changes: 0
stage: REVIEW_GATE
canonical archive additions authorized: 0
```

The Guide lane temporarily becomes the active public implementation authority only. It does not promote or discard the archive proposals. After Guide implementation, production verification, and closeout, Evidence Archive Payload Verification Batch 2 returns as the current canonical work boundary at `REVIEW_GATE`.

## Schedule

```text
2026-08-11  Russia USDT Regulation Guide source review / authority — active
next         bounded Guide implementation — authorized after authority merge
then         production verification / closeout
then         restore Evidence Archive Payload Verification Batch 2 REVIEW_GATE
2026-08-17 to 2026-08-23  possible archive implementation window — still separate authority required
```

Schedule windows are planning targets, not permission boundaries.

## Preserved exclusions

```text
USDT lifecycle/status change
canonical Market Access additions or mutation
canonical Evidence / Evidence Relation additions
country-wide provider availability inference
permanent BTC/ETH/USDT statutory-whitelist claim
canonical archived_url mutation without separate implementation authority
automatic archive promotion
schema/taxonomy changes
new public routes
unrelated UI/CSS changes
ranking / scoring / recommendation
```

## Required work-start protocol

Before implementation, read `AGENTS.md`, `docs/spec-governance.md`, this file, `docs/deployment-policy.md`, the Russia USDT Regulation Guide authority amendment/spec/config, `docs/market-access-record-spec.md`, the post-PR #546 Compare closeout, the completed Evidence Archive Batch 2 review result, and `docs/ui-v3-remediation-authority.md`.
