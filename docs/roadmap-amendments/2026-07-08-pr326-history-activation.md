# PR #326 immutable statistics history activation

Status: active roadmap amendment  
Updated: 2026-07-08

## Purpose

This amendment records the transition from completed deterministic statistics generation to active immutable checkpoint history.

## Authoritative current workstream

```text
PR #325 deterministic statistics generator and validator: complete
PR #326 immutable checkpoint history: active
PR #327 /stats/ foundation: next
```

This amendment supersedes stale current-position wording that still describes PR #325 as active or PR #326 as next in subordinate operational documents.

## PR #326 boundary

Binding specifications:

```text
docs/stats-spec.md
docs/stats-history-spec.md
```

PR #326 may:

- create the first reviewed 100-asset statistics history snapshot;
- define append-only checkpoint ordering;
- define checkpoint and snapshot hashes;
- generate a current checkpoint snapshot candidate;
- validate current deterministic stats against the stored history snapshot;
- validate base-branch history as an immutable prefix;
- reject deletion, reordering, or rewriting of prior snapshots.

PR #326 does not:

- append on every build;
- reconstruct unaudited retroactive checkpoints;
- modify PR #325 deterministic statistics semantics;
- implement `/stats/` UI;
- add live market metrics;
- modify canonical registry records.

## Phase D sequence

```text
PR #325 deterministic statistics generator and validator — complete
PR #326 immutable checkpoint history — active
PR #327 /stats/ foundation — next
PR #328 historical, deployment, organization, and data-quality statistics
```

## Data preservation

The audited 100-asset canonical checkpoint remains unchanged. `package.json` and `package-lock.json` remain protected and unchanged in PR #326.
