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
current USD reserve-backed institutional stablecoins
```

The selected candidates are:

```text
Global Dollar / USDG
World Liberty Financial USD1 / USD1
```

This selection is not a ranking, market-cap list, endorsement, or safety judgment.

## 3. Selection rationale

USDG and USD1 are grouped because both are current USD-referenced, reserve-backed assets with institution-facing issuer or custody structures, while presenting materially different governance, issuer, regulatory, network, and redemption contexts.

The pair adds historical and structural comparison value rather than isolated record count.

## 4. Candidate stage

Candidate selection does not equal canonical promotion.

Before any canonical write, PR #358 must:

1. run exact and normalized duplicate checks against all 110 canonical assets;
2. review aliases, symbols, issuer names, domains, contracts, and predecessor/successor possibilities;
3. verify asset identity and current status;
4. identify the legal issuer, operator, custodian, and material distributors without conflating roles;
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

## 6. USDG review scope

Review must distinguish:

```text
Global Dollar Network from the USDG asset
Paxos Digital Singapore from Paxos Issuance Europe
issuer role from network-partner role
one-to-one issuer redemption from exchange or platform liquidity
Singapore and EU issuance/regulatory scope
deployment expansion from asset identity
network reward economics from holder yield
```

Official Global Dollar and Paxos materials are preferred for product, issuer, redemption, deployment, and regulatory claims.

## 7. USD1 review scope

Review must distinguish:

```text
World Liberty Financial brand/operator identity
current legal issuer identity
BitGo custody and infrastructure roles
reserve custody from legal reserve ownership
announcement date from first mint or public trading date
issuer redemption from secondary-market liquidity
2026 social-account attack from smart-contract or wallet compromise
short depeg event from permanent impairment
```

Political ownership or conflict reporting may be included only when directly relevant to issuer or control structure and supported by high-quality evidence. It must not replace product-level evidence.

## 8. Evidence rules

Preferred source order:

```text
official issuer or product documentation
terms and redemption documentation
regulator or charter documentation
reserve reports or attestations
official contract or deployment documentation
high-quality reporting for launch and historical events
reviewed archive capture where current pages no longer preserve the claim
```

Every Evidence record must identify the claim scope it supports.

A news article may support launch or incident chronology, but it does not by itself establish current redemption rights, reserve segregation, bankruptcy remoteness, or licensing status.

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
infer legal protections from reserve or custody marketing
turn partner rewards into holder yield
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
evidence relation parity
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
