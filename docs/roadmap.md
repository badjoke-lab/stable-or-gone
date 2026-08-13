# Stable or Gone Roadmap

Updated: 2026-08-14  
Status: SEO / GA4 custom-domain migration audit authority active after merge

## Current repository checkpoint

```text
Current stage: SEO_GA4_MIGRATION_AUDIT_AUTHORITY
Active implementation authority: config/seo-ga4-migration-authority.json
Current quality spec: docs/quality/seo-ga4-migration-audit-spec.md
Current roadmap amendment: docs/roadmap-amendments/2026-08-14-seo-ga4-migration-audit-authority.md
Entry main commit: 3c715fa77d9e92d52d7646f6e6e944a43d7f5ea9
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

## Current work schedule

```text
2026-08-14  Phase A — authority/specification/schedule merge
2026-08-14  Phase B — repository + live origin/redirect/analytics audit
then        Phase C — bounded GA4 production-build wiring/validation if required
then        Phase D — exact-main production verification
closeout    restore repository REVIEW_GATE; no automatic continuation
```

The lane exists to finish verification of the already-completed custom-domain migration and to ensure the existing SOG GA4 identity can be injected into Astro's static production build when configured.

## Required results

- `https://www.stableorgone.com` remains the only generated official public origin.
- canonical, OGP, JSON-LD, robots, sitemap, version/manifest, llms/ai, and internal origin consumers must agree.
- `https://sog.badjoke-lab.com/<path>?<query>` remains a 301 migration surface preserving path/query.
- `pages.dev` must not become a generated public canonical origin.
- the production build must receive the existing `PUBLIC_GA_MEASUREMENT_ID` value when configured.
- no new GA4 property or Measurement ID may be created, guessed, or hardcoded under this lane.
- Google Search Console account operations must not be claimed complete without direct account evidence.

## Canonical and product boundary

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
```

Canonical counts/hash remain frozen throughout this lane.

## Current Stablecoin mark checkpoint

```text
Canonical Stablecoins: 119
Reviewed logo dispositions: 119 / 119
Direct Stablecoin/product logos: 101
Neutral fallbacks: 18
Last reviewed promotions: mnee, usdgo, usr
Remote runtime image fetching: no
```

This accepted display state is outside the current implementation scope and must not regress.

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

## Closeout rule

This lane has no automatic next phase. After exact-main production verification, a closeout must restore `REVIEW_GATE` with active implementation authority `none`. Any unresolved Google-account-side GSC or GA4 setting must be reported explicitly rather than converted into assumed completion.

## Historical completed lanes

```text
PR #544/#545/#546/#547 — Compare discovery/navigation remediation / closeout
PR #548/#549/#550 — Russia USDT Guide authority / implementation / closeout
PR #551/#552/#553 — Evidence Archive Batch 2 implementation / closeout
PR #554/#555/#556/#557/#558 — Compare feedback / Stablecoin logo maintenance / closeout
```

Historical lineage remains useful for audit and regression context, not as standing implementation authority.
