# VAI Launch-Boundary Review

Recorded: 2026-06-25

Result: IMPLEMENTED — LAUNCH RESOLVED

Stablecoin: `sog_st_vai`

Current canonical launch date: `2020-11-24`

Recommended canonical launch date: `2020-11-24`

Recommended status: retain `active`

## Question

VAI has several distinct lifecycle boundaries:

- Venus alpha testnet
- VAI beta-test planning
- Venus mainnet deployment
- first public VAI minting
- exact first VAI mint transaction
- later stability-fee changes
- later Peg Stability Module deployment
- later Prime-only collateralized minting restrictions

This review determines which boundary represents the original public launch of the continuing VAI asset.

## Reviewed boundaries

| Boundary | Date | Evidence status | Canonical treatment |
| --- | --- | --- | --- |
| Venus alpha testnet launch | 2020-10-17 | Day-level first-party statement | Testnet boundary only |
| VAI minting described as future beta functionality | 2020-10-17 | First-party pre-launch statement | Confirms VAI was not publicly launched at alpha-testnet stage |
| Venus main network and public VAI minting launched | 2020-11-24 | Day-level first-party statement | Canonical public launch |
| Exact VAI contract deployment and first mint | Unresolved in reviewed source set | On-chain boundary not normalized | Preserve as known unknown |
| VAI stability-fee system | Later protocol model | Current first-party documentation | Do not substitute for original launch |
| VAI Peg Stability Module proposal and deployment process | 2023 | Dated governance and current documentation | Later peg-support boundary |
| Current Prime-only collateralized borrowing route | Current | First-party current guide | Current access condition, not launch boundary |

## Evidence

### 1. Alpha testnet did not include public VAI minting

Venus Protocol's official alpha-testnet announcement dated 2020-10-17 states that users could test supplying and borrowing, while VAI minting would be released in a subsequent beta testnet. The same article described mainnet as a later milestone.

Source:

```text
https://medium.com/venusprotocol/venus-protocol-testnet-launch-6b3641c0d5d7
```

This is explicit first-party evidence that the October 17 alpha-testnet boundary is not the VAI public launch.

### 2. Mainnet launch enabled VAI minting

Venus Protocol's official article dated 2020-11-24 states that the Venus main network had officially launched on Binance Smart Chain and that users could mint the protocol's synthetic stablecoin VAI. It also listed the supported collateral assets and directed users to the live Venus application.

Source:

```text
https://medium.com/venusprotocol/venus-protocol-main-network-launched-52ea9929091f
```

This is a day-level, first-party, explicit public-availability statement. It establishes both Venus mainnet operation and the public VAI minting route.

### 3. Current protocol model is later context

Current Venus documentation describes VAI as the primary stablecoin of Venus Protocol and documents its collateralized minting, variable stability fee, repayment and burn process, and Peg Stability Module.

Sources:

```text
https://docs-v4.venus.io/tokens/vai
https://docs-v4.venus.io/guides/borrowing-vai
https://docs-v4.venus.io/whats-new/psm
```

These pages establish the continuing product identity and current mechanics. They do not replace the original 2020 launch boundary.

### 4. PSM is a later lifecycle boundary

A Venus governance proposal dated 2023-04-12 proposed development and deployment of VAI Peg Stability Modules and additional liquidity support. Later governance records describe the PSM as launched and used in the restoration of the VAI peg.

Sources:

```text
https://community.venus.io/t/proposal-deploy-the-vai-peg-stability-module-and-supply-liquidity-to-pancakeswap-for-the-vai-usdt-pair/3461
https://community.venus.io/t/vip-re-enable-vai-minting-and-adjust-vai-base-rate/3935
```

The PSM is therefore a later peg-support and issuance-route boundary, not VAI's original launch.

## Decision

Set VAI's canonical `launch_date` to:

```text
2020-11-24
```

Retain current status as:

```text
active
```

Reason:

- the October 17 first-party alpha-testnet article explicitly says VAI minting was still future functionality
- the November 24 first-party article explicitly states mainnet was launched and VAI could be minted by users
- the source is day-level and directly tied to public protocol access
- the exact first mint transaction is not required to override a documented public product launch
- stability-fee changes, PSM deployment, and current Prime access restrictions are later lifecycle boundaries

## Implementation result

The canonical implementation:

1. set VAI `launch_date` to `2020-11-24`
2. retain `status: active`
3. add a dated 2020-11-24 launch event and Event v2 launch detail
4. add the 2020-10-17 testnet and 2020-11-24 mainnet first-party evidence
5. preserve the exact VAI contract deployment and first mint as unresolved
6. keep the current protocol-model event separate from launch
7. update the launch known unknown to track exact deployment, first mint, and initial distribution rather than the public launch day
8. update the BNB Chain deployment note and evidence links
9. remove VAI from the unresolved launch-date queue
10. reduce the unresolved launch queue from 21 to 20 and Category C from 15 to 14
11. synchronize baselines, generated outputs, README, audits, and roadmap

## Scope boundary

This review does not assert the exact first VAI mint transaction or exact contract-deployment timestamp. It identifies the documented public mainnet and minting-availability boundary for the continuing VAI asset.
