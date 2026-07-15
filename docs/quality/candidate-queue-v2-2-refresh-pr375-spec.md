# PR #375 Candidate Queue v2.2 Refresh Specification

Status: active internal planning specification  
Review PR: 375  
Public output: false

## Objective

Apply the reviewed PR #374 queue-history contract to the PR #372 v2.1 candidate queue without recomputing the baseline.

## Required inputs

```text
config/candidate-queue-v2-2-refresh-pr375.json
docs/migration/record-depth-baseline-v2-1-pr372.json
docs/migration/tier-a-candidate-queue-v2-1-pr372.json
config/planning-queue-review-history-v1-pr374.json
docs/migration/planning-queue-review-history-manifest-pr374.json
docs/migration/planning-queue-review-history-audit-pr374.json
docs/migration/post-pr372-review-gate-pr373.json
```

## Filtering rule

For each source candidate and material dossier gap:

1. read the PR #374 effective asset-dimension outcome;
2. retain an unreviewed dimension;
3. retain a reviewed dimension only when a reviewed reactivation signal is present;
4. suppress reviewed dimensions without a signal;
5. exclude the asset when all material dossier gaps are suppressed.

The operation filters the queue only. It does not change the PR #372 baseline or any planning cell.

## Reviewed generated result

```text
source candidates: 3
suppressed candidates: 3
reactivated candidates: 0
output candidates: 0
removed asset slugs: audd, nzds, poundtoken
```

AUDD and NZDS each retain four dimension-level suppression explanations. poundtoken retains three. Every effective outcome is `reviewed_no_safe_change`, every eligibility state is `suppressed_reviewed_no_safe_change`, and no reactivation signal is present.

The source PR #372 queue remains immutable. The removed candidates are preserved in the v2.2 delta rather than deleted from historical planning evidence.

## Required outputs

```text
docs/migration/tier-a-candidate-queue-v2-2-pr375.json
docs/migration/tier-a-candidate-queue-v2-2-pr375-delta.json
```

## Queue contract

- internal only;
- asset-slug ascending;
- non-ranking;
- manual review required;
- no canonical promotion;
- no dossier-batch authorization;
- next work item is `REVIEW GATE`.

## Preservation requirements

The following remain immutable:

```text
PR #372 v2.1 baseline and queue
PR #373 review-gate report
PR #374 contract, manifest, and audit
all earlier baselines, queues, and reviewed handoffs
canonical release-integrity checkpoints
```

## Prohibited work

- baseline recomputation;
- canonical or public changes;
- historical queue rewrites;
- automatic source or canonical promotion;
- rankings, scores, recommendations, or dossier authorization.
