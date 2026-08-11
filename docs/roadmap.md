# Stable or Gone Roadmap

Updated: 2026-08-12  
Status: Russia USDT Regulation Guide update complete and production-verified; Evidence Archive Payload Verification Batch 2 restored at REVIEW_GATE

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
PR #548 — Russia USDT Regulation Guide authority
PR #549 — Russia USDT Regulation Guide implementation and production publication
```

## Completed public lane — Russia USDT Regulation Guide

The July 2026 Russian crypto-market law and Bank of Russia implementation work were used to replace the prior consultation-only Guide framing. The update remained bounded to:

```text
src/pages/guides/russia-stablecoin-rules-2026/index.astro
src/pages/guides/global-stablecoin-regulation-2026/index.astro
src/data/guideCatalog.ts
```

Completed production lineage:

```text
Authority PR: #548 — complete
Implementation PR: #549 — complete
Implementation/main commit: f99d9583105587625a409b959ac928de44248e7b
Production run: 31504346502 — success
Production job: 93822011080 — success
Issue #479 report step: success
Material UI/CSS change: no
Canonical delta: 0
```

The accepted result keeps the Russia Guide current through 2026-08-11, synchronizes the global regulation comparison and timeline, source-qualifies the BTC/ETH/USDT statement, keeps domestic cryptocurrency-payment prohibition distinct from trading/investment access, avoids a permanent statutory-whitelist claim, and keeps Watcher.Guru out of the public source list.

## Market Access v1 decision

No canonical Market Access promotion was authorized or produced by the Russia lane.

`docs/market-access-record-spec.md` requires:

```text
asset × jurisdiction × platform/service × function × access state × effective date
```

Russian country-level law does not establish named provider/service observations for `buy_sell`, `deposit`, `withdrawal`, `external_wallet_transfer`, `direct_issuer_mint`, or `direct_issuer_redemption`.

Therefore:

```text
Market Access Records: 12 -> 12
Evidence: 585 -> 585
Evidence Relations: 585 -> 585
Stable assets: 119 -> 119
Canonical delta: 0
```

A later Market Access review may start only on material named-provider, function-scoped evidence with an effective date and separate authority.

## Current canonical lane — Evidence Archive Payload Verification Batch 2

The PR #543 review result is restored as the current boundary:

```text
reviewed: 10
dated exact archive proposals: 8
reviewed no safe change: 2
canonical changes: 0
public-output changes: 0
stage: REVIEW_GATE
canonical archive additions authorized: 0
separate implementation authority required: yes
automatic promotion: prohibited
```

The eight proposals remain review results only. They are not canonical `archived_url` values until a separate reviewed and merged implementation authority binds the exact IDs/URLs and allowed deltas.

## Schedule

```text
2026-08-11  Russia USDT Regulation Guide authority and implementation — complete
2026-08-12  post-PR #549 production closeout / REVIEW_GATE restoration — current
next         separate Evidence Archive Batch 2 implementation authority, only if explicitly continued
then         bounded implementation of at most the 8 reviewed proposals, only after authority merge
2026-08-17 to 2026-08-23  prior planning window for possible archive implementation; not permission
```

Schedule windows are planning targets, not permission boundaries.

## Next implementation shape if authorized

A later Evidence Archive implementation authority should bind exactly the eight reviewed proposals from PR #543 and must specify:

```text
exact Evidence IDs and dated Wayback URLs
maximum archive delta: +8 recorded / -8 not recorded
Evidence identities unchanged
Evidence Relations unchanged
Market Access unchanged
stable assets unchanged
canonical hash/count expectations after deterministic mutation
rollback path
no automatic continuation
```

The two `reviewed_no_safe_change` Evidence identities remain unchanged unless later source evidence is separately reviewed.

## Preserved exclusions

```text
canonical archived_url mutation without separate implementation authority
automatic archive promotion
country-wide provider availability inference
canonical Market Access additions or mutation
canonical Evidence / Evidence Relation identity additions from the completed Russia Guide lane
USDT lifecycle/status change
schema/taxonomy changes
new public routes without authority
unrelated UI/CSS changes
ranking / scoring / recommendation
continued Russia Guide material change under PR #548/#549 authority
```

## Required work-start protocol

Before any next implementation, read `AGENTS.md`, `docs/spec-governance.md`, this file, `docs/deployment-policy.md`, the post-PR #549 closeout amendment/spec/config, the completed Evidence Archive Batch 2 review-result package, and the relevant enduring regression authorities. No canonical mutation may begin from the review result alone.
