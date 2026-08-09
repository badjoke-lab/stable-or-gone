# Stable or Gone Agent Instructions

This file is the mandatory entry point for humans, AI agents, and automation working in this repository.

## Current authority

```text
Repository state: Evidence Archive Payload Verification Batch 2 manual review active
Current review authority: Evidence Archive Payload Verification Batch 2
Current stage: MANUAL_PAYLOAD_REVIEW
Active draft review PR: #539
Fixed candidate count: 10
Canonical archive additions authorized: 0
Canonical implementation authority: REVIEW GATE
Current canonical checkpoint: sog_jpysc_market_access_pilot_3_canonical_119_checkpoint_pr523_2026_08_05
Current production commit: dynamic; verify via deploy-production workflow and Issue #479
Last canonical-changing implementation commit: 77e80dd3e2a62fea53ea0eabe91ef78a2d8ab1da
Canonical hash: sha256:f386c1043ca5e83cafbd88e99746d0609aab0154ed48de1970677758a66ed5fa
Canonical file count: 466
Official public origin: https://www.stableorgone.com
Legacy-host 301: complete via Pages Advanced Mode worker and strict migration gate
```

The Stablecoin Compare Matrix Remediation is complete. PR #540 authorized the bounded repair; PR #541 implemented it and merged as `539a27fd5854a1c2544f4653a2161be36860a002`. Production run `31326135906` succeeded. Exact-head visual acceptance run `31325811381` passed with `audit.json: ok=true / failures=[]` and `zero-state.json: ok=true`.

The Compare interruption is closed. Evidence Archive Payload Verification Batch 2 is restored exactly at the pre-interruption manual review boundary. PR #539 is again the active review draft; it remains review-only and must not promote canonical archive URLs.

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

Every count above remains frozen while the active lane is review-only.

## Historical authority anchors

The following completed anchors remain required for compatibility and audit traceability:

```text
PR #493 — official-domain migration and production verification
PR #500 — bounded MNEE Evidence and Archive Maintenance checkpoint
PR #517 — Bison Bank EUB and USB complete-record growth checkpoint
PR #522 — semantic authority for the completed PR #523 JPYSC implementation
PR #523 — bounded JPYSC Japan Market Access implementation
PR #534 — post-PR #523 production closeout and REVIEW GATE restoration
PR #535 — Japan Market Access Expansion Review Batch 1 authority
PR #536 — Japan Market Access Expansion Review Batch 1 no-go closeout
PR #537 — Evidence Archive Payload Verification Batch 2 review-only authority
PR #538 — deterministic Evidence Archive Payload Verification Batch 2 candidate set
PR #540 — Stablecoin Compare Matrix Remediation authority
PR #541 — Stablecoin Compare Matrix implementation and production-verified closeout target
```

Merged repository authority outranks chat memory, handoff prose, issue discussion, stale branch state, generated reports, and unmerged drafts.

## Mandatory reading order

Before substantive continuation, read the merged current versions of:

1. `AGENTS.md`
2. `docs/spec-governance.md`
3. `docs/roadmap.md`
4. `docs/deployment-policy.md`
5. `docs/roadmap-amendments/2026-08-10-post-pr541-compare-closeout-evidence-review-restoration.md`
6. `docs/roadmap-amendments/2026-08-09-evidence-archive-payload-verification-batch-2-review-authority.md`
7. `docs/roadmap-amendments/2026-08-09-evidence-archive-payload-verification-batch-2-candidates.md`
8. `docs/quality/evidence-archive-payload-verification-batch-2-review-authority-spec.md`
9. `docs/quality/evidence-archive-payload-verification-batch-2-candidate-spec.md`
10. `config/evidence-archive-payload-verification-batch-2-review-authority.json`
11. `data/editorial-research/evidence-archive-payload-verification-batch-2-candidates-2026-08-09.json`
12. Batch 1 review history and Queue v7 inputs before making any review disposition.

## Active Evidence Archive review boundary

```text
lane: Evidence Archive Payload Verification Batch 2
stage: MANUAL_PAYLOAD_REVIEW
candidate count: exactly 10
candidate artifact: fixed by PR #538
draft review PR: #539
canonical archived_url changes: prohibited
new Evidence / Evidence Relation changes: prohibited
canonical source URL replacement: prohibited
Market Access / route / schema / taxonomy changes: prohibited
canonical implementation authority: REVIEW GATE
maximum canonical archive additions: 0
```

Manual review must use the exact canonical source URL, find a dated Wayback capture, independently fetch the archived payload, inspect HTTP/body content, and compare preserved body content against the canonical claim scope. CDX metadata alone, redirect-only captures, generic shells, unrelated payloads, or future-only text are insufficient. `reviewed_no_safe_change` is a valid outcome.

Any exact dated archive proposal remains a review result only. Canonical promotion requires a separate reviewed and merged implementation authority.

## Completed Compare behavior

The public `/stablecoins/` comparison now preserves the existing 2–4 selection contract, rejects a fifth selection, renders one attribute-by-record matrix, supports individual column removal and `Differences only`, preserves ordered shared URL state, keeps Unknown/Not recorded explicit, and uses bounded internal mobile scrolling without page-level overflow.

Compare follow-up implementation requires separate authority; it is not the active workstream.

## Exit

Complete the ten-candidate manual payload review in PR #539. The valid review outcomes are exact dated archive proposals or `reviewed_no_safe_change`. After review completion, return to `REVIEW_GATE`; any canonical archive mutation must be separately authorized.

Issue #479 remains the deployment-history authority.
