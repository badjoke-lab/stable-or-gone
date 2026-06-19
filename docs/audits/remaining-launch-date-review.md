# Remaining Launch-Date Review

Updated: 2026-06-19

## Purpose

This review classifies every canonical stable asset that still has `launch_date: null` after PR #55.

The objective is not to force a day-level date into every record. It is to separate dates that are supported by primary evidence from dates that are only partially known, definition-dependent, or not recoverable from adequate sources.

## Classification

```text
A. Day-level date confirmed or strongly recoverable from primary evidence
B. Only month or year is currently confirmed
C. Multiple plausible launch definitions, versions, migrations, or dates exist
D. No adequate primary launch source has been found
```

Category A is eligible for a launch-date batch only after the exact source is added to the evidence layer and the canonical record, event, event detail, source count, generated statistics, and integrity output are updated together.

Categories B, C, and D must remain `null` unless later research changes the classification.

## Queue summary

```text
Original null-date queue reviewed: 38
Category A identified:              7
Promoted in Launch-date Batch O:     5
Category A remaining:                2
Category B:                           5
Category C:                          23
Category D:                           3
Remaining launch_date null:         33
```

## Category A — day-level date supported

| Stable asset | ID | Candidate date | Basis | Planned treatment |
|---|---|---:|---|---|
| crvUSD | `sog_st_crvusd` | 2023-05-14 | Curve's official second-anniversary article dated 2025-05-14 states that the date was the second anniversary of crvUSD. | Promoted in Launch-date Batch O |
| EUR CoinVertible | `sog_st_eurcv` | 2023-04-20 | SG-FORGE's launch release is dated 2023-04-20 and explicitly states that it launches EUR CoinVertible. | Promoted in Launch-date Batch O |
| EURI | `sog_st_euri` | 2024-08-26 | Banking Circle's dated issuer announcement explicitly states the launch of EURI. | Promoted in Launch-date Batch O |
| EURQ | `sog_st_eurq` | 2024-11-18 | Quantoz states that it started issuing EURQ and USDQ on Monday 2024-11-18. Exchange listing on 2024-11-21 is a later distribution event, not the canonical launch. | Promoted in Launch-date Batch O |
| sUSDS | `sog_st_susds` | 2024-09-18 | Sky Launch Season governance and activation materials identify 2024-09-18 as the product activation date. The record must preserve the relationship to sDAI rather than imply an unrelated lineage. | Batch P |
| USDtb | `sog_st_usdtb` | 2024-12-16 | Ethena's official launch page and contemporaneous ecosystem launch material identify 2024-12-16 as the launch date. The exact publication metadata must be captured in evidence before promotion. | Batch P |
| USDY | `sog_st_usdy` | 2023-09-07 | Ondo's official blog index dates “Introducing Ondo USD Yield (USDY)” to 2023-09-07. Network-specific launches are later deployment events. | Promoted in Launch-date Batch O |

### Primary sources for Category A

```text
crvUSD
https://news.curve.finance/crvusd-2-years-on/

EURCV
https://www.sgforge.com/societe-generale-forge-launches-coinvertible-the-first-institutional-stablecoin-deployed-on-a-public-blockchain/

EURI
https://www.bankingcircle.com/banking-circle-launches-the-first-bank-backed-mica-compliant-stablecoin-euri/

EURQ
https://www.quantoz.com/blog/quantoz-payments-issues-euro-and-us-dollar-stablecoins

sUSDS
https://forum.sky.money/tag/susds
https://docs.sky.money/legal/skybase-international/terms-of-use

USDtb
https://ethena.fi/blog/usdtb-launch
https://news.curve.finance/ethena-usdtb-curve-launch/

USDY
https://ondo.finance/blog/introducing-ondo-usd-yield-usdy
https://blog.ondo.finance/page/5/
```

## Category B — month or year only

