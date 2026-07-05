# EU Stablecoin Market Access Research and Monitoring Specification

Status: canonical specification  
Updated: 2026-07-05  
Applies to: EU/EEA stablecoin access research, the reviewed market-access guide, and the later monitoring extension

## 1. Purpose

This specification governs how Stable or Gone researches, publishes, and later monitors EU/EEA stablecoin market access.

The target question is not whether a token is simply "allowed" or "banned" in Europe. Research must answer the narrower operational question:

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

It complements, and does not replace:

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
platform service state
platform stablecoin policy
customer legal entity
geographic scope
product/function availability
self-custody availability
announcement date
effective date
```

No layer may substitute for another.

Prohibited simplifications include:

```text
MiCA-authorized company -> every related stablecoin is automatically available
platform licence -> every supported asset and function is known
platform trading halt -> token is banned from the EU
withdrawal still available -> full trading support remains
issuer compliance claim -> current ESMA register status is proven
Global product page -> EU/EEA function availability is proven
media report -> every function cell is confirmed
historical stablecoin policy -> current platform-wide service state is unchanged
```

## 3. Research scope for the initial article

### 3.1 Platform coverage target

Publication requires at least 10 researched platforms with representation from:

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

Additional platforms may be added when they materially improve EU/EEA coverage. Gemini has been added as one such additional research platform.

The article does not need equal-length prose for every researched platform. The research matrix should be broader than the narrative case studies.

Meeting the 10-platform breadth floor does not authorize publication. A platform counted for research breadth may still have unresolved function-level access states.

### 3.2 Stablecoin coverage target

Publication requires at least 15 reviewed stable assets and should cover both restriction and expansion patterns.

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

Complex protocol-issued or lineage cases may be included when needed to explain why access decisions cannot be reduced to issuer branding.

A stable asset being touched by a reviewed platform finding counts toward research breadth only. It does not mean the asset has a complete cross-platform matrix.

## 4. Research matrix

The working research matrix must distinguish at least:

```text
platform
platform_legal_entity
platform_service_state
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

Allowed functional states:

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

Unknown or unsupported cells remain `not_confirmed`.

A spot-trading restriction does not imply a deposit restriction. A custody statement does not imply a withdrawal statement. A CASP licence does not imply a stablecoin function state.

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

Do not rewrite EEA as EU when the source says EEA. Do not generalize a legal-entity migration notice or customer cohort to every user worldwide.

If a source does not establish scope, record the claim as scope-unresolved and do not use it to support a universal statement.

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
platform delisting or relisting notice
platform product-availability page with scoped geography
issuer regulatory page
issuer product page
issuer white paper
```

### Tier C — high-quality reporting

Reuters, Financial Times, and similarly strong reporting may be used when first-party public material is incomplete, removed, unavailable, or needed to establish current service context or the existence of a customer notice.

Tier C alone must not populate a complete function matrix unless the report explicitly supports each relevant field.

### Tier D — discovery only

Social posts, search results, forums, screenshots, and secondary aggregators may identify a lead. They do not by themselves confirm a market-access row.

## 7. Research-state rules established by checkpoint work

### 7.1 Historical policy versus current platform service state

A platform's earlier stablecoin-specific policy may remain historically valid while later platform-wide licensing or service changes alter current access.

The article must separate these layers when both matter.

Current required example:

```text
Binance 2025: stablecoin-specific EEA restrictions by function
Binance 2026: broader EU service interruption or wind-down context after the MiCA transition deadline
```

Do not present the 2025 Binance function table as a complete July 2026 current-service table.

### 7.2 Licensing context versus function matrix

The following are distinct evidence states:

```text
licensed service context reviewed
platform service state reviewed
stablecoin-specific function policy reviewed
```

A platform may count toward research breadth through reviewed licensing or service context while remaining unsuitable for a function-level comparison until scoped first-party evidence is found.

### 7.3 Public marketing page scope

A Global product page may establish that a platform markets or describes a token, but it does not establish EU/EEA customer access unless the page or related terms establish that scope.

## 8. Revolut handling rule

The article may use the reported Revolut USDT change as the narrative entry point, but the detailed policy row is not fully confirmed until research establishes, as far as public evidence allows:

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

The official CASP legal-entity layer is separately recorded when supported by regulator evidence. That evidence must not be treated as confirmation of the reported USDT schedule.

If first-party public material remains unavailable, the article must label the change as reported from a customer notice or secondary reporting and must not present unresolved scope as a global Revolut policy.

## 9. Publication gate for the initial guide

The article is publishable only when all of the following are satisfied:

```text
at least 10 platforms researched
at least 15 stable assets reviewed
function-level access states separated for the comparative claims actually used
region/legal-entity scope recorded where supported
major platform claims backed primarily by Tier A or Tier B sources
ESMA or relevant register cross-check completed
Revolut scope represented conservatively if still unresolved
article source list reviewed
current platform service context separated from historical policy where necessary
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

