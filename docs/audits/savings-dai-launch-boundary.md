# Savings DAI launch-boundary audit

Recorded: 2026-06-24

## Decision

- Canonical asset: `sog_st_sdai`
- Canonical launch date: `2023-05-09`
- Launch-date queue action: remove from Category C
- Current Ethereum contract deployment: `2023-01-17`
- Public product boundary: Spark Protocol availability for all DeFi users on `2023-05-09`
- Later product boundary: Sky Token and Product Launch / sUSDS activation on `2024-09-18`

The current Savings DAI contract was deployed months before its reviewed public product launch. Maker's dated first-party launch announcement explicitly states that Spark Protocol would become available to all DeFi users starting on 2023-05-09 and names sDAI among the supported assets. This is sufficient day-level first-party evidence for the canonical public-availability boundary.

The canonical `launch_date` should therefore be set to `2023-05-09`.

## Recovered boundaries

### 1. Savings DAI contract deployment — 2023-01-17

The canonical Ethereum sDAI contract was created on 2023-01-17 at 17:52:11 UTC:

```text
Contract: 0x83F20F44975D03b1b09e64809B757c47f942BEeA
Block:    16428133
Tx:       0xa2f51048265f2fe9ffaf69b94cb5a2a4113be49bdecd2040d530dd6f68facc42
Name:     SavingsDai
```

This establishes the current contract-deployment boundary. Deployment alone does not prove public product availability and is not used as the canonical launch date.

### 2. Contract design and audit completion — 2022-12 to 2023-05

The ChainSecurity Savings Dai assessment records three reviewed code versions:

- initial version received 2022-12-12
- gas-optimization version received 2023-01-12
- referral-code version received 2023-05-05

The final report is dated 2023-05-08 and describes Savings DAI as an ERC-4626 wrapper around the Dai Savings Rate.

These dates establish development and audit readiness. They do not independently establish public launch.

### 3. Public Spark and sDAI availability — 2023-05-09

Maker announced on 2023-05-08 that Spark Protocol would be available to all DeFi users starting on 2023-05-09. The announcement describes an Ethereum product with supply and borrow support for ETH, stETH, DAI, and sDAI.

```text
Official announcement:
https://twitter.com/MakerDAO/status/1655575088547127311
```

Contemporaneous coverage preserved the full announcement and separately described sDAI as the tokenized representation of DAI deposited into the Dai Savings Rate.

This boundary is suitable for the canonical launch because it is:

- day-level
- first-party
- explicitly prospective and effective
- tied to general DeFi-user availability
- product-specific through the explicit inclusion of sDAI

### 4. Later Sky and sUSDS transition — 2024-09-18

The Sky Token and Product Launch later activated sUSDS as the current Sky Savings Rate product. That later launch changed product emphasis and created the current legacy/limited context for sDAI, but it did not retroactively replace the original sDAI launch boundary.

The continuing sDAI contract, the current sUSDS product, and any future sunset or migration policy remain separate lifecycle questions.

## Identity and product boundaries

- DAI is the underlying stablecoin.
- sDAI is the ERC-4626 tokenized vault share over the Dai Savings Rate.
- sDAI is not an alias of DAI.
- The historical Dai Savings Rate predates sDAI and must not be used as the sDAI launch date.
- Contract deployment is separate from public product launch.
- Spark public availability is separate from the later Sky / sUSDS transition.
- sUSDS is a separate savings wrapper and not a rename of sDAI.

## Canonical implications

The synchronized implementation should:

1. Set `data/stablecoins-batch-h.json` launch date to `2023-05-09`.
2. Update the entity notes and verification date to describe the contract/public-launch separation.
3. Remove `sog_st_sdai` from `data/quality/launch-date-unresolved.json`.
4. Reduce the launch-date queue total and Category C count by one.
5. Add a dedicated launch event dated `2023-05-09`.
6. Add Event v2 launch detail linked to the Maker announcement.
7. Add launch evidence preserving the first-party announcement and supporting public-launch material.
8. Normalize the Ethereum deployment address and record the `2023-01-17` deployment boundary in deployment notes.
9. Keep the current-interface-support and future-lifecycle known unknowns.
10. Keep the 2026 limited-status review separate from the 2023 launch event.
11. Synchronize generated statistics, integrity audit, Registry v2/v3 baselines, README, and roadmap.

## Remaining unknowns after launch resolution

- earliest successful user deposit into the sDAI contract
- whether any controlled or pre-public deposits occurred before 2023-05-09
- complete history of first-party interface support before and after the Sky transition
- final sunset, migration, or mandatory-conversion policy, if any
- complete chain and wrapper deployment history beyond canonical Ethereum sDAI

These questions do not block the reviewed public-launch date.

## Do not assert

- Do not use 2023-01-17 as the public launch merely because the contract was deployed.
- Do not use the original Dai Savings Rate activation as the sDAI launch.
- Do not describe sDAI and sUSDS as one continuous token contract.
- Do not mark sDAI terminated or migrated without a primary source.
- Do not infer universal current first-party interface support from the continuing contract.

## Primary and supporting sources

- Maker launch announcement: `https://twitter.com/MakerDAO/status/1655575088547127311`
- Canonical sDAI contract: `https://etherscan.io/address/0x83F20F44975D03b1b09e64809B757c47f942BEeA`
- Contract creation transaction: `https://etherscan.io/tx/0xa2f51048265f2fe9ffaf69b94cb5a2a4113be49bdecd2040d530dd6f68facc42`
- ChainSecurity Savings Dai assessment: `https://docs.spark.fi/assets/Chainsecurity-sDAI.pdf`
- Official sDAI repository: `https://github.com/sky-ecosystem/sdai`
- Current Sky token routes: `https://developers.sky.money/quick-start/protocol-token-routes/`
- Contemporaneous preserved announcement: `https://cointelegraph.com/news/makerdao-launches-spark-protocol-a-new-defi-lending-solution-for-dai-users`
- Joint MakerDAO / Chainlink launch-period release: `https://www.prnewswire.com/news-releases/spark-protocol-announces-integration-of-chainlink-price-feeds-in-first-for-makerdao-ecosystem-301818993.html`

## Production status

This audit changes no canonical stable-asset, event, evidence, deployment, generated, Cloudflare, or public-production data. Deployment classification: **No production deployment required**.
