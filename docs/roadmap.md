# Stable or Gone Roadmap

Updated: 2026-07-15  
Status: canonical execution schedule — PR #372 active

The full roadmap that governed the repository through merged PR #366 is preserved byte-for-byte at:

```text
docs/archive/roadmap-through-pr366.md
```

That archive is historical evidence. This file is the current execution schedule.

## 1. Current position

```text
Canonical stable assets: 112
Organizations: 107
Relationships: 124
Events: 187
Evidence: 559
Evidence Relations: 559
Deployments: 174
Market Access Records: 8
Archive recorded: 390
Archive not recorded: 169

PR #367 Planning Dimension Semantics Audit: complete
PR #368 Record Depth Baseline v2 Refresh: complete
PR #369 Tier A Dossier Deepening Batch 5: complete
PR #370 Post-PR #369 Review Gate: complete
PR #371 Planning Input Coverage Audit: complete
PR #372 Record Depth Baseline v2.1 Refresh: active; complete on merge
REVIEW GATE: next and mandatory
```

The public-surface expansion sequence remains complete. PR #372 is internal planning-baseline correction work.

## 2. Current authority

Read in this order:

```text
AGENTS.md
docs/spec-governance.md
docs/roadmap.md
docs/deployment-policy.md
docs/post-351-data-growth-operating-spec.md
docs/roadmap-amendments/2026-07-15-pr370-post-pr369-review-gate.md
docs/migration/post-pr369-review-gate-pr370.json
docs/roadmap-amendments/2026-07-15-pr371-planning-input-coverage-audit-activation.md
docs/migration/planning-input-manifest-pr371.json
docs/migration/planning-input-coverage-audit-pr371.json
docs/roadmap-amendments/2026-07-15-pr372-record-depth-baseline-v2-1-refresh-activation.md
docs/quality/record-depth-baseline-v2-1-refresh-pr372-spec.md
config/record-depth-baseline-v2-1-refresh-pr372.json
```

## 3. Approved bounded sequence

```text
PR #371  Planning Input Coverage Audit — complete
PR #372  Record Depth Baseline v2.1 Refresh — active
REVIEW GATE
```

No dossier or growth batch is authorized before the next review gate.

## 4. PR #371 completed finding

PR #371 established the exact planning input gap:

```text
public profile input files: 29
legacy planning profile files: 15
reviewed overlay files omitted by default planning input: 14
public unique asset IDs: 112
legacy unique asset IDs: 82
asset IDs absent from legacy input: 30
asset IDs with a changed last-write-wins winner: 5
affected asset IDs: 35
```

Composition semantics:

```text
source order: public loader import order
duplicate resolution: last write wins
```

Binding manifest:

```text
docs/migration/planning-input-manifest-pr371.json
```

## 5. PR #372 — Record Depth Baseline v2.1 Refresh

Status: active; complete on merge.

PR #372 must:

```text
consume the approved PR #371 manifest
recompute 112 assets × 16 dimensions = 1,792 cells
preserve PR #353, #363, and #368 checkpoints
retain PR #367 semantics
emit a corrected internal non-ranking queue
record cell and queue changes relative to PR #368
change no canonical data
change no public output
stop at another review gate
```

Required outputs:

```text
docs/migration/record-depth-baseline-v2-1-pr372.json
docs/migration/record-depth-baseline-v2-1-pr372-summary.json
docs/migration/record-depth-baseline-v2-1-pr372-delta.json
docs/migration/tier-a-candidate-queue-v2-1-pr372.json
```

PR #372 may not use an ad hoc profile file list.

## 6. Validation boundary

The PR must prove:

- manifest identity and content digest are bound into the v2.1 output;
- all 29 profile files are consumed in exact order;
- default loader behavior remains unchanged without manifest injection;
- exactly 112 assets, 16 dimensions, and 1,792 cells are emitted;
- historical outputs remain byte-identical;
- `data/`, `src/`, and `public/` remain unchanged;
- the corrected queue is non-ranking and does not authorize follow-on work;
- Astro check and build succeed.

## 7. Data and public boundaries

PR #372 changes no:

```text
data/
src/
public/
canonical records
Evidence identities or relations
Market Access records
deployments
statistics history
public pages or machine-readable outputs
```

Its outputs remain internal planning infrastructure.

## 8. Historical preservation

Do not rewrite:

```text
PR #353 and #363 planning checkpoints
PR #367 semantics contract and audit
PR #368 baseline, summary, delta, or queue
PR #369 outcomes and handoff
PR #370 review-gate report
PR #371 manifest and audit
prior reviewed dossier handoffs
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

## 10. Next gate

After PR #372, stop and review the corrected queue, complete input manifest, source availability, archive maintenance burden, Market Access breadth, monitoring usefulness, monthly maintenance burden, and verified external usage evidence before authorizing another numbered sequence.
