# Stable or Gone Current Specification

Updated: 2026-06-02

## 1. Product definition

Stable or Gone (SOG) is a terminal-style stablecoin history registry.

Public URL:

```txt
https://sog.badjoke-lab.com/
```

It records stablecoin entities, issuers, events, reserve references, redemption context, regulatory/official context, deployment/contract notes, evidence, and visible uncertainty.

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
data/regulatory-notes.json
data/deployments.json
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
- who_can_redeem
- retail_redemption
- institutional_redemption
- minimum_redemption
- redemption_region_notes
- redemption_notes
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

### regulatory_note

Represents source-backed regulatory, official, banking, issuer notice, or public authority context.

Core fields:

- id
- stablecoin_id
- issuer_id
- event_id
- note_date
- title
- jurisdiction
- authority_or_source
- note_type
- summary
- source_url
- confidence
- notes

### deployment

Represents chain-specific deployment or contract context.

Core fields:

- id
- stablecoin_id
- chain
- deployment_type
- contract_address
- status
- notes
- evidence_ids

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

## 8. Competitive differentiators implemented or being strengthened

The following are required for SOG to become stronger than a generic stablecoin list.

### 8.1 Lifecycle map

Current implementation:

- Stablecoin detail pages show an event-derived lifecycle table.
- Launch date, registry events, discontinued date, and current status can appear together.
- This is not yet a dedicated lifecycle data file.

Future strengthening:

- successor token
- predecessor token
- migration relation
- rebrand relation
- chain-specific lifecycle

### 8.2 Redemption access

Current implementation:

- Stablecoin records include redemption access fields.
- Stablecoin detail pages show a dedicated redemption access section.
- SOG separates issuer redemption from secondary-market trading.

Fields:

- redemption status
- who can redeem
- retail/institutional distinction
- minimum redemption
- region/access notes
- registry notes

### 8.3 Reserve disclosure history

Current implementation:

- `reserve-reports.json` exists.
- Stablecoin detail pages show reserve/attestation history.
- Seed reserve references exist for 15 records, but many are placeholder-level and need source deepening.

Reserve records should distinguish:

- issuer disclosure
- attestation
- audit
- regulatory filing
- current transparency page
- historical report
- protocol disclosure
- synthetic/collateral mechanism disclosure

### 8.4 Evidence coverage panel

Current implementation:

- Stablecoin detail pages show evidence coverage by source type.
- Coverage is not a score.
- Coverage includes issuer source, reserve reference, market data, regulatory source, deployment/contract, exchange notice, news/analysis, archive capture, and other source.

### 8.5 Known unknowns

Current implementation:

- `known-unknowns.json` exists.
- Stablecoin detail pages show known unknowns.
- New seed records include known unknowns when important source gaps remain.

Visible uncertainty is part of the product.

Do not hide unclear data. Do not guess.

### 8.6 Failure mechanism taxonomy

Current implementation:

- `events.json` can hold `failure_mechanism`.
- Only early seed event coverage exists.

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

Current implementation:

- `deployments.json` exists.
- Stablecoin detail pages show deployment/contract records.
- Current entries are mostly placeholder-level and should be source-deepened before treating contract fields as final.

Future records should distinguish:

- native issuance
- bridged asset
- wrapped asset
- deprecated contract
- old bridged token
- chain-specific status
- contract control notes

### 8.8 Regulatory notes

Current implementation:

- `regulatory-notes.json` exists.
- Stablecoin detail pages show regulatory/official context.
- Current notes cover BUSD, UST, and USDC context.

Regulatory notes should remain source-backed and conservative.

Avoid broad legal conclusions. Record public notices, issuer statements, regulator documents, and exchange actions with dates.

## 9. Current seed records

Current stablecoin seed:

- USDT
- USDC
- DAI
- UST / TerraUSD
- BUSD
- FRAX
- TUSD
- FDUSD
- PYUSD
- USDD
- GUSD
- LUSD
- crvUSD
- USDe
- sUSD

Current issuer seed:

- Tether
- Circle
- MakerDAO / Sky
- Terraform Labs
- Paxos
- Frax Finance
- TrueUSD
- First Digital / FD121
- TRON DAO Reserve
- Gemini
- Liquity
- Curve Finance
- Ethena Labs
- Synthetix

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

Current v0 has public minimum breadth but remains incomplete as a competitive product.

Known limitations:

- 15 seed records exist, but many remain shallow
- source coverage is sparse for many records
- reserve report history is not complete
- redemption access fields are useful but need direct source deepening
- lifecycle map is event-derived, not yet a dedicated lifecycle data model
- deployment/contract data exists but is mostly placeholder-level
- regulatory notes exist but are not complete
- no search/filter UI yet
- no guide/comparison pages yet
- Google Form URL is not inserted yet

## 12. Completion target for public v0

Public v0 has reached minimum breadth at 15 records, but should be considered meaningfully complete when:

- top 5 records have stronger evidence coverage
- all current seed events have source-backed event pages
- detail pages show status, issuer, reserve, redemption, regulatory/official context, deployment/contract data, lifecycle, events, evidence, and known unknowns
- methodology clearly explains status vs event separation
- report entry links are visible
- sitemap and robots are live
- build validation catches data errors
- no live price, ranking, or score language is introduced
