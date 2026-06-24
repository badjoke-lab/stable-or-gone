# Stables Labs USDX launch-boundary audit

Recorded: 2026-06-24

## Decision

- Canonical asset: `sog_st_stablesusdx`
- Canonical launch date: retain `null`
- Launch-date queue category: retain Category C
- Earliest recovered production-contract boundary: `2024-03-18` on Ethereum
- Exact public-production and generally accessible launch boundary: unresolved
- Product boundary: base USDX and the ERC-4626 `sUSDX` staking representation remain separate products

The recovered evidence is sufficient to distinguish contract deployment, operational readiness, approved-participant minting, public secondary-market access, and the later campaign period. It is not sufficient to prove one day-level first-party public launch boundary. The canonical `launch_date` must therefore remain `null`.

## Recovered boundaries

### 1. Ethereum production-contract deployment — 2024-03-18

The Ethereum deployer history records a coordinated production deployment sequence on 2024-03-18:

- USDX token contract creation
- USDX minter authorization
- USDX sales contract creation
- sales-contract minter authorization
- USDX redeem contract creation
- `sUSDX` staking-vault creation
- ownership transfers for the deployed system

The contract addresses match the current official USDX documentation:

```text
USDX:       0xf3527ef8dE265eAa3716FB312c12847bFBA66Cef
sUSDX:      0x7788A3538C5fc7F9c7C8A74EAC4c898fC8d87d92
USDXSales:  0xb45c42Fbf8AF8Df5A1fa080A351E9B2F8e0a56D1
USDXRedeem: 0x0eaF6FE1aeD8631114d1dE78317982CE73d82f7b
```

This establishes an initial Ethereum production-contract boundary. It does **not** by itself prove that unrestricted users could mint, redeem, stake, or acquire USDX on that date.

### 2. Operational system described in external audit — 2024-11-01

The BlockSec audit report dated 2024-11-01 describes an operating USDX system with:

- exchange of supported stablecoin assets into USDX
- USDX redemption
- USDX staking into `sUSDX`
- LP-token staking and reward distribution

This is strong evidence that the production system and intended user flows existed by the audit date. An audit-report date is not the same as a public launch date and must not be substituted for it.

### 3. Approved-participant and public-liquidity boundary

Current official documentation separates two access routes:

- direct mint and redemption for approved KYC/KYB entities
- acquisition and disposal by other users through external liquidity pools and markets

The documentation therefore does not support treating contract deployment as equivalent to general public mint availability. Approved-participant access and public secondary-market access are separate boundaries.

### 4. Public campaign and liquidity ecosystem — December 2024

The official Stables Labs recap published on 2024-12-30 covers the period from 2024-12-16 through 2024-12-29 and states that:

- the USDX Campaign Season had launched
- USDX TVL had exceeded USD 400 million
- liquidity pools existed on PancakeSwap, Balancer, and Curve
- future primary minting would be limited to whitelisted market makers while regular users could obtain USDX through swaps

This proves that a public liquidity and campaign ecosystem was active by late December 2024. It does not recover the exact first day on which USDX became publicly obtainable.

### 5. Later protocol-update context — January 2025

The official 2025-01-24 recap describes SSSIP-1 as the first major update since launch and says Campaign Season 1 was nearing completion. This confirms an earlier launch but does not identify its exact day.

## Identity and product boundaries

- This record covers the Stables Labs / `usdx.money` USDX asset only.
- Unrelated assets using the `USDX` symbol must remain separate.
- `sUSDX` is a separate yield-bearing ERC-4626 representation and is not an alias of base USDX.
- The same-day deployment of USDX and `sUSDX` does not make them one canonical asset.
- Institutional primary issuance, general secondary-market access, and staking-product activation are separate lifecycle boundaries.

## Canonical implications

For the next synchronized canonical-quality update:

1. Keep `data/stablecoins-batch-m.json` launch date as `null`.
2. Keep `sog_st_stablesusdx` in `data/quality/launch-date-unresolved.json` as Category C.
3. Preserve the reason that announcement, deployment, issuance, approved access, and public liquidity boundaries differ.
4. Record 2024-03-18 only as an initial Ethereum production-contract deployment boundary if a dedicated deployment event is added.
5. Do not treat the BlockSec audit date as launch.
6. Do not treat a later campaign recap or campaign-start claim as the canonical asset launch.
7. Do not use an exchange listing, liquidity-pool creation, TVL milestone, financing announcement, or `sUSDX` activation as the default USDX launch date.

## Remaining source work

- Recover a first-party dated announcement that explicitly states USDX was live or generally obtainable.
- Recover the earliest approved-participant mint transaction and determine whether the program was production-accessible or still controlled testing.
- Recover the earliest documented public liquidity-pool activation and distinguish pool seeding from public trading.
- Recover the first `sUSDX` deposit or official staking-launch statement without merging that boundary into base USDX.
- Recover historical official documentation or announcements from the pre-Stables Labs branding period, if any, and determine whether they refer to the same contract lineage.
- Determine whether the 2024-03-18 contract suite was immediately production-controlled or remained in pre-launch configuration after deployment.

## Do not assert

- Do not set `2024-03-18` as the canonical public launch merely because the contracts were deployed.
- Do not set `2024-11-01` from the audit-report date.
- Do not set a December 2024 campaign date without a day-level first-party statement defining that event as the original USDX launch.
- Do not describe direct minting as permissionless.
- Do not merge USDX with `sUSDX` or with unrelated tokens sharing the symbol.
- Do not infer a legal issuer, custodian, counterparty, or reserve percentage beyond the reviewed source scope.

## Primary sources

- Official contracts: `https://docs.usdx.money/informaiton/contracts`
- Official USDX documentation: `https://docs.usdx.money/`
- Official USDX basics: `https://docs.usdx.money/a-synthetic-usd/usdx-basics`
- Official redemption guide: `https://docs.usdx.money/guides/how-to-redeem`
- Official staking documentation: `https://docs.usdx.money/a-yield-bearing-token/staking-usdx`
- Ethereum deployer history: `https://etherscan.io/address/0xee38Dd8888885674EdfC1E9bbF168eb520087659`
- Official security-audit index: `https://docs.usdx.money/informaiton/audit-reports`
- BlockSec USDX audit report, dated 2024-11-01
- Official 2024-12-30 bi-weekly recap: `https://medium.com/@StablesLabs/usdx-money-bi-weekly-recap-a-busy-and-thriving-project-progress-9b705c32e0f6`
- Official 2025-01-24 bi-weekly recap: `https://medium.com/@StablesLabs/bi-weekly-recap-usdx-money-campaign-season-1-nears-completion-project-updates-recap-2634df30c151`

## Production status

This audit changes no canonical stable-asset, event, evidence, deployment, generated, Cloudflare, or public-production data. Deployment classification: **No production deployment required**.
