# Stable or Gone Current Specification

Updated: 2026-06-07

## 1. Product definition

Stable or Gone (SOG) is a terminal-style stablecoin history registry.

Public URL:

```txt
https://sog.badjoke-lab.com/
```

SOG records stablecoin entities, issuers, events, reserve references, redemption context, regulatory/official context, deployment/contract notes, evidence, registry updates, and visible uncertainty.

SOG is not:

- a live price dashboard
- a market cap ranking
- a trading terminal
- a stablecoin safety rating site
- a recommendation engine
- an investment guide
- a legal or regulatory advice service

## 2. Current public state

SOG is publicly deployed on the official custom domain.

Current state:

```txt
20 stablecoin records
16 issuer records
3 event records
59 evidence records
30 reserve references
45 known unknowns
9 regulatory notes
31 deployments
Top 5 original records deepened
PR-026 seed expansion batch 4 added
PR-028A to PR-028E new 5 records deepened
PR-031 validator and supplemental data integration completed
Registry search/filter implemented
Guides and glossary added
Registry updates page added
SEO-005 to SEO-009 baseline completed
Public deploy confirmed after PR-031
```

Build / validation status from the latest confirmed Cloudflare deploy:

```txt
SOG data validation passed: 20 stablecoins, 16 issuers, 3 events, 59 evidence records, 30 reserve references, 45 known unknowns, 9 regulatory notes, 31 deployments.
astro check: 0 errors, 0 warnings, 1 hint
astro build: 55 pages built
Cloudflare Pages deploy: Success
```

The remaining Astro hint is about JSON-LD script inline handling in `BaseLayout.astro`. It is not a build blocker.

## 3. Competitive position

SOG should compete as:

```txt
historical dossier + evidence registry + lifecycle archive
```

The winning angle is not current market data. The winning angle is making it easy to inspect:

- what the stablecoin is
- who issued it
- how it was designed
- how reserve disclosure is represented
- who could redeem and under what terms
- what material events happened
- whether a depeg recovered
- whether the token was discontinued, failed, migrated, or rebranded
- what public sources support the record
- what remains unclear

## 4. Core pages

