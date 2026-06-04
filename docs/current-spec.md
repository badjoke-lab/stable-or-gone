# Stable or Gone Current Specification

Updated: 2026-06-04

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

SOG is publicly live and confirmed after PR-023.

Current state:

```txt
15 stablecoin records
14 issuer records
3 event records
Top 5 records deepened
USDC source-deepening completed
Registry search/filter implemented
Guides and glossary added
Registry updates page added
Pre-promotion QA checklist added
Public deploy confirmed
```

QA checklist:

```txt
docs/pre-promotion-qa.md
```

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
```

## 5. Core data files

Current data files:

```txt
data/stablecoins.json
data/issuers.json
data/events.json
data/evidence.json
data/reserve-reports.json
data/known-unknowns.json
data/regulatory-notes.json
data/deployments.json
data/registry-updates.json
```

Build validation:

```txt
scripts/validate-data.mjs
npm run validate:data
npm run build
```

The build should fail on broken JSON, missing required IDs, duplicate IDs/slugs, or broken cross-references covered by the validator.

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

## 7. Current limitations

Known limitations:

- 10 records remain mostly shallow seed entries
- source-specific market prices and depeg durations are not yet selected
- period-level reserve report histories are not complete
- exact contract addresses and chain-by-chain deployment status are not complete
- redemption access fields need direct source extraction
- lifecycle map is event-derived, not yet a dedicated lifecycle data model
- regulatory notes exist but are not complete
- Google Form URL is not inserted yet
- comparison pages are not implemented yet

## 8. Source-deepening plan

Current source-deepening sequence:

```txt
PR-024A USDC source-deepening — completed
PR-024B BUSD source-deepening — next
PR-024C UST source-deepening
PR-024D USDT / DAI source-deepening
```

Rules for source-deepening:

- prefer official issuer, regulator, exchange, protocol, or primary documentation sources
- use news/research as context when primary sources are unavailable or when analysis is needed
- do not display source-specific market lows or durations until a source is selected
- do not convert evidence coverage into a score
- keep issuer redemption, protocol exits, and market exits separate
- keep known unknowns visible when exact source support is incomplete

## 9. Current records

Current stablecoin records:

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

Current issuer records:

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

Current event records:

- USDC March 2023 depeg
- UST May 2022 collapse
- BUSD wind-down

Top 5 deepened records:

- USDT: reserve/transparency, assurance entry point, redemption terms entry point, multichain unknowns
- USDC: March 2023 depeg, SVB exposure, recovery context, reserve reports entry point, specific January 2026 reserve examination report, redemption access entry point, selected Ethereum/Base/Solana contract references, remaining multichain unknowns
- DAI: protocol/collateral disclosure entry point, Sky lifecycle unknowns, redemption-mechanics unknowns
- UST: collapse event, algorithmic death spiral label, SEC context, post-collapse lifecycle context, LFG reserve unknowns
- BUSD: Paxos wind-down, exchange support phase-out, reported regulatory follow-up, final redemption unknowns

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

## 11. Next implementation focus

Next PR:

```txt
PR-024B BUSD source-deepening
```

Purpose:

```txt
Turn BUSD from a strengthened wind-down record into a more useful dossier by separating Paxos issuer wind-down, redemption-window context, exchange support phase-out, and regulatory follow-up sources.
```

PR-024A completion summary:

```txt
Added a concrete Circle USDC reserve examination report source.
Added Circle contract address documentation as a deployment source.
Added selected Ethereum, Base, and Solana USDC deployment rows.
Updated USDC redemption-access wording from Circle source context.
Updated USDC event and registry update notes.
```
