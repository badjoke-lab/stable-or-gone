# Stable or Gone Roadmap

Updated: 2026-07-15  
Status: canonical execution schedule — PR #371 active

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
PR #371 Planning Input Coverage Audit: active; complete on merge
PR #372 Record Depth Baseline v2.1 Refresh: next
REVIEW GATE: required after PR #372
```

The public-surface expansion sequence remains complete. PR #371 is internal planning-input audit work.

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
docs/quality/planning-input-coverage-audit-pr371-spec.md
config/planning-input-coverage-audit-pr371.json
named audit outputs and validators
```

## 3. Approved bounded sequence

```text
PR #371  Planning Input Coverage Audit — active
PR #372  Record Depth Baseline v2.1 Refresh — next
REVIEW GATE
```

No dossier or growth batch is authorized before the next review gate.

## 4. Why PR #371 is required

PR #368 generated six queue candidates and all six had already been reviewed. PR #369 produced zero canonical changes.

The planning code path is incomplete by default:

```text
scripts/growth/build-reviewed-record-depth-baseline-pr353.mjs
  options.profileOverrideFiles defaults to []

scripts/build-record-depth-baseline-v2-refresh-pr368.mjs
  invokes buildReviewedRecordDepthBaseline() without options
```

The public profile loader composes reviewed overlays beyond the legacy registry baseline. PR #371 must inventory that exact composition before another baseline is trusted.

## 5. PR #371 — Planning Input Coverage Audit

Status: active; complete on merge.

Expected source-derived boundary:

```text
public profile loader files: 29
legacy planning profile files: 15
reviewed overlay files omitted by default planning input: 14
```

Required outputs:

```text
docs/migration/planning-input-manifest-pr371.json
docs/migration/planning-input-coverage-audit-pr371.json
scripts/build-planning-input-coverage-audit-pr371.mjs
scripts/validate-planning-input-coverage-audit-pr371.mjs
scripts/check-workstream-128.mjs
.github/workflows/pr371-planning-input-coverage-audit.yml
```

The manifest must preserve exact `currentProfiles.ts` import order and last-write-wins duplicate resolution. Every file receives a content digest and every asset ID receives a winning-file record.

## 6. PR #372 — Record Depth Baseline v2.1 Refresh

PR #372 may begin only after PR #371 merges.

It must:

```text
consume the approved PR #371 manifest
recompute 112 assets × 16 dimensions
preserve PR #353, #363, and #368 checkpoints
emit a corrected internal non-ranking queue
change no canonical data
change no public output
stop at another review gate
```

PR #372 may not use an ad hoc profile file list.

## 7. Data and public boundaries

PR #371 changes no:

```text
data/
src/
public/
canonical records
Evidence identities or relations
Market Access records
deployments
statistics history
Record Depth baselines or queues
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
