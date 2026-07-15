# PR #366 Post-PR #365 Review Gate Specification

## Status

This specification governs a documentation-only, deterministic internal review gate.

It does not authorize canonical data changes, public-surface changes, rankings, scores, or automatic monitoring promotion.

## Required inputs

- `docs/roadmap.md`
- `docs/migration/record-depth-baseline-pr363-summary.json`
- `docs/migration/tier-a-batch-4-pr364-reviewed-handoff.json`
- `docs/migration/evidence-archive-maintenance-batch-2-pr365-reviewed-handoff.json`
- `docs/migration/evidence-archive-maintenance-outcomes-pr365.json`
- `config/post-pr365-review-gate-pr366.json`

## Questions

1. Does the current 16-dimension planning model distinguish structural absence, unobserved state, and genuine dossier gaps well enough to drive another batch?
2. Did PR #364 and PR #365 produce enough yield to justify immediately repeating the same work?
3. Is Market Access broad enough to authorize Pilot 3 or a public surface?
4. Is any repository-backed external usage evidence available?
5. What is the smallest bounded next sequence that improves decision quality without increasing canonical scope?

## Binding findings

- The baseline contains 219 absent cells and zero `not_applicable` cells.
- Market Access and regulatory notes account for 217 of the 219 absent cells.
- Deployment and facet freshness remain partial for 92 and 91 assets respectively.
- PR #364 changed 2 of 5 reviewed dossiers.
- PR #365 added exact archives to 3 of 10 reviewed Evidence records.
- Archive coverage is 390 recorded / 169 not recorded.
- Market Access remains eight records over two assets, one platform, and one jurisdiction.
- No reviewed repository evidence justifies automatic monitoring promotion, record growth, or a new public surface.

## Approved sequence

1. PR #367 — Planning Dimension Semantics Audit.
2. PR #368 — Record Depth Baseline v2 Refresh.
3. PR #369 — Tier A Dossier Deepening Batch 5, maximum five existing assets.
4. Review gate.

PR #367 and PR #368 may not change canonical data. PR #369 may improve only existing records selected from the refreshed non-ranking queue.

## Explicit non-goals

- Evidence and Archive Maintenance Batch 3
- Market Access Pilot 3
- Record Growth Batch 2
- new public page or explorer
- ranking, composite score, or safety score
- automatic monitoring or canonical promotion

## Activation boundary

This PR records the reviewed authority decision. It does not edit the current active-workstream pointers. PR #367 must update `AGENTS.md` and `docs/roadmap.md` to activate this sequence before changing planning contracts.
