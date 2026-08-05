# PR #521 Japan Market Access Pilot 3 — JPYSC Review

Status: reviewed work-item result  
Updated: 2026-08-05

## 1. Purpose

PR #521 reviews the existing private JPYSC Japan access row under PR #520 authority. It does not promote a canonical asset, Evidence identity, or Market Access Record.

## 2. Reviewed target

```text
asset: JPYSC / proposed sog_st_jpysc
jurisdiction: JP / Japan
platform: SBI VC Trade
service: VCTRADE
effective from: 2026-06-24
observed at: 2026-08-05
```

## 3. Function result

```text
buy_sell: account_internal_only
deposit: unavailable
withdrawal: unavailable
external_wallet_transfer: unavailable
```

SBI VC Trade supports JPYSC purchase, sale, and conversion inside customer accounts. Current product information does not support JPYSC deposit or withdrawal. The reviewed state therefore does not support external-wallet transfer.

## 4. Future-capability boundary

A network reference, technical readiness statement, or future public-chain plan does not establish current deposit, withdrawal, or external-wallet transfer capability. Future capability must be recorded as a later dated state only after source-backed activation.

JPYSC lending is a separate service family. It is outside Market Access Record v1 and cannot be used as evidence of deposit, withdrawal, or external-wallet transfer availability.

## 5. Canonical eligibility result

The reviewed disposition is:

```text
blocked_canonical_asset_identity_absent
```

Market Access Record v1 requires an existing canonical asset identity. `sog_st_jpysc` is not in the canonical 119-asset registry at this checkpoint.

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

## 6. Reviewed source set

```text
https://www.sbivc.co.jp/newsview/fx4zmjwbl
https://www.sbivc.co.jp/jpysc
https://www.sbivc.co.jp/services/crypto/jpysc
https://www.fsa.go.jp/menkyo/menkyoj/denshikessaisyudan.pdf
https://www.shinseitrust.com/stablecoin/jpysc.html
```

The source set supports the account-internal function matrix, provider scope, issuer, and trust structure. It does not override the missing canonical asset prerequisite.

## 7. Preserved production baseline

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

## 8. Non-goals

PR #521 does not:

```text
create a thin JPYSC canonical record
create canonical Evidence from private source leads
promote unavailable functions merely to record negative rows
infer universal Japan availability
claim government guarantee, recommendation, or safety
backfill future public-chain capability
use lending as transfer evidence
substitute another asset
change UI, navigation, schema, deployment, or redirect behavior
rank, score, or recommend
```

## 9. Later promotion boundary

A later JPYSC promotion would require all of the following through separate reviewed authority:

1. a complete canonical asset review;
2. an approved canonical JPYSC identity;
3. sufficient canonical Evidence scope for each function;
4. a fresh current-state review;
5. a separate Market Access promotion decision.

PR #521 provides none of those later authorities.

## 10. Validation

The dedicated validator must verify the exact four-function matrix, the canonical-asset blocker, zero canonical changes, unchanged counts, source coverage, duplicate review, exclusion of lending, preservation of future-state semantics, and `REVIEW GATE` exit.

## 11. Exit

PR #521 exits only to `REVIEW GATE`. Evidence Archive Payload Verification Batch 2 remains planned but is not implementation-authorized.
