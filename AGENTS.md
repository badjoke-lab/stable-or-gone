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
docs/roadmap-amendments/2026-07-15-pr376-post-pr375-review-gate.md
docs/roadmap-amendments/2026-07-15-pr377-evidence-archive-review-history-contract-activation.md
```

Current work-item specification:

```text
docs/quality/evidence-archive-review-history-contract-pr377-spec.md
```

Current required inputs:

```text
config/evidence-archive-review-history-v1-pr377.json
docs/migration/evidence-correction-outcomes-pr360.json
docs/migration/evidence-archive-maintenance-outcomes-pr365.json
docs/migration/evidence-archive-maintenance-batch-2-pr365-reviewed-handoff.json
docs/migration/current-canonical-checkpoint.json
docs/migration/post-pr375-review-gate-pr376.json
```

## 2. Repository source of truth

Merged repository specifications and reviewed handoffs outrank chat memory, issue discussion, generated prose, stale roadmap text, unmerged drafts, and mock images.

Archive review history is internal planning authority. It does not alter canonical Evidence or prove that a future archive capture exists.

## 3. Current workstream

```text
Canonical stable assets: 112
Canonical Evidence: 559
PR #376 Post-PR #375 Review Gate: complete
PR #377 Evidence Archive Review-History Contract Audit: active; complete on merge
PR #378 Evidence Archive Maintenance Queue v2 Refresh: next after PR #377
REVIEW GATE: mandatory after PR #378
```

Approved sequence:

```text
PR #377  Evidence Archive Review-History Contract Audit — active
PR #378  Evidence Archive Maintenance Queue v2 Refresh — next
REVIEW GATE
```

## 4. Binding problem statement

```text
archive recorded: 390
archive not recorded: 169
PR #360 selected / changed / no-safe: 10 / 8 / 2
PR #365 selected / changed / no-safe: 10 / 3 / 7
```

The prior queue excluded PR #360 selection but did not consume all reviewed outcomes. Reviewed unresolved Evidence can therefore recur without a new capture or replacement signal.

## 5. PR #377 exact authority

PR #377 must:

- inventory PR #360 and PR #365 outcomes by canonical Evidence ID;
- resolve the latest reviewed event as effective;
- distinguish archive present, invalid archive removed, and reviewed no-safe-change outcomes;
- suppress reviewed unresolved Evidence until a reviewed exact-capture or source-replacement signal exists;
- prohibit automatic time expiry;
- prohibit queue presence, HTTP status movement, unreviewed Wayback results, and unreviewed URL changes as reactivation signals;
- emit deterministic manifest and audit outputs;
- generate no archive queue;
- change no canonical or public data.

Expected inventory:

```text
history sources: 2
history events: 20
reviewed Evidence identities: 20
archive present: 10
invalid archive removed: 1
reviewed no-safe-change: 9
currently reviewed unresolved archive gaps: 10
```

## 6. Required outputs

```text
docs/migration/evidence-archive-review-history-manifest-pr377.json
docs/migration/evidence-archive-review-history-audit-pr377.json
```

PR #378 may consume only the reviewed PR #377 contract, manifest, and audit.

## 7. Canonical and public boundary

PR #377 may change only internal authority, configuration, deterministic builders, generated internal outputs, validators, and workflow files.

It may not add or change:

```text
data/
src/
public/
canonical Evidence identities, relations, URLs, or archived URLs
Market Access records
deployments
statistics history
historical outcomes
archive queues
rankings, scores, recommendations, or leaderboards
automatic capture, source replacement, monitoring, or canonical promotion
```

## 8. Not approved

```text
Evidence and Archive Maintenance Batch 3 canonical changes
Tier A Dossier Deepening Batch 6
Market Access Pilot 3
Record Growth Batch 2
new public page or explorer
asset or Evidence ranking
automatic monitoring promotion
automatic canonical promotion
```

## 9. Mandatory PR traceability

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
