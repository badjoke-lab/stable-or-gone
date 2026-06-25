# Remaining Launch-Date Review

Updated: 2026-06-25

## Purpose

This document is the human-readable companion to `data/quality/launch-date-unresolved.json`. The machine-readable queue and the canonical `launch_date: null` set must match exactly. Day-level dates are added only when a reviewed first-party or on-chain public boundary supports them.

## Current queue

```text
Total unresolved: 22
Category B: 3
Category C: 16
Category D: 3
```

## Recently resolved bounded records

- EURA — agEUR launch separated from the later EURA rebrand.
- lisUSD — HAY launch separated from the lisUSD rebrand.
- sUSD — eUSD, nUSD launch, and sUSD rename separated.
- Nuon — v1 and v2 product boundaries separated.
- SPOT — original launch separated from later protocol versions.
- fxUSD — public availability separated from announcement, seeding, and V2 upgrade.
- MAI — Polygon public launch separated from rename and V2 activation.
- Savings DAI — contract deployment on 2023-01-17 separated from public Spark availability on 2023-05-09.
- Basis Cash — original public launch fixed to 2020-11-30 while V2 activation and unresolved terminal boundaries remain separate.
- Cashio Dollar — public mint, redemption, liquidity, and swap availability fixed to 2021-11-09 while the exact Solana mint remains unresolved.
- DOLA — Ethereum contract creation on 2021-02-23 separated from the public Anchor and DOLA launch on 2021-02-25; the exact first mint remains unresolved.
- USD1 — Ethereum and BNB Smart Chain deployments on 2025-01-28, the 2025-03-25 introduction, and the 2025-04-07 airdrop test were separated; public launch remains unresolved at April 2025 month level.
- MIM — 2021-05-05 introduction, 2021-05-25 deployment, 2021-06-05 LP incentives, and live operation by 2021-06-11 were separated; the exact first Cauldron remains unresolved.
- mUSD — 2020-05-28 contract verification, the 2020-05-29 mainnet-live candidate, and 2020-06-05 production-security coverage were separated; the original first-party launch statement remains unresolved.

USDX, sUSDe, and Agora AUSD have completed bounded audits, but their canonical launch dates remain unresolved and therefore stay in Category C. Agora AUSD’s current Ethereum contract deployment is fixed to 2024-07-07 without treating deployment as public launch.

## Category B — partial date only

| Stable asset | ID | Best known range | Reason |
|---|---|---|---|
| Brazilian Digital Token | `sog_st_brz` | 2019 | First-party sources establish 2019 only. |
| Berachain HONEY | `sog_st_honey` | 2025 | No HONEY-specific day-level public launch statement recovered. |
| Anzen USDz | `sog_st_usdz` | 2024-06 | Official sources establish June 2024 only. |

## Category C — boundary, version, or lineage conflict

| Stable asset | ID | Best known range | Reason |
|---|---|---|---|
| Agora Dollar | `sog_st_agoraausd` | — | Ethereum contract deployment is fixed to 2024-07-07; first mint, approved access, and broad public availability remain unresolved. |
| Dynamic Set Dollar | `sog_st_dsd` | — | Version, epoch, and distribution boundaries conflict. |
| Empty Set Dollar | `sog_st_esd` | — | Deployment, epoch, and architecture boundaries conflict. |
| Euro Tether | `sog_st_eurt` | — | Announcement, issuance, listings, and deployments differ. |
| GYEN | `sog_st_gyen` | — | Issuance, availability, listings, and wind-down differ. |
| IRON | `sog_st_iron` | — | BSC, Polygon, and staged rollout boundaries differ. |
| Magic Internet Money | `sog_st_mim` | 2021-05 to 2021-06 | Introduction, deployment, first Cauldron, first issuance, liquidity, incentives, and UI differ. |
| MainStreetUSD | `sog_st_msusd` | — | Announcement, issuance, deployment, and availability differ. |
| mStable USD | `sog_st_musd` | 2020-05-29 | Contract verification, candidate mainnet availability, first mint, and Save activation differ; the original first-party launch source is not recovered. |
| Stables Labs USDX | `sog_st_stablesusdx` | — | Announcement, issuance, deployment, and approved access differ. |
| Staked USDe | `sog_st_susde` | — | USDe launch and staking activation differ. |
| World Liberty Financial USD | `sog_st_usd1` | 2025-04 | January deployments, March introduction, April testing, first issuance, and broader availability differ. |
| Mento Dollar | `sog_st_usdm` | — | Mento Dollar and earlier Celo-dollar history differ. |
| Kujira USK | `sog_st_usk` | — | Deployment, first issuance, and app availability differ. |
| Vai | `sog_st_vai` | — | Venus, first VAI issuance, and feature activation differ. |
| VNX Swiss Franc | `sog_st_vchf` | — | Announcement, issuance, and availability remain unresolved. |

## Category D — adequate primary source not recovered

| Stable asset | ID | Best known range | Reason |
|---|---|---|---|
| HUSD | `sog_st_husd` | — | No reliable issuer day-level launch source recovered. |
| BiLira | `sog_st_tryb` | — | Current sources do not preserve the original launch day. |
| Hashnote US Yield Coin | `sog_st_usyc` | — | Current documents do not establish the original launch day. |

## Fixed policy

- Require day-level primary or on-chain evidence for a canonical launch date.
- Do not coerce month or year into a date.
- Do not use exchange listings as the default launch boundary.
- Do not substitute a rebrand, migration, contract deployment, testnet, guarded beta, or later product version for the original public boundary.
- Keep unresolved values as `null`.

## Current completion state

```text
Original review scope: complete
Current unresolved queue: 22
Category B: 3
Category C: 16
Category D: 3
Machine-readable queue: data/quality/launch-date-unresolved.json
Next bounded review: USK
```
