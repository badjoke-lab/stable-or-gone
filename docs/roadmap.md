# Stable or Gone Roadmap

Updated: 2026-08-19  
Status: REVIEW_GATE

## Current repository checkpoint

```text
Current stage: REVIEW_GATE
Active implementation authority: none
Current closeout contract: config/ledger-series-phase3-closeout.json
Canonical stable assets: 119
Organizations: 109
Relationships: 131
Events: 194
Evidence: 585
Evidence Relations: 585
Deployments: 186
Market Access Records: 12
Archive recorded: 471
Archive not recorded: 114
Official origin: https://www.stableorgone.com
Legacy origin: https://sog.badjoke-lab.com
Canonical hash: sha256:4e7570b6fab88a8178a01ae280a36d98787573b376440b891491f25469458798
Canonical file count: 466
Canonical delta authorized: 0
Additional logo promotions authorized: 0
DNS / Cloudflare account mutation authorized: no
New GA4 property / Measurement ID creation authorized: no
Automatic continuation: false
```

## Completed Ledger Series Phase 3 lane

Authority and closeout lineage:

```text
config/ledger-series-phase3-authority.json
docs/roadmap-amendments/2026-08-17-ledger-series-phase3-authority.md
config/ledger-series-phase3-closeout.json
```

Execution result:

```text
Stage 1 — representative lifecycle + current-surface audit: complete
Stage 2 — schema/canonical decision gate: complete; no mutation required
Stage 3 — deterministic per-asset JSON: complete
Stage 4 — structured-filter lifecycle/depeg-recovery gap closure: complete
Stage 5 — existing Compare lifecycle/outcome gap closure: complete
Stage 6 — existing Stats lifecycle/quality gap closure: complete
Stage 7 — exact-main production cross-surface verification: complete
Stage 8 — documentation/status synchronization and REVIEW_GATE restoration: complete after closeout merge
```

The accepted lifecycle target is now represented through reviewed canonical data and deterministic public projections:

```text
launch
-> stress / depeg / regulatory action
-> issuer or protocol intervention
-> redemption / recovery / compensation
-> migration / discontinuation
-> current / final state
```

Accepted exact-main public evidence:

```text
Verified main: 6cac1ef858d35e2a8c015142f29011e4aff33fdc
Production run: 32153641423 — success
Production job: 95765437402 — success
Stablecoin dossiers verified: 119
Phase 3 cross-surface verification: success
Canonical delta: 0
Schema/taxonomy delta: 0
```

The production lifecycle-quality checkpoint reported 11 depeg events, 6 regulatory events, 6 redemption-change events, and 42 migration/termination events. These are registry coverage measurements derived from reviewed canonical events, not market or safety rankings.

The same verified main passed the strict domain migration gate with 15/15 legacy redirects, migration complete, and zero official-origin failures.

Phase 3 public behavior is now an enduring regression contract. It does not provide standing authority for further lifecycle, filter, Compare, Stats, or machine-readable expansion.

## Completed SEO / GA4 migration lane

```text
Phase A — authority/specification/schedule merge: complete
Phase B — repository + live origin/redirect/analytics audit: complete
Phase C — bounded GA4 production-build wiring/validation: complete
Phase D — exact-main production verification: complete
Closeout — REVIEW_GATE restored before Phase 3 authority activation
```

Accepted exact-main evidence:

```text
Verified main: 9277d04ca7e463e3a965473b82a7c15ef117a5fb
Production run: 32035190608 — success
Production job: 95403850881 — success
Official-origin validation: success
GA4 static-build verification: success
Cloudflare Pages upload: success
Deployed-production verification: success
Canonical delta: 0
```

The enduring migration contract remains:

- `https://www.stableorgone.com` is the official public origin.
- `https://sog.badjoke-lab.com/<path>?<query>` remains a 301 migration surface preserving path/query.
- `pages.dev` must not become a generated public canonical origin.
- GA4 uses the existing `PUBLIC_GA_MEASUREMENT_ID` build variable only; no new or guessed Measurement ID is authorized.
- Google Search Console and GA4 account-side state is not proven by repository evidence alone.

## REVIEW_GATE boundary

```text
canonical work: not authorized
archive work: not authorized
Market Access work: not authorized
additional logo promotion: not authorized
new Evidence identities/relations: not authorized
new unrelated route family: not authorized
new lifecycle/search/filter expansion: not authorized
new Compare or Stats expansion: not authorized
ranking/scoring/recommendation: not authorized
unrelated UI/CSS redesign: not authorized
DNS / Cloudflare account mutation: not authorized
new analytics identity creation: not authorized
automatic continuation: false
```

A fresh reviewed authority is required before any substantive new implementation begins.

## Current Stablecoin mark checkpoint

```text
Canonical Stablecoins: 119
Reviewed logo dispositions: 119 / 119
Direct Stablecoin/product logos: 101
Neutral fallbacks: 18
Last reviewed promotions: mnee, usdgo, usr
Remote runtime image fetching: no
```

## Permanent rules retained

The following continue unchanged:

- `docs/ai-era-registry-spec.md` and `docs/ai-era-execution-schedule.md` must be read before new substantive work;
- `docs/quality/stablecoin-logo-disposition-operating-spec.md`;
- core CI Stablecoin logo coverage audit on every PR;
- one reviewed logo disposition per canonical Stablecoin;
- explicit neutral fallback when no product/token-specific mark is approved;
- no runtime remote logo fetching;
- accepted Compare interaction behavior;
- accepted Phase 3 machine-readable/filter/Compare/Stats contracts;
- material-public-UI regression review under `docs/ui-v3-remediation-authority.md`;
- official-origin and legacy-host deployment contracts.

## Historical completed lanes

```text
PR #544/#545/#546/#547 — Compare discovery/navigation remediation / closeout
PR #548/#549/#550 — Russia USDT Guide authority / implementation / closeout
PR #551/#552/#553 — Evidence Archive Batch 2 implementation / closeout
PR #554/#555/#556/#557/#558 — Compare feedback / Stablecoin logo maintenance / closeout
PR #565/#566 — SEO / GA4 migration exact-main evidence / closeout
PR #567 — Ledger Series Phase 3 authority
PR #571 — Phase 3 structured lifecycle/depeg-recovery filters
PR #572 — Phase 3 Compare lifecycle aftermath extension
PR #573 — Phase 3 lifecycle-quality Stats
PR #574 — Phase 3 exact-main production cross-surface verification
```

Historical lineage remains useful for audit and regression context, not as standing implementation authority.
