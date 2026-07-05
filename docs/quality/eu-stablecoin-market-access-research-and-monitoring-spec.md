# EU Stablecoin Market Access Research and Monitoring Specification

Status: canonical specification  
Updated: 2026-07-05  
Applies to: EU/EEA stablecoin access research, the reviewed market-access guide, and the later monitoring extension

## 1. Purpose

This specification governs how Stable or Gone researches, publishes, and later monitors EU/EEA stablecoin market access.

The target question is not whether a token is simply "allowed" or "banned" in Europe. The research must answer the narrower operational question:

```text
Which stablecoin
on which platform
for which legal entity or region
can be bought, sold, traded, deposited, withdrawn, held, converted, or automatically converted
at a given date?
```

The initial public article route is fixed as:

```text
/guides/eu-stablecoin-access-after-mica/
```

The article complements, and does not replace, the existing framework guide:

```text
/guides/mica-stablecoins/
```

The MiCA guide explains the legal framework and transition timeline. The market-access guide records observed service availability and restrictions across representative platforms and assets.

## 2. Core distinction

Research and monitoring must preserve these separate layers:

```text
issuer legal status
stablecoin legal or regulatory status
CASP authorization status
platform policy
customer legal entity
geographic scope
product/function availability
self-custody availability
effective date
```

No single layer may be used as a substitute for another.

Examples of prohibited simplification:

```text
MiCA-authorized company -> every related stablecoin is automatically available
platform trading halt -> token is banned from the EU
withdrawal still available -> full trading support remains
issuer compliance claim -> current ESMA register status is proven
media report -> platform policy is confirmed for every EU/EEA customer
```

## 3. Research scope for the initial article

### 3.1 Platform coverage target

The publication target is at least 10 researched platforms, including representation from:

```text
large global exchanges
EU-focused or EU-licensed exchanges
banking or fintech applications
broker or conversion platforms where relevant
```

Initial priority set:

```text
Binance
Coinbase
Kraken
Bitstamp
Crypto.com
OKX Europe
Bybit EU
Bitpanda
Revolut
Uphold
```

Additional platforms may be added when they materially improve EU/EEA coverage.

The article does not need equal-length prose for every researched platform. The research matrix should be broader than the narrative case studies.

### 3.2 Stablecoin coverage target

The publication target is at least 15 reviewed stable assets and should cover both restriction and expansion patterns.

Priority access-contraction or restriction set:

```text
USDT
DAI
PYUSD
RLUSD
TUSD
FDUSD
USDP
GUSD
USDD
USDS
EURT
```

Priority regulated-access or distribution-expansion set:

```text
USDC
EURC
EURI
EURCV
EURQ
USDQ
USDG
```

Complex protocol-issued or lineage cases may be included when they are needed to explain why access decisions cannot be reduced to issuer branding.

## 4. Research matrix

The working research matrix must distinguish at least these fields:

```text
platform
platform_legal_entity
region_scope
asset_id
asset_symbol
buy_status
sell_status
spot_trading_status
margin_status
earn_status
deposit_status
withdraw_status
custody_status
convert_status
auto_conversion_status
announcement_date
effective_date
source_url
source_type
source_publisher
last_checked_at
review_state
notes
```

Allowed functional states are:

```text
available
unavailable
restricted
convert_only
withdraw_only
sell_only
deadline_pending
auto_conversion_scheduled
not_applicable
not_confirmed
```

Unknown or unconfirmed cells remain `not_confirmed`. They must not be filled by inference from another function.

For example, a spot-trading restriction does not imply a deposit restriction. A custody statement does not imply a withdrawal statement.

## 5. Geography and legal-entity rule

Every material access claim must identify the narrowest supported scope.

Preferred scope forms:

```text
European Union
European Economic Area
specific EU member state
specific regulated legal entity
specific customer migration cohort
```

Do not rewrite EEA as EU when the source says EEA. Do not generalize a legal-entity migration notice to every customer worldwide.

If a public source does not establish scope, record the claim as scope-unresolved and do not use it to support a universal statement.

## 6. Source hierarchy

### Tier A — regulator and official register

Preferred for regulatory and authorization claims:

```text
ESMA
EBA
European Commission
national competent authorities
official MiCA registers
```

### Tier B — first-party platform and issuer sources

Preferred for product availability and policy claims:

```text
platform help center
platform legal notice
platform delisting notice
platform product-availability page
issuer regulatory page
issuer product page
issuer white paper
```

### Tier C — high-quality reporting

Reuters and similarly strong reporting may be used when first-party public material is incomplete, removed, unavailable, or needed to establish the existence of a customer notice.

Tier C alone must not populate a complete function matrix unless the report explicitly supports each relevant field.

### Tier D — discovery only

Social posts, search results, forums, screenshots, and secondary aggregators may identify a lead. They do not by themselves confirm a market-access row.

## 7. Revolut handling rule

The initial article may use the reported Revolut USDT change as the narrative entry point, but the detailed matrix row is not considered fully confirmed until the research establishes, as far as public evidence allows:

```text
target legal entity
target region or customer cohort
purchase stop date
deposit stop date
withdrawal deadline
custody deadline
auto-conversion rule
conversion destination or base-currency rule
```

If first-party public material remains unavailable, the article must label the claim as reported from a customer notice or secondary reporting and must not present unresolved scope as a global Revolut policy.

## 8. Publication gate for the initial guide

The article is publishable only when all of the following are satisfied:

