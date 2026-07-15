# PR #375 Candidate Queue v2.2 Refresh Activation

Date: 2026-07-15
Status: active authority amendment
Public output: no

## Authority

Merged PR #373 authorized:

```text
PR #374 Planning Queue Review-History Contract Audit
PR #375 Candidate Queue v2.2 Refresh
REVIEW GATE
```

PR #374 completed the review-history contract and manifest.

## Scope

PR #375 must apply PR #374 dimension-level eligibility to the existing PR #372 v2.1 queue without recomputing the baseline.

Source queue:

```text
AUDD
NZDS
poundtoken / 1GBP
```

Every material dossier gap is suppressed by the latest reviewed no-safe-change event. There are no reviewed reactivation signals.

## Expected result

```text
source candidates: 3
suppressed candidates: 3
reactivated candidates: 0
output candidates: 0
removed: audd, nzds, poundtoken
```

## Required outputs

```text
docs/migration/tier-a-candidate-queue-v2-2-pr375.json
docs/migration/tier-a-candidate-queue-v2-2-pr375-delta.json
```

## Boundaries

PR #375 does not recompute or modify baseline cells. It changes no canonical data, public surfaces, historical queues, rankings, scores, recommendations, or automatic promotion rules. The result must stop at `REVIEW GATE`.
