# Post-PR #541 Compare Closeout / Evidence Review Restoration Specification

Date: 2026-08-10

## Completed public remediation

PR #541 completed the public Stablecoin Register comparison correction authorized by PR #540. The implementation is accepted only because the exact implementation head passed repository CI, dedicated comparison interaction/visual audits, zero-selection visibility auditing, direct desktop/mobile artifact inspection, and production verification after merge.

Accepted evidence:

```text
implementation PR: #541
implementation merge commit: 539a27fd5854a1c2544f4653a2161be36860a002
production run: 31326135906 — success
visual exact head: bf27f4fe79ca19774ed92a4ff82854188c4edbe0
visual acceptance run: 31325811381 — success
audit.json: ok=true / failures=[]
zero-state.json: ok=true
```

The completed comparison contract is two to four records, fifth rejected, one aligned attribute-by-record matrix, individual column removal, `Differences only`, ordered shared URL state, explicit Unknown/Not recorded values, and bounded internal horizontal scrolling on narrow viewports with no page-level overflow.

## No canonical delta

The Compare lane must close with the exact same canonical checkpoint it entered with. The expected canonical hash is:

```text
sha256:f386c1043ca5e83cafbd88e99746d0609aab0154ed48de1970677758a66ed5fa
```

and canonical file count remains `466`.

Expected reviewed counts remain 119 assets, 109 organizations, 131 relationships, 194 events, 585 Evidence, 585 Evidence Relations, 127 reserve reports, 352 known unknowns, 9 regulatory notes, 186 deployments, 119 legal profiles, 153 reserve components, 119 income profiles, 12 Market Access records, archive 463 recorded / 122 not recorded, and 422 detail/metadata-checked routes.

## Restored review authority

After this closeout merges, the active research/review lane is again:

```text
Evidence Archive Payload Verification Batch 2
stage: MANUAL_PAYLOAD_REVIEW
candidate count: 10
draft PR: #539
canonical archive additions authorized: 0
canonical implementation authority: REVIEW_GATE
```

The merged PR #537 authority and PR #538 deterministic candidate set are not regenerated or changed by this closeout.

The active manual review must continue to require:

- exact canonical source URL;
- dated Wayback snapshot;
- successful archived payload retrieval rather than CDX metadata alone;
- HTTP/payload inspection;
- claim-scope preservation in the archived body;
- rejection of redirect-only, shell-only, unrelated, future-only, or insufficient payloads;
- `reviewed_no_safe_change` as a valid outcome.

PR #539 remains review-only. A review result may propose exact dated archive URLs but may not change canonical `archived_url`, Evidence identity, Evidence Relations, source URLs, Market Access, public routes, schema, taxonomy, or other canonical facts.

Any canonical archive promotion after manual review requires a separate reviewed and merged implementation authority.

## Active-workstream gate

The active-workstream validator after restoration must validate both:

1. the original Evidence Archive Payload Verification Batch 2 review authority; and
2. the deterministic ten-candidate artifact.

It must also validate this closeout/restoration checkpoint so the Compare lane cannot remain falsely active in forward governance.
