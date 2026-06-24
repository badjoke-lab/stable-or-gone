# Remaining Launch-Date Review

Updated: 2026-06-24

## Purpose

This document is the human-readable companion to `data/quality/launch-date-unresolved.json`. The machine-readable queue and the canonical `launch_date: null` set must match exactly. Day-level dates are added only when a reviewed first-party or on-chain public boundary supports them.

## Current queue

```text
Total unresolved: 25
Category B: 3
Category C: 19
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
| Agora Dollar | `sog_st_agoraausd` | — | Announcement, mint, deployment, and public availability conflict. |
| Basis Cash | `sog_st_bac` | — | Deployment, distribution, epoch, and public launch conflict. |
| Cashio Dollar | `sog_st_cashio` | — | Deployment and public mint availability differ. |
| DOLA | `sog_st_dola` | — | First mint, release, and FiRM issuance differ. |
| Dynamic Set Dollar | `sog_st_dsd` | — | Version, epoch, and distribution boundaries conflict. |
| Empty Set Dollar | `sog_st_esd` | — | Deployment, epoch, and architecture boundaries conflict. |
| Euro Tether | `sog_st_eurt` | — | Announcement, issuance, listings, and deployments differ. |
| GYEN | `sog_st_gyen` | — | Issuance, availability, listings, and wind-down differ. |
| IRON | `sog_st_iron` | — | BSC, Polygon, and staged rollout boundaries differ. |
| Magic Internet Money | `sog_st_mim` | — | Cauldron, first issuance, announcement, and UI differ. |
| MainStreetUSD | `sog_st_msusd` | — | Announcement, issuance, deployment, and availability differ. |
| mStable USD | `sog_st_musd` | — | Deployment, public launch, basket, and Save differ. |
| Stables Labs USDX | `sog_st_stablesusdx` | — | Announcement, issuance, deployment, and approved access differ. |
| Staked USDe | `sog_st_susde` | — | USDe launch and staking activation differ. |
| World Liberty Financial USD | `sog_st_usd1` | 2025-03 | Introduction, issuance, testing, and availability differ. |
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
Current unresolved queue: 25
Category B: 3
Category C: 19
Category D: 3
Machine-readable queue: data/quality/launch-date-unresolved.json
Next bounded review: Basis Cash
```