| Stable asset | ID | Best confirmed range | Reason day-level precision is not accepted |
|---|---|---|---|
| BRZ | `sog_st_brz` | 2019 | Transfero's current first-party product page confirms launch in 2019 but does not provide a day-level date. |
| EURS | `sog_st_eurs` | 2018 | STASIS materials establish the early EURS launch period, but the currently accessible first-party pages do not provide an adequately preserved day-level launch statement. |
| Mountain Protocol USDM | `sog_st_mountainusdm` | 2023 | Mountain Protocol states that it launched in 2023. The date of company/product announcement, first mint, and public portal availability has not yet been resolved to one canonical day. |
| USD0 | `sog_st_usd0` | 2024-05 | Usual's first-party history states that USD0 went live in May 2024, without a day-level date on the reviewed source. |
| USR | `sog_st_usr` | 2024-09 | Resolv's first-party journey page identifies September 2024 as public launch, without a day-level date. |

### Primary sources for Category B

```text
BRZ
https://transfero.com/brz

EURS
https://stasis.net/eurs-info
https://stasis.net/about-us

Mountain USDM
https://mountainprotocol.com/company/

USD0
https://docs.usual.money/resources-and-ecosystem/roadmap/usual-the-first-two-years

USR
https://resolv.xyz/journey
```

## Category C — definition, version, or lineage conflict

| Stable asset | ID | Conflict that must be resolved before using a date |
|---|---|---|
| Agora AUSD | `sog_st_agoraausd` | Announcement, first mint, first network deployment, and broad public availability are distinct. Current first-party pages confirm operation but do not expose one canonical launch day. |
| Basis Cash | `sog_st_bac` | Contract deployment, first distribution, first epoch, and public protocol launch are different possible dates. Historical primary material must be reconstructed before selecting one. |
| Cashio Dollar | `sog_st_cashio` | Contract deployment and actual public minting availability must be distinguished. Current records strongly cover the exploit and shutdown but not the launch boundary. |
| DOLA | `sog_st_dola` | Current Inverse documentation describes DOLA but does not establish whether the canonical date should be first mint, first product release, or later FiRM-era issuance. |
| Dynamic Set Dollar | `sog_st_dsd` | DSD v1, later versions, first epoch, and public distribution create a version-boundary problem. |
| Empty Set Dollar | `sog_st_esd` | First contract deployment, first epoch, and later Empty Set architecture changes are distinct lifecycle points. |
| EURA / agEUR | `sog_st_eura` | The record spans agEUR and EURA branding. The original protocol launch and later rename must not be collapsed without a documented lineage decision. |
| Euro Tether | `sog_st_eurt` | Issuer announcement, issuance start, exchange availability, and chain-specific deployments require separation. |
| GYEN | `sog_st_gyen` | Initial issuance, first public availability, and exchange listings are different. The current winding-down state also requires careful separation from launch history. |
| IRON | `sog_st_iron` | BSC and Polygon versions and the protocol's staged rollout create multiple possible launch boundaries. |
| lisUSD | `sog_st_lisusd` | The record includes the Helio/HAY to Lista/lisUSD lineage. Original stablecoin launch and rebrand/migration dates must be modeled separately. |
| Magic Internet Money | `sog_st_mim` | First cauldron, first MIM mint, protocol announcement, and public interface availability are not yet reconciled. |
| mUSD | `sog_st_musd` | Contract deployment, mStable public launch, basket activation, and Save product availability are separate events. |
| NUON | `sog_st_nuon` | Nuon v1 guarded mainnet launched on 2023-02-02, while Nuon v2 opened publicly on 2025-03-03. The canonical record's continuity across versions must be resolved before choosing one date. |
| sDAI | `sog_st_sdai` | DSR vault deployment, user-interface release, and later Spark distribution are separate. The record also has a successor relationship to sUSDS. |
| SPOT | `sog_st_spot` | SPOT v1, v2, and later protocol versions create a versioned identity question. |
| sUSD | `sog_st_susd` | Synthetix states that the asset launched in 2018 as eUSD, migrated to nUSD, and was later rebranded to sUSD. A day-level date requires a lineage-specific policy. |
| sUSDe | `sog_st_susde` | USDe public launch, staking contract activation, reward accrual start, and unrestricted acquisition are distinct. |
| USD1 | `sog_st_usd1` | March 2025 introduction, first onchain mint, airdrop testing, exchange availability, and broad public use are separate milestones. |
| Mento Dollar | `sog_st_usdm` | The current Mento asset identity must be distinguished from earlier Celo-dollar naming and deployment history. |
| USK | `sog_st_usk` | Kujira protocol deployment, first mint, and public app availability require chain-level reconstruction. |
| VAI | `sog_st_vai` | Venus protocol launch, first VAI minting, and later VAI-specific feature activation are distinct. |
| VCHF | `sog_st_vchf` | Issuer announcement, first issuance, and exchange/network availability have not been reconciled to one canonical launch definition. |

