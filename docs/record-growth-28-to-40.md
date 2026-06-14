# SOG record growth plan: 28 to 40

Status: Batch C, Batch D, and Batch E implemented

## Goal

Grow the canonical registry from 28 to 40 stable assets through three controlled four-record batches. Candidate assignment does not guarantee promotion. Every record must pass duplicate, identity, classification, source, relationship, event, evidence, profile, deployment, and build validation.

## Current progress

```text
Batch C: 28 → 32 — implemented on record-growth-batch-c
Batch D: 32 → 36 — implemented
Batch E: 36 → 40 — implemented
```

Batch C added complete canonical records for GHO, BOLD, USD0, and USR. GHO's current Ethereum token address remains intentionally unresolved until it is extracted directly from the maintained Aave address-book source. USR is classified as restricted because of the March 2026 unauthorized-mint incident and ongoing recovery state.

## Batch C — current protocol stable assets

Target: `batch_003`

Status: implemented

### GHO

- Proposed ID: `sog_st_gho`
- Organization: Aave / Aave DAO
- Classification: facilitator-issued DAO-governed protocol stablecoin
- Implemented coverage: Ethereum launch, facilitator design, GSM conversion, canonical bridging, reserve/redemption profile, evidence, deployment placeholder, and known unknowns
- Remaining known unknown: canonical Ethereum token address and complete current facilitator inventory
- Primary sources:
  - https://aave.com/help/gho-stablecoin/gho
  - https://aave.com/help/gho-stablecoin/facilitators
  - https://aave.com/help/gho-stablecoin/stability-module
  - https://aave.com/help/gho-stablecoin/bridging-gho

### BOLD

- Proposed ID: `sog_st_bold`
- Organization: Liquity
- Classification: Ethereum-native crypto-collateralized stablecoin
- Implemented coverage: Liquity V2 live phase, WETH/wstETH/rETH collateral, borrower-set rates, direct redemption, canonical Ethereum deployment, evidence, and known unknowns
- Identity boundary: BOLD is distinct from LUSD and third-party sBOLD
- Primary sources:
  - https://docs.liquity.org/
  - https://docs.liquity.org/v2-faq/bold-and-earn
  - https://docs.liquity.org/v2-faq/borrowing-and-liquidations
  - https://docs.liquity.org/faq/lusd-redemptions

### USD0

- Proposed ID: `sog_st_usd0`
- Organization: Usual DAO / Usual ecosystem
- Classification: tokenized-real-world-asset-backed stablecoin
- Implemented coverage: direct and indirect mint/redeem architecture, RWA collateral, governance and organization uncertainty, Ethereum/Arbitrum/Base/BNB deployments, evidence, and known unknowns
- Identity boundary: USD0 is distinct from bUSD0, sUSD0, and USD0a
- Primary sources:
  - https://docs.usual.money/usual-products/usd0-stablecoin/usd0
  - https://docs.usual.money/resources-and-ecosystem/fact-sheets/usual-products/usd0

### USR

- Proposed ID: `sog_st_usr`
- Organization: Resolv
- Classification: crypto-native stablecoin with a separate first-loss layer
- Implemented coverage: normal mint/redeem design, collateral architecture, Ethereum contract identity, separation from RLP/stUSR/wstUSR, March 2026 unauthorized-mint event, recovery status, evidence, and known unknowns
- Current lifecycle: restricted
- Primary sources:
  - https://docs.resolv.xyz/litepaper/overview/usr
  - https://docs.resolv.xyz/litepaper/for-developers/token-supply-operations/usr
  - https://resolv.xyz/blog/resolv-postmortem-march-22-2026-incident

## Batch D — historical lifecycle cases

Target: `batch_004`

Status: implemented

### SAI

- Proposed ID: `sog_st_sai`
- Organization: MakerDAO
- Classification target: historical single-collateral stablecoin
- Required research: original Dai identity, rename to SAI, Multi-Collateral Dai launch, migration, emergency-shutdown or settlement state, contract identity, relationship to current DAI
- Promotion rule: SAI must remain a separate historical entity and must not overwrite the DAI record.
- Primary source entry points:
  - https://docs.makerdao.com/smart-contract-modules/shutdown/emergency-shutdown-module
  - https://blog.makerdao.com/multi-collateral-dai-is-live/

### HUSD

- Proposed ID: `sog_st_husd`
- Organization candidates: Stable Universal, Huobi / HTX, Paxos as historical custodian
- Classification target: historical fiat-backed stablecoin
- Required research: legal issuer, custody structure, issuance and redemption shutdown, 2022 depeg, exchange delisting, contract state, final lifecycle status
- Promotion rule: remains `needs_review` until issuer roles and final issuance or redemption state are supported by durable sources.

