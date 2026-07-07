# PR #325 statistics phase activation

Status: active roadmap amendment  
Updated: 2026-07-08

## Purpose

This amendment records the transition from completed Phase C monitoring operation to active Phase D statistics implementation.

## Superseding current-workstream markers

The following current-workstream state is authoritative:

```text
PR #324 bounded scheduled read-only monitoring: complete
PR #325 deterministic statistics generator and validator: active
PR #326 immutable checkpoint history: next
```

This amendment supersedes stale current-position wording that still describes PR #324 as active or PR #325 as next in subordinate operational documents. Historical descriptions of PR #324 scope and safety rules remain valid.

## PR #325 boundary

Binding specification:

```text
docs/stats-spec.md
```

PR #325 may:

- load reviewed canonical Registry v2 and Registry v3 inputs;
- derive deterministic statistics;
- validate canonical count parity and denominator integrity;
- preserve unknown categories;
- validate multi-select semantics;
- exclude candidate, monitoring, editorial-research, discovery, stale-state, and private inputs;
- emit a private CI artifact for review.

PR #325 does not:

- publish `/data/stats.json`;
- create or mutate immutable `stats-history.json` checkpoints;
- implement `/stats/` UI;
- change canonical registry records;
- ingest live price, market-cap, APY, yield-ranking, safety-score, or risk-score data.

## Phase D sequence

```text
PR #325 deterministic statistics generator and validator — active
PR #326 immutable checkpoint history — next
PR #327 /stats/ foundation
PR #328 historical, deployment, organization, and data-quality statistics
```

## Data preservation

The audited 100-asset canonical checkpoint remains unchanged. `package.json` and `package-lock.json` remain protected by the audited checkpoint contract in PR #325.
