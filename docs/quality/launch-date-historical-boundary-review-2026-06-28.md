# Historical launch-boundary review

Status: supporting audit  
Date: 2026-06-28  
Updated for controlled growth: 2026-07-13  
Roadmap items: PR #219 base review, PR #330 queue extension, PR #332 queue extension, PR #333 queue extension, PR #334 queue extension, PR #335 queue extension, PR #358 queue extension

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

PR #330 extends the same unresolved-date discipline to EURe and poundtoken (1GBP). PR #332 extends it to StablR Euro (EURR) and StablR USD (USDR). PR #333 extends it to PHPC. PR #334 extends it to CADC and ZARP. PR #335 extends it to AUDD and NZDS. PR #358 extends it to XUSD. The review separates issuer service start, contract deployment, first mint, public interface availability, exchange listing, version activation, later deployment events, current product availability, sandbox testing, network launch, issuer transition, token migration, and incident-response chronology.

## Result

GYEN is resolved to `2021-03-01`. GMO's official launch release states that GMO Trust began GYEN issuance, redemption, and service on that date, and a later official retrospective independently repeats the same service-start date.

Other queued assets remain `null` where day-level evidence for the exact SOG asset-launch boundary is not established. PR #330 does not convert current EURe availability or historical 1GBP contract/product evidence into an invented launch day. PR #332 likewise does not treat current StablR product pages, later deployment documentation, or May-June 2026 incident history as evidence of the original EURR or USDR launch day. PR #333 does not coerce PHPC sandbox testing or the dated Ronin network deployment launch into the original PHPC asset-launch day. PR #334 does not coerce CADC's 2021 year-level origin or 2025 issuer transition, nor ZARP's current availability or 2025 Solana migration, into original day-level launch dates. PR #335 does not convert historical AUDD or NZDS product identity, issuer association, or source-linked deployment context into an invented first issuance or redemption day. PR #358 does not convert XUSD's verified current product, redemption, reserve, or deployment availability into an invented original launch day.

```text
Total unresolved: 29
Category B: 3
Category C: 26
Category D: 0
```

The registry has advanced to 112 stable assets through PR #358 controlled growth. The launch queue includes XUSD while the audited 100-asset and reviewed 102/104/106/108/110-asset checkpoints remain historical evidence.

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
| StablR Euro / EURR | Preserve `null` | Current regulated product identity, exact deployment identifiers, reserve disclosures, and 2026 incident chronology do not establish the original first issuance or public redemption day. |
| StablR USD / USDR | Preserve `null` | Current regulated product identity, exact deployment identifiers, reserve disclosures, and 2026 incident chronology do not establish the original first issuance or public redemption day. |
| PHPC | Preserve `null` | BSP sandbox testing in May 2024 and the dated Ronin network launch on 2024-07-08 are verified, but neither establishes the original first public issuance, first mint, or first redeemable-service day for PHPC as an asset. |
| CADC | Preserve `null` | Loon states CADC originated in 2021 and records a dated 2025-10-27 issuer transition, but the exact original first issuance, first mint, and first redeemable-service day remain unresolved. |
| ZARP | Preserve `null` | Current product, reserve, redemption, and deployment documentation and a dated 2025 Solana migration are verified, but none establishes the original first public issuance or redemption day. |
| AUDD | Preserve `null` | Historical AUDD product identity and Australian-dollar reference do not establish the exact first public issuance, first mint, or first redeemable-service day. |
| NZDS | Preserve `null` | Historical NZDS identity and Techemynt association do not establish the exact first public issuance, first mint, or first redeemable-service day. |
| XUSD | Preserve `null` | Current StraitsX product, redemption, reserve, and deployment records establish current availability but not the exact original first public issuance or redemption day. |

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
sog_st_eurr
sog_st_stablrusdr
sog_st_phpc
sog_st_cadc
sog_st_zarp
sog_st_audd
sog_st_nzds
sog_st_xusd
```

## Fixed rules applied

- Issuer issuance and redemption service can establish launch when an official source states the effective day.
- Exchange listing does not replace issuer or protocol launch.
- Contract deployment alone does not establish public launch.
- Current product availability does not establish original launch day.
- Sandbox testing does not establish the original public asset launch day.
- A later network deployment launch does not replace the original asset launch day.
