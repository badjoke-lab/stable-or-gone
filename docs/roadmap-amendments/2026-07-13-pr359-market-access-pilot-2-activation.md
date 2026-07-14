# PR #359 Market Access Pilot 2 Activation

Status: active roadmap amendment  
Date: 2026-07-13

## 1. Activation

PR #358 Record Growth Batch 1 is complete and merged at:

```text
47868d6a13f8f85f62034f81a7c31d528bc3a1ba
```

Its reviewed handoff is:

```text
docs/migration/record-growth-batch-1-pr358-reviewed-handoff.json
```

The active work item is now:

```text
PR #359 Market Access Pilot 2: active
PR #360 Evidence and Correction Batch: next
```

## 2. Governing references

```text
AGENTS.md
docs/spec-governance.md
docs/roadmap.md
docs/post-351-data-growth-operating-spec.md
docs/market-access-record-spec.md
schemas/market-access-record-v1.schema.json
config/market-access-governance-v1.json
docs/roadmap-amendments/2026-07-13-pr359-market-access-pilot-2-activation.md
docs/quality/market-access-pilot-2-pr359-spec.md
config/market-access-pilot-2-pr359.json
data/editorial-research/japan-stablecoin-market-access-2026.json
docs/migration/record-growth-batch-1-pr358-reviewed-handoff.json
```

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
expected total canonical Market Access records: 8
```

## 4. Evidence policy

The primary SBI launch URL and JFSA register URL already have canonical Evidence identities.

```text
sog_src_rlusd_japan_launch_sbi_vc_2026
sog_src_jfsa_electronic_payment_instrument_register_pr356
```

PR #359 expands reviewed claim scope on those identities rather than creating duplicate canonical URLs.

## 5. Starting boundary

```text
canonical assets: 112
canonical Evidence: 557
canonical Market Access Records: 4
canonical deployments: 174
```

## 6. Completion boundary

```text
canonical assets: 112
canonical Evidence: 557
canonical Market Access Records: 8
canonical deployments: 174
```

## 7. Boundaries

PR #359 must not:

```text
add a canonical stable asset
add a duplicate Evidence identity
promote JPYSC Market Access rows
promote issuer mint or redemption rows
claim universal Japan-wide RLUSD availability
claim SBI VC Trade RLUSD support outside Ethereum
add a public product surface
change Comparison Readiness or Facet Freshness semantics
rank assets
create a composite score
automatically promote monitoring or editorial research
```

## 8. Completion and handoff

After PR #359 merges:

```text
PR #360 Evidence and Correction Batch: active
REVIEW GATE: next
```
