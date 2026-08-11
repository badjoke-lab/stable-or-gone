# Stable or Gone Specification Governance

Status: canonical governance specification  
Updated: 2026-08-11

## 1. Authority rule

Merged repository specifications are the source of truth. Chat memory, handoff prose, issue discussion, stale branch state, generated reports, and unmerged drafts do not override merged repository authority.

Authority order:

1. `docs/deployment-policy.md`
2. `docs/spec-governance.md`
3. `docs/roadmap.md`
4. current merged roadmap amendment
5. current work-item specification / machine-readable contract
6. enduring regression authorities
7. named audits, baselines, queues, and reviewed prior outputs
8. conversation history and unmerged drafts

Current closeout contract:

```text
docs/roadmap-amendments/2026-08-11-post-pr546-compare-discovery-closeout.md
docs/quality/post-pr546-compare-discovery-closeout-spec.md
config/post-pr546-compare-discovery-closeout.json
```

Current canonical work boundary:

```text
docs/roadmap-amendments/2026-08-10-evidence-archive-payload-verification-batch-2-review-result.md
docs/quality/evidence-archive-payload-verification-batch-2-review-result-spec.md
data/editorial-research/evidence-archive-payload-verification-batch-2-review-2026-08-09.json
stage: REVIEW_GATE
```

## 2. Current canonical state

```text
Stable assets: 119
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
Official public origin: https://www.stableorgone.com
Last canonical-changing commit: 77e80dd3e2a62fea53ea0eabe91ef78a2d8ab1da
Canonical hash: sha256:f386c1043ca5e83cafbd88e99746d0609aab0154ed48de1970677758a66ed5fa
Canonical file count: 466
```

There is no active canonical-record implementation authority. Canonical work remains at `REVIEW_GATE`.

## 3. Stablecoin Compare Discovery and Navigation Remediation — complete

PR #544 authorized the bounded remediation. PR #545 supplied the primary implementation, but direct review of its visual artifact found a blocking Compare dock/footer overlap. PR #546 supplied the bounded visual fix and final regression proof.

```text
Authority PR: #544
Primary implementation PR: #545
Blocking visual fix PR: #546
Final main merge: f8ceedd55b0cc764a2bbc2747bd50f061f288b24
Final visual exact head: 02774d7e9f35abf7c11bbbcb2e39cb6b62172cd7
Final visual acceptance run: 31498394285 — success
Direct changed-state artifact review: passed
Final production run: 31498949423 — success
Canonical delta: 0
```

Accepted product behavior:

```text
comparison panel before public-register results
fixed Compare dock while browsing register after selection
dock hidden while comparison is in view
dock hidden outside register browsing scope
dock hidden whenever footer enters viewport
desktop/mobile dock-footer non-overlap explicitly verified
selected count and identities visible in dock
immediate View comparison navigation + focus
in-panel Add / replace record control
remove then replace without register scroll round trip
2 / 3 / 4 aligned matrix preserved
Differences only preserved
shared URL restore preserved
Unknown / Not recorded preserved
fifth selection rejected
bounded mobile matrix overflow
```

The PR #544/#545/#546 lineage is closed and authorizes no further material Compare change. `docs/ui-v3-remediation-authority.md` remains the enduring material-public-UI regression contract. Automated success cannot override a known visual defect.

The old unmerged `agent/post-pr545-compare-discovery-closeout` branch is stale and has no authority.

## 4. Evidence Archive Payload Verification Batch 2 — review complete / current boundary

The exact ten PR #538 candidates completed manual payload review under the PR #537 contract and were cleanly recorded by PR #543.

```text
reviewed: 10
dated exact archive proposals: 8
reviewed no safe change: 2
canonical changes authorized: 0
current boundary: REVIEW_GATE
```

Accepted proposal IDs:

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

No-safe-change IDs:

```text
sog_src_susd_sip420_2024
sog_src_susd_sip423_2026
```

Any archive promotion requires a separate reviewed and merged implementation authority binding the exact eight IDs and URLs, maximum archive deltas `+8/-8`, unchanged Evidence/Evidence Relation counts, validators, and production verification.

## 5. Compare history

PR #540/#541 completed the first aligned matrix repair. Merge `539a27fd5854a1c2544f4653a2161be36860a002`; production run `31326135906` and visual run `31325811381` succeeded.

PR #544/#545 repaired discovery, placement, persistent navigation, and candidate switching. PR #546 then fixed the remaining blocking footer overlap found by direct artifact review. Final accepted main is `f8ceedd55b0cc764a2bbc2747bd50f061f288b24`, with exact-head visual run `31498394285` and production run `31498949423`.

## 6. Current sequence

```text
PR #523 — last canonical-changing implementation — complete
PR #534 — REVIEW_GATE restoration — complete
PR #535/#536 — Japan Market Access review — complete no-go
PR #537/#538/#539 — Evidence Archive Batch 2 research lineage — complete
PR #540/#541 — first Compare matrix remediation — complete
PR #542 — first Compare closeout — complete
PR #543 — clean Evidence Archive Batch 2 review-result landing — complete
PR #544/#545 — Compare discovery/navigation authority + primary implementation — complete
PR #546 — blocking footer-overlap fix + final visual closure — complete / production verified
current — Evidence Archive Payload Verification Batch 2 REVIEW_GATE
next canonical implementation — separate authority required
```

## 7. Canonical/public safety

```text
canonical_only = true
includes_unreviewed_candidates = false
includes_internal_monitoring = false
canonical implementation authority = REVIEW_GATE
canonical archive additions authorized = 0
```

No review artifact is public canonical output.

## 8. Historical anchors

Preserve at minimum:

```text
PR #493
PR #500
PR #517
PR #522
PR #523
PR #537
PR #538
PR #540
PR #541
PR #542
PR #543
PR #544
PR #545
PR #546
```

## 9. Mandatory reading

Before further work, read `AGENTS.md`, this file, `docs/roadmap.md`, `docs/deployment-policy.md`, the post-PR #546 Compare closeout amendment/spec/config, `docs/ui-v3-remediation-authority.md`, and the completed Batch 2 review-result amendment/spec/artifact.

## 10. Exit

The temporary Compare discovery/navigation authority is closed. The repository is at Evidence Archive Payload Verification Batch 2 `REVIEW_GATE`. No automatic canonical continuation or further material Compare change is authorized.
