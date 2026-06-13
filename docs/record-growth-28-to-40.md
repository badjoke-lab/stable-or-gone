# SOG record growth plan: 28 to 40

Status: candidate set fixed

## Goal

Grow the canonical registry from 28 to 40 stable assets through three controlled four-record batches. Candidate assignment does not guarantee promotion. Every record must pass duplicate, identity, classification, source, relationship, event, evidence, profile, deployment, and build validation.

## Batch C — current protocol stable assets

Target: `batch_003`

### GHO

- Proposed ID: `sog_st_gho`
- Organization: Aave / Aave DAO
- Classification target: overcollateralized protocol stablecoin
- Required research: launch, facilitators, Ethereum issuance, GSM, bridge deployments, mint and repay mechanics, governance controls
- Primary source entry points:
  - https://aave.com/help/gho-stablecoin/gho
  - https://aave.com/help/gho-stablecoin/facilitators
  - https://aave.com/help/gho-stablecoin/stability-module
  - https://aave.com/help/gho-stablecoin/bridging-gho

### BOLD

- Proposed ID: `sog_st_bold`
- Organization: Liquity
- Classification target: Ethereum-native crypto-collateralized stablecoin
- Required research: Liquity V2 launch, ETH and LST collateral branches, borrower-set rates, redemption routing, stability pools, earn products, distinction from LUSD
- Primary source entry points:
  - https://docs.liquity.org/
  - https://docs.liquity.org/v2-faq/bold-and-earn
  - https://docs.liquity.org/v2-faq/borrowing-and-liquidations
  - https://docs.liquity.org/faq/lusd-redemptions

### USD0

- Proposed ID: `sog_st_usd0`
- Organization: Usual DAO / Usual ecosystem
- Classification target: tokenized-real-world-asset-backed stablecoin
- Required research: issuance entity and DAO roles, direct and indirect minting, redemption, collateral providers, insurance fund, chain deployments, distinction from USD0++, bUSD0, sUSD0, and USD0a
- Primary source entry points:
  - https://docs.usual.money/usual-products/usd0-stablecoin/usd0
  - https://docs.usual.money/resources-and-ecosystem/fact-sheets/usual-products/usd0

### USR

- Proposed ID: `sog_st_usr`
- Organization: Resolv
- Classification target: crypto-native stablecoin with delta-neutral backing
- Required research: collateral and hedge architecture, insurance pool, mint and redemption eligibility, deployment addresses, yield attribution, distinction from RLP and staked or receipt products
- Primary source entry points:
  - https://docs.resolv.xyz/litepaper/usd-pegged-tokens/usr
  - https://docs.resolv.xyz/litepaper/resolv-protocol-overview

## Batch D — historical lifecycle cases

Target: `batch_004`

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
Batch C: 28 → 32
Batch D: 32 → 36
Batch E: 36 → 40
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
