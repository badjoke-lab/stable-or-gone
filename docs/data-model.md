# Stable or Gone Data Model

## Principle

SOG data is repository-managed JSON in v0.

Canonical records should stay factual, source-backed, and conservative. Do not use data fields to imply investment advice, stablecoin safety ranking, or legal conclusions.

## Core record types

SOG uses six core record groups:

```txt
stablecoin_entity
issuer_entity
stablecoin_event
stablecoin_evidence
reserve_report
known_unknown
```

## 1. stablecoin_entity

Represents one stablecoin as a registry entity.

Minimum fields:

```json
{
  "id": "sog_st_usdc",
  "slug": "usdc",
  "name": "USD Coin",
  "symbol": "USDC",
  "aliases": [],
  "status": "active",
  "issuer_id": "sog_issuer_circle",
  "peg_asset": "USD",
  "collateral_model": "fiat_backed",
  "reserve_disclosure_status": "available",
  "redemption_status": "active",
  "launch_date": "2018-09-26",
  "discontinued_date": null,
  "summary": "",
  "confidence": "medium",
  "last_verified_at": "2026-05-31",
  "notes": ""
}
```

### status enum

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
- Depegs are events.
- A recovered depeg does not make a stablecoin failed.

### collateral_model enum

```txt
fiat_backed
crypto_collateralized
algorithmic
hybrid
synthetic
yield_bearing
commodity_backed
multi_collateral
unknown
```

### reserve_disclosure_status enum

```txt
available
partial
unavailable
unknown
```

### redemption_status enum

```txt
active
limited
paused
wind_down
unavailable
unknown
```

## 2. issuer_entity

Represents an issuer, protocol, company, or organization behind one or more stablecoins.

Minimum fields:

```json
{
  "id": "sog_issuer_circle",
  "slug": "circle",
  "name": "Circle",
  "issuer_type": "company",
  "jurisdiction": "United States",
  "related_stablecoins": ["usdc"],
  "official_url": "",
  "summary": "",
  "confidence": "medium",
  "last_verified_at": "2026-05-31",
  "notes": ""
}
```

### issuer_type enum

```txt
company
protocol
foundation
dao
consortium
unknown
```

## 3. stablecoin_event

Represents a meaningful event in the history of a stablecoin.

Minimum fields:

```json
{
  "id": "sog_ev_000001",
  "stablecoin_id": "sog_st_usdc",
  "issuer_id": "sog_issuer_circle",
  "event_type": "major_depeg",
  "event_date": "2023-03-11",
  "title": "USDC depeg during banking crisis",
  "description": "",
  "impact_level": "high",
  "event_status_effect": "none",
  "recovered": true,
  "recovery_date": null,
  "failure_mechanism": "reserve_asset_exposure",
  "confidence": "high",
  "source_count": 0,
  "notes": ""
}
```

### event_type enum

```txt
launched
minor_peg_deviation
notable_depeg
major_depeg
collapse
reserve_disclosure
reserve_issue
redemption_paused
redemption_resumed
minting_paused
minting_resumed
burning_paused
burning_resumed
regulatory_action
exchange_delisting
wind_down_announced
wind_down_effective
discontinued
rebranded
migrated
contract_deprecated
issuer_statement
other
```

### impact_level enum

```txt
low
medium
high
critical
```

### event_status_effect enum

```txt
none
limited
impaired
discontinued
failed
migrated
rebranded
```

### failure_mechanism enum

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

## 4. stablecoin_evidence

Represents a source backing a claim.

Minimum fields:

```json
{
  "id": "sog_src_000001",
  "stablecoin_id": "sog_st_usdc",
  "issuer_id": "sog_issuer_circle",
  "event_id": "sog_ev_000001",
  "source_type": "issuer_statement",
  "title": "",
  "url": "",
  "publisher": "",
  "published_at": null,
  "archived_url": null,
  "accessed_at": "2026-05-31",
  "reliability": "high",
  "claim_scope": "depeg_event",
  "notes": ""
}
```

### source_type enum

```txt
issuer_statement
issuer_blog
issuer_social
attestation_report
reserve_report
market_data
exchange_notice
regulatory_document
news_article
protocol_forum
governance_post
archive_capture
database_reference
other
```

### reliability enum

```txt
high
medium
low
```

### claim_scope enum

```txt
entity
issuer
reserve
collateral_model
depeg_event
redemption_status
regulatory_note
discontinued_status
migration
contract_status
lifecycle
known_unknown
```

## 5. reserve_report

Represents attestation, reserve disclosure, or reserve-related reports.

Minimum fields:

```json
{
  "id": "sog_reserve_000001",
  "stablecoin_id": "sog_st_usdc",
  "issuer_id": "sog_issuer_circle",
  "report_date": "2023-03-31",
  "period_covered": "2023-03",
  "publisher": "",
  "report_type": "attestation",
  "asset_categories": ["cash", "t_bills"],
  "url": "",
  "archived_url": null,
  "confidence": "medium",
  "notes": ""
}
```

### report_type enum

```txt
attestation
reserve_report
audit
issuer_disclosure
regulatory_filing
other
```

## 6. known_unknown

Represents an explicit uncertainty or open research point.

Minimum fields:

```json
{
  "id": "sog_unknown_000001",
  "stablecoin_id": "sog_st_usdc",
  "issuer_id": "sog_issuer_circle",
  "topic": "redemption_terms",
  "description": "Retail redemption access requires further source review.",
  "severity": "medium",
  "last_checked_at": "2026-05-31",
  "notes": ""
}
```

### severity enum

```txt
low
medium
high
```

## Confidence enum

Used across records:

```txt
high
medium
low
```

## Core rule

Do not force uncertain data into false certainty. Use `unknown`, `known_unknown`, conservative status, and explanatory notes instead.
