# Stable or Gone Roadmap

Updated: 2026-08-12  
Status: Evidence Archive Payload Verification Batch 2 exact archive implementation authorized

## Current canonical checkpoint after bounded implementation

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
Archive recorded: 471
Archive not recorded: 114
Detail routes: 422
Metadata-checked routes: 422
Official origin: https://www.stableorgone.com
Last canonical-changing commit before this archive lane: 77e80dd3e2a62fea53ea0eabe91ef78a2d8ab1da
Canonical hash before implementation: sha256:f386c1043ca5e83cafbd88e99746d0609aab0154ed48de1970677758a66ed5fa
Canonical file count before implementation: 466
```

## Completed current-cycle work

```text
PR #523 — JPYSC canonical Market Access implementation
PR #534 — REVIEW_GATE restoration
PR #535/#536 — Japan Market Access Expansion Review Batch 1 — no-go
PR #537/#538/#539 — Evidence Archive Payload Verification Batch 2 research/review lineage
PR #543 — clean Evidence Archive Batch 2 review result
PR #544/#545/#546/#547 — Compare discovery/navigation remediation / closeout
PR #548/#549 — Russia USDT Regulation Guide authority / implementation
PR #550 — Russia Guide closeout and Evidence Archive REVIEW_GATE restoration
```

## Current lane — Evidence Archive Payload Verification Batch 2

The completed review has now been converted into a separate exact implementation authority and the implementation branch contains the bounded eight-archive post-state pending merge and production verification.

```text
stage: IMPLEMENTATION_AUTHORIZED
reviewed: 10
exact dated archive additions authorized: 8
reviewed no-safe-change: 2
field allowed: archived_url only
new Evidence identities: 0
Evidence Relation changes: 0
Market Access changes: 0
Stable asset changes: 0
post-implementation boundary: REVIEW_GATE
```

Authorized Evidence IDs:

```text
sog_src_susd_legacy_context_batch_a
sog_src_susd_rebuilding_2026
sog_src_susd_roadmap_2026
sog_src_susd_sip_status_2026
sog_src_susd_synthetix_docs
sog_src_susd_v3_faq_batch_a
sog_src_terra_docs
sog_src_tether_transparency
```

Explicitly unchanged:

```text
sog_src_susd_sip420_2024
sog_src_susd_sip423_2026
```

Expected bounded archive coverage after the implementation:

```text
Archive recorded: 463 -> 471
Archive not recorded: 122 -> 114
Maximum archive delta: +8 / -8
Evidence: 585 -> 585
Evidence Relations: 585 -> 585
Stable assets: 119 -> 119
Market Access Records: 12 -> 12
```

Each archive URL must exactly match the completed manual payload-review artifact and the current machine-readable implementation authority. No substitute timestamp, normalized URL, source replacement, or additional target is allowed.

## Schedule

```text
2026-08-11  Russia USDT Regulation Guide update — complete
2026-08-12  PR #550 Russia Guide closeout / production verification — complete
2026-08-12  Evidence Archive Batch 2 exact implementation authority — complete
2026-08-12  bounded 8-record archived_url implementation — current PR #552
next         merge, production verification, and REVIEW_GATE restoration
```

Schedule windows are planning targets, not permission boundaries.

## Completed Russia Guide lane

PR #548/#549 completed the three-file Russia/global Guide update. PR #550 closed the lane and main commit `2825eb293f833061deb1ef8bdb628b32a93538cc` completed production run `31509169378` successfully. The Guide lineage authorizes no further material Guide work and created no canonical Market Access or Evidence identity/relation change.

## Market Access v1 boundary

`docs/market-access-record-spec.md` requires asset × jurisdiction × platform/service × function × access state × effective date. This archive implementation authorizes no Market Access change.

## Preserved exclusions

```text
any archived_url outside the exact eight authorized IDs
source URL replacement or normalization
modification of the two reviewed no-safe-change records
new Evidence identities or Evidence Relations
canonical Market Access additions or mutation
stable-asset change
schema/taxonomy change
new public route or unrelated UI/CSS change
ranking / scoring / recommendation
automatic continuation beyond post-implementation REVIEW_GATE
```

Same-count checkpoint/statistics/release-integrity artifacts may be refreshed only when required by the existing deterministic pipeline and only to reflect the bounded eight archive additions.

## Required work-start protocol

Before implementation, read `AGENTS.md`, `docs/spec-governance.md`, this file, `docs/deployment-policy.md`, the Batch 2 implementation authority amendment/spec/config, and the completed Batch 2 review-result package.
