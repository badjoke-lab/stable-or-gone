# Stable or Gone Agent Instructions

This file is the mandatory entry point for humans, AI agents, and automation working in this repository.

## Current authority

```text
Repository state: Stablecoin Compare Discovery and Navigation Remediation complete
Current stage: REVIEW_GATE
Current closeout contract: config/post-pr546-compare-discovery-closeout.json
Current canonical work boundary: Evidence Archive Payload Verification Batch 2
Canonical implementation authority: REVIEW_GATE
Canonical archive additions authorized: 0
Evidence Archive review: 10 reviewed / 8 proposals / 2 no-safe-change
Compare authority PR: #544 — complete
Compare primary implementation PR: #545 — complete
Compare blocking visual fix PR: #546 — complete
Final Compare main merge: f8ceedd55b0cc764a2bbc2747bd50f061f288b24
Final Compare visual acceptance run: 31498394285 — success
Final Compare production run: 31498949423 — success
Current canonical checkpoint: sog_jpysc_market_access_pilot_3_canonical_119_checkpoint_pr523_2026_08_05
Current production commit: dynamic; verify via deploy-production workflow and Issue #479
Last canonical-changing implementation commit: 77e80dd3e2a62fea53ea0eabe91ef78a2d8ab1da
Canonical hash: sha256:f386c1043ca5e83cafbd88e99746d0609aab0154ed48de1970677758a66ed5fa
Canonical file count: 466
Official public origin: https://www.stableorgone.com
```

The Stablecoin Compare Discovery and Navigation Remediation is complete and production-verified only after the PR #546 footer-overlap fix. PR #545 supplied the primary interaction repair, but direct review of its exact-head artifact found a blocking fixed-dock/footer overlap. PR #546 added the missing footer visibility guard and exact desktop/mobile non-overlap regression coverage without canonical changes.

The accepted result places the comparison panel before public-register results; keeps a fixed Compare dock discoverable while the register is being browsed after selection; hides the dock while the comparison is visible, outside register browsing scope, or whenever `.site-footer` enters the viewport; returns immediately to the comparison via `View comparison`; and keeps `Add / replace record` inside the comparison area. The 2–4 matrix, `Differences only`, shared URL restoration, explicit `Unknown` / `Not recorded`, fifth-selection rejection, and bounded mobile matrix scrolling remain intact.

The final exact-head visual run `31498394285` at `02774d7e9f35abf7c11bbbcb2e39cb6b62172cd7` succeeded. Artifact `9103989619` passed direct review, including desktop/mobile footer-transition screenshots. Final production run `31498949423` succeeded for main `f8ceedd55b0cc764a2bbc2747bd50f061f288b24` through Cloudflare Pages upload, deployed-production verification, and Issue #479 reporting.

PR #544/#545/#546 are completed historical UI authority/implementation/fix lineage, not continuing authority. The old unmerged `agent/post-pr545-compare-discovery-closeout` branch is stale and must not be treated as authority.

The current canonical work boundary is the Evidence Archive Payload Verification Batch 2 clean review result recorded by PR #543: ten reviewed, eight dated exact archive proposals, two no-safe-change, zero canonical archive promotions authorized. Any archive implementation requires a separate reviewed and merged implementation authority.

## Current reviewed canonical counts

```text
Canonical stable assets: 119
Organizations: 109
Relationships: 131
Events: 194
Canonical Evidence: 585
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
```

## Historical authority anchors

```text
PR #493 — official-domain migration and production verification
PR #500 — bounded MNEE Evidence and Archive Maintenance checkpoint
PR #517 — Bison Bank EUB/USB complete-record growth checkpoint
PR #522 — semantic authority for PR #523
PR #523 — last canonical-changing implementation
PR #534 — REVIEW_GATE restoration
PR #535/#536 — Japan Market Access Expansion Review Batch 1
PR #537 — Evidence Archive Payload Verification Batch 2 review authority
PR #538 — deterministic Batch 2 candidate set
PR #539 — manual network/payload research lineage
PR #540/#541 — first Stablecoin Compare matrix remediation
PR #542 — first Compare closeout and Evidence review restoration
PR #543 — clean Evidence Archive Batch 2 review-result landing
PR #544 — Compare discovery/navigation remediation authority
PR #545 — Compare discovery/navigation primary implementation
PR #546 — blocking Compare dock/footer overlap fix and final visual closure
```

Merged repository authority outranks chat memory, handoff prose, issue discussion, stale branch state, generated reports, and unmerged drafts.

## Mandatory reading order

Before substantive continuation, read:

1. `AGENTS.md`
2. `docs/spec-governance.md`
3. `docs/roadmap.md`
4. `docs/deployment-policy.md`
5. `docs/roadmap-amendments/2026-08-11-post-pr546-compare-discovery-closeout.md`
6. `docs/quality/post-pr546-compare-discovery-closeout-spec.md`
7. `config/post-pr546-compare-discovery-closeout.json`
8. `docs/roadmap-amendments/2026-08-10-evidence-archive-payload-verification-batch-2-review-result.md`
9. `docs/quality/evidence-archive-payload-verification-batch-2-review-result-spec.md`
10. `data/editorial-research/evidence-archive-payload-verification-batch-2-review-2026-08-09.json`
11. `docs/ui-v3-remediation-authority.md`

## Completed Compare discovery/navigation result

```text
route: /stablecoins/
comparison panel: before register results
selection ready: 2
selection maximum: 4
register-browsing Compare dock: fixed after first selection
matrix-visible state: dock hidden
outside-register state: dock hidden
footer-visible state: dock hidden
footer overlap: desktop/mobile regression verified false
View comparison: immediate navigation + focus
candidate replacement: in comparison panel
remove then replace: no register round trip
visual acceptance exact head: 02774d7e9f35abf7c11bbbcb2e39cb6b62172cd7
visual acceptance run: 31498394285 success
production main: f8ceedd55b0cc764a2bbc2747bd50f061f288b24
production run: 31498949423 success
canonical delta: 0
```

## Current boundary

```text
Evidence Archive Payload Verification Batch 2
reviewed: 10
proposals: 8
no safe change: 2
stage: REVIEW_GATE
canonical archive additions authorized: 0
```

Do not write any proposed archive URL into canonical Evidence from the review result alone. Do not continue Compare material changes under PR #544/#545/#546 authority. Any canonical archive implementation or later material UI change requires its own reviewed and merged authority.

`docs/ui-v3-remediation-authority.md` remains the enduring material-public-UI regression authority.

Issue #479 remains the deployment-history authority.
