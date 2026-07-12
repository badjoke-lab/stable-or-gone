# PR #356 Market Access Pilot 1 Specification

Status: active work-item specification  
Updated: 2026-07-12

## 1. Roadmap item

PR #356 — Market Access Pilot 1.

PR #355 is complete. Its reviewed merged handoff is:

```text
docs/migration/tier-a-batch-2-pr355-reviewed-handoff.json
```

PR #356 is the first bounded canonical promotion under the existing Market Access Record v1 schema and governance contract.

## 2. Purpose

The pilot tests whether SOG can promote a small number of provider-scoped, function-scoped, jurisdiction-scoped and dated access observations without turning market access into a country-wide allowed/banned flag.

The pilot prioritizes evidence quality and reviewability over row count.

## 3. Exact bounded scope

### Jurisdiction

```text
JP — Japan
```

### Asset

```text
sog_st_usdc — USDC
```

### Platform and service

```text
SBI VC Trade
VCTRADE
```

### Source research row

```text
jp_access_usdc_sbivc_2025_03_26
```

### Functions in scope

```text
buy_sell
deposit
withdrawal
external_wallet_transfer
```

### Functions excluded from Pilot 1

```text
direct_issuer_mint
direct_issuer_redemption
```

### Time boundary

```text
effective_from: 2025-03-26
observed_at: 2026-07-10
review_cutoff: 2026-07-10
```

### Maximum canonical rows

```text
4
```

## 4. Evidence standard

Every promoted row must cite at least one canonical `sog_src_` Evidence identity.

Editorial-research URLs are discovery inputs only. They do not become canonical evidence relations merely because they appear in the reviewed research checkpoint.

Before promotion, PR #356 must:

1. match source URLs against all canonical Evidence rows;
2. create or reuse canonical Evidence identities without duplicate canonical URLs;
3. review claim scope separately for every function;
4. record only the access state supported by the reviewed source scope;
5. preserve platform, network, customer, condition and time boundaries.

A licence, register entry, issuer statement, or general product page is not automatically proof of every function.

## 5. Candidate audit stage

The first stage of PR #356 produces a deterministic internal review artifact.

It must report:

```text
selected source research row
selected four functions
source URL inventory
exact canonical Evidence URL matches
unmatched source URLs
claim-scope signals for matched Evidence
candidate access-state mapping
promotion blockers per function
proposed canonical record shape
```

The candidate audit does not change `data/market-access-records-v1.json`.

## 6. Canonical promotion stage

A function may be promoted only after `config/market-access-pilot-1-pr356.json` explicitly names approved canonical Evidence IDs for that function.

Promotion remains manual and reviewed.

The canonical record must conform to:

```text
schemas/market-access-record-v1.schema.json
config/market-access-governance-v1.json
docs/market-access-record-spec.md
```

## 7. Required preservation

PR #356 must preserve:

```text
110 canonical stable assets
PR #353 historical planning snapshots
PR #354 reviewed handoff
PR #355 reviewed handoff
549 pre-pilot Evidence rows until reviewed Evidence additions are explicitly committed
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

## 8. Explicit non-goals

PR #356 does not:

```text
promote RLUSD Market Access rows
promote JPYSC Market Access rows
promote issuer mint or issuer redemption rows
claim universal USDC availability in Japan
claim government guarantee or recommendation
infer illegality or prohibition from absence
add a new page, explorer, dashboard, ranking or navigation family
change stable-asset count
change Compare preset membership
publish raw monitoring or rejected candidates
```

## 9. Validation

The dedicated workflow must validate:

```text
repository authority synchronized to PR #356
exact bounded jurisdiction/asset/platform/function scope
PR #355 handoff identity and merge commit
source research row exists and remains noncanonical
candidate audit is deterministic
canonical Evidence IDs exist before promotion
one function per canonical record
logical uniqueness
schema vocabulary and required fields
maximum four canonical Market Access rows
no unrelated Market Access rows
no public planning artifact leakage
Astro check and site build
```

## 10. Exit criteria

PR #356 completes when:

1. the bounded candidate audit is reviewed;
2. supported source URLs are represented by canonical Evidence identities;
3. approved function-specific Evidence mappings are explicit;
4. no more than four reviewed canonical Market Access Records are promoted;
5. unsupported functions remain absent rather than guessed;
6. canonical/public counts and projections remain internally consistent;
7. dedicated validation and general CI are green;
8. PR #357 Tier A Dossier Deepening — Batch 3 becomes next.
