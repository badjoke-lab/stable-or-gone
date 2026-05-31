# Depeg Methodology

## Purpose

This document defines how SOG treats stablecoin depeg events.

SOG does not record every tiny price deviation. It records source-backed depeg events that are material, sustained, historically significant, or supported by credible public sources.

## Core rule

```txt
depeg event does not equal failed status
```

Examples:

```txt
USDC:
status = active
event = major_depeg
recovered = true

UST:
status = failed
event = collapse
recovered = false

BUSD:
status = discontinued
events = regulatory_action / wind_down
```

## Detection data vs public evidence

SOG separates:

```txt
1. Detection data
2. Public evidence
```

A price signal alone is not enough to publish a depeg event.

Public event records should be backed by one or more of:

- issuer statement
- market data source
- exchange notice
- regulatory document
- news article
- research / analysis source
- protocol forum or governance post
- archive capture

## Depeg classes

SOG uses four depeg classes.

```txt
minor peg deviation
notable depeg event
major depeg event
collapse
```

## 1. minor peg deviation

Definition:

- small deviation from peg
- short-lived
- often source- or market-dependent
- may happen on thin liquidity or isolated venues

Indicative threshold:

```txt
0.1% to less than 1%, minutes to tens of minutes, usually not recorded
```

Handling:

- not normally eventized
- no status change
- no timeline entry by default
- explained in methodology only

## 2. notable depeg event

Definition:

- material deviation from peg
- visible beyond a single tiny venue
- source-backed or historically relevant

Indicative threshold:

```txt
1%+ deviation, several hours, major market or multiple sources
```

Handling:

- may be eventized
- requires market data plus at least one external source where possible
- does not imply failed status

## 3. major depeg event

Definition:

- significant peg break
- widely recognized
- may involve reserve issues, redemption pressure, mint/burn limitations, market stress, or issuer statements

Indicative threshold:

```txt
5%+ deviation, 24h+ duration, or strong official/news/market evidence
```

Handling:

- eventized as `major_depeg`
- should include recovered true/false where known
- should include trigger/failure mechanism where supportable
- does not automatically change stablecoin status

## 4. collapse

Definition:

- unrecovered or long-running peg failure
- redemption failure
- mechanism failure
- discontinued or failed token state
- official wind-down, migration, or practical collapse

Handling:

- eventized as `collapse`
- may support `status = failed`
- requires stronger evidence than normal depeg events
- should include multiple sources where possible

## Failure mechanism taxonomy

When supportable, depeg/collapse events may include a `failure_mechanism`.

Allowed values:

```txt
bank_run_or_redemption_pressure
reserve_asset_exposure
algorithmic_death_spiral
collateral_liquidation_stress
oracle_or_liquidity_fragmentation
regulatory_shutdown
issuer_wind_down
bridge_or_wrapped_asset_dependency
governance_or_protocol_failure
unknown
```

Do not overstate causality. If multiple causes are plausible, keep `unknown` or explain uncertainty in notes.

## Short-term depegs

SOG does not try to fully monitor or record all short-term depegs.

Reasons:

- minute-level or second-level data may be needed
- exchange and DEX prices can differ
- isolated pools can briefly deviate
- data providers may disagree on lows and duration
- free operation cannot support exhaustive live monitoring

Short-term deviations are only recorded when they become historically meaningful or are supported by credible public sources.

## Methodology statement for public pages

Suggested public wording:

```txt
SOG does not record every minor peg deviation. Events are recorded when a peg deviation is material, sustained, source-backed, or historically significant. A depeg event does not automatically imply that a stablecoin failed.
```
