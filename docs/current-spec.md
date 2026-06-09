# Stable or Gone Current Specification

Updated: 2026-06-09

## 1. Product definition

Stable or Gone (SOG) is a terminal-style stablecoin history registry.

Public URL:

```txt
https://sog.badjoke-lab.com/
```

SOG records:

```txt
historical dossier
evidence registry
lifecycle archive
event history
issuer / protocol context
reserve / redemption context
regulatory context
known unknowns
```

SOG is not:

```txt
live price dashboard
market-cap ranking
trading terminal
stablecoin safety score
investment advice
legal advice
recommendation engine
```

Public wording should prefer source-backed historical context and avoid unsupported safety or recommendation language.

## 2. Current public state

Latest confirmed public baseline:

```txt
20 stablecoins
16 issuers
23 events
90 evidence records
40 reserve references
50 known unknowns
9 regulatory notes
37 deployments
75 static pages
```

Latest confirmed validation and deployment state:

```txt
SOG data validation passed
astro check: 0 errors
astro build: completed
Cloudflare Pages deploy: succeeded through PR-038
```

PR-039 event UX strengthening is present in the repository. A separate successful Cloudflare deploy after PR-039 has not yet been explicitly confirmed in this document.

Astro currently reports three non-blocking inline-script hints in `src/layouts/BaseLayout.astro`:

```txt
GA4 loader script
GA4 inline script
JSON-LD script
```

These hints request explicit `is:inline` handling and are not build blockers.

## 3. Current records

Stablecoins:

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

Issuers / protocol contexts:

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

## 4. Core pages

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

All stablecoin records use the shared `/stablecoin/[slug]/` detail route and `StablecoinDetailView.astro`.

## 5. Core data layers

Primary and supplemental data files currently include:

```txt
data/stablecoins.json
data/stablecoins-extra.json
data/issuers.json
data/issuers-extra.json
data/events.json
data/events-pr036.json
data/events-pr037.json
data/events-pr038.json
data/evidence.json
data/evidence-extra.json
data/evidence-pr033.json
data/evidence-events-pr036.json
data/evidence-events-pr037.json
data/evidence-events-pr038.json
data/reserve-reports.json
data/reserve-reports-extra.json
data/reserve-reports-pr033.json
data/reserve-reports-pr034.json
data/known-unknowns.json
data/known-unknowns-extra.json
data/known-unknowns-pr033.json
data/known-unknowns-pr034.json
data/regulatory-notes.json
data/deployments.json
data/deployments-extra.json
data/registry-updates.json
```

`data/known-unknowns-pr034.json` is intentionally retained as an empty compatibility array until validator/import cleanup is completed.

Canonical validation command:

```txt
npm run validate:data
npm run check
npm run build
```

The validator combines all current supplemental event/evidence/reserve/known-unknown layers and rejects missing files, invalid JSON, duplicate IDs/slugs, broken references, and invalid URLs covered by the current rules.

## 6. Status model

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

- `depegged` is an event, not a status.
- A recovered depeg does not make a stablecoin failed.
- Failed status requires source-backed lifecycle context, not price movement alone.
- Issuer redemption, protocol exits, exchange support, and secondary-market behavior must remain separate.

## 7. Event layer

The event layer expanded from 3 to 23 records through PR-036 to PR-038.

Current event files:

```txt
data/events.json
data/events-pr036.json
data/events-pr037.json
data/events-pr038.json
```

PR-036 added lifecycle, regulatory, reserve, recovery, chain-halt, and exchange phase-out context for:

```txt
USDT
USDC
DAI
UST
BUSD
```

PR-037 added event context for:

```txt
FDUSD
PYUSD
USDD
```

FRAX and TUSD were deliberately deferred where exact dated primary-source events were not yet strong enough.

PR-038 added event context for:

```txt
GUSD
LUSD
crvUSD
USDe
sUSD
```

Event targets:

```txt
current: 23
v0.1 target: 30+
later target: 60+
```

## 8. Event UX

PR-039 is implemented in the repository.

`/events/` currently provides:

```txt
search
event_type filter
impact_level filter
recovery-state filter
newest / oldest sorting
impact sorting
title sorting
visible result count
stablecoin name column
```

Stablecoin detail pages expose event counts in the hero and event-section link treatment.

Nullable event fields are supported:

```ts
event_date?: string | null;
recovered?: boolean | null;
```

## 9. Evidence and source rules

Prefer:

```txt
official dated announcement
regulator release
official protocol or issuer documentation
official exchange notice
primary repository release
verified explorer / contract reference
```

Use news and research for context when primary sources are unavailable or analysis is required.

Do not:

```txt
turn evidence coverage into a safety score
force exact dates from broad documentation entry pages
collapse issuer redemption and protocol conversion into one field
hide unresolved questions
```

Known unknowns remain visible when exact public support is incomplete.

## 10. SEO baseline

Completed baseline:

```txt
SEO-005 page-specific title / description
SEO-006 JSON-LD
SEO-007 OG image
SEO-008 internal links / related records
SEO-009 guide text strengthening
```

`BaseLayout.astro` supports canonical URLs, Open Graph, Twitter cards, OG image URLs, GA4 hooks, and JSON-LD injection.

Detail and collection pages use page-specific metadata and structured data where implemented.

## 11. Current UI direction

```txt
Terminal Registry UI
```

Rules:

- terminal-inspired, not an MS-DOS clone
- registry-first, not trading-terminal-first
- dense tables are acceptable
- evidence/log language is preferred
- status colors should be restrained and stable
- support remains secondary
- shared detail routes must not regress into simplified one-off pages

## 12. Current limitations

- event coverage is improved but still uneven across the 20 records
- FRAX and TUSD need exact-source event passes
- several protocol events still have low confidence or broad lifecycle dates
- source-specific reserve histories are incomplete
- chain-by-chain deployment coverage is incomplete
- redemption access needs more direct source extraction
- regulatory notes are not comprehensive
- Google Form URL is not inserted yet
- comparison and reserve-history views are not implemented
- supplemental JSON layers should later be normalized through a safer batch pipeline
- PR-039 requires explicit post-change public deploy confirmation

## 13. Next implementation focus

Next work item:

```txt
PR-041 Event quality pass + 30-event target
```

Priority candidates:

```txt
FRAX exact-source events
TUSD exact-source events
USDD depeg / market-stress event
GUSD attestation-history event
LUSD V1 / V2 / BOLD lifecycle separation
crvUSD exact launch / collateral events
USDe exact launch / reserve / risk event
sUSD V2 / V3 transition event
```

Rules for PR-041:

- do not add an event only to reach a count
- prefer exact dated primary sources
- keep broad lifecycle context separate from discrete incidents
- preserve nullable dates when exact timing is genuinely unresolved
- keep validation and static event detail generation passing

## 14. Following decision point

After the 30-event target:

```txt
PR-042 Comparison / reserve-history / issuer-deepening decision
PR-043 Selected feature implementation
```

The next feature should be chosen based on evidence value and registry usefulness, not dashboard novelty.