# Stable or Gone Roadmap

Updated: 2026-08-17  
Status: REVIEW_GATE

## Current repository checkpoint

```text
Current stage: REVIEW_GATE
Active implementation authority: none
Current closeout contract: config/seo-ga4-migration-closeout.json
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

## Completed SEO / GA4 migration lane

```text
Phase A — authority/specification/schedule merge: complete
Phase B — repository + live origin/redirect/analytics audit: complete
Phase C — bounded GA4 production-build wiring/validation: complete
Phase D — exact-main production verification: complete
Closeout — restore repository REVIEW_GATE: current closeout
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
new route family: not authorized
ranking/scoring/recommendation: not authorized
unrelated UI/CSS redesign: not authorized
DNS / Cloudflare account mutation: not authorized
new analytics identity creation: not authorized
automatic continuation: false
```

A fresh reviewed authority is required before new implementation begins.

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
PR #565 — SEO / GA4 migration exact-main evidence
```

Historical lineage remains useful for audit and regression context, not as standing implementation authority.
