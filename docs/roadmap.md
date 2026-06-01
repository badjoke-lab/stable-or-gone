# Stable or Gone Roadmap

## Current stage

SOG v0 foundation is live on Cloudflare Pages.

Public URL:

```txt
https://stable-or-gone.pages.dev/
```

Current specification:

```txt
docs/current-spec.md
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
- report entry box on stablecoin detail

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

### SOG-008: public v0 hardening, first pass

Completed:

- `scripts/validate-data.mjs`
- `npm run validate:data`
- validation included in `npm run build`
- `robots.txt`
- dynamic sitemap at `/sitemap-index.xml`
- status chip styling
- public methodology first pass
- `docs/current-spec.md`

---

# PR-level schedule from here

## PR-009: Add report boxes to issuer and event detail pages

Goal:

Make correction/report routes visible on all core detail pages.

Scope:

- Add `Report this issuer` box to `/issuer/[slug]/`
- Add `Report this event` box to `/event/[id]/`
- Keep Google Form URL as TODO
- Use GitHub Issues route for now

Acceptance:

- All stablecoin, issuer, and event detail pages show a report route
- Build passes

## PR-010: Strengthen support and about pages

Goal:

Make the public framing clearer before more data is added.

Scope:

- Rewrite `/about/` to explain registry purpose
- Rewrite `/support/` with support/donation placeholder and safe language
- Clarify that SOG is not a ranking, recommendation, or paid rating product
- Keep support route secondary

Acceptance:

- About page explains the project in one screen
- Support page has safe wording and no rating language
- Build passes

## PR-011: Add evidence coverage summary component

Goal:

Improve the differentiator: source coverage, not scores.

Scope:

- Add simple evidence coverage counts on stablecoin detail pages
- Count source types for issuer_statement, reserve_report, market_data, regulatory_document, exchange_notice, news_article, archive_capture, other
- Display as a compact table or mini-card
- Do not compute safety scores

Acceptance:

- Stablecoin detail page shows evidence coverage by source type
- Empty categories display as zero or omitted consistently
- Build passes

## PR-012: Add lifecycle section to stablecoin detail pages

Goal:

Start the lifecycle map without adding a new data file yet.

Scope:

- Use existing `events.json` to show lifecycle-relevant events
- Show launched / depeg / recovered / wind-down / discontinued / migrated / failed where available
- Add explanatory copy that lifecycle is event-derived

Acceptance:

- Stablecoin detail pages show a lifecycle section
- UST, USDC, and BUSD show meaningful lifecycle/event context
- Build passes

## PR-013: Add redemption access fields to data model and UI

Goal:

Strengthen one of SOG's key competitive angles: who can redeem and under what terms.

Scope:

- Extend `stablecoins.json` records with optional fields:
  - who_can_redeem
  - retail_redemption
  - institutional_redemption
  - minimum_redemption
  - redemption_region_notes
  - redemption_notes
- Update validation to allow optional fields
- Show these fields on stablecoin detail pages
- Use known unknowns where unclear

Acceptance:

- Detail pages show redemption access block
- Records with unknown terms do not fake certainty
- Build passes

## PR-014: Add regulatory notes data file and first display

Goal:

Keep regulatory context source-backed and separate from status.

Scope:

- Add `data/regulatory-notes.json`
- Add validation for regulatory notes
- Add first seed notes for BUSD and UST if supportable
- Display regulatory notes on stablecoin and issuer detail pages

Acceptance:

- Regulatory notes are separated from normal event/status fields
- Notes require source/evidence references or clearly mark source pending
- Build passes

## PR-015: Add deployment/contract data structure

Goal:

Prepare for chain-specific stablecoin records without bloating the core entity.

Scope:

- Add `data/deployments.json`
- Define deployment fields:
  - stablecoin_id
  - chain
  - deployment_type
  - contract_address
  - status
  - notes
  - evidence_ids
- Add validation
- Add placeholder display on stablecoin detail pages

Acceptance:

- Detail pages can display deployments when present
- No live on-chain dependency
- Build passes

## PR-016: Seed expansion batch 2

Goal:

Move from foundation to useful registry breadth.

Scope:

Add stablecoin, issuer, starter evidence, reserve references, and known unknowns for:

- FRAX
- TUSD
- FDUSD
- PYUSD
- USDD

Acceptance:

- 10 total stablecoin records
- All new records pass validation
- Each new record has at least one evidence entry or known unknown explaining missing evidence
- Build passes

## PR-017: Seed expansion batch 3

Goal:

Reach public v0 minimum breadth.

Scope:

Add stablecoin, issuer, starter evidence, reserve references, and known unknowns for:

- GUSD
- LUSD
- crvUSD
- USDe
- sUSD

Acceptance:

- 15 total stablecoin records
- All new records pass validation
- Build passes

## PR-018: Deepen top 5 records

Goal:

Make the first five records meaningfully useful rather than shallow seed rows.

Scope:

For USDT, USDC, DAI, UST, BUSD:

- Add more evidence records
- Add reserve references where available
- Add event details
- Add known unknowns
- Improve summaries

Acceptance:

- Top 5 records have stronger dossier pages
- USDC, UST, and BUSD event pages have source-backed event context
- Build passes

## PR-019: Improve registry list filtering and sorting

Goal:

Make the site more usable once records reach 15+.

Scope:

- Add client-side filtering/search to `/stablecoins/`
- Filter by status, model, peg asset, and issuer
- Keep implementation static and no backend

Acceptance:

- Registry can be searched and filtered without external services
- Mobile remains usable
- Build passes

## PR-020: Add Guides / Glossary expansion

Goal:

Start search-entry pages without turning SOG into a blog.

Scope:

- Expand glossary definitions
- Add guide pages:
  - What is a Depeg?
  - Stablecoin Status vs Event
  - Reserve Disclosure Basics
  - Stablecoin Lifecycle Terms
- Link guides from methodology and glossary

Acceptance:

- Guides support registry comprehension
- No recommendation/ranking language
- Build passes

## PR-021: Add public registry updates page

Goal:

Create an updates/history layer for changes to SOG itself.

Scope:

- Add `/updates/`
- Add update entries for v0 launch, seed batches, methodology changes
- Keep updates factual and short

Acceptance:

- Users can see what changed in the registry
- Sitemap includes updates
- Build passes

## PR-022: Pre-promotion QA pass

Goal:

Prepare for light public sharing.

Scope:

- Check all internal links
- Check sitemap output
- Review methodology wording
- Review support/about wording
- Check mobile layout
- Check no score/ranking language slipped in

Acceptance:

- Build passes
- Main pages render correctly
- v0 is ready for low-key sharing

---

## Later phases

### v0.5

- More guides
- Comparison pages
- Reports / Registry Updates
- richer validation scripts
- simple search/filtering if not completed earlier

### v1

- ingestion staging pipeline
- candidate discovery
- data validation workflow
- low-frequency candidate watchlist

### v2

- Pages Functions or D1 only if static JSON becomes insufficient

## Operating rule

Do not add complex automation before the registry model, source handling, and review process are stable.
