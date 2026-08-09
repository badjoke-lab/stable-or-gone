# Stable or Gone Roadmap

Updated: 2026-08-09  
Status: Evidence Archive Payload Verification Batch 2 candidates fixed; manual payload review active; canonical implementation authority remains REVIEW GATE

## Current reviewed checkpoint

```text
Canonical stable assets: 119
Organizations: 109
Relationships: 131
Events: 194
Evidence: 585
Evidence Relations: 585
Reserve reports: 127
Known unknowns: 352
Regulatory notes: 9
Deployments: 186
Legal profiles: 119
Reserve components: 153
Income profiles: 119
Market Access Records: 12
Archive recorded: 463
Archive not recorded: 122
Detail routes: 422
Metadata-checked routes: 422
Official origin: https://www.stableorgone.com
Review authority entry commit: c9588b092277bd14d87ce9209ba087e4752b3346
Current production commit: dynamic; verify via deploy-production workflow and Issue #479
Last canonical-changing implementation commit: 77e80dd3e2a62fea53ea0eabe91ef78a2d8ab1da
Canonical hash: sha256:f386c1043ca5e83cafbd88e99746d0609aab0154ed48de1970677758a66ed5fa
Canonical file count: 466
Legacy-host 301: complete
```

A fixed production commit in a work-item specification is an immutable entry checkpoint. Current production parity is established dynamically by the production workflow and Issue #479.

## Completed current-cycle work

```text
PR #514 — six-week cycle and Batch 5 authority
PR #515 — candidate audit
PRs #516–#519 — EUB/USB implementation, navigation insertion, and closeout
PRs #520–#522 — JPYSC review and bounded implementation authority
PR #523 — bounded JPYSC Japan Market Access implementation, merged and production-verified
PR #524 — fixed support visual audit
PR #525 — support cleanup
PR #526 — complete Ledger Series footer network
PRs #527–#530 — official-domain migration hardening and completed legacy-host 301
PR #531 — 2026 stablecoin regulation guide cluster and 119-record mark-audit repair
PR #532 — post-PR #531 authority and schedule reconciliation
PR #533 — shared Guide readability and research-layout remediation
PR #534 — post-PR #523 production closeout and REVIEW GATE restoration
PR #535 — bounded Japan Market Access Expansion Review Batch 1 authority
PR #536 — Japan Market Access Expansion Review Batch 1 no-go closeout
PR #537 — Evidence Archive Payload Verification Batch 2 review-only authority, merged and production-verified
```

## Active Evidence Archive Payload Verification Batch 2 review

PR #537 opened a review-only lane. The deterministic candidate-generation stage is now complete and the exact ten Evidence identities are fixed for manual payload review.

```text
candidate universe: current canonical Evidence with archive not recorded
Evidence: 585
archive recorded: 463
archive not recorded: 122
eligible after current exclusions: 68
Batch 2 selected: 10
selection bucket: official_issuer_protocol_product
canonical archive additions authorized in review lane: 0
```

Fixed candidate set:

```text
sog_src_susd_legacy_context_batch_a
sog_src_susd_rebuilding_2026
sog_src_susd_roadmap_2026
sog_src_susd_sip_status_2026
sog_src_susd_sip420_2024
sog_src_susd_sip423_2026
sog_src_susd_synthetix_docs
sog_src_susd_v3_faq_batch_a
sog_src_terra_docs
sog_src_tether_transparency
```

The generator reapplies Queue v7 semantics to current canonical data: valid reactivation tier first, then regulator/court/legal, official issuer/protocol/product, reserve/attestation/audit, high-quality reporting/research, other reviewed source, with Evidence ID as deterministic tie-breaker. Alias identities, Wayback source URLs, missing source URLs, review-history suppression, and all ten Batch 1 reviewed identities remain excluded. Only three Batch 1 identities are still present in the current unarchived input because seven received reviewed archive additions in Batch 1.

Each selected candidate now requires exact-source and dated-Wayback payload review. Redirect-only responses, CDX metadata only, replacement targets, or payloads whose claim scope cannot be independently verified are insufficient. Valid review dispositions are `dated_exact_archive_proposal` or `reviewed_no_safe_change`.

If review identifies exact dated archive URLs suitable for promotion, a separately reviewed and merged implementation authority must bind those exact Evidence IDs and URLs before canonical data changes.

