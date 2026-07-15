# Stable or Gone Agent Instructions

This file is the mandatory current-authority entry point for humans, AI agents, and automation working in this repository.

The full instruction file that governed the repository through merged PR #366 is preserved byte-for-byte at:

```text
docs/archive/AGENTS-through-pr366.md
```

That archive is historical evidence. It does not override the current authority below.

## 1. Required reading order

Before changing code, canonical data, workflows, monitoring, or documentation, read in this order:

1. `AGENTS.md`
2. `docs/spec-governance.md`
3. `docs/roadmap.md`
4. `docs/deployment-policy.md`
5. `docs/post-351-data-growth-operating-spec.md`
6. every active roadmap amendment named below
7. the current work-item specification
8. every named baseline, contract, queue, validator, audit, fixture, research checkpoint, release note, or prior output required by that work item

Current active amendments:

```text
docs/roadmap-amendments/2026-07-10-post-351-data-growth-activation.md
docs/roadmap-amendments/2026-07-15-pr366-post-pr365-review-gate.md
docs/roadmap-amendments/2026-07-15-pr367-planning-dimension-semantics-audit-activation.md
```

Current operating specification:

```text
docs/post-351-data-growth-operating-spec.md
```

Current work-item specification:

```text
docs/quality/planning-dimension-semantics-audit-pr367-spec.md
```

Current required prior outputs and contracts:

```text
docs/migration/post-pr365-review-gate-pr366.json
docs/migration/record-depth-baseline-pr363-summary.json
docs/migration/tier-a-batch-4-pr364-reviewed-handoff.json
docs/migration/evidence-archive-maintenance-batch-2-pr365-reviewed-handoff.json
config/record-depth-baseline-v1.json
scripts/growth/build-record-depth-baseline-pr353.mjs
scripts/growth/build-reviewed-record-depth-baseline-pr353.mjs
```

## 2. Repository source of truth

Merged repository specifications outrank chat memory, handoff prose, issue discussion, generated reports, stale roadmap text, unmerged drafts, and mock images.

PR numbering, active workstream state, and next approved work come from `docs/roadmap.md` plus the active amendments named there. Do not infer the schedule from old PR numbers in historical documents.

The historical files below preserve superseded detail and must not be treated as current authority:

```text
docs/archive/AGENTS-through-pr366.md
docs/archive/roadmap-through-pr366.md
```

## 3. Current workstream

```text
Canonical stable assets: 112
PR #365 Evidence and Archive Maintenance Batch 2: complete
PR #366 Post-PR #365 Review Gate: complete
PR #367 Planning Dimension Semantics Audit: active; complete on merge
PR #368 Record Depth Baseline v2 Refresh: next after PR #367
PR #369 Tier A Dossier Deepening Batch 5: after PR #368; maximum five existing assets
REVIEW GATE: required after PR #369
```

Approved bounded sequence from PR #366:

```text
PR #367  Planning Dimension Semantics Audit
PR #368  Record Depth Baseline v2 Refresh
PR #369  Tier A Dossier Deepening Batch 5 — maximum five existing assets
REVIEW GATE
```

Do not skip ahead. PR #368 may start only from the merged PR #367 semantics contract. PR #369 may start only from the merged PR #368 non-ranking baseline and queue.

## 4. PR #367 exact authority

PR #367 must review all 16 planning dimensions and define the operational distinction between:

```text
strong
usable
partial
sparse
absent
not_applicable
```

It must also separate planning quality from two orthogonal axes:

```text
applicability state
observation/source-support state
```

The audit must explicitly distinguish a genuine applicable gap from an out-of-scope dimension, an unobserved dimension, and a source-unavailable dimension.

Required PR #367 outputs:

```text
config/planning-dimension-semantics-pr367.json
config/planning-dimension-semantics-v2.json
docs/migration/planning-dimension-semantics-audit-pr367.json
docs/quality/planning-dimension-semantics-audit-pr367-spec.md
docs/roadmap-amendments/2026-07-15-pr367-planning-dimension-semantics-audit-activation.md
scripts/build-planning-dimension-semantics-audit-pr367.mjs
scripts/validate-planning-dimension-semantics-audit-pr367.mjs
```

PR #367 may update internal planning contracts, active-workstream pointers, validators, and workflows. It may not recompute the 112-asset v2 baseline; that belongs to PR #368.

## 5. Planning semantics boundary

Historical v1 planning material remains immutable:

```text
config/record-depth-baseline-v1.json
docs/migration/record-depth-baseline-pr353-summary.json
docs/migration/tier-a-candidate-queue-pr353.json
docs/migration/record-depth-baseline-pr363-summary.json
docs/migration/record-depth-baseline-pr363-delta.json
docs/migration/tier-a-candidate-queue-pr363.json
```

The v2 semantics contract is internal planning infrastructure. It is not canonical asset data, a risk score, a safety score, a quality ranking, a transparency ranking, a numeric composite score, an asset rank, an investment recommendation, or a public leaderboard.

`not_applicable` means not applicable to the current reviewed planning scope. It must never be used to hide missing research. `absent` means the dimension is applicable and no canonical representation is present; it does not assert real-world nonexistence. `unobserved` and `source_unavailable` are observation states, not quality scores and not negative factual claims.

## 6. Canonical data and evidence rules

- Keep unknown values unknown unless reviewed evidence supports a value.
- Do not coerce partial-date evidence into a day-level date.
- Preserve evidence relations, known unknowns, deployments, source identities, and value states.
- Canonical counts change only through explicit audited data PRs.
- Missing evidence is not permission to fill a planning gap.
- Archive absence is a maintenance queue item, not permission to fabricate an archive URL.
- Missing capability data means unknown knowledge state, not `false`.
- A registered source or monitoring observation is not an accepted canonical baseline.

Protected unresolved states include:

```text
null
unknown
not_recorded
not_applicable
source_review_needed
unclear
```

## 7. Public and deployment boundary

Public release claims remain canonical-only:

```text
canonical_only = true
includes_unreviewed_candidates = false
includes_internal_monitoring = false
includes_private_notes = false
```

PR #367 and PR #368 may change no canonical records, `src/` product surface, or `public/` output. Their reports and contracts remain internal and non-public.

Normal merged changes publish from `main` under `docs/deployment-policy.md`. Internal planning files must not be copied into public build output.

## 8. Monitoring and Market Access

Monitoring remains private, review-only, and read-only with respect to canonical data. It may not write canonical data, self-accept baselines, edit guides automatically, create canonical pull requests automatically, publish candidates, or deploy.

Market Access remains function-, platform-, jurisdiction-, asset-, effective-date-, and evidence-scoped. A platform licence is not proof that a specific asset/function combination is available. No Market Access Pilot 3 or new public Market Access surface is approved in the current sequence.

## 9. Dossier and growth boundary

PR #369 may select no more than five existing assets from the PR #368 non-ranking queue and may improve only source-supported material dossier gaps.

The current sequence does not authorize:

```text
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

## 10. Historical checkpoint rules

Do not rewrite historical checkpoints because current canonical data, planning semantics, or dossier depth changed.

Binding historical material includes release-integrity baselines, reproducible-build baselines, audited asset checkpoints, monitoring snapshots, statistics history, PR #353 and PR #363 planning snapshots, prior reviewed handoffs, and closed Maintenance Log months.

The archived governance files are retained to preserve the complete prior execution record. New current-authority files may be shorter, but the archived blobs must remain unchanged.

## 11. Mandatory PR traceability

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

A PR that cannot identify its roadmap item and governing specification must pause.
