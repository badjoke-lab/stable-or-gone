# SOG stable-asset scope

Status: canonical specification  
Applies from: forty-record checkpoint  
Implementation target: Registry v3

## Purpose

This document defines what Stable or Gone treats as a canonical stable asset, what may be included conditionally, and what should be represented as a deployment or relationship instead of a separate asset.

SOG is a historical registry. Inclusion does not imply safety, legitimacy, regulatory approval, market importance, or a recommendation.

## Core inclusion test

A candidate may become a canonical stable-asset record when all of the following are true:

1. It has a distinct public identity, symbol, contract or protocol identity, or documented historical identity.
2. It intentionally seeks to maintain, reference, track, settle against, or redeem for a relatively stable unit of value.
3. Its lifecycle, backing, stabilization, redemption, legal structure, or failure history is independently meaningful.
4. Its identity can be separated from wrappers, deployments, exchange balances, and unrelated products.
5. Its main claims can be supported by durable evidence.
6. Known uncertainty can be stated without inventing missing facts.

A candidate can be rejected or deferred even when it meets the economic idea of a stable asset if identity, evidence, or scope boundaries remain unresolved.

## Canonical primary asset classes

### Fiat-referenced stablecoins

Assets targeting a fiat unit such as USD, EUR, GBP, JPY, SGD, BRL, CHF, or another national currency.

Possible mechanisms include:

- issuer redemption
- bank or e-money issuance
- crypto-collateralized protocol issuance
- algorithmic or hybrid stabilization
- synthetic or derivative-backed stabilization

### Crypto-collateralized stablecoins

Assets issued against crypto collateral through vaults, collateralized debt positions, protocol borrowing, or similar mechanisms.

The registry records:

- accepted collateral categories
- overcollateralization or liquidation design when known
- governance and operator roles
- redemption or repayment path
- major collateral, oracle, and liquidation events

### Algorithmic, partially collateralized, and hybrid assets

Assets whose stability depends materially on:

- endogenous share or governance tokens
- mint-and-burn arbitrage
- dynamic collateral ratios
- protocol-controlled value
- mixed reserve and algorithmic mechanisms

Historical failures are retained as canonical records.

### Synthetic and delta-neutral stable assets

Assets using one or more of:

- derivatives hedging
- short futures or perpetual positions
- synthetic debt
- first-loss or insurance layers
- protocol-controlled collateral allocation

The underlying asset and its staking, yield, or insurance receipts remain separate identities.

### RWA- and government-security-backed stablecoins

Assets backed directly or indirectly by:

- short-duration government securities
- tokenized treasury products
- money-market instruments
- eligible RWA collateral
- reserve-provider structures

A tokenized fund is not automatically a stablecoin. It becomes a canonical SOG asset only when its own stable-value or settlement role is independently material.

### Commodity-referenced stable-value assets

Assets redeemable for or economically referencing commodities such as allocated gold.

They are classified as tokenized commodities or stable-value assets rather than fiat stablecoins.

### Basket-referenced assets

Assets referencing or backed by a defined basket of:

- fiat currencies
- stablecoins
- commodities
- crypto assets
- fund or reserve instruments
- mixed components

Basket composition and changes should be modeled separately from a single peg label.

### Index, CPI, flatcoin, and floating-target assets

Assets targeting:

- a protocol redemption price
- a cost-of-living or inflation index
- a purchasing-power target
- an AMPL- or protocol-derived index
- another variable reference target

They must not be described as fixed one-unit fiat pegs unless the design actually uses one.

### Independent yield-bearing or rebasing stable assets

An asset may be canonical when yield or value accrual is part of the asset itself, rather than merely a wrapper around another canonical asset.

The registry distinguishes:

- balance rebasing
- exchange-rate appreciation
- claimable rewards
- external distributions
- protocol-position accrual

## Historical lifecycle inclusion

SOG retains assets that are:

- active
- restricted
- suspended
- winding down
- inactive
- terminated
- collapsed
- migrated
- rebranded
- unresolved or unknown

Termination is not automatically failure. Migration is not automatically collapse. Remaining market activity is not automatically active issuance or issuer redemption.

## Conditional and adjacent inclusion

The following may be included when they materially affect stable-value systems and can be classified separately.

### Tokenized bank deposits

Include only when a public or historically significant token identity exists and its holder claim, issuer, access, settlement, and transfer model can be documented.

### E-money and legally defined stable-value tokens

Legal classification is recorded separately from economic mechanism.

### Tokenized money-market funds and fund shares

Include only when the token has an independently relevant stable-value or settlement role. Do not describe a fund share as a fiat-backed stablecoin merely because its price is usually stable.

### Yield receipts and staking representations

Include as canonical only when the receipt itself has a distinct market, lifecycle, risk model, and stable-value role. Otherwise represent it through a stable-asset relationship.

### Protocol reserve assets

Include only when the reserve asset itself is part of the public stable-value system and not merely an internal accounting item.

## Not separate canonical assets by default

The following should normally be represented through deployment or relationship records:

- issuer-authorized deployments on additional chains
- canonical bridge representations
- third-party bridged versions
- wrapped versions
- LP tokens
- vault shares
- lending receipts
- ordinary yield wrappers
- staked representations
- exchange-internal balances
- custodial account balances
- game currencies
- loyalty points
- conceptual or wholesale CBDC systems without the same public token lifecycle
- reserve instruments that do not function as stable assets themselves

## Identity rules

### Native and bridged versions

One canonical asset can have multiple deployments.

Create a separate canonical asset only when there is a genuine identity break, such as:

- different issuer or legal claim
- independent mint authority
- independent reserve pool
- independent redemption promise
- materially separate lifecycle
- explicit project treatment as a separate asset

### Rebrands and migrations

Use a relationship rather than silently replacing history.

Possible outcomes:

- same canonical asset with aliases and a rebrand event
- predecessor and successor as separate canonical assets
- migrated asset with a conversion relationship
- unresolved identity pending evidence

### Yield wrappers

The base stable asset and a yield wrapper are separate only when the wrapper independently meets the canonical inclusion test.

### Reused names and symbols

Do not merge assets solely because names or symbols match. Contract, issuer, reserve, governance, and lifecycle evidence control identity.

## Evidence threshold

Canonical promotion requires:

- a clear identity source
- a mechanism or reserve source
- a lifecycle source
- organization or protocol evidence
- deployment evidence when a deployment is claimed
- explicit known unknowns for unresolved material questions

Primary sources are preferred. Durable secondary sources may support historical facts when primary material is unavailable.

## Exclusion and deferral labels

Candidates may be marked:

- out_of_scope
- duplicate
- represented_as_deployment
- represented_as_relationship
- insufficient_identity_evidence
- insufficient_lifecycle_evidence
- awaiting_legal_classification
- awaiting_migration_decision
- deferred

A deferred candidate is not a rejected project. It remains outside the canonical registry until its identity and evidence meet the promotion standard.
