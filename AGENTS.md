# Stable or Gone Agent Instructions

Current mandatory authorities:

1. Completed UI V3 regression authority — PR #461 and PR #463 closure, archived in `docs/ui-v3-remediation-authority.md`.
2. Canonical data baseline — PR #433 generated-output repair on top of PR #429.
3. Active data-growth authority — PR #466 Post-UI data-growth review gate, authorizing only PR #467 Record Growth Batch 3 for PLNQ and GBPQ.

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
docs/roadmap-amendments/2026-07-25-pr466-post-ui-data-growth-review-gate.md
docs/quality/post-ui-data-growth-review-gate-pr466-spec.md
config/post-ui-data-growth-review-gate-pr466.json
docs/migration/post-ui-data-growth-review-gate-pr466.json
```

## Mandatory UI working rule

Before changing any public HTML, component, layout, CSS, client script, UI validation, screenshot workflow, or visual acceptance record, read `docs/ui-v3-remediation-authority.md` as the completed regression contract.

Every material UI pull request must:

- state `Authority: docs/ui-v3-remediation-authority.md`;
- identify the exact preserved or changed regression requirements;
- list changed routes and states;
- include desktop and mobile screenshots for changed route families;
- report visible errors, console errors, failed required requests, overflow, text clipping or overlap, keyboard behavior, and relevant page-height changes;
- preserve or strengthen exhaustive color, readability, overlap, route-completeness, and responsive checks;
- preserve canonical data, routes, metadata contracts, and machine-readable outputs unless a separate authority explicitly permits a change.

A material UI pull request that omits these items is out of scope and must not merge. Automated success must never override a known visual defect.

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
PR #461 exhaustive UI V3 color-system repair: complete
PR #463 exhaustive UI V3 readability and hierarchy closure: complete
PR #464 UI authority and roadmap closure: complete
PR #465 agent authority synchronization: complete on merge
PR #466 Post-UI data-growth review gate: active
PR #467 Record Growth Batch 3 — PLNQ and GBPQ: authorized next
Next boundary after PR #467: REVIEW GATE

Issue #281 UI v3 rebuild: complete and closed
Issue #457 CYA-dark redesign audit: complete and closed
UI v3 completion: true
UI remediation implementation queue: closed
```

## UI authority boundary

The current UI V3 implementation is the accepted baseline after exhaustive 457-route desktop and mobile verification, direct artifact inspection, repair of the discovered mobile event section-heading overlap, and merge of PR #463.

`docs/ui-v3-remediation-authority.md` remains mandatory for regression protection, but it is no longer an active R1–R10 implementation queue. Do not reopen superseded UI phases or drafts as current authority.

A future material UI program requires a new reviewed roadmap amendment. Small correctness, accessibility, readability, and broken-link fixes remain allowed when they preserve the completed regression contract.

## PR #467 canonical-growth boundary

PR #467 is the only authorized next canonical-growth PR. It may add at most the exact reviewed candidates:

```text
Quantoz PLNQ — sog_cand_pr427_plnq
Quantoz GBPQ — sog_cand_pr427_gbpq
```

Before canonical edits, PR #467 must perform a fresh duplicate, current-source, deployment-identity, reserve, and redemption review. It must reuse the existing Quantoz organization. Thin records are prohibited. A candidate that cannot support a complete record must be withheld and may not be replaced by a third candidate.

PR #467 must not change Market Access, monitoring publication, UI, public route families, score or ranking surfaces, or recommendation semantics. Automatic promotion remains prohibited.

## Data-growth boundary

No agent may automatically promote candidates, infer missing facts, create thin canonical records, authorize an indefinite PR sequence, introduce a score or ranking, or treat monitoring observations as canonical evidence.

Unknown values remain explicit. PR #467 exits only to a mandatory review gate based on its actual merged result.

## Production boundary

A merge to `main` is not itself proof of production parity. Production publication and deployed-commit verification follow `docs/deployment-policy.md`. Keep repository validation, production deployment, and production parity conclusions distinct.
