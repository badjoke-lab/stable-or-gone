# Cashio Dollar launch-boundary audit

Recorded: 2026-06-24

## Decision

- Canonical asset: `sog_st_cashio`
- Canonical launch date: `2021-11-09`
- Launch-date queue action: remove from Category C
- Canonical terminal date: retain `2022-03-23`
- Solana CASH mint address: remain unresolved in this pass
- Exploit, peg collapse, and practical shutdown remain separate events on 2022-03-23

The reviewed evidence supports 2021-11-09 as the public launch boundary for Cashio Dollar. Saber’s dated first-party ecosystem announcement states that the first CASH/USDC pool was live, that users could provide liquidity or exchange CASH immediately, and that users could mint and redeem CASH through Cashio.

This is a day-level public-product boundary rather than a mere repository, deployment, or future announcement date.

## Recovered boundaries

### 1. Public mint, redemption, and liquidity availability — 2021-11-09

Saber published its Cashio partnership announcement on 2021-11-09 and stated that:

- the first CASH/USDC pool on Solana was launched
- users could provide CASH and USDC liquidity immediately
- users could exchange CASH for other stablecoins on Saber
- users could mint CASH from Saber USDC/USDT LP tokens
- users could redeem through Cashio

```text
https://medium.com/@saberteam/saber-launches-cash-usdc-pool-in-partnership-with-cashio-9ef6671be4e6
```

This evidence establishes an operating public product with mint, redemption, liquidity-provision, and swap routes on a specific day. SOG therefore uses:

```text
2021-11-09
```

as the canonical launch date.

### 2. Official Cashio repository

The official Cashio repository describes CASH as a decentralized stablecoin backed by interest-bearing Saber USD liquidity-provider tokens and documents the protocol packages responsible for minting, burning, collateral allowlisting, and SDK access.

```text
https://github.com/cashioapp/cashio
```

The repository supports the protocol identity and mechanism but is not used by itself as the public-launch date.

### 3. Later liquidity expansion — 2021-11-22 and after

Later Saber ecosystem announcements added additional CASH pools and described live deposits and minting routes. These later integrations confirm continuing availability but do not replace the first reviewed public boundary on 2021-11-09.

Examples include:

- additional CASH pools on 2021-11-22
- FEI/CASH integration in December 2021
- FRAX/CASH integration in December 2021

These are liquidity-expansion events, not original asset launches.

### 4. Infinite-mint exploit — 2022-03-23

Cashio suffered an infinite-mint exploit on 2022-03-23. The attacker bypassed collateral validation, minted unbacked CASH, drained value from the system, and caused the peg to collapse.

This is already modeled separately as:

- security exploit
- peg collapse
- practical shutdown

The exploit date remains the canonical terminal date because the protocol’s issuance and redemption system was destroyed on that day and was not restored as a functioning canonical CASH system.

### 5. Post-exploit repository activity

The existence of later repository changes or releases does not restore the stablecoin or move the terminal boundary. Code maintenance, investigation, or remediation work after the exploit is separate from operating issuance and redemption.

## Identity and deployment boundaries

- CASH is the canonical Cashio Dollar stable asset.
- COW and other Cashio-related tokens are not aliases of CASH.
- Saber pool addresses are liquidity venues, not the canonical CASH mint address.
- The exact Solana CASH mint and complete program-account map remain unresolved.
- The 2021-11-09 public product boundary can be fixed without forcing an unverified mint address.
- The 2022-03-23 exploit and terminal boundary remain separate from launch.

## Canonical implications

The synchronized implementation should:

1. Set `data/stablecoins-batch-k.json` launch date to `2021-11-09`.
2. Retain `discontinued_date: 2022-03-23`.
3. Remove `sog_st_cashio` from `data/quality/launch-date-unresolved.json`.
4. Set the existing Cashio launch event date to `2021-11-09`.
5. Update the Event v2 launch detail with the public mint, redemption, and liquidity boundary.
6. Add the Saber first-pool announcement as high-reliability launch evidence.
7. Preserve the official Cashio repository as protocol-identity evidence.
8. Keep the Solana deployment contract address `null` until the exact CASH mint is verified.
9. Preserve exploit, depeg, and shutdown events dated `2022-03-23`.
10. Synchronize generated statistics, integrity audit, Registry v2/v3 baselines, README, launch review, and roadmap.

## Remaining unknowns

- exact Solana CASH mint address
- first successful CASH mint transaction
- complete Cashio program and account deployment map
- exact relationship among CASH mint, brrr, bankman, collateral crates, and Saber pools
- complete first-day mint and redemption transaction chronology
- final victim repayment and recovery outcomes

These unknowns do not block the reviewed public launch date.

## Do not assert

- Do not use a repository creation or first commit as the launch date.
- Do not use a later November or December liquidity integration as the original launch.
- Do not use a Saber liquidity-pool address as the CASH mint address.
- Do not merge CASH with COW or unrelated tokens sharing the CASH symbol.
- Do not move the 2022-03-23 terminal date because repository work continued after the exploit.

## Primary and supporting sources

- Official Cashio repository: `https://github.com/cashioapp/cashio`
- Saber first CASH/USDC pool announcement, 2021-11-09: `https://medium.com/@saberteam/saber-launches-cash-usdc-pool-in-partnership-with-cashio-9ef6671be4e6`
- Later Saber CASH-pool expansion context, 2021-11-22
- CoinDesk exploit report, 2022-03-23: `https://www.coindesk.com/tech/2022/03/23/stablecoin-cashio-suffers-infinite-glitch-exploit-tvl-drops-by-28m`
- CertiK Cashio incident analysis, 2022-03-23: `https://www.certik.com/skynet-report/cashio-app-incident-analysis`

## Production status

This audit changes no canonical stable-asset, event, evidence, deployment, generated, Cloudflare, or public-production data. Deployment classification: **No production deployment required**.
