# Fiat-backed Income-profile Batch

Updated: 2026-06-19

## Scope

This batch resolves the token-holder income mechanics for ten issuer-backed stable assets:

```text
USDT
USDC
TUSD
FDUSD
PYUSD
GUSD
RLUSD
EURC
USDP
USDG
```

## Decision

All ten canonical tokens are classified as:

```json
{
  "availability": "none",
  "source": "none",
  "accrual": "none",
  "rate": "none"
}
```

## Meaning

This classification applies to the canonical stablecoin token itself.

It does not claim that:

- the issuer earns no income from reserve assets
- exchanges never pay promotional rewards
- lending protocols cannot offer third-party rates
- network partners receive no economic incentives
- a holder cannot move the token into a separate yield product

It means that ordinary possession of the canonical token does not itself create a native balance rebase, exchange-rate increase, claimable reward, or protocol position for the holder.

Issuer reserve income is not treated as token-holder income unless the product structure explicitly passes that income through to holders.

## Asset decisions

### USDT

Tether's transparency and legal materials describe a reserve-backed redeemable token. The canonical USDT balance does not natively accrue reserve income to the holder.

### USDC

Circle's product and transparency materials describe USDC as a redeemable reserve-backed stablecoin. Circle reserve earnings are not an intrinsic USDC-holder return.

### TUSD

TrueUSD's product and attestation materials support a fiat-backed token structure without native holder accrual.

### FDUSD

First Digital materials support a reserve-backed stablecoin. Exchange promotions or third-party products are external to FDUSD itself.

### PYUSD

PayPal and Paxos materials describe PYUSD as a fiat-backed redeemable token. Holding PYUSD alone does not create native yield.

### GUSD

Gemini's official product material describes Gemini Dollar as a reserve-backed stablecoin. No separate yield-bearing token mechanic is assigned to canonical GUSD.

### RLUSD

Ripple's product and legal materials describe a fully backed stablecoin and redemption framework. Reserve income is not passed through as intrinsic RLUSD-holder income.

### EURC

Circle's EURC and transparency materials describe a fully reserved euro stablecoin. Holding EURC itself does not produce native income.

### USDP

Paxos materials describe a one-to-one redeemable reserve-backed token. Canonical USDP has no native holder-income mechanism.

### USDG

Global Dollar Network and Paxos materials describe a reserve-backed token and network economics. Partner or network rewards are not automatic income accruing to every USDG token holder.

## Evidence handling

Each profile references existing canonical evidence. This batch does not add new evidence records, live rate data, APY values, or ranking fields.

## Queue impact

```text
All-unknown income profiles: 41 → 31
Canonical income profiles:   70 unchanged
Canonical stable assets:     70 unchanged
```

## Deployment classification

No production deployment required. This is a Registry v3 quality update and does not require Cloudflare access.

## Next work

Resolve protocol-stablecoin income mechanics while keeping the canonical token separate from savings wrappers and staking receipts.
