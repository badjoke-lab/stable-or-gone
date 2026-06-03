# Stable or Gone Roadmap

## Current stage

SOG v0 is ready for low-key public sharing after PR-022 pre-promotion QA.

Public URL:

```txt
https://sog.badjoke-lab.com/
```

Current specification:

```txt
docs/current-spec.md
```

QA checklist:

```txt
docs/pre-promotion-qa.md
```

## Current milestone

SOG has reached the PR-022 milestone:

```txt
15 stablecoin records
Top 5 records deepened
Registry search/filter implemented
Guides and glossary added
Registry updates page added
Pre-promotion QA checklist added
```

Current stablecoin records:

```txt
USDT
USDC
DAI
UST / TerraUSD
BUSD
FRAX
TUSD
FDUSD
PYUSD
USDD
GUSD
LUSD
crvUSD
USDe
sUSD
```

Top 5 deepened records:

```txt
USDT
USDC
DAI
UST / TerraUSD
BUSD
```

## Completed baseline

### SOG-001: foundation docs and data placeholders

Completed:

- README
- DESIGN.md
- project brief
- v0 scope
- data model
- depeg methodology
- reporting/contact plan
- support plan
- roadmap
- data JSON files
- GitHub Issue templates

### SOG-002: Astro scaffold and base UI

Completed:

- Astro + TypeScript setup
- static routes
- base layout
- Terminal Registry UI shell
- navigation
- support/contact links
- data loading from JSON
- Cloudflare-compatible static build

### SOG-003 to SOG-008

Completed:

- first five stablecoin records
- issuer/event/evidence/reserve/known-unknown seed data
- stablecoin detail pages
- issuer and event pages
- contact/report routes
- Cloudflare Pages deployment
- custom domain
- validation script
- robots and sitemap
- public methodology
- current spec

## Completed PR-level work

### PR-009 to PR-015

Completed:

- report boxes on issuer/event detail pages
- support and about pages strengthened
- evidence coverage summary component
- lifecycle section
- redemption access fields and UI
- regulatory notes data and display
- deployment/contract data and display

### PR-016: Seed expansion batch 2

Completed:

- FRAX
- TUSD
- FDUSD
- PYUSD
- USDD
- 10 total stablecoin records

### PR-017: Seed expansion batch 3

Completed:

- GUSD
- LUSD
- crvUSD
- USDe
- sUSD
- 15 total stablecoin records
- public v0 minimum breadth reached

### PR-018: Deepen top 5 records

Completed:

- USDC deepening
- UST deepening
- BUSD deepening
- USDT deepening
- DAI deepening
- top 5 records now have stronger evidence/reserve/deployment/known-unknown context

Important limitation:

Top 5 records are stronger, but not final. Source-specific market prices, exact contract addresses, chain-by-chain deployment status, period-level reserve reports, and full legal/regulatory histories still require dedicated source-deepening passes.

### PR-019: Improve registry list filtering and sorting

Completed:

- client-side search on `/stablecoins/`
- filters for status, collateral model, peg asset, and issuer
- sort options
- result count
- no-results state
- static implementation with no backend

### PR-020: Add Guides / Glossary expansion

Completed:

- `/guides/`
- What is a Depeg?
- Stablecoin Status vs Event
- Reserve Disclosure Basics
- Stablecoin Lifecycle Terms
- expanded `/glossary/`
- guides in navigation and sitemap

### PR-021: Add public registry updates page

Completed:

- `data/registry-updates.json`
- `/updates/`
- updates in navigation and sitemap

### PR-022: Pre-promotion QA pass

Completed:

- `docs/pre-promotion-qa.md`
- documented route checklist
- documented sitemap expectations
- documented navigation expectations
- documented registry usability checks
- documented content boundary checks
- documented remaining known limitations
- documented manual checks after Cloudflare deploy

## PR-level schedule from here

## PR-023: Post-QA cleanup after live check

Goal:

Fix anything found in the first manual live check on `https://sog.badjoke-lab.com/`.

Scope:

- build/deploy issue fixes if Cloudflare fails
- broken link fixes
- mobile layout fixes
- sitemap or robots fixes
- wording cleanup if needed

Acceptance:

- public site opens
- stablecoin registry filters work
- guides and updates open
- sitemap uses custom domain

## PR-024: Source-deepening batch 1

Goal:

Start turning top records from stronger seed pages into fuller dossiers.

Scope:

- source-specific reserve reports
- exact contract/deployment sources
- exact event timeline sources where available
- clearer redemption terms summaries

## PR-025: More seed records or comparison pages

Decision point:

Choose one:

- add more stablecoin records
- add comparison/reference pages
- deepen issuer pages

## Later phases

### v0.5

- more guides
- comparison pages
- richer validation scripts
- more source-deepened records

### v1

- ingestion staging pipeline
- candidate discovery
- data validation workflow
- low-frequency candidate watchlist

### v2

- Pages Functions or D1 only if static JSON becomes insufficient

## Operating rule

Do not add complex automation before the registry model, source handling, and review process are stable.
