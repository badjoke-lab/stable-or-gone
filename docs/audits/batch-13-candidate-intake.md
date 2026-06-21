# Batch 13 Candidate Intake

Recorded: 2026-06-22

## Result

```text
Five candidates accepted into research intake
Canonical promotions: 0
Canonical stable assets remain: 75
```

## Candidates

| Candidate | Symbol | Proposed ID | Primary boundary |
|---|---|---|---|
| Gyroscope GYD | GYD | `sog_st_gyd` | Base GYD only; sGYD remains separate |
| f(x) Protocol fxUSD | fxUSD | `sog_st_fxusd` | Base fxUSD only; fxSAVE and position products remain separate |
| Berachain HONEY | HONEY | `sog_st_honey` | Native HONEY only; receipts and bridged forms require relationships |
| QiDAO MAI | MAI | `sog_st_mai` | miMATIC-to-MAI continuity must be proven |
| Stables Labs USDX | USDX | `sog_st_stablesusdx` | Disambiguated from unrelated USDX assets; sUSDX remains separate |

## Selection rationale

All five are base stable-value assets with distinct protocol identities. None is being added as a simple wrapper, LP token, vault share, staked receipt, or generic bridged copy.

The set covers five different mechanisms:

- diversified reserve-backed issuance
- crypto-collateralized position-based issuance
- ecosystem-native stablecoin vaults
- overcollateralized multi-chain vault debt
- delta-neutral synthetic-dollar backing

## Primary-source leads

### Gyroscope GYD

- `https://docs.gyro.finance/gyd/`
- `https://docs.gyro.finance/deployed-contracts/`
- `https://docs.gyro.finance/audit-reports.html`

Research must confirm launch chronology, current reserve composition, DSM mint and redemption behavior, governance, and deployment identity.

### f(x) Protocol fxUSD

- `https://fxprotocol.gitbook.io/fx-docs/overview/core-products-of-f-x-protocol`
- `https://fxprotocol.gitbook.io/fx-docs/f-x-protocol-mechanisms/key-functions-of-f-x`
- `https://fxprotocol.gitbook.io/fx-docs/risk-management/audit-reports`

Research must resolve V1/V2 continuity, collateral and position mechanics, base-token income behavior, redemption, contracts, and peg protection.

### Berachain HONEY

- `https://docs.berachain.com/general/tokens/honey`
- `https://docs.berachain.com/developers/contracts/honey-token`
- `https://docs.berachain.com/llms.txt`

Research must establish the launch boundary, collateral-vault history, custody, Basket Mode, governance-controlled fees, HoneyFactory identity, and cross-chain representations.

### QiDAO MAI

- `https://docs.mai.finance/detailed-introduction`
- `https://docs.mai.finance/stablecoin-economics`
- `https://docs.mai.finance/peg-stability-module`
- `https://docs.mai.finance/functions/smart-contract-addresses`

Research must prove or reject one continuous identity across miMATIC and MAI, normalize chain deployments, and determine current issuance, redemption, peg, and incident state.

### Stables Labs USDX

- `https://docs.usdx.money/`
- `https://docs.usdx.money/a-synthetic-usd/delta-neutral-stability`
- `https://docs.usdx.money/guides/how-to-redeem`
- `https://docs.usdx.money/informaiton/contracts`

Research must identify legal and operating entities, counterparties, collateral custody, direct mint eligibility, the stated redemption delay, contracts, reserve disclosures, and separation from sUSDX.

## Intake policy

```text
canonical_write_allowed: false
manual_evidence_review_required: true
full_layer_draft_required: true
identity_deduplication_required: true
unsupported_day_precision_forbidden: true
yield_wrapper_is_not_alias: true
```

No launch date, legal issuer, contract, reserve percentage, redemption right, or status conclusion may be promoted from source leads alone.

## Next gate

A separate boundary-review PR must resolve identity, launch, lifecycle, backing, redemption, income, deployment, legal, event, and evidence questions before any Batch M canonical write is allowed.

## Deployment classification

```text
No production deployment required
```

This intake changes only candidate controls and research planning. Cloudflare is not used.
