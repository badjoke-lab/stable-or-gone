# PR #370 Post-PR #369 Review Gate Specification

## Status

This specification governs the mandatory internal review gate after completion of the PR #367–#369 sequence.

It does not authorize canonical data changes, public-surface changes, rankings, scores, or automatic promotion.

## Required inputs

- `docs/migration/record-depth-baseline-v2-pr368-summary.json`
- `docs/migration/tier-a-candidate-queue-v2-pr368.json`
- `docs/migration/tier-a-batch-5-pr369-review-outcomes.json`
- `docs/migration/tier-a-batch-5-pr369-reviewed-handoff.json`
- `scripts/growth/build-reviewed-record-depth-baseline-pr353.mjs`
- `scripts/build-record-depth-baseline-v2-refresh-pr368.mjs`
- prior Tier A reviewed handoffs from PR #354, #355, #357, and #364
- `config/post-pr369-review-gate-pr370.json`

## Questions

1. Did the PR #367 semantics audit improve planning-state correctness?
2. Did the PR #368 queue produce a fresh set of source-supported dossier opportunities?
3. Did PR #369 produce enough canonical improvement yield to authorize another dossier batch?
4. Does the planning builder consume every current reviewed profile overlay used by the repository?
5. What is the smallest bounded sequence that corrects queue input coverage without changing canonical or public scope?

## Binding findings

- PR #367 successfully separated planning quality, applicability, and observation/source-support semantics.
- PR #368 reduced universal `absent` cells from 219 to two and recorded 218 `not_applicable` cells.
- All six PR #368 queue candidates had prior reviewed improvement or no-safe-change history.
- PR #369 reviewed five candidates and produced zero canonical changes.
- The canonical planning builder defaults `profileOverrideFiles` to an empty list.
- The PR #368 builder invoked the canonical builder without override options.
- Therefore current reviewed profile overlay coverage is not guaranteed to be complete before queue generation.

## Approved sequence

1. PR #371 — Planning Input Coverage Audit.
2. PR #372 — Record Depth Baseline v2.1 Refresh using the approved complete planning input manifest.
3. Review gate.

PR #371 and PR #372 may not change canonical data or public surfaces.

## Required PR #371 result

PR #371 must:

- inventory all canonical and reviewed profile overlay files;
- identify which loaders and planning builders consume each file;
- distinguish current canonical/public composition from historical-only overlays;
- define one deterministic planning input manifest;
- detect omissions and duplicate application;
- preserve canonical data and public output.

## Required PR #372 result

PR #372 may begin only after PR #371 merges. It must:

- recompute exactly 112 assets × 16 dimensions using the approved manifest;
- preserve PR #353, #363, and #368 checkpoints;
- emit a corrected internal non-ranking queue;
- change no canonical records and no public surface;
- stop at another review gate before any dossier batch.

## Explicit non-goals

- Tier A Dossier Deepening Batch 6
- Evidence and Archive Maintenance Batch 3
- Market Access Pilot 3
- Record Growth Batch 2
- new asset or deployment family
- new public page or explorer
- ranking, composite score, recommendation, or leaderboard
- automatic monitoring or canonical promotion

## Activation boundary

PR #370 records the reviewed authority decision. It does not activate the next implementation contract. PR #371 must update `AGENTS.md` and `docs/roadmap.md` before changing planning input contracts.
