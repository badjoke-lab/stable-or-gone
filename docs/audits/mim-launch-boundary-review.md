# MIM Launch-Boundary Review

Recorded: 2026-06-25

Result: PUBLIC LAUNCH DATE REMAINS UNRESOLVED

Stablecoin: `sog_st_mim`

Current canonical launch date: `null`

Recommended canonical launch date: `null`

## Question

Magic Internet Money entered production through several distinct steps:

- protocol and token introduction
- MIM contract deployment
- first Cauldron or lending-market activation
- first MIM issuance
- Curve liquidity-pool creation
- LP incentive activation
- broader UI and market availability

This review determines whether one day-level boundary can safely represent the original public launch of the continuing MIM asset.

## Reviewed boundaries

| Boundary | Date | Evidence status | Canonical treatment |
| --- | --- | --- | --- |
| Abracadabra, SPELL, and MIM introduction | 2021-05-05 | Dated official article | Product and protocol introduction |
| Ethereum MIM contract creation | 2021-05-25 | Day-level on-chain evidence | Deployment boundary only |
| First lending market activation | Late May or early June 2021 | First-party retrospective range | Public protocol operation, exact day unresolved |
| MIM/3CRV factory-pool creation | 2021-06-02 | On-chain liquidity boundary | Later liquidity boundary, not default launch |
| LP staking rewards begin | 2021-06-05 | Day-level first-party statement | Incentive and liquidity boundary |
| Live protocol state documented | 2021-06-11 | Day-level first-party governance proposal | Confirms earlier public operation |

## Evidence

### 1. Official product introduction

Abracadabra published the original article introducing Abracadabra, SPELL, and Magic Internet Money on 2021-05-05.

Source:

```text
https://medium.com/abracadabra-money/abracadabra-spell-and-magic-internet-money-a563637ce92e
```

This establishes a dated introduction of the product design. It does not by itself prove that a Cauldron, mint route, or public UI was operational that day.

### 2. Ethereum contract deployment

The official MIM Ethereum contract is:

```text
0x99D8a9C45b2ecA8864373A26D1459e3Dff1e17F3
```

The contract-creation transaction is:

```text
https://etherscan.io/tx/0x42dc8aae5acb46454f0355787c9add15f58ec1a7cc9f79ca2ba5499bcf855ef7
```

The contract was created on 2021-05-25. This is a deployment boundary and does not independently establish public borrowing or minting availability.

### 3. First lending market and early protocol use

On 2021-06-11, the Abracadabra team submitted a Curve governance proposal for the MIM/3Pool metapool. The proposal stated that its first lending market and LP-incentivization program had launched less than two weeks earlier. It also reported more than 100 million dollars of MIM-3LP3CRV-f-2 tokens locked and approximately 60 million MIM collateralized.

Source:

```text
https://gov.curve.finance/t/scip-40-adding-a-mim-3pool-metapool/1850
```

This is strong first-party evidence that public lending and issuance were active before 2021-06-11. It does not identify the exact day on which the first lending market became publicly usable.

### 4. Curve liquidity boundary

The MIM/3CRV factory pool was created on 2021-06-02. This establishes a liquidity-pool boundary after MIM contract deployment.

The Curve governance proposal records that LP staking rewards began on:

```text
2021-06-05
```

Pool creation and incentive activation are important distribution milestones, but they are not substituted for the first MIM Cauldron or public borrowing boundary.

### 5. Current official documentation

Current Abracadabra documentation describes MIM as a USD-denominated stablecoin borrowed through Cauldrons against supported collateral and confirms the official Ethereum contract address.

Sources:

```text
https://docs.abracadabra.money/
https://docs.abracadabra.money/learn/tokens/tokenomics
https://github.com/Abracadabra-money/magic-internet-money
```

These sources confirm identity and mechanics but do not provide a durable day-level chronology for the first public Cauldron or UI launch.

## Decision

Keep MIM's canonical `launch_date` as:

```text
null
```

Reason:

- 2021-05-05 is an introduction boundary
- 2021-05-25 is a contract-deployment boundary
- the exact first Cauldron and first public borrowing day remain unresolved
- the first-party June 11 proposal establishes only a less-than-two-weeks range for the first lending market
- 2021-06-02 and 2021-06-05 are liquidity and incentive boundaries
- no reviewed primary or on-chain source fixes one defensible day for original public MIM borrowing and issuance

## Resolved quality improvements

Although the public launch date remains unresolved, the follow-up canonical implementation should:

1. preserve the official Ethereum MIM address
2. record 2021-05-25 as the contract-deployment boundary
3. add a dated 2021-05-05 introduction event
4. add a dated 2021-06-05 liquidity-incentive event
5. add the 2021-06-11 first-party live-protocol evidence
6. preserve a best-known launch range spanning late May to early June 2021
7. add a launch-specific known unknown for the first Cauldron, first issuance, and public UI boundary
8. keep MIM in the unresolved launch queue
9. keep the total queue at 22 and Category C at 16

## Scope boundary

This review does not claim that MIM first became usable on 2021-06-05. It concludes only that MIM was publicly operational by 2021-06-11 and that the exact earlier public borrowing and issuance day remains unresolved.
