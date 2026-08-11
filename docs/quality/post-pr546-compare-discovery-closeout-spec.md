# Post-PR #546 Compare Discovery and Navigation Closeout Spec

Updated: 2026-08-11  
Status: completed UI lane; canonical boundary restored to REVIEW_GATE

## Accepted UI result

The `/stablecoins/` Compare discovery/navigation remediation is accepted only with the following verified lineage:

- PR #544 supplied the bounded authority;
- PR #545 supplied the primary implementation;
- direct review of the PR #545 exact-head artifact found a blocking footer overlap, so PR #545 alone was not sufficient for visual closure;
- PR #546 fixed that blocking defect without canonical changes;
- final main merge `f8ceedd55b0cc764a2bbc2747bd50f061f288b24` contains the accepted UI result;
- PR #546 exact-head visual run `31498394285` at `02774d7e9f35abf7c11bbbcb2e39cb6b62172cd7` succeeded;
- artifact `9103989619` with digest `sha256:12d8bf30712114fcfa406bdfa64de5e126cae9723b6da09686e989b559ebcc86` passed direct changed-state review;
- production run `31498949423` succeeded through Cloudflare Pages upload, deployed-production verification, and Issue #479 reporting;
- canonical data counts/hash/file count are unchanged.

Accepted interaction behavior:

- comparison appears before public-register results;
- after one or more selections, a fixed Compare dock remains discoverable while the register is being browsed;
- the dock hides while the comparison is visible;
- the dock hides outside register browsing scope;
- the dock hides whenever `.site-footer` intersects the viewport;
- desktop and mobile footer-transition tests require the footer and register to be visible simultaneously, the dock to be hidden, and dock/footer rectangles to be non-intersecting;
- `View comparison` returns immediately to the comparison heading and focus;
- candidate replacement is available inside the comparison area;
- removing then replacing a record does not require scrolling back through the register;
- the 2–4 matrix, `Differences only`, URL state, explicit unknown/not-recorded values, fifth-selection rejection, and bounded mobile overflow remain intact.

Automated success alone is insufficient. A known visual defect blocks closure under `docs/ui-v3-remediation-authority.md`; the final acceptance therefore depends on the successful exact-head regression audit plus direct artifact review after PR #546.

## Restored Evidence boundary

Evidence Archive Payload Verification Batch 2 remains review-complete at `REVIEW_GATE`:

```text
reviewed = 10
proposals = 8
no_safe_change = 2
canonical_archive_additions_authorized = 0
```

Any canonical archive promotion requires a separate reviewed and merged implementation authority. The Compare closeout supplies no authority for archive mutation, canonical data changes, schema/taxonomy changes, unrelated public-UI work, or automatic continuation.
