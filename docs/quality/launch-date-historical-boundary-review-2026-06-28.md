# Historical launch-boundary review

Status: supporting audit  
Date: 2026-06-28  
Roadmap item: PR #219

## Scope

This review covers seven historical launch-boundary records:

```text
Agora AUSD
Dynamic Set Dollar
Empty Set Dollar
Euro Tether
GYEN
Magic Internet Money
mStable USD
```

The review separates issuer service start, contract deployment, first mint, public interface availability, exchange listing, version activation, and later deployment events.

## Result

GYEN is resolved to `2021-03-01`. GMO's official launch release states that GMO Trust began GYEN issuance, redemption, and service on that date, and a later official retrospective independently repeats the same service-start date.

The other six canonical launch dates remain `null`. Their source trails and bounded ranges are stronger, but none has day-level primary evidence for the exact SOG asset-launch boundary.

```text
Total unresolved: 19
Category B: 3
Category C: 16
Category D: 0
```

The registry remains at 92 stable assets. Evidence grows from 455 to 457 through two GYEN official-source records.

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

- Issuer issuance and redemption service can establish launch when an official source states the effective day.
- Exchange listing does not replace issuer or protocol launch.
- Contract deployment alone does not establish public launch.
- A retrospective protocol-start date and a later public announcement remain separate boundaries unless the source explicitly equates them.
- Version launches do not replace the original asset launch.
- Month- and year-level evidence is not coerced into a day.

## Data and validation changes

- `sog_st_gyen.launch_date` becomes `2021-03-01`.
- Two official GYEN launch evidence records are added.
- The launch-date queue falls from 20 to 19 records.
- Queue distribution becomes `B 3 / C 16 / D 0`.
- The validator requires GYEN to remain outside the unresolved queue with the canonical date and launch evidence present.
- The six unresolved PR #219 records require review dates and reviewed-source arrays.

## Deployment classification

```text
No production deployment required
```
