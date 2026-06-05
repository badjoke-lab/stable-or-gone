# Stable or Gone SEO / Build QA

Updated: 2026-06-05

## Purpose

This checklist tracks the PR-025 validation pass after the SEO-005 to SEO-009 changes and the PR-024 source-deepening work.

## Required commands

Run these before treating PR-025 as complete:

```bash
npm install
npm run validate:data
npm run check
npm run build
```

## CI

CI workflow:

```txt
.github/workflows/ci.yml
```

Expected CI checks:

```txt
npm run validate:data
npm run check
npm run build
```

## Representative page checks

Check these routes after build/deploy:

```txt
/
/stablecoins/
/stablecoin/usdt/
/stablecoin/usdc/
/stablecoin/dai/
/stablecoin/ust/
/stablecoin/busd/
/issuers/
/issuer/tether/
/issuer/circle/
/events/
/event/sog_ev_usdc_2023_03_depeg/
/guides/
/guides/what-is-a-depeg/
/guides/status-vs-event/
/guides/reserve-disclosure-basics/
/guides/stablecoin-lifecycle-terms/
/glossary/
/methodology/
/updates/
/og/sog-og.svg
/sitemap-index.xml
/robots.txt
```

## Metadata checks

For representative pages, confirm:

```txt
<title> is page-specific
<meta name="description"> is page-specific
<link rel="canonical"> points to https://sog.badjoke-lab.com/...
og:title exists
og:description exists
og:url exists
og:image points to /og/sog-og.svg
twitter:card is summary_large_image
application/ld+json exists where expected
```

## JSON-LD expectations

Expected schema types:

```txt
/                         WebSite + Dataset
/stablecoins/             CollectionPage
/stablecoin/[slug]/       Dataset
/issuers/                 CollectionPage
/issuer/[slug]/           Organization
/events/                  CollectionPage
/event/[id]/              Article
/guides/*                 Article
/methodology/             Article
/updates/                 CollectionPage
```

## Internal link checks

Confirm visible related links on:

```txt
home -> stablecoins / issuers / events / guides
stablecoins index -> status guide / reserve guide / events
stablecoin detail -> registry / issuer / status guide
events index -> depeg guide / status guide / stablecoins
event detail -> stablecoin / issuer / depeg guide
issuers index -> stablecoins / reserve guide / methodology
issuer detail -> issuer index / stablecoins / reserve guide
guides -> related records and other guides
```

## Content boundary checks

Confirm pages do not present SOG as:

```txt
live price dashboard
market cap ranking
trading terminal
stablecoin safety score
investment recommendation
legal advice
```

Preferred wording:

```txt
historical context
source-backed record
reserve reference
redemption context
known unknown
lifecycle event
not a safety score
```

## Current status

As of this file update:

```txt
CI workflow has been added.
GitHub workflow run was not yet visible for the immediate commit check.
Local build has not been confirmed in this session.
PR-025 remains open until CI or local build passes.
```
