# Current-product launch-boundary review

Status: supporting audit  
Date: 2026-06-28  
Roadmap item: PR #220

## Scope

This review covers the remaining current-product and lineage group:

```text
HONEY
HUSD
MainStreetUSD
Stables Labs USDX
Staked USDe
USD1
Mento Dollar
USYC
Hyperliquid USDH
AE Coin
```

The review separates network activation, issuer announcement, contract deployment, first mint, fund inception, regulatory approval, migration, rebrand, test distribution, and broad public availability.

## Result

No additional canonical launch date is promoted. All ten records remain `null` because their strongest day-level evidence identifies an adjacent boundary rather than the exact asset-launch boundary used by SOG.

```text
Total unresolved: 19
Category B: 3
Category C: 16
Category D: 0
```

PR #220 completes the scheduled launch-date source-review pass for the current 92-record registry. Future changes require newly recovered first-party or onchain evidence rather than repeated review of the same source set.

## Decisions

| Asset | Strongest bounded conclusion | Decision |
|---|---|---|
| HONEY | Berachain mainnet launched 2025-02-06; HONEY-specific first mint or redemption was not recovered. | Preserve `null`. |
| HUSD | Future-launch announcement on 2019-07-17; confirmed HUSD/PAX conversion by 2019-10-18. | Preserve `null`. |
| MainStreetUSD | Current product and proof-of-solvency surfaces exist; original announcement, deployment, and first mint were not recovered. | Preserve `null`. |
| Stables Labs USDX | Current contracts and mint/redeem/stake documentation exist; original launch statement and first public dApp day were not recovered. | Preserve `null`. |
| Staked USDe | Ethena public mainnet opened on 2024-02-19 with staking functionality, but a separate first sUSDe deposit or activation day was not recovered. | Preserve `null`. |
| USD1 | Contracts, introduction, a production airdrop test, first issuance, and broad market access are separate boundaries; April 2025 is supported only at month level. | Preserve `null`. |
| Mento Dollar | cUSD and USDm are one continuing asset; the 2025 rebrand is not a launch. cUSD activation is bounded to June 2020, but the executed first-public-transfer day remains unresolved. | Preserve `null`. |
| USYC | 2023-05-01 is the fund inception date, not proof of first token issuance or public availability. | Preserve `null`. |
| USDH | Native Markets terms were effective 2025-09-21, but first mint, HyperCore activation, HyperEVM linking, and later migration are separate. | Preserve `null`. |
| AE Coin | Regulatory approval, planning-stage whitepaper, first issuance, customer access, and merchant acceptance are separate boundaries. | Preserve `null`. |

## Full unresolved queue snapshot

```text
sog_st_agoraausd
sog_st_brz
sog_st_dsd
sog_st_esd
sog_st_eurt
sog_st_honey
sog_st_husd
sog_st_mim
sog_st_msusd
sog_st_musd
sog_st_stablesusdx
sog_st_susde
sog_st_tryb
sog_st_usd1
sog_st_usdm
sog_st_usdz
sog_st_usyc
sog_st_usdh
sog_st_aecoin
```

## Fixed rules applied

- Network mainnet launch is not automatically the stable asset launch.
- A future-launch announcement is not an effective launch date.
- A live product page does not prove the original launch day.
- Contract deployment is not automatically first mint or public availability.
- The underlying asset launch is not automatically the derivative staking-token launch.
- Fund inception is not automatically token launch.
- Regulatory approval is not automatically first issuance or customer availability.
- Migration and rebrand dates do not replace the original continuing-asset launch.
- Month- and year-level evidence is not coerced into a day.

## Machine-readable changes

`data/quality/launch-date-unresolved.json` records a 2026-06-28 review date, reviewed source URLs, stronger bounded ranges, and boundary-specific reason codes for all ten records. Canonical stablecoin files, record counts, routes, evidence counts, and public output remain unchanged.

## Follow-up

The active workstream advances to PR #221: terminal-date and historical relationship-end review. Launch-date records remain eligible for future correction only when materially new primary or onchain evidence is found.

## Deployment classification

```text
No production deployment required
```
