# PR #356 Market Access Pilot 1 Activation

Status: active roadmap amendment  
Date: 2026-07-12

## 1. Activation

PR #355 Tier A Dossier Deepening — Batch 2 is complete and merged at:

```text
b192c4c920e3a3626d006dd8b80f44e806f40da9
```

Its reviewed handoff is:

```text
docs/migration/tier-a-batch-2-pr355-reviewed-handoff.json
```

The active work item is now:

```text
PR #356 Market Access Pilot 1: active
PR #357 Tier A Dossier Deepening — Batch 3: next
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
config/market-access-pilot-1-pr356.json
docs/quality/market-access-pilot-1-pr356-spec.md
data/editorial-research/japan-stablecoin-market-access-2026.json
docs/migration/tier-a-batch-2-pr355-reviewed-handoff.json
```

## 3. Exact pilot scope

```text
jurisdiction: JP / Japan
asset: USDC / sog_st_usdc
platform: SBI VC Trade
service: VCTRADE
source research row: jp_access_usdc_sbivc_2025_03_26
functions: buy_sell, deposit, withdrawal, external_wallet_transfer
maximum canonical rows: 4
effective_from: 2025-03-26
review_cutoff: 2026-07-10
```

Direct issuer mint and direct issuer redemption are excluded.

RLUSD and JPYSC are excluded from Pilot 1.

## 4. Implementation sequence inside PR #356

```text
1. activate authority and bind scope
2. build deterministic canonical-Evidence match audit
3. review URL identity and function claim scope
4. create or reuse canonical Evidence identities
5. explicitly approve Evidence IDs by function
6. promote only supported function-scoped records
7. validate canonical/public boundaries
```

No step may be skipped by treating the editorial research row as canonical evidence.

## 5. Boundaries

PR #356 must not:

```text
create a Japan-wide allowed/banned flag
automatically promote monitoring or editorial research
promote a function without canonical Evidence support
exceed four canonical Market Access rows
add stable assets
add a new public surface
change Comparison Readiness semantics
change Facet Freshness semantics
rank assets
create a composite score
```

## 6. Completion and handoff

Completion requires a reviewed canonical record set, deterministic validation, green general CI, and a reviewed PR #356 handoff.

After PR #356 merges:

```text
PR #357 Tier A Dossier Deepening — Batch 3: active
PR #358 Record Growth Batch 1: next
```
