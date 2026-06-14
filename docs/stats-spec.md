# SOG statistics specification

Status: implementation specification  
Planned route: `/stats/`  
Planned machine-readable outputs:

```text
/data/stats.json
/data/stats-history.json
```

## Purpose

The SOG statistics page explains the composition, history, mechanisms, and evidence coverage of the registry.

It is not:

- a live price dashboard
- a market-cap ranking
- a yield ranking
- a safety or risk score
- an investment comparison tool

All statistics are derived from reviewed canonical repository data at build time.

## Top-level KPI cards

Display:

```text
Total assets
Operating
Constrained
Historical non-failure
Failed
Organizations
Events
Evidence
```

Every KPI shows both count and denominator where relevant.

## Lifecycle grouping

Derived groups:

```text
Operating
  active

Constrained
  restricted
  suspended
  winding_down

Historical non-failure
  inactive
  terminated
  migrated
  rebranded

Failed
  collapsed

Other
  announced
  unknown
```

The page must also expose the underlying canonical statuses.

Do not call every terminated, inactive, migrated, or rebranded asset a failure.

## Classification sections

### Asset class

Count and percentage by:

```text
stablecoin
stable_value_asset
stablecoin_adjacent
tokenized_commodity
yield_bearing_stable_receipt
experimental_stabilization_asset
reserve_asset
tokenized_deposit
tokenized_fund_share
unknown
```

Only implemented enum values are displayed.

### Reference target

```text
fiat
commodity
crypto_asset
index
basket
floating
protocol_internal
none
unknown
```

For fiat references, provide a separate currency breakdown when the asset code is known.

### Backing type

Display:

- count of assets containing each backing type
- percentage of total assets containing each type

Backing types are multi-select, so percentages do not sum to 100. Do not use a single pie chart for this section.

### Stabilization mechanism

Count by primary mechanism.

### Governance model

Count by governance model.

### Legal classification

After Registry v3 migration, count jurisdiction-scoped legal classifications separately from economic asset classes.

## Issuance and redemption

Display:

- issuance status
- redemption status
- direct public redemption availability
- eligible-customer-only redemption
- institutional-only redemption
- protocol-based exit
- suspended or terminated redemption
- minimum redemption known versus unknown
- jurisdiction restrictions known versus unknown
- holder-claim type coverage

Unknown values remain visible.

## Yield mechanics

Display:

```text
no yield
yield-bearing base asset
rebasing
exchange-rate accruing
reward accruing
wrapper value accruing
protocol-position accruing
unknown
```

Also count yield source and rate type after Registry v3 migration.

Do not display current APY or rank returns.

## Historical analysis

### Events by year

Break down:

- launches
- depegs
- regulatory actions
- reserve changes
- redemption changes
- migrations
- wind-downs and terminations
- collapses
- issuer-control actions
- security, oracle, collateral, insolvency, governance, and bridge incidents

### Depeg outcomes

Count:

```text
recovered
partially_recovered
not_recovered
collapsed
unknown
```

Where reliable data exists, display:

- maximum deviation bands
- duration bands
- below, above, or both directions

Do not fabricate price extremes or durations.

### Failures

Display failures by:

- stabilization mechanism
- backing type
- governance model
- launch year
- collapse year

Possible derived metric:

```text
time from launch to collapse
```

Only calculate when both dates are sufficiently supported.

### Lifecycle transitions

Display:

- migrations
- rebrands
- orderly wind-downs
- terminations
- inactive unresolved assets
- collapses

## Deployment analysis

After Deployment v2 migration, display:

- assets by chain
- deployment count by chain
- native and issuer-native deployments
- canonical bridges
- third-party bridges
- wrapped, synthetic, and legacy deployments
- freeze capability known
- blacklist capability known
- control capability unknown

Asset count and deployment count must not be confused.

## Organization analysis

Display organizations by role:

- legal issuer
- brand owner
- protocol operator
- governance body
- reserve manager
- custodian
- redemption agent
- technology provider

An organization can hold multiple roles.

## Data-quality statistics

Display:

- classification coverage
- reserve/redemption profile coverage
- legal-profile coverage
- deployment coverage
- stable-asset relationship coverage
- reserve-component coverage
- archive URL coverage
- average and median evidence per asset
- known-unknown count
- assets with high-severity known unknowns
- verification recency bands
- events with complete typed details

Quality coverage is not a safety score.

## Generated data format

`stats.json` should contain:

```json
{
  "schema_version": "1.0",
  "generated_at": "build-time ISO timestamp",
  "registry_version": "repository commit or public version",
  "totals": {},
  "lifecycle": {},
  "classification": {},
  "issuance": {},
  "redemption": {},
  "yield": {},
  "events": {},
  "deployments": {},
  "organizations": {},
  "data_quality": {},
  "methodology": {
    "denominators": {},
    "multi_select_dimensions": [],
    "excluded_live_metrics": []
  }
}
```

`stats-history.json` should contain immutable checkpoint snapshots, not every deployment build.

Suggested checkpoints:

```text
20
28
32
36
40
70
100
150
200
250
```

Historical snapshots are appended only in a reviewed PR.

## Build pipeline

Add:

```text
scripts/build-stats.mjs
scripts/validate-stats.mjs
```

Build order:

```text
canonical data validation
Registry v3 validation
stats generation
stats validation
Astro check
Astro build
public-layer verification
```

The generated statistics must match canonical loader output, not manually maintained counts.

## Page design

Recommended order:

1. scope and methodology notice
2. KPI cards
3. lifecycle distribution
4. asset class and reference targets
5. backing and stabilization
6. issuance and redemption
7. legal and yield classifications
8. historical events and failures
9. deployments and organizations
10. data-quality coverage
11. checkpoint history
12. links to methodology and machine-readable data

Use accessible tables and compact bar charts. Charts supplement, rather than replace, exact counts.

## Validation rules

Fail the build when:

- totals do not match canonical loaders
- lifecycle groups omit or double-count a canonical status
- single-select dimensions do not equal the correct denominator
- multi-select dimensions are presented as mutually exclusive
- an unknown category is silently discarded
- history snapshots are reordered or rewritten without an explicit migration
- generated output contains candidate, monitoring, or private records
- live market, price, market-cap, or yield data enters the canonical stats output
