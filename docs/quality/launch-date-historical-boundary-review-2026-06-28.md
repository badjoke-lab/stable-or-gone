# Historical launch-boundary review

Status: supporting audit  
Date: 2026-06-28  
Updated for controlled growth: 2026-07-08  
Roadmap items: PR #219 base review, PR #330 queue extension

## Scope

The original PR #219 review covered seven historical launch-boundary records:

```text
Agora AUSD
Dynamic Set Dollar
Empty Set Dollar
Euro Tether
GYEN
Magic Internet Money
mStable USD
```

PR #330 extends the same unresolved-date discipline to EURe and poundtoken (1GBP). The review separates issuer service start, contract deployment, first mint, public interface availability, exchange listing, version activation, later deployment events, and current product availability.

## Result

GYEN is resolved to `2021-03-01`. GMO's official launch release states that GMO Trust began GYEN issuance, redemption, and service on that date, and a later official retrospective independently repeats the same service-start date.

Other queued assets remain `null` where day-level evidence for the exact SOG asset-launch boundary is not established. PR #330 does not convert current EURe availability or historical 1GBP contract/product evidence into an invented launch day.

```text
Total unresolved: 21
Category B: 3
Category C: 18
Category D: 0
```

The registry has advanced to 102 stable assets through PR #330 controlled growth. The launch queue expands by two records while the audited 100-asset checkpoint remains historical evidence.

## Decisions

| Asset | Decision | Boundary treatment |
|---|---|---|
| GYEN | Set `launch_date` to 2021-03-01 | Issuance, redemption, and issuer service started together; the later Binance listing is distribution only. |
| Agora AUSD | Preserve `null` | Ethereum deployment on 2024-07-07 does not establish first mint or broad public availability. |
| DSD | Preserve `null` | An official retrospective says DSD started on 2020-11-26, while the public launch articles are dated 2020-11-28. |
| ESD | Preserve `null` | ESD was already described as recently launched by 2020-10-19, but the original launch post and exact protocol-start day were not recovered. |
| EURT | Preserve `null` | Tether sources establish historical product identity and deployments, but not a day-level original issuance boundary. |
| MIM | Preserve `null` | Current official documentation establishes MIM identity and operation, but the original first Cauldron, first mint, and public interface day remain unresolved. |
| mUSD | Preserve `null` | Contract verification, strongest mainnet candidate, first mint, and public product availability remain separate boundaries. |
| EURe | Preserve `null` | Current regulated availability, redemption, reserve backing, and exact contracts are verified, but current availability is not the original launch day. |
| poundtoken / 1GBP | Preserve `null` | Historical product documentation and verified Ethereum token identity do not establish the exact first public issuance or redemption day. |

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
sog_st_eure
sog_st_1gbp
```

## Fixed rules applied

- Issuer issuance and redemption service can establish launch when an official source states the effective day.
- Exchange listing does not replace issuer or protocol launch.
- Contract deployment alone does not establish public launch.
- Current product availability does not establish original launch day.
- A retrospective protocol-start date and a later public announcement remain separate boundaries unless the source explicitly equates them.
- Version launches do not replace the original asset launch.
- Month- and year-level evidence is not coerced into a day.
- Historical token persistence does not establish current issuer service availability.

## Data and validation changes

- `sog_st_gyen.launch_date` remains resolved to `2021-03-01`.
- Existing official GYEN launch evidence remains required.
- PR #330 adds EURe and 1GBP to the unresolved launch-date queue.
- Queue distribution becomes `B 3 / C 18 / D 0`.
- The validator requires GYEN to remain outside the unresolved queue with the canonical date and launch evidence present.
- The six unresolved PR #219 records retain review dates and reviewed-source arrays.
- PR #330 Growth E records retain explicit review dates and reviewed-source arrays.

## Deployment classification

```text
No production deployment required
```
