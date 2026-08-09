# Stable or Gone Roadmap

Updated: 2026-08-10  
Status: Compare remediation complete; Evidence Archive Payload Verification Batch 2 MANUAL_PAYLOAD_REVIEW restored; canonical implementation authority remains REVIEW GATE

## Current reviewed checkpoint

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
Archive recorded: 463
Archive not recorded: 122
Detail routes: 422
Metadata-checked routes: 422
Official origin: https://www.stableorgone.com
Current production commit: dynamic; verify via deploy-production workflow and Issue #479
Last canonical-changing implementation commit: 77e80dd3e2a62fea53ea0eabe91ef78a2d8ab1da
Canonical hash: sha256:f386c1043ca5e83cafbd88e99746d0609aab0154ed48de1970677758a66ed5fa
Canonical file count: 466
Legacy-host 301: complete
```

## Completed current-cycle work

```text
PR #514 — six-week cycle and Batch 5 authority
PR #515 — candidate audit
PRs #516–#519 — EUB/USB implementation, navigation insertion, and closeout
PRs #520–#523 — JPYSC review, implementation authority, and canonical Market Access implementation
PR #524 — fixed support visual audit
PR #525 — support cleanup
PR #526 — complete Ledger Series footer network
PRs #527–#530 — official-domain migration and completed legacy-host 301
PR #531 — 2026 stablecoin regulation guide cluster
PR #532 — authority/schedule reconciliation
PR #533 — shared Guide readability remediation
PR #534 — post-PR #523 closeout and REVIEW GATE restoration
PR #535/#536 — Japan Market Access Expansion Review Batch 1, completed no-go
PR #537 — Evidence Archive Payload Verification Batch 2 review authority
PR #538 — deterministic Batch 2 candidate selection
PR #540 — Stablecoin Compare Matrix Remediation authority
PR #541 — aligned 2–4 record comparison matrix; main + production verified
```

## Compare remediation — complete

```text
Implementation PR: #541
Merge commit: 539a27fd5854a1c2544f4653a2161be36860a002
Production run: 31326135906 — success
Visual exact head: bf27f4fe79ca19774ed92a4ff82854188c4edbe0
Visual run: 31325811381 — success
Visual audit: ok=true / failures=[]
Zero-selection audit: ok=true
Canonical delta: 0
```

The public `/stablecoins/` comparison now uses one aligned attribute-by-record matrix for two, three, or four selected records, rejects a fifth, supports individual removal and `Differences only`, preserves ordered shared URL state, keeps Unknown/Not recorded explicit, and remains usable on mobile through bounded internal horizontal scrolling.

Compare is no longer the active workstream. Further Compare changes require separate authority.

## Current priority — Evidence Archive Payload Verification Batch 2

The exact ten candidates fixed by PR #538 are again active for manual payload review in draft PR #539.

```text
stage: MANUAL_PAYLOAD_REVIEW
candidate count: 10
draft review PR: #539
canonical archive additions authorized: 0
canonical implementation authority: REVIEW_GATE
```

Review procedure:

1. start from each exact canonical source URL;
2. discover dated Wayback captures;
3. independently fetch archived payloads rather than relying on CDX metadata;
4. inspect HTTP response/body and preserved text;
5. compare preserved body content with the canonical Evidence claim scope;
6. record either an exact dated archive proposal or `reviewed_no_safe_change`;
7. do not change canonical `archived_url` or other canonical data in the review PR.

Redirect-only captures, generic replay shells, unrelated content, future-only content, or inaccessible payloads do not qualify.

## Current boundary

```text
Current public implementation authority: none
Current review authority: Evidence Archive Payload Verification Batch 2
Current stage: MANUAL_PAYLOAD_REVIEW
Active draft PR: #539
Canonical implementation authority: REVIEW_GATE
Canonical promotion authorized: no
Maximum canonical archive additions authorized: 0
```

## Schedule

```text
2026-08-09  Evidence Archive Payload Verification Batch 2 authority/candidate selection — complete
2026-08-09  initial manual Wayback payload probes in PR #539 — review evidence collected
2026-08-10  Compare remediation #540/#541 — complete, production verified
2026-08-10 onward  resume and finish PR #539 MANUAL_PAYLOAD_REVIEW
2026-08-17 to 2026-08-23  possible Evidence Archive Batch 2 canonical implementation window — separate authority required
2026-08-24 onward  later dossier/data-growth lanes — separate authority required
```

Schedule windows are planning targets, not permission boundaries.

## Preserved exclusions

```text
canonical archived_url mutation in PR #539
new Evidence identity or Evidence Relation in PR #539
source URL replacement
candidate-set mutation
automatic archive promotion
Market Access changes
schema/taxonomy changes
new public routes
unreviewed public output
silent implementation from a review result
known visual defect accepted because CI is green
```

## Required work-start protocol

Before continuing PR #539, read:

```text
AGENTS.md
docs/spec-governance.md
docs/roadmap.md
docs/deployment-policy.md
docs/roadmap-amendments/2026-08-10-post-pr541-compare-closeout-evidence-review-restoration.md
docs/roadmap-amendments/2026-08-09-evidence-archive-payload-verification-batch-2-review-authority.md
docs/roadmap-amendments/2026-08-09-evidence-archive-payload-verification-batch-2-candidates.md
docs/quality/evidence-archive-payload-verification-batch-2-review-authority-spec.md
docs/quality/evidence-archive-payload-verification-batch-2-candidate-spec.md
config/evidence-archive-payload-verification-batch-2-review-authority.json
data/editorial-research/evidence-archive-payload-verification-batch-2-candidates-2026-08-09.json
Batch 1 payload-review history
Queue v7 selection inputs
```

After the ten-candidate review is complete, return to REVIEW_GATE. Any canonical archive additions require a separate reviewed and merged implementation authority.