## 10. Article structure

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

The article must not become a safety ranking, investment recommendation, market-share ranking, or issuer scorecard.

## 11. Snapshot and revision governance

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

A monitored source change does not automatically update the public article.

Required flow:

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

## 12. Market-access monitoring extension

The existing review-only monitoring architecture remains the base implementation. Market-access monitoring adds observation coverage, not a separate publishing system.

### 12.1 Platform policy watch

Observe reviewed first-party pages for:

```text
stablecoin availability
regional asset restrictions
delisting or relisting
buy/sell restrictions
spot or margin restrictions
Earn restrictions
deposit or withdrawal changes
custody-only states
convert-only states
auto-conversion deadlines
customer legal-entity migration notices
```

### 12.2 Regulatory register watch

Observe reviewed regulator or official register sources for:

```text
EMT issuer status
ART issuer status
CASP authorization status
register additions or removals
relevant non-compliant entity changes
material national authority actions
```

### 12.3 Issuer status watch

Reuse the existing issuer, reserve, redemption, lifecycle, and regulatory monitoring where relevant. Do not duplicate existing issuer-source coverage merely to create a second candidate stream.

### 12.4 News discovery

News discovery may identify leads and current service-context changes, but discovery output is not a canonical fact and is insufficient for automatic article revision.

## 13. Material-change rule

Market-access monitoring should create review candidates only for material access or scope changes, including:

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
platform-wide service state changed
new stablecoin support
stablecoin support removal
regulatory register status changed
```

Layout changes, footer changes, cookie text, analytics markup, and metadata-only changes are not market-access candidates.

## 14. Monitoring schedule target

Target cadence for the later scheduled implementation:

```text
platform policy sources: daily
platform announcement sources: daily
news discovery: daily
ESMA and regulatory registers: weekly
issuer regulatory/transparency sources: weekly unless an existing cadence is stricter
article stale-state review: weekly
```

The schedule remains bounded and read-only. No job may run more frequently merely because the source is easy to fetch.

## 15. Safety boundary

Market-access monitoring may:

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

## 16. Implementation sequencing

Completed:

```text
PR #302  lifecycle and relationship boundary audit
PR #303  specification and schedule amendment for EU market-access research and monitoring
```

Active and next:

```text
PR #304  reviewed research matrix, checkpoints, and schedule synchronization
PR #305  reviewed EU stablecoin market-access article after publication gate passes
PR #306  known-unknown and placeholder integrity audit
PR #307  100-asset monitoring coverage recalculation
PR #308-#312  non-UI release hardening
PR #313-#316  monitoring expansion and scheduled read-only operation, including market-access coverage
PR #317-#320  statistics implementation
PR #321-#326  candidate audit and controlled growth from 100 to 110
```

The canonical schedule is maintained in `docs/roadmap.md`. The roadmap is authoritative for the current item and exact next PR number.

Research checkpoints may be merged before the article when they improve reproducibility, record unresolved source gaps, or correct current-state interpretation. Research checkpoints do not publish the article.

## 17. Required reading for this workstream

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

For current research work, also read:

```text
data/editorial-research/eu-stablecoin-market-access.json
data/editorial-research/eu-stablecoin-market-access-context-batch-02.json
docs/audits/eu-stablecoin-market-access-research-checkpoint-2026-07-05.md
docs/audits/eu-stablecoin-market-access-research-checkpoint-02-2026-07-05.md
```

Article implementation must also inspect:

```text
src/data/guideCatalog.ts
src/data/stablecoinGuideLinks.ts
scripts/validate-guides.mjs
src/pages/guides/mica-stablecoins/index.astro
```

## 18. Deployment classification

Specification, research checkpoint, and monitoring-plan changes:

```text
No production deployment required
```

The reviewed article follows the normal guide publication path in `docs/deployment-policy.md` after merge to `main`.
