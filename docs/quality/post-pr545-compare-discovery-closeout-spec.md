# Post-PR #545 Compare Discovery and Navigation Closeout Spec

Updated: 2026-08-10  
Status: completed UI lane; canonical boundary restored to REVIEW_GATE

## Accepted UI result

The `/stablecoins/` Compare discovery/navigation remediation is accepted only with the following verified state:

- PR #544 supplied the bounded authority;
- PR #545 supplied the implementation;
- merge commit `cd18c899cebb49a0cc6c99670709cdee0b7b7256` is the completed implementation;
- exact-head visual acceptance run `31405900687` succeeded;
- production run `31406474357` succeeded through Cloudflare upload, deployed-production verification, and Issue #479 reporting;
- canonical data counts/hash/file count are unchanged.

Accepted interaction behavior:

- comparison appears before the public-register result table;
- after one or more selections, a fixed Compare dock remains discoverable while the register is being browsed;
- the dock does not cover the matrix or footer because it is hidden while the comparison is visible or outside register browsing scope;
- `View comparison` returns immediately to the comparison heading and focus;
- candidate replacement is available inside the comparison area;
- removing then replacing a record does not require scrolling back through the register;
- the 2–4 matrix, `Differences only`, URL state, explicit unknown/not-recorded values, fifth-selection rejection, and bounded mobile overflow remain intact.

## Restored Evidence boundary

Evidence Archive Payload Verification Batch 2 remains review-complete at `REVIEW_GATE`:

```text
reviewed = 10
proposals = 8
no_safe_change = 2
canonical_archive_additions_authorized = 0
```

Any canonical archive promotion requires a separate reviewed and merged implementation authority. The Compare closeout supplies no authority for archive mutation, canonical data changes, schema/taxonomy changes, or unrelated public-UI work.
