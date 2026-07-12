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
current regulated bank and payment stablecoins
```

The selected candidates are:

```text
StraitsX USD / XUSD
SoFiUSD / SoFiUSD
```

This selection is not a ranking, market-cap list, endorsement, or safety judgment.

The originally proposed USDG and USD1 candidates were rejected at the candidate stage because both identities already existed in the 110-asset canonical registry. Their rejection is evidence that duplicate review is a blocking gate rather than a documentation formality.

## 3. Selection rationale

XUSD and SoFiUSD are grouped because both are current USD-referenced assets issued in regulated financial or payment contexts, while presenting materially different issuer, legal, distribution, deployment, reserve, and redemption structures.

XUSD adds Singapore payment-institution and regional payment-infrastructure context. SoFiUSD adds a United States national-bank issuer, enterprise settlement history, and consumer banking-app distribution context.

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

## 7. SoFiUSD review scope

Review must distinguish:

```text
SoFi Technologies from SoFi Bank, N.A.
national-bank charter from token-specific legal protections
December 2025 enterprise launch from May 2026 consumer rollout
cash reserves from FDIC-insured deposits
issuer redemption from app conversion or secondary-market liquidity
Ethereum and Solana deployment rows from the canonical asset identity
SoFiUSD from future tokenized-deposit products
```

The token must not be described as FDIC insured merely because the issuer is a bank. Official SoFi and bank materials are preferred for issuer, product, terms, reserve, and redemption claims. High-quality reporting may support launch and distribution chronology.

## 8. Evidence rules

Preferred source order:

```text
official issuer or product documentation
terms and redemption documentation
regulator, charter, or licensing documentation
reserve reports or attestations
official contract or deployment documentation
high-quality reporting for launch and historical events
reviewed archive capture where current pages no longer preserve the claim
```

Every Evidence record must identify the claim scope it supports.

A news article may support launch or distribution chronology, but it does not by itself establish current redemption rights, reserve segregation, bankruptcy remoteness, deposit insurance, or licensing status.

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
infer legal protections from reserve, bank, or custody marketing
turn bank or platform economics into holder yield
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