```text
at least 10 platforms researched
at least 15 stable assets reviewed
function-level access states separated
region/legal-entity scope recorded where supported
major platform claims backed primarily by Tier A or Tier B sources
ESMA or relevant register cross-check completed
Revolut scope represented conservatively if still unresolved
article source list reviewed
publication-date current-state recheck completed
```

The article must include:

```text
publication date
information current through date
source links
revision history support
related guide link to /guides/mica-stablecoins/
related stablecoin links for material assets
scope disclaimer
```

## 9. Article structure

The initial narrative structure is fixed at a high level:

```text
1. Revolut news as the entry point, with scope caveat
2. What "available" means by function
3. Short MiCA timeline and link to the framework guide
4. Platform case studies
5. Asset-by-asset cross-platform comparison
6. Access expansion and new regulated distribution paths
7. Why the result is not a simple winner/loser table
8. User verification checklist
9. Conclusion and revision policy
```

The article must not become a safety ranking, investment recommendation, or market-share ranking.

## 10. Snapshot and revision governance

The article is a reviewed dated editorial surface, not a live dashboard.

The first publication records a reviewed snapshot current through a specific date. Later material changes update:

```text
informationCurrentThrough
updatedAt
revisions[]
article matrix or prose
source list when needed
related guide mapping when needed
```

A change in a monitored source does not automatically update the public article.

The required flow is:

```text
source change
-> private monitoring candidate
-> human/AI review
-> source confirmation
-> matrix decision
-> editorial revision
-> reviewed PR
-> merge to main
```

## 11. Market-access monitoring extension

The existing review-only monitoring architecture remains the base implementation. The market-access extension adds observation coverage, not a separate automatic publishing system.

Monitoring layers:

### 11.1 Platform policy watch

Observe reviewed first-party pages for:

```text
stablecoin availability
regional asset restrictions
delisting or relisting
buy/sell restrictions
spot or margin restrictions
deposit or withdrawal changes
custody-only states
convert-only states
auto-conversion deadlines
customer legal-entity migration notices
```

### 11.2 Regulatory register watch

Observe reviewed regulator or official register sources for:

```text
EMT issuer status
ART issuer status
CASP authorization status
register additions or removals
relevant non-compliant entity changes
material national authority actions
```

### 11.3 Issuer status watch

Reuse the existing issuer, reserve, redemption, lifecycle, and regulatory monitoring where relevant. Market-access monitoring must not duplicate existing issuer-source coverage merely to create a second candidate stream.

### 11.4 News discovery

News discovery may be used to identify leads, but discovery output is not a canonical fact and is not sufficient for public article revision.

## 12. Material-change rule

The market-access monitoring extension should create review candidates only for material access or scope changes, including:

```text
available -> unavailable
unavailable -> available
trading enabled or disabled
deposit enabled or disabled
withdrawal enabled or disabled
custody-only transition
sell-only transition
convert-only transition
auto-conversion deadline added or changed
region scope changed
customer legal entity changed
new stablecoin support
stablecoin support removal
regulatory register status changed
```

Layout changes, footer changes, cookie text, analytics markup, and metadata-only changes are not market-access candidates.

## 13. Monitoring schedule target

The target cadence for the later scheduled implementation is:

```text
platform policy sources: daily
platform announcement sources: daily
news discovery: daily
ESMA and regulatory registers: weekly
issuer regulatory/transparency sources: weekly unless an existing cadence is already stricter
article stale-state review: weekly
```

The schedule remains bounded and read-only. No job may run more frequently merely because the source is easy to fetch.

## 14. Safety boundary

Market-access monitoring inherits the repository monitoring safety boundary.

It may:

```text
fetch allowlisted sources
normalize content
compare to reviewed baselines
classify observed changes
produce private review material
```

It may not:

```text
write canonical registry data
edit the guide automatically
mutate accepted baselines
create branches automatically
open pull requests automatically
publish candidates
publish the article automatically
deploy
```

## 15. Implementation sequencing

Research may begin immediately after this specification is merged and may proceed in parallel with PR #302.

The public article implementation occurs only after PR #302 is merged.

The canonical schedule is maintained in `docs/roadmap.md`. The intended sequence is:

```text
PR #303  specification and schedule amendment for EU market-access research and monitoring
PR #304  reviewed EU stablecoin market-access article and initial snapshot
PR #305  known-unknown and placeholder integrity audit
PR #306  100-asset monitoring coverage recalculation
PR #307-#311  non-UI release hardening
PR #312-#315  monitoring expansion and scheduled read-only operation, including market-access coverage
PR #316-#319  statistics implementation
PR #320-#325  controlled growth from 100 to 110
```

The roadmap, not this section alone, is authoritative for current position and exact next work.

## 16. Required reading for this workstream

Before research, article implementation, or market-access monitoring changes, read:

```text
AGENTS.md
docs/spec-governance.md
docs/roadmap.md
docs/deployment-policy.md
docs/quality/non-ui-quality-program.md
docs/quality/eu-stablecoin-market-access-research-and-monitoring-spec.md
docs/quality/monitoring-pipeline-spec.md
docs/quality/monitoring-official-source-spec.md
docs/quality/monitoring-official-source-schema.md
docs/quality/monitoring-review-material-spec.md
```

Article implementation must also inspect:

```text
src/data/guideCatalog.ts
src/data/stablecoinGuideLinks.ts
scripts/validate-guides.mjs
/guides/mica-stablecoins/ implementation
```

## 17. Deployment classification

Specification and monitoring-plan changes:

```text
No production deployment required
```

The reviewed article follows the normal guide publication path in `docs/deployment-policy.md` after merge to `main`.
