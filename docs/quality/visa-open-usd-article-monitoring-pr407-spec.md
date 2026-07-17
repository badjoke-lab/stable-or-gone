# PR #407 Visa Stablecoin Platform Article and OUSD/VSP Monitoring Specification

Status: active bounded editorial and private monitoring work  
Implementation PR: 407  
Public article: one  
Private monitoring subjects: two

## Objective

Publish one verified Japanese analysis article inside the existing `/updates/` route family and register Open USD and Visa Stablecoin Platform as private, review-only, noncanonical monitoring subjects.

## Public article

```text
Route: /updates/visa-stablecoin-platform-open-usd/
Language: ja
Title: Visa Stablecoin Platformとは何か――Open USDを起点にVisaが狙う「ステーブルコイン運用基盤」
Publication date: 2026-07-17
Information current through: 2026-07-17
Update Feed entries: 1
```

The article must preserve these distinctions:

- Visa announced VSP, an enterprise stablecoin-operations platform;
- Open Standard describes Open USD as a shared stablecoin planned to launch later in 2026;
- VSP begins with Open USD support but is not itself a stablecoin;
- Visa is not described as the sole issuer or sole governor of Open USD;
- VSP is initially in beta with select clients;
- future circulation, contracts, reserves, redemptions, adoption, and general availability remain unresolved until verified;
- Open USD's OUSD symbol collides with the existing Origin Dollar OUSD asset.

## Reviewed public sources

```text
Visa announcement:
https://investor.visa.com/news/news-details/2026/Visa-Introduces-Platform-for-Stablecoin-Minting-Movement-and-Management/default.aspx

Visa stablecoin solutions:
https://www.visa.com/en-us/solutions/stablecoins

Open Standard / Open USD:
https://joinopenstandard.com/

Origin Dollar OUSD:
https://www.originprotocol.com/ousd
https://docs.originprotocol.com/yield-bearing-tokens/ousd
```

The article may clearly label interpretation, but must not turn interpretation into an uncited factual claim.

## Private monitoring registrations

### Open USD

```text
source_id: open-standard-open-usd
subject_kind: prelaunch_stablecoin
subject_name: Open USD
symbol: OUSD
launch_state: announced_prelaunch
canonical_record: false
baseline: pending_initial_acceptance
```

Monitor official changes related to launch timing, minting, redemption, reserves, assurance, governance, distribution, and availability. Monitoring observations remain private and noncanonical.

### Visa Stablecoin Platform

```text
source_id: visa-stablecoin-platform
subject_kind: stablecoin_infrastructure
subject_name: Visa Stablecoin Platform
abbreviation: VSP
launch_state: select_client_beta
canonical_record: false
baseline: pending_initial_acceptance
```

Monitor official changes related to beta status, broader availability, supported assets, wallet operations, controls, network integration, settlement and treasury use, and service-state changes. Monitoring observations remain private and noncanonical.

## Bounded news discovery

Add exactly two queries:

```text
visa-vsp-open-usd
open-standard-ousd-launch
```

The global query limit may increase from four to six. Discovery output remains private, source-agnostic, human-review-required, and incapable of canonical or article writes.

## Canonical and public-data boundaries

```text
Canonical assets: 112
Canonical Evidence: 559
Evidence Relations: 559
Deployments: 174
Market Access Records: 8
Canonical changes: 0
Public machine-readable canonical changes: 0
```

The article and Update Feed entry are public editorial outputs. The monitoring registrations and baselines are private operational configuration.

## Required validation

- exact article route, title, language, publication date, information date, notes, and official links;
- one Update Feed entry and no other registry-update change;
- exactly two new official-source registrations;
- exactly two pending baseline records;
- exactly two new news-discovery queries and maximum six total;
- no canonical data change;
- no public monitoring output;
- monitoring source/schema validation;
- article build and route presence;
- canonical and public machine-readable safety declarations remain unchanged;
- next work item is `REVIEW GATE`.

## Exit condition

The article is public under the existing Update Feed route family, Open USD and VSP are privately monitored with pending baselines, all canonical boundaries remain unchanged, and the repository stops at `REVIEW GATE`.
