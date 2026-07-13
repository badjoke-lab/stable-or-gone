# PR #359 Market Access Pilot 2 Specification

Status: active work-item specification  
Updated: 2026-07-13

## 1. Roadmap item

PR #359 — Market Access Pilot 2.

PR #358 is complete and merged at:

```text
47868d6a13f8f85f62034f81a7c31d528bc3a1ba
```

Its reviewed handoff is:

```text
docs/migration/record-growth-batch-1-pr358-reviewed-handoff.json
```

## 2. Purpose

Pilot 2 tests whether the provider-scoped, function-scoped Market Access model used for USDC can be extended to a second asset with a different Japanese legal route without collapsing access into a country-wide allowed or banned flag.

The selected asset is RLUSD on SBI VC Trade's VCTRADE service.

## 3. Exact bounded scope

```text
jurisdiction: JP / Japan
asset: RLUSD / sog_st_rlusd
platform: SBI VC Trade
service: VCTRADE
functions: buy_sell, deposit, withdrawal, external_wallet_transfer
effective_from: 2026-06-24
observed_at: 2026-07-13
maximum new canonical records: 4
expected total Market Access records after promotion: 8
```

Excluded functions:

```text
direct_issuer_mint
direct_issuer_redemption
```

## 4. Reviewed source basis

Primary function and condition source:

```text
https://www.sbivc.co.jp/newsview/bsqs09vn_yzv
canonical Evidence: sog_src_rlusd_japan_launch_sbi_vc_2026
```

Primary provider-register and handled-asset source:

```text
https://www.fsa.go.jp/menkyo/menkyoj/denshikessaisyudan.pdf
canonical Evidence: sog_src_jfsa_electronic_payment_instrument_register_pr356
```

Supplementary current product and issuer-side launch context:

```text
https://www.sbivc.co.jp/rlusd
https://ripple.com/ripple-press/ripple-and-sbi-group-partner-to-launch-ripple-usd-in-japan/
```

The two primary URLs already have canonical Evidence identities. PR #359 must expand the existing claim scope instead of creating duplicate Evidence identities.

## 5. Function mapping

### buy_sell

Reviewed launch-stage conditions include:

```text
available on VCTRADE
minimum order quantity 1 RLUSD
maximum order quantity JPY 1 million equivalent
platform service and maintenance conditions
```

### deposit

Reviewed launch-stage conditions include:

```text
available
Ethereum only
fee free at the reviewed launch stage
24/365 acceptance excluding maintenance effects
large deposits may require additional reflection time
daily platform deposit ceiling and return behavior may apply
reflection may be paused under stated price-deviation conditions
```

### withdrawal

Reviewed launch-stage conditions include:

```text
available
Ethereum only
fee free at the reviewed launch stage
maximum JPY 1 million equivalent per request
minimum 0.000000000000000001 RLUSD per request
processing time and maintenance conditions apply
```

### external_wallet_transfer

This is represented through the reviewed withdrawal route:

```text
available only through Ethereum withdrawal
network-restricted
inherits the per-request withdrawal limit
not proof of support on XRPL or any non-Ethereum network
```

## 6. Japanese legal-route boundary

The SBI VC Trade source states that RLUSD is not a trust beneficiary right under United States law and that SBI VC Trade organized its Japanese handling as a Category 4 electronic payment instrument.

The JFSA register supports provider registration and RLUSD handled-asset scope. It does not constitute a value guarantee, recommendation, universal Japan-wide availability claim, or proof of every platform function.

Pilot 2 must not convert Ripple or SBI marketing language into a government approval or safety claim.

## 7. Evidence requirements

Every promoted function row must:

1. cite at least one canonical Evidence identity;
2. cite the SBI launch Evidence for function and condition claims;
3. cite the JFSA register Evidence for provider and handled-asset scope;
4. preserve the Ethereum-only network boundary;
5. preserve the reviewed date and platform boundary;
6. avoid direct issuer mint or redemption claims;
7. avoid duplicate canonical source URLs.

## 8. Required preservation

PR #359 must preserve:

```text
112 canonical stable assets
557 canonical Evidence records and Evidence Relations
174 deployments
four pre-pilot Market Access Records
PR #353 historical planning snapshots
PR #354–#358 reviewed handoffs
Comparison Readiness semantics
Facet Freshness semantics
Timeline date semantics
Update Feed publication-date semantics
Maintenance Log public-safety boundary
canonical-only publication
no automatic monitoring promotion
no asset ranking
no composite score
```

## 9. Explicit non-goals

PR #359 does not:

```text
promote JPYSC Market Access rows
promote direct issuer mint or redemption rows
claim universal RLUSD availability in Japan
claim RLUSD support on XRPL through SBI VC Trade
claim government guarantee, recommendation, or safety
infer illegality or prohibition from absence
add a new page, explorer, dashboard, ranking, or navigation family
change stable-asset count
change Compare preset membership
publish raw monitoring or candidate research
```

## 10. Validation

The dedicated workflow must validate:

```text
repository authority synchronized to PR #359
exact jurisdiction, asset, platform, function, and date scope
reviewed PR #358 handoff identity and merge commit
source research row remains noncanonical
existing canonical Evidence identities are reused
expanded Evidence claim scope is function-specific
one function per canonical record
logical uniqueness
schema vocabulary and required fields
exactly four new RLUSD Market Access records
exactly eight total Market Access records
no unrelated Market Access changes
112 stable assets and 557 Evidence records preserved
no public planning artifact leakage
deterministic statistics and immutable history
Astro check, build, and public-layer verification
```

## 11. Exit criteria

PR #359 completes when:

1. the RLUSD function mapping is reviewed;
2. existing canonical Evidence identities have sufficient claim scope;
3. exactly four reviewed RLUSD Market Access Records are promoted;
4. unsupported functions remain absent rather than guessed;
5. canonical counts and public projections are synchronized;
6. dedicated validation and general CI are green;
7. PR #360 Evidence and Correction Batch becomes next.