### IRON

- Proposed ID: `sog_st_iron`
- Organization: Iron Finance
- Classification target: historical partially collateralized algorithmic stablecoin
- Required research: Polygon and BSC identities, USDC/TITAN backing design, June 2021 bank run, redemption failure, extreme supply changes, official post-mortem, later protocol reuse of the IRON name
- Promotion rule: chain-specific identities and later Iron Finance products must not be collapsed into one unsupported record.
- Primary source entry point:
  - https://ironfinance.medium.com/iron-finance-post-mortem-17-june-2021-6a4e9ccf23f5

### mUSD

- Proposed ID: `sog_st_musd`
- Organization: mStable
- Classification target: basket-backed meta-stablecoin
- Required research: basket composition through time, mint and redeem mechanics, feeder pools, Save and imUSD relationship, Ethereum and Polygon deployments, present operational state
- Primary source entry points:
  - https://docs.mstable.org/assets/musd
  - https://docs.mstable.org/using-mstable/mstable-app/swap-1
  - https://docs.mstable.org/using-mstable/mstable-app/save

## Batch E — non-USD and mechanism diversity

Target: `batch_005`

Status: implemented

### EURS

- Proposed ID: `sog_st_eurs`
- Organization: STASIS
- Classification target: euro-backed issuer stablecoin
- Required research: legal issuer, reserve accounts, verification layers, direct redemption terms, deployments, address controls, launch and migration history
- Primary source entry points:
  - https://stasis.net/eurs-info
  - https://stasis.net/transparency
  - https://stasis.net/terms

### EURT

- Proposed ID: `sog_st_eurt`
- Organization: Tether
- Classification target: euro-backed issuer stablecoin in wind-down or terminated redemption state
- Required research: launch, issuer and chain history, strategic transition, cessation of direct redemption effective 2025-11-27, remaining contracts and market activity
- Primary source entry points:
  - https://tether.to/en/supported-protocols/
  - https://tether.to/en/legal/

### Mento Dollar / USDm

- Proposed ID: `sog_st_usdm`
- Organization: Mento Protocol
- Classification target: fiat-referenced protocol stablecoin
- Required research: continuity between cUSD and USDm, token-contract history, V2/V3 reserve architecture, collateral and liquidity strategies, governance, cross-chain deployments
- Promotion rule: remains `needs_review` until SOG can state whether cUSD and USDm are one continuous asset identity, a rebrand, or separate lifecycle records.
- Primary source entry points:
  - https://docs.mento.org/mento/build-on-mento/integration-overview/integrate-stables
  - https://docs.mento.org/mento/protocol-concepts/reserve
  - https://docs.mento.org/mento-v3/build/smart-contracts/stabletoken

### alUSD

- Proposed ID: `sog_st_alusd`
- Organization: Alchemix
- Classification target: synthetic debt stablecoin backed by yield-bearing stablecoin positions
- Required research: Alchemist versions, accepted collateral, debt repayment and Transmuter exits, V1/V2 migration, admin controls, L2 representations, present deployment state
- Primary source entry points:
  - https://docs.alchemix.fi/
  - https://docs.alchemix.fi/alchemix-user-docs/resources/site-overview
  - https://docs.alchemix.fi/alchemix-ecosystem/transmuter
  - https://alchemix-finance.gitbook.io/v2/verifieddeployments/

## Promotion order

```text
Batch C: 28 → 32 — implemented
Batch D: 32 → 36 — implemented
Batch E: 36 → 40 — implemented
```

## Required promotion layers

Each promoted asset must include, at minimum:

- canonical stable-asset record
- organization record or verified reuse of an existing organization
- stablecoin-organization relationship
- Registry v2 classification
- reserve and redemption or exit profile
- at least one meaningful lifecycle event
- Event v2 detail
- multiple scoped evidence records
- known unknowns
- deployment record when a canonical deployment can be verified
- candidate status changed to `promoted`
- baseline, loader, validator, build, deployment, and public-layer integration

## Backup candidates

The following remain outside the immediate 28 → 40 set and can replace a blocked candidate only after a documented decision:

- RSV
- Basis Cash
- Empty Set Dollar
- cEUR / EURm
- EUR0
- USR-related receipt or yield products only if classified as adjacent assets rather than the underlying stablecoin

A replacement requires an update to the candidate master and this plan before implementation.
