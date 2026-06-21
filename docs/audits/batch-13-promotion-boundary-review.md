# Batch 13 Promotion Boundary Review

Recorded: 2026-06-22

## Result

```text
Reviewed candidates: 5
Canonical promotions: 0
Canonical stable assets: 75 unchanged
Next step: full Batch M layer drafts
```

All five candidates remain non-canonical. The review establishes identity, backing, redemption, income, and deployment boundaries without inventing unsupported legal, date, reserve, or contract claims.

## Gyroscope GYD

```text
Candidate: sog_cand_000076
Proposed record: sog_st_gyd
Launch boundary: 2023-12-07, Ethereum mainnet
Readiness: needs_layer_draft
```

Decision:

- one base GYD identity
- sGYD remains a separate yield-bearing representation
- Ethereum is the full-protocol launch network
- Polygon Gyro Proto is a historical predecessor deployment, not an alias
- reserve backing is a diversified protocol-controlled basket
- minting and redemption use protocol bonding-curve mechanisms
- no intrinsic base-GYD holder income is asserted

Remaining work:

- reserve-component normalization
- canonical token and reserve contracts
- governance and organization roles
- Gyro Proto lineage
- reserve-report context

## f(x) Protocol fxUSD

```text
Candidate: sog_cand_000077
Proposed record: sog_st_fxusd
Launch boundary: unresolved
Readiness: needs_identity_and_income_resolution
```

Decision:

- fxUSD is the base stablecoin
- fxSAVE is a separate tokenized stability-pool vault
- xPOSITION, sPOSITION, pool shares, and CreditNotes are separate products
- current documentation describes fully collateralized on-chain backing
- minting and redemption occur through position demand and oracle-priced collateral routes
- Ethereum protocol-2.0 contracts are documented

Remaining work:

- V1-to-V2 token and contract continuity
- exact launch boundary
- whether base fxUSD itself accrues income
- complete collateral and position contract map
- organization and governance map

## Berachain HONEY

```text
Candidate: sog_cand_000078
Proposed record: sog_st_honey
Launch boundary: 2025, exact day unresolved
Readiness: needs_layer_draft
```

Decision:

- HONEY is Berachain's native base stablecoin
- Bend borrowing does not create a separate HONEY identity
- receipts, liquidity positions, and bridged forms require separate relationships
- collateral sits in asset-specific vaults and may use governance-designated custodians
- minting and redemption are available against supported collateral
- Basket Mode changes redemption when collateral becomes unstable
- base HONEY has no documented intrinsic holder yield

Remaining work:

- exact launch day
- collateral and fee chronology
- custodian and legal-operator map
- cross-chain representation inventory
- governance-change events

## QiDAO MAI

```text
Candidate: sog_cand_000079
Proposed record: sog_st_mai
Launch boundary: unresolved
Readiness: needs_lifecycle_and_deployment_resolution
```

Decision:

- official documentation confirms MAI was previously called miMATIC
- one continuous asset identity is accepted across that rebrand
- chain-specific token representations still require deployment mapping
- backing combines overcollateralized crypto vaults and approved stablecoin PSM routes
- PSM minting and queued redemption are distinct from vault-debt repayment
- base MAI has no documented intrinsic holder yield

Remaining work:

- exact launch and rebrand dates
- complete current chain and contract inventory
- present peg and issuance condition
- incident and bad-debt chronology
- legal and governance operator map

## Stables Labs USDX

```text
Candidate: sog_cand_000080
Proposed record: sog_st_stablesusdx
Launch boundary: unresolved
Readiness: needs_legal_and_counterparty_resolution
```

Decision:

- this identity is restricted to the Stables Labs and usdx.money USDX token
- unrelated assets sharing the USDX symbol remain separate
- sUSDX is a separate ERC-4626 staking representation
- backing uses crypto spot assets offset by derivatives positions
- direct minting and redemption require approved KYC/KYB entities
- official documentation states a seven-day direct redemption path into USDT
- general holders rely on market liquidity
- base USDX does not automatically pass protocol yield to holders

Remaining work:

- exact launch boundary
- legal issuer and operating entities
- current custody and derivatives counterparties
- complete deployment inventory
- reserve and assurance normalization

## Promotion gate

The next PR may draft canonical layers but must not merge a candidate unless all required layers are internally consistent:

- canonical stable-asset record
- organization and relationship
- classification and lifecycle
- reserve and redemption profile
- event and Event v2 detail
- reviewed evidence
- known unknowns
- deployment identity
- legal profile
- reserve components
- income profile
- candidate promotion manifest
- generated outputs and Registry v3 baseline

Unknown values remain explicit. Only GYD has a reviewed day-level launch date.

## Deployment classification

```text
No production deployment required
```

This review changes research decisions and validators only. Cloudflare is not used.
