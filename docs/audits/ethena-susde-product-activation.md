# Ethena sUSDe product-activation audit

Recorded: 2026-06-24

## Decision

- Canonical asset: `sog_st_susde`
- Canonical launch date: retain `null`
- Launch-date queue category: retain Category C
- Earliest recovered current-contract boundary: `2023-11-14` on Ethereum
- Ethena public-mainnet boundary: `2024-02-19`
- Exact first production staking, first public staking, and first reward-accrual boundaries: unresolved
- Product boundary: base USDe and the ERC-4626 `sUSDe` staking receipt remain separate canonical assets

The recovered evidence establishes that the current sUSDe contract predates Ethena's public-mainnet launch by approximately three months. It also establishes that sUSDe staking and reward distribution were active around the February 2024 public rollout. It does not establish one day-level boundary that safely represents the original sUSDe product launch.

The canonical `launch_date` must therefore remain `null`.

## Recovered boundaries

### 1. Current StakedUSDeV2 contract deployment — 2023-11-14

The current Ethereum sUSDe contract was created on 2023-11-14 at 16:32:47 UTC:

```text
Contract: 0x9D39A5DE30e57443BfF2A8307A4256c8797A3497
Block:    18571359
Tx:       0x9b099ba3c8e64ea8904cc6de83f2245e309e0f91c3ce1f976328b601e4dda314
Name:     StakedUSDeV2
```

The creation transaction also created the associated USDe silo and assigned the initial administrative and reward roles.

This proves deployment of the current production-contract lineage. It does **not** prove that unrestricted users could acquire USDe and stake it for sUSDe on that date.

### 2. Ethena public-mainnet announcement — 2024-02-19

Ethena Labs announced its public mainnet on 2024-02-19:

```text
https://twitter.com/ethena_labs/status/1759546702187696437
```

The public rollout included the Shard Campaign and described USDe and its reward-bearing staking product. Secondary contemporaneous reporting documents that users could stake USDe for sUSDe during the public campaign.

This is a strong public-protocol boundary. It is not automatically the original sUSDe launch date because the current sUSDe contract and pre-public protocol activity already existed before the public-mainnet announcement.

### 3. sUSDe reward payout and controlled rollout — 2024-02-22

An official Ethena Labs post dated 2024-02-22 stated that the sUSDe payout for the preceding week had been finalized, gave generated and paid APY figures, and described a slow and controlled product rollout:

```text
https://twitter.com/ethena_labs/status/1760754668399996960
```

This proves that sUSDe reward accounting and payout activity were operational no later than 2024-02-22. The reference to the preceding week means the product's operational boundary cannot safely be reduced to the later payout-post date.

It also does not prove the exact first day of generally available staking.

### 4. Current official staking mechanics

Current official Ethena documentation establishes that:

- users transfer USDe into the StakedUSDe contract and receive sUSDe
- the contract implements ERC-4626 vault mechanics
- rewards are transferred into the staking contract as USDe
- the USDe value represented by each sUSDe share rises as rewards accrue
- users may interact directly with the contract or through the Ethena application
- a cooldown applied during launch
- access restrictions can differ from contract-level availability

These mechanics confirm that sUSDe is a distinct reward-accruing receipt over USDe rather than an alias, rebrand, or ordinary deployment of base USDe.

## Why the date remains unresolved

At least four distinct dates or boundaries exist:

1. current StakedUSDeV2 contract deployment on 2023-11-14
2. any controlled or stealth production staking before public mainnet
3. Ethena public-mainnet and Shard Campaign opening on 2024-02-19
4. first confirmed reward payout described on 2024-02-22

The current evidence does not recover:

- the first production `Deposit` into the current contract
- whether the first deposit was internal seeding, controlled testing, or a user stake
- the exact date on which the Ethena UI first exposed public staking
- a first-party statement explicitly naming one date as the original sUSDe launch
- whether pre-public staking participants had the same access conditions as public users

Assigning `2023-11-14`, `2024-02-19`, or `2024-02-22` as the canonical launch would collapse different lifecycle boundaries into one unsupported date.

## Identity and product boundaries

- USDe is the base synthetic dollar.
- sUSDe is the transferable ERC-4626 reward-accruing receipt obtained by staking USDe.
- sUSDe is not an alias of USDe.
- USDe's canonical public launch date must not automatically populate sUSDe's launch date.
- Contract deployment does not automatically equal public staking activation.
- Reward payout does not automatically equal original product launch.
- Later cooldown, reward-distribution, market-liquidity, and jurisdiction changes are separate lifecycle events.

## Canonical implications

For the next synchronized canonical-quality update:

1. Keep `data/stablecoins-batch-h.json` launch date as `null`.
2. Keep `sog_st_susde` in `data/quality/launch-date-unresolved.json` as Category C.
3. Preserve `product_activation_conflict` as the reason code.
4. Record 2023-11-14 only as the current-contract deployment boundary if a dedicated deployment or contract event is added.
5. Preserve 2024-02-19 as Ethena's public-mainnet and USDe public-launch boundary, not automatically as sUSDe's original launch.
6. Preserve the USDe-to-sUSDe relationship in Registry v3.
7. Do not infer unrestricted global access from direct smart-contract availability.

## Remaining source work

- Recover the earliest successful `Deposit` event from the current sUSDe contract.
- Identify whether that deposit was initial seeding, an internal account, an approved participant, or a public user.
- Recover an archived Ethena application or official announcement showing the first day staking was publicly available.
- Recover historical documentation from the stealth-launch period and distinguish test, controlled-production, and public access.
- Confirm whether an earlier sUSDe implementation preceded the current StakedUSDeV2 contract.
- Build a dated history of cooldown, rewarder, blacklist, and access-control changes without treating them as launch replacements.

## Do not assert

- Do not set `2023-11-14` as launch merely because the current contract was deployed.
- Do not copy USDe's `2024-02-19` launch date into sUSDe without product-specific evidence.
- Do not use the 2024-02-22 reward-payout post as the original launch date.
- Do not merge sUSDe into the USDe record.
- Do not describe sUSDe as a fiat redemption claim.
- Do not describe access as universally unrestricted when official documentation contains jurisdictional restrictions.

## Primary and supporting sources

- Official Ethena staking design: `https://docs.ethena.fi/solution-design/staking-usde`
- Official staking guide: `https://docs.ethena.fi/video-guides/how-to-stake-usde`
- Official rewards mechanism: `https://docs.ethena.fi/solution-overview/protocol-revenue-explanation/rewards-mechanism-explanation`
- Current sUSDe contract: `https://etherscan.io/address/0x9D39A5DE30e57443BfF2A8307A4256c8797A3497`
- Current-contract creation transaction: `https://etherscan.io/tx/0x9b099ba3c8e64ea8904cc6de83f2245e309e0f91c3ce1f976328b601e4dda314`
- Official public-mainnet announcement: `https://twitter.com/ethena_labs/status/1759546702187696437`
- Official sUSDe payout statement: `https://twitter.com/ethena_labs/status/1760754668399996960`
- Contemporaneous staking walkthrough preserving official posts: `https://beincrypto.com/learn/how-to-ethena/`

## Production status

This audit changes no canonical stable-asset, event, evidence, deployment, generated, Cloudflare, or public-production data. Deployment classification: **No production deployment required**.
