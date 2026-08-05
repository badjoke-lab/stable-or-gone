# PR #521 Japan Market Access Pilot 3 — JPYSC Review

Status: reviewed work-item result  
Updated: 2026-08-05

## Purpose

PR #521 reviews the existing private JPYSC Japan access row under PR #520 authority. It changes no canonical data or public output.

## Reviewed target and function state

```text
asset: JPYSC / sog_st_jpysc
jurisdiction: JP / Japan
platform: SBI VC Trade
service: VCTRADE
effective from: 2026-06-24
observed at: 2026-08-05
buy_sell: account_internal_only
deposit: unavailable
withdrawal: unavailable
external_wallet_transfer: unavailable
```

SBI VC Trade supports JPYSC purchase, sale, and conversion inside customer accounts. Current product information does not support deposit or withdrawal, so external-wallet transfer is unavailable.

## Corrected canonical context

`JPYSC` is already canonical. PR #128 added `sog_st_jpysc` in `data/stablecoins-batch-n.json`, along with canonical launch Evidence and a restricted deployment placeholder.

PR #515's deferred candidate row did not mean that the canonical identity was absent. It meant that the duplicate growth proposal was not eligible for another complete-record promotion.

## Eligibility result

```text
eligible_for_later_separate_authority
```

The canonical asset prerequisite is satisfied and the four-function review is complete. PR #520 nevertheless authorized review only and capped PR #521 at zero canonical Market Access and Evidence changes.

PR #521 therefore adds:

```text
canonical stable assets: 0
canonical Evidence identities: 0
canonical Evidence Relations: 0
canonical Market Access Records: 0
public routes: 0
public UI changes: 0
```

The canonical Market Access count remains eight.

## Source and future-capability boundary

Existing canonical Evidence includes:

```text
sog_src_jpysc_launch_sbi_vc_2026
sog_src_jpysc_announcement_sbi_2026
```

The current SBI VC Trade product and trading pages were reviewed privately as of 2026-08-05. A later authority must decide their canonical Evidence identity treatment before implementation.

A network reference, technical-readiness statement, or future public-chain plan does not establish current deposit, withdrawal, or external-wallet-transfer capability. JPYSC lending is outside Market Access Record v1 and cannot be used as transfer evidence.

## Later implementation boundary

A separate authority PR may authorize exactly four provider-scoped JPYSC Market Access records:

```text
buy_sell: account_internal_only
deposit: unavailable
withdrawal: unavailable
external_wallet_transfer: unavailable
```

That authority must define canonical Evidence additions or reuse, deterministic IDs, the Market Access count transition from 8 to 12, validation, production convergence, and REVIEW GATE exit.

## Preserved production baseline

```text
stable assets: 119
organizations: 109
relationships: 131
events: 194
Evidence: 584
Evidence Relations: 584
deployments: 186
Market Access Records: 8
detail routes: 422
metadata-checked routes: 422
```

## Non-goals

PR #521 does not duplicate the JPYSC canonical asset, create canonical Evidence, add Market Access records, infer universal Japan availability, backfill future transfer capability, use lending as transfer evidence, change UI or deployment behavior, or rank or recommend assets.

## Exit

PR #521 exits only to `REVIEW GATE`. The next recommended authority is the bounded JPYSC Market Access Pilot 3 implementation. Evidence Archive Payload Verification Batch 2 remains the later planned cycle lane.
