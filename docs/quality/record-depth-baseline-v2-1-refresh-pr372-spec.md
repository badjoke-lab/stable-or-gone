# PR #372 Record Depth Baseline v2.1 Refresh Specification

Status: active internal planning specification  
Review PR: 372  
Public output: false

## Objective

Recompute the internal Record Depth baseline using the complete reviewed profile composition fixed by PR #371.

The refresh corrects the planning-input boundary only. It does not change canonical records or the public product.

## Required inputs

```text
config/record-depth-baseline-v2-1-refresh-pr372.json
docs/migration/planning-input-manifest-pr371.json
docs/migration/planning-input-coverage-audit-pr371.json
config/planning-dimension-semantics-v2.json
docs/migration/planning-dimension-semantics-audit-pr367.json
docs/migration/record-depth-baseline-v2-pr368.json
docs/migration/record-depth-baseline-v2-pr368-summary.json
docs/migration/tier-a-candidate-queue-v2-pr368.json
```

## Input composition contract

The PR #371 manifest is binding.

```text
ordered profile files: 29
legacy profile files: 15
reviewed overlay files: 14
unique asset IDs: 112
source order: public loader import order
duplicate resolution: last write wins
```

No independently maintained profile list is allowed in PR #372.

## Computation contract

- exactly 112 assets;
- exactly 16 dimensions per asset;
- exactly 1,792 cells;
- PR #367 planning, applicability, and observation semantics remain unchanged;
- complete profile composition is injected into both the base Record Depth calculation and the v2 semantic conversion path;
- all changes relative to PR #368 are recorded deterministically;
- queue ordering remains asset-slug ascending and non-ranking.

## Required outputs

```text
docs/migration/record-depth-baseline-v2-1-pr372.json
docs/migration/record-depth-baseline-v2-1-pr372-summary.json
docs/migration/record-depth-baseline-v2-1-pr372-delta.json
docs/migration/tier-a-candidate-queue-v2-1-pr372.json
```

## Delta requirements

The delta must record:

- planning, applicability, and observation count changes;
- changed cell count;
- changed asset count and IDs;
- before/after cell payloads;
- queue additions, removals, retained candidates, and changed retained candidates;
- the PR #371 affected-asset boundary;
- the exact manifest identity and digest.

## Preservation requirements

The following remain immutable:

```text
PR #353 Record Depth outputs
PR #363 baseline, summary, delta, and queue
PR #367 semantics contract and audit
PR #368 baseline, summary, delta, and queue
PR #369 outcomes and handoff
PR #370 review-gate report
PR #371 manifest and audit
canonical release-integrity checkpoints
```

## Prohibited work

- canonical data changes;
- public output or page changes;
- Market Access or deployment changes;
- rankings, scores, recommendations, or leaderboards;
- automatic monitoring or canonical promotion;
- authorization of a dossier or growth batch.

## Exit condition

PR #372 ends at `REVIEW GATE`. The corrected queue is an internal input to that review and does not itself authorize follow-on work.
