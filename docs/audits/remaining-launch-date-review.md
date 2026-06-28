# Remaining Launch-Date Review

Status: supporting audit  
Updated: 2026-06-28

## Purpose

This document summarizes the current canonical `launch_date: null` set. Machine-readable detail and reviewed source URLs are stored in `data/quality/launch-date-unresolved.json`. The current full source review is `docs/quality/launch-date-historical-boundary-review-2026-06-28.md`.

## Current queue

```text
Total unresolved: 19
Category B: 3
Category C: 16
Category D: 0
```

## Category B — partial date only

| Stable asset | ID | Best known range |
|---|---|---|
| Brazilian Digital Token | `sog_st_brz` | 2019; live by 2019-07-25 |
| BiLira | `sog_st_tryb` | 2019 |
| Anzen USDz | `sog_st_usdz` | 2024-06 |

## Category C — boundary, version, lineage, or product conflict

| Stable asset | ID | Best known range or conflict |
|---|---|---|
| Agora Dollar | `sog_st_agoraausd` | 2024-07-07 contract deployment; public launch unresolved |
| Dynamic Set Dollar | `sog_st_dsd` | 2020-11-26 protocol start to 2020-11-28 public announcement |
| Empty Set Dollar | `sog_st_esd` | Launched before 2020-10-19; original launch post not recovered |
| Euro Tether | `sog_st_eurt` | 2017 at year level |
| Berachain HONEY | `sog_st_honey` | 2025-02-06 network boundary; first asset use unresolved |
| HUSD | `sog_st_husd` | 2019-07-17 announcement to 2019-10-18 confirmed operation |
| Magic Internet Money | `sog_st_mim` | 2021-05 to 2021-06 |
| MainStreetUSD | `sog_st_msusd` | Announcement, issuance, deployment, and availability differ |
| mStable USD | `sog_st_musd` | 2020-05-28 to 2020-06-05 |
| Stables Labs USDX | `sog_st_stablesusdx` | Announcement, issuance, deployment, and approved access differ |
| Staked USDe | `sog_st_susde` | USDe launch and staking activation differ |
| World Liberty Financial USD | `sog_st_usd1` | 2025-04 at month level |
| Mento Dollar | `sog_st_usdm` | Mento Dollar and earlier Celo-dollar lineage differ |
| Hashnote US Yield Coin | `sog_st_usyc` | 2023-05-01 fund inception; token launch unresolved |
| Hyperliquid USDH | `sog_st_usdh` | Announcement, first mint, network activation, and migration differ |
| AE Coin | `sog_st_aecoin` | After 2025-01-17; live by 2025-05 |

## Resolved in PR #219

GYEN was removed from the unresolved queue. Its canonical launch date is `2021-03-01`, when GMO Trust officially began issuance, redemption, and service. The later Binance listing and later network deployments remain separate distribution and deployment boundaries.

## Fixed policy

- Require day-level first-party or on-chain evidence for a canonical launch date.
- Do not coerce month or year into a day.
- Do not use exchange listing, network launch, fund inception, approval, migration, rebrand, or contract deployment as the asset launch without matching evidence.
- Keep unresolved values as `null`.

## Review state

```text
Completed: PR #218 Category B/D review
Active: PR #219 historical boundary review
Next: PR #220 remaining current-product and lineage review
Machine-readable queue: data/quality/launch-date-unresolved.json
```
