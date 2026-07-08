# PR #329 next-growth candidate audit activation

Status: active roadmap amendment  
Updated: 2026-07-08

## Purpose

This amendment records the transition from completed Phase D statistics implementation to the Phase E candidate-audit gate before controlled growth from 100 to 110 canonical assets.

It supersedes stale current-position wording that still describes PR #328 as active or PR #329 as next.

## Authoritative current workstream

```text
PR #325 deterministic statistics generator and validator: complete
PR #326 immutable checkpoint history: complete
PR #327 /stats/ foundation: complete
PR #328 statistics analysis expansion: complete
PR #329 next-growth candidate audit: active
PR #330 100 -> 102 controlled growth: next
```

## Binding candidate audit files

```text
data/next-growth-candidate-audit-pr329.json
docs/quality/next-growth-candidate-audit-pr329-spec.md
scripts/validate-next-growth-candidate-audit-pr329.mjs
```

## PR #329 boundary

PR #329 may:

- select and document candidate IDs 101 through 110;
- record identity, lifecycle, mechanism, reserve, redemption, deployment, event, evidence-lead, and blocking-unknown research dimensions;
- document explicit duplicate decisions;
- allocate exactly two candidates to each growth PR #330 through #334;
- add deterministic validation and read-only CI for the audit.

PR #329 does not:

- promote candidates into canonical records;
- change the canonical 100-asset denominator;
- add canonical organizations, events, evidence, or deployments;
- append a statistics-history checkpoint;
- publish candidate research;
- change production routes or Cloudflare configuration.

## Phase E controlled growth sequence

```text
PR #329 candidate audit — active
PR #330 100 -> 102 — next
PR #331 102 -> 104
PR #332 104 -> 106
PR #333 106 -> 108
PR #334 108 -> 110
```

## Completion condition

PR #329 completes when:

- exactly ten reviewed candidates are allocated;
- candidate IDs are exactly 101 through 110;
- canonical ID and slug collisions are rejected;
- every candidate has at least three official HTTPS evidence leads;
- blocking unknowns remain explicit;
- growth transitions are continuous from 100 to 110;
- each growth PR owns exactly two candidates;
- canonical stablecoin count remains exactly 100;
- canonical write and public-output policy remain disabled;
- dedicated CI and general CI are green.

## Data preservation

The audited 100-asset canonical checkpoint remains unchanged. The candidate audit is private research/control material and is not a public registry source.
