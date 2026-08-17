# Stable or Gone Roadmap

Updated: 2026-08-17  
Status: LEDGER_SERIES_PHASE3

## Current repository checkpoint

```text
Current stage: LEDGER_SERIES_PHASE3
Active implementation authority: config/ledger-series-phase3-authority.json
Previous closeout contract: config/seo-ga4-migration-closeout.json
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
Automatic continuation beyond closeout: false
```

## Active Ledger Series Phase 3 lane

Authority:

```text
config/ledger-series-phase3-authority.json
docs/roadmap-amendments/2026-08-17-ledger-series-phase3-authority.md
```

Execution order:

```text
Stage 1 — representative lifecycle + current-surface audit
Stage 2 — schema/canonical decision gate
Stage 3 — deterministic per-asset JSON if missing
Stage 4 — structured-filter gap closure
Stage 5 — Compare lifecycle/outcome gap closure
Stage 6 — Stats lifecycle/quality gap closure
Stage 7 — exact-main production verification
Stage 8 — Phase 3 closeout and REVIEW_GATE restoration
```

The lifecycle target is:

```text
launch
-> stress / depeg / regulatory action
-> issuer or protocol intervention
-> redemption / recovery / compensation
-> migration / discontinuation
-> current / final state
```

Existing public surfaces must be audited before new implementation. Already-satisfied requirements are recorded as implemented and are not rebuilt.

Canonical/schema mutation is not authorized in this lane. If a real representation gap requires either, work stops for a separate reviewed authority.

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

## Phase 3 boundary

```text
canonical work: not authorized
archive work: not authorized
Market Access work: not authorized
additional logo promotion: not authorized
new unrelated route family: not authorized
deterministic per-asset JSON: authorized if missing
existing search/filter extension: authorized
existing Compare extension: authorized
existing Stats extension: authorized
ranking/scoring/recommendation: not authorized
unrelated UI/CSS redesign: not authorized
DNS / Cloudflare account mutation: not authorized
new analytics identity creation: not authorized
automatic continuation beyond closeout: false
```

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

- `docs/quality/stablecoin-logo-disposition-operating-spec.md`;
- core CI Stablecoin logo coverage audit on every PR;
- one reviewed logo disposition per canonical Stablecoin;
- explicit neutral fallback when no product/token-specific mark is approved;
- no runtime remote logo fetching;
- accepted Compare interaction behavior;
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
```

Historical lineage remains useful for audit and regression context, not as standing implementation authority.
