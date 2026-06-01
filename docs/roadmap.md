# Stable or Gone Roadmap

## Current stage

SOG v0 foundation is live on Cloudflare Pages.

Public URL:

```txt
https://stable-or-gone.pages.dev/
```

## Completed

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

### SOG-003: seed data batch 1

Completed initial seed:

- USDT
- USDC
- DAI
- UST / TerraUSD
- BUSD
- Tether
- Circle
- MakerDAO / Sky
- Terraform Labs
- Paxos
- USDC depeg event
- UST collapse event
- BUSD wind-down event
- starter evidence
- reserve report references
- known unknowns

### SOG-004: stablecoin detail page

Completed first pass:

- stablecoin facts
- issuer link
- peg/collateral fields
- redemption fields
- reserve report table
- event timeline
- evidence coverage table
- known unknowns table

### SOG-005: events / issuers / registry pages

Completed first pass:

- `/stablecoins/`
- `/issuers/`
- `/issuer/[slug]/`
- `/events/`
- `/event/[id]/`
- `/models/`
- compact terminal-style tables

### SOG-006: contact and report route

Completed first pass:

- `/contact/`
- footer contact link
- header contact link
- GitHub Issues link
- GitHub issue template route
- Google Form placeholder

### SOG-007: Cloudflare Pages deployment

Completed:

- Cloudflare Pages connected
- main branch build works
- static output to `dist`
- public URL available

## Added after deployment

- `scripts/validate-data.mjs`
- `npm run validate:data`
- validation included in `npm run build`
- `robots.txt`
- dynamic sitemap at `/sitemap-index.xml`

## Next phase: SOG-008

SOG-008 should focus on hardening the public v0 site.

Recommended scope:

- replace Google Form TODO with real URL
- improve methodology page copy
- improve support page copy and add support link if available
- add visible report-this-entry link on stablecoin/event/issuer detail pages
- add status chip styling by status
- add basic noindex decision if needed before wider promotion
- verify live pages after Cloudflare deployment

## SOG-009: seed data expansion

Recommended scope:

- add FRAX
- add TUSD
- add FDUSD
- add PYUSD
- add USDD
- add GUSD
- add LUSD
- add crvUSD
- add USDe
- add sUSD

## SOG-010: methodology and source quality

Recommended scope:

- write public depeg methodology page
- explain status vs event separation
- explain known unknowns
- explain evidence coverage
- explain reserve report handling
- explain why SOG is not a ranking

## Later phases

### v0.5

- Guides
- Comparisons
- Reports / Registry Updates
- more seed data
- richer validation scripts
- simple search/filtering

### v1

- ingestion staging pipeline
- candidate discovery
- data validation workflow
- low-frequency candidate watchlist

### v2

- Pages Functions or D1 only if static JSON becomes insufficient

## Operating rule

Do not add complex automation before the registry model, source handling, and review process are stable.
