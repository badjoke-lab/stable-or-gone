# Post-PR #546 Compare Discovery and Navigation Closeout — 2026-08-11

Status: Compare discovery/navigation remediation complete; Evidence Archive Payload Verification Batch 2 restored to `REVIEW_GATE`.

## Completed UI lane

The bounded authority opened by PR #544 is complete only after the PR #546 footer-overlap correction and its new production verification.

```text
Authority PR: #544
Primary implementation PR: #545
Blocking visual fix PR: #546
Final main merge: f8ceedd55b0cc764a2bbc2747bd50f061f288b24
Visual acceptance exact head: 02774d7e9f35abf7c11bbbcb2e39cb6b62172cd7
Visual acceptance run: 31498394285 — success
Visual artifact: 9103989619
Visual artifact digest: sha256:12d8bf30712114fcfa406bdfa64de5e126cae9723b6da09686e989b559ebcc86
Direct changed-state artifact review: passed
Production deploy run: 31498949423 — success
Deployment history: Issue #479 reporting step — success
Public route: /stablecoins/
Canonical delta: 0
```

The accepted production-visible result places comparison before the register, keeps a fixed Compare dock visible while users browse the register after selecting records, hides the dock while the comparison itself is visible or register browsing scope is left, and now also hides the dock as soon as the site footer enters the viewport.

The exact-head visual audit explicitly verifies both desktop and mobile footer-transition states with the footer and register simultaneously visible. In each case the dock is hidden and its rectangle does not intersect the footer. Direct review of `desktop-two-selected-footer-guard.png` and `mobile-two-selected-footer-guard.png` confirmed the changed visual state.

`View comparison` still returns immediately to the comparison heading/focus. `Add / replace record` remains inside the comparison area, and remove → replace requires no register round trip. The existing 2–4 record aligned matrix, `Differences only`, shared URL restoration, explicit `Unknown` / `Not recorded`, fifth-selection rejection, and bounded mobile matrix scrolling remain preserved.

The old unmerged `agent/post-pr545-compare-discovery-closeout` branch is not authority and its PR #545-era hardcoded visual/production proofs are superseded by this closeout.

## Restored data boundary

The Evidence Archive Payload Verification Batch 2 clean review result from PR #543 is again the current canonical work boundary:

```text
reviewed: 10
dated exact archive proposals: 8
reviewed no safe change: 2
canonical archive additions authorized: 0
current stage: REVIEW_GATE
```

No dated archive proposal may be promoted from the review result alone. Any canonical archive implementation requires a separate reviewed and merged implementation authority binding the exact proposal set and allowed deltas.

## Closeout rule

PR #544/#545/#546 are completed historical UI authority/implementation/fix lineage, not continuing authority. Any further material Compare change requires separate authority under `docs/ui-v3-remediation-authority.md`.