## Market Access Expansion Review Batch 1 result

```text
RLUSD × SBI VC Trade / BITPOINT — no-go
USDC × SBI VC Trade / BITPOINT — no-go
JPYSC × SBI VC Trade / BITPOINT — no-go
promotable pairs: 0
promotable Market Access Records: 0
Market Access Records: 12 -> 12
Evidence: 585 -> 585
Evidence Relations: 585 -> 585
```

The reviewed FSA register dated 2026-06-24 listed one electronic-payment-instrument service provider, SBI VC Trade Co., Ltd., and handled instruments USDC, RLUSD, and JPYSC. No provider/function-level evidence supported a new canonical promotion.

## Current boundary

```text
Current implementation authority: REVIEW GATE
Current active review authority: Evidence Archive Payload Verification Batch 2
Current review stage: MANUAL_PAYLOAD_REVIEW
Canonical promotion authorized: no
```

## Schedule

```text
2026-08-08 to 2026-08-09  authority/specification/schedule reconciliation — complete
2026-08-08 to 2026-08-09  Guide & Research Surface Readability Remediation — complete through PR #533
2026-08-09                 PR #523 reconciliation, validation, merge, and production verification — complete
2026-08-09                 post-PR #523 production closeout — complete through PR #534
2026-08-09                 Japan Market Access Expansion Review Batch 1 — complete no-go
2026-08-09                 Evidence Archive Payload Verification Batch 2 review authority — complete through PR #537
2026-08-09                 Batch 2 deterministic candidate selection — complete; manual payload review follows
2026-08-10 to 2026-08-16  stabilization and Batch 2 payload review preparation/review
2026-08-17 to 2026-08-23  Evidence Archive Payload Verification Batch 2 implementation window — only if separately authorized
2026-08-24 to 2026-08-30  Tier A Dossier Deepening Batch 4 — separate authority required
2026-08-31 to 2026-09-06  cycle review and backlog reconciliation
2026-09-07 to 2026-09-13  next operating authority and contingency
```

Schedule windows are planning targets, not permission boundaries.

## PR #523 historical result

```text
asset: sog_st_jpysc
jurisdiction: JP / Japan
provider: SBI VC Trade / VCTRADE
effective from: 2026-06-24
observed at: 2026-08-05
buy_sell: account_internal_only
deposit: unavailable
withdrawal: unavailable
external_wallet_transfer: unavailable
Evidence: 584 -> 585
Evidence Relations: 584 -> 585
Market Access Records: 8 -> 12
Archive recorded: 462 -> 463
Detail routes: 422 -> 422
```

## Guides / editorial

The 2026 regulation guide cluster and shared Guide/readability remediation are complete for the current content phase. Guide content is maintenance-only unless a material regulatory change, correction/source update, or justified search/content gap requires new work.

## Preserved exclusions

```text
future capability represented as current access
lending represented as transfer evidence
country-wide availability inference
negative inference from missing product-list entries
cross-service copying of VCTRADE restrictions to BITPOINT
unbounded Evidence additions
unsupported archive promotion
redirect/CDX-only archive promotion
ranking, score, recommendation, or implied safety
automatic promotion
silent continuation from a planning window
canonical implementation beyond REVIEW GATE without separate authority
known visual defect accepted merely because CI is green
```

## Required work-start protocol

Every substantive continuation must begin by reading the merged current versions of:

```text
AGENTS.md
docs/spec-governance.md
docs/roadmap.md
docs/deployment-policy.md
docs/roadmap-amendments/2026-08-09-evidence-archive-payload-verification-batch-2-review-authority.md
docs/roadmap-amendments/2026-08-09-evidence-archive-payload-verification-batch-2-candidates.md
docs/quality/evidence-archive-payload-verification-batch-2-review-authority-spec.md
docs/quality/evidence-archive-payload-verification-batch-2-candidate-spec.md
config/evidence-archive-payload-verification-batch-2-review-authority.json
data/editorial-research/evidence-archive-payload-verification-batch-2-candidates-2026-08-09.json
current named inputs, source reviews, audits, validators, and prior outputs
```

If authority, counts, schedule, deployment behavior, or a blocking visual conclusion changes, update governing documents before implementation continues.
