# Optional Stable Asset Classification Extension

## Purpose

This extension allows Stable or Gone to classify non-fiat, floating-target, commodity-linked, index-linked, receipt-like, and other stable-value assets without forcing every asset into the same stablecoin model.

It supplements Registry v2. It does not replace the existing lifecycle, peg, backing, reserve, redemption, organization, event, or evidence fields.

## Compatibility rules

- Every field in this extension is optional.
- The existing 20 canonical stablecoin records are not required to adopt these fields immediately.
- Existing IDs, slugs, and public URL patterns remain unchanged.
- Existing Registry v2 fields remain supported.
- When an extension field exists, public display may prefer it over the older general-purpose field.
- When an extension field is absent, the public display must fall back to the existing Registry v2 or legacy value.
- Validators inspect an extension field only when it is present.
- New records should use the extension when their classification cannot be represented accurately by a simple fiat-pegged stablecoin model.

## Optional fields

### `asset_class`

Allowed values:

```txt
stablecoin
stable_value_asset
stablecoin_adjacent
tokenized_commodity
yield_bearing_stable_receipt
experimental_stabilization_asset
reserve_asset
unknown
```

Use this field to distinguish the underlying type of asset. A wrapper, receipt, bridged representation, yield-bearing derivative, or tokenized commodity must not be silently classified as the underlying stablecoin.

### `reference_target`

Allowed values:

```txt
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

This field describes the class of reference target. It supplements `peg_reference`, which remains the source for detailed asset labels and numeric targets where appropriate.

### `redemption_or_exit_model`

Allowed values:

```txt
issuer_redemption
protocol_redemption
market_exit
conversion
physical_redemption
vault_withdrawal
rebasing_or_repricing
maturity_or_settlement
none
other
unknown
```

This field separates issuer redemption from protocol exits, market exits, physical commodity redemption, conversions, vault withdrawals, or other exit mechanics.

### `valuation_source`

Object shape:

```json
{
  "source_type": "oracle",
  "label": "Example reference index",
  "url": "https://example.invalid/",
  "notes": "Source-reviewed explanation."
}
```

Allowed `source_type` values:

```txt
issuer
protocol
oracle
market
index_provider
custodian
other
unknown
```

Only `source_type` is required when the object is present. Other fields remain optional.

### `yield_or_rebase_profile`

Object shape:

```json
{
  "mode": "yield_bearing",
  "accrual_target": "wrapper",
  "rate_source": "Protocol-defined rate",
  "notes": "Source-reviewed explanation."
}
```

Allowed `mode` values:

```txt
none
yield_bearing
rebasing
reward_accruing
variable_rate
other
unknown
```

Allowed `accrual_target` values:

```txt
asset
wrapper
external_receipt
protocol_position
none
unknown
```

This object distinguishes value accrual on the asset itself from value accrual on a wrapper, receipt token, external position, or protocol position.

### `classification_notes`

Free-text, source-reviewed explanation of why the asset is classified this way and what remains uncertain. This must not be used to invent unsupported claims.

## Display precedence

The detail page follows these rules:

1. Use the extension field when present.
2. Otherwise fall back to Registry v2.
3. Otherwise fall back to the legacy field.
4. Otherwise display an explicit unknown or incomplete state.

Examples:

- `reference_target` falls back to `peg_reference.kind`.
- `redemption_or_exit_model` falls back to `redemption_profile.status`, then legacy `redemption_status`.
- `valuation_source` has no legacy equivalent and remains incomplete when absent.
- `yield_or_rebase_profile` defaults to no recorded profile when absent.

## Intended initial use

The extension is intended for the next controlled batches:

- USDe: stable-value asset / synthetic dollar context
- sUSD: stable-value asset / protocol debt-pool context
- MIM: protocol-collateralized stablecoin
- FEI: discontinued protocol stablecoin
- USDN: failed or discontinued algorithmic stablecoin
- RAI: floating-target stable-value asset
- PAXG: tokenized commodity
- XAUT: tokenized commodity
- SPOT: index or basket-like stable-value asset
- Nuon: inflation-referenced experimental stabilization asset

USDe and sUSD already exist as canonical records. They must be updated in place rather than duplicated.

## Non-goals

This extension does not:

- classify every crypto asset as a stablecoin
- merge wrappers or receipts into their underlying asset
- treat bridged tokens as new canonical stablecoins
- imply safety, solvency, or investment quality
- replace evidence, known unknowns, reserve reports, redemption history, or event records
