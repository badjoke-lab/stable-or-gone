# Stable or Gone Specification Governance

Status: canonical governance specification  
Updated: 2026-08-10

## 1. Purpose

This document defines repository authority, conflict resolution, canonical-data preservation, public-surface governance, visual-quality gates, deployment governance, and bounded continuation rules.

Merged repository specifications are the source of truth. Chat memory, handoff prose, issue discussion, stale branch state, generated reports, and unmerged drafts do not override merged repository authority.

## 2. Authority order

When active documents disagree, use this order:

1. `docs/deployment-policy.md` for production/publication rules.
2. `docs/spec-governance.md` for authority and change control.
3. `docs/roadmap.md` for current phase and bounded sequence.
4. the current merged roadmap amendment.
5. the active work-item specification and machine-readable authority contract.
6. enduring regression authorities.
7. named audits, inventories, baselines, fixtures, queues, and reviewed prior outputs.
8. conversation history and unmerged drafts.

Current restoration/closeout authority:

```text
docs/roadmap-amendments/2026-08-10-post-pr541-compare-closeout-evidence-review-restoration.md
docs/quality/post-pr541-compare-closeout-evidence-review-restoration-spec.md
config/post-pr541-compare-closeout-evidence-review-restoration.json
```

Restored active review authority:

```text
docs/roadmap-amendments/2026-08-09-evidence-archive-payload-verification-batch-2-review-authority.md
docs/roadmap-amendments/2026-08-09-evidence-archive-payload-verification-batch-2-candidates.md
docs/quality/evidence-archive-payload-verification-batch-2-review-authority-spec.md
docs/quality/evidence-archive-payload-verification-batch-2-candidate-spec.md
config/evidence-archive-payload-verification-batch-2-review-authority.json
data/editorial-research/evidence-archive-payload-verification-batch-2-candidates-2026-08-09.json
```

## 3. Current reviewed execution state

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
Metadata-checked detail routes: 422
Official public origin: https://www.stableorgone.com
Current production commit: dynamic; verify via deploy-production workflow and Issue #479
Last canonical-changing implementation commit: 77e80dd3e2a62fea53ea0eabe91ef78a2d8ab1da
Canonical hash: sha256:f386c1043ca5e83cafbd88e99746d0609aab0154ed48de1970677758a66ed5fa
Canonical file count: 466
Legacy-host migration: complete
```

There is no active canonical-record implementation authority. `REVIEW_GATE` remains the canonical implementation boundary.

## 4. Compare remediation — complete

The bounded Stablecoin Compare Matrix Remediation is closed.

```text
Authority PR: #540
Implementation PR: #541
Implementation merge commit: 539a27fd5854a1c2544f4653a2161be36860a002
Production run: 31326135906 — success
Visual exact head: bf27f4fe79ca19774ed92a4ff82854188c4edbe0
Visual run: 31325811381 — success
Visual audit: ok=true / failures=[]
Zero-state audit: ok=true
```

The completed public behavior is two-to-four selection, fifth rejected, one aligned attribute-by-record matrix, individual column removal, `Differences only`, ordered shared URL state, explicit Unknown/Not recorded values, and bounded internal mobile horizontal scrolling with no page-level overflow.

PR #540/#541 changed no canonical records, schema, taxonomy, route identities, Evidence, Evidence Relations, Market Access, or archive data. Any further material Compare implementation requires separate authority.

## 5. Restored active lane — Evidence Archive Payload Verification Batch 2

```text
stage: MANUAL_PAYLOAD_REVIEW
candidate count: exactly 10
draft review PR: #539
canonical archive additions authorized: 0
canonical implementation authority: REVIEW_GATE
```

The PR #537 review authority and PR #538 deterministic candidate set remain authoritative and unchanged. The candidate artifact remains internal/review-only and `canonical_change_authorized=false`.

Manual review must retain the original semantic contract:

- exact canonical source URL;
- dated Wayback snapshot;
- successful independent archived-payload fetch;
- HTTP/body inspection;
- claim-scope preservation in the archived body;
- CDX metadata, redirect-only captures, generic shells, unrelated content, and future-only content are insufficient;
- `reviewed_no_safe_change` is valid.

PR #539 may record review dispositions and bounded implementation proposals, but it may not mutate canonical `archived_url`, source URL, Evidence identity, Evidence Relations, Market Access, routes, schema, taxonomy, or public canonical output.

Any canonical archive promotion requires a separate reviewed and merged implementation authority.

## 6. Current bounded sequence

```text
1. PR #523 bounded JPYSC implementation — complete
2. PR #534 closeout / REVIEW GATE restoration — complete
3. PR #535/#536 Japan Market Access Expansion Review Batch 1 — complete no-go
4. PR #537 Evidence Archive Payload Verification Batch 2 review-only authority — complete
5. PR #538 deterministic Batch 2 candidate selection — complete
6. PR #539 manual payload review — active draft
7. PR #540 Compare remediation authority — complete
8. PR #541 Compare implementation / visual acceptance / production — complete
9. post-PR #541 closeout — restore #539 manual review without canonical mutation
10. finish #539 review, then return to REVIEW_GATE
11. any archive implementation — separate merged authority only
```

## 7. Canonical and public safety boundary

Public registry and machine-readable claims remain canonical-only.

```text
canonical_only = true
includes_unreviewed_candidates = false
includes_internal_monitoring = false
canonical implementation authority = REVIEW_GATE
```

Review work cannot change stablecoin identity, lifecycle/issuance taxonomy, organization relationships, reserve claims, evidence identity, archive URLs, Market Access, route identity, or machine-readable canonical outputs.

## 8. Historical anchors

Historical PR-specific checkpoints remain immutable audit evidence, including:

```text
PR #493 — official-domain migration and production verification
PR #500 — bounded MNEE Evidence and Archive Maintenance checkpoint
PR #517 — Bison Bank EUB/USB complete-record growth checkpoint
PR #522 — semantic authority for PR #523
PR #523 — last canonical-changing implementation
PR #537 — Evidence Archive Batch 2 review authority
PR #538 — Evidence Archive Batch 2 deterministic candidates
PR #540 — Compare remediation authority
PR #541 — production-verified Compare implementation
```

## 9. Mandatory work-start protocol

Before substantive continuation, read:

1. `AGENTS.md`;
2. this file;
3. `docs/roadmap.md`;
4. `docs/deployment-policy.md`;
5. the post-PR #541 closeout/restoration amendment/spec/contract;
6. the PR #537/#538 Evidence Archive authority and candidate contracts;
7. the fixed candidate artifact;
8. Batch 1 review history and Queue v7 inputs before making review dispositions;
9. PR #539 review artifacts when continuing its draft branch.

If authority, canonical counts, schedule, deployment behavior, or review boundary changes, update governing documentation before implementation continues.

## 10. Exit rule

Complete the ten-candidate manual payload review. Valid review outcomes are exact dated archive proposals or `reviewed_no_safe_change`. The review itself authorizes zero canonical archive additions. After review completion, return to `REVIEW_GATE`; implementation requires a separate reviewed and merged authority.
