# SOG classification specification

Status: canonical specification
Current implementation: Registry v2 plus stable-asset extension
Planned implementation: Registry v3

## Principle

A stable asset cannot be accurately described by one category. SOG classifies every canonical asset across independent axes:

```text
identity
asset class
reference target
lifecycle
issuance
backing
stabilization
governance
redemption or exit
legal structure
yield mechanics
deployment form
```

These axes must not be collapsed into one label such as fiat-backed, algorithmic, or failed.

## Asset class

Current values:

```text
stablecoin
stable_value_asset
stablecoin_adjacent
tokenized_commodity
yield_bearing_stable_receipt
experimental_stabilization_asset
reserve_asset
unknown
```

Registry v3 should add or clarify:

```text
tokenized_deposit
tokenized_fund_share
```

Rules:

- `stablecoin` directly targets a stable unit and functions as a transferable settlement or accounting asset.
- `stable_value_asset` covers nonstandard stable-value designs, including floating and index targets.
- `tokenized_commodity` must not be shown as a fiat stablecoin.
- `yield_bearing_stable_receipt` identifies a receipt whose yield-bearing identity is independently material.
- `stablecoin_adjacent` is a boundary class, not a replacement for proper legal and economic classification.
- `unknown` requires a known-unknown record when the ambiguity is material.

## Reference target

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

The core peg-reference enum must also support `basket` so core and extension schemas do not disagree. A reference target describes what the asset tracks or settles against. It does not describe collateral.

## Lifecycle status

```text
announced
active
restricted
suspended
winding_down
inactive
terminated
collapsed
migrated
rebranded
unknown
```

Interpretation:

- `active`: the principal issuance or protocol function remains operational.
- `restricted`: material issuance, redemption, access, security, or recovery constraints exist.
- `suspended`: material issuance or redemption is temporarily stopped.
- `winding_down`: an orderly termination process is underway.
- `inactive`: meaningful operation ended, but final legal, reserve, or redemption outcomes remain incomplete.
- `terminated`: issuance or the relevant product formally ended.
- `collapsed`: the stabilization design or market function failed in a terminal or effectively terminal way.
- `migrated`: the asset moved into a successor system or conversion path.
- `rebranded`: identity continues under a documented new name or symbol.
- `unknown`: evidence does not support a stronger conclusion.

Lifecycle is not inferred from current exchange price alone.

## Public lifecycle groups for statistics

```text
operating
  active

constrained
  restricted
  suspended
  winding_down

historical_non_failure
  inactive
  terminated
  migrated
  rebranded

failed
  collapsed

other
  announced
  unknown
```

These are derived groups, not replacements for canonical lifecycle statuses.

## Issuance status

```text
open
restricted
paused
terminated
protocol_based
unknown
```

Issuance is separate from lifecycle and redemption. A token can remain tradable while issuance is terminated, and an active asset can restrict issuance to eligible parties.

## Backing types

Current values:

```text
cash
bank_deposits
government_securities
commercial_paper
crypto_collateral
stablecoin_collateral
tokenized_fund
commodity
unbacked
mixed
other
unknown
```

Registry v3 should add:

```text
private_credit
receivables
corporate_bonds
secured_loans
insurance_or_guarantee
```

Backing types are multi-select. Statistics must not assume they total 100 percent. Structured reserve components are preferred when reliable categories or percentages exist.

## Stabilization mechanism

Current values:

```text
issuer_redemption
overcollateralized_vault
algorithmic_supply
delta_neutral
protocol_arbitrage
hybrid
other
unknown
```

Registry v3 should add where needed:

```text
bank_deposit_claim
fund_share_valuation
commodity_redemption
rebasing_or_repricing
```

The primary mechanism describes the principal stabilizing path.

## Governance model

```text
centralized
dao_governed
protocol_governed
hybrid
unknown
```

Governance does not replace organization relationships. Legal issuers, protocol operators, governance bodies, custodians, reserve managers, and redemption agents remain separate roles.

## Redemption or exit model

```text
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

This describes how value is exited, not which holders are eligible. Eligibility and restrictions remain in the redemption profile.

## Legal classification

Registry v3 values:

```text
fiat_backed_stablecoin
e_money_token
asset_referenced_token
tokenized_deposit
bank_liability_token
fund_share
security_token
commodity_claim
protocol_asset
unclassified
unknown
```

Legal classification is jurisdiction-scoped where necessary. It must not be inferred from branding and requires evidence and confidence.

## Holder claim type

```text
direct_claim_on_issuer
direct_claim_on_bank
beneficial_interest_in_reserve
fund_share_claim
commodity_ownership_or_claim
protocol_redemption_right
contractual_conversion_right
no_direct_claim
unclear
unknown
```

Holder claim is separate from redemption access. An asset may have a claim but restricted access, or a protocol exit without a direct issuer claim.

## Yield mechanics

### Yield mode

```text
none
yield_bearing
rebasing
reward_accruing
variable_rate
other
unknown
```

### Yield source

```text
reserve_income
lending
staking
derivatives_funding
protocol_incentives
token_emissions
mixed
none
unknown
```

### Accrual mechanism

```text
balance_rebase
exchange_rate_increase
claimable_reward
wrapper_value_increase
external_distribution
protocol_position
none
unknown
```

### Rate type

```text
fixed
variable
discretionary
protocol_determined
none
unknown
```

Base assets and wrappers must remain distinguishable.

## Deployment classification

```text
native
issuer_native
canonical_bridge
third_party_bridge
wrapped
synthetic
legacy
unknown
```

A deployment classification does not create a new canonical asset by itself.

## Unknowns and confidence

`unknown` is valid when evidence is insufficient. Material uncertainty should create a known-unknown record stating what is unresolved, why it matters, what sources were checked, the last checked date, severity, and conditions for resolution.

Confidence describes evidence quality. It is not a safety score.
