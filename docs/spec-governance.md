# Stable or Gone Specification Governance

Status: canonical governance specification  
Updated: 2026-08-10

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

Current UI authority:

```text
docs/roadmap-amendments/2026-08-10-stablecoin-compare-discovery-navigation-remediation.md
docs/quality/stablecoin-compare-discovery-navigation-remediation-spec.md
config/stablecoin-compare-discovery-navigation-authority.json
```

Preserved Evidence Archive result authority:

```text
docs/roadmap-amendments/2026-08-10-evidence-archive-payload-verification-batch-2-review-result.md
docs/quality/evidence-archive-payload-verification-batch-2-review-result-spec.md
data/editorial-research/evidence-archive-payload-verification-batch-2-review-2026-08-09.json
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

## 3. Current material UI authority

The Stablecoin Compare Discovery and Navigation Remediation is an authorized bounded interruption limited to `/stablecoins/` Compare interaction. It exists because direct production review found a known visual/interaction defect after the first Compare matrix repair: the matrix is placed after the full register and pagination, has no persistent discovery affordance after selection, and forces a register-to-comparison scroll round trip when candidates change.

Required outcome:

```text
comparison panel before public-register results
persistent Compare dock after first selection
selected count and selected identities in dock
explicit View comparison action
in-panel Add / replace record control
remove then replace without register scroll
2 / 3 / 4 matrix preserved
Differences only preserved
shared URL restore preserved
Unknown / Not recorded preserved
canonical delta 0
```

The archived `docs/ui-v3-remediation-authority.md` regression contract remains binding. Automated success cannot override a known visual defect.

## 4. Evidence Archive Payload Verification Batch 2 — preserved review complete

The exact ten PR #538 candidates completed manual payload review under the PR #537 contract and were cleanly recorded by PR #543.

```text
reviewed: 10
dated exact archive proposals: 8
reviewed no safe change: 2
canonical changes authorized: 0
preserved boundary: REVIEW_GATE
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

No archive URL may change under the UI authority. Any archive promotion requires a separate reviewed and merged implementation authority binding the exact eight IDs and URLs, maximum archive deltas `+8/-8`, unchanged Evidence/Evidence Relation counts, validators, and production verification.

## 5. Previous Compare remediation

PR #540/#541 completed the aligned matrix repair. Merge `539a27fd5854a1c2544f4653a2161be36860a002`; production run `31326135906` and exact-head visual run `31325811381` succeeded. The current authority does not replace those matrix semantics; it repairs discovery, placement, and candidate switching around them.

## 6. Current sequence

```text
PR #523 — last canonical-changing implementation — complete
PR #534 — REVIEW_GATE restoration — complete
PR #535/#536 — Japan Market Access review — complete no-go
PR #537/#538/#539 — Evidence Archive Batch 2 review lineage — complete research
PR #540/#541 — first Compare matrix remediation — complete
PR #542 — first Compare closeout — complete
PR #543 — clean Evidence Archive Batch 2 review-result landing — complete
current — Stablecoin Compare Discovery and Navigation Remediation authority
next — bounded /stablecoins/ UI implementation
then — production verification and UI closeout
exit — preserved Evidence Archive REVIEW_GATE
```

## 7. Canonical/public safety

```text
canonical_only = true
includes_unreviewed_candidates = false
includes_internal_monitoring = false
canonical implementation authority = REVIEW_GATE
UI authority canonical delta = 0
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
```

## 9. Mandatory reading

Before further work, read `AGENTS.md`, this file, `docs/roadmap.md`, `docs/deployment-policy.md`, the current Compare discovery/navigation amendment/spec/config, and `docs/ui-v3-remediation-authority.md`. When preserving the data lane, also read the completed Batch 2 review-result amendment/spec/artifact and PR #537/#538 history.

## 10. Exit

After exact-head visual acceptance and production verification of the bounded Compare discovery/navigation implementation, this temporary UI authority closes and control returns to the preserved Evidence Archive `REVIEW_GATE`. No automatic canonical continuation is authorized.
