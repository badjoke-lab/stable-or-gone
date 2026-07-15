# PR #374 Planning Queue Review-History Contract Audit Activation

Date: 2026-07-15
Status: active authority amendment
Public output: no

## Authority

Merged PR #373 authorized exactly:

```text
PR #374 Planning Queue Review-History Contract Audit
PR #375 Candidate Queue v2.2 Refresh
REVIEW GATE
```

## Scope

PR #374 must inventory the reviewed dossier history from PR #354, #355, #357, #364, and #369 and define deterministic queue eligibility behavior.

The contract must:

- resolve history by asset and dimension;
- use the latest reviewed event as the effective outcome;
- distinguish reviewed complete, reviewed partial, and reviewed no-safe-change outcomes;
- suppress the same dimension until a reviewed new-source or semantics-change signal exists;
- prohibit automatic time expiry;
- prohibit treating queue presence or planning-state movement as a source signal;
- preserve asset-slug ascending non-ranking order;
- project the PR #375 queue without recomputing the baseline.

## Expected inventory

```text
review sources: 5
history events: 48
reviewed assets: 18
effective asset-dimension outcomes: 33
reviewed complete: 20
reviewed partial: 0
reviewed no-safe-change: 13
```

The current PR #372 queue contains three candidates. Every material dossier gap for AUDD, NZDS, and poundtoken is expected to be suppressed without a reviewed reactivation signal, projecting a zero-candidate v2.2 queue.

## Required outputs

```text
docs/migration/planning-queue-review-history-manifest-pr374.json
docs/migration/planning-queue-review-history-audit-pr374.json
```

## Boundaries

PR #374 changes no canonical data, public surfaces, baseline cells, historical queues, rankings, scores, recommendations, or automatic promotion rules. PR #375 remains the only authorized consumer of the completed contract before the next review gate.
