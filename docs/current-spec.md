# Stable or Gone Current Specification

Updated: 2026-06-03

## 1. Product definition

Stable or Gone (SOG) is a terminal-style stablecoin history registry.

Public URL:

```txt
https://sog.badjoke-lab.com/
```

SOG records stablecoin entities, issuers, events, reserve references, redemption context, regulatory/official context, deployment/contract notes, evidence, and visible uncertainty.

SOG is not:

- a live price dashboard
- a market cap ranking
- a trading terminal
- a stablecoin safety rating site
- a recommendation engine
- an investment guide
- a legal or regulatory advice service

## 2. Competitive position

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

## 5. Status labels

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

## 6. Depeg handling

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

## 7. Competitive differentiators

### Lifecycle map

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

### Redemption access

Current implementation:

- Stablecoin records include redemption access fields.
- Stablecoin detail pages show a dedicated redemption access section.
- SOG separates issuer redemption from secondary-market trading.

### Reserve disclosure history

Current implementation:

- `reserve-reports.json` exists.
- Stablecoin detail pages show reserve/attestation/protocol disclosure history.
- Seed reserve references exist for 15 records.
- USDT, USDC, DAI, UST, and BUSD have stronger source-entry and context rows after PR-018.

Reserve records should distinguish:

- issuer disclosure
- attestation
- audit
- regulatory filing
- current transparency page
- historical report
- protocol disclosure
- synthetic/collateral mechanism disclosure
- event-specific reserve exposure or intervention context

### Evidence coverage panel

Current implementation:

- Stablecoin detail pages show evidence coverage by source type.
- Coverage is not a score.
- Top 5 records now have more evidence context than the initial seed state.

### Known unknowns

Current implementation:

- `known-unknowns.json` exists.
- Stablecoin detail pages show known unknowns.
- Important source gaps remain visible instead of being guessed.
- Top 5 known unknowns now distinguish price/timeline gaps, reserve history gaps, redemption gaps, deployment gaps, lifecycle gaps, and regulatory follow-up gaps.

### Failure mechanism taxonomy

Current implementation:

- `events.json` can hold `failure_mechanism`.
- USDC, UST, and BUSD event records have been deepened beyond initial seed state.

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

### Contract and deployment status

Current implementation:

- `deployments.json` exists.
- Stablecoin detail pages show deployment/contract records.
- Current entries are still mostly placeholder-level, but top 5 deployment notes now identify important review questions.

Future records should distinguish:

- native issuance
- bridged asset
- wrapped asset
- deprecated contract
- old bridged token
- chain-specific status
- contract control notes

### Regulatory notes

Current implementation:

- `regulatory-notes.json` exists.
- Stablecoin detail pages show regulatory/official context.
- USDC, UST, and BUSD regulatory/event context has been strengthened.

Regulatory notes should remain source-backed and conservative.

Avoid broad legal conclusions. Record public notices, issuer statements, regulator documents, exchange actions, and clearly marked news follow-up context with dates.

## 8. Current records

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

Top 5 deepened records:

- USDT: reserve/transparency, assurance entry point, redemption terms entry point, multichain unknowns
- USDC: March 2023 depeg, SVB exposure, recovery context, reserve reports entry point, multichain unknowns
- DAI: protocol/collateral disclosure entry point, Sky lifecycle unknowns, redemption-mechanics unknowns
- UST: collapse event, algorithmic death spiral label, SEC context, post-collapse lifecycle context, LFG reserve unknowns
- BUSD: Paxos wind-down, exchange support phase-out, reported regulatory follow-up, final redemption unknowns

## 9. Current UI direction

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

## 10. Current limitations

Current v0 has public minimum breadth and top 5 source deepening, but remains incomplete as a competitive product.

Known limitations:

- 15 records exist, but 10 records remain mostly shallow seed entries
- source-specific market prices and depeg durations are not yet selected
- period-level reserve report histories are not complete
- exact contract addresses and chain-by-chain deployment status are not complete
- redemption access fields need direct source extraction
- lifecycle map is event-derived, not yet a dedicated lifecycle data model
- regulatory notes exist but are not complete
- no search/filter UI yet
- no guide/comparison pages yet
- Google Form URL is not inserted yet

## 11. Completion target for public v0

Public v0 has reached minimum breadth and top 5 deepening, but should be considered meaningfully complete when:

- registry search/filtering exists
- all current seed events have stronger source-backed event pages
- key detail pages show status, issuer, reserve, redemption, regulatory/official context, deployment/contract data, lifecycle, events, evidence, and known unknowns
- methodology clearly explains status vs event separation
- report entry links are visible
- sitemap and robots are live
- build validation catches data errors
- no live price, ranking, or score language is introduced

## 12. Next implementation focus

Next PR:

```txt
PR-019 Registry filtering / search
```

Purpose:

```txt
Make the 15-record registry usable instead of just complete.
```
