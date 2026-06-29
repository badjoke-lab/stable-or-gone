# Stable or Gone regulatory-source monitoring boundary

Status: canonical specification  
Updated: 2026-06-29  
Roadmap item: PR #244

## Purpose

PR #244 defines the review-only boundary for regulator and government sources. It adds official pages covering enforcement, filed charges, consumer notices, supervisory actions, and product authorizations.

A regulator page is not a shortcut to a canonical conclusion. Filed charges are not a final judgment. A consumer notice is not always a final order. Product authorization is not a safety score. A jurisdiction-specific action is not a global stablecoin status.

## Added sources

```text
cftc-tether-2021-order
sec-terraform-ust-2023-charges
nydfs-paxos-busd-notice
nydfs-gusd-product-approval
nydfs-pax-usdp-product-approval
```

Review record:

```text
scripts/monitoring/sources/regulatory-source-review-pr244.json
```

The review stores authority, jurisdiction, official URL, final host, regulatory classification, canonical targets, visible terms, and decisions. It stores no raw response body or normalized page text.

## Signal scope

PR #244 introduces:

```text
regulatory_update
```

Approved keywords include order, charges, complaint, settlement, notice, approval, authorization, enforcement, penalty, fines, cease minting, supervision, restriction, and requirements.

A match creates only a private review prompt after baseline comparison. It does not change canonical status, confidence, redemption, reserve, lifecycle, or regulatory-note data.

## Regulatory classifications

```text
final_order_or_settlement
charges_or_complaint
consumer_notice_and_supervisory_action
product_authorization
```

Each value describes the procedural shape of the reviewed page only. Later outcomes require separate source review.

## Interpretation boundary

```text
charges_or_complaint_are_not_final_judgment: true
notice_is_not_always_final_order: true
product_authorization_is_not_safety_score: true
jurisdiction_scope_is_not_global_asset_status: true
issuer_enforcement_is_not_automatic_asset_failure: true
regulatory_source_does_not_override_canonical_review: true
```

## Duplicate-URL boundary

The NYDFS product-approval page covers both Gemini Dollar and Paxos Standard. SOG registers two source identities with the same official URL because each has one exact stablecoin-to-organization target pair. This prevents incorrect cross-issuer relationships.

## Source requirements

Every PR #244 source must use HTTPS, remain on an allowlisted official authority host, record authority and jurisdiction, target existing canonical IDs through an exact relationship, use only `regulatory_update`, use an approved classification, contain reviewed terms, and receive one matching `pending_initial_acceptance` baseline.

## Baseline boundary

No live response digest is committed in PR #244. Every accepted baseline field remains null.

## Prior-source preservation

All nineteen sources present after PR #243 must remain enabled with matching pending baselines.

## Deterministic validation

CI must prove:

- exactly five reviewed PR #244 sources are added;
- total configured sources and baselines equal 24;
- source and baseline IDs match exactly;
- all nineteen prior source IDs remain present;
- URLs and hosts match the reviewed official allowlist;
- authority and jurisdiction are non-empty;
- canonical targets and exact relationships exist;
- only `regulatory_update` is used;
- only the four approved classifications appear;
- duplicate URL use is limited to the two separately targeted NYDFS approval sources;
- all interpretation boundaries are fixed;
- every new baseline remains pending with null accepted fields;
- canonical stable assets remain 92;
- automatic canonical action, pull requests, public output, and production publication remain prohibited.

## Current-source review limitation

The review is dated 2026-06-29. Later decisions, settlements, appeals, corrections, new orders, or page rewrites require a new observation and human review.

## Deployment classification

```text
No production deployment required
```
