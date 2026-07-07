# SOG immutable statistics checkpoint history specification

Status: canonical implementation specification — PR #326  
Updated: 2026-07-08

## 1. Purpose

`data/stats-history.json` stores reviewed immutable statistics checkpoint snapshots.

It is not a build log and must not receive a snapshot on every deployment or every statistics generation run.

A checkpoint snapshot is added only through a reviewed pull request tied to an explicit registry checkpoint.

## 2. Source boundary

Snapshots derive from the deterministic statistics model implemented by PR #325:

```text
scripts/build-stats.mjs
scripts/stats/build-stats-model.mjs
scripts/stats/build-history-snapshot.mjs
```

The history snapshot builder may generate a candidate snapshot. It must not modify `data/stats-history.json` automatically.

## 3. History file contract

Canonical source file:

```text
data/stats-history.json
```

Top-level shape:

```json
{
  "schema_version": "1.0",
  "history_id": "sog_stats_checkpoint_history_v1",
  "checkpoint_policy": "append_only_reviewed_pr",
  "snapshots": []
}
```

## 4. Snapshot shape

Each snapshot records:

```text
checkpoint_id
recorded_at
asset_count
registry_version
input_digest_sha256
stats_model_sha256
totals
lifecycle.groups
lifecycle.statuses
lifecycle.transitions
data_quality.coverage
data_quality.evidence_per_asset
data_quality.known_unknowns
data_quality.verification_recency
data_quality.typed_event_details
snapshot_sha256
```

The snapshot intentionally records stable trend and coverage surfaces. The full current statistics model remains derived separately.

## 5. Ordering contract

Snapshots are ordered by checkpoint progression.

Current v1 rule:

```text
asset_count strictly increases
recorded_at is non-decreasing
checkpoint_id is unique
asset_count is unique
```

Suggested future checkpoint counts from `docs/stats-spec.md` remain guidance, not permission to fabricate retroactive snapshots.

The first reviewed history entry is the audited 100-asset checkpoint. Earlier 20/28/32/36/40/70 checkpoints are not reconstructed unless a future explicit historical reconstruction specification is approved.

## 6. Immutability contract

For a normal history append PR:

```text
all snapshots already present on the base branch must remain an exact prefix
existing snapshot bytes/values must not be rewritten
existing snapshots must not be reordered
existing snapshots must not be deleted
new snapshots may only be appended
```

A deliberate historical migration requires a separate specification, explicit migration identifier, and dedicated validator change. Normal PR #326+ operation does not permit silent historical rewrite.

## 7. Hash contract

Each snapshot includes:

```text
input_digest_sha256
stats_model_sha256
snapshot_sha256
```

`stats_model_sha256` hashes the deterministic PR #325 model serialized with `JSON.stringify(model)`.

`snapshot_sha256` hashes the snapshot object serialized with `JSON.stringify(snapshot_without_snapshot_sha256)`.

All hashes are lowercase SHA-256 hexadecimal strings.

## 8. Current 100-asset checkpoint

The first history snapshot is derived from:

```text
checkpoint_id:
sog_audited_100_asset_checkpoint_pr318_2026_07_06

recorded_at:
2026-07-06

asset_count:
100
```

It preserves the reviewed 100-asset canonical boundary and PR #325 deterministic statistics model.

## 9. Validation contract

`scripts/validate-stats-history.mjs` must fail when:

- top-level schema or policy identifiers differ;
- snapshots are missing;
- checkpoint IDs repeat;
- asset-count checkpoints repeat;
- asset counts are not strictly increasing;
- dates move backwards;
- required SHA-256 fields are invalid;
- snapshot hash verification fails;
- totals.assets differs from asset_count;
- lifecycle groups do not sum to asset_count;
- lifecycle statuses do not sum to asset_count;
- lifecycle transition counts disagree with canonical status counts;
- coverage percentages disagree with count/denominator values;
- the current deterministic checkpoint snapshot is missing;
- the current history entry differs from the current deterministic stats-derived snapshot;
- a base-branch historical prefix is deleted, reordered, or rewritten.

## 10. CI contract

General CI validates current history consistency.

Dedicated workflow:

```text
.github/workflows/immutable-statistics-history.yml
```

The dedicated workflow uses full Git history and validates the base-branch history as an immutable prefix.

Required permission:

```text
contents: read
```

The workflow may upload validation artifacts only.

## 11. Public-output boundary

PR #326 creates and validates the canonical history source file but does not yet implement `/stats/` UI.

Public machine-readable route wiring remains part of the later statistics presentation sequence. PR #327 remains `/stats/` foundation.

## 12. Explicit non-goals

PR #326 does not:

- add a checkpoint on every build;
- auto-append history from monitoring output;
- reconstruct unaudited retroactive checkpoints;
- modify canonical stablecoin records;
- modify deterministic PR #325 statistics semantics;
- add `/stats/` UI;
- add live market metrics;
- add price, market cap, APY, safety score, or risk score.

## 13. Completion condition

PR #326 is complete when:

```text
100-asset checkpoint snapshot exists
snapshot hashes validate
current deterministic stats match the 100-asset history entry
history ordering checks pass
base-prefix immutability checks pass
general CI validates current history
dedicated immutable-history workflow passes
package.json and package-lock.json remain unchanged
canonical registry counts remain unchanged
authority shows PR #326 active / PR #327 next
full CI and independent audit workflows are green
```
