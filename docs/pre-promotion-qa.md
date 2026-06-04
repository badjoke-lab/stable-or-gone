# Stable or Gone Pre-promotion QA

Date: 2026-06-03

Public URL:

```txt
https://sog.badjoke-lab.com/
```

## Scope

This QA pass prepares SOG for public review.

It checks the current static registry state after:

```txt
PR-017 15 stablecoin records
PR-018 top 5 record deepening
PR-019 registry search/filter
PR-020 guides/glossary
PR-021 registry updates
PR-022 pre-promotion QA
```

## Public deploy confirmation

Status:

```txt
confirmed
```

Notes:

```txt
The public site at https://sog.badjoke-lab.com/ was checked after PR-022.
PR-023 records the live deploy confirmation and moves the project into source-deepening work.
```

## QA checklist

### Public routes

Expected public routes:

```txt
/
/stablecoins/
/stablecoin/[slug]/
/issuers/
/issuer/[slug]/
/events/
/event/[id]/
/models/
/guides/
/guides/what-is-a-depeg/
/guides/status-vs-event/
/guides/reserve-disclosure-basics/
/guides/stablecoin-lifecycle-terms/
/glossary/
/methodology/
/updates/
/about/
/support/
/contact/
/sitemap-index.xml
/robots.txt
```

Status: expected route set documented.

### Sitemap

Expected:

- custom domain is `https://sog.badjoke-lab.com`
- static pages are included
- stablecoin detail pages are generated from `data/stablecoins.json`
- issuer detail pages are generated from `data/issuers.json`
- event detail pages are generated from `data/events.json`
- `/guides/` and `/updates/` are included

Status: sitemap source updated.

### Navigation

Expected primary navigation:

```txt
Stablecoins
Issuers
Events
Guides
Glossary
Methodology
Updates
Contact
Support
```

Status: navigation updated.

### Registry usability

Expected:

- `/stablecoins/` shows 15 records
- search input exists
- filters exist for status, model, peg, and issuer
- sort options exist
- no-results state exists
- result count exists

Status: implemented in PR-019.

### Content boundaries

SOG must avoid:

```txt
live price dashboard framing
market cap ranking framing
trading terminal framing
stablecoin safety score framing
recommendation language
investment guide language
legal advice language
```

Status: direct repo search did not surface unwanted active product framing for `ranking`, `score`, or `recommend` during this pass. Existing negative/limiting statements remain acceptable.

### Data state

Current records:

```txt
15 stablecoin records
14 issuer records
3 event records
reserve/evidence/known-unknown/deployment records present
registry update records present
```

Top 5 deepened:

```txt
USDT
USDC
DAI
UST / TerraUSD
BUSD
```

Status: documented in `docs/current-spec.md` and `docs/roadmap.md`.

### Known limitations kept visible

Still not complete:

```txt
10 records remain shallow seed entries
source-specific market prices and depeg durations are not selected
period-level reserve histories are incomplete
exact contract addresses are mostly placeholders
chain-by-chain deployment status is incomplete
Google Form URL is not inserted yet
comparison pages are not implemented yet
```

Status: limitations remain visible in docs.

## Manual checks after deploy

After Cloudflare Pages deploys the latest commit, manually check:

```txt
1. Open https://sog.badjoke-lab.com/
2. Open /stablecoins/ and test search/filter/sort
3. Open /stablecoin/usdc/, /stablecoin/ust/, /stablecoin/busd/
4. Open /guides/ and all four guide pages
5. Open /glossary/
6. Open /updates/
7. Open /sitemap-index.xml and confirm sog.badjoke-lab.com URLs
8. Check mobile width around 360px
9. Confirm Contact and GitHub Issue links are visible
10. Confirm no page presents SOG as a rating, score, ranking, or advice product
```

## Result

PR-023 records that the public deploy was confirmed and no blocking issue was found before moving into PR-024 source-deepening work.
