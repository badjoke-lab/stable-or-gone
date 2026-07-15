# PR #372 Record Depth Baseline v2.1 Refresh Activation

Date: 2026-07-15
Status: active authority amendment
Public output: no

## Authority

Merged PR #370 authorized exactly:

```text
PR #371 Planning Input Coverage Audit
PR #372 Record Depth Baseline v2.1 Refresh
REVIEW GATE
```

PR #371 is complete and produced the reviewed manifest:

```text
docs/migration/planning-input-manifest-pr371.json
```

The manifest fixes the complete planning profile composition at:

```text
public profile input files: 29
legacy profile files: 15
reviewed overlay files: 14
composition order: public loader import order
duplicate resolution: last write wins
resolved asset IDs: 112
```

## PR #372 scope

PR #372 must:

- consume the exact PR #371 manifest, not an ad hoc file list;
- recompute exactly 112 assets × 16 dimensions = 1,792 cells;
- use the existing PR #367 semantics contract;
- preserve PR #353, #363, and #368 outputs byte-for-byte;
- emit a v2.1 baseline, summary, delta, and corrected non-ranking queue;
- record every cell and queue change relative to PR #368;
- change no canonical data and no public surface;
- end at a review gate.

## Required outputs

```text
docs/migration/record-depth-baseline-v2-1-pr372.json
docs/migration/record-depth-baseline-v2-1-pr372-summary.json
docs/migration/record-depth-baseline-v2-1-pr372-delta.json
docs/migration/tier-a-candidate-queue-v2-1-pr372.json
```

## Prohibited work

PR #372 may not add or edit canonical assets, Evidence, Evidence Relations, deployments, Market Access records, statistics history, public pages, rankings, scores, recommendations, or automatic promotion rules.

No Tier A Dossier Batch 6 or other numbered work item is authorized before the next review gate.
