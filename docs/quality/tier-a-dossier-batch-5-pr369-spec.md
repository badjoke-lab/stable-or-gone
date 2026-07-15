# PR #369 Tier A Dossier Deepening Batch 5 Specification

## Status

This specification governs the final bounded work item approved by merged PR #366 and enabled by merged PR #368.

PR #369 may manually review no more than five existing assets from the PR #368 non-ranking queue. It may change canonical records only when new reviewed source support safely resolves a material dossier gap. It must not force edits merely to produce batch yield.

## Authority

- `AGENTS.md`
- `docs/roadmap.md`
- `docs/roadmap-amendments/2026-07-15-pr366-post-pr365-review-gate.md`
- `docs/roadmap-amendments/2026-07-15-pr367-planning-dimension-semantics-audit-activation.md`
- `docs/roadmap-amendments/2026-07-15-pr368-record-depth-baseline-v2-refresh-activation.md`
- `docs/migration/record-depth-baseline-v2-pr368-summary.json`
- `docs/migration/tier-a-candidate-queue-v2-pr368.json`
- `config/tier-a-dossier-batch-5-pr369.json`

## Selected review set

Exactly five existing assets are reviewed:

```text
AUDD
BUSD
NZDS
poundtoken / 1GBP
USDP
```

RLUSD is not selected. It was improved in PR #354, reviewed again with no safe canonical change in PR #364, and received bounded Market Access records in PR #359.

## Prior-review boundary

The PR #368 queue is an internal non-ranking planning instrument. It does not supersede merged reviewed handoffs.

- BUSD received reviewed legal and redemption improvements in PR #354.
- USDP completed the authorized dossier dimensions in PR #355.
- AUDD and NZDS were reviewed with no safe canonical change in PR #357.
- poundtoken was reviewed with no safe canonical change in PR #364.

A prior-completed asset must not receive duplicate canonical edits. A prior no-safe-change asset may change only when a new reviewed source signal safely establishes the unresolved claim.

## Required outputs

- `docs/migration/tier-a-batch-5-pr369-review-outcomes.json`
- `docs/migration/tier-a-batch-5-pr369-reviewed-handoff.json`
- `scripts/build-tier-a-dossier-batch-5-pr369.mjs`
- `scripts/validate-tier-a-dossier-batch-5-pr369.mjs`
- `scripts/check-workstream-126.mjs`
- `.github/workflows/pr369-tier-a-dossier-batch-5.yml`

## Required result rules

- selected assets must be unique and drawn from the PR #368 queue;
- selected count must not exceed five;
- every selected asset must have a documented prior-review or new-source outcome;
- no source-supported canonical improvement may be omitted merely to preserve zero yield;
- no unsupported or duplicate edit may be forced merely to avoid zero yield;
- canonical counts and public surfaces remain unchanged when no safe change is found;
- the handoff must stop the sequence at a review gate.

## Explicit non-goals

- no new asset;
- no Market Access change;
- no new deployment family;
- no public page, explorer, endpoint, ranking, score, recommendation, or automatic promotion;
- no Evidence and Archive Maintenance Batch 3;
- no Market Access Pilot 3;
- no Record Growth Batch 2;
- no work after PR #369 without a new reviewed authority decision.

## Handoff

On merge, the PR #367–#369 sequence is complete. Repository authority moves to `REVIEW GATE`. No later numbered work is authorized until the review gate evaluates queue quality, prior-review recurrence, source availability, batch yield, evidence maintenance burden, Market Access breadth, monitoring usefulness, and verified external usage evidence.
