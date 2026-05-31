# Stable or Gone

Stable or Gone (SOG) is a public stablecoin registry focused on stablecoin history, issuer structure, reserve disclosure, depeg events, redemption access, lifecycle changes, and source-backed evidence.

SOG is not a live price dashboard, not a trading terminal, not a safety ranking, and not investment advice.

## Core idea

Stablecoins should not be understood only by current price or market cap. SOG records:

- who issued the stablecoin
- what it was designed to track
- how reserves or collateral were described
- whether material depeg events occurred
- whether the peg recovered
- whether redemption, minting, burning, wind-down, migration, or failure happened
- which sources support each claim
- what remains unclear

## v0 direction

SOG v0 will be a static registry built from repository JSON data.

Planned stack:

- Astro
- TypeScript
- repository-managed JSON
- Cloudflare Pages
- GitHub Issues for public reports
- Google Form for contact, corrections, and private/simple reports

No database, paid API, auth, realtime monitoring, or scoring system is planned for v0.

## What SOG does not do

SOG does not provide:

- stablecoin safety scores
- buy / avoid recommendations
- yield comparison
- live depeg alerts
- market cap ranking
- investment advice
- legal, financial, or regulatory advice

## Core records

SOG is organized around these record types:

- `stablecoin_entity`
- `issuer_entity`
- `stablecoin_event`
- `stablecoin_evidence`
- `reserve_report`
- `known_unknown`

## Reporting and corrections

SOG will accept corrections, missing records, missing evidence, broken links, and contact messages through:

- Google Form for private or simple reports
- GitHub Issues for public, source-backed corrections

## Status

This repository is at the SOG-001 foundation stage.
