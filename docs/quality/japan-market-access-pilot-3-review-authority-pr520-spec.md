# PR #520 Japan Market Access Pilot 3 Review Authority

Status: active authority specification  
Updated: 2026-08-05

## 1. Purpose

PR #520 authorizes exactly one review-only continuation: PR #521 may review whether the existing private JPYSC Japan access row is eligible for canonical Market Access Record v1 promotion.

PR #520 changes authority only. It adds no canonical asset, Evidence identity, Market Access record, public route, UI, ranking, score, recommendation, or deployment behavior.

## 2. Production baseline

```text
source commit: 0648272f4271e68deac0a9603d77392eb7b63a3f
public origin: https://www.stableorgone.com
canonical hash: sha256:57749955faa96d2bd836bac83ef41a0c5dc13f2342763dc4d975c588cd50c650
convergence attempt: 1
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

## 3. Exact target

```text
research record: jp_access_jpysc_sbivc_2026_06_24
candidate: sog_cand_pr515_jpysc
proposed asset identity: sog_st_jpysc
jurisdiction: JP / Japan
platform: SBI VC Trade
service: VCTRADE
effective from: 2026-06-24
review cutoff: 2026-08-05
functions: buy_sell, deposit, withdrawal, external_wallet_transfer
```

No replacement asset, provider, service, jurisdiction, function family, or candidate is allowed.

## 4. Entry blocker

Market Access Record v1 requires an existing canonical asset identity before promotion.

At PR #520 entry, `sog_st_jpysc` is not a canonical stable asset. PR #515 deferred JPYSC because the reviewed product remained account-internal and did not establish a public-chain token identity or complete terms.

Therefore PR #521 is review-only and may add zero canonical Market Access records. A later promotion requires a separate authority PR after the canonical-asset prerequisite and Evidence scope are independently satisfied.

## 5. Reviewed current source boundary

PR #521 must freshly review only primary sources within the exact target scope, including:

```text
SBI VC Trade dated JPYSC launch notice
SBI VC Trade current JPYSC product page
SBI VC Trade current JPYSC trading page
JFSA electronic payment instrument provider register
SBI Shinsei Trust & Banking JPYSC issuer page
```

The review must distinguish current capability from future capability. A statement that public-chain circulation is planned does not establish current deposit, withdrawal, or external-wallet transfer availability.

## 6. Function mapping to review

PR #521 must verify the source-supported state of:

```text
buy_sell
deposit
withdrawal
external_wallet_transfer
```

The review must preserve account-internal scope, platform/service scope, effective date, observed date, and any current unavailability.

Direct issuer mint and direct issuer redemption remain excluded. JPYSC lending is outside Market Access Record v1 and must not be promoted or used to infer transfer availability.

## 7. Allowed PR #521 outputs

PR #521 may:

```text
update the private editorial research checkpoint
add a reviewed Pilot 3 decision artifact
add source-coverage and duplicate-review artifacts
add dedicated validation
update authority and roadmap documentation
```

PR #521 may not:

```text
add or modify canonical stable assets
add or modify canonical Market Access records
add a canonical Evidence identity
change Evidence Relations
change deterministic canonical counts
change public routes, navigation, UI, or machine-readable schema
change the official origin or legacy redirect
rank, score, recommend, or imply safety
```

## 8. Required decision

PR #521 must return one explicit reviewed disposition:

```text
blocked_canonical_asset_identity_absent
blocked_evidence_scope_incomplete
blocked_current_source_conflict
eligible_for_later_separate_authority
```

Even an `eligible_for_later_separate_authority` result does not authorize promotion in PR #521.

## 9. Validation

The dedicated validator must verify:

```text
repository authority synchronized to PR #520
PR #521 is the only authorized continuation
exact JPYSC / Japan / SBI VC Trade / VCTRADE target
exact four-function review scope
production baseline and canonical counts unchanged
canonical JPYSC identity absent at authority entry
Market Access Record v1 canonical-asset prerequisite retained
maximum new Market Access records in PR #521 equals zero
no new canonical asset or Evidence identity authorized
no lending, ranking, score, recommendation, UI, or redirect work authorized
required exit after PR #521 is REVIEW GATE
```

## 10. Exit

PR #520 exits to PR #521 only. PR #521 exits only to `REVIEW GATE`.