Current public pages:

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
/og/sog-og.svg
```

Additional batch 4 records use the same shared detail view as the original records through `/stablecoin/[slug]/`.

## 5. Core data files

Current data files:

```txt
data/stablecoins.json
data/stablecoins-extra.json
data/issuers.json
data/issuers-extra.json
data/events.json
data/evidence.json
data/evidence-extra.json
data/reserve-reports.json
data/reserve-reports-extra.json
data/known-unknowns.json
data/known-unknowns-extra.json
data/regulatory-notes.json
data/deployments.json
data/deployments-extra.json
data/registry-updates.json
```

The `*-extra.json` files are supplemental data layers used during seed expansion and source-deepening. They are now included in:

```txt
scripts/validate-data.mjs
/stablecoins/
/stablecoin/[slug]/
/issuers/
/issuer/[slug]/
/sitemap-index.xml
```

Build validation:

```txt
scripts/validate-data.mjs
npm run validate:data
npm run build
```

The build should fail on broken JSON, missing required IDs, duplicate IDs/slugs, invalid URLs, missing stablecoin references, missing issuer references, missing event references, or missing deployment evidence references covered by the validator.

## 6. Status labels

Current status enum:

```txt
active
limited
impaired
discontinued
failed
rebranded
migrated
unknown
```

Rules:

- `depegged` is not a status.
- Depeg is an event type.
- A recovered depeg does not make a stablecoin failed.
- Failed status requires source-backed lifecycle/event context, not price movement alone.

## 7. Current SEO baseline

Completed SEO work:

```txt
SEO-005 page-specific title / description strengthened
SEO-006 JSON-LD added
SEO-007 OG image asset added
SEO-008 internal links / related records strengthened
SEO-009 guide pages strengthened for search-oriented text
```

Implemented behavior:

- `BaseLayout.astro` supports canonical URL, Open Graph tags, Twitter card tags, OG image URL, and JSON-LD injection.
- Home, registry/list pages, detail pages, guides, methodology, and updates use page-specific metadata where updated.
- Stablecoin detail pages expose Dataset JSON-LD.
- Event detail pages expose Article JSON-LD.
- Issuer detail pages expose Organization JSON-LD.
- Guide and methodology pages expose Article JSON-LD.
- Registry and updates pages expose CollectionPage JSON-LD.
- Default OG image exists at `/og/sog-og.svg`.
- Guide pages have stronger explanatory text and internal links to related records.

Representative SEO files:

```txt
src/layouts/BaseLayout.astro
public/og/sog-og.svg
src/pages/index.astro
src/pages/stablecoins/index.astro
src/pages/stablecoin/[slug].astro
src/components/StablecoinDetailView.astro
src/pages/events/index.astro
src/pages/event/[id].astro
src/pages/issuers/index.astro
src/pages/issuer/[slug].astro
src/pages/guides/what-is-a-depeg/index.astro
src/pages/guides/status-vs-event/index.astro
src/pages/guides/reserve-disclosure-basics/index.astro
src/pages/guides/stablecoin-lifecycle-terms/index.astro
src/pages/methodology/index.astro
src/pages/updates/index.astro
```

## 8. Current limitations

Known limitations:

- original 10 non-top-5 records remain mostly shallow seed entries
- source-specific market prices and depeg durations are not yet selected
- period-level reserve report histories are not complete
- many contract addresses and chain-by-chain deployment statuses are still source-review areas
- redemption access fields need more direct source extraction
- lifecycle map is event-derived, not yet a dedicated lifecycle data model
- regulatory notes exist but are not complete
- Google Form URL is not inserted yet
- comparison pages are not implemented yet
- `*-extra.json` files are functional and validated, but should later be normalized or merged through a safer batch data pipeline

## 9. Source-deepening status

Completed source-deepening sequence:

```txt
PR-024A USDC source-deepening — completed
PR-024B BUSD source-deepening — completed
PR-024C UST source-deepening — completed
PR-024D USDT / DAI source-deepening — completed
PR-028A RLUSD source-deepening — completed
PR-028B EURC source-deepening — completed
PR-028C USDP source-deepening — completed
PR-028D USDG source-deepening — completed
PR-028E USDS source-deepening — completed
```

Rules for source-deepening:

- prefer official issuer, regulator, exchange, protocol, repository, explorer, or primary documentation sources
- use news/research as context when primary sources are unavailable or when analysis is needed
- do not display source-specific market lows or durations until a source is selected
- do not convert evidence coverage into a score
- keep issuer redemption, protocol exits, and market exits separate
- keep known unknowns visible when exact source support is incomplete
- distinguish fiat-backed issuer redemption from protocol/app-based conversion and exit mechanics
- keep related assets such as sUSDS separate from the base stablecoin record

## 10. Current records

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
RLUSD
EURC
USDP
USDG
USDS
```

Current issuer records:

```txt
Tether
Circle
MakerDAO / Sky
Terraform Labs
Paxos
Frax Finance
TrueUSD
First Digital / FD121
TRON DAO Reserve
Gemini
Liquity
Curve Finance
Ethena Labs
Synthetix
Ripple
Global Dollar Network
```

Current event records:

```txt
USDC March 2023 depeg
UST May 2022 collapse
BUSD wind-down
```

Deepened original top 5 records:

```txt
USDT
USDC
DAI
UST / TerraUSD
BUSD
```

Deepened PR-026 batch 4 records:

```txt
RLUSD
EURC
USDP
USDG
USDS
```

## 11. Current UI direction

Design direction:

```txt
Terminal Registry UI
```

Rules:

- terminal-inspired, not MS-DOS clone
- registry-first, not trading-terminal-first
- dense tables are acceptable
- source/evidence/log language is preferred
- status colors should be stable and restrained
- support route exists but is secondary
- additional records must not use separate simplified detail pages; they should use the shared detail view

## 12. Next implementation focus

Next PR:

```txt
PR-033 Original seed record bottom-up pass
```

Purpose:

```txt
Improve the shallow original non-top-5 records so the site no longer has a strong top layer and visibly thin middle layer.
```

Recommended PR-033 target set:

```txt
FRAX
TUSD
FDUSD
PYUSD
USDD
```

PR-033 checklist:

```txt
add or strengthen evidence references
add reserve/transparency references
add deployment notes
split known unknowns
update stablecoin body fields where needed
keep validator passing at 20 records
confirm Cloudflare build/deploy
```

After PR-033:

```txt
PR-034 Second bottom-up pass for GUSD / LUSD / crvUSD / USDe / sUSD
PR-035 Registry Updates / docs sync
PR-036 Comparison or reference page decision
```
