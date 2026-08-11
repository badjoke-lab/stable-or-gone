# Evidence Archive Payload Verification Batch 2 Implementation Authority Specification

Status: active authority specification  
Recorded: 2026-08-12

## Goal

Permit one implementation PR to add only the eight exact dated `archived_url` values already accepted by the completed Batch 2 payload review.

## Binding source

`data/editorial-research/evidence-archive-payload-verification-batch-2-review-2026-08-09.json` is the review-result authority for identity, source file, canonical URL, dated capture, archived URL proposal, payload status, payload digest, and review disposition.

The implementation must reproduce all eight `dated_exact_archive_proposal` rows exactly. It must not alter either `reviewed_no_safe_change` row.

## Exact implementation boundary

```text
records authorized: 8
field authorized: archived_url only
new Evidence identities: 0
Evidence Relation changes: 0
source URL changes: 0
stable-asset changes: 0
Market Access changes: 0
schema/taxonomy changes: 0
material UI/public route changes: 0
```

The eight Evidence IDs and archive URLs are bound in `config/evidence-archive-payload-verification-batch-2-implementation-authority.json`.

## Count boundary

```text
Evidence: 585 -> 585
Evidence Relations: 585 -> 585
Stable assets: 119 -> 119
Market Access Records: 12 -> 12
Archive recorded: 463 -> 471 maximum
Archive not recorded: 122 -> 114 minimum
Maximum archive delta: +8 / -8
```

The expected implementation is exactly eight additions because the eight reviewed records are currently archive-not-recorded. Any smaller delta requires an explicit explanation and must not silently substitute another target. Any larger delta fails.

## Same-count supporting artifacts

If the existing validation pipeline requires checkpoint, archive coverage, immutable statistics history, release-integrity baseline, or analogous same-count derived artifacts to change, those changes are allowed only when they are deterministic consequences of these eight exact archive additions. They may not change Evidence identity counts, Evidence Relations, assets, Market Access, routes, or unrelated values.

## Prohibited

- modifying `url`, title, source type, publisher, reliability, claim scope, notes, or record identity;
- adding archive URLs to any Evidence ID outside the eight bound targets;
- modifying `sog_src_susd_sip420_2024` or `sog_src_susd_sip423_2026`;
- source normalization or trailing-slash correction;
- new Wayback discovery or replacement selection inside the implementation PR;
- automatic promotion of another candidate;
- public Guide/UI/CSS work;
- ranking, scoring, recommendation, or investment framing.

## Required validation

The authority validator must prove:

1. the completed review artifact still has 10 decisions / 8 proposals / 2 no-safe-change;
2. every authorized ID/URL pair exactly matches the review artifact;
3. every authorized target is currently missing `archived_url` in canonical Evidence;
4. the two no-safe-change targets are not authorized;
5. canonical pre-implementation counts remain 119 assets / 585 Evidence / 585 Relations / 12 Market Access / 463 recorded / 122 not recorded;
6. the active workstream points to this authority;
7. the implementation exit is `REVIEW_GATE` and no automatic continuation exists.

## Exit

One bounded implementation PR, then production verification, then `REVIEW_GATE`.
