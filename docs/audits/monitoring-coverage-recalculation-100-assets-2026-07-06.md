# SOG Monitoring Coverage Recalculation — 100 Assets

Status: supporting audit  
Audit ID: `sog_monitoring_coverage_recalculation_100_assets_pr309`  
Audit date: `2026-07-06`

## Purpose

Recalculate current monitoring reach against the 100-asset canonical registry without confusing issuer/protocol source coverage with platform-policy, service-state, regulatory-register, or EU/EEA function-level market-access monitoring.

This is an offline audit of the checked-in source configuration and baseline state. It does not fetch live pages, add sources, accept baselines, modify the monitoring schema, schedule workflows, write canonical data, or edit the public market-access article.

## Current checked-in configuration

```text
canonical stable assets: 100
canonical organizations: 94
registered official sources: 24
assets reached by at least one registered source: 16
registered asset reach: 16.00%
uncovered assets: 84
organizations reached: 12
accepted sources: 0
accepted asset reach: 0
pending_initial_acceptance baselines: 24
```

The 16-asset figure is registered source reach only. It is not accepted monitoring coverage and is not a completeness score.

## Coverage by current domain

The checked-in 24-source configuration provides:

```text
issuer/protocol sources: 19 sources / 15 assets
reserve/assurance signals: 9 sources / 11 assets
redemption/mint-term signals: 5 sources / 7 assets
issuer lifecycle signals: 5 sources / 5 assets
regulatory action/guidance sources: 5 sources / 5 assets
```

These domains overlap. Their asset counts must not be added together to derive registry coverage.

## Current zero-coverage domains

The current checked-in implementation has no reviewed source rows for:

```text
platform-policy sources: 0
platform service-state sources: 0
regulatory-register sources: 0
market-access schema-capable sources: 0
accepted baselines: 0
```

The current source schema/configuration therefore provides no function-level EU/EEA market-access monitoring coverage for:

```text
buy: 0
sell: 0
spot trading: 0
margin: 0
earn: 0
deposit: 0
withdraw: 0
custody: 0
convert: 0
auto-conversion: 0
direct mint: 0
direct redemption: 0
payment rail: 0
network support: 0
```

These are valid audit conclusions, not missing values to be filled by inference.

## Interpretation boundaries

The recalculation fixes these distinctions:

```text
registered source != accepted baseline
pending baseline != accepted monitoring coverage
issuer/protocol source reach != platform-policy coverage
regulatory action page != regulatory-register coverage
generic issuer/product page != function-level market-access coverage
source count != completeness score
```

For example, an issuer transparency page may provide reserve or redemption change signals for a stablecoin. That does not establish that any exchange's buy, sell, trade, deposit, withdrawal, custody, Earn, margin, conversion, payment-rail, or network-specific access policy is monitored.

Likewise, a regulator enforcement or authorization release is not equivalent to monitoring a live MiCA/CASP/EMT register or register export.

## Consequences for later phases

PR #309 does not close the discovered gaps by adding sources. It records them so later approved phases can address them in order:

```text
PR #315 100-asset monitoring baseline synchronization
PR #316 reserve and redemption source expansion
PR #317 lifecycle, regulatory, and EU market-access source/schema expansion
PR #318 bounded scheduled read-only monitoring
```

PR #317 remains the place to implement the reviewed market-access observation family and schema extensions for platform identity, legal entity, geography, function/access route, supported network, service state, and regulatory-register state.

## Safety boundary

The audit result has:

```text
canonical_action: none
network_access_used: false
public_output: false
production_publication: false
```

Monitoring remains review-only. A future monitoring observation may produce private candidate material but cannot update canonical data, accept its own baseline, edit the public article, create branches or pull requests automatically, publish, or deploy.

## Next item

After PR #309, the next scheduled item is:

```text
PR #310 Registry v2/v3 and machine-readable parity
```
