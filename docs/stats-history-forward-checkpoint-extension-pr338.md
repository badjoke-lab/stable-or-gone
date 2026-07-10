# SOG statistics history forward checkpoint extension — PR #338

Status: canonical forward-extension specification  
Migration identifier: `stats_history_forward_checkpoint_extension_pr338_2026_07_10`  
Updated: 2026-07-10

## 1. Purpose

The immutable statistics history created by PR #326 originally assumed that every reviewed checkpoint increased the canonical asset count.

PR #338 proves that a reviewed canonical normalization can change the deterministic statistics model while the asset denominator remains unchanged. Rewriting the existing 110-asset PR #335 snapshot would violate append-only immutability, while rejecting the new deterministic state would make statistics validation fail.

This specification extends the history contract forward without rewriting, reordering, or deleting any existing snapshot.

## 2. Preserved invariants

The following rules remain unchanged:

- every existing base-branch snapshot remains an exact prefix;
- checkpoint IDs are unique;
- recorded dates are non-decreasing;
- asset counts may never decrease;
- snapshot hashes and statistics-model hashes remain mandatory;
- a current deterministic reviewed checkpoint must exist in history and match exactly;
- history remains `append_only_reviewed_pr`;
- snapshots are not added for ordinary builds or deployments.

## 3. Extended ordering rule

For forward checkpoints after this extension:

```text
asset_count is non-decreasing
recorded_at is non-decreasing
checkpoint_id is unique
```

A repeated `asset_count` is allowed only when all of the following are true:

```text
checkpoint_kind: non_growth_normalization_checkpoint
source_checkpoint_id: immediately preceding history checkpoint ID
asset_count: equal to immediately preceding history checkpoint asset_count
```

A same-count checkpoint must source the immediately preceding history checkpoint. A `non_growth_normalization_checkpoint` may not increase the asset count.

## 4. PR #338 checkpoint

The explicit metadata source is:

```text
docs/migration/current-stats-history-checkpoint.json
```

Binding values:

```text
checkpoint_id: sog_comparison_readiness_normalization_110_checkpoint_pr338_2026_07_10
checkpoint_kind: non_growth_normalization_checkpoint
asset_count: 110
source_checkpoint_id: sog_controlled_growth_110_checkpoint_pr335_2026_07_09
normalization_pr: 338
```

The source PR #335 110-asset snapshot remains immutable. PR #338 appends a seventh snapshot at the same 110-asset denominator.

## 5. Deterministic snapshot construction

`scripts/stats/build-history-snapshot.mjs` continues to generate the deterministic statistics model from the canonical registry checkpoint and canonical data.

When `docs/migration/current-stats-history-checkpoint.json` exists, the history snapshot builder must additionally bind:

- the explicit history checkpoint ID;
- checkpoint kind;
- source checkpoint ID;
- reviewed recorded date;
- reviewed registry-version label.

The deterministic statistics model hash still hashes the generated statistics model. The history snapshot hash hashes the complete snapshot object, including non-growth checkpoint metadata.

## 6. Validation contract

`scripts/validate-stats-history.mjs` must:

- preserve exact-prefix immutability against the base branch;
- reject decreasing asset counts;
- accept an equal asset count only for the explicit non-growth form;
- reject a same-count checkpoint whose source is not the immediately preceding history checkpoint;
- reject a non-growth checkpoint that increases the denominator;
- validate the explicit current stats-history metadata against the deterministic current snapshot;
- require the appended PR #338 snapshot to match deterministic generation exactly.

## 7. Non-goals

This extension does not:

- rewrite the PR #335 110-asset snapshot;
- reinterpret historical snapshots;
- create retroactive checkpoints;
- permit arbitrary duplicate asset-count rows;
- change canonical record counts;
- change Comparison Readiness semantics;
- change Market Access schema or governance;
- auto-append snapshots in CI.

## 8. Completion condition

The extension is complete when:

1. all six existing 100/102/104/106/108/110 snapshots remain an exact prefix;
2. the PR #338 110-asset normalization checkpoint is appended as snapshot seven;
3. deterministic current snapshot generation matches snapshot seven exactly;
4. immutable-history validation passes against `origin/main`;
5. general CI, statistics foundation, statistics analysis, and the dedicated PR #338 workflow are green.