### Primary sources and starting points for Category C

```text
Agora AUSD
https://www.agora.finance/product/ausd
https://www.agora.finance/blog

DOLA
https://docs.inverse.finance/inverse-finance/inverse-finance/products/tokens/dola

EURA
https://angle.money/eura
https://docs.angle.money/

EURCV lineage example
https://www.sgforge.com/stablecoin-elevation/

lisUSD
https://docs.bsc.lista.org/

Mountain and version-boundary comparison
https://docs.mountainprotocol.com/

NUON v1
https://blog.nuon.fi/launch-release-note-and-faqs/

NUON v2
https://blog.nuon.fi/nuon-v2-is-open/

sUSD lineage
https://blog.synthetix.io/rebuilding-susd/

sUSDe mechanics
https://docs.ethena.fi/solution-design/staking-usde

USD1
https://worldlibertyfinancial.com/usd1
https://docs.worldlibertyfinancial.com/resources/faq
```

## Category D — adequate primary launch source not found

| Stable asset | ID | Current position |
|---|---|---|
| HUSD | `sog_st_husd` | Current and archived product materials reviewed so far do not provide a sufficiently reliable issuer-level launch statement. Exchange listing dates must not be substituted automatically. |
| TRYB | `sog_st_tryb` | Current BiLira materials establish product mechanics but the reviewed primary sources do not preserve a day-level launch statement. |
| USYC | `sog_st_usyc` | Current Hashnote/Circle documentation explains the fund-token structure and current operation, but the original product launch date is not established by the reviewed primary sources. |

## Rejected shortcuts

The following shortcuts are explicitly disallowed:

- using the first block explorer transfer without proving that it was public issuance
- using an exchange listing date as the asset launch by default
- converting a year-only statement to January 1
- converting a month-only statement to the first day of the month
- using an article publication date when the article describes a different operational date
- treating a rebrand or migration as a new asset launch without a separate identity decision
- treating a testnet, guarded beta, or limited-access phase as unrestricted public launch without documentation

## Batch plan produced by this audit

### Launch-date Batch O — complete

```text
crvUSD     2023-05-14
EURCV      2023-04-20
EURI       2024-08-26
EURQ       2024-11-18
USDY       2023-09-07
```

These five have the cleanest identity and primary-source boundaries.

### Launch-date Batch P — next

```text
sUSDS      2024-09-18
USDtb      2024-12-16
```

These require more careful evidence and lineage handling than Batch O.

### Launch-date unresolved queue freeze

- re-check whether any Category B record can be promoted using an archived first-party day-level source
- resolve any Category C record whose version or lineage can be documented safely
- retain all other launch dates as `null`
- record the final B/C/D classification as the maintained unresolved queue

## Completion state

```text
Original review scope: complete
Records classified: 38 / 38
Canonical launch dates promoted in Batch O: 5
Remaining launch_date null: 33
Remaining category-A records: sUSDS, USDtb
Next work item: Launch-date Batch P
```
