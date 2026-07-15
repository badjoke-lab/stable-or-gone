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
docs/roadmap-amendments/2026-07-15-pr372-record-depth-baseline-v2-1-refresh-activation.md
```

Current work-item specification:

```text
docs/quality/record-depth-baseline-v2-1-refresh-pr372-spec.md
```

Current required inputs:

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

## 2. Repository source of truth

Merged repository specifications and reviewed handoffs outrank chat memory, issue discussion, generated prose, stale roadmap text, unmerged drafts, and mock images.

The PR #371 manifest is the only approved planning profile input boundary for PR #372. An ad hoc profile list is prohibited.

## 3. Current workstream

```text
Canonical stable assets: 112
PR #367 Planning Dimension Semantics Audit: complete
PR #368 Record Depth Baseline v2 Refresh: complete
PR #369 Tier A Dossier Deepening Batch 5: complete
PR #370 Post-PR #369 Review Gate: complete
PR #371 Planning Input Coverage Audit: complete
PR #372 Record Depth Baseline v2.1 Refresh: active; complete on merge
REVIEW GATE: next and mandatory
```

Approved sequence:

```text
PR #371  Planning Input Coverage Audit — complete
PR #372  Record Depth Baseline v2.1 Refresh — active
REVIEW GATE
```

No dossier, archive-maintenance, Market Access, record-growth, or public-surface work is authorized before the next review gate.

## 4. PR #371 binding result

```text
public profile input files: 29
legacy planning profile files: 15
reviewed overlay files omitted by default planning input: 14
public unique asset IDs: 112
legacy unique asset IDs: 82
duplicate asset IDs: 5
affected asset IDs: 35
source order: public loader import order
duplicate resolution: last write wins
```

Binding manifest:

```text
docs/migration/planning-input-manifest-pr371.json
```

## 5. PR #372 exact authority

PR #372 must:

- consume the exact PR #371 manifest;
- recompute exactly 112 assets × 16 dimensions = 1,792 cells;
- retain the PR #367 planning/applicability/observation semantics;
- preserve PR #353, #363, and #368 checkpoints;
- produce deterministic v2.1 baseline, summary, delta, and queue outputs;
- record every changed cell and queue change relative to PR #368;
- keep the queue internal, non-ranking, and manual-review-only;
- stop at `REVIEW GATE`.

Required outputs:

```text
docs/migration/record-depth-baseline-v2-1-pr372.json
docs/migration/record-depth-baseline-v2-1-pr372-summary.json
docs/migration/record-depth-baseline-v2-1-pr372-delta.json
docs/migration/tier-a-candidate-queue-v2-1-pr372.json
```

## 6. Input injection rule

The internal registry loader may accept the environment variable:

```text
SOG_PLANNING_PROFILE_MANIFEST=docs/migration/planning-input-manifest-pr371.json
```

The loader must validate the reviewed manifest status, ordered paths, path safety, uniqueness, and file existence before replacing the planning-only profile group.

Default loader behavior without this variable must remain unchanged.

## 7. Canonical and public boundary

PR #372 may change only internal planning loader support, configuration, authority, deterministic builders, generated internal outputs, validators, and workflow files.

It may not add or change:

```text
data/
src/
public/
canonical assets
Evidence identities or Evidence Relations
Market Access records
deployments
statistics history
public pages or machine-readable outputs
rankings, scores, recommendations, or leaderboards
automatic monitoring or canonical promotion
```

## 8. Historical preservation

Do not rewrite:

```text
PR #353 and #363 planning checkpoints
PR #367 semantics contract and audit
PR #368 baseline, summary, delta, or queue
PR #369 outcomes and handoff
PR #370 review-gate report
PR #371 manifest and audit
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
