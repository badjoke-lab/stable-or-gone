# USD1 Launch-Boundary Review

Recorded: 2026-06-25

Result: IMPLEMENTED — PUBLIC LAUNCH DATE REMAINS UNRESOLVED

Stablecoin: `sog_st_usd1`

Current canonical launch date: `null`

Recommended canonical launch date: `null`

## Question

USD1 is publicly described as a 2025 stablecoin, but the record currently combines several different boundaries:

- contract deployment
- internal or market-maker testing
- official introduction
- first issuance and circulation
- direct BitGo mint and redemption access
- broader exchange and market availability

This review determines whether one day-level boundary can safely represent the original public launch.

## Reviewed boundaries

| Boundary | Date | Evidence status | Canonical treatment |
| --- | --- | --- | --- |
| Ethereum contract creation | 2025-01-28 04:01:35 UTC | Day-level on-chain evidence | Deployment boundary only |
| BNB Smart Chain contract creation | 2025-01-28 04:03:41 UTC | Day-level on-chain evidence | Deployment boundary only |
| Early on-chain issuance and market-maker testing | March 2025 | Publicly observed, but not a documented public-access boundary | Testing and pre-launch circulation |
| WLFI and BitGo announcement | 2025-03-25 | Day-level first-party release | Introduction and planned launch, not completed public launch |
| BitGo infrastructure article | 2025-03-28 | Day-level first-party article | Launch infrastructure and partnership context |
| Official USD1 airdrop-test proposal | 2025-04-07 | Day-level first-party governance proposal | Explicit testing before broader market access |
| BitGo retrospective launch period | April 2025 | First-party month-level retrospective | Supports April launch period, not a day |
| Current broad availability | Undated current documentation | First-party current-state evidence | Confirms later availability, not original day |

## Evidence

### 1. Ethereum deployment

World Liberty Financial's current contract-address documentation identifies the official Ethereum USD1 contract as:

```text
0x8d0d000ee44948fc98c9b98a4fa4921476f08b0d
```

The contract-creation transaction is:

```text
https://etherscan.io/tx/0x1cf37f0670ce56d9489d7ec4c4ccddbd6ab59df95b316aafc353edc3a6862896
```

Etherscan records creation on:

```text
2025-01-28 04:01:35 UTC
```

This is a deployment boundary. It predates public introduction and does not establish public availability.

### 2. BNB Smart Chain deployment

The official documentation lists the same address for the issuer-supported BNB Smart Chain representation.

The contract-creation transaction is:

```text
https://bscscan.com/tx/0x0dcbe0103fadabf494e2c5717d5fd01b1e0016607b00283b97aeee23875abba3
```

BscScan records creation on:

```text
2025-01-28 04:03:41 UTC
```

This is also a deployment boundary rather than a public launch date.

Official address source:

```text
https://docs.worldlibertyfinancial.com/usd1-token/contract-addresses
```

### 3. March 25 introduction

The March 25, 2025 first-party release is titled:

```text
World Liberty Financial Plans to Launch USD1, the Institutional-Ready Stablecoin
```

The release says WLFI announced plans to launch USD1 and that tokens would initially be minted on Ethereum and BNB Smart Chain. Its future-oriented wording does not establish that unrestricted minting, redemption, or general market access began that day.

Source:

```text
https://www.businesswire.com/news/home/20250325773694/en/World-Liberty-Financial-Plans-to-Launch-USD1-the-Institutional-Ready-Stablecoin
```

### 4. March 28 BitGo infrastructure article

BitGo published an article on March 28, 2025 describing USD1 as the blueprint for its Stablecoin-as-a-Service infrastructure and explaining BitGo's role in the launch.

Source:

```text
https://www.bitgo.com/uk/resources/blog/usd1-the-blueprint-for-bitgos-stablecoin-as-a-service/
```

This supports the issuer and infrastructure chronology but does not fix the first completed public-access day.

### 5. April 7 airdrop-test proposal

A first-party World Liberty Financial governance proposal dated April 7, 2025 recommended testing an on-chain airdrop by distributing a small amount of USD1. The proposal described the test as building visibility and awareness before broader market access.

Source:

```text
https://governance.worldlibertyfinancial.com/t/proposal-test-airdrop-functionality-by-distributing-usd1-to-all-wlfi-token-holders/4794
```

This is strong evidence that March contract use and the March 25 announcement should not automatically be treated as broad public launch.

### 6. April launch period

BitGo's 2025 retrospective describes USD1 as launching in April 2025.

Source:

```text
https://www.bitgo.com/uk/resources/blog/2025-year-in-review/
```

This establishes a first-party month-level launch period but does not provide a day-level boundary.

### 7. Current state

Current WLFI documentation confirms that BitGo issues USD1, processes initial purchases and redemptions, and permits eligible BitGo customers to redeem USD1 for U.S. dollars. Current official pages also describe broad institutional, individual, and DeFi availability.

Sources:

```text
https://docs.worldlibertyfinancial.com/resources/faq
https://worldlibertyfinancial.com/usd1
```

These sources establish the present product state but are not dated evidence of the original public-access day.

## Decision

Keep USD1's canonical `launch_date` as:

```text
null
```

Reason:

- January 28 is a contract-deployment boundary
- March on-chain activity includes testing and pre-launch circulation
- the March 25 official release announces plans to launch rather than confirming completed public access
- the April 7 official proposal still describes testing before broader market access
- a first-party retrospective supports April 2025 only at month level
- current broad availability pages are undated
- exchange listings are later distribution events and are not used as the default asset-launch boundary

## Implementation result

The public launch date remains unresolved, and the canonical quality implementation:

1. normalizes the official Ethereum contract address
2. normalizes the official BNB Smart Chain contract address
3. records both 2025-01-28 contract-creation boundaries
4. adds the official March 25 introduction as a dated event separate from launch
5. adds the April 7 test-airdrop proposal as a testing boundary
6. preserves an April 2025 best-known launch range without coercing it into a day
7. updates the USD1 known unknown to distinguish deployment, testing, introduction, issuance, and broad access
8. keeps USD1 in the unresolved launch queue
9. keeps the total queue at 22 and Category C at 16

## Scope boundary

This review does not claim that USD1 was unavailable before April 7. It concludes only that the reviewed primary and on-chain evidence does not establish one defensible day-level public launch boundary.
