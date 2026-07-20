# Stable or Gone Agent Instructions

Current mandatory authorities:

1. UI remediation R1 — authority reset and audit baseline.
2. Canonical data baseline — PR #433 generated-output repair on top of PR #429.

## Mandatory references

```text
AGENTS.md
docs/spec-governance.md
docs/roadmap.md
docs/deployment-policy.md
docs/ui-v3-remediation-authority.md
docs/post-351-data-growth-operating-spec.md
docs/roadmap-amendments/2026-07-18-pr426-post-ui-v3-data-growth-reset.md
docs/quality/record-growth-candidate-audit-v2-pr427-spec.md
config/record-growth-candidate-audit-v2-pr427.json
data/editorial-research/record-growth-candidate-audit-v2-pr427.json
docs/migration/record-growth-candidate-audit-v2-pr427-handoff.json
docs/migration/record-growth-candidate-audit-v2-pr427-validation.json
docs/roadmap-amendments/2026-07-18-pr428-post-pr427-review-gate.md
docs/quality/post-pr427-review-gate-pr428-spec.md
config/post-pr427-review-gate-pr428.json
docs/migration/post-pr427-review-gate-pr428.json
docs/migration/post-pr427-review-gate-pr428-validation.json
docs/quality/record-growth-batch-2-pr429-spec.md
config/record-growth-batch-2-pr429.json
data/candidate-promotions-batch-28.json
docs/migration/record-growth-batch-2-pr429-handoff.json
```

## Mandatory UI working rule

Before changing any public HTML, component, layout, CSS, client script, UI validation, screenshot workflow, or visual approval record, read `docs/ui-v3-remediation-authority.md`.

Every UI pull request must:

- state `Authority: docs/ui-v3-remediation-authority.md`;
- cite the exact requirement headings it implements;
- list changed routes and states;
- include desktop and mobile screenshots;
- report visible errors, console errors, failed required requests, overflow, text clipping, keyboard behavior, and page-height changes;
- update the progress table in the authority document;
- preserve canonical data, routes, metadata contracts, and machine-readable outputs unless a separate authority explicitly permits a change.

A UI pull request that omits these items is out of scope and must not merge. Automated screenshot generation does not constitute owner approval.

## Current workstreams

```text
Canonical stable assets: 114
Organizations: 107
Relationships: 126
Events: 189
Canonical Evidence: 565
Evidence Relations: 565
Archive recorded: 436
Archive not recorded: 129
Deployments: 180
Market Access Records: 8

PR #426 Post-UI v3 Data-Growth Reset: complete
PR #427 Record Growth Candidate Audit v2: complete
PR #428 Post-PR #427 Review Gate: complete
PR #429 Record Growth Batch 2 — CHFAU and SEKAU: complete
PR #433 Generated-output repair: complete

Issue #281 UI v3 rebuild: reopened
UI v3 completion: false
Owner approval from the previous closure: withdrawn
UI remediation phase R1: active
UI remediation phases R2–R10: blocked pending phase review
```

## UI authority boundary

The current interface is not an accepted completed UI. It may remain deployed while remediation proceeds, but no agent may describe UI v3 as complete, approved, final, or visually validated.

The mandatory sequence and all page-specific requirements are defined only in `docs/ui-v3-remediation-authority.md`. Do not create a competing UI plan. Any supplementary implementation note must link back to that authority and may not weaken its requirements.

No later UI phase is automatically authorized by completion of an earlier phase. Each phase ends at a review gate.