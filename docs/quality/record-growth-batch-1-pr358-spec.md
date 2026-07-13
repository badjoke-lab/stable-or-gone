# PR #358 Record Growth Batch 1 Specification

Status: active work-item specification  
Updated: 2026-07-13

## 1. Roadmap item

PR #358 — Record Growth Batch 1.

PR #357 is complete and merged at:

```text
b849bfd582209aad217dd1af2198c755ff0760ab
```

Its reviewed handoff is:

```text
docs/migration/tier-a-batch-3-pr357-reviewed-handoff.json
```

## 2. Purpose

PR #358 is the first broad growth batch after the reviewed 110-asset checkpoint. It may add no more than two new canonical stable assets, and only as complete context-grouped records.

The selected context group is:

```text
current USD payment stablecoins with distinct stabilization models
```

The selected candidates are:

```text
StraitsX USD / XUSD
USDB / USDB
```

This selection is not a ranking, market-cap list, endorsement, or safety judgment.

USDG, USD1, and SoFiUSD were rejected at the candidate stage because those identities already existed in the 110-asset canonical registry. Their rejection is evidence that duplicate review is a blocking gate rather than a documentation formality.

## 3. Selection rationale

XUSD and USDB are grouped because both are current USD-referenced assets used for payments or settlement, while presenting sharply different stabilization, redemption, reserve, yield, legal, and deployment structures.

XUSD adds a Singapore payment-institution, fiat-reserve, direct-redemption, and multichain context. USDB adds an L2-native auto-rebasing model, DAI bridge redemption, and dependency on external yield infrastructure.

The pair adds historical and structural comparison value rather than isolated record count.

## 4. Candidate stage

Candidate selection does not equal canonical promotion.

Before any canonical write, PR #358 must:

1. run exact and normalized duplicate checks against all 110 canonical assets;
2. review aliases, symbols, issuer or operator names, domains, contracts, and predecessor/successor possibilities;
3. verify asset identity and current status;
4. identify the legal issuer, operator, custodian, bridge, reserve, and material distributors without conflating roles;
5. verify launch chronology and at least one meaningful event per asset;
6. collect at least three reviewed canonical Evidence records per asset;
7. preserve unresolved fields as known unknowns;
8. build a deterministic full-record impact report.

## 5. Full-record minimum

Each promoted asset must include:

```text
stablecoin entity
classification
reserve/redemption profile
legal profile
income profile
reserve components
organizations and relationships
deployment rows
at least one meaningful event
event detail where applicable
at least three Evidence records
Evidence Relations parity
known-unknown rows for unresolved material fields
```

A thin listed-reference record is forbidden.

## 6. XUSD review scope

Review must distinguish:

```text
StraitsX brand and platform from the legal issuer
XUSD from XSGD and XIDR
issuer redemption from exchange or platform liquidity
Singapore payment-institution context from deposit insurance or government guarantee
launch announcement from first public mint or trading date
deployment expansion from asset identity
reserve-account language from legal segregation or bankruptcy remoteness
```

Official StraitsX product, terms, regulatory, reserve, and deployment materials are preferred. Secondary reporting may support launch chronology but must not establish legal or redemption claims by itself.

## 7. USDB review scope

Review must distinguish:

```text
Blast network and contributor identity from a legal issuer or claim counterparty
USDB from DAI and from other Blast bridge assets
native rebasing from contractual holder yield
bridge redemption for DAI from direct fiat redemption
underlying yield source from reserve ownership or bankruptcy remoteness
L2 contract identity from canonical asset identity
current protocol behavior from historical launch marketing
```

Official Blast documentation is preferred for asset identity, bridge redemption, rebasing, yield source, and contract deployment. No legal issuer, direct fiat claim, reserve segregation, or bankruptcy-remoteness conclusion may be inferred from protocol documentation alone.

## 8. Evidence rules

Preferred source order:

```text
official issuer, operator, protocol, or product documentation
terms, bridge, redemption, and custody documentation
regulator, charter, or licensing documentation
reserve reports or attestations
official contract or deployment documentation
high-quality reporting for launch and historical events
reviewed archive capture where current pages no longer preserve the claim
```

Every Evidence record must identify the claim scope it supports.

A product page or news article may support launch or distribution chronology, but it does not by itself establish current legal claims, reserve segregation, bankruptcy remoteness, deposit insurance, or licensing status.

## 9. Required preservation

PR #358 must preserve:

```text
PR #353 historical planning snapshots
PR #354–#357 reviewed handoffs
four canonical Market Access Records
Comparison Readiness semantics
Facet Freshness semantics
Timeline date semantics
Update Feed publication-date semantics
Maintenance Log public-safety boundary
canonical-only publication
no automatic monitoring promotion
no asset ranking
no composite score
```

## 10. Explicit non-goals

PR #358 does not:

```text
add more than two assets
add a thin placeholder record
change Market Access Records
add a new page, explorer, dashboard, ranking, or navigation family
change Compare preset membership
change Comparison Readiness definitions
change Facet Freshness definitions
publish candidate research or internal review artifacts
infer legal protections from reserve, bank, bridge, or protocol marketing
turn protocol rebasing or platform economics into a risk-free-yield claim
```

## 11. Validation

The dedicated workflow must validate:

```text
exact two-candidate bounded scope
context grouping and non-ranking semantics
zero canonical identity, slug, symbol, alias, or domain collisions before promotion
reviewed PR #357 handoff identity and counts
manual-promotion boundary
full-record minimum after promotion
minimum event and Evidence counts
Evidence Relation parity
organization and relationship integrity
legal, reserve, redemption, deployment, and income profiles
known-unknown preservation
canonical count transition from 110 to no more than 112
four Market Access Records preserved
deterministic statistics and immutable history
Astro check, build, and public-layer safety
```

## 12. Exit criteria

PR #358 completes when:

1. both candidates have been fully reviewed;
2. unsupported candidates remain unpromoted rather than receiving thin records;
3. every promoted candidate meets the full-record minimum;
4. canonical counts and projections are synchronized;
5. dedicated validation and general CI are green;
6. a reviewed PR #358 handoff is committed for PR #359 Market Access Pilot 2.
