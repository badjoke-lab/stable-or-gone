# Stable or Gone Agent Instructions

This file is the mandatory current-authority entry point for humans, AI agents, and automation working in this repository.

The full instruction file that governed the repository through merged PR #366 is preserved byte-for-byte at:

```text
docs/archive/AGENTS-through-pr366.md
```

That archive is historical evidence. It does not override current authority.

## 1. Required reading order

Before changing code, canonical data, workflows, monitoring, or documentation, read:

1. `AGENTS.md`
2. `docs/spec-governance.md`
3. `docs/roadmap.md`
4. `docs/deployment-policy.md`
5. `docs/post-351-data-growth-operating-spec.md`
6. active roadmap amendments
7. the active work-item specification
8. every named baseline, queue, reviewed handoff, validator, audit, manifest, and prior output

Current active amendments:

```text
docs/roadmap-amendments/2026-07-10-post-351-data-growth-activation.md
docs/roadmap-amendments/2026-07-15-pr370-post-pr369-review-gate.md
docs/roadmap-amendments/2026-07-15-pr371-planning-input-coverage-audit-activation.md
```

Current work-item specification:

```text
docs/quality/planning-input-coverage-audit-pr371-spec.md
```

Current required inputs:

```text
config/planning-input-coverage-audit-pr371.json
docs/migration/post-pr369-review-gate-pr370.json
src/lib/data/currentProfiles.ts
src/lib/data/stablecoinProfiles.ts
docs/migration/registry-v2-baseline.json
scripts/growth/build-reviewed-record-depth-baseline-pr353.mjs
scripts/build-record-depth-baseline-v2-refresh-pr368.mjs
docs/migration/current-canonical-checkpoint.json
```

## 2. Repository source of truth

Merged repository specifications and reviewed handoffs outrank chat memory, issue discussion, generated prose, stale roadmap text, unmerged drafts, and mock images.

The public profile composition in `src/lib/data/currentProfiles.ts` is the current reviewed loader boundary. PR #371 may audit that boundary but may not edit it.

## 3. Current workstream

```text
Canonical stable assets: 112
PR #367 Planning Dimension Semantics Audit: complete
PR #368 Record Depth Baseline v2 Refresh: complete
PR #369 Tier A Dossier Deepening Batch 5: complete
PR #370 Post-PR #369 Review Gate: complete
PR #371 Planning Input Coverage Audit: active; complete on merge
PR #372 Record Depth Baseline v2.1 Refresh: next after PR #371
REVIEW GATE: required after PR #372
```

Approved sequence:

```text
PR #371  Planning Input Coverage Audit — active
PR #372  Record Depth Baseline v2.1 Refresh — next
REVIEW GATE
```

Do not skip ahead. PR #372 may start only from the merged PR #371 manifest and audit.

## 4. PR #371 exact authority

PR #371 must inventory and compare:

```text
public profile loader files
legacy registry baseline profile files
planning-builder default profile inputs
reviewed overlay inputs
asset-ID duplicate occurrences
last-write-wins asset winners
```

Required outputs:

```text
docs/migration/planning-input-manifest-pr371.json
docs/migration/planning-input-coverage-audit-pr371.json
scripts/build-planning-input-coverage-audit-pr371.mjs
scripts/validate-planning-input-coverage-audit-pr371.mjs
```

Expected source-derived boundary:

```text
public loader files: 29
legacy planning files: 15
reviewed overlay files omitted by default planning input: 14
```

These values must be derived and validated. They are not permission to edit `src/` or `data/`.

## 5. Composition semantics

The approved planning input manifest must reproduce `currentProfiles.ts` exactly:

```text
source order: public loader import order
duplicate resolution: last write wins
file identity: path + SHA-256
row identity: non-empty asset id
```

For every asset ID, the manifest records the winning file and every superseded file. A duplicate occurrence is allowed only when deterministic last-write-wins composition is preserved.

## 6. Canonical and public boundary

PR #371 may change only internal audit, manifest, authority, validator, and workflow files.

It may not change:

```text
data/
src/
public/
canonical assets
Evidence identities or Evidence Relations
Market Access records
deployments
statistics history
Record Depth baselines or queues
public pages or machine-readable outputs
rankings, scores, recommendations, or leaderboards
automatic monitoring or canonical promotion
```

## 7. PR #372 boundary

After PR #371 merges, PR #372 may:

- consume the exact approved manifest;
- recompute 112 assets × 16 dimensions;
- preserve PR #353, #363, and #368 checkpoints;
- emit a corrected internal non-ranking queue;
- change no canonical or public data;
- stop at another review gate.

PR #372 may not begin from an ad hoc file list.

## 8. Historical preservation

Do not rewrite:

```text
PR #353 and #363 planning checkpoints
PR #367 semantics contract and audit
PR #368 baseline, summary, delta, or queue
PR #369 outcomes and handoff
PR #370 review-gate report
prior dossier handoffs
canonical release-integrity checkpoints
closed statistics or Maintenance Log history
```

## 9. Not approved

```text
Tier A Dossier Deepening Batch 6
Evidence and Archive Maintenance Batch 3
Market Access Pilot 3
Record Growth Batch 2
new canonical asset
new deployment family
new public page or explorer
asset ranking or composite score
automatic monitoring promotion
automatic canonical promotion
```

## 10. Mandatory PR traceability

Every non-trivial PR must identify:

```text
Specification references
Roadmap item
Scope
Explicit non-goals
Named inputs and prior outputs
Data preservation
Validation
Deployment classification
```

A PR without approved authority must pause.
