# 2026-08-09 — Evidence Archive Payload Verification Batch 2 Review Authority

## Decision

The post-Market-Access `REVIEW GATE` is opened only for a bounded Evidence Archive Payload Verification Batch 2 review.

No canonical archive mutation is authorized by this authority.

## Entry checkpoint

- main entry commit: `c9588b092277bd14d87ce9209ba087e4752b3346`
- Evidence: 585
- Evidence Relations: 585
- archive recorded: 463
- archive not recorded: 122
- Market Access Records: 12
- canonical hash: `sha256:f386c1043ca5e83cafbd88e99746d0609aab0154ed48de1970677758a66ed5fa`
- canonical file count: 466

## Review scope

The lane selects exactly 10 current unarchived canonical Evidence identities when at least 10 remain eligible. It reuses Queue v7's deterministic non-ranking priority semantics and excludes all 10 Evidence identities already reviewed in Payload Verification Batch 1.

The selected rows receive manual exact-source and dated-Wayback payload review. Safe review outcomes are `dated_exact_archive_added` as an implementation proposal or `reviewed_no_safe_change`.

## Boundary

The authority permits candidate generation and manual payload review only. It prohibits canonical `archived_url` changes, source URL replacement, new Evidence identities, Evidence Relation changes, canonical asset or Market Access changes, public route changes, material UI changes, automatic promotion, ranking, scoring, and recommendations.

Any canonical archive additions require a separate merged implementation authority binding the exact Evidence IDs and exact dated archive URLs.

Exit boundary: `REVIEW GATE`.
