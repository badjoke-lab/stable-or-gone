# Stable or Gone final-eight candidate audit

Status: canonical specification  
Updated: 2026-06-29  
Roadmap item: PR #246

## Purpose

PR #246 selects the eight candidates for reviewed growth from 92 to 100 stable assets. Selection is a research decision only. It creates no canonical stablecoin, organization, relationship, event, evidence, reserve, redemption, deployment, or regulatory record.

The selected set must improve historical and structural coverage rather than merely add current high-profile names.

## Selected candidates

```text
sog_cand_000093 DOLA
sog_cand_000094 Origin Dollar / OUSD
sog_cand_000095 Inter Stable Token / IST
sog_cand_000096 NEAR USN
sog_cand_000097 Venus VAI
sog_cand_000098 Djed
sog_cand_000099 Kava USDX
sog_cand_000100 Berachain HONEY
```

## Growth allocation

```text
PR #247 92 -> 94: DOLA, OUSD
PR #248 94 -> 96: IST, USN
PR #249 96 -> 98: VAI, Djed
PR #250 98 -> 100: USDX, HONEY
```

Each growth PR remains limited to two stable assets and all required supporting records.

## Selection dimensions

Every selected candidate must document:

- proposed candidate, stablecoin, slug, and organization identities;
- canonical name, symbol, aliases, and disambiguation decision;
- proposed status and lifecycle decision;
- launch date and explicit precision, including unknown;
- mechanism and stabilization model;
- reserve applicability;
- redemption model;
- deployment scope;
- historical value and coverage contribution;
- planned events;
- at least three official evidence leads;
- canonical duplicate review;
- unresolved blocking questions;
- target growth PR.

## Identity rules

Generic symbols must use disambiguated slugs and IDs where collision risk exists:

```text
IST   -> agoric-ist / sog_st_ist
USN   -> near-usn / sog_st_nearusn
VAI   -> venus-vai / sog_st_vai
USDX  -> kava-usdx / sog_st_kavausdx
HONEY -> berachain-honey / sog_st_berahoney
```

A disambiguated slug does not change the canonical display name or symbol.

## Status boundary

Seven candidates are selected as proposed active records. USN is selected as proposed discontinued because official issuer and ecosystem materials describe undercollateralization, a protection programme, and an orderly wind-down.

Proposed status is not canonical status until the relevant growth PR verifies all supporting records.

## Date boundary

Day precision is allowed only when an official dated source supports the exact day. Month or year precision must remain explicit. Unknown launch dates must remain null rather than inferred from contract age, market listings, or secondary databases.

## Evidence boundary

Each candidate requires at least three official HTTPS source leads. A lead is not yet canonical evidence. Growth PRs must verify title, publisher, publication date when applicable, current or archived URL, claim scope, reliability, and exact relationship to the proposed record.

USN may use official Decentral Bank, NEAR Protocol, and NEAR Foundation materials because it is a historical lifecycle record requiring launch, model-transition, wind-down, and protection-programme evidence.

## Required diversity

The selected set must cover multiple dimensions:

```text
long-running Ethereum DeFi
rebasing yield-bearing stablecoin history
Cosmos / interchain architecture
historical undercollateralization and wind-down
BNB Chain protocol stablecoin
Cardano formally verified reserve design
Kava / Cosmos CDP history
new-chain multicollateral native stablecoin
```

No single organization may supply more than one selected asset.

## Promotion boundary

PR #246 does not promote records. The following remain fixed:

```text
manual_review_required: true
candidate_selection_is_not_canonical_promotion: true
canonical_write_allowed: false
public_output: false
production_publication: false
```

Growth authorization applies only to the selected candidates and target PR allocation. A candidate may still be held or rejected in its growth PR if research reveals a duplicate, identity conflict, insufficient evidence, or unsupported lifecycle claim.

## Deterministic validation

CI must prove:

- exactly eight candidates exist with IDs 93 through 100;
- proposed stablecoin IDs, slugs, symbols, and organization IDs follow uniqueness and disambiguation rules;
- proposed IDs, slugs, names, aliases, and symbols do not duplicate the 92 canonical assets under normalized comparison;
- exactly two candidates are allocated to each PR #247 through PR #250;
- count transitions are continuous from 92 to 100;
- each candidate contains all required research dimensions;
- each candidate has at least three distinct official HTTPS evidence leads;
- only USN is proposed discontinued and the other seven are proposed active;
- date values match declared precision;
- blocking unknowns remain explicit and non-empty;
- value-contribution tags show the required diversity;
- no organization appears more than once;
- canonical stablecoin count remains 92;
- no canonical data group is modified;
- no public output or deployment authority is introduced.

## Deployment classification

```text
No production deployment required
```
