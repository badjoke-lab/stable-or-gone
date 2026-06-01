# Stable or Gone Current Specification

Updated: 2026-06-01

## 1. Product definition

Stable or Gone (SOG) is a terminal-style stablecoin history registry.

It records stablecoin entities, issuers, events, reserve references, redemption context, evidence, and visible uncertainty.

SOG is not:

- a live price dashboard
- a market cap ranking
- a trading terminal
- a stablecoin safety rating site
- a recommendation engine
- an investment guide
- a legal or regulatory advice service

## 2. Competitive position

Existing stablecoin products already cover several strong areas:

- market dashboards and supply/chain views
- real-time or near-real-time monitoring
- on-chain transaction analytics
- safety assessments or ratings
- reserve/attestation-specific dashboards

SOG should not compete directly with those areas.

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

## 3. Core pages

Current v0 public pages:

```txt
/
/stablecoins/
/stablecoin/[slug]/
/issuers/
/issuer/[slug]/
/events/
/event/[id]/
/models/
/glossary/
/methodology/
/about/
/support/
/contact/
/sitemap-index.xml
/robots.txt
```

## 4. Core data files

Current v0 data files:

```txt
data/stablecoins.json
data/issuers.json
data/events.json
data/evidence.json
data/reserve-reports.json
data/known-unknowns.json
```

Build validation:

```txt
scripts/validate-data.mjs
npm run validate:data
npm run build
```

The build must fail on broken JSON, missing required IDs, duplicate IDs/slugs, or broken cross-references.

## 5. Record types

### stablecoin_entity

Represents one stablecoin record.

Core fields:

- id
- slug
- name
- symbol
- aliases
- status
- issuer_id
- peg_asset
- collateral_model
- reserve_disclosure_status
- redemption_status
- launch_date
- discontinued_date
- summary
- confidence
- last_verified_at
- notes

### issuer_entity

Represents issuer, protocol, company, DAO, foundation, or organization context.

Core fields:

- id
- slug
- name
- issuer_type
- jurisdiction
- related_stablecoins
- official_url
- summary
- confidence
- last_verified_at
- notes

### stablecoin_event

Represents a material historical event.

Core fields:

- id
- stablecoin_id
- issuer_id
- event_type
- event_date
- title
- description
- impact_level
- event_status_effect
- recovered
- recovery_date
- failure_mechanism
- confidence
- source_count
- notes

### evidence

Represents source-backed support for a claim.

Core fields:

- id
- stablecoin_id
- issuer_id
- event_id
- source_type
- title
- url
- publisher
- published_at
- archived_url
- accessed_at
- reliability
- claim_scope
- notes

### reserve_report

Represents reserve disclosure, attestation, audit, or issuer reserve reference.

Core fields:

- id
- stablecoin_id
- issuer_id
- report_date
- period_covered
- publisher
- report_type
- asset_categories
- url
- archived_url
- confidence
- notes

### known_unknown

Represents visible uncertainty.

Core fields:

- id
- stablecoin_id
- issuer_id
- topic
- description
- severity
- last_checked_at
- notes

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

## 7. Depeg handling

SOG does not record every small peg movement.

SOG records a depeg event when it is material, sustained, historically relevant, or source-backed.

Current classes:

```txt
minor peg deviation
notable depeg event
major depeg event
collapse
```

Public rule:

```txt
A depeg event does not automatically mean a stablecoin failed.
```

For each significant event, SOG should eventually record:

- target peg
- lowest observed price if source-specific
- approximate duration if source-specific
- trigger/context
- recovery true/false
- recovery date if supportable
- failure mechanism if supportable
- source list
- confidence
- known unknowns

## 8. Competitive differentiators to add or strengthen

The following are required for SOG to become stronger than a generic stablecoin list:

### 8.1 Lifecycle map

Each stablecoin should eventually expose lifecycle relationships:

- launched
- expanded
- notable depeg
- recovered
- restricted
- wind-down
- discontinued
- failed
- migrated
- rebranded
- successor token
- predecessor token

This can start as event data and later become a dedicated lifecycle view.

### 8.2 Redemption access

Each stablecoin detail page should clearly show redemption context:

- redemption status
- who can redeem
- retail/institutional distinction if known
- region limits if known
- minimum redemption if known
- wind-down window if relevant

If unclear, the page should show it as a known unknown.

### 8.3 Reserve disclosure history

Each stablecoin should show reserve disclosure references and not just a single label.

Reserve records should distinguish:

- issuer disclosure
- attestation
- audit
- regulatory filing
- current transparency page
- historical report

### 8.4 Evidence coverage panel

Each detail page should eventually show source coverage by type:

- issuer source
- market data source
- reserve report
- public notice
- regulatory source
- archive

This is not a score. It is a source-coverage view.

### 8.5 Known unknowns

Visible uncertainty is part of the product.

Do not hide unclear data. Do not guess.

### 8.6 Failure mechanism taxonomy

Material events should use failure mechanism labels when supportable:

- bank_run_or_redemption_pressure
- reserve_asset_exposure
- algorithmic_death_spiral
- collateral_liquidation_stress
- oracle_or_liquidity_fragmentation
- regulatory_shutdown
- issuer_wind_down
- bridge_or_wrapped_asset_dependency
- governance_or_protocol_failure
- unknown

### 8.7 Contract and deployment status

This is not yet complete in v0, but is important for future differentiation.

Future records should distinguish:

- native issuance
- bridged asset
- wrapped asset
- deprecated contract
- old bridged token
- chain-specific status
- contract control notes

### 8.8 Regulatory notes

Regulatory notes should remain source-backed and conservative.

Avoid broad legal conclusions. Record public notices, issuer statements, regulator documents, and exchange actions with dates.

## 9. Current seed records

Current stablecoin seed:

- USDT
- USDC
- DAI
- UST / TerraUSD
- BUSD

Current issuer seed:

- Tether
- Circle
- MakerDAO / Sky
- Terraform Labs
- Paxos

Current event seed:

- USDC March 2023 depeg
- UST May 2022 collapse
- BUSD wind-down

## 10. Current UI direction

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

## 11. Current limitations

Current v0 is useful as a foundation but incomplete as a competitive product.

Known limitations:

- seed data is shallow
- source coverage is sparse
- reserve report history is not complete
- redemption access fields need clearer structure
- lifecycle map is not yet visible as a dedicated component
- deployment/contract data does not exist yet
- regulatory notes are not yet separated
- no search/filter UI yet
- no guide/comparison pages yet
- Google Form URL is not inserted yet

## 12. Completion target for public v0

Public v0 should be considered meaningfully complete when:

- at least 15 stablecoins are in the registry
- top 5 records have stronger evidence coverage
- all current seed events have source-backed event pages
- detail pages show status, issuer, reserve, redemption, events, evidence, and known unknowns
- methodology clearly explains status vs event separation
- report entry links are visible
- sitemap and robots are live
- build validation catches data errors
- no live price, ranking, or score language is introduced
